const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 30: Low Priority Gaps - Comprehensive Controller
// This controller handles all 3 low priority gap areas:
// 1. Employee Relations (Awards, Engagement, Sentiment)
// 2. Workforce Communication (Policy acknowledgements, Templates)
// 3. Workforce Governance (Policy governance, SoD enforcement)

// ==================== EMPLOYEE RELATIONS ====================

// Create Employee Award
exports.createEmployeeAward = async (req, res) => {
  try {
    const { companyId, employeeId, awardType, status, awardName, description, awardDate, period, year, awardedBy, awardedAt, citation, rewardType, rewardValue, currency, nominatedBy, nominationDate, nominationReason, approvedBy, approvedAt, certificateFile, photoFile } = req.body;
    
    const employeeAward = await prisma.employeeAward.create({
      data: {
        companyId,
        employeeId,
        awardType,
        status: status || 'NOMINATED',
        awardName,
        description,
        awardDate,
        period,
        year,
        awardedBy,
        awardedAt,
        citation,
        rewardType,
        rewardValue,
        currency: currency || 'USD',
        nominatedBy,
        nominationDate,
        nominationReason,
        approvedBy,
        approvedAt,
        certificateFile,
        photoFile
      }
    });
    
    res.status(201).json(employeeAward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employee Awards
exports.getEmployeeAwards = async (req, res) => {
  try {
    const { companyId, employeeId, awardType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (awardType) where.awardType = awardType;
    if (status) where.status = status;
    
    const employeeAwards = await prisma.employeeAward.findMany({
      where,
      include: {
        company: true,
        employee: true,
        awarder: true,
        nominator: true,
        approver: true
      },
      orderBy: { awardDate: 'desc' }
    });
    
    res.json(employeeAwards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Award
exports.updateEmployeeAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, awardedBy, awardedAt, citation, approvedBy, approvedAt: approvalTime, certificateFile, photoFile } = req.body;
    
    const employeeAward = await prisma.employeeAward.update({
      where: { id },
      data: {
        status,
        awardedBy,
        awardedAt,
        citation,
        approvedBy,
        approvedAt: approvalTime,
        certificateFile,
        photoFile
      }
    });
    
    res.json(employeeAward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Employee Engagement
exports.createEmployeeEngagement = async (req, res) => {
  try {
    const { companyId, employeeId, engagementType, status, title, description, scheduledDate, participants, attendanceCount, rating, feedback, comments, facilitatorId, location, platform, materials, report } = req.body;
    
    const employeeEngagement = await prisma.employeeEngagement.create({
      data: {
        companyId,
        employeeId,
        engagementType,
        status: status || 'SCHEDULED',
        title,
        description,
        scheduledDate,
        participants,
        attendanceCount,
        rating,
        feedback,
        comments,
        facilitatorId,
        location,
        platform,
        materials,
        report
      }
    });
    
    res.status(201).json(employeeEngagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employee Engagements
exports.getEmployeeEngagements = async (req, res) => {
  try {
    const { companyId, employeeId, engagementType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (engagementType) where.engagementType = engagementType;
    if (status) where.status = status;
    
    const employeeEngagements = await prisma.employeeEngagement.findMany({
      where,
      include: {
        company: true,
        employee: true,
        facilitator: true
      },
      orderBy: { scheduledDate: 'desc' }
    });
    
    res.json(employeeEngagements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Engagement
exports.updateEmployeeEngagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, attendanceCount, rating, feedback, comments, report } = req.body;
    
    const employeeEngagement = await prisma.employeeEngagement.update({
      where: { id },
      data: {
        status,
        completedDate,
        attendanceCount,
        rating,
        feedback,
        comments,
        report
      }
    });
    
    res.json(employeeEngagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Employee Sentiment
exports.createEmployeeSentiment = async (req, res) => {
  try {
    const { companyId, employeeId, sentimentType, sentimentScore, category, source, comments, tags, recordedDate, period, actionRequired, actionTaken, actionDate, reviewedBy, reviewedAt } = req.body;
    
    const employeeSentiment = await prisma.employeeSentiment.create({
      data: {
        companyId,
        employeeId,
        sentimentType,
        sentimentScore,
        category,
        source,
        comments,
        tags,
        recordedDate,
        period,
        actionRequired: actionRequired || false,
        actionTaken,
        actionDate,
        reviewedBy,
        reviewedAt
      }
    });
    
    res.status(201).json(employeeSentiment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employee Sentiments
exports.getEmployeeSentiments = async (req, res) => {
  try {
    const { companyId, employeeId, sentimentType, category } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (sentimentType) where.sentimentType = sentimentType;
    if (category) where.category = category;
    
    const employeeSentiments = await prisma.employeeSentiment.findMany({
      where,
      include: {
        company: true,
        employee: true,
        reviewer: true
      },
      orderBy: { recordedDate: 'desc' }
    });
    
    res.json(employeeSentiments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Sentiment
exports.updateEmployeeSentiment = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionRequired, actionTaken, actionDate, reviewedBy, reviewedAt } = req.body;
    
    const employeeSentiment = await prisma.employeeSentiment.update({
      where: { id },
      data: {
        actionRequired,
        actionTaken,
        actionDate,
        reviewedBy,
        reviewedAt
      }
    });
    
    res.json(employeeSentiment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== WORKFORCE COMMUNICATION ====================

// Create Policy Acknowledgement
exports.createPolicyAcknowledgement = async (req, res) => {
  try {
    const { companyId, employeeId, policyId, status, policyName, policyVersion, issuedDate, dueDate, acknowledgedDate, ipAddress, userAgent, exemptionReason, exemptionApprovedBy, exemptionApprovedAt, reminderSent, reminderCount } = req.body;
    
    const policyAcknowledgement = await prisma.policyAcknowledgement.create({
      data: {
        companyId,
        employeeId,
        policyId,
        status: status || 'PENDING',
        policyName,
        policyVersion,
        issuedDate,
        dueDate,
        acknowledgedDate,
        ipAddress,
        userAgent,
        exemptionReason,
        exemptionApprovedBy,
        exemptionApprovedAt,
        reminderSent: reminderSent || false,
        reminderCount: reminderCount || 0
      }
    });
    
    res.status(201).json(policyAcknowledgement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Policy Acknowledgements
exports.getPolicyAcknowledgements = async (req, res) => {
  try {
    const { companyId, employeeId, policyId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (policyId) where.policyId = policyId;
    if (status) where.status = status;
    
    const policyAcknowledgements = await prisma.policyAcknowledgement.findMany({
      where,
      include: {
        company: true,
        employee: true,
        exemptionApprover: true
      },
      orderBy: { dueDate: 'asc' }
    });
    
    res.json(policyAcknowledgements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Policy Acknowledgement
exports.updatePolicyAcknowledgement = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, acknowledgedDate, ipAddress, userAgent, exemptionReason, exemptionApprovedBy, exemptionApprovedAt, reminderSent, reminderCount } = req.body;
    
    const policyAcknowledgement = await prisma.policyAcknowledgement.update({
      where: { id },
      data: {
        status,
        acknowledgedDate,
        ipAddress,
        userAgent,
        exemptionReason,
        exemptionApprovedBy,
        exemptionApprovedAt,
        reminderSent,
        reminderCount
      }
    });
    
    res.json(policyAcknowledgement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Communication Template
exports.createCommunicationTemplate = async (req, res) => {
  try {
    const { companyId, templateType, status, name, description, subject, body, variables, category, approvedBy, approvedAt, version } = req.body;
    
    const communicationTemplate = await prisma.communicationTemplate.create({
      data: {
        companyId,
        templateType,
        status: status || 'DRAFT',
        name,
        description,
        subject,
        body,
        variables,
        category,
        approvedBy,
        approvedAt,
        version: version || '1.0'
      }
    });
    
    res.status(201).json(communicationTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Communication Templates
exports.getCommunicationTemplates = async (req, res) => {
  try {
    const { companyId, templateType, status, category } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (templateType) where.templateType = templateType;
    if (status) where.status = status;
    if (category) where.category = category;
    
    const communicationTemplates = await prisma.communicationTemplate.findMany({
      where,
      include: {
        company: true,
        approver: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(communicationTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Communication Template
exports.updateCommunicationTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, subject, body, variables, approvedBy, approvedAt, usageCount, lastUsedAt } = req.body;
    
    const communicationTemplate = await prisma.communicationTemplate.update({
      where: { id },
      data: {
        status,
        subject,
        body,
        variables,
        approvedBy,
        approvedAt,
        usageCount,
        lastUsedAt
      }
    });
    
    res.json(communicationTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== WORKFORCE GOVERNANCE ====================

// Create Policy Governance
exports.createPolicyGovernance = async (req, res) => {
  try {
    const { companyId, status, policyName, policyCode, category, description, version, effectiveDate, expiryDate, reviewDate, content, attachments, approvedBy, approvedAt, ownerId, complianceRequired, complianceCategory, distributionList } = req.body;
    
    const policyGovernance = await prisma.policyGovernance.create({
      data: {
        companyId,
        status: status || 'DRAFT',
        policyName,
        policyCode,
        category,
        description,
        version: version || '1.0',
        effectiveDate,
        expiryDate,
        reviewDate,
        content,
        attachments,
        approvedBy,
        approvedAt,
        ownerId,
        complianceRequired: complianceRequired !== undefined ? complianceRequired : true,
        complianceCategory,
        distributionList
      }
    });
    
    res.status(201).json(policyGovernance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Policy Governances
exports.getPolicyGovernances = async (req, res) => {
  try {
    const { companyId, status, category } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (category) where.category = category;
    
    const policyGovernances = await prisma.policyGovernance.findMany({
      where,
      include: {
        company: true,
        approver: true,
        owner: true,
        acknowledgements: true
      },
      orderBy: { effectiveDate: 'desc' }
    });
    
    res.json(policyGovernances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Policy Governance
exports.updatePolicyGovernance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvedAt, expiryDate, reviewDate, content, attachments, distributionList } = req.body;
    
    const policyGovernance = await prisma.policyGovernance.update({
      where: { id },
      data: {
        status,
        approvedBy,
        approvedAt,
        expiryDate,
        reviewDate,
        content,
        attachments,
        distributionList
      }
    });
    
    res.json(policyGovernance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create SoD Conflict
exports.createSoDConflict = async (req, res) => {
  try {
    const { companyId, employeeId, conflictType, status, title, description, impact, riskLevel, probability, role1, role2, duty1, duty2, detectedDate, detectionMethod, mitigationPlan, mitigationActions, mitigationStatus, mitigationDeadline, assignedTo, resolvedDate, resolutionNotes, acceptedBy, acceptedAt, acceptanceReason } = req.body;
    
    const sodConflict = await prisma.soDConflict.create({
      data: {
        companyId,
        employeeId,
        conflictType,
        status: status || 'IDENTIFIED',
        title,
        description,
        impact,
        riskLevel,
        probability,
        role1,
        role2,
        duty1,
        duty2,
        detectedDate,
        detectionMethod,
        mitigationPlan,
        mitigationActions,
        mitigationStatus,
        mitigationDeadline,
        assignedTo,
        resolvedDate,
        resolutionNotes,
        acceptedBy,
        acceptedAt,
        acceptanceReason
      }
    });
    
    res.status(201).json(sodConflict);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SoD Conflicts
exports.getSoDConflicts = async (req, res) => {
  try {
    const { companyId, employeeId, conflictType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (conflictType) where.conflictType = conflictType;
    if (status) where.status = status;
    
    const sodConflicts = await prisma.soDConflict.findMany({
      where,
      include: {
        company: true,
        employee: true,
        assignedToUser: true,
        accepter: true
      },
      orderBy: { detectedDate: 'desc' }
    });
    
    res.json(sodConflicts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SoD Conflict
exports.updateSoDConflict = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mitigationPlan, mitigationActions, mitigationStatus, mitigationDeadline, assignedTo, resolvedDate, resolutionNotes, acceptedBy, acceptedAt, acceptanceReason } = req.body;
    
    const sodConflict = await prisma.soDConflict.update({
      where: { id },
      data: {
        status,
        mitigationPlan,
        mitigationActions,
        mitigationStatus,
        mitigationDeadline,
        assignedTo,
        resolvedDate,
        resolutionNotes,
        acceptedBy,
        acceptedAt,
        acceptanceReason
      }
    });
    
    res.json(sodConflict);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
