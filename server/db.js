const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Database error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      duration INTEGER DEFAULT 30
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'booked',
      FOREIGN KEY (service_id) REFERENCES services (id)
    )
  `);

  // Seed admin only if none exists
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.run(
    `INSERT OR IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)`,
    ["admin@dentist.com", hashedPassword, "Admin User"]
  );

  // Seed services only if table is empty
  db.get("SELECT COUNT(*) as count FROM services", (err, row) => {
    if (!err && row.count === 0) {
      db.run(`
        INSERT INTO services (name, description, price, duration) VALUES
        ('General Checkup', 'Comprehensive dental exams, cleanings, fillings, and preventive care to maintain your oral health.', 75, 30),
        ('Teeth Whitening', 'Professional whitening treatments to brighten your smile by several shades in just one visit.', 150, 45),
        ('Dental Implants', 'Permanent tooth replacement solutions that look, feel, and function like natural teeth.', 2000, 120),
        ('Orthodontics', 'Traditional braces and clear aligners to straighten teeth and correct bite issues.', 500, 45),
        ('Emergency Care', 'Same-day appointments for dental emergencies including severe pain, broken teeth, and infections.', 200, 30),
        ('Pediatric Dentistry', 'Gentle, kid-friendly dental care to establish healthy habits from an early age.', 60, 30)
      `);
    }
  });
});

module.exports = db;
