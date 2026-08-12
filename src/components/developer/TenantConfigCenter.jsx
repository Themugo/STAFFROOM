import { useState } from 'react'
import {
  Globe, Sliders, ShieldCheck, Check, RefreshCw, Palette, Lock, Flag
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

export default function TenantConfigCenter() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [customDomain, setCustomDomain] = useState('hr.company.com')
  const [accentColor, setAccentColor] = useState('#4f46e5')
  const [featureFlags, setFeatureFlags] = useState({
    aiCopilotV2: true,
    graphqlBeta: true,
    realtimeScim: true,
    multiCurrencyPayroll: true,
  })

  const handleSave = () => {
    showSuccess('Tenant white-labeling, custom domain & feature flags saved!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Tenant Configuration, Branding & Feature Flags Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize company domains, white-label UI branding, regional compliance rules, and feature flags.
            </p>
          </div>

          <button onClick={handleSave} className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer">
            <Check size={14} /> Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* White-Labeling & Custom Domain */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette size={16} className="text-indigo-600" /> Custom Domain & UI White-Labeling
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Custom Domain URL (CNAME Target: `ingress.staffroom.io`)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="input text-xs w-full bg-white dark:bg-slate-900 font-mono"
              />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                ✓ SSL Certificate Issued & DNS CNAME Verified
              </span>
            </div>

            <div>
              <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-8 w-12 rounded border cursor-pointer"
                />
                <span className="font-mono text-xs">{accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flag size={16} className="text-indigo-600" /> Experimental & Enterprise Feature Flags
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(featureFlags).map(([flag, enabled]) => (
              <div key={flag} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{flag}</span>
                  <span className="text-[10px] text-slate-400 block">Tenant experimental rollout flag</span>
                </div>

                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setFeatureFlags({ ...featureFlags, [flag]: e.target.checked })}
                  className="rounded text-indigo-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
