const { Pool } = require("pg");

// Use DATABASE_URL from Railway, or local PostgreSQL for development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/dentist_app",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const db = pool;

// Promise helpers — controllers use these for async/await
db.runAsync = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result;
  } catch (err) {
    throw err;
  }
};

db.getAsync = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  } catch (err) {
    throw err;
  }
};

db.allAsync = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id         SERIAL PRIMARY KEY,
        email      TEXT UNIQUE NOT NULL,
        password   TEXT NOT NULL,
        name       TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT,
        price       INTEGER NOT NULL CHECK(price >= 0),
        duration    INTEGER NOT NULL DEFAULT 30 CHECK(duration > 0)
      )
    `);

    // Create appointments table
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

    // Indexes for the most common query patterns
    await pool.query("CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)");

    // Seed admin (only once)
    const hashedPassword = require("bcrypt").hashSync("admin123", 10);
    await pool.query(
      "INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
      ["admin@dentist.com", hashedPassword, "Admin User"]
    );

    // Seed services (only if table is empty)
    const servicesCount = await pool.query("SELECT COUNT(*) AS count FROM services");
    if (servicesCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO services (name, description, price, duration) VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12),
        ($13, $14, $15, $16),
        ($17, $18, $19, $20),
        ($21, $22, $23, $24)
      `, [
        'General Checkup', 'Comprehensive dental exams, cleanings, and preventive care.', 75, 30,
        'Teeth Whitening', 'Professional whitening treatments in a single visit.', 150, 45,
        'Dental Implants', 'Permanent tooth replacement that looks and feels natural.', 2000, 120,
        'Orthodontics', 'Braces and clear aligners to straighten teeth.', 500, 45,
        'Emergency Care', 'Same-day appointments for severe pain or broken teeth.', 200, 30,
        'Pediatric Dentistry', 'Gentle, kid-friendly care to build healthy habits.', 60, 30
      ]);
    }

    console.log("Database tables initialized successfully");
  } catch (err) {
    console.error("Failed to initialize database tables:", err.message);
  }
};

// Initialize tables when module loads
initializeTables();

module.exports = db;
