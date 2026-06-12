const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { authenticate, authorize } = require('../middleware/auth');

// Refresh Token Routes
router.post('/refresh-tokens', authenticate, securityController.createRefreshToken);
router.post('/refresh-tokens/refresh', securityController.refreshAccessToken);
router.post('/refresh-tokens/revoke', authenticate, securityController.revokeRefreshToken);
router.post('/refresh-tokens/revoke-all', authenticate, securityController.revokeAllRefreshTokens);

// MFA Routes
router.post('/mfa/setup', authenticate, securityController.setupMFA);
router.post('/mfa/verify', authenticate, securityController.verifyMFA);
router.delete('/mfa/:mfaId', authenticate, securityController.disableMFA);
router.get('/mfa/status', authenticate, securityController.getMFAStatus);

module.exports = router;
