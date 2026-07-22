const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Company Management
const createCompany = async (req, res) => {
  try {
    const { tenantId, name, code, industry, size, address, contactInfo, website, logo } = req.body;
    
    const company = await prisma.company.create({
      data: {
        tenantId,
        name,
        code,
        industry,
        size,
        address,
        contactInfo,
        website,
        logo,
        status: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30-day trial
      }
    });
    
    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: error.message || 'Failed to create company' });
  }
};

const getCompanies = async (req, res) => {
  try {
    const { tenantId, status } = req.query;
    const where = {};
    
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    
    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            employees: true,
            branches: true,
            departments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch companies' });
  }
};

const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        branches: true,
        locations: true,
        departments: true,
        _count: {
          select: {
            employees: true,
            branches: true,
            departments: true
          }
        }
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch company' });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, size, address, contactInfo, website, logo, status, settings } = req.body;
    
    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        industry,
        size,
        address,
        contactInfo,
        website,
        logo,
        status,
        settings
      }
    });
    
    res.json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: error.message || 'Failed to update company' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.company.delete({
      where: { id }
    });
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete company' });
  }
};

// Branch Management
const createBranch = async (req, res) => {
  try {
    const { companyId, name, code, address, contactInfo, managerId, isHeadquarters } = req.body;
    
    const branch = await prisma.branch.create({
      data: {
        companyId,
        name,
        code,
        address,
        contactInfo,
        managerId,
        isHeadquarters: isHeadquarters || false,
        status: 'ACTIVE'
      }
    });
    
    res.status(201).json(branch);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: error.message || 'Failed to create branch' });
  }
};

const getBranches = async (req, res) => {
  try {
    const { companyId, status } = req.query;
    const where = {};
    
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    
    const branches = await prisma.branch.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            employees: true,
            departments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch branches' });
  }
};

const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        company: true,
        manager: true,
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            employeeId: true
          }
        },
        departments: true,
        locations: true
      }
    });
    
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch branch' });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, address, contactInfo, managerId, status, isHeadquarters } = req.body;
    
    const branch = await prisma.branch.update({
      where: { id },
      data: {
        name,
        code,
        address,
        contactInfo,
        managerId,
        status,
        isHeadquarters
      }
    });
    
    res.json(branch);
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: error.message || 'Failed to update branch' });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.branch.delete({
      where: { id }
    });
    
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete branch' });
  }
};

// Location Management
const createLocation = async (req, res) => {
  try {
    const { companyId, branchId, name, type, address, coordinates, capacity } = req.body;
    
    const location = await prisma.location.create({
      data: {
        companyId,
        branchId,
        name,
        type,
        address,
        coordinates,
        capacity,
        isActive: true
      }
    });
    
    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: error.message || 'Failed to create location' });
  }
};

const getLocations = async (req, res) => {
  try {
    const { companyId, branchId, type, isActive } = req.query;
    const where = {};
    
    if (companyId) where.companyId = companyId;
    if (branchId) where.branchId = branchId;
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const locations = await prisma.location.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch locations' });
  }
};

const getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        company: true,
        branch: true
      }
    });
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch location' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, address, coordinates, capacity, isActive } = req.body;
    
    const location = await prisma.location.update({
      where: { id },
      data: {
        name,
        type,
        address,
        coordinates,
        capacity,
        isActive
      }
    });
    
    res.json(location);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: error.message || 'Failed to update location' });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.location.delete({
      where: { id }
    });
    
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete location' });
  }
};

module.exports = {
  // Company
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  // Branch
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  // Location
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation
};
