const express = require('express');
const router = express.Router();
const universalWorkflowController = require('../controllers/universalWorkflowController');
const { authenticate, authorize } = require('../middleware/auth');

// Workflow Template Routes
router.post('/templates', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), universalWorkflowController.createWorkflowTemplate);
router.get('/templates', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), universalWorkflowController.getWorkflowTemplates);
router.get('/templates/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), universalWorkflowController.getWorkflowTemplateById);
router.put('/templates/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), universalWorkflowController.updateWorkflowTemplate);
router.delete('/templates/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), universalWorkflowController.deleteWorkflowTemplate);

// Workflow Step Routes
router.post('/steps', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), universalWorkflowController.addWorkflowStep);
router.put('/steps/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), universalWorkflowController.updateWorkflowStep);
router.delete('/steps/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), universalWorkflowController.deleteWorkflowStep);

// Workflow Execution Routes
router.post('/executions', authenticate, universalWorkflowController.startWorkflowExecution);
router.get('/executions', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), universalWorkflowController.getWorkflowExecutions);
router.get('/executions/:id', authenticate, universalWorkflowController.getWorkflowExecutionById);
router.post('/executions/advance', authenticate, universalWorkflowController.advanceWorkflowStep);
router.post('/executions/approve', authenticate, universalWorkflowController.approveWorkflowStep);
router.get('/executions/pending/my', authenticate, universalWorkflowController.getMyPendingApprovals);

module.exports = router;
