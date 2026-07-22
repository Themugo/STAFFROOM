const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Attendance vs Roster Reconciliation
const createAttendanceReconciliation = async (req, res) => {
  try {
    const { companyId, employeeId, scheduledDate, scheduledTime, actualCheckIn, actualCheckOut, rosterAssignmentId, attendanceId } = req.body;

    // Calculate variance
    const scheduledDateTime = new Date(scheduledTime);
    const actualCheckInTime = actualCheckIn ? new Date(actualCheckIn) : null;
    
    let varianceMinutes = 0;
    let status = 'MATCHED';
    let latenessMinutes = 0;
    let overtimeHours = 0;
    let compensationCredits = 0;
    let owedHours = 0;

    if (actualCheckInTime) {
      varianceMinutes = Math.round((actualCheckInTime - scheduledDateTime) / (1000 * 60));
      
      if (varianceMinutes > 0) {
        status = 'LATE';
        latenessMinutes = varianceMinutes;
        owedHours = varianceMinutes / 60;
      } else if (varianceMinutes < 0) {
        status = 'EARLY';
      }

      // Calculate overtime if check out is provided
      if (actualCheckOut) {
        const actualCheckOutTime = new Date(actualCheckOut);
        const shiftDuration = 8 * 60; // Assuming 8-hour shift
        const actualDuration = Math.round((actualCheckOutTime - actualCheckInTime) / (1000 * 60));
        
        if (actualDuration > shiftDuration) {
          status = 'OVERTIME';
          overtimeHours = (actualDuration - shiftDuration) / 60;
          compensationCredits = overtimeHours; // 1 hour overtime = 1 credit
        }
      }
    } else {
      status = 'ABSENT';
      owedHours = 8; // Default 8 hours owed for absence
    }

    const reconciliation = await prisma.attendanceReconciliation.create({
      data: {
        companyId,
        employeeId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime: new Date(scheduledTime),
        actualCheckIn: actualCheckIn ? new Date(actualCheckIn) : null,
        actualCheckOut: actualCheckOut ? new Date(actualCheckOut) : null,
        varianceMinutes,
        status,
        latenessMinutes,
        overtimeHours,
        compensationCredits,
        owedHours,
        rosterAssignmentId,
        attendanceId
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

    res.json(reconciliation);
  } catch (error) {
    console.error('Create attendance reconciliation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create attendance reconciliation' });
  }
};

const updateAttendanceReconciliation = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualCheckIn, actualCheckOut, status } = req.body;

    const reconciliation = await prisma.attendanceReconciliation.update({
      where: { id },
      data: {
        actualCheckIn: actualCheckIn ? new Date(actualCheckIn) : undefined,
        actualCheckOut: actualCheckOut ? new Date(actualCheckOut) : undefined,
        status
      }
    });

    res.json(reconciliation);
  } catch (error) {
    console.error('Update attendance reconciliation error:', error);
    res.status(500).json({ error: error.message || 'Failed to update attendance reconciliation' });
  }
};

const deleteAttendanceReconciliation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.attendanceReconciliation.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete attendance reconciliation error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete attendance reconciliation' });
  }
};

const getAttendanceReconciliations = async (req, res) => {
  try {
    const { companyId, employeeId, scheduledDate, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (scheduledDate) where.scheduledDate = new Date(scheduledDate);
    if (status) where.status = status;

    const reconciliations = await prisma.attendanceReconciliation.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { scheduledDate: 'desc' }
    });

    res.json(reconciliations);
  } catch (error) {
    console.error('Get attendance reconciliations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance reconciliations' });
  }
};

// Enterprise Workforce Planning
const createWorkforceForecast = async (req, res) => {
  try {
    const { companyId, departmentId, branchId, shiftTemplateId, period, startDate, endDate, requiredStaff, currentStaff, skillRequired, skillCurrent, skillGap, details } = req.body;

    const gap = requiredStaff - currentStaff;

    const forecast = await prisma.workforceForecast.create({
      data: {
        companyId,
        departmentId,
        branchId,
        shiftTemplateId,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        requiredStaff,
        currentStaff,
        gap,
        skillRequired,
        skillCurrent,
        skillGap,
        details
      },
      include: {
        department: {
          select: { name: true }
        }
      }
    });

    res.json(forecast);
  } catch (error) {
    console.error('Create workforce forecast error:', error);
    res.status(500).json({ error: error.message || 'Failed to create workforce forecast' });
  }
};

const updateWorkforceForecast = async (req, res) => {
  try {
    const { id } = req.params;
    const { requiredStaff, currentStaff, skillCurrent, skillGap, details } = req.body;

    const gap = requiredStaff ? requiredStaff - (currentStaff || 0) : undefined;

    const forecast = await prisma.workforceForecast.update({
      where: { id },
      data: {
        requiredStaff,
        currentStaff,
        gap,
        skillCurrent,
        skillGap,
        details
      }
    });

    res.json(forecast);
  } catch (error) {
    console.error('Update workforce forecast error:', error);
    res.status(500).json({ error: error.message || 'Failed to update workforce forecast' });
  }
};

const deleteWorkforceForecast = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workforceForecast.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete workforce forecast error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete workforce forecast' });
  }
};

const getWorkforceForecasts = async (req, res) => {
  try {
    const { companyId, departmentId, branchId, period, startDate, endDate } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (branchId) where.branchId = branchId;
    if (period) where.period = period;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const forecasts = await prisma.workforceForecast.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json(forecasts);
  } catch (error) {
    console.error('Get workforce forecasts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workforce forecasts' });
  }
};

const getWorkforcePlanningSummary = async (req, res) => {
  try {
    const { companyId, departmentId, branchId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (branchId) where.branchId = branchId;

    // Get all forecasts
    const forecasts = await prisma.workforceForecast.findMany({
      where,
      orderBy: { startDate: 'desc' }
    });

    // Calculate summary
    let totalRequiredStaff = 0;
    let totalCurrentStaff = 0;
    let totalGap = 0;
    let skillGaps = [];

    forecasts.forEach(forecast => {
      totalRequiredStaff += forecast.requiredStaff;
      totalCurrentStaff += forecast.currentStaff;
      totalGap += forecast.gap;

      if (forecast.skillRequired && forecast.skillGap) {
        skillGaps.push({
          skill: forecast.skillRequired,
          gap: forecast.skillGap
        });
      }
    });

    res.json({
      totalRequiredStaff,
      totalCurrentStaff,
      totalGap,
      skillGaps,
      forecastCount: forecasts.length
    });
  } catch (error) {
    console.error('Get workforce planning summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workforce planning summary' });
  }
};

module.exports = {
  // Attendance Reconciliation
  createAttendanceReconciliation,
  updateAttendanceReconciliation,
  deleteAttendanceReconciliation,
  getAttendanceReconciliations,
  // Workforce Planning
  createWorkforceForecast,
  updateWorkforceForecast,
  deleteWorkforceForecast,
  getWorkforceForecasts,
  getWorkforcePlanningSummary
};
