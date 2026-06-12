const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterpriseController');
const { authenticate, authorize } = require('../middleware/auth');

// Enterprise SaaS Architecture
router.post('/white-label', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.updateWhiteLabelConfig);
router.get('/white-label', authenticate, enterpriseController.getWhiteLabelConfig);

router.post('/sso', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.updateSSOConfig);
router.get('/sso', authenticate, enterpriseController.getSSOConfig);

router.post('/scim', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.updateSCIMConfig);
router.get('/scim', authenticate, enterpriseController.getSCIMConfig);

router.post('/api-keys', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.createApiKey);
router.get('/api-keys', authenticate, enterpriseController.getApiKeys);
router.put('/api-keys/:id/revoke', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.revokeApiKey);

router.get('/currencies', authenticate, enterpriseController.getCurrencies);

// StaffRoom Ecosystem
router.post('/plugins', authenticate, enterpriseController.createPlugin);
router.get('/plugins', authenticate, enterpriseController.getPlugins);
router.post('/plugins/install', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), enterpriseController.installPlugin);
router.get('/plugins/installations', authenticate, enterpriseController.getPluginInstallations);
router.post('/plugins/reviews', authenticate, enterpriseController.createPluginReview);
router.get('/plugins/reviews', authenticate, enterpriseController.getPluginReviews);

// Enterprise Dashboard
router.get('/summary', authenticate, enterpriseController.getEnterpriseSummary);

module.exports = router;
