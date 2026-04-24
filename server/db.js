const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

// Promise helpers — controllers use these for async/await
db.runAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    })
  );

db.getAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row ?? null);
    })
  );

db.allAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    })
  );

db.serialize(() => {
  // WAL mode for better concurrent read performance
  db.run("PRAGMA journal_mode = WAL");
  // Enforce foreign key constraints (SQLite ignores them by default)
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    UNIQUE NOT NULL,
      password   TEXT    NOT NULL,
      name       TEXT    NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
      price       INTEGER NOT NULL CHECK(price >= 0),
      duration    INTEGER NOT NULL DEFAULT 30 CHECK(duration > 0)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT    NOT NULL,
      phone        TEXT    NOT NULL,
      service_id   INTEGER NOT NULL REFERENCES services(id),
      date         TEXT    NOT NULL,
      time         TEXT    NOT NULL,
      status       TEXT    NOT NULL DEFAULT 'booked'
                           CHECK(status IN ('booked','approved','rejected','cancelled')),
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Indexes for the most common query patterns
  db.run("CREATE INDEX IF NOT EXISTS idx_appointments_date   ON appointments(date)");
  db.run("CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)");

  // Seed admin (only once)
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.run(
    "INSERT OR IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)",
    ["admin@dentist.com", hashedPassword, "Admin User"]
  );

  // Seed services (only if table is empty)
  db.get("SELECT COUNT(*) AS count FROM services", (err, row) => {
    if (!err && row.count === 0) {
      db.run(`
        INSERT INTO services (name, description, price, duration) VALUES
        ('General Checkup',    'Comprehensive dental exams, cleanings, and preventive care.', 75,   30),
        ('Teeth Whitening',    'Professional whitening treatments in a single visit.',         150,  45),
        ('Dental Implants',    'Permanent tooth replacement that looks and feels natural.',    2000, 120),
        ('Orthodontics',       'Braces and clear aligners to straighten teeth.',               500,  45),
        ('Emergency Care',     'Same-day appointments for severe pain or broken teeth.',       200,  30),
        ('Pediatric Dentistry','Gentle, kid-friendly care to build healthy habits.',           60,   30)
      `);
    }
  });
});

module.exports = db;
