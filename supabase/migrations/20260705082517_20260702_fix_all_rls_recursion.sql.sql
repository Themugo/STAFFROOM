/*
# Fix All RLS Policies Using Recursive Profile Subqueries

## Problem
Many RLS policies use the pattern:
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
This causes infinite recursion on the `profiles` table and potential performance issues on other tables.

## Fix
Replace all instances of the recursive subquery with the `get_current_user_org_id()` function created in the previous migration.

## Tables Fixed
- employees, departments, positions, attendance, leave_requests
- payroll_runs, payslips, deductions, vacancies, applications, interviews
- workflow_templates, workflow_executions, announcements, expense_claims, contracts
- All tables from the enterprise RBAC migration that used the same pattern

## Safety
- DROP POLICY IF EXISTS before CREATE — idempotent
- No data changes
*/

-- ============================================================
-- EMPLOYEES
-- ============================================================
DROP POLICY IF EXISTS "emp_select_org" ON employees;
CREATE POLICY "emp_select_org" ON employees FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "emp_insert_org" ON employees;
CREATE POLICY "emp_insert_org" ON employees FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "emp_update_org" ON employees;
CREATE POLICY "emp_update_org" ON employees FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- DEPARTMENTS
-- ============================================================
DROP POLICY IF EXISTS "dept_select_org" ON departments;
CREATE POLICY "dept_select_org" ON departments FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "dept_insert_org" ON departments;
CREATE POLICY "dept_insert_org" ON departments FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "dept_update_org" ON departments;
CREATE POLICY "dept_update_org" ON departments FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- POSITIONS
-- ============================================================
DROP POLICY IF EXISTS "pos_select_org" ON positions;
CREATE POLICY "pos_select_org" ON positions FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "pos_insert_org" ON positions;
CREATE POLICY "pos_insert_org" ON positions FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "pos_update_org" ON positions;
CREATE POLICY "pos_update_org" ON positions FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- ATTENDANCE
-- ============================================================
DROP POLICY IF EXISTS "att_select_org" ON attendance;
CREATE POLICY "att_select_org" ON attendance FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "att_insert_org" ON attendance;
CREATE POLICY "att_insert_org" ON attendance FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "att_update_org" ON attendance;
CREATE POLICY "att_update_org" ON attendance FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- LEAVE_REQUESTS
-- ============================================================
DROP POLICY IF EXISTS "leave_select_org" ON leave_requests;
CREATE POLICY "leave_select_org" ON leave_requests FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "leave_insert_org" ON leave_requests;
CREATE POLICY "leave_insert_org" ON leave_requests FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "leave_update_org" ON leave_requests;
CREATE POLICY "leave_update_org" ON leave_requests FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- PAYROLL_RUNS
-- ============================================================
DROP POLICY IF EXISTS "payroll_select_org" ON payroll_runs;
CREATE POLICY "payroll_select_org" ON payroll_runs FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "payroll_insert_org" ON payroll_runs;
CREATE POLICY "payroll_insert_org" ON payroll_runs FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "payroll_update_org" ON payroll_runs;
CREATE POLICY "payroll_update_org" ON payroll_runs FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- PAYSLIPS
-- ============================================================
DROP POLICY IF EXISTS "payslip_select_org" ON payslips;
CREATE POLICY "payslip_select_org" ON payslips FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "payslip_insert_org" ON payslips;
CREATE POLICY "payslip_insert_org" ON payslips FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "payslip_update_org" ON payslips;
CREATE POLICY "payslip_update_org" ON payslips FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- DEDUCTIONS
-- ============================================================
DROP POLICY IF EXISTS "ded_select_org" ON deductions;
CREATE POLICY "ded_select_org" ON deductions FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "ded_insert_org" ON deductions;
CREATE POLICY "ded_insert_org" ON deductions FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "ded_update_org" ON deductions;
CREATE POLICY "ded_update_org" ON deductions FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- VACANCIES
-- ============================================================
DROP POLICY IF EXISTS "vac_select_org" ON vacancies;
CREATE POLICY "vac_select_org" ON vacancies FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "vac_insert_org" ON vacancies;
CREATE POLICY "vac_insert_org" ON vacancies FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "vac_update_org" ON vacancies;
CREATE POLICY "vac_update_org" ON vacancies FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- APPLICATIONS
-- ============================================================
DROP POLICY IF EXISTS "app_select_org" ON applications;
CREATE POLICY "app_select_org" ON applications FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "app_insert_org" ON applications;
CREATE POLICY "app_insert_org" ON applications FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "app_update_org" ON applications;
CREATE POLICY "app_update_org" ON applications FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- INTERVIEWS
-- ============================================================
DROP POLICY IF EXISTS "int_select_org" ON interviews;
CREATE POLICY "int_select_org" ON interviews FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "int_insert_org" ON interviews;
CREATE POLICY "int_insert_org" ON interviews FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "int_update_org" ON interviews;
CREATE POLICY "int_update_org" ON interviews FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- WORKFLOW_TEMPLATES & EXECUTIONS
-- ============================================================
DROP POLICY IF EXISTS "workflow_tpl_select_org" ON workflow_templates;
CREATE POLICY "workflow_tpl_select_org" ON workflow_templates FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "workflow_tpl_insert_org" ON workflow_templates;
CREATE POLICY "workflow_tpl_insert_org" ON workflow_templates FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "workflow_tpl_update_org" ON workflow_templates;
CREATE POLICY "workflow_tpl_update_org" ON workflow_templates FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "workflow_exec_select_org" ON workflow_executions;
CREATE POLICY "workflow_exec_select_org" ON workflow_executions FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "workflow_exec_insert_org" ON workflow_executions;
CREATE POLICY "workflow_exec_insert_org" ON workflow_executions FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "workflow_exec_update_org" ON workflow_executions;
CREATE POLICY "workflow_exec_update_org" ON workflow_executions FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
DROP POLICY IF EXISTS "ann_select_org" ON announcements;
CREATE POLICY "ann_select_org" ON announcements FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "ann_insert_org" ON announcements;
CREATE POLICY "ann_insert_org" ON announcements FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "ann_update_org" ON announcements;
CREATE POLICY "ann_update_org" ON announcements FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- EXPENSE_CLAIMS
-- ============================================================
DROP POLICY IF EXISTS "exp_select_org" ON expense_claims;
CREATE POLICY "exp_select_org" ON expense_claims FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "exp_insert_org" ON expense_claims;
CREATE POLICY "exp_insert_org" ON expense_claims FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "exp_update_org" ON expense_claims;
CREATE POLICY "exp_update_org" ON expense_claims FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- CONTRACTS
-- ============================================================
DROP POLICY IF EXISTS "contract_select_org" ON contracts;
CREATE POLICY "contract_select_org" ON contracts FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "contract_insert_org" ON contracts;
CREATE POLICY "contract_insert_org" ON contracts FOR INSERT
  TO authenticated WITH CHECK (organization_id = get_current_user_org_id());

