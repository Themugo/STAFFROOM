import React, { useState } from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import {
  ShieldCheck,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Zap
} from 'lucide-react'

export default function PolicyEngineGrid({ onEditRule, onNotify }) {
  const { rules, toggleRuleStatus, deleteRule, addRule } = useBusinessRules()
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['ALL', 'HR Policies', 'Leave', 'Payroll', 'Procurement', 'Transport', 'Security']

  const filteredRules = rules.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleDuplicate = (rule) => {
    const dup = {
      ...rule,
      id: `RULE-DUP-${Date.now().toString().slice(-4)}`,
      name: `${rule.name} (Copy)`,
      status: 'Draft',
      executionCount: 0
    }
    addRule(dup)
    if (onNotify) onNotify(`Duplicated rule as ${dup.id}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-600" />
              Active Enterprise Business Rules Engine
            </h2>
            <p className="text-xs text-slate-500">
              Manage and monitor rule evaluations running live across StaffRoom.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search rules, triggers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* CATEGORY PILL FILTERS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* RULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => {
          const isActive = rule.status === 'Active'
          return (
            <div
              key={rule.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/60 opacity-75'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                    {rule.id}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      {rule.version}
                    </span>
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {rule.status}
                    </button>
                  </div>
                </div>

                {/* Rule Title & Category */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {rule.name}
                </h3>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold block mt-0.5">
                  [{rule.category}] • Trigger: {rule.triggerEvent}
                </span>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{rule.description}</p>
              </div>

              {/* Execution Stats & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Executions: <strong className="text-slate-800 dark:text-slate-200">{rule.executionCount}</strong></span>
                  <span>Author: {rule.author}</span>
                </div>

                <div className="flex items-center justify-end gap-1 pt-1">
                  <button
                    onClick={() => handleDuplicate(rule)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                    title="Duplicate Rule"
                  >
                    <Copy size={14} />
                  </button>

                  <button
                    onClick={() => onEditRule(rule)}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-all cursor-pointer"
                    title="Edit Rule"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-all cursor-pointer"
                    title="Delete Rule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
