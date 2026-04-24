const express = require("express");
const router = express.Router();
const { getAllServices } = require("../controllers/servicesController");
const { bookAppointment } = require("../controllers/appointmentsController");

router.get("/services", getAllServices);
router.post("/appointments", bookAppointment);

module.exports = router;
