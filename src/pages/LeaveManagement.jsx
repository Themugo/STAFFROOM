import { useEffect, useState, useMemo } from 'react'
import {
  Plus, Check, X as XIcon, Calendar, Clock, CheckCircle, XCircle, Filter,
  Download, CalendarDays, List, ChevronLeft, ChevronRight, Wallet,
  UserCheck, MessageSquare, History,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, formatDateTime } from '../lib/format'
import { StatCard, Modal, DataTable, SearchInput, StatusBadge, EmptyState, PageHeader } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, dot: 'bg-amber-500' },
  APPROVED: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
  REJECTED: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, dot: 'bg-red-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle, dot: 'bg-gray-400' },
}

const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Annual Leave', color: 'blue' },
  { value: 'SICK', label: 'Sick Leave', color: 'red' },
  { value: 'MATERNITY', label: 'Maternity', color: 'pink' },
  { value: 'PATERNITY', label: 'Paternity', color: 'purple' },
  { value: 'UNPAID', label: 'Unpaid Leave', color: 'gray' },
  { value: 'COMPASSIONATE', label: 'Compassionate', color: 'amber' },
]

const LEAVE_TYPE_BADGE = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

const LEAVE_TYPE_DOT = {
  ANNUAL: 'bg-blue-500',
  SICK: 'bg-red-500',
  MATERNITY: 'bg-pink-500',
  PATERNITY: 'bg-purple-500',
  UNPAID: 'bg-gray-500',
  COMPASSIONATE: 'bg-amber-500',
}

const EMPTY = { employee_id: '', leave_type: 'ANNUAL', start_date: '', end_date: '', reason: '' }

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Multi-level approval workflow configuration
const TOTAL_STEPS = 3
const APPROVAL_STEPS = [
  { step: 1, role: 'Supervisor', icon: UserCheck },
  { step: 2, role: 'Department Manager', icon: UserCheck },
  { step: 3, role: 'HR', icon: UserCheck },
]



/**
 * Build a multi-step status label for a leave request.
 * PENDING requests show the current step; APPROVED/REJECTED show their label.
 */
function multiStepStatusLabel(r) {
  if (r.status === 'PENDING') {
    const step = r.current_approval_step ?? 1
    return `Pending - Step ${step} of ${TOTAL_STEPS}`
  }
  return STATUS_CONFIG[r.status]?.label || r.status
}

/**
 * Approval Timeline component — renders the approval_history JSONB array
 * as a vertical timeline showing each step's state.
 */
