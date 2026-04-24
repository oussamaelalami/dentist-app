const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err.message);
});

// Query helpers used by controllers
const runAsync = (sql, params = []) => pool.query(sql, params);

const getAsync = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows[0] ?? null;
};

const allAsync = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

// Called once at startup — throws on failure so the server never starts broken
const initialize = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id         SERIAL PRIMARY KEY,
      email      TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      name       TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       INTEGER NOT NULL CHECK(price >= 0),
      duration    INTEGER NOT NULL DEFAULT 30 CHECK(duration > 0)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id           SERIAL PRIMARY KEY,
      patient_name TEXT NOT NULL,
      phone        TEXT NOT NULL,
      service_id   INTEGER NOT NULL REFERENCES services(id),
      date         TEXT NOT NULL,
      time         TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'booked'
                   CHECK(status IN ('booked','approved','rejected','cancelled')),
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query("CREATE INDEX IF NOT EXISTS idx_appointments_date   ON appointments(date)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)");

  // Seed admin
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  await pool.query(
    "INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
    ["admin@dentist.com", hashedPassword, "Admin User"]
  );

  // Seed services — COUNT(*) returns a string in pg, so parse it
  const { rows } = await pool.query("SELECT COUNT(*) AS count FROM services");
  if (parseInt(rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO services (name, description, price, duration) VALUES
      ($1,$2,$3,$4), ($5,$6,$7,$8), ($9,$10,$11,$12),
      ($13,$14,$15,$16), ($17,$18,$19,$20), ($21,$22,$23,$24)
    `, [
      "General Checkup",    "Comprehensive dental exams, cleanings, and preventive care.", 75,   30,
      "Teeth Whitening",    "Professional whitening treatments in a single visit.",         150,  45,
      "Dental Implants",    "Permanent tooth replacement that looks and feels natural.",    2000, 120,
      "Orthodontics",       "Braces and clear aligners to straighten teeth.",               500,  45,
      "Emergency Care",     "Same-day appointments for severe pain or broken teeth.",       200,  30,
      "Pediatric Dentistry","Gentle, kid-friendly care to build healthy habits.",           60,   30,
    ]);
  }

  console.log("Database initialized");
};

module.exports = { pool, runAsync, getAsync, allAsync, initialize };
