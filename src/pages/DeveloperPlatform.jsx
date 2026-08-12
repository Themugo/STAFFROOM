import { useState } from 'react'
import {
  Code, Store, Key, Webhook, Radio, Terminal, BookOpen, Layers,
  Activity, Globe, ShieldCheck, Cpu, Sparkles, Check, Package,
  Kanban, GitBranch, Handshake, Bot, Settings
} from 'lucide-react'

import IntegrationMarketplace from '../components/developer/IntegrationMarketplace'
import ApiManagementConsole from '../components/developer/ApiManagementConsole'
import WebhookPlatform from '../components/developer/WebhookPlatform'
import EventBusViewer from '../components/developer/EventBusViewer'
import ApiExplorerSandbox from '../components/developer/ApiExplorerSandbox'
import DeveloperPortalDocs from '../components/developer/DeveloperPortalDocs'
import PluginCustomAppFramework from '../components/developer/PluginCustomAppFramework'
import DeveloperAnalytics from '../components/developer/DeveloperAnalytics'
import TenantConfigCenter from '../components/developer/TenantConfigCenter'

import SolutionBuilder from '../components/platform/SolutionBuilder'
import SolutionPacksMarketplace from '../components/platform/SolutionPacksMarketplace'
import TenantLifecycleManager from '../components/platform/TenantLifecycleManager'
import ImplementationCenterStudio from '../components/platform/ImplementationCenterStudio'
import EnvironmentPromotionManager from '../components/platform/EnvironmentPromotionManager'
import PartnerPortalWorkspace from '../components/platform/PartnerPortalWorkspace'
import PlatformObservabilityHealth from '../components/platform/PlatformObservabilityHealth'
import AiSolutionAssistantCenter from '../components/platform/AiSolutionAssistantCenter'

const TABS = [
  { id: 'solution_builder', label: '🛠️ Solution Builder', icon: Layers },
  { id: 'solution_packs', label: '📦 Solution Packs', icon: Package },
  { id: 'implementation_center', label: '📋 Migration & Implementation', icon: Kanban },
  { id: 'tenant_lifecycle', label: '🌐 Tenant Lifecycle', icon: Globe },
  { id: 'environment_pipeline', label: '🌿 Environments & Flags', icon: GitBranch },
  { id: 'partner_portal', label: '🤝 Partner Portal & SIs', icon: Handshake },
  { id: 'observability', label: '⚡ Observability & Health', icon: Activity },
  { id: 'ai_solution_assistant', label: '🤖 AI Solution Assistant', icon: Bot },
  { id: 'marketplace', label: 'Integration Marketplace', icon: Store },
  { id: 'api_management', label: 'API Keys & OAuth 2.1', icon: Key },
  { id: 'webhooks', label: 'Webhook Platform & DLQ', icon: Webhook },
  { id: 'event_bus', label: 'Real-time Event Bus', icon: Radio },
  { id: 'api_explorer', label: 'API Explorer & Sandbox', icon: Terminal },
  { id: 'developer_portal', label: 'SDKs & Documentation', icon: BookOpen },
  { id: 'plugins_custom', label: 'Plugin Framework', icon: Code },
  { id: 'analytics', label: 'Developer Analytics', icon: Activity },
  { id: 'tenant_config', label: 'Tenant White-labeling', icon: Settings },
]

export default function DeveloperPlatform() {
  const [activeTab, setActiveTab] = useState('solution_builder')

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Top Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              StaffRoom Enterprise Platform Ecosystem & Solution Architect v4.0
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Code className="text-indigo-400" /> Platform Ecosystem, Solution Builder & SDK
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Assemble enterprise solution packs, manage multi-tenant lifecycles, run data migration dry-runs, promote environments, and enable partner system integrators without modifying platform core.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform Gateway</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Sovereign Core (99.99% SLA)
              </span>
            </div>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-800/80 scrollbar-none">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content Renderer */}
      <div className="space-y-6">
        {activeTab === 'solution_builder' && <SolutionBuilder />}
        {activeTab === 'solution_packs' && <SolutionPacksMarketplace />}
        {activeTab === 'implementation_center' && <ImplementationCenterStudio />}
        {activeTab === 'tenant_lifecycle' && <TenantLifecycleManager />}
        {activeTab === 'environment_pipeline' && <EnvironmentPromotionManager />}
        {activeTab === 'partner_portal' && <PartnerPortalWorkspace />}
        {activeTab === 'observability' && <PlatformObservabilityHealth />}
        {activeTab === 'ai_solution_assistant' && <AiSolutionAssistantCenter />}
        {activeTab === 'marketplace' && <IntegrationMarketplace />}
        {activeTab === 'api_management' && <ApiManagementConsole />}
        {activeTab === 'webhooks' && <WebhookPlatform />}
        {activeTab === 'event_bus' && <EventBusViewer />}
        {activeTab === 'api_explorer' && <ApiExplorerSandbox />}
        {activeTab === 'developer_portal' && <DeveloperPortalDocs />}
        {activeTab === 'plugins_custom' && <PluginCustomAppFramework />}
        {activeTab === 'analytics' && <DeveloperAnalytics />}
        {activeTab === 'tenant_config' && <TenantConfigCenter />}
      </div>

    </div>
  )
}
