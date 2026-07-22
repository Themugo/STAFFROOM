const express = require('express');
const router = express.Router();
const {
  authenticate,
  authorize
} = require('../middleware/auth');
const governanceController = require('../controllers/governanceController');

// Audit Engine Routes
router.post('/audit-logs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.createAuditLog);
router.get('/audit-logs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.getAuditLogs);

// Liability Engine Routes
router.post('/liability-records', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.createLiabilityRecord);
router.get('/liability-records', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.getLiabilityRecords);

// Attendance Verification Engine Routes
router.post('/attendance-verification', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.createAttendanceVerification);
router.get('/attendance-verification', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.getAttendanceVerifications);

// Payroll Reconciliation Engine Routes
router.post('/payroll-reconciliation', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.createPayrollReconciliation);
router.get('/payroll-reconciliation', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.getPayrollReconciliations);
router.put('/payroll-reconciliation/:id/lock', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.lockPayrollReconciliation);
router.put('/payroll-reconciliation/:id/resolve', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.resolvePayrollReconciliation);

// Dispute Resolution Center Routes
router.post('/workforce-disputes', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.createWorkforceDispute);
router.get('/workforce-disputes', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.getWorkforceDisputes);
router.put('/workforce-disputes/:id/resolve', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.resolveWorkforceDispute);

// Department Communication Audit Routes
router.post('/auditable-communications', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.createAuditableCommunication);
router.get('/auditable-communications', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.getAuditableCommunications);
router.post('/communication-read-receipts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.createCommunicationReadReceipt);
router.put('/communication-read-receipts/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.updateCommunicationReadReceipt);

// Payroll Evidence Pack Routes
router.post('/payroll-evidence-packs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.createPayrollEvidencePack);
router.get('/payroll-evidence-packs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), governanceController.getPayrollEvidencePacks);

// Governance Dashboard Routes
router.post('/governance-metrics', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), governanceController.createGovernanceMetric);
router.get('/governance-metrics', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.getGovernanceMetrics);
router.get('/governance-dashboard-summary', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), governanceController.getGovernanceDashboardSummary);

module.exports = router;
