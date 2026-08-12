import { useState } from 'react'
import {
  Sparkles,
  Bot,
  BrainCircuit,
  MessageSquare,
  FileText,
  Languages,
  Zap,
  CheckCircle2,
  Users,
  Search,
  Copy,
  Check,
  Megaphone,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'

export default function AiCollaborationAssistant() {
  const [activeTool, setActiveTool] = useState('meeting_summary')
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const tools = [
    { id: 'meeting_summary', label: 'Meeting Summarizer', icon: FileText, desc: 'Summarize meeting transcripts into executive decisions & action items' },
    { id: 'discussion_summary', label: 'Thread Summarizer', icon: MessageSquare, desc: 'Condense long 50+ message channel discussions into 3 bullet points' },
    { id: 'translate', label: 'Message Translator', icon: Languages, desc: 'Translate collaboration messages across 10+ languages instantly' },
    { id: 'expert_finder', label: 'Expert Finder', icon: Users, desc: 'Find internal staff subject matter experts for any domain' },
    { id: 'announcement_writer', label: 'Announcement Writer', icon: Megaphone, desc: 'Draft executive announcements from brief notes' },
    { id: 'unanswered_detector', label: 'Unanswered Qs Detector', icon: HelpCircle, desc: 'Scan enterprise channels for unresolved employee questions' },
  ]

  const handleRunAi = () => {
    setLoading(true)
    setOutput(null)

    setTimeout(() => {
      if (activeTool === 'meeting_summary') {
        setOutput({
          title: 'Executive Summary & Key Takeaways',
          summary: 'The Q3 Strategic Alignment meeting ratified the $250k budget for cloud infrastructure migration. Engineering headcount expansion of 12 roles was approved.',
          actionItems: [
            'Sarah Jenkins: Publish updated remote work policy by Aug 5.',
            'Elena Rostova: Complete staging environment load test by Aug 8.',
            'Michael Chen: Disburse initial vendor cloud deposit.',
          ],
        })
      } else if (activeTool === 'discussion_summary') {
        setOutput({
          title: 'Condensed Discussion Summary',
          summary: 'Team consensus supports migrating HR onboarding e-signatures to StaffRoom native digital sign-offs. Legal confirmed audit compliance.',
          keyDecisions: ['Adopt IP-hashed timestamp audit log pattern.'],
        })
      } else if (activeTool === 'translate') {
        setOutput({
          title: 'Translated Output (French)',
          summary: 'La réunion d\'alignement stratégique du troisième trimestre a ratifié le budget de 250 000 $ pour la migration des infrastructures cloud.',
        })
      } else if (activeTool === 'expert_finder') {
        setOutput({
          title: 'Top Internal Subject Matter Experts',
          experts: [
            { name: 'Elena Rostova', role: 'ICT Lead', domain: 'Cloud Architecture & Disaster Recovery', match: '98%' },
            { name: 'Lucas Vance', role: 'Security Analyst', domain: 'Cybersecurity & OAuth 2.0 Auditing', match: '94%' },
            { name: 'Michael Chen', role: 'Finance Lead', domain: 'Payroll Tax Compliance', match: '91%' },
          ],
        })
      } else if (activeTool === 'announcement_writer') {
        setOutput({
          title: 'Draft Executive Broadcast Announcement',
          summary: `📢 ENTERPRISE ANNOUNCEMENT: Q3 DIGITAL WORKPLACE INITIATIVE\n\nDear StaffRoom Team,\n\nWe are pleased to announce the official launch of our Phase F3 Enterprise Digital Workplace. Effective today, all team collaboration, project tasks, and document reviews will be centralized within StaffRoom.\n\nThank you for your dedication to operational excellence!\n\nBest regards,\nExecutive Leadership`,
        })
      } else if (activeTool === 'unanswered_detector') {
        setOutput({
          title: 'Detected Unanswered Employee Questions',
          questions: [
            { question: 'When is the deadline for submitting July expense receipts?', channel: '#finance-general', askedBy: 'David Kim', timeAgo: '4 hours ago' },
            { question: 'Does the new transport policy cover weekend emergency call-outs?', channel: '#transport-ops', askedBy: 'Marcus Vance', timeAgo: '6 hours ago' },
          ],
        })
      }
      setLoading(false)
    }, 1000)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl space-y-2 border border-indigo-900/50">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Sparkles size={13} className="text-indigo-400" /> Enterprise AI Collaboration Assistant
          </span>
        </div>
        <h1 className="text-2xl font-black text-white">Generative Intelligence Suite</h1>
        <p className="text-xs text-slate-300">Summarize meetings, extract action items, translate channel discussions, write announcements, and locate internal experts.</p>
      </div>

      {/* Grid: Tools Selector vs Active AI Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Tools Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">AI Productivity Tools</h3>

          <div className="space-y-2">
            {tools.map(tool => {
              const Icon = tool.icon
              const isSelected = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setOutput(null); setInputText('') }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>{tool.label}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">{tool.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Workspace Canvas (8 cols) */}
        <div className="lg:col-span-8">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              {tools.find(t => t.id === activeTool)?.label}
            </h2>

            {/* Input Form */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {activeTool === 'expert_finder' ? 'Enter Domain or Skill Topic' : 'Input Raw Text / Notes / Prompt'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                placeholder={activeTool === 'expert_finder' ? 'e.g. Cloud Infrastructure Failover, Cybersecurity' : 'Paste text or leave blank for quick sample run...'}
                className="w-full p-3.5 rounded-2xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleRunAi}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Sparkles size={15} /> {loading ? 'Processing with AI...' : 'Generate with Enterprise AI'}
                </button>
              </div>
            </div>

            {/* AI Output Card */}
            {output && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900/60 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> {output.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(JSON.stringify(output))}
                    className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 cursor-pointer flex items-center gap-1"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {output.summary && (
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {output.summary}
                  </p>
                )}

                {output.actionItems && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase">Extracted Action Items</h4>
                    {output.actionItems.map((act, i) => (
                      <p key={i} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {act}
                      </p>
                    ))}
                  </div>
                )}

                {output.experts && (
                  <div className="space-y-2 pt-2">
                    {output.experts.map((exp, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{exp.name} ({exp.role})</p>
                          <p className="text-[11px] text-slate-400">Expertise: {exp.domain}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700">{exp.match} Match</span>
                      </div>
                    ))}
                  </div>
                )}

                {output.questions && (
                  <div className="space-y-2 pt-2">
                    {output.questions.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs space-y-1">
                        <p className="font-bold text-amber-900 dark:text-amber-200">"{q.question}"</p>
                        <p className="text-[10px] text-slate-500">Asked by {q.askedBy} in {q.channel} ({q.timeAgo})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
