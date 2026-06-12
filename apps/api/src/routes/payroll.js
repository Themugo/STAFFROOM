const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { authenticate, authorize } = require('../middleware/auth');

// Payroll Run Routes
router.post('/runs', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.createPayrollRun);
router.get('/runs', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), payrollController.getPayrollRuns);
router.get('/runs/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), payrollController.getPayrollRunById);
router.put('/runs/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.updatePayrollRun);
router.post('/runs/:id/approve', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.approvePayrollRun);
router.delete('/runs/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), payrollController.deletePayrollRun);

// Salary Component Routes
router.post('/components', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.createSalaryComponent);
router.get('/components', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), payrollController.getSalaryComponents);
router.put('/components/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.updateSalaryComponent);
router.delete('/components/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), payrollController.deleteSalaryComponent);

// Deduction Routes
router.post('/deductions', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.createDeduction);
router.get('/deductions', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), payrollController.getDeductions);
router.put('/deductions/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.updateDeduction);
router.delete('/deductions/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), payrollController.deleteDeduction);

// Payslip Routes
router.post('/payslips', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), payrollController.generatePayslip);
router.get('/payslips', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), payrollController.getPayslips);
router.get('/payslips/:id', authenticate, payrollController.getPayslipById);
router.get('/employees/:employeeId/payslips', authenticate, payrollController.getEmployeePayslips);

module.exports = router;
