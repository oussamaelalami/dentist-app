const { runAsync, getAsync, allAsync } = require("../db");

const getAllServices = async (req, res) => {
  try {
    const rows = await allAsync("SELECT * FROM services ORDER BY name ASC");
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createService = async (req, res) => {
  const { name, description, price, duration } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (name.trim().length > 100) {
    return res.status(400).json({ error: "Name must be 100 characters or fewer" });
  }

  const priceNum = Number(price);
  if (price === undefined || price === null || isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Price must be a non-negative number" });
  }

  const durationNum = duration ? parseInt(duration, 10) : 30;
  if (isNaN(durationNum) || durationNum <= 0) {
    return res.status(400).json({ error: "Duration must be a positive integer (minutes)" });
  }

  const desc = description ? String(description).trim().slice(0, 500) : null;

  try {
    const result = await runAsync(
      "INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) RETURNING *",
      [name.trim(), desc, priceNum, durationNum]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateService = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid service ID" });

  const { name, description, price, duration } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  const priceNum = Number(price);
  if (price === undefined || price === null || isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Price must be a non-negative number" });
  }

  const durationNum = duration ? parseInt(duration, 10) : 30;
  if (isNaN(durationNum) || durationNum <= 0) {
    return res.status(400).json({ error: "Duration must be a positive integer (minutes)" });
  }

  const desc = description ? String(description).trim().slice(0, 500) : null;

  try {
    const result = await runAsync(
      "UPDATE services SET name = $1, description = $2, price = $3, duration = $4 WHERE id = $5 RETURNING *",
      [name.trim(), desc, priceNum, durationNum, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Service not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteService = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid service ID" });

  try {
    const result = await runAsync("DELETE FROM services WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Service not found" });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
