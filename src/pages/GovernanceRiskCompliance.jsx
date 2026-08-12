import React, { useState } from 'react'
import {
  ShieldCheck, AlertTriangle, FileText, BookOpen, Scale,
  FolderKanban, Wrench, Calendar, Lock, ShieldAlert, Bot,
  Award, ChevronRight
} from 'lucide-react'

import GrcExecutiveCenter from '../components/grc/GrcExecutiveCenter'
import RiskRegisterMatrix from '../components/grc/RiskRegisterMatrix'
import EnterpriseControlsLibrary from '../components/grc/EnterpriseControlsLibrary'
import PolicyGovernanceCenter from '../components/grc/PolicyGovernanceCenter'
import ComplianceCenterFrameworks from '../components/grc/ComplianceCenterFrameworks'
import InternalAuditWorkspace from '../components/grc/InternalAuditWorkspace'
import IssueManagementCapa from '../components/grc/IssueManagementCapa'
import RegulatoryCalendarObligations from '../components/grc/RegulatoryCalendarObligations'
import AccessGovernanceSodEngine from '../components/grc/AccessGovernanceSodEngine'
import BusinessContinuityIncidents from '../components/grc/BusinessContinuityIncidents'
import AiGovernanceAssistant from '../components/grc/AiGovernanceAssistant'
import ImmutableAuditTrailReports from '../components/grc/ImmutableAuditTrailReports'

const GRC_TABS = [
  { id: 'grc_center', label: 'Governance Center', icon: ShieldCheck },
  { id: 'risk_register', label: 'Risk Register & 5x5 Matrix', icon: AlertTriangle },
  { id: 'controls_library', label: 'Controls Library', icon: ShieldAlert },
  { id: 'policy_governance', label: 'Policy Governance', icon: BookOpen },
  { id: 'compliance_center', label: 'Compliance & Frameworks', icon: Scale },
  { id: 'internal_audit', label: 'Internal Audit', icon: FolderKanban },
  { id: 'issue_management', label: 'Issue Management & CAPA', icon: Wrench },
  { id: 'regulatory_calendar', label: 'Regulatory Calendar', icon: Calendar },
  { id: 'sod_engine', label: 'Segregation of Duties (SoD)', icon: Lock },
  { id: 'business_continuity', label: 'Business Continuity (BCP)', icon: ShieldAlert },
  { id: 'ai_governance', label: 'AI Governance Assistant', icon: Bot },
  { id: 'immutable_audit', label: 'Immutable Audit Trail', icon: Lock }
]

export default function GovernanceRiskCompliance() {
  const [activeTab, setActiveTab] = useState('grc_center')

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {GRC_TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content Render Containers */}
      <div className="space-y-6">
        {activeTab === 'grc_center' && <GrcExecutiveCenter onNavigateTab={(tabId) => setActiveTab(tabId)} />}
        {activeTab === 'risk_register' && <RiskRegisterMatrix />}
        {activeTab === 'controls_library' && <EnterpriseControlsLibrary />}
        {activeTab === 'policy_governance' && <PolicyGovernanceCenter />}
        {activeTab === 'compliance_center' && <ComplianceCenterFrameworks />}
        {activeTab === 'internal_audit' && <InternalAuditWorkspace />}
        {activeTab === 'issue_management' && <IssueManagementCapa />}
        {activeTab === 'regulatory_calendar' && <RegulatoryCalendarObligations />}
        {activeTab === 'sod_engine' && <AccessGovernanceSodEngine />}
        {activeTab === 'business_continuity' && <BusinessContinuityIncidents />}
        {activeTab === 'ai_governance' && <AiGovernanceAssistant />}
        {activeTab === 'immutable_audit' && <ImmutableAuditTrailReports />}
      </div>
    </div>
  )
}
