'use strict';

// Randevu kayıtlarının tutulduğu katman.
// - DATABASE_URL tanımlıysa PostgreSQL kullanılır (bulut / production).
// - Tanımlı değilse yerel bir JSON dosyası kullanılır (bilgisayarda deneme için).
// Her saatte en fazla `capacity` kadar yer (seat) vardır; bir yer iki kişiye verilemez
// ve aynı kişi ikinci randevu alamaz.

const fs = require('node:fs');
const path = require('node:path');

class BookingConflict extends Error {
  constructor(code) {
    super(code);
    this.code = code; // 'slot_taken' (saat dolu) | 'already_booked' (kişinin zaten randevusu var)
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS bookings (
  slot_id     TEXT NOT NULL,
  seat        INTEGER NOT NULL DEFAULT 1,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  department  TEXT NOT NULL DEFAULT '',
  token       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (slot_id, seat)
);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_email_key ON bookings (email);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_phone_key ON bookings (phone);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_token_key ON bookings (token);
`;

// İlk sürümde her saatte tek kişi vardı (anahtar yalnızca slot_id). Mevcut
// veritabanını, kayıtları koruyarak saat başına birden çok kişiye uygun hale getirir.
const MIGRATION = `
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS seat INTEGER NOT NULL DEFAULT 1;
DO $$
BEGIN
  IF (SELECT count(*) FROM information_schema.key_column_usage
      WHERE table_schema = current_schema() AND table_name = 'bookings'
        AND constraint_name = 'bookings_pkey') = 1 THEN
    ALTER TABLE bookings DROP CONSTRAINT bookings_pkey;
    ALTER TABLE bookings ADD CONSTRAINT bookings_pkey PRIMARY KEY (slot_id, seat);
  END IF;
END $$;
`;

const COLUMNS = 'slot_id, seat, full_name, email, phone, department, token, created_at';

function fromRow(row) {
  return {
    slotId: row.slot_id,
    seat: row.seat,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    token: row.token,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

const bySlotAndSeat = (a, b) => a.slotId.localeCompare(b.slotId) || a.seat - b.seat;

function createPgStore(connectionString) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString, max: 5 });
  pool.on('error', (err) => console.error('PostgreSQL bağlantı hatası:', err.message));

  return {
    kind: 'postgres',

    async init() {
      for (let attempt = 1; ; attempt++) {
        try {
          await pool.query(SCHEMA);
          await pool.query(MIGRATION);
          return;
        } catch (err) {
          if (attempt >= 10) throw err;
          console.warn(`Veritabanına bağlanılamadı (deneme ${attempt}): ${err.message}`);
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
    },

    async bookedCounts() {
      const { rows } = await pool.query('SELECT slot_id, count(*)::int AS n FROM bookings GROUP BY slot_id');
      return new Map(rows.map((r) => [r.slot_id, r.n]));
    },

    async list() {
      const { rows } = await pool.query(`SELECT ${COLUMNS} FROM bookings ORDER BY slot_id, seat`);
      return rows.map(fromRow);
    },

    // Yerleri sırayla dener; (slot_id, seat) birincil anahtarı sayesinde aynı anda
    // gelen isteklerde bile bir yer yalnızca bir kişiye verilir.
    async create(b, capacity) {
      for (let seat = 1; seat <= capacity; seat++) {
        try {
          const { rows } = await pool.query(
            `INSERT INTO bookings (slot_id, seat, full_name, email, phone, department, token)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING ${COLUMNS}`,
            [b.slotId, seat, b.fullName, b.email, b.phone, b.department, b.token],
          );
          return fromRow(rows[0]);
        } catch (err) {
          if (err.code !== '23505') throw err;
          if (err.constraint !== 'bookings_pkey') throw new BookingConflict('already_booked');
          // bu yer dolu, sıradakini dene
        }
      }
      throw new BookingConflict('slot_taken');
    },

    async findByToken(token) {
      const { rows } = await pool.query(`SELECT ${COLUMNS} FROM bookings WHERE token = $1`, [token]);
      return rows[0] ? fromRow(rows[0]) : null;
    },

    async remove(slotId, seat) {
      const { rowCount } = await pool.query('DELETE FROM bookings WHERE slot_id = $1 AND seat = $2', [slotId, seat]);
      return rowCount > 0;
    },

    close: () => pool.end(),
  };
}

// Node.js tek iş parçacıklı çalıştığı için create() içindeki kontrol + ekleme
// arasında başka bir istek araya giremez; böylece çift rezervasyon oluşmaz.
function createFileStore(file) {
  let rows = [];

  function persist() {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
    fs.renameSync(tmp, file);
  }

  return {
    kind: 'file',

    async init() {
      if (fs.existsSync(file)) rows = JSON.parse(fs.readFileSync(file, 'utf8')).map((r) => ({ seat: 1, ...r }));
    },

    async bookedCounts() {
      const counts = new Map();
      for (const r of rows) counts.set(r.slotId, (counts.get(r.slotId) || 0) + 1);
      return counts;
    },

    async list() {
      return [...rows].sort(bySlotAndSeat);
    },

    async create(b, capacity) {
      if (rows.some((r) => r.email === b.email || r.phone === b.phone)) throw new BookingConflict('already_booked');
      const taken = new Set(rows.filter((r) => r.slotId === b.slotId).map((r) => r.seat));
      let seat = 1;
      while (taken.has(seat)) seat++;
      if (seat > capacity) throw new BookingConflict('slot_taken');
      const row = { ...b, seat, createdAt: new Date().toISOString() };
      rows.push(row);
      persist();
      return row;
    },

    async findByToken(token) {
      return rows.find((r) => r.token === token) || null;
    },

    async remove(slotId, seat) {
      const before = rows.length;
      rows = rows.filter((r) => !(r.slotId === slotId && r.seat === seat));
      if (rows.length === before) return false;
      persist();
      return true;
    },

    close: async () => {},
  };
}

function createStore({ databaseUrl, dataFile }) {
  return databaseUrl ? createPgStore(databaseUrl) : createFileStore(dataFile);
}

module.exports = { createStore, BookingConflict };
