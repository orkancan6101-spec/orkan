'use strict';

// Çalıştırma:  npm test
// PostgreSQL ile de denemek için:  TEST_DATABASE_URL=postgres://... npm test

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp, loadConfig, keepAwake } = require('../server');
const { createStore } = require('../store');

async function startServer(envOverrides) {
  // Testler gerçek mülakat gününden bağımsız olsun diye ileri bir tarih kullanılır.
  const config = loadConfig({ ADMIN_PASSWORD: 'gizli-sifre', INTERVIEW_DATE: '2099-10-15', ...envOverrides });
  const store = createStore(config);
  await store.init();
  const app = createApp({ config, store });
  const server = http.createServer(app.handle);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  const call = async (method, url, body, headers = {}) => {
    const res = await fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* metin yanıt */ }
    return { status: res.status, json, text, headers: res.headers };
  };

  return { call, store, close: () => new Promise((r) => server.close(r)).then(() => store.close()) };
}

const person = (n, extra = {}) => ({
  fullName: `Aday ${n} Test`,
  email: `aday${n}@ornek.com`,
  phone: `0532${String(1000000 + n).slice(-7)}`,
  department: 'Makine Müh. 2. sınıf',
  consent: true,
  ...extra,
});

function suite(name, makeEnv, reset) {
  describe(name, () => {
    let srv;
    before(async () => {
      await reset();
      srv = await startServer(makeEnv());
    });
    after(() => srv.close());

    test('17:00–19:00 arası 10 dakikalık 12 saat, her görüşmede 3 kişi: toplam 36 kişi', async () => {
      const { status, json } = await srv.call('GET', '/api/slots');
      assert.equal(status, 200);
      assert.equal(json.slots.length, 12);
      assert.equal(json.capacity, 3);
      assert.equal(json.total, 36);
      assert.equal(json.available, 36);
      assert.equal(json.slots[0].id, '17:00');
      assert.equal(json.slots[11].id, '18:50');
      assert.equal(json.slots[11].end, '19:00');
      assert.ok(json.slots.every((s) => s.status === 'available' && s.remaining === 3));
    });

    test('randevu alınır, saatte 2 yer kalır ve aday kendi randevusunu görür', async () => {
      const res = await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(1) });
      assert.equal(res.status, 201);
      assert.ok(res.json.token);
      assert.equal(res.json.booking.start, '17:00');

      const slots = await srv.call('GET', '/api/slots');
      assert.equal(slots.json.slots[0].status, 'available');
      assert.equal(slots.json.slots[0].remaining, 2);
      assert.equal(slots.json.available, 35);
      assert.ok(!slots.text.includes('aday1@ornek.com'), 'herkese açık listede kişisel bilgi olmamalı');

      const me = await srv.call('GET', '/api/bookings/me', undefined, { 'X-Booking-Token': res.json.token });
      assert.equal(me.status, 200);
      assert.equal(me.json.booking.slotId, '17:00');
    });

    test('aynı saate ikinci ve üçüncü kişi alınır, dördüncü kişi alınmaz', async () => {
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(2) })).status, 201);
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(3) })).status, 201);
      const fourth = await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(4) });
      assert.equal(fourth.status, 409);
      assert.equal(fourth.json.error, 'slot_taken');

      const slots = await srv.call('GET', '/api/slots');
      assert.equal(slots.json.slots[0].status, 'booked');
      assert.equal(slots.json.slots[0].remaining, 0);
      assert.equal(slots.json.booked, 3);
    });

    test('aynı e-posta veya telefon ikinci randevu alamaz', async () => {
      const sameEmail = await srv.call('POST', '/api/bookings', { slotId: '17:10', ...person(5, { email: 'ADAY1@ornek.com ' }) });
      assert.equal(sameEmail.status, 409);
      assert.equal(sameEmail.json.error, 'already_booked');

      const samePhone = await srv.call('POST', '/api/bookings', { slotId: '17:10', ...person(6, { phone: '+90 532 100 00 01' }) });
      assert.equal(samePhone.status, 409);
      assert.equal(samePhone.json.error, 'already_booked');
    });

    test('aynı anda 40 kişi aynı saati seçerse yalnızca 3 kişi alır', async () => {
      const results = await Promise.all(
        Array.from({ length: 40 }, (_, i) => srv.call('POST', '/api/bookings', { slotId: '18:00', ...person(100 + i) })),
      );
      assert.equal(results.filter((r) => r.status === 201).length, 3);
      assert.ok(results.filter((r) => r.status !== 201).every((r) => r.json.error === 'slot_taken'));
    });

    test('aynı kişi aynı anda birden çok saat deneyemez', async () => {
      const ids = ['17:30', '17:40', '17:50', '18:10', '18:20', '18:30'];
      const results = await Promise.all(ids.map((slotId) => srv.call('POST', '/api/bookings', { slotId, ...person(500) })));
      assert.equal(results.filter((r) => r.status === 201).length, 1);
    });

    test('eksik veya hatalı bilgiler reddedilir', async () => {
      const res = await srv.call('POST', '/api/bookings', { slotId: '25:00', fullName: 'A', email: 'x', phone: '12', consent: false });
      assert.equal(res.status, 400);
      assert.deepEqual(Object.keys(res.json.fields).sort(), ['consent', 'email', 'fullName', 'phone', 'slotId']);
    });

    test('yönetim paneli şifre ister; listeler, iptal eder, CSV verir', async () => {
      assert.equal((await srv.call('GET', '/api/admin/bookings')).status, 401);
      assert.equal((await srv.call('GET', '/api/admin/bookings', undefined, { Authorization: 'Bearer yanlis' })).status, 401);

      const auth = { Authorization: 'Bearer gizli-sifre' };
      const list = await srv.call('GET', '/api/admin/bookings', undefined, auth);
      assert.equal(list.status, 200);
      const first = list.json.slots.find((s) => s.id === '17:00');
      assert.equal(first.status, 'booked');
      assert.deepEqual(first.bookings.map((b) => b.seat), [1, 2, 3]);
      assert.equal(first.bookings[0].email, 'aday1@ornek.com');
      assert.equal(first.bookings[0].phone, '0532 100 00 01');

      const csv = await srv.call('GET', '/api/admin/bookings.csv', undefined, auth);
      assert.equal(csv.status, 200);
      assert.match(csv.text, /Ad Soyad/);
      assert.match(csv.text, /aday1@ornek\.com/);

      // Yönetim paneli saati tarayıcıdaki gibi kodlanmış gönderir (17:00 → 17%3A00)
      const del = await srv.call('DELETE', `/api/admin/bookings/${encodeURIComponent('17:00')}/1`, undefined, auth);
      assert.equal(del.status, 200);
      assert.equal((await srv.call('DELETE', '/api/admin/bookings/17:00/1', undefined, auth)).status, 404, 'zaten iptal edildi');
      let slots = await srv.call('GET', '/api/slots');
      assert.equal(slots.json.slots[0].status, 'available');
      assert.equal(slots.json.slots[0].remaining, 1);

      // Boşalan yer yeni bir adaya verilir; diğer kişilerin randevusu yerinde kalır
      const newcomer = await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(700) });
      assert.equal(newcomer.status, 201);
      slots = await srv.call('GET', '/api/slots');
      assert.equal(slots.json.slots[0].status, 'booked');
      const after = await srv.call('GET', '/api/admin/bookings', undefined, auth);
      assert.deepEqual(after.json.slots[0].bookings.map((b) => b.email), ['aday700@ornek.com', 'aday2@ornek.com', 'aday3@ornek.com']);

      // İptal edilen aday yeniden randevu alabilir
      const again = await srv.call('POST', '/api/bookings', { slotId: '17:20', ...person(1) });
      assert.equal(again.status, 201);
    });
  });
}

