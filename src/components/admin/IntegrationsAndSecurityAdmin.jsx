import React, { useState } from 'react'
import {
  Lock, Key, ShieldCheck, Share2, Globe, Cpu, CheckCircle2,
  AlertTriangle, RefreshCw, Sliders, ExternalLink, Zap, Terminal, X
} from 'lucide-react'

const INTEGRATIONS = [
  { id: 'INT-M365', name: 'Microsoft 365 & Azure AD SSO', type: 'Identity & Calendar Sync', status: 'CONNECTED', lastSync: '1 min ago' },
  { id: 'INT-GW', name: 'Google Workspace Directory', type: 'Directory Sync', status: 'CONNECTED', lastSync: '5 mins ago' },
  { id: 'INT-MPESA', name: 'Safaricom M-PESA B2C Payroll Gateway', type: 'Payment Gateway', status: 'CONNECTED', lastSync: 'Continuous' },
  { id: 'INT-KRA', name: 'KRA iTax Statutory Return API', type: 'Government API', status: 'CONNECTED', lastSync: 'Daily' },
  { id: 'INT-SLACK', name: 'Slack Workplace Intelligence Bot', type: 'Communication', status: 'CONFIGURED', lastSync: '10 mins ago' }
]

export default function IntegrationsAndSecurityAdmin() {
  const [activeSubTab, setActiveSubTab] = useState('SECURITY') // 'SECURITY' or 'INTEGRATIONS'

  const [securityConfig, setSecurityConfig] = useState({
    mfaRequired: true,
    ssoEnforced: true,
    sessionTimeoutMins: 30,
    passwordLengthMin: 14,
    ipWhitelisting: '197.232.88.0/24 (Corporate Subnet)',
    encryptionStandard: 'AES-256-GCM & TLS 1.3'
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Lock size={13} className="text-blue-400" /> Platform Security & Integration Gateways
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Lock className="text-blue-400" /> Security Administration & Integration Hub
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Configure SAML 2.0 SSO, mandatory MFA, IP restrictions, encryption keys, M-PESA gateways, Microsoft 365, Google Workspace, and webhooks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveSubTab('SECURITY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'SECURITY' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Security Hardening
            </button>
            <button
              onClick={() => setActiveSubTab('INTEGRATIONS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'INTEGRATIONS' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Enterprise Integrations
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: SECURITY HARDENING */}
      {activeSubTab === 'SECURITY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck size={16} className="text-blue-500" /> Authentication & Session Policies
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Mandatory Multi-Factor Authentication (MFA)</strong>
                  <span className="text-slate-500 text-[11px]">Enforce MFA across all administrative and staff accounts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.mfaRequired}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, mfaRequired: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Single Sign-On (SSO) Enforcement</strong>
                  <span className="text-slate-500 text-[11px]">Require SAML 2.0 / Azure AD auth for corporate users.</span>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.ssoEnforced}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, ssoEnforced: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={securityConfig.sessionTimeoutMins}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeoutMins: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">IP CIDR Restriction Range</label>
                <input
                  type="text"
                  value={securityConfig.ipWhitelisting}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, ipWhitelisting: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold cursor-pointer shadow-md">
                  Update Security Policies
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lock size={16} className="text-blue-400" /> Active Platform Cryptographic Certificates
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-blue-300 font-bold block">Wildcard TLS 1.3 Certificate (*.staffroom.ke)</span>
                <p className="text-slate-300 text-[11px]">Issuer: DigiCert Global G2 • Valid until Dec 2027</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-emerald-300 font-bold block">PostgreSQL Field-Level AES-256 Encryption Keys</span>
                <p className="text-slate-300 text-[11px]">KMS Managed • Automated 90-day rotation enabled</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTEGRATIONS */}
      {activeSubTab === 'INTEGRATIONS' && (
        <div className="space-y-3">
          {INTEGRATIONS.map((int) => (
            <div key={int.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{int.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {int.type}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {int.status}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white">{int.name}</h3>
              <p className="text-xs text-slate-500 font-mono">Last Synchronized: {int.lastSync}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
