const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticate, authorize } = require('../middleware/auth');

// Login History Routes
router.get('/login-history', authenticate, auditController.getLoginHistory);

// Device Sessions Routes
router.get('/device-sessions', authenticate, auditController.getDeviceSessions);
router.delete('/device-sessions/:sessionId', authenticate, auditController.revokeDeviceSession);
router.delete('/device-sessions', authenticate, auditController.revokeAllDeviceSessions);
router.post('/device-sessions/:sessionId/trust', authenticate, auditController.trustDeviceSession);

// Audit Trail Routes
router.get('/logs', authenticate, authorize(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER']), auditController.getAuditLogs);

// Permission Matrix Routes
router.get('/permissions', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), auditController.getPermissions);
router.post('/permissions', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), auditController.createPermission);
router.post('/permissions/assign', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), auditController.assignPermissionToRole);
router.delete('/permissions/:roleId/:permissionId', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), auditController.removePermissionFromRole);

module.exports = router;
