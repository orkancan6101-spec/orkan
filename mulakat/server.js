'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createStore, BookingConflict } = require('./store');

// ---------------------------------------------------------------------------
// Ayarlar (hepsi ortam değişkeniyle değiştirilebilir)
// ---------------------------------------------------------------------------

function loadConfig(env = process.env) {
  const get = (key, fallback) => (env[key] || '').trim() || fallback;
  const config = {
    port: Number(env.PORT) || 3000,
    clubName: get('CLUB_NAME', 'Otomotiv Kulübü'),
    title: get('PAGE_TITLE', 'Otomotiv Kulübü Üye Mülakatı'),
    subtitle: get('SUBTITLE', 'Sizinle ne zaman görüşmemizi istersiniz?'),
    interviewDate: get('INTERVIEW_DATE', '2026-10-06'), // YYYY-AA-GG; mülakat günü: 6 Ekim 2026 Salı
    location: get('LOCATION', ''),
    contact: get('CONTACT', ''),
    startTime: get('START_TIME', '17:00'),
    endTime: get('END_TIME', '20:00'),
    slotMinutes: Number(get('SLOT_MINUTES', '10')),
    utcOffset: get('UTC_OFFSET', '+03:00'), // Türkiye saati
    adminPassword: env.ADMIN_PASSWORD || '',
    databaseUrl: env.DATABASE_URL || '',
    dataFile: get('DATA_FILE', path.join(__dirname, 'data', 'bookings.json')),
    // Render kendi adresini RENDER_EXTERNAL_URL olarak verir; site bu adrese düzenli
    // istek atarak ücretsiz planda uykuya geçmez. Kapatmak için KEEP_ALIVE=off.
    keepAliveUrl: get('KEEP_ALIVE', '') === 'off' ? '' : get('KEEP_ALIVE_URL', get('RENDER_EXTERNAL_URL', '')),
  };

  // Render'da dosyaya yazılanlar yeniden başlatmada silinir; veritabanı olmadan çalışmayı reddet.
  if (env.RENDER && !config.databaseUrl) {
    throw new Error('DATABASE_URL ayarlanmamış. Render → otomotiv-mulakat → Environment bölümüne Neon bağlantı adresini ekleyin.');
  }

  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!time.test(config.startTime) || !time.test(config.endTime)) {
    throw new Error('START_TIME ve END_TIME SS:DD biçiminde olmalı (örn. 17:00).');
  }
  if (config.interviewDate && !/^\d{4}-\d{2}-\d{2}$/.test(config.interviewDate)) {
    throw new Error('INTERVIEW_DATE YYYY-AA-GG biçiminde olmalı (örn. 2026-10-15).');
  }
  if (!/^[+-]\d{2}:\d{2}$/.test(config.utcOffset)) {
    throw new Error('UTC_OFFSET +SS:DD biçiminde olmalı (örn. +03:00).');
  }
  if (!Number.isInteger(config.slotMinutes) || config.slotMinutes < 5 || config.slotMinutes > 120) {
    throw new Error('SLOT_MINUTES 5 ile 120 arasında bir tam sayı olmalı.');
  }
  return config;
}

// ---------------------------------------------------------------------------
// Zaman dilimleri
// ---------------------------------------------------------------------------

const toMinutes = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const toHHMM = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function buildSlots(config) {
  const start = toMinutes(config.startTime);
  const end = toMinutes(config.endTime);
  const slots = [];
  for (let m = start; m + config.slotMinutes <= end; m += config.slotMinutes) {
    const slot = { id: toHHMM(m), start: toHHMM(m), end: toHHMM(m + config.slotMinutes) };
    if (config.interviewDate) {
      slot.startsAt = new Date(`${config.interviewDate}T${slot.start}:00${config.utcOffset}`).toISOString();
      slot.endsAt = new Date(`${config.interviewDate}T${slot.end}:00${config.utcOffset}`).toISOString();
    }
    slots.push(slot);
  }
  if (slots.length === 0) throw new Error('Bu saat aralığında hiç zaman dilimi oluşmuyor.');
  return slots;
}

