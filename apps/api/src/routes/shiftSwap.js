const express = require('express');
const router = express.Router();
const shiftSwapController = require('../controllers/shiftSwapController');
const { authenticate, authorize } = require('../middleware/auth');

// Shift Swap Management
router.post('/shift-swap', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), shiftSwapController.createShiftSwapRequest);
router.put('/shift-swap/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), shiftSwapController.updateShiftSwapRequest);
router.delete('/shift-swap/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftSwapController.deleteShiftSwapRequest);
router.get('/shift-swap', authenticate, shiftSwapController.getShiftSwapRequests);

// Coverage Planning
router.post('/coverage-warning', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), shiftSwapController.createCoverageWarning);
router.put('/coverage-warning/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), shiftSwapController.updateCoverageWarning);
router.delete('/coverage-warning/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftSwapController.deleteCoverageWarning);
router.get('/coverage-warning', authenticate, shiftSwapController.getCoverageWarnings);

// Workforce Calendar
router.post('/calendar-event', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), shiftSwapController.createCalendarEvent);
router.put('/calendar-event/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), shiftSwapController.updateCalendarEvent);
router.delete('/calendar-event/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftSwapController.deleteCalendarEvent);
router.get('/calendar-event', authenticate, shiftSwapController.getCalendarEvents);

module.exports = router;
