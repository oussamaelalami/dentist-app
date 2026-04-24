const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  bookAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentsController');

router.get('/', getAllAppointments);
router.post('/', bookAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;