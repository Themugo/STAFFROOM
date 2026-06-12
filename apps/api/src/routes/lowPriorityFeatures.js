const express = require('express');
const router = express.Router();
const lowPriorityFeaturesController = require('../controllers/lowPriorityFeaturesController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Apply authentication to all routes
router.use(authenticate);

// ==================== COMMITTEE TRACKING ====================

// Committee Routes
router.post('/committees', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createCommittee);
router.get('/committees', lowPriorityFeaturesController.getCommittees);
router.put('/committees/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateCommittee);

// Committee Member Routes
router.post('/committee-members', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createCommitteeMember);
router.get('/committee-members', lowPriorityFeaturesController.getCommitteeMembers);
router.put('/committee-members/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateCommitteeMember);

// Committee Meeting Routes
router.post('/committee-meetings', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createCommitteeMeeting);
router.get('/committee-meetings', lowPriorityFeaturesController.getCommitteeMeetings);
router.put('/committee-meetings/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateCommitteeMeeting);

// ==================== PROJECT-BASED REPORTING ====================

// Project Routes
router.post('/projects', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createProject);
router.get('/projects', lowPriorityFeaturesController.getProjects);
router.put('/projects/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateProject);

// Project Member Routes
router.post('/project-members', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createProjectMember);
router.get('/project-members', lowPriorityFeaturesController.getProjectMembers);
router.put('/project-members/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateProjectMember);

// ==================== EXAM & ASSESSMENT TRACKING ====================

// Assessment Routes
router.post('/assessments', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createAssessment);
router.get('/assessments', lowPriorityFeaturesController.getAssessments);
router.put('/assessments/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateAssessment);

// Assessment Result Routes
router.post('/assessment-results', lowPriorityFeaturesController.createAssessmentResult);
router.get('/assessment-results', lowPriorityFeaturesController.getAssessmentResults);

// ==================== FRAUD DETECTION ENHANCEMENTS ====================

// Fraud Alert Routes
router.post('/fraud-alerts', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createFraudAlert);
router.get('/fraud-alerts', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.getFraudAlerts);
router.put('/fraud-alerts/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateFraudAlert);

// Fraud Case Routes
router.post('/fraud-cases', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createFraudCase);
router.get('/fraud-cases', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.getFraudCases);
router.put('/fraud-cases/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateFraudCase);

// ==================== ATTRITION RISK PREDICTION ====================

// Attrition Risk Routes
router.post('/attrition-risks', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createAttritionRisk);
router.get('/attrition-risks', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.getAttritionRisks);
router.put('/attrition-risks/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateAttritionRisk);

// Attrition Intervention Routes
router.post('/attrition-interventions', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createAttritionIntervention);
router.get('/attrition-interventions', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.getAttritionInterventions);
router.put('/attrition-interventions/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateAttritionIntervention);

// ==================== BURNOUT DETECTION ====================

// Burnout Risk Routes
router.post('/burnout-risks', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createBurnoutRisk);
router.get('/burnout-risks', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.getBurnoutRisks);
router.put('/burnout-risks/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateBurnoutRisk);

// Wellness Program Routes
router.post('/wellness-programs', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.createWellnessProgram);
router.get('/wellness-programs', lowPriorityFeaturesController.getWellnessPrograms);
router.put('/wellness-programs/:id', authorize(['admin', 'hr_manager']), lowPriorityFeaturesController.updateWellnessProgram);

// Wellness Enrollment Routes
router.post('/wellness-enrollments', lowPriorityFeaturesController.createWellnessEnrollment);
router.get('/wellness-enrollments', lowPriorityFeaturesController.getWellnessEnrollments);
router.put('/wellness-enrollments/:id', lowPriorityFeaturesController.updateWellnessEnrollment);

module.exports = router;
