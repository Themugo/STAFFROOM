import React, { useState } from 'react'
import { useAutomation } from '@/contexts/AutomationContext'
import { Sparkles, Send, Zap, ArrowRight, Bot, CheckCircle2 } from 'lucide-react'

export default function AIAutomationAssistantTab({ onNotify, onEditFlow }) {
  const { addFlow } = useAutomation()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFlow, setGeneratedFlow] = useState(null)

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedFlow(null)

    setTimeout(() => {
      const generated = {
        name: `AI Flow: ${prompt.slice(0, 35)}...`,
        category: 'AI Auto-Generated',
        trigger: 'Custom Event Trigger',
        description: `Generated from prompt: "${prompt}"`,
        nodes: [
          { id: 'n1', type: 'trigger', label: 'Trigger: Event Detected', detail: 'Smart Parser' },
          { id: 'n2', type: 'condition', label: 'Condition: Evaluate AI Threshold', detail: 'IF Confidence >= 85%' },
          { id: 'n3', type: 'ai_action', label: 'AI Action: Execute Logic & Summarize', detail: 'Gemini 1.5 Flash' },
          { id: 'n4', type: 'action', label: 'Action: Send Notification & Sync Database', detail: 'Multi-Channel Push' }
        ]
      }

      setIsGenerating(false)
      setGeneratedFlow(generated)
      if (onNotify) onNotify('AI Flow Architect generated new automation!')
    }, 1500)
  }

  const handleActivate = () => {
    if (!generatedFlow) return
    const created = addFlow(generatedFlow)
    if (onNotify) onNotify(`Activated Flow: ${created.name}`)
    if (onEditFlow) onEditFlow(created)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-cyan-400" />
          <h2 className="text-lg font-black">AI Automation Architect & Flow Generator</h2>
        </div>

        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Describe any enterprise process in plain natural language (e.g., "When a vehicle mileage reaches 10k km, generate a PO, notify mechanic, and send fuel voucher"). The AI Assistant will construct the complete visual trigger-condition-action graph.
        </p>

        <form onSubmit={handleGenerate} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. When expense > $1,000 is submitted, request CFO approval via WhatsApp and post to Slack..."
            className="flex-1 p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 font-bold text-white rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-2"
          >
            {isGenerating ? (
              'Architecting...'
            ) : (
              <>
                <Sparkles size={16} /> Generate Flow
              </>
            )}
          </button>
        </form>
      </div>

      {generatedFlow && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Generated Visual Node Hierarchy
            </span>

            <button
              onClick={handleActivate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs cursor-pointer flex items-center gap-1.5 shadow"
            >
              Open in Visual Editor <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            {generatedFlow.nodes.map((node, i) => (
              <div
                key={node.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <span className="text-[9px] uppercase font-bold text-slate-400">Step 0{i + 1}</span>
                <strong className="block text-slate-900 dark:text-white font-bold leading-tight">
                  {node.label}
                </strong>
                <span className="text-[10px] text-slate-500 block">{node.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
