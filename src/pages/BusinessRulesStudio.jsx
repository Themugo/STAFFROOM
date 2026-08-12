import React, { useState } from 'react'
import { BusinessRulesProvider, useBusinessRules } from '@/contexts/BusinessRulesContext'
import PolicyEngineGrid from '@/components/rules/PolicyEngineGrid'
import VisualRuleBuilder from '@/components/rules/VisualRuleBuilder'
import FormulaAndValidationStudio from '@/components/rules/FormulaAndValidationStudio'
import TestingLabSimulator from '@/components/rules/TestingLabSimulator'
import AIRuleAssistantTab from '@/components/rules/AIRuleAssistantTab'
import RuleMarketplaceTab from '@/components/rules/RuleMarketplaceTab'
import VersionAndAuditTrailTab from '@/components/rules/VersionAndAuditTrailTab'
import {
  ShieldCheck,
  Sliders,
  Calculator,
  Play,
  Bot,
  ShoppingBag,
  History,
  CheckCircle2,
  Plus,
  Sparkles,
  Zap,
  Check
} from 'lucide-react'

function StudioContent() {
  const [activeTab, setActiveTab] = useState('rules_grid')
  const [editingRule, setEditingRule] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleEditRule = (rule) => {
    setEditingRule(rule)
    setActiveTab('builder')
  }

  const handleCreateNewRule = () => {
    setEditingRule(null)
    setActiveTab('builder')
  }

  const navTabs = [
    { id: 'rules_grid', label: 'Policy Engine Library', icon: ShieldCheck },
    { id: 'builder', label: 'Visual Rule Builder', icon: Sliders },
    { id: 'formulas', label: 'Formulas & Validations', icon: Calculator },
    { id: 'simulator', label: 'Testing Lab', icon: Play },
    { id: 'ai_assistant', label: 'AI Policy Assistant', icon: Bot },
    { id: 'marketplace', label: 'Rule Marketplace', icon: ShoppingBag },
    { id: 'audit_trail', label: 'Version & Audit Log', icon: History }
  ]

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      {/* NOTIFICATION TOAST BANNER */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TOP BRAND & STUDIO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold mb-2">
            <Zap size={13} className="text-amber-500" />
            STAFFROOM PHASE E7 — ENTERPRISE BUSINESS RULES & POLICY STUDIO
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Zero-Code Policy & Workflow Governance Studio
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Configure cross-module approval matrices, statutory payroll calculations, leave caps, and geofencing validation rules without software changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewRule}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all"
          >
            <Plus size={15} /> Create New Business Rule
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs font-bold">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'builder' && activeTab !== 'builder') {
                  setEditingRule(null)
                }
                setActiveTab(tab.id)
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* RENDER ACTIVE STUDIO TAB */}
      <div>
        {activeTab === 'rules_grid' && (
          <PolicyEngineGrid onEditRule={handleEditRule} onNotify={showNotification} />
        )}

        {activeTab === 'builder' && (
          <VisualRuleBuilder
            initialRule={editingRule}
            onNotify={showNotification}
            onSaveComplete={() => setActiveTab('rules_grid')}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaAndValidationStudio onNotify={showNotification} />
        )}

        {activeTab === 'simulator' && (
          <TestingLabSimulator onNotify={showNotification} />
        )}

        {activeTab === 'ai_assistant' && (
          <AIRuleAssistantTab onNotify={showNotification} />
        )}

        {activeTab === 'marketplace' && (
          <RuleMarketplaceTab onNotify={showNotification} />
        )}

        {activeTab === 'audit_trail' && (
          <VersionAndAuditTrailTab onNotify={showNotification} />
        )}
      </div>
    </div>
  )
}

export default function BusinessRulesStudio() {
  return (
    <BusinessRulesProvider>
      <StudioContent />
    </BusinessRulesProvider>
  )
}
