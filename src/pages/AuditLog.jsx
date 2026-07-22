import { useState, useEffect, useMemo } from 'react'
import {
  ScrollText, Activity, Users, TrendingUp, Download,
  ChevronDown, ChevronRight, FileText, Calendar, Filter,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  PageHeader, DataTable, SearchInput, StatCard, EmptyState, Tabs,
} from '../components/ui'
import { formatDateTime, formatDate } from '../lib/format'

// Action badge color mapping
const ACTION_COLORS = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  APPROVE: 'purple',
  REJECT: 'red',
  LOGIN: 'gray',
  LOGOUT: 'gray',
}

const ACTION_BADGE_CLASSES = {
  green: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400',
  blue: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400',
  red: 'bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const ACTION_OPTIONS = ['ALL', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT']

const TAB_FILTERS = {
  all: null,
  changes: ['CREATE', 'UPDATE', 'DELETE'],
  access: ['LOGIN', 'LOGOUT'],
  approvals: ['APPROVE', 'REJECT'],
}

const TABS = [
  { id: 'all', label: 'All Actions' },
  { id: 'changes', label: 'Data Changes' },
  { id: 'access', label: 'Access Logs' },
  { id: 'approvals', label: 'Approvals' },
]

function ActionBadge({ action }) {
  const color = ACTION_COLORS[action] || 'gray'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${ACTION_BADGE_CLASSES[color]}`}>
      {action || 'UNKNOWN'}
    </span>
  )
}

function formatEntityType(type) {
  if (!type) return '—'
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function AuditLog() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Expandable rows
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  async function fetchAuditLogs() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('audit_log_details')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (fetchError) throw fetchError
      setLogs(data || [])
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError(err.message || 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  function toggleRow(id) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Apply all filters
  const filteredLogs = useMemo(() => {
    let result = [...logs]

    // Tab filter
    const tabActions = TAB_FILTERS[activeTab]
    if (tabActions) {
      result = result.filter((log) => tabActions.includes(log.action))
    }

    // Action filter
    if (actionFilter !== 'ALL') {
      result = result.filter((log) => log.action === actionFilter)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((log) => {
        const name = (log.user_name || '').toLowerCase()
        const action = (log.action || '').toLowerCase()
        const entity = (log.entity_type || '').toLowerCase()
        return name.includes(q) || action.includes(q) || entity.includes(q)
      })
    }

    // Date range filter
    if (fromDate) {
      const from = new Date(fromDate)
      from.setHours(0, 0, 0, 0)
      result = result.filter((log) => new Date(log.created_at) >= from)
    }
    if (toDate) {
      const to = new Date(toDate)
      to.setHours(23, 59, 59, 999)
      result = result.filter((log) => new Date(log.created_at) <= to)
    }

    return result
  }, [logs, activeTab, actionFilter, search, fromDate, toDate])

  // Stats computed from the full dataset (not filtered by tab/search)
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = logs.filter((l) => new Date(l.created_at) >= today).length
    const uniqueUsers = new Set(logs.map((l) => l.user_id).filter(Boolean)).size

    // Most common action
    const actionCounts = {}
    logs.forEach((l) => {
      if (l.action) actionCounts[l.action] = (actionCounts[l.action] || 0) + 1
    })
    let mostCommon = '—'
    let maxCount = 0
    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommon = action
      }
    })

    return {
      total: logs.length,
      today: todayCount,
      uniqueUsers,
      mostCommon,
    }
  }, [logs])

  // Tab counts
  const tabCounts = useMemo(() => {
    const count = (actions) => {
      if (!actions) return logs.length
      return logs.filter((l) => actions.includes(l.action)).length
    }
    return {
      all: count(TAB_FILTERS.all),
      changes: count(TAB_FILTERS.changes),
      access: count(TAB_FILTERS.access),
      approvals: count(TAB_FILTERS.approvals),
    }
  }, [logs])

  function exportCSV() {
    const headers = ['User', 'Action', 'Entity Type', 'Entity ID', 'Timestamp', 'IP Address', 'Old Values', 'New Values']
    const rows = filteredLogs.map((log) => [
      log.user_name || '',
      log.action || '',
      log.entity_type || '',
      log.entity_id || '',
      log.created_at ? new Date(log.created_at).toISOString() : '',
      log.ip_address || '',
      log.old_values ? JSON.stringify(log.old_values) : '',
      log.new_values ? JSON.stringify(log.new_values) : '',
    ])

    const escape = (val) => {
      const s = String(val ?? '')
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function clearFilters() {
    setSearch('')
    setActionFilter('ALL')
    setFromDate('')
    setToDate('')
  }

  const hasActiveFilters = search || actionFilter !== 'ALL' || fromDate || toDate

  const columns = [
    {
      key: 'expand',
      header: '',
      width: '40px',
      render: (row) => {
        const hasDetails = row.old_values || row.new_values
        if (!hasDetails) return null
        const expanded = expandedRows.has(row.id)
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleRow(row.id)
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )
      },
    },
    {
      key: 'user_name',
      header: 'User',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">{row.user_name || 'System'}</span>
          {row.user_role && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{row.user_role}</span>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => <ActionBadge action={row.action} />,
    },
    {
      key: 'entity_type',
      header: 'Entity Type',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{formatEntityType(row.entity_type)}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
  ]

  const tabsWithCounts = TABS.map((t) => ({ ...t, count: tabCounts[t.id] }))

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={ScrollText}
          title="Audit Log"
          description="Track all user activities and system changes"
          actions={
            <button
              onClick={exportCSV}
              disabled={filteredLogs.length === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Export CSV
            </button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Activity} label="Total Actions" value={stats.total} color="blue" loading={loading} />
          <StatCard icon={Calendar} label="Today's Actions" value={stats.today} color="green" loading={loading} />
          <StatCard icon={Users} label="Unique Users" value={stats.uniqueUsers} color="purple" loading={loading} />
          <StatCard
            icon={TrendingUp}
            label="Most Common Action"
            value={stats.mostCommon}
            color="cyan"
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabsWithCounts} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by user, action, or entity type..."
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="input"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'ALL' ? 'All Actions' : opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="input"
                aria-label="From date"
              />
              <span className="text-gray-400">—</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="input"
                aria-label="To date"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="card p-6 mb-6 border-danger-200 dark:border-danger-800">
            <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
            <button onClick={fetchAuditLogs} className="btn-primary mt-3 text-sm">
              Retry
            </button>
          </div>
        )}

        {/* Results count */}
        {!error && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </p>
        )}

        {/* Audit Log Table */}
        {!error && (
          <DataTable
            columns={columns}
            data={filteredLogs}
            loading={loading}
            keyField="id"
            emptyTitle="No audit logs found"
            emptyDescription={hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'No audit events have been recorded yet.'}
            emptyIcon={FileText}
          />
        )}

        {/* Expandable details rendered below the table for expanded rows */}
        {!error && !loading && filteredLogs.length > 0 && (
          <div className="mt-4 space-y-3">
            {filteredLogs
              .filter((log) => expandedRows.has(log.id) && (log.old_values || log.new_values))
              .map((log) => (
                <div key={log.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Details — {log.user_name || 'System'} • {log.action} • {formatEntityType(log.entity_type)}
                    </h4>
                    <button
                      onClick={() => toggleRow(log.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Old Values
                      </p>
                      <pre className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto max-h-64">
                        {log.old_values ? JSON.stringify(log.old_values, null, 2) : '—'}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        New Values
                      </p>
                      <pre className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto max-h-64">
                        {log.new_values ? JSON.stringify(log.new_values, null, 2) : '—'}
                      </pre>
                    </div>
                  </div>
                  {(log.ip_address || log.user_agent) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      {log.user_agent && <span className="truncate max-w-md">User Agent: {log.user_agent}</span>}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
