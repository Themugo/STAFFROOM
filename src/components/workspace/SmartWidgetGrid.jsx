import React, { useState, useEffect } from 'react'
import {
  Grid,
  Eye,
  EyeOff,
  Pin,
  Move,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  Zap,
  Check
} from 'lucide-react'

export default function SmartWidgetGrid({ children, isFocusMode, onToggleFocusMode }) {
  const [widgets, setWidgets] = useState([
    { id: 'ai-briefing', name: 'AI Daily Briefing', visible: true, pinned: true },
    { id: 'kpis', name: 'Operational KPI Metrics', visible: true, pinned: true },
    { id: 'quick-actions', name: 'Contextual Quick Actions', visible: true, pinned: false },
    { id: 'universal-inbox', name: 'Universal Inbox & Approvals', visible: true, pinned: false },
    { id: 'analytics', name: 'Financial & Workforce Analytics', visible: true, pinned: false },
    { id: 'operations-feed', name: 'Live Operations & Calendar', visible: true, pinned: false },
  ])

  const [customizeOpen, setCustomizeOpen] = useState(false)

  const toggleWidgetVisibility = (id) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    )
  }

  const toggleWidgetPin = (id) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, pinned: !w.pinned } : w))
    )
  }

  const resetLayout = () => {
    setWidgets((prev) => prev.map((w) => ({ ...w, visible: true, pinned: false })))
  }

  return (
    <div className="space-y-4">
      {/* TOOLBAR CONTROLS */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-xs text-xs font-mono">
        <div className="flex items-center gap-2">
          <Grid size={15} className="text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Smart Adaptive Workspace Layout
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Focus Mode Toggle */}
          <button
            onClick={onToggleFocusMode}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isFocusMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}</span>
          </button>

          {/* Customize Layout */}
          <button
            onClick={() => setCustomizeOpen(!customizeOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Customize Widgets</span>
          </button>
        </div>
      </div>

      {/* CUSTOMIZE MODAL DROPDOWN */}
      {customizeOpen && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Configure Workspace Widgets
            </span>
            <button
              onClick={resetLayout}
              className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Reset Default
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {widgets.map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {w.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWidgetPin(w.id)}
                    className={`p-1 rounded-lg cursor-pointer ${
                      w.pinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-950' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Pin widget"
                  >
                    <Pin size={13} />
                  </button>
                  <button
                    onClick={() => toggleWidgetVisibility(w.id)}
                    className={`p-1 rounded-lg cursor-pointer ${
                      w.visible ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Toggle visibility"
                  >
                    {w.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHILDREN CONTAINING DYNAMIC WORKSPACE CONTENT */}
      <div>{children}</div>
    </div>
  )
}
