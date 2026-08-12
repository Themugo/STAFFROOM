import { useState } from 'react'
import {
  Activity,
  Cpu,
  Database,
  Radio,
  Sparkles,
  ShieldCheck,
  HardDrive,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Zap
} from 'lucide-react'

export default function PlatformObservabilityHealth() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Activity size={13} className="text-emerald-400" /> Platform Observability & Health Engine
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="text-emerald-400" /> System Observability & Tenant Health Radar
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time telemetry across API gateway requests, database connection pools, background worker queues, AI token consumption, and multi-tenant isolation compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-[#52677F] text-xs font-bold">
            <span className="flex items-center gap-1.5"><Cpu size={15} className="text-emerald-500" /> API Gateway</span>
            <span className="text-emerald-600 text-[10px] font-mono">99.99% SLA</span>
          </div>
          <h3 className="text-xl font-black text-[#102A43]">14.2M reqs/day</h3>
          <p className="text-[11px] text-[#52677F]">Avg Response: <strong className="font-mono text-[#102A43]">18 ms</strong></p>
        </div>

        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-[#52677F] text-xs font-bold">
            <span className="flex items-center gap-1.5"><Database size={15} className="text-[#2563EB]" /> Database Pools</span>
            <span className="text-[#2563EB] text-[10px] font-mono">Normal</span>
          </div>
          <h3 className="text-xl font-black text-[#102A43]">848.3 GB total</h3>
          <p className="text-[11px] text-[#52677F]">Active Connections: <strong className="font-mono text-[#102A43]">42 / 200</strong></p>
        </div>

        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-[#52677F] text-xs font-bold">
            <span className="flex items-center gap-1.5"><Radio size={15} className="text-[#2563EB]" /> Worker Queues</span>
            <span className="text-[#2563EB] text-[10px] font-mono">0 Lag</span>
          </div>
          <h3 className="text-xl font-black text-[#102A43]">425,000 jobs/hr</h3>
          <p className="text-[11px] text-[#52677F]">Failed Retries DLQ: <strong className="font-mono text-[#102A43]">0 jobs</strong></p>
        </div>

        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-[#52677F] text-xs font-bold">
            <span className="flex items-center gap-1.5"><Sparkles size={15} className="text-amber-500" /> AI Consumption</span>
            <span className="text-amber-600 text-[10px] font-mono">Active</span>
          </div>
          <h3 className="text-xl font-black text-[#102A43]">8.4M Tokens</h3>
          <p className="text-[11px] text-[#52677F]">Daily Budget Util: <strong className="font-mono text-[#102A43]">32%</strong></p>
        </div>
      </div>
    </div>
  )
}
