import { useState } from 'react'
import {
  Search,
  Filter,
  Users,
  MessageSquare,
  CheckSquare,
  FileText,
  Folder,
  Megaphone,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'

const MOCK_SEARCH_INDEX = [
  { id: '1', title: 'Sarah Jenkins', type: 'People', subtitle: 'HR Director • Human Resources', meta: 'New York HQ', icon: Users, url: '/communication' },
  { id: '2', title: 'Cloud Infrastructure v4.2 Migration', type: 'Projects', subtitle: 'Target: Sep 30, 2026 • Lead: Elena Rostova', meta: 'PRJ-2026-01', icon: Folder, url: '/communication' },
  { id: '3', title: 'Conduct 90-day probation review for Lucas Vance', type: 'Tasks', subtitle: 'Assigned to Sarah Jenkins • Due Aug 5', meta: 'HIGH Priority', icon: CheckSquare, url: '/communication' },
  { id: '4', title: 'StaffRoom Remote & Hybrid Work Policy 2026', type: 'Policies', subtitle: 'v2.4 Published • Approved by Executive Board', meta: 'Policy SOP', icon: FileText, url: '/documents' },
  { id: '5', title: 'Notice: System Maintenance Window on Sunday', type: 'Announcements', subtitle: 'Posted by ICT Support • Affected: All Systems', meta: 'Org Notice', icon: Megaphone, url: '/communication' },
  { id: '6', title: 'Q3 Department Financial Allocation Excel Sheet', type: 'Files', subtitle: 'Uploaded by Michael Chen • 2.4 MB', meta: 'Shared File', icon: FileText, url: '/communication' },
  { id: '7', title: 'Discussion: Transitioning HR Onboarding to E-Signatures', type: 'Chats', subtitle: '18 replies • Resolved by Legal', meta: 'Channel Thread', icon: MessageSquare, url: '/communication' },
]

export default function UnifiedEnterpriseSearch({ onSelectResult }) {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')

  const types = ['ALL', 'People', 'Projects', 'Tasks', 'Policies', 'Announcements', 'Files', 'Chats']

  const filteredResults = MOCK_SEARCH_INDEX.filter(item => {
    const matchType = selectedType === 'ALL' || item.type === selectedType
    const q = query.toLowerCase().trim()
    const matchQuery = !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    return matchType && matchQuery
  })

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-indigo-900/50">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Sparkles size={13} className="text-indigo-400" /> Enterprise Global Search Engine
          </span>
        </div>
        <h1 className="text-2xl font-black text-white">Unified Cross-Module Search</h1>
        <p className="text-xs text-slate-300">Search across people, chats, projects, tasks, policy handbooks, documents, and announcements instantly.</p>

        {/* Big Search Input */}
        <div className="relative pt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, staff names, tasks, SOP policies, files..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-indigo-500 focus:outline-hidden shadow-lg font-medium"
          />
          <Search size={22} className="absolute left-4 top-5 text-indigo-500" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1"><Filter size={14} /> Filter Entity:</span>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedType === t
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Search Results ({filteredResults.length})
        </h3>

        {filteredResults.map(res => {
          const Icon = res.icon
          return (
            <div
              key={res.id}
              onClick={() => onSelectResult?.(res)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{res.title}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{res.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{res.meta}</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
