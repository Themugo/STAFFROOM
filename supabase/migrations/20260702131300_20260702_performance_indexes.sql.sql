/*
# Performance Indexes for HR Platform

1. Purpose
   Add indexes on frequently queried columns across key HR tables to improve dashboard, list, and search performance.

2. Indexes Added
   - employees: organization_id + status (dashboard filter), department_id (department page), email (search)
   - attendance: organization_id + date (dashboard), employee_id + date (profile page)
   - leave_requests: organization_id + status (dashboard), employee_id (profile)
   - payroll_runs: organization_id + created_at (dashboard)
   - applications: organization_id + status (recruitment)
   - vacancies: organization_id + status (recruitment)
   - announcements: organization_id + created_at (announcements page)
   - expense_claims: organization_id + status (expense page), employee_id (profile)
   - workflow_templates: created_by (workflow builder)
   - workflow_executions: created_at (workflow builder)

3. Safety
   All indexes use IF NOT EXISTS — safe to re-run.
*/

CREATE INDEX IF NOT EXISTS idx_employees_org_status ON employees(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

CREATE INDEX IF NOT EXISTS idx_attendance_org_date ON attendance(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance(employee_id, date);

CREATE INDEX IF NOT EXISTS idx_leave_org_status ON leave_requests(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_leave_emp ON leave_requests(employee_id);

CREATE INDEX IF NOT EXISTS idx_payroll_org_created ON payroll_runs(organization_id, created_at);

CREATE INDEX IF NOT EXISTS idx_applications_org_status ON applications(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_vacancies_org_status ON vacancies(organization_id, status);

CREATE INDEX IF NOT EXISTS idx_announcements_org_created ON announcements(organization_id, created_at);
CREATE INDEX IF NOT EXISTS idx_expense_claims_org_status ON expense_claims(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_expense_claims_emp ON expense_claims(employee_id);

CREATE INDEX IF NOT EXISTS idx_workflow_tpl_creator ON workflow_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_workflow_exec_created ON workflow_executions(created_at);
