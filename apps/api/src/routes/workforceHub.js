const express = require('express');
const router = express.Router();
const workforceHubController = require('../controllers/workforceHubController');
const { authenticate, authorize } = require('../middleware/auth');

// Workforce Balancing
router.post('/workforce-balance/calculate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), workforceHubController.calculateWorkforceBalance);
router.get('/workforce-balance', authenticate, workforceHubController.getWorkforceBalances);

// Department Communication Hub
router.post('/department-posts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), workforceHubController.createDepartmentPost);
router.put('/department-posts/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), workforceHubController.updateDepartmentPost);
router.delete('/department-posts/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), workforceHubController.deleteDepartmentPost);
router.get('/department-posts', authenticate, workforceHubController.getDepartmentPosts);
router.post('/department-posts/:id/like', authenticate, workforceHubController.likeDepartmentPost);
router.post('/department-comments', authenticate, workforceHubController.createDepartmentComment);
router.get('/department-comments', authenticate, workforceHubController.getDepartmentComments);

// HOD Command Center
router.get('/hod-command-center', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), workforceHubController.getHODCommandCenter);

module.exports = router;
