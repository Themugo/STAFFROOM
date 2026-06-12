const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentHierarchy,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  getDepartmentStats
} = require('../controllers/departmentController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllDepartments);
router.get('/hierarchy', auth, getDepartmentHierarchy);
router.get('/:id', auth, getDepartmentById);
router.get('/:id/stats', auth, getDepartmentStats);
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), validate(schemas.department), createDepartment);
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updateDepartment);
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), deleteDepartment);
router.put('/:id/head', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), assignDepartmentHead);

module.exports = router;
