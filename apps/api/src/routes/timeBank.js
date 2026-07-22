const express = require('express');
const router = express.Router();
const timeBankController = require('../controllers/timeBankController');
const { authenticate, authorize } = require('../middleware/auth');

// Time Bank
router.post('/time-bank', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.createTimeBank);
router.put('/time-bank/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.updateTimeBank);
router.get('/time-bank', authenticate, timeBankController.getTimeBank);
router.post('/time-bank/transactions', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.addTimeBankTransaction);
router.get('/time-bank/transactions', authenticate, timeBankController.getTimeBankTransactions);

// Employee Debts (Days Owed to Company)
router.post('/debts', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.createEmployeeDebt);
router.put('/debts/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.updateEmployeeDebt);
router.delete('/debts/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), timeBankController.deleteEmployeeDebt);
router.get('/debts', authenticate, timeBankController.getEmployeeDebts);

// Employee Credits (Company Owes Employee)
router.post('/credits', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.createEmployeeCredit);
router.put('/credits/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), timeBankController.updateEmployeeCredit);
router.delete('/credits/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), timeBankController.deleteEmployeeCredit);
router.get('/credits', authenticate, timeBankController.getEmployeeCredits);

// Dashboard - Net Balance
router.get('/net-balance', authenticate, timeBankController.getEmployeeNetBalance);

module.exports = router;
