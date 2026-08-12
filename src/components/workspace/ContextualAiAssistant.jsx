import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  BrainCircuit,
  Zap,
  ArrowRight,
  Send,
  RefreshCw,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  Truck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'

export default function ContextualAiAssistant({ activeRole = 'ceo', onExecuteAction }) {
  const [promptInput, setPromptInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)

  // Context-specific suggestions
  const roleContextMap = {
    ceo: {
      title: 'Executive AI Strategy Assistant',
      badge: 'Executive Mode',
      color: 'from-indigo-600 to-purple-600',
      suggestions: [
        'Generate Q3 Organization Performance Briefing',
        'Analyze Department Budget Variances',
        'Identify Key Retention & Attrition Risks',
        'Summarize Pending Executive Sign-offs',
      ],
    },
    hrm: {
      title: 'People Intelligence & HR AI Assistant',
      badge: 'HR Mode',
      color: 'from-blue-600 to-indigo-600',
      suggestions: [
        'Draft Vacancy Description for Senior Developer',
        'Generate Onboarding Checklist for Sales Team',
        'Review Unresolved Employee Grievances',
        'Analyze Attendance Rate Trends this Month',
      ],
    },
    payroll: {
      title: 'Payroll Compliance & Audit AI Assistant',
      badge: 'Payroll Mode',
      color: 'from-emerald-600 to-teal-600',
      suggestions: [
        'Run Overtime Anomaly Audit for July Cycle',
        'Verify Tax & Benefit Deduction Remittances',
        'Draft Payslip Variance Explanation Report',
        'Recalculate NSSF & SHA Contributions',
      ],
    },
    dept_manager: {
      title: 'Team Management & Operations AI Assistant',
      badge: 'Manager Mode',
      color: 'from-amber-600 to-orange-600',
      suggestions: [
        'Summarize Team Attendance & Leave Schedule',
        'Draft Q3 Performance Goals for Engineering',
        'Recommend Shift Rostering Improvements',
        'Prepare Weekly Team Standup Brief',
      ],
    },
    employee: {
      title: 'Personal Self-Service AI Assistant',
      badge: 'Self-Service Mode',
      color: 'from-sky-600 to-indigo-600',
      suggestions: [
        'Check Remaining Annual Leave Balance',
        'Explain Tax Deductions on Latest Payslip',
        'Draft Leave Application Justification',
        'Find Company Medical Policy Guidelines',
      ],
    },
  }

  const currentContext = roleContextMap[activeRole] || roleContextMap.ceo

  const handleAskAi = (query) => {
    const queryText = query || promptInput
    if (!queryText.trim()) return

    setIsProcessing(true)
    setPromptInput(queryText)

    setTimeout(() => {
      setAiResponse({
        query: queryText,
        text: `Analysis complete for "${queryText}":\n\n• **Executive Summary**: All parameters evaluated within expected operational limits.\n• **Actionable Insight**: 2 potential optimization opportunities identified with high confidence.\n• **Recommended Step**: Proceed with standard departmental workflow or schedule automated rule trigger.`,
        timestamp: 'Just now',
      })
      setIsProcessing(false)
    }, 1200)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {currentContext.title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                {currentContext.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Context-aware intelligence tuned to your current role permissions
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          CONTEXTUAL PROMPT SUGGESTIONS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentContext.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAi(suggestion)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 transition-all text-left text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between group cursor-pointer"
            >
              <span className="line-clamp-1">{suggestion}</span>
              <ArrowRight
                size={14}
                className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="relative">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
          placeholder={`Ask ${currentContext.title} anything...`}
          className="w-full pl-4 pr-24 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => handleAskAi()}
          disabled={isProcessing}
          className="absolute right-2 top-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <>
              <Send size={13} />
              <span>Ask AI</span>
            </>
          )}
        </button>
      </div>

      {/* AI Output Result Box */}
      {aiResponse && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Bot size={14} /> AI Analysis
            </span>
            <span>{aiResponse.timestamp}</span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {aiResponse.text}
          </div>
        </div>
      )}
    </div>
  )
}
