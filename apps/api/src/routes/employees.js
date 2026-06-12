const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllEmployees);
router.get('/stats', auth, getEmployeeStats);
router.get('/:id', auth, getEmployeeById);
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), validate(schemas.employee), createEmployee);
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updateEmployee);
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), deleteEmployee);

module.exports = router;
