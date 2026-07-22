const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Vacancy Routes
router.post('/vacancies', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.createVacancy);
router.get('/vacancies', authenticate, recruitmentController.getVacancies);
router.get('/vacancies/:id', authenticate, recruitmentController.getVacancyById);
router.put('/vacancies/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.updateVacancy);
router.delete('/vacancies/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), recruitmentController.deleteVacancy);

// Candidate Routes
router.post('/candidates', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.createCandidate);
router.get('/candidates', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), recruitmentController.getCandidates);
router.get('/candidates/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), recruitmentController.getCandidateById);
router.put('/candidates/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.updateCandidate);
router.delete('/candidates/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), recruitmentController.deleteCandidate);

// Application Routes
router.post('/applications', authenticate, recruitmentController.createApplication);
router.get('/applications', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), recruitmentController.getApplications);
router.put('/applications/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.updateApplication);
router.delete('/applications/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.deleteApplication);

// Interview Routes
router.post('/interviews', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.createInterview);
router.get('/interviews', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), recruitmentController.getInterviews);
router.put('/interviews/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.updateInterview);
router.delete('/interviews/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.deleteInterview);

// Onboarding Routes
router.post('/onboarding', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.createOnboarding);
router.get('/onboarding', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER']), recruitmentController.getOnboardings);
router.put('/onboarding/:id', authenticate, authorize(['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN']), recruitmentController.updateOnboarding);
router.delete('/onboarding/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), recruitmentController.deleteOnboarding);

module.exports = router;
