import React, { useState, useEffect } from 'react'
import {
  Activity, ShieldCheck, Server, Cpu, Database, Users, Building2,
  HardDrive, Zap, AlertTriangle, CheckCircle2, Clock, RefreshCw,
  Sliders, ArrowUpRight, Lock, Bell, Terminal, Sparkles, Globe, Layers,
  PlusCircle, FileText, ShieldAlert
} from 'lucide-react'

// Skeleton Loader Subcomponents for Admin Overview
function PrimaryKPIGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-2.5 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60"></div>
          ))}
        </div>
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-2.5 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="h-5 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60"></div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditLogsSkeleton() {
  return (
    <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-3.5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="space-y-1.5 items-end flex flex-col">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminOverviewCenter({ onNavigateTab }) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [actionNotice, setActionNotice] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 750)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setIsLoading(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setIsLoading(false)
    }, 750)
  }

  const handleActionClick = (title, tabName = null) => {
    setActionNotice(`Executing Action: "${title}"...`)
    setTimeout(() => {
      setActionNotice(null)
      if (tabName && onNavigateTab) {
        onNavigateTab(tabName)
      }
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-blue-600 text-white font-mono text-xs font-bold shadow-lg flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" /> {actionNotice}
          </span>
          <span className="text-[10px] uppercase opacity-80">Platform Control Engine</span>
        </div>
      )}

      {/* Control Plane Hero Banner */}
      <div className="enterprise-card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Server size={13} className="text-blue-400 animate-pulse" /> Enterprise Platform Control Plane (v3.8.2-PROD)
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-400" /> Platform Control Center & Health Telemetry
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time multi-tenant operations, global tenant health, licensing quotas, system security, DB connection pools, background queues, and AI infrastructure advisory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleActionClick('Provision New Tenant', 'tenants')}
              className="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md transition-all"
            >
              <PlusCircle size={15} /> Provision New Tenant
            </button>

            <button
              onClick={() => handleActionClick('View System Logs', 'monitoring')}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <FileText size={15} /> View System Logs
            </button>

            <button
              onClick={handleRefresh}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2 border border-slate-700 transition-all"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-400' : ''} /> Refresh Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Launchpad Section */}
      <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <Zap size={16} className="text-amber-500" /> Quick Actions & Operational Launchpad
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400">Super Admin Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleActionClick('Provision New Tenant', 'tenants')}
            className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 hover:border-blue-400 text-left cursor-pointer transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <PlusCircle size={18} />
              </div>
              <ArrowUpRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">Provision New Tenant</span>
              <span className="text-[10px] text-slate-500 block">Deploy isolated schema & admin setup</span>
            </div>
          </button>

          <button
            onClick={() => handleActionClick('View System Logs', 'monitoring')}
            className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 hover:border-emerald-400 text-left cursor-pointer transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <FileText size={18} />
              </div>
              <ArrowUpRight size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">View System Logs</span>
              <span className="text-[10px] text-slate-500 block">Stream real-time server & audit traces</span>
            </div>
          </button>

          <button
            onClick={() => handleActionClick('Manage RBAC & Users', 'users')}
            className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 hover:border-purple-400 text-left cursor-pointer transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                <Users size={18} />
              </div>
              <ArrowUpRight size={14} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">Manage User Roles</span>
              <span className="text-[10px] text-slate-500 block">Grant RBAC permissions & seat quotas</span>
            </div>
          </button>

          <button
            onClick={() => handleActionClick('Trigger Security Audit', 'integrations')}
            className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 hover:border-amber-400 text-left cursor-pointer transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                <ShieldAlert size={18} />
              </div>
              <ArrowUpRight size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">Security & Gateways</span>
              <span className="text-[10px] text-slate-500 block">Audit SAML 2.0 & API token policies</span>
            </div>
          </button>
        </div>
      </div>


      {/* Primary KPI Grid */}
      {isLoading ? (
        <PrimaryKPIGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tenant Overview Card */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('tenants')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Tenant Overview</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Building2 size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">12 Enterprise Tenants</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">100% Provisioned • 0 Suspended</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Isolation Standard</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">PostgreSQL Schema-per-Tenant</strong>
            </div>
          </div>

          {/* Licensed Users Card */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('users')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Licensed Seats</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Users size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">1,420 / 2,000 Seats</div>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">71% License Utilization</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Active Sessions</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">842 Concurrent Users</strong>
            </div>
          </div>

          {/* Storage & Database Card */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('licenses')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Storage & Database</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <HardDrive size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">4.2 TB / 10 TB</div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1">42% Used • Read Replicas Healthy</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>DB Latency</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">14ms Average</strong>
            </div>
          </div>

          {/* API & Queue Health Card */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('monitoring')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-amber-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">API & Queues</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Zap size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">99.98% Uptime</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">0 Failed Background Jobs</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>AI Token Rate</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">18.4k Tokens/min</strong>
            </div>
          </div>
        </div>
      )}

      {/* Grid Section: System Health + System Resource Usage + Tenant Summary Breakdown */}
      {isLoading ? (
        <DashboardGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Status Indicators Card */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
              <Activity size={16} className="text-emerald-500" /> Platform System Health
            </h3>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational
            </span>
          </div>

          {/* Core Telemetry Health Badges (API, Database, Background Jobs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            {/* API Health */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between font-mono cursor-help transition-all hover:border-blue-300 dark:hover:border-blue-700">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-52 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[11px] font-mono border border-slate-700">
                <div className="font-bold text-blue-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
                  <span>API Telemetry</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">100% Uptime</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="flex justify-between"><span>Avg Response:</span><strong className="text-white">8ms</strong></div>
                  <div className="flex justify-between"><span>Throughput:</span><strong className="text-white">10.4k req/s</strong></div>
                  <div className="flex justify-between"><span>Error Rate:</span><strong className="text-emerald-400">0.00%</strong></div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Zap size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">API Health</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5 block">100% Operational</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">8ms</span>
              </div>
            </div>

            {/* Database Health */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 flex items-center justify-between font-mono cursor-help transition-all hover:border-purple-300 dark:hover:border-purple-700">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-52 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[11px] font-mono border border-slate-700">
                <div className="font-bold text-purple-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
                  <span>Database Telemetry</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">99.99% Uptime</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="flex justify-between"><span>Query Latency:</span><strong className="text-white">12ms</strong></div>
                  <div className="flex justify-between"><span>Connection Pools:</span><strong className="text-white">18/100 Active</strong></div>
                  <div className="flex justify-between"><span>Replication Lag:</span><strong className="text-emerald-400">&lt; 1ms</strong></div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
                  <Database size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">Database Health</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5 block">99.99% Operational</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">12ms</span>
              </div>
            </div>

            {/* Background Job Health */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 flex items-center justify-between font-mono cursor-help transition-all hover:border-amber-300 dark:hover:border-amber-700">
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-52 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[11px] font-mono border border-slate-700">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
                  <span>Job Queue Telemetry</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">99.98% Uptime</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="flex justify-between"><span>Worker Latency:</span><strong className="text-white">4ms</strong></div>
                  <div className="flex justify-between"><span>Active Workers:</span><strong className="text-white">14 Running</strong></div>
                  <div className="flex justify-between"><span>Failed Jobs:</span><strong className="text-emerald-400">0</strong></div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-600 text-white shadow-xs">
                  <Layers size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">Background Jobs</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5 block">0 Queued Errors</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">4ms</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { service: 'API Gateway & OAuth Router', type: 'API', icon: Zap, metrics: 'Rate limit 10k req/min • 0 Throttled', status: 'HEALTHY', latency: '8ms', uptime: '100%', typeColor: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
              { service: 'PostgreSQL Database Engine', type: 'Database', icon: Database, metrics: '18/100 Active Pools • Read Replicas Live', status: 'HEALTHY', latency: '12ms', uptime: '99.99%', typeColor: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900' },
              { service: 'Redis Queue Worker Cluster', type: 'Background Job', icon: Layers, metrics: '14 Active Jobs • 0 Failed', status: 'HEALTHY', latency: '4ms', uptime: '99.98%', typeColor: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
              { service: 'SAML 2.0 / Azure AD SSO Gateway', type: 'Auth & SSO', icon: Lock, metrics: 'Identity Federation Handshake OK', status: 'HEALTHY', latency: '18ms', uptime: '100%', typeColor: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900' },
              { service: 'Gemini AI Assistant Engine', type: 'AI Service', icon: Sparkles, metrics: 'Quota 5.0M Tokens/mo • 36% Used', status: 'HEALTHY', latency: '120ms', uptime: '99.95%', typeColor: 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900' }
            ].map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <div key={idx} className="relative group/service p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Visual Color-Coded Pulsing Dot Indicator with Tooltip */}
                    <div className="relative group/dot cursor-help">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                      </span>

                      {/* Floating Tooltip */}
                      <div className="opacity-0 group-hover/dot:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 left-0 z-30 w-48 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] border border-slate-700">
                        <div className="font-bold text-emerald-400 mb-0.5">{item.service}</div>
                        <div>Status: <span className="text-emerald-300 font-bold">{item.status}</span></div>
                        <div>Latency: <span className="text-white font-bold">{item.latency}</span></div>
                        <div>Uptime: <span className="text-white font-bold">{item.uptime}</span></div>
                        <div className="absolute top-full left-2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shrink-0">
                      <ItemIcon size={13} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{item.service}</span>
                        <span className={`px-1.5 py-0.25 rounded-md text-[9px] font-extrabold uppercase border ${item.typeColor}`}>
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.metrics}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 relative group/status cursor-help">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 block">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.latency}</span>

                    {/* Status Hover Tooltip */}
                    <div className="opacity-0 group-hover/status:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 right-0 z-30 w-44 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] border border-slate-700 text-left font-mono">
                      <div className="font-bold text-slate-200 mb-1 border-b border-slate-800 pb-1">Observability Telemetry</div>
                      <div className="flex justify-between text-slate-300"><span>Target SLA:</span><strong className="text-white">99.9%</strong></div>
                      <div className="flex justify-between text-slate-300"><span>Current Uptime:</span><strong className="text-emerald-400">{item.uptime}</strong></div>
                      <div className="flex justify-between text-slate-300"><span>Avg Latency:</span><strong className="text-blue-400">{item.latency}</strong></div>
                      <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* System Resource Usage Widget Card */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
              <Cpu size={16} className="text-blue-500" /> System Resource Usage
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Hardware Active
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* CPU Utilization Widget Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Cpu size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">CPU Utilization</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">8 vCPU Cores • 2.8 GHz Cluster</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">34%</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Normal Load</span>
                </div>
              </div>

              {/* CPU Mini Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs" 
                    style={{ width: '34%' }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>User: 22%</span>
                  <span>System: 9%</span>
                  <span>Idle: 66%</span>
                </div>
              </div>
            </div>

            {/* Memory Utilization Widget Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
                    <Server size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Memory Utilization</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">19.8 GB / 32.0 GB Allocated</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono">62%</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Healthy Pool</span>
                </div>
              </div>

              {/* Memory Mini Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-violet-600 h-full rounded-full transition-all duration-500 shadow-xs" 
                    style={{ width: '62%' }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Active: 14.2 GB</span>
                  <span>Cache: 5.6 GB</span>
                  <span>Free: 12.2 GB</span>
                </div>
              </div>
            </div>

            {/* NVMe Disk Storage Utilization Widget Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <HardDrive size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Disk Storage Pool</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">284.5 GB / 500 GB NVMe Storage</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">57%</span>
                  <span className="text-[9px] text-slate-400 font-bold block">142 MB/s I/O</span>
                </div>
              </div>

              {/* Storage Mini Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-xs" 
                    style={{ width: '57%' }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Read: 142 MB/s</span>
                  <span>Write: 84 MB/s</span>
                  <span>IOPS: 4.2k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Overview Summary Distribution Card */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" /> Tenant Distribution & Regional Breakdown
            </h3>
            <button 
              onClick={() => onNavigateTab && onNavigateTab('tenants')}
              className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Manage Tenants →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold uppercase block">Enterprise</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">6</span>
                <span className="text-[10px] text-slate-500 block">Premium Tier</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-center">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold uppercase block">Business</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">4</span>
                <span className="text-[10px] text-slate-500 block">Pro Tier</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase block">Standard</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">2</span>
                <span className="text-[10px] text-slate-500 block">Growth Tier</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                <span className="flex items-center gap-1.5"><Globe size={13} className="text-blue-500" /> East Africa Region (Kenya)</span>
                <span>8 Tenants (66%)</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                <span className="flex items-center gap-1.5"><Globe size={13} className="text-indigo-500" /> East Africa Region (Uganda)</span>
                <span>3 Tenants (25%)</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                <span className="flex items-center gap-1.5"><Globe size={13} className="text-emerald-500" /> Central Africa Region (Rwanda)</span>
                <span>1 Tenant (9%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Admin Action Feed & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity Log */}
        {isLoading ? (
          <div className="lg:col-span-2">
            <AuditLogsSkeleton />
          </div>
        ) : (
          <div className="lg:col-span-2 enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal size={16} className="text-blue-500" /> Recent Platform Administrative Activity Audit Stream
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400">Real-Time Control Log</span>
            </div>

            <div className="space-y-3">
              {[
                { actor: 'admin@staffroom.ke', action: 'PROVISION_TENANT', target: 'Mombasa Logistics & Freight Ltd', timestamp: '12 mins ago', status: 'SUCCESS' },
                { actor: 'sec.officer@staffroom.ke', action: 'UPDATE_SSO_CONFIG', target: 'Nairobi Central HQ SAML 2.0 Provider', timestamp: '45 mins ago', status: 'SUCCESS' },
                { actor: 'sys.auto@staffroom.internal', action: 'AUTOMATED_DB_BACKUP', target: 'EU-WEST-1 Secondary Replica Cluster', timestamp: '2 hours ago', status: 'SUCCESS' },
                { actor: 'admin@staffroom.ke', action: 'ROLE_PERMISSION_GRANT', target: 'Assigned "Transport Ops Admin" to 4 Users', timestamp: '5 hours ago', status: 'SUCCESS' },
                { actor: 'audit.bot@staffroom.internal', action: 'LICENSE_QUOTA_CHECK', target: 'Validated 1,420 user seat allocations', timestamp: '8 hours ago', status: 'SUCCESS' }
              ].map((log, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{log.action}</span>
                      <span>{log.target}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">By: {log.actor}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Plane AI Advisor */}
        <div className="enterprise-card p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles size={16} className="text-blue-400 animate-pulse" /> AI Control Plane Recommendations
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <strong className="text-blue-300 font-bold block">Database Index Optimization</strong>
              <p className="text-slate-300 text-[11px]">
                Index recommendation available on `attendance_biometrics` table. Potential query speed boost of 34%.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <strong className="text-emerald-300 font-bold block">Unused Module License Optimization</strong>
              <p className="text-slate-300 text-[11px]">
                Kisumu Branch has 18 inactive seats under "Benchmarking Module". Re-allocating can save $420/month.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <strong className="text-amber-300 font-bold block">MFA Enforcement Advisory</strong>
              <p className="text-slate-300 text-[11px]">
                3 newly added HR Payroll Admins lack MFA setup. Require MFA before next login window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

