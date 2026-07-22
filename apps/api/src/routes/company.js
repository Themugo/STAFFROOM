const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

// Company Routes
router.post('/companies', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.createCompany);
router.get('/companies', authenticate, companyController.getCompanies);
router.get('/companies/:id', authenticate, companyController.getCompany);
router.put('/companies/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.updateCompany);
router.delete('/companies/:id', authenticate, authorize(['SUPER_ADMIN']), companyController.deleteCompany);

// Branch Routes
router.post('/branches', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.createBranch);
router.get('/branches', authenticate, companyController.getBranches);
router.get('/branches/:id', authenticate, companyController.getBranch);
router.put('/branches/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.updateBranch);
router.delete('/branches/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.deleteBranch);

// Location Routes
router.post('/locations', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.createLocation);
router.get('/locations', authenticate, companyController.getLocations);
router.get('/locations/:id', authenticate, companyController.getLocation);
router.put('/locations/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.updateLocation);
router.delete('/locations/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), companyController.deleteLocation);

module.exports = router;
