import React, { useState } from 'react'
import {
  Building2, Plus, Search, Filter, CheckCircle2, AlertTriangle,
  RefreshCw, Layers, ShieldCheck, MoreVertical, ExternalLink, Sliders,
  Trash2, Archive, Globe, Clock, DollarSign, X
} from 'lucide-react'

const INITIAL_TENANTS = [
  {
    id: 'TNT-KE-001',
    name: 'Nairobi Enterprise Central HQ',
    code: 'NBO-CENTRAL',
    region: 'East Africa (Kenya)',
    tier: 'ENTERPRISE_PREMIUM',
    userCount: 650,
    status: 'ACTIVE',
    databasePartition: 'schema_nairobi_prod',
    currency: 'KES (KSh)',
    timezone: 'Africa/Nairobi (UTC+3)',
    createdAt: '2025-01-15'
  },
  {
    id: 'TNT-KE-002',
    name: 'Mombasa Port & Logistics Hub',
    code: 'MBA-LOGISTICS',
    region: 'East Africa (Kenya)',
    tier: 'ENTERPRISE_PRO',
    userCount: 420,
    status: 'ACTIVE',
    databasePartition: 'schema_mombasa_prod',
    currency: 'KES (KSh)',
    timezone: 'Africa/Nairobi (UTC+3)',
    createdAt: '2025-03-10'
  },
  {
    id: 'TNT-KE-003',
    name: 'Kisumu Inland Terminal & Regional Hub',
    code: 'KSM-TERMINAL',
    region: 'East Africa (Kenya)',
    tier: 'BUSINESS_PLUS',
    userCount: 210,
    status: 'ACTIVE',
    databasePartition: 'schema_kisumu_prod',
    currency: 'KES (KSh)',
    timezone: 'Africa/Nairobi (UTC+3)',
    createdAt: '2025-06-01'
  },
  {
    id: 'TNT-UG-004',
    name: 'Kampala Commercial Division',
    code: 'KLA-COMMERCIAL',
    region: 'East Africa (Uganda)',
    tier: 'BUSINESS_PLUS',
    userCount: 140,
    status: 'ACTIVE',
    databasePartition: 'schema_kampala_prod',
    currency: 'UGX (USh)',
    timezone: 'Africa/Kampala (UTC+3)',
    createdAt: '2025-09-20'
  }
]

export default function TenantManagementStudio() {
  const [tenants, setTenants] = useState(INITIAL_TENANTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProvisionModal, setShowProvisionModal] = useState(false)

  // New Tenant Form State
  const [newTenant, setNewTenant] = useState({
    name: '',
    code: '',
    region: 'East Africa (Kenya)',
    tier: 'ENTERPRISE_PRO',
    currency: 'KES',
    timezone: 'Africa/Nairobi (UTC+3)'
  })

  const handleProvision = (e) => {
    e.preventDefault()
    if (!newTenant.name || !newTenant.code) return

    const tenantObj = {
      id: `TNT-CUSTOM-${Date.now().toString().slice(-4)}`,
      ...newTenant,
      userCount: 50,
      status: 'ACTIVE',
      databasePartition: `schema_${newTenant.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}_prod`,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setTenants([tenantObj, ...tenants])
    setShowProvisionModal(false)
    setNewTenant({
      name: '',
      code: '',
      region: 'East Africa (Kenya)',
      tier: 'ENTERPRISE_PRO',
      currency: 'KES',
      timezone: 'Africa/Nairobi (UTC+3)'
    })
  }

  const handleToggleStatus = (id) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        }
      }
      return t
    }))
  }

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Building2 size={13} className="text-blue-400" /> Multi-Tenant Architecture & Provisioning Studio
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Building2 className="text-blue-400" /> Tenant Management & Isolation Control
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Provision, configure, isolate, suspend, archive, and clone organizational tenants across multi-region PostgreSQL schemas and dedicated encryption domains.
            </p>
          </div>

          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shrink-0"
          >
            <Plus size={15} /> Provision New Tenant
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenant name, code, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <span className="text-xs font-bold text-slate-500 font-mono">
            {filteredTenants.length} Enterprise Tenants Provisioned
          </span>
        </div>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTenants.map((t) => {
          const isActive = t.status === 'ACTIVE'

          return (
            <div
              key={t.id}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{t.id}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {t.code}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                }`}>
                  {t.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{t.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Region: <strong className="text-slate-800 dark:text-slate-200">{t.region}</strong> • Tier: <strong className="text-blue-600 dark:text-blue-400">{t.tier}</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">DB Schema Isolation:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.databasePartition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active User Seats:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{t.userCount} Seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currency & Timezone:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{t.currency} • {t.timezone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Created: {t.createdAt}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(t.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isActive ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {isActive ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Provision Tenant */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" /> Provision New Organization Tenant
              </h3>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProvision} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="e.g. Eldoret Grain Terminal & Logistics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tenant Short Code</label>
                  <input
                    type="text"
                    required
                    value={newTenant.code}
                    onChange={(e) => setNewTenant({ ...newTenant, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ELD-GRAIN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Subscription Tier</label>
                  <select
                    value={newTenant.tier}
                    onChange={(e) => setNewTenant({ ...newTenant, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ENTERPRISE_PREMIUM">Enterprise Premium</option>
                    <option value="ENTERPRISE_PRO">Enterprise Pro</option>
                    <option value="BUSINESS_PLUS">Business Plus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Region</label>
                  <input
                    type="text"
                    value={newTenant.region}
                    onChange={(e) => setNewTenant({ ...newTenant, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Currency</label>
                  <input
                    type="text"
                    value={newTenant.currency}
                    onChange={(e) => setNewTenant({ ...newTenant, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  Provision Schema & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
