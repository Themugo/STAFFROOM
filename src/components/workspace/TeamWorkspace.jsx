import React, { useState } from 'react'
import {
  Users,
  Megaphone,
  Bookmark,
  Calendar,
  FileText,
  Pin,
  Plus,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

export default function TeamWorkspace() {
  const [teamBookmarks, setTeamBookmarks] = useState([
    { id: 1, title: 'Engineering Coding Standards & Guidelines', link: 'KnowledgeCenter', tag: 'Docs' },
    { id: 2, title: 'Q3 Product Roadmap & Deliverables', link: 'StrategyManagement', tag: 'Strategy' },
    { id: 3, title: 'Department Duty & Shift Roster', link: 'DutyRoster', tag: 'Operations' },
    { id: 4, title: 'Equipment & Hardware Requisition Form', link: 'Procurement', tag: 'Requisition' },
  ])

  const teamAnnouncements = [
    {
      id: 1,
      author: 'David Kim (Engineering Lead)',
      date: 'Aug 1, 2026',
      title: 'Q3 Sprint Planning Session Scheduled for Thursday 10:00 AM',
      body: 'Please make sure all feature tickets in the backlog are updated with estimation points before Wednesday evening.',
    },
    {
      id: 2,
      author: 'Sarah Johnson (People Ops)',
      date: 'Jul 28, 2026',
      title: 'New Health Insurance Wellness Perks & Telemedicine Access',
      body: 'Updated medical cover policy docs are now uploaded in the Policy Center. Check your self-service portal for details.',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Users size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Department Team Workspace
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shared team bookmarks, department announcements, and team resources
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer">
          <Plus size={15} /> Post Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TEAM ANNOUNCEMENTS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <Megaphone size={14} className="text-indigo-600" />
            <span>Team Announcements</span>
          </div>

          <div className="space-y-3">
            {teamAnnouncements.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.author}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PINNED TEAM BOOKMARKS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <Bookmark size={14} className="text-amber-500" />
              <span>Pinned Team Shortcuts & Docs</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {teamBookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-100/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Pin size={14} className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {bm.title}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                  {bm.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
