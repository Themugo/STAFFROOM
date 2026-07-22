const departmentService = require('../services/departmentService');

const getAllDepartments = async (req, res) => {
  try {
    const { includeHierarchy, status } = req.query;
    const departments = await departmentService.getAllDepartments({ 
      includeHierarchy: includeHierarchy === 'true', 
      status 
    });
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch departments' });
  }
};

const getDepartmentHierarchy = async (req, res) => {
  try {
    const hierarchy = await departmentService.getDepartmentHierarchy();
    res.json(hierarchy);
  } catch (error) {
    console.error('Get department hierarchy error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department hierarchy' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: error.message || 'Failed to create department' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentService.updateDepartment(id, req.body);
    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: error.message || 'Failed to update department' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await departmentService.deleteDepartment(id);
    res.json(result);
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete department' });
  }
};

const assignDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { headId } = req.body;
    const department = await departmentService.assignDepartmentHead(id, headId);
    res.json(department);
  } catch (error) {
    console.error('Assign department head error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign department head' });
  }
};

const getDepartmentStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await departmentService.getDepartmentStats(id);
    res.json(stats);
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department statistics' });
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
