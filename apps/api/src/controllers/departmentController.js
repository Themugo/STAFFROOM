const prisma = require('../config/database');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true, positions: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: {
          include: { position: true },
          where: { status: 'ACTIVE' }
        },
        positions: true
      }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await prisma.department.create({
      data: req.body
    });

    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await prisma.department.update({
      where: { id },
      data: req.body
    });

    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeCount = await prisma.employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
      return res.status(400).json({ error: 'Cannot delete department with employees' });
    }

    await prisma.department.delete({ where: { id } });

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
