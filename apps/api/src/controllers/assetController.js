const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Asset Management
const createAsset = async (req, res) => {
  try {
    const { companyId, branchId, type, name, description, serialNumber, assetTag, barcode, brand, model, year, color, purchaseDate, purchaseCost, currentValue, location, departmentId, specifications, accessories, warrantyExpiry, imageUrl, notes } = req.body;

    const asset = await prisma.asset.create({
      data: {
        companyId,
        branchId,
        type,
        name,
        description,
        serialNumber,
        assetTag,
        barcode,
        brand,
        model,
        year,
        color,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchaseCost,
        currentValue,
        location,
        departmentId,
        specifications,
        accessories,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
        imageUrl,
        notes
      }
    });

    res.json(asset);
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: error.message || 'Failed to create asset' });
  }
};

const getAssets = async (req, res) => {
  try {
    const { companyId, branchId, type, status, departmentId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (branchId) where.branchId = branchId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;

    const assets = await prisma.asset.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        },
        assignments: {
          where: { status: 'ACTIVE' },
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeId: true
              }
            }
          }
        },
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch assets' });
  }
};

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, location, departmentId, currentValue, specifications, accessories, warrantyExpiry, lastMaintenance, nextMaintenance, imageUrl, notes } = req.body;

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name,
        description,
        status,
        location,
        departmentId,
        currentValue,
        specifications,
        accessories,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : undefined,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : undefined,
        imageUrl,
        notes
      }
    });

    res.json(asset);
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ error: error.message || 'Failed to update asset' });
  }
};

// Asset Assignment
const assignAsset = async (req, res) => {
  try {
    const { assetId, employeeId, companyId, assignedBy, expectedReturn, conditionOnAssignment, notes } = req.body;

    // Update asset status
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: 'ASSIGNED' }
    });

    const assignment = await prisma.assetAssignment.create({
      data: {
        assetId,
        employeeId,
        companyId,
        assignedBy,
        expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
        conditionOnAssignment,
        notes
      }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Assign asset error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign asset' });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { assetId, employeeId, companyId, status } = req.query;
    const where = {};

    if (assetId) where.assetId = assetId;
    if (employeeId) where.employeeId = employeeId;
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;

    const assignments = await prisma.assetAssignment.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            type: true,
            serialNumber,
            assetTag: true
          }
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch assignments' });
  }
};

const returnAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnedBy, conditionOnReturn, notes } = req.body;

    const assignment = await prisma.assetAssignment.update({
      where: { id },
      data: {
        status: 'RETURNED',
        returnedAt: new Date(),
        returnedBy,
        conditionOnReturn,
        notes
      }
    });

    // Update asset status
    await prisma.asset.update({
      where: { id: assignment.assetId },
      data: { status: 'AVAILABLE' }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Return asset error:', error);
    res.status(500).json({ error: error.message || 'Failed to return asset' });
  }
};

// Asset Audit
const createAudit = async (req, res) => {
  try {
    const { assetId, companyId, auditorId, scheduledDate } = req.body;

    const audit = await prisma.assetAudit.create({
      data: {
        assetId,
        companyId,
        auditorId,
        scheduledDate: new Date(scheduledDate)
      }
    });

    res.json(audit);
  } catch (error) {
    console.error('Create audit error:', error);
    res.status(500).json({ error: error.message || 'Failed to create audit' });
  }
};

const getAudits = async (req, res) => {
  try {
    const { assetId, companyId, auditorId, status } = req.query;
    const where = {};

    if (assetId) where.assetId = assetId;
    if (companyId) where.companyId = companyId;
    if (auditorId) where.auditorId = auditorId;
    if (status) where.status = status;

    const audits = await prisma.assetAudit.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            type: true,
            serialNumber,
            assetTag: true
          }
        }
      },
      orderBy: { scheduledDate: 'desc' }
    });

    res.json(audits);
  } catch (error) {
    console.error('Get audits error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch audits' });
  }
};

const completeAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, issues, recommendations, photos, notes } = req.body;

    const audit = await prisma.assetAudit.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        condition,
        issues,
        recommendations,
        photos,
        notes
      }
    });

    // Update asset status if issues found
    if (issues && issues.length > 0) {
      await prisma.asset.update({
        where: { id: audit.assetId },
        data: { status: 'MAINTENANCE' }
      });
    }

    res.json(audit);
  } catch (error) {
    console.error('Complete audit error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete audit' });
  }
};

// Asset Dashboard Summary
const getAssetSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get asset statistics by type
    const assetsByType = await prisma.asset.groupBy({
      by: ['type', 'status'],
      where: { companyId },
      _count: true
    });

    // Get assignment statistics
    const activeAssignments = await prisma.assetAssignment.count({
      where: { companyId, status: 'ACTIVE' }
    });

    const overdueAssignments = await prisma.assetAssignment.count({
      where: {
        companyId,
        status: 'ACTIVE',
        expectedReturn: {
          lt: new Date()
        }
      }
    });

    // Get audit statistics
    const pendingAudits = await prisma.assetAudit.count({
      where: { companyId, status: 'SCHEDULED' }
    });

    const overdueAudits = await prisma.assetAudit.count({
      where: {
        companyId,
        status: 'SCHEDULED',
        scheduledDate: {
          lt: new Date()
        }
      }
    });

    // Get total asset value
    const assets = await prisma.asset.findMany({
      where: { companyId },
      select: { currentValue: true }
    });

    const totalValue = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);

    // Get assets needing maintenance
    const maintenanceNeeded = await prisma.asset.count({
      where: {
        companyId,
        status: 'MAINTENANCE'
      }
    });

    // Get expiring warranties
    const expiringWarranties = await prisma.asset.count({
      where: {
        companyId,
        warrantyExpiry: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiring within 30 days
          gte: new Date()
        }
      }
    });

    res.json({
      assetsByType,
      assignments: {
        active: activeAssignments,
        overdue: overdueAssignments
      },
      audits: {
        pending: pendingAudits,
        overdue: overdueAudits
      },
      value: {
        total: totalValue
      },
      maintenance: {
        needed: maintenanceNeeded
      },
      warranties: {
        expiring: expiringWarranties
      }
    });
  } catch (error) {
    console.error('Get asset summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch asset summary' });
  }
};

module.exports = {
  // Asset Management
  createAsset,
  getAssets,
  updateAsset,
  // Asset Assignment
  assignAsset,
  getAssignments,
  returnAsset,
  // Asset Audit
  createAudit,
  getAudits,
  completeAudit,
  // Dashboard
  getAssetSummary
};
