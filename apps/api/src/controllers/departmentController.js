const prisma = require('../config/database');

const getAllDepartments = async (req, res) => {
  try {
    const { includeHierarchy = false, status } = req.query;

    const where = {};
    if (status) where.status = status;

    const departments = await prisma.department.findMany({
      where,
      include: {
        _count: {
          select: { employees: true, positions: true, subDepartments: true }
        },
        parentDepartment: includeHierarchy ? {
          select: { id: true, name: true }
        } : false,
        head: includeHierarchy ? {
          select: { id: true, firstName: true, lastName: true, email: true }
        } : false
      },
      orderBy: [{ level: 'asc' }, { name: 'asc' }]
    });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

const getDepartmentHierarchy = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { employees: true, positions: true, subDepartments: true }
        },
        head: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      },
      orderBy: [{ level: 'asc' }, { name: 'asc' }]
    });

    // Build hierarchy tree
    const buildTree = (parentId = null, level = 0) => {
      return departments
        .filter(dept => dept.parentDepartmentId === parentId)
        .map(dept => ({
          ...dept,
          level,
          children: buildTree(dept.id, level + 1)
        }));
    };

    const hierarchy = buildTree();

    res.json(hierarchy);
  } catch (error) {
    console.error('Get department hierarchy error:', error);
    res.status(500).json({ error: 'Failed to fetch department hierarchy' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        parentDepartment: {
          select: { id: true, name: true }
        },
        subDepartments: {
          include: {
            _count: {
              select: { employees: true }
            }
          }
        },
        head: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        employees: {
          include: { position: true },
          where: { status: 'ACTIVE' }
        },
        positions: true,
        workflows: {
          where: { status: 'ACTIVE' },
          include: {
            _count: {
              select: { steps: true, executions: true }
            }
          }
        },
        policies: {
          where: { isActive: true }
        }
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
    const { name, code, description, location, budget, parentDepartmentId, headId, settings } = req.body;

    // Calculate hierarchy level and path
    let level = 0;
    let path = name;
    
    if (parentDepartmentId) {
      const parent = await prisma.department.findUnique({
        where: { id: parentDepartmentId }
      });
      
      if (!parent) {
        return res.status(404).json({ error: 'Parent department not found' });
      }
      
      level = parent.level + 1;
      path = `${parent.path} > ${name}`;
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
        description,
        location,
        budget,
        parentDepartmentId,
        headId,
        level,
        path,
        settings,
        status: 'ACTIVE'
      },
      include: {
        parentDepartment: {
          select: { id: true, name: true }
        },
        head: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
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
    const { name, parentDepartmentId, headId, status, settings } = req.body;

    // Check if department exists
    const existing = await prisma.department.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Update hierarchy if parent changed
    let updateData = { name, headId, status, settings };
    
    if (parentDepartmentId !== undefined && parentDepartmentId !== existing.parentDepartmentId) {
      if (parentDepartmentId) {
        const parent = await prisma.department.findUnique({
          where: { id: parentDepartmentId }
        });
        
        if (!parent) {
          return res.status(404).json({ error: 'Parent department not found' });
        }
        
        updateData.parentDepartmentId = parentDepartmentId;
        updateData.level = parent.level + 1;
        updateData.path = `${parent.path} > ${name || existing.name}`;
      } else {
        updateData.parentDepartmentId = null;
        updateData.level = 0;
        updateData.path = name || existing.name;
      }
    }

    const department = await prisma.department.update({
      where: { id },
      data: updateData,
      include: {
        parentDepartment: {
          select: { id: true, name: true }
        },
        head: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    // Update path for all sub-departments if hierarchy changed
    if (parentDepartmentId !== undefined && parentDepartmentId !== existing.parentDepartmentId) {
      await updateSubDepartmentPaths(department.id, department.path);
    }

    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Helper function to update sub-department paths recursively
const updateSubDepartmentPaths = async (departmentId, parentPath) => {
  const subDepartments = await prisma.department.findMany({
    where: { parentDepartmentId: departmentId }
  });

  for (const subDept of subDepartments) {
    const newPath = `${parentPath} > ${subDept.name}`;
    await prisma.department.update({
      where: { id: subDept.id },
      data: { path: newPath }
    });
    
    // Recursively update children
    await updateSubDepartmentPaths(subDept.id, newPath);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeCount = await prisma.employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
      return res.status(400).json({ error: 'Cannot delete department with employees' });
    }

    const subDeptCount = await prisma.department.count({ where: { parentDepartmentId: id } });
    if (subDeptCount > 0) {
      return res.status(400).json({ error: 'Cannot delete department with sub-departments' });
    }

    await prisma.department.delete({ where: { id } });

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

const assignDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { headId } = req.body;

    // Verify employee exists and belongs to department
    const employee = await prisma.employee.findUnique({
      where: { id: headId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (employee.departmentId !== id) {
      return res.status(400).json({ error: 'Employee does not belong to this department' });
    }

    const department = await prisma.department.update({
      where: { id },
      data: { headId },
      include: {
        head: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json(department);
  } catch (error) {
    console.error('Assign department head error:', error);
    res.status(500).json({ error: 'Failed to assign department head' });
  }
};

const getDepartmentStats = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            employees: true,
            positions: true,
            subDepartments: true,
            workflows: true,
            policies: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Get employee status breakdown
    const employeesByStatus = await prisma.employee.groupBy({
      by: ['status'],
      where: { departmentId: id },
      _count: true
    });

    // Get total budget including sub-departments
    const getAllSubDepartmentIds = async (deptId) => {
      const subDepts = await prisma.department.findMany({
        where: { parentDepartmentId: deptId },
        select: { id: true }
      });
      
      let ids = [deptId];
      for (const subDept of subDepts) {
        ids = [...ids, ...(await getAllSubDepartmentIds(subDept.id))];
      }
      return ids;
    };

    const allDeptIds = await getAllSubDepartmentIds(id);
    const totalBudget = await prisma.department.aggregate({
      where: { id: { in: allDeptIds } },
      _sum: { budget: true }
    });

    res.json({
      ...department._count,
      employeesByStatus,
      totalBudget: totalBudget._sum.budget || 0,
      directBudget: department.budget || 0
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ error: 'Failed to fetch department statistics' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentHierarchy,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  getDepartmentStats
};
