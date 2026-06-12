const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Shift Swap Management
const createShiftSwapRequest = async (req, res) => {
  try {
    const { companyId, departmentId, requesterId, targetEmployeeId, requesterShiftDate, requesterShiftTemplateId, targetShiftDate, targetShiftTemplateId, reason } = req.body;

    const swapRequest = await prisma.shiftSwapRequest.create({
      data: {
        companyId,
        departmentId,
        requesterId,
        targetEmployeeId,
        requesterShiftDate: new Date(requesterShiftDate),
        requesterShiftTemplateId,
        targetShiftDate: new Date(targetShiftDate),
        targetShiftTemplateId,
        reason
      },
      include: {
        requester: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        targetEmployee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(swapRequest);
  } catch (error) {
    console.error('Create shift swap request error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shift swap request' });
  }
};

const updateShiftSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisorId, supervisorNotes, approvedBy, status, rejectionReason } = req.body;

    const updateData = {
      status,
      supervisorId,
      supervisorNotes,
      supervisorReviewAt: supervisorId ? new Date() : undefined
    };

    if (status === 'APPROVED') {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    } else if (status === 'REJECTED') {
      updateData.rejectionReason = rejectionReason;
    }

    const swapRequest = await prisma.shiftSwapRequest.update({
      where: { id },
      data: updateData
    });

    // If approved, update roster
    if (status === 'APPROVED') {
      // Get the swap request details
      const request = await prisma.shiftSwapRequest.findUnique({
        where: { id }
      });

      // Update roster assignments
      await prisma.rosterAssignment.updateMany({
        where: {
          employeeId: request.requesterId,
          rosterDate: request.requesterShiftDate
        },
        data: {
          employeeId: request.targetEmployeeId
        }
      });

      await prisma.rosterAssignment.updateMany({
        where: {
          employeeId: request.targetEmployeeId,
          rosterDate: request.targetShiftDate
        },
        data: {
          employeeId: request.requesterId
        }
      });

      // Mark roster as updated
      await prisma.shiftSwapRequest.update({
        where: { id },
        data: {
          rosterUpdated: true,
          rosterUpdatedAt: new Date()
        }
      });
    }

    res.json(swapRequest);
  } catch (error) {
    console.error('Update shift swap request error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift swap request' });
  }
};

const deleteShiftSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shiftSwapRequest.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete shift swap request error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shift swap request' });
  }
};

const getShiftSwapRequests = async (req, res) => {
  try {
    const { companyId, departmentId, requesterId, targetEmployeeId, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (requesterId) where.requesterId = requesterId;
    if (targetEmployeeId) where.targetEmployeeId = targetEmployeeId;
    if (status) where.status = status;

    const swapRequests = await prisma.shiftSwapRequest.findMany({
      where,
      include: {
        requester: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        targetEmployee: {
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
      orderBy: { createdAt: 'desc' }
    });

    res.json(swapRequests);
  } catch (error) {
    console.error('Get shift swap requests error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift swap requests' });
  }
};

// Coverage Planning
const createCoverageWarning = async (req, res) => {
  try {
    const { companyId, departmentId, shiftTemplateId, date, warningType, skillRequired, skillMissing, severity, description } = req.body;

    const warning = await prisma.coverageWarning.create({
      data: {
        companyId,
        departmentId,
        shiftTemplateId,
        date: new Date(date),
        warningType,
        skillRequired,
        skillMissing,
        severity,
        description
      }
    });

    res.json(warning);
  } catch (error) {
    console.error('Create coverage warning error:', error);
    res.status(500).json({ error: error.message || 'Failed to create coverage warning' });
  }
};

const updateCoverageWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { isResolved, resolutionNotes } = req.body;

    const warning = await prisma.coverageWarning.update({
      where: { id },
      data: {
        isResolved,
        resolvedAt: isResolved ? new Date() : undefined,
        resolutionNotes
      }
    });

    res.json(warning);
  } catch (error) {
    console.error('Update coverage warning error:', error);
    res.status(500).json({ error: error.message || 'Failed to update coverage warning' });
  }
};

const deleteCoverageWarning = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.coverageWarning.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete coverage warning error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete coverage warning' });
  }
};

const getCoverageWarnings = async (req, res) => {
  try {
    const { companyId, departmentId, date, warningType, isResolved } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (date) where.date = new Date(date);
    if (warningType) where.warningType = warningType;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';

    const warnings = await prisma.coverageWarning.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        }
      },
      orderBy: [{ isResolved: 'asc' }, { severity: 'desc' }, { createdAt: 'desc' }]
    });

    res.json(warnings);
  } catch (error) {
    console.error('Get coverage warnings error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch coverage warnings' });
  }
};

// Workforce Calendar
const createCalendarEvent = async (req, res) => {
  try {
    const { companyId, departmentId, type, title, description, startDate, endDate, employeeId, referenceType, referenceId, location, color, isAllDay, isRecurring, recurrenceRule } = req.body;

    const event = await prisma.workforceCalendarEvent.create({
      data: {
        companyId,
        departmentId,
        type,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        employeeId,
        referenceType,
        referenceId,
        location,
        color,
        isAllDay,
        isRecurring,
        recurrenceRule
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({ error: error.message || 'Failed to create calendar event' });
  }
};

const updateCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, location, color, isAllDay, isRecurring, recurrenceRule } = req.body;

    const event = await prisma.workforceCalendarEvent.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        color,
        isAllDay,
        isRecurring,
        recurrenceRule
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({ error: error.message || 'Failed to update calendar event' });
  }
};

const deleteCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workforceCalendarEvent.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete calendar event' });
  }
};

const getCalendarEvents = async (req, res) => {
  try {
    const { companyId, departmentId, employeeId, type, startDate, endDate } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (employeeId) where.employeeId = employeeId;
    if (type) where.type = type;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const events = await prisma.workforceCalendarEvent.findMany({
      where,
      include: {
        employee: {
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
      orderBy: { startDate: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch calendar events' });
  }
};

module.exports = {
  // Shift Swap Management
  createShiftSwapRequest,
  updateShiftSwapRequest,
  deleteShiftSwapRequest,
  getShiftSwapRequests,
  // Coverage Planning
  createCoverageWarning,
  updateCoverageWarning,
  deleteCoverageWarning,
  getCoverageWarnings,
  // Workforce Calendar
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents
};
