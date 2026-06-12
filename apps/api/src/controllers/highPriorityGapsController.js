const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Phase 28: High Priority Gaps - Comprehensive Controller
// This controller handles all 11 high priority gap areas:
// 1. Employment Types & Contract Governance
// 2. Compensation & Benefits
// 3. Discipline & Conduct
// 4. Grievances
// 5. Occupational Health & Safety
// 6. Exit Management
// 7. Compliance
// 8. Employee Financial Services
// 9. Matrix Reporting & Acting Appointments

// ==================== EMPLOYMENT TYPES & CONTRACT GOVERNANCE ====================

// Create Employment Contract
exports.createEmploymentContract = async (req, res) => {
  try {
    const { companyId, employeeId, contractType, employmentType, startDate, endDate, salary, salaryCurrency, workHours, workLocation, autoRenew, renewalDays, probationStatus, probationStart, probationEnd, probationDays, contractFile, notes } = req.body;
    
    const contract = await prisma.employmentContract.create({
      data: {
        companyId,
        employeeId,
        contractType,
        employmentType,
        startDate,
        endDate,
        salary,
        salaryCurrency: salaryCurrency || 'USD',
        workHours,
        workLocation,
        autoRenew: autoRenew || false,
        renewalDays,
        probationStatus: probationStatus || 'NOT_APPLICABLE',
        probationStart,
        probationEnd,
        probationDays,
        contractFile,
        notes
      }
    });
    
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employment Contracts
exports.getEmploymentContracts = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const contracts = await prisma.employmentContract.findMany({
      where,
      include: {
        company: true,
        employee: true,
        amendments: true
      }
    });
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employment Contract by ID
exports.getEmploymentContractById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contract = await prisma.employmentContract.findUnique({
      where: { id },
      include: {
        company: true,
        employee: true,
        amendments: {
          include: {
            approver: true
          }
        }
      }
    });
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employment Contract
exports.updateEmploymentContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate, salary, workHours, workLocation, autoRenew, renewalDays, probationStatus, probationEnd, contractFile, notes } = req.body;
    
    const contract = await prisma.employmentContract.update({
      where: { id },
      data: {
        status,
        endDate,
        salary,
        workHours,
        workLocation,
        autoRenew,
        renewalDays,
        probationStatus,
        probationEnd,
        contractFile,
        notes
      }
    });
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Contract Amendment
exports.createContractAmendment = async (req, res) => {
  try {
    const { companyId, contractId, employeeId, amendmentType, effectiveDate, oldSalary, newSalary, oldEndDate, newEndDate, oldPositionId, newPositionId, oldHours, newHours, oldLocation, newLocation, reason, description, approvedBy, approvedAt } = req.body;
    
    const amendment = await prisma.contractAmendment.create({
      data: {
        companyId,
        contractId,
        employeeId,
        amendmentType,
        effectiveDate,
        oldSalary,
        newSalary,
        oldEndDate,
        newEndDate,
        oldPositionId,
        newPositionId,
        oldHours,
        newHours,
        oldLocation,
        newLocation,
        reason,
        description,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(amendment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Contract Amendments
exports.getContractAmendments = async (req, res) => {
  try {
    const { companyId, contractId, employeeId } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (contractId) where.contractId = contractId;
    if (employeeId) where.employeeId = employeeId;
    
    const amendments = await prisma.contractAmendment.findMany({
      where,
      include: {
        company: true,
        contract: true,
        employee: true,
        approver: true
      },
      orderBy: { effectiveDate: 'desc' }
    });
    
    res.json(amendments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== COMPENSATION & BENEFITS ====================

// Create Compensation Component
exports.createCompensationComponent = async (req, res) => {
  try {
    const { companyId, employeeId, componentType, allowanceType, bonusType, commissionType, amount, currency, isPercentage, percentageOf, isRecurring, frequency, effectiveFrom, effectiveTo, conditions, approvedBy, approvedAt } = req.body;
    
    const component = await prisma.compensationComponent.create({
      data: {
        companyId,
        employeeId,
        componentType,
        allowanceType,
        bonusType,
        commissionType,
        amount,
        currency: currency || 'USD',
        isPercentage: isPercentage || false,
        percentageOf,
        isRecurring: isRecurring !== undefined ? isRecurring : true,
        frequency,
        effectiveFrom,
        effectiveTo,
        conditions,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Compensation Components
exports.getCompensationComponents = async (req, res) => {
  try {
    const { companyId, employeeId, componentType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (componentType) where.componentType = componentType;
    
    const components = await prisma.compensationComponent.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Compensation Component
exports.updateCompensationComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, isRecurring, frequency, effectiveTo, conditions, approvedBy, approvedAt } = req.body;
    
    const component = await prisma.compensationComponent.update({
      where: { id },
      data: {
        amount,
        isRecurring,
        frequency,
        effectiveTo,
        conditions,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Benefit Enrollment
exports.createBenefitEnrollment = async (req, res) => {
  try {
    const { companyId, employeeId, benefitType, status, enrollmentStatus, coverageType, coverageAmount, currency, employeeContribution, employerContribution, effectiveFrom, effectiveTo, providerName, policyNumber, dependents, enrollmentForm, beneficiaryForm, approvedBy, approvedAt } = req.body;
    
    const enrollment = await prisma.benefitEnrollment.create({
      data: {
        companyId,
        employeeId,
        benefitType,
        status: status || 'PENDING_ENROLLMENT',
        enrollmentStatus: enrollmentStatus || 'PENDING',
        coverageType,
        coverageAmount,
        currency: currency || 'USD',
        employeeContribution,
        employerContribution,
        effectiveFrom,
        effectiveTo,
        providerName,
        policyNumber,
        dependents,
        enrollmentForm,
        beneficiaryForm,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Benefit Enrollments
exports.getBenefitEnrollments = async (req, res) => {
  try {
    const { companyId, employeeId, benefitType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (benefitType) where.benefitType = benefitType;
    if (status) where.status = status;
    
    const enrollments = await prisma.benefitEnrollment.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Benefit Enrollment
exports.updateBenefitEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, enrollmentStatus, coverageAmount, employeeContribution, employerContribution, effectiveTo, dependents, approvedBy, approvedAt } = req.body;
    
    const enrollment = await prisma.benefitEnrollment.update({
      where: { id },
      data: {
        status,
        enrollmentStatus,
        coverageAmount,
        employeeContribution,
        employerContribution,
        effectiveTo,
        dependents,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== DISCIPLINE & CONDUCT ====================

// Create Disciplinary Record
exports.createDisciplinaryRecord = async (req, res) => {
  try {
    const { companyId, employeeId, incidentDate, incidentDescription, incidentLocation, actionType, actionDate, warningLevel, warningExpiry, reason, description, evidence, issuedBy, approvedBy, approvedAt } = req.body;
    
    const record = await prisma.disciplinaryRecord.create({
      data: {
        companyId,
        employeeId,
        incidentDate,
        incidentDescription,
        incidentLocation,
        actionType,
        actionDate,
        warningLevel,
        warningExpiry,
        reason,
        description,
        evidence,
        issuedBy,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Disciplinary Records
exports.getDisciplinaryRecords = async (req, res) => {
  try {
    const { companyId, employeeId, actionType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (actionType) where.actionType = actionType;
    
    const records = await prisma.disciplinaryRecord.findMany({
      where,
      include: {
        company: true,
        employee: true,
        issuer: true,
        approver: true,
        investigation: true,
        hearing: true,
        appeal: true
      },
      orderBy: { actionDate: 'desc' }
    });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Investigation
exports.createInvestigation = async (req, res) => {
  try {
    const { companyId, employeeId, disciplinaryRecordId, title, description, status, startDate, targetDate, investigatorId, investigator2Id, findings, conclusion, recommendation, evidence, approvedBy, approvedAt } = req.body;
    
    const investigation = await prisma.investigation.create({
      data: {
        companyId,
        employeeId,
        disciplinaryRecordId,
        title,
        description,
        status: status || 'PENDING',
        startDate,
        targetDate,
        investigatorId,
        investigator2Id,
        findings,
        conclusion,
        recommendation,
        evidence,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(investigation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Investigations
exports.getInvestigations = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const investigations = await prisma.investigation.findMany({
      where,
      include: {
        company: true,
        employee: true,
        disciplinaryRecord: true,
        investigator: true,
        investigator2: true,
        approver: true,
        hearings: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(investigations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Investigation
exports.updateInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, findings, conclusion, recommendation, approvedBy, approvedAt } = req.body;
    
    const investigation = await prisma.investigation.update({
      where: { id },
      data: {
        status,
        completedDate,
        findings,
        conclusion,
        recommendation,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(investigation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Disciplinary Hearing
exports.createDisciplinaryHearing = async (req, res) => {
  try {
    const { companyId, investigationId, disciplinaryRecordId, employeeId, status, scheduledDate, actualDate, location, chairpersonId, panelMembers, outcome, decision, sanctions, minutes, summary, approvedBy, approvedAt } = req.body;
    
    const hearing = await prisma.disciplinaryHearing.create({
      data: {
        companyId,
        investigationId,
        disciplinaryRecordId,
        employeeId,
        status: status || 'SCHEDULED',
        scheduledDate,
        actualDate,
        location,
        chairpersonId,
        panelMembers,
        outcome,
        decision,
        sanctions,
        minutes,
        summary,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(hearing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Disciplinary Hearings
exports.getDisciplinaryHearings = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const hearings = await prisma.disciplinaryHearing.findMany({
      where,
      include: {
        company: true,
        investigation: true,
        disciplinaryRecord: true,
        employee: true,
        chairperson: true,
        approver: true,
        appeals: true
      },
      orderBy: { scheduledDate: 'desc' }
    });
    
    res.json(hearings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Disciplinary Appeal
exports.createDisciplinaryAppeal = async (req, res) => {
  try {
    const { companyId, hearingId, disciplinaryRecordId, employeeId, status, appealDate, grounds, description, evidence } = req.body;
    
    const appeal = await prisma.disciplinaryAppeal.create({
      data: {
        companyId,
        hearingId,
        disciplinaryRecordId,
        employeeId,
        status: status || 'PENDING',
        appealDate,
        grounds,
        description,
        evidence
      }
    });
    
    res.status(201).json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Disciplinary Appeals
exports.getDisciplinaryAppeals = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const appeals = await prisma.disciplinaryAppeal.findMany({
      where,
      include: {
        company: true,
        hearing: true,
        disciplinaryRecord: true,
        employee: true,
        reviewer: true
      },
      orderBy: { appealDate: 'desc' }
    });
    
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Suspension
exports.createSuspension = async (req, res) => {
  try {
    const { companyId, employeeId, disciplinaryRecordId, suspensionType, startDate, endDate, duration, reason, description, withPay, approvedBy, approvedAt } = req.body;
    
    const suspension = await prisma.suspension.create({
      data: {
        companyId,
        employeeId,
        disciplinaryRecordId,
        suspensionType,
        startDate,
        endDate,
        duration,
        reason,
        description,
        withPay: withPay !== undefined ? withPay : true,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(suspension);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Suspensions
exports.getSuspensions = async (req, res) => {
  try {
    const { companyId, employeeId, suspensionType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (suspensionType) where.suspensionType = suspensionType;
    
    const suspensions = await prisma.suspension.findMany({
      where,
      include: {
        company: true,
        employee: true,
        disciplinaryRecord: true,
        approver: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(suspensions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== GRIEVANCES ====================

// Create Grievance
exports.createGrievance = async (req, res) => {
  try {
    const { companyId, employeeId, category, status, confidentiality, incidentDate, incidentDescription, incidentLocation, accusedId, resolution, resolutionDate, evidence, assignedTo, mediatorId, isAnonymous } = req.body;
    
    const grievance = await prisma.grievance.create({
      data: {
        companyId,
        employeeId,
        category,
        status: status || 'SUBMITTED',
        confidentiality: confidentiality || 'CONFIDENTIAL',
        incidentDate,
        incidentDescription,
        incidentLocation,
        accusedId,
        resolution,
        resolutionDate,
        evidence,
        assignedTo,
        mediatorId,
        isAnonymous: isAnonymous || false
      }
    });
    
    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Grievances
exports.getGrievances = async (req, res) => {
  try {
    const { companyId, employeeId, category, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (category) where.category = category;
    if (status) where.status = status;
    
    const grievances = await prisma.grievance.findMany({
      where,
      include: {
        company: true,
        employee: true,
        accused: true,
        assignedToUser: true,
        mediator: true,
        escalatedToUser: true
      },
      orderBy: { submittedDate: 'desc' }
    });
    
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Grievance
exports.updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, mediatorId, resolution, resolutionDate, escalated, escalatedTo, escalatedAt } = req.body;
    
    const grievance = await prisma.grievance.update({
      where: { id },
      data: {
        status,
        assignedTo,
        mediatorId,
        resolution,
        resolutionDate,
        escalated,
        escalatedTo,
        escalatedAt
      }
    });
    
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== OCCUPATIONAL HEALTH & SAFETY ====================

// Create Incident
exports.createIncident = async (req, res) => {
  try {
    const { companyId, employeeId, incidentType, severity, status, incidentDate, incidentTime, incidentLocation, description, injuries, injuryCount, fatalities, fatalityCount, propertyDamage, damageCost, investigationRequired, correctiveActionRequired, reportedBy, reportedToAuthorities, authorityReportDate, authorityReference } = req.body;
    
    const incident = await prisma.incident.create({
      data: {
        companyId,
        employeeId,
        incidentType,
        severity,
        status: status || 'REPORTED',
        incidentDate,
        incidentTime,
        incidentLocation,
        description,
        injuries: injuries || false,
        injuryCount,
        fatalities: fatalities || false,
        fatalityCount,
        propertyDamage: propertyDamage || false,
        damageCost,
        investigationRequired: investigationRequired !== undefined ? investigationRequired : true,
        correctiveActionRequired: correctiveActionRequired !== undefined ? correctiveActionRequired : true,
        reportedBy,
        reportedToAuthorities: reportedToAuthorities || false,
        authorityReportDate,
        authorityReference
      }
    });
    
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Incidents
exports.getIncidents = async (req, res) => {
  try {
    const { companyId, employeeId, incidentType, severity, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (incidentType) where.incidentType = incidentType;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    
    const incidents = await prisma.incident.findMany({
      where,
      include: {
        company: true,
        employee: true,
        reporter: true,
        medicalCases: true,
        safetyViolations: true
      },
      orderBy: { incidentDate: 'desc' }
    });
    
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Incident
exports.updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, investigationCompleted, correctiveActionTaken, correctiveActionPlan, reportedToAuthorities, authorityReportDate, authorityReference } = req.body;
    
    const incident = await prisma.incident.update({
      where: { id },
      data: {
        status,
        investigationCompleted,
        correctiveActionTaken,
        correctiveActionPlan,
        reportedToAuthorities,
        authorityReportDate,
        authorityReference
      }
    });
    
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Medical Case
exports.createMedicalCase = async (req, res) => {
  try {
    const { companyId, incidentId, employeeId, caseType, description, treatment, hospitalName, hospitalLocation, bodyPart, injuryType, daysOffWork, returnDate, medicalReport, doctorName, doctorContact, workersCompClaim, claimNumber, claimStatus } = req.body;
    
    const medicalCase = await prisma.medicalCase.create({
      data: {
        companyId,
        incidentId,
        employeeId,
        caseType,
        description,
        treatment,
        hospitalName,
        hospitalLocation,
        bodyPart,
        injuryType,
        daysOffWork,
        returnDate,
        medicalReport,
        doctorName,
        doctorContact,
        workersCompClaim: workersCompClaim || false,
        claimNumber,
        claimStatus
      }
    });
    
    res.status(201).json(medicalCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Medical Cases
exports.getMedicalCases = async (req, res) => {
  try {
    const { companyId, incidentId, employeeId, caseType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (incidentId) where.incidentId = incidentId;
    if (employeeId) where.employeeId = employeeId;
    if (caseType) where.caseType = caseType;
    
    const medicalCases = await prisma.medicalCase.findMany({
      where,
      include: {
        company: true,
        incident: true,
        employee: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(medicalCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Safety Violation
exports.createSafetyViolation = async (req, res) => {
  try {
    const { companyId, incidentId, employeeId, violationType, description, location, violationDate, severity, correctiveActionRequired, correctiveActionDeadline, correctiveActionNotes, reportedBy, ppeRequired, ppeProvided, ppeWorn } = req.body;
    
    const violation = await prisma.safetyViolation.create({
      data: {
        companyId,
        incidentId,
        employeeId,
        violationType,
        description,
        location,
        violationDate,
        severity,
        correctiveActionRequired: correctiveActionRequired !== undefined ? correctiveActionRequired : true,
        correctiveActionDeadline,
        correctiveActionNotes,
        reportedBy,
        ppeRequired,
        ppeProvided,
        ppeWorn
      }
    });
    
    res.status(201).json(violation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Safety Violations
exports.getSafetyViolations = async (req, res) => {
  try {
    const { companyId, incidentId, employeeId, violationType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (incidentId) where.incidentId = incidentId;
    if (employeeId) where.employeeId = employeeId;
    if (violationType) where.violationType = violationType;
    
    const violations = await prisma.safetyViolation.findMany({
      where,
      include: {
        company: true,
        incident: true,
        employee: true,
        reporter: true
      },
      orderBy: { violationDate: 'desc' }
    });
    
    res.json(violations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXIT MANAGEMENT ====================

// Create Exit Process
exports.createExitProcess = async (req, res) => {
  try {
    const { companyId, employeeId, exitType, status, noticePeriodDays, noticeStartDate, noticeEndDate, lastWorkingDay, reason, reasonDetails, isVoluntary, approvedBy, approvedAt } = req.body;
    
    const exitProcess = await prisma.exitProcess.create({
      data: {
        companyId,
        employeeId,
        exitType,
        status: status || 'INITIATED',
        noticePeriodDays,
        noticeStartDate,
        noticeEndDate,
        lastWorkingDay,
        reason,
        reasonDetails,
        isVoluntary: isVoluntary !== undefined ? isVoluntary : true,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(exitProcess);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Exit Processes
exports.getExitProcesses = async (req, res) => {
  try {
    const { companyId, employeeId, exitType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (exitType) where.exitType = exitType;
    if (status) where.status = status;
    
    const exitProcesses = await prisma.exitProcess.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true,
        clearanceItems: true
      },
      orderBy: { lastWorkingDay: 'desc' }
    });
    
    res.json(exitProcesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Exit Process
exports.updateExitProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, exitInterviewScheduled, exitInterviewDate, exitInterviewCompleted, exitInterviewFeedback, exitInterviewRating, handoverRequired, handoverCompleted, handoverNotes, clearanceRequired, clearanceCompleted, clearanceDate, finalDuesCalculated, finalDuesAmount, finalDuesPaid, finalDuesPaidDate, resignationLetter, exitForm, clearanceForm } = req.body;
    
    const exitProcess = await prisma.exitProcess.update({
      where: { id },
      data: {
        status,
        exitInterviewScheduled,
        exitInterviewDate,
        exitInterviewCompleted,
        exitInterviewFeedback,
        exitInterviewRating,
        handoverRequired,
        handoverCompleted,
        handoverNotes,
        clearanceRequired,
        clearanceCompleted,
        clearanceDate,
        finalDuesCalculated,
        finalDuesAmount,
        finalDuesPaid,
        finalDuesPaidDate,
        resignationLetter,
        exitForm,
        clearanceForm
      }
    });
    
    res.json(exitProcess);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Clearance Item
exports.createClearanceItem = async (req, res) => {
  try {
    const { companyId, exitProcessId, employeeId, itemType, itemName, description, departmentId, responsiblePerson, dueDate, notes, assetId, assetReturned, assetCondition } = req.body;
    
    const clearanceItem = await prisma.clearanceItem.create({
      data: {
        companyId,
        exitProcessId,
        employeeId,
        itemType,
        itemName,
        description,
        departmentId,
        responsiblePerson,
        dueDate,
        notes,
        assetId,
        assetReturned: assetReturned || false,
        assetCondition
      }
    });
    
    res.status(201).json(clearanceItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Clearance Items
exports.getClearanceItems = async (req, res) => {
  try {
    const { companyId, exitProcessId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (exitProcessId) where.exitProcessId = exitProcessId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const clearanceItems = await prisma.clearanceItem.findMany({
      where,
      include: {
        company: true,
        exitProcess: true,
        employee: true,
        department: true
      },
      orderBy: { dueDate: 'asc' }
    });
    
    res.json(clearanceItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Clearance Item
exports.updateClearanceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedDate, notes, assetReturned, assetCondition } = req.body;
    
    const clearanceItem = await prisma.clearanceItem.update({
      where: { id },
      data: {
        status,
        completedDate,
        notes,
        assetReturned,
        assetCondition
      }
    });
    
    res.json(clearanceItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== COMPLIANCE ====================

// Create Compliance Record
exports.createComplianceRecord = async (req, res) => {
  try {
    const { companyId, employeeId, complianceType, status, requirementName, requirementDescription, effectiveFrom, effectiveTo, certificateNumber, issuingAuthority, issueDate, expiryDate, trainingId, trainingStatus, trainingDueDate, trainingCompletedDate, certificateFile, trainingProof, isExempt, exemptionReason } = req.body;
    
    const complianceRecord = await prisma.complianceRecord.create({
      data: {
        companyId,
        employeeId,
        complianceType,
        status: status || 'PENDING',
        requirementName,
        requirementDescription,
        effectiveFrom,
        effectiveTo,
        certificateNumber,
        issuingAuthority,
        issueDate,
        expiryDate,
        trainingId,
        trainingStatus: trainingStatus || 'NOT_COMPLIANT',
        trainingDueDate,
        trainingCompletedDate,
        certificateFile,
        trainingProof,
        isExempt: isExempt || false,
        exemptionReason
      }
    });
    
    res.status(201).json(complianceRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Compliance Records
exports.getComplianceRecords = async (req, res) => {
  try {
    const { companyId, employeeId, complianceType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (complianceType) where.complianceType = complianceType;
    if (status) where.status = status;
    
    const complianceRecords = await prisma.complianceRecord.findMany({
      where,
      include: {
        company: true,
        employee: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(complianceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Compliance Record
exports.updateComplianceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expiryDate, trainingStatus, trainingCompletedDate, certificateFile, trainingProof, reminderSent, reminderDate, isExempt, exemptionReason } = req.body;
    
    const complianceRecord = await prisma.complianceRecord.update({
      where: { id },
      data: {
        status,
        expiryDate,
        trainingStatus,
        trainingCompletedDate,
        certificateFile,
        trainingProof,
        reminderSent,
        reminderDate,
        isExempt,
        exemptionReason
      }
    });
    
    res.json(complianceRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EMPLOYEE FINANCIAL SERVICES ====================

// Create Loan
exports.createLoan = async (req, res) => {
  try {
    const { companyId, employeeId, loanType, status, principalAmount, currency, interestRate, interestType, repaymentPeriod, monthlyRepayment, totalRepayment, purpose, description, guarantorId, collateral, approvedBy, approvedAt } = req.body;
    
    const loan = await prisma.loan.create({
      data: {
        companyId,
        employeeId,
        loanType,
        status: status || 'PENDING_APPROVAL',
        principalAmount,
        currency: currency || 'USD',
        interestRate,
        interestType,
        repaymentPeriod,
        monthlyRepayment,
        totalRepayment,
        purpose,
        description,
        guarantorId,
        collateral,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Loans
exports.getLoans = async (req, res) => {
  try {
    const { companyId, employeeId, loanType, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (loanType) where.loanType = loanType;
    if (status) where.status = status;
    
    const loans = await prisma.loan.findMany({
      where,
      include: {
        company: true,
        employee: true,
        guarantor: true,
        approver: true,
        repayments: true
      },
      orderBy: { applicationDate: 'desc' }
    });
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Loan
exports.updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalDate, disbursementDate, startDate, endDate, totalRepaid, remainingBalance, lastPaymentDate, isDefaulted, defaultDate, writtenOff, writtenOffDate, writtenOffReason } = req.body;
    
    const loan = await prisma.loan.update({
      where: { id },
      data: {
        status,
        approvalDate,
        disbursementDate,
        startDate,
        endDate,
        totalRepaid,
        remainingBalance,
        lastPaymentDate,
        isDefaulted,
        defaultDate,
        writtenOff,
        writtenOffDate,
        writtenOffReason
      }
    });
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Loan Repayment
exports.createLoanRepayment = async (req, res) => {
  try {
    const { companyId, loanId, employeeId, amount, currency, paymentDate, status, paymentMethod, referenceNumber, isLate, lateFee, notes } = req.body;
    
    const repayment = await prisma.loanRepayment.create({
      data: {
        companyId,
        loanId,
        employeeId,
        amount,
        currency: currency || 'USD',
        paymentDate,
        status: status || 'CURRENT',
        paymentMethod,
        referenceNumber,
        isLate: isLate || false,
        lateFee,
        notes
      }
    });
    
    res.status(201).json(repayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Loan Repayments
exports.getLoanRepayments = async (req, res) => {
  try {
    const { companyId, loanId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (loanId) where.loanId = loanId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const repayments = await prisma.loanRepayment.findMany({
      where,
      include: {
        company: true,
        loan: true,
        employee: true
      },
      orderBy: { paymentDate: 'desc' }
    });
    
    res.json(repayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Salary Advance
exports.createSalaryAdvance = async (req, res) => {
  try {
    const { companyId, employeeId, amount, currency, repaymentAmount, repaymentPeriod, purpose, description, approvedBy, approvedAt } = req.body;
    
    const salaryAdvance = await prisma.salaryAdvance.create({
      data: {
        companyId,
        employeeId,
        amount,
        currency: currency || 'USD',
        repaymentAmount,
        repaymentPeriod,
        purpose,
        description,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(salaryAdvance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Salary Advances
exports.getSalaryAdvances = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const salaryAdvances = await prisma.salaryAdvance.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { requestDate: 'desc' }
    });
    
    res.json(salaryAdvances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Salary Advance
exports.updateSalaryAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalDate, disbursementDate, startDate, endDate, totalRepaid, remainingBalance, lastDeductionDate } = req.body;
    
    const salaryAdvance = await prisma.salaryAdvance.update({
      where: { id },
      data: {
        status,
        approvalDate,
        disbursementDate,
        startDate,
        endDate,
        totalRepaid,
        remainingBalance,
        lastDeductionDate
      }
    });
    
    res.json(salaryAdvance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Deduction
exports.createDeduction = async (req, res) => {
  try {
    const { companyId, employeeId, deductionType, amount, currency, frequency, effectiveFrom, effectiveTo, purpose, description, externalReference, providerName, approvedBy, approvedAt } = req.body;
    
    const deduction = await prisma.deduction.create({
      data: {
        companyId,
        employeeId,
        deductionType,
        amount,
        currency: currency || 'USD',
        frequency: frequency || 'MONTHLY',
        effectiveFrom,
        effectiveTo,
        purpose,
        description,
        externalReference,
        providerName,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(deduction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Deductions
exports.getDeductions = async (req, res) => {
  try {
    const { companyId, employeeId, deductionType, isActive } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (deductionType) where.deductionType = deductionType;
    if (isActive !== undefined) where.isActive = isActive;
    
    const deductions = await prisma.deduction.findMany({
      where,
      include: {
        company: true,
        employee: true,
        approver: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(deductions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Deduction
exports.updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, frequency, effectiveTo, purpose, description, externalReference, providerName, isActive, approvedBy, approvedAt } = req.body;
    
    const deduction = await prisma.deduction.update({
      where: { id },
      data: {
        amount,
        frequency,
        effectiveTo,
        purpose,
        description,
        externalReference,
        providerName,
        isActive,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(deduction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== MATRIX REPORTING & ACTING APPOINTMENTS ====================

// Create Reporting Relationship
exports.createReportingRelationship = async (req, res) => {
  try {
    const { companyId, employeeId, supervisorId, relationshipType, isPrimary, effectiveFrom, effectiveTo, departmentId, projectId, reportingPercentage, approvedBy, approvedAt } = req.body;
    
    const reportingRelationship = await prisma.reportingRelationship.create({
      data: {
        companyId,
        employeeId,
        supervisorId,
        relationshipType,
        isPrimary: isPrimary || false,
        effectiveFrom,
        effectiveTo,
        departmentId,
        projectId,
        reportingPercentage,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(reportingRelationship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Reporting Relationships
exports.getReportingRelationships = async (req, res) => {
  try {
    const { companyId, employeeId, supervisorId, relationshipType } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (supervisorId) where.supervisorId = supervisorId;
    if (relationshipType) where.relationshipType = relationshipType;
    
    const reportingRelationships = await prisma.reportingRelationship.findMany({
      where,
      include: {
        company: true,
        employee: true,
        supervisor: true,
        department: true,
        approver: true
      },
      orderBy: { effectiveFrom: 'desc' }
    });
    
    res.json(reportingRelationships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Reporting Relationship
exports.updateReportingRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPrimary, effectiveTo, reportingPercentage, approvedBy, approvedAt } = req.body;
    
    const reportingRelationship = await prisma.reportingRelationship.update({
      where: { id },
      data: {
        isPrimary,
        effectiveTo,
        reportingPercentage,
        approvedBy,
        approvedAt
      }
    });
    
    res.json(reportingRelationship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Acting Appointment
exports.createActingAppointment = async (req, res) => {
  try {
    const { companyId, employeeId, status, actingPositionId, originalPositionId, incumbentId, startDate, endDate, duration, reason, description, salaryAdjustment, allowanceAdjustment, approvedBy, approvedAt } = req.body;
    
    const actingAppointment = await prisma.actingAppointment.create({
      data: {
        companyId,
        employeeId,
        status: status || 'PENDING',
        actingPositionId,
        originalPositionId,
        incumbentId,
        startDate,
        endDate,
        duration,
        reason,
        description,
        salaryAdjustment,
        allowanceAdjustment,
        approvedBy,
        approvedAt
      }
    });
    
    res.status(201).json(actingAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Acting Appointments
exports.getActingAppointments = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    
    const where = {};
    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const actingAppointments = await prisma.actingAppointment.findMany({
      where,
      include: {
        company: true,
        employee: true,
        incumbent: true,
        approver: true,
        extensionApprover: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    res.json(actingAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Acting Appointment
exports.updateActingAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate, duration, isExtended, extensionReason, extensionApprovedBy, extensionApprovedAt, handoverRequired, handoverCompleted } = req.body;
    
    const actingAppointment = await prisma.actingAppointment.update({
      where: { id },
      data: {
        status,
        endDate,
        duration,
        isExtended,
        extensionReason,
        extensionApprovedBy,
        extensionApprovedAt,
        handoverRequired,
        handoverCompleted
      }
    });
    
    res.json(actingAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
