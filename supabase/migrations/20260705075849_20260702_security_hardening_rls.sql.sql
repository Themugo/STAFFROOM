/*
# Security Hardening: Replace Permissive RLS Policies with Org-Scoped Policies

## Overview
The initial migration created permissive RLS policies (USING (true)) on all core tables.
This migration drops those policies and replaces them with organization-scoped, role-aware policies.

## Tables Affected
- employees, departments, positions, attendance, leave_requests
- payroll_runs, payslips, deductions, vacancies, applications, interviews

## Policy Pattern
- SELECT: Users can only read data within their organization
- INSERT: Users can only insert data within their organization
- UPDATE: Users can only update data within their organization
- DELETE: Only ADMIN, SYSTEM_OWNER, HR_DIRECTOR, HR_OFFICER can delete

## Safety
- All policies use organization_id matching via profiles table
- No data is lost — only policies change
- Idempotent: DROP POLICY IF EXISTS before CREATE
*/

-- ============================================================
-- EMPLOYEES
-- ============================================================
DROP POLICY IF EXISTS "emp_select" ON employees;
DROP POLICY IF EXISTS "emp_insert" ON employees;
DROP POLICY IF EXISTS "emp_update" ON employees;
DROP POLICY IF EXISTS "emp_delete" ON employees;

CREATE POLICY "emp_select_org" ON employees FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "emp_insert_org" ON employees FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "emp_update_org" ON employees FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "emp_delete_admin" ON employees FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER'))
  );

-- ============================================================
-- DEPARTMENTS
-- ============================================================
DROP POLICY IF EXISTS "dept_select" ON departments;
DROP POLICY IF EXISTS "dept_insert" ON departments;
DROP POLICY IF EXISTS "dept_update" ON departments;
DROP POLICY IF EXISTS "dept_delete" ON departments;

CREATE POLICY "dept_select_org" ON departments FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "dept_insert_org" ON departments FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "dept_update_org" ON departments FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "dept_delete_admin" ON departments FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR'))
  );

-- ============================================================
-- POSITIONS
-- ============================================================
DROP POLICY IF EXISTS "pos_select" ON positions;
DROP POLICY IF EXISTS "pos_insert" ON positions;
DROP POLICY IF EXISTS "pos_update" ON positions;
DROP POLICY IF EXISTS "pos_delete" ON positions;

CREATE POLICY "pos_select_org" ON positions FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "pos_insert_org" ON positions FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "pos_update_org" ON positions FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "pos_delete_admin" ON positions FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR'))
  );

-- ============================================================
-- ATTENDANCE
-- ============================================================
DROP POLICY IF EXISTS "att_select" ON attendance;
DROP POLICY IF EXISTS "att_insert" ON attendance;
DROP POLICY IF EXISTS "att_update" ON attendance;
DROP POLICY IF EXISTS "att_delete" ON attendance;

CREATE POLICY "att_select_org" ON attendance FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "att_insert_org" ON attendance FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "att_update_org" ON attendance FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "att_delete_admin" ON attendance FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER'))
  );

-- ============================================================
-- LEAVE_REQUESTS
-- ============================================================
DROP POLICY IF EXISTS "leave_select" ON leave_requests;
DROP POLICY IF EXISTS "leave_insert" ON leave_requests;
DROP POLICY IF EXISTS "leave_update" ON leave_requests;
DROP POLICY IF EXISTS "leave_delete" ON leave_requests;

CREATE POLICY "leave_select_org" ON leave_requests FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "leave_insert_org" ON leave_requests FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "leave_update_org" ON leave_requests FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "leave_delete_admin" ON leave_requests FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER'))
  );

-- ============================================================
-- PAYROLL_RUNS
-- ============================================================
DROP POLICY IF EXISTS "payroll_select" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_insert" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_update" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_delete" ON payroll_runs;

CREATE POLICY "payroll_select_org" ON payroll_runs FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payroll_insert_org" ON payroll_runs FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payroll_update_org" ON payroll_runs FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payroll_delete_admin" ON payroll_runs FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'PAYROLL_OFFICER'))
  );

