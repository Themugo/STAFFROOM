const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platformController');
const { authenticate, authorize } = require('../middleware/auth');

// Workflow Builder
router.post('/workflow/nodes', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createWorkflowNode);
router.put('/workflow/nodes/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.updateWorkflowNode);
router.delete('/workflow/nodes/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.deleteWorkflowNode);
router.get('/workflow/nodes', authenticate, platformController.getWorkflowNodes);
router.post('/workflow/connections', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createWorkflowConnection);
router.delete('/workflow/connections/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.deleteWorkflowConnection);

// Rules Engine
router.post('/rules', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createBusinessRule);
router.put('/rules/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.updateBusinessRule);
router.delete('/rules/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.deleteBusinessRule);
router.get('/rules', authenticate, platformController.getBusinessRules);
router.post('/rules/execute', authenticate, platformController.executeBusinessRule);
router.get('/rules/execution-logs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.getRuleExecutionLogs);

// Public API & Developer Portal
router.post('/oauth/clients', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createOAuthClient);
router.get('/oauth/clients', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.getOAuthClients);
router.put('/oauth/clients/:id/revoke', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.revokeOAuthClient);
router.post('/api/documentation', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createApiDocumentation);
router.get('/api/documentation', authenticate, platformController.getApiDocumentation);
router.put('/api/documentation/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.updateApiDocumentation);
router.post('/developer/accounts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.createDeveloperAccount);
router.get('/developer/accounts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.getDeveloperAccounts);
router.put('/developer/accounts/:id/revoke', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), platformController.revokeDeveloperAccount);

module.exports = router;
