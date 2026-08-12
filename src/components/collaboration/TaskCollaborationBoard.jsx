import { useState } from 'react'
import {
  CheckSquare,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  ChevronRight,
  Sparkles,
  Link2,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Users,
  Tag,
  Search,
} from 'lucide-react'

const INITIAL_BOARD_TASKS = [
  {
    id: 'tb-1',
    title: 'Migrate HR Operations database schema to v4.2',
    status: 'In Progress',
    priority: 'HIGH',
    assignee: 'Elena Rostova',
    coOwners: ['Michael Chen'],
    dueDate: '2026-08-05',
    progress: 65,
    dependencies: ['tb-0'],
    checklist: [
      { text: 'Run DDL schema migrations', done: true },
      { text: 'Verify data integrity index', done: true },
      { text: 'Conduct staging test suite', done: false },
    ],
    knowledgeLink: 'SOP-2026-DB-01: Data Retention Rules',
  },
  {
    id: 'tb-2',
    title: 'Audit Executive Governance & Audit Trail Compliance',
    status: 'To Do',
    priority: 'HIGH',
    assignee: 'Lucas Vance',
    coOwners: ['Sarah Jenkins'],
    dueDate: '2026-08-08',
    progress: 20,
    dependencies: [],
    checklist: [
      { text: 'Export Q2 audit log records', done: true },
      { text: 'Generate security risk summary', done: false },
    ],
    knowledgeLink: 'POL-2026-SEC: Enterprise Compliance Framework',
  },
  {
    id: 'tb-3',
    title: 'Finalize Q3 Transport Fleet Dispatch Schedule',
    status: 'In Review',
    priority: 'MEDIUM',
    assignee: 'David Kim',
    coOwners: [],
    dueDate: '2026-08-04',
    progress: 90,
    dependencies: [],
    checklist: [
      { text: 'Check driver shift availability', done: true },
      { text: 'Verify fuel card limits', done: true },
    ],
    knowledgeLink: 'SOP-FLEET-04: Transport Dispatching',
  },
  {
    id: 'tb-4',
    title: 'Update General Office Fire & Emergency Evacuation Plan',
    status: 'Done',
    priority: 'LOW',
    assignee: 'Sarah Jenkins',
    coOwners: ['Marcus Vance'],
    dueDate: '2026-08-01',
    progress: 100,
    dependencies: [],
    checklist: [
      { text: 'Print evacuation maps for all floors', done: true },
      { text: 'Broadcast notice to staff', done: true },
    ],
    knowledgeLink: 'EMERGENCY-GUIDE-2026',
  },
]

export default function TaskCollaborationBoard() {
  const [tasks, setTasks] = useState(INITIAL_BOARD_TASKS)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list' | 'timeline' | 'calendar'
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTaskModal, setNewTaskModal] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [assignee, setAssignee] = useState('Sarah Jenkins')
  const [dueDate, setDueDate] = useState('2026-08-10')

  const columns = ['To Do', 'In Progress', 'In Review', 'Done']

  const handleMoveStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextProgress = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 50 : newStatus === 'In Review' ? 80 : 0
        return { ...t, status: newStatus, progress: nextProgress }
      }
      return t
    }))
  }

  const handleToggleChecklist = (taskId, index) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedList = t.checklist.map((c, i) => i === index ? { ...c, done: !c.done } : c)
        const doneCount = updatedList.filter(c => c.done).length
        const nextProgress = Math.round((doneCount / updatedList.length) * 100)
        return { ...t, checklist: updatedList, progress: nextProgress }
      }
      return t
    }))
  }

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return
    const newTask = {
      id: `tb-${Date.now()}`,
      title: taskTitle,
      status: 'To Do',
      priority: 'MEDIUM',
      assignee: assignee,
      coOwners: [],
      dueDate: dueDate,
      progress: 0,
      dependencies: [],
      checklist: [{ text: 'Initial scoping', done: false }],
      knowledgeLink: 'AUTO-LINK: Related SOP available',
    }
    setTasks([...tasks, newTask])
    setTaskTitle('')
    setNewTaskModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Board Header & View Switcher */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="text-indigo-600 dark:text-indigo-400" size={24} /> Collaborative Task Boards
          </h1>
          <p className="text-xs text-slate-500">Multi-view task tracking with dependencies, co-owners, progress checklists, and knowledge linking.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
              { id: 'list', label: 'List', icon: List },
              { id: 'timeline', label: 'Timeline', icon: BarChart2 },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            ].map(v => {
              const Icon = v.icon
              const isActive = viewMode === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Icon size={14} /> {v.label}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setNewTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col)
            return (
              <div key={col} className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 min-h-[400px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {col} ({colTasks.length})
                  </span>
                  <button onClick={() => setNewTaskModal(true)} className="text-slate-400 hover:text-indigo-600 cursor-pointer">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all shadow-xs space-y-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Due {task.dueDate}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{task.title}</h4>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Checklist Progress</span>
                          <span className="font-mono">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                      </div>

                      {/* Knowledge Link Badge */}
                      {task.knowledgeLink && (
                        <div className="p-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/40 text-[10px] text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 truncate">
                          <Link2 size={12} className="shrink-0" />
                          <span className="truncate">{task.knowledgeLink}</span>
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {task.assignee}
                        </span>

                        {/* Quick Status Shift buttons */}
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {col !== 'Done' && (
                            <button
                              onClick={() => handleMoveStatus(task.id, col === 'To Do' ? 'In Progress' : col === 'In Progress' ? 'In Review' : 'Done')}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-[10px] font-bold cursor-pointer"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="p-3">Task Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assignee</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => setSelectedTask(t)}>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{t.title}</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold">{t.status}</span></td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700">{t.priority}</span></td>
                  <td className="p-3 font-medium">{t.assignee}</td>
                  <td className="p-3 font-mono text-slate-500">{t.dueDate}</td>
                  <td className="p-3 font-mono font-bold">{t.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TIMELINE / CALENDAR FALLBACK */}
      {(viewMode === 'timeline' || viewMode === 'calendar') && (
        <div className="card p-12 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CalendarIcon size={36} className="mx-auto text-indigo-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">{viewMode} View Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Interactive Gantt timeline & calendar schedule synchronized across all enterprise department workspaces.
          </p>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-700">{selectedTask.status}</span>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedTask.title}</h3>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Sub-task Checklist</h4>
              <div className="space-y-1.5">
                {selectedTask.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklist(selectedTask.id, idx)}
                      className="rounded-xs text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={item.done ? 'line-through text-slate-400' : ''}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/50 text-xs text-indigo-800 dark:text-indigo-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5"><Sparkles size={14} /> Knowledge Base Surface:</p>
              <p>{selectedTask.knowledgeLink}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Audit Q3 Security Credentials"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assignee</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins (HR)</option>
                  <option value="Elena Rostova">Elena Rostova (ICT Lead)</option>
                  <option value="Michael Chen">Michael Chen (Finance)</option>
                  <option value="David Kim">David Kim (Transport)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setNewTaskModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button onClick={handleCreateTask} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer hover:bg-indigo-700">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
