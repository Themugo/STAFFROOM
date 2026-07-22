import { useEffect, useState } from 'react'
import { Plus, Eye, Edit2, Trash2, Briefcase, Users, Clock, UserCheck, Calendar, UserPlus, Download, LayoutGrid, List, TrendingUp, Target, Timer } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, formatTime } from '../lib/format'
import { StatCard, Modal, DataTable, StatusBadge, EmptyState, PageHeader, Tabs } from '../components/ui'

const VACANCY_STATUS_CONFIG = {
  OPEN: { label: 'Open' },
  CLOSED: { label: 'Closed' },
  ON_HOLD: { label: 'On Hold' },
  FILLED: { label: 'Filled' },
}

const APP_STATUS_CONFIG = {
  APPLIED: { label: 'Applied' },
  SCREENING: { label: 'Screening' },
  INTERVIEW: { label: 'Interview' },
  OFFER: { label: 'Offer' },
  HIRED: { label: 'Hired' },
  REJECTED: { label: 'Rejected' },
}

// Kanban pipeline columns. Each column maps to one or more underlying
// application statuses stored in the database. This lets us show the
// requested pipeline labels (REVIEWING, INTERVIEWED, OFFERED) while
// keeping the existing data model and Supabase queries untouched.
const PIPELINE_COLUMNS = [
  { id: 'APPLIED',    label: 'Applied',     statuses: ['APPLIED'],    color: 'blue' },
  { id: 'REVIEWING',  label: 'Reviewing',   statuses: ['SCREENING'],  color: 'yellow' },
  { id: 'INTERVIEWED',label: 'Interviewed', statuses: ['INTERVIEW'],  color: 'purple' },
  { id: 'OFFERED',    label: 'Offered',     statuses: ['OFFER'],      color: 'green' },
  { id: 'HIRED',      label: 'Hired',       statuses: ['HIRED'],      color: 'green' },
  { id: 'REJECTED',   label: 'Rejected',    statuses: ['REJECTED'],   color: 'red' },
]

// Map a pipeline column id back to the single underlying status used when
// moving a card into that column (the first status in the column's set).
const PIPELINE_STATUS_MAP = PIPELINE_COLUMNS.reduce((acc, col) => {
  acc[col.id] = col.statuses[0]
  return acc
}, {})

