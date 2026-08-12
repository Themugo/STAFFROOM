import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Eye,
  Sliders,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layout,
  Car,
  Users,
  DollarSign,
  ShieldCheck,
  Building2,
  Lock,
  ArrowUpRight
} from 'lucide-react'

export default function VisualEditorCanvas({ onNotify }) {
  const { brandConfig, t, publishVersion, resetToDefaults } = useBrand()
  const [selectedModule, setSelectedModule] = useState('dashboard')
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      const ver = publishVersion()
      setIsPublishing(false)
      if (onNotify) onNotify(`Successfully published brand version ${ver}!`)
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Eye size={13} className="text-cyan-400" />
            Live Visual Editor & Multi-Module Render Canvas
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            WYSIWYG Brand Simulator & Version Publishing
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Test and preview your customized white-label logo, theme colors, font pairings, and terminology across core StaffRoom application views in real time before publishing to live tenants.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            {isPublishing ? 'Publishing...' : 'Publish Brand Version'}
          </button>
        </div>
      </div>

      {/* VERSIONING & MODULE SELECTOR BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Published Version:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            {brandConfig.currentVersion}
          </span>
          <span className="text-slate-400 text-[10px]">Last: {brandConfig.lastPublishedAt}</span>
        </div>

        {/* Module View Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layout },
            { id: 'directory', label: `${t('Employee')} Directory`, icon: Users },
            { id: 'transport', label: 'Transport Control', icon: Car },
            { id: 'payroll', label: 'Payroll Voucher', icon: DollarSign }
          ].map((mod) => {
            const Icon = mod.icon
            const isActive = selectedModule === mod.id
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon size={14} />
                {mod.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* LIVE SIMULATOR CANVAS STAGE */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-white min-h-[420px]">
        {/* SIMULATED TOPBAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {brandConfig.logoUrl ? (
              <img src={brandConfig.logoUrl} alt="Logo" className="h-7 max-w-[120px] object-contain" />
            ) : (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white"
                style={{ backgroundColor: brandConfig.primaryColor }}
              >
                {brandConfig.shortName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm text-white">{brandConfig.orgName}</h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {t('Company')} White-Label Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 text-[10px] font-mono font-bold text-white rounded-xl"
              style={{ backgroundColor: brandConfig.primaryColor }}
            >
              {t('HR')} Active Session
            </span>
          </div>
        </div>

        {/* MODULE VIEW 1: DASHBOARD */}
        {selectedModule === 'dashboard' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Layout size={18} style={{ color: brandConfig.accentColor }} />
                {t('Company')} Executive Dashboard
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Language: {brandConfig.language} • Currency: {brandConfig.currencySymbol}
              </span>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-${brandConfig.gridColumns} gap-3`}>
              <div
                className="p-4 bg-slate-900 border border-slate-800 space-y-1"
                style={{ borderRadius: brandConfig.borderRadius }}
              >
                <span className="text-[10px] font-mono text-slate-400">Total {t('Employees')}</span>
                <p className="text-2xl font-black text-white font-mono">1,482</p>
                <span className="text-[10px] text-emerald-400 font-mono">+4.2% Active Roster</span>
              </div>

              <div
                className="p-4 bg-slate-900 border border-slate-800 space-y-1"
                style={{ borderRadius: brandConfig.borderRadius }}
              >
                <span className="text-[10px] font-mono text-slate-400">Active {t('Vehicles')}</span>
                <p className="text-2xl font-black text-white font-mono">33 Units</p>
                <span className="text-[10px] text-cyan-400 font-mono">Control Room Online</span>
              </div>

              <div
                className="p-4 bg-slate-900 border border-slate-800 space-y-1"
                style={{ borderRadius: brandConfig.borderRadius }}
              >
                <span className="text-[10px] font-mono text-slate-400">Pending {t('Approvals')}</span>
                <p className="text-2xl font-black text-amber-400 font-mono">8 Items</p>
                <span className="text-[10px] text-amber-400 font-mono">Awaiting {t('Manager')}</span>
              </div>
            </div>
          </div>
        )}

        {/* MODULE VIEW 2: EMPLOYEE DIRECTORY */}
        {selectedModule === 'directory' && (
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Users size={18} style={{ color: brandConfig.accentColor }} />
              {t('Employee')} Directory & Roster
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">Name / Role</span>
                <span className="font-bold text-slate-300">{t('Department')}</span>
                <span className="font-bold text-slate-300">Status</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Dr. Elizabeth Mwangi ({t('Manager')})</span>
                <span className="text-cyan-400">Clinical Ops</span>
                <span className="text-emerald-400">On Duty</span>
              </div>

              <div className="flex justify-between items-center">
                <span>David Kamau ({t('Employee')})</span>
                <span className="text-cyan-400">Transport Fleet</span>
                <span className="text-emerald-400">En-route</span>
              </div>
            </div>
          </div>
        )}

        {/* MODULE VIEW 3: TRANSPORT CONTROL */}
        {selectedModule === 'transport' && (
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Car size={18} style={{ color: brandConfig.accentColor }} />
              Digital {t('Vehicle')} Control Room
            </h2>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span>Fleet Unit: KDG 482B</span>
                <span className="text-emerald-400">Checked Out</span>
              </div>
              <p className="text-slate-400">Destination: Kiambu Level 5 Hospital</p>
            </div>
          </div>
        )}

        {/* MODULE VIEW 4: PAYROLL VOUCHER */}
        {selectedModule === 'payroll' && (
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <DollarSign size={18} style={{ color: brandConfig.accentColor }} />
              Localized Payroll Voucher
            </h2>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>Net Pay Disbursement:</span>
                <strong className="text-emerald-400 text-sm">
                  {brandConfig.currencySymbol} 120,500.00
                </strong>
              </div>
              <span className="text-[10px] text-slate-500">
                Processed under {brandConfig.orgName} Legal Entity
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
