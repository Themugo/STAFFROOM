const express = require('express');
const router = express.Router();
const {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
  executeWorkflow,
  approveWorkflowStep
} = require('../controllers/workflowController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAllWorkflows);
router.get('/:id', auth, getWorkflowById);
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createWorkflow);
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updateWorkflow);
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), deleteWorkflow);

// Workflow steps
router.post('/:workflowId/steps', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createWorkflowStep);
router.put('/steps/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updateWorkflowStep);
router.delete('/steps/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), deleteWorkflowStep);

// Workflow execution
router.post('/:workflowId/execute', auth, executeWorkflow);
router.put('/executions/:executionId/steps/:stepId/approve', auth, approveWorkflowStep);

module.exports = router;
