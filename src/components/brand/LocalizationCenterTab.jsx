import React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Globe,
  DollarSign,
  Calendar,
  Clock,
  Languages,
  CheckCircle2,
  Sliders,
  Eye,
  FileText
} from 'lucide-react'

const LANGUAGES = [
  { id: 'en-US', name: 'English (United States)', rtl: false },
  { id: 'en-GB', name: 'English (United Kingdom)', rtl: false },
  { id: 'sw-KE', name: 'Swahili (Kiswahili - East Africa)', rtl: false },
  { id: 'fr-FR', name: 'French (Français)', rtl: false },
  { id: 'es-ES', name: 'Spanish (Español)', rtl: false },
  { id: 'ar-SA', name: 'Arabic (العربية - RTL)', rtl: true },
  { id: 'de-DE', name: 'German (Deutsch)', rtl: false },
  { id: 'pt-BR', name: 'Portuguese (Português)', rtl: false }
]

const CURRENCIES = [
  { id: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { id: 'KES', symbol: 'KSh', name: 'Kenya Shilling (KES)' },
  { id: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { id: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { id: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
  { id: 'ZAR', symbol: 'R', name: 'South African Rand (ZAR)' },
  { id: 'UGX', symbol: 'USh', name: 'Uganda Shilling (UGX)' },
  { id: 'TZS', symbol: 'TSh', name: 'Tanzania Shilling (TZS)' }
]

export default function LocalizationCenterTab({ onNotify }) {
  const { brandConfig, updateBrandConfig } = useBrand()

  const handleUpdate = (field, val) => {
    updateBrandConfig({ [field]: val })
    if (onNotify) onNotify(`Updated ${field}: ${val}`)
  }

  const handleLanguageSelect = (langId) => {
    const selected = LANGUAGES.find((l) => l.id === langId)
    updateBrandConfig({
      language: langId,
      rtl: selected ? selected.rtl : false
    })
    if (onNotify) onNotify(`Language changed to ${selected?.name}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Globe size={13} className="text-cyan-400" />
            Global Localization, Multi-Language & Regional Formats
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Language Packs, Currencies & Date/Time Standards
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure default platform languages, RTL text direction, local currency symbols, number formats, and date/time standards for emails, reports, and payroll slips.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Currency:</span>
          <strong className="text-cyan-300 font-bold">{brandConfig.currency} ({brandConfig.currencySymbol})</strong>
        </div>
      </div>

      {/* LANGUAGE & REGIONAL SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROLS (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages size={16} className="text-indigo-600" />
            Platform Language & Regional Formats
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Primary Platform Language
              </label>
              <select
                value={brandConfig.language}
                onChange={(e) => handleLanguageSelect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Default Enterprise Currency
              </label>
              <select
                value={brandConfig.currency}
                onChange={(e) => {
                  const curr = CURRENCIES.find((c) => c.id === e.target.value)
                  updateBrandConfig({
                    currency: e.target.value,
                    currencySymbol: curr ? curr.symbol : '$'
                  })
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Date Formatting Pattern
              </label>
              <select
                value={brandConfig.dateFormat}
                onChange={(e) => handleUpdate('dateFormat', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs font-mono"
              >
                <option value="YYYY-MM-DD">ISO Standard (YYYY-MM-DD)</option>
                <option value="DD/MM/YYYY">UK / Europe (DD/MM/YYYY)</option>
                <option value="MM/DD/YYYY">US Standard (MM/DD/YYYY)</option>
                <option value="D MMM YYYY">Long Formal (1 Aug 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Time Format Standard
              </label>
              <select
                value={brandConfig.timeFormat}
                onChange={(e) => handleUpdate('timeFormat', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs font-mono"
              >
                <option value="12h">12-Hour AM/PM (01:30 PM)</option>
                <option value="24h">24-Hour Military (13:30)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <strong className="block text-slate-800 dark:text-slate-200">Right-to-Left (RTL) Layout Direction</strong>
              <span className="text-[10px] text-slate-500">Enable for Arabic, Hebrew, and Persian scripts</span>
            </div>
            <input
              type="checkbox"
              checked={brandConfig.rtl}
              onChange={(e) => handleUpdate('rtl', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* LOCALIZED PREVIEW (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye size={16} className="text-cyan-500" />
            Localized Payroll & Report Preview
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Sample Payslip Voucher</span>
              <span className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                {brandConfig.language}
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Base Salary:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {brandConfig.currencySymbol} 85,000.00
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Disbursement Date:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {brandConfig.dateFormat === 'YYYY-MM-DD' ? '2026-08-01' : '01/08/2026'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
