import {
  Briefcase,
  ListChecks,
  DollarSign,
  Users,
  CalendarCheck,
  Palmtree,
  TrendingUp,
  BookOpen,
  Heart,
  UserCircle,
  Bus,
  Sparkles,
  FileText,
  ShieldCheck,
  Plus,
  Clock,
  Plane,
  FileBarChart2,
  Settings,
  Building2,
  Target,
  ShoppingCart,
  PieChart,
  User
} from 'lucide-react';

export const GLOBAL_SEARCH_ITEMS = [
  // --- CORE HR MODULES ---
  {
    id: 'mod-ats',
    title: 'ATS & Recruitment',
    type: 'Module',
    category: 'Talent Acquisition',
    description: 'Job requisitions, applicant tracking, interview scorecards & pipeline',
    page: 'Recruitment',
    icon: Briefcase,
    badge: 'Module'
  },
  {
    id: 'mod-onboarding',
    title: 'Employee Onboarding',
    type: 'Module',
    category: 'Talent Acquisition',
    description: 'New hire onboarding checklists, IT provisioning & probation tracking',
    page: 'Onboarding',
    icon: ListChecks,
    badge: 'Module'
  },
  {
    id: 'mod-payroll',
    title: 'Payroll & Compensation',
    type: 'Module',
    category: 'Finance & Operations',
    description: 'Monthly salary disbursement, tax deductions, payslips & statutory filings',
    page: 'Payroll',
    icon: DollarSign,
    badge: 'Module'
  },
  {
    id: 'mod-staff',
    title: 'Workforce Directory',
    type: 'Module',
    category: 'People Ops',
    description: 'Employee profiles, org hierarchy, department staffing & contact directory',
    page: 'Staff',
    icon: Users,
    badge: 'Module'
  },
  {
    id: 'mod-attendance',
    title: 'Time & Attendance',
    type: 'Module',
    category: 'People Ops',
    description: 'Biometric clock-in logs, timesheets, shift rosters & attendance tracking',
    page: 'Attendance',
    icon: CalendarCheck,
    badge: 'Module'
  },
  {
    id: 'mod-leave',
    title: 'Leave & Time Off Management',
    type: 'Module',
    category: 'People Ops',
    description: 'Leave requests, annual leave balances, sick leave & approval workflows',
    page: 'Leave',
    icon: Palmtree,
    badge: 'Module'
  },
  {
    id: 'mod-roster',
    title: 'Duty Roster & Shifts',
    type: 'Module',
    category: 'People Ops',
    description: 'Shift scheduling, rotation plans, night shift eligibility & team rotas',
    page: 'DutyRoster',
    icon: CalendarCheck,
    badge: 'Module'
  },
  {
    id: 'mod-performance',
    title: 'Performance & Talent Reviews',
    type: 'Module',
    category: 'Growth & Strategy',
    description: 'KPI tracking, 360 appraisals, goal setting & probation assessments',
    page: 'Performance',
    icon: TrendingUp,
    badge: 'Module'
  },
  {
    id: 'mod-knowledge',
    title: 'Knowledge Center & SOP Vault',
    type: 'Module',
    category: 'Governance & SOP',
    description: 'Standard Operating Procedures, employee handbooks, policy documents & runbooks',
    page: 'KnowledgeCenter',
    icon: BookOpen,
    badge: 'Module'
  },
  {
    id: 'mod-benefits',
    title: 'Benefits & Wellness Perks',
    type: 'Module',
    category: 'Compensation',
    description: 'Health insurance schemes, pension funds, wellness allowances & perks',
    page: 'Benefits',
    icon: Heart,
    badge: 'Module'
  },
  {
    id: 'mod-[#self-service]',
    title: 'Employee Self-Service Portal',
    type: 'Module',
    category: 'Employee Experience',
    description: 'Personal profile management, payslip downloads & expense claims',
    page: 'SelfService',
    icon: UserCircle,
    badge: 'Module'
  },
  {
    id: 'mod-transport',
    title: 'Transport & Fleet Management',
    type: 'Module',
    category: 'Operations',
    description: 'Pool vehicle booking, shift shuttles, dispatch control & official travel',
    page: 'TransportManagement',
    icon: Bus,
    badge: 'Module'
  },
  {
    id: 'mod-ai',
    title: 'AI Workforce Copilot',
    type: 'Module',
    category: 'AI Assistant',
    description: 'Conversational HR query assistant, policy lookup & automated analytics',
    page: 'AICopilot',
    icon: Sparkles,
    badge: 'Module'
  },

  // --- EMPLOYEE PROFILES ---
  {
    id: 'emp-001',
    title: 'Sarah Jenkins',
    type: 'Employee',
    category: 'HR & People Operations',
    description: 'HR Director • EMP-001 • sarah.jenkins@staffroom.com',
    subtitle: 'HR Director • People Operations',
    meta: 'New York HQ • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-002',
    title: 'David Ochieng',
    type: 'Employee',
    category: 'Engineering & Technology',
    description: 'Lead Software Engineer • EMP-014 • david.o@staffroom.com',
    subtitle: 'Lead Software Engineer • Tech Ops',
    meta: 'Nairobi Hub • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-003',
    title: 'Amara Okafor',
    type: 'Employee',
    category: 'HR & People Operations',
    description: 'HR Operations Specialist • EMP-022 • amara.o@staffroom.com',
    subtitle: 'HR Specialist • People Ops',
    meta: 'Lagos Hub • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-004',
    title: 'Elena Rostova',
    type: 'Employee',
    category: 'Engineering & Technology',
    description: 'ICT Infrastructure Lead • EMP-008 • elena.r@staffroom.com',
    subtitle: 'Infrastructure Lead • IT Support',
    meta: 'London HQ • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-005',
    title: 'Lucas Vance',
    type: 'Employee',
    category: 'Finance & Accounts',
    description: 'Senior Finance Manager • EMP-005 • lucas.vance@staffroom.com',
    subtitle: 'Senior Finance Manager • Finance',
    meta: 'New York HQ • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-006',
    title: 'Kemi Adebayo',
    type: 'Employee',
    category: 'Talent Acquisition',
    description: 'Senior Talent Acquisition Lead • EMP-031 • kemi.a@staffroom.com',
    subtitle: 'Recruitment Lead • Talent Ops',
    meta: 'Lagos Hub • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },
  {
    id: 'emp-007',
    title: 'Grace Mbalu',
    type: 'Employee',
    category: 'Finance & Accounts',
    description: 'Payroll & Benefits Officer • EMP-018 • grace.m@staffroom.com',
    subtitle: 'Payroll Officer • Finance Ops',
    meta: 'Nairobi Hub • Active',
    page: 'Staff',
    icon: User,
    badge: 'Employee'
  },

  // --- INTERNAL SOP DOCUMENTS ---
  {
    id: 'sop-001',
    title: 'SOP-2026-01: Remote & Hybrid Work Policy',
    type: 'SOP',
    category: 'Governance & HR SOP',
    description: 'Standard operating procedure for remote schedules, core hours, internet stipend & home setup',
    subtitle: 'v2.4 Approved by Board • Effective Jan 2026',
    meta: 'Governing SOP',
    page: 'KnowledgeCenter',
    icon: FileText,
    badge: 'SOP Document'
  },
  {
    id: 'sop-002',
    title: 'SOP-2026-02: Expense Claim & Reimbursement Workflow',
    type: 'SOP',
    category: 'Finance & Compliance SOP',
    description: 'Step-by-step procedure for submitting receipts, travel claims, line manager sign-offs & payout SLAs',
    subtitle: 'DOC-SOP-FIN-02 • Updated Q2 2026',
    meta: 'Finance SOP',
    page: 'KnowledgeCenter',
    icon: FileText,
    badge: 'SOP Document'
  },
  {
    id: 'sop-003',
    title: 'SOP-2026-03: IT Provisioning & Laptop Asset Care',
    type: 'SOP',
    category: 'ICT & Security SOP',
    description: 'Hardware issue protocols, new hire IT setup, VPN access policies & security compliance',
    subtitle: 'DOC-SOP-IT-09 • Published IT Ops',
    meta: 'IT SOP',
    page: 'KnowledgeCenter',
    icon: FileText,
    badge: 'SOP Document'
  },
  {
    id: 'sop-004',
    title: 'SOP-2026-04: Code of Conduct & Workplace Ethics',
    type: 'SOP',
    category: 'HR & Ethics SOP',
    description: 'Anti-harassment guidelines, whistleblower channels, data confidentiality & disciplinary procedures',
    subtitle: 'DOC-POL-004 • Annual Compliance',
    meta: 'Policy Handbook',
    page: 'KnowledgeCenter',
    icon: ShieldCheck,
    badge: 'SOP Document'
  },
  {
    id: 'sop-005',
    title: 'SOP-2026-05: Overtime & Night Shift Allowance SOP',
    type: 'SOP',
    category: 'Operations SOP',
    description: 'Eligibility rules for shift transport, meal allowances, overtime rate multiplier & manager approvals',
    subtitle: 'DOC-SOP-OPS-12 • Active Roster Policy',
    meta: 'Shift SOP',
    page: 'KnowledgeCenter',
    icon: FileText,
    badge: 'SOP Document'
  },
  {
    id: 'sop-006',
    title: 'SOP-2026-06: Official Travel & Emergency Fleet Dispatch',
    type: 'SOP',
    category: 'Transport & Travel SOP',
    description: 'Per diem allowances, pool vehicle checkout procedures, safety inspections & emergency transport',
    subtitle: 'DOC-SOP-TRN-06 • Fleet Governance',
    meta: 'Transport SOP',
    page: 'KnowledgeCenter',
    icon: Plane,
    badge: 'SOP Document'
  },

  // --- QUICK ACTIONS ---
  {
    id: 'act-clockin',
    title: 'Clock In / Record Attendance',
    type: 'Action',
    category: 'Quick Action',
    description: 'Instant biometric or web clock-in timestamp for today\'s shift',
    page: 'Attendance',
    icon: Clock,
    badge: 'Quick Action'
  },
  {
    id: 'act-leave',
    title: 'Apply for Leave / Time Off',
    type: 'Action',
    category: 'Quick Action',
    description: 'Submit annual leave, sick day, or personal time-off request',
    page: 'Leave',
    icon: Palmtree,
    badge: 'Quick Action'
  },
  {
    id: 'act-claim',
    title: 'Submit Expense / Reimbursement Claim',
    type: 'Action',
    category: 'Quick Action',
    description: 'Upload receipt and claim refund for official company expenses',
    page: 'SelfService',
    icon: DollarSign,
    badge: 'Quick Action'
  },
  {
    id: 'act-add-staff',
    title: 'Add New Employee Record',
    type: 'Action',
    category: 'Quick Action',
    description: 'Create a new employee profile in the workforce directory',
    page: 'Staff',
    icon: Plus,
    badge: 'Quick Action'
  },
  {
    id: 'act-transport',
    title: 'Request Pool Vehicle / Shuttle Booking',
    type: 'Action',
    category: 'Quick Action',
    description: 'Reserve transport for official field trips or night shifts',
    page: 'TransportManagement',
    icon: Bus,
    badge: 'Quick Action'
  }
];
