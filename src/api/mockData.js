/**
 * STAFFROOM Initial Seed Data for local fallback persistence
 */

export const INITIAL_MOCK_DATA = {
  Employee: [
    {
      id: "emp_1",
      full_name: "Sarah Jenkins",
      email: "sarah.jenkins@staffroom.internal",
      phone: "+1 (555) 019-2834",
      department: "HR",
      job_title: "HR Director",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2021-03-15",
      base_salary: 145000,
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      address: "124 Innovation Way, Austin, TX",
      emergency_contact: "Mark Jenkins (+1 555-019-9988)",
      notes: "Lead HR operations, talent strategy & employee satisfaction.",
      created_date: "2021-03-15T09:00:00.000Z"
    },
    {
      id: "emp_2",
      full_name: "Marcus Vance",
      email: "marcus.vance@staffroom.internal",
      phone: "+1 (555) 012-4820",
      department: "Engineering",
      job_title: "VP of Engineering",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2020-01-10",
      base_salary: 195000,
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      address: "88 Tech Boulevard, Austin, TX",
      emergency_contact: "Rachel Vance (+1 555-012-9900)",
      notes: "Oversees core platform architecture and engineering squads.",
      created_date: "2020-01-10T09:00:00.000Z"
    },
    {
      id: "emp_3",
      full_name: "Elena Rostova",
      email: "elena.rostova@staffroom.internal",
      phone: "+1 (555) 018-7261",
      department: "Design",
      job_title: "Staff Product Designer",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2022-05-01",
      base_salary: 138000,
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      address: "404 Creative Lane, Austin, TX",
      emergency_contact: "Dmitri Rostov (+1 555-018-0011)",
      notes: "Leads UI/UX design system and product interaction design.",
      created_date: "2022-05-01T09:00:00.000Z"
    },
    {
      id: "emp_4",
      full_name: "David Kim",
      email: "david.kim@staffroom.internal",
      phone: "+1 (555) 014-9912",
      department: "Engineering",
      job_title: "Senior Frontend Engineer",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2022-11-14",
      base_salary: 142000,
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      address: "712 Cypress Street, Austin, TX",
      emergency_contact: "Soo-Jin Kim (+1 555-014-1122)",
      notes: "Specializes in React, state management and web performance.",
      created_date: "2022-11-14T09:00:00.000Z"
    },
    {
      id: "emp_5",
      full_name: "Priya Patel",
      email: "priya.patel@staffroom.internal",
      phone: "+1 (555) 017-3345",
      department: "Marketing",
      job_title: "Head of Marketing",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2021-09-20",
      base_salary: 150000,
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      address: "55 Brand Avenue, Austin, TX",
      emergency_contact: "Aarav Patel (+1 555-017-8822)",
      notes: "Drives product marketing, brand positioning and growth campaigns.",
      created_date: "2021-09-20T09:00:00.000Z"
    },
    {
      id: "emp_6",
      full_name: "James Wilson",
      email: "james.wilson@staffroom.internal",
      phone: "+1 (555) 016-5521",
      department: "Operations",
      job_title: "Operations Lead",
      employment_type: "Full-time",
      status: "On Leave",
      start_date: "2023-02-01",
      base_salary: 115000,
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      address: "99 Logistics Way, Austin, TX",
      emergency_contact: "Laura Wilson (+1 555-016-3399)",
      notes: "Manages facility logistics, vendor relations and workplace IT.",
      created_date: "2023-02-01T09:00:00.000Z"
    },
    {
      id: "emp_7",
      full_name: "Aisha Mohammed",
      email: "aisha.mohammed@staffroom.internal",
      phone: "+1 (555) 011-8843",
      department: "Finance",
      job_title: "Senior Finance Manager",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2021-06-10",
      base_salary: 135000,
      avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
      address: "310 Financial Plaza, Austin, TX",
      emergency_contact: "Tariq Mohammed (+1 555-011-2244)",
      notes: "Manages corporate budgets, payroll audits and financial forecasting.",
      created_date: "2021-06-10T09:00:00.000Z"
    },
    {
      id: "emp_8",
      full_name: "Carlos Mendez",
      email: "carlos.mendez@staffroom.internal",
      phone: "+1 (555) 013-6678",
      department: "Legal",
      job_title: "Legal Counsel",
      employment_type: "Full-time",
      status: "Active",
      start_date: "2022-08-15",
      base_salary: 160000,
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      address: "15 Justice Row, Austin, TX",
      emergency_contact: "Sofia Mendez (+1 555-013-7711)",
      notes: "Employment law, compliance policies and contract agreements.",
      created_date: "2022-08-15T09:00:00.000Z"
    }
  ],

  AttendanceRecord: [
    {
      id: "att_1",
      employee_id: "emp_1",
      employee_name: "Sarah Jenkins",
      date: new Date().toISOString().split("T")[0],
      check_in_time: "08:45 AM",
      check_out_time: "05:15 PM",
      hours_worked: 8.5,
      status: "Present",
      work_location: "Office",
      notes: "Regular shift"
    },
    {
      id: "att_2",
      employee_id: "emp_2",
      employee_name: "Marcus Vance",
      date: new Date().toISOString().split("T")[0],
      check_in_time: "09:00 AM",
      check_out_time: "06:00 PM",
      hours_worked: 8.0,
      status: "Remote",
      work_location: "Home",
      notes: "Remote working"
    },
    {
      id: "att_3",
      employee_id: "emp_4",
      employee_name: "David Kim",
      date: new Date().toISOString().split("T")[0],
      check_in_time: "09:18 AM",
      check_out_time: "05:30 PM",
      hours_worked: 7.7,
      status: "Late",
      work_location: "Office",
      notes: "Traffic delay"
    },
    {
      id: "att_4",
      employee_id: "emp_6",
      employee_name: "James Wilson",
      date: new Date().toISOString().split("T")[0],
      check_in_time: "-",
      check_out_time: "-",
      hours_worked: 0,
      status: "On Leave",
      work_location: "-",
      notes: "Annual Leave"
    }
  ],

  LeaveRequest: [
    {
      id: "leave_1",
      employee_id: "emp_6",
      employee_name: "James Wilson",
      leave_type: "Annual Leave",
      start_date: "2026-07-28",
      end_date: "2026-08-05",
      total_days: 7,
      reason: "Family vacation to Oregon coast",
      status: "Approved",
      approver: "Sarah Jenkins",
      created_date: "2026-07-15T10:00:00.000Z"
    },
    {
      id: "leave_2",
      employee_id: "emp_4",
      employee_name: "David Kim",
      leave_type: "Sick Leave",
      start_date: "2026-08-10",
      end_date: "2026-08-11",
      total_days: 2,
      reason: "Dental procedure recovery",
      status: "Pending",
      approver: "Marcus Vance",
      created_date: "2026-07-30T14:20:00.000Z"
    },
    {
      id: "leave_3",
      employee_id: "emp_3",
      employee_name: "Elena Rostova",
      leave_type: "Personal Leave",
      start_date: "2026-08-20",
      end_date: "2026-08-21",
      total_days: 2,
      reason: "Design conference attendance",
      status: "Approved",
      approver: "Sarah Jenkins",
      created_date: "2026-07-20T09:15:00.000Z"
    }
  ],

  PayrollRecord: [
    {
      id: "pay_1",
      employee_id: "emp_1",
      employee_name: "Sarah Jenkins",
      department: "HR",
      pay_period_month: 7,
      pay_period_year: 2026,
      pay_period_label: "July 2026",
      base_pay: 12083.33,
      bonus: 1000,
      deductions: 2850,
      tax: 2100,
      net_pay: 8133.33,
      status: "Paid",
      payment_date: "2026-07-28"
    },
    {
      id: "pay_2",
      employee_id: "emp_2",
      employee_name: "Marcus Vance",
      department: "Engineering",
      pay_period_month: 7,
      pay_period_year: 2026,
      pay_period_label: "July 2026",
      base_pay: 16250.00,
      bonus: 2500,
      deductions: 3900,
      tax: 3200,
      net_pay: 11650.00,
      status: "Paid",
      payment_date: "2026-07-28"
    },
    {
      id: "pay_3",
      employee_id: "emp_4",
      employee_name: "David Kim",
      department: "Engineering",
      pay_period_month: 7,
      pay_period_year: 2026,
      pay_period_label: "July 2026",
      base_pay: 11833.33,
      bonus: 500,
      deductions: 2600,
      tax: 1950,
      net_pay: 7783.33,
      status: "Paid",
      payment_date: "2026-07-28"
    },
    {
      id: "pay_4",
      employee_id: "emp_3",
      employee_name: "Elena Rostova",
      department: "Design",
      pay_period_month: 7,
      pay_period_year: 2026,
      pay_period_label: "July 2026",
      base_pay: 11500.00,
      bonus: 750,
      deductions: 2500,
      tax: 1900,
      net_pay: 7850.00,
      status: "Approved",
      payment_date: "2026-07-31"
    }
  ],

  DepartmentBudget: [
    {
      id: "bud_1",
      department: "Engineering",
      year: 2026,
      allocated_budget: 650000,
      spent_budget: 412000,
      headcount: 8,
      notes: "Includes cloud infrastructure, software licenses and salaries."
    },
    {
      id: "bud_2",
      department: "Marketing",
      year: 2026,
      allocated_budget: 280000,
      spent_budget: 185000,
      headcount: 4,
      notes: "Ad campaigns, brand agency design and growth tooling."
    },
    {
      id: "bud_3",
      department: "HR",
      year: 2026,
      allocated_budget: 180000,
      spent_budget: 110000,
      headcount: 3,
      notes: "Recruiting software, benefit administration & staff events."
    },
    {
      id: "bud_4",
      department: "Operations",
      year: 2026,
      allocated_budget: 220000,
      spent_budget: 140000,
      headcount: 3,
      notes: "Office lease, hardware procurement & facility maintenance."
    }
  ],

  PerformanceReview: [
    {
      id: "rev_1",
      employee_id: "emp_4",
      employee_name: "David Kim",
      review_cycle: "Q2 2026",
      reviewer: "Marcus Vance",
      rating: 4.8,
      strengths: "Outstanding technical delivery, clean React architecture, mentored junior devs.",
      improvements: "Engage earlier in product strategy sessions.",
      status: "Completed",
      created_date: "2026-07-10T10:00:00.000Z"
    },
    {
      id: "rev_2",
      employee_id: "emp_3",
      employee_name: "Elena Rostova",
      review_cycle: "Q2 2026",
      reviewer: "Sarah Jenkins",
      rating: 4.9,
      strengths: "Redesigned entire design system, exceptional aesthetic speed.",
      improvements: "Expand documentation for external design tokens.",
      status: "Completed",
      created_date: "2026-07-12T11:00:00.000Z"
    }
  ],

  OnboardingChecklist: [
    {
      id: "onb_1",
      employee_id: "emp_4",
      employee_name: "David Kim",
      task_name: "IT Hardware Setup & Laptop Provisioning",
      category: "IT",
      completed: true,
      due_date: "2026-08-01"
    },
    {
      id: "onb_2",
      employee_id: "emp_4",
      employee_name: "David Kim",
      task_name: "Sign Employment Contract & W-4 Form",
      category: "HR",
      completed: true,
      due_date: "2026-08-01"
    },
    {
      id: "onb_3",
      employee_id: "emp_4",
      employee_name: "David Kim",
      task_name: "Complete Benefits Enrollment",
      category: "Benefits",
      completed: false,
      due_date: "2026-08-15"
    }
  ],

  EmployeeDocument: [
    {
      id: "doc_1",
      employee_id: "emp_1",
      employee_name: "Sarah Jenkins",
      title: "Executive Employment Agreement.pdf",
      category: "Contract",
      upload_date: "2021-03-15",
      file_size: "1.2 MB",
      status: "Signed"
    },
    {
      id: "doc_2",
      employee_id: "emp_2",
      employee_name: "Marcus Vance",
      title: "Confidentiality & IP Assignment.pdf",
      category: "Legal",
      upload_date: "2020-01-10",
      file_size: "850 KB",
      status: "Signed"
    }
  ],

  BenefitEnrollment: [
    {
      id: "ben_1",
      employee_id: "emp_1",
      plan_name: "Premium Health & Vision Care (Aetna PPO)",
      coverage_level: "Family",
      monthly_cost: 420,
      status: "Enrolled"
    },
    {
      id: "ben_2",
      employee_id: "emp_2",
      plan_name: "401(k) Retirement Savings (5% Company Match)",
      coverage_level: "Individual",
      monthly_cost: 650,
      status: "Enrolled"
    }
  ],

  LeaveBalance: [
    {
      id: "bal_1",
      employee_id: "emp_1",
      annual_total: 20,
      annual_used: 4,
      annual_remaining: 16,
      sick_total: 10,
      sick_used: 1,
      sick_remaining: 9
    },
    {
      id: "bal_2",
      employee_id: "emp_2",
      annual_total: 20,
      annual_used: 6,
      annual_remaining: 14,
      sick_total: 10,
      sick_used: 0,
      sick_remaining: 10
    }
  ],

  CompanySettings: [
    {
      id: "comp_1",
      company_name: "STAFFROOM Global Technologies",
      currency: "$",
      payroll_cycle: "Monthly",
      work_hours_per_day: 8,
      fiscal_year_start: "January",
      support_email: "hr@staffroom.internal"
    }
  ]
};
