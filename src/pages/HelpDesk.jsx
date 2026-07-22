import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  LifeBuoy,
  Plus,
  Ticket,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  User,
  Calendar,
  Search as SearchIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, timeAgo } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'
import DataTable from '../components/ui/DataTable'
import SearchInput from '../components/ui/SearchInput'
import Tabs from '../components/ui/Tabs'
import Spinner from '../components/ui/Spinner'

// ---- Constants ----
const CATEGORIES = ['IT', 'HR', 'PAYROLL', 'LEAVE', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const PRIORITY_COLORS = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'yellow',
  URGENT: 'red',
}

const STATUS_FLOW = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: 'CLOSED',
  CLOSED: null,
}

const TICKET_COLUMNS =
  'id, title, description, status, priority, category, created_by, created_at, assigned_to'

const ARTICLE_COLUMNS =
  'id, title, content, category, updated_at, created_at'

const EMPTY_TICKET_FORM = {
  title: '',
  description: '',
  category: 'IT',
  priority: 'MEDIUM',
}

const EMPTY_ARTICLE_FORM = {
  title: '',
  content: '',
  category: 'IT',
}

// ---- Helpers ----
const isAdmin = (profile) => profile?.role === 'ADMIN' || profile?.role === 'DEPARTMENT_ADMIN'

const priorityBadge = (priority) => (
  <StatusBadge
    status={PRIORITY_COLORS[priority] || 'gray'}
    label={priority}
  />
)

