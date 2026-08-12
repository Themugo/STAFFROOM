import { useState } from 'react'
import {
  Compass, CheckCircle2, Play, Users, DollarSign, Calendar, Sparkles,
  ShieldCheck, FileCode, ChevronRight, Award, Zap, RotateCcw
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const ONBOARDING_ROLES = [
  {
    role: 'HR Executive & Admin',
    desc: 'Set up organization structures, manage global payroll, configure approval policies, and monitor workforce analytics.',
    steps: [
      { name: '1. Customize Branding & Tenant Settings', done: true },
      { name: '2. Configure Employee Departments & Roles', done: true },
      { name: '3. Setup Automated Payroll & Tax Brackets', done: true },
      { name: '4. Define Multi-Level Approval Workflows', done: true },
    ]
  },
  {
    role: 'Employee Self-Service',
    desc: 'Request time off, view digital paystubs, complete annual reviews, track goal progress, and sign documents.',
    steps: [
      { name: '1. Complete Profile & Emergency Contacts', done: true },
      { name: '2. Review & Sign Employee Handbook', done: true },
      { name: '3. Request Leave / View Time-Off Balance', done: true },
      { name: '4. Access Monthly Payroll Payslips', done: true },
    ]
  },
  {
    role: 'Talent Acquisition & Recruiter',
    desc: 'Post job requisitions, manage candidate pipelines, run AI resume screening, and send digital offer letters.',
    steps: [
      { name: '1. Create Job Requisition & Scoring Rubric', done: true },
      { name: '2. Connect Job Board Webhooks', done: true },
      { name: '3. Conduct Candidate Interviews', done: true },
      { name: '4. Issue Offer Letter & E-Signatures', done: true },
    ]
  },
  {
    role: 'Developer & System Integrator',
    desc: 'Manage API keys, register webhook subscribers, monitor event streams, and build custom workflow plugins.',
    steps: [
      { name: '1. Generate Sandbox API Keys', done: true },
      { name: '2. Test Webhook Subscriptions', done: true },
      { name: '3. Explore REST / GraphQL Endpoints', done: true },
      { name: '4. Inspect System Event Bus Stream', done: true },
    ]
  }
]

export default function OnboardingInteractiveTour() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [activeRoleIndex, setActiveRoleIndex] = useState(0)
  const [isSimulatingTour, setIsSimulatingTour] = useState(false)

  const handleStartTour = () => {
    setIsSimulatingTour(true)
    setTimeout(() => {
      setIsSimulatingTour(false)
      showSuccess(`Interactive Onboarding Walkthrough completed for ${ONBOARDING_ROLES[activeRoleIndex].role}!`)
    }, 1200)
  }

  const activeRole = ONBOARDING_ROLES[activeRoleIndex]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" /> Interactive Platform Onboarding & Role Walkthroughs
          </h2>
          <p className="text-xs text-slate-500">
            Tailored first-run onboarding experiences designed for every persona in your enterprise organization.
          </p>
        </div>

        <button
          onClick={handleStartTour}
          disabled={isSimulatingTour}
          className="btn-primary text-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          {isSimulatingTour ? <Sparkles size={14} className="animate-spin" /> : <Play size={14} />}
          {isSimulatingTour ? 'Launching Tour Simulator...' : 'Launch Persona Tour'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Role Selector Tabs (1 col) */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block px-2 mb-2">Select Target Persona</span>

          {ONBOARDING_ROLES.map((role, idx) => (
            <div
              key={idx}
              onClick={() => setActiveRoleIndex(idx)}
              className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                activeRoleIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{role.role}</span>
              <ChevronRight size={14} className={activeRoleIndex === idx ? 'text-white' : 'text-slate-400'} />
            </div>
          ))}
        </div>

        {/* Role Detail & Checklist (2 cols) */}
        <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 shadow-sm">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wide">
              Selected Persona
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeRole.role}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{activeRole.desc}</p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Required Milestone Steps:</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeRole.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold block">Self-Guided Guided Tour Engine</span>
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300 block">
                Includes context tooltips, keyboard shortcuts, and step-by-step progress tracking.
              </span>
            </div>
            <Award className="w-6 h-6 text-indigo-600 shrink-0" />
          </div>
        </div>

      </div>
    </div>
  )
}
