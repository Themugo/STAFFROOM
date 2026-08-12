import React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Mail,
  Bell,
  CheckCircle2,
  Sparkles,
  Sliders,
  Send,
  FileText,
  ShieldCheck,
  Volume2
} from 'lucide-react'

export default function NotificationAndEmailBrandingTab({ onNotify }) {
  const { brandConfig, updateDraftConfig } = useBrand()

  const handleTextChange = (field, val) => {
    updateDraftConfig({ [field]: val })
    if (onNotify) onNotify(`Updated ${field}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Mail size={13} className="text-cyan-400" />
            Email, Push & System Notification White-Labeling
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Configure Outbound Email Templates & Notification Styling
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Customize transactional email headers, company footers, primary action buttons, toast alert styles, push notification headers, and email disclaimers.
          </p>
        </div>
      </div>

      {/* EMAIL & NOTIFICATION SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EMAIL BRANDING (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail size={16} className="text-indigo-600" />
            Transactional Email Branding
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Email Header Title
              </label>
              <input
                type="text"
                value={brandConfig.emailHeaderTitle || ''}
                onChange={(e) => handleTextChange('emailHeaderTitle', e.target.value)}
                className="input font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Header BG Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandConfig.emailHeaderBg || '#0f172a'}
                    onChange={(e) => handleTextChange('emailHeaderBg', e.target.value)}
                    className="w-8 h-8 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={brandConfig.emailHeaderBg || '#0f172a'}
                    onChange={(e) => handleTextChange('emailHeaderBg', e.target.value)}
                    className="input font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Primary Button Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandConfig.emailPrimaryButtonBg || '#2563eb'}
                    onChange={(e) => handleTextChange('emailPrimaryButtonBg', e.target.value)}
                    className="w-8 h-8 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={brandConfig.emailPrimaryButtonBg || '#2563eb'}
                    onChange={(e) => handleTextChange('emailPrimaryButtonBg', e.target.value)}
                    className="input font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Email Footer Copyright Notice
              </label>
              <input
                type="text"
                value={brandConfig.emailFooterText || ''}
                onChange={(e) => handleTextChange('emailFooterText', e.target.value)}
                className="input font-medium"
              />
            </div>

            {/* LIVE EMAIL PREVIEW CARD */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Live Email Template Preview
              </span>

              <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-sm text-xs">
                <div className="p-4 text-white font-bold flex items-center justify-between" style={{ backgroundColor: brandConfig.emailHeaderBg || '#0f172a' }}>
                  <span>{brandConfig.emailHeaderTitle || 'StaffRoom Official Communication'}</span>
                  <span className="text-[10px] font-mono text-cyan-300">{brandConfig.shortName}</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white space-y-3">
                  <p className="font-semibold">Hello Sarah,</p>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">Your monthly salary disbursement slip for July 2026 is now available for download.</p>
                  <div className="pt-2">
                    <button className="px-4 py-2 rounded-xl text-white font-bold text-xs" style={{ backgroundColor: brandConfig.emailPrimaryButtonBg || '#2563eb' }}>
                      View Payslip Statement
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 text-center font-mono border-t border-slate-200 dark:border-slate-700">
                  {brandConfig.emailFooterText}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION BRANDING (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={16} className="text-indigo-600" />
            In-App Alert & Notification Branding
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Push Notification Title Banner
              </label>
              <input
                type="text"
                value={brandConfig.notificationPushTitle || ''}
                onChange={(e) => handleTextChange('notificationPushTitle', e.target.value)}
                className="input font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Toast Banner Style
              </label>
              <select
                value={brandConfig.notificationToastStyle || 'modern-slate'}
                onChange={(e) => handleTextChange('notificationToastStyle', e.target.value)}
                className="input"
              >
                <option value="modern-slate">Modern Slate Dark Canvas</option>
                <option value="branded-primary">Branded Accent Border</option>
                <option value="high-contrast">High Contrast Solid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Email Notification Footer Disclaimer
              </label>
              <textarea
                rows={2}
                value={brandConfig.notificationEmailFooter || ''}
                onChange={(e) => handleTextChange('notificationEmailFooter', e.target.value)}
                className="input"
              />
            </div>

            {/* LIVE TOAST PREVIEW CARD */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Live In-App Toast Alert Preview
              </span>

              <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 flex items-center gap-3 shadow-lg">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                  <Bell size={16} />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold block text-xs">{brandConfig.notificationPushTitle || 'StaffRoom Alert'}</span>
                  <p className="text-[11px] text-slate-300">Approval request #8402 has been signed off by Manager.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
