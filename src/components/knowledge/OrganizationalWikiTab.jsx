import React, { useState } from 'react'
import {
  BookOpen,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'

const INITIAL_FAQS = [
  {
    id: 'FAQ-01',
    category: 'HR & Payroll',
    question: 'How do I claim medical insurance outpatient expenses under the 2026 policy?',
    answer: 'Submit digitized invoices via StaffRoom Self-Service under Benefits -> Outpatient Reimbursements within 30 days of hospital visit. Claims under KES 20,000 are auto-approved in 48 hours.',
    likes: 124,
    tags: ['Medical', 'Insurance', 'Reimbursement']
  },
  {
    id: 'FAQ-02',
    category: 'IT & Cloud Access',
    question: 'What is the procedure if my multi-factor authentication (MFA) device is lost?',
    answer: 'Contact the IT Helpdesk via Slack #it-support or call Ext 4004. An engineer will issue a temporary 12-hour bypass passcode after secondary ID verification.',
    likes: 98,
    tags: ['IT', 'MFA', 'Security']
  },
  {
    id: 'FAQ-03',
    category: 'Finance & Travel',
    question: 'What are the per diem allowance rates for regional field assignments in East Africa?',
    answer: 'Per diem rates are defined in Policy DOC-SOP-001: USD 85/day for Tier 1 cities (Nairobi, Kampala, Dar es Salaam) and USD 60/day for secondary field sites.',
    likes: 156,
    tags: ['Travel', 'PerDiem', 'Finance']
  },
  {
    id: 'FAQ-04',
    category: 'Operations & Procurement',
    question: 'How do I request an emergency dispatch for field vehicle breakdowns?',
    answer: 'Open StaffRoom Transport Management -> Emergency Dispatch. Tag the ticket high priority to notify the regional logistics controller immediately.',
    likes: 82,
    tags: ['Transport', 'Emergency', 'Vehicle']
  }
]

export default function OrganizationalWikiTab({ onNotify }) {
  const [faqs, setFaqs] = useState(INITIAL_FAQS)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [expandedId, setExpandedId] = useState('FAQ-01')

  const categories = ['ALL', 'HR & Payroll', 'IT & Cloud Access', 'Finance & Travel', 'Operations & Procurement']

  const filtered = faqs.filter((f) => {
    const matchesCat = activeCategory === 'ALL' || f.category === activeCategory
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchesCat && matchesSearch
  })

  const handleLike = (id, e) => {
    e.stopPropagation()
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, likes: f.likes + 1 } : f))
    )
    if (onNotify) onNotify('Feedback recorded for Knowledge Article')
  }

  return (
    <div className="space-y-6">
      {/* HEADER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-600" />
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Organizational Wiki, FAQs & Lessons Learned
          </h3>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs, operational notes, or troubleshooting steps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
          />
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ ACCORDION LIST */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id

          return (
            <div
              key={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 shadow-sm transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                      {item.category}
                    </span>
                    <span className="text-slate-400">• {item.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {item.question}
                  </h4>
                </div>

                <div className="text-slate-400 p-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-medium">
                    {item.answer}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex gap-1">
                      {item.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold hover:bg-indigo-100"
                    >
                      <ThumbsUp size={13} /> {item.likes} Helpful
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
