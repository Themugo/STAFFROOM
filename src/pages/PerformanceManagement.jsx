import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Plus, Star, Download, ClipboardList, TrendingUp, Target,
  Award, CheckCircle, Clock, BarChart3, ChevronRight, User,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, formatCurrency } from '../lib/format'
import {
  PageHeader, Modal, StatCard, DataTable, StatusBadge,
  EmptyState, Tabs, SearchInput,
} from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'

const TABS = [
  { id: 'reviews', label: 'Reviews' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'goals', label: 'Goals' },
]

const REVIEW_STATUS_FLOW = ['DRAFT', 'SUBMITTED', 'COMPLETED']

const EMPTY_REVIEW = {
  employee_id: '',
  review_period: '',
  rating: 3,
  goals: '',
  comments: '',
}

const EMPTY_PROMOTION = {
  employee_id: '',
  old_position: '',
  new_position: '',
  old_salary: '',
  new_salary: '',
  promotion_date: '',
  reason: '',
}

/* ---------- helpers ---------- */

function RatingStars({ rating, size = 14 }) {
  const value = Number(rating) || 0
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
        {value.toFixed(1)}/5
      </span>
    </div>
  )
}

function nextStatus(current) {
  const idx = REVIEW_STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx === REVIEW_STATUS_FLOW.length - 1) return null
  return REVIEW_STATUS_FLOW[idx + 1]
}

function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ---------- shared field styles ---------- */
const inputClass =
  'input'
const labelClass =
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

/* ============================================================
 *  REVIEWS TAB
 * ============================================================ */
