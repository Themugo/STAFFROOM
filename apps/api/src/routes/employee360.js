const express = require('express');
const router = express.Router();
const {
  getEmployee360Profile,
  getEmploymentHistory,
  createEmploymentHistory,
  getContracts,
  createContract,
  getCertifications,
  createCertification,
  getSkills,
  createSkill,
  getTrainingRecords,
  createTrainingRecord,
  getAssets,
  createAsset,
  getDisciplinaryRecords,
  createDisciplinaryRecord,
  getPromotionHistory,
  createPromotionHistory,
  getSalaryHistory,
  createSalaryHistory,
  getDependants,
  createDependant
} = require('../controllers/employee360Controller');
const { auth, authorize } = require('../middleware/auth');

// 360 Profile
router.get('/:id/360', auth, getEmployee360Profile);

// Employment History
router.get('/:employeeId/employment-history', auth, getEmploymentHistory);
router.post('/:employeeId/employment-history', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createEmploymentHistory);

// Contracts
router.get('/:employeeId/contracts', auth, getContracts);
router.post('/:employeeId/contracts', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createContract);

// Certifications
router.get('/:employeeId/certifications', auth, getCertifications);
router.post('/:employeeId/certifications', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createCertification);

// Skills
router.get('/:employeeId/skills', auth, getSkills);
router.post('/:employeeId/skills', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createSkill);

// Training Records
router.get('/:employeeId/training', auth, getTrainingRecords);
router.post('/:employeeId/training', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createTrainingRecord);

// Assets
router.get('/:employeeId/assets', auth, getAssets);
router.post('/:employeeId/assets', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createAsset);

// Disciplinary Records
router.get('/:employeeId/disciplinary', auth, getDisciplinaryRecords);
router.post('/:employeeId/disciplinary', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createDisciplinaryRecord);

// Promotion History
router.get('/:employeeId/promotions', auth, getPromotionHistory);
router.post('/:employeeId/promotions', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createPromotionHistory);

// Salary History
router.get('/:employeeId/salary-history', auth, getSalaryHistory);
router.post('/:employeeId/salary-history', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createSalaryHistory);

// Dependants
router.get('/:employeeId/dependants', auth, getDependants);
router.post('/:employeeId/dependants', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), createDependant);

module.exports = router;
