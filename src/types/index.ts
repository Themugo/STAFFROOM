/**
 * STAFFROOM Enterprise Domain Types & Schemas
 */

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  job_title: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  status: 'Active' | 'On Leave' | 'Terminated';
  start_date: string;
  base_salary: number;
  avatar_url?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
  created_date?: string;
  updated_date?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  hours_worked: number;
  status: 'Present' | 'Remote' | 'Late' | 'On Leave' | 'Absent';
  work_location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: 'Annual Leave' | 'Sick Leave' | 'Personal Leave' | 'Maternity Leave' | 'Paternity Leave';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver?: string;
  created_date?: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  pay_period_month: number;
  pay_period_year: number;
  pay_period_label: string;
  base_pay: number;
  bonus: number;
  deductions: number;
  tax: number;
  net_pay: number;
  status: 'Draft' | 'Approved' | 'Paid';
  payment_date?: string;
}

export interface DepartmentBudget {
  id: string;
  department: string;
  year: number;
  allocated_budget: number;
  spent_budget: number;
  headcount: number;
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  review_cycle: string;
  reviewer: string;
  rating: number;
  strengths: string;
  improvements: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  created_date?: string;
}

export interface OnboardingChecklist {
  id: string;
  employee_id: string;
  employee_name: string;
  task_name: string;
  category: 'IT' | 'HR' | 'Benefits' | 'Training';
  completed: boolean;
  due_date: string;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  employee_name: string;
  title: string;
  category: string;
  upload_date: string;
  file_size?: string;
  status?: string;
}

export interface BenefitEnrollment {
  id: string;
  employee_id: string;
  plan_name: string;
  coverage_level: string;
  monthly_cost: number;
  status: 'Enrolled' | 'Pending' | 'Waived';
}

export interface CompanySettings {
  id: string;
  company_name: string;
  currency: string;
  payroll_cycle: string;
  work_hours_per_day: number;
  fiscal_year_start: string;
  support_email: string;
}
