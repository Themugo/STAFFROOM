const prisma = require('../config/database');

class DepartmentService {
  async getAllDepartments(filters = {}) {
    const { includeHierarchy = false, status } = filters;

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

    return departments;
  }

  async getDepartmentHierarchy() {
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

    return buildTree();
  }

  async getDepartmentById(id) {
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

    return department;
  }

  async createDepartment(data) {
    const { name, code, description, location, budget, parentDepartmentId, headId, settings } = data;

    // Calculate hierarchy level and path
    let level = 0;
    let path = name;
    
    if (parentDepartmentId) {
      const parent = await prisma.department.findUnique({
        where: { id: parentDepartmentId }
      });
      
      if (!parent) {
        throw new Error('Parent department not found');
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

    return department;
  }

  async updateDepartment(id, data) {
    const { name, parentDepartmentId, headId, status, settings } = data;

    // Check if department exists
    const existing = await prisma.department.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new Error('Department not found');
    }

    // Update hierarchy if parent changed
    let updateData = { name, headId, status, settings };
    
    if (parentDepartmentId !== undefined && parentDepartmentId !== existing.parentDepartmentId) {
      if (parentDepartmentId) {
        const parent = await prisma.department.findUnique({
          where: { id: parentDepartmentId }
        });
        
        if (!parent) {
          throw new Error('Parent department not found');
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
      await this.updateSubDepartmentPaths(department.id, department.path);
    }

    return department;
  }

  async updateSubDepartmentPaths(departmentId, parentPath) {
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
      await this.updateSubDepartmentPaths(subDept.id, newPath);
    }
  }

  async deleteDepartment(id) {
    const employeeCount = await prisma.employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
      throw new Error('Cannot delete department with employees');
    }

    const subDeptCount = await prisma.department.count({ where: { parentDepartmentId: id } });
    if (subDeptCount > 0) {
      throw new Error('Cannot delete department with sub-departments');
    }

    await prisma.department.delete({ where: { id } });

    return { message: 'Department deleted successfully' };
  }

  async assignDepartmentHead(id, headId) {
    // Verify employee exists and belongs to department
    const employee = await prisma.employee.findUnique({
      where: { id: headId }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    if (employee.departmentId !== id) {
      throw new Error('Employee does not belong to this department');
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

    return department;
  }

  async getDepartmentStats(id) {
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
      throw new Error('Department not found');
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

    return {
      ...department._count,
      employeesByStatus,
      totalBudget: totalBudget._sum.budget || 0,
      directBudget: department.budget || 0
    };
  }
}

module.exports = new DepartmentService();
