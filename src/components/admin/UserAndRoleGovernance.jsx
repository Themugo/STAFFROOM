import React, { useState } from 'react'
import {
  Users, Shield, Lock, Key, CheckCircle2, UserCheck, AlertTriangle,
  Search, Filter, Plus, Sliders, ShieldAlert, Cpu, Laptop, Smartphone,
  Layers, ChevronRight, X
} from 'lucide-react'

const USERS_LIST = [
  {
    id: 'USR-001',
    name: 'Sarah Kimani',
    email: 'sarah.k@staffroom.ke',
    role: 'Platform Super Admin',
    department: 'Executive Governance',
    unit: 'Nairobi Central HQ',
    status: 'ACTIVE',
    mfaStatus: 'ENFORCED (Hardware Key)',
    lastActive: '2 mins ago',
    activeSessions: 2
  },
  {
    id: 'USR-002',
    name: 'David Ochieng',
    email: 'david.o@staffroom.ke',
    role: 'Finance & Payroll Admin',
    department: 'Accounts & Finance',
    unit: 'Mombasa Logistics Hub',
    status: 'ACTIVE',
    mfaStatus: 'ENFORCED (Authenticator App)',
    lastActive: '15 mins ago',
    activeSessions: 1
  },
  {
    id: 'USR-003',
    name: 'Amina Mohamed',
    email: 'amina.m@staffroom.ke',
    role: 'HR & Workforce Admin',
    department: 'People Operations',
    unit: 'Nairobi Central HQ',
    status: 'ACTIVE',
    mfaStatus: 'ENFORCED (SMS OTP)',
    lastActive: '1 hour ago',
    activeSessions: 1
  },
  {
    id: 'USR-004',
    name: 'Peter Wanjala',
    email: 'peter.w@staffroom.ke',
    role: 'Transport & Fleet Manager',
    department: 'Logistics',
    unit: 'Kisumu Terminal',
    status: 'ACTIVE',
    mfaStatus: 'ENFORCED (Authenticator App)',
    lastActive: '3 hours ago',
    activeSessions: 1
  }
]

const ROLES_LIST = [
  {
    roleName: 'Platform Super Admin',
    permissionsCount: 142,
    assignedUsers: 3,
    description: 'Unrestricted control plane access across all multi-tenant schemas and platform configurations.',
    isCustom: false
  },
  {
    roleName: 'Executive Director & Board Auditor',
    permissionsCount: 88,
    assignedUsers: 6,
    description: 'Read-only board oversight, GRC dashboards, audit paper review, and strategic OKR monitoring.',
    isCustom: false
  },
  {
    roleName: 'Finance & Payroll Controller',
    permissionsCount: 64,
    assignedUsers: 12,
    description: 'Full statutory payroll execution, KRA filing, shift allowance approval, and invoice delegation.',
    isCustom: true
  },
  {
    roleName: 'Human Resources & People Lead',
    permissionsCount: 52,
    assignedUsers: 18,
    description: 'Employee onboarding, attendance biometrics, performance reviews, and leave policy management.',
    isCustom: true
  }
]

export default function UserAndRoleGovernance() {
  const [viewMode, setViewMode] = useState('USERS') // 'USERS' or 'ROLES'
  const [users, setUsers] = useState(USERS_LIST)
  const [roles, setRoles] = useState(ROLES_LIST)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  // New Invite Form
  const [invite, setInvite] = useState({
    name: '',
    email: '',
    role: 'Finance & Payroll Controller',
    unit: 'Nairobi Central HQ'
  })

  const handleInviteUser = (e) => {
    e.preventDefault()
    if (!invite.name || !invite.email) return

    const userObj = {
      id: `USR-CUSTOM-${Date.now().toString().slice(-4)}`,
      ...invite,
      department: 'Operations',
      status: 'INVITED',
      mfaStatus: 'PENDING_SETUP',
      lastActive: 'Never',
      activeSessions: 0
    }

    setUsers([userObj, ...users])
    setShowInviteModal(false)
    setInvite({
      name: '',
      email: '',
      role: 'Finance & Payroll Controller',
      unit: 'Nairobi Central HQ'
    })
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Shield size={13} className="text-blue-400" /> Identity, Credential & Role Governance
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Users className="text-blue-400" /> User Administration & RBAC Permission Matrix
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Centralized user lifecycle management, MFA enforcement, active session termination, role templates, delegated administration, and emergency access protocols.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => setViewMode('USERS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  viewMode === 'USERS' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Users & Sessions
              </button>
              <button
                onClick={() => setViewMode('ROLES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  viewMode === 'ROLES' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Roles & Permissions
              </button>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <Plus size={15} /> Invite User
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: USERS LIST */}
      {viewMode === 'USERS' && (
        <div className="space-y-4">
          <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <span className="text-xs font-bold font-mono text-slate-500">
              Showing {filteredUsers.length} Platform Users
            </span>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{u.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {u.role}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {u.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{u.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-mono">
                  <div>Business Unit: <strong className="text-slate-800 dark:text-slate-200">{u.unit}</strong></div>
                  <div>MFA Policy: <strong className="text-emerald-600 dark:text-emerald-400">{u.mfaStatus}</strong></div>
                  <div>Active Sessions: <strong className="text-slate-800 dark:text-slate-200">{u.activeSessions} Device(s)</strong></div>
                  <div>Last Active: <strong className="text-slate-800 dark:text-slate-200">{u.lastActive}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ROLES MATRIX */}
      {viewMode === 'ROLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r, i) => (
            <div
              key={i}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  {r.isCustom ? 'Custom Role' : 'System Default Role'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {r.permissionsCount} Permissions Enforced
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{r.roleName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{r.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
                <span>Assigned Users: {r.assignedUsers} Staff</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                  Edit Role Template & Permissions →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Invite User */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Send Enterprise Platform Invitation
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={invite.name}
                  onChange={(e) => setInvite({ ...invite, name: e.target.value })}
                  placeholder="e.g. Kenneth Kiprop"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={invite.email}
                  onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                  placeholder="e.g. kenneth.k@staffroom.ke"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assign Role</label>
                  <select
                    value={invite.role}
                    onChange={(e) => setInvite({ ...invite, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {roles.map(r => (
                      <option key={r.roleName} value={r.roleName}>{r.roleName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Business Unit</label>
                  <input
                    type="text"
                    value={invite.unit}
                    onChange={(e) => setInvite({ ...invite, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  Send Invitation Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
