import React, { useState } from 'react'
import {
  Sliders, Plus, Grid, LayoutDashboard, Eye, CheckCircle2,
  BarChart3, PieChart, Activity, ShieldAlert, Sparkles, Trash2, SlidersHorizontal
} from 'lucide-react'

const AVAILABLE_WIDGETS = [
  { id: 'w-headcount', name: 'Headcount & Growth Metric', type: 'KPI Tile', category: 'HR' },
  { id: 'w-payroll', name: 'Consolidated Payroll Liability', type: 'KPI Tile', category: 'Finance' },
  { id: 'w-digital-twin', name: 'Digital Twin Health Stream', type: 'Topology View', category: 'Platform' },
  { id: 'w-anomalies', name: 'Real-Time Anomaly Radar', type: 'Alert Feed', category: 'Security' },
  { id: 'w-predictions', name: 'AI Prescriptive Predictions', type: 'AI Feed', category: 'Intelligence' },
  { id: 'w-fleet', name: 'Vehicle Fleet Utilization', type: 'Chart Gauge', category: 'Transport' }
]

export default function SelfServiceDashboardBuilder() {
  const [activeWidgets, setActiveWidgets] = useState([
    AVAILABLE_WIDGETS[0],
    AVAILABLE_WIDGETS[1],
    AVAILABLE_WIDGETS[3],
    AVAILABLE_WIDGETS[4]
  ])

  const addWidget = (w) => {
    if (!activeWidgets.find(item => item.id === w.id)) {
      setActiveWidgets([...activeWidgets, w])
    }
  }

  const removeWidget = (id) => {
    setActiveWidgets(activeWidgets.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit mb-2">
              <LayoutDashboard size={13} className="text-cyan-400" /> Self-Service Analytics & Dashboard Builder
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <LayoutDashboard className="text-cyan-400" /> Self-Service Executive Canvas Builder
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Construct personalized executive dashboards without writing code. Choose widgets, rearrange layouts, and export custom board views.
            </p>
          </div>
        </div>
      </div>

      {/* Builder Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Widget Selector Palette */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Plus size={15} className="text-cyan-500" /> Available Widgets Palette
          </h3>

          <div className="space-y-2">
            {AVAILABLE_WIDGETS.map(w => {
              const isAdded = !!activeWidgets.find(item => item.id === w.id)

              return (
                <div
                  key={w.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-[11px]">{w.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{w.type} • {w.category}</span>
                  </div>

                  <button
                    onClick={() => addWidget(w)}
                    disabled={isAdded}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                      isAdded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? 'Added' : '+ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dashboard Preview Canvas */}
        <div className="lg:col-span-3 card p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Grid size={15} className="text-cyan-500" /> Active Custom Dashboard Canvas ({activeWidgets.length} Widgets)
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ● Live Dynamic Layout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeWidgets.map(w => (
              <div key={w.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{w.category} • {w.type}</span>
                  <button
                    onClick={() => removeWidget(w.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h4 className="text-xs font-black text-slate-900 dark:text-white">{w.name}</h4>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 font-mono">
                  [ Live Widget Render Container ]
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
