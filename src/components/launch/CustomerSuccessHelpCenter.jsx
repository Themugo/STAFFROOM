import { useState } from 'react'
import {
  BookOpen, HelpCircle, MessageSquare, Send, Sparkles, CheckCircle2,
  FileText, Search, ExternalLink, LifeBuoy, ShieldAlert, Award, ThumbsUp
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const FAQS = [
  {
    q: 'How does StaffRoom enforce multi-tenant security and data isolation?',
    a: 'StaffRoom uses strict organizational schema isolation and tenant key encryption (AES-256). Every query is validated at the application and database gateway level using ABAC (Attribute-Based Access Control).'
  },
  {
    q: 'Can custom workflow automations connect with external tools?',
    a: 'Yes, using the Developer Platform module, you can register outgoing Webhooks, trigger REST/GraphQL API hooks, or use native connectors for Slack, Microsoft Teams, Jira, and Google Workspace.'
  },
  {
    q: 'How does the automated Payroll compliance calculation work?',
    a: 'StaffRoom includes pre-built tax engines for over 40 global jurisdictions. Tax brackets, social security deductions, and overtime rules are automatically updated via compliance feeds.'
  },
  {
    q: 'What accessibility standards are implemented across the platform?',
    a: 'All views conform strictly to WCAG 2.2 AA standards, with complete ARIA labels, high-contrast themes, focus rings, keyboard navigation shortcuts, and screen-reader optimizations.'
  }
]

export default function CustomerSuccessHelpCenter() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [searchTerm, setSearchTerm] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState('Feature Request')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitFeedback = (e) => {
    e.preventDefault()
    if (!feedbackText.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFeedbackText('')
      showSuccess('Thank you! Your feedback has been sent directly to the StaffRoom Product Team.')
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="card p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl space-y-4 shadow-lg border border-indigo-800">
        <div className="flex items-center gap-3">
          <LifeBuoy className="w-6 h-6 text-indigo-400" />
          <h2 className="text-lg font-black tracking-tight">StaffRoom Customer Success & Support Portal</h2>
        </div>
        <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
          Access comprehensive guides, technical documentation, system status, release notes, or submit direct feedback to our dedicated engineering and support teams.
        </p>

        <div className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation, FAQs, API specs, or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl bg-white/10 text-white placeholder-indigo-300 border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FAQs & Knowledge Base (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Frequently Asked Enterprise Questions
            </h3>

            <div className="space-y-3 text-xs">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">{faq.q}</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Latest System Release Notes (v3.0.0 GA)
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
                  <span>v3.0.0 — Production General Availability Release</span>
                  <span className="text-[10px] font-mono">July 2026</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                  Includes Developer Platform APIs, Workflow Automation Engine, Security & Compliance Hub, and complete WCAG 2.2 AA accessibility optimizations.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Feedback & Direct Support Ticket (1 col) */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" /> Executive Feedback & Support
          </h3>

          <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Feedback Category</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Feature Request">Feature Request</option>
                <option value="UX Improvement">UX / Design Improvement</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Security Inquiry">Security & Compliance Inquiry</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Details & Context</label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts or describe an issue..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !feedbackText.trim()}
              className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={14} />
              {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>

          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 text-[11px] space-y-1">
            <span className="font-bold block">Enterprise SLA Guarantee</span>
            <p>24/7 Dedicated Support with 15-minute response time for Priority 1 issues.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
