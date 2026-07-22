const express = require('express');
const router = express.Router();
const {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, getAllPositions);
router.get('/:id', auth, getPositionById);
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), validate(schemas.position), createPosition);
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), updatePosition);
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), deletePosition);

module.exports = router;
