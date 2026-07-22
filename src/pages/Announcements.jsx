import { useEffect, useState, useCallback } from 'react'
import { Megaphone, Plus, Trash2, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, timeAgo } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'

// Priority is stored as an integer in the database:
//   1 = LOW, 2 = MEDIUM, 3 = HIGH
const PRIORITY_LABELS = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
}

const PRIORITY_COLORS = {
  1: 'gray',   // LOW
  2: 'yellow', // MEDIUM
  3: 'red',    // HIGH
}

const AUDIENCE_LABELS = {
  ALL: 'All Staff',
  MANAGERS: 'Managers',
  DEPARTMENT: 'Department',
}

const emptyForm = {
  title: '',
  content: '',
  priority: 2, // MEDIUM
  target_audience: 'ALL',
  expires_at: '',
}

const SELECT_COLUMNS =
  'id, title, content, created_by, target_audience, priority, created_at, expires_at, status'

export default function Announcements() {
  const { profile } = useAuth()
  const { success, error: notifyError } = useNotifications()

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select(SELECT_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) {
      notifyError('Failed to load announcements')
      console.error('fetchAnnouncements error:', error)
    } else {
      setAnnouncements(data || [])
    }
    setLoading(false)
  }, [notifyError])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const now = new Date()
  const stats = {
    total: announcements.length,
    active: announcements.filter((a) => !a.expires_at || new Date(a.expires_at) > now).length,
    highPriority: announcements.filter((a) => a.priority === 3).length,
    expired: announcements.filter((a) => a.expires_at && new Date(a.expires_at) <= now).length,
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.content.trim()) errs.content = 'Content is required'
    if (!form.priority) errs.priority = 'Priority is required'
    if (!form.target_audience) errs.target_audience = 'Target audience is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
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
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert([payload])
      .select(SELECT_COLUMNS)
      .single()

    setSubmitting(false)

    if (error) {
      notifyError('Failed to create announcement')
      console.error('create error:', error)
      return
    }

    if (data) {
      setAnnouncements((prev) => [data, ...prev])
      success('Announcement created successfully')
    }
    setForm(emptyForm)
    setFormErrors({})
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('announcements').delete().eq('id', deleteId)
    setDeleting(false)

    if (error) {
      notifyError('Failed to delete announcement')
      console.error('delete error:', error)
      return
    }

    setAnnouncements((prev) => prev.filter((a) => a.id !== deleteId))
    success('Announcement deleted')
    setDeleteId(null)
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

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
      formErrors[field]
        ? 'border-danger-300 dark:border-danger-700'
        : 'border-gray-300 dark:border-gray-700'
    }`

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Create and manage company-wide announcements"
        icon={Megaphone}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <Plus size={16} />
            New Announcement
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Megaphone} label="Total Announcements" value={stats.total} color="blue" loading={loading} />
        <StatCard icon={CheckCircle} label="Active" value={stats.active} color="green" loading={loading} />
        <StatCard icon={AlertTriangle} label="High Priority" value={stats.highPriority} color="red" loading={loading} />
        <StatCard icon={XCircle} label="Expired" value={stats.expired} color="gray" loading={loading} />
      </div>

      {/* List */}
      {loading ? (
        <div className="card p-12">
          <Spinner size="lg" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Create your first announcement to keep your team informed."
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                <Plus size={16} />
                New Announcement
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => {
            const isExpired = a.expires_at && new Date(a.expires_at) <= now
            const priorityLabel = PRIORITY_LABELS[a.priority] || 'MEDIUM'
            const priorityColor = PRIORITY_COLORS[a.priority] || 'yellow'
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
                      <StatusBadge
                        status={priorityColor}
                        label={priorityLabel}
                      />
                      {isExpired ? (
                        <StatusBadge status="EXPIRED" />
                      ) : (
                        <StatusBadge status="ACTIVE" />
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {a.content}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Megaphone size={12} />
                        {AUDIENCE_LABELS[a.target_audience] || a.target_audience}
                      </span>
                      <span>Posted {timeAgo(a.created_at)}</span>
                      {a.expires_at && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          Expires {formatDate(a.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-900/30 dark:hover:text-danger-400"
                    aria-label="Delete announcement"
                  >
                    <Trash2 size={16} />
                  </button>
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
                <option value="MANAGERS">Managers</option>
                <option value="DEPARTMENT">Department</option>
              </select>
              {formErrors.target_audience && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{formErrors.target_audience}</p>
              )}
            </div>
          </div>

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

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Announcement"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteId(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-danger-500 dark:hover:bg-danger-600"
            >
              {deleting ? <Spinner size="sm" className="text-white" /> : <Trash2 size={16} />}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this announcement? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
