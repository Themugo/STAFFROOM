import React, { useState } from 'react'
import {
  Lock, AlertTriangle, ShieldCheck, UserCheck, RefreshCw,
  Search, Filter, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'

const SOD_RULES = [
  {
    id: 'SOD-RULE-01',
    name: 'Create Vendor Account + Approve Vendor Invoice/Payment',
    riskLevel: 'CRITICAL',
    description: 'A single user holding both Vendor Creation and Payment Approval permissions creates fraudulent vendor risks.',
    conflictCount: 1,
    conflictingUsers: ['David K. (Senior Accountant)'],
    mitigation: 'System enforced hard block. Second approval required from Finance Director.',
    status: 'MITIGATED'
  },
  {
    id: 'SOD-RULE-02',
    name: 'Recruit/Onboard Employee + Process Payroll Batch',
    riskLevel: 'CRITICAL',
    description: 'Creating ghost employees and processing payroll under a single account.',
    conflictCount: 0,
    conflictingUsers: [],
    mitigation: 'Role separation strictly enforced between HR Sourcing and Payroll Processing.',
    status: 'CLEAN'
  },
  {
    id: 'SOD-RULE-03',
    name: 'Create Purchase Order + Receive Goods / Sign GRN',
    riskLevel: 'HIGH',
    description: 'PO authorizer verifying receipt of physical goods allows phantom deliveries.',
    conflictCount: 0,
    conflictingUsers: [],
    mitigation: 'Warehouse GRN scan required via mobile scanner prior to PO closure.',
    status: 'CLEAN'
  },
  {
    id: 'SOD-RULE-04',
    name: 'Approve Leave Application + Process Leave Pay',
    riskLevel: 'MEDIUM',
    description: 'Approving own leave or processing unverified leave payments.',
    conflictCount: 0,
    conflictingUsers: [],
    mitigation: 'Manager approval required before Payroll engine includes leave encashment.',
    status: 'CLEAN'
  }
]

export default function AccessGovernanceSodEngine() {
  const [sodRules, setSodRules] = useState(SOD_RULES)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Lock size={13} className="text-rose-400" /> Segregation of Duties (SoD) & Access Governance Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Lock className="text-rose-400" /> Automated SoD Conflict Detection & Access Governance
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time conflict detection stopping toxic combination permissions (e.g., Vendor Creation + Payment Approval, Recruitment + Payroll Approval, PO Creation + GRN Receipt).
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
            99.2% SoD Policy Compliance
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {sodRules.map((rule) => {
          const isConflict = rule.conflictCount > 0

          return (
            <div
              key={rule.id}
              className={`card p-5 bg-white dark:bg-slate-900 border rounded-3xl space-y-3 shadow-xs ${
                isConflict ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{rule.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {rule.riskLevel}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isConflict ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {rule.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{rule.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{rule.description}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <strong className="text-slate-800 dark:text-slate-200 block text-[10px] font-mono uppercase">Enforced Mitigating Control:</strong>
                <span className="text-slate-600 dark:text-slate-300">{rule.mitigation}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
