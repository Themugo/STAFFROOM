import { useState } from 'react'
import {
  FileText,
  Users,
  MessageSquare,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Download,
  Plus,
  Eye,
  Check,
  X,
  Lock,
  Globe,
  CornerDownRight,
} from 'lucide-react'

const INITIAL_DOCS = [
  {
    id: 'doc-1',
    title: 'StaffRoom Enterprise Remote Work & Hybrid Policy 2026',
    status: 'Under Review',
    version: 'v2.4',
    author: 'Sarah Jenkins',
    updatedAt: '10 mins ago',
    activeCollaborators: [
      { name: 'Michael Chen', color: 'bg-indigo-500' },
      { name: 'Elena Rostova', color: 'bg-emerald-500' },
    ],
    content: `# StaffRoom Enterprise Remote Work Policy 2026

## 1. Executive Summary
This policy establishes standard operating guidelines for all full-time employees participating in hybrid or fully remote work models across enterprise business units.

## 2. Eligibility & Equipment Allowance
- Full-time employees after completing the 90-day onboarding probation phase are eligible.
- IT Department provides standard hardware allowance including encrypted laptops and VPN hardware tokens.

## 3. Availability Core Hours
Employees must maintain active status on StaffRoom Digital Workplace between **09:00 AM and 03:00 PM EST**.`,
    comments: [
      { id: 'c-1', author: 'Michael Chen', text: 'Section 2: Should we increase the remote monitor stipend to $350?', time: '30 mins ago', resolved: false },
    ],
    history: [
      { version: 'v2.4', author: 'Sarah Jenkins', date: 'Today 11:20 AM', note: 'Added legal compliance section' },
      { version: 'v2.3', author: 'Michael Chen', date: 'Yesterday 04:15 PM', note: 'Adjusted core working hours' },
    ],
  },
  {
    id: 'doc-2',
    title: 'Cloud Infrastructure Disaster Recovery Runbook',
    status: 'Published',
    version: 'v1.0',
    author: 'Elena Rostova',
    updatedAt: 'Yesterday',
    activeCollaborators: [],
    content: `# Disaster Recovery & High Availability Protocol\n\nIn event of region failure, automated failover routes traffic to secondary cloud mirror within 45 seconds.`,
    comments: [],
    history: [],
  },
]

export default function DocumentCollaboration() {
  const [docs, setDocs] = useState(INITIAL_DOCS)
  const [activeDoc, setActiveDoc] = useState(INITIAL_DOCS[0])
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'comments' | 'history'
  const [commentText, setCommentText] = useState('')
  const [docContent, setDocContent] = useState(activeDoc.content)

  const handlePublish = () => {
    const updated = { ...activeDoc, status: 'Published', version: 'v3.0' }
    setActiveDoc(updated)
    setDocs(prev => prev.map(d => d.id === updated.id ? updated : d))
  }

  const handleAddComment = () => {
    if (!commentText.trim() || !activeDoc) return
    const newC = {
      id: `c-${Date.now()}`,
      author: 'You (Current User)',
      text: commentText,
      time: 'Just now',
      resolved: false,
    }
    const updated = { ...activeDoc, comments: [...activeDoc.comments, newC] }
    setActiveDoc(updated)
    setDocs(prev => prev.map(d => d.id === updated.id ? updated : d))
    setCommentText('')
  }

  return (
    <div className="space-y-6">
      {/* Doc Collab Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={24} /> Real-Time Document Collaboration
          </h1>
          <p className="text-xs text-slate-500">Shared rich-text editing, inline comments, track changes, version snapshots, and publishing workflows.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer">
          <Plus size={16} /> New Collaborative Doc
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar Doc List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Workspace Documents</h3>

          <div className="space-y-2">
            {docs.map(doc => {
              const isSelected = activeDoc?.id === doc.id
              return (
                <div
                  key={doc.id}
                  onClick={() => { setActiveDoc(doc); setDocContent(doc.content) }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800">
                      {doc.version}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400">Updated {doc.updatedAt} by {doc.author}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Editor & Comments View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeDoc ? (
            <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
              {/* Document Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">{activeDoc.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{activeDoc.version}</span>
                    <span>•</span>
                    <span>Status: <strong className="text-slate-700 dark:text-slate-300">{activeDoc.status}</strong></span>
                  </div>
                </div>

                {/* Live Collaborators Indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    {activeDoc.activeCollaborators.map((c, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 ${c.color}`} title={c.name}>
                        {c.name[0]}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePublish}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 size={14} /> Publish Doc
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Editor vs Comments vs History */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                {[
                  { id: 'editor', label: 'Document Canvas', icon: FileText },
                  { id: 'comments', label: `Comments (${activeDoc.comments.length})`, icon: MessageSquare },
                  { id: 'history', label: 'Version History', icon: History },
                ].map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={14} /> {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Editor Canvas View */}
              {activeTab === 'editor' && (
                <div className="space-y-4">
                  <textarea
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    rows={12}
                    className="w-full p-4 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Markdown formatting supported</span>
                    <span>Live Auto-Save Enabled 🟢</span>
                  </div>
                </div>
              )}

              {/* Comments View */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {activeDoc.comments.map(c => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{c.author}</span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add comment on this document..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <button onClick={handleAddComment} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer">
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {/* Version History View */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {activeDoc.history.map((h, i) => (
                    <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{h.version}</span>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{h.note}</p>
                        <p className="text-[10px] text-slate-400">{h.author} • {h.date}</p>
                      </div>
                      <button className="px-3 py-1 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 cursor-pointer">
                        Restore Snapshot
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a document from the list.</div>
          )}
        </div>
      </div>
    </div>
  )
}
