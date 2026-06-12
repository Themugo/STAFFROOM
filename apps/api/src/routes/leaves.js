const express = require('express');
const router = express.Router();
const {
  getAllLeaves,
  getLeaveById,
  createLeave,
  approveLeave,
  rejectLeave,
  getLeaveStats
} = require('../controllers/leaveController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllLeaves);
router.get('/stats', auth, getLeaveStats);
router.get('/:id', auth, getLeaveById);
router.post('/', auth, validate(schemas.leave), createLeave);
router.put('/:id/approve', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER'), approveLeave);
router.put('/:id/reject', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER'), rejectLeave);

module.exports = router;
