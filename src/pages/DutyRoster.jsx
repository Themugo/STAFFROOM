import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  CalendarRange, Plus, Eye, Send, Download, ArrowLeft, Clock, Users, FileText, CheckCircle2, Pencil,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'

const EMPTY_ROSTER = {
  name: '',
  description: '',
  department_id: '',
  start_date: '',
  end_date: '',
  status: 'DRAFT',
}

const EMPTY_ENTRY = {
  shift_start: '09:00',
  shift_end: '17:00',
  shift_type: 'MORNING',
  notes: '',
}

const SHIFT_TYPE_COLORS = {
  MORNING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  AFTERNOON: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  NIGHT: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  FULL_DAY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  OFF: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

function parseDate(iso) {
  // Parse as local date (avoid timezone shifting the day)
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function diffDays(start, end) {
  const ms = parseDate(end).getTime() - parseDate(start).getTime()
  return Math.floor(ms / 86400000)
}

function formatTimeShort(time) {
  if (!time) return '—'
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export default function DutyRoster() {
  const { profile } = useAuth()
  const { success, error: errorNotify } = useNotifications()

  const [rosters, setRosters] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalShifts: 0 })

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_ROSTER)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  // Detail view
  const [selectedRoster, setSelectedRoster] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [entries, setEntries] = useState([])
  const [dateRange, setDateRange] = useState([])

  // Entry modal
  const [entryModal, setEntryModal] = useState(null) // { employeeId, date, existing }
  const [entryForm, setEntryForm] = useState(EMPTY_ENTRY)
  const [entrySaving, setEntrySaving] = useState(false)
  const [entryError, setEntryError] = useState('')

  // ---- Data loading -------------------------------------------------------

  const loadRosters = useCallback(async () => {
    if (!profile?.organization_id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('duty_rosters')
      .select(
        'id, name, description, start_date, end_date, status, department:departments(name), created_by'
      )
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })

    if (error) {
      errorNotify('Failed to load duty rosters')
      console.error(error)
      setRosters([])
    } else {
      setRosters(data || [])
    }
    setLoading(false)
  }, [profile?.organization_id, errorNotify])

  const loadDepartments = useCallback(async () => {
    if (!profile?.organization_id) return
    const { data } = await supabase
      .from('departments')
      .select('id, name')
      .eq('organization_id', profile.organization_id)
      .order('name')
    setDepartments(data || [])
  }, [profile?.organization_id])

  useEffect(() => {
    if (profile?.organization_id) {
      loadRosters()
      loadDepartments()
    } else if (profile && !profile.organization_id) {
      setLoading(false)
    }
  }, [profile, loadRosters, loadDepartments])

  // Compute stats from rosters + entry counts
  useEffect(() => {
    const total = rosters.length
    const published = rosters.filter((r) => r.status === 'PUBLISHED').length
    const drafts = rosters.filter((r) => r.status === 'DRAFT').length
    const totalShifts = rosters.reduce((sum, r) => sum + (r.entry_count || 0), 0)
    setStats({ total, published, drafts, totalShifts })
  }, [rosters])

  // Fetch entry counts for each roster (duty_roster_entries count)
  useEffect(() => {
    if (!rosters.length) return
    let cancelled = false
    ;(async () => {
      const ids = rosters.map((r) => r.id)
      const { data } = await supabase
        .from('duty_roster_entries')
        .select('roster_id')
        .in('roster_id', ids)
      if (cancelled || !data) return
      const counts = {}
      data.forEach((row) => {
        counts[row.roster_id] = (counts[row.roster_id] || 0) + 1
      })
      setRosters((prev) => prev.map((r) => ({ ...r, entry_count: counts[r.id] || 0 })))
    })()
    return () => {
      cancelled = true
    }
  }, [rosters.map((r) => r.id).join(',')])

  // ---- Create roster ------------------------------------------------------

  function openCreate() {
    setCreateForm(EMPTY_ROSTER)
    setCreateError('')
    setCreateOpen(true)
  }

  async function handleCreate() {
    if (!createForm.name.trim()) {
      setCreateError('Roster name is required.')
      return
    }
    if (!createForm.department_id) {
      setCreateError('Please select a department.')
      return
    }
    if (!createForm.start_date || !createForm.end_date) {
      setCreateError('Start and end dates are required.')
      return
    }
    if (createForm.end_date < createForm.start_date) {
      setCreateError('End date must be on or after the start date.')
      return
    }
    if (!profile?.organization_id) {
      setCreateError('Your organization is not set. Please contact an administrator.')
      return
    }

    setCreating(true)
    setCreateError('')
    const { data, error } = await supabase
      .from('duty_rosters')
      .insert({
        name: createForm.name.trim(),
        description: createForm.description.trim() || null,
        department_id: createForm.department_id,
        start_date: createForm.start_date,
        end_date: createForm.end_date,
        status: 'DRAFT',
        organization_id: profile.organization_id,
        created_by: profile.id,
      })
      .select('id')
      .single()

    setCreating(false)
    if (error) {
      setCreateError(error.message)
      return
    }
    setCreateOpen(false)
    success('Duty roster created successfully')
    await loadRosters()
    // Open the new roster's detail view
    if (data?.id) {
      const fresh = (await supabase
        .from('duty_rosters')
        .select(
          'id, name, description, start_date, end_date, status, department:departments(name), created_by'
        )
        .eq('id', data.id)
        .single()).data
      if (fresh) openRoster(fresh)
    }
  }

  // ---- Publish roster -----------------------------------------------------

  async function handlePublish(roster) {
    const { error } = await supabase
      .from('duty_rosters')
      .update({ status: 'PUBLISHED' })
      .eq('id', roster.id)
    if (error) {
      errorNotify('Failed to publish roster')
      console.error(error)
      return
    }
    success(`Roster "${roster.name}" published`)
    await loadRosters()
    if (selectedRoster?.id === roster.id) {
      setSelectedRoster((prev) => ({ ...prev, status: 'PUBLISHED' }))
    }
  }

  // ---- Detail view --------------------------------------------------------

  async function openRoster(roster) {
    setSelectedRoster(roster)
    setDetailLoading(true)
    setEmployees([])
    setEntries([])

    // Build the date range (inclusive)
    const days = []
    if (roster.start_date && roster.end_date) {
      let cur = parseDate(roster.start_date)
      const end = parseDate(roster.end_date)
      while (cur <= end) {
        days.push(toISODate(cur))
        cur = addDays(cur, 1)
      }
    }
    setDateRange(days)

    // Fetch employees in this department
    const [empRes, entryRes] = await Promise.all([
      supabase
        .from('employees')
        .select('id, full_name, email')
        .eq('department_id', roster.department_id ?? roster.department?.id)
        .eq('status', 'ACTIVE')
        .order('full_name'),
      supabase
        .from('duty_roster_entries')
        .select('id, employee_id, roster_id, shift_date, shift_start, shift_end, shift_type, notes')
        .eq('roster_id', roster.id),
    ])

    setEmployees(empRes.data || [])
    setEntries(entryRes.data || [])
    setDetailLoading(false)
  }

  function backToList() {
    setSelectedRoster(null)
    setEntries([])
    setEmployees([])
    setDateRange([])
  }

  // Build a lookup map: `${employeeId}|${date}` -> entry
  const entryMap = useMemo(() => {
    const map = {}
    entries.forEach((e) => {
      const key = `${e.employee_id}|${e.shift_date}`
      map[key] = e
    })
    return map
  }, [entries])

  // ---- Entry modal --------------------------------------------------------

  function openEntryModal(employeeId, date, existing) {
    setEntryModal({ employeeId, date, existing })
    setEntryForm(
      existing
        ? {
            shift_start: existing.shift_start || '09:00',
            shift_end: existing.shift_end || '17:00',
            shift_type: existing.shift_type || 'MORNING',
            notes: existing.notes || '',
          }
        : EMPTY_ENTRY
    )
    setEntryError('')
  }

  async function handleSaveEntry() {
    if (!entryModal) return
    if (!entryForm.shift_start || !entryForm.shift_end) {
      setEntryError('Shift start and end times are required.')
      return
    }
    if (entryForm.shift_end <= entryForm.shift_start) {
      setEntryError('Shift end must be after shift start.')
      return
    }

    setEntrySaving(true)
    setEntryError('')
    const { employeeId, date, existing } = entryModal
    const payload = {
      roster_id: selectedRoster.id,
      employee_id: employeeId,
      shift_date: date,
      shift_start: entryForm.shift_start,
      shift_end: entryForm.shift_end,
      shift_type: entryForm.shift_type,
      notes: entryForm.notes.trim() || null,
      organization_id: profile.organization_id,
    }

    let error
    if (existing) {
      ;({ error } = await supabase
        .from('duty_roster_entries')
        .update(payload)
        .eq('id', existing.id))
    } else {
      ;({ error } = await supabase.from('duty_roster_entries').insert(payload))
    }

    setEntrySaving(false)
    if (error) {
      setEntryError(error.message)
      return
    }

    // Refresh entries locally
    const { data: refreshed } = await supabase
      .from('duty_roster_entries')
      .select('id, employee_id, roster_id, shift_date, shift_start, shift_end, shift_type, notes')
      .eq('roster_id', selectedRoster.id)
    setEntries(refreshed || [])
    setEntryModal(null)
    success(existing ? 'Shift updated' : 'Shift added')
  }

  async function handleDeleteEntry() {
    if (!entryModal?.existing) return
    setEntrySaving(true)
    const { error } = await supabase
      .from('duty_roster_entries')
      .delete()
      .eq('id', entryModal.existing.id)
    setEntrySaving(false)
    if (error) {
      setEntryError(error.message)
      return
    }
    setEntries((prev) => prev.filter((e) => e.id !== entryModal.existing.id))
    setEntryModal(null)
    success('Shift removed')
  }

  // ---- Export CSV ---------------------------------------------------------

  function handleExport() {
    if (!selectedRoster) return
    const deptName = selectedRoster.department?.name || ''
    const header = ['Employee', 'Email', 'Date', 'Shift Start', 'Shift End', 'Shift Type', 'Notes']
    const rows = []

    employees.forEach((emp) => {
      dateRange.forEach((date) => {
        const entry = entryMap[`${emp.id}|${date}`]
        rows.push([
          emp.full_name || '',
          emp.email || '',
          date,
          entry?.shift_start || '',
          entry?.shift_end || '',
          entry?.shift_type || '',
          entry?.notes || '',
        ])
      })
    })

    const escape = (val) => {
      const s = String(val ?? '')
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const csv = [header, ...rows].map((r) => r.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeName = (selectedRoster.name || 'duty-roster').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
    link.href = url
    link.download = `${safeName}-${deptName ? deptName.replace(/\s+/g, '-').toLowerCase() + '-' : ''}roster.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    success('Roster exported as CSV')
  }

  // ---- Render -------------------------------------------------------------

  if (profile && !profile.organization_id) {
    return (
      <div className="space-y-6">
        <PageHeader title="Duty Roster" description="Plan and publish employee shift schedules" icon={CalendarRange} />
        <EmptyState
          icon={CalendarRange}
          title="Organization not configured"
          description="Your profile is not linked to an organization. Please contact an administrator."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duty Roster"
        description="Plan and publish employee shift schedules"
        icon={CalendarRange}
        actions={
          selectedRoster ? (
            <>
              <button onClick={backToList} className="btn-secondary">
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              <button onClick={handleExport} className="btn-secondary">
                <Download size={18} className="mr-2" /> Export CSV
              </button>
              {selectedRoster.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handlePublish(selectedRoster)}
                  className="btn-primary"
                >
                  <Send size={18} className="mr-2" /> Publish
                </button>
              )}
            </>
          ) : (
            <button onClick={openCreate} className="btn-primary">
              <Plus size={18} className="mr-2" /> New Roster
            </button>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarRange} label="Total Rosters" value={stats.total} color="blue" loading={loading} />
        <StatCard icon={CheckCircle2} label="Published" value={stats.published} color="green" loading={loading} />
        <StatCard icon={FileText} label="Drafts" value={stats.drafts} color="yellow" loading={loading} />
        <StatCard icon={Clock} label="Total Shifts" value={stats.totalShifts} color="purple" loading={loading} />
      </div>

      {/* ---- Detail view ---- */}
      {selectedRoster ? (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedRoster.name}</h2>
                  <StatusBadge status={selectedRoster.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedRoster.department?.name || 'No department'} ·{' '}
                  {formatDate(selectedRoster.start_date)} – {formatDate(selectedRoster.end_date)}
                </p>
                {selectedRoster.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{selectedRoster.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Users size={16} />
                <span>{employees.length} employees</span>
                <span className="mx-1">·</span>
                <Clock size={16} />
                <span>{entries.length} shifts</span>
              </div>
            </div>
          </div>

          {detailLoading ? (
            <div className="card p-10">
              <Spinner size="md" />
            </div>
          ) : employees.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Users}
                title="No employees in this department"
                description="Add employees to the department to start assigning shifts."
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                      <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 min-w-[160px]">
                        Employee
                      </th>
                      {dateRange.map((date) => {
                        const d = parseDate(date)
                        const wd = WEEKDAYS[(d.getDay() + 6) % 7]
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6
                        return (
                          <th
                            key={date}
                            className={`px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider min-w-[120px] ${
                              isWeekend
                                ? 'text-gray-400 dark:text-gray-500'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            <div>{wd}</div>
                            <div className="mt-0.5 text-[11px] font-normal normal-case text-gray-400 dark:text-gray-500">
                              {d.getDate()}/{d.getMonth() + 1}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b border-gray-100 last:border-0 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                      >
                        <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 text-xs font-semibold">
                              {emp.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {emp.full_name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        {dateRange.map((date) => {
                          const entry = entryMap[`${emp.id}|${date}`]
                          return (
                            <td key={date} className="px-1.5 py-1.5 text-center align-top">
                              <button
                                onClick={() => openEntryModal(emp.id, date, entry)}
                                className={`w-full min-h-[52px] rounded-lg border transition flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 ${
                                  entry
                                    ? `${SHIFT_TYPE_COLORS[entry.shift_type] || SHIFT_TYPE_COLORS.OFF} border-transparent hover:opacity-80`
                                    : 'border-dashed border-gray-200 text-gray-300 hover:border-brand-400 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-500 dark:text-gray-600'
                                }`}
                                title={entry ? 'Edit shift' : 'Add shift'}
                              >
                                {entry ? (
                                  <>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                                      {entry.shift_type?.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[11px] font-medium">
                                      {formatTimeShort(entry.shift_start)}–{formatTimeShort(entry.shift_end)}
                                    </span>
                                  </>
                                ) : (
                                  <Plus size={14} />
                                )}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ---- Roster list ---- */
        <>
          {loading ? (
            <div className="card p-10">
              <Spinner size="md" />
            </div>
          ) : rosters.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={CalendarRange}
                title="No duty rosters yet"
                description="Create your first duty roster to start planning shifts for your teams."
                action={
                  <button onClick={openCreate} className="btn-primary">
                    <Plus size={18} className="mr-2" /> New Roster
                  </button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rosters.map((roster) => (
                <div
                  key={roster.id}
                  className="card-hover p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{roster.name}</h3>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {roster.department?.name || 'No department'}
                      </p>
                    </div>
                    <StatusBadge status={roster.status} />
                  </div>

                  {roster.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {roster.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CalendarRange size={14} />
                    <span>
                      {formatDate(roster.start_date)} – {formatDate(roster.end_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    <span>{roster.entry_count || 0} shift entries</span>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => openRoster(roster)}
                      className="btn-secondary flex-1 justify-center"
                    >
                      <Eye size={16} className="mr-1.5" /> View
                    </button>
                    {roster.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublish(roster)}
                        className="btn-primary flex-1 justify-center"
                      >
                        <Send size={16} className="mr-1.5" /> Publish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- Create Roster Modal ---- */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Duty Roster"
        description="Set up a new shift roster for a department"
        size="md"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreate} className="btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Roster'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Nursing Shifts – Week 12"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this roster..."
            />
          </div>
          <div>
            <label className="label">Department *</label>
            <select
              className="input"
              value={createForm.department_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, department_id: e.target.value }))}
            >
              <option value="">— Select Department —</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date *</label>
              <input
                type="date"
                className="input"
                value={createForm.start_date}
                onChange={(e) => setCreateForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">End Date *</label>
              <input
                type="date"
                className="input"
                value={createForm.end_date}
                min={createForm.start_date || undefined}
                onChange={(e) => setCreateForm((f) => ({ ...f, end_date: e.target.value }))}
              />
            </div>
          </div>
          {createError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {createError}
            </div>
          )}
        </div>
      </Modal>

      {/* ---- Entry Modal ---- */}
      <Modal
        open={entryModal !== null}
        onClose={() => setEntryModal(null)}
        title={entryModal?.existing ? 'Edit Shift' : 'Add Shift'}
        description={
          entryModal
            ? `${employees.find((e) => e.id === entryModal.employeeId)?.full_name || ''} · ${formatDate(entryModal.date)}`
            : ''
        }
        size="sm"
        footer={
          <>
            {entryModal?.existing && (
              <button
                onClick={handleDeleteEntry}
                disabled={entrySaving}
                className="btn-secondary text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 mr-auto"
              >
                Remove
              </button>
            )}
            <button onClick={() => setEntryModal(null)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveEntry} className="btn-primary" disabled={entrySaving}>
              {entrySaving ? 'Saving...' : entryModal?.existing ? 'Update Shift' : 'Add Shift'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Shift Start</label>
              <input
                type="time"
                className="input"
                value={entryForm.shift_start}
                onChange={(e) => setEntryForm((f) => ({ ...f, shift_start: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Shift End</label>
              <input
                type="time"
                className="input"
                value={entryForm.shift_end}
                onChange={(e) => setEntryForm((f) => ({ ...f, shift_end: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label">Shift Type</label>
            <select
              className="input"
              value={entryForm.shift_type}
              onChange={(e) => setEntryForm((f) => ({ ...f, shift_type: e.target.value }))}
            >
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
              <option value="NIGHT">Night</option>
              <option value="FULL_DAY">Full Day</option>
              <option value="OFF">Off</option>
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={2}
              value={entryForm.notes}
              onChange={(e) => setEntryForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes for this shift..."
            />
          </div>
          {entryError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {entryError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
