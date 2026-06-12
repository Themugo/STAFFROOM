const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticate, authorize } = require('../middleware/auth');

// Asset Management
router.post('/assets', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.createAsset);
router.get('/assets', authenticate, assetController.getAssets);
router.put('/assets/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.updateAsset);

// Asset Assignment
router.post('/assets/assign', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.assignAsset);
router.get('/assets/assignments', authenticate, assetController.getAssignments);
router.put('/assets/assignments/:id/return', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.returnAsset);

// Asset Audit
router.post('/assets/audits', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.createAudit);
router.get('/assets/audits', authenticate, assetController.getAudits);
router.put('/assets/audits/:id/complete', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), assetController.completeAudit);

// Asset Dashboard
router.get('/assets/summary', authenticate, assetController.getAssetSummary);

module.exports = router;
