import React, { useState } from 'react'
import {
  CreditCard, ShieldCheck, Cpu, RefreshCw, AlertTriangle, CheckCircle2,
  Sliders, Download, Zap, Layers, Clock, ArrowUpRight, Terminal
} from 'lucide-react'

const MODULE_LICENSES = [
  { module: 'Core Workforce Analytics & Attendance', allocatedSeats: 2000, activeSeats: 1420, price: '$4.50/seat/mo', status: 'ACTIVE' },
  { module: 'Statutory Payroll & KRA Tax Engine', allocatedSeats: 2000, activeSeats: 1380, price: '$3.80/seat/mo', status: 'ACTIVE' },
  { module: 'Transport & Fleet Logistics Intelligence', allocatedSeats: 500, activeSeats: 420, price: '$8.00/seat/mo', status: 'ACTIVE' },
  { module: 'Executive GRC & Governance Platform', allocatedSeats: 100, activeSeats: 45, price: '$15.00/seat/mo', status: 'ACTIVE' },
  { module: 'AI Copilot & Antigravity Intelligence', allocatedSeats: 50, activeSeats: 38, price: '$25.00/seat/mo', status: 'ACTIVE' }
]

const SYSTEM_UPDATES = [
  { version: 'v3.8.2-PROD', releaseDate: '2026-08-01', patchType: 'FEATURE_RELEASE', status: 'CURRENT_ACTIVE', notes: 'Integrated GRC Heat Matrix, SHIF 2.75% Gazetted tax updates & multi-tenant isolation fixes.' },
  { version: 'v3.8.1-PROD', releaseDate: '2026-07-15', patchType: 'SECURITY_PATCH', status: 'DEPLOYED', notes: 'Patched SAML 2.0 session token expiration edge case and upgraded DB connection pooler.' },
  { version: 'v3.8.0-PROD', releaseDate: '2026-06-30', patchType: 'MAJOR_RELEASE', status: 'DEPLOYED', notes: 'Launched Transport Telematics module, Biometric Geofencing & Executive OKR Studio.' }
]

export default function LicenseAndUpdateManager() {
  const [activeSubTab, setActiveSubTab] = useState('LICENSES') // 'LICENSES' or 'UPDATES'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <CreditCard size={13} className="text-blue-400" /> Subscription Quotas & Platform Update Manager
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <CreditCard className="text-blue-400" /> License Allocation & Release Lifecycle Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Track seat usage, AI token consumption, subscription renewals, version history, security patch compliance, maintenance windows, and rollback plans.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveSubTab('LICENSES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'LICENSES' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Subscription Licenses
            </button>
            <button
              onClick={() => setActiveSubTab('UPDATES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'UPDATES' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              System Updates & Releases
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LICENSES */}
      {activeSubTab === 'LICENSES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Subscription Plan</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">Enterprise Platinum Edition</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Annual Contract • Renews Jan 2027</p>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">AI Token Consumption</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">1.8M / 5.0M Tokens/mo</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">36% Usage Quota Consumed</p>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">API Gateway Calls</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">2.4M / 10M Requests</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">Health Score: 100%</p>
            </div>
          </div>

          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white">Module Seat Allocation Matrix</h3>

            <div className="space-y-3">
              {MODULE_LICENSES.map((lic, i) => {
                const percent = Math.round((lic.activeSeats / lic.allocatedSeats) * 100)

                return (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <strong className="text-slate-900 dark:text-white font-bold">{lic.module}</strong>
                      <span className="font-mono text-slate-500">{lic.activeSeats} / {lic.allocatedSeats} Seats ({percent}%)</span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: UPDATES */}
      {activeSubTab === 'UPDATES' && (
        <div className="space-y-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal size={16} className="text-blue-500" /> Platform Release History & Maintenance Log
            </h3>

            <div className="space-y-3">
              {SYSTEM_UPDATES.map((up) => (
                <div key={up.version} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{up.version}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {up.patchType}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {up.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">{up.notes}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">Released: {up.releaseDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
