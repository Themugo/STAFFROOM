const express = require('express');
const router = express.Router();
const mediumPriorityFeaturesController = require('../controllers/mediumPriorityFeaturesController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Apply authentication to all routes
router.use(authenticate);

// ==================== HARASSMENT & DISCRIMINATION WORKFLOWS ====================

// Whistleblower Protection Routes
router.post('/whistleblower-protections', mediumPriorityFeaturesController.createWhistleblowerProtection);
router.get('/whistleblower-protections', mediumPriorityFeaturesController.getWhistleblowerProtections);
router.put('/whistleblower-protections/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateWhistleblowerProtection);

// External Report Routes
router.post('/external-reports', mediumPriorityFeaturesController.createExternalReport);
router.get('/external-reports', mediumPriorityFeaturesController.getExternalReports);

// ==================== LICENSE & CERTIFICATION EXPIRY ====================

// License Routes
router.post('/licenses', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createLicense);
router.get('/licenses', mediumPriorityFeaturesController.getLicenses);
router.put('/licenses/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateLicense);

// Renewal Reminder Routes
router.post('/renewal-reminders', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createRenewalReminder);
router.get('/renewal-reminders', mediumPriorityFeaturesController.getRenewalReminders);
router.put('/renewal-reminders/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateRenewalReminder);

// ==================== SACCO DEDUCTION INTEGRATION ====================

// SACCO Membership Routes
router.post('/sacco-memberships', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createSACCOMembership);
router.get('/sacco-memberships', mediumPriorityFeaturesController.getSACCOMemberships);
router.put('/sacco-memberships/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateSACCOMembership);

// SACCO Contribution Routes
router.post('/sacco-contributions', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createSACCOContribution);
router.get('/sacco-contributions', mediumPriorityFeaturesController.getSACCOContributions);

// SACCO Loan Routes
router.post('/sacco-loans', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createSACCOLoan);
router.get('/sacco-loans', mediumPriorityFeaturesController.getSACCOLoans);
router.put('/sacco-loans/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateSACCOLoan);

// ==================== TEAM MODEL ====================

// Team Routes
router.post('/teams', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createTeam);
router.get('/teams', mediumPriorityFeaturesController.getTeams);
router.put('/teams/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateTeam);

// Team Member Routes
router.post('/team-members', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createTeamMember);
router.get('/team-members', mediumPriorityFeaturesController.getTeamMembers);
router.put('/team-members/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateTeamMember);

// ==================== INTERNSHIP & GRADUATE PROGRAMS ====================

// Internship Program Routes
router.post('/internship-programs', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createInternshipProgram);
router.get('/internship-programs', mediumPriorityFeaturesController.getInternshipPrograms);
router.put('/internship-programs/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateInternshipProgram);

// Intern Routes
router.post('/interns', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createIntern);
router.get('/interns', mediumPriorityFeaturesController.getInterns);
router.put('/interns/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateIntern);

// Program Evaluation Routes
router.post('/program-evaluations', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createProgramEvaluation);
router.get('/program-evaluations', mediumPriorityFeaturesController.getProgramEvaluations);

// Conversion Tracking Routes
router.post('/conversion-tracking', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.createConversionTracking);
router.get('/conversion-tracking', mediumPriorityFeaturesController.getConversionTracking);
router.put('/conversion-tracking/:id', authorize(['admin', 'hr_manager']), mediumPriorityFeaturesController.updateConversionTracking);

module.exports = router;
