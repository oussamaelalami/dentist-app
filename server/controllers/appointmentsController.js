const { runAsync, getAsync, allAsync } = require("../db");

const VALID_STATUSES = new Set(["approved", "rejected", "cancelled"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const getAllAppointments = async (req, res) => {
  try {
    const rows = await allAsync(
      "SELECT * FROM appointments ORDER BY date DESC, time DESC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const bookAppointment = async (req, res) => {
  const { patient_name, phone, service_id, date, time } = req.body;

  if (!patient_name || !phone || !service_id || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (typeof patient_name !== "string" || patient_name.trim().length === 0) {
    return res.status(400).json({ error: "Invalid patient name" });
  }
  if (patient_name.trim().length > 100) {
    return res.status(400).json({ error: "Patient name must be 100 characters or fewer" });
  }
  if (typeof phone !== "string" || phone.trim().length === 0) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  const sid = parseInt(service_id, 10);
  if (isNaN(sid) || sid <= 0) {
    return res.status(400).json({ error: "Invalid service" });
  }
  if (!DATE_RE.test(date)) {
    return res.status(400).json({ error: "Invalid date format — expected YYYY-MM-DD" });
  }
  if (!TIME_RE.test(time)) {
    return res.status(400).json({ error: "Invalid time format — expected HH:MM" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return res.status(400).json({ error: "Cannot book an appointment in the past" });
  }

  try {
    const service = await getAsync(
      "SELECT id, duration FROM services WHERE id = $1",
      [sid]
    );
    if (!service) return res.status(400).json({ error: "Service not found" });

    const duration = service.duration || 30;
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60_000);

    const existing = await allAsync(
      `SELECT a.date, a.time, s.duration
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.date = $1 AND a.status NOT IN ('cancelled', 'rejected')`,
      [date]
    );

    for (const apt of existing) {
      const aptStart = new Date(`${apt.date}T${apt.time}`);
      const aptEnd = new Date(aptStart.getTime() + (apt.duration || 30) * 60_000);
      if (startTime < aptEnd && endTime > aptStart) {
        return res.status(409).json({ error: "That time slot is not available" });
      }
    }

    const result = await runAsync(
      `INSERT INTO appointments (patient_name, phone, service_id, date, time, status)
       VALUES ($1, $2, $3, $4, $5, 'booked') RETURNING id`,
      [patient_name.trim(), phone.trim(), sid, date, time]
    );

    res.status(201).json({ id: result.rows[0].id, message: "Appointment booked successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid appointment ID" });

  const { status } = req.body;
  if (!status || !VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: `Status must be one of: ${[...VALID_STATUSES].join(", ")}`,
    });
  }

  try {
    const result = await runAsync(
      "UPDATE appointments SET status = $1 WHERE id = $2",
      [status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment updated" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid appointment ID" });

  try {
    const result = await runAsync("DELETE FROM appointments WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Appointment not found" });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllAppointments, bookAppointment, updateAppointment, deleteAppointment };
