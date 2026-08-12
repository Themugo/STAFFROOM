import React, { useState } from 'react'
import {
  ShieldCheck, Server, Building2, Users, Palette, CreditCard,
  Lock, Database, Sparkles, Sliders
} from 'lucide-react'

import AdminOverviewCenter from '../components/admin/AdminOverviewCenter'
import TenantManagementStudio from '../components/admin/TenantManagementStudio'
import UserAndRoleGovernance from '../components/admin/UserAndRoleGovernance'
import WhiteLabelAndLocalization from '../components/admin/WhiteLabelAndLocalization'
import LicenseAndUpdateManager from '../components/admin/LicenseAndUpdateManager'
import IntegrationsAndSecurityAdmin from '../components/admin/IntegrationsAndSecurityAdmin'
import DataAndMonitoringCenter from '../components/admin/DataAndMonitoringCenter'
import AiAdminAssistantAndToolkit from '../components/admin/AiAdminAssistantAndToolkit'

export default function PlatformControlCenter() {
  const [activeTab, setActiveTab] = useState('overview')

  const TABS = [
    { id: 'overview', label: 'Platform Telemetry', icon: Server },
    { id: 'tenants', label: 'Tenant Lifecycle', icon: Building2 },
    { id: 'users', label: 'Users & RBAC Roles', icon: Users },
    { id: 'whitelabel', label: 'White-Label & Branding', icon: Palette },
    { id: 'licenses', label: 'Licenses & Updates', icon: CreditCard },
    { id: 'integrations', label: 'Security & Gateways', icon: Lock },
    { id: 'monitoring', label: 'Data & Telemetry', icon: Database },
    { id: 'ai_assistant', label: 'AI Advisory & Toolkit', icon: Sparkles }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Platform Administration Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-blue-600 text-white shadow-md">
              <ShieldCheck size={20} />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Platform Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized enterprise multi-tenant administration, security hardening, license quotas, and AI operations control plane.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Super Admin Authenticated
          </span>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content Display */}
      <div className="transition-all">
        {activeTab === 'overview' && <AdminOverviewCenter onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'tenants' && <TenantManagementStudio />}
        {activeTab === 'users' && <UserAndRoleGovernance />}
        {activeTab === 'whitelabel' && <WhiteLabelAndLocalization />}
        {activeTab === 'licenses' && <LicenseAndUpdateManager />}
        {activeTab === 'integrations' && <IntegrationsAndSecurityAdmin />}
        {activeTab === 'monitoring' && <DataAndMonitoringCenter />}
        {activeTab === 'ai_assistant' && <AiAdminAssistantAndToolkit />}
      </div>
    </div>
  )
}
