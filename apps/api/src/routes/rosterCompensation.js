const express = require('express');
const router = express.Router();
const rosterCompensationController = require('../controllers/rosterCompensationController');
const { authenticate, authorize } = require('../middleware/auth');

// Duty Roster Management
router.post('/rosters', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), rosterCompensationController.createDutyRoster);
router.put('/rosters/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), rosterCompensationController.updateDutyRoster);
router.put('/rosters/:id/approve', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), rosterCompensationController.approveDutyRoster);
router.delete('/rosters/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), rosterCompensationController.deleteDutyRoster);
router.get('/rosters', authenticate, rosterCompensationController.getDutyRosters);

// Roster Assignments
router.post('/rosters/assignments', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), rosterCompensationController.assignToRoster);
router.put('/rosters/assignments/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), rosterCompensationController.updateRosterAssignment);
router.delete('/rosters/assignments/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), rosterCompensationController.removeRosterAssignment);
router.get('/rosters/assignments', authenticate, rosterCompensationController.getRosterAssignments);

// Compensation Rules
router.post('/compensation/rules', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), rosterCompensationController.createCompensationRule);
router.put('/compensation/rules/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), rosterCompensationController.updateCompensationRule);
router.delete('/compensation/rules/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), rosterCompensationController.deleteCompensationRule);
router.get('/compensation/rules', authenticate, rosterCompensationController.getCompensationRules);

// Compensation Credits
router.post('/compensation/credits/calculate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), rosterCompensationController.calculateCompensationCredit);
router.put('/compensation/credits/:id/use', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), rosterCompensationController.useCompensationCredit);
router.get('/compensation/credits', authenticate, rosterCompensationController.getCompensationCredits);
router.get('/compensation/credits/balance', authenticate, rosterCompensationController.getEmployeeCompensationBalance);

module.exports = router;
