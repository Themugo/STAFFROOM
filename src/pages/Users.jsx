import { useEffect, useState } from 'react'
import { UserPlus, Shield, Edit2, Trash2, Users as UsersIcon, Key } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate } from '../lib/format'
import {
  PageHeader,
  StatCard,
  SearchInput,
  DataTable,
  Modal,
  StatusBadge,
  EmptyState,
  Avatar,
  ConfirmDialog,
} from '../components/ui'

// Role badge styling (StatusBadge's STATUS_MAP doesn't cover these custom roles,
// so we apply the shared badge-* utility classes directly with dark mode variants).
const ROLE_BADGE = {
  SYSTEM_OWNER: { label: 'System Owner', badge: 'badge-purple' },
  ADMIN: { label: 'Admin', badge: 'badge-blue' },
  DEPARTMENT_ADMIN: { label: 'Department Admin', badge: 'badge-green' },
  EMPLOYEE: { label: 'Employee', badge: 'badge-gray' },
}

const ROLES = [
  { value: 'ADMIN', label: 'Admin', desc: 'Full company management access' },
  { value: 'DEPARTMENT_ADMIN', label: 'Department Admin', desc: 'Manage own department only' },
  { value: 'EMPLOYEE', label: 'Employee', desc: 'Basic employee access' },
]

export default function Users() {
  const { profile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'EMPLOYEE', password: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  // Warning shown after a profile is deleted while the auth.users account remains.
  const [deleteWarning, setDeleteWarning] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at, must_change_password')
      .eq('organization_id', profile?.organization_id)
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter(u => ['ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN'].includes(u.role)).length,
    pendingSetup: users.filter(u => u.must_change_password).length,
  }

  function openCreateModal() {
    setEditingUser(null)
    setForm({ email: '', full_name: '', role: 'EMPLOYEE', password: '' })
    setError('')
    setShowModal(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setForm({ email: user.email || '', full_name: user.full_name || '', role: user.role || 'EMPLOYEE', password: '' })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFormLoading(true)

    try {
      if (editingUser) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ full_name: form.full_name, role: form.role })
          .eq('id', editingUser.id)
        if (updateError) throw updateError
      } else {
        const { data, error: createError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.full_name },
          },
        })
        if (createError) throw createError

        if (data.user) {
          await supabase
            .from('profiles')
            .update({ role: form.role, must_change_password: true })
            .eq('id', data.user.id)
        }
      }

      setShowModal(false)
      loadUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      // Delete the profile row only.
      // NOTE: Deleting the corresponding auth.users record requires the Supabase
      // service role key (exposed via the auth admin API), which is NOT available
      // in the frontend — using it client-side would leak a key that bypasses RLS.
      // The auth account therefore remains after this delete and must be fully
      // removed by a system administrator with server-side / service-role access.
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteTarget.id)
      if (deleteError) throw deleteError

      setUsers(users.filter(u => u.id !== deleteTarget.id))
      setDeleteTarget(null)
      setDeleteWarning(
        'Profile deleted. Auth account remains — contact a system administrator to fully remove the user.'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  // Access control
  if (profile?.role !== 'SYSTEM_OWNER') {
    return (
      <div className="card">
        <EmptyState
          icon={Shield}
          title="Access restricted"
          description="Only System Owners can manage users"
        />
      </div>
    )
  }

  // DataTable columns
  const columns = [
    {
      key: 'full_name',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.full_name || 'Unknown'} size="md" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.full_name || 'Unknown'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => {
        const role = ROLE_BADGE[user.role] || ROLE_BADGE.EMPLOYEE
        return <span className={role.badge}>{role.label}</span>
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (user) => (
        <span className="text-gray-600 dark:text-gray-400">{formatDate(user.created_at)}</span>
      ),
    },
    {
      key: 'must_change_password',
      header: 'Password Status',
      render: (user) =>
        user.must_change_password ? (
          <StatusBadge status="PENDING" label="Change Required" />
        ) : (
          <StatusBadge status="COMPLETED" label="Complete" />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEditModal(user)}
            className="p-2 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
            title="Edit"
            disabled={user.role === 'SYSTEM_OWNER'}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setError('')
              setDeleteTarget(user)
            }}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Delete"
            disabled={user.role === 'SYSTEM_OWNER'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  // Modal footer
  const modalFooter = (
    <>
      <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
        Cancel
      </button>
      <button type="submit" form="user-form" className="btn-primary" disabled={formLoading}>
        {formLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Saving...
          </>
        ) : (
          <>
            <UserPlus size={16} />
            {editingUser ? 'Update User' : 'Create User'}
          </>
        )}
      </button>
    </>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
        actions={
          <button onClick={openCreateModal} className="btn-primary">
            <UserPlus size={18} /> Create User
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={UsersIcon}
          label="Total Users"
          value={stats.total}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={Shield}
          label="Admins"
          value={stats.admins}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={Key}
          label="Pending Setup"
          value={stats.pendingSetup}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Post-delete warning toast: profile removed, auth account remains */}
      {deleteWarning && (
        <div className="flex items-start justify-between gap-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
          <span>{deleteWarning}</span>
          <button
            onClick={() => setDeleteWarning('')}
            className="shrink-0 font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users by name or email..."
            className="max-w-sm"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 sm:ml-auto">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyIcon={UsersIcon}
        emptyTitle="No users found"
        emptyDescription={search ? 'Try adjusting your search.' : 'Create your first user to get started.'}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Create New User'}
        size="md"
        footer={modalFooter}
      >
        <form id="user-form" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!editingUser && (
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="user@company.com"
                  required
                />
              </div>
            )}

            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                className="input"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            {!editingUser && (
              <div>
                <label className="label">Password *</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  User will be required to change this on first login
                </p>
              </div>
            )}

            <div>
              <label className="label">Role</label>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <label
                    key={r.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                      form.role === r.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => setForm({ ...form, role: r.value })}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{r.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This will remove their profile, but their auth account will remain and must be fully removed by a system administrator.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  )
}
