const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 37-41: Medium Priority Features - Comprehensive Controller
// This controller handles all 5 medium priority gap areas:
// 1. Harassment & Discrimination Workflows
// 2. License & Certification Expiry
// 3. SACCO Deduction Integration
// 4. Team Model
// 5. Internship & Graduate Programs

// ==================== HARASSMENT & DISCRIMINATION WORKFLOWS ====================

// Create Whistleblower Protection
exports.createWhistleblowerProtection = async (req, res) => {
  try {
    const { companyId, employeeId, reportType, protectedCategory, description, confidentialityLevel, investigatorId, investigationStartDate, investigationEndDate, findings, substantiated, protectionMeasures, retaliationReported, retaliationDate, resolvedDate, resolutionNotes, evidenceFiles } = req.body;
    
    const protection = await prisma.whistleblowerProtection.create({
      data: {
        companyId,
        employeeId,
        reportType,
        protectedCategory,
        description,
        confidentialityLevel: confidentialityLevel || 'CONFIDENTIAL',
        investigatorId,
        investigationStartDate,
        investigationEndDate,
        findings,
        substantiated,
        protectionMeasures,
        retaliationReported: retaliationReported || false,
        retaliationDate,
        resolvedDate,
        resolutionNotes,
        evidenceFiles
      }
    });
    
    res.status(201).json(protection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Whistleblower Protections
exports.getWhistleblowerProtections = async (req, res) => {
  try {
    const { companyId, employeeId, protectedCategory, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (protectedCategory) where.protectedCategory = protectedCategory;
    if (status) where.status = status;
    
    const protections = await prisma.whistleblowerProtection.findMany({
      where,
      include: {
        company: true,
        employee: true,
        investigator: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(protections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Whistleblower Protection
exports.updateWhistleblowerProtection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, investigatorId, investigationStartDate, investigationEndDate, findings, substantiated, protectionMeasures, retaliationReported, retaliationDate, resolvedDate, resolutionNotes } = req.body;
    
    const protection = await prisma.whistleblowerProtection.update({
      where: { id },
      data: {
        status,
        investigatorId,
        investigationStartDate,
        investigationEndDate,
        findings,
        substantiated,
        protectionMeasures,
        retaliationReported,
        retaliationDate,
        resolvedDate,
        resolutionNotes
      }
    });
    
    res.json(protection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create External Report
exports.createExternalReport = async (req, res) => {
  try {
    const { companyId, employeeId, reportType, authority, reportDate, description, reportReference, responseDate, responseNotes, reportFile } = req.body;
    
    const report = await prisma.externalReport.create({
      data: {
        companyId,
        employeeId,
        reportType,
        authority,
        reportDate,
        description,
        reportReference,
        responseDate,
        responseNotes,
        reportFile
      }
    });
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get External Reports
exports.getExternalReports = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const reports = await prisma.externalReport.findMany({
      where,
      include: { company: true, employee: true },
      orderBy: { reportDate: 'desc' }
    });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== LICENSE & CERTIFICATION EXPIRY ====================

// Create License
exports.createLicense = async (req, res) => {
  try {
    const { companyId, employeeId, licenseType, licenseNumber, issuingAuthority, issueDate, expiryDate, renewalReminderDays, lastRenewalDate, licenseFile, notes } = req.body;
    
    const license = await prisma.license.create({
      data: {
        companyId,
        employeeId,
        licenseType,
        licenseNumber,
        issuingAuthority,
        issueDate,
        expiryDate,
        renewalReminderDays,
        lastRenewalDate,
        licenseFile,
        notes
      }
    });
    
    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Licenses
exports.getLicenses = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const licenses = await prisma.license.findMany({
      where,
      include: { company: true, employee: true },
      orderBy: { expiryDate: 'asc' }
    });
    
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update License
exports.updateLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expiryDate, renewalReminderDays, lastRenewalDate, licenseFile, notes } = req.body;
    
    const license = await prisma.license.update({
      where: { id },
      data: {
        status,
        expiryDate,
        renewalReminderDays,
        lastRenewalDate,
        licenseFile,
        notes
      }
    });
    
    res.json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Renewal Reminder
exports.createRenewalReminder = async (req, res) => {
  try {
    const { companyId, employeeId, licenseId, certificationId, reminderType, reminderDate, sentDate, actionTaken, actionDate, actionNotes } = req.body;
    
    const reminder = await prisma.renewalReminder.create({
      data: {
        companyId,
        employeeId,
        licenseId,
        certificationId,
        reminderType,
        reminderDate,
        sentDate,
        actionTaken: actionTaken || false,
        actionDate,
        actionNotes
      }
    });
    
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Renewal Reminders
exports.getRenewalReminders = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const reminders = await prisma.renewalReminder.findMany({
      where,
      include: { company: true, employee: true, license: true },
      orderBy: { reminderDate: 'asc' }
    });
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Renewal Reminder
exports.updateRenewalReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sentDate, actionTaken, actionDate, actionNotes } = req.body;
    
    const reminder = await prisma.renewalReminder.update({
      where: { id },
      data: {
        status,
        sentDate,
        actionTaken,
        actionDate,
        actionNotes
      }
    });
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== SACCO DEDUCTION INTEGRATION ====================

// Create SACCO Membership
exports.createSACCOMembership = async (req, res) => {
  try {
    const { companyId, employeeId, saccoName, membershipNumber, joinDate, contributionType, contributionAmount, contributionPercentage, membershipFile } = req.body;
    
    const membership = await prisma.sACCOMembership.create({
      data: {
        companyId,
        employeeId,
        saccoName,
        membershipNumber,
        joinDate,
        contributionType,
        contributionAmount,
        contributionPercentage,
        membershipFile
      }
    });
    
    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SACCO Memberships
exports.getSACCOMemberships = async (req, res) => {
  try {
    const { companyId, employeeId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (active !== undefined) where.active = active === 'true';
    
    const memberships = await prisma.sACCOMembership.findMany({
      where,
      include: { company: true, employee: true },
      orderBy: { joinDate: 'desc' }
    });
    
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SACCO Membership
exports.updateSACCOMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, leaveDate, contributionAmount, contributionPercentage } = req.body;
    
    const membership = await prisma.sACCOMembership.update({
      where: { id },
      data: {
        active,
        leaveDate,
        contributionAmount,
        contributionPercentage
      }
    });
    
    res.json(membership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create SACCO Contribution
exports.createSACCOContribution = async (req, res) => {
  try {
    const { companyId, employeeId, membershipId, contributionDate, amount, currency, contributionType, contributionPercentage, period, processedDate, referenceNumber } = req.body;
    
    const contribution = await prisma.sACCOContribution.create({
      data: {
        companyId,
        employeeId,
        membershipId,
        contributionDate,
        amount,
        currency: currency || 'USD',
        contributionType,
        contributionPercentage,
        period,
        processedDate,
        referenceNumber
      }
    });
    
    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SACCO Contributions
exports.getSACCOContributions = async (req, res) => {
  try {
    const { companyId, employeeId, membershipId } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (membershipId) where.membershipId = membershipId;
    
    const contributions = await prisma.sACCOContribution.findMany({
      where,
      include: { company: true, employee: true, membership: true },
      orderBy: { contributionDate: 'desc' }
    });
    
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create SACCO Loan
exports.createSACCOLoan = async (req, res) => {
  try {
    const { companyId, employeeId, membershipId, loanType, loanAmount, currency, interestRate, repaymentPeriod, monthlyPayment, applicationDate, guarantors, loanAgreementFile } = req.body;
    
    const loan = await prisma.sACCOLoan.create({
      data: {
        companyId,
        employeeId,
        membershipId,
        loanType,
        loanAmount,
        currency: currency || 'USD',
        interestRate,
        repaymentPeriod,
        monthlyPayment,
        applicationDate,
        guarantors,
        loanAgreementFile
      }
    });
    
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SACCO Loans
exports.getSACCOLoans = async (req, res) => {
  try {
    const { companyId, employeeId, membershipId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (membershipId) where.membershipId = membershipId;
    if (status) where.status = status;
    
    const loans = await prisma.sACCOLoan.findMany({
      where,
      include: { company: true, employee: true, membership: true },
      orderBy: { applicationDate: 'desc' }
    });
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SACCO Loan
exports.updateSACCOLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalDate, disbursementDate, startDate, endDate, totalRepaid, outstandingBalance } = req.body;
    
    const loan = await prisma.sACCOLoan.update({
      where: { id },
      data: {
        status,
        approvalDate,
        disbursementDate,
        startDate,
        endDate,
        totalRepaid,
        outstandingBalance
      }
    });
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== TEAM MODEL ====================

// Create Team
exports.createTeam = async (req, res) => {
  try {
    const { companyId, departmentId, name, description, purpose, status, leadId, startDate, endDate, goals, settings } = req.body;
    
    const team = await prisma.team.create({
      data: {
        companyId,
        departmentId,
        name,
        description,
        purpose,
        status: status || 'ACTIVE',
        leadId,
        startDate,
        endDate,
        goals,
        settings
      }
    });
    
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Teams
exports.getTeams = async (req, res) => {
  try {
    const { companyId, departmentId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    
    const teams = await prisma.team.findMany({
      where,
      include: {
        company: true,
        department: true,
        lead: true,
        members: {
          include: { employee: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Team
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, leadId, endDate, goals, settings } = req.body;
    
    const team = await prisma.team.update({
      where: { id },
      data: {
        status,
        leadId,
        endDate,
        goals,
        settings
      }
    });
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Team Member
exports.createTeamMember = async (req, res) => {
  try {
    const { companyId, teamId, employeeId, role, joinDate, responsibilities } = req.body;
    
    const member = await prisma.teamMember.create({
      data: {
        companyId,
        teamId,
        employeeId,
        role,
        joinDate,
        responsibilities
      }
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Team Members
exports.getTeamMembers = async (req, res) => {
  try {
    const { companyId, teamId, employeeId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (teamId) where.teamId = teamId;
    if (employeeId) where.employeeId = employeeId;
    if (active !== undefined) where.active = active === 'true';
    
    const members = await prisma.teamMember.findMany({
      where,
      include: { company: true, team: true, employee: true },
      orderBy: { joinDate: 'desc' }
    });
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, leaveDate, active, responsibilities } = req.body;
    
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        role,
        leaveDate,
        active,
        responsibilities
      }
    });
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== INTERNSHIP & GRADUATE PROGRAMS ====================

// Create Internship Program
exports.createInternshipProgram = async (req, res) => {
  try {
    const { companyId, programName, programType, description, durationWeeks, startDate, endDate, capacity, stipendAmount, stipendCurrency, status, requirements, programDocument } = req.body;
    
    const program = await prisma.internshipProgram.create({
      data: {
        companyId,
        programName,
        programType,
        description,
        durationWeeks,
        startDate,
        endDate,
        capacity,
        stipendAmount,
        stipendCurrency: stipendCurrency || 'USD',
        status: status || 'PLANNED',
        requirements,
        programDocument
      }
    });
    
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Internship Programs
exports.getInternshipPrograms = async (req, res) => {
  try {
    const { companyId, programType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (programType) where.programType = programType;
    if (status) where.status = status;
    
    const programs = await prisma.internshipProgram.findMany({
      where,
      include: { company: true },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Internship Program
exports.updateInternshipProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, capacity, currentEnrollment, stipendAmount } = req.body;
    
    const program = await prisma.internshipProgram.update({
      where: { id },
      data: {
        status,
        capacity,
        currentEnrollment,
        stipendAmount
      }
    });
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Intern
exports.createIntern = async (req, res) => {
  try {
    const { companyId, programId, firstName, lastName, email, phone, university, degree, major, graduationYear, startDate, endDate, mentorId, resumeFile, contractFile } = req.body;
    
    const intern = await prisma.intern.create({
      data: {
        companyId,
        programId,
        firstName,
        lastName,
        email,
        phone,
        university,
        degree,
        major,
        graduationYear,
        startDate,
        endDate,
        mentorId,
        resumeFile,
        contractFile
      }
    });
    
    res.status(201).json(intern);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Interns
exports.getInterns = async (req, res) => {
  try {
    const { companyId, programId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (programId) where.programId = programId;
    if (status) where.status = status;
    
    const interns = await prisma.intern.findMany({
      where,
      include: { company: true, program: true, mentor: true },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(interns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Intern
exports.updateIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mentorId, performanceRating, performanceNotes, conversionStatus, conversionDate } = req.body;
    
    const intern = await prisma.intern.update({
      where: { id },
      data: {
        status,
        mentorId,
        performanceRating,
        performanceNotes,
        conversionStatus,
        conversionDate
      }
    });
    
    res.json(intern);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Program Evaluation
exports.createProgramEvaluation = async (req, res) => {
  try {
    const { companyId, programId, internId, evaluationType, evaluationDate, evaluatorId, technicalScore, softSkillsScore, overallScore, strengths, improvements, overallFeedback, recommendation, evaluationFile } = req.body;
    
    const evaluation = await prisma.programEvaluation.create({
      data: {
        companyId,
        programId,
        internId,
        evaluationType,
        evaluationDate,
        evaluatorId,
        technicalScore,
        softSkillsScore,
        overallScore,
        strengths,
        improvements,
        overallFeedback,
        recommendation,
        evaluationFile
      }
    });
    
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Program Evaluations
exports.getProgramEvaluations = async (req, res) => {
  try {
    const { companyId, programId, internId } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (programId) where.programId = programId;
    if (internId) where.internId = internId;
    
    const evaluations = await prisma.programEvaluation.findMany({
      where,
      include: { company: true, program: true, intern: true, evaluator: true },
      orderBy: { evaluationDate: 'desc' }
    });
    
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Conversion Tracking
exports.createConversionTracking = async (req, res) => {
  try {
    const { companyId, programId, internId, conversionStatus, offerDate, offerAcceptedDate, startDate, positionId, departmentId, salary, offerLetterFile, notes } = req.body;
    
    const tracking = await prisma.conversionTracking.create({
      data: {
        companyId,
        programId,
        internId,
        conversionStatus,
        offerDate,
        offerAcceptedDate,
        startDate,
        positionId,
        departmentId,
        salary,
        offerLetterFile,
        notes
      }
    });
    
    res.status(201).json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Conversion Tracking
exports.getConversionTracking = async (req, res) => {
  try {
    const { companyId, programId, internId, conversionStatus } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (programId) where.programId = programId;
    if (internId) where.internId = internId;
    if (conversionStatus) where.conversionStatus = conversionStatus;
    
    const tracking = await prisma.conversionTracking.findMany({
      where,
      include: { company: true, program: true, intern: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Conversion Tracking
exports.updateConversionTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { conversionStatus, offerDate, offerAcceptedDate, startDate, positionId, departmentId, salary, offerLetterFile, notes } = req.body;
    
    const tracking = await prisma.conversionTracking.update({
      where: { id },
      data: {
        conversionStatus,
        offerDate,
        offerAcceptedDate,
        startDate,
        positionId,
        departmentId,
        salary,
        offerLetterFile,
        notes
      }
    });
    
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
