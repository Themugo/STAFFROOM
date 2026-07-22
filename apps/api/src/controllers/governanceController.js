const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Audit Engine - Immutable audit logs
const createAuditLog = async (req, res) => {
  try {
    const {
      companyId,
      entityType,
      entityId,
      action,
      beforeState,
      afterState,
      performedBy,
      approvedBy,
      device,
      ipAddress,
      userAgent,
      tenant
    } = req.body;

    const eventId = `${entityType}_${entityId}_${Date.now()}`;

    const auditLog = await prisma.auditLog.create({
      data: {
        companyId,
        eventId,
        entityType,
        entityId,
        action,
        beforeState,
        afterState,
        performedBy,
        approvedBy,
        device,
        ipAddress,
        userAgent,
        tenant
      },
      include: {
        company: true,
        performer: true,
        approver: true
      }
    });

    res.status(201).json({
      success: true,
      data: auditLog,
      message: 'Audit log created successfully'
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const { companyId, entityType, entityId, action, performedBy, startDate, endDate } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (performedBy) where.performedBy = performedBy;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        company: true,
        performer: true,
        approver: true
      },
      orderBy: { timestamp: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: auditLogs,
      count: auditLogs.length
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Liability Engine - Ownership tracking
const createLiabilityRecord = async (req, res) => {
  try {
    const {
      companyId,
      eventType,
      entity,
      entityId,
      liableParty,
      liablePartyRole,
      context
    } = req.body;

    const liabilityRecord = await prisma.liabilityRecord.create({
      data: {
        companyId,
        eventType,
        entity,
        entityId,
        liableParty,
        liablePartyRole,
        context
      },
      include: {
        company: true,
        liableEmployee: true
      }
    });

    res.status(201).json({
      success: true,
      data: liabilityRecord,
      message: 'Liability record created successfully'
    });
  } catch (error) {
    console.error('Error creating liability record:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getLiabilityRecords = async (req, res) => {
  try {
    const { companyId, eventType, entity, entityId, liableParty } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (eventType) where.eventType = eventType;
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (liableParty) where.liableParty = liableParty;

    const liabilityRecords = await prisma.liabilityRecord.findMany({
      where,
      include: {
        company: true,
        liableEmployee: true
      },
      orderBy: { timestamp: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: liabilityRecords,
      count: liabilityRecords.length
    });
  } catch (error) {
    console.error('Error fetching liability records:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Attendance Verification Engine
const createAttendanceVerification = async (req, res) => {
  try {
    const {
      companyId,
      attendanceId,
      employeeId,
      gpsMatch,
      gpsPoints,
      registeredDevice,
      devicePoints,
      selfieVerification,
      selfiePoints,
      supervisorConfirmation,
      supervisorPoints,
      shiftAssignmentMatch,
      shiftPoints,
      gpsLocation,
      deviceId,
      selfieImage,
      supervisorId
    } = req.body;

    // Calculate verification score
    const verificationScore = 
      (gpsMatch ? gpsPoints : 0) +
      (registeredDevice ? devicePoints : 0) +
      (selfieVerification ? selfiePoints : 0) +
      (supervisorConfirmation ? supervisorPoints : 0) +
      (shiftAssignmentMatch ? shiftPoints : 0);

    // Determine status
    let status = 'PENDING';
    let flagged = false;
    let flagReason = null;

    if (verificationScore === 100) {
      status = 'VERIFIED';
    } else if (verificationScore >= 80) {
      status = 'VERIFIED';
    } else if (verificationScore >= 60) {
      status = 'UNVERIFIED';
    } else {
      status = 'FLAGGED';
      flagged = true;
      flagReason = 'Low verification score';
    }

    const attendanceVerification = await prisma.attendanceVerification.create({
      data: {
        companyId,
        attendanceId,
        employeeId,
        verificationScore,
        status,
        gpsMatch,
        gpsPoints,
        registeredDevice,
        devicePoints,
        selfieVerification,
        selfiePoints,
        supervisorConfirmation,
        supervisorPoints,
        shiftAssignmentMatch,
        shiftPoints,
        gpsLocation,
        deviceId,
        selfieImage,
        supervisorId,
        flagged,
        flagReason
      },
      include: {
        company: true,
        employee: true,
        supervisor: true
      }
    });

    res.status(201).json({
      success: true,
      data: attendanceVerification,
      message: 'Attendance verification created successfully'
    });
  } catch (error) {
    console.error('Error creating attendance verification:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAttendanceVerifications = async (req, res) => {
  try {
    const { companyId, employeeId, status, flagged } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (flagged !== undefined) where.flagged = flagged === 'true';

    const attendanceVerifications = await prisma.attendanceVerification.findMany({
      where,
      include: {
        company: true,
        employee: true,
        supervisor: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: attendanceVerifications,
      count: attendanceVerifications.length
    });
  } catch (error) {
    console.error('Error fetching attendance verifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Payroll Reconciliation Engine
const createPayrollReconciliation = async (req, res) => {
  try {
    const {
      companyId,
      employeeId,
      payrollPeriodId,
      scheduledHours,
      workedHours,
      overtimeHours,
      compensationDays,
      leaveTaken
    } = req.body;

    // Calculate payable hours
    const payableHours = workedHours + overtimeHours + (compensationDays * 8);

    // Check for discrepancies
    const discrepancies = [];
    if (Math.abs(workedHours - scheduledHours) > 5) {
      discrepancies.push({
        type: 'HOURS_MISMATCH',
        expected: scheduledHours,
        actual: workedHours,
        difference: workedHours - scheduledHours
      });
    }

    const payrollReconciliation = await prisma.payrollReconciliation.create({
      data: {
        companyId,
        employeeId,
        payrollPeriodId,
        scheduledHours,
        workedHours,
        overtimeHours,
        compensationDays,
        leaveTaken,
        payableHours,
        discrepancies: discrepancies.length > 0 ? discrepancies : null,
        status: discrepancies.length > 0 ? 'FLAGGED' : 'MATCHED'
      },
      include: {
        company: true,
        employee: true,
        lockedByUser: true
      }
    });

    res.status(201).json({
      success: true,
      data: payrollReconciliation,
      message: 'Payroll reconciliation created successfully'
    });
  } catch (error) {
    console.error('Error creating payroll reconciliation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getPayrollReconciliations = async (req, res) => {
  try {
    const { companyId, employeeId, payrollPeriodId, status, locked } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (payrollPeriodId) where.payrollPeriodId = payrollPeriodId;
    if (status) where.status = status;
    if (locked !== undefined) where.locked = locked === 'true';

    const payrollReconciliations = await prisma.payrollReconciliation.findMany({
      where,
      include: {
        company: true,
        employee: true,
        lockedByUser: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: payrollReconciliations,
      count: payrollReconciliations.length
    });
  } catch (error) {
    console.error('Error fetching payroll reconciliations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const lockPayrollReconciliation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lockedBy } = req.body;

    const payrollReconciliation = await prisma.payrollReconciliation.update({
      where: { id },
      data: {
        locked: true,
        lockedBy,
        lockedAt: new Date()
      },
      include: {
        company: true,
        employee: true,
        lockedByUser: true
      }
    });

    res.status(200).json({
      success: true,
      data: payrollReconciliation,
      message: 'Payroll reconciliation locked successfully'
    });
  } catch (error) {
    console.error('Error locking payroll reconciliation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const resolvePayrollReconciliation = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const payrollReconciliation = await prisma.payrollReconciliation.update({
      where: { id },
      data: {
        resolved: true,
        resolutionNotes,
        status: 'RESOLVED'
      },
      include: {
        company: true,
        employee: true,
        lockedByUser: true
      }
    });

    res.status(200).json({
      success: true,
      data: payrollReconciliation,
      message: 'Payroll reconciliation resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving payroll reconciliation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Dispute Resolution Center
const createWorkforceDispute = async (req, res) => {
  try {
    const {
      companyId,
      employeeId,
      category,
      title,
      description,
      relatedEntity,
      relatedEntityId,
      priority
    } = req.body;

    // Automatically gather evidence bundle
    const evidenceBundle = await gatherEvidenceBundle(companyId, employeeId, relatedEntity, relatedEntityId);

    const workforceDispute = await prisma.workforceDispute.create({
      data: {
        companyId,
        employeeId,
        category,
        title,
        description,
        relatedEntity,
        relatedEntityId,
        evidenceBundle,
        priority
      },
      include: {
        company: true,
        employee: true
      }
    });

    res.status(201).json({
      success: true,
      data: workforceDispute,
      message: 'Workforce dispute created successfully'
    });
  } catch (error) {
    console.error('Error creating workforce dispute:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getWorkforceDisputes = async (req, res) => {
  try {
    const { companyId, employeeId, category, status, priority } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (category) where.category = category;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const workforceDisputes = await prisma.workforceDispute.findMany({
      where,
      include: {
        company: true,
        employee: true,
        resolver: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: workforceDisputes,
      count: workforceDisputes.length
    });
  } catch (error) {
    console.error('Error fetching workforce disputes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const resolveWorkforceDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, resolvedBy } = req.body;

    const workforceDispute = await prisma.workforceDispute.update({
      where: { id },
      data: {
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
        status: 'RESOLVED'
      },
      include: {
        company: true,
        employee: true,
        resolver: true
      }
    });

    res.status(200).json({
      success: true,
      data: workforceDispute,
      message: 'Workforce dispute resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving workforce dispute:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Department Communication Audit
const createAuditableCommunication = async (req, res) => {
  try {
    const {
      companyId,
      departmentId,
      postId,
      type,
      title,
      content,
      sentBy
    } = req.body;

    const auditableCommunication = await prisma.auditableCommunication.create({
      data: {
        companyId,
        departmentId,
        postId,
        type,
        title,
        content,
        sentBy
      },
      include: {
        company: true,
        department: true,
        sender: true
      }
    });

    res.status(201).json({
      success: true,
      data: auditableCommunication,
      message: 'Auditable communication created successfully'
    });
  } catch (error) {
    console.error('Error creating auditable communication:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAuditableCommunications = async (req, res) => {
  try {
    const { companyId, departmentId, type, postId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (type) where.type = type;
    if (postId) where.postId = postId;

    const auditableCommunications = await prisma.auditableCommunication.findMany({
      where,
      include: {
        company: true,
        department: true,
        sender: true
      },
      orderBy: { sentAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: auditableCommunications,
      count: auditableCommunications.length
    });
  } catch (error) {
    console.error('Error fetching auditable communications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const createCommunicationReadReceipt = async (req, res) => {
  try {
    const { communicationId, employeeId, status } = req.body;

    const readReceipt = await prisma.communicationReadReceipt.create({
      data: {
        communicationId,
        employeeId,
        status
      },
      include: {
        communication: true,
        employee: true
      }
    });

    res.status(201).json({
      success: true,
      data: readReceipt,
      message: 'Communication read receipt created successfully'
    });
  } catch (error) {
    console.error('Error creating communication read receipt:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateCommunicationReadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (status === 'READ') updateData.readAt = new Date();
    if (status === 'ACKNOWLEDGED') updateData.acknowledgedAt = new Date();

    const readReceipt = await prisma.communicationReadReceipt.update({
      where: { id },
      data: updateData,
      include: {
        communication: true,
        employee: true
      }
    });

    res.status(200).json({
      success: true,
      data: readReceipt,
      message: 'Communication read receipt updated successfully'
    });
  } catch (error) {
    console.error('Error updating communication read receipt:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Payroll Evidence Pack
const createPayrollEvidencePack = async (req, res) => {
  try {
    const { companyId, employeeId, payrollId, generatedBy } = req.body;

    // Automatically gather evidence components
    const attendanceSummary = await gatherAttendanceSummary(companyId, employeeId, payrollId);
    const shiftHistory = await gatherShiftHistory(companyId, employeeId, payrollId);
    const overtimeHistory = await gatherOvertimeHistory(companyId, employeeId, payrollId);
    const leaveHistory = await gatherLeaveHistory(companyId, employeeId, payrollId);
    const compensationHistory = await gatherCompensationHistory(companyId, employeeId, payrollId);
    const approvals = await gatherApprovals(companyId, employeeId, payrollId);

    const payrollEvidencePack = await prisma.payrollEvidencePack.create({
      data: {
        companyId,
        employeeId,
        payrollId,
        attendanceSummary,
        shiftHistory,
        overtimeHistory,
        leaveHistory,
        compensationHistory,
        approvals,
        generatedBy
      },
      include: {
        company: true,
        employee: true,
        generator: true
      }
    });

    res.status(201).json({
      success: true,
      data: payrollEvidencePack,
      message: 'Payroll evidence pack created successfully'
    });
  } catch (error) {
    console.error('Error creating payroll evidence pack:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getPayrollEvidencePacks = async (req, res) => {
  try {
    const { companyId, employeeId, payrollId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (payrollId) where.payrollId = payrollId;

    const payrollEvidencePacks = await prisma.payrollEvidencePack.findMany({
      where,
      include: {
        company: true,
        employee: true,
        generator: true
      },
      orderBy: { generatedAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: payrollEvidencePacks,
      count: payrollEvidencePacks.length
    });
  } catch (error) {
    console.error('Error fetching payroll evidence packs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Governance Dashboard Metrics
const createGovernanceMetric = async (req, res) => {
  try {
    const {
      companyId,
      metricType,
      metricValue,
      metricLabel,
      period,
      periodStart,
      periodEnd,
      breakdown
    } = req.body;

    const governanceMetric = await prisma.governanceMetric.create({
      data: {
        companyId,
        metricType,
        metricValue,
        metricLabel,
        period,
        periodStart,
        periodEnd,
        breakdown
      },
      include: {
        company: true
      }
    });

    res.status(201).json({
      success: true,
      data: governanceMetric,
      message: 'Governance metric created successfully'
    });
  } catch (error) {
    console.error('Error creating governance metric:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGovernanceMetrics = async (req, res) => {
  try {
    const { companyId, metricType, period } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (metricType) where.metricType = metricType;
    if (period) where.period = period;

    const governanceMetrics = await prisma.governanceMetric.findMany({
      where,
      include: {
        company: true
      },
      orderBy: { periodStart: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: governanceMetrics,
      count: governanceMetrics.length
    });
  } catch (error) {
    console.error('Error fetching governance metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getGovernanceDashboardSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get attendance exceptions
    const attendanceExceptions = await prisma.attendanceVerification.count({
      where: {
        companyId,
        flagged: true
      }
    });

    // Get payroll exceptions
    const payrollExceptions = await prisma.payrollReconciliation.count({
      where: {
        companyId,
        status: 'FLAGGED'
      }
    });

    // Get shift swap exceptions
    const shiftSwapExceptions = await prisma.shiftSwapRequest.count({
      where: {
        companyId,
        status: 'PENDING'
      }
    });

    // Get pending disputes
    const pendingDisputes = await prisma.workforceDispute.count({
      where: {
        companyId,
        status: 'OPEN'
      }
    });

    // Get fraud alerts
    const fraudAlerts = await prisma.attendanceVerification.count({
      where: {
        companyId,
        flagged: true,
        flagReason: 'Low verification score'
      }
    });

    // Get unverified attendance
    const unverifiedAttendance = await prisma.attendanceVerification.count({
      where: {
        companyId,
        status: 'UNVERIFIED'
      }
    });

    // Get manual adjustments
    const manualAdjustments = await prisma.auditLog.count({
      where: {
        companyId,
        action: 'UPDATE'
      }
    });

    const summary = {
      attendanceExceptions,
      payrollExceptions,
      shiftSwapExceptions,
      pendingDisputes,
      fraudAlerts,
      unverifiedAttendance,
      manualAdjustments
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching governance dashboard summary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper functions for evidence gathering
async function gatherEvidenceBundle(companyId, employeeId, relatedEntity, relatedEntityId) {
  const evidence = {};

  // Gather attendance records
  if (relatedEntity === 'ATTENDANCE') {
    evidence.attendance = await prisma.attendance.findFirst({
      where: { id: relatedEntityId }
    });
  }

  // Gather audit logs
  evidence.auditLogs = await prisma.auditLog.findMany({
    where: {
      companyId,
      entityId: relatedEntityId,
      entityType: relatedEntity
    },
    orderBy: { timestamp: 'desc' },
    take: 10
  });

  // Gather shift records
  if (relatedEntity === 'SHIFT') {
    evidence.shift = await prisma.shiftAssignment.findFirst({
      where: { id: relatedEntityId }
    });
  }

  // Gather approvals
  evidence.approvals = await prisma.auditLog.findMany({
    where: {
      companyId,
      entityId: relatedEntityId,
      action: { in: ['APPROVE', 'REJECT'] }
    },
    orderBy: { timestamp: 'desc' }
  });

  // Gather payroll entries
  evidence.payroll = await prisma.payslip.findMany({
    where: {
      companyId,
      employeeId
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Gather communication history
  evidence.communications = await prisma.auditLog.findMany({
    where: {
      companyId,
      performedBy: employeeId,
      action: { in: ['COMMUNICATION_SEND', 'COMMUNICATION_READ'] }
    },
    orderBy: { timestamp: 'desc' },
    take: 10
  });

  return evidence;
}

async function gatherAttendanceSummary(companyId, employeeId, payrollId) {
  // Implementation for gathering attendance summary
  return { summary: 'Attendance summary data' };
}

async function gatherShiftHistory(companyId, employeeId, payrollId) {
  // Implementation for gathering shift history
  return { history: 'Shift history data' };
}

async function gatherOvertimeHistory(companyId, employeeId, payrollId) {
  // Implementation for gathering overtime history
  return { history: 'Overtime history data' };
}

async function gatherLeaveHistory(companyId, employeeId, payrollId) {
  // Implementation for gathering leave history
  return { history: 'Leave history data' };
}

async function gatherCompensationHistory(companyId, employeeId, payrollId) {
  // Implementation for gathering compensation history
  return { history: 'Compensation history data' };
}

async function gatherApprovals(companyId, employeeId, payrollId) {
  // Implementation for gathering approvals
  return { approvals: 'Approvals data' };
}

module.exports = {
  // Audit Engine
  createAuditLog,
  getAuditLogs,
  
  // Liability Engine
  createLiabilityRecord,
  getLiabilityRecords,
  
  // Attendance Verification Engine
  createAttendanceVerification,
  getAttendanceVerifications,
  
  // Payroll Reconciliation Engine
  createPayrollReconciliation,
  getPayrollReconciliations,
  lockPayrollReconciliation,
  resolvePayrollReconciliation,
  
  // Dispute Resolution Center
  createWorkforceDispute,
  getWorkforceDisputes,
  resolveWorkforceDispute,
  
  // Department Communication Audit
  createAuditableCommunication,
  getAuditableCommunications,
  createCommunicationReadReceipt,
  updateCommunicationReadReceipt,
  
  // Payroll Evidence Pack
  createPayrollEvidencePack,
  getPayrollEvidencePacks,
  
  // Governance Dashboard
  createGovernanceMetric,
  getGovernanceMetrics,
  getGovernanceDashboardSummary
};
