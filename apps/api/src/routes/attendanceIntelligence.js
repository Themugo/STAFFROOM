const express = require('express');
const router = express.Router();
const attendanceIntelligenceController = require('../controllers/attendanceIntelligenceController');
const { authenticate, authorize } = require('../middleware/auth');

// Shift Schedule Routes
router.post('/shifts', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.createShiftSchedule);
router.get('/shifts', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), attendanceIntelligenceController.getShiftSchedules);
router.put('/shifts/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.updateShiftSchedule);
router.delete('/shifts/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.deleteShiftSchedule);

// Employee Shift Routes
router.post('/employee-shifts', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.assignEmployeeShift);
router.get('/employees/:employeeId/shifts', authenticate, attendanceIntelligenceController.getEmployeeShifts);
router.put('/employee-shifts/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.updateEmployeeShift);
router.delete('/employee-shifts/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.deleteEmployeeShift);

// Attendance Rule Routes
router.post('/rules', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.createAttendanceRule);
router.get('/rules', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), attendanceIntelligenceController.getAttendanceRules);
router.put('/rules/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.updateAttendanceRule);
router.delete('/rules/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.deleteAttendanceRule);

// Registered Device Routes
router.post('/devices', authenticate, attendanceIntelligenceController.registerDevice);
router.get('/devices', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), attendanceIntelligenceController.getRegisteredDevices);
router.put('/devices/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE']), attendanceIntelligenceController.updateRegisteredDevice);
router.delete('/devices/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), attendanceIntelligenceController.deleteRegisteredDevice);

// Attendance Location Routes
router.post('/locations', authenticate, attendanceIntelligenceController.recordAttendanceLocation);
router.get('/locations', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), attendanceIntelligenceController.getAttendanceLocations);
router.get('/employees/:employeeId/locations', authenticate, attendanceIntelligenceController.getEmployeeAttendanceLocations);

module.exports = router;
