const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Shift Templates
const createShiftTemplate = async (req, res) => {
  try {
    const { companyId, departmentId, name, description, type, startTime, endTime, duration, breakPeriods, gracePeriodStart, gracePeriodEnd, rotationPattern, rotationDays, rotationCycle, color } = req.body;

    const template = await prisma.shiftTemplate.create({
      data: {
        companyId,
        departmentId,
        name,
        description,
        type,
        startTime,
        endTime,
        duration,
        breakPeriods,
        gracePeriodStart,
        gracePeriodEnd,
        rotationPattern,
        rotationDays,
        rotationCycle,
        color
      }
    });

    res.json(template);
  } catch (error) {
    console.error('Create shift template error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shift template' });
  }
};

const updateShiftTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, startTime, endTime, duration, breakPeriods, gracePeriodStart, gracePeriodEnd, rotationPattern, rotationDays, rotationCycle, color, status } = req.body;

    const template = await prisma.shiftTemplate.update({
      where: { id },
      data: {
        name,
        description,
        type,
        startTime,
        endTime,
        duration,
        breakPeriods,
        gracePeriodStart,
        gracePeriodEnd,
        rotationPattern,
        rotationDays,
        rotationCycle,
        color,
        status
      }
    });

    res.json(template);
  } catch (error) {
    console.error('Update shift template error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift template' });
  }
};

const deleteShiftTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shiftTemplate.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete shift template error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shift template' });
  }
};

const getShiftTemplates = async (req, res) => {
  try {
    const { companyId, departmentId, type, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (type) where.type = type;
    if (status) where.status = status;

    const templates = await prisma.shiftTemplate.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        },
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(templates);
  } catch (error) {
    console.error('Get shift templates error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift templates' });
  }
};

// Shift Assignments
const assignShift = async (req, res) => {
  try {
    const { templateId, employeeId, startDate, endDate } = req.body;

    const assignment = await prisma.shiftAssignment.create({
      data: {
        templateId,
        employeeId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      },
      include: {
        template: {
          select: {
            name: true,
            type: true,
            startTime: true,
            endTime: true
          }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Assign shift error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign shift' });
  }
};

const updateShiftAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { endDate, isActive } = req.body;

    const assignment = await prisma.shiftAssignment.update({
      where: { id },
      data: {
        endDate: endDate ? new Date(endDate) : null,
        isActive
      }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Update shift assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift assignment' });
  }
};

const removeShiftAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shiftAssignment.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove shift assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove shift assignment' });
  }
};

const getShiftAssignments = async (req, res) => {
  try {
    const { templateId, employeeId, isActive } = req.query;
    const where = {};

    if (templateId) where.templateId = templateId;
    if (employeeId) where.employeeId = employeeId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const assignments = await prisma.shiftAssignment.findMany({
      where,
      include: {
        template: {
          select: {
            name: true,
            type: true,
            startTime: true,
            endTime: true
          }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get shift assignments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift assignments' });
  }
};

// Shift Rotations
const createShiftRotation = async (req, res) => {
  try {
    const { templateId, name, description, pattern, cycleDays, rotationSchedule, autoAssign, autoAssignRules } = req.body;

    const rotation = await prisma.shiftRotation.create({
      data: {
        templateId,
        name,
        description,
        pattern,
        cycleDays,
        rotationSchedule,
        autoAssign,
        autoAssignRules
      }
    });

    res.json(rotation);
  } catch (error) {
    console.error('Create shift rotation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shift rotation' });
  }
};

const updateShiftRotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, pattern, cycleDays, rotationSchedule, autoAssign, autoAssignRules } = req.body;

    const rotation = await prisma.shiftRotation.update({
      where: { id },
      data: {
        name,
        description,
        pattern,
        cycleDays,
        rotationSchedule,
        autoAssign,
        autoAssignRules
      }
    });

    res.json(rotation);
  } catch (error) {
    console.error('Update shift rotation error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift rotation' });
  }
};

const deleteShiftRotation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shiftRotation.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete shift rotation error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shift rotation' });
  }
};

