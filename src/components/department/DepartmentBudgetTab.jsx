import React, { useState } from 'react'
import {
  DollarSign, PieChart, Plus, Download, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, ShieldCheck, FileText, ArrowUpRight
} from 'lucide-react'

export default function DepartmentBudgetTab({ currentDept, showSuccess }) {
  const [lineItems, setLineItems] = useState([
    { id: 'bi-1', category: 'Software & SaaS Licensing', allocated: 45000, spent: 32400, status: 'ON_TRACK' },
    { id: 'bi-2', category: 'Hardware & Workstations', allocated: 30000, spent: 28500, status: 'NEAR_LIMIT' },
    { id: 'bi-3', category: 'Team Training & Certifications', allocated: 15000, spent: 8200, status: 'ON_TRACK' },
    { id: 'bi-4', category: 'Travel & Client Conferences', allocated: 20000, spent: 14100, status: 'ON_TRACK' }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [claimForm, setClaimForm] = useState({ description: '', amount: '', category: 'Software & SaaS Licensing' })

  const totalAllocated = lineItems.reduce((s, i) => s + i.allocated, 0)
  const totalSpent = lineItems.reduce((s, i) => s + i.spent, 0)
  const percentSpent = Math.round((totalSpent / totalAllocated) * 100)

  const handleCreateClaim = (e) => {
    e.preventDefault()
    if (!claimForm.amount) return
    const amt = parseFloat(claimForm.amount) || 0
    setLineItems(lineItems.map(i => i.category === claimForm.category ? { ...i, spent: i.spent + amt } : i))
    setModalOpen(false)
    setClaimForm({ description: '', amount: '', category: 'Software & SaaS Licensing' })
    showSuccess(`Expense commitment of $${amt.toLocaleString()} recorded for ${currentDept.name}.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Cost Center Code</span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono">CC-{currentDept.code}-2026</span>
          <span className="text-[10px] text-indigo-500 font-bold block">FY26 Operating Budget</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Total Budget Allocation</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">${totalAllocated.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500 font-bold block">Approved by Finance</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Committed Spend</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${totalSpent.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block">{percentSpent}% of total budget</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Remaining Reserve</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${(totalAllocated - totalSpent).toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500 font-bold block">Positive Variance</span>
        </div>
      </div>

      {/* Main Budget Line Items */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Operating Line Items
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Budget utilization and category variance breakdown.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Log Expense
            </button>
            <button
              onClick={() => showSuccess('Department budget audit report generated.')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Financials
            </button>
          </div>
        </div>

        {/* Line Items List */}
        <div className="space-y-4">
          {lineItems.map((item) => {
            const pct = Math.round((item.spent / item.allocated) * 100)
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.category}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'NEAR_LIMIT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct > 85 ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${pct}%` }} />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Committed: ${item.spent.toLocaleString()}</span>
                  <span>Allocated: ${item.allocated.toLocaleString()} ({pct}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Department Expense Commitment</h3>
            <form onSubmit={handleCreateClaim} className="space-y-3">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={claimForm.category}
                  onChange={(e) => setClaimForm({ ...claimForm, category: e.target.value })}
                >
                  <option value="Software & SaaS Licensing">Software & SaaS Licensing</option>
                  <option value="Hardware & Workstations">Hardware & Workstations</option>
                  <option value="Team Training & Certifications">Team Training & Certifications</option>
                  <option value="Travel & Client Conferences">Travel & Client Conferences</option>
                </select>
              </div>

              <div>
                <label className="label">Expense Amount ($)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g. 1200"
                  value={claimForm.amount}
                  onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Purpose / Description</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Annual cloud security license renewal"
                  value={claimForm.description}
                  onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Log Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
