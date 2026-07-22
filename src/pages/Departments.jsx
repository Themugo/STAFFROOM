import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Users, Building2, UserCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { initials } from '../lib/format'
import {
  PageHeader,
  StatCard,
  SearchInput,
  DataTable,
  StatusBadge,
  EmptyState,
  Modal,
  ConfirmDialog,
} from '../components/ui'

const EMPTY = { name: '', description: '', manager_id: '', status: 'ACTIVE' }

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [deptRes, empRes] = await Promise.all([
      supabase.from('departments').select('*, manager:employees!departments_manager_id_fkey(full_name, email), employees(count)').order('name'),
      supabase.from('employees').select('id, full_name, department_id').eq('status', 'ACTIVE').order('full_name'),
    ])
    setDepartments(deptRes.data ?? [])
    setEmployees(empRes.data ?? [])
    setLoading(false)
  }

  const filtered = departments.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  )

  const totalEmployees = departments.reduce((sum, d) => sum + (d.employees?.[0]?.count || 0), 0)

  function openAdd() { setForm(EMPTY); setError(''); setModal('add') }
  function openEdit(dept) { setForm({ ...dept, manager_id: dept.manager_id ?? '' }); setError(''); setModal('edit') }
  function closeModal() { setModal(null) }

  async function handleSave() {
    if (!form.name) { setError('Name is required.'); return }
    setSaving(true); setError('')
    const payload = { name: form.name, description: form.description, manager_id: form.manager_id || null, status: form.status }
    const { error } = modal === 'add'
      ? await supabase.from('departments').insert(payload)
      : await supabase.from('departments').update(payload).eq('id', form.id)
    setSaving(false)
    if (error) { setError(error.message); return }
    closeModal(); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('departments').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    load()
  }

  const columns = [
    {
      key: 'name',
      header: 'Department',
      render: (dept) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-sm dark:from-purple-600 dark:to-purple-700">
            {dept.name?.slice(0, 2).toUpperCase() || 'DP'}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{dept.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">
              {dept.description || 'No description provided'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (dept) => <StatusBadge status={dept.status} />,
    },
    {
      key: 'employees',
      header: 'Employees',
      width: '120px',
      render: (dept) => {
        const count = dept.employees?.[0]?.count || 0
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Users size={14} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
          </div>
        )
      },
    },
    {
      key: 'manager',
      header: 'Manager',
      render: (dept) => (
        dept.manager ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-medium dark:bg-amber-900/40 dark:text-amber-400">
              {initials(dept.manager.full_name)}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
              {dept.manager.full_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">No manager</span>
        )
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (dept) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEdit(dept)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(dept)}
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
        title="Departments"
        description="Organize your company structure"
        icon={Building2}
        actions={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={18} className="mr-2" /> Add Department
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Building2}
          label="Departments"
          value={departments.length}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Total Employees"
          value={totalEmployees}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={UserCheck}
          label="With Managers"
          value={departments.filter(d => d.manager_id).length}
          color="green"
          loading={loading}
        />
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search departments..."
        className="max-w-sm"
      />

      {/* Departments Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        keyField="id"
        emptyIcon={Building2}
        emptyTitle="No departments found"
        emptyDescription="Try adjusting your search or add a new department to get started."
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal === 'add' ? 'Add Department' : 'Edit Department'}
        size="md"
        footer={
          <>
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Department'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the department..."
            />
          </div>
          <div>
            <label className="label">Manager</label>
            <select
              className="input"
              value={form.manager_id ?? ''}
              onChange={e => setForm(f => ({ ...f, manager_id: e.target.value }))}
            >
              <option value="">— Select Manager —</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <div className="flex gap-3">
              {['ACTIVE', 'INACTIVE'].map(s => (
                <label
                  key={s}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                    form.status === s
                      ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm(f => ({ ...f, status: s }))}
                    className="sr-only"
                  />
                  <span className={`h-2 w-2 rounded-full ${s === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {s === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </label>
              ))}
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
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  )
}