function ApprovalTimeline({ request }) {
  const history = Array.isArray(request?.approval_history) ? request.approval_history : []
  const currentStep = request?.current_approval_step ?? 1
  const isRejected = request?.status === 'REJECTED'

  // Build a map: step -> history entry
  const stepMap = new Map()
  for (const h of history) {
    if (h && h.step != null) stepMap.set(h.step, h)
  }

  return (
    <div className="space-y-0">
      {APPROVAL_STEPS.map((s, idx) => {
        const entry = stepMap.get(s.step)
        const isCurrent = s.step === currentStep && request?.status === 'PENDING'
        const isFuture = s.step > currentStep && request?.status === 'PENDING'
        const isPast = s.step < currentStep
        // If rejected at this step
        const rejectedHere = entry?.action === 'REJECTED'

        let state // 'approved' | 'rejected' | 'pending' | 'future'
        if (entry?.action === 'APPROVED') state = 'approved'
        else if (entry?.action === 'REJECTED') state = 'rejected'
        else if (isCurrent) state = 'pending'
        else if (isFuture || (isRejected && s.step > currentStep)) state = 'future'
        else if (isPast) state = 'approved' // past step with no entry (shouldn't normally happen)
        else state = 'future'

        const isLast = idx === APPROVAL_STEPS.length - 1

        // Icon + color per state
        const iconClasses = {
          approved: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
          rejected: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
          pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
          future: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
        }[state]

        const lineClass = state === 'approved'
          ? 'bg-green-300 dark:bg-green-700'
          : 'bg-gray-200 dark:bg-gray-700'

        const labelClass = {
          approved: 'text-gray-900 dark:text-gray-100',
          rejected: 'text-red-600 dark:text-red-400',
          pending: 'text-amber-600 dark:text-amber-400',
          future: 'text-gray-400 dark:text-gray-500',
        }[state]

        const statusText = {
          approved: 'Approved',
          rejected: 'Rejected',
          pending: 'Pending',
          future: 'Not yet started',
        }[state]

        return (
          <div key={s.step} className="flex gap-3">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClasses} flex-shrink-0`}>
                {state === 'approved' && <Check size={18} />}
                {state === 'rejected' && <XIcon size={18} />}
                {state === 'pending' && <Clock size={18} />}
                {state === 'future' && <span className="text-xs font-semibold">{s.step}</span>}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[2rem] ${lineClass} my-1`} />
              )}
            </div>
            {/* Content */}
            <div className={`flex-1 ${isLast ? '' : 'pb-4'}`}>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className={`font-medium text-sm ${labelClass}`}>
                  Step {s.step}: {s.role}
                </p>
                <span className={`text-xs font-medium ${labelClass}`}>{statusText}</span>
              </div>
              {entry && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.approver_name || 'Unknown approver'} · {formatDateTime(entry.timestamp)}
                  </p>
                  {entry.comment && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                      "{entry.comment}"
                    </p>
                  )}
                </div>
              )}
              {state === 'pending' && !entry && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Awaiting approval
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function LeaveManagement() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [balances, setBalances] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'add' | 'approve' | 'reject' | 'detail'
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  // Approval modal state
  const [activeRequest, setActiveRequest] = useState(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [filterStatus, filterType])

  async function load() {
    setLoading(true)
    let q = supabase.from('leave_requests')
      .select('*, employee:employees(id, full_name, department:departments(id, name))')
      .order('created_at', { ascending: false })

    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    if (filterType !== 'all') q = q.eq('leave_type', filterType)

    const [leaveRes, empRes, balRes] = await Promise.all([
      q,
      supabase.from('employees').select('id, full_name').eq('status', 'ACTIVE').order('full_name'),
      supabase.from('leave_balances')
        .select('id, employee_id, leave_type_id, allocated_days, used_days, carried_over_days, remaining_days')
        .order('leave_type_id'),
    ])
    setRequests(leaveRes.data ?? [])
    setEmployees(empRes.data ?? [])
    // Gracefully skip if table empty or missing
    setBalances(balRes.error || !balRes.data ? [] : balRes.data)
    setLoading(false)
  }

  const filtered = requests.filter(r =>
    r.employee?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.reason?.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  }

  // Group balances by employee for display
  const balancesByEmployee = useMemo(() => {
    const map = new Map()
    for (const b of balances) {
      if (!map.has(b.employee_id)) map.set(b.employee_id, [])
      map.get(b.employee_id).push(b)
    }
    return map
  }, [balances])

  function days(start, end) {
    const d = (new Date(end) - new Date(start)) / 86400000
    const n = Math.round(d + 1)
    return d >= 0 ? `${n} day${n !== 1 ? 's' : ''}` : '—'
  }

  /**
   * Multi-step approval action.
   * Appends to approval_history, increments current_approval_step,
   * and sets status to APPROVED if the final step is reached.
   * Logs the action via the log_audit_action RPC.
   */
  async function performApproval(request, action, comment) {
    if (!request) return
    setProcessing(true)
    setError('')

    const currentStep = request.current_approval_step ?? 1
    const existingHistory = Array.isArray(request.approval_history) ? request.approval_history : []

    const newEntry = {
      approver_id: profile?.id,
      approver_name: profile?.full_name,
      action, // 'APPROVED' or 'REJECTED'
      step: currentStep,
      timestamp: new Date().toISOString(),
      comment: comment || '',
    }

    const updatedHistory = [...existingHistory, newEntry]

    let newStatus = 'PENDING'
    let newStep = currentStep

    if (action === 'APPROVED') {
      if (currentStep >= TOTAL_STEPS) {
        newStatus = 'APPROVED'
        newStep = currentStep
      } else {
        newStatus = 'PENDING'
        newStep = currentStep + 1
      }
    } else {
      // REJECTED
      newStatus = 'REJECTED'
      newStep = currentStep
    }

    const { error: updateError } = await supabase
      .from('leave_requests')
      .update({
        status: newStatus,
        current_approval_step: newStep,
        approval_history: updatedHistory,
      })
      .eq('id', request.id)

    if (updateError) {
      setError(updateError.message)
      setProcessing(false)
      return
    }

    // Audit log
    try {
      await supabase.rpc('log_audit_action', {
        p_action: action,
        p_entity_type: 'Leave Request',
        p_entity_id: request.id,
      })
    } catch {
      // Audit logging is best-effort; don't block the workflow
    }

    setProcessing(false)
    setModal(null)
    setActiveRequest(null)
    setApprovalComment('')
    load()
  }

  async function handleApprove(request) {
    if (request.employee_id === profile?.id) {
      setError('You cannot approve your own leave request')
      return
    }
    setActiveRequest(request)
    setApprovalComment('')
    setError('')
    setModal('approve')
  }

  async function handleReject(request) {
    if (request.employee_id === profile?.id) {
      setError('You cannot approve your own leave request')
      return
    }
    setActiveRequest(request)
    setApprovalComment('')
    setError('')
    setModal('reject')
  }

  function handleViewDetail(request) {
    setActiveRequest(request)
    setModal('detail')
  }

  async function handleBulkApprove() {
    const ids = [...selected]
    if (!ids.length) return
    // Bulk approve applies a single-step approval for each selected request
    const updates = filtered
      .filter(r => ids.includes(r.id) && r.status === 'PENDING')
      .map(r => {
        const currentStep = r.current_approval_step ?? 1
        const existingHistory = Array.isArray(r.approval_history) ? r.approval_history : []
        const newEntry = {
          approver_id: profile?.id,
          approver_name: profile?.full_name,
          action: 'APPROVED',
          step: currentStep,
          timestamp: new Date().toISOString(),
          comment: 'Bulk approved',
        }
        const updatedHistory = [...existingHistory, newEntry]
        const isFinal = currentStep >= TOTAL_STEPS
        return {
          id: r.id,
          status: isFinal ? 'APPROVED' : 'PENDING',
          current_approval_step: isFinal ? currentStep : currentStep + 1,
          approval_history: updatedHistory,
        }
      })

    for (const u of updates) {
      const { id, ...patch } = u
      await supabase.from('leave_requests').update(patch).eq('id', id)
      try {
        await supabase.rpc('log_audit_action', {
          p_action: 'APPROVE',
          p_entity_type: 'Leave Request',
          p_entity_id: id,
        })
      } catch {
        // best-effort
      }
    }
    setSelected(new Set())
    load()
  }

  async function handleBulkReject() {
    const ids = [...selected]
    if (!ids.length) return
    const updates = filtered
      .filter(r => ids.includes(r.id) && r.status === 'PENDING')
      .map(r => {
        const currentStep = r.current_approval_step ?? 1
        const existingHistory = Array.isArray(r.approval_history) ? r.approval_history : []
        const newEntry = {
          approver_id: profile?.id,
          approver_name: profile?.full_name,
          action: 'REJECTED',
          step: currentStep,
          timestamp: new Date().toISOString(),
          comment: 'Bulk rejected',
        }
        return {
          id: r.id,
          status: 'REJECTED',
          current_approval_step: currentStep,
          approval_history: [...existingHistory, newEntry],
        }
      })

    for (const u of updates) {
      const { id, ...patch } = u
      await supabase.from('leave_requests').update(patch).eq('id', id)
      try {
        await supabase.rpc('log_audit_action', {
          p_action: 'REJECT',
          p_entity_type: 'Leave Request',
          p_entity_id: id,
        })
      } catch {
        // best-effort
      }
    }
    setSelected(new Set())
    load()
  }

  function toggleRow(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    const pendingIds = filtered.filter(r => r.status === 'PENDING').map(r => r.id)
    const allSelected = pendingIds.length > 0 && pendingIds.every(id => selected.has(id))
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        pendingIds.forEach(id => next.delete(id))
        return next
      })
    } else {
      setSelected(prev => new Set([...prev, ...pendingIds]))
    }
  }

  async function handleSave() {
    if (!form.employee_id || !form.start_date || !form.end_date) {
      setError('Employee, start date, and end date are required.')
      return
    }
    setSaving(true)
    setError('')
    const { error } = await supabase.from('leave_requests').insert({
      employee_id: form.employee_id,
      leave_type: form.leave_type,
      start_date: form.start_date,
      end_date: form.end_date,
      reason: form.reason,
      status: 'PENDING',
      current_approval_step: 1,
      approval_history: [],
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal(null)
    load()
  }

  // CSV Export
  function exportCSV() {
    const headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Step', 'Reason']
    const rows = filtered.map(r => [
      r.employee?.full_name || 'Unknown',
      LEAVE_TYPES.find(t => t.value === r.leave_type)?.label || r.leave_type,
      formatDate(r.start_date),
      formatDate(r.end_date),
      STATUS_CONFIG[r.status]?.label || r.status,
      r.status === 'PENDING' ? `Step ${r.current_approval_step ?? 1} of ${TOTAL_STEPS}` : '',
      (r.reason || '').replace(/"/g, '""'),
    ])
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leave-requests-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Calendar helpers
  const calendarCells = useMemo(() => {
    const year = calMonth.getFullYear()
    const month = calMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startWeekday = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)

    // Map date string -> leaves on that day
    const leavesByDay = new Map()
    for (const r of requests) {
      if (r.status !== 'APPROVED' && r.status !== 'PENDING') continue
      const start = new Date(r.start_date)
      const end = new Date(r.end_date)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().slice(0, 10)
        if (!leavesByDay.has(ds)) leavesByDay.set(ds, [])
        leavesByDay.get(ds).push(r)
      }
    }

    const cells = []
    // Leading blanks
    for (let i = 0; i < startWeekday; i++) cells.push({ blank: true })
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().slice(0, 10)
      const dayLeaves = leavesByDay.get(dateStr) || []
      cells.push({
        day,
        dateStr,
        isToday: dateStr === todayStr,
        leaves: dayLeaves,
        hasApproved: dayLeaves.some(l => l.status === 'APPROVED'),
        hasPending: dayLeaves.some(l => l.status === 'PENDING'),
      })
    }
    return cells
  }, [calMonth, requests])

  const pendingSelectedCount = [...selected].filter(id =>
    filtered.some(r => r.id === id && r.status === 'PENDING')
  ).length

  const allPendingSelected = filtered.filter(r => r.status === 'PENDING').length > 0 &&
    filtered.filter(r => r.status === 'PENDING').every(r => selected.has(r.id))

  const columns = [
    {
      key: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={allPendingSelected}
          onChange={toggleAll}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
        />
      ),
      render: (r) => (
        <input
          type="checkbox"
          checked={selected.has(r.id)}
          onChange={() => toggleRow(r.id)}
          disabled={r.status !== 'PENDING'}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800"
        />
      ),
      width: '40px',
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold dark:from-brand-600 dark:to-brand-700">
            {r.employee?.full_name?.[0] || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{r.employee?.full_name || 'Unknown'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{r.employee?.department?.name || 'No department'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'leave_type',
      header: 'Type',
      render: (r) => {
        const leaveType = LEAVE_TYPES.find(t => t.value === r.leave_type)
        return (
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${LEAVE_TYPE_BADGE[leaveType?.color] || LEAVE_TYPE_BADGE.gray}`}>
            {leaveType?.label || r.leave_type}
          </span>
        )
      },
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (r) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{days(r.start_date, r.end_date)}</span>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (r) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
          <span>{formatDate(r.start_date)}</span>
          <span className="text-gray-400 dark:text-gray-500">→</span>
          <span>{formatDate(r.end_date)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={r.status} label={multiStepStatusLabel(r)} />
          {r.delegated_by && (
            <span
              title={`Approved on behalf of ${r.delegated_by}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
            >
              <UserCheck size={12} /> Approved by delegate
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetail(r)}
            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            title="View details & approval history"
          >
            <History size={16} />
          </button>
          {r.status === 'PENDING' ? (
            <>
              <button
                onClick={() => handleApprove(r)}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition font-medium text-sm dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => handleReject(r)}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                title="Reject"
              >
                <XIcon size={16} />
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Approve and manage leave requests with multi-level workflow"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  view === 'list'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <List size={16} /> List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  view === 'calendar'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <CalendarDays size={16} /> Calendar
              </button>
            </div>
            <button onClick={exportCSV} className="btn-secondary">
              <Download size={18} className="mr-2" /> Export
            </button>
            <button onClick={() => { setForm(EMPTY); setError(''); setModal('add') }} className="btn-primary">
              <Plus size={18} className="mr-2" /> New Request
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Requests" value={stats.total} color="blue" loading={loading} />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="yellow" loading={loading} />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="green" loading={loading} />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="red" loading={loading} />
      </div>

      {/* Leave Balances */}
      {balances.length > 0 && (
        <div className="card p-5 dark:bg-gray-900 dark:border dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-brand-600 dark:text-brand-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Leave Balances</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {employees.map(emp => {
              const empBalances = balancesByEmployee.get(emp.id) || []
              if (!empBalances.length) return null
              return (
                <div
                  key={emp.id}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">{emp.full_name}</p>
                  <div className="space-y-1.5">
                    {empBalances.map(b => {
                      const lt = LEAVE_TYPES.find(t => t.value === b.leave_type_id)
                      const remaining = b.remaining_days ?? 0
                      return (
                        <div key={b.id} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <span className={`h-2 w-2 rounded-full ${LEAVE_TYPE_DOT[b.leave_type_id] || 'bg-gray-400'}`} />
                            {lt?.label || b.leave_type_id}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {remaining} left
                            <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
                              / {b.balance ?? 0}
                            </span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by employee name..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <select
              className="input w-36 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <select
              className="input w-36 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {LEAVE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['all', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
              {s !== 'all' && (
                <span className="ml-1.5 opacity-75">({s === 'PENDING' ? stats.pending : s === 'APPROVED' ? stats.approved : stats.rejected})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {pendingSelectedCount > 0 && (
        <div className="animate-fade-in-down flex items-center justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-800 dark:bg-brand-900/30">
          <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
            {pendingSelectedCount} pending request{pendingSelectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              <Check size={16} /> Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              <XIcon size={16} /> Reject Selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyIcon={Calendar}
          emptyTitle="No leave requests found"
          emptyDescription="Try adjusting your filters or create a new leave request."
        />
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="card p-5 dark:bg-gray-900 dark:border dark:border-gray-800">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {calMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => { const d = new Date(); setCalMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Today
              </button>
              <button
                onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, i) =>
              cell.blank ? (
                <div key={`blank-${i}`} className="min-h-[80px] rounded-lg" />
              ) : (
                <div
                  key={cell.dateStr}
                  className={`min-h-[80px] rounded-lg border p-1.5 transition ${
                    cell.isToday
                      ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20'
                      : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800/30'
                  }`}
                >
                  <div className={`text-xs font-medium mb-1 ${cell.isToday ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {cell.day}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cell.leaves.slice(0, 3).map((l, idx) => (
                      <span
                        key={idx}
                        title={`${l.employee?.full_name || 'Unknown'} — ${LEAVE_TYPES.find(t => t.value === l.leave_type)?.label || l.leave_type}`}
                        className={`h-2 w-2 rounded-full ${
                          l.status === 'APPROVED' ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                      />
                    ))}
                    {cell.leaves.length > 3 && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">+{cell.leaves.length - 3}</span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Calendar empty state */}
          {!loading && filtered.length === 0 && (
            <div className="mt-4">
              <EmptyState icon={Calendar} title="No leave requests" description="No leave requests to display on the calendar." />
            </div>
          )}
        </div>
      )}

      {/* New Request Modal */}
      <Modal
        open={modal === 'add'}
        onClose={() => setModal(null)}
        title="New Leave Request"
        size="md"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Employee *</label>
            <select
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={form.employee_id}
              onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
            >
              <option value="">— Select Employee —</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label dark:text-gray-300">Leave Type</label>
            <div className="grid grid-cols-3 gap-2">
              {LEAVE_TYPES.map(t => (
                <label
                  key={t.value}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition text-sm ${
                    form.leave_type === t.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="leave_type"
                    value={t.value}
                    checked={form.leave_type === t.value}
                    onChange={() => setForm(f => ({ ...f, leave_type: t.value }))}
                    className="sr-only"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-300">Start Date *</label>
              <input
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                type="date"
                value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="label dark:text-gray-300">End Date *</label>
              <input
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                type="date"
                value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label dark:text-gray-300">Reason</label>
            <textarea
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              rows={3}
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Brief reason for leave request..."
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* Approval Modal (Approve / Reject) */}
      <Modal
        open={modal === 'approve' || modal === 'reject'}
        onClose={() => { setModal(null); setActiveRequest(null); setApprovalComment('') }}
        title={modal === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        size="md"
        footer={
          <>
            <button
              onClick={() => { setModal(null); setActiveRequest(null); setApprovalComment('') }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => performApproval(
                activeRequest,
                modal === 'approve' ? 'APPROVED' : 'REJECTED',
                approvalComment
              )}
              className={modal === 'approve' ? 'btn-primary' : 'btn-danger'}
              disabled={processing}
            >
              {processing
                ? 'Processing...'
                : modal === 'approve'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        {activeRequest && (
          <div className="space-y-4">
            {/* Request summary */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold dark:from-brand-600 dark:to-brand-700">
                  {activeRequest.employee?.full_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {activeRequest.employee?.full_name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {LEAVE_TYPES.find(t => t.value === activeRequest.leave_type)?.label || activeRequest.leave_type}
                    {' · '}
                    {formatDate(activeRequest.start_date)} → {formatDate(activeRequest.end_date)}
                  </p>
                </div>
              </div>
              {activeRequest.reason && (
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  "{activeRequest.reason}"
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge
                  status={activeRequest.status}
                  label={multiStepStatusLabel(activeRequest)}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  You are acting as: {APPROVAL_STEPS[(activeRequest.current_approval_step ?? 1) - 1]?.role || 'Approver'}
                </span>
              </div>
            </div>

            {/* Approval comment */}
            <div>
              <label className="label dark:text-gray-300 flex items-center gap-1.5">
                <MessageSquare size={14} />
                Comment {modal === 'reject' ? '(required)' : '(optional)'}
              </label>
              <textarea
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                rows={3}
                value={approvalComment}
                onChange={e => setApprovalComment(e.target.value)}
                placeholder={
                  modal === 'approve'
                    ? 'Add a note for the approval record...'
                    : 'Please provide a reason for rejection...'
                }
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Detail Modal — shows approval history timeline */}
      <Modal
        open={modal === 'detail'}
        onClose={() => { setModal(null); setActiveRequest(null) }}
        title="Leave Request Details"
        size="md"
        footer={
          <>
            <button
              onClick={() => { setModal(null); setActiveRequest(null) }}
              className="btn-secondary"
            >
              Close
            </button>
            {activeRequest?.status === 'PENDING' && (
              <>
                <button
                  onClick={() => { setModal('reject'); setApprovalComment('') }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                  <XIcon size={16} /> Reject
                </button>
                <button
                  onClick={() => { setModal('approve'); setApprovalComment('') }}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                >
                  <Check size={16} /> Approve
                </button>
              </>
            )}
          </>
        }
      >
        {activeRequest && (
          <div className="space-y-4">
            {/* Request summary */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold dark:from-brand-600 dark:to-brand-700">
                  {activeRequest.employee?.full_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {activeRequest.employee?.full_name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeRequest.employee?.department?.name || 'No department'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Leave Type</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {LEAVE_TYPES.find(t => t.value === activeRequest.leave_type)?.label || activeRequest.leave_type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {days(activeRequest.start_date, activeRequest.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(activeRequest.start_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(activeRequest.end_date)}</p>
                </div>
              </div>
              {activeRequest.reason && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 italic">"{activeRequest.reason}"</p>
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <StatusBadge
                  status={activeRequest.status}
                  label={multiStepStatusLabel(activeRequest)}
                />
                {activeRequest.delegated_by && (
                  <span
                    title={`Approved on behalf of ${activeRequest.delegated_by}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  >
                    <UserCheck size={12} /> Approved by delegate
                  </span>
                )}
              </div>
            </div>

            {/* Approval History Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History size={16} className="text-gray-500 dark:text-gray-400" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Approval History
                </h4>
              </div>
              <ApprovalTimeline request={activeRequest} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
