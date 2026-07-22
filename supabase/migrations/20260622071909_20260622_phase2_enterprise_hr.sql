-- ============================================
-- PHASE 2: ENTERPRISE HR FEATURES
-- ============================================

-- Currencies (supported currencies)
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places INT DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default East African currencies
INSERT INTO currencies (code, name, symbol, decimal_places) VALUES
('KES', 'Kenyan Shilling', 'KSh', 2),
('UGX', 'Ugandan Shilling', 'USh', 0),
('TZS', 'Tanzanian Shilling', 'TSh', 2),
('RWF', 'Rwandan Franc', 'FRw', 0),
('USD', 'US Dollar', '$', 2),
('EUR', 'Euro', '€', 2)
ON CONFLICT (code) DO NOTHING;

-- Exchange rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  from_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
  to_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
  rate DECIMAL(15,6) NOT NULL,
  effective_date DATE NOT NULL,
  source VARCHAR(50), -- MANUAL, AUTO, API
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, from_currency, to_currency, effective_date)
);

-- Payroll entities (for multi-entity payroll)
CREATE TABLE IF NOT EXISTS payroll_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  currency VARCHAR(3) DEFAULT 'KES' REFERENCES currencies(code),
  country VARCHAR(50) DEFAULT 'KE',
  bank_name VARCHAR(255),
  bank_account VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave types (organization-specific)
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  days_per_year INT DEFAULT 21,
  is_paid BOOLEAN DEFAULT TRUE,
  is_carry_over BOOLEAN DEFAULT FALSE,
  max_carry_over_days INT DEFAULT 0,
  requires_approval BOOLEAN DEFAULT TRUE,
  allow_half_day BOOLEAN DEFAULT FALSE,
  gender_specific VARCHAR(10), -- MALE, FEMALE, null for all
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Leave balances (proper implementation)
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  year INT NOT NULL,
  allocated_days DECIMAL(5,1) DEFAULT 0,
  used_days DECIMAL(5,1) DEFAULT 0,
  carried_over_days DECIMAL(5,1) DEFAULT 0,
  remaining_days DECIMAL(5,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Pay grades/salary structures
CREATE TABLE IF NOT EXISTS pay_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20),
  min_salary DECIMAL(12,2) NOT NULL,
  max_salary DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES' REFERENCES currencies(code),
  description TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salary structures (compensation components)
CREATE TABLE IF NOT EXISTS salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  components JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee salary assignments
CREATE TABLE IF NOT EXISTS employee_salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  salary_structure_id UUID REFERENCES salary_structures(id) ON DELETE SET NULL,
  pay_grade_id UUID REFERENCES pay_grades(id) ON DELETE SET NULL,
  effective_date DATE NOT NULL,
  end_date DATE,
  basic_salary DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES' REFERENCES currencies(code),
  components JSONB DEFAULT '{}',
  gross_salary DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification system
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings (organization-specific)
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  category VARCHAR(50) DEFAULT 'GENERAL',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, key)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for currencies (everyone can read)
CREATE POLICY "select_currencies_all" ON currencies FOR SELECT TO authenticated USING (true);

-- RLS Policies for exchange_rates (tenant-scoped)
CREATE POLICY "select_exchange_rates_tenant" ON exchange_rates FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR organization_id IS NULL);
CREATE POLICY "insert_exchange_rates_admin" ON exchange_rates FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_exchange_rates_admin" ON exchange_rates FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for payroll_entities (tenant-scoped)
CREATE POLICY "select_payroll_entities_tenant" ON payroll_entities FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_payroll_entities_admin" ON payroll_entities FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_payroll_entities_admin" ON payroll_entities FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_payroll_entities_admin" ON payroll_entities FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for leave_types (tenant-scoped)
CREATE POLICY "select_leave_types_tenant" ON leave_types FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_leave_types_admin" ON leave_types FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_leave_types_admin" ON leave_types FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_leave_types_admin" ON leave_types FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for leave_balances (tenant-scoped)
CREATE POLICY "select_leave_balances_tenant" ON leave_balances FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_leave_balances_admin" ON leave_balances FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_leave_balances_admin" ON leave_balances FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for pay_grades (tenant-scoped)
CREATE POLICY "select_pay_grades_tenant" ON pay_grades FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_pay_grades_admin" ON pay_grades FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_pay_grades_admin" ON pay_grades FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_pay_grades_admin" ON pay_grades FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for salary_structures (tenant-scoped)
CREATE POLICY "select_salary_structures_tenant" ON salary_structures FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_salary_structures_admin" ON salary_structures FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_salary_structures_admin" ON salary_structures FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_salary_structures_admin" ON salary_structures FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for employee_salaries (tenant-scoped)
CREATE POLICY "select_employee_salaries_tenant" ON employee_salaries FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_employee_salaries_admin" ON employee_salaries FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_employee_salaries_admin" ON employee_salaries FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for notifications (user-specific)
CREATE POLICY "select_notifications_own" ON notifications FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "update_notifications_own" ON notifications FOR UPDATE TO authenticated 
  USING (user_id = auth.uid());

-- RLS Policies for organization_settings (tenant-scoped)
CREATE POLICY "select_org_settings_tenant" ON organization_settings FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_org_settings_admin" ON organization_settings FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_org_settings_admin" ON organization_settings FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for audit_logs (tenant-scoped, read-only)
CREATE POLICY "select_audit_logs_tenant" ON audit_logs FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_audit_logs_authenticated" ON audit_logs FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exchange_rates_organization ON exchange_rates(organization_id);
CREATE INDEX IF NOT EXISTS idx_payroll_entities_organization ON payroll_entities(organization_id);
CREATE INDEX IF NOT EXISTS idx_leave_types_organization ON leave_types(organization_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_employee ON leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_pay_grades_organization ON pay_grades(organization_id);
CREATE INDEX IF NOT EXISTS idx_salary_structures_organization ON salary_structures(organization_id);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_employee ON employee_salaries(employee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);