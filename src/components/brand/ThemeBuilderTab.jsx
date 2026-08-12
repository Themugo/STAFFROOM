import React, { useState } from 'react'
import { useBrand, PRESET_THEMES } from '@/contexts/BrandContext'
import {
  Palette,
  Sparkles,
  Check,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Sliders,
  Layers,
  Box,
  Eye
} from 'lucide-react'

export default function ThemeBuilderTab({ onNotify }) {
  const { brandConfig, updateBrandConfig, applyPresetTheme } = useBrand()
  const [customPrimary, setCustomPrimary] = useState(brandConfig.primaryColor)
  const [customSecondary, setCustomSecondary] = useState(brandConfig.secondaryColor)
  const [customAccent, setCustomAccent] = useState(brandConfig.accentColor)

  const handleApplyPreset = (key) => {
    applyPresetTheme(key)
    if (onNotify) onNotify(`Applied Theme Preset: ${PRESET_THEMES[key].name}`)
  }

  const handleColorChange = (field, val) => {
    updateBrandConfig({ [field]: val, presetTheme: 'custom' })
    if (onNotify) onNotify(`Updated ${field}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Palette size={13} className="text-cyan-400" />
            No-Code Theme Builder & Enterprise Palette Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Dynamic Color Palettes, Radii & Glass Effects
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Select from 10+ industry preset themes or design custom primary, secondary, accent, surface, border radius, and card shadow tokens that immediately filter across StaffRoom.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Active Theme:</span>
          <strong className="text-cyan-300 uppercase font-bold">{brandConfig.presetTheme}</strong>
        </div>
      </div>

      {/* 1. PRESET THEMES GRID */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Curated Industry Theme Presets
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(PRESET_THEMES).map(([key, theme]) => {
            const isSelected = brandConfig.presetTheme === key
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 p-1 rounded-full bg-indigo-600 text-white">
                    <Check size={10} />
                  </span>
                )}

                <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">
                  {theme.name}
                </span>

                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: theme.primaryColor }} title="Primary" />
                  <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: theme.secondaryColor }} title="Secondary" />
                  <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: theme.accentColor }} title="Accent" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. CUSTOM COLOR PICKERS & DESIGN TOKENS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLOR PICKERS (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={16} className="text-indigo-600" />
            Fine-Tune Custom Palette Tokens
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Primary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-slate-800 dark:text-slate-200 font-bold">
                Primary Brand Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandConfig.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brandConfig.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>

            {/* Secondary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-slate-800 dark:text-slate-200 font-bold">
                Secondary Accent Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandConfig.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brandConfig.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>

            {/* Accent */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-slate-800 dark:text-slate-200 font-bold">
                Cyan / Highlight Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandConfig.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brandConfig.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* SPACING & SHAPE CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Corner Radius (Pills & Cards)
              </label>
              <select
                value={brandConfig.borderRadius}
                onChange={(e) => handleColorChange('borderRadius', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="4px">Sharp Rectangular (4px)</option>
                <option value="8px">Subtle Rounded (8px)</option>
                <option value="16px">Modern Enterprise (16px)</option>
                <option value="24px">Extra Rounded Smooth (24px)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Card Elevation & Shadows
              </label>
              <select
                value={brandConfig.cardShadow}
                onChange={(e) => handleColorChange('cardShadow', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="shadow-none">Flat Border (No Shadow)</option>
                <option value="shadow-sm">Subtle Soft Elevation</option>
                <option value="shadow-md">Medium Depth Elevation</option>
                <option value="shadow-xl">High Floating Contrast</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Layout Spacing Density
              </label>
              <select
                value={brandConfig.spacingDensity}
                onChange={(e) => handleColorChange('spacingDensity', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="compact">Compact (High Information Density)</option>
                <option value="normal">Normal (Balanced Ergonomic)</option>
                <option value="relaxed">Relaxed (Spacious Negative Space)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIVE PREVIEW SWATCH CARD (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye size={16} className="text-cyan-500" />
            Live UI Component Preview
          </h3>

          <div
            className={`p-5 border space-y-4 bg-white dark:bg-slate-950 transition-all ${brandConfig.cardShadow}`}
            style={{ borderRadius: brandConfig.borderRadius }}
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 text-[11px] font-bold text-white font-mono"
                style={{
                  backgroundColor: brandConfig.primaryColor,
                  borderRadius: brandConfig.borderRadius
                }}
              >
                Primary Tag
              </span>
              <span
                className="w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: brandConfig.accentColor }}
              />
            </div>

            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                Live Theme Component Card
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sample widget displaying custom colors & corner radii.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                style={{
                  backgroundColor: brandConfig.primaryColor,
                  borderRadius: brandConfig.borderRadius
                }}
              >
                Primary Action
              </button>
              <button
                className="px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                style={{
                  backgroundColor: brandConfig.secondaryColor,
                  borderRadius: brandConfig.borderRadius
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
