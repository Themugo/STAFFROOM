import { useState } from 'react'
import {
  Award,
  Heart,
  Smile,
  PartyPopper,
  Sparkles,
  Users,
  Calendar,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
  Flame,
  Star,
  CheckCircle2,
  UserPlus,
} from 'lucide-react'

const INITIAL_KUDOS = [
  {
    id: 'k-1',
    giver: 'Alex Vance (CEO)',
    receiver: 'Elena Rostova',
    badge: '🚀 Super Executor',
    message: 'Outstanding leadership on resolving the cloud infrastructure failover audit without any downtime!',
    likes: 34,
    time: '3 hours ago',
  },
  {
    id: 'k-2',
    giver: 'Sarah Jenkins',
    receiver: 'Michael Chen',
    badge: '🏆 Team Player',
    message: 'Huge thanks for helping finance fast-track the July payroll disbursal ahead of the bank holiday!',
    likes: 21,
    time: '5 hours ago',
  },
]

const CELEBRATIONS = [
  { type: 'Birthday', name: 'Lucas Vance', role: 'Security Analyst', date: 'Today 🎂' },
  { type: 'Anniversary', name: 'David Kim', role: 'Transport Lead (3 Years)', date: 'Tomorrow 🎈' },
  { type: 'New Joiner', name: 'Amara Okafor', role: 'Senior UX Designer', date: 'Joined Yesterday 🎉' },
]

const COMMUNITIES = [
  { id: 'comm-1', name: 'Women in Leadership & Tech', members: 48, icon: '👩‍💼', category: 'Empowerment', joined: true },
  { id: 'comm-2', name: 'StaffRoom Innovation Hub', members: 82, icon: '💡', category: 'R&D', joined: true },
  { id: 'comm-3', name: 'Health, Wellness & Yoga Club', members: 65, icon: '🧘', category: 'Wellness', joined: false },
  { id: 'comm-4', name: 'Corporate Social Responsibility (CSR)', members: 54, icon: '🌱', category: 'Impact', joined: false },
  { id: 'comm-5', name: 'StaffRoom Football & Sports Guild', members: 40, icon: '⚽', category: 'Sports', joined: true },
]

export default function SocialIntranet() {
  const [kudosList, setKudosList] = useState(INITIAL_KUDOS)
  const [communities, setCommunities] = useState(COMMUNITIES)
  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'communities'
  const [kudosModal, setKudosModal] = useState(false)
  const [receiver, setReceiver] = useState('Elena Rostova')
  const [badge, setBadge] = useState('🚀 Super Executor')
  const [kudosNote, setKudosNote] = useState('')

  const handleGiveKudos = () => {
    if (!kudosNote.trim()) return
    const newK = {
      id: `k-${Date.now()}`,
      giver: 'You (Current User)',
      receiver: receiver,
      badge: badge,
      message: kudosNote,
      likes: 1,
      time: 'Just now',
    }
    setKudosList([newK, ...kudosList])
    setKudosNote('')
    setKudosModal(false)
  }

  const toggleJoinCommunity = (id) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c))
  }

  return (
    <div className="space-y-6">
      {/* Social Header */}
      <div className="card p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit">
            <Sparkles size={13} className="text-purple-400" /> Enterprise Social Intranet & Culture
          </span>
          <h1 className="text-2xl font-black text-white">Employee Recognition & Interest Communities</h1>
          <p className="text-xs text-purple-200">Celebrate wins, give peer kudos badges, welcome new staff, and connect across company guilds.</p>
        </div>

        <button
          onClick={() => setKudosModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-lg cursor-pointer self-start md:self-auto"
        >
          <Award size={18} /> Give Peer Kudos Badge
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Social Intranet Feed & Celebrations
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'communities' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Interest Communities & Guilds ({communities.length})
        </button>
      </div>

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Kudos Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recognition & Milestone Wall</h3>

            <div className="space-y-4">
              {kudosList.map(k => (
                <div key={k.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                        👏
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          <strong className="text-indigo-600 dark:text-indigo-400">{k.giver}</strong> recognized <strong className="text-indigo-600 dark:text-indigo-400">{k.receiver}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400">{k.time}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {k.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 leading-relaxed">
                    "{k.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <button
                      onClick={() => setKudosList(prev => prev.map(item => item.id === k.id ? { ...item, likes: item.likes + 1 } : item))}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Heart size={14} className="text-rose-500 fill-rose-500" /> {k.likes} Cheers
                    </button>
                    <span className="text-[11px] text-slate-400">Enterprise Social Board</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebrations Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <PartyPopper size={16} className="text-amber-500" /> Upcoming Celebrations
              </h3>

              <div className="space-y-3">
                {CELEBRATIONS.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-[11px] text-slate-500">{c.role}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {c.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map(c => (
            <div key={c.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.icon}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800">{c.category}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h3>
              <p className="text-xs text-slate-500">{c.members} Staff Members active</p>

              <button
                onClick={() => toggleJoinCommunity(c.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                  c.joined
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {c.joined ? <CheckCircle2 size={14} /> : <UserPlus size={14} />} {c.joined ? 'Joined (Leave)' : 'Join Community'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Give Kudos Modal */}
      {kudosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-amber-500" size={20} /> Give Peer Kudos Badge
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipient Staff Member</label>
                <select
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                >
                  <option value="Elena Rostova">Elena Rostova (ICT Lead)</option>
                  <option value="Michael Chen">Michael Chen (Finance Lead)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (HR)</option>
                  <option value="David Kim">David Kim (Transport)</option>
                  <option value="Lucas Vance">Lucas Vance (Security Analyst)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                >
                  <option value="🚀 Super Executor">🚀 Super Executor</option>
                  <option value="🏆 Team Player">🏆 Team Player</option>
                  <option value="🌟 Innovation Star">🌟 Innovation Star</option>
                  <option value="❤️ Customer Champion">❤️ Customer Champion</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kudos Message</label>
                <textarea
                  value={kudosNote}
                  onChange={(e) => setKudosNote(e.target.value)}
                  rows={3}
                  placeholder="Write a warm note highlighting their contribution..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setKudosModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button onClick={handleGiveKudos} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer">Post Kudos</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
