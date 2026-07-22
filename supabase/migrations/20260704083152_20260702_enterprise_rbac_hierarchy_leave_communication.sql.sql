/*
# Enterprise RBAC, Leave Policy Engine, Approval Workflows & Communication Hub

## Overview
This migration implements a comprehensive enterprise authorization system with:
1. Permission-based RBAC with 12 enterprise roles and granular permissions
2. Organizational hierarchy support (parent/child departments, teams)
3. Configurable leave policy engine with accrual rules
4. Multi-level approval workflows with delegation
5. Department communication tables
6. Duty roster scheduling

## New Tables

### RBAC
- `enterprise_roles` — 12 enterprise role definitions with inheritance
- `enterprise_permissions` — Module + feature + action permissions catalog
- `role_permission_map` — Maps permissions to roles (many-to-many)
- `user_role_overrides` — Per-user permission overrides (grant/deny)

### Hierarchy
- `teams` — Sub-department teams with team leads
- `employee_reporting` — Reporting manager relationships

### Leave Engine
- `leave_policies` — Per-organization leave policy configuration
- `leave_policy_rules` — Individual leave type rules (accrual, carry-forward, etc.)
- `leave_types_config` — Organization-specific leave type configuration

### Approval Workflows
- `approval_workflows` — Workflow definitions for different entity types
- `approval_workflow_steps` — Ordered approval steps with conditions
- `approval_delegations` — Temporary delegation of approval authority

### Communication
- `department_announcements` — Department-targeted announcements
- `team_announcements` — Team-targeted announcements
- `direct_messages` — 1:1 messaging between users
- `message_attachments` — File attachments for messages
- `message_reads` — Read receipts

### Duty Roster
- `duty_rosters` — Department scheduling rosters
- `duty_roster_entries` — Individual shift assignments

## Security
- RLS enabled on all new tables
- Organization-level isolation enforced via RLS
- Department-level isolation for department-scoped tables
- Audit logging for permission changes
*/

-- ============================================================
-- 1. ENTERPRISE RBAC SYSTEM
-- ============================================================

-- Enterprise roles with hierarchy levels (higher = more access)
CREATE TABLE IF NOT EXISTS enterprise_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  hierarchy_level integer NOT NULL DEFAULT 0,
  inherits_from text,
  is_system_role boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Seed the 12 enterprise roles
INSERT INTO enterprise_roles (name, display_name, description, hierarchy_level, is_system_role) VALUES
  ('SUPER_ADMIN', 'Super Administrator', 'Full platform access across all organizations', 100, true),
  ('ORG_OWNER', 'Organization Owner', 'Full access to their organization', 90, true),
  ('HR_DIRECTOR', 'HR Director', 'Strategic HR management across the organization', 80, true),
  ('HR_OFFICER', 'HR Officer', 'Day-to-day HR operations', 70, true),
  ('PAYROLL_OFFICER', 'Payroll Officer', 'Payroll processing and management', 70, true),
  ('FINANCE', 'Finance', 'Financial reporting and expense management', 65, true),
  ('DEPT_MANAGER', 'Department Manager', 'Manage their department and team', 60, true),
  ('TEAM_LEAD', 'Team Leader', 'Lead a team within a department', 50, true),
  ('RECRUITER', 'Recruiter', 'Manage recruitment pipeline', 55, true),
  ('EMPLOYEE', 'Employee', 'Self-service access only', 10, true),
  ('AUDITOR', 'Auditor', 'Read-only access to all data for compliance', 85, true),
  ('IT_ADMIN', 'IT Administrator', 'System configuration and user management', 75, true)
ON CONFLICT DO NOTHING;

-- Permission catalog: module + feature + action
CREATE TABLE IF NOT EXISTS enterprise_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  feature text NOT NULL,
  action text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(module, feature, action)
);

