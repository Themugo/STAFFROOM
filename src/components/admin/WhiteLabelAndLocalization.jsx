import React, { useState } from 'react'
import {
  Palette, Globe, Image, Type, Mail, FileText, CheckCircle2,
  Sliders, RefreshCw, Eye, Sparkles, DollarSign, Calendar, MapPin
} from 'lucide-react'

export default function WhiteLabelAndLocalization() {
  const [activeTab, setActiveTab] = useState('WHITE_LABEL') // 'WHITE_LABEL' or 'LOCALIZATION'
  
  // White Label State
  const [brand, setBrand] = useState({
    companyName: 'StaffRoom Enterprise HR & Operational Intelligence',
    primaryColor: '#1d4ed8', // Blue-first
    accentColor: '#3b82f6',
    customDomain: 'app.staffroom.ke',
    emailSenderName: 'StaffRoom Governance Notifications',
    loginWelcomeText: 'Welcome to StaffRoom Multi-Tenant Platform'
  })

  // Localization State
  const [languages, setLanguages] = useState([
    { code: 'en-KE', name: 'English (Kenya & East Africa)', isDefault: true, status: 'ACTIVE' },
    { code: 'sw-KE', name: 'Kiswahili (East Africa)', isDefault: false, status: 'ACTIVE' },
    { code: 'fr-CD', name: 'French (Central & West Africa)', isDefault: false, status: 'ACTIVE' }
  ])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Palette size={13} className="text-blue-400" /> White-Label Studio & Global Localization Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Palette className="text-blue-400" /> Brand Experience Studio & Localization Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Customize logos, blue-first theme palettes, login screens, PDF report templates, email headers, multi-lingual translations, regional currency settings, and holiday calendars.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveTab('WHITE_LABEL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'WHITE_LABEL' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              White Label Studio
            </button>
            <button
              onClick={() => setActiveTab('LOCALIZATION')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'LOCALIZATION' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Localization & Region
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: WHITE LABEL STUDIO */}
      {activeTab === 'WHITE_LABEL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Palette size={16} className="text-blue-500" /> Enterprise Brand Identity Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company Brand Name</label>
                <input
                  type="text"
                  value={brand.companyName}
                  onChange={(e) => setBrand({ ...brand, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.primaryColor}
                      onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200"
                    />
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{brand.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Accent Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.accentColor}
                      onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200"
                    />
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{brand.accentColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Custom Domain URL</label>
                <input
                  type="text"
                  value={brand.customDomain}
                  onChange={(e) => setBrand({ ...brand, customDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Login Welcome Screen Message</label>
                <textarea
                  rows={2}
                  value={brand.loginWelcomeText}
                  onChange={(e) => setBrand({ ...brand, loginWelcomeText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold cursor-pointer shadow-md">
                  Save Brand Styling
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="card p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Eye size={16} className="text-blue-400" /> Live Brand Experience Preview
            </h3>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  SR
                </div>
                <div>
                  <h4 className="text-sm font-black">{brand.companyName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{brand.customDomain}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">{brand.loginWelcomeText}</span>
                <p className="text-[11px] text-slate-400">
                  Protected multi-tenant sign-in gateway with SAML SSO & Biometric MFA.
                </p>

                <button 
                  className="w-full py-2 rounded-xl text-slate-950 font-bold text-xs shadow-md mt-2"
                  style={{ backgroundColor: brand.accentColor }}
                >
                  Sign In to Enterprise Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOCALIZATION */}
      {activeTab === 'LOCALIZATION' && (
        <div className="space-y-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={16} className="text-blue-500" /> Language & Regional Translation Packs
            </h3>

            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.code} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{lang.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({lang.code})</span>
                      {lang.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                          Primary Default
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {lang.status} (100% Translated)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
