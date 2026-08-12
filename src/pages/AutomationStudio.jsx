import React, { useState } from 'react'
import { AutomationProvider, useAutomation } from '@/contexts/AutomationContext'
import VisualFlowBuilder from '@/components/automation/VisualFlowBuilder'
import AutomationMarketplaceTab from '@/components/automation/AutomationMarketplaceTab'
import FlowMonitorAndLogsTab from '@/components/automation/FlowMonitorAndLogsTab'
import AIAutomationAssistantTab from '@/components/automation/AIAutomationAssistantTab'
import AutomationDashboard from '@/components/automation/AutomationDashboard'
import {
  Zap,
  Plus,
  Play,
  Pause,
  Store,
  Activity,
  Bot,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Sliders,
  FileCode,
  Globe
} from 'lucide-react'

function AutomationStudioContent() {
  const { flows, toggleFlowStatus, runSimulation } = useAutomation()
  const [activeTab, setActiveTab] = useState('directory') // 'directory' | 'builder' | 'marketplace' | 'monitor' | 'assistant'
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleEditFlow = (flow) => {
    setSelectedFlow(flow)
    setActiveTab('builder')
  }

  const handleCreateNew = () => {
    setSelectedFlow(null)
    setActiveTab('builder')
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white border border-indigo-500/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5 border border-amber-500/20">
              <Zap size={14} /> PHASE E10 • ENTERPRISE AUTOMATION
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Enterprise Automation Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            No-code visual flow builder, scheduled cron jobs, trigger triggers, and AI-powered workflow orchestration across all StaffRoom modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:opacity-90 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus size={16} /> Create Automation Flow
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers size={14} /> Active Workflows ({flows.length})
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap size={14} /> Visual Flow Builder
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Store size={14} /> Automation Marketplace
        </button>

        <button
          onClick={() => setActiveTab('monitor')}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'monitor'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity size={14} /> Real-Time Monitor & Logs
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'assistant'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot size={14} /> AI Flow Assistant
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'directory' && (
        <AutomationDashboard
          onEditFlow={handleEditFlow}
          onCreateNewFlow={handleCreateNew}
          onNotify={showNotify}
        />
      )}

      {activeTab === 'builder' && (
        <VisualFlowBuilder
          selectedFlow={selectedFlow}
          onBack={() => setActiveTab('directory')}
          onNotify={showNotify}
        />
      )}

      {activeTab === 'marketplace' && (
        <AutomationMarketplaceTab
          onNotify={showNotify}
          onSelectFlow={(flow) => handleEditFlow(flow)}
        />
      )}

      {activeTab === 'monitor' && <FlowMonitorAndLogsTab onNotify={showNotify} />}

      {activeTab === 'assistant' && (
        <AIAutomationAssistantTab
          onNotify={showNotify}
          onEditFlow={(flow) => handleEditFlow(flow)}
        />
      )}
    </div>
  )
}

export default function AutomationStudio() {
  return (
    <AutomationProvider>
      <AutomationStudioContent />
    </AutomationProvider>
  )
}