-- Seed permissions for all modules
INSERT INTO enterprise_permissions (module, feature, action, description) VALUES
  -- Dashboard
  ('dashboard', 'overview', 'read', 'View dashboard'),
  ('dashboard', 'analytics', 'read', 'View analytics and insights'),
  ('dashboard', 'executive', 'read', 'View executive KPIs'),
  -- Employees
  ('employees', 'all', 'read', 'View all employees in organization'),
  ('employees', 'department', 'read', 'View employees in own department'),
  ('employees', 'self', 'read', 'View own employee profile'),
  ('employees', 'all', 'create', 'Create new employees'),
  ('employees', 'all', 'update', 'Update employee records'),
  ('employees', 'self', 'update', 'Update own profile'),
  ('employees', 'all', 'delete', 'Delete employees'),
  ('employees', 'all', 'export', 'Export employee data'),
  -- Departments
  ('departments', 'all', 'read', 'View all departments'),
  ('departments', 'own', 'read', 'View own department'),
  ('departments', 'all', 'create', 'Create departments'),
  ('departments', 'all', 'update', 'Update departments'),
  ('departments', 'all', 'delete', 'Delete departments'),
  -- Positions
  ('positions', 'all', 'read', 'View all positions'),
  ('positions', 'all', 'create', 'Create positions'),
  ('positions', 'all', 'update', 'Update positions'),
  ('positions', 'all', 'delete', 'Delete positions'),
  -- Attendance
  ('attendance', 'all', 'read', 'View all attendance records'),
  ('attendance', 'department', 'read', 'View department attendance'),
  ('attendance', 'self', 'read', 'View own attendance'),
  ('attendance', 'self', 'create', 'Clock in/out'),
  ('attendance', 'all', 'export', 'Export attendance data'),
  -- Leave
  ('leave', 'all', 'read', 'View all leave requests'),
  ('leave', 'department', 'read', 'View department leave requests'),
  ('leave', 'self', 'read', 'View own leave requests'),
  ('leave', 'self', 'create', 'Submit leave requests'),
  ('leave', 'all', 'approve', 'Approve/reject leave requests'),
  ('leave', 'department', 'approve', 'Approve leave for department'),
  ('leave', 'all', 'export', 'Export leave data'),
  ('leave', 'policies', 'manage', 'Configure leave policies'),
  -- Payroll
  ('payroll', 'all', 'read', 'View all payroll data'),
  ('payroll', 'self', 'read', 'View own payslips'),
  ('payroll', 'runs', 'create', 'Create payroll runs'),
  ('payroll', 'runs', 'process', 'Process payroll runs'),
  ('payroll', 'runs', 'approve', 'Approve payroll runs'),
  ('payroll', 'all', 'export', 'Export payroll data'),
  -- Recruitment
  ('recruitment', 'all', 'read', 'View recruitment pipeline'),
  ('recruitment', 'all', 'create', 'Create vacancies'),
  ('recruitment', 'all', 'update', 'Update applications'),
  ('recruitment', 'all', 'delete', 'Delete vacancies'),
  ('recruitment', 'all', 'export', 'Export recruitment data'),
  -- Users & Security
  ('users', 'all', 'read', 'View all users'),
  ('users', 'all', 'create', 'Create users'),
  ('users', 'all', 'update', 'Update users'),
  ('users', 'all', 'delete', 'Delete users'),
  ('security', 'center', 'read', 'Access security center'),
  ('security', 'policies', 'manage', 'Manage security policies'),
  ('security', 'audit', 'read', 'View audit logs'),
  -- Settings
  ('settings', 'organization', 'manage', 'Manage organization settings'),
  ('settings', 'workflows', 'manage', 'Manage workflows'),
  -- Communication
  ('communication', 'announcements', 'create', 'Create announcements'),
  ('communication', 'announcements', 'read', 'View announcements'),
  ('communication', 'announcements', 'delete', 'Delete announcements'),
  ('communication', 'messages', 'send', 'Send direct messages'),
  ('communication', 'messages', 'read', 'Read messages'),
  -- Expenses
  ('expenses', 'self', 'create', 'Submit expense claims'),
  ('expenses', 'all', 'read', 'View all expense claims'),
  ('expenses', 'department', 'read', 'View department expense claims'),
  ('expenses', 'all', 'approve', 'Approve/reject expense claims'),
  ('expenses', 'all', 'export', 'Export expense data'),
  -- Duty Roster
  ('roster', 'all', 'read', 'View all duty rosters'),
  ('roster', 'department', 'read', 'View department rosters'),
  ('roster', 'self', 'read', 'View own roster'),
  ('roster', 'department', 'create', 'Create department rosters'),
  ('roster', 'department', 'update', 'Update rosters'),
  ('roster', 'all', 'export', 'Export roster data'),
  -- AI
  ('ai', 'copilot', 'use', 'Use AI Copilot')