// Yerel JSON dosyası ile
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mulakat-test-'));
const dataFile = path.join(tmpDir, 'bookings.json');
suite('JSON dosya deposu', () => ({ DATA_FILE: dataFile }), async () => fs.rmSync(dataFile, { force: true }));

// PostgreSQL ile (TEST_DATABASE_URL verilmişse)
if (process.env.TEST_DATABASE_URL) {
  suite(
    'PostgreSQL deposu',
    () => ({ DATABASE_URL: process.env.TEST_DATABASE_URL }),
    async () => {
      const { Client } = require('pg');
      const client = new Client({ connectionString: process.env.TEST_DATABASE_URL });
      await client.connect();
      await client.query('DROP TABLE IF EXISTS bookings');
      await client.end();
    },
  );

  test('eski veritabanı (saat başına 1 kişi) kayıtlar korunarak 3 kişiye geçirilir', async () => {
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.TEST_DATABASE_URL });
    await client.connect();
    await client.query('DROP TABLE IF EXISTS bookings');
    await client.query(`CREATE TABLE bookings (
      slot_id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
      department TEXT NOT NULL DEFAULT '', token TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
    await client.query(`INSERT INTO bookings (slot_id, full_name, email, phone, token)
      VALUES ('17:00', 'Eski Aday', 'eski@ornek.com', '5321234567', 'eski-token')`);
    await client.end();

    const srv = await startServer({ DATABASE_URL: process.env.TEST_DATABASE_URL });
    try {
      const slots = await srv.call('GET', '/api/slots');
      assert.equal(slots.json.slots[0].remaining, 2, 'eski randevu korunmalı');
      const me = await srv.call('GET', '/api/bookings/me', undefined, { 'X-Booking-Token': 'eski-token' });
      assert.equal(me.json.booking.fullName, 'Eski Aday');
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(1) })).status, 201);
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(2) })).status, 201);
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(3) })).status, 409);
    } finally {
      await srv.close();
    }
  });
}

describe('kontenjan ayarı', () => {
  test('SLOT_CAPACITY=1 ile her saate tek kişi alınır', async () => {
    const srv = await startServer({ DATA_FILE: path.join(tmpDir, 'cap1.json'), SLOT_CAPACITY: '1' });
    try {
      assert.equal((await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(1) })).status, 201);
      const second = await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(2) });
      assert.equal(second.status, 409);
      assert.equal((await srv.call('GET', '/api/slots')).json.total, 12);
    } finally {
      await srv.close();
    }
  });
});

describe('tarih ayarı', () => {
  test('geçmiş tarihteki saatler kapanır ve seçilemez', async () => {
    const srv = await startServer({ DATA_FILE: path.join(tmpDir, 'past.json'), INTERVIEW_DATE: '2020-01-01' });
    try {
      const slots = await srv.call('GET', '/api/slots');
      assert.ok(slots.json.slots.every((s) => s.status === 'closed'));
      const res = await srv.call('POST', '/api/bookings', { slotId: '17:00', ...person(1) });
      assert.equal(res.status, 409);
      assert.equal(res.json.error, 'slot_closed');
    } finally {
      await srv.close();
    }
  });

  test('gelecek tarihte saatler açıktır ve takvim bilgisi döner', async () => {
    const srv = await startServer({ DATA_FILE: path.join(tmpDir, 'future.json'), INTERVIEW_DATE: '2099-10-15' });
    try {
      const res = await srv.call('POST', '/api/bookings', { slotId: '17:30', ...person(9) });
      assert.equal(res.status, 201);
      assert.equal(res.json.booking.startsAt, '2099-10-15T14:30:00.000Z'); // 17:30 Türkiye saati = 14:30 UTC
    } finally {
      await srv.close();
    }
  });
});

test('sayfalar ve güvenlik başlıkları sunulur', async () => {
  const srv = await startServer({ DATA_FILE: path.join(tmpDir, 'pages.json') });
  try {
    const home = await srv.call('GET', '/');
    assert.equal(home.status, 200);
    assert.match(home.text, /Otomotiv Kulübü Üye Mülakatı/);
    assert.ok(home.headers.get('content-security-policy'));
    assert.equal((await srv.call('GET', '/admin')).status, 200);
    assert.equal((await srv.call('GET', '/app.js')).status, 200);
    assert.equal((await srv.call('GET', '/../server.js')).status, 404);
    assert.equal((await srv.call('GET', '/health')).status, 200);
  } finally {
    await srv.close();
  }
});

describe('7/24 açık tutma', () => {
  test('Render adresi varsa uyanık tutma otomatik açılır, KEEP_ALIVE=off ile kapanır', () => {
    assert.equal(loadConfig({ RENDER_EXTERNAL_URL: 'https://site.onrender.com' }).keepAliveUrl, 'https://site.onrender.com');
    assert.equal(loadConfig({ RENDER_EXTERNAL_URL: 'https://site.onrender.com', KEEP_ALIVE: 'off' }).keepAliveUrl, '');
    assert.equal(loadConfig({}).keepAliveUrl, '');
  });

  test('sitenin kendi /health adresine düzenli istek atar', async () => {
    let hits = 0;
    const server = http.createServer((req, res) => {
      if (req.url === '/health') hits += 1;
      res.end('ok');
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const timer = keepAwake(`http://127.0.0.1:${server.address().port}`, 40);
    await new Promise((r) => setTimeout(r, 200));
    clearInterval(timer);
    await new Promise((r) => server.close(r));
    assert.ok(hits >= 2, `en az 2 istek beklendi, ${hits} geldi`);
  });
});
