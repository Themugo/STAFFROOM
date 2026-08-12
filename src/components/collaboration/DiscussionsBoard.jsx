import { useState } from 'react'
import {
  MessageSquare,
  CheckCircle2,
  Pin,
  CheckSquare,
  Plus,
  ThumbsUp,
  MessageCircle,
  Share2,
  Search,
  Filter,
  User,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
} from 'lucide-react'

const INITIAL_DISCUSSIONS = [
  {
    id: 'disc-1',
    title: 'Proposal: Transitioning HR Onboarding to Fully Digital E-Signatures',
    category: 'Policy & Process',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2 hours ago',
    resolved: false,
    resolutionSummary: '',
    upvotes: 18,
    views: 140,
    pinnedReplyId: 'r-2',
    replies: [
      { id: 'r-1', author: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', time: '1 hour ago', text: 'Strong support for this! It will reduce contract turnaround time from 3 days to under 4 hours.', upvotes: 5, pinned: false },
      { id: 'r-2', author: 'Lucas Vance (Legal)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', time: '45 mins ago', text: 'Approved from legal compliance standpoint, provided audit trails record timestamp and IP hash.', upvotes: 12, pinned: true },
    ],
  },
  {
    id: 'disc-2',
    title: 'Best Practices for Microservices API Rate-Limiting & Security Headers',
    category: 'Architecture & Tech',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    createdAt: 'Yesterday',
    resolved: true,
    resolutionSummary: 'Adopted Token Bucket algorithm via Redis Gateway with 100 req/min per user policy.',
    upvotes: 24,
    views: 310,
    pinnedReplyId: 'r-4',
    replies: [
      { id: 'r-3', author: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', time: 'Yesterday', text: 'Should we use Token Bucket or Leaky Bucket for transport telemetry streaming endpoints?', upvotes: 4, pinned: false },
      { id: 'r-4', author: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', time: 'Yesterday', text: 'Token bucket handles burst requests much better for IoT telemetry bursts.', upvotes: 9, pinned: true },
    ],
  },
]

export default function DiscussionsBoard() {
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS)
  const [activeDisc, setActiveDisc] = useState(INITIAL_DISCUSSIONS[0])
  const [replyText, setReplyText] = useState('')
  const [filterCat, setFilterCat] = useState('ALL')
  const [search, setSearch] = useState('')
  const [newDiscModal, setNewDiscModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState('Policy & Process')
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleAddReply = () => {
    if (!replyText.trim() || !activeDisc) return
    const newReply = {
      id: `r-${Date.now()}`,
      author: 'You (Current User)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      time: 'Just now',
      text: replyText,
      upvotes: 0,
      pinned: false,
    }
    const updated = {
      ...activeDisc,
      replies: [...activeDisc.replies, newReply],
    }
    setActiveDisc(updated)
    setDiscussions(prev => prev.map(d => d.id === updated.id ? updated : d))
    setReplyText('')
    showToast('Reply published to discussion thread')
  }

  const handleToggleResolve = (discId) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        const nextState = !d.resolved
        const res = nextState ? 'Marked resolved by discussion author.' : ''
        const updated = { ...d, resolved: nextState, resolutionSummary: res }
        if (activeDisc?.id === discId) setActiveDisc(updated)
        return updated
      }
      return d
    }))
    showToast('Discussion resolution status updated')
  }

  const handlePinReply = (replyId) => {
    if (!activeDisc) return
    const updatedReplies = activeDisc.replies.map(r => ({
      ...r,
      pinned: r.id === replyId ? !r.pinned : r.pinned,
    }))
    const updated = { ...activeDisc, replies: updatedReplies }
    setActiveDisc(updated)
    setDiscussions(prev => prev.map(d => d.id === updated.id ? updated : d))
    showToast('Reply pin status toggled')
  }

  const handleConvertToTask = (reply) => {
    showToast(`Converted comment by ${reply.author} into actionable Task!`)
  }

  const handleCreateDiscussion = () => {
    if (!newTitle.trim()) return
    const newD = {
      id: `disc-${Date.now()}`,
      title: newTitle,
      category: newCat,
      author: 'You (Current User)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: 'Just now',
      resolved: false,
      resolutionSummary: '',
      upvotes: 1,
      views: 1,
      replies: [],
    }
    setDiscussions([newD, ...discussions])
    setActiveDisc(newD)
    setNewTitle('')
    setNewDiscModal(false)
    showToast('New discussion topic published!')
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={24} /> Threaded Enterprise Discussions
          </h1>
          <p className="text-xs text-slate-500">Structured decision-making threads with pins, resolution summaries, and 1-click task conversion.</p>
        </div>
        <button
          onClick={() => setNewDiscModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus size={16} /> Start New Discussion Topic
        </button>
      </div>

      {/* Grid: Topic List vs Discussion Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Discussions Sidebar List (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="card p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border-none bg-transparent outline-hidden w-full text-slate-800 dark:text-white"
            />
            <Search size={16} className="text-slate-400 shrink-0" />
          </div>

          <div className="space-y-2">
            {discussions.map(disc => {
              const isSelected = activeDisc?.id === disc.id
              return (
                <div
                  key={disc.id}
                  onClick={() => setActiveDisc(disc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {disc.category}
                    </span>
                    {disc.resolved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Resolved
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{disc.title}</h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <img src={disc.avatar} alt={disc.author} className="w-4 h-4 rounded-full" />
                      {disc.author}
                    </span>
                    <span>{disc.replies.length} replies • {disc.upvotes} 👍</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Discussion Active Detail (7 cols) */}
        <div className="lg:col-span-7">
          {activeDisc ? (
            <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
              {/* Thread Header */}
              <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {activeDisc.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleResolve(activeDisc.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 ${
                        activeDisc.resolved
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 size={14} /> {activeDisc.resolved ? 'Resolved' : 'Mark as Resolved'}
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{activeDisc.title}</h2>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <img src={activeDisc.avatar} alt={activeDisc.author} className="w-5 h-5 rounded-full" />
                    {activeDisc.author}
                  </span>
                  <span>•</span>
                  <span>{activeDisc.createdAt}</span>
                  <span>•</span>
                  <span>{activeDisc.views} Views</span>
                </div>

                {activeDisc.resolved && activeDisc.resolutionSummary && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <p className="font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> Resolution Decision:</p>
                    <p>{activeDisc.resolutionSummary}</p>
                  </div>
                )}
              </div>

              {/* Thread Replies */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Discussion Replies ({activeDisc.replies.length})
                </h3>

                {activeDisc.replies.map(reply => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border space-y-2 transition-all ${
                      reply.pinned
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={reply.avatar} alt={reply.author} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{reply.author}</span>
                        <span className="text-[10px] text-slate-400">{reply.time}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePinReply(reply.id)}
                          title="Pin important reply"
                          className={`p-1.5 rounded-lg text-xs cursor-pointer ${reply.pinned ? 'text-amber-600 bg-amber-100' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                          <Pin size={13} />
                        </button>
                        <button
                          onClick={() => handleConvertToTask(reply)}
                          title="Convert to actionable task"
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer inline-flex items-center gap-1"
                        >
                          <CheckSquare size={12} /> Convert to Task
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{reply.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Reply Input */}
              <div className="pt-2 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to this discussion..."
                  rows={3}
                  className="w-full p-3 rounded-2xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddReply}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a discussion topic to view replies.</div>
          )}
        </div>
      </div>

      {/* New Discussion Modal */}
      {newDiscModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start New Enterprise Discussion</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Standardizing Transport Dispatch Workflows"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                >
                  <option value="Policy & Process">Policy & Process</option>
                  <option value="Architecture & Tech">Architecture & Tech</option>
                  <option value="General Operations">General Operations</option>
                  <option value="Culture & Workplace">Culture & Workplace</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNewDiscModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDiscussion}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer hover:bg-indigo-700"
              >
                Publish Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