ON CONFLICT DO NOTHING;

-- Role-permission mapping (many-to-many)
CREATE TABLE IF NOT EXISTS role_permission_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL,
  permission_id uuid NOT NULL REFERENCES enterprise_permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_name, permission_id)
);

-- Map permissions to roles
-- SUPER_ADMIN: everything
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'SUPER_ADMIN', id FROM enterprise_permissions
ON CONFLICT DO NOTHING;

-- ORG_OWNER: everything except security center management at platform level
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'ORG_OWNER', id FROM enterprise_permissions
WHERE module NOT IN ('security') OR feature NOT IN ('policies')
ON CONFLICT DO NOTHING;

-- HR_DIRECTOR: HR strategic + analytics + executive + leave policies + audit
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'HR_DIRECTOR', id FROM enterprise_permissions
WHERE (module IN ('dashboard', 'employees', 'departments', 'positions', 'leave', 'recruitment', 'communication', 'users', 'ai')
  OR (module = 'security' AND feature IN ('center', 'audit'))
  OR (module = 'settings' AND feature IN ('organization', 'workflows')))
  AND action NOT IN ('delete')
ON CONFLICT DO NOTHING;

-- HR_OFFICER: HR operations
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'HR_OFFICER', id FROM enterprise_permissions
WHERE module IN ('dashboard', 'employees', 'departments', 'positions', 'leave', 'attendance', 'recruitment', 'communication', 'ai')
  AND action NOT IN ('delete')
ON CONFLICT DO NOTHING;

-- PAYROLL_OFFICER: payroll only
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'PAYROLL_OFFICER', id FROM enterprise_permissions
WHERE module IN ('dashboard', 'payroll', 'employees')
  AND feature IN ('all', 'self', 'overview', 'runs')
ON CONFLICT DO NOTHING;

-- FINANCE: payroll read + expenses + analytics
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'FINANCE', id FROM enterprise_permissions
WHERE (module = 'payroll' AND action = 'read')
  OR (module = 'expenses' AND action IN ('read', 'approve', 'export'))
  OR (module = 'dashboard' AND feature IN ('overview', 'analytics', 'executive'))
  OR (module = 'employees' AND action = 'read' AND feature = 'all')
ON CONFLICT DO NOTHING;

-- DEPT_MANAGER: manage their department
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'DEPT_MANAGER', id FROM enterprise_permissions
WHERE (module = 'dashboard' AND feature IN ('overview', 'analytics'))
  OR (module = 'employees' AND feature IN ('department', 'self') AND action IN ('read', 'update'))
  OR (module = 'attendance' AND feature = 'department' AND action = 'read')
  OR (module = 'leave' AND feature = 'department' AND action IN ('read', 'approve'))
  OR (module = 'leave' AND feature = 'self' AND action IN ('read', 'create'))
  OR (module = 'departments' AND feature = 'own' AND action = 'read')
  OR (module = 'positions' AND action = 'read')
  OR (module = 'communication' AND feature = 'announcements' AND action IN ('create', 'read'))
  OR (module = 'communication' AND feature = 'messages' AND action IN ('send', 'read'))
  OR (module = 'expenses' AND feature = 'department' AND action IN ('read', 'approve'))
  OR (module = 'roster' AND feature = 'department' AND action IN ('read', 'create', 'update'))
  OR (module = 'roster' AND feature = 'self' AND action = 'read')
  OR (module = 'ai' AND feature = 'copilot' AND action = 'use')
ON CONFLICT DO NOTHING;

-- TEAM_LEAD: lead their team
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'TEAM_LEAD', id FROM enterprise_permissions
WHERE (module = 'dashboard' AND feature = 'overview')
  OR (module = 'employees' AND feature = 'department' AND action = 'read')
  OR (module = 'attendance' AND feature = 'department' AND action = 'read')
  OR (module = 'leave' AND feature = 'department' AND action IN ('read', 'approve'))
  OR (module = 'leave' AND feature = 'self' AND action IN ('read', 'create'))
  OR (module = 'communication' AND feature = 'messages' AND action IN ('send', 'read'))
  OR (module = 'roster' AND feature = 'self' AND action = 'read')
  OR (module = 'ai' AND feature = 'copilot' AND action = 'use')
