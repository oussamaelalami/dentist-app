const db = require('../db');

// Get all appointments
const getAllAppointments = (req, res) => {
  db.all("SELECT * FROM appointments", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Book an appointment
const bookAppointment = (req, res) => {
  const { patient_name, phone, service_id, date, time } = req.body;
  if (!patient_name || !phone || !service_id || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // First, get the service duration
  db.get("SELECT duration FROM services WHERE id = ?", [service_id], (err, service) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!service) return res.status(400).json({ error: 'Service not found' });

    const duration = service.duration || 30; // default 30 min if not set

    // Calculate start and end times
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Check for overlapping appointments
    db.all("SELECT date, time, duration FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.date = ? AND a.status != 'cancelled'", [date], (err, appointments) => {
      if (err) return res.status(500).json({ error: err.message });

      for (const apt of appointments) {
        const aptStart = new Date(`${apt.date}T${apt.time}`);
        const aptEnd = new Date(aptStart.getTime() + (apt.duration || 30) * 60000);

        if (startTime < aptEnd && endTime > aptStart) {
          return res.status(400).json({ error: 'Time slot overlaps with existing appointment' });
        }
      }

      // No overlap, book the appointment
      db.run(
        "INSERT INTO appointments (patient_name, phone, service_id, date, time, status) VALUES (?, ?, ?, ?, ?, 'booked')",
        [patient_name, phone, service_id, date, time],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ id: this.lastID, message: 'Appointment booked successfully' });
        }
      );
    });
  });
};

// Update appointment status
const updateAppointment = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.run(
    "UPDATE appointments SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
      res.json({ message: 'Appointment updated' });
    }
  );
};

// Delete an appointment
const deleteAppointment = (req, res) => {
  const { id } = req.params;
  db.run(
    "DELETE FROM appointments WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
      res.json({ message: 'Appointment deleted' });
    }
  );
};

module.exports = {
  getAllAppointments,
  bookAppointment,
  updateAppointment,
  deleteAppointment
};