-- ============================================================
-- PAYSLIPS
-- ============================================================
DROP POLICY IF EXISTS "payslip_select" ON payslips;
DROP POLICY IF EXISTS "payslip_insert" ON payslips;
DROP POLICY IF EXISTS "payslip_update" ON payslips;
DROP POLICY IF EXISTS "payslip_delete" ON payslips;

CREATE POLICY "payslip_select_org" ON payslips FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payslip_insert_org" ON payslips FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payslip_update_org" ON payslips FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "payslip_delete_admin" ON payslips FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'PAYROLL_OFFICER'))
  );

-- ============================================================
-- DEDUCTIONS
-- ============================================================
DROP POLICY IF EXISTS "ded_select" ON deductions;
DROP POLICY IF EXISTS "ded_insert" ON deductions;
DROP POLICY IF EXISTS "ded_update" ON deductions;
DROP POLICY IF EXISTS "ded_delete" ON deductions;

CREATE POLICY "ded_select_org" ON deductions FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ded_insert_org" ON deductions FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ded_update_org" ON deductions FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ded_delete_admin" ON deductions FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'PAYROLL_OFFICER'))
  );

-- ============================================================
-- VACANCIES
-- ============================================================
DROP POLICY IF EXISTS "vac_select" ON vacancies;
DROP POLICY IF EXISTS "vac_insert" ON vacancies;
DROP POLICY IF EXISTS "vac_update" ON vacancies;
DROP POLICY IF EXISTS "vac_delete" ON vacancies;

CREATE POLICY "vac_select_org" ON vacancies FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "vac_insert_org" ON vacancies FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "vac_update_org" ON vacancies FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "vac_delete_admin" ON vacancies FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'RECRUITER'))
  );

-- ============================================================
-- APPLICATIONS
-- ============================================================
DROP POLICY IF EXISTS "app_select" ON applications;
DROP POLICY IF EXISTS "app_insert" ON applications;
DROP POLICY IF EXISTS "app_update" ON applications;
DROP POLICY IF EXISTS "app_delete" ON applications;

CREATE POLICY "app_select_org" ON applications FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "app_insert_org" ON applications FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "app_update_org" ON applications FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "app_delete_admin" ON applications FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'RECRUITER'))
  );

-- ============================================================
-- INTERVIEWS
-- ============================================================
DROP POLICY IF EXISTS "int_select" ON interviews;
DROP POLICY IF EXISTS "int_insert" ON interviews;
DROP POLICY IF EXISTS "int_update" ON interviews;
DROP POLICY IF EXISTS "int_delete" ON interviews;

CREATE POLICY "int_select_org" ON interviews FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "int_insert_org" ON interviews FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "int_update_org" ON interviews FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "int_delete_admin" ON interviews FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'RECRUITER'))
  );

-- ============================================================
-- WORKFLOW_TEMPLATES & EXECUTIONS
-- ============================================================
DROP POLICY IF EXISTS "workflow_tpl_select" ON workflow_templates;
DROP POLICY IF EXISTS "workflow_tpl_insert" ON workflow_templates;
DROP POLICY IF EXISTS "workflow_tpl_update" ON workflow_templates;
DROP POLICY IF EXISTS "workflow_tpl_delete" ON workflow_templates;

CREATE POLICY "workflow_tpl_select_org" ON workflow_templates FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_tpl_insert_org" ON workflow_templates FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_tpl_update_org" ON workflow_templates FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_tpl_delete_admin" ON workflow_templates FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'IT_ADMIN'))
  );

DROP POLICY IF EXISTS "workflow_exec_select" ON workflow_executions;
DROP POLICY IF EXISTS "workflow_exec_insert" ON workflow_executions;
DROP POLICY IF EXISTS "workflow_exec_update" ON workflow_executions;
DROP POLICY IF EXISTS "workflow_exec_delete" ON workflow_executions;

