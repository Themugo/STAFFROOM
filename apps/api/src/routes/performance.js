const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { authenticate, authorize } = require('../middleware/auth');

// OKR Management
router.post('/goals', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), performanceController.createGoal);
router.get('/goals', authenticate, performanceController.getGoals);
router.put('/goals/:id', authenticate, performanceController.updateGoal);

router.post('/key-results', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), performanceController.createKeyResult);
router.put('/key-results/:id', authenticate, performanceController.updateKeyResult);

// Feedback Management
router.post('/feedback', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']), performanceController.createFeedback);
router.get('/feedback', authenticate, performanceController.getFeedback);
router.put('/feedback/:id/acknowledge', authenticate, performanceController.acknowledgeFeedback);

// Appraisal Management
router.post('/appraisals', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), performanceController.createAppraisal);
router.get('/appraisals', authenticate, performanceController.getAppraisals);
router.put('/appraisals/:id', authenticate, performanceController.updateAppraisal);
router.put('/appraisals/:id/approve', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), performanceController.approveAppraisal);

// 360 Review Management
router.post('/review-cycles', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), performanceController.createReviewCycle);
router.get('/review-cycles', authenticate, performanceController.getReviewCycles);
router.post('/review-responses', authenticate, performanceController.submitReviewResponse);
router.get('/review-responses', authenticate, performanceController.getReviewResponses);

// Promotion Recommendations
router.post('/promotions', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']), performanceController.createPromotionRecommendation);
router.get('/promotions', authenticate, performanceController.getPromotionRecommendations);
router.put('/promotions/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), performanceController.updatePromotionRecommendation);

// Performance Dashboard
router.get('/summary', authenticate, performanceController.getPerformanceSummary);

module.exports = router;
