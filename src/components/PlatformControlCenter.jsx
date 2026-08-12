import React, { useState, useEffect } from 'react'
import {
  Activity, Building2, Terminal, CheckCircle2, AlertCircle,
  Clock, ShieldCheck, Server, Users, HardDrive, Zap, Globe, ArrowUpRight,
  PlusCircle, FileText, Lock, Database, Sparkles, RefreshCw, Play, ShieldAlert,
  Layers, Cpu
} from 'lucide-react'

// Skeleton Loader Subcomponents for Dashboard Widgets
function PrimarySummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {/* System Health Card Skeleton */}
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

      {/* System Resource Usage Card Skeleton */}
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
              <div className="flex justify-between">
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Overview Details Card Skeleton */}
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
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-3.5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-2.5 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
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

export default function PlatformControlCenter({ onNavigateTab }) {
  const [actionNotice, setActionNotice] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 750)
    return () => clearTimeout(timer)
  }, [])

  const systemServices = [
    { name: 'API Gateway & OAuth Router', type: 'API', status: 'Operational', latency: '8ms', uptime: '100%', load: '24%', icon: Zap, categoryColor: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900', loadVal: 24 },
    { name: 'Core PostgreSQL Cluster', type: 'Database', status: 'Operational', latency: '12ms', uptime: '99.99%', load: '18%', icon: Database, categoryColor: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900', loadVal: 18 },
    { name: 'Redis Queue Worker Cluster', type: 'Background Job', status: 'Operational', latency: '4ms', uptime: '99.98%', load: '11%', icon: Layers, categoryColor: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900', loadVal: 11 },
    { name: 'SAML 2.0 / Azure AD SSO', type: 'API', status: 'Operational', latency: '15ms', uptime: '100%', load: '7%', icon: Lock, categoryColor: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900', loadVal: 7 },
    { name: 'Gemini AI Integration Engine', type: 'API', status: 'Operational', latency: '110ms', uptime: '99.95%', load: '36%', icon: Sparkles, categoryColor: 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900', loadVal: 36 },
  ]

  const auditLogs = [
    { id: 'LOG-8841', actor: 'admin@staffroom.ke', action: 'TENANT_PROVISIONED', target: 'Mombasa Logistics & Freight Ltd', time: '12 mins ago', status: 'Success' },
    { id: 'LOG-8840', actor: 'sec.officer@staffroom.ke', action: 'SSO_CONFIG_UPDATED', target: 'Nairobi HQ SAML Provider', time: '45 mins ago', status: 'Success' },
    { id: 'LOG-8839', actor: 'sys.auto@staffroom.internal', action: 'AUTOMATED_SNAPSHOT', target: 'Secondary Storage Replica', time: '2 hours ago', status: 'Success' },
    { id: 'LOG-8838', actor: 'admin@staffroom.ke', action: 'RBAC_ROLE_GRANTED', target: '4 Operations Managers Assigned', time: '5 hours ago', status: 'Success' },
    { id: 'LOG-8837', actor: 'audit.bot@staffroom.internal', action: 'LICENSE_QUOTA_AUDIT', target: '1,420 Active Seat Checks', time: '8 hours ago', status: 'Success' },
  ]

  const handleActionClick = (title, tabName = null) => {
    setActionNotice(`Executing Action: "${title}"...`)
    setTimeout(() => {
      setActionNotice(null)
      if (tabName && onNavigateTab) {
        onNavigateTab(tabName)
      }
    }, 1200)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setIsLoading(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setIsLoading(false)
    }, 750)
  }

  return (
    <div className="space-y-6">
      {/* Action Notification Toast / Banner */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-blue-600 text-white font-mono text-xs font-bold shadow-lg flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" /> {actionNotice}
          </span>
          <span className="text-[10px] uppercase opacity-80">Platform Control Engine</span>
        </div>
      )}

      {/* Top Banner & Quick Header Actions */}
      <div className="enterprise-card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                System Active
              </span>
              <span className="text-slate-400 text-xs font-mono">Control Plane v3.8.2</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Enterprise Platform Control Center</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Real-time multi-tenant telemetry, system health status indicators, tenant summary counts, and security audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleActionClick('Provision New Tenant', 'tenants')}
              className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle size={15} /> Provision New Tenant
            </button>

            <button
              onClick={() => handleActionClick('View System Logs', 'monitoring')}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <FileText size={15} /> View System Logs
            </button>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-blue-400' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Administrator Quick Actions Section Sidebar / Grid Card */}
      <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <Zap size={16} className="text-amber-500" /> Administrative Quick Actions & Shortcut Launchpad
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400">Control Plane Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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

      {/* Primary Summary Grid */}
      {isLoading ? (
        <PrimarySummarySkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tenant Overview Summary Count */}
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
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">12</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">100% Provisioned • 0 Suspended</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Isolation Standard</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">Schema-per-Tenant</strong>
            </div>
          </div>

          {/* Licensed Seat Summary */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('users')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-emerald-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Users & Seats</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Users size={18} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">1,420</span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Of 2,000 Allocated License Seats</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Seat Utilization</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">71.0% Active</strong>
            </div>
          </div>

          {/* Storage Summary */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('licenses')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Storage Usage</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <HardDrive size={18} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">284.5 GB</span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across 12 Tenant Schemas</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Backup Snapshot Status</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Encrypted & Verified</strong>
            </div>
          </div>

          {/* API Throughput */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('monitoring')}
            className="enterprise-card p-5 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-amber-400 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">API Queue Health</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Zap size={18} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">1,842 req/s</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">0 Failed Background Jobs</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Average Latency</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">9.4 ms</strong>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid: System Health, System Resource Usage & Tenant Overview Details */}
      {isLoading ? (
        <DashboardGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Card with Visual Status Indicators */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
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

          {/* Primary Telemetry Monitoring Badges (API, Database, Background Jobs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            {/* API Status Badge */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between cursor-help transition-all hover:border-blue-300 dark:hover:border-blue-700">
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
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">API Health</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white font-mono mt-0.5 block">100% Operational</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">8ms</span>
              </div>
            </div>

            {/* Database Status Badge */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 flex items-center justify-between cursor-help transition-all hover:border-purple-300 dark:hover:border-purple-700">
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
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">Database Health</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white font-mono mt-0.5 block">99.99% Operational</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">12ms</span>
              </div>
            </div>

            {/* Background Job Status Badge */}
            <div className="relative group/tooltip p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 flex items-center justify-between cursor-help transition-all hover:border-amber-300 dark:hover:border-amber-700">
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
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">Background Jobs</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white font-mono mt-0.5 block">0 Queued / OK</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">4ms</span>
              </div>
            </div>
          </div>

          {/* Service Health Monitoring Items */}
          <div className="space-y-2">
            {systemServices.map((service, index) => {
              const ServiceIcon = service.icon || Activity
              return (
                <div key={index} className="relative group/service p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs font-mono hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Visual Color-Coded Pulsing Dot Indicator with Hover Tooltip */}
                      <div className="relative group/dot cursor-help">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>

                        {/* Dot-specific floating tooltip */}
                        <div className="opacity-0 group-hover/dot:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 left-0 z-30 w-48 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] border border-slate-700">
                          <div className="font-bold text-emerald-400 mb-0.5">{service.name}</div>
                          <div>Status: <span className="text-emerald-300 font-bold">{service.status}</span></div>
                          <div>Latency: <span className="text-white font-bold">{service.latency}</span></div>
                          <div>Uptime: <span className="text-white font-bold">{service.uptime}</span></div>
                          <div className="absolute top-full left-2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>

                      <div className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shrink-0">
                        <ServiceIcon size={12} />
                      </div>

                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate block text-[11px]">{service.name}</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block">{service.uptime} • {service.latency}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 relative group/status cursor-help">
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 inline-flex items-center gap-1">
                        <CheckCircle2 size={9} /> {service.status}
                      </span>

                      {/* Status Hover Tooltip */}
                      <div className="opacity-0 group-hover/status:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full mb-2 right-0 z-30 w-44 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] border border-slate-700 text-left">
                        <div className="font-bold text-slate-200 mb-1 border-b border-slate-800 pb-1">Observability Telemetry</div>
                        <div className="flex justify-between text-slate-300"><span>Target SLA:</span><strong className="text-white">99.9%</strong></div>
                        <div className="flex justify-between text-slate-300"><span>Current Uptime:</span><strong className="text-emerald-400">{service.uptime}</strong></div>
                        <div className="flex justify-between text-slate-300"><span>Avg Response:</span><strong className="text-blue-400">{service.latency}</strong></div>
                        <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* System Resource Usage Widget Card */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
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

        {/* Tenant Overview Card */}
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
              <Building2 size={16} className="text-blue-500" /> Tenant Overview & Breakdown
            </h3>
            <button 
              onClick={() => onNavigateTab && onNavigateTab('tenants')}
              className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Manage Tenants →
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold uppercase block">Enterprise Tier</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">6</span>
                <span className="text-[10px] text-slate-500 block">50% Share</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-center">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold uppercase block">Business Tier</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">4</span>
                <span className="text-[10px] text-slate-500 block">33% Share</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase block">Standard Tier</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">2</span>
                <span className="text-[10px] text-slate-500 block">17% Share</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Globe size={14} className="text-blue-500" /> Kenya Region (Nairobi & Mombasa)
                </span>
                <strong className="text-slate-900 dark:text-white font-bold">8 Tenants</strong>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '66%' }} />
              </div>

              <div className="flex justify-between items-center font-mono text-xs pt-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Globe size={14} className="text-indigo-500" /> Uganda Region (Kampala)
                </span>
                <strong className="text-slate-900 dark:text-white font-bold">3 Tenants</strong>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '25%' }} />
              </div>

              <div className="flex justify-between items-center font-mono text-xs pt-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-500" /> Rwanda Region (Kigali)
                </span>
                <strong className="text-slate-900 dark:text-white font-bold">1 Tenant</strong>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Recent Activity Audit Logs Section */}
      {isLoading ? (
        <AuditLogsSkeleton />
      ) : (
        <div className="enterprise-card p-6 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
              <Terminal size={16} className="text-blue-500" /> Recent Activity Audit Log
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Streamed Audit Records</span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.id}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold">
                    {log.target}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Executed by <span className="text-slate-700 dark:text-slate-300 font-semibold">{log.actor}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1 text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> {log.status}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

