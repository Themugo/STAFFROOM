import { useState } from 'react'
import {
  BookOpen, FileText, Code, ShieldCheck, Users, DollarSign,
  Download, Search, Sparkles, Check, ChevronRight, Copy
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const MANUALS = [
  {
    id: 'doc-admin',
    title: 'Enterprise Administrator Guide',
    icon: ShieldCheck,
    audience: 'HR Admins & C-Suite',
    sections: [
      'Tenant Provisioning & Multi-Org Hierarchy',
      'Role-Based & Attribute-Based Access Control (RBAC/ABAC)',
      'Custom Branding, Themes & White-Labeling',
      'Audit Logging, Retention Policies & Compliance Export'
    ]
  },
  {
    id: 'doc-payroll',
    title: 'Global Payroll & Compensation Manual',
    icon: DollarSign,
    audience: 'Finance & Payroll Managers',
    sections: [
      'Multi-Currency Salary Structure Setup',
      'Automated Statutory Deductions & Local Tax Engine Rules',
      'Direct Deposit Payroll Generation & Bank Files',
      'Off-Cycle Payments, Bonuses & Equity Tracking'
    ]
  },
  {
    id: 'doc-emp',
    title: 'Employee Self-Service Guidebook',
    icon: Users,
    audience: 'All Staff & Team Members',
    sections: [
      'Navigating the Self-Service Dashboard & Profile',
      'Submitting Time-Off Requests & Managing Attendance',
      'Accessing Digital Payslips & Tax Documents',
      'Performance Goals, Continuous Feedback & Peer Reviews'
    ]
  },
  {
    id: 'doc-dev',
    title: 'Developer Platform & API Specification',
    icon: Code,
    audience: 'Engineers & Integrators',
    sections: [
      'OAuth 2.0 & API Key Authentication Protocols',
      'RESTful & GraphQL API Endpoints Reference',
      'Real-Time Webhooks & Dead Letter Queue (DLQ) Management',
      'Building Custom UI Plugins & Event Bus Handlers'
    ]
  }
]

export default function DocumentationSuite() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [activeManual, setActiveManual] = useState(MANUALS[0])
  const [searchTerm, setSearchTerm] = useState('')

  const handleDownloadPdf = (title) => {
    showSuccess(`Generated PDF Manual for "${title}". Downloading package...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Enterprise Manuals & Documentation Suite
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive production guidebooks, security compliance specs, and developer API references.
          </p>
        </div>

        <button
          onClick={() => handleDownloadPdf(activeManual.title)}
          className="btn-primary text-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download size={14} /> Export Manual PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Manuals Navigation List (1 col) */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block px-2 mb-2">Available Documentation</span>

          {MANUALS.map((man) => {
            const Icon = man.icon
            const isSelected = activeManual.id === man.id
            return (
              <div
                key={man.id}
                onClick={() => setActiveManual(man)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isSelected ? 'text-white' : 'text-indigo-600'} />
                  <div>
                    <span className="font-bold text-xs block leading-tight">{man.title}</span>
                    <span className={`text-[10px] block ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {man.audience}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className={isSelected ? 'text-white' : 'text-slate-400'} />
              </div>
            )
          })}
        </div>

        {/* Selected Manual Viewer (2 cols) */}
        <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wide">
              Target Audience: {activeManual.audience}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeManual.title}</h3>
            <p className="text-xs text-slate-500">
              Official StaffRoom SaaS documentation and architectural specification manual.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Table of Contents & Core Chapters</h4>

            <div className="space-y-3">
              {activeManual.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                    <FileText size={15} className="text-indigo-600 shrink-0" />
                    <span>Chapter {idx + 1}: {sec}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                    Detailed step-by-step procedures, code snippets, visual diagrams, and administrative best practices.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span>ONLINE SPECIFICATION REPOSITORY</span>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded">UPDATED</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              All manuals are automatically synchronized with system releases. Access online at <code className="text-indigo-300">https://docs.staffroom.app/v3/</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
