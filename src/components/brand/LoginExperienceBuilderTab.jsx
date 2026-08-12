import React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Lock,
  Layout,
  ShieldAlert,
  Bell,
  CheckCircle2,
  Eye,
  Sparkles,
  Monitor
} from 'lucide-react'

export default function LoginExperienceBuilderTab({ onNotify }) {
  const { brandConfig, updateBrandConfig } = useBrand()

  const handleUpdate = (field, val) => {
    updateBrandConfig({ [field]: val })
    if (onNotify) onNotify(`Updated ${field}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Lock size={13} className="text-cyan-400" />
            White-Label Login Experience & Security Portal Builder
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Login Layouts, Taglines, Banners & Maintenance Alerts
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure the authentication portal layout, enterprise tagline, security notices, maintenance mode toggle, and announcement banners seen by logging-in employees.
          </p>
        </div>
      </div>

      {/* LOGIN LAYOUT SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layout size={16} className="text-indigo-600" />
          Login Screen Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'split-hero', title: 'Split Screen Hero', desc: 'Brand image on left, login form on right' },
            { id: 'centered-card', title: 'Centered Card', desc: 'Classic centered card over subtle backdrop' },
            { id: 'fullscreen-bg', title: 'Fullscreen Canvas', desc: 'Translucent frosted form over rich hero canvas' },
            { id: 'minimal', title: 'Minimalist Form', desc: 'Ultra-clean form with fast loading profile' }
          ].map((style) => {
            const isSelected = brandConfig.loginStyle === style.id
            return (
              <button
                key={style.id}
                onClick={() => handleUpdate('loginStyle', style.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white block">{style.title}</span>
                <p className="text-[11px] text-slate-500">{style.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* TEXT & NOTICES CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-600" />
            Portal Messaging & Security Governance
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Enterprise Tagline
              </label>
              <input
                type="text"
                value={brandConfig.loginTagline}
                onChange={(e) => handleUpdate('loginTagline', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Security Compliance Notice
              </label>
              <input
                type="text"
                value={brandConfig.securityNotice}
                onChange={(e) => handleUpdate('securityNotice', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Global Announcement Banner
              </label>
              <input
                type="text"
                value={brandConfig.announcementBanner}
                onChange={(e) => handleUpdate('announcementBanner', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <div>
                <strong className="block text-rose-800 dark:text-rose-300 font-bold">
                  Enable System Maintenance Mode Lock
                </strong>
                <span className="text-[10px] text-rose-600 dark:text-rose-400">
                  Block non-admin logins and display custom maintenance alert
                </span>
              </div>
              <input
                type="checkbox"
                checked={brandConfig.maintenanceMode}
                onChange={(e) => handleUpdate('maintenanceMode', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* LIVE LOGIN PREVIEW (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye size={16} className="text-cyan-500" />
            Live Login Screen Preview
          </h3>

          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 text-xs border border-slate-800">
            {brandConfig.maintenanceMode && (
              <div className="p-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 font-mono text-[10px]">
                ⚠️ Maintenance Mode Active
              </div>
            )}

            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
              📢 {brandConfig.announcementBanner}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">{brandConfig.orgName}</h4>
              <p className="text-slate-400 text-[11px]">{brandConfig.loginTagline}</p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Work Email"
                disabled
                className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-[10px]"
              />
              <button
                className="w-full p-1.5 text-[10px] font-bold text-white rounded cursor-pointer"
                style={{ backgroundColor: brandConfig.primaryColor }}
              >
                Sign In
              </button>
            </div>

            <p className="text-[9px] text-slate-500 font-mono text-center">
              🔒 {brandConfig.securityNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
