import React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Layout,
  PanelLeft,
  Columns,
  Grid,
  Maximize2,
  Sliders,
  CheckCircle2,
  Eye,
  Sidebar,
  Menu,
  Monitor
} from 'lucide-react'

export default function LayoutBuilderTab({ onNotify }) {
  const { brandConfig, updateBrandConfig } = useBrand()

  const handleUpdate = (field, val) => {
    updateBrandConfig({ [field]: val })
    if (onNotify) onNotify(`Updated ${field}: ${val}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Layout size={13} className="text-cyan-400" />
            Enterprise Layout Architecture & Navigation Builder
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Navigation Rail, Grid Columns & Surface Density
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure left sidebar, top header bar, dual rail navigation, dashboard grid column densities, breadcrumbs, and quick action bar controls.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Nav Style:</span>
          <strong className="text-cyan-300 uppercase font-bold">{brandConfig.navStyle}</strong>
        </div>
      </div>

      {/* NAVIGATION STYLE SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PanelLeft size={16} className="text-indigo-600" />
          Select Platform Navigation Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'sidebar-left',
              title: 'Standard Left Sidebar',
              desc: 'Collapsible vertical navigation rail with grouped modules',
              icon: Sidebar
            },
            {
              id: 'topbar',
              title: 'Top Navigation Header',
              desc: 'Horizontal navigation header with dropdown submenus',
              icon: Menu
            },
            {
              id: 'dual-rail',
              title: 'Dual-Rail Enterprise',
              desc: 'Icon rail on far left with secondary expanding drawer',
              icon: Columns
            },
            {
              id: 'floating',
              title: 'Floating Dock',
              desc: 'Minimalist bottom floating dock for high-touch mobile/tablet',
              icon: Monitor
            }
          ].map((style) => {
            const Icon = style.icon
            const isSelected = brandConfig.navStyle === style.id
            return (
              <button
                key={style.id}
                onClick={() => handleUpdate('navStyle', style.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <Icon size={18} />
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{style.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{style.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* GRID DENSITY & COMPONENT TOGGLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid size={16} className="text-indigo-600" />
            Grid System & Layout Density
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Dashboard Grid Columns
              </label>
              <select
                value={brandConfig.gridColumns}
                onChange={(e) => handleUpdate('gridColumns', parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value={2}>2 Column Wide Layout</option>
                <option value={3}>3 Column Standard Layout</option>
                <option value={4}>4 Column High-Density Grid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Sidebar Rail Density
              </label>
              <select
                value={brandConfig.sidebarDensity}
                onChange={(e) => handleUpdate('sidebarDensity', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="compact">Compact (Minimal Heights)</option>
                <option value="normal">Normal Ergonomic</option>
                <option value="expanded">Expanded Touch Friendly</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Default Card Size
              </label>
              <select
                value={brandConfig.cardSize}
                onChange={(e) => handleUpdate('cardSize', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="compact">Compact Height</option>
                <option value="normal">Standard Height</option>
                <option value="large">Large Detailed View</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div>
                <strong className="block text-slate-800 dark:text-slate-200">Show Navigation Breadcrumbs</strong>
                <span className="text-[10px] text-slate-500">Display location path under top bar</span>
              </div>
              <input
                type="checkbox"
                checked={brandConfig.showBreadcrumbs}
                onChange={(e) => handleUpdate('showBreadcrumbs', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div>
                <strong className="block text-slate-800 dark:text-slate-200">Show Quick Create Menu</strong>
                <span className="text-[10px] text-slate-500">Global plus button in top header</span>
              </div>
              <input
                type="checkbox"
                checked={brandConfig.showQuickCreate}
                onChange={(e) => handleUpdate('showQuickCreate', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* LAYOUT PREVIEW (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye size={16} className="text-cyan-500" />
            Live Wireframe Layout Preview
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 text-xs">
            {/* Mock Topbar */}
            <div className="p-2 rounded-lg bg-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-mono font-bold text-indigo-400">{brandConfig.shortName}</span>
              <div className="flex gap-1 text-slate-400">
                {brandConfig.showQuickCreate && <span className="bg-indigo-600 text-white px-1.5 rounded">+</span>}
                <span>TopBar</span>
              </div>
            </div>

            {/* Mock Body */}
            <div className="grid grid-cols-4 gap-2 h-28">
              {brandConfig.navStyle === 'sidebar-left' && (
                <div className="col-span-1 bg-slate-800 p-2 rounded-lg space-y-1 text-[9px] font-mono text-slate-400">
                  <div className="bg-indigo-600 h-2 rounded w-3/4" />
                  <div className="bg-slate-700 h-2 rounded w-1/2" />
                  <div className="bg-slate-700 h-2 rounded w-2/3" />
                </div>
              )}

              <div
                className={`${
                  brandConfig.navStyle === 'sidebar-left' ? 'col-span-3' : 'col-span-4'
                } bg-slate-950 p-2 rounded-lg grid grid-cols-${brandConfig.gridColumns} gap-1`}
              >
                {Array.from({ length: brandConfig.gridColumns }).map((_, i) => (
                  <div key={i} className="bg-slate-800/80 rounded border border-slate-700 p-1 space-y-1">
                    <div className="bg-indigo-500/40 h-2 rounded w-full" />
                    <div className="bg-slate-700 h-4 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
