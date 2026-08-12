import { useState } from 'react'
import {
  Calendar,
  Clock,
  Video,
  Users,
  FileText,
  CheckCircle2,
  Plus,
  Play,
  Pause,
  Volume2,
  List,
  CheckSquare,
  Sparkles,
  Award,
  ChevronRight,
  UserCheck,
} from 'lucide-react'

const INITIAL_MEETINGS = [
  {
    id: 'm-1',
    title: 'Executive Q3 Strategic Alignment & Budget Review',
    date: 'Today, Aug 3, 2026',
    time: '10:00 AM - 11:30 AM',
    organizer: 'Alex Vance (CEO)',
    room: 'Boardroom A & Virtual Link',
    status: 'Completed',
    agenda: [
      '1. Review Q2 financial results & margin performance',
      '2. Approve Q3 headcount hiring plan for Engineering & Sales',
      '3. Discuss enterprise digital workplace adoption metrics',
    ],
    minutes: 'Meeting started at 10:02 AM. Alex Vance presented Q2 financial report showing 18% YoY growth. Michael Chen confirmed budget reserve for 12 new engineering requisitions.',
    decisions: [
      'APPROVED: $250k budget allocation for v4.2 Cloud Infrastructure migration.',
      'RATIFIED: New flexible remote work policy effective August 15th.',
    ],
    actionItems: [
      { id: 'act-1', text: 'Draft updated remote work policy documentation', owner: 'Sarah Jenkins', due: 'Aug 5', completed: true },
      { id: 'act-2', text: 'Configure cloud server staging instances', owner: 'Elena Rostova', due: 'Aug 8', completed: false },
    ],
    attendance: [
      { name: 'Alex Vance', role: 'CEO', status: 'Present' },
      { name: 'Sarah Jenkins', role: 'HR Director', status: 'Present' },
      { name: 'Michael Chen', role: 'Finance Lead', status: 'Present' },
      { name: 'Elena Rostova', role: 'ICT Lead', status: 'Present' },
    ],
    recordingUrl: 'https://cdn.staffroom.demo/recordings/q3-exec-sync.mp4',
    recordingDuration: '1h 14m 20s',
  },
  {
    id: 'm-2',
    title: 'Department Leads Weekly Operational Sync',
    date: 'Tomorrow, Aug 4, 2026',
    time: '2:00 PM - 3:00 PM',
    organizer: 'Sarah Jenkins (HR)',
    room: 'Conference Room 3B',
    status: 'Upcoming',
    agenda: [
      '1. Cross-department SLA review',
      '2. Employee retention initiatives',
    ],
    minutes: 'Pending meeting start.',
    decisions: [],
    actionItems: [],
    attendance: [
      { name: 'Sarah Jenkins', role: 'HR Director', status: 'Confirmed' },
      { name: 'David Kim', role: 'Transport Lead', status: 'Confirmed' },
    ],
    recordingUrl: null,
  },
]

export default function MeetingHub() {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS)
  const [activeMeeting, setActiveMeeting] = useState(INITIAL_MEETINGS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [newActionText, setNewActionText] = useState('')
  const [actionOwner, setActionOwner] = useState('Sarah Jenkins')
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleToggleAction = (actionId) => {
    if (!activeMeeting) return
    const updatedActions = activeMeeting.actionItems.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a)
    const updated = { ...activeMeeting, actionItems: updatedActions }
    setActiveMeeting(updated)
    setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  const handleAddAction = () => {
    if (!newActionText.trim() || !activeMeeting) return
    const newAct = {
      id: `act-${Date.now()}`,
      text: newActionText,
      owner: actionOwner,
      due: 'Aug 10',
      completed: false,
    }
    const updated = { ...activeMeeting, actionItems: [...activeMeeting.actionItems, newAct] }
    setActiveMeeting(updated)
    setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m))
    setNewActionText('')
    showToast('Action item assigned & converted to System Task!')
  }

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" /> {toastMsg}
        </div>
      )}

      {/* Meeting Hub Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="text-indigo-600 dark:text-indigo-400" size={24} /> Enterprise Meeting Hub & Minutes
          </h1>
          <p className="text-xs text-slate-500">Agendas, live collaborative minutes, decision tracking, recordings, and automated follow-up task dispatching.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer">
          <Plus size={16} /> Schedule New Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Meeting List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Meetings Schedule</h3>

          <div className="space-y-2">
            {meetings.map(m => {
              const isSelected = activeMeeting?.id === m.id
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMeeting(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.time}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                  <p className="text-[11px] text-slate-500">{m.date} • {m.room}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Meeting Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {activeMeeting ? (
            <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
              {/* Meeting Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-900 dark:text-white">{activeMeeting.title}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {activeMeeting.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span>📅 {activeMeeting.date}</span>
                  <span>⏰ {activeMeeting.time}</span>
                  <span>📍 {activeMeeting.room}</span>
                </p>
              </div>

              {/* Recording Simulator Player */}
              {activeMeeting.recordingUrl && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Video size={14} /> Cloud Meeting Video Recording
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeMeeting.recordingDuration}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center cursor-pointer text-white shrink-0"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className={`bg-indigo-400 h-full rounded-full transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-0'}`}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{isPlaying ? '24:15' : '00:00'}</span>
                        <span>{activeMeeting.recordingDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agenda & Formal Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                    <List size={14} className="text-indigo-600" /> Agenda Items
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    {activeMeeting.agenda.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <Award size={14} /> Ratified Decisions
                  </h3>
                  <div className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1.5">
                    {activeMeeting.decisions.length === 0 ? (
                      <p className="italic text-slate-400">No formal decisions logged yet.</p>
                    ) : (
                      activeMeeting.decisions.map((dec, i) => (
                        <p key={i} className="font-semibold">{dec}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Items & Task Dispatcher */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <CheckSquare size={14} className="text-indigo-600" /> Action Items & Follow-up Tasks ({activeMeeting.actionItems.length})
                </h3>

                <div className="space-y-2">
                  {activeMeeting.actionItems.map(act => (
                    <div key={act.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleAction(act.id)} className="cursor-pointer text-slate-400 hover:text-emerald-500">
                          {act.completed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-md border-2 border-slate-300"></div>}
                        </button>
                        <span className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${act.completed ? 'line-through text-slate-400' : ''}`}>
                          {act.text}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">Assigned: {act.owner} (Due {act.due})</span>
                    </div>
                  ))}
                </div>

                {/* Add Action Item Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    placeholder="Add new action item from meeting..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <select
                    value={actionOwner}
                    onChange={(e) => setActionOwner(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Michael Chen">Michael Chen</option>
                  </select>
                  <button
                    onClick={handleAddAction}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shrink-0"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a meeting from the schedule list.</div>
          )}
        </div>
      </div>
    </div>
  )
}
