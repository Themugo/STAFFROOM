import React, { useState } from 'react'
import {
  Sparkles, TrendingUp, AlertTriangle, ShieldAlert, CheckCircle2,
  Users, Truck, DollarSign, Calendar, BookOpen, Clock, ArrowRight,
  Zap, Sliders, ChevronRight, Check, Play, RotateCcw
} from 'lucide-react'

const PREDICTIONS = [
  {
    id: 'pred-attrition',
    domain: 'Employee Attrition Risk',
    timeframe: 'Next 90 Days',
    riskLevel: 'HIGH',
    probability: '78%',
    summary: 'AI predicts a 14% voluntary attrition surge in Senior Logistics Drivers & Software Engineers due to market salary gaps and high overtime.',
    recommendation: 'Re-align salary bands for 12 key roles (+6% market adjustment) and launch driver rotation schedule to cap overtime at 10 hrs/week.',
    actionLabel: 'Apply Salary & Shift Adjustment'
  },
  {
    id: 'pred-fleet-maint',
    domain: 'Fleet Maintenance Failure',
    timeframe: 'Next 30 Days',
    riskLevel: 'HIGH',
    probability: '84%',
    summary: 'Telematics analytics flags high gearbox wear on 3 Mombasa cargo vans (KDA 892B, KDC 114P, KDD 402A) operating on long-haul routes.',
    recommendation: 'Schedule proactive transmission overhaul at Mombasa Depot this weekend before catastrophic failure on highway.',
    actionLabel: 'Schedule Depot Overhaul Work Order'
  },
  {
    id: 'pred-budget-overrun',
    domain: 'Budget Overrun Warning',
    timeframe: 'End of Q3',
    riskLevel: 'MEDIUM',
    probability: '65%',
    summary: 'IT Cloud compute & third-party API token expenses tracking +18% above Q3 budget allocation due to expanded developer testing.',
    recommendation: 'Enforce automated non-prod server auto-shutdown on weekends and cap developer sandbox token limits.',
    actionLabel: 'Enable Weekend Server Auto-Shutdown'
  },
  {
    id: 'pred-recruitment-delay',
    domain: 'Recruitment Bottleneck',
    timeframe: 'Next 60 Days',
    riskLevel: 'MEDIUM',
    probability: '72%',
    summary: 'Senior Cloud Architect requisition is projected to exceed time-to-hire by 14 days due to narrow candidate sourcing channels.',
    recommendation: 'Authorize executive headhunter agency placement and increase referral bonus to $1,500.',
    actionLabel: 'Authorize Headhunter Engagement'
  },
  {
    id: 'pred-statutory-tax',
    domain: 'Statutory SHIF Tax Shift',
    timeframe: 'Next Monthly Payroll',
    riskLevel: 'LOW',
    probability: '99%',
    summary: 'Kenya SHIF 2.75% gross contribution policy update will increase employer matching contribution by $14,200 next month.',
    recommendation: 'Auto-update Business Rules Studio formula and pre-fund statutory reserve escrow account.',
    actionLabel: 'Pre-Fund Escrow Reserve Account'
  }
]

export default function PredictiveDecisionEngine() {
  const [predictions, setPredictions] = useState(PREDICTIONS)
  const [executedActions, setExecutedActions] = useState({})

  const handleExecuteAction = (id) => {
    setExecutedActions(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Sparkles size={13} className="text-amber-400 animate-spin" /> Prescriptive AI Decision Intelligence
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" /> Predictive Forecasting & Decision Recommendations
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Machine learning models anticipate attrition risks, fleet failures, budget overruns, and recruitment bottlenecks, pairing predictions with concrete 1-click executive actions.
            </p>
          </div>
        </div>
      </div>

      {/* Predictions & Recommendations Feed */}
      <div className="space-y-4">
        {predictions.map(pred => {
          const isExecuted = executedActions[pred.id]
          const isHigh = pred.riskLevel === 'HIGH'

          return (
            <div
              key={pred.id}
              className={`card p-5 bg-white dark:bg-slate-900 border rounded-3xl space-y-4 shadow-xs transition-all ${
                isHigh
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isHigh
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                  }`}>
                    {pred.riskLevel} RISK • {pred.probability}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {pred.timeframe}
                  </span>
                </div>

                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {pred.domain}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* AI Prediction Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <TrendingUp size={12} className="text-amber-500" /> Machine Learning Prediction
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {pred.summary}
                  </p>
                </div>

                {/* Recommended Prescriptive Action */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1">
                    <Zap size={12} className="text-amber-500" /> Prescriptive AI Recommendation
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    {pred.recommendation}
                  </p>
                </div>
              </div>

              {/* Execution Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">
                  Automated Decision Workflow Integration
                </span>

                {isExecuted ? (
                  <span className="px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Action Executed & Enforced
                  </span>
                ) : (
                  <button
                    onClick={() => handleExecuteAction(pred.id)}
                    className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Play size={13} fill="currentColor" /> {pred.actionLabel}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
