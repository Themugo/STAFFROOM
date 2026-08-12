import React, { useState } from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Zap,
  BookOpen
} from 'lucide-react'

export default function AIKnowledgeAssistantTab({ onNotify }) {
  const { documents, addDocument } = useKnowledge()

  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your StaffRoom Enterprise Knowledge Copilot. Ask me any question about organization policies, emergency SOPs, or travel allowances, or prompt me to draft a new SOP draft.",
      sources: ['DOC-SOP-001', 'DOC-POL-002']
    }
  ])
  const [isGenerating, setIsGenerating] = useState(false)

  // Outdated detection mock AI scan
  const outdatedDocs = documents.filter((d) => d.reviewDate < '2026-09-01')

  const handleSendQuery = () => {
    if (!query.trim()) return

    const userMsg = { sender: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    setQuery('')
    setIsGenerating(true)

    setTimeout(() => {
      let replyText = ''
      let sources = ['DOC-SOP-001']

      const qLower = query.toLowerCase()
      if (qLower.includes('procurement') || qLower.includes('emergency') || qLower.includes('expense')) {
        replyText = "According to Emergency Procurement SOP (DOC-SOP-001), emergency requisitions under KES 100,000 require Line Manager sign-off within 1 hour. Requisitions over KES 500,000 require CFO dual sign-off within 4 hours. Photo evidence must be attached within 48 hours."
        sources = ['DOC-SOP-001']
      } else if (qLower.includes('leave') || qLower.includes('handbook') || qLower.includes('carry forward')) {
        replyText = "As per the 2026 Employee Handbook (DOC-POL-002), staff are entitled to 21 days annual paid leave. Up to 5 unused leave days can be carried forward into the next financial year ending March 31st."
        sources = ['DOC-POL-002']
      } else if (qLower.includes('draft') || qLower.includes('sop') || qLower.includes('create')) {
        replyText = "AI Draft Created successfully! I have generated a candidate SOP draft with Purpose, Scope, Step-by-Step Approval Matrix, and Compliance Callouts. Click 'Save AI SOP' below to save it directly to the Finance & Ops space."
        sources = ['AI Generator']
      } else {
        replyText = `Based on your StaffRoom Knowledge Base, the requested governance guidelines require compliance approval. Refer to ${documents[0]?.title || 'our active policies'} for specific step-by-step procedures.`
        sources = [documents[0]?.id || 'DOC-SOP-001']
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          sources
        }
      ])
      setIsGenerating(false)
      if (onNotify) onNotify('Knowledge Assistant query answered')
    }, 1000)
  }

  const handleSaveAiDraft = () => {
    addDocument({
      title: 'AI Drafted SOP: Cloud Incident & Data Recovery',
      spaceId: 'SPC-IT',
      type: 'SOP',
      department: 'IT & Security',
      classification: 'Confidential',
      description: 'Auto-generated SOP for secondary database cluster promotion.',
      tags: ['AI-Draft', 'SOP', 'Cloud'],
      author: 'AI Knowledge Copilot',
      contentBlocks: [
        { type: 'heading', level: 1, text: '1. Executive Summary & Incident Scope' },
        { type: 'paragraph', text: 'This document defines rapid response failover protocols during multi-region latency spikes.' }
      ]
    })
    if (onNotify) onNotify('Saved AI Drafted SOP to Knowledge Repository!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* CHAT INTERFACE */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between min-h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600 animate-pulse" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              AI Semantic Knowledge Assistant
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Powered by Gemini 1.5 Pro
          </span>
        </div>

        {/* MESSAGES LIST */}
        <div className="space-y-4 overflow-y-auto max-h-[380px] p-2">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user'

            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="p-2 rounded-xl bg-indigo-600 text-white self-start">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-xl space-y-2 ${
                    isUser
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {!isUser && m.sources && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="text-slate-400 font-bold">CITED SOURCES:</span>
                      {m.sources.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                          {s}
                        </span>
                      ))}

                      {m.text.includes('AI Draft Created') && (
                        <button
                          onClick={handleSaveAiDraft}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold cursor-pointer hover:bg-emerald-500 ml-auto"
                        >
                          + Save AI SOP
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 self-start">
                    <User size={16} />
                  </div>
                )}
              </div>
            )
          })}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles size={14} className="animate-spin" /> Querying Enterprise Knowledge Graph...
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            placeholder="Ask anything or prompt 'Draft an SOP for remote onboarding'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
          />
          <button
            onClick={handleSendQuery}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl cursor-pointer text-xs flex items-center gap-1 shadow-md"
          >
            <Send size={14} /> Ask AI
          </button>
        </div>
      </div>

      {/* RIGHT SIDE AI INSIGHTS & OUTDATED POLICIES */}
      <div className="space-y-4">
        {/* OUTDATED POLICY SCANNER */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              AI Governance Alert: Review Required
            </h4>
          </div>

          <p className="text-[11px] text-slate-500">
            Automated compliance scanner identified documents nearing or past review dates.
          </p>

          <div className="space-y-2">
            {outdatedDocs.map((doc) => (
              <div key={doc.id} className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1 text-xs">
                <strong className="block font-bold text-amber-900 dark:text-amber-200 text-[11px] truncate">
                  {doc.title}
                </strong>
                <div className="flex justify-between items-center text-[10px] font-mono text-amber-700 dark:text-amber-300">
                  <span>Review Due: {doc.reviewDate}</span>
                  <span className="font-bold underline cursor-pointer">Notify Owner</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK PROMPTS */}
        <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-slate-700 shadow-sm space-y-3 text-xs">
          <strong className="font-bold text-indigo-900 dark:text-indigo-200 text-xs block">
            Suggested Knowledge Prompts:
          </strong>

          <div className="space-y-2 font-mono text-[11px]">
            <button
              onClick={() => setQuery("What is the maximum limit for emergency expense approval?")}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer font-bold truncate"
            >
              • Check Emergency Procurement Limits
            </button>
            <button
              onClick={() => setQuery("How many annual leave days can I carry forward?")}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer font-bold truncate"
            >
              • How many leave days carry forward?
            </button>
            <button
              onClick={() => setQuery("Draft an SOP for IT Server Maintenance and Patching")}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer font-bold truncate"
            >
              • Draft SOP for Server Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
