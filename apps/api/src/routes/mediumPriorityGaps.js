const express = require('express');
const router = express.Router();
const mediumPriorityGapsController = require('../controllers/mediumPriorityGapsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Apply authentication to all routes
router.use(authenticate);

// ==================== RECRUITMENT & HIRING ====================

// Talent Pool Routes
router.post('/talent-pools', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createTalentPool);
router.get('/talent-pools', mediumPriorityGapsController.getTalentPools);

// Talent Pool Candidate Routes
router.post('/talent-pool-candidates', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.addTalentPoolCandidate);
router.get('/talent-pool-candidates', mediumPriorityGapsController.getTalentPoolCandidates);

// Probation Review Routes
router.post('/probation-reviews', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createProbationReview);
router.get('/probation-reviews', mediumPriorityGapsController.getProbationReviews);
router.put('/probation-reviews/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateProbationReview);

// ==================== ATTENDANCE & PRESENCE ====================

// Attendance Location Routes
router.post('/attendance-locations', mediumPriorityGapsController.createAttendanceLocation);
router.get('/attendance-locations', mediumPriorityGapsController.getAttendanceLocations);

// Travel Record Routes
router.post('/travel-records', mediumPriorityGapsController.createTravelRecord);
router.get('/travel-records', mediumPriorityGapsController.getTravelRecords);
router.put('/travel-records/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateTravelRecord);

// Training Attendance Routes
router.post('/training-attendances', mediumPriorityGapsController.createTrainingAttendance);
router.get('/training-attendances', mediumPriorityGapsController.getTrainingAttendances);

// ==================== LEAVE & ABSENCE ====================

// Custom Leave Routes
router.post('/custom-leaves', mediumPriorityGapsController.createCustomLeave);
router.get('/custom-leaves', mediumPriorityGapsController.getCustomLeaves);
router.put('/custom-leaves/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateCustomLeave);

// ==================== ASSET RESPONSIBILITY ====================

// Asset Workflow Routes
router.post('/asset-workflows', mediumPriorityGapsController.createAssetWorkflow);
router.get('/asset-workflows', mediumPriorityGapsController.getAssetWorkflows);
router.put('/asset-workflows/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateAssetWorkflow);

// ==================== PERFORMANCE MANAGEMENT ====================

// OKR Routes
router.post('/okrs', mediumPriorityGapsController.createOKR);
router.get('/okrs', mediumPriorityGapsController.getOKRs);
router.put('/okrs/:id', mediumPriorityGapsController.updateOKR);

// Feedback360 Routes
router.post('/feedback360', mediumPriorityGapsController.createFeedback360);
router.get('/feedback360', mediumPriorityGapsController.getFeedback360);
router.put('/feedback360/:id', mediumPriorityGapsController.updateFeedback360);

// ==================== LEARNING & DEVELOPMENT ====================

// Compliance Training Routes
router.post('/compliance-trainings', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createComplianceTraining);
router.get('/compliance-trainings', mediumPriorityGapsController.getComplianceTrainings);
router.put('/compliance-trainings/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateComplianceTraining);

// Mentorship Routes
router.post('/mentorships', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createMentorship);
router.get('/mentorships', mediumPriorityGapsController.getMentorships);
router.put('/mentorships/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateMentorship);

// ==================== WORKFORCE PLANNING ====================

// Headcount Request Routes
router.post('/headcount-requests', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createHeadcountRequest);
router.get('/headcount-requests', mediumPriorityGapsController.getHeadcountRequests);
router.put('/headcount-requests/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateHeadcountRequest);

// Workforce Budget Routes
router.post('/workforce-budgets', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createWorkforceBudget);
router.get('/workforce-budgets', mediumPriorityGapsController.getWorkforceBudgets);
router.put('/workforce-budgets/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateWorkforceBudget);

// ==================== SUCCESSION PLANNING ====================

// Succession Plan Routes
router.post('/succession-plans', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createSuccessionPlan);
router.get('/succession-plans', mediumPriorityGapsController.getSuccessionPlans);

// Successor Routes
router.post('/successors', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createSuccessor);
router.get('/successors', mediumPriorityGapsController.getSuccessors);
router.put('/successors/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateSuccessor);

// Talent Pool Succession Routes
router.post('/talent-pool-successions', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createTalentPoolSuccession);
router.get('/talent-pool-successions', mediumPriorityGapsController.getTalentPoolSuccessions);

// ==================== INTERNAL MOBILITY ====================

// Mobility Request Routes
router.post('/mobility-requests', mediumPriorityGapsController.createMobilityRequest);
router.get('/mobility-requests', mediumPriorityGapsController.getMobilityRequests);
router.put('/mobility-requests/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateMobilityRequest);

// ==================== EXTERNAL WORKFORCE ====================

// External Worker Routes
router.post('/external-workers', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createExternalWorker);
router.get('/external-workers', mediumPriorityGapsController.getExternalWorkers);
router.put('/external-workers/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateExternalWorker);

// ==================== WORKFORCE RISK ====================

// Workforce Risk Routes
router.post('/workforce-risks', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createWorkforceRisk);
router.get('/workforce-risks', mediumPriorityGapsController.getWorkforceRisks);
router.put('/workforce-risks/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateWorkforceRisk);

// ==================== FINANCIAL LIABILITY ====================

// Financial Liability Routes
router.post('/financial-liabilities', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createFinancialLiability);
router.get('/financial-liabilities', mediumPriorityGapsController.getFinancialLiabilities);
router.put('/financial-liabilities/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateFinancialLiability);

// ==================== BENEFITS VALUATION ====================

// Benefits In Kind Routes
router.post('/benefits-in-kind', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.createBenefitsInKind);
router.get('/benefits-in-kind', mediumPriorityGapsController.getBenefitsInKind);
router.put('/benefits-in-kind/:id', authorize(['admin', 'hr_manager']), mediumPriorityGapsController.updateBenefitsInKind);

module.exports = router;
