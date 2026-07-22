import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import {
  Megaphone,
  Plus,
  Send,
  Pin,
  PinOff,
  CheckCheck,
  Check,
  Search,
  Users,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, timeAgo, initials } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/Tabs'
import SearchInput from '../components/ui/SearchInput'

// Priority is stored as an integer in the database:
//   1 = LOW, 2 = MEDIUM, 3 = HIGH
const PRIORITY_LABELS = { 1: 'LOW', 2: 'MEDIUM', 3: 'HIGH' }

const PRIORITY_BADGE = {
  1: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  2: 'bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400',
  3: 'bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400',
}

const AUDIENCE_LABELS = {
  ALL: 'All Staff',
  DEPARTMENT: 'Department',
  TEAM: 'Team',
}

const ANNOUNCEMENT_COLUMNS =
  'id, title, content, created_by, priority, created_at, expires_at, status'

const emptyForm = {
  title: '',
  content: '',
  priority: 2,
  target_audience: 'ALL',
  department_id: '',
  team_id: '',
  expires_at: '',
}

const AVATAR_COLORS = [
  'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
  'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400',
  'bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400',
  'bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400',
]

function avatarColor(name = '') {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

export default function CommunicationHub() {
  const { profile } = useAuth()
  const { success, error: notifyError } = useNotifications()

  const [activeTab, setActiveTab] = useState('announcements')

  // ── Pre-selected conversation (set from Directory tab) ────────────────
  const [preselectedUserId, setPreselectedUserId] = useState(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication Hub"
        description="Announcements, direct messages, and your team directory"
        icon={MessageSquare}
      />

      <Tabs
        tabs={[
          { id: 'announcements', label: 'Announcements' },
          { id: 'messages', label: 'Messages' },
          { id: 'directory', label: 'Directory' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'announcements' && <AnnouncementsTab profile={profile} notify={{ success, notifyError }} />}
      {activeTab === 'messages' && (
        <MessagesTab
          profile={profile}
          notify={{ success, notifyError }}
          preselectedUserId={preselectedUserId}
          onConsumePreselect={() => setPreselectedUserId(null)}
        />
      )}
      {activeTab === 'directory' && (
        <DirectoryTab
          profile={profile}
          notify={{ success, notifyError }}
          onStartConversation={(userId) => {
            setPreselectedUserId(userId)
            setActiveTab('messages')
          }}
        />
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  ANNOUNCEMENTS TAB
 * ────────────────────────────────────────────────────────────────────── */

function AnnouncementsTab({ profile, notify }) {
  const { success, notifyError } = notify

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [search, setSearch] = useState('')

  // selectors
  const [departments, setDepartments] = useState([])
  const [teams, setTeams] = useState([])

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)

    // Company-wide announcements (no department targeting) — fetch all and
    // filter client-side where target_audience = 'ALL' (or null/missing).
    const { data: allRows, error: allErr } = await supabase
      .from('announcements')
      .select(ANNOUNCEMENT_COLUMNS)
      .order('created_at', { ascending: false })

    if (allErr) {
      notifyError('Failed to load announcements')
      console.error('fetchAnnouncements error:', allErr)
      setLoading(false)
      return
    }

    const companyWide = (allRows || []).filter(
      (a) => a.target_audience === 'ALL' || !a.target_audience
    )

    // Department-targeted announcements via join table
    const { data: deptRows, error: deptErr } = await supabase
      .from('department_announcements')
      .select(`announcement_id, announcements (${ANNOUNCEMENT_COLUMNS})`)
      .order('announcement_id', { ascending: false })

    let deptAnnouncements = []
    if (deptErr) {
      console.error('fetch department_announcements error:', deptErr)
    } else {
      deptAnnouncements = (deptRows || [])
        .map((row) => row.announcements)
        .filter(Boolean)
    }

    // Merge and de-duplicate by id
    const merged = [...companyWide, ...deptAnnouncements].reduce((acc, ann) => {
      if (ann && !acc.find((x) => x.id === ann.id)) acc.push(ann)
      return acc
    }, [])

    // Sort newest first
    merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    setAnnouncements(merged)
    setLoading(false)
  }, [notifyError])

  const fetchSelectors = useCallback(async () => {
    const orgId = profile?.organization_id
    if (!orgId) return

    const [deptRes, teamRes] = await Promise.all([
      supabase.from('departments').select('id, name').eq('organization_id', orgId).order('name'),
      supabase.from('teams').select('id, name').eq('organization_id', orgId).order('name'),
    ])

    if (deptRes.data) setDepartments(deptRes.data)
    if (teamRes.data) setTeams(teamRes.data)
  }, [profile?.organization_id])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  useEffect(() => {
    fetchSelectors()
  }, [fetchSelectors])

  const now = new Date()
  const stats = useMemo(() => {
    const active = announcements.filter(
      (a) => !a.expires_at || new Date(a.expires_at) > now
    ).length
    return {
      total: announcements.length,
      active,
      highPriority: announcements.filter((a) => a.priority === 3).length,
      expired: announcements.length - active,
    }
  }, [announcements]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return announcements
    return announcements.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q)
    )
  }, [announcements, search])

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.content.trim()) errs.content = 'Content is required'
    if (!form.priority) errs.priority = 'Priority is required'
    if (!form.target_audience) errs.target_audience = 'Target audience is required'
    if (form.target_audience === 'DEPARTMENT' && !form.department_id)
      errs.department_id = 'Select a department'
    if (form.target_audience === 'TEAM' && !form.team_id)
      errs.team_id = 'Select a team'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setFormErrors({})
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      priority: Number(form.priority),
      target_audience: form.target_audience,
      created_by: profile?.id || null,
      organization_id: profile?.organization_id || null,
      expires_at: form.expires_at || null,
      status: 'ACTIVE',
    }

    const { data: annRow, error: annErr } = await supabase
      .from('announcements')
      .insert([payload])
      .select(ANNOUNCEMENT_COLUMNS)
      .single()

    if (annErr) {
      setSubmitting(false)
      notifyError('Failed to create announcement')
      console.error('create announcement error:', annErr)
      return
    }

    // Insert into join table if targeted
    if (annRow && form.target_audience === 'DEPARTMENT' && form.department_id) {
      const { error: joinErr } = await supabase
        .from('department_announcements')
        .insert([{ announcement_id: annRow.id, department_id: form.department_id }])
      if (joinErr) console.error('department_announcements insert error:', joinErr)
    }

    if (annRow && form.target_audience === 'TEAM' && form.team_id) {
      const { error: joinErr } = await supabase
        .from('team_announcements')
        .insert([{ announcement_id: annRow.id, team_id: form.team_id }])
      if (joinErr) console.error('team_announcements insert error:', joinErr)
    }

    setSubmitting(false)
    setAnnouncements((prev) => [annRow, ...prev])
    success('Announcement created successfully')
    closeModal()
  }

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
      formErrors[field]
        ? 'border-danger-300 dark:border-danger-700'
        : 'border-gray-300 dark:border-gray-700'
    }`

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Megaphone} label="Total" value={stats.total} color="blue" loading={loading} />
        <StatCard icon={CheckCircle} label="Active" value={stats.active} color="green" loading={loading} />
        <StatCard icon={AlertTriangle} label="High Priority" value={stats.highPriority} color="red" loading={loading} />
        <StatCard icon={XCircle} label="Expired" value={stats.expired} color="gray" loading={loading} />
      </div>

      {/* Search + New */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search announcements..."
          className="sm:max-w-xs"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="card p-12">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={Megaphone}
            title={search ? 'No matching announcements' : 'No announcements yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Create your first announcement to keep your team informed.'
            }
            action={
              !search && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  <Plus size={16} />
                  New Announcement
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => {
            const isExpired = a.expires_at && new Date(a.expires_at) <= now
            const priorityLabel = PRIORITY_LABELS[a.priority] || 'MEDIUM'
            return (
              <div
                key={a.id}
                className="card p-5 transition hover:shadow-md dark:border dark:border-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {a.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE[a.priority] || PRIORITY_BADGE[2]}`}
                      >
                        {priorityLabel}
                      </span>
                      {isExpired ? (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-600 dark:bg-success-900/40 dark:text-success-400">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {a.content}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted {timeAgo(a.created_at)}</span>
                      {a.expires_at && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          Expires {formatDate(a.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New Announcement Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="New Announcement"
        description="Create a new announcement for your team"
        size="lg"
        footer={
          <>
            <button
              onClick={closeModal}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {submitting ? <Spinner size="sm" className="text-white" /> : <Plus size={16} />}
              {submitting ? 'Creating...' : 'Create Announcement'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="ann-title">Title</label>
            <input
              id="ann-title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="Enter announcement title"
              className={inputClass('title')}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="ann-content">Content</label>
            <textarea
              id="ann-content"
              value={form.content}
              onChange={handleChange('content')}
              placeholder="Write the announcement content..."
              rows={5}
              className={`${inputClass('content')} resize-y`}
            />
            {formErrors.content && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ann-priority">Priority</label>
              <select
                id="ann-priority"
                value={form.priority}
                onChange={handleChange('priority')}
                className={inputClass('priority')}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
              {formErrors.priority && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.priority}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="ann-audience">Target Audience</label>
              <select
                id="ann-audience"
                value={form.target_audience}
                onChange={handleChange('target_audience')}
                className={inputClass('target_audience')}
              >
                <option value="ALL">All Staff</option>
                <option value="DEPARTMENT">Department</option>
                <option value="TEAM">Team</option>
              </select>
              {formErrors.target_audience && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.target_audience}</p>
              )}
            </div>
          </div>

          {form.target_audience === 'DEPARTMENT' && (
            <div>
              <label className={labelClass} htmlFor="ann-dept">Department</label>
              <select
                id="ann-dept"
                value={form.department_id}
                onChange={handleChange('department_id')}
                className={inputClass('department_id')}
              >
                <option value="">Select a department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {formErrors.department_id && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.department_id}</p>
              )}
            </div>
          )}

          {form.target_audience === 'TEAM' && (
            <div>
              <label className={labelClass} htmlFor="ann-team">Team</label>
              <select
                id="ann-team"
                value={form.team_id}
                onChange={handleChange('team_id')}
                className={inputClass('team_id')}
              >
                <option value="">Select a team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {formErrors.team_id && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.team_id}</p>
              )}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="ann-expires">Expiry Date</label>
            <input
              id="ann-expires"
              type="date"
              value={form.expires_at}
              onChange={handleChange('expires_at')}
              className={inputClass('expires_at')}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Leave blank for no expiry
            </p>
          </div>
        </form>
      </Modal>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  MESSAGES TAB
 * ────────────────────────────────────────────────────────────────────── */

function MessagesTab({ profile, notify, preselectedUserId, onConsumePreselect }) {
  const { success, notifyError } = notify

  const [conversations, setConversations] = useState([]) // [{ userId, name, lastMessage, lastAt }]
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [readMap, setReadMap] = useState({}) // { messageId: isRead }
  const [pinnedIds, setPinnedIds] = useState(new Set())
  const [profilesCache, setProfilesCache] = useState({}) // { userId: { full_name, role } }

  const threadRef = useRef(null)
  const orgId = profile?.organization_id
  const myId = profile?.id

  // Fetch all conversations involving me
  const fetchConversations = useCallback(async () => {
    if (!myId) return
    setLoadingConvos(true)

    const { data, error } = await supabase
      .from('direct_messages')
      .select('id, sender_id, recipient_id, content, created_at, is_pinned')
      .or(`sender_id.eq.${myId},recipient_id.eq.${myId}`)
      .order('created_at', { ascending: false })

    if (error) {
      notifyError('Failed to load conversations')
      console.error('fetchConversations error:', error)
      setLoadingConvos(false)
      return
    }

    // Group by the "other" user
    const byUser = new Map()
    for (const m of data || []) {
      const otherId = m.sender_id === myId ? m.recipient_id : m.sender_id
      if (!otherId) continue
      if (!byUser.has(otherId)) {
        byUser.set(otherId, { userId: otherId, lastMessage: m.content, lastAt: m.created_at, pinned: !!m.is_pinned })
      }
    }

    // Fetch profile info for each conversation partner
    const userIds = Array.from(byUser.keys())
    const profilesMap = {}
    if (userIds.length) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('id', userIds)
      ;(prof || []).forEach((p) => {
        profilesMap[p.id] = { full_name: p.full_name, role: p.role }
      })
    }

    setProfilesCache((prev) => ({ ...prev, ...profilesMap }))
    const convos = Array.from(byUser.values()).sort(
      (a, b) => new Date(b.lastAt) - new Date(a.lastAt)
    )
    setConversations(convos)
    setLoadingConvos(false)
  }, [myId, notifyError])

  // Fetch the thread for a given user
  const fetchThread = useCallback(
    async (otherId) => {
      if (!myId || !otherId) return
      setLoadingThread(true)

      const { data, error } = await supabase
        .from('direct_messages')
        .select('id, sender_id, recipient_id, content, created_at, is_pinned')
        .or(`and(sender_id.eq.${myId},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${myId})`)
        .order('created_at', { ascending: true })

      if (error) {
        notifyError('Failed to load messages')
        console.error('fetchThread error:', error)
        setMessages([])
        setLoadingThread(false)
        return
      }

      const msgs = data || []
      setMessages(msgs)

      // Track pinned
      setPinnedIds(new Set(msgs.filter((m) => m.is_pinned).map((m) => m.id)))

      // Fetch read receipts for these messages
      if (msgs.length) {
        const { data: reads } = await supabase
          .from('message_reads')
          .select('message_id, read_by')
          .in(
            'message_id',
            msgs.map((m) => m.id)
          )
        const rMap = {}
        ;(reads || []).forEach((r) => {
          // "read" if someone other than the sender read it
          const msg = msgs.find((m) => m.id === r.message_id)
          if (msg && r.read_by !== msg.sender_id) {
            rMap[r.message_id] = true
          }
        })
        setReadMap(rMap)
      }

      setLoadingThread(false)
    },
    [myId, notifyError]
  )

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // When a preselected user arrives (from Directory), ensure a conversation
  // entry exists and open the thread.
  useEffect(() => {
    if (!preselectedUserId) return
    setSelectedUserId(preselectedUserId)

    // Make sure the partner profile is cached
    if (!profilesCache[preselectedUserId]) {
      supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', preselectedUserId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfilesCache((prev) => ({
              ...prev,
              [data.id]: { full_name: data.full_name, role: data.role },
            }))
          }
        })
    }

    // Add to conversation list if not present
    setConversations((prev) => {
      if (prev.find((c) => c.userId === preselectedUserId)) return prev
      return [
        { userId: preselectedUserId, lastMessage: '', lastAt: new Date().toISOString(), pinned: false },
        ...prev,
      ]
    })

    fetchThread(preselectedUserId)
    onConsumePreselect()
  }, [preselectedUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load thread when selection changes (not from preselect)
  useEffect(() => {
    if (selectedUserId && selectedUserId !== preselectedUserId) {
      fetchThread(selectedUserId)
    }
  }, [selectedUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new messages
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || !selectedUserId || !myId) return

    setSending(true)
    const payload = {
      sender_id: myId,
      recipient_id: selectedUserId,
      content: text,
      organization_id: orgId || null,
    }

    const { data, error } = await supabase
      .from('direct_messages')
      .insert([payload])
      .select('id, sender_id, recipient_id, content, created_at, is_pinned')
      .single()

    setSending(false)

    if (error) {
      notifyError('Failed to send message')
      console.error('send error:', error)
      return
    }

    setMessages((prev) => [...prev, data])
    setDraft('')

    // Update conversation list preview
    setConversations((prev) => {
      const exists = prev.find((c) => c.userId === selectedUserId)
      if (exists) {
        return prev
          .map((c) =>
            c.userId === selectedUserId
              ? { ...c, lastMessage: text, lastAt: data.created_at }
              : c
          )
          .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt))
      }
      return [
        { userId: selectedUserId, lastMessage: text, lastAt: data.created_at, pinned: false },
        ...prev,
      ]
    })
  }

  const togglePin = async (messageId) => {
    const isPinned = pinnedIds.has(messageId)
    const { error } = await supabase
      .from('direct_messages')
      .update({ is_pinned: !isPinned })
      .eq('id', messageId)

    if (error) {
      notifyError('Failed to update pin')
      console.error('pin error:', error)
      return
    }

    setPinnedIds((prev) => {
      const next = new Set(prev)
      if (isPinned) next.delete(messageId)
      else next.add(messageId)
      return next
    })
    success(isPinned ? 'Message unpinned' : 'Message pinned')
  }

  const filteredConvos = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => {
      const name = (profilesCache[c.userId]?.full_name || '').toLowerCase()
      return name.includes(q) || c.lastMessage?.toLowerCase().includes(q)
    })
  }, [conversations, search, profilesCache])

  const selectedProfile = selectedUserId ? profilesCache[selectedUserId] : null
  const selectedName = selectedProfile?.full_name || 'Unknown'

  // Sort messages: pinned first, then by time
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aP = pinnedIds.has(a.id) ? 1 : 0
      const bP = pinnedIds.has(b.id) ? 1 : 0
      if (aP !== bP) return bP - aP
      return new Date(a.created_at) - new Date(b.created_at)
    })
  }, [messages, pinnedIds])

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[70vh]">
        {/* Sidebar — conversation list */}
        <div className="border-r border-gray-200 dark:border-gray-800 flex flex-col md:col-span-1">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search conversations..."
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="p-6">
                <Spinner size="md" />
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={MessageSquare}
                  title="No conversations"
                  description="Start a new conversation from the Directory tab."
                />
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredConvos.map((c) => {
                  const name = profilesCache[c.userId]?.full_name || 'Unknown'
                  const isActive = c.userId === selectedUserId
                  return (
                    <li key={c.userId}>
                      <button
                        onClick={() => setSelectedUserId(c.userId)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          isActive ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor(name)}`}
                        >
                          {initials(name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {c.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                          {timeAgo(c.lastAt)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right panel — thread */}
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {!selectedUserId ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a conversation from the left, or start a new one from the Directory."
              />
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${avatarColor(selectedName)}`}
                >
                  {initials(selectedName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedName}
                  </p>
                  {selectedProfile?.role && (
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {selectedProfile.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div ref={threadRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingThread ? (
                  <Spinner size="md" className="py-8" />
                ) : sortedMessages.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No messages yet"
                    description="Send the first message to start the conversation."
                  />
                ) : (
                  sortedMessages.map((m) => {
                    const isMine = m.sender_id === myId
                    const isPinned = pinnedIds.has(m.id)
                    const isRead = readMap[m.id]
                    return (
                      <div
                        key={m.id}
                        className={`group flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            isMine
                              ? 'bg-brand-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'
                          } ${isPinned ? 'ring-2 ring-warning-400' : ''}`}
                        >
                          {isPinned && (
                            <Pin
                              size={12}
                              className="absolute -top-1.5 -left-1.5 text-warning-500 fill-warning-400"
                            />
                          )}
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <div
                            className={`mt-1 flex items-center gap-1 text-xs ${
                              isMine ? 'text-brand-100' : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            <span>{timeAgo(m.created_at)}</span>
                            {isMine && (isRead ? (
                              <CheckCheck size={12} className="text-brand-100" />
                            ) : (
                              <Check size={12} />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => togglePin(m.id)}
                          className="mt-1 hidden items-center gap-1 text-xs text-gray-400 hover:text-gray-600 group-hover:flex dark:hover:text-gray-300"
                        >
                          {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                          {isPinned ? 'Unpin' : 'Pin'}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-800"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  {sending ? <Spinner size="sm" className="text-white" /> : <Send size={16} />}
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  DIRECTORY TAB
 * ────────────────────────────────────────────────────────────────────── */

function DirectoryTab({ profile, notify, onStartConversation }) {
  const { notifyError } = notify
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchEmployees = useCallback(async () => {
    if (!profile?.organization_id) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('organization_id', profile.organization_id)
      .order('full_name', { ascending: true })

    if (error) {
      notifyError('Failed to load directory')
      console.error('fetchEmployees error:', error)
    } else {
      // Exclude myself
      setEmployees((data || []).filter((e) => e.id !== profile.id))
    }
    setLoading(false)
  }, [profile?.id, profile?.organization_id, notifyError])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return employees
    return employees.filter(
      (e) =>
        e.full_name?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q)
    )
  }, [employees, search])

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search people by name or role..."
        className="sm:max-w-md"
      />

      {loading ? (
        <div className="card p-12">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={Users}
            title={search ? 'No matching people' : 'No people found'}
            description={
              search
                ? 'Try a different search term.'
                : 'There are no other employees in your organization yet.'
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((emp) => (
            <button
              key={emp.id}
              onClick={() => onStartConversation(emp.id)}
              className="card-hover p-5 text-left transition hover:shadow-md dark:border dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold ${avatarColor(emp.full_name || '')}`}
                >
                  {initials(emp.full_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {emp.full_name || 'Unknown'}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {emp.role || '—'}
                  </p>
                </div>
                <MessageSquare
                  size={18}
                  className="flex-shrink-0 text-gray-400 transition group-hover:text-brand-500"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
