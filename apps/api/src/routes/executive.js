const express = require('express');
const router = express.Router();
const executiveController = require('../controllers/executiveController');
const { authenticate, authorize } = require('../middleware/auth');

// Executive Dashboard
router.get('/dashboard', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), executiveController.getExecutiveDashboard);

// Executive Alerts
router.get('/alerts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), executiveController.getExecutiveAlerts);
router.post('/alerts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), executiveController.createExecutiveAlert);
router.put('/alerts/:id/resolve', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), executiveController.resolveExecutiveAlert);

// Executive Insights
router.get('/insights', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), executiveController.getExecutiveInsights);
router.post('/insights', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), executiveController.generateExecutiveInsight);

// Summaries
router.get('/workforce-summary', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), executiveController.getWorkforceSummary);
router.get('/financial-summary', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), executiveController.getFinancialSummary);

module.exports = router;
