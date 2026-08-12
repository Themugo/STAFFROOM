import React, { useState } from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  X,
  FileText,
  Sparkles,
  ListTodo
} from 'lucide-react'

export default function MeetingKnowledgeTab({ onNotify }) {
  const { meetings, addMeeting } = useKnowledge()

  const [showAddModal, setShowAddModal] = useState(false)
  const [title, setTitle] = useState('')
  const [organizer, setOrganizer] = useState('Executive Committee')
  const [summary, setSummary] = useState('')
  const [decisionInput, setDecisionInput] = useState('')

  const handleSaveMeeting = () => {
    if (!title.trim()) return

    addMeeting({
      title,
      date: new Date().toISOString().split('T')[0],
      organizer,
      attendees: ['CEO', 'CFO', 'HR Lead', 'Operations Director'],
      summary: summary || 'Routine strategic alignment and governance meeting.',
      decisions: decisionInput ? decisionInput.split('.').filter(Boolean) : ['Ratified committee agenda.'],
      actionItems: [
        { task: 'Circulate meeting minutes to department leads.', owner: 'Executive Assistant', deadline: '2026-08-05', status: 'In Progress' }
      ]
    })

    if (onNotify) onNotify(`Logged Meeting Knowledge: ${title}`)
    setShowAddModal(false)
    setTitle('')
  }

  return (
    <div className="space-y-6">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Executive & Committee Meeting Knowledge Hub
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Capture agendas, attendance, strategic decisions, and follow-up action items linked to projects.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md self-start sm:self-auto"
        >
          + Log Meeting Minutes
        </button>
      </div>

      {/* MEETINGS LIST */}
      <div className="space-y-5">
        {meetings.map((mtg) => (
          <div
            key={mtg.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {mtg.id}
                  </span>
                  <span className="text-slate-400">• Date: {mtg.date}</span>
                  <span className="text-slate-400">• Organizer: {mtg.organizer}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  {mtg.title}
                </h4>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                {mtg.attendees && mtg.attendees.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {mtg.summary}
            </p>

            {/* KEY DECISIONS */}
            {mtg.decisions && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-200 dark:border-slate-700 space-y-1 text-xs">
                <strong className="font-mono text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase block">
                  Ratified Strategic Decisions:
                </strong>
                <ul className="list-disc list-inside space-y-1 font-bold text-slate-800 dark:text-slate-200">
                  {mtg.decisions.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTION ITEMS */}
            {mtg.actionItems && (
              <div className="space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-400 text-[10px] uppercase block">
                  Follow-up Action Items:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  {mtg.actionItems.map((act, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <div>
                        <strong className="block text-slate-900 dark:text-white text-[11px]">{act.task}</strong>
                        <span className="text-[10px] text-slate-400">Assigned: {act.owner} • Due: {act.deadline}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE MEETING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Log Executive / Committee Meeting Knowledge
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Regional Audit & Compliance Committee"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Summary</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Key topics discussed..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ratified Decisions (Period separated)</label>
                <input
                  type="text"
                  value={decisionInput}
                  onChange={(e) => setDecisionInput(e.target.value)}
                  placeholder="Approved KES 5M budget. Adopted zero-trust security."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={handleSaveMeeting} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                Log Minutes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
