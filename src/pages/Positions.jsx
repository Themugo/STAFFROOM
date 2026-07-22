import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Briefcase, Building2, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/format'
import {
  StatCard,
  Modal,
  DataTable,
  SearchInput,
  StatusBadge,
  EmptyState,
  ConfirmDialog,
  PageHeader,
} from '../components/ui'

const EMPTY = { title: '', description: '', department_id: '', min_salary: '', max_salary: '' }

export default function Positions() {
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [posRes, deptRes] = await Promise.all([
      supabase.from('positions').select('*, department:departments(id, name), employees(count)').order('title'),
      supabase.from('departments').select('id, name').eq('status', 'ACTIVE').order('name'),
    ])
    setPositions(posRes.data ?? [])
    setDepartments(deptRes.data ?? [])
    setLoading(false)
  }

  const filtered = positions.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === 'all' || p.department_id === deptFilter
    return matchesSearch && matchesDept
  })

  const filledCount = positions.reduce((sum, p) => sum + (p.employees?.[0]?.count || 0), 0)
  const deptSpecificCount = positions.filter(p => p.department_id).length

  function openAdd() { setForm(EMPTY); setError(''); setModal('add') }
  function openEdit(pos) {
    setForm({
      ...pos,
      department_id: pos.department_id ?? '',
      min_salary: pos.min_salary ?? '',
      max_salary: pos.max_salary ?? ''
    })
    setError('')
    setModal('edit')
  }
  function closeModal() { setModal(null) }

  async function handleSave() {
    if (!form.title) { setError('Title is required.'); return }
    setSaving(true); setError('')
    const payload = {
      title: form.title,
      description: form.description,
      department_id: form.department_id || null,
      min_salary: form.min_salary ? parseFloat(form.min_salary) : null,
      max_salary: form.max_salary ? parseFloat(form.max_salary) : null,
    }
    const { error } = modal === 'add'
      ? await supabase.from('positions').insert(payload)
      : await supabase.from('positions').update(payload).eq('id', form.id)
    setSaving(false)
    if (error) { setError(error.message); return }
    closeModal(); load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('positions').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    load()
  }

  function salaryRange(pos) {
    if (!pos.min_salary && !pos.max_salary) return 'Not specified'
    const min = pos.min_salary ? formatCurrency(pos.min_salary) : '—'
    const max = pos.max_salary ? formatCurrency(pos.max_salary) : '—'
    return `${min} - ${max}`
  }

  const columns = [
    {
      key: 'title',
      header: 'Position',
      render: (pos) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white dark:from-indigo-600 dark:to-indigo-700">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{pos.title}</p>
            {pos.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{pos.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (pos) => (
        pos.department?.name ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <Building2 size={14} className="text-gray-400 dark:text-gray-500" />
            {pos.department.name}
          </span>
        ) : (
          <StatusBadge status="INACTIVE" label="General" />
        )
      ),
    },
    {
      key: 'salary',
      header: 'Salary Range',
      render: (pos) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{salaryRange(pos)}</span>
      ),
    },
    {
      key: 'employees',
      header: 'Employees',
      render: (pos) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <Users size={14} className="text-gray-400 dark:text-gray-500" />
          {pos.employees?.[0]?.count || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '90px',
      render: (pos) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(pos)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => setDeleteId(pos.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Positions"
        description="Define job roles and salary bands"
        icon={Briefcase}
        actions={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={18} className="mr-2" /> Add Position
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total Positions"
          value={positions.length}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Filled Positions"
          value={filledCount}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={Building2}
          label="Department-specific"
          value={deptSpecificCount}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search positions..."
            className="flex-1"
          />
          <select
            className="input w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} position{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Positions Table */}
      {loading ? (
        <DataTable columns={columns} data={[]} loading={true} />
      ) : filtered.length === 0 ? (
        <div className="card dark:bg-gray-900 dark:border dark:border-gray-800">
          <EmptyState
            icon={Briefcase}
            title="No positions found"
            description={search || deptFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first position.'}
            action={
              <button onClick={openAdd} className="btn-primary">
                <Plus size={18} className="mr-2" /> Add Position
              </button>
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={!!modal}
        onClose={closeModal}
        title={modal === 'add' ? 'Add Position' : 'Edit Position'}
        size="md"
        footer={
          <>
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Position'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Title *</label>
            <input
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Description</label>
            <textarea
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              rows={3}
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Position description and responsibilities..."
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Department</label>
            <select
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={form.department_id ?? ''}
              onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}
            >
              <option value="">— General (No Department) —</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-300">Min Salary (KES)</label>
              <input
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                type="number"
                value={form.min_salary ?? ''}
                onChange={e => setForm(f => ({ ...f, min_salary: e.target.value }))}
                placeholder="50000"
              />
            </div>
            <div>
              <label className="label dark:text-gray-300">Max Salary (KES)</label>
              <input
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                type="number"
                value={form.max_salary ?? ''}
                onChange={e => setForm(f => ({ ...f, max_salary: e.target.value }))}
                placeholder="100000"
              />
            </div>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Position"
        message="Are you sure you want to delete this position? This action cannot be undone."
        confirmLabel="Delete"
        danger={true}
        loading={deleting}
      />
    </div>
  )
}
