const express = require('express');
const router = express.Router();
const reconciliationController = require('../controllers/reconciliationController');
const { authenticate, authorize } = require('../middleware/auth');

// Attendance Reconciliation
router.post('/attendance-reconciliation', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), reconciliationController.createAttendanceReconciliation);
router.put('/attendance-reconciliation/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), reconciliationController.updateAttendanceReconciliation);
router.delete('/attendance-reconciliation/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), reconciliationController.deleteAttendanceReconciliation);
router.get('/attendance-reconciliation', authenticate, reconciliationController.getAttendanceReconciliations);

// Workforce Planning
router.post('/workforce-forecast', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), reconciliationController.createWorkforceForecast);
router.put('/workforce-forecast/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), reconciliationController.updateWorkforceForecast);
router.delete('/workforce-forecast/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), reconciliationController.deleteWorkforceForecast);
router.get('/workforce-forecast', authenticate, reconciliationController.getWorkforceForecasts);
router.get('/workforce-planning-summary', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), reconciliationController.getWorkforcePlanningSummary);

module.exports = router;
