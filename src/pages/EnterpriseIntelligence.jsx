import React, { useState } from 'react'
import {
  Globe, BarChart3, Sparkles, ShieldAlert, Grid, Sliders,
  Award, Bot, LayoutDashboard, Database, Activity, ChevronRight
} from 'lucide-react'

import DigitalTwinGraph from '../components/intelligence/DigitalTwinGraph'
import ExecutiveKpiLibrary from '../components/intelligence/ExecutiveKpiLibrary'
import PredictiveDecisionEngine from '../components/intelligence/PredictiveDecisionEngine'
import AnomalyDetectionRadar from '../components/intelligence/AnomalyDetectionRadar'
import ExecutiveHeatMaps from '../components/intelligence/ExecutiveHeatMaps'
import WhatIfSimulator from '../components/intelligence/WhatIfSimulator'
import OrganizationalHealthScore from '../components/intelligence/OrganizationalHealthScore'
import AiExecutiveAnalyst from '../components/intelligence/AiExecutiveAnalyst'
import SelfServiceDashboardBuilder from '../components/intelligence/SelfServiceDashboardBuilder'
import DataGovernanceCatalog from '../components/intelligence/DataGovernanceCatalog'

const TABS = [
  { id: 'digital_twin', label: 'Digital Twin Topology', icon: Globe },
  { id: 'executive_kpis', label: 'Executive KPI Library', icon: BarChart3 },
  { id: 'predictive_decisions', label: 'Predictive & Prescriptive AI', icon: Sparkles },
  { id: 'anomaly_radar', label: 'Anomaly Radar & Fraud', icon: ShieldAlert },
  { id: 'heat_maps', label: 'Executive Heat Maps', icon: Grid },
  { id: 'what_if_simulator', label: 'What-If Scenario Simulator', icon: Sliders },
  { id: 'health_score', label: 'Organizational Health Score', icon: Award },
  { id: 'ai_analyst', label: 'AI Analyst & Narrative Reports', icon: Bot },
  { id: 'self_service', label: 'Self-Service Canvas Builder', icon: LayoutDashboard },
  { id: 'data_governance', label: 'Data Governance & Catalog', icon: Database }
]

export default function EnterpriseIntelligence() {
  const [activeTab, setActiveTab] = useState('digital_twin')

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              StaffRoom Enterprise Intelligence Platform & Digital Twin v1.0
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Globe className="text-cyan-400" /> Enterprise Intelligence Layer & Digital Twin
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Transform transactional operations into predictive decision intelligence. Unify real-time telemetry across HR, Payroll, Fleet, Assets, Procurement, Finance, and Security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Enterprise Health</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                92.8 / 100 (Grade A+)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Render Containers */}
      <div className="space-y-6">
        {activeTab === 'digital_twin' && <DigitalTwinGraph />}
        {activeTab === 'executive_kpis' && <ExecutiveKpiLibrary />}
        {activeTab === 'predictive_decisions' && <PredictiveDecisionEngine />}
        {activeTab === 'anomaly_radar' && <AnomalyDetectionRadar />}
        {activeTab === 'heat_maps' && <ExecutiveHeatMaps />}
        {activeTab === 'what_if_simulator' && <WhatIfSimulator />}
        {activeTab === 'health_score' && <OrganizationalHealthScore />}
        {activeTab === 'ai_analyst' && <AiExecutiveAnalyst />}
        {activeTab === 'self_service' && <SelfServiceDashboardBuilder />}
        {activeTab === 'data_governance' && <DataGovernanceCatalog />}
      </div>
    </div>
  )
}
