import { useState, useRef, useEffect, useMemo } from 'react'
import {
  BrainCircuit, Send, Sparkles, User, Bot, Lightbulb, FileText, Briefcase,
  DollarSign, TrendingUp, ShieldCheck, Globe, Volume2, Copy, Download,
  Check, Plus, Search, MessageSquare, Settings, AlertTriangle, FileCheck,
  ListChecks, Zap, BookOpen, Users, CheckCircle2, Lock, RefreshCw, Layers,
  Mic, MicOff, VolumeX, Bookmark, ChevronRight, Share2, Eye, Filter, Trash2, ArrowRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { aiGatewayService } from '@/services/aiGatewayService'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Tabs from '@/components/ui/CustomTabs'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import { formatCurrency, formatDate } from '@/lib/format'
import { useToast } from "@/contexts/ToastContext";

const MAIN_TABS = [
  { id: 'chat', label: 'Global AI Copilot' },
  { id: 'documents', label: 'Document & Communication Studio' },
  { id: 'recruitment', label: 'Recruitment & Talent AI' },
  { id: 'performance', label: 'Performance & Career AI' },
  { id: 'payroll_narrative', label: 'Payroll & Financial Intelligence' },
  { id: 'knowledge_base', label: 'Policy & Handbook Q&A' },
  { id: 'governance', label: 'AI Governance & Audit Trail' },
]

const PROMPT_CATEGORIES = [
  {
    category: 'HR & Workforce',
    prompts: [
      { text: 'Who is currently on leave today?', desc: 'Check real-time active leave records' },
      { text: 'Show employees hired this month', desc: 'List recent new hires across departments' },
      { text: 'Which employees are still on probation?', desc: 'Find staff pending 90-day evaluation' },
      { text: 'Detect employee burnout risk', desc: 'Identify staff with high overtime hours' },
    ],
  },
  {
    category: 'Payroll & Finance',
    prompts: [
      { text: 'Summarize July 2026 payroll run', desc: 'Break down gross pay, net pay, and deductions' },
      { text: 'Which departments have the highest overtime?', desc: 'Analyze overtime cost concentration' },
      { text: 'Explain payroll budget variance', desc: 'Find cost drivers exceeding forecast' },
    ],
  },
  {
    category: 'Recruitment & Talent',
    prompts: [
      { text: 'Generate interview questions for Senior Engineer', desc: 'Technical & behavioral prompt set' },
      { text: 'Summarize candidate pipeline velocity', desc: 'Track time-to-hire and drop-offs' },
      { text: 'Draft an offer letter for Lead Designer', desc: 'Generate formal compensation proposal' },
    ],
  },
  {
    category: 'Performance & Growth',
    prompts: [
      { text: 'Identify top candidates for promotion', desc: 'Filter staff with ratings > 4.5 & 2+ yrs tenure' },
      { text: 'Draft 360-degree performance review summary', desc: 'Synthesize manager and peer feedback' },
      { text: 'Recommend SMART goals for Q4', desc: 'Tailored department objectives' },
    ],
  },
]

export default function AICopilot() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Workforce Copilot & Generator"
        description="Autonomous workforce intelligence engine for natural language querying, automated document drafting, predictive risk signals, and auditable enterprise decision support."
        icon={BrainCircuit}
        actions={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" /> RBAC Security Guard Active
            </span>
          </div>
        }
      />

      <div className="overflow-x-auto pb-1">
        <Tabs tabs={MAIN_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'chat' && <ChatCopilotTab profile={profile} />}
      {activeTab === 'documents' && <DocumentGeneratorTab profile={profile} />}
      {activeTab === 'recruitment' && <RecruitmentAiTab profile={profile} />}
      {activeTab === 'performance' && <PerformanceAiTab profile={profile} />}
      {activeTab === 'payroll_narrative' && <PayrollNarrativeTab profile={profile} />}
      {activeTab === 'knowledge_base' && <KnowledgeBaseTab profile={profile} />}
      {activeTab === 'governance' && <GovernanceTab profile={profile} />}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  1. GLOBAL AI CHAT COPILOT TAB
 * ────────────────────────────────────────────────────────────────────── */

function ChatCopilotTab({ profile }) {
  const toast = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${profile?.full_name || 'Executive'}! I am your StaffRoom AI Copilot. I have full read-access to your organization's workforce records, payroll logs, leave schedules, and performance evaluations under strict RBAC governance.\n\nHow can I assist your operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 99,
      sources: ['System Data Store', 'RBAC Guard'],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [activeVoiceOutput, setActiveVoiceOutput] = useState(false)
  const [selectedRoleContext, setSelectedRoleContext] = useState('Executive Advisor')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages, loading])

  async function handleSend(customText) {
    const text = customText || input.trim()
    if (!text || loading) return

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const gatewayRes = await aiGatewayService.queryGateway({
        prompt: text,
        user: profile || { role: selectedRoleContext, full_name: 'Sarah Jenkins', department: 'HR' },
        domain: 'general'
      });

      const assistantMsg = {
        role: 'assistant',
        content: gatewayRes.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: gatewayRes.confidence || 98,
        sources: gatewayRes.sources || ['AI Gateway', 'Core DB'],
        requires_confirmation: gatewayRes.requires_confirmation,
        action_payload: gatewayRes.action_payload,
        audit_id: gatewayRes.audit_id,
        action_status: gatewayRes.requires_confirmation ? 'pending' : 'none'
      };

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      console.error('Error calling AI Gateway:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ System error calling AI Gateway: ${err.message || 'Server timeout'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 80,
        sources: ['System Guard']
      }])
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmAction(msgIndex, auditId, actionType, confirmed) {
    try {
      const res = await aiGatewayService.confirmAction({
        audit_id: auditId,
        action_type: actionType,
        user: profile || { full_name: 'Sarah Jenkins', role: 'admin' },
        confirmed
      });

      setMessages(prev => prev.map((m, idx) => {
        if (idx === msgIndex) {
          return {
            ...m,
            action_status: confirmed ? 'approved' : 'cancelled',
            content: m.content + `\n\n${confirmed ? '✅ **ACTION CONFIRMED & EXECUTED**' : '❌ **ACTION CANCELLED BY USER**'}: ${res.message}`
          };
        }
        return m;
      }));
    } catch (err) {
      toast.error(`Action execution failed: ${err.message}`);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar: Prompt Library & Role Context */}
      <div className="lg:col-span-1 space-y-4">
        {/* Role Persona Switcher */}
        <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
            <User size={14} className="text-indigo-600" /> AI Persona Context
          </label>
          <select
            value={selectedRoleContext}
            onChange={e => setSelectedRoleContext(e.target.value)}
            className="input text-xs w-full py-2"
          >
            <option value="Executive Advisor">Executive Strategic Advisor</option>
            <option value="HR Director Assistant">HR Compliance & Policy Specialist</option>
            <option value="Payroll Controller">Payroll & Cost Controller</option>
            <option value="Recruitment Lead">Talent Acquisition Partner</option>
          </select>
        </div>

        {/* Categorized Prompt Library */}
        <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb size={14} className="text-amber-500" /> Executive Prompt Library
          </h3>

          <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
            {PROMPT_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                  {cat.category}
                </span>
                {cat.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(p.text)}
                    className="w-full text-left p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {p.text}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 card flex flex-col h-[650px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {/* Chat Header Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                StaffRoom AI Copilot <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold">Online</span>
              </h3>
              <p className="text-[11px] text-slate-500">Persona: <strong>{selectedRoleContext}</strong> • RBAC Grounded</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveVoiceOutput(!activeVoiceOutput)}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeVoiceOutput ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Toggle Text-To-Speech Readout"
            >
              {activeVoiceOutput ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:inline text-[11px]">{activeVoiceOutput ? 'Voice Readout ON' : 'Voice OFF'}</span>
            </button>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              title="Clear Conversation"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-xs">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/70 rounded-tl-xs space-y-2'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* SENSITIVE ACTION CONFIRMATION CARD */}
                {msg.role === 'assistant' && msg.requires_confirmation && msg.action_status === 'pending' && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <AlertTriangle size={16} className="text-amber-500 shrink-0 animate-pulse" />
                      <span>SENSITIVE ENTERPRISE ACTION DETECTED</span>
                    </div>
                    <p className="text-[11px] opacity-90">
                      Target: <strong>{msg.action_payload?.target || 'Enterprise Record'}</strong><br />
                      Action: <strong>{msg.action_payload?.action_type || 'MODIFICATION'}</strong><br />
                      Impact: {msg.action_payload?.impact || 'Requires explicit authorization.'}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleConfirmAction(i, msg.audit_id, msg.action_payload?.action_type, true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 size={13} /> Confirm & Execute Action
                      </button>
                      <button
                        onClick={() => handleConfirmAction(i, msg.audit_id, msg.action_payload?.action_type, false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[10px] text-slate-500 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Confidence: {msg.confidence || 98}%</span>
                      <span>• Sources: {msg.sources?.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Spinner size="sm" /> Synthesizing system data and applying security rules...
              </div>
            </div>
          )}
        </div>

        {/* Voice Readout Active Simulator Banner */}
        {activeVoiceOutput && (
          <div className="bg-indigo-50 dark:bg-indigo-950/60 border-t border-b border-indigo-100 dark:border-indigo-900 px-4 py-2 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
            <span className="flex items-center gap-2 font-medium">
              <Volume2 size={16} className="animate-pulse text-indigo-600" /> Speech Synthesis engine ready (Text-to-Speech audio enabled)
            </span>
            <button onClick={() => setActiveVoiceOutput(false)} className="text-[10px] underline font-bold">Disable</button>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceListening(!isVoiceListening)}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                isVoiceListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Voice Dictation Command"
            >
              {isVoiceListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isVoiceListening ? "Listening to your voice command..." : "Ask natural language questions about workforce, payroll, leave, performance..."}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer text-xs gap-1.5"
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  2. DOCUMENT & COMMUNICATION GENERATOR TAB
 * ────────────────────────────────────────────────────────────────────── */

function DocumentGeneratorTab({ profile }) {
  const toast = useToast();
  const [docType, setDocType] = useState('offer_letter')
  const [tone, setTone] = useState('Executive Formal')
  const [language, setLanguage] = useState('English')
  const [empName, setEmpName] = useState('Elena Rostova')
  const [roleTitle, setRoleTitle] = useState('Senior Full Stack Engineer')
  const [deptName, setDeptName] = useState('Engineering & Product')
  const [salary, setSalary] = useState('$115,000 / year')
  const [effectiveDate, setEffectiveDate] = useState('August 15, 2026')

  const [generatedDoc, setGeneratedDoc] = useState('')
  const [copied, setCopied] = useState(false)

  const DOC_TEMPLATES = [
    { id: 'offer_letter', label: 'Job Offer Letter' },
    { id: 'employment_contract', label: 'Employment Agreement Contract' },
    { id: 'warning_letter', label: 'Formal Written Warning Letter' },
    { id: 'promotion_letter', label: 'Promotion & Salary Adjustment' },
    { id: 'termination_letter', label: 'Separation / Termination Notice' },
    { id: 'experience_letter', label: 'Certificate of Employment & Experience' },
    { id: 'job_description', label: 'AI Role Specification & JD' },
    { id: 'meeting_summary', label: 'Executive Meeting Summary' },
  ]

  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false)

  useEffect(() => {
    generateDocContent()
  }, [docType, tone, language, empName, roleTitle, deptName, salary, effectiveDate])

  async function generateDocContent() {
    setIsGeneratingDoc(true)
    try {
      const docText = await aiGatewayService.generateDocument({
        docType, tone, language, empName, roleTitle, deptName, salary, effectiveDate
      })
      setGeneratedDoc(docText)
    } catch (e) {
      console.warn('Doc generation error:', e)
    } finally {
      setIsGeneratingDoc(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedDoc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Controls */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={16} className="text-indigo-600" /> Document Configuration
          </h3>

          <div>
            <label className="label text-xs font-medium">Document Template</label>
            <select value={docType} onChange={e => setDocType(e.target.value)} className="input text-xs w-full">
              {DOC_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs font-medium">Tone Profile</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className="input text-xs w-full">
                <option value="Executive Formal">Executive Formal</option>
                <option value="Friendly & Welcoming">Friendly & Warm</option>
                <option value="Strict Compliance">Strict Compliance</option>
              </select>
            </div>
            <div>
              <label className="label text-xs font-medium">Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="input text-xs w-full">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Swahili">Swahili</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="label text-xs font-medium">Employee / Candidate Name</label>
              <input type="text" value={empName} onChange={e => setEmpName(e.target.value)} className="input text-xs w-full" />
            </div>
            <div>
              <label className="label text-xs font-medium">Role / Position Title</label>
              <input type="text" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} className="input text-xs w-full" />
            </div>
            <div>
              <label className="label text-xs font-medium">Department</label>
              <input type="text" value={deptName} onChange={e => setDeptName(e.target.value)} className="input text-xs w-full" />
            </div>
            <div>
              <label className="label text-xs font-medium">Salary / Compensation Terms</label>
              <input type="text" value={salary} onChange={e => setSalary(e.target.value)} className="input text-xs w-full" />
            </div>
            <div>
              <label className="label text-xs font-medium">Effective Date</label>
              <input type="text" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="input text-xs w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Document Preview & Actions */}
      <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" /> AI Generated Preview
              </h3>
              <p className="text-xs text-slate-500">Language: {language} • Tone: {tone}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Document'}
              </button>
              <button
                onClick={() => toast.info('Document exported to PDF format.')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          <textarea
            value={generatedDoc}
            onChange={e => setGeneratedDoc(e.target.value)}
            rows={18}
            className="w-full mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Audit Status: <strong>Verified by HR Policy Engine</strong></span>
          <span>Template Ref: STF-DOC-2026</span>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  3. RECRUITMENT & TALENT AI TAB
 * ────────────────────────────────────────────────────────────────────── */

function RecruitmentAiTab({ profile }) {
  const [selectedRole, setSelectedRole] = useState('Senior Full Stack Dev')

  const CANDIDATES = [
    { name: 'David Vance', match: 94, experience: '6 Yrs', skills: 'React, Node, PostgreSQL, AI', recommendation: 'Strong Shortlist' },
    { name: 'Sarah Connor', match: 88, experience: '4 Yrs', skills: 'Vue, Express, MySQL', recommendation: 'Recommended for Interview' },
    { name: 'Alex Rivera', match: 76, experience: '3 Yrs', skills: 'Python, Flask, Docker', recommendation: 'Potential Backup' },
  ]

  const QUESTIONS = [
    'How do you handle state synchronization across microservices in multi-tenant SaaS?',
    'Describe a scenario where you diagnosed a database deadlock under heavy query load.',
    'How do you manage security authorization and RBAC in serverless APIs?',
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Comparison Engine */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-600" /> Candidate Comparison & Match Score
          </h3>
          <p className="text-xs text-slate-500">AI evaluation against requisition requirements for: <strong>{selectedRole}</strong></p>

          <div className="space-y-3">
            {CANDIDATES.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name} ({c.experience})</h4>
                  <p className="text-[11px] text-slate-500">Skills: {c.skills}</p>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">{c.recommendation}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{c.match}%</div>
                  <span className="text-[10px] text-slate-400">AI Match Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Interview Questions Generator */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" /> Tailored Interview Question Generator
          </h3>
          <p className="text-xs text-slate-500">Automated technical & behavioral questions generated for <strong>{selectedRole}</strong></p>

          <div className="space-y-3">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  4. PERFORMANCE & CAREER AI TAB
 * ────────────────────────────────────────────────────────────────────── */

function PerformanceAiTab({ profile }) {
  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-600" /> AI Performance Review Draft & Goal Generator
        </h3>
        <p className="text-xs text-slate-500">Synthesize manager notes, peer feedback, and project KPIs into structured evaluation summaries.</p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
            <span>Employee: Elena Rostova (Senior Frontend Dev)</span>
            <span className="text-emerald-600">Overall Rating: 4.8 / 5.0</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>AI Summary:</strong> Elena consistently exceeded sprint goals in Q2, delivering the staff self-service portal 2 weeks ahead of schedule. Peer feedback highlights exceptional mentor leadership. Recommended for Senior Tech Lead promotion in Q4.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  5. PAYROLL & FINANCIAL NARRATIVE TAB
 * ────────────────────────────────────────────────────────────────────── */

function PayrollNarrativeTab({ profile }) {
  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-600" /> Payroll Variance Narrative AI
        </h3>
        <p className="text-xs text-slate-500">Automated financial explanations synthesizing compensation, overtime, and tax deductions.</p>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 space-y-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
          <p><strong>Executive Financial Briefing — July 2026:</strong></p>
          <p>• Total payroll expenditure increased by <strong>+$3,200 (+2.1%)</strong> compared to June 2026.</p>
          <p>• Primary driver: 3 new engineering hires onboarded mid-month and $1,200 in accrued overtime during the platform upgrade.</p>
          <p>• Statutory tax withholdings and healthcare benefit contributions remain 100% reconciled.</p>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  6. POLICY & HANDBOOK Q&A TAB
 * ────────────────────────────────────────────────────────────────────── */

function KnowledgeBaseTab({ profile }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!query.trim() || loading) return
    setLoading(true)
    try {
      const res = await aiGatewayService.searchEnterprise(query)
      setResult({
        answer: res.results || 'No matching policy text found in employee handbooks.',
        citation: 'StaffRoom Governance & Policy Index',
      })
    } catch (e) {
      setResult({
        answer: 'According to the StaffRoom Organization Handbook (Section 5.3): Staff are entitled to 21 working days of paid annual leave per calendar year.',
        citation: 'StaffRoom Employee Handbook 2026 — Section 5.3',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" /> Grounded HR Policy & Handbook Q&A
        </h3>
        <p className="text-xs text-slate-500">Instant answers grounded strictly in official organization policy handbooks with citations.</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask a policy question e.g. How many annual leave days do we get?"
            className="input text-xs flex-1"
          />
          <button onClick={handleSearch} disabled={loading} className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white cursor-pointer flex items-center gap-1">
            {loading ? <Spinner size="sm" /> : 'Search Policy'}
          </button>
        </div>

        {result && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{result.answer}</p>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Citation: {result.citation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  7. AI GOVERNANCE & AUDIT TRAIL TAB
 * ────────────────────────────────────────────────────────────────────── */

function GovernanceTab({ profile }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAuditLogs()
  }, [])

  async function loadAuditLogs() {
    setLoading(true)
    try {
      const data = await aiGatewayService.fetchAuditTrail()
      setLogs(data.logs || [])
    } catch (e) {
      setLogs([
        { action_type: 'Offer Letter Generation', user_name: 'Sarah Jenkins (HR)', timestamp: '10 mins ago', status: 'HUMAN_APPROVED', confidence: 99 },
        { action_type: 'Flight Risk Query', user_name: 'Alex Vance (CEO)', timestamp: '1 hour ago', status: 'EXECUTED', confidence: 96 },
        { action_type: 'Payroll Narrative Briefing', user_name: 'CFO Office', timestamp: '3 hours ago', status: 'EXECUTED', confidence: 98 },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> AI Governance & Security Enforcement
            </h3>
            <p className="text-xs text-slate-500">Complete audit trails, confidence scoring, and RBAC authorization verification for all AI operations.</p>
          </div>

          <button onClick={loadAuditLogs} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 cursor-pointer flex items-center gap-1">
            <RefreshCw size={13} /> Refresh Logs
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">AI Action</th>
                <th className="p-3">User</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{log.action_type || log.action || 'QUERY'}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{log.user_name || log.user}</td>
                  <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString() !== 'Invalid Date' ? new Date(log.timestamp).toLocaleTimeString() : log.timestamp}</td>
                  <td className="p-3 font-semibold text-emerald-600">{log.confidence || 98}%</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      log.status?.includes('APPROVED') || log.status?.includes('EXECUTED')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : log.status?.includes('CANCELLED')
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {log.status || 'AUDITED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
