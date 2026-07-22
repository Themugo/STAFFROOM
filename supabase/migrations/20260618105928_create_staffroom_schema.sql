/*
# StaffRoom Core Schema

Creates the full HR management schema for StaffRoom SaaS including:
- profiles (linked to auth.users)
- departments, positions
- employees (with department/position FKs)
- attendance records
- leave_requests
- payroll_runs, salary_components, deductions, payslips
- vacancies, applications, interviews (recruitment pipeline)

All tables have RLS enabled with authenticated-user access policies.
*/

-- ===== PROFILES =====
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'EMPLOYEE',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===== DEPARTMENTS =====
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  manager_id uuid,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "depts_select" ON departments;
CREATE POLICY "depts_select" ON departments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "depts_insert" ON departments;
CREATE POLICY "depts_insert" ON departments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "depts_update" ON departments;
CREATE POLICY "depts_update" ON departments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "depts_delete" ON departments;
CREATE POLICY "depts_delete" ON departments FOR DELETE TO authenticated USING (true);

-- ===== POSITIONS =====
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  min_salary numeric(12,2),
  max_salary numeric(12,2),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "positions_select" ON positions;
CREATE POLICY "positions_select" ON positions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "positions_insert" ON positions;
CREATE POLICY "positions_insert" ON positions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "positions_update" ON positions;
CREATE POLICY "positions_update" ON positions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "positions_delete" ON positions;
CREATE POLICY "positions_delete" ON positions FOR DELETE TO authenticated USING (true);

