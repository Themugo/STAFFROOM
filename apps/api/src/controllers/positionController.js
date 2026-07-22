const { prisma } = require('../config/database');

const getAllPositions = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const where = {};
    if (departmentId) where.departmentId = departmentId;

    const positions = await prisma.position.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true }
        },
        _count: {
          select: { employees: true }
        }
      },
      orderBy: { title: 'asc' }
    });

    res.json(positions);
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
};

const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;

    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, name: true }
        },
        employees: {
          where: { status: 'ACTIVE' },
          include: {
            department: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    res.json(position);
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({ error: 'Failed to fetch position' });
  }
};

const createPosition = async (req, res) => {
  try {
    const { title, description, departmentId, baseSalary, requirements } = req.body;

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const position = await prisma.position.create({
      data: {
        title,
        description,
        departmentId,
        baseSalary,
        requirements
      },
      include: {
        department: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(position);
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ error: 'Failed to create position' });
  }
};

const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, departmentId, baseSalary, requirements } = req.body;

    // Check if position exists
    const existing = await prisma.position.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // If changing department, verify it exists
    if (departmentId && departmentId !== existing.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
    }

    const position = await prisma.position.update({
      where: { id },
      data: {
        title,
        description,
        departmentId,
        baseSalary,
        requirements
      },
      include: {
        department: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(position);
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ error: 'Failed to update position' });
  }
};

const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeCount = await prisma.employee.count({
      where: { positionId: id }
    });

    if (employeeCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete position with employees. Reassign or remove employees first.' 
      });
    }

    await prisma.position.delete({ where: { id } });

    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ error: 'Failed to delete position' });
  }
};

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
};
