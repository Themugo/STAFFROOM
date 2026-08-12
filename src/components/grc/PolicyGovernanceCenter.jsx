import React, { useState } from 'react'
import {
  BookOpen, CheckCircle2, Clock, FileText, Download, UserCheck,
  Plus, Search, Filter, ShieldCheck, AlertCircle, RefreshCw, ChevronRight
} from 'lucide-react'

const POLICIES_DATA = [
  {
    id: 'POL-HR-001',
    title: 'Code of Conduct & Corporate Ethics Policy',
    category: 'Code of Conduct',
    owner: 'Chief HR Officer',
    version: 'v3.2',
    effectiveDate: '2026-01-01',
    nextReviewDate: '2027-01-01',
    acknowledgementRate: 98.4, // % of employees signed
    status: 'ACTIVE',
    approvalStatus: 'APPROVED BY BOARD'
  },
  {
    id: 'POL-FIN-004',
    title: 'Procurement, Payment Delegation & Vendor Approval Standard',
    category: 'Financial Standard',
    owner: 'Chief Financial Officer',
    version: 'v2.1',
    effectiveDate: '2025-06-15',
    nextReviewDate: '2026-06-15',
    acknowledgementRate: 100.0,
    status: 'REVIEW_DUE',
    approvalStatus: 'PENDING EXECUTIVE COMMITTEE'
  },
  {
    id: 'POL-IT-001',
    title: 'Information Security & Data Protection Policy (ISO 27001)',
    category: 'Security & IT',
    owner: 'CISO / Head of Governance',
    version: 'v4.0',
    effectiveDate: '2026-03-01',
    nextReviewDate: '2027-03-01',
    acknowledgementRate: 96.1,
    status: 'ACTIVE',
    approvalStatus: 'APPROVED BY AUDIT COMMITTEE'
  },
  {
    id: 'POL-HR-008',
    title: 'Overtime Authorization & Shift Compensation Guideline',
    category: 'HR Procedure',
    owner: 'Head of People Ops',
    version: 'v1.5',
    effectiveDate: '2026-02-10',
    nextReviewDate: '2026-08-10',
    acknowledgementRate: 92.5,
    status: 'ACTIVE',
    approvalStatus: 'APPROVED BY CEO'
  }
]

export default function PolicyGovernanceCenter() {
  const [policies, setPolicies] = useState(POLICIES_DATA)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPolicies = policies.filter(p => {
    const matchesCat = filterCategory === 'ALL' || p.category === filterCategory
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-2">
              <BookOpen size={13} className="text-indigo-400" /> Enterprise Policy Governance Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BookOpen className="text-indigo-400" /> Enterprise Policy Lifecycle & Mandatory Acknowledgements
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Centralized repository for Policies, Procedures, Standards, Guidelines, and Codes of Conduct. Version control, review cycles, and automated staff acknowledgement tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
              96.8% Enterprise Policy Acknowledgement Rate
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search policy name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'Code of Conduct', 'Financial Standard', 'Security & IT', 'HR Procedure'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy List Grid */}
      <div className="space-y-3">
        {filteredPolicies.map((pol) => {
          const isReviewDue = pol.status === 'REVIEW_DUE'

          return (
            <div
              key={pol.id}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{pol.id} ({pol.version})</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {pol.category}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isReviewDue ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {pol.status} • {pol.approvalStatus}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{pol.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Policy Owner: <strong className="text-slate-800 dark:text-slate-200">{pol.owner}</strong>
                </p>
              </div>

              {/* Progress Bar for Acknowledgement */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span className="text-slate-500">Employee Digital Sign-off Acknowledgement</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{pol.acknowledgementRate}% Signed</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pol.acknowledgementRate}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                <div>Effective Date: <strong className="text-slate-800 dark:text-slate-200">{pol.effectiveDate}</strong></div>
                <div>Next Review Date: <strong className="text-slate-800 dark:text-slate-200">{pol.nextReviewDate}</strong></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