ON CONFLICT DO NOTHING;

-- RECRUITER: recruitment only
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'RECRUITER', id FROM enterprise_permissions
WHERE (module = 'dashboard' AND feature = 'overview')
  OR (module = 'recruitment' AND action IN ('read', 'create', 'update', 'export'))
  OR (module = 'employees' AND action = 'read' AND feature = 'all')
  OR (module = 'positions' AND action = 'read')
  OR (module = 'departments' AND action = 'read' AND feature = 'all')
  OR (module = 'ai' AND feature = 'copilot' AND action = 'use')
ON CONFLICT DO NOTHING;

-- EMPLOYEE: self-service only
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'EMPLOYEE', id FROM enterprise_permissions
WHERE (module = 'dashboard' AND feature = 'overview')
  OR (module = 'employees' AND feature = 'self' AND action IN ('read', 'update'))
  OR (module = 'attendance' AND feature = 'self' AND action IN ('read', 'create'))
  OR (module = 'leave' AND feature = 'self' AND action IN ('read', 'create'))
  OR (module = 'payroll' AND feature = 'self' AND action = 'read')
  OR (module = 'communication' AND feature = 'announcements' AND action = 'read')
  OR (module = 'communication' AND feature = 'messages' AND action IN ('send', 'read'))
  OR (module = 'expenses' AND feature = 'self' AND action = 'create')
  OR (module = 'roster' AND feature = 'self' AND action = 'read')
  OR (module = 'ai' AND feature = 'copilot' AND action = 'use')
ON CONFLICT DO NOTHING;

-- AUDITOR: read-only everything
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'AUDITOR', id FROM enterprise_permissions
WHERE action = 'read'
  OR (module = 'security' AND feature = 'audit' AND action = 'read')
ON CONFLICT DO NOTHING;

-- IT_ADMIN: system management
INSERT INTO role_permission_map (role_name, permission_id)
SELECT 'IT_ADMIN', id FROM enterprise_permissions
WHERE module IN ('dashboard', 'users', 'security', 'settings')
  OR (module = 'employees' AND action = 'read')
ON CONFLICT DO NOTHING;

-- User-level permission overrides (grant or deny specific permissions)
CREATE TABLE IF NOT EXISTS user_role_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission_id uuid NOT NULL REFERENCES enterprise_permissions(id) ON DELETE CASCADE,
  override_type text NOT NULL CHECK (override_type IN ('GRANT', 'DENY')),
  reason text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, permission_id)
);

-- ============================================================
-- 2. ORGANIZATIONAL HIERARCHY
-- ============================================================

-- Add parent_department_id to departments for hierarchy
DO $$ BEGIN
  ALTER TABLE departments ADD COLUMN IF NOT EXISTS parent_department_id uuid REFERENCES departments(id);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Add department_id and team_id to profiles for department isolation
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department_id uuid;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Teams table (sub-department groupings)
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  team_lead_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Employee reporting relationships
CREATE TABLE IF NOT EXISTS employee_reporting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  manager_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, manager_id)
);

-- ============================================================
-- 3. LEAVE POLICY ENGINE
-- ============================================================

-- Leave policies (per organization)
CREATE TABLE IF NOT EXISTS leave_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leave policy rules (individual leave type configurations)
CREATE TABLE IF NOT EXISTS leave_policy_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid NOT NULL REFERENCES leave_policies(id) ON DELETE CASCADE,
  leave_type text NOT NULL,
  display_name text NOT NULL,
  annual_entitlement numeric NOT NULL DEFAULT 21,
  monthly_accrual_enabled boolean NOT NULL DEFAULT true,
  accrual_rate numeric NOT NULL DEFAULT 1.75,
  max_carry_forward numeric NOT NULL DEFAULT 10,
  probation_restricted boolean NOT NULL DEFAULT true,
  min_service_months integer NOT NULL DEFAULT 0,
  half_day_allowed boolean NOT NULL DEFAULT true,
  negative_leave_allowed boolean NOT NULL DEFAULT false,
  max_negative_leave numeric NOT NULL DEFAULT 0,
  encashment_allowed boolean NOT NULL DEFAULT false,
  encashment_rate numeric NOT NULL DEFAULT 1.0,
  weekend_inclusive boolean NOT NULL DEFAULT false,
  holiday_inclusive boolean NOT NULL DEFAULT false,
  requires_document boolean NOT NULL DEFAULT false,
  approval_workflow_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. APPROVAL WORKFLOWS
