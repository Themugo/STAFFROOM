const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 32-36: High Priority Features - Comprehensive Controller
// This controller handles all 5 high priority gap areas:
// 1. Benefits Eligibility Rules
// 2. Exit Interview Tracking
// 3. Final Dues Calculation
// 4. Labor Law Compliance Engine
// 5. GDPR Compliance

// ==================== BENEFITS ELIGIBILITY RULES ====================

// Create Benefits Eligibility Rule
exports.createBenefitsEligibilityRule = async (req, res) => {
  try {
    const { companyId, benefitId, criteriaType, operator, value, valueNumber, valueDate, departmentId, positionId, employmentType, prorationMethod, prorationDays, waitingPeriodDays, waitingPeriodMonths, active, effectiveFrom, effectiveTo } = req.body;
    
    const rule = await prisma.benefitsEligibilityRule.create({
      data: {
        companyId,
        benefitId,
        criteriaType,
        operator,
        value,
        valueNumber,
        valueDate,
        departmentId,
        positionId,
        employmentType,
        prorationMethod: prorationMethod || 'FULL',
        prorationDays,
        waitingPeriodDays,
        waitingPeriodMonths,
        active: active !== undefined ? active : true,
        effectiveFrom,
        effectiveTo
      }
    });
    
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Benefits Eligibility Rules
exports.getBenefitsEligibilityRules = async (req, res) => {
  try {
    const { companyId, benefitId, criteriaType, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (benefitId) where.benefitId = benefitId;
    if (criteriaType) where.criteriaType = criteriaType;
    if (active !== undefined) where.active = active === 'true';
    
    const rules = await prisma.benefitsEligibilityRule.findMany({
      where,
      include: {
        company: true,
        department: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Benefits Eligibility Rule
exports.updateBenefitsEligibilityRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, effectiveTo, prorationMethod, prorationDays, waitingPeriodDays, waitingPeriodMonths } = req.body;
    
    const rule = await prisma.benefitsEligibilityRule.update({
      where: { id },
      data: {
        active,
        effectiveTo,
        prorationMethod,
        prorationDays,
        waitingPeriodDays,
        waitingPeriodMonths
      }
    });
    
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Benefits Tier
exports.createBenefitsTier = async (req, res) => {
  try {
    const { companyId, benefitId, tierName, tierLevel, description, minSalary, maxSalary, minTenureDays, maxTenureDays, coverageAmount, coveragePercentage, employerContribution, employeeContribution, active, effectiveFrom, effectiveTo } = req.body;
    
    const tier = await prisma.benefitsTier.create({
      data: {
        companyId,
        benefitId,
        tierName,
        tierLevel,
        description,
        minSalary,
        maxSalary,
        minTenureDays,
        maxTenureDays,
        coverageAmount,
        coveragePercentage,
        employerContribution,
        employeeContribution,
        active: active !== undefined ? active : true,
        effectiveFrom,
        effectiveTo
      }
    });
    
    res.status(201).json(tier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Benefits Tiers
exports.getBenefitsTiers = async (req, res) => {
  try {
    const { companyId, benefitId, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (benefitId) where.benefitId = benefitId;
    if (active !== undefined) where.active = active === 'true';
    
    const tiers = await prisma.benefitsTier.findMany({
      where,
      include: { company: true },
      orderBy: { tierLevel: 'asc' }
    });
    
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Benefits Tier
exports.updateBenefitsTier = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, effectiveTo, coverageAmount, coveragePercentage, employerContribution, employeeContribution } = req.body;
    
    const tier = await prisma.benefitsTier.update({
      where: { id },
      data: {
        active,
        effectiveTo,
        coverageAmount,
        coveragePercentage,
        employerContribution,
        employeeContribution
      }
    });
    
    res.json(tier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXIT INTERVIEW TRACKING ====================

// Create Exit Interview
exports.createExitInterview = async (req, res) => {
  try {
    const { companyId, employeeId, exitProcessId, interviewType, scheduledDate, interviewerId, exitReason, exitCategory, exitDate, questionnaireId, responses, rating, feedback, comments, actionRequired, actionTaken, recordingFile, transcriptFile } = req.body;
    
    const interview = await prisma.exitInterview.create({
      data: {
        companyId,
        employeeId,
        exitProcessId,
        interviewType,
        scheduledDate,
        interviewerId,
        exitReason,
        exitCategory,
        exitDate,
        questionnaireId,
        responses,
        rating,
        feedback,
        comments,
        actionRequired: actionRequired || false,
        actionTaken,
        recordingFile,
        transcriptFile
      }
    });
    
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Exit Interviews
exports.getExitInterviews = async (req, res) => {
  try {
    const { companyId, employeeId, exitProcessId, interviewType, exitCategory } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (exitProcessId) where.exitProcessId = exitProcessId;
    if (interviewType) where.interviewType = interviewType;
    if (exitCategory) where.exitCategory = exitCategory;
    
    const interviews = await prisma.exitInterview.findMany({
      where,
      include: {
        company: true,
        employee: true,
        exitProcess: true,
        interviewer: true
      },
      orderBy: { scheduledDate: 'desc' }
    });
    
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Exit Interview
exports.updateExitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedDate, responses, rating, feedback, comments, actionRequired, actionTaken, recordingFile, transcriptFile } = req.body;
    
    const interview = await prisma.exitInterview.update({
      where: { id },
      data: {
        completedDate,
        responses,
        rating,
        feedback,
        comments,
        actionRequired,
        actionTaken,
        recordingFile,
        transcriptFile
      }
    });
    
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Exit Questionnaire
exports.createExitQuestionnaire = async (req, res) => {
  try {
    const { companyId, name, description, interviewType, questions, active, version } = req.body;
    
    const questionnaire = await prisma.exitQuestionnaire.create({
      data: {
        companyId,
        name,
        description,
        interviewType,
        questions,
        active: active !== undefined ? active : true,
        version: version || '1.0'
      }
    });
    
    res.status(201).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Exit Questionnaires
exports.getExitQuestionnaires = async (req, res) => {
  try {
    const { companyId, interviewType, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (interviewType) where.interviewType = interviewType;
    if (active !== undefined) where.active = active === 'true';
    
    const questionnaires = await prisma.exitQuestionnaire.findMany({
      where,
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== FINAL DUES CALCULATION ====================

// Create Final Dues Calculation
exports.createFinalDuesCalculation = async (req, res) => {
  try {
    const { companyId, employeeId, exitProcessId, finalSalaryDate, finalSalary, salaryCurrency, leaveBalanceDays, leaveEncashment, bonusEligible, bonusAmount, pensionContribution, pensionRefund, totalDeductions, deductions, netPayable, settlementDate, calculatedBy, calculatedAt, approvedBy, approvedAt, payslipFile, settlementFile } = req.body;
    
    const calculation = await prisma.finalDuesCalculation.create({
      data: {
        companyId,
        employeeId,
        exitProcessId,
        finalSalaryDate,
        finalSalary,
        salaryCurrency: salaryCurrency || 'USD',
        leaveBalanceDays,
        leaveEncashment,
        bonusEligible: bonusEligible || false,
        bonusAmount,
        pensionContribution,
        pensionRefund,
        totalDeductions: totalDeductions || 0,
        deductions,
        netPayable,
        settlementDate,
        calculatedBy,
        calculatedAt,
        approvedBy,
        approvedAt,
        payslipFile,
        settlementFile
      }
    });
    
    res.status(201).json(calculation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Final Dues Calculations
exports.getFinalDuesCalculations = async (req, res) => {
  try {
    const { companyId, employeeId, exitProcessId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (exitProcessId) where.exitProcessId = exitProcessId;
    if (status) where.status = status;
    
    const calculations = await prisma.finalDuesCalculation.findMany({
      where,
      include: {
        company: true,
        employee: true,
        exitProcess: true,
        calculator: true,
        approver: true
      },
      orderBy: { finalSalaryDate: 'desc' }
    });
    
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Final Dues Calculation
exports.updateFinalDuesCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, netPayable, settlementDate, approvedBy, approvedAt, payslipFile, settlementFile } = req.body;
    
    const calculation = await prisma.finalDuesCalculation.update({
      where: { id },
      data: {
        status,
        netPayable,
        settlementDate,
        approvedBy,
        approvedAt,
        payslipFile,
        settlementFile
      }
    });
    
    res.json(calculation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== LABOR LAW COMPLIANCE ====================

// Create Labor Law Rule
exports.createLaborLawRule = async (req, res) => {
  try {
    const { companyId, ruleType, ruleName, description, jurisdiction, effectiveDate, expiryDate, parameters, minValue, maxValue, unit, active } = req.body;
    
    const rule = await prisma.laborLawRule.create({
      data: {
        companyId,
        ruleType,
        ruleName,
        description,
        jurisdiction,
        effectiveDate,
        expiryDate,
        parameters,
        minValue,
        maxValue,
        unit,
        active: active !== undefined ? active : true
      }
    });
    
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Labor Law Rules
exports.getLaborLawRules = async (req, res) => {
  try {
    const { companyId, ruleType, jurisdiction, active } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (ruleType) where.ruleType = ruleType;
    if (jurisdiction) where.jurisdiction = jurisdiction;
    if (active !== undefined) where.active = active === 'true';
    
    const rules = await prisma.laborLawRule.findMany({
      where,
      include: { company: true },
      orderBy: { effectiveDate: 'desc' }
    });
    
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Labor Law Rule
exports.updateLaborLawRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, expiryDate, parameters, minValue, maxValue } = req.body;
    
    const rule = await prisma.laborLawRule.update({
      where: { id },
      data: {
        active,
        expiryDate,
        parameters,
        minValue,
        maxValue
      }
    });
    
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Compliance Check
exports.createComplianceCheck = async (req, res) => {
  try {
    const { companyId, employeeId, ruleId, ruleType, actualValue, expectedValue, variance, context, isViolation, violationSeverity, violationDescription } = req.body;
    
    const check = await prisma.complianceCheck.create({
      data: {
        companyId,
        employeeId,
        ruleId,
        ruleType,
        actualValue,
        expectedValue,
        variance,
        context,
        isViolation: isViolation || false,
        violationSeverity,
        violationDescription
      }
    });
    
    res.status(201).json(check);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Compliance Checks
exports.getComplianceChecks = async (req, res) => {
  try {
    const { companyId, employeeId, ruleId, ruleType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (ruleId) where.ruleId = ruleId;
    if (ruleType) where.ruleType = ruleType;
    if (status) where.status = status;
    
    const checks = await prisma.complianceCheck.findMany({
      where,
      include: {
        company: true,
        employee: true,
        rule: true,
        resolver: true
      },
      orderBy: { checkDate: 'desc' }
    });
    
    res.json(checks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Compliance Check
exports.updateComplianceCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolvedBy, resolvedAt, resolutionNotes } = req.body;
    
    const check = await prisma.complianceCheck.update({
      where: { id },
      data: {
        status,
        resolvedBy,
        resolvedAt,
        resolutionNotes
      }
    });
    
    res.json(check);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== GDPR COMPLIANCE ====================

// Create Data Consent
exports.createDataConsent = async (req, res) => {
  try {
    const { companyId, employeeId, consentType, purpose, description, grantedAt, revokedAt, expiresAt, consentVersion, consentText, ipAddress, userAgent } = req.body;
    
    const consent = await prisma.dataConsent.create({
      data: {
        companyId,
        employeeId,
        consentType,
        purpose,
        description,
        grantedAt,
        revokedAt,
        expiresAt,
        consentVersion,
        consentText,
        ipAddress,
        userAgent
      }
    });
    
    res.status(201).json(consent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Data Consents
exports.getDataConsents = async (req, res) => {
  try {
    const { companyId, employeeId, consentType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (consentType) where.consentType = consentType;
    if (status) where.status = status;
    
    const consents = await prisma.dataConsent.findMany({
      where,
      include: { company: true, employee: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(consents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Data Consent
exports.updateDataConsent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, grantedAt, revokedAt, expiresAt } = req.body;
    
    const consent = await prisma.dataConsent.update({
      where: { id },
      data: {
        status,
        grantedAt,
        revokedAt,
        expiresAt
      }
    });
    
    res.json(consent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Data Subject Request
exports.createDataSubjectRequest = async (req, res) => {
  try {
    const { companyId, employeeId, requestType, description, dataScope, dueDate, processedBy, processedAt, processingNotes, responseData, rejectionReason } = req.body;
    
    const request = await prisma.dataSubjectRequest.create({
      data: {
        companyId,
        employeeId,
        requestType,
        description,
        dataScope,
        dueDate,
        processedBy,
        processedAt,
        processingNotes,
        responseData,
        rejectionReason
      }
    });
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Data Subject Requests
exports.getDataSubjectRequests = async (req, res) => {
  try {
    const { companyId, employeeId, requestType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (requestType) where.requestType = requestType;
    if (status) where.status = status;
    
    const requests = await prisma.dataSubjectRequest.findMany({
      where,
      include: {
        company: true,
        employee: true,
        processor: true
      },
      orderBy: { requestedDate: 'desc' }
    });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Data Subject Request
exports.updateDataSubjectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, processedBy, processedAt, processingNotes, responseData, rejectionReason, completedDate } = req.body;
    
    const request = await prisma.dataSubjectRequest.update({
      where: { id },
      data: {
        status,
        processedBy,
        processedAt,
        processingNotes,
        responseData,
        rejectionReason,
        completedDate
      }
    });
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Data Breach
exports.createDataBreach = async (req, res) => {
  try {
    const { companyId, breachType, severity, description, affectedRecords, affectedEmployees, reportedDate, resolvedDate, notificationRequired, notificationDate, authorityNotified, mitigationSteps, mitigationStatus, assignedTo } = req.body;
    
    const breach = await prisma.dataBreach.create({
      data: {
        companyId,
        breachType,
        severity,
        description,
        affectedRecords,
        affectedEmployees,
        reportedDate,
        resolvedDate,
        notificationRequired: notificationRequired !== undefined ? notificationRequired : true,
        notificationDate,
        authorityNotified: authorityNotified || false,
        mitigationSteps,
        mitigationStatus,
        assignedTo
      }
    });
    
    res.status(201).json(breach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Data Breaches
exports.getDataBreaches = async (req, res) => {
  try {
    const { companyId, severity } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (severity) where.severity = severity;
    
    const breaches = await prisma.dataBreach.findMany({
      where,
      include: { company: true, assignedToUser: true },
      orderBy: { detectedDate: 'desc' }
    });
    
    res.json(breaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Data Breach
exports.updateDataBreach = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportedDate, resolvedDate, notificationDate, authorityNotified, mitigationSteps, mitigationStatus, assignedTo } = req.body;
    
    const breach = await prisma.dataBreach.update({
      where: { id },
      data: {
        reportedDate,
        resolvedDate,
        notificationDate,
        authorityNotified,
        mitigationSteps,
        mitigationStatus,
        assignedTo
      }
    });
    
    res.json(breach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
