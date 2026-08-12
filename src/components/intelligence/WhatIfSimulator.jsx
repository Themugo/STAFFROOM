import React, { useState } from 'react'
import {
  Sliders, Play, RotateCcw, TrendingUp, DollarSign, Users,
  CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Building2,
  PieChart, Activity, RefreshCw, ChevronRight, BarChart3
} from 'lucide-react'

export default function WhatIfSimulator() {
  const [headcountChange, setHeadcountChange] = useState(10) // +10%
  const [overtimeReduction, setOvertimeReduction] = useState(30) // -30%
  const [salaryAdjustment, setSalaryAdjustment] = useState(5) // +5%
  const [openNewBranch, setOpenNewBranch] = useState(true)
  const [mergeDept, setMergeDept] = useState(false)

  // Recalculated dynamic impact calculations
  const baseMonthlyPayroll = 1248500
  const headcountImpact = baseMonthlyPayroll * (headcountChange / 100)
  const overtimeSavings = 140000 * (overtimeReduction / 100)
  const salaryImpact = baseMonthlyPayroll * (salaryAdjustment / 100)
  const branchCapitalCost = openNewBranch ? 120000 : 0
  const deptMergeSavings = mergeDept ? 85000 : 0

  const netMonthlyFinancialImpact = (headcountImpact + salaryImpact + (branchCapitalCost / 12)) - (overtimeSavings + deptMergeSavings)
  const projectedHealthScore = 88.4 + (headcountChange > 0 ? 1.8 : -2.4) - (overtimeReduction > 0 ? -2.2 : 0) + (openNewBranch ? 2.5 : 0)

  const handleReset = () => {
    setHeadcountChange(0)
    setOvertimeReduction(0)
    setSalaryAdjustment(0)
    setOpenNewBranch(false)
    setMergeDept(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Sliders size={13} className="text-emerald-400" /> Executive What-If Scenario Sandbox
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sliders className="text-emerald-400" /> Executive What-If Scenario Simulator
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Simulate strategic operational changes — adjust headcount, cap overtime, open branches, adjust salary bands, and evaluate instant impact on payroll, budget, and enterprise health.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw size={14} /> Reset Simulation
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Dynamic Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={16} className="text-emerald-500" /> Adjust Simulation Variables
          </h3>

          <div className="space-y-5">
            {/* Variable 1: Headcount % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Staff Headcount Adjustment</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">{headcountChange > 0 ? `+${headcountChange}%` : `${headcountChange}%`}</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={headcountChange}
                onChange={(e) => setHeadcountChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-20% Downsizing</span>
                <span>0% Baseline</span>
                <span>+40% Expansion</span>
              </div>
            </div>

            {/* Variable 2: Overtime Reduction % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Overtime Reduction Target</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">-{overtimeReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={overtimeReduction}
                onChange={(e) => setOvertimeReduction(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% Current Overtime</span>
                <span>-40% Cap</span>
                <span>-80% Strict Cap</span>
              </div>
            </div>

            {/* Variable 3: Salary Adjustment % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Base Salary Market Alignment</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">+{salaryAdjustment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={salaryAdjustment}
                onChange={(e) => setSalaryAdjustment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Switches for Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Open Nakuru Regional Branch</span>
                  <span className="text-[10px] text-slate-500">$120k Setup Cost</span>
                </div>
                <input
                  type="checkbox"
                  checked={openNewBranch}
                  onChange={(e) => setOpenNewBranch(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Merge Customer Care & Admin</span>
                  <span className="text-[10px] text-slate-500">$85k Efficiency Savings</span>
                </div>
                <input
                  type="checkbox"
                  checked={mergeDept}
                  onChange={(e) => setMergeDept(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Output Card */}
        <div className="card p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl space-y-6 shadow-xl h-fit">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              Simulation Results
            </span>
            <h3 className="text-lg font-black text-white">
              Projected Impact Summary
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Net Monthly Financial Impact
              </span>
              <strong className={`text-2xl font-mono font-black ${
                netMonthlyFinancialImpact > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {netMonthlyFinancialImpact >= 0 ? `+$${Math.round(netMonthlyFinancialImpact).toLocaleString()}/mo` : `-$${Math.abs(Math.round(netMonthlyFinancialImpact)).toLocaleString()}/mo`}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Projected Enterprise Health Index
              </span>
              <div className="flex items-baseline justify-between">
                <strong className="text-2xl font-mono font-black text-emerald-400">
                  {projectedHealthScore.toFixed(1)} / 100
                </strong>
                <span className="text-xs font-bold text-emerald-400">+2.4 Delta</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Headcount Impact:</span>
                <strong className="font-mono text-white">+${Math.round(headcountImpact).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Overtime Savings:</span>
                <strong className="font-mono text-emerald-400">-${Math.round(overtimeSavings).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Salary Band Shift:</span>
                <strong className="font-mono text-white">+${Math.round(salaryImpact).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
