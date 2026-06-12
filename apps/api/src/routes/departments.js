const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllDepartments);
router.get('/:id', auth, getDepartmentById);
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), validate(schemas.department), createDepartment);
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updateDepartment);
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), deleteDepartment);

module.exports = router;
