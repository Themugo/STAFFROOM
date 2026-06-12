const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Workforce Balancing Engine
const calculateWorkforceBalance = async (req, res) => {
  try {
    const { companyId, departmentId, date, shiftTemplateId } = req.body;

    // Get required staff from shift template or department settings
    let requiredStaff = 5; // Default fallback
    if (shiftTemplateId) {
      const shiftTemplate = await prisma.shiftTemplate.findUnique({
        where: { id: shiftTemplateId }
      });
      if (shiftTemplate && shiftTemplate.requiredStaff) {
        requiredStaff = shiftTemplate.requiredStaff;
      }
    }

    // Get assigned staff from roster assignments
    const assignedStaff = await prisma.rosterAssignment.count({
      where: {
        rosterDate: new Date(date),
        ...(shiftTemplateId && { shiftTemplateId })
      }
    });

    // Calculate gap
    const gap = requiredStaff - assignedStaff;

    // Determine status
    let status = 'BALANCED';
    if (gap > 0) {
      status = 'UNDERSTAFFED';
    } else if (gap < 0) {
      status = 'OVERSTAFFED';
    }

    // Create or update workforce balance record
    const balance = await prisma.workforceBalance.upsert({
      where: {
        departmentId_date_shiftTemplateId: {
          departmentId,
          date: new Date(date),
          shiftTemplateId: shiftTemplateId || null
        }
      },
      update: {
        requiredStaff,
        assignedStaff,
        gap,
        status
      },
      create: {
        companyId,
        departmentId,
        shiftTemplateId,
        date: new Date(date),
        requiredStaff,
        assignedStaff,
        gap,
        status
      }
    });

    res.json(balance);
  } catch (error) {
    console.error('Calculate workforce balance error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate workforce balance' });
  }
};

const getWorkforceBalances = async (req, res) => {
  try {
    const { companyId, departmentId, date, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const balances = await prisma.workforceBalance.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(balances);
  } catch (error) {
    console.error('Get workforce balances error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workforce balances' });
  }
};

// Department Communication Hub
const createDepartmentPost = async (req, res) => {
  try {
    const { companyId, departmentId, type, title, content, authorId, pollOptions, fileUrl, fileName, fileSize, meetingDate, meetingAttendees, isPinned } = req.body;

    const post = await prisma.departmentPost.create({
      data: {
        companyId,
        departmentId,
        type,
        title,
        content,
        authorId,
        pollOptions,
        fileUrl,
        fileName,
        fileSize,
        meetingDate: meetingDate ? new Date(meetingDate) : null,
        meetingAttendees,
        isPinned
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Create department post error:', error);
    res.status(500).json({ error: error.message || 'Failed to create department post' });
  }
};

const updateDepartmentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, pollOptions, isPinned } = req.body;

    const post = await prisma.departmentPost.update({
      where: { id },
      data: {
        title,
        content,
        pollOptions,
        isPinned
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Update department post error:', error);
    res.status(500).json({ error: error.message || 'Failed to update department post' });
  }
};

const deleteDepartmentPost = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.departmentPost.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete department post error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete department post' });
  }
};

const getDepartmentPosts = async (req, res) => {
  try {
    const { companyId, departmentId, type, isPinned } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (type) where.type = type;
    if (isPinned !== undefined) where.isPinned = isPinned === 'true';

    const posts = await prisma.departmentPost.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        department: {
          select: { name: true }
        }
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
    });

    res.json(posts);
  } catch (error) {
    console.error('Get department posts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department posts' });
  }
};

const likeDepartmentPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.departmentPost.update({
      where: { id },
      data: {
        likes: { increment: 1 }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Like department post error:', error);
    res.status(500).json({ error: error.message || 'Failed to like department post' });
  }
};

const createDepartmentComment = async (req, res) => {
  try {
    const { postId, authorId, content } = req.body;

    const comment = await prisma.departmentComment.create({
      data: {
        postId,
        authorId,
        content
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Update post comment count
    await prisma.departmentPost.update({
      where: { id: postId },
      data: {
        comments: { increment: 1 }
      }
    });

    res.json(comment);
  } catch (error) {
    console.error('Create department comment error:', error);
    res.status(500).json({ error: error.message || 'Failed to create department comment' });
  }
};

const getDepartmentComments = async (req, res) => {
  try {
    const { postId } = req.query;
    const where = {};

    if (postId) where.postId = postId;

    const comments = await prisma.departmentComment.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(comments);
  } catch (error) {
    console.error('Get department comments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department comments' });
  }
};

// HOD Command Center
const getHODCommandCenter = async (req, res) => {
  try {
    const { departmentId, date } = req.query;

    const targetDate = date ? new Date(date) : new Date();

    // Get present today (clocked in today)
    const presentToday = await prisma.employeeShift.count({
      where: {
        employee: {
          departmentId
        },
        date: targetDate,
        status: 'PRESENT'
      }
    });

    // Get on leave today
    const onLeave = await prisma.leaveTransaction.count({
      where: {
        employee: {
          departmentId
        },
        startDate: { lte: targetDate },
        endDate: { gte: targetDate },
        status: 'APPROVED'
      }
    });

    // Get late arrivals today
    const lateArrivals = await prisma.employeeShift.count({
      where: {
        employee: {
          departmentId
        },
        date: targetDate,
        isLate: true
      }
    });

    // Get overtime hours this month
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const overtimeRecords = await prisma.employeeShift.findMany({
      where: {
        employee: {
          departmentId
        },
        date: { gte: monthStart },
        overtimeHours: { gt: 0 }
      },
      select: {
        overtimeHours: true
      }
    });

    const totalOvertimeHours = overtimeRecords.reduce((sum, record) => sum + record.overtimeHours, 0);

    // Get pending approvals (leave requests, etc.)
    const pendingApprovals = await prisma.leaveTransaction.count({
      where: {
        employee: {
          departmentId
        },
        status: 'PENDING'
      }
    });

    // Get roster coverage for today
    const workforceBalances = await prisma.workforceBalance.findMany({
      where: {
        departmentId,
        date: targetDate
      }
    });

    const rosterCoverage = workforceBalances.map(balance => ({
      shift: balance.shiftTemplateId,
      required: balance.requiredStaff,
      assigned: balance.assignedStaff,
      gap: balance.gap,
      status: balance.status
    }));

    res.json({
      presentToday,
      onLeave,
      lateArrivals,
      overtimeHours: totalOvertimeHours,
      pendingApprovals,
      rosterCoverage,
      date: targetDate
    });
  } catch (error) {
    console.error('Get HOD command center error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch HOD command center data' });
  }
};

module.exports = {
  // Workforce Balancing
  calculateWorkforceBalance,
  getWorkforceBalances,
  // Department Communication Hub
  createDepartmentPost,
  updateDepartmentPost,
  deleteDepartmentPost,
  getDepartmentPosts,
  likeDepartmentPost,
  createDepartmentComment,
  getDepartmentComments,
  // HOD Command Center
  getHODCommandCenter
};
