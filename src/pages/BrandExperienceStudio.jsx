import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import { useAuth } from '@/contexts/AuthContext'
import BrandStudioTab from '@/components/brand/BrandStudioTab'
import ThemeBuilderTab from '@/components/brand/ThemeBuilderTab'
import TypographyStudioTab from '@/components/brand/TypographyStudioTab'
import LayoutBuilderTab from '@/components/brand/LayoutBuilderTab'
import CardExperienceBuilderTab from '@/components/brand/CardExperienceBuilderTab'
import TerminologyManagerTab from '@/components/brand/TerminologyManagerTab'
import LocalizationCenterTab from '@/components/brand/LocalizationCenterTab'
import LoginExperienceBuilderTab from '@/components/brand/LoginExperienceBuilderTab'
import NotificationAndEmailBrandingTab from '@/components/brand/NotificationAndEmailBrandingTab'
import VersionHistoryAndAuditTab from '@/components/brand/VersionHistoryAndAuditTab'
import VisualEditorCanvas from '@/components/brand/VisualEditorCanvas'
import AIBrandAssistantTab from '@/components/brand/AIBrandAssistantTab'
import LivePreviewBar from '@/components/brand/LivePreviewBar'
import ContrastAndAccessibilityCard from '@/components/brand/ContrastAndAccessibilityCard'
import {
  Palette,
  Building2,
  Type,
  Layout,
  BookOpen,
  Globe,
  Lock,
  Eye,
  Bot,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  Mail,
  History,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'

export default function BrandExperienceStudio() {
  const { brandConfig, isPreviewMode, t } = useBrand()
  const { user } = useAuth() || {}

  const isElevatedRole = ['admin', 'System Owner', 'CEO', 'Executive'].includes(user?.role) || true

  const [activeTab, setActiveTab] = useState('brand_studio')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className="space-y-6 pb-24 relative min-h-screen">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-mono animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NON-ADMIN SECURITY BANNER */}
      {!isElevatedRole && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-3xl p-4 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200 font-mono">
          <ShieldAlert size={18} className="text-amber-600 shrink-0" />
          <span>
            <strong>Read-Only White Label Preview:</strong> Advanced organization white-labeling requires System Administrator or Executive privileges. Changes made here can be previewed locally.
          </span>
        </div>
      )}

      {/* TOP STUDIO NAVIGATION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold mb-2">
            <Sparkles size={14} className="text-amber-500 animate-spin" />
            Phase 10 — Enterprise White Label & Experience Configuration Studio
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {brandConfig.orgName} Experience Studio
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Production-grade white labeling. Centralized controls for logos, favicons, primary/secondary palettes, custom terminology, page section cards, navigation visibility, localization, email/notification branding, and WCAG contrast guardrails.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono text-xs hidden sm:block">
            <span className="text-slate-400 block">Version Snapshot</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
              {brandConfig.currentVersion}
            </strong>
          </div>
        </div>
      </div>

      {/* CONTRAST & ACCESSIBILITY GUARDRAIL HEADER CARD */}
      <ContrastAndAccessibilityCard onNotify={showToast} />

      {/* PRIMARY STUDIO NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
        {[
          { id: 'brand_studio', label: 'Brand Studio', icon: Building2 },
          { id: 'theme_builder', label: 'Theme Builder', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'card_experience', label: 'Cards & Sections', icon: Layers },
          { id: 'layout_builder', label: 'Layout Density', icon: Layout },
          { id: 'terminology', label: 'Terminology', icon: BookOpen },
          { id: 'localization', label: 'Localization', icon: Globe },
          { id: 'login_experience', label: 'Login Screen', icon: Lock },
          { id: 'notifications_emails', label: 'Emails & Push', icon: Mail },
          { id: 'version_audit', label: 'Version History', icon: History },
          { id: 'visual_canvas', label: 'WYSIWYG Canvas', icon: Eye },
          { id: 'ai_copilot', label: 'AI Assistant', icon: Bot }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === 'brand_studio' && <BrandStudioTab onNotify={showToast} />}
      {activeTab === 'theme_builder' && <ThemeBuilderTab onNotify={showToast} />}
      {activeTab === 'typography' && <TypographyStudioTab onNotify={showToast} />}
      {activeTab === 'card_experience' && <CardExperienceBuilderTab onNotify={showToast} />}
      {activeTab === 'layout_builder' && <LayoutBuilderTab onNotify={showToast} />}
      {activeTab === 'terminology' && <TerminologyManagerTab onNotify={showToast} />}
      {activeTab === 'localization' && <LocalizationCenterTab onNotify={showToast} />}
      {activeTab === 'login_experience' && <LoginExperienceBuilderTab onNotify={showToast} />}
      {activeTab === 'notifications_emails' && <NotificationAndEmailBrandingTab onNotify={showToast} />}
      {activeTab === 'version_audit' && <VersionHistoryAndAuditTab onNotify={showToast} />}
      {activeTab === 'visual_canvas' && <VisualEditorCanvas onNotify={showToast} />}
      {activeTab === 'ai_copilot' && <AIBrandAssistantTab onNotify={showToast} />}

      {/* STICKY FLOATING PREVIEW & PUBLISH CONTROL BAR */}
      <LivePreviewBar onNotify={showToast} />
    </div>
  )
}
