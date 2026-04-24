const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET } = require("../middleware/auth");

// Computed once at startup to prevent user-enumeration timing attacks:
// both the "user found" and "user not found" paths run bcrypt.compare.
const DUMMY_HASH = bcrypt.hashSync("dummy-prevent-timing-attack", 10);

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const admin = await db.getAsync("SELECT * FROM admins WHERE email = ?", [
      email.toLowerCase().trim(),
    ]);

    // Always run bcrypt even when admin is not found to avoid timing differences
    const hash = admin?.password ?? DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, hash);

    if (!admin || !isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const admin = await db.getAsync(
      "SELECT id, email, name, created_at FROM admins WHERE id = ?",
      [req.admin.id]
    );
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login, getProfile };
