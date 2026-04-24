const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get("SELECT * FROM admins WHERE email = ?", [email], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });

    // Compare passwords
    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      });
    });
  });
};

// Get admin profile (protected route)
const getProfile = (req, res) => {
  db.get("SELECT id, email, name, created_at FROM admins WHERE id = ?", [req.admin.id], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  });
};

module.exports = {
  login,
  getProfile,
};
