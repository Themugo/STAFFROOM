import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Building2,
  Image,
  Upload,
  Globe,
  FileText,
  Mail,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  Type,
  Layout,
  Layers
} from 'lucide-react'

export default function BrandStudioTab({ onNotify }) {
  const { brandConfig, updateBrandConfig } = useBrand()
  const [activeSubSection, setActiveSubSection] = useState('general')

  const handleTextChange = (field, value) => {
    updateBrandConfig({ [field]: value })
    if (onNotify) onNotify(`Updated ${field}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Building2 size={13} className="text-cyan-400" />
            White-Label & Enterprise Brand Asset Studio
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Organization Visual Identity & Asset Controls
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure enterprise logos, favicons, login and dashboard backgrounds, PDF and email headers, report watermarks, and copyright footers across all StaffRoom modules.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <ShieldAlert size={16} className="text-amber-400" />
          <span>Tenant Domain: <strong className="text-cyan-300">staffroom.internal</strong></span>
        </div>
      </div>

      {/* SUB-SECTION SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'general', label: 'General Identity', icon: Building2 },
          { id: 'assets', label: 'Logos & App Icons', icon: Image },
          { id: 'documents', label: 'Email, PDF & Reports', icon: FileText },
          { id: 'footers', label: 'Footer & Watermarks', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubSection(tab.id)}
              className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 1. GENERAL IDENTITY */}
      {activeSubSection === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-indigo-600" />
              Organization Naming
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Full Organization Name
                </label>
                <input
                  type="text"
                  value={brandConfig.orgName}
                  onChange={(e) => handleTextChange('orgName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  placeholder="e.g. Apex Global Industries"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Short Name / Acronym
                </label>
                <input
                  type="text"
                  value={brandConfig.shortName}
                  onChange={(e) => handleTextChange('shortName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white font-mono"
                  placeholder="e.g. APEX"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Loading Screen Welcome Message
                </label>
                <input
                  type="text"
                  value={brandConfig.loadingMessage}
                  onChange={(e) => handleTextChange('loadingMessage', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Splash Screen Version Banner
                </label>
                <input
                  type="text"
                  value={brandConfig.splashMessage}
                  onChange={(e) => handleTextChange('splashMessage', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye size={16} className="text-cyan-600" />
              Live Identity Card Preview
            </h3>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm">
                    {brandConfig.shortName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{brandConfig.orgName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">White-Label Tenant</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="text-xs space-y-2 text-slate-300 font-mono">
                <p>⚡ Loading: "{brandConfig.loadingMessage}"</p>
                <p>🚀 Banner: "{brandConfig.splashMessage}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOGOS & ASSETS */}
      {activeSubSection === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Image size={16} className="text-indigo-600" />
              Logo & Favicon Configuration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Primary Organization Logo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandConfig.logoUrl}
                    onChange={(e) => handleTextChange('logoUrl', e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                    placeholder="https://yourdomain.com/logo.png"
                  />
                  <button className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center gap-1">
                    <Upload size={14} /> Browse
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Favicon URL (.ico or .png)
                </label>
                <input
                  type="text"
                  value={brandConfig.faviconUrl}
                  onChange={(e) => handleTextChange('faviconUrl', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  placeholder="https://yourdomain.com/favicon.ico"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Dashboard Watermark Background
                </label>
                <select
                  value={brandConfig.dashboardBg}
                  onChange={(e) => handleTextChange('dashboardBg', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                >
                  <option value="default">Default Neutral Canvas</option>
                  <option value="grid">Subtle Tech Grid Lines</option>
                  <option value="subtle_watermark">Subtle Org Watermark</option>
                  <option value="gradient_mesh">Gradient Mesh Accent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              Brand Logo Visual Swatch
            </h3>

            <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              {brandConfig.logoUrl ? (
                <img
                  src={brandConfig.logoUrl}
                  alt="Organization Logo"
                  className="max-h-16 mx-auto object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-md">
                  {brandConfig.shortName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {brandConfig.orgName}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {brandConfig.logoUrl ? 'Custom Image Asset Loaded' : 'Default Dynamic Monogram Badge'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EMAIL, PDF & REPORTS */}
      {activeSubSection === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail size={16} className="text-indigo-600" />
              Email & PDF Header Templates
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Email Header Background Hex
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={brandConfig.emailHeaderBg}
                    onChange={(e) => handleTextChange('emailHeaderBg', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={brandConfig.emailHeaderBg}
                    onChange={(e) => handleTextChange('emailHeaderBg', e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  PDF & Report Header Title
                </label>
                <input
                  type="text"
                  value={brandConfig.pdfHeaderTitle}
                  onChange={(e) => handleTextChange('pdfHeaderTitle', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Report Watermark Text
                </label>
                <input
                  type="text"
                  value={brandConfig.reportWatermark}
                  onChange={(e) => handleTextChange('reportWatermark', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-indigo-600" />
              Live PDF Document Header Preview
            </h3>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 space-y-4 shadow-inner">
              <div
                className="p-4 rounded-xl text-white flex items-center justify-between"
                style={{ backgroundColor: brandConfig.emailHeaderBg }}
              >
                <div className="font-bold text-sm">{brandConfig.pdfHeaderTitle}</div>
                <div className="text-[10px] font-mono opacity-80">{brandConfig.shortName}</div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden space-y-2 text-xs">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-800/40 text-xl font-black font-mono rotate-[-15deg] pointer-events-none select-none">
                  {brandConfig.reportWatermark}
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200">Official Executive Report Body</h5>
                <p className="text-slate-500 text-[11px]">
                  This document contains confidential workforce telemetry, payroll, and transport audit registers generated under {brandConfig.orgName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTERS & COPYRIGHT */}
      {activeSubSection === 'footers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe size={16} className="text-indigo-600" />
            System Footer & Legal Copyright
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                System Footer Text
              </label>
              <input
                type="text"
                value={brandConfig.systemFooter}
                onChange={(e) => handleTextChange('systemFooter', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Copyright Notice
              </label>
              <input
                type="text"
                value={brandConfig.copyrightNotice}
                onChange={(e) => handleTextChange('copyrightNotice', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
