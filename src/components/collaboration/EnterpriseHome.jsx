import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Calendar,
  Bell,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  UserCheck,
  FileText,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  Zap,
  CheckSquare,
  AlertCircle,
  Video,
  MapPin,
  Building,
  ChevronRight,
  Megaphone,
  User,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react'
import { formatDateTime, timeAgo } from '@/lib/format'

const INITIAL_PRIORITIES = [
  { id: 'p1', title: 'Review Q3 Engineering Hiring Budget Request', category: 'Approvals', priority: 'HIGH', due: '11:30 AM', completed: false, owner: 'Finance Team' },
  { id: 'p2', title: 'Approve Elena Rostova 5-Day Leave Application', category: 'Leave', priority: 'HIGH', due: '12:00 PM', completed: false, owner: 'HR Operations' },
  { id: 'p3', title: 'Submit Monthly Transport Route Audit Log', category: 'Operations', priority: 'MEDIUM', due: '3:00 PM', completed: false, owner: 'Transport Dept' },
  { id: 'p4', title: 'Publish Updated Remote Work Security Policy', category: 'Governance', priority: 'MEDIUM', due: '5:00 PM', completed: true, owner: 'Security Office' },
]

const INITIAL_TASKS = [
  { id: 't1', title: 'Conduct 90-day probation evaluation for Lucas Vance', due: 'Today', project: 'Talent Mgmt', status: 'In Progress' },
  { id: 't2', title: 'Verify July tax withholding filings with tax authority', due: 'Aug 5', project: 'Payroll', status: 'Pending' },
  { id: 't3', title: 'Finalize SLA metrics for Help Desk Q3 reporting', due: 'Aug 6', project: 'ICT Support', status: 'Pending' },
  { id: 't4', title: 'Review cybersecurity vulnerability patch report', due: 'Aug 8', project: 'Security', status: 'Completed' },
]

const INITIAL_MEETINGS = [
  { id: 'm1', title: 'Executive Operations Sync', time: '10:00 AM - 10:45 AM', room: 'Boardroom A / Virtual', organizer: 'Alex Vance (CEO)', attendees: 8, link: 'https://meet.staffroom.demo/exec-sync' },
  { id: 'm2', title: 'Department Leads Q3 Alignment', time: '2:00 PM - 3:00 PM', room: 'Conference Room 3B', organizer: 'Sarah Jenkins (HR)', attendees: 12, link: 'https://meet.staffroom.demo/dept-leads' },
  { id: 'm3', title: 'Transport Dispatch Security Review', time: '4:15 PM - 5:00 PM', room: 'Virtual Channel #ops', organizer: 'Operations Lead', attendees: 5, link: 'https://meet.staffroom.demo/trans-ops' },
]

const INITIAL_BOOKMARKS = [
  { id: 'b1', title: 'Employee Handbook 2026 (v4.2)', type: 'Policy', url: '/documents', views: 420 },
  { id: 'b2', title: 'Standard Operating Procedure: Emergency Transport Dispatch', type: 'SOP', url: '/documents', views: 185 },
  { id: 'b3', title: 'Q3 Department KPI & OKR Tracker', type: 'Dashboard', url: '/analytics', views: 310 },
  { id: 'b4', title: 'IT Service Desk SLA & Escalation Matrix', type: 'Wiki', url: '/help-desk', views: 95 },
]