DROP POLICY IF EXISTS "contract_update_org" ON contracts;
CREATE POLICY "contract_update_org" ON contracts FOR UPDATE
  TO authenticated USING (organization_id = get_current_user_org_id());

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
DROP POLICY IF EXISTS "org_insert_admin" ON organizations;
CREATE POLICY "org_insert_admin" ON organizations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER')
  );

DROP POLICY IF EXISTS "org_update_admin" ON organizations;
CREATE POLICY "org_update_admin" ON organizations FOR UPDATE
  TO authenticated USING (
    id = get_current_user_org_id()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN'))
  );

-- ============================================================
-- Enterprise RBAC tables that used the same pattern
-- ============================================================
-- teams
DROP POLICY IF EXISTS "read_teams_org" ON teams;
CREATE POLICY "read_teams_org" ON teams FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- employee_reporting
DROP POLICY IF EXISTS "read_reporting_org" ON employee_reporting;
CREATE POLICY "read_reporting_org" ON employee_reporting FOR SELECT
  TO authenticated USING (
    organization_id = get_current_user_org_id()
    OR employee_id = auth.uid()
    OR manager_id = auth.uid()
  );

-- leave_policies
DROP POLICY IF EXISTS "read_leave_policies_org" ON leave_policies;
CREATE POLICY "read_leave_policies_org" ON leave_policies FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- approval_workflows
DROP POLICY IF EXISTS "read_approval_workflows_org" ON approval_workflows;
CREATE POLICY "read_approval_workflows_org" ON approval_workflows FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- approval_delegations
DROP POLICY IF EXISTS "read_delegations_org" ON approval_delegations;
CREATE POLICY "read_delegations_org" ON approval_delegations FOR SELECT
  TO authenticated USING (
    organization_id = get_current_user_org_id()
    OR delegator_id = auth.uid()
    OR delegate_id = auth.uid()
  );

-- department_announcements
DROP POLICY IF EXISTS "read_dept_announcements" ON department_announcements;
CREATE POLICY "read_dept_announcements" ON department_announcements FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- team_announcements
DROP POLICY IF EXISTS "read_team_announcements" ON team_announcements;
CREATE POLICY "read_team_announcements" ON team_announcements FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- duty_rosters
DROP POLICY IF EXISTS "read_rosters_org" ON duty_rosters;
CREATE POLICY "read_rosters_org" ON duty_rosters FOR SELECT
  TO authenticated USING (organization_id = get_current_user_org_id());

-- user_role_overrides
DROP POLICY IF EXISTS "read_all_overrides_admin" ON user_role_overrides;
CREATE POLICY "read_all_overrides_admin" ON user_role_overrides FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'IT_ADMIN'))
  );
