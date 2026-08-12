import { useState } from 'react'
import {
  Globe,
  Plus,
  Copy,
  Database,
  Archive,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Key,
  Layers,
  Search,
  AlertTriangle,
  Play
} from 'lucide-react'

const INITIAL_TENANTS = [
  {
    id: 'tnt-001',
    name: 'Nairobi City County Government',
    domain: 'nairobi.staffroom.ke',
    region: 'af-south-1 (Nairobi Edge)',
    status: 'ACTIVE',
    users: 4850,
    storage: '142.4 GB',
    plan: 'County Government Sovereign',
    created: '2025-01-15'
  },
  {
    id: 'tnt-002',
    name: 'Aga Khan University Hospital',
    domain: 'aku.staffroom.health',
    region: 'af-south-1 (Mombasa DC)',
    status: 'ACTIVE',
    users: 1920,
    storage: '88.1 GB',
    plan: 'Healthcare Clinical Enterprise',
    created: '2025-03-20'
  },
  {
    id: 'tnt-003',
    name: 'Equity Bank Group HQ',
    domain: 'equity.staffroom.finance',
    region: 'eu-west-1 (Dublin Vault)',
    status: 'ACTIVE',
    users: 12400,
    storage: '410.8 GB',
    plan: 'Financial Sovereign Vault',
    created: '2024-11-01'
  },
  {
    id: 'tnt-004',
    name: 'Kenya Airways Fleet Operations',
    domain: 'kq.staffroom.aero',
    region: 'af-south-1 (Nairobi Edge)',
    status: 'MAINTENANCE',
    users: 3100,
    storage: '195.2 GB',
    plan: 'Transport & Aviation Enterprise',
    created: '2025-06-10'
  }
]

export default function TenantLifecycleManager() {
  const [tenants, setTenants] = useState(INITIAL_TENANTS)
  const [search, setSearch] = useState('')
  const [showProvisionModal, setShowProvisionModal] = useState(false)

  const [newTenantName, setNewTenantName] = useState('')
  const [newTenantDomain, setNewTenantDomain] = useState('')
  const [newTenantPlan, setNewTenantPlan] = useState('County Government Sovereign')

  const [actionMessage, setActionMessage] = useState('')

  const handleProvisionTenant = (e) => {
    e.preventDefault()
    if (!newTenantName || !newTenantDomain) return

    const newTenant = {
      id: `tnt-00${tenants.length + 1}`,
      name: newTenantName,
      domain: newTenantDomain.endsWith('.staffroom.ke') ? newTenantDomain : `${newTenantDomain}.staffroom.ke`,
      region: 'af-south-1 (Nairobi Edge)',
      status: 'ACTIVE',
      users: 1,
      storage: '0.1 GB',
      plan: newTenantPlan,
      created: new Date().toISOString().split('T')[0]
    }

    setTenants([newTenant, ...tenants])
    setShowProvisionModal(false)
    setNewTenantName('')
    setNewTenantDomain('')
    setActionMessage(`Tenant "${newTenant.name}" provisioned successfully with isolated database schema!`)
    setTimeout(() => setActionMessage(''), 4000)
  }

  const handleBackupTenant = (name) => {
    setActionMessage(`Created encrypted snapshot backup for "${name}". Backup ID: snap-${Math.floor(Math.random()*900000+100000)}`)
    setTimeout(() => setActionMessage(''), 4000)
  }

  const handleCloneTenant = (tenant) => {
    const cloned = {
      ...tenant,
      id: `tnt-clone-${Math.floor(Math.random()*900+100)}`,
      name: `${tenant.name} (Sandbox Clone)`,
      domain: `sandbox-${tenant.domain}`,
      users: 10,
      storage: '1.2 GB',
      status: 'ACTIVE'
    }
    setTenants([cloned, ...tenants])
    setActionMessage(`Cloned tenant "${tenant.name}" into isolated Sandbox environment.`)
    setTimeout(() => setActionMessage(''), 4000)
  }

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.domain.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Globe size={13} className="text-cyan-400" /> Multi-Tenant Lifecycle & Isolation Manager
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Globe className="text-cyan-400" /> Tenant Provisioning & Lifecycle Management
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Provision isolated enterprise organization tenants, manage tenant cloning for sandboxes, execute encrypted backups, and configure tenant data residency.
            </p>
          </div>

          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={16} /> Provision New Tenant
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 text-[#102A43] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#2563EB] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tenant Table Card */}
      <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-sm font-black text-[#102A43] flex items-center gap-2">
            <Layers size={16} className="text-[#2563EB]" /> Active Enterprise Tenants ({filteredTenants.length})
          </h2>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenant name or domain..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] placeholder-[#52677F] focus:bg-white focus:border-[#2563EB] outline-none"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-[#52677F]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#102A43]">
            <thead className="bg-[#F6F9FD] text-[#52677F] font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Tenant Organization</th>
                <th className="px-4 py-3">Domain & Region</th>
                <th className="px-4 py-3">Plan & Users</th>
                <th className="px-4 py-3">Storage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6F2]">
              {filteredTenants.map(t => (
                <tr key={t.id} className="hover:bg-[#F6F9FD] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#102A43]">{t.name}</div>
                    <div className="text-[10px] text-[#52677F] font-mono">ID: {t.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-[#2563EB] font-semibold">{t.domain}</div>
                    <div className="text-[10px] text-[#52677F]">{t.region}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#102A43]">{t.plan}</div>
                    <div className="text-[10px] text-[#52677F]">{t.users.toLocaleString()} active users</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#102A43]">{t.storage}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => handleBackupTenant(t.name)}
                      className="p-1.5 rounded-xl border border-[#DCE6F2] hover:bg-slate-100 text-[#52677F] hover:text-[#102A43] cursor-pointer"
                      title="Snapshot Backup"
                    >
                      <Database size={14} />
                    </button>
                    <button
                      onClick={() => handleCloneTenant(t)}
                      className="p-1.5 rounded-xl border border-[#DCE6F2] hover:bg-slate-100 text-[#52677F] hover:text-[#102A43] cursor-pointer"
                      title="Clone Tenant Sandbox"
                    >
                      <Copy size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioning Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full p-6 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#102A43] flex items-center gap-2">
              <Globe className="text-[#2563EB]" /> Provision New Enterprise Tenant
            </h3>

            <form onSubmit={handleProvisionTenant} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#52677F] block mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="e.g. Machakos County Government"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#52677F] block mb-1">Subdomain</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={newTenantDomain}
                    onChange={(e) => setNewTenantDomain(e.target.value)}
                    placeholder="machakos"
                    className="w-full px-3 py-2 text-xs rounded-l-xl border border-r-0 border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
                  />
                  <span className="px-3 py-2 text-xs font-mono font-bold bg-[#F6F9FD] border border-[#DCE6F2] rounded-r-xl text-[#52677F]">
                    .staffroom.ke
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#52677F] block mb-1">Sovereign Plan</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
                >
                  <option>County Government Sovereign</option>
                  <option>Healthcare Clinical Enterprise</option>
                  <option>Corporate HR Enterprise</option>
                  <option>Financial Sovereign Vault</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DCE6F2] text-[#52677F] hover:bg-[#F6F9FD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xs cursor-pointer"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
