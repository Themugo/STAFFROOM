import React, { useState } from 'react'
import { useAutomation } from '@/contexts/AutomationContext'
import { Download, Sparkles, CheckCircle, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react'

export default function AutomationMarketplaceTab({ onNotify, onSelectFlow }) {
  const { marketplaceTemplates, installMarketplaceTemplate } = useAutomation()
  const [installedMap, setInstalledMap] = useState({})

  const handleInstall = (template) => {
    const installed = installMarketplaceTemplate(template)
    setInstalledMap({ ...installedMap, [template.id]: true })
    if (onNotify) onNotify(`Installed template: '${template.title}'`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/50 text-indigo-200 text-xs font-mono font-bold">
          <Sparkles size={14} className="text-amber-400" />
          ENTERPRISE AUTOMATION MARKETPLACE
        </div>
        <h2 className="text-xl font-black">Pre-Built Certified Automation Recipes</h2>
        <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
          Deploy audited no-code workflows designed for HR, Legal, Procurement, Transport, and Finance. One-click instant activation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketplaceTemplates.map((template) => {
          const isDone = installedMap[template.id]

          return (
            <div
              key={template.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                    {template.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1">
                    <Download size={12} /> {template.downloads.toLocaleString()} installs
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> Security Audited
                </span>

                <button
                  onClick={() => handleInstall(template)}
                  disabled={isDone}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle size={14} /> Active in Flows
                    </>
                  ) : (
                    <>
                      <Download size={14} /> Install Template
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
