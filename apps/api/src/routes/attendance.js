const express = require('express');
const router = express.Router();
const {
  getAllAttendance,
  getAttendanceById,
  checkIn,
  checkOut,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllAttendance);
router.get('/stats', auth, getAttendanceStats);
router.get('/:id', auth, getAttendanceById);
router.post('/check-in', auth, checkIn);
router.post('/check-out', auth, checkOut);

module.exports = router;