-- ===== EMPLOYEES =====
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  national_id text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  position_id uuid REFERENCES positions(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'ACTIVE',
  hire_date date,
  basic_salary numeric(12,2),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "emp_select" ON employees;
CREATE POLICY "emp_select" ON employees FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "emp_insert" ON employees;
CREATE POLICY "emp_insert" ON employees FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "emp_update" ON employees;
CREATE POLICY "emp_update" ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "emp_delete" ON employees;
CREATE POLICY "emp_delete" ON employees FOR DELETE TO authenticated USING (true);

-- Add self-referential FK for department manager after employees table exists
ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_manager_id_fkey;
ALTER TABLE departments ADD CONSTRAINT departments_manager_id_fkey
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ===== ATTENDANCE =====
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in time,
  check_out time,
  method text NOT NULL DEFAULT 'MANUAL',
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attendance_date_idx ON attendance(date);
CREATE INDEX IF NOT EXISTS attendance_employee_idx ON attendance(employee_id);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "att_select" ON attendance;
CREATE POLICY "att_select" ON attendance FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "att_insert" ON attendance;
CREATE POLICY "att_insert" ON attendance FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "att_update" ON attendance;
CREATE POLICY "att_update" ON attendance FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "att_delete" ON attendance;
CREATE POLICY "att_delete" ON attendance FOR DELETE TO authenticated USING (true);

-- ===== LEAVE REQUESTS =====
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL DEFAULT 'ANNUAL',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  reason text,
  approved_by uuid REFERENCES employees(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leave_select" ON leave_requests;
CREATE POLICY "leave_select" ON leave_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "leave_insert" ON leave_requests;
CREATE POLICY "leave_insert" ON leave_requests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "leave_update" ON leave_requests;
CREATE POLICY "leave_update" ON leave_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "leave_delete" ON leave_requests;
CREATE POLICY "leave_delete" ON leave_requests FOR DELETE TO authenticated USING (true);

-- ===== PAYROLL RUNS =====
CREATE TABLE IF NOT EXISTS payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  frequency text NOT NULL DEFAULT 'MONTHLY',
  status text NOT NULL DEFAULT 'DRAFT',
  total_gross numeric(14,2) DEFAULT 0,
  total_deductions numeric(14,2) DEFAULT 0,
  total_net numeric(14,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pr_select" ON payroll_runs;
CREATE POLICY "pr_select" ON payroll_runs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "pr_insert" ON payroll_runs;
CREATE POLICY "pr_insert" ON payroll_runs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "pr_update" ON payroll_runs;
CREATE POLICY "pr_update" ON payroll_runs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "pr_delete" ON payroll_runs;
CREATE POLICY "pr_delete" ON payroll_runs FOR DELETE TO authenticated USING (true);

-- ===== SALARY COMPONENTS =====
CREATE TABLE IF NOT EXISTS salary_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'BASIC',
  amount numeric(12,2) NOT NULL,
  is_taxable boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sc_select" ON salary_components;
CREATE POLICY "sc_select" ON salary_components FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "sc_insert" ON salary_components;
CREATE POLICY "sc_insert" ON salary_components FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "sc_update" ON salary_components;
CREATE POLICY "sc_update" ON salary_components FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "sc_delete" ON salary_components;
CREATE POLICY "sc_delete" ON salary_components FOR DELETE TO authenticated USING (true);

-- ===== DEDUCTIONS =====
CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_run_id uuid REFERENCES payroll_runs(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'OTHER',
  amount numeric(12,2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE deductions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ded_select" ON deductions;
CREATE POLICY "ded_select" ON deductions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ded_insert" ON deductions;
CREATE POLICY "ded_insert" ON deductions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ded_update" ON deductions;
CREATE POLICY "ded_update" ON deductions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ded_delete" ON deductions;
CREATE POLICY "ded_delete" ON deductions FOR DELETE TO authenticated USING (true);

-- ===== PAYSLIPS =====
CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_run_id uuid REFERENCES payroll_runs(id) ON DELETE SET NULL,
  gross_pay numeric(12,2) NOT NULL DEFAULT 0,
  total_deductions numeric(12,2) NOT NULL DEFAULT 0,
  net_pay numeric(12,2) NOT NULL DEFAULT 0,
  paye numeric(12,2) DEFAULT 0,
  nhif numeric(12,2) DEFAULT 0,
  nssf numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ps_select" ON payslips;
CREATE POLICY "ps_select" ON payslips FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ps_insert" ON payslips;
CREATE POLICY "ps_insert" ON payslips FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ps_update" ON payslips;
CREATE POLICY "ps_update" ON payslips FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ps_delete" ON payslips;
CREATE POLICY "ps_delete" ON payslips FOR DELETE TO authenticated USING (true);

-- ===== VACANCIES =====
CREATE TABLE IF NOT EXISTS vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  description text,
  requirements text,
  openings integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'OPEN',
  deadline date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vac_select" ON vacancies;
CREATE POLICY "vac_select" ON vacancies FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "vac_insert" ON vacancies;
CREATE POLICY "vac_insert" ON vacancies FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "vac_update" ON vacancies;
CREATE POLICY "vac_update" ON vacancies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "vac_delete" ON vacancies;
CREATE POLICY "vac_delete" ON vacancies FOR DELETE TO authenticated USING (true);

-- ===== APPLICATIONS =====
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id uuid NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  resume_url text,
  status text NOT NULL DEFAULT 'APPLIED',
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "app_select" ON applications;
CREATE POLICY "app_select" ON applications FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "app_insert" ON applications;
CREATE POLICY "app_insert" ON applications FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "app_update" ON applications;
CREATE POLICY "app_update" ON applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "app_delete" ON applications;
CREATE POLICY "app_delete" ON applications FOR DELETE TO authenticated USING (true);

-- ===== INTERVIEWS =====
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at timestamptz,
  interviewer_name text,
  notes text,
  outcome text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "int_select" ON interviews;
CREATE POLICY "int_select" ON interviews FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "int_insert" ON interviews;
CREATE POLICY "int_insert" ON interviews FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "int_update" ON interviews;
CREATE POLICY "int_update" ON interviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "int_delete" ON interviews;
CREATE POLICY "int_delete" ON interviews FOR DELETE TO authenticated USING (true);
