'use strict';

// Randevu kayıtlarının tutulduğu katman.
// - DATABASE_URL tanımlıysa PostgreSQL kullanılır (bulut / production).
// - Tanımlı değilse yerel bir JSON dosyası kullanılır (bilgisayarda deneme için).
// İki durumda da aynı saat iki kişiye verilemez ve aynı kişi ikinci randevu alamaz.

const fs = require('node:fs');
const path = require('node:path');

class BookingConflict extends Error {
  constructor(code) {
    super(code);
    this.code = code; // 'slot_taken' | 'already_booked'
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS bookings (
  slot_id     TEXT PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  department  TEXT NOT NULL DEFAULT '',
  token       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_email_key ON bookings (email);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_phone_key ON bookings (phone);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_token_key ON bookings (token);
`;

const COLUMNS = 'slot_id, full_name, email, phone, department, token, created_at';

function fromRow(row) {
  return {
    slotId: row.slot_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    token: row.token,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

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
          return;
        } catch (err) {
          if (attempt >= 10) throw err;
          console.warn(`Veritabanına bağlanılamadı (deneme ${attempt}): ${err.message}`);
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
    },

    async bookedSlotIds() {
      const { rows } = await pool.query('SELECT slot_id FROM bookings');
      return new Set(rows.map((r) => r.slot_id));
    },

    async list() {
      const { rows } = await pool.query(`SELECT ${COLUMNS} FROM bookings ORDER BY slot_id`);
      return rows.map(fromRow);
    },

    async create(b) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO bookings (slot_id, full_name, email, phone, department, token)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING ${COLUMNS}`,
          [b.slotId, b.fullName, b.email, b.phone, b.department, b.token],
        );
        return fromRow(rows[0]);
      } catch (err) {
        if (err.code === '23505') {
          throw new BookingConflict(err.constraint === 'bookings_pkey' ? 'slot_taken' : 'already_booked');
        }
        throw err;
      }
    },

    async findByToken(token) {
      const { rows } = await pool.query(`SELECT ${COLUMNS} FROM bookings WHERE token = $1`, [token]);
      return rows[0] ? fromRow(rows[0]) : null;
    },

    async remove(slotId) {
      const { rowCount } = await pool.query('DELETE FROM bookings WHERE slot_id = $1', [slotId]);
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
      if (fs.existsSync(file)) rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    },

    async bookedSlotIds() {
      return new Set(rows.map((r) => r.slotId));
    },

    async list() {
      return [...rows].sort((a, b) => a.slotId.localeCompare(b.slotId));
    },

    async create(b) {
      if (rows.some((r) => r.slotId === b.slotId)) throw new BookingConflict('slot_taken');
      if (rows.some((r) => r.email === b.email || r.phone === b.phone)) throw new BookingConflict('already_booked');
      const row = { ...b, createdAt: new Date().toISOString() };
      rows.push(row);
      persist();
      return row;
    },

    async findByToken(token) {
      return rows.find((r) => r.token === token) || null;
    },

    async remove(slotId) {
      const before = rows.length;
      rows = rows.filter((r) => r.slotId !== slotId);
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
