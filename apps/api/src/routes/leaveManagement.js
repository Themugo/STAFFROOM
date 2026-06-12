const express = require('express');
const router = express.Router();
const leaveManagementController = require('../controllers/leaveManagementController');
const { authenticate, authorize } = require('../middleware/auth');

// Leave Balance Routes
router.post('/balances', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.createLeaveBalance);
router.get('/balances', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), leaveManagementController.getLeaveBalances);
router.get('/employees/:employeeId/balances', authenticate, leaveManagementController.getEmployeeLeaveBalances);
router.put('/balances/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.updateLeaveBalance);

// Leave Accrual Rule Routes
router.post('/accrual-rules', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.createLeaveAccrualRule);
router.get('/accrual-rules', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), leaveManagementController.getLeaveAccrualRules);
router.put('/accrual-rules/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.updateLeaveAccrualRule);
router.delete('/accrual-rules/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), leaveManagementController.deleteLeaveAccrualRule);

// Public Holiday Routes
router.post('/holidays', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.createPublicHoliday);
router.get('/holidays', authenticate, leaveManagementController.getPublicHolidays);
router.put('/holidays/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.updatePublicHoliday);
router.delete('/holidays/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), leaveManagementController.deletePublicHoliday);

// Leave Transaction Routes
router.post('/transactions', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), leaveManagementController.createLeaveTransaction);
router.get('/transactions', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), leaveManagementController.getLeaveTransactions);
router.get('/employees/:employeeId/transactions', authenticate, leaveManagementController.getEmployeeLeaveTransactions);

module.exports = router;