// Tailwind color classes for the Kanban column accents.
const COLUMN_COLOR_CLASSES = {
  blue:   { dot: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400',   bar: 'bg-blue-500' },
  yellow: { dot: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500' },
  purple: { dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
  green:  { dot: 'bg-green-500',  text: 'text-green-600 dark:text-green-400',  bar: 'bg-green-500' },
  red:    { dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',      bar: 'bg-red-500' },
}

const TABS = [
  { id: 'vacancies', label: 'Vacancies' },
  { id: 'applications', label: 'Applications' },
  { id: 'interviews', label: 'Interviews' },
]

const EMPTY_VAC = { title: '', department_id: '', description: '', requirements: '', openings: 1, status: 'OPEN', deadline: '' }
const EMPTY_APP = { vacancy_id: '', full_name: '', email: '', phone: '', resume_url: '', status: 'APPLIED' }

export default function Recruitment() {
  const [tab, setTab] = useState('vacancies')
  const [vacancies, setVacancies] = useState([])
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [appView, setAppView] = useState('table') // 'table' | 'pipeline'

  useEffect(() => { loadDepts() }, [])
  useEffect(() => { loadTab() }, [tab])

  async function loadDepts() {
    const { data } = await supabase.from('departments').select('id, name').eq('status', 'ACTIVE').order('name')
    setDepartments(data ?? [])
    loadTab()
  }

  async function loadTab() {
    setLoading(true)
    switch (tab) {
      case 'vacancies': {
        const { data } = await supabase.from('vacancies')
          .select('*, department:departments(name), applications(count)')
          .order('created_at', { ascending: false })
        setVacancies(data ?? [])
        break
      }
      case 'applications': {
        const { data } = await supabase.from('applications')
          .select('*, vacancy:vacancies(title, department:departments(name))')
          .order('applied_at', { ascending: false })
        setApplications(data ?? [])
        break
      }
      case 'interviews': {
        const { data } = await supabase.from('interviews')
          .select('*, application:applications(full_name, email, vacancy:vacancies(title))')
          .order('scheduled_at', { ascending: false })
        setInterviews(data ?? [])
        break
      }
    }
    setLoading(false)
  }

  // Stats
  const stats = {
    openVacancies: vacancies.filter(v => v.status === 'OPEN').length,
    totalApplicants: applications.length,
    inProgress: applications.filter(a => ['SCREENING', 'INTERVIEW', 'OFFER'].includes(a.status)).length,
    hired: applications.filter(a => a.status === 'HIRED').length,
  }

  // ---- Recruitment analytics (applications tab) ----
  // Conversion rate = hired / total applications * 100
  const conversionRate = stats.totalApplicants > 0
    ? (stats.hired / stats.totalApplicants) * 100
    : 0

  // Average time to hire: from applied_at to the hired date, if available.
  // The applications table does not expose a dedicated `hired_at` column in
  // the existing schema, so we fall back to `updated_at` when a candidate is
  // HIRED. If neither is present, the application is skipped.
  const hiredApps = applications.filter(a => a.status === 'HIRED')
  const timeToHireSamples = hiredApps
    .map(a => {
      const applied = a.applied_at ? new Date(a.applied_at).getTime() : null
      const hired = a.hired_at ? new Date(a.hired_at).getTime()
        : a.updated_at ? new Date(a.updated_at).getTime() : null
      if (!applied || !hired || hired < applied) return null
      return (hired - applied) / (1000 * 60 * 60 * 24) // days
    })
    .filter(v => v != null)
  const avgTimeToHire = timeToHireSamples.length > 0
    ? timeToHireSamples.reduce((sum, v) => sum + v, 0) / timeToHireSamples.length
    : null

  async function saveVacancy() {
    if (!form.title) { setError('Title is required.'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      department_id: form.department_id || null,
      openings: parseInt(form.openings) || 1,
      deadline: form.deadline || null
    }
    const { error } = modal === 'add_vac'
      ? await supabase.from('vacancies').insert(payload)
      : await supabase.from('vacancies').update(payload).eq('id', form.id)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal(null); loadTab()
  }

  async function saveApplication() {
    if (!form.vacancy_id || !form.full_name || !form.email) {
      setError('Vacancy, name, and email are required.')
      return
    }
    setSaving(true); setError('')
    const { error } = await supabase.from('applications').insert({
      ...form,
      applied_at: new Date().toISOString()
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal(null); loadTab()
  }

  async function updateAppStatus(id, status) {
    await supabase.from('applications').update({ status }).eq('id', id)
    loadTab()
  }

  async function deleteItem(table, id) {
    if (!confirm('Delete?')) return
    await supabase.from(table).delete().eq('id', id)
    loadTab()
  }

  // ---- CSV export ----
  function exportApplicationsCSV() {
    const headers = ['Candidate Name', 'Position', 'Department', 'Status', 'Applied Date']
    const escape = (val) => {
      const s = String(val ?? '')
      // Escape double quotes and wrap in quotes if it contains comma/quote/newline
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
      return s
    }
    const rows = applications.map(a => [
      escape(a.full_name),
      escape(a.vacancy?.title),
      escape(a.vacancy?.department?.name),
      escape(APP_STATUS_CONFIG[a.status]?.label || a.status),
      escape(a.applied_at ? formatDate(a.applied_at) : ''),
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `applications_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Group applications into pipeline columns
  const pipelineGroups = PIPELINE_COLUMNS.map(col => ({
    ...col,
    items: applications.filter(a => col.statuses.includes(a.status)),
  }))

  // DataTable columns for applications
  const appColumns = [
    {
      key: 'full_name',
      header: 'Candidate',
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium dark:from-blue-600 dark:to-blue-700">
            {a.full_name?.[0] || 'C'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{a.full_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vacancy',
      header: 'Position',
      render: (a) => <span className="text-sm text-gray-600 dark:text-gray-300">{a.vacancy?.title || '—'}</span>,
    },
    {
      key: 'applied_at',
      header: 'Applied',
      render: (a) => <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(a.applied_at)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <select
          className="text-xs font-medium rounded-full px-3 py-1.5 border-0 cursor-pointer bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          value={a.status}
          onChange={e => updateAppStatus(a.id, e.target.value)}
        >
          {Object.entries(APP_STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (a) => (
        <div className="flex gap-1 justify-end">
          <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition dark:hover:bg-blue-900/30 dark:text-blue-400" title="View">
            <Eye size={16} />
          </button>
          <button
            onClick={() => deleteItem('applications', a.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition dark:hover:bg-red-900/30 dark:text-red-400"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Recruitment"
        description="Manage job openings and candidates"
        icon={Briefcase}
        actions={
          <>
            {tab === 'applications' && (
              <button
                onClick={exportApplicationsCSV}
                disabled={applications.length === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export applications to CSV"
              >
                <Download size={18} className="mr-2" /> Export
              </button>
            )}
            {tab === 'vacancies' && (
              <button onClick={() => { setForm(EMPTY_VAC); setError(''); setModal('add_vac') }} className="btn-primary">
                <Plus size={18} className="mr-2" /> Post Vacancy
              </button>
            )}
            {tab === 'applications' && (
              <button onClick={() => { setForm(EMPTY_APP); setError(''); setModal('add_app') }} className="btn-primary">
                <Plus size={18} className="mr-2" /> Add Application
              </button>
            )}
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Open Positions" value={stats.openVacancies} color="green" loading={loading} />
        <StatCard icon={Users} label="Total Applicants" value={stats.totalApplicants} color="blue" loading={loading} />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="yellow" loading={loading} />
        <StatCard icon={UserCheck} label="Hired" value={stats.hired} color="purple" loading={loading} />
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* Content */}
      {loading ? (
        <div className="card py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-600 border-t-transparent mx-auto" />
          <p className="mt-3 text-gray-400 dark:text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          {/* Vacancies */}
          {tab === 'vacancies' && (
            vacancies.length === 0 ? (
              <div className="card">
                <EmptyState icon={Briefcase} title="No vacancies posted yet" description="Create your first job opening to start receiving applications." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vacancies.map(v => (
                  <div key={v.id} className="card group hover:shadow-lg transition-all dark:bg-gray-900 dark:border dark:border-gray-800">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{v.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{v.department?.name || 'General'}</p>
                          </div>
                        </div>
                        <StatusBadge status={v.status} label={VACANCY_STATUS_CONFIG[v.status]?.label} />
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px] dark:text-gray-400">
                        {v.description || 'No description provided'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {v.applications?.[0]?.count ?? 0}
                          </span>
                          <span>{v.openings} opening{v.openings !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {v.deadline ? `Due: ${formatDate(v.deadline)}` : 'No deadline'}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => { setForm({ ...v, department_id: v.department_id ?? '' }); setError(''); setModal('edit_vac') }}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          <Edit2 size={12} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => deleteItem('vacancies', v.id)}
                          className="btn-danger py-1.5 px-3 text-xs"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Applications */}
          {tab === 'applications' && (
            <div className="space-y-4">
              {/* Recruitment Analytics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalApplicants}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Conversion Rate</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {conversionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                      <Timer size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Time to Hire</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {avgTimeToHire != null ? `${avgTimeToHire.toFixed(1)}d` : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Open Positions</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.openVacancies}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {appView === 'table' ? 'All Applications' : 'Pipeline Board'}
                </h2>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => setAppView('table')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      appView === 'table'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <List size={14} /> Table
                  </button>
                  <button
                    onClick={() => setAppView('pipeline')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      appView === 'pipeline'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <LayoutGrid size={14} /> Pipeline
                  </button>
                </div>
              </div>

              {/* Table view */}
              {appView === 'table' && (
                <DataTable
                  columns={appColumns}
                  data={applications}
                  emptyTitle="No applications yet"
                  emptyDescription="Applications submitted by candidates will appear here."
                  emptyIcon={Users}
                />
              )}

              {/* Pipeline (Kanban) view */}
              {appView === 'pipeline' && (
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 min-w-max">
                    {pipelineGroups.map(col => {
                      const colors = COLUMN_COLOR_CLASSES[col.color]
                      return (
                        <div key={col.id} className="w-72 flex-shrink-0">
                          {/* Column header */}
                          <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{col.label}</h3>
                            </div>
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              {col.items.length}
                            </span>
                          </div>

                          {/* Column body */}
                          <div className="space-y-2 min-h-[80px] rounded-xl bg-gray-50 p-2 dark:bg-gray-900/50 dark:border dark:border-gray-800">
                            {col.items.length === 0 ? (
                              <div className="flex items-center justify-center h-20 text-xs text-gray-400 dark:text-gray-600">
                                No candidates
                              </div>
                            ) : (
                              col.items.map(a => (
                                <div
                                  key={a.id}
                                  className="group/card rounded-lg bg-white p-3 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-default dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-medium text-white dark:from-blue-600 dark:to-blue-700">
                                      {a.full_name?.[0] || 'C'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                                        {a.full_name}
                                      </p>
                                      <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                        {a.vacancy?.title || '—'}
                                      </p>
                                      <p className="text-[11px] text-gray-400 mt-1 dark:text-gray-500">
                                        {formatDate(a.applied_at)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Card actions */}
                                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <select
                                      className="text-[11px] font-medium rounded-full px-2 py-0.5 border-0 cursor-pointer bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                      value={a.status}
                                      onChange={e => updateAppStatus(a.id, e.target.value)}
                                      title="Move to stage"
                                    >
                                      {Object.entries(APP_STATUS_CONFIG).map(([key, cfg]) => (
                                        <option key={key} value={key}>{cfg.label}</option>
                                      ))}
                                    </select>
                                    <div className="flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition">
                                      <button
                                        className="p-1 rounded hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/30 dark:text-blue-400"
                                        title="View"
                                      >
                                        <Eye size={13} />
                                      </button>
                                      <button
                                        onClick={() => deleteItem('applications', a.id)}
                                        className="p-1 rounded hover:bg-red-50 text-red-500 dark:hover:bg-red-900/30 dark:text-red-400"
                                        title="Delete"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interviews */}
          {tab === 'interviews' && (
            interviews.length === 0 ? (
              <div className="card">
                <EmptyState icon={Calendar} title="No interviews scheduled yet" description="Scheduled interviews will show up here." />
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map(i => (
                  <div key={i.id} className="card p-5 flex items-center gap-4 hover:shadow-md transition dark:bg-gray-900 dark:border dark:border-gray-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                      {i.application?.full_name?.[0] || 'C'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{i.application?.full_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{i.application?.vacancy?.title || 'Position'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {i.scheduled_at ? formatDate(i.scheduled_at) : 'Not scheduled'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {i.scheduled_at ? formatTime(i.scheduled_at) : ''}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 dark:text-gray-500">Interviewer:</span> {i.interviewer_name || 'TBD'}
                    </div>
                    <button
                      onClick={() => deleteItem('interviews', i.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition dark:hover:bg-red-900/30 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Vacancy Modal */}
      <Modal
        open={modal === 'add_vac' || modal === 'edit_vac'}
        onClose={() => setModal(null)}
        title={modal === 'add_vac' ? 'Post New Vacancy' : 'Edit Vacancy'}
        size="md"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={saveVacancy} className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Vacancy'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Job Title *</label>
            <input
              className="input"
              value={form.title ?? ''}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div>
            <label className="label">Department</label>
            <select
              className="input"
              value={form.department_id ?? ''}
              onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}
            >
              <option value="">— Select —</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Job description..."
            />
          </div>
          <div>
            <label className="label">Requirements</label>
            <textarea
              className="input"
              rows={3}
              value={form.requirements ?? ''}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              placeholder="Required skills and qualifications..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Openings</label>
              <input
                className="input"
                type="number"
                min={1}
                value={form.openings ?? 1}
                onChange={e => setForm(f => ({ ...f, openings: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status ?? 'OPEN'}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {Object.entries(VACANCY_STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Application Deadline</label>
            <input
              className="input"
              type="date"
              value={form.deadline ?? ''}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* Application Modal */}
      <Modal
        open={modal === 'add_app'}
        onClose={() => setModal(null)}
        title="Add Application"
        size="sm"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={saveApplication} className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Application'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Vacancy *</label>
            <select
              className="input"
              value={form.vacancy_id ?? ''}
              onChange={e => setForm(f => ({ ...f, vacancy_id: e.target.value }))}
            >
              <option value="">— Select —</option>
              {vacancies.filter(v => v.status === 'OPEN').map(v => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input"
              value={form.full_name ?? ''}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Candidate name"
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              className="input"
              type="email"
              value={form.email ?? ''}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="candidate@email.com"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={form.phone ?? ''}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