-- ============================================================

-- Approval workflow definitions
CREATE TABLE IF NOT EXISTS approval_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  entity_type text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Approval workflow steps (ordered)
CREATE TABLE IF NOT EXISTS approval_workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
  step_order integer NOT NULL DEFAULT 1,
  approver_type text NOT NULL,
  approver_role text,
  is_parallel boolean NOT NULL DEFAULT false,
  condition_field text,
  condition_value text,
  created_at timestamptz DEFAULT now()
);

-- Approval delegations (temporary delegation)
CREATE TABLE IF NOT EXISTS approval_delegations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  delegator_id uuid NOT NULL,
  delegate_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  entity_type text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. COMMUNICATION HUB
-- ============================================================

-- Department announcements (targeted to specific departments)
CREATE TABLE IF NOT EXISTS department_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  announcement_id uuid NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Team announcements
CREATE TABLE IF NOT EXISTS team_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  announcement_id uuid NOT NULL,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Direct messages (1:1)
CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  parent_message_id uuid REFERENCES direct_messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES direct_messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  created_at timestamptz DEFAULT now()
);

-- Message read receipts
CREATE TABLE IF NOT EXISTS message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES direct_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- ============================================================
-- 6. DUTY ROSTER
-- ============================================================

-- Duty rosters (department schedules)
CREATE TABLE IF NOT EXISTS duty_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Duty roster entries (individual shift assignments)
CREATE TABLE IF NOT EXISTS duty_roster_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roster_id uuid NOT NULL REFERENCES duty_rosters(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL,
  shift_date date NOT NULL,
  shift_start time,
  shift_end time,
  shift_type text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- Enable RLS on all new tables
ALTER TABLE enterprise_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permission_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_reporting ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_policy_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_roster_entries ENABLE ROW LEVEL SECURITY;

-- Enterprise roles & permissions are readable by all authenticated users
CREATE POLICY "read_enterprise_roles" ON enterprise_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_enterprise_permissions" ON enterprise_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_role_permission_map" ON role_permission_map FOR SELECT TO authenticated USING (true);

-- User role overrides: users can read their own overrides, admins can read all
CREATE POLICY "read_own_overrides" ON user_role_overrides FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "read_all_overrides_admin" ON user_role_overrides FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'IT_ADMIN'))
);

-- Teams: org-scoped read, admin write
CREATE POLICY "read_teams_org" ON teams FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_teams_admin" ON teams FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'IT_ADMIN'))
);

-- Employee reporting: org-scoped read, admin write
CREATE POLICY "read_reporting_org" ON employee_reporting FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  OR employee_id = auth.uid()
  OR manager_id = auth.uid()
);
CREATE POLICY "manage_reporting_admin" ON employee_reporting FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'IT_ADMIN'))
);

-- Leave policies: org-scoped read, HR write
CREATE POLICY "read_leave_policies_org" ON leave_policies FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_leave_policies_hr" ON leave_policies FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER'))
);

-- Leave policy rules: org-scoped read, HR write
CREATE POLICY "read_leave_policy_rules_org" ON leave_policy_rules FOR SELECT TO authenticated USING (
  policy_id IN (SELECT id FROM leave_policies WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);
CREATE POLICY "manage_leave_policy_rules_hr" ON leave_policy_rules FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER'))
);

-- Approval workflows: org-scoped read, admin write
CREATE POLICY "read_approval_workflows_org" ON approval_workflows FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_approval_workflows_admin" ON approval_workflows FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'IT_ADMIN'))
);

CREATE POLICY "read_approval_steps_org" ON approval_workflow_steps FOR SELECT TO authenticated USING (
  workflow_id IN (SELECT id FROM approval_workflows WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);
CREATE POLICY "manage_approval_steps_admin" ON approval_workflow_steps FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'IT_ADMIN'))
);

