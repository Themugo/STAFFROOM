import React, { useState } from 'react'
import {
  Database, Activity, Server, Download, Upload, HardDrive, RefreshCw,
  CheckCircle2, AlertTriangle, ShieldCheck, Zap, Cpu, Terminal
} from 'lucide-react'

const BACKUPS = [
  { id: 'BAK-20260803-01', size: '1.42 GB', type: 'FULL_SCHEMA_SNAPSHOT', retention: '30 Days', status: 'COMPLETED', timestamp: '2026-08-03 02:00:00 UTC' },
  { id: 'BAK-20260802-01', size: '1.41 GB', type: 'FULL_SCHEMA_SNAPSHOT', retention: '30 Days', status: 'COMPLETED', timestamp: '2026-08-02 02:00:00 UTC' },
  { id: 'BAK-20260801-01', size: '1.39 GB', type: 'FULL_SCHEMA_SNAPSHOT', retention: '30 Days', status: 'COMPLETED', timestamp: '2026-08-01 02:00:00 UTC' }
]

export default function DataAndMonitoringCenter() {
  const [activeSubTab, setActiveSubTab] = useState('DATA') // 'DATA' or 'TELEMETRY'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Database size={13} className="text-blue-400" /> Platform Data Lifecycle & Operational Telemetry
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Database className="text-blue-400" /> Data Governance & Infrastructure Monitoring
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Automated database snapshots, point-in-time restores, statutory retention policy enforcement, bulk import/export wizards, background job queues, and real-time system metrics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveSubTab('DATA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'DATA' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Data Backups & Retention
            </button>
            <button
              onClick={() => setActiveSubTab('TELEMETRY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'TELEMETRY' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              System Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: DATA BACKUPS */}
      {activeSubTab === 'DATA' && (
        <div className="space-y-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive size={16} className="text-blue-500" /> Automated Point-in-Time Database Snapshots
              </h3>

              <button className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold text-xs cursor-pointer shadow-md">
                Trigger Manual Backup Now
              </button>
            </div>

            <div className="space-y-3">
              {BACKUPS.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {b.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Size: {b.size} • Retention: {b.retention}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{b.timestamp}</span>
                    <button className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer">
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TELEMETRY */}
      {activeSubTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">PostgreSQL Connection Pool</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">18 / 100 Active Connections</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Latency: 12ms • Pooler Idle</p>
          </div>

          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Background Redis Job Queue</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">0 Failed • 14 Active Jobs</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Queue Processing Latency: 4ms</p>
          </div>
        </div>
      )}
    </div>
  )
}
