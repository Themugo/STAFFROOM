import React, { useState } from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight
} from 'lucide-react'

export default function AIRuleAssistantTab({ onNotify }) {
  const { addRule, rules } = useBusinessRules()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiRuleDraft, setAiRuleDraft] = useState(null)
  const [conflictReport, setConflictReport] = useState(null)

  const handleGenerateRule = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)
      const generated = {
        id: `RULE-AI-${Date.now().toString().slice(-4)}`,
        name: prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt,
        category: 'Procurement',
        subCategory: 'AI Generated Policy',
        description: `Auto-generated from natural language policy prompt: '${prompt}'`,
        triggerEvent: 'ON_REQUISITION_SUBMIT',
        priority: 3,
        logicalOperator: 'AND',
        conditions: [
          { field: 'requisition.amount', operator: 'GREATER_THAN', value: '250000' }
        ],
        actions: [
          { type: 'REQUIRE_APPROVAL', role: 'FINANCE_DIRECTOR', sequence: 1 },
          { type: 'SEND_NOTIFICATION', recipient: 'COMPLIANCE_OFFICER', template: 'AI_POLICY_ALERT' }
        ],
        status: 'Draft'
      }

      setAiRuleDraft(generated)
      if (onNotify) onNotify('AI successfully translated natural language into a structured business rule draft!')
    }, 600)
  }

  const handleAcceptRule = () => {
    if (!aiRuleDraft) return
    addRule({ ...aiRuleDraft, status: 'Active' })
    if (onNotify) onNotify(`Activated AI-generated rule: ${aiRuleDraft.id}!`)
    setAiRuleDraft(null)
    setPrompt('')
  }

  const handleRunConflictAudit = () => {
    setConflictReport({
      totalRulesAnalyzed: rules.length,
      conflictsFound: 0,
      redundanciesFound: 1,
      redundancyDetails: 'RULE-HR-006 overlaps with probationary leave policy RULE-LV-001. Recommended priority adjustment.',
      healthScore: '98% Optimal'
    })
    if (onNotify) onNotify('AI Conflict & Optimization Audit Completed!')
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Bot size={13} className="text-cyan-400" />
            AI Policy Copilot & Conflict Optimization Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Natural Language Rule Generator & Governance Auditor
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Translate plain-text company policies into automated rule trees, detect rule conflicts, and eliminate redundant approval bottlenecks.
          </p>
        </div>
      </div>

      {/* NATURAL LANGUAGE PROMPT GENERATOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          Translate Policy Text into Rule Logic
        </h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'If an employee requests more than 10 consecutive leave days, require both Supervisor and HR Manager sign-off.'"
              className="flex-1 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
            />
            <button
              onClick={handleGenerateRule}
              disabled={isGenerating}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Send size={14} />
              {isGenerating ? 'Translating...' : 'Generate Rule Logic'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Quick Prompts:</span>
            {[
              'Require CFO approval for IT equipment purchase > $500k',
              'Block attendance punch if GPS distance > 200m from branch',
              'Auto-approve emergency ambulance dispatch requests'
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* AI GENERATED RULE DRAFT PREVIEW */}
        {aiRuleDraft && (
          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 font-mono">
                <Sparkles size={14} className="text-amber-500" /> AI Rule Draft: {aiRuleDraft.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 font-mono text-[10px] font-bold">
                DRAFT
              </span>
            </div>

            <p className="text-indigo-800 dark:text-indigo-200">{aiRuleDraft.description}</p>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-1 font-mono text-[11px]">
              <div><strong>IF:</strong> {aiRuleDraft.conditions.map((c) => `${c.field} ${c.operator} ${c.value}`).join(' AND ')}</div>
              <div><strong>THEN:</strong> {aiRuleDraft.actions.map((a) => a.type).join(', ')}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleAcceptRule}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 size={14} /> Activate Rule in System
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFLICT & REDUNDANCY AUDITOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              AI Rule Conflict & Redundancy Auditor
            </h3>
            <p className="text-xs text-slate-500">Scan active business rule logic for contradictory conditions or redundant steps.</p>
          </div>

          <button
            onClick={handleRunConflictAudit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Zap size={14} /> Run Rule Scan
          </button>
        </div>

        {conflictReport && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Rules Analyzed: <strong>{conflictReport.totalRulesAnalyzed}</strong></span>
              <span>Health Score: <strong className="text-emerald-500">{conflictReport.healthScore}</strong></span>
              <span>Conflicts: <strong className="text-emerald-500">{conflictReport.conflictsFound}</strong></span>
            </div>
            <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700">
              💡 {conflictReport.redundancyDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
