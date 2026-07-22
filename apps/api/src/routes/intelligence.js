const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligenceController');
const { authenticate, authorize } = require('../middleware/auth');

// Risk Predictions
router.post('/predictions/generate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), intelligenceController.generateEmployeeRiskPredictions);
router.get('/predictions', authenticate, intelligenceController.getEmployeeRiskPredictions);

// Productivity Scores
router.post('/productivity/generate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), intelligenceController.generateDepartmentProductivityScores);
router.get('/productivity', authenticate, intelligenceController.getDepartmentProductivityScores);

// Hiring Forecasts
router.post('/forecasts/generate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), intelligenceController.generateHiringForecast);
router.get('/forecasts', authenticate, intelligenceController.getHiringForecasts);

// Salary Benchmarks
router.post('/benchmarks/generate', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), intelligenceController.generateSalaryBenchmarks);
router.get('/benchmarks', authenticate, intelligenceController.getSalaryBenchmarks);

// Intelligence Dashboard
router.get('/summary', authenticate, intelligenceController.getIntelligenceSummary);

module.exports = router;
