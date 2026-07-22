const { prisma } = require('../config/database');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
        manager: { select: { firstName: true, lastName: true, employeeId: true } },
        user: { select: { email: true, role: true, isActive: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        manager: { select: { firstName: true, lastName: true, employeeId: true } },
        subordinates: { select: { firstName: true, lastName: true, employeeId: true } },
        user: { select: { email: true, role: true, isActive: true } },
        attendances: { orderBy: { date: 'desc' }, take: 30 },
        leaves: { orderBy: { createdAt: 'desc' }, take: 10 },
        performanceReviews: { orderBy: { createdAt: 'desc' }, take: 5 },
        documents: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const data = req.body;

    const employeeId = `EMP${Date.now().toString().slice(-6)}`;

    const employee = await prisma.employee.create({
      data: {
        ...data,
        employeeId,
      },
      include: {
        department: true,
        position: true,
        manager: { select: { firstName: true, lastName: true, employeeId: true } }
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
        position: true,
        manager: { select: { firstName: true, lastName: true, employeeId: true } }
      }
    });

    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

const getEmployeeStats = async (req, res) => {
  try {
    const total = await prisma.employee.count();
    const active = await prisma.employee.count({ where: { status: 'ACTIVE' } });
    const onLeave = await prisma.employee.count({ where: { status: 'ON_LEAVE' } });
    const inactive = await prisma.employee.count({ where: { status: 'INACTIVE' } });

    const byDepartment = await prisma.employee.groupBy({
      by: ['departmentId'],
      _count: true,
      where: { status: 'ACTIVE' }
    });

    const departments = await prisma.department.findMany({
      where: { id: { in: byDepartment.map(d => d.departmentId) } }
    });

    const departmentStats = departments.map(dept => ({
      name: dept.name,
      count: byDepartment.find(d => d.departmentId === dept.id)?._count || 0
    }));

    res.json({
      total,
      active,
      onLeave,
      inactive,
      byDepartment: departmentStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};
