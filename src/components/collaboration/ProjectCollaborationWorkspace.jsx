import { useState } from 'react'
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  Users,
  FileText,
  ShieldAlert,
  BarChart2,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

const PROJECTS = [
  {
    id: 'proj-1',
    name: 'Cloud Infrastructure v4.2 Migration',
    code: 'PRJ-2026-01',
    health: 'On Track',
    owner: 'Elena Rostova',
    progress: 75,
    dueDate: 'Sep 30, 2026',
    members: 12,
    risks: [
      { id: 'r-1', title: 'DB Replication lag during high traffic peak', impact: 'HIGH', likelihood: 'MEDIUM', status: 'Mitigated' },
    ],
    milestones: [
      { title: 'Staging Environment Setup', due: 'Jul 15', done: true },
      { title: 'Data Pipeline Migration', due: 'Aug 10', done: false },
      { title: 'Production Cutover', due: 'Sep 30', done: false },
    ],
  },
  {
    id: 'proj-2',
    name: 'Global HR Digital Policy Harmonization',
    code: 'PRJ-2026-04',
    health: 'At Risk',
    owner: 'Sarah Jenkins',
    progress: 40,
    dueDate: 'Aug 25, 2026',
    members: 8,
    risks: [
      { id: 'r-2', title: 'Regional labor union compliance sign-off delay', impact: 'HIGH', likelihood: 'HIGH', status: 'Active' },
    ],
    milestones: [
      { title: 'Draft Policy Standardization', due: 'Jul 20', done: true },
      { title: 'Union Legal Review', due: 'Aug 05', done: false },
    ],
  },
]

export default function ProjectCollaborationWorkspace() {
  const [projects, setProjects] = useState(PROJECTS)
  const [activeProject, setActiveProject] = useState(PROJECTS[0])
  const [activeSubTab, setActiveSubTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="text-indigo-600 dark:text-indigo-400" size={24} /> Project Collaboration Hub
          </h1>
          <p className="text-xs text-slate-500">Cross-functional project management, milestone roadmaps, risk matrices, and AI health predictions.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer">
          <Plus size={16} /> New Enterprise Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Project Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Active Projects ({projects.length})</h3>

          <div className="space-y-2">
            {projects.map(p => {
              const isSelected = activeProject?.id === p.id
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-xs' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{p.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.health === 'On Track' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {p.health}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Project Detail View (8 cols) */}
        <div className="lg:col-span-8">
          {activeProject ? (
            <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-900 dark:text-white">{activeProject.name}</h2>
                  <span className="text-xs font-mono font-bold text-slate-400">{activeProject.code}</span>
                </div>
                <p className="text-xs text-slate-500">Project Lead: <strong>{activeProject.owner}</strong> • Target Date: <strong>{activeProject.dueDate}</strong> • {activeProject.members} Members</p>
              </div>

              {/* Milestones Roadmap */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Milestone Roadmap</h3>
                <div className="space-y-2">
                  {activeProject.milestones.map((m, i) => (
                    <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className={m.done ? 'text-emerald-500' : 'text-slate-300'} />
                        <span className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${m.done ? 'line-through text-slate-400' : ''}`}>{m.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Target: {m.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Log */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-rose-500" /> Active Risk Register
                </h3>
                <div className="space-y-2">
                  {activeProject.risks.map(r => (
                    <div key={r.id} className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</p>
                        <p className="text-[10px] text-slate-500">Impact: {r.impact} | Likelihood: {r.likelihood}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a project to inspect workspace details.</div>
          )}
        </div>
      </div>
    </div>
  )
}
