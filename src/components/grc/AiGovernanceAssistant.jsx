import React, { useState } from 'react'
import {
  Bot, Sparkles, Send, FileText, Download, Copy,
  CheckCircle2, BookOpen, ShieldAlert, Zap
} from 'lucide-react'

const GRC_PROMPTS = [
  'Identify emerging risks across Mombasa transport logistics.',
  'Audit our compliance with KRA PAYE & SHIF regulations.',
  'Detect Segregation of Duties conflicts in Procurement.',
  'Summarize Q2 Internal Audit Findings for the Audit Committee.',
  'Recommend preventive controls for overtime cost inflation.'
]

export default function AiGovernanceAssistant() {
  const [query, setQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [response, setResponse] = useState(null)

  const handleAsk = (promptText) => {
    const q = promptText || query
    if (!q.trim()) return

    setQuery(q)
    setIsGenerating(true)
    setResponse(null)

    setTimeout(() => {
      setIsGenerating(false)
      setResponse({
        title: `AI Governance Advisory Analysis: "${q}"`,
        summary: 'Synthesized real-time governance telemetry from Risk Registers, Policy Libraries, Control Testing Logs, and Audit Papers.',
        recommendations: [
          'Enforce strict automated daily overtime caps in Mombasa Warehouse night shifts to mitigate RSK-FIN-02.',
          'Resolve the SoD alert on David K. by stripping payment authorization rights while maintaining vendor setup access.',
          'Verify that SHIF 2.75% formula matches official Gazetted gross salary definitions prior to August 9 submission deadline.',
          'Schedule an ISO 27001 mock surveillance audit focusing on biometric attendance database encryption.'
        ],
        boardBrief: `EXECUTIVE BOARD GRC ADVISORY STATEMENT (FY2026 Q3):
The enterprise GRC posture remains STRONG (Org Risk Score: 84.2/100, Compliance Index: 96.5%). Internal controls testing demonstrates 91.8% effectiveness across 142 controls. All statutory filing deadlines (KRA, SHIF, NSSF) are fully tracked with zero default penalties incurred. The Segregation of Duties engine has successfully mitigated 100% of critical toxic permission combinations.`
      })
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Bot size={13} className="text-amber-400 animate-pulse" /> AI Governance, Risk & Audit Assistant
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" /> AI Governance Copilot & Audit Briefing Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Conversational GRC AI assistant capable of detecting emerging risks, analyzing policy conflicts, recommending controls, and synthesizing board-ready audit reports.
            </p>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Sample Queries:</span>
          {GRC_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleAsk(p)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-amber-300 hover:bg-slate-700 cursor-pointer border border-slate-700 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Copilot about risks, controls, audit findings, or policy conflicts..."
            className="w-full px-4 py-3 text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isGenerating}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} /> Run AI Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Response */}
      {response && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> {response.title}
            </h3>

            <button className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1">
              <Download size={13} /> Export Board Brief
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">{response.summary}</p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">AI Prescriptive Action Items</h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              {response.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audit Committee Executive Brief Statement:</h4>
            <pre className="p-4 rounded-2xl bg-slate-950 text-amber-300 text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {response.boardBrief}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
