import React from 'react'
import {
  Zap,
  Palmtree,
  DollarSign,
  UserPlus,
  Truck,
  PieChart,
  ShoppingCart,
  Award,
  FileText,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function QuickActionCenter({ activeRole = 'ceo', onActionTrigger }) {
  const actionsByRole = {
    ceo: [
      { id: 'act-1', label: 'Review Executive Governance', icon: ShieldCheck, link: 'ExecutiveGovernance', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
      { id: 'act-2', label: 'Approve Pending Leaves', icon: Palmtree, link: 'Leave', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
      { id: 'act-3', label: 'Audit Payroll Disbursal', icon: DollarSign, link: 'Payroll', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
      { id: 'act-4', label: 'Inspect Strategy OKRs', icon: PieChart, link: 'StrategyManagement', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    ],
    hrm: [
      { id: 'act-5', label: 'Post New Job Vacancy', icon: UserPlus, link: 'Recruitment', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
      { id: 'act-6', label: 'Process Leave Requests', icon: Palmtree, link: 'Leave', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
      { id: 'act-7', label: 'Onboard New Employee', icon: CalendarCheck, link: 'Onboarding', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
      { id: 'act-8', label: 'Initiate Performance Cycle', icon: Award, link: 'Performance', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    ],
    payroll: [
      { id: 'act-9', label: 'Draft Next Payroll Cycle', icon: DollarSign, link: 'Payroll', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
      { id: 'act-10', label: 'Review Overtime Claims', icon: CalendarCheck, link: 'Attendance', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
      { id: 'act-11', label: 'Check Tax Remittances', icon: FileText, link: 'Reports', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
      { id: 'act-12', label: 'Audit Department Budgets', icon: PieChart, link: 'Budget', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    ],
    dept_manager: [
      { id: 'act-13', label: 'Approve Team Leave', icon: Palmtree, link: 'Leave', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
      { id: 'act-14', label: 'Review Duty Roster', icon: CalendarCheck, link: 'DutyRoster', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
      { id: 'act-15', label: 'Submit Appraisal Ratings', icon: Award, link: 'Performance', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
      { id: 'act-16', label: 'Requisition Equipment', icon: ShoppingCart, link: 'Procurement', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    ],
    employee: [
      { id: 'act-17', label: 'Apply for Leave', icon: Palmtree, link: 'SelfService', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
      { id: 'act-18', label: 'Clock Attendance Check-In', icon: CalendarCheck, link: 'SelfService', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
      { id: 'act-19', label: 'Download Payslip PDF', icon: FileText, link: 'SelfService', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
      { id: 'act-20', label: 'View Duty Schedule', icon: CalendarCheck, link: 'DutyRoster', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    ],
  }

  const actions = actionsByRole[activeRole] || actionsByRole.ceo

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Zap size={18} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Contextual Quick Actions
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Role-tailored</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <Link
              key={act.id}
              to={createPageUrl(act.link)}
              className={`p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer ${act.color}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-xs font-bold leading-snug">{act.label}</span>
              </div>
              <ArrowRight
                size={14}
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0"
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
