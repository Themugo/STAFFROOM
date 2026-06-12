const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.get('/', auth, async (req, res) => {
  try {
    const positions = await prisma.position.findMany({
      include: { department: true },
      orderBy: { title: 'asc' }
    });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const position = await prisma.position.findUnique({
      where: { id: req.params.id },
      include: { department: true, employees: true }
    });
    if (!position) return res.status(404).json({ error: 'Position not found' });
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch position' });
  }
});

router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), validate(schemas.position), async (req, res) => {
  try {
    const position = await prisma.position.create({
      data: req.body,
      include: { department: true }
    });
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create position' });
  }
});

router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'), async (req, res) => {
  try {
    const position = await prisma.position.update({
      where: { id: req.params.id },
      data: req.body,
      include: { department: true }
    });
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    await prisma.position.delete({ where: { id: req.params.id } });
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

module.exports = router;
