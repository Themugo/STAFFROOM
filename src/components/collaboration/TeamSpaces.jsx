import { useState } from 'react'
import {
  Building2,
  Users,
  Folder,
  FileText,
  Megaphone,
  CheckSquare,
  Calendar,
  BookOpen,
  BarChart3,
  LayoutDashboard,
  Plus,
  Upload,
  Download,
  Share2,
  Star,
  Pin,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
} from 'lucide-react'

const TEAM_SPACES = [
  { id: 'hr', name: 'HR & People Operations', lead: 'Sarah Jenkins', members: 14, icon: '👥', color: 'indigo', category: 'Human Resources' },
  { id: 'finance', name: 'Finance & Accounts', lead: 'Michael Chen', members: 9, icon: '💳', color: 'emerald', category: 'Finance' },
  { id: 'ict', name: 'ICT & Infrastructure', lead: 'Elena Rostova', members: 18, icon: '💻', color: 'blue', category: 'Technology' },
  { id: 'ops', name: 'Operations & Logistics', lead: 'Marcus Vance', members: 24, icon: '⚙️', color: 'amber', category: 'Operations' },
  { id: 'transport', name: 'Transport & Fleet', lead: 'David Kim', members: 12, icon: '🚚', color: 'purple', category: 'Logistics' },
  { id: 'security', name: 'Security & Governance', lead: 'Lucas Vance', members: 8, icon: '🛡️', color: 'rose', category: 'Compliance' },
  { id: 'marketing', name: 'Marketing & Brand', lead: 'Emma Watson', members: 10, icon: '📢', color: 'pink', category: 'Growth' },
  { id: 'projects', name: 'Special PMO Projects', lead: 'Alex Vance', members: 30, icon: '🚀', color: 'cyan', category: 'Executive' },
  { id: 'exec', name: 'Executive Leadership Office', lead: 'Alex Vance (CEO)', members: 6, icon: '🏛️', color: 'slate', category: 'Leadership' },
]

const SAMPLE_WIKI = [
  { id: 'w1', title: 'Onboarding SOP for New Hires (v4)', updatedBy: 'Sarah Jenkins', date: '2026-07-28', reads: 142 },
  { id: 'w2', title: 'Monthly Budget Reconciliation Protocol', updatedBy: 'Michael Chen', date: '2026-07-30', reads: 88 },
  { id: 'w3', title: 'VPN & Cybersecurity Access Matrix', updatedBy: 'Elena Rostova', date: '2026-07-31', reads: 215 },
]

const SAMPLE_FILES = [
  { id: 'f1', name: 'Q3_Department_Budget_Allocation.xlsx', size: '2.4 MB', author: 'Michael Chen', date: '2026-07-29' },
  { id: 'f2', name: 'StaffRoom_Security_Compliance_Report.pdf', size: '1.8 MB', author: 'Lucas Vance', date: '2026-07-31' },
  { id: 'f3', name: 'Operations_Fleet_Maintenance_Log.csv', size: '512 KB', author: 'David Kim', date: '2026-07-25' },
]

export default function TeamSpaces() {
  const [selectedSpace, setSelectedSpace] = useState(TEAM_SPACES[0])
  const [activeSubTab, setActiveSubTab] = useState('files')
  const [search, setSearch] = useState('')

  const subTabs = [
    { id: 'files', label: 'Shared Files', icon: Folder },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'tasks', label: 'Space Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'wiki', label: 'Wiki & SOPs', icon: BookOpen },
    { id: 'reports', label: 'Department Reports', icon: BarChart3 },
    { id: 'dashboards', label: 'Pinned Dashboards', icon: LayoutDashboard },
  ]

  return (
    <div className="space-y-6">
      {/* Spaces Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="text-indigo-600 dark:text-indigo-400" size={24} /> Team & Department Workspaces
            </h1>
            <p className="text-xs text-slate-500">Collaborative departmental spaces with shared documents, wiki SOPs, calendars, and task boards.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer self-start md:self-auto">
            <Plus size={16} /> Create Custom Team Space
          </button>
        </div>

        {/* Space Selection Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-2">
          {TEAM_SPACES.map(space => {
            const isSelected = selectedSpace.id === space.id
            return (
              <button
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span className="text-2xl">{space.icon}</span>
                <span className={`text-[11px] font-bold truncate max-w-full ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {space.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{space.members} members</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Space Workspace View */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
        {/* Workspace Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-100 via-indigo-50/40 to-slate-100 dark:from-slate-800 dark:via-indigo-950/30 dark:to-slate-800 border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl shadow-xs">
              {selectedSpace.icon}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {selectedSpace.name}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {selectedSpace.category}
                </span>
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-3">
                <span>Lead: <strong className="text-slate-700 dark:text-slate-300">{selectedSpace.lead}</strong></span>
                <span>•</span>
                <span>{selectedSpace.members} Active Members</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1">
              <Users size={14} /> Member Directory
            </button>
            <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer inline-flex items-center gap-1">
              <Upload size={14} /> Upload File
            </button>
          </div>
        </div>

        {/* Space Sub Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {subTabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* SubTab Views */}
        {activeSubTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Shared Space Files ({SAMPLE_FILES.length})</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {SAMPLE_FILES.map(file => (
                <div key={file.id} className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      DOC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{file.name}</p>
                      <p className="text-[11px] text-slate-400">{file.size} • Uploaded by {file.author} on {file.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      <Download size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'wiki' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Wiki & Standard Operating Procedures (SOPs)</h3>
              <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer">
                + New Wiki Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_WIKI.map(wiki => (
                <div key={wiki.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 hover:border-indigo-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      OFFICIAL SOP
                    </span>
                    <span className="text-[10px] text-slate-400">{wiki.reads} views</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{wiki.title}</h4>
                  <p className="text-[11px] text-slate-500">Last modified by {wiki.updatedBy} ({wiki.date})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab !== 'files' && activeSubTab !== 'wiki' && (
          <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Zap className="mx-auto text-indigo-500" size={32} />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{activeSubTab} Workspace Module Active</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Real-time synchronization enabled for {selectedSpace.name}. Connected to enterprise governance rules & automatic logging.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
