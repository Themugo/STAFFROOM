-- Seed data for StaffRoom demo with multi-role access
-- Creates: departments, positions, employees, attendance, leave, payroll, recruitment

-- Create departments
INSERT INTO departments (id, name, description, status) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Human Resources', 'HR department - handles employee relations and recruitment', 'ACTIVE'),
  ('11111111-1111-1111-1111-111111111102', 'Engineering', 'Engineering department - development and infrastructure', 'ACTIVE'),
  ('11111111-1111-1111-1111-111111111103', 'Finance', 'Finance department - payroll and accounting', 'ACTIVE'),
  ('11111111-1111-1111-1111-111111111104', 'Marketing', 'Marketing department - brand and communications', 'ACTIVE');

-- Create positions
INSERT INTO positions (id, title, description, department_id, min_salary, max_salary) VALUES
  ('22222222-2222-2222-2222-222222222201', 'HR Manager', 'Manages HR operations', '11111111-1111-1111-1111-111111111101', 80000, 120000),
  ('22222222-2222-2222-2222-222222222202', 'Software Engineer', 'Develops software solutions', '11111111-1111-1111-1111-111111111102', 60000, 100000),
  ('22222222-2222-2222-2222-222222222203', 'Finance Manager', 'Manages financial operations', '11111111-1111-1111-1111-111111111103', 90000, 130000),
  ('22222222-2222-2222-2222-222222222204', 'Marketing Specialist', 'Marketing campaigns', '11111111-1111-1111-1111-111111111104', 50000, 75000);

-- Create employees (demo users will be created via Supabase auth)
INSERT INTO employees (id, full_name, email, phone, national_id, department_id, position_id, status, hire_date, basic_salary) VALUES
  ('44444444-4444-4444-4444-444444444401', 'Alice Admin', 'admin@acmecorp.demo', '+254700000001', 'ID001', NULL, NULL, 'ACTIVE', '2024-01-15', 100000),
  ('44444444-4444-4444-4444-444444444402', 'Bob HR', 'hr.admin@acmecorp.demo', '+254700000002', 'ID002', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'ACTIVE', '2023-06-01', 95000),
  ('44444444-4444-4444-4444-444444444403', 'Carol Staff', 'staff@acmecorp.demo', '+254700000003', 'ID003', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'ACTIVE', '2024-03-01', 75000);

-- Set department managers
UPDATE departments SET manager_id = '44444444-4444-4444-4444-444444444402' WHERE id = '11111111-1111-1111-1111-111111111101';

-- Add sample attendance records
INSERT INTO attendance (employee_id, date, check_in, check_out, method) VALUES
  ('44444444-4444-4444-4444-444444444402', current_date - interval '5 days', '08:30:00', '17:30:00', 'BIO_METRIC'),
  ('44444444-4444-4444-4444-444444444402', current_date - interval '4 days', '08:45:00', '17:15:00', 'BIO_METRIC'),
  ('44444444-4444-4444-4444-444444444402', current_date - interval '3 days', '08:15:00', '17:45:00', 'BIO_METRIC'),
  ('44444444-4444-4444-4444-444444444403', current_date - interval '5 days', '09:00:00', '18:00:00', 'MANUAL'),
  ('44444444-4444-4444-4444-444444444403', current_date - interval '4 days', '08:55:00', '17:30:00', 'MANUAL'),
  ('44444444-4444-4444-4444-444444444403', current_date - interval '3 days', '08:30:00', '17:00:00', 'MANUAL');

-- Add sample leave requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, status, reason, approved_by) VALUES
  ('44444444-4444-4444-4444-444444444403', 'ANNUAL', current_date + interval '10 days', current_date + interval '12 days', 'APPROVED', 'Family vacation', '44444444-4444-4444-4444-444444444402'),
  ('44444444-4444-4444-4444-444444444403', 'SICK', current_date - interval '15 days', current_date - interval '14 days', 'APPROVED', 'Medical appointment', '44444444-4444-4444-4444-444444444402'),
  ('44444444-4444-4444-4444-444444444402', 'ANNUAL', current_date + interval '30 days', current_date + interval '32 days', 'PENDING', 'Personal leave', NULL);

-- Create sample payroll run
INSERT INTO payroll_runs (id, name, period_start, period_end, frequency, status, total_gross, total_deductions, total_net) VALUES
  ('55555555-5555-5555-5555-555555555501', 'June 2024 Payroll', '2024-06-01', '2024-06-30', 'MONTHLY', 'PROCESSED', 270000.00, 54000.00, 216000.00);

-- Create payslips for the payroll run
INSERT INTO payslips (employee_id, payroll_run_id, gross_pay, total_deductions, net_pay, paye, nhif, nssf) VALUES
  ('44444444-4444-4444-4444-444444444401', '55555555-5555-5555-5555-555555555501', 100000.00, 20000.00, 80000.00, 15000.00, 1700.00, 3300.00),
  ('44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555501', 95000.00, 19000.00, 76000.00, 14000.00, 1700.00, 3300.00),
  ('44444444-4444-4444-4444-444444444403', '55555555-5555-5555-5555-555555555501', 75000.00, 15000.00, 60000.00, 10000.00, 1700.00, 3300.00);

-- Create recruitment vacancies
INSERT INTO vacancies (id, title, department_id, description, requirements, openings, status, deadline) VALUES
  ('66666666-6666-6666-6666-666666666601', 'Senior Software Engineer', '11111111-1111-1111-1111-111111111102', 'Lead development projects', '5+ years experience, React, Node.js', 1, 'OPEN', current_date + interval '30 days'),
  ('66666666-6666-6666-6666-666666666602', 'HR Assistant', '11111111-1111-1111-1111-111111111101', 'Support HR operations', '2+ years HR experience', 1, 'OPEN', current_date + interval '21 days');

-- Create sample applications
INSERT INTO applications (id, vacancy_id, full_name, email, phone, status, applied_at) VALUES
  ('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', 'John Developer', 'john.dev@email.com', '+254711000001', 'UNDER_REVIEW', current_date - interval '7 days'),
  ('77777777-7777-7777-7777-777777777702', '66666666-6666-6666-6666-666666666602', 'Jane Helper', 'jane.help@email.com', '+254711000002', 'APPLIED', current_date - interval '3 days');

-- Create interview for one application
INSERT INTO interviews (application_id, scheduled_at, interviewer_name, notes, outcome) VALUES
  ('77777777-7777-7777-7777-777777777701', current_date + interval '5 days', 'Bob HR', 'Initial technical screening', NULL);