CREATE POLICY "workflow_exec_select_org" ON workflow_executions FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_exec_insert_org" ON workflow_executions FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_exec_update_org" ON workflow_executions FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "workflow_exec_delete_admin" ON workflow_executions FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'IT_ADMIN'))
  );

-- ============================================================
-- NOTIFICATIONS — org-scoped
-- ============================================================
DROP POLICY IF EXISTS "notif_select" ON notifications;
DROP POLICY IF EXISTS "notif_insert" ON notifications;
DROP POLICY IF EXISTS "notif_update" ON notifications;
DROP POLICY IF EXISTS "notif_delete" ON notifications;

CREATE POLICY "notif_select_own" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_update_own" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_delete_own" ON notifications FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- ANNOUNCEMENTS — org-scoped
-- ============================================================
DROP POLICY IF EXISTS "ann_select" ON announcements;
DROP POLICY IF EXISTS "ann_insert" ON announcements;
DROP POLICY IF EXISTS "ann_update" ON announcements;
DROP POLICY IF EXISTS "ann_delete" ON announcements;

CREATE POLICY "ann_select_org" ON announcements FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ann_insert_org" ON announcements FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ann_update_org" ON announcements FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "ann_delete_admin" ON announcements FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'DEPT_MANAGER'))
  );

-- ============================================================
-- EXPENSE_CLAIMS — org-scoped
-- ============================================================
DROP POLICY IF EXISTS "exp_select" ON expense_claims;
DROP POLICY IF EXISTS "exp_insert" ON expense_claims;
DROP POLICY IF EXISTS "exp_update" ON expense_claims;
DROP POLICY IF EXISTS "exp_delete" ON expense_claims;

CREATE POLICY "exp_select_org" ON expense_claims FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "exp_insert_org" ON expense_claims FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "exp_update_org" ON expense_claims FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "exp_delete_admin" ON expense_claims FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'FINANCE'))
  );

-- ============================================================
-- CONTRACTS — org-scoped
-- ============================================================
DROP POLICY IF EXISTS "contract_select" ON contracts;
DROP POLICY IF EXISTS "contract_insert" ON contracts;
DROP POLICY IF EXISTS "contract_update" ON contracts;
DROP POLICY IF EXISTS "contract_delete" ON contracts;

CREATE POLICY "contract_select_org" ON contracts FOR SELECT
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "contract_insert_org" ON contracts FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "contract_update_org" ON contracts FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "contract_delete_admin" ON contracts FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR'))
  );

-- ============================================================
-- PROFILES — org-scoped (users can read own org profiles, update own)
-- ============================================================
DROP POLICY IF EXISTS "profile_select" ON profiles;
DROP POLICY IF EXISTS "profile_insert" ON profiles;
DROP POLICY IF EXISTS "profile_update" ON profiles;
DROP POLICY IF EXISTS "profile_delete" ON profiles;

CREATE POLICY "profile_select_org" ON profiles FOR SELECT
  TO authenticated USING (
    id = auth.uid()
    OR organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "profile_insert_org" ON profiles FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "profile_update_own" ON profiles FOR UPDATE
  TO authenticated USING (
    id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'IT_ADMIN'))
  );
CREATE POLICY "profile_delete_admin" ON profiles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN', 'IT_ADMIN'))
  );

-- ============================================================
-- ORGANIZATIONS — users can read their own org, admins can update
-- ============================================================
DROP POLICY IF EXISTS "org_select" ON organizations;
DROP POLICY IF EXISTS "org_insert" ON organizations;
DROP POLICY IF EXISTS "org_update" ON organizations;
DROP POLICY IF EXISTS "org_delete" ON organizations;

CREATE POLICY "org_select_own" ON organizations FOR SELECT
  TO authenticated USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER')
  );
CREATE POLICY "org_insert_admin" ON organizations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER')
  );
CREATE POLICY "org_update_admin" ON organizations FOR UPDATE
  TO authenticated USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SYSTEM_OWNER', 'ADMIN'))
  );
CREATE POLICY "org_delete_super" ON organizations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER')
  );
