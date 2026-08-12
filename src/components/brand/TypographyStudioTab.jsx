import React from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Type,
  AlignLeft,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Heading,
  Eye
} from 'lucide-react'

const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Clean Tech Default)', category: 'Sans-Serif' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Modern Executive)', category: 'Display Sans' },
  { id: 'Outfit', name: 'Outfit (Friendly Geometric)', category: 'Geometric' },
  { id: 'Space Grotesk', name: 'Space Grotesk (Tech & Developer)', category: 'Monospace Hybrid' },
  { id: 'Playfair Display', name: 'Playfair Display (Luxury & Legal)', category: 'Serif Display' },
  { id: 'Poppins', name: 'Poppins (Smooth Geometric)', category: 'Sans-Serif' },
  { id: 'Roboto', name: 'Roboto (Standard Enterprise)', category: 'Sans-Serif' },
  { id: 'JetBrains Mono', name: 'JetBrains Mono (Audit & Engineering)', category: 'Monospace' }
]

export default function TypographyStudioTab({ onNotify }) {
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
            <Type size={13} className="text-cyan-400" />
            Enterprise Typography & Specimen Studio
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Font Families, Heading Hierarchies & Spacing Scales
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure display heading fonts, body text fonts, tracking/letter spacing, line height ratios, button corner styling, and table typographic density across StaffRoom.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Heading Font:</span>
          <strong className="text-cyan-300 font-bold">{brandConfig.headingFont}</strong>
        </div>
      </div>

      {/* TYPOGRAPHY CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROLS (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Type size={16} className="text-indigo-600" />
            Font Family & Specimen Pairings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Display Heading Font
              </label>
              <select
                value={brandConfig.headingFont}
                onChange={(e) => handleUpdate('headingFont', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Body & Interface Font
              </label>
              <select
                value={brandConfig.bodyFont}
                onChange={(e) => handleUpdate('bodyFont', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Letter Spacing (Tracking)
              </label>
              <select
                value={brandConfig.letterSpacing}
                onChange={(e) => handleUpdate('letterSpacing', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                <option value="tight">Tight (-0.02em - Technical)</option>
                <option value="normal">Normal (0em - Standard)</option>
                <option value="wide">Wide (+0.03em - Spacious)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Line Height Ratio (Leading)
              </label>
              <select
                value={brandConfig.lineHeight}
                onChange={(e) => handleUpdate('lineHeight', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                <option value="snug">Snug (1.375 - High Density)</option>
                <option value="relaxed">Relaxed (1.625 - Optimal Readability)</option>
                <option value="loose">Loose (1.8 - Expanded Padding)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Button Styling Specimen
              </label>
              <select
                value={brandConfig.buttonStyle}
                onChange={(e) => handleUpdate('buttonStyle', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                <option value="rounded-md">Subtle Sharp (rounded-md)</option>
                <option value="rounded-xl">Modern Ergonomic (rounded-xl)</option>
                <option value="rounded-full">Pill Shaped (rounded-full)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Form Input Field Styling
              </label>
              <select
                value={brandConfig.inputStyle}
                onChange={(e) => handleUpdate('inputStyle', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
              >
                <option value="rounded-md">Sharp Edged Input</option>
                <option value="rounded-xl">Soft Curved Input</option>
                <option value="rounded-2xl">Extra Smooth Input</option>
              </select>
            </div>
          </div>
        </div>

        {/* SPECIMEN PREVIEW (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye size={16} className="text-cyan-500" />
            Live Font Hierarchy Specimen
          </h3>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                H1 Title Display ({brandConfig.headingFont})
              </span>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                StaffRoom Operating System
              </h1>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                H2 Subheading
              </span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Enterprise Workforce Intelligence & Analytics
              </h2>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Body Copy ({brandConfig.bodyFont})
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Empowering enterprise human capital management, attendance tracking, and fleet governance through zero-code white labeling.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                className={`px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs ${brandConfig.buttonStyle}`}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