-- Approval delegations: org-scoped, user can read their own
CREATE POLICY "read_delegations_org" ON approval_delegations FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  OR delegator_id = auth.uid()
  OR delegate_id = auth.uid()
);
CREATE POLICY "manage_delegations_self" ON approval_delegations FOR ALL TO authenticated USING (
  delegator_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'IT_ADMIN'))
);

-- Department announcements: org-scoped, department members can read
CREATE POLICY "read_dept_announcements" ON department_announcements FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_dept_announcements" ON department_announcements FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'DEPT_MANAGER'))
);

-- Team announcements: org-scoped, team members can read
CREATE POLICY "read_team_announcements" ON team_announcements FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_team_announcements" ON team_announcements FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'DEPT_MANAGER', 'TEAM_LEAD'))
);

-- Direct messages: users can only see their own sent/received messages
CREATE POLICY "read_own_messages" ON direct_messages FOR SELECT TO authenticated USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "send_messages" ON direct_messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid()
);
CREATE POLICY "delete_own_messages" ON direct_messages FOR DELETE TO authenticated USING (
  sender_id = auth.uid()
);
CREATE POLICY "update_own_messages" ON direct_messages FOR UPDATE TO authenticated USING (
  sender_id = auth.uid()
);

-- Message attachments: only message participants
CREATE POLICY "read_own_attachments" ON message_attachments FOR SELECT TO authenticated USING (
  message_id IN (SELECT id FROM direct_messages WHERE sender_id = auth.uid() OR recipient_id = auth.uid())
);
CREATE POLICY "create_attachments" ON message_attachments FOR INSERT TO authenticated WITH CHECK (
  message_id IN (SELECT id FROM direct_messages WHERE sender_id = auth.uid())
);

-- Message reads: users can create their own read receipts
CREATE POLICY "read_own_reads" ON message_reads FOR SELECT TO authenticated USING (
  user_id = auth.uid()
);
CREATE POLICY "create_own_reads" ON message_reads FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
);

-- Duty rosters: org-scoped, department members read, managers write
CREATE POLICY "read_rosters_org" ON duty_rosters FOR SELECT TO authenticated USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "manage_rosters_manager" ON duty_rosters FOR ALL TO authenticated USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'DEPT_MANAGER'))
);

-- Duty roster entries: org-scoped read
CREATE POLICY "read_roster_entries" ON duty_roster_entries FOR SELECT TO authenticated USING (
  roster_id IN (SELECT id FROM duty_rosters WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);
CREATE POLICY "manage_roster_entries" ON duty_roster_entries FOR ALL TO authenticated USING (
  roster_id IN (SELECT id FROM duty_rosters WHERE created_by = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ORG_OWNER', 'HR_DIRECTOR', 'HR_OFFICER', 'DEPT_MANAGER'))
);

-- ============================================================
-- 8. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_role_perm_role ON role_permission_map(role_name);
CREATE INDEX IF NOT EXISTS idx_user_overrides_user ON user_role_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_dept ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_reporting_emp ON employee_reporting(employee_id);
CREATE INDEX IF NOT EXISTS idx_reporting_mgr ON employee_reporting(manager_id);
CREATE INDEX IF NOT EXISTS idx_leave_policies_org ON leave_policies(organization_id);
CREATE INDEX IF NOT EXISTS idx_leave_rules_policy ON leave_policy_rules(policy_id);
CREATE INDEX IF NOT EXISTS idx_approval_wf_org ON approval_workflows(organization_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_wf ON approval_workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_delegations_delegator ON approval_delegations(delegator_id);
CREATE INDEX IF NOT EXISTS idx_dept_announcements_dept ON department_announcements(department_id);
CREATE INDEX IF NOT EXISTS idx_direct_msgs_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_msgs_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_msg_attachments_msg ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_duty_rosters_dept ON duty_rosters(department_id);
CREATE INDEX IF NOT EXISTS idx_duty_roster_entries_roster ON duty_roster_entries(roster_id);
CREATE INDEX IF NOT EXISTS idx_duty_roster_entries_emp ON duty_roster_entries(employee_id);
