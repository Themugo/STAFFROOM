const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 29: Medium Priority Gaps - Comprehensive Controller
// This controller handles all 13 medium priority gap areas:
// 1. Recruitment & Hiring (Talent pools, Probation, Confirmation)
// 2. Attendance & Presence (Remote work, Travel, Training attendance)
// 3. Leave & Absence (Study leave, Sabbatical, Custom categories)
// 4. Asset Responsibility (Lost/Damaged/Return workflows)
// 5. Performance Management (OKRs, 360-degree feedback)
// 6. Learning & Development (Compliance training, Mentorship)
// 7. Workforce Planning (Approved headcount, Succession planning)
// 8. Succession Planning (Critical positions, Successors)
// 9. Internal Mobility (Transfer, Promotion, Secondment workflows)
// 10. External Workforce (Contractors, Consultants, Agency workers)
// 11. Workforce Risk (Fraud detection, Compliance risk)
// 12. Financial Liability (Asset liability, Loan recovery)
// 13. Benefits valuation (Benefits-in-kind tracking)

// ==================== RECRUITMENT & HIRING ====================

// Create Talent Pool
exports.createTalentPool = async (req, res) => {
  try {
    const { companyId, name, description, status, positionId, skillRequirements, poolType, createdBy } = req.body;
    
    const talentPool = await prisma.talentPool.create({
      data: {
        companyId,
        name,
        description,
        status: status || 'ACTIVE',
        positionId,
        skillRequirements,
        poolType,
        createdBy
      }
    });
    
    res.status(201).json(talentPool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Talent Pools
exports.getTalentPools = async (req, res) => {
  try {
    const { companyId, status, poolType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (poolType) where.poolType = poolType;
    
    const talentPools = await prisma.talentPool.findMany({
      where,
      include: {
        company: true,
        creator: true,
        talentPoolCandidates: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(talentPools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Candidate to Talent Pool
exports.addTalentPoolCandidate = async (req, res) => {
  try {
    const { companyId, talentPoolId, candidateId, status, score, notes } = req.body;
    
    const candidate = await prisma.talentPoolCandidate.create({
      data: {
        companyId,
        talentPoolId,
        candidateId,
        status: status || 'ACTIVE',
        score,
        notes
      }
    });
    
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Talent Pool Candidates
exports.getTalentPoolCandidates = async (req, res) => {
  try {
    const { companyId, talentPoolId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (talentPoolId) where.talentPoolId = talentPoolId;
    if (status) where.status = status;
    
    const candidates = await prisma.talentPoolCandidate.findMany({
      where,
      include: {
        company: true,
        talentPool: true
      },
      orderBy: { addedAt: 'desc' }
    });
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Probation Review
exports.createProbationReview = async (req, res) => {
  try {
    const { companyId, employeeId, status, startDate, endDate, originalEndDate, extensionDays, reviewDate, reviewerId, performanceRating, behaviorRating, comments, decision, decisionDate, decisionBy, goalsMet, goalsNotMet } = req.body;
    
    const probationReview = await prisma.probationReview.create({
      data: {
        companyId,
        employeeId,
        status: status || 'IN_PROBATION',
        startDate,
        endDate,
        originalEndDate,
        extensionDays,
        reviewDate,
        reviewerId,
        performanceRating,
        behaviorRating,
        comments,
        decision,
        decisionDate,
        decisionBy,
        goalsMet,
        goalsNotMet
      }
    });
    
    res.status(201).json(probationReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Probation Reviews
exports.getProbationReviews = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const probationReviews = await prisma.probationReview.findMany({
      where,
      include: {
        company: true,
        employee: true,
        reviewer: true,
        decisionMaker: true
      },
      orderBy: { reviewDate: 'desc' }
    });
    
    res.json(probationReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Probation Review
exports.updateProbationReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate, extensionDays, performanceRating, behaviorRating, comments, decision, decisionDate, decisionBy, goalsMet, goalsNotMet } = req.body;
    
    const probationReview = await prisma.probationReview.update({
      where: { id },
      data: {
        status,
        endDate,
        extensionDays,
        performanceRating,
        behaviorRating,
        comments,
        decision,
        decisionDate,
        decisionBy,
        goalsMet,
        goalsNotMet
      }
    });
    
    res.json(probationReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== ATTENDANCE & PRESENCE ====================

// Create Attendance Location
exports.createAttendanceLocation = async (req, res) => {
  try {
    const { companyId, employeeId, attendanceId, locationType, locationName, address, coordinates, checkInTime, checkOutTime, purpose, projectId, approvedBy, approvedAt } = req.body;
    
    const attendanceLocation = await prisma.attendanceLocation.create({
      data: {
        companyId,
        employeeId,
        attendanceId,
        locationType,
        locationName,
        address,
        coordinates,
        checkInTime,
        checkOutTime,
        purpose,
        projectId,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(attendanceLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendance Locations
exports.getAttendanceLocations = async (req, res) => {
  try {
    const { companyId, employeeId, locationType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (locationType) where.locationType = locationType;
    
    const attendanceLocations = await prisma.attendanceLocation.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { checkInTime: 'desc' }
    });
    
    res.json(attendanceLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Travel Record
exports.createTravelRecord = async (req, res) => {
  try {
    const { companyId, employeeId, status, travelType, departureDate, returnDate, departureLocation, destination, destinationLocation, purpose, description, projectId, estimatedCost, actualCost, currency, approvedBy, approvedAt, travelRequest, travelItinerary } = req.body;
    
    const travelRecord = await prisma.travelRecord.create({
      data: {
        companyId,
        employeeId,
        status: status || 'PENDING',
        travelType,
        departureDate,
        returnDate,
        departureLocation,
        destination,
        destinationLocation,
        purpose,
        description,
        projectId,
        estimatedCost,
        actualCost,
        currency: currency || 'USD',
        approvedBy,
        approvedAt,
        travelRequest,
        travelItinerary
      }
    });
    
    res.status(201).json(travelRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Travel Records
exports.getTravelRecords = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const travelRecords = await prisma.travelRecord.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { departureDate: 'desc' }
    });
    
    res.json(travelRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Travel Record
exports.updateTravelRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actualCost, approvedBy, approvedAt } = req.body;
    
    const travelRecord = await prisma.travelRecord.update({
      where: { id },
      data: {
        status,
        actualCost,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(travelRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Training Attendance
exports.createTrainingAttendance = async (req, res) => {
  try {
    const { companyId, employeeId, trainingId, attendanceDate, status, hours, score, passed, feedback } = req.body;
    
    const trainingAttendance = await prisma.trainingAttendance.create({
      data: {
        companyId,
        employeeId,
        trainingId,
        attendanceDate,
        status,
        hours,
        score,
        passed,
        feedback
      }
    });
    
    res.status(201).json(trainingAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Training Attendances
exports.getTrainingAttendances = async (req, res) => {
  try {
    const { companyId, employeeId, trainingId } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (trainingId) where.trainingId = trainingId;
    
    const trainingAttendances = await prisma.trainingAttendance.findMany({
      where,
      include: {
        company: true,
        employee: true
      },
      orderBy: { attendanceDate: 'desc' }
    });
    
    res.json(trainingAttendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== LEAVE & ABSENCE ====================

// Create Custom Leave
exports.createCustomLeave = async (req, res) => {
  try {
    const { companyId, employeeId, leaveType, startDate, endDate, days, reason, description, status, approvedBy, approvedAt, rejectionReason, isPaid, documentationRequired, documentation } = req.body;
    
    const customLeave = await prisma.customLeave.create({
      data: {
        companyId,
        employeeId,
        leaveType,
        startDate,
        endDate,
        days,
        reason,
        description,
        status: status || 'PENDING',
        approvedBy,
        approvedAt,
        rejectionReason,
        isPaid: isPaid || false,
        documentationRequired: documentationRequired || false,
        documentation
      }
    });
    
    res.status(201).json(customLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Custom Leaves
exports.getCustomLeaves = async (req, res) => {
  try {
    const { companyId, employeeId, leaveType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (leaveType) where.leaveType = leaveType;
    if (status) where.status = status;
    
    const customLeaves = await prisma.customLeave.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(customLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Custom Leave
exports.updateCustomLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvedAt, rejectionReason } = req.body;
    
    const customLeave = await prisma.customLeave.update({
      where: { id },
      data: {
        status,
        approvedBy,
        approvedAt,
        rejectionReason
      }
    });
    
    res.json(customLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== ASSET RESPONSIBILITY ====================

// Create Asset Workflow
exports.createAssetWorkflow = async (req, res) => {
  try {
    const { companyId, assetId, employeeId, workflowType, status, conditionStatus, conditionNotes, workflowDate, completedDate, description, reason, estimatedCost, actualCost, currency, recoveryAmount, recoveredAmount, approvedBy, approvedAt, evidence, report } = req.body;
    
    const assetWorkflow = await prisma.assetWorkflow.create({
      data: {
        companyId,
        assetId,
        employeeId,
        workflowType,
        status: status || 'PENDING',
        conditionStatus,
        conditionNotes,
        workflowDate,
        completedDate,
        description,
        reason,
        estimatedCost,
        actualCost,
        currency: currency || 'USD',
        recoveryAmount,
        recoveredAmount,
        approvedBy,
        approvedAt,
        evidence,
        report
      }
    });
    
    res.status(201).json(assetWorkflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Asset Workflows
exports.getAssetWorkflows = async (req, res) => {
  try {
    const { companyId, assetId, employeeId, workflowType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (assetId) where.assetId = assetId;
    if (employeeId) where.employeeId = employeeId;
    if (workflowType) where.workflowType = workflowType;
    if (status) where.status = status;
    
    const assetWorkflows = await prisma.assetWorkflow.findMany({
      where,
      include: {
        company: true,
        asset: true,
        employee: true,
        approver: true
      },
      orderBy: { workflowDate: 'desc' }
    });
    
    res.json(assetWorkflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Asset Workflow
exports.updateAssetWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, actualCost, recoveredAmount, approvedBy, approvedAt } = req.body;
    
    const assetWorkflow = await prisma.assetWorkflow.update({
      where: { id },
      data: {
        status,
        completedDate,
        actualCost,
        recoveredAmount,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(assetWorkflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== PERFORMANCE MANAGEMENT ====================

// Create OKR
exports.createOKR = async (req, res) => {
  try {
    const { companyId, employeeId, departmentId, title, description, status, period, year, startDate, endDate, objectives, progress, approvedBy, approvedAt, reviewedBy, reviewedAt, reviewComments } = req.body;
    
    const okr = await prisma.oKR.create({
      data: {
        companyId,
        employeeId,
        departmentId,
        title,
        description,
        status: status || 'DRAFT',
        period,
        year,
        startDate,
        endDate,
        objectives,
        progress: progress || 0,
        approvedBy,
        approvedAt,
        reviewedBy,
        reviewedAt,
        reviewComments
      }
    });
    
    res.status(201).json(okr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get OKRs
exports.getOKRs = async (req, res) => {
  try {
    const { companyId, employeeId, departmentId, status, period, year } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    if (period) where.period = period;
    if (year) where.year = parseInt(year);
    
    const okrs = await prisma.oKR.findMany({
      where,
      include: {
        company: true,
        employee: true,
        department: true,
        approver: true,
        reviewer: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(okrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update OKR
exports.updateOKR = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, objectives, approvedBy, approvedAt, reviewedBy, reviewedAt, reviewComments } = req.body;
    
    const okr = await prisma.oKR.update({
      where: { id },
      data: {
        status,
        progress,
        objectives,
        approvedBy,
        approvedAt,
        reviewedBy,
        reviewedAt,
        reviewComments
      }
    });
    
    res.json(okr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Feedback360
exports.createFeedback360 = async (req, res) => {
  try {
    const { companyId, subjectId, reviewerId, feedbackType, status, period, year, rating, strengths, improvements, comments, responses, submittedDate } = req.body;
    
    const feedback360 = await prisma.feedback360.create({
      data: {
        companyId,
        subjectId,
        reviewerId,
        feedbackType,
        status: status || 'REQUESTED',
        period,
        year,
        rating,
        strengths,
        improvements,
        comments,
        responses,
        submittedDate
      }
    });
    
    res.status(201).json(feedback360);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Feedback360
exports.getFeedback360 = async (req, res) => {
  try {
    const { companyId, subjectId, reviewerId, status, period, year } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (subjectId) where.subjectId = subjectId;
    if (reviewerId) where.reviewerId = reviewerId;
    if (status) where.status = status;
    if (period) where.period = period;
    if (year) where.year = parseInt(year);
    
    const feedback360 = await prisma.feedback360.findMany({
      where,
      include: {
        company: true,
        subject: true,
        reviewer: true
      },
      orderBy: { requestedDate: 'desc' }
    });
    
    res.json(feedback360);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Feedback360
exports.updateFeedback360 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rating, strengths, improvements, comments, responses, submittedDate } = req.body;
    
    const feedback360 = await prisma.feedback360.update({
      where: { id },
      data: {
        status,
        rating,
        strengths,
        improvements,
        comments,
        responses,
        submittedDate
      }
    });
    
    res.json(feedback360);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== LEARNING & DEVELOPMENT ====================

// Create Compliance Training
exports.createComplianceTraining = async (req, res) => {
  try {
    const { companyId, employeeId, trainingId, category, status, requiredBy, completedDate, expiryDate, score, passed, certificateNumber, certificateFile, reminderSent, reminderDate } = req.body;
    
    const complianceTraining = await prisma.complianceTraining.create({
      data: {
        companyId,
        employeeId,
        trainingId,
        category,
        status: status || 'NOT_COMPLIANT',
        requiredBy,
        completedDate,
        expiryDate,
        score,
        passed,
        certificateNumber,
        certificateFile,
        reminderSent: reminderSent || false,
        reminderDate
      }
    });
    
    res.status(201).json(complianceTraining);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Compliance Trainings
exports.getComplianceTrainings = async (req, res) => {
  try {
    const { companyId, employeeId, trainingId, category, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (trainingId) where.trainingId = trainingId;
    if (category) where.category = category;
    if (status) where.status = status;
    
    const complianceTrainings = await prisma.complianceTraining.findMany({
      where,
      include: {
        company: true,
        employee: true
      },
      orderBy: { requiredBy: 'desc' }
    });
    
    res.json(complianceTrainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Compliance Training
exports.updateComplianceTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, expiryDate, score, passed, certificateNumber, certificateFile, reminderSent, reminderDate } = req.body;
    
    const complianceTraining = await prisma.complianceTraining.update({
      where: { id },
      data: {
        status,
        completedDate,
        expiryDate,
        score,
        passed,
        certificateNumber,
        certificateFile,
        reminderSent,
        reminderDate
      }
    });
    
    res.json(complianceTraining);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Mentorship
exports.createMentorship = async (req, res) => {
  try {
    const { companyId, mentorId, menteeId, mentorshipType, status, startDate, endDate, goals, progress, meetingFrequency, lastMeetingDate, nextMeetingDate, approvedBy, approvedAt, completionNotes, completedDate } = req.body;
    
    const mentorship = await prisma.mentorship.create({
      data: {
        companyId,
        mentorId,
        menteeId,
        mentorshipType,
        status: status || 'PENDING',
        startDate,
        endDate,
        goals,
        progress: progress || 0,
        meetingFrequency,
        lastMeetingDate,
        nextMeetingDate,
        approvedBy,
        approvedAt,
        completionNotes,
        completedDate
      }
    });
    
    res.status(201).json(mentorship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Mentorships
exports.getMentorships = async (req, res) => {
  try {
    const { companyId, mentorId, menteeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (mentorId) where.mentorId = mentorId;
    if (menteeId) where.menteeId = menteeId;
    if (status) where.status = status;
    
    const mentorships = await prisma.mentorship.findMany({
      where,
      include: {
        company: true,
        mentor: true,
        mentee: true,
        approver: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Mentorship
exports.updateMentorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, lastMeetingDate, nextMeetingDate, approvedBy, approvedAt, completionNotes, completedDate } = req.body;
    
    const mentorship = await prisma.mentorship.update({
      where: { id },
      data: {
        status,
        progress,
        lastMeetingDate,
        nextMeetingDate,
        approvedBy,
        approvedAt,
        completionNotes,
        completedDate
      }
    });
    
    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== WORKFORCE PLANNING ====================

// Create Headcount Request
exports.createHeadcountRequest = async (req, res) => {
  try {
    const { companyId, departmentId, positionId, status, positionTitle, positionLevel, employmentType, requestedCount, approvedCount, filledCount, justification, businessCase, neededBy, filledBy, budgetCode, estimatedCost, currency, requestedBy, approvedBy, approvedAt, rejectionReason } = req.body;
    
    const headcountRequest = await prisma.headcountRequest.create({
      data: {
        companyId,
        departmentId,
        positionId,
        status: status || 'REQUESTED',
        positionTitle,
        positionLevel,
        employmentType,
        requestedCount,
        approvedCount,
        filledCount: filledCount || 0,
        justification,
        businessCase,
        neededBy,
        filledBy,
        budgetCode,
        estimatedCost,
        currency: currency || 'USD',
        requestedBy,
        approvedBy,
        approvedAt,
        rejectionReason
      }
    });
    
    res.status(201).json(headcountRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Headcount Requests
exports.getHeadcountRequests = async (req, res) => {
  try {
    const { companyId, departmentId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    
    const headcountRequests = await prisma.headcountRequest.findMany({
      where,
      include: {
        company: true,
        department: true,
        requester: true,
        approver: true
      },
      orderBy: { neededBy: 'desc' }
    });
    
    res.json(headcountRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Headcount Request
exports.updateHeadcountRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedCount, filledCount, approvedBy, approvedAt, rejectionReason } = req.body;
    
    const headcountRequest = await prisma.headcountRequest.update({
      where: { id },
      data: {
        status,
        approvedCount,
        filledCount,
        approvedBy,
        approvedAt,
        rejectionReason
      }
    });
    
    res.json(headcountRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Workforce Budget
exports.createWorkforceBudget = async (req, res) => {
  try {
    const { companyId, departmentId, status, fiscalYear, period, budgetAmount, spentAmount, remainingAmount, currency, salaryBudget, benefitsBudget, trainingBudget, otherBudget, approvedBy, approvedAt } = req.body;
    
    const workforceBudget = await prisma.workforceBudget.create({
      data: {
        companyId,
        departmentId,
        status: status || 'DRAFT',
        fiscalYear,
        period,
        budgetAmount,
        spentAmount: spentAmount || 0,
        remainingAmount,
        currency: currency || 'USD',
        salaryBudget,
        benefitsBudget,
        trainingBudget,
        otherBudget,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(workforceBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Workforce Budgets
exports.getWorkforceBudgets = async (req, res) => {
  try {
    const { companyId, departmentId, fiscalYear, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (fiscalYear) where.fiscalYear = parseInt(fiscalYear);
    if (status) where.status = status;
    
    const workforceBudgets = await prisma.workforceBudget.findMany({
      where,
      include: {
        company: true,
        department: true,
        approver: true
      },
      orderBy: { fiscalYear: 'desc' }
    });
    
    res.json(workforceBudgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Workforce Budget
exports.updateWorkforceBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, spentAmount, remainingAmount, approvedBy, approvedAt } = req.body;
    
    const workforceBudget = await prisma.workforceBudget.update({
      where: { id },
      data: {
        status,
        spentAmount,
        remainingAmount,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(workforceBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== SUCCESSION PLANNING ====================

// Create Succession Plan
exports.createSuccessionPlan = async (req, res) => {
  try {
    const { companyId, positionId, positionTitle, criticality, departmentId, riskLevel, riskFactors, planDate, reviewDate, status, notes, approvedBy, approvedAt } = req.body;
    
    const successionPlan = await prisma.successionPlan.create({
      data: {
        companyId,
        positionId,
        positionTitle,
        criticality,
        departmentId,
        riskLevel,
        riskFactors,
        planDate,
        reviewDate,
        status: status || 'ACTIVE',
        notes,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(successionPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Succession Plans
exports.getSuccessionPlans = async (req, res) => {
  try {
    const { companyId, positionId, criticality, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (positionId) where.positionId = positionId;
    if (criticality) where.criticality = criticality;
    if (status) where.status = status;
    
    const successionPlans = await prisma.successionPlan.findMany({
      where,
      include: {
        company: true,
        department: true,
        approver: true,
        successors: true
      },
      orderBy: { planDate: 'desc' }
    });
    
    res.json(successionPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Successor
exports.createSuccessor = async (req, res) => {
  try {
    const { companyId, successionPlanId, employeeId, readinessLevel, readinessDate, potentialScore, performanceScore, riskScore, developmentPlan, developmentStatus, notes, targetReadinessDate } = req.body;
    
    const successor = await prisma.successor.create({
      data: {
        companyId,
        successionPlanId,
        employeeId,
        readinessLevel,
        readinessDate,
        potentialScore,
        performanceScore,
        riskScore,
        developmentPlan,
        developmentStatus,
        notes,
        targetReadinessDate
      }
    });
    
    res.status(201).json(successor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Successors
exports.getSuccessors = async (req, res) => {
  try {
    const { companyId, successionPlanId, employeeId, readinessLevel } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (successionPlanId) where.successionPlanId = successionPlanId;
    if (employeeId) where.employeeId = employeeId;
    if (readinessLevel) where.readinessLevel = readinessLevel;
    
    const successors = await prisma.successor.findMany({
      where,
      include: {
        company: true,
        successionPlan: true,
        employee: true
      },
      orderBy: { readinessLevel: 'asc' }
    });
    
    res.json(successors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Successor
exports.updateSuccessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { readinessLevel, readinessDate, potentialScore, performanceScore, riskScore, developmentPlan, developmentStatus, notes, targetReadinessDate } = req.body;
    
    const successor = await prisma.successor.update({
      where: { id },
      data: {
        readinessLevel,
        readinessDate,
        potentialScore,
        performanceScore,
        riskScore,
        developmentPlan,
        developmentStatus,
        notes,
        targetReadinessDate
      }
    });
    
    res.json(successor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Talent Pool Succession
exports.createTalentPoolSuccession = async (req, res) => {
  try {
    const { companyId, employeeId, poolType, status, potentialScore, leadershipScore, technicalScore, targetPositions, targetTimeline, developmentNeeds, developmentPlan, notes, lastReviewDate, nextReviewDate } = req.body;
    
    const talentPoolSuccession = await prisma.talentPoolSuccession.create({
      data: {
        companyId,
        employeeId,
        poolType,
        status: status || 'ACTIVE',
        potentialScore,
        leadershipScore,
        technicalScore,
        targetPositions,
        targetTimeline,
        developmentNeeds,
        developmentPlan,
        notes,
        lastReviewDate,
        nextReviewDate
      }
    });
    
    res.status(201).json(talentPoolSuccession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Talent Pool Successions
exports.getTalentPoolSuccessions = async (req, res) => {
  try {
    const { companyId, employeeId, poolType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (poolType) where.poolType = poolType;
    if (status) where.status = status;
    
    const talentPoolSuccessions = await prisma.talentPoolSuccession.findMany({
      where,
      include: {
        company: true,
        employee: true
      },
      orderBy: { potentialScore: 'desc' }
    });
    
    res.json(talentPoolSuccessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== INTERNAL MOBILITY ====================

// Create Mobility Request
exports.createMobilityRequest = async (req, res) => {
  try {
    const { companyId, employeeId, mobilityType, status, currentDepartmentId, currentPositionId, currentSalary, newDepartmentId, newPositionId, newSalary, effectiveDate, reason, description, requestedBy, approvedBy, approvedAt, rejectionReason, requestForm, approvalForm } = req.body;
    
    const mobilityRequest = await prisma.mobilityRequest.create({
      data: {
        companyId,
        employeeId,
        mobilityType,
        status: status || 'REQUESTED',
        currentDepartmentId,
        currentPositionId,
        currentSalary,
        newDepartmentId,
        newPositionId,
        newSalary,
        effectiveDate,
        reason,
        description,
        requestedBy,
        approvedBy,
        approvedAt,
        rejectionReason,
        requestForm,
        approvalForm
      }
    });
    
    res.status(201).json(mobilityRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Mobility Requests
exports.getMobilityRequests = async (req, res) => {
  try {
    const { companyId, employeeId, status, mobilityType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (mobilityType) where.mobilityType = mobilityType;
    
    const mobilityRequests = await prisma.mobilityRequest.findMany({
      where,
      include: {
        company: true,
        employee: true,
        currentDepartment: true,
        currentPosition: true,
        newDepartment: true,
        newPosition: true,
        requester: true,
        approver: true
      },
      orderBy: { effectiveDate: 'desc' }
    });
    
    res.json(mobilityRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Mobility Request
exports.updateMobilityRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvedAt, rejectionReason } = req.body;
    
    const mobilityRequest = await prisma.mobilityRequest.update({
      where: { id },
      data: {
        status,
        approvedBy,
        approvedAt,
        rejectionReason
      }
    });
    
    res.json(mobilityRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXTERNAL WORKFORCE ====================

// Create External Worker
exports.createExternalWorker = async (req, res) => {
  try {
    const { companyId, workerType, status, firstName, lastName, email, phone, contractStart, contractEnd, contractNumber, positionTitle, departmentId, agencyName, agencyContact, providerId, rate, rateType, currency, systemAccess, accessLevel, contractFile, idDocument, notes } = req.body;
    
    const externalWorker = await prisma.externalWorker.create({
      data: {
        companyId,
        workerType,
        status: status || 'ACTIVE',
        firstName,
        lastName,
        email,
        phone,
        contractStart,
        contractEnd,
        contractNumber,
        positionTitle,
        departmentId,
        agencyName,
        agencyContact,
        providerId,
        rate,
        rateType,
        currency: currency || 'USD',
        systemAccess: systemAccess || false,
        accessLevel,
        contractFile,
        idDocument,
        notes
      }
    });
    
    res.status(201).json(externalWorker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get External Workers
exports.getExternalWorkers = async (req, res) => {
  try {
    const { companyId, workerType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (workerType) where.workerType = workerType;
    if (status) where.status = status;
    
    const externalWorkers = await prisma.externalWorker.findMany({
      where,
      include: {
        company: true,
        department: true
      },
      orderBy: { contractStart: 'desc' }
    });
    
    res.json(externalWorkers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update External Worker
exports.updateExternalWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, contractEnd, rate, systemAccess, accessLevel, notes } = req.body;
    
    const externalWorker = await prisma.externalWorker.update({
      where: { id },
      data: {
        status,
        contractEnd,
        rate,
        systemAccess,
        accessLevel,
        notes
      }
    });
    
    res.json(externalWorker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== WORKFORCE RISK ====================

// Create Workforce Risk
exports.createWorkforceRisk = async (req, res) => {
  try {
    const { companyId, employeeId, riskCategory, severity, status, title, description, impact, probability, impactScore, riskScore, detectedDate, detectionMethod, mitigationPlan, mitigationActions, mitigationStatus, mitigationDeadline, monitoringFrequency, lastReviewDate, nextReviewDate, assignedTo, resolvedDate, resolutionNotes } = req.body;
    
    const workforceRisk = await prisma.workforceRisk.create({
      data: {
        companyId,
        employeeId,
        riskCategory,
        severity,
        status: status || 'IDENTIFIED',
        title,
        description,
        impact,
        probability,
        impactScore,
        riskScore,
        detectedDate,
        detectionMethod,
        mitigationPlan,
        mitigationActions,
        mitigationStatus,
        mitigationDeadline,
        monitoringFrequency,
        lastReviewDate,
        nextReviewDate,
        assignedTo,
        resolvedDate,
        resolutionNotes
      }
    });
    
    res.status(201).json(workforceRisk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Workforce Risks
exports.getWorkforceRisks = async (req, res) => {
  try {
    const { companyId, employeeId, riskCategory, severity, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (riskCategory) where.riskCategory = riskCategory;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    
    const workforceRisks = await prisma.workforceRisk.findMany({
      where,
      include: {
        company: true,
        employee: true,
        assignedToUser: true
      },
      orderBy: { detectedDate: 'desc' }
    });
    
    res.json(workforceRisks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Workforce Risk
exports.updateWorkforceRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mitigationPlan, mitigationActions, mitigationStatus, mitigationDeadline, monitoringFrequency, lastReviewDate, nextReviewDate, assignedTo, resolvedDate, resolutionNotes } = req.body;
    
    const workforceRisk = await prisma.workforceRisk.update({
      where: { id },
      data: {
        status,
        mitigationPlan,
        mitigationActions,
        mitigationStatus,
        mitigationDeadline,
        monitoringFrequency,
        lastReviewDate,
        nextReviewDate,
        assignedTo,
        resolvedDate,
        resolutionNotes
      }
    });
    
    res.json(workforceRisk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== FINANCIAL LIABILITY ====================

// Create Financial Liability
exports.createFinancialLiability = async (req, res) => {
  try {
    const { companyId, employeeId, category, status, amount, currency, description, reason, relatedAssetId, relatedLoanId, relatedExpenseId, recoveryMethod, recoveryPlan, recoveryAmount, recoveredAmount, writeOffAmount, liabilityDate, dueDate, recoveredDate, writtenOffDate, approvedBy, approvedAt, supportingDocs, recoveryDocs } = req.body;
    
    const financialLiability = await prisma.financialLiability.create({
      data: {
        companyId,
        employeeId,
        category,
        status: status || 'PENDING',
        amount,
        currency: currency || 'USD',
        description,
        reason,
        relatedAssetId,
        relatedLoanId,
        relatedExpenseId,
        recoveryMethod,
        recoveryPlan,
        recoveryAmount,
        recoveredAmount: recoveredAmount || 0,
        writeOffAmount,
        liabilityDate,
        dueDate,
        recoveredDate,
        writtenOffDate,
        approvedBy,
        approvedAt,
        supportingDocs,
        recoveryDocs
      }
    });
    
    res.status(201).json(financialLiability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Financial Liabilities
exports.getFinancialLiabilities = async (req, res) => {
  try {
    const { companyId, employeeId, category, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (category) where.category = category;
    if (status) where.status = status;
    
    const financialLiabilities = await prisma.financialLiability.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { liabilityDate: 'desc' }
    });
    
    res.json(financialLiabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Financial Liability
exports.updateFinancialLiability = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recoveredAmount, writeOffAmount, recoveredDate, writtenOffDate, approvedBy, approvedAt } = req.body;
    
    const financialLiability = await prisma.financialLiability.update({
      where: { id },
      data: {
        status,
        recoveredAmount,
        writeOffAmount,
        recoveredDate,
        writtenOffDate,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(financialLiability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== BENEFITS VALUATION ====================

// Create Benefits In Kind
exports.createBenefitsInKind = async (req, res) => {
  try {
    const { companyId, employeeId, benefitName, description, status, valuationMethod, cashValue, marketValue, costToCompany, taxableValue, currency, effectiveFrom, effectiveTo, frequency, isTaxable, taxRate, approvedBy, approvedAt } = req.body;
    
    const benefitsInKind = await prisma.benefitsInKind.create({
      data: {
        companyId,
        employeeId,
        benefitName,
        description,
        status: status || 'ACTIVE',
        valuationMethod,
        cashValue,
        marketValue,
        costToCompany,
        taxableValue,
        currency: currency || 'USD',
        effectiveFrom,
        effectiveTo,
        frequency,
        isTaxable: isTaxable !== undefined ? isTaxable : true,
        taxRate,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(benefitsInKind);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Benefits In Kind
exports.getBenefitsInKind = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const benefitsInKind = await prisma.benefitsInKind.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(benefitsInKind);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Benefits In Kind
exports.updateBenefitsInKind = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, effectiveTo, cashValue, marketValue, costToCompany, taxableValue, approvedBy, approvedAt } = req.body;
    
    const benefitsInKind = await prisma.benefitsInKind.update({
      where: { id },
      data: {
        status,
        effectiveTo,
        cashValue,
        marketValue,
        costToCompany,
        taxableValue,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(benefitsInKind);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
