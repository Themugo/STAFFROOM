import { useEffect, useState, useMemo, useCallback } from 'react'
import { Receipt, Plus, CheckCircle, XCircle, FileText, Wallet, Clock, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'
import DataTable from '../components/ui/DataTable'
import SearchInput from '../components/ui/SearchInput'
import Tabs from '../components/ui/Tabs'
import Spinner from '../components/ui/Spinner'

const EMPTY_FORM = {
  title: '',
  total_amount: '',
  description: '',
}

export default function ExpenseClaims() {
  const { profile } = useAuth()
  const { success, error: errorNotify } = useNotifications()

  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [actionLoading, setActionLoading] = useState(null)

  // ---- Fetch ----
  const fetchClaims = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('expense_claims')
        .select(`
          id,
          employee_id,
          employee:employees(full_name),
          title,
          description,
          total_amount,
          currency,
          status,
          submitted_at,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClaims(data || [])
    } catch (err) {
      console.error('fetchClaims error:', err)
      errorNotify('Failed to load expense claims')
    } finally {
      setLoading(false)
    }
  }, [errorNotify])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  // ---- Stats ----
  const stats = useMemo(() => {
    const total = claims.length
    const pending = claims.filter((c) => c.status === 'PENDING').length
    const approved = claims.filter((c) => c.status === 'APPROVED').length
    const totalAmount = claims
      .filter((c) => c.status === 'APPROVED')
      .reduce((sum, c) => sum + Number(c.total_amount || 0), 0)
    return { total, pending, approved, totalAmount }
  }, [claims])

  // ---- Tab counts ----
  const tabCounts = useMemo(
    () => ({
      all: claims.length,
      pending: claims.filter((c) => c.status === 'PENDING').length,
      approved: claims.filter((c) => c.status === 'APPROVED').length,
      rejected: claims.filter((c) => c.status === 'REJECTED').length,
    }),
    [claims]
  )

  // ---- Filtered rows ----
  const filteredClaims = useMemo(() => {
    let result = claims
    if (activeTab === 'pending') result = result.filter((c) => c.status === 'PENDING')
    else if (activeTab === 'approved') result = result.filter((c) => c.status === 'APPROVED')
    else if (activeTab === 'rejected') result = result.filter((c) => c.status === 'REJECTED')

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.employee?.full_name?.toLowerCase().includes(q) ||
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [claims, activeTab, search])

  // ---- Create claim ----
  const handleCreateClaim = async (e) => {
    e.preventDefault()
    if (!form.title || !form.total_amount) {
      errorNotify('Please fill in all required fields')
      return
    }
    if (!profile?.id) {
      errorNotify('Your profile is not loaded yet. Please try again.')
      return
    }
    if (!profile?.organization_id) {
      errorNotify('Your organization is not set. Please contact an administrator.')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('expense_claims')
        .insert({
          employee_id: profile.id,
          organization_id: profile.organization_id,
          title: form.title,
          description: form.description || null,
          total_amount: Number(form.total_amount),
          status: 'PENDING',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Refetch to pull in the joined employee name
      await fetchClaims()
      setForm(EMPTY_FORM)
      setModalOpen(false)
      success('Expense claim submitted successfully')
    } catch (err) {
      console.error('createClaim error:', err)
      errorNotify(err.message || 'Failed to submit claim')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Approve / Reject ----
  const updateClaimStatus = async (id, status) => {
    setActionLoading(id)
    try {
      const { error } = await supabase
        .from('expense_claims')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
      success(`Claim ${status.toLowerCase()} successfully`)
    } catch (err) {
      console.error('updateClaimStatus error:', err)
      errorNotify(`Failed to ${status.toLowerCase()} claim`)
    } finally {
      setActionLoading(null)
    }
  }

  // ---- Table columns ----
  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            {(row.employee?.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {row.employee?.full_name || 'Unknown'}
          </span>
        </div>
      ),
    },
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
      key: 'total_amount',
      header: 'Amount',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.total_amount, row.currency || 'KES')}
        </span>
      ),
    },
    {
      key: 'submitted_at',
      header: 'Date',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.submitted_at)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'PENDING' ? (
            <>
              <button
                onClick={() => updateClaimStatus(row.id, 'APPROVED')}
                disabled={actionLoading === row.id}
                title="Approve"
                className="flex items-center gap-1 rounded-lg bg-success-100 px-2.5 py-1.5 text-xs font-medium text-success-700 transition hover:bg-success-200 disabled:opacity-50 dark:bg-success-900/40 dark:text-success-400 dark:hover:bg-success-900/60"
              >
                {actionLoading === row.id ? (
                  <Spinner size="sm" className="!h-3 !w-3" />
                ) : (
                  <CheckCircle size={14} />
                )}
                Approve
              </button>
              <button
                onClick={() => updateClaimStatus(row.id, 'REJECTED')}
                disabled={actionLoading === row.id}
                title="Reject"
                className="flex items-center gap-1 rounded-lg bg-danger-100 px-2.5 py-1.5 text-xs font-medium text-danger-700 transition hover:bg-danger-200 disabled:opacity-50 dark:bg-danger-900/40 dark:text-danger-400 dark:hover:bg-danger-900/60"
              >
                {actionLoading === row.id ? (
                  <Spinner size="sm" className="!h-3 !w-3" />
                ) : (
                  <XCircle size={14} />
                )}
                Reject
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">No actions</span>
          )}
        </div>
      ),
    },
  ]

  const tabs = [
    { id: 'all', label: 'All Claims', count: tabCounts.all },
    { id: 'pending', label: 'Pending', count: tabCounts.pending },
    { id: 'approved', label: 'Approved', count: tabCounts.approved },
    { id: 'rejected', label: 'Rejected', count: tabCounts.rejected },
  ]

  return (
    <div>
      <PageHeader
        title="Expense Claims"
        description="Submit and manage employee expense reimbursement requests"
        icon={Receipt}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <Plus size={18} />
            New Claim
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          icon={FileText}
          label="Total Claims"
          value={stats.total}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="yellow"
          loading={loading}
        />
        <StatCard
          icon={CheckCircle}
          label="Approved"
          value={stats.approved}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={Wallet}
          label="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          color="purple"
          loading={loading}
          sublabel="Approved claims"
        />
      </div>

      {/* Tabs + Search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by employee, title, or description..."
          className="sm:w-80"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredClaims}
        loading={loading}
        emptyIcon={Receipt}
        emptyTitle="No expense claims found"
        emptyDescription={
          search
            ? 'Try adjusting your search or filters.'
            : 'Submit a new expense claim to get started.'
        }
      />

      {/* New Claim Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Expense Claim"
        description="Submit a new expense reimbursement request"
        size="md"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateClaim}
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {submitting ? <Spinner size="sm" className="!h-4 !w-4" /> : <Check size={16} />}
              Submit Claim
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateClaim} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Travel to client site"
              required
              className="input"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount <span className="text-danger-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.total_amount}
              onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
              placeholder="0.00"
              required
              className="input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the expense..."
              rows={4}
              className="input resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
