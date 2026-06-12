const express = require('express');
const router = express.Router();
const lowPriorityGapsController = require('../controllers/lowPriorityGapsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Apply authentication to all routes
router.use(authenticate);

// ==================== EMPLOYEE RELATIONS ====================

// Employee Award Routes
router.post('/employee-awards', authorize(['admin', 'hr_manager']), lowPriorityGapsController.createEmployeeAward);
router.get('/employee-awards', lowPriorityGapsController.getEmployeeAwards);
router.put('/employee-awards/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updateEmployeeAward);

// Employee Engagement Routes
router.post('/employee-engagements', authorize(['admin', 'hr_manager']), lowPriorityGapsController.createEmployeeEngagement);
router.get('/employee-engagements', lowPriorityGapsController.getEmployeeEngagements);
router.put('/employee-engagements/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updateEmployeeEngagement);

// Employee Sentiment Routes
router.post('/employee-sentiments', lowPriorityGapsController.createEmployeeSentiment);
router.get('/employee-sentiments', lowPriorityGapsController.getEmployeeSentiments);
router.put('/employee-sentiments/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updateEmployeeSentiment);

// ==================== WORKFORCE COMMUNICATION ====================

// Policy Acknowledgement Routes
router.post('/policy-acknowledgements', lowPriorityGapsController.createPolicyAcknowledgement);
router.get('/policy-acknowledgements', lowPriorityGapsController.getPolicyAcknowledgements);
router.put('/policy-acknowledgements/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updatePolicyAcknowledgement);

// Communication Template Routes
router.post('/communication-templates', authorize(['admin', 'hr_manager']), lowPriorityGapsController.createCommunicationTemplate);
router.get('/communication-templates', lowPriorityGapsController.getCommunicationTemplates);
router.put('/communication-templates/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updateCommunicationTemplate);

// ==================== WORKFORCE GOVERNANCE ====================

// Policy Governance Routes
router.post('/policy-governances', authorize(['admin', 'hr_manager']), lowPriorityGapsController.createPolicyGovernance);
router.get('/policy-governances', lowPriorityGapsController.getPolicyGovernances);
router.put('/policy-governances/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updatePolicyGovernance);

// SoD Conflict Routes
router.post('/sod-conflicts', authorize(['admin', 'hr_manager']), lowPriorityGapsController.createSoDConflict);
router.get('/sod-conflicts', lowPriorityGapsController.getSoDConflicts);
router.put('/sod-conflicts/:id', authorize(['admin', 'hr_manager']), lowPriorityGapsController.updateSoDConflict);

module.exports = router;