const getShiftRotations = async (req, res) => {
  try {
    const { templateId, pattern } = req.query;
    const where = {};

    if (templateId) where.templateId = templateId;
    if (pattern) where.pattern = pattern;

    const rotations = await prisma.shiftRotation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(rotations);
  } catch (error) {
    console.error('Get shift rotations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift rotations' });
  }
};

// Shift Schedules
const generateShiftSchedule = async (req, res) => {
  try {
    const { templateId, employeeId, startDate, endDate } = req.body;

    const template = await prisma.shiftTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Shift template not found' });
    }

    // Generate schedules based on template
    const start = new Date(startDate);
    const end = new Date(endDate);
    const schedules = [];

    let currentDate = new Date(start);
    while (currentDate <= end) {
      const scheduledStart = new Date(currentDate);
      const [startHours, startMinutes] = template.startTime.split(':');
      scheduledStart.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const scheduledEnd = new Date(currentDate);
      const [endHours, endMinutes] = template.endTime.split(':');
      scheduledEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      // Handle overnight shifts
      if (scheduledEnd < scheduledStart) {
        scheduledEnd.setDate(scheduledEnd.getDate() + 1);
      }

      const schedule = await prisma.shiftSchedule.create({
        data: {
          templateId,
          employeeId,
          scheduledDate: currentDate,
          scheduledStart,
          scheduledEnd
        }
      });

      schedules.push(schedule);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json(schedules);
  } catch (error) {
    console.error('Generate shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate shift schedule' });
  }
};

const updateShiftSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualStart, actualEnd, status, notes } = req.body;

    const schedule = await prisma.shiftSchedule.update({
      where: { id },
      data: {
        actualStart: actualStart ? new Date(actualStart) : null,
        actualEnd: actualEnd ? new Date(actualEnd) : null,
        status,
        notes
      }
    });

    res.json(schedule);
  } catch (error) {
    console.error('Update shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift schedule' });
  }
};

const deleteShiftSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shiftSchedule.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shift schedule' });
  }
};

const getShiftSchedules = async (req, res) => {
  try {
    const { templateId, employeeId, startDate, endDate, status } = req.query;
    const where = {};

    if (templateId) where.templateId = templateId;
    if (employeeId) where.employeeId = employeeId;
    if (startDate) where.scheduledDate = { gte: new Date(startDate) };
    if (endDate) where.scheduledDate = { lte: new Date(endDate) };
    if (status) where.status = status;

    const schedules = await prisma.shiftSchedule.findMany({
      where,
      include: {
        template: {
          select: {
            name: true,
            type: true,
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy: { scheduledDate: 'asc' }
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get shift schedules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift schedules' });
  }
};

// Department Shift Configuration
const getDepartmentShiftConfiguration = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const templates = await prisma.shiftTemplate.findMany({
      where: { departmentId },
      orderBy: { createdAt: 'desc' }
    });

    const assignments = await prisma.shiftAssignment.findMany({
      where: {
        template: { departmentId }
      },
      include: {
        template: {
          select: {
            name: true,
            type: true,
            startTime: true,
            endTime: true
          }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      templates,
      assignments
    });
  } catch (error) {
    console.error('Get department shift configuration error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department shift configuration' });
  }
};

module.exports = {
  // Shift Templates
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  getShiftTemplates,
  // Shift Assignments
  assignShift,
  updateShiftAssignment,
  removeShiftAssignment,
  getShiftAssignments,
  // Shift Rotations
  createShiftRotation,
  updateShiftRotation,
  deleteShiftRotation,
  getShiftRotations,
  // Shift Schedules
  generateShiftSchedule,
  updateShiftSchedule,
  deleteShiftSchedule,
  getShiftSchedules,
  // Department Configuration
  getDepartmentShiftConfiguration
};
