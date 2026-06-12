const express = require('express');
const router = express.Router();
const integrationsController = require('../controllers/integrationsController');
const { authenticate, authorize } = require('../middleware/auth');

// Enterprise Integrations
router.post('/integrations', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.createIntegration);
router.get('/integrations', authenticate, integrationsController.getIntegrations);
router.put('/integrations/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.updateIntegration);
router.post('/integrations/:id/test', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.testIntegration);

// Webhooks
router.post('/webhooks', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.createWebhook);
router.get('/webhooks', authenticate, integrationsController.getWebhooks);
router.post('/webhooks/:id/trigger', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.triggerWebhook);

// Regional Compliance
router.post('/compliance-rules', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.createComplianceRule);
router.get('/compliance-rules', authenticate, integrationsController.getComplianceRules);
router.post('/company-compliance', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), integrationsController.enableCompanyCompliance);
router.get('/company-compliance', authenticate, integrationsController.getCompanyCompliance);

// Marketplace
router.get('/marketplace', authenticate, integrationsController.getMarketplaceSummary);

module.exports = router;
