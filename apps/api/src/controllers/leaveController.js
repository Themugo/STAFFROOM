const { prisma } = require('../config/database');

const getAllLeaves = async (req, res) => {
  try {
    const { status, employeeId, type } = req.query;

    const where = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;
    if (type) where.type = type;

    const leaves = await prisma.leave.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leave = await prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      }
    });

    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json(leave);
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
};

const createLeave = async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        type,
        startDate: start,
        endDate: end,
        days,
        reason,
        status: 'PENDING'
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
};

const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date()
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    res.json(leave);
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Failed to approve leave request' });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    res.json(leave);
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ error: 'Failed to reject leave request' });
  }
};

const getLeaveStats = async (req, res) => {
  try {
    const pending = await prisma.leave.count({ where: { status: 'PENDING' } });
    const approved = await prisma.leave.count({ where: { status: 'APPROVED' } });
    const rejected = await prisma.leave.count({ where: { status: 'REJECTED' } });

    const byType = await prisma.leave.groupBy({
      by: ['type'],
      _count: true
    });

    res.json({
      pending,
      approved,
      rejected,
      byType: byType.map(t => ({ type: t.type, count: t._count }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getAllLeaves,
  getLeaveById,
  createLeave,
  approveLeave,
  rejectLeave,
  getLeaveStats
};
