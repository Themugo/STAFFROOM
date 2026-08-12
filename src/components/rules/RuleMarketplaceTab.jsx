import React, { useState } from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import {
  ShoppingBag,
  Download,
  Star,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function RuleMarketplaceTab({ onNotify }) {
  const { marketplaceTemplates, installTemplate } = useBusinessRules()
  const [searchTerm, setSearchTerm] = useState('')
  const [installedMap, setInstalledMap] = useState({})

  const handleInstall = (template) => {
    installTemplate(template)
    setInstalledMap((prev) => ({ ...prev, [template.id]: true }))
    if (onNotify) onNotify(`Installed template '${template.name}' into active business rules!`)
  }

  const filtered = marketplaceTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <ShoppingBag size={13} className="text-cyan-400" />
            Verified Enterprise Policy Marketplace
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Pre-Packaged Industry Rules, Labor Laws & Tax Policy Bundles
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            One-click deployment of pre-configured labor regulations, statutory payroll rules, donor grant compliance matrices, and sector-specific policies.
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium text-white"
          />
        </div>
      </div>

      {/* TEMPLATES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((tpl) => {
          const isInstalled = !!installedMap[tpl.id]
          return (
            <div
              key={tpl.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                    {tpl.category}
                  </span>
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <Star size={13} className="fill-current" /> {tpl.rating}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {tpl.name}
                </h3>

                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 block">
                  Region / Industry: {tpl.region} • Author: {tpl.author}
                </span>

                <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Includes <strong>{tpl.rulesIncluded}</strong> active rule policies
                </span>

                <button
                  onClick={() => handleInstall(tpl)}
                  disabled={isInstalled}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    isInstalled
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle2 size={14} /> Installed in Rules Engine
                    </>
                  ) : (
                    <>
                      <Download size={14} /> One-Click Install Bundle
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
