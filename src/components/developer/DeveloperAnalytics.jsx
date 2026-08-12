import { useState } from 'react'
import {
  Activity, Zap, Clock, ShieldAlert, CheckCircle2, TrendingUp,
  BarChart2, PieChart, Server, Webhook, RefreshCw
} from 'lucide-react'

export default function DeveloperAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Developer Analytics, Latency & API Health Monitoring
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics on throughput, p99 latency distributions, webhook delivery rates, and error rate budgets.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">24h API Throughput</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">1,482,900</div>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +14% vs yesterday</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Latency p95 / p99</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">42ms / 88ms</div>
          <span className="text-[10px] text-slate-400">Target SLA &lt; 150ms</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Webhook Delivery Success</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">99.92%</div>
          <span className="text-[10px] text-emerald-600 font-bold">1,890 events delivered</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Error Budget (4xx/5xx)</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">0.08%</div>
          <span className="text-[10px] text-slate-400">12 total failed requests</span>
        </div>
      </div>

      {/* Latency & Endpoint Health breakdown */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Endpoint Health & Latency Distribution</h3>

        <div className="space-y-3 text-xs">
          {[
            { endpoint: 'GET /v1/employees', requests: '840,200', p50: '18ms', p99: '45ms', status: 'Healthy' },
            { endpoint: 'POST /v1/leave/requests', requests: '320,100', p50: '32ms', p99: '82ms', status: 'Healthy' },
            { endpoint: 'POST /v1/payroll/runs', requests: '18,400', p50: '120ms', p99: '210ms', status: 'Healthy' },
            { endpoint: 'POST /v1/graphql', requests: '304,200', p50: '24ms', p99: '60ms', status: 'Healthy' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.endpoint}</span>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>{item.requests} req</span>
                <span>p50: {item.p50}</span>
                <span>p99: {item.p99}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
