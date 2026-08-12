import { useState } from 'react'
import {
  Key, ShieldCheck, Plus, Trash2, Copy, Eye, EyeOff, Lock, RefreshCw,
  Check, AlertTriangle, Sliders, Activity, Clock, ShieldAlert, Globe, Server
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const DEFAULT_API_KEYS = [
  {
    id: 'key_live_01',
    name: 'Production Payroll Sync Service',
    prefix: 'str_live_89a...',
    fullKey: 'str_live_89a7f21e0b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    created: '2026-01-15',
    lastUsed: '3 minutes ago',
    scopes: ['staff:read', 'payroll:read', 'payroll:write', 'webhooks:manage'],
    status: 'Active',
    ipWhitelist: '192.168.1.100, 10.0.0.5',
    rateLimit: '1,000 req/min',
  },
  {
    id: 'key_live_02',
    name: 'Workforce Analytics BI Connector',
    prefix: 'str_live_41b...',
    fullKey: 'str_live_41b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1',
    created: '2026-03-10',
    lastUsed: '1 hour ago',
    scopes: ['analytics:read', 'reports:read'],
    status: 'Active',
    ipWhitelist: 'Any',
    rateLimit: '500 req/min',
  },
  {
    id: 'key_test_01',
    name: 'Development & Testing Token',
    prefix: 'str_test_99z...',
    fullKey: 'str_test_99z1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    created: '2026-06-01',
    lastUsed: 'Yesterday',
    scopes: ['staff:read', 'leave:read', 'leave:write'],
    status: 'Active',
    ipWhitelist: 'Any',
    rateLimit: '100 req/min',
  }
]

const DEFAULT_OAUTH_CLIENTS = [
  {
    id: 'client_01',
    name: 'StaffRoom Mobile Companion App',
    clientId: 'sr_app_mbl_9812371239',
    clientSecret: 'sr_sec_319827391827391823719823',
    redirectUris: ['https://mobile.company.com/oauth/callback'],
    grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
    scopes: ['openid', 'profile', 'leave:request', 'payslip:read'],
    status: 'Approved',
  },
  {
    id: 'client_02',
    name: 'Custom Internal HR Portal App',
    clientId: 'sr_app_int_4512839182',
    clientSecret: 'sr_sec_891238912389123891238912',
    redirectUris: ['https://hr-internal.company.com/auth/response'],
    grantTypes: ['authorization_code'],
    scopes: ['staff:read', 'documents:write'],
    status: 'Approved',
  }
]

const LIVE_LOGS = [
  { time: '19:40:12', method: 'GET', endpoint: '/v1/employees', status: 200, latency: '42ms', ip: '192.168.1.100', key: 'Production Payroll Sync' },
  { time: '19:38:50', method: 'POST', endpoint: '/v1/leave/requests', status: 201, latency: '88ms', ip: '10.0.0.5', key: 'Development & Testing Token' },
  { time: '19:35:01', method: 'GET', endpoint: '/v1/payroll/runs/2026-07', status: 200, latency: '120ms', ip: '192.168.1.100', key: 'Production Payroll Sync' },
  { time: '19:30:15', method: 'POST', endpoint: '/v1/webhooks/subscriptions', status: 429, latency: '12ms', ip: '203.0.113.19', key: 'Workforce Analytics BI' },
]

export default function ApiManagementConsole() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const showInfo = notifications?.info || ((m) => console.log(m))

  const [activeTab, setActiveTab] = useState('keys') // 'keys' | 'oauth' | 'quotas' | 'logs'
  const [apiKeys, setApiKeys] = useState(DEFAULT_API_KEYS)
  const [oauthClients, setOauthClients] = useState(DEFAULT_OAUTH_CLIENTS)

  // New Key Modal
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState(['staff:read', 'leave:read'])
  const [ipRestriction, setIpRestriction] = useState('')
  const [revealedKeyId, setRevealedKeyId] = useState(null)

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    showSuccess(`Copied ${label} to clipboard!`)
  }

  // Create API Key
  const handleCreateKey = () => {
    if (!newKeyName.trim()) return

    const randomHash = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12)
    const newKeyObj = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: `str_live_${randomHash.substring(0, 4)}...`,
      fullKey: `str_live_${randomHash}${randomHash}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scopes: selectedScopes,
      status: 'Active',
      ipWhitelist: ipRestriction.trim() || 'Any',
      rateLimit: '1,000 req/min',
    }

    setApiKeys([newKeyObj, ...apiKeys])
    setNewKeyName('')
    setIsKeyModalOpen(false)
    showSuccess(`Generated new API Key: ${newKeyObj.name}`)
  }

  // Revoke Key
  const handleRevokeKey = (keyId) => {
    setApiKeys(apiKeys.filter(k => k.id !== keyId))
    showInfo('API Key revoked & invalidated instantly.')
  }

  return (
    <div className="space-y-6">
      {/* Console Tab Bar */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              API Security, OAuth 2.1 & Key Management Console
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Provision secret API credentials, define RBAC/ABAC token scopes, configure IP restrictions, and audit rate limits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'keys', label: 'API Keys' },
              { id: 'oauth', label: 'OAuth 2.1 Clients' },
              { id: 'quotas', label: 'Quotas & Limits' },
              { id: 'logs', label: 'Live Telemetry' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: API KEYS */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Production API Keys ({apiKeys.length})
            </span>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Create API Key
            </button>
          </div>

          <div className="space-y-4">
            {apiKeys.map(key => (
              <div
                key={key.id}
                className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Key size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {key.name}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {key.status}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Created {key.created} • Last used: <strong className="text-slate-700 dark:text-slate-300">{key.lastUsed}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRevealedKeyId(revealedKeyId === key.id ? null : key.id)}
                      className="btn-secondary text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {revealedKeyId === key.id ? <EyeOff size={14} /> : <Eye size={14} />}
                      {revealedKeyId === key.id ? 'Hide Secret' : 'Reveal Secret'}
                    </button>
                    <button
                      onClick={() => handleCopy(key.fullKey, key.name)}
                      className="btn-secondary text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={14} /> Copy Secret
                    </button>
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>

                {/* Key Secret Display */}
                <div className="p-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs flex items-center justify-between border border-slate-800">
                  <span className="truncate pr-2">
                    {revealedKeyId === key.id ? key.fullKey : `${key.prefix}••••••••••••••••••••••••••••••••`}
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">HEADER: Authorization: Bearer</span>
                </div>

                {/* Scopes & Restrictions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">ASSIGNED RBAC SCOPES</span>
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">IP WHITELIST RESTRICTION</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{key.ipWhitelist}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">RATE LIMIT QUOTA</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{key.rateLimit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OAUTH 2.1 CLIENTS */}
      {activeTab === 'oauth' && (
        <div className="space-y-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock size={16} className="text-indigo-600" /> OAuth 2.1 Authorization Server & Client Applications
            </h3>
            <p className="text-xs text-slate-500">
              Register 3rd party applications using PKCE, Authorization Code Grant, and Client Credentials.
            </p>

            <div className="space-y-4 pt-2">
              {oauthClients.map(client => (
                <div key={client.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{client.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {client.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Client ID:</span>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span>{client.clientId}</span>
                        <button onClick={() => handleCopy(client.clientId, 'Client ID')} className="text-indigo-600 cursor-pointer">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Client Secret:</span>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span>••••••••••••••••••••••••</span>
                        <button onClick={() => handleCopy(client.clientSecret, 'Client Secret')} className="text-indigo-600 cursor-pointer">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUOTAS & LIMITS */}
      {activeTab === 'quotas' && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={16} className="text-indigo-600" /> Tenant-Wide Rate Limiting & Quota Management
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Burst Limit (Per Second)</span>
              <input type="number" defaultValue={50} className="input text-xs w-full bg-white dark:bg-slate-900" />
              <p className="text-[10px] text-slate-400">Maximum concurrent API spikes allowed.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Sustained Limit (Per Minute)</span>
              <input type="number" defaultValue={1000} className="input text-xs w-full bg-white dark:bg-slate-900" />
              <p className="text-[10px] text-slate-400">Standard API throughput window.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Daily Quota Cap</span>
              <input type="number" defaultValue={500000} className="input text-xs w-full bg-white dark:bg-slate-900" />
              <p className="text-[10px] text-slate-400">Daily total HTTP request allowance.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE TELEMETRY */}
      {activeTab === 'logs' && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" /> Real-time API Request Log Stream
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Socket Streaming
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 max-h-80 overflow-y-auto border border-slate-800">
            {LIVE_LOGS.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/60 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{log.time}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                    log.method === 'GET' ? 'bg-blue-950 text-blue-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {log.method}
                  </span>
                  <span className="text-slate-200">{log.endpoint}</span>
                </div>

                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-slate-400">{log.key}</span>
                  <span className="text-slate-500">{log.latency}</span>
                  <span className={`font-bold ${log.status === 200 || log.status === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    HTTP {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create API Key */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Provision New Enterprise API Key</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Key Name / Client Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Workday Payroll Integration Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="input text-xs w-full bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  IP Restriction Whitelist (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
                  value={ipRestriction}
                  onChange={(e) => setIpRestriction(e.target.value)}
                  className="input text-xs w-full bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsKeyModalOpen(false)} className="btn-secondary text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleCreateKey} className="btn-primary text-xs cursor-pointer">
                Generate API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
