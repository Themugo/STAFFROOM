-- ============================================
-- PHASE 1: MULTI-TENANCY FOUNDATION
-- ============================================

-- Organizations table (the tenant root)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#0EA5E9',
  domain VARCHAR(255) UNIQUE,
  country VARCHAR(50) DEFAULT 'KE',
  timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
  currency VARCHAR(3) DEFAULT 'KES',
  subscription_tier VARCHAR(20) DEFAULT 'TRIAL',
  subscription_status VARCHAR(20) DEFAULT 'ACTIVE',
  max_employees INT DEFAULT 10,
  features JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization branches/locations
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(50) DEFAULT 'KE',
  phone VARCHAR(50),
  email VARCHAR(255),
  is_headquarters BOOLEAN DEFAULT FALSE,
  manager_id UUID,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost centers
CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  type VARCHAR(50),
  parent_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL,
  budget DECIMAL(15,2),
  manager_id UUID,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business units
CREATE TABLE IF NOT EXISTS business_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  head_id UUID,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subsidiaries
CREATE TABLE IF NOT EXISTS subsidiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100),
  country VARCHAR(50),
  tax_id VARCHAR(100),
  currency VARCHAR(3) DEFAULT 'KES',
  is_separate_legal_entity BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization hierarchy levels
CREATE TABLE IF NOT EXISTS org_hierarchy_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, level)
);

-- Add organization_id to existing tables (only existing tables)
ALTER TABLE departments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE positions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE payroll_runs ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE payslips ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE deductions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE salary_components ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE employee_skills ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE training_records ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE dependants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE disciplinary_records ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE promotion_history ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE salary_history ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE shift_schedules ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE employee_shifts ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE attendance_rules ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE registered_devices ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE workflow_templates ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE workflow_executions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add branch, cost_center, business_unit to employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL;

-- Function to get current organization
CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_organization', TRUE), '')::UUID;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_hierarchy_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "select_own_organization" ON organizations FOR SELECT TO authenticated 
  USING (id = current_organization_id() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'
  ));
CREATE POLICY "insert_organization_system" ON organizations FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'));

-- RLS Policies for branches (tenant-scoped)
CREATE POLICY "select_branches_tenant" ON branches FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'
  ));
CREATE POLICY "insert_branches_tenant" ON branches FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_branches_tenant" ON branches FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_branches_tenant" ON branches FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for cost_centers (tenant-scoped)
CREATE POLICY "select_cost_centers_tenant" ON cost_centers FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'
  ));
CREATE POLICY "insert_cost_centers_tenant" ON cost_centers FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_cost_centers_tenant" ON cost_centers FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_cost_centers_tenant" ON cost_centers FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for business_units (tenant-scoped)
CREATE POLICY "select_business_units_tenant" ON business_units FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'
  ));
CREATE POLICY "insert_business_units_tenant" ON business_units FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_business_units_tenant" ON business_units FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_business_units_tenant" ON business_units FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for subsidiaries (tenant-scoped)
CREATE POLICY "select_subsidiaries_tenant" ON subsidiaries FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'
  ));
CREATE POLICY "insert_subsidiaries_tenant" ON subsidiaries FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_subsidiaries_tenant" ON subsidiaries FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_subsidiaries_tenant" ON subsidiaries FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_branches_organization ON branches(organization_id);
CREATE INDEX IF NOT EXISTS idx_cost_centers_organization ON cost_centers(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_units_organization ON business_units(organization_id);
CREATE INDEX IF NOT EXISTS idx_subsidiaries_organization ON subsidiaries(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_organization ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_departments_organization ON departments(organization_id);
CREATE INDEX IF NOT EXISTS idx_positions_organization ON positions(organization_id);
CREATE INDEX IF NOT EXISTS idx_attendance_organization ON attendance(organization_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_organization ON leave_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_organization ON payroll_runs(organization_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_organization ON vacancies(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_organization ON workflow_templates(organization_id);