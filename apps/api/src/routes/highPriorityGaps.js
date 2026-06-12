const express = require('express');
const router = express.Router();
const highPriorityGapsController = require('../controllers/highPriorityGapsController');
const { authenticate, authorize } = require('../middleware/auth');

// ==================== EMPLOYMENT TYPES & CONTRACT GOVERNANCE ====================

// Employment Contract Routes
router.post('/contracts', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createEmploymentContract);
router.get('/contracts', authenticate, highPriorityGapsController.getEmploymentContracts);
router.get('/contracts/:id', authenticate, highPriorityGapsController.getEmploymentContractById);
router.put('/contracts/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateEmploymentContract);

// Contract Amendment Routes
router.post('/contract-amendments', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createContractAmendment);
router.get('/contract-amendments', authenticate, highPriorityGapsController.getContractAmendments);

// ==================== COMPENSATION & BENEFITS ====================

// Compensation Component Routes
router.post('/compensation-components', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createCompensationComponent);
router.get('/compensation-components', authenticate, highPriorityGapsController.getCompensationComponents);
router.put('/compensation-components/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateCompensationComponent);

// Benefit Enrollment Routes
router.post('/benefit-enrollments', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createBenefitEnrollment);
router.get('/benefit-enrollments', authenticate, highPriorityGapsController.getBenefitEnrollments);
router.put('/benefit-enrollments/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateBenefitEnrollment);

// ==================== DISCIPLINE & CONDUCT ====================

// Disciplinary Record Routes
router.post('/disciplinary-records', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createDisciplinaryRecord);
router.get('/disciplinary-records', authenticate, highPriorityGapsController.getDisciplinaryRecords);

// Investigation Routes
router.post('/investigations', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createInvestigation);
router.get('/investigations', authenticate, highPriorityGapsController.getInvestigations);
router.put('/investigations/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateInvestigation);

// Disciplinary Hearing Routes
router.post('/disciplinary-hearings', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createDisciplinaryHearing);
router.get('/disciplinary-hearings', authenticate, highPriorityGapsController.getDisciplinaryHearings);

// Disciplinary Appeal Routes
router.post('/disciplinary-appeals', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createDisciplinaryAppeal);
router.get('/disciplinary-appeals', authenticate, highPriorityGapsController.getDisciplinaryAppeals);

// Suspension Routes
router.post('/suspensions', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createSuspension);
router.get('/suspensions', authenticate, highPriorityGapsController.getSuspensions);

// ==================== GRIEVANCES ====================

// Grievance Routes
router.post('/grievances', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createGrievance);
router.get('/grievances', authenticate, highPriorityGapsController.getGrievances);
router.put('/grievances/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateGrievance);

// ==================== OCCUPATIONAL HEALTH & SAFETY ====================

// Incident Routes
router.post('/incidents', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createIncident);
router.get('/incidents', authenticate, highPriorityGapsController.getIncidents);
router.put('/incidents/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateIncident);

// Medical Case Routes
router.post('/medical-cases', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createMedicalCase);
router.get('/medical-cases', authenticate, highPriorityGapsController.getMedicalCases);

// Safety Violation Routes
router.post('/safety-violations', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createSafetyViolation);
router.get('/safety-violations', authenticate, highPriorityGapsController.getSafetyViolations);

// ==================== EXIT MANAGEMENT ====================

// Exit Process Routes
router.post('/exit-processes', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createExitProcess);
router.get('/exit-processes', authenticate, highPriorityGapsController.getExitProcesses);
router.put('/exit-processes/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateExitProcess);

// Clearance Item Routes
router.post('/clearance-items', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createClearanceItem);
router.get('/clearance-items', authenticate, highPriorityGapsController.getClearanceItems);
router.put('/clearance-items/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateClearanceItem);

// ==================== COMPLIANCE ====================

// Compliance Record Routes
router.post('/compliance-records', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createComplianceRecord);
router.get('/compliance-records', authenticate, highPriorityGapsController.getComplianceRecords);
router.put('/compliance-records/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateComplianceRecord);

// ==================== EMPLOYEE FINANCIAL SERVICES ====================

// Loan Routes
router.post('/loans', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createLoan);
router.get('/loans', authenticate, highPriorityGapsController.getLoans);
router.put('/loans/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateLoan);

// Loan Repayment Routes
router.post('/loan-repayments', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createLoanRepayment);
router.get('/loan-repayments', authenticate, highPriorityGapsController.getLoanRepayments);

// Salary Advance Routes
router.post('/salary-advances', authenticate, authorize(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']), highPriorityGapsController.createSalaryAdvance);
router.get('/salary-advances', authenticate, highPriorityGapsController.getSalaryAdvances);
router.put('/salary-advances/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateSalaryAdvance);

// Deduction Routes
router.post('/deductions', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createDeduction);
router.get('/deductions', authenticate, highPriorityGapsController.getDeductions);
router.put('/deductions/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateDeduction);

// ==================== MATRIX REPORTING & ACTING APPOINTMENTS ====================

// Reporting Relationship Routes
router.post('/reporting-relationships', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createReportingRelationship);
router.get('/reporting-relationships', authenticate, highPriorityGapsController.getReportingRelationships);
router.put('/reporting-relationships/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateReportingRelationship);

// Acting Appointment Routes
router.post('/acting-appointments', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.createActingAppointment);
router.get('/acting-appointments', authenticate, highPriorityGapsController.getActingAppointments);
router.put('/acting-appointments/:id', authenticate, authorize(['ADMIN', 'HR_MANAGER']), highPriorityGapsController.updateActingAppointment);

module.exports = router;
