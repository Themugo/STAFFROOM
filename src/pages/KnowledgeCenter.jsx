import React, { useState } from 'react'
import { KnowledgeProvider, useKnowledge } from '@/contexts/KnowledgeContext'
import KnowledgeSpacesNav from '@/components/knowledge/KnowledgeSpacesNav'
import DocumentExplorerAndViewer from '@/components/knowledge/DocumentExplorerAndViewer'
import RichDocumentEditorModal from '@/components/knowledge/RichDocumentEditorModal'
import ProcessLibraryTab from '@/components/knowledge/ProcessLibraryTab'
import OrganizationalWikiTab from '@/components/knowledge/OrganizationalWikiTab'
import TemplateLibraryTab from '@/components/knowledge/TemplateLibraryTab'
import MeetingKnowledgeTab from '@/components/knowledge/MeetingKnowledgeTab'
import AIKnowledgeAssistantTab from '@/components/knowledge/AIKnowledgeAssistantTab'
import GovernanceAndAnalyticsTab from '@/components/knowledge/GovernanceAndAnalyticsTab'
import {
  BookOpen,
  FileText,
  GitCommit,
  HelpCircle,
  FileCode,
  Users,
  Sparkles,
  ShieldCheck,
  Globe,
  Bell,
  CheckCircle2
} from 'lucide-react'

function KnowledgeCenterContent() {
  const { documents, processes, templates, meetings, activeLanguage, setActiveLanguage } = useKnowledge()

  const [activeTab, setActiveTab] = useState('DOCUMENTS')
  const [selectedSpaceId, setSelectedSpaceId] = useState('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showNotification = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[11px] font-mono font-bold border border-indigo-200 dark:border-indigo-800">
              StaffRoom Phase E9
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              • Enterprise Knowledge, SOP & Digital Workplace
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Knowledge Operating System
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            One trusted place for organizational policies, standard operating procedures (SOPs), runbooks, business process flowcharts, meeting minutes, and AI semantic discovery.
          </p>
        </div>

        {/* MULTI-LANGUAGE SELECTOR & QUICK METRICS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold">
            <Globe size={15} className="text-indigo-600" />
            <select
              value={activeLanguage}
              onChange={(e) => setActiveLanguage(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="English">English (US)</option>
              <option value="Swahili">Kiswahili (East Africa)</option>
              <option value="French">Français (Regional)</option>
            </select>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-2"
          >
            + Author Document
          </button>
        </div>
      </div>

      {/* KNOWLEDGE SPACES NAV BAR */}
      <KnowledgeSpacesNav
        selectedSpaceId={selectedSpaceId}
        onSelectSpace={(spId) => setSelectedSpaceId(spId)}
      />

      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 font-mono text-xs font-bold">
        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'DOCUMENTS'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <FileText size={15} /> SOP & Policy Vault ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('PROCESSES')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PROCESSES'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <GitCommit size={15} /> Process Library ({processes.length})
        </button>

        <button
          onClick={() => setActiveTab('WIKI')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'WIKI'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <HelpCircle size={15} /> Org Wiki & FAQs
        </button>

        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'TEMPLATES'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <FileCode size={15} /> Templates ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('MEETINGS')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'MEETINGS'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Users size={15} /> Meeting Knowledge ({meetings.length})
        </button>

        <button
          onClick={() => setActiveTab('AI_COPILOT')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'AI_COPILOT'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={15} className="text-amber-300" /> AI Knowledge Assistant
        </button>

        <button
          onClick={() => setActiveTab('GOVERNANCE')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'GOVERNANCE'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck size={15} /> Governance & Analytics
        </button>
      </div>

      {/* ACTIVE TAB VIEW */}
      {activeTab === 'DOCUMENTS' && (
        <DocumentExplorerAndViewer
          selectedSpaceId={selectedSpaceId}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onNotify={showNotification}
        />
      )}

      {activeTab === 'PROCESSES' && (
        <ProcessLibraryTab onNotify={showNotification} />
      )}

      {activeTab === 'WIKI' && (
        <OrganizationalWikiTab onNotify={showNotification} />
      )}

      {activeTab === 'TEMPLATES' && (
        <TemplateLibraryTab onNotify={showNotification} />
      )}

      {activeTab === 'MEETINGS' && (
        <MeetingKnowledgeTab onNotify={showNotification} />
      )}

      {activeTab === 'AI_COPILOT' && (
        <AIKnowledgeAssistantTab onNotify={showNotification} />
      )}

      {activeTab === 'GOVERNANCE' && (
        <GovernanceAndAnalyticsTab />
      )}

      {/* RICH DOCUMENT CREATION MODAL */}
      <RichDocumentEditorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNotify={showNotification}
      />
    </div>
  )
}

export default function KnowledgeCenter() {
  return (
    <KnowledgeProvider>
      <KnowledgeCenterContent />
    </KnowledgeProvider>
  )
}
