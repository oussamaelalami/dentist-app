const db = require('../db');

// Get all services
const getAllServices = (req, res) => {
  db.all("SELECT * FROM services", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Create a new service
const createService = (req, res) => {
  const { name, description, price, duration } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  db.run(
    "INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)",
    [name, description, price, duration],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, description, price, duration });
    }
  );
};

// Update a service
const updateService = (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;
  db.run(
    "UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?",
    [name, description, price, duration, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Service not found' });
      res.json({ message: 'Service updated' });
    }
  );
};

// Delete a service
const deleteService = (req, res) => {
  const { id } = req.params;
  db.run(
    "DELETE FROM services WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Service not found' });
      res.json({ message: 'Service deleted' });
    }
  );
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService
};