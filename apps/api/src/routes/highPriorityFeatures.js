const express = require('express');
const router = express.Router();
const highPriorityFeaturesController = require('../controllers/highPriorityFeaturesController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Apply authentication to all routes
router.use(authenticate);

// ==================== BENEFITS ELIGIBILITY RULES ====================

// Benefits Eligibility Rule Routes
router.post('/benefits-eligibility-rules', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createBenefitsEligibilityRule);
router.get('/benefits-eligibility-rules', highPriorityFeaturesController.getBenefitsEligibilityRules);
router.put('/benefits-eligibility-rules/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateBenefitsEligibilityRule);

// Benefits Tier Routes
router.post('/benefits-tiers', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createBenefitsTier);
router.get('/benefits-tiers', highPriorityFeaturesController.getBenefitsTiers);
router.put('/benefits-tiers/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateBenefitsTier);

// ==================== EXIT INTERVIEW TRACKING ====================

// Exit Interview Routes
router.post('/exit-interviews', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createExitInterview);
router.get('/exit-interviews', highPriorityFeaturesController.getExitInterviews);
router.put('/exit-interviews/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateExitInterview);

// Exit Questionnaire Routes
router.post('/exit-questionnaires', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createExitQuestionnaire);
router.get('/exit-questionnaires', highPriorityFeaturesController.getExitQuestionnaires);

// ==================== FINAL DUES CALCULATION ====================

// Final Dues Calculation Routes
router.post('/final-dues-calculations', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createFinalDuesCalculation);
router.get('/final-dues-calculations', highPriorityFeaturesController.getFinalDuesCalculations);
router.put('/final-dues-calculations/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateFinalDuesCalculation);

// ==================== LABOR LAW COMPLIANCE ====================

// Labor Law Rule Routes
router.post('/labor-law-rules', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createLaborLawRule);
router.get('/labor-law-rules', highPriorityFeaturesController.getLaborLawRules);
router.put('/labor-law-rules/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateLaborLawRule);

// Compliance Check Routes
router.post('/compliance-checks', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createComplianceCheck);
router.get('/compliance-checks', highPriorityFeaturesController.getComplianceChecks);
router.put('/compliance-checks/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateComplianceCheck);

// ==================== GDPR COMPLIANCE ====================

// Data Consent Routes
router.post('/data-consents', highPriorityFeaturesController.createDataConsent);
router.get('/data-consents', highPriorityFeaturesController.getDataConsents);
router.put('/data-consents/:id', highPriorityFeaturesController.updateDataConsent);

// Data Subject Request Routes
router.post('/data-subject-requests', highPriorityFeaturesController.createDataSubjectRequest);
router.get('/data-subject-requests', highPriorityFeaturesController.getDataSubjectRequests);
router.put('/data-subject-requests/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateDataSubjectRequest);

// Data Breach Routes
router.post('/data-breaches', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.createDataBreach);
router.get('/data-breaches', highPriorityFeaturesController.getDataBreaches);
router.put('/data-breaches/:id', authorize(['admin', 'hr_manager']), highPriorityFeaturesController.updateDataBreach);

module.exports = router;