// Tarih belirlenmişse, başlama saati geçmiş dilimler kapanır.
const isClosed = (slot, now) => Boolean(slot.startsAt) && Date.parse(slot.startsAt) <= now;

// ---------------------------------------------------------------------------
// Form doğrulama
// ---------------------------------------------------------------------------

const clean = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');

function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('90')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

function validateBooking(body, slotIds) {
  const errors = {};
  const fullName = clean(body.fullName);
  const email = clean(body.email).toLowerCase();
  const phone = normalizePhone(body.phone);
  const department = clean(body.department);
  const slotId = clean(body.slotId);

  if (!slotIds.has(slotId)) errors.slotId = 'Lütfen listeden bir saat seçin.';
  if (fullName.length < 3 || fullName.length > 80 || !/\p{L}/u.test(fullName)) {
    errors.fullName = 'Lütfen adınızı ve soyadınızı yazın.';
  }
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }
  if (phone.length < 10 || phone.length > 15) errors.phone = 'Geçerli bir telefon numarası girin (örn. 0532 123 45 67).';
  if (department.length > 80) errors.department = 'Bölüm / sınıf en fazla 80 karakter olabilir.';
  if (body.consent !== true) errors.consent = 'Devam etmek için onay kutusunu işaretleyin.';

  return { errors, value: { slotId, fullName, email, phone, department } };
}

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
};

class HttpError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    Object.assign(this, { status, code, extra });
  }
}

function send(res, status, body, headers = {}) {
  const isBuffer = Buffer.isBuffer(body);
  const payload = isBuffer || typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': isBuffer || typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(payload);
}

function readJson(req, limit = 10 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) tooLarge = true;
      else chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) return reject(new HttpError(413, 'too_large', 'İstek çok büyük.'));
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error();
        resolve(data);
      } catch {
        reject(new HttpError(400, 'invalid_json', 'Geçersiz istek.'));
      }
    });
    req.on('error', reject);
  });
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (forwarded ? String(forwarded).split(',')[0] : req.socket.remoteAddress || '').trim();
}

function rateLimiter(limit, windowMs) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.reset <= now) hits.delete(key);
  }, windowMs).unref();
  return (key) => {
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function csvCell(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // Excel formül enjeksiyonunu engelle
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const formatPhone = (p) => (p.length === 10 ? `0${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6, 8)} ${p.slice(8)}` : p);

// ---------------------------------------------------------------------------
// Statik dosyalar (bellekte tutulur)
// ---------------------------------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function loadStatic(dir) {
  const files = new Map();
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!fs.statSync(full).isFile()) continue;
    const body = fs.readFileSync(full);
    const etag = `"${crypto.createHash('sha1').update(body).digest('base64url')}"`;
    files.set(`/${name}`, { body, etag, type: MIME[path.extname(name)] || 'application/octet-stream' });
  }
  files.set('/', files.get('/index.html'));
  files.set('/admin', files.get('/admin.html'));
  return files;
}

// ---------------------------------------------------------------------------
// Uygulama
// ---------------------------------------------------------------------------

