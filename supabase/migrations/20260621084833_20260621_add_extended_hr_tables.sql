-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'FULL_TIME',
  start_date DATE NOT NULL,
  end_date DATE,
  salary DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  serial_number VARCHAR(100),
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  assigned_date DATE,
  purchase_date DATE,
  purchase_cost DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee skills
CREATE TABLE IF NOT EXISTS employee_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  proficiency_level VARCHAR(50),
  years_experience INT,
  certified BOOLEAN DEFAULT FALSE,
  certification_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training records
CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  training_name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  start_date DATE,
  end_date DATE,
  cost DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'COMPLETED',
  certificate_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependants
CREATE TABLE IF NOT EXISTS dependants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  phone VARCHAR(50),
  occupation VARCHAR(100),
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disciplinary records
CREATE TABLE IF NOT EXISTS disciplinary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(50),
  severity VARCHAR(20) DEFAULT 'LOW',
  description TEXT,
  action_taken TEXT,
  issued_by UUID REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promotion history
CREATE TABLE IF NOT EXISTS promotion_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  old_position_id UUID REFERENCES positions(id),
  new_position_id UUID NOT NULL REFERENCES positions(id),
  old_salary DECIMAL(12,2),
  new_salary DECIMAL(12,2),
  from_date DATE NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salary history
CREATE TABLE IF NOT EXISTS salary_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  old_salary DECIMAL(12,2),
  new_salary DECIMAL(12,2) NOT NULL,
  effective_date DATE NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shift schedules
CREATE TABLE IF NOT EXISTS shift_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration INT DEFAULT 60,
  type VARCHAR(20) DEFAULT 'STANDARD',
  is_active BOOLEAN DEFAULT TRUE,
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee shifts
CREATE TABLE IF NOT EXISTS employee_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shift_schedules(id),
  effective_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance rules
CREATE TABLE IF NOT EXISTS attendance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  value INT NOT NULL,
  unit VARCHAR(20) DEFAULT 'MINUTES',
  action VARCHAR(50) DEFAULT 'WARN',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registered devices
CREATE TABLE IF NOT EXISTS registered_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  device_name VARCHAR(255) NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  device_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  last_used TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow templates
CREATE TABLE IF NOT EXISTS workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  version INT DEFAULT 1,
  steps JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workflow_templates(id),
  initiator_id UUID NOT NULL REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'PENDING',
  current_step INT DEFAULT 0,
  total_steps INT NOT NULL,
  steps_data JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependants ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts
CREATE POLICY "select_contracts_authenticated" ON contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_contracts_admin" ON contracts FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_contracts_admin" ON contracts FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_contracts_admin" ON contracts FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for assets
CREATE POLICY "select_assets_authenticated" ON assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_assets_admin" ON assets FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_assets_admin" ON assets FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_assets_admin" ON assets FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for employee_skills
CREATE POLICY "select_skills_authenticated" ON employee_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_skills_admin" ON employee_skills FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "update_skills_admin" ON employee_skills FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "delete_skills_admin" ON employee_skills FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for training_records
CREATE POLICY "select_training_authenticated" ON training_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_training_admin" ON training_records FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "update_training_admin" ON training_records FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "delete_training_admin" ON training_records FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for dependants
CREATE POLICY "select_dependants_authenticated" ON dependants FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_dependants_authenticated" ON dependants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_dependants_authenticated" ON dependants FOR UPDATE TO authenticated USING (true);
CREATE POLICY "delete_dependants_authenticated" ON dependants FOR DELETE TO authenticated USING (true);

-- RLS Policies for disciplinary_records
CREATE POLICY "select_disciplinary_authenticated" ON disciplinary_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_disciplinary_admin" ON disciplinary_records FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "update_disciplinary_admin" ON disciplinary_records FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "delete_disciplinary_admin" ON disciplinary_records FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for promotion_history
CREATE POLICY "select_promotion_authenticated" ON promotion_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_promotion_admin" ON promotion_history FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_promotion_admin" ON promotion_history FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_promotion_admin" ON promotion_history FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for salary_history
CREATE POLICY "select_salary_history_authenticated" ON salary_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_salary_history_admin" ON salary_history FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_salary_history_admin" ON salary_history FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_salary_history_admin" ON salary_history FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for shift_schedules
CREATE POLICY "select_shift_schedules_authenticated" ON shift_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_shift_schedules_admin" ON shift_schedules FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "update_shift_schedules_admin" ON shift_schedules FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN')));
CREATE POLICY "delete_shift_schedules_admin" ON shift_schedules FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for attendance_rules
CREATE POLICY "select_attendance_rules_authenticated" ON attendance_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_attendance_rules_admin" ON attendance_rules FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_attendance_rules_admin" ON attendance_rules FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_attendance_rules_admin" ON attendance_rules FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for workflow_templates
CREATE POLICY "select_workflow_templates_authenticated" ON workflow_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_workflow_templates_admin" ON workflow_templates FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "update_workflow_templates_admin" ON workflow_templates FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));
CREATE POLICY "delete_workflow_templates_admin" ON workflow_templates FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- RLS Policies for workflow_executions
CREATE POLICY "select_workflow_executions_authenticated" ON workflow_executions FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_workflow_executions_authenticated" ON workflow_executions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_workflow_executions_authenticated" ON workflow_executions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "delete_workflow_executions_admin" ON workflow_executions FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SYSTEM_OWNER')));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_employee ON contracts(employee_id);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON assets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_employee_skills_employee ON employee_skills(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_records_employee ON training_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_dependants_employee ON dependants(employee_id);
CREATE INDEX IF NOT EXISTS idx_disciplinary_records_employee ON disciplinary_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_promotion_history_employee ON promotion_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_history_employee ON salary_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_shifts_employee ON employee_shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_template ON workflow_executions(template_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_initiator ON workflow_executions(initiator_id);