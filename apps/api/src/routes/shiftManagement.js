const express = require('express');
const router = express.Router();
const shiftManagementController = require('../controllers/shiftManagementController');
const { authenticate, authorize } = require('../middleware/auth');

// Shift Templates
router.post('/templates', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.createShiftTemplate);
router.put('/templates/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.updateShiftTemplate);
router.delete('/templates/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), shiftManagementController.deleteShiftTemplate);
router.get('/templates', authenticate, shiftManagementController.getShiftTemplates);

// Shift Assignments
router.post('/assignments', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.assignShift);
router.put('/assignments/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.updateShiftAssignment);
router.delete('/assignments/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), shiftManagementController.removeShiftAssignment);
router.get('/assignments', authenticate, shiftManagementController.getShiftAssignments);

// Shift Rotations
router.post('/rotations', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.createShiftRotation);
router.put('/rotations/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.updateShiftRotation);
router.delete('/rotations/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), shiftManagementController.deleteShiftRotation);
router.get('/rotations', authenticate, shiftManagementController.getShiftRotations);

// Shift Schedules
router.post('/schedules/generate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), shiftManagementController.generateShiftSchedule);
router.put('/schedules/:id', authenticate, shiftManagementController.updateShiftSchedule);
router.delete('/schedules/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), shiftManagementController.deleteShiftSchedule);
router.get('/schedules', authenticate, shiftManagementController.getShiftSchedules);

// Department Configuration
router.get('/department/configuration', authenticate, shiftManagementController.getDepartmentShiftConfiguration);

module.exports = router;
