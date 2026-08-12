import { useState } from 'react'
import {
  Rocket, CheckCircle2, ShieldCheck, Compass, Radio,
  LifeBuoy, BookOpen, Layers, Award, Sparkles
} from 'lucide-react'
import LaunchReadinessOverview from '../components/launch/LaunchReadinessOverview'
import EndToEndQAReport from '../components/launch/EndToEndQAReport'
import OnboardingInteractiveTour from '../components/launch/OnboardingInteractiveTour'
import OperationsDisasterRecovery from '../components/launch/OperationsDisasterRecovery'
import CustomerSuccessHelpCenter from '../components/launch/CustomerSuccessHelpCenter'
import DocumentationSuite from '../components/launch/DocumentationSuite'

export default function LaunchDashboard() {
  const [activeTab, setActiveTab] = useState('readiness')

  const TABS = [
    { id: 'readiness', label: 'Launch Readiness', icon: Rocket },
    { id: 'qa', label: 'End-to-End QA', icon: CheckCircle2 },
    { id: 'onboarding', label: 'Interactive Onboarding', icon: Compass },
    { id: 'ops', label: 'Ops & DR SLA', icon: Radio },
    { id: 'support', label: 'Customer Success', icon: LifeBuoy },
    { id: 'docs', label: 'Documentation Suite', icon: BookOpen },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wide">
              Production Release Phase 16
            </span>
            <span className="text-xs text-slate-400 font-mono">v3.0.0 GA</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-indigo-600" /> Executive Production Launch & Quality Hub
          </h1>
          <p className="text-xs text-slate-500">
            Enterprise QA audit matrix, Core Web Vitals, accessibility compliance, role onboarding, and operational SLA monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>PRODUCTION LAUNCH GATE: APPROVED</span>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'readiness' && <LaunchReadinessOverview />}
        {activeTab === 'qa' && <EndToEndQAReport />}
        {activeTab === 'onboarding' && <OnboardingInteractiveTour />}
        {activeTab === 'ops' && <OperationsDisasterRecovery />}
        {activeTab === 'support' && <CustomerSuccessHelpCenter />}
        {activeTab === 'docs' && <DocumentationSuite />}
      </div>
    </div>
  )
}