function ReviewsTab({ orgId, onNotify }) {
  const [reviews, setReviews] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_REVIEW)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchReviews = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('performance_reviews')
      .select(`
        id, employee_id, review_period, rating, goals, comments,
        reviewer_id, status, created_at,
        employee:employees(full_name, department:departments(name))
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
    if (error) {
      onNotify?.(error.message || 'Failed to load reviews', 'error')
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }, [orgId, onNotify])

  const fetchEmployees = useCallback(async () => {
    if (!orgId) return
    const { data, error } = await supabase
      .from('employees')
      .select('id, full_name')
      .eq('organization_id', orgId)
      .order('full_name', { ascending: true })
    if (!error) setEmployees(data || [])
  }, [orgId])

  useEffect(() => {
    fetchReviews()
    fetchEmployees()
  }, [fetchReviews, fetchEmployees])

  const stats = useMemo(() => {
    const total = reviews.length
    const completed = reviews.filter((r) => r.status === 'COMPLETED').length
    const inProgress = reviews.filter((r) => r.status === 'SUBMITTED' || r.status === 'DRAFT').length
    const rated = reviews.filter((r) => r.rating != null)
    const avg = rated.length
      ? rated.reduce((s, r) => s + Number(r.rating || 0), 0) / rated.length
      : 0
    return { total, completed, inProgress, avg }
  }, [reviews])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter((r) => {
      const name = r.employee?.full_name || ''
      const dept = r.employee?.department?.name || ''
      const period = r.review_period || ''
      return (
        name.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q) ||
        period.toLowerCase().includes(q)
      )
    })
  }, [reviews, search])

  async function handleCreateReview(e) {
    e.preventDefault()
    if (!form.employee_id || !form.review_period) {
      onNotify?.('Employee and review period are required', 'error')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      rating: Number(form.rating),
      organization_id: orgId,
      status: 'DRAFT',
    }
    const { error } = await supabase.from('performance_reviews').insert(payload)
    setSaving(false)
    if (error) {
      onNotify?.(error.message || 'Failed to create review', 'error')
      return
    }
    onNotify?.('Review created successfully', 'success')
    setForm(EMPTY_REVIEW)
    setModalOpen(false)
    fetchReviews()
  }

  async function handleAdvanceStatus(review) {
    const next = nextStatus(review.status)
    if (!next) return
    setUpdatingId(review.id)
    const { error } = await supabase
      .from('performance_reviews')
      .update({ status: next })
      .eq('id', review.id)
    setUpdatingId(null)
    if (error) {
      onNotify?.(error.message || 'Failed to update status', 'error')
      return
    }
    onNotify?.(`Review moved to ${next}`, 'success')
    fetchReviews()
  }

  function handleExport() {
    const rows = filtered.map((r) => ({
      Employee: r.employee?.full_name || '',
      Department: r.employee?.department?.name || '',
      Period: r.review_period || '',
      Rating: r.rating ?? '',
      Status: r.status || '',
      Reviewer: r.reviewer_id || '',
      Date: formatDate(r.created_at),
    }))
    exportToCSV(`performance-reviews-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    onNotify?.('CSV exported', 'success')
  }

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            {(r.employee?.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {r.employee?.full_name || '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-400">
          {r.employee?.department?.name || '—'}
        </span>
      ),
    },
    {
      key: 'review_period',
      header: 'Period',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-400">{r.review_period || '—'}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r) => <RatingStars rating={r.rating} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-400">
          {r.reviewer_id ? String(r.reviewer_id).slice(0, 8) : '—'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-400">{formatDate(r.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => {
        const next = nextStatus(r.status)
        if (!next) {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600 dark:text-success-400">
              <CheckCircle size={14} /> Done
            </span>
          )
        }
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAdvanceStatus(r)
            }}
            disabled={updatingId === r.id}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {updatingId === r.id ? 'Updating…' : (
              <>
                Advance <ChevronRight size={12} />
              </>
            )}
          </button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Reviews" value={stats.total} color="blue" loading={loading} />
        <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="green" loading={loading} />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="yellow" loading={loading} />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={stats.avg ? stats.avg.toFixed(2) : '—'}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by employee, department, or period…"
          className="sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus size={16} /> New Review
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        keyField="id"
        emptyTitle="No reviews found"
        emptyDescription="Create a new performance review to get started."
        emptyIcon={ClipboardList}
      />

      {/* New Review Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Performance Review"
        description="Start a draft review for an employee."
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateReview}
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Create Review'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateReview} className="space-y-4">
          <div>
            <label className={labelClass}>Employee</label>
            <select
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              className={inputClass}
              required
            >
              <option value="">Select an employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Review Period</label>
            <input
              type="text"
              value={form.review_period}
              onChange={(e) => setForm({ ...form, review_period: e.target.value })}
              placeholder="e.g. Q1 2025, H2 2024"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Rating (1–5)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand-600 dark:bg-gray-700"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    className={n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="w-8 text-sm font-semibold text-gray-900 dark:text-white">
                {form.rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Goals</label>
            <textarea
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              rows={3}
              placeholder="Goals set for this review period…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Comments</label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              rows={3}
              placeholder="Reviewer comments…"
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

/* ============================================================
 *  PROMOTIONS TAB
 * ============================================================ */
function PromotionsTab({ orgId, onNotify }) {
  const [promotions, setPromotions] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_PROMOTION)

  const fetchPromotions = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('promotion_history')
      .select(`
        id, employee_id, old_position, new_position, old_salary,
        new_salary, promotion_date, reason, approved_by,
        employee:employees(full_name)
      `)
      .eq('organization_id', orgId)
      .order('promotion_date', { ascending: false })
    if (error) {
      onNotify?.(error.message || 'Failed to load promotions', 'error')
    } else {
      setPromotions(data || [])
    }
    setLoading(false)
  }, [orgId, onNotify])

  const fetchEmployees = useCallback(async () => {
    if (!orgId) return
    const { data, error } = await supabase
      .from('employees')
      .select('id, full_name')
      .eq('organization_id', orgId)
      .order('full_name', { ascending: true })
    if (!error) setEmployees(data || [])
  }, [orgId])

  useEffect(() => {
    fetchPromotions()
    fetchEmployees()
  }, [fetchPromotions, fetchEmployees])

  const stats = useMemo(() => {
    const total = promotions.length
    const now = new Date()
    const thisYear = promotions.filter((p) => {
      if (!p.promotion_date) return false
      return new Date(p.promotion_date).getFullYear() === now.getFullYear()
    }).length
    const increases = promotions
      .filter((p) => p.old_salary != null && p.new_salary != null)
      .map((p) => Number(p.new_salary) - Number(p.old_salary))
    const avgIncrease = increases.length
      ? increases.reduce((s, v) => s + v, 0) / increases.length
      : 0
    return { total, thisYear, avgIncrease }
  }, [promotions])

  // Group promotions by employee for a progression timeline
  const byEmployee = useMemo(() => {
    const map = new Map()
    for (const p of promotions) {
      const key = p.employee_id
      if (!map.has(key)) {
        map.set(key, {
          employee_id: key,
          employee: p.employee,
          items: [],
        })
      }
      map.get(key).items.push(p)
    }
    // Sort each employee's items oldest -> newest for progression
    for (const entry of map.values()) {
      entry.items.sort((a, b) => new Date(a.promotion_date) - new Date(b.promotion_date))
    }
    return Array.from(map.values())
  }, [promotions])

  async function handleCreatePromotion(e) {
    e.preventDefault()
    if (!form.employee_id || !form.new_position || !form.promotion_date) {
      onNotify?.('Employee, new position, and promotion date are required', 'error')
      return
    }
    setSaving(true)
    const payload = {
      employee_id: form.employee_id,
      old_position: form.old_position || null,
      new_position: form.new_position,
      old_salary: form.old_salary ? Number(form.old_salary) : null,
      new_salary: form.new_salary ? Number(form.new_salary) : null,
      promotion_date: form.promotion_date,
      reason: form.reason || null,
      organization_id: orgId,
    }
    const { error } = await supabase.from('promotion_history').insert(payload)
    setSaving(false)
    if (error) {
      onNotify?.(error.message || 'Failed to create promotion', 'error')
      return
    }
    onNotify?.('Promotion recorded successfully', 'success')
    setForm(EMPTY_PROMOTION)
    setModalOpen(false)
    fetchPromotions()
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Award} label="Total Promotions" value={stats.total} color="purple" loading={loading} />
        <StatCard icon={TrendingUp} label="This Year" value={stats.thisYear} color="blue" loading={loading} />
        <StatCard
          icon={BarChart3}
          label="Avg Salary Increase"
          value={stats.avgIncrease ? formatCurrency(stats.avgIncrease) : '—'}
          color="green"
          loading={loading}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {/* Timeline / list */}
      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-brand-400 dark:border-t-transparent" />
        </div>
      ) : byEmployee.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Award}
            title="No promotions recorded"
            description="Record an employee promotion to start building a career progression timeline."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {byEmployee.map((entry) => (
            <div key={entry.employee_id} className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  {(entry.employee?.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.employee?.full_name || 'Unknown employee'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.items.length} promotion{entry.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <ol className="relative ml-5 border-l border-gray-200 dark:border-gray-700">
                {entry.items.map((p, idx) => {
                  const increase =
                    p.old_salary != null && p.new_salary != null
                      ? Number(p.new_salary) - Number(p.old_salary)
                      : null
                  const pct =
                    p.old_salary != null && Number(p.old_salary) > 0 && p.new_salary != null
                      ? ((Number(p.new_salary) - Number(p.old_salary)) / Number(p.old_salary)) * 100
                      : null
                  return (
                    <li key={p.id} className="mb-6 ml-6 last:mb-0">
                      <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white dark:ring-gray-900">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                              {p.old_position || '—'}
                            </span>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {p.new_position}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(p.promotion_date)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 dark:text-gray-500">Old: </span>
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {p.old_salary != null ? formatCurrency(p.old_salary) : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 dark:text-gray-500">New: </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {p.new_salary != null ? formatCurrency(p.new_salary) : '—'}
                            </span>
                          </div>
                          {increase != null && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 font-medium text-success-700 dark:bg-success-900/40 dark:text-success-400">
                              <TrendingUp size={12} />
                              +{formatCurrency(increase)}
                              {pct != null && ` (${pct.toFixed(1)}%)`}
                            </div>
                          )}
                        </div>

                        {p.reason && (
                          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Reason: </span>
                            {p.reason}
                          </p>
                        )}
                        {p.approved_by && (
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Approved by: {String(p.approved_by).slice(0, 8)}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      )}

      {/* New Promotion Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Promotion"
        description="Log a new promotion for an employee."
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePromotion}
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Record Promotion'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreatePromotion} className="space-y-4">
          <div>
            <label className={labelClass}>Employee</label>
            <select
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              className={inputClass}
              required
            >
              <option value="">Select an employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Old Position</label>
              <input
                type="text"
                value={form.old_position}
                onChange={(e) => setForm({ ...form, old_position: e.target.value })}
                placeholder="Previous role"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Position</label>
              <input
                type="text"
                value={form.new_position}
                onChange={(e) => setForm({ ...form, new_position: e.target.value })}
                placeholder="Promoted role"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Old Salary</label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.old_salary}
                onChange={(e) => setForm({ ...form, old_salary: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Salary</label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.new_salary}
                onChange={(e) => setForm({ ...form, new_salary: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Promotion Date</label>
            <input
              type="date"
              value={form.promotion_date}
              onChange={(e) => setForm({ ...form, promotion_date: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Reason</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
              placeholder="Reason for promotion…"
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

/* ============================================================
 *  GOALS TAB
 * ============================================================ */
function GoalsTab({ orgId, onNotify }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchGoals = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('performance_reviews')
      .select(`
        id, employee_id, goals, review_period, status,
        employee:employees(full_name, department:departments(name))
      `)
      .eq('organization_id', orgId)
      .not('goals', 'is', null)
      .neq('goals', '')
      .order('created_at', { ascending: false })
    if (error) {
      onNotify?.(error.message || 'Failed to load goals', 'error')
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }, [orgId, onNotify])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  async function handleMarkAchieved(review) {
    setUpdatingId(review.id)
    const { error } = await supabase
      .from('performance_reviews')
      .update({ status: 'COMPLETED' })
      .eq('id', review.id)
    setUpdatingId(null)
    if (error) {
      onNotify?.(error.message || 'Failed to update goal', 'error')
      return
    }
    onNotify?.('Goal marked as achieved', 'success')
    fetchGoals()
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-brand-400 dark:border-t-transparent" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon={Target}
          title="No goals recorded"
          description="Goals added to performance reviews will appear here as cards."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => {
        const achieved = r.status === 'COMPLETED'
        return (
          <div
            key={r.id}
            className="card flex flex-col p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  {(r.employee?.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {r.employee?.full_name || '—'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {r.employee?.department?.name || '—'}
                  </p>
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Target size={14} />
              <span>{r.review_period || 'No period'}</span>
            </div>

            <p className="mb-4 flex-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {r.goals}
            </p>

            <button
              onClick={() => handleMarkAchieved(r)}
              disabled={achieved || updatingId === r.id}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                achieved
                  ? 'cursor-default bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400'
                  : 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50'
              }`}
            >
              {achieved ? (
                <>
                  <CheckCircle size={16} /> Achieved
                </>
              ) : updatingId === r.id ? (
                'Updating…'
              ) : (
                <>
                  <CheckCircle size={16} /> Mark as Achieved
                </>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
 *  PAGE
 * ============================================================ */
export default function PerformanceManagement() {
  const { profile } = useAuth()
  const { success, error } = useNotifications()
  const [activeTab, setActiveTab] = useState('reviews')

  const orgId = profile?.organization_id
  const onNotify = useCallback(
    (msg, type) => {
      if (type === 'error') error(msg)
      else success(msg)
    },
    [success, error]
  )

  return (
    <div>
      <PageHeader
        title="Performance Management"
        description="Track performance reviews, promotions, and employee goals."
        icon={BarChart3}
      />

      <div className="mb-6">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'reviews' && <ReviewsTab orgId={orgId} onNotify={onNotify} />}
      {activeTab === 'promotions' && <PromotionsTab orgId={orgId} onNotify={onNotify} />}
      {activeTab === 'goals' && <GoalsTab orgId={orgId} onNotify={onNotify} />}
    </div>
  )
}
