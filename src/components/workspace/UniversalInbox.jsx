import React, { useState } from 'react'
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  MessageSquare,
  Sparkles,
  Filter,
  Search,
  Check,
  X,
  ArrowRight,
  MoreVertical,
  Bell,
  Star,
  Zap,
  Tag,
  ShieldAlert
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function UniversalInbox({ onCountChange }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const [inboxItems, setInboxItems] = useState([
    {
      id: 'item-1',
      title: 'Annual Leave Request: Alex Rivera',
      subtitle: '5 Business Days requested starting Aug 10, 2026',
      type: 'Approval',
      category: 'Leave',
      priority: 'High',
      timestamp: '10 mins ago',
      read: false,
      starred: true,
      sender: 'Alex Rivera (Engineering)',
      actionRequired: 'Leave Sign-off',
      linkTo: 'Leave',
      details:
        'Alex has submitted an annual leave application for 5 consecutive business days. Team coverage has been verified by the department lead.',
    },
    {
      id: 'item-2',
      title: 'Payroll Variance Anomaly Alert',
      subtitle: '+4.5% overtime anomaly detected in Engineering department',
      type: 'Alert',
      category: 'Finance',
      priority: 'Urgent',
      timestamp: '25 mins ago',
      read: false,
      starred: false,
      sender: 'Payroll AI Intelligence',
      actionRequired: 'Review Overtime Log',
      linkTo: 'Payroll',
      details:
        'Automated payroll audit flagged a 4.5% increase in shift overtime compared to last month. Review timecards before final disbursement.',
    },
    {
      id: 'item-3',
      title: 'Q3 Performance Review Due: Marcus Vance',
      subtitle: '90-day probation review pending final evaluation rating',
      type: 'Task',
      category: 'HR',
      priority: 'Medium',
      timestamp: '2 hours ago',
      read: false,
      starred: true,
      sender: 'People Operations',
      actionRequired: 'Submit Appraisal',
      linkTo: 'Performance',
      details:
        'Marcus Vance has completed 90 days in the Senior Architect role. Self-assessment and peer reviews are ready for review.',
    },
    {
      id: 'item-4',
      title: 'Mentioned in Procurement PO #8920',
      subtitle: '@Sarah Johnson tagged you in PO approval discussion',
      type: 'Mention',
      category: 'Procurement',
      priority: 'Medium',
      timestamp: '4 hours ago',
      read: true,
      starred: false,
      sender: 'Sarah Johnson (Procurement)',
      actionRequired: 'Reply in PO',
      linkTo: 'Procurement',
      details:
        'Please confirm if the hardware budget allocation for the server upgrade includes freight insurance fees.',
    },
    {
      id: 'item-5',
      title: 'AI Recommendation: Optimize Transport Fleet Routes',
      subtitle: 'Consolidating Nairobi-Thika routes will save ~$1,200/month',
      type: 'AI Suggestion',
      category: 'Operations',
      priority: 'Low',
      timestamp: '1 day ago',
      read: true,
      starred: false,
      sender: 'StaffRoom AI Engine',
      actionRequired: 'Apply Route AI',
      linkTo: 'TransportManagement',
      details:
        'Vehicle telemetry shows 3 overlapping transport runs during peak morning hours. Consolidating into 2 larger shuttles increases seat efficiency by 28%.',
    },
    {
      id: 'item-6',
      title: 'Vehicle Servicing Due: KCB 402B (Toyota HiAce)',
      subtitle: 'Maintenance interval reached 15,000 km threshold',
      type: 'Alert',
      category: 'Fleet',
      priority: 'Medium',
      timestamp: '1 day ago',
      read: true,
      starred: false,
      sender: 'Fleet Telemetry',
      actionRequired: 'Schedule Maintenance',
      linkTo: 'TransportManagement',
      details:
        'Vehicle KCB 402B has passed its maintenance service interval. Schedule garage inspection to maintain warranty coverage.',
    },
  ])

  // Filter items
  const filteredItems = inboxItems.filter((item) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Approvals' && item.type === 'Approval') ||
      (activeFilter === 'Alerts' && item.type === 'Alert') ||
      (activeFilter === 'Tasks' && item.type === 'Task') ||
      (activeFilter === 'Mentions' && item.type === 'Mention') ||
      (activeFilter === 'AI' && item.type === 'AI Suggestion') ||
      (activeFilter === 'Unread' && !item.read) ||
      (activeFilter === 'Starred' && item.starred)

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = inboxItems.filter((i) => !i.read).length

  const handleToggleStar = (id, e) => {
    e.stopPropagation()
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item))
    )
  }

  const handleMarkAsRead = (id) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    )
  }

  const handleMarkAllRead = () => {
    setInboxItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleRemove = (id, e) => {
    if (e) e.stopPropagation()
    setInboxItems((prev) => prev.filter((item) => item.id !== id))
    if (selectedItem?.id === id) setSelectedItem(null)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[580px]">
      {/* LEFT COLUMN: LIST & FILTERS */}
      <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Inbox size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  Universal Inbox
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Approvals, Mentions, Alerts & AI Briefings
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications & approvals..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
            {['All', 'Unread', 'Approvals', 'Alerts', 'Tasks', 'Mentions', 'AI', 'Starred'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter}
                {filter === 'Unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[9px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Item List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[460px] flex-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500/80" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All Caught Up!</p>
              <p className="mt-1 text-[11px]">No pending inbox items match your search or filter.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item)
                    handleMarkAsRead(item.id)
                  }}
                  className={`p-4 transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : item.read
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      : 'bg-indigo-50/20 dark:bg-indigo-950/10 font-medium hover:bg-indigo-50/40'
                  }`}
                >
                  {/* Star Toggle */}
                  <button
                    onClick={(e) => handleToggleStar(item.id, e)}
                    className={`mt-0.5 text-slate-300 hover:text-amber-400 cursor-pointer transition-colors ${
                      item.starred ? 'text-amber-400' : ''
                    }`}
                  >
                    <Star size={15} fill={item.starred ? 'currentColor' : 'none'} />
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {item.category} • {item.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>

                    <h4
                      className={`text-xs leading-snug truncate ${
                        !item.read
                          ? 'font-black text-slate-900 dark:text-white'
                          : 'font-semibold text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.subtitle}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                          item.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : item.priority === 'High'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.priority} Priority
                      </span>

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL VIEW */}
      <div className="w-full lg:w-7/12 p-6 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/50">
        {selectedItem ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Top Meta Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                      {selectedItem.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                      {selectedItem.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Sender: <strong className="text-slate-800 dark:text-slate-200">{selectedItem.sender}</strong> • {selectedItem.timestamp}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(selectedItem.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  title="Dismiss notification"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Details */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Details & Context
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedItem.details}
                </p>
              </div>

              {/* Context Action Box */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                  <Zap size={14} />
                  <span>Suggested Quick Resolution</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You can execute this action directly or jump into the full module workflow.
                </p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleRemove(selectedItem.id)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 cursor-pointer transition-colors"
              >
                Dismiss & Archive
              </button>

              <Link
                to={createPageUrl(selectedItem.linkTo)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>{selectedItem.actionRequired}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8 space-y-3">
            <Inbox size={48} className="text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Select an Inbox Item
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Choose any notification, pending approval, or AI recommendation from the list to review details and take immediate action.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
