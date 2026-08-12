import React, { useState } from 'react'
import {
  Grid, Building2, MapPin, AlertTriangle, ShieldCheck,
  PieChart, Activity, Users, DollarSign, Briefcase, Filter
} from 'lucide-react'

const DEPARTMENT_HEATMAP = [
  { name: 'Engineering & Tech', health: 94, risk: 'LOW', budgetUtil: '88%', headcount: 84, color: 'bg-emerald-500' },
  { name: 'Human Resources', health: 96, risk: 'LOW', budgetUtil: '91%', headcount: 22, color: 'bg-emerald-500' },
  { name: 'Transport Logistics', health: 78, risk: 'MEDIUM', budgetUtil: '98%', headcount: 65, color: 'bg-amber-500' },
  { name: 'Finance & Payroll', health: 98, risk: 'LOW', budgetUtil: '84%', headcount: 18, color: 'bg-emerald-500' },
  { name: 'Procurement', health: 86, risk: 'LOW', budgetUtil: '92%', headcount: 14, color: 'bg-emerald-500' },
  { name: 'Customer Service', health: 72, risk: 'MEDIUM', budgetUtil: '96%', headcount: 45, color: 'bg-amber-500' },
  { name: 'Facilities & Security', health: 88, risk: 'LOW', budgetUtil: '85%', headcount: 32, color: 'bg-emerald-500' },
  { name: 'Legal & Governance', health: 99, risk: 'LOW', budgetUtil: '79%', headcount: 10, color: 'bg-emerald-500' }
]

const BRANCH_HEATMAP = [
  { branch: 'Nairobi Central HQ', region: 'Central Kenya', score: 96, status: 'EXCELLENT', color: 'bg-emerald-500', employees: 184 },
  { branch: 'Mombasa Logistics Hub', region: 'Coast Region', score: 82, status: 'MODERATE', color: 'bg-amber-500', employees: 76 },
  { branch: 'Kisumu Regional Office', region: 'Western Kenya', score: 91, status: 'STRONG', color: 'bg-emerald-500', employees: 42 },
  { branch: 'Eldoret Agri Depot', region: 'Rift Valley', score: 88, status: 'STRONG', color: 'bg-emerald-500', employees: 30 }
]

export default function ExecutiveHeatMaps() {
  const [activeView, setActiveView] = useState('DEPT')

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Grid size={13} className="text-purple-400" /> Executive Operational Heat Maps
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Grid className="text-purple-400" /> Enterprise Health & Risk Exposure Heat Grid
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Visual multi-matrix mapping departmental operational health, regional branch performance, budget consumption velocity, and risk exposure levels.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveView('DEPT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeView === 'DEPT' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Department Health
            </button>
            <button
              onClick={() => setActiveView('BRANCH')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeView === 'BRANCH' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Regional Branches
            </button>
          </div>
        </div>
      </div>

      {/* Department Heat Map Grid */}
      {activeView === 'DEPT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENT_HEATMAP.map((dept, i) => (
            <div key={i} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Department</span>
                <span className={`w-3 h-3 rounded-full ${dept.color}`} />
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{dept.name}</h3>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{dept.health}%</span>
                  <span className="text-[10px] font-bold text-slate-500">Risk: {dept.risk}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                <div>Budget Util: <strong className="font-mono text-slate-800 dark:text-slate-200">{dept.budgetUtil}</strong></div>
                <div>Headcount: <strong className="font-mono text-slate-800 dark:text-slate-200">{dept.headcount}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regional Branch Heat Map Grid */}
      {activeView === 'BRANCH' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANCH_HEATMAP.map((b, i) => (
            <div key={i} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">{b.region}</span>
                <span className={`w-3 h-3 rounded-full ${b.color}`} />
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{b.branch}</h3>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{b.score} / 100</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{b.status}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Active Staff:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">{b.employees} Employees</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