export default function HelpDesk() {
  const { profile } = useAuth()
  const { success, error: notifyError } = useNotifications()

  // ---- Tab state ----
  const [activeTab, setActiveTab] = useState('mine')

  // ---- Data state ----
  const [myTickets, setMyTickets] = useState([])
  const [allTickets, setAllTickets] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [articlesTableExists, setArticlesTableExists] = useState(true)

  // ---- Modal / form state ----
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [articleModalOpen, setArticleModalOpen] = useState(false)
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [submittingArticle, setSubmittingArticle] = useState(false)
  const [ticketForm, setTicketForm] = useState(EMPTY_TICKET_FORM)
  const [ticketFormErrors, setTicketFormErrors] = useState({})
  const [articleForm, setArticleForm] = useState(EMPTY_ARTICLE_FORM)
  const [articleFormErrors, setArticleFormErrors] = useState({})

  // ---- Admin filter state ----
  const [adminSearch, setAdminSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  // ---- Action loading ----
  const [actionLoading, setActionLoading] = useState(null)

  // ---- Fetch my tickets ----
  const fetchMyTickets = useCallback(async () => {
    if (!profile?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('help_tickets')
        .select(TICKET_COLUMNS)
        .eq('created_by', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMyTickets(data || [])
    } catch (err) {
      console.error('fetchMyTickets error:', err)
      notifyError('Failed to load your tickets')
    } finally {
      setLoading(false)
    }
  }, [profile?.id, notifyError])

  // ---- Fetch all tickets (admin) ----
  const fetchAllTickets = useCallback(async () => {
    if (!profile?.organization_id) return
    try {
      const { data, error } = await supabase
        .from('help_tickets')
        .select(TICKET_COLUMNS)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllTickets(data || [])
    } catch (err) {
      console.error('fetchAllTickets error:', err)
      notifyError('Failed to load tickets')
    }
  }, [profile?.organization_id, notifyError])

  // ---- Fetch knowledge base articles ----
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true)
    try {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select(ARTICLE_COLUMNS)
        .order('updated_at', { ascending: false })

      if (error) {
        // Table likely doesn't exist
        if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist') || error.message?.toLowerCase().includes('relation')) {
          setArticlesTableExists(false)
          setArticles([])
        } else {
          throw error
        }
      } else {
        setArticles(data || [])
        setArticlesTableExists(true)
      }
    } catch (err) {
      console.error('fetchArticles error:', err)
      setArticlesTableExists(false)
      setArticles([])
    } finally {
      setArticlesLoading(false)
    }
  }, [])

  // ---- Initial load ----
  useEffect(() => {
    if (activeTab === 'mine') {
      fetchMyTickets()
    } else if (activeTab === 'all') {
      fetchAllTickets()
    } else if (activeTab === 'kb') {
      fetchArticles()
    }
  }, [activeTab, fetchMyTickets, fetchAllTickets, fetchArticles])

  // ---- My tickets stats ----
  const myStats = useMemo(() => {
    const open = myTickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length
    const resolved = myTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    return { open, resolved }
  }, [myTickets])

  // ---- Admin filtered tickets ----
  const filteredAllTickets = useMemo(() => {
    let result = allTickets
    if (statusFilter) result = result.filter((t) => t.status === statusFilter)
    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter)
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase()
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [allTickets, statusFilter, priorityFilter, adminSearch])

  // ---- Tab counts ----
  const tabCounts = useMemo(
    () => ({
      mine: myTickets.length,
      all: allTickets.length,
      kb: articles.length,
    }),
    [myTickets, allTickets, articles]
  )

  // ---- Create ticket ----
  const handleCreateTicket = async (e) => {
    e?.preventDefault()
    const errs = {}
    if (!ticketForm.title.trim()) errs.title = 'Title is required'
    if (!ticketForm.description.trim()) errs.description = 'Description is required'
    setTicketFormErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (!profile?.id) {
      notifyError('Your profile is not loaded yet. Please try again.')
      return
    }

    setSubmittingTicket(true)
    try {
      const payload = {
        title: ticketForm.title.trim(),
        description: ticketForm.description.trim(),
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: 'OPEN',
        created_by: profile.id,
        organization_id: profile.organization_id || null,
      }

      const { data, error } = await supabase
        .from('help_tickets')
        .insert([payload])
        .select(TICKET_COLUMNS)
        .single()

      if (error) throw error

      setMyTickets((prev) => [data, ...prev])
      setAllTickets((prev) => [data, ...prev])
      success('Ticket created successfully')
      setTicketForm(EMPTY_TICKET_FORM)
      setTicketFormErrors({})
      setTicketModalOpen(false)
    } catch (err) {
      console.error('createTicket error:', err)
      notifyError(err.message || 'Failed to create ticket')
    } finally {
      setSubmittingTicket(false)
    }
  }

  // ---- Create article ----
  const handleCreateArticle = async (e) => {
    e?.preventDefault()
    const errs = {}
    if (!articleForm.title.trim()) errs.title = 'Title is required'
    if (!articleForm.content.trim()) errs.content = 'Content is required'
    setArticleFormErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (!profile?.id) {
      notifyError('Your profile is not loaded yet. Please try again.')
      return
    }

    setSubmittingArticle(true)
    try {
      const payload = {
        title: articleForm.title.trim(),
        content: articleForm.content.trim(),
        category: articleForm.category,
        created_by: profile.id,
        organization_id: profile.organization_id || null,
      }

      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .insert([payload])
        .select(ARTICLE_COLUMNS)
        .single()

      if (error) throw error

      setArticles((prev) => [data, ...prev])
      success('Article created successfully')
      setArticleForm(EMPTY_ARTICLE_FORM)
      setArticleFormErrors({})
      setArticleModalOpen(false)
    } catch (err) {
      console.error('createArticle error:', err)
      notifyError(err.message || 'Failed to create article')
    } finally {
      setSubmittingArticle(false)
    }
  }

  // ---- Assign ticket ----
  const handleAssign = async (ticketId) => {
    setActionLoading(ticketId)
    try {
      const { error } = await supabase
        .from('help_tickets')
        .update({ assigned_to: profile.id })
        .eq('id', ticketId)

      if (error) throw error

      setAllTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, assigned_to: profile.id } : t))
      )
      success('Ticket assigned to you')
    } catch (err) {
      console.error('assignTicket error:', err)
      notifyError('Failed to assign ticket')
    } finally {
      setActionLoading(null)
    }
  }

  // ---- Advance status ----
  const handleAdvanceStatus = async (ticketId, currentStatus) => {
    const nextStatus = STATUS_FLOW[currentStatus]
    if (!nextStatus) return

    setActionLoading(ticketId)
    try {
      const { error } = await supabase
        .from('help_tickets')
        .update({ status: nextStatus })
        .eq('id', ticketId)

      if (error) throw error

      setAllTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
      )
      setMyTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
      )
      success(`Ticket status updated to ${nextStatus.replace(/_/g, ' ').toLowerCase()}`)
    } catch (err) {
      console.error('advanceStatus error:', err)
      notifyError('Failed to update ticket status')
    } finally {
      setActionLoading(null)
    }
  }

  // ---- Form change handlers ----
  const handleTicketFormChange = (field) => (e) => {
    setTicketForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (ticketFormErrors[field]) {
      setTicketFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleArticleFormChange = (field) => (e) => {
    setArticleForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (articleFormErrors[field]) {
      setArticleFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const closeTicketModal = () => {
    setTicketModalOpen(false)
    setTicketForm(EMPTY_TICKET_FORM)
    setTicketFormErrors({})
  }

  const closeArticleModal = () => {
    setArticleModalOpen(false)
    setArticleForm(EMPTY_ARTICLE_FORM)
    setArticleFormErrors({})
  }

  // ---- Shared input classes ----
  const inputClass = (hasError) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
      hasError
        ? 'border-danger-300 dark:border-danger-700'
        : 'border-gray-300 dark:border-gray-700'
    }`

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'
  const selectClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'

  // ---- My Tickets columns ----
  const myTicketColumns = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {row.title || '—'}
          </div>
          {row.description ? (
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {row.description}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.category || '—'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => priorityBadge(row.priority),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.created_at)}
        </span>
      ),
    },
  ]

  // ---- All Tickets columns (admin) ----
  const allTicketColumns = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div className="max-w-xs">
          <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {row.title || '—'}
          </div>
          {row.description ? (
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {row.description}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'requester',
      header: 'Requester',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <User size={14} />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.created_by === profile?.id ? 'You' : row.created_by?.slice(0, 8) || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.category || '—'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => priorityBadge(row.priority),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'assigned_to',
      header: 'Assigned To',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.assigned_to
            ? row.assigned_to === profile?.id
              ? 'You'
              : row.assigned_to.slice(0, 8)
            : 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.assigned_to && (
            <button
              onClick={() => handleAssign(row.id)}
              disabled={actionLoading === row.id}
              className="rounded-lg bg-brand-100 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-200 disabled:opacity-50 dark:bg-brand-900/40 dark:text-brand-400 dark:hover:bg-brand-900/60"
            >
              {actionLoading === row.id ? (
                <Spinner size="sm" className="!h-3 !w-3" />
              ) : (
                'Assign to Me'
              )}
            </button>
          )}
          {STATUS_FLOW[row.status] && (
            <button
              onClick={() => handleAdvanceStatus(row.id, row.status)}
              disabled={actionLoading === row.id}
              title={`Move to ${STATUS_FLOW[row.status].replace(/_/g, ' ').toLowerCase()}`}
              className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {actionLoading === row.id ? (
                <Spinner size="sm" className="!h-3 !w-3" />
              ) : (
                `→ ${STATUS_FLOW[row.status].replace(/_/g, ' ')}`
              )}
            </button>
          )}
        </div>
      ),
    },
  ]

  // ---- Tabs config ----
  const tabs = [
    { id: 'mine', label: 'My Tickets', count: tabCounts.mine },
    ...(isAdmin(profile) ? [{ id: 'all', label: 'All Tickets', count: tabCounts.all }] : []),
    { id: 'kb', label: 'Knowledge Base', count: tabCounts.kb },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help Desk"
        description="Get support, track tickets, and browse the knowledge base"
        icon={LifeBuoy}
        actions={
          activeTab === 'kb' ? (
            <button
              onClick={() => setArticleModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <Plus size={16} />
              New Article
            </button>
          ) : (
            <button
              onClick={() => setTicketModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <Plus size={16} />
              New Ticket
            </button>
          )
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ---- My Tickets Tab ---- */}
      {activeTab === 'mine' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Ticket}
              label="My Open Tickets"
              value={myStats.open}
              color="blue"
              loading={loading}
            />
            <StatCard
              icon={CheckCircle}
              label="My Resolved"
              value={myStats.resolved}
              color="green"
              loading={loading}
            />
            <StatCard
              icon={Clock}
              label="Avg Response Time"
              value="—"
              color="purple"
              loading={loading}
              sublabel="Coming soon"
            />
          </div>

          {/* Table */}
          <DataTable
            columns={myTicketColumns}
            data={myTickets}
            loading={loading}
            emptyIcon={Ticket}
            emptyTitle="No tickets yet"
            emptyDescription="Submit a new ticket to get help from the support team."
          />
        </>
      )}

      {/* ---- All Tickets Tab (admin) ---- */}
      {activeTab === 'all' && isAdmin(profile) && (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={adminSearch}
              onChange={setAdminSearch}
              placeholder="Search tickets..."
              className="sm:w-72"
            />
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={selectClass}
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={selectClass}
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={allTicketColumns}
            data={filteredAllTickets}
            loading={loading && allTickets.length === 0}
            emptyIcon={Ticket}
            emptyTitle="No tickets found"
            emptyDescription={
              adminSearch || statusFilter || priorityFilter
                ? 'Try adjusting your search or filters.'
                : 'No support tickets have been submitted yet.'
            }
          />
        </>
      )}

      {/* ---- Knowledge Base Tab ---- */}
      {activeTab === 'kb' && (
        <>
          {articlesLoading ? (
            <div className="card p-12">
              <Spinner size="lg" />
            </div>
          ) : !articlesTableExists ? (
            <div className="card">
              <EmptyState
                icon={BookOpen}
                title="Knowledge base not available"
                description="The knowledge base hasn't been set up yet. Contact your administrator to enable articles."
              />
            </div>
          ) : articles.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={BookOpen}
                title="No articles yet"
                description="Create your first knowledge base article to help users find answers quickly."
                action={
                  <button
                    onClick={() => setArticleModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    <Plus size={16} />
                    New Article
                  </button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="card p-5 transition hover:shadow-md dark:border dark:border-gray-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                      <FileText size={20} />
                    </div>
                    <StatusBadge
                      status="gray"
                      label={article.category || 'OTHER'}
                    />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
                    {article.title}
                  </h3>
                  {article.content && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {article.content}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>Updated {timeAgo(article.updated_at || article.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- New Ticket Modal ---- */}
      <Modal
        open={ticketModalOpen}
        onClose={closeTicketModal}
        title="New Support Ticket"
        description="Submit a new support request"
        size="lg"
        footer={
          <>
            <button
              onClick={closeTicketModal}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              disabled={submittingTicket}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {submittingTicket ? <Spinner size="sm" className="!h-4 !w-4" /> : <Plus size={16} />}
              {submittingTicket ? 'Creating...' : 'Create Ticket'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass} htmlFor="ticket-title">
              Title <span className="text-danger-500">*</span>
            </label>
            <input
              id="ticket-title"
              type="text"
              value={ticketForm.title}
              onChange={handleTicketFormChange('title')}
              placeholder="Briefly describe your issue"
              className={inputClass(!!ticketFormErrors.title)}
            />
            {ticketFormErrors.title && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                {ticketFormErrors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass} htmlFor="ticket-description">
              Description <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="ticket-description"
              value={ticketForm.description}
              onChange={handleTicketFormChange('description')}
              placeholder="Provide details about your issue..."
              rows={5}
              className={`${inputClass(!!ticketFormErrors.description)} resize-y`}
            />
            {ticketFormErrors.description && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                {ticketFormErrors.description}
              </p>
            )}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ticket-category">
                Category
              </label>
              <select
                id="ticket-category"
                value={ticketForm.category}
                onChange={handleTicketFormChange('category')}
                className={selectClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="ticket-priority">
                Priority
              </label>
              <select
                id="ticket-priority"
                value={ticketForm.priority}
                onChange={handleTicketFormChange('priority')}
                className={selectClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* ---- New Article Modal ---- */}
      <Modal
        open={articleModalOpen}
        onClose={closeArticleModal}
        title="New Knowledge Base Article"
        description="Create a new help article"
        size="lg"
        footer={
          <>
            <button
              onClick={closeArticleModal}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateArticle}
              disabled={submittingArticle}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {submittingArticle ? <Spinner size="sm" className="!h-4 !w-4" /> : <Plus size={16} />}
              {submittingArticle ? 'Creating...' : 'Create Article'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateArticle} className="space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass} htmlFor="article-title">
              Title <span className="text-danger-500">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              value={articleForm.title}
              onChange={handleArticleFormChange('title')}
              placeholder="Article title"
              className={inputClass(!!articleFormErrors.title)}
            />
            {articleFormErrors.title && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                {articleFormErrors.title}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className={labelClass} htmlFor="article-content">
              Content <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="article-content"
              value={articleForm.content}
              onChange={handleArticleFormChange('content')}
              placeholder="Write the article content..."
              rows={8}
              className={`${inputClass(!!articleFormErrors.content)} resize-y`}
            />
            {articleFormErrors.content && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                {articleFormErrors.content}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClass} htmlFor="article-category">
              Category
            </label>
            <select
              id="article-category"
              value={articleForm.category}
              onChange={handleArticleFormChange('category')}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