function createApp({ config, store }) {
  const slots = buildSlots(config);
  const slotIds = new Set(slots.map((s) => s.id));
  const staticFiles = loadStatic(path.join(__dirname, 'public'));
  const bookingLimit = rateLimiter(30, 10 * 60 * 1000);
  const adminLimit = rateLimiter(20, 15 * 60 * 1000);

  const publicConfig = {
    clubName: config.clubName,
    title: config.title,
    subtitle: config.subtitle,
    interviewDate: config.interviewDate || null,
    location: config.location || null,
    contact: config.contact || null,
    startTime: config.startTime,
    endTime: config.endTime,
    slotMinutes: config.slotMinutes,
    totalSlots: slots.length,
  };

  async function slotStatuses() {
    const booked = await store.bookedSlotIds();
    const now = Date.now();
    return slots.map((s) => ({
      ...s,
      status: booked.has(s.id) ? 'booked' : isClosed(s, now) ? 'closed' : 'available',
    }));
  }

  function requireAdmin(req) {
    if (!config.adminPassword) {
      throw new HttpError(503, 'admin_disabled', 'Yönetim paneli kapalı: ADMIN_PASSWORD ayarlanmamış.');
    }
    const header = String(req.headers.authorization || '');
    const given = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!given || !safeEqual(given, config.adminPassword)) {
      if (!adminLimit(clientIp(req))) {
        throw new HttpError(429, 'rate_limited', 'Çok fazla hatalı deneme. Lütfen biraz sonra tekrar deneyin.');
      }
      throw new HttpError(401, 'unauthorized', 'Şifre hatalı.');
    }
  }

  const publicBooking = (b) => {
    const slot = slots.find((s) => s.id === b.slotId);
    return { slotId: b.slotId, start: slot?.start, end: slot?.end, startsAt: slot?.startsAt, endsAt: slot?.endsAt, fullName: b.fullName, createdAt: b.createdAt };
  };

  const routes = {
    'GET /health': async () => ({ status: 200, body: { ok: true } }),

    'GET /api/config': async () => ({ status: 200, body: publicConfig }),

    'GET /api/slots': async () => {
      const list = await slotStatuses();
      return {
        status: 200,
        body: {
          slots: list.map(({ id, start, end, status }) => ({ id, start, end, status })),
          total: list.length,
          available: list.filter((s) => s.status === 'available').length,
          booked: list.filter((s) => s.status === 'booked').length,
        },
      };
    },

    'POST /api/bookings': async (req) => {
      if (!bookingLimit(clientIp(req))) {
        throw new HttpError(429, 'rate_limited', 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
      }
      const body = await readJson(req);
      const { errors, value } = validateBooking(body, slotIds);
      if (Object.keys(errors).length) {
        throw new HttpError(400, 'validation', 'Lütfen işaretli alanları kontrol edin.', { fields: errors });
      }
      const slot = slots.find((s) => s.id === value.slotId);
      if (isClosed(slot, Date.now())) {
        throw new HttpError(409, 'slot_closed', 'Bu saatin süresi geçti. Lütfen başka bir saat seçin.');
      }
      try {
        const booking = await store.create({ ...value, token: crypto.randomBytes(24).toString('base64url') });
        return { status: 201, body: { booking: publicBooking(booking), token: booking.token } };
      } catch (err) {
        if (err instanceof BookingConflict && err.code === 'slot_taken') {
          throw new HttpError(409, 'slot_taken', 'Bu saat az önce başka bir aday tarafından alındı. Lütfen başka bir saat seçin.');
        }
        if (err instanceof BookingConflict) {
          throw new HttpError(409, 'already_booked', 'Bu e-posta adresi veya telefon numarasıyla zaten bir randevu alınmış. Her aday yalnızca bir randevu alabilir.');
        }
        throw err;
      }
    },

    'GET /api/bookings/me': async (req) => {
      const token = String(req.headers['x-booking-token'] || '');
      const booking = token ? await store.findByToken(token) : null;
      if (!booking) throw new HttpError(404, 'not_found', 'Randevu bulunamadı.');
      return { status: 200, body: { booking: publicBooking(booking) } };
    },

    'GET /api/admin/bookings': async (req) => {
      requireAdmin(req);
      const bookings = await store.list();
      const bySlot = new Map(bookings.map((b) => [b.slotId, b]));
      const now = Date.now();
      return {
        status: 200,
        body: {
          config: publicConfig,
          storage: store.kind,
          slots: slots.map((s) => {
            const b = bySlot.get(s.id);
            return {
              id: s.id,
              start: s.start,
              end: s.end,
              status: b ? 'booked' : isClosed(s, now) ? 'closed' : 'available',
              booking: b ? { fullName: b.fullName, email: b.email, phone: formatPhone(b.phone), department: b.department, createdAt: b.createdAt } : null,
            };
          }),
        },
      };
    },

    'GET /api/admin/bookings.csv': async (req) => {
      requireAdmin(req);
      const bookings = await store.list();
      const header = ['Saat', 'Bitiş', 'Ad Soyad', 'E-posta', 'Telefon', 'Bölüm / Sınıf', 'Kayıt Zamanı'];
      const lines = bookings.map((b) => {
        const slot = slots.find((s) => s.id === b.slotId);
        const created = new Date(b.createdAt).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        return [b.slotId, slot?.end, b.fullName, b.email, formatPhone(b.phone), b.department, created].map(csvCell).join(';');
      });
      const csv = `﻿${[header.join(';'), ...lines].join('\r\n')}\r\n`;
      return {
        status: 200,
        body: Buffer.from(csv, 'utf8'),
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="mulakat-randevulari.csv"' },
      };
    },
  };

  async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    try {
      const adminDelete = pathname.match(/^\/api\/admin\/bookings\/([0-9]{2}:[0-9]{2})$/);
      if (req.method === 'DELETE' && adminDelete) {
        requireAdmin(req);
        const removed = await store.remove(adminDelete[1]);
        if (!removed) throw new HttpError(404, 'not_found', 'Bu saatte randevu yok.');
        return send(res, 200, { ok: true });
      }

      const route = routes[`${req.method} ${pathname}`];
      if (route) {
        const { status, body, headers } = await route(req);
        return send(res, status, body, headers);
      }

      if (req.method === 'GET' || req.method === 'HEAD') {
        const file = staticFiles.get(pathname);
        if (file) {
          const headers = { 'Content-Type': file.type, 'Cache-Control': 'no-cache', ETag: file.etag };
          if (req.headers['if-none-match'] === file.etag) {
            res.writeHead(304, { ...SECURITY_HEADERS, ...headers });
            return res.end();
          }
          res.writeHead(200, { ...SECURITY_HEADERS, ...headers });
          return res.end(req.method === 'HEAD' ? undefined : file.body);
        }
      }

      throw new HttpError(404, 'not_found', 'Sayfa bulunamadı.');
    } catch (err) {
      if (err instanceof HttpError) {
        return send(res, err.status, { error: err.code, message: err.message, ...err.extra });
      }
      console.error(err);
      return send(res, 500, { error: 'server_error', message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
    }
  }

  return { handle, slots };
}

// Ücretsiz Render sunucusu 15 dakika istek almazsa uyur. Kendi genel adresine
// 10 dakikada bir istek atarak sitenin 7/24 anında açılmasını sağlar.
function keepAwake(baseUrl, intervalMs = 10 * 60 * 1000) {
  const url = new URL('/health', baseUrl).toString();
  const timer = setInterval(() => {
    fetch(url, { signal: AbortSignal.timeout(30000) }).catch((err) => {
      console.warn(`Uyanık tutma isteği başarısız: ${err.message}`);
    });
  }, intervalMs);
  timer.unref();
  return timer;
}

async function start() {
  const config = loadConfig();
  const store = createStore(config);
  await store.init();
  const app = createApp({ config, store });
  const server = http.createServer(app.handle);
  server.listen(config.port, () => {
    console.log(`Mülakat randevu sistemi çalışıyor: http://localhost:${config.port}`);
    console.log(`Depolama: ${store.kind === 'postgres' ? 'PostgreSQL' : config.dataFile}`);
    if (!config.adminPassword) console.log('Uyarı: ADMIN_PASSWORD ayarlanmadığı için /admin paneli kapalı.');
    if (config.keepAliveUrl) {
      keepAwake(config.keepAliveUrl);
      console.log(`Uyanık tutma açık: ${config.keepAliveUrl} adresine 10 dakikada bir istek gönderiliyor.`);
    }
  });
  const shutdown = () => server.close(() => store.close().finally(() => process.exit(0)));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { createApp, loadConfig, buildSlots, normalizePhone, keepAwake };
