const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// Executive Metrics Routes
router.get('/metrics', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), dashboardController.getExecutiveMetrics);
router.get('/workforce-growth', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), dashboardController.getWorkforceGrowth);
router.get('/department-distribution', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), dashboardController.getDepartmentDistribution);
router.get('/attendance-trends', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), dashboardController.getAttendanceTrends);
router.get('/cost-analysis', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), dashboardController.getCostAnalysis);

module.exports = router;