export default function EnterpriseHome({ profile, onNavigateTab }) {
  const [workStatus, setWorkStatus] = useState({
    code: 'AVAILABLE',
    label: 'Available',
    color: 'emerald',
    icon: '🟢',
    note: 'Working on Q3 Strategic Plan',
  })
  const [statusModal, setStatusModal] = useState(false)
  const [customNote, setCustomNote] = useState(workStatus.note)
  const [priorities, setPriorities] = useState(INITIAL_PRIORITIES)
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [refreshingAi, setRefreshingAi] = useState(false)

  const STATUS_OPTIONS = [
    { code: 'AVAILABLE', label: 'Available', color: 'emerald', icon: '🟢' },
    { code: 'BUSY', label: 'Busy', color: 'amber', icon: '🔴' },
    { code: 'IN_MEETING', label: 'In Meeting', color: 'blue', icon: '📅' },
    { code: 'REMOTE', label: 'Working Remotely', color: 'indigo', icon: '🏠' },
    { code: 'TRAVELLING', label: 'Travelling', color: 'purple', icon: '✈️' },
    { code: 'ON_LEAVE', label: 'On Leave', color: 'rose', icon: '🌴' },
    { code: 'DND', label: 'Do Not Disturb', color: 'slate', icon: '⛔' },
  ]

  const togglePriority = (id) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, completed: !p.completed } : p))
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t))
  }

  const handleUpdateStatus = (opt) => {
    setWorkStatus({ ...opt, note: customNote })
    setStatusModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Daily Briefing Header */}
      <div className="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-400" /> AI Executive Morning Briefing
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good morning, {profile?.full_name || 'Staff Member'} 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              You have <strong className="text-indigo-200">2 pending approvals</strong> requiring your sign-off today, <strong className="text-indigo-200">3 meetings scheduled</strong>, and 4 high-priority tasks. All enterprise systems are operational at 99.98% uptime.
            </p>
          </div>

          {/* Work Status Widget */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/70 shrink-0 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Work Status</span>
              <button
                onClick={() => setStatusModal(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
              >
                Change Status
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{workStatus.icon}</span>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {workStatus.label}
                  <span className="text-xs text-slate-400 font-normal">({workStatus.code})</span>
                </p>
                <p className="text-xs text-slate-300 italic truncate max-w-[200px]">"{workStatus.note}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Start Chat', icon: MessageSquare, action: () => onNavigateTab?.('messaging'), color: 'indigo' },
          { label: 'Schedule Meeting', icon: Calendar, action: () => onNavigateTab?.('meetings'), color: 'blue' },
          { label: 'Post Notice', icon: Megaphone, action: () => onNavigateTab?.('announcements'), color: 'purple' },
          { label: 'Create Task', icon: CheckSquare, action: () => onNavigateTab?.('tasks'), color: 'emerald' },
          { label: 'Shared Doc', icon: FileText, action: () => onNavigateTab?.('docs'), color: 'amber' },
          { label: 'Team Spaces', icon: Building, action: () => onNavigateTab?.('team_spaces'), color: 'rose' },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <button
              key={idx}
              onClick={item.action}
              className="card p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Icon size={18} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid Layout: Priorities & Tasks vs Meetings & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Priorities & Tasks */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Priorities */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Flame size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Key Priorities</h2>
                  <p className="text-xs text-slate-500">Critical items requiring immediate execution today</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full">
                {priorities.filter(p => !p.completed).length} Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {priorities.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => togglePriority(item.id)}
                      className="mt-0.5 cursor-pointer text-slate-400 hover:text-indigo-600"
                    >
                      {item.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <div className="w-4 h-4 rounded-md border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </button>
                    <div className="min-w-0 space-y-0.5">
                      <p className={`text-sm font-bold text-slate-900 dark:text-white truncate ${item.completed ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                        <span>•</span>
                        <span>Due {item.due}</span>
                        <span>•</span>
                        <span className="text-slate-400">Assigned: {item.owner}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.priority === 'HIGH'
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/60'
                        : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Assigned Tasks */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">My Action Tasks</h2>
                  <p className="text-xs text-slate-500">Cross-department deliverables & personal workflow items</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab?.('tasks')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Task Board <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map(t => (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => toggleTask(t.id)} className="cursor-pointer text-slate-400 hover:text-emerald-500">
                      {t.status === 'Completed' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-md border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </button>
                    <span className={`text-sm font-semibold text-slate-800 dark:text-slate-200 truncate ${t.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                      {t.project}
                    </span>
                    <span className="text-slate-500">{t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Meetings & Bookmarks */}
        <div className="space-y-6">

          {/* Today's Meetings & Calendar */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Meetings Today</h2>
              </div>
              <button
                onClick={() => onNavigateTab?.('meetings')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Meeting Hub
              </button>
            </div>

            <div className="space-y-3">
              {INITIAL_MEETINGS.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{m.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {m.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> {m.room}</p>
                    <p className="flex items-center gap-1.5"><User size={12} className="text-slate-400" /> Organizer: {m.organizer}</p>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{m.attendees} Attendees</span>
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                    >
                      <Video size={12} /> Join Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks & Quick Documents */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bookmark size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Starred Resources</h2>
            </div>

            <div className="space-y-2">
              {INITIAL_BOOKMARKS.map(b => (
                <a
                  key={b.id}
                  href={b.url}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex items-center justify-between gap-3 block group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {b.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">{b.type} • {b.views} Reads</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Change Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Set Your Workplace Availability Status</h3>
            <p className="text-xs text-slate-500">Your status will be visible across chat, team spaces, and directory.</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => handleUpdateStatus(opt)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    workStatus.code === opt.code
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span>{opt.icon}</span> {opt.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400">[{opt.code}]</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom Status Message</label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. In Q3 Planning Session until 2pm"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
