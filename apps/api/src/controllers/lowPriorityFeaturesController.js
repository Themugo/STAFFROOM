const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 42-47: Low Priority Features - Comprehensive Controller
// This controller handles all 6 low priority advanced features:
// 1. Committee Tracking
// 2. Project-based Reporting
// 3. Exam & Assessment Tracking
// 4. Fraud Detection Enhancements
// 5. Attrition Risk Prediction
// 6. Burnout Detection

// ==================== COMMITTEE TRACKING ====================

// Create Committee
exports.createCommittee = async (req, res) => {
  try {
    const { companyId, departmentId, name, description, committeeType, chairId, startDate, endDate, mandate, responsibilities, meetingFrequency, quorum } = req.body;
    
    const committee = await prisma.committee.create({
      data: {
        companyId,
        departmentId,
        name,
        description,
        committeeType,
        chairId,
        startDate,
        endDate,
        mandate,
        responsibilities,
        meetingFrequency,
        quorum
      }
    });
    
    res.status(201).json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Committees
exports.getCommittees = async (req, res) => {
  try {
    const { companyId, departmentId, committeeType, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (committeeType) where.committeeType = committeeType;
    if (active !== undefined) where.active = active === 'true';
    
    const committees = await prisma.committee.findMany({
      where,
      include: {
        company: true,
        department: true,
        chair: true,
        members: {
          include: { employee: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(committees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Committee
exports.updateCommittee = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, chairId, endDate, meetingFrequency, quorum } = req.body;
    
    const committee = await prisma.committee.update({
      where: { id },
      data: {
        active,
        chairId,
        endDate,
        meetingFrequency,
        quorum
      }
    });
    
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Committee Member
exports.createCommitteeMember = async (req, res) => {
  try {
    const { companyId, committeeId, employeeId, role, joinDate, votingRights } = req.body;
    
    const member = await prisma.committeeMember.create({
      data: {
        companyId,
        committeeId,
        employeeId,
        role,
        joinDate,
        votingRights: votingRights !== undefined ? votingRights : true
      }
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Committee Members
exports.getCommitteeMembers = async (req, res) => {
  try {
    const { companyId, committeeId, employeeId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (committeeId) where.committeeId = committeeId;
    if (employeeId) where.employeeId = employeeId;
    if (active !== undefined) where.active = active === 'true';
    
    const members = await prisma.committeeMember.findMany({
      where,
      include: { company: true, committee: true, employee: true },
      orderBy: { joinDate: 'desc' }
    });
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Committee Member
exports.updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, leaveDate, active, votingRights } = req.body;
    
    const member = await prisma.committeeMember.update({
      where: { id },
      data: {
        role,
        leaveDate,
        active,
        votingRights
      }
    });
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Committee Meeting
exports.createCommitteeMeeting = async (req, res) => {
  try {
    const { companyId, committeeId, title, description, scheduledDate, startTime, endTime, location, virtualMeeting, meetingLink, minQuorum, agenda } = req.body;
    
    const meeting = await prisma.committeeMeeting.create({
      data: {
        companyId,
        committeeId,
        title,
        description,
        scheduledDate,
        startTime,
        endTime,
        location,
        virtualMeeting: virtualMeeting || false,
        meetingLink,
        minQuorum,
        agenda
      }
    });
    
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Committee Meetings
exports.getCommitteeMeetings = async (req, res) => {
  try {
    const { companyId, committeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (committeeId) where.committeeId = committeeId;
    if (status) where.status = status;
    
    const meetings = await prisma.committeeMeeting.findMany({
      where,
      include: { company: true, committee: true },
      orderBy: { scheduledDate: 'desc' }
    });
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Committee Meeting
exports.updateCommitteeMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endTime, actualAttendees, minutes, minutesFile, actionItems } = req.body;
    
    const meeting = await prisma.committeeMeeting.update({
      where: { id },
      data: {
        status,
        endTime,
        actualAttendees,
        minutes,
        minutesFile,
        actionItems
      }
    });
    
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== PROJECT-BASED REPORTING ====================

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { companyId, departmentId, name, description, status, priority, startDate, endDate, budget, currency, managerId, goals, risks, projectCharter } = req.body;
    
    const project = await prisma.project.create({
      data: {
        companyId,
        departmentId,
        name,
        description,
        status: status || 'PLANNING',
        priority: priority || 'MEDIUM',
        startDate,
        endDate,
        budget,
        currency: currency || 'USD',
        managerId,
        goals,
        risks,
        projectCharter
      }
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const { companyId, departmentId, status, priority } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    
    const projects = await prisma.project.findMany({
      where,
      include: {
        company: true,
        department: true,
        manager: true,
        members: {
          include: { employee: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate, actualEndDate, actualCost, progress, managerId } = req.body;
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        status,
        endDate,
        actualEndDate,
        actualCost,
        progress,
        managerId
      }
    });
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Project Member
exports.createProjectMember = async (req, res) => {
  try {
    const { companyId, projectId, employeeId, role, joinDate, responsibilities, allocationPercentage } = req.body;
    
    const member = await prisma.projectMember.create({
      data: {
        companyId,
        projectId,
        employeeId,
        role,
        joinDate,
        responsibilities,
        allocationPercentage
      }
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Project Members
exports.getProjectMembers = async (req, res) => {
  try {
    const { companyId, projectId, employeeId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (projectId) where.projectId = projectId;
    if (employeeId) where.employeeId = employeeId;
    if (active !== undefined) where.active = active === 'true';
    
    const members = await prisma.projectMember.findMany({
      where,
      include: { company: true, project: true, employee: true },
      orderBy: { joinDate: 'desc' }
    });
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Project Member
exports.updateProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, leaveDate, active, allocationPercentage } = req.body;
    
    const member = await prisma.projectMember.update({
      where: { id },
      data: {
        role,
        leaveDate,
        active,
        allocationPercentage
      }
    });
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXAM & ASSESSMENT TRACKING ====================

// Create Assessment
exports.createAssessment = async (req, res) => {
  try {
    const { companyId, courseId, title, description, assessmentType, scheduledDate, duration, maxScore, passingScore, instructions, allowRetake, maxAttempts, assessmentFile } = req.body;
    
    const assessment = await prisma.assessment.create({
      data: {
        companyId,
        courseId,
        title,
        description,
        assessmentType,
        scheduledDate,
        duration,
        maxScore,
        passingScore,
        instructions,
        allowRetake: allowRetake || false,
        maxAttempts,
        assessmentFile
      }
    });
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Assessments
exports.getAssessments = async (req, res) => {
  try {
    const { companyId, courseId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;
    
    const assessments = await prisma.assessment.findMany({
      where,
      include: { company: true, course: true },
      orderBy: { scheduledDate: 'desc' }
    });
    
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Assessment
exports.updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate, duration, maxScore, passingScore } = req.body;
    
    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        status,
        scheduledDate,
        duration,
        maxScore,
        passingScore
      }
    });
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Assessment Result
exports.createAssessmentResult = async (req, res) => {
  try {
    const { companyId, assessmentId, employeeId, score, maxScore, percentage, passed, attemptNumber, durationMinutes, feedback, answerFile } = req.body;
    
    const result = await prisma.assessmentResult.create({
      data: {
        companyId,
        assessmentId,
        employeeId,
        score,
        maxScore,
        percentage,
        passed,
        attemptNumber: attemptNumber || 1,
        durationMinutes,
        feedback,
        answerFile
      }
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Assessment Results
exports.getAssessmentResults = async (req, res) => {
  try {
    const { companyId, assessmentId, employeeId } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (assessmentId) where.assessmentId = assessmentId;
    if (employeeId) where.employeeId = employeeId;
    
    const results = await prisma.assessmentResult.findMany({
      where,
      include: { company: true, assessment: true, employee: true },
      orderBy: { takenDate: 'desc' }
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== FRAUD DETECTION ENHANCEMENTS ====================

// Create Fraud Alert
exports.createFraudAlert = async (req, res) => {
  try {
    const { companyId, employeeId, alertType, description, riskLevel, confidenceScore, detectionMethod, context, evidenceFiles } = req.body;
    
    const alert = await prisma.fraudAlert.create({
      data: {
        companyId,
        employeeId,
        alertType,
        description,
        riskLevel,
        confidenceScore,
        detectionMethod,
        context,
        evidenceFiles
      }
    });
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Fraud Alerts
exports.getFraudAlerts = async (req, res) => {
  try {
    const { companyId, employeeId, riskLevel, resolved } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (riskLevel) where.riskLevel = riskLevel;
    if (resolved !== undefined) where.resolved = resolved === 'true';
    
    const alerts = await prisma.fraudAlert.findMany({
      where,
      include: { company: true, employee: true, investigator: true },
      orderBy: { detectedDate: 'desc' }
    });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Fraud Alert
exports.updateFraudAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId, investigatedBy, investigatedAt, resolved, resolvedAt, resolutionNotes } = req.body;
    
    const alert = await prisma.fraudAlert.update({
      where: { id },
      data: {
        caseId,
        investigatedBy,
        investigatedAt,
        resolved,
        resolvedAt,
        resolutionNotes
      }
    });
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Fraud Case
exports.createFraudCase = async (req, res) => {
  try {
    const { companyId, employeeId, title, description, riskLevel, estimatedImpact, investigationNotes, evidenceFiles, reportFile } = req.body;
    
    const caseNumber = `FRAUD-${Date.now()}`;
    
    const fraudCase = await prisma.fraudCase.create({
      data: {
        companyId,
        employeeId,
        caseNumber,
        title,
        description,
        riskLevel,
        estimatedImpact,
        investigationNotes,
        evidenceFiles,
        reportFile
      }
    });
    
    res.status(201).json(fraudCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Fraud Cases
exports.getFraudCases = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const cases = await prisma.fraudCase.findMany({
      where,
      include: { company: true, employee: true, investigator: true },
      orderBy: { reportedDate: 'desc' }
    });
    
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Fraud Case
exports.updateFraudCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, investigatorId, investigationStartDate, investigationNotes, findings, substantiated, resolution, disciplinaryAction, resolvedDate } = req.body;
    
    const fraudCase = await prisma.fraudCase.update({
      where: { id },
      data: {
        status,
        investigatorId,
        investigationStartDate,
        investigationNotes,
        findings,
        substantiated,
        resolution,
        disciplinaryAction,
        resolvedDate
      }
    });
    
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== ATTRITION RISK PREDICTION ====================

// Create Attrition Risk
exports.createAttritionRisk = async (req, res) => {
  try {
    const { companyId, employeeId, riskLevel, riskScore, riskFactors, primaryFactor, predictionHorizon, tenure, performanceRating, mitigationPlan, mitigationActions } = req.body;
    
    const risk = await prisma.attritionRisk.create({
      data: {
        companyId,
        employeeId,
        riskLevel,
        riskScore,
        riskFactors,
        primaryFactor,
        predictionHorizon,
        tenure,
        performanceRating,
        mitigationPlan,
        mitigationActions
      }
    });
    
    res.status(201).json(risk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attrition Risks
exports.getAttritionRisks = async (req, res) => {
  try {
    const { companyId, employeeId, riskLevel } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (riskLevel) where.riskLevel = riskLevel;
    
    const risks = await prisma.attritionRisk.findMany({
      where,
      include: { company: true, employee: true, reviewer: true },
      orderBy: { predictionDate: 'desc' }
    });
    
    res.json(risks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Attrition Risk
exports.updateAttritionRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewedBy, reviewDate, reviewNotes, mitigationPlan, mitigationActions } = req.body;
    
    const risk = await prisma.attritionRisk.update({
      where: { id },
      data: {
        reviewedBy,
        reviewDate,
        reviewNotes,
        mitigationPlan,
        mitigationActions
      }
    });
    
    res.json(risk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Attrition Intervention
exports.createAttritionIntervention = async (req, res) => {
  try {
    const { companyId, employeeId, riskId, interventionType, description, plannedDate, assignedTo, notes } = req.body;
    
    const intervention = await prisma.attritionIntervention.create({
      data: {
        companyId,
        employeeId,
        riskId,
        interventionType,
        description,
        plannedDate,
        assignedTo,
        notes
      }
    });
    
    res.status(201).json(intervention);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attrition Interventions
exports.getAttritionInterventions = async (req, res) => {
  try {
    const { companyId, employeeId, riskId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (riskId) where.riskId = riskId;
    if (status) where.status = status;
    
    const interventions = await prisma.attritionIntervention.findMany({
      where,
      include: { company: true, employee: true, risk: true, assignedToUser: true },
      orderBy: { plannedDate: 'desc' }
    });
    
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Attrition Intervention
exports.updateAttritionIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, outcome, effectiveness, assignedTo } = req.body;
    
    const intervention = await prisma.attritionIntervention.update({
      where: { id },
      data: {
        status,
        completedDate,
        outcome,
        effectiveness,
        assignedTo
      }
    });
    
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== BURNOUT DETECTION ====================

// Create Burnout Risk
exports.createBurnoutRisk = async (req, res) => {
  try {
    const { companyId, employeeId, riskLevel, riskScore, indicators, primaryIndicator, avgWorkHours, overtimeHours, absenteeismRate, performanceTrend, stressLevel, satisfactionLevel, recommendations } = req.body;
    
    const risk = await prisma.burnoutRisk.create({
      data: {
        companyId,
        employeeId,
        riskLevel,
        riskScore,
        indicators,
        primaryIndicator,
        avgWorkHours,
        overtimeHours,
        absenteeismRate,
        performanceTrend,
        stressLevel,
        satisfactionLevel,
        recommendations
      }
    });
    
    res.status(201).json(risk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Burnout Risks
exports.getBurnoutRisks = async (req, res) => {
  try {
    const { companyId, employeeId, riskLevel } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (riskLevel) where.riskLevel = riskLevel;
    
    const risks = await prisma.burnoutRisk.findMany({
      where,
      include: { company: true, employee: true, reviewer: true },
      orderBy: { assessmentDate: 'desc' }
    });
    
    res.json(risks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Burnout Risk
exports.updateBurnoutRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewedBy, reviewDate, reviewNotes, recommendations } = req.body;
    
    const risk = await prisma.burnoutRisk.update({
      where: { id },
      data: {
        reviewedBy,
        reviewDate,
        reviewNotes,
        recommendations
      }
    });
    
    res.json(risk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Wellness Program
exports.createWellnessProgram = async (req, res) => {
  try {
    const { companyId, name, description, programType, startDate, endDate, capacity, resources, programDocument } = req.body;
    
    const program = await prisma.wellnessProgram.create({
      data: {
        companyId,
        name,
        description,
        programType,
        startDate,
        endDate,
        capacity,
        resources,
        programDocument
      }
    });
    
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Wellness Programs
exports.getWellnessPrograms = async (req, res) => {
  try {
    const { companyId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (active !== undefined) where.active = active === 'true';
    
    const programs = await prisma.wellnessProgram.findMany({
      where,
      include: { company: true },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Wellness Program
exports.updateWellnessProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, endDate, capacity, currentEnrollment } = req.body;
    
    const program = await prisma.wellnessProgram.update({
      where: { id },
      data: {
        active,
        endDate,
        capacity,
        currentEnrollment
      }
    });
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Wellness Enrollment
exports.createWellnessEnrollment = async (req, res) => {
  try {
    const { companyId, employeeId, programId, enrollmentDate } = req.body;
    
    const enrollment = await prisma.wellnessEnrollment.create({
      data: {
        companyId,
        employeeId,
        programId,
        enrollmentDate
      }
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Wellness Enrollments
exports.getWellnessEnrollments = async (req, res) => {
  try {
    const { companyId, employeeId, programId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (programId) where.programId = programId;
    if (active !== undefined) where.active = active === 'true';
    
    const enrollments = await prisma.wellnessEnrollment.findMany({
      where,
      include: { company: true, employee: true, program: true },
      orderBy: { enrollmentDate: 'desc' }
    });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Wellness Enrollment
exports.updateWellnessEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, completionDate, progress, satisfaction, feedback } = req.body;
    
    const enrollment = await prisma.wellnessEnrollment.update({
      where: { id },
      data: {
        active,
        completionDate,
        progress,
        satisfaction,
        feedback
      }
    });
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
