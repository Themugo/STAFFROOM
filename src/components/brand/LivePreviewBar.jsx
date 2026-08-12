import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Send,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react'

export default function LivePreviewBar({ onNotify }) {
  const {
    brandConfig,
    activeConfig,
    draftConfig,
    isPreviewMode,
    togglePreviewMode,
    publishDraft,
    discardDraft,
    checkContrast
  } = useBrand()

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [changelog, setChangelog] = useState('')
  const [publisher, setPublisher] = useState('Sarah Jenkins (System Admin)')

  const contrastInfo = checkContrast(brandConfig.primaryColor, '#ffffff')

  const handlePublish = (e) => {
    e.preventDefault()
    const newVer = publishDraft(changelog || 'Updated organization white-labeling & brand experience', publisher)
    setPublishModalOpen(false)
    setChangelog('')
    if (onNotify) onNotify(`Published white-label release ${newVer}! Tokens deployed across system.`)
  }

  const handleDiscard = () => {
    if (window.confirm('Discard all uncommitted draft changes and revert to production active state?')) {
      discardDraft()
      if (onNotify) onNotify('Discarded draft changes. Reverted to production state.')
    }
  }

  return (
    <>
      {/* FLOATING PREVIEW BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92%] bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white border border-slate-700/80 rounded-3xl p-3.5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl flex items-center gap-1.5 shrink-0 ${
            isPreviewMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            <Sparkles size={14} className={isPreviewMode ? 'animate-spin' : ''} />
            <span className="font-bold text-[11px] uppercase">
              {isPreviewMode ? 'Draft Preview Mode' : 'Live Production Mode'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-300 text-[11px]">
            <span>Contrast: <strong className={contrastInfo.passAA ? 'text-emerald-400' : 'text-amber-400'}>{contrastInfo.ratio}:1 ({contrastInfo.passAA ? 'WCAG AA' : 'Low Contrast'})</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePreviewMode}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPreviewMode
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isPreviewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{isPreviewMode ? 'Exit Draft Preview' : 'Preview Draft Changes'}</span>
          </button>

          <button
            onClick={handleDiscard}
            className="px-3 py-1.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-700 transition-all"
          >
            Discard Draft
          </button>

          <button
            onClick={() => setPublishModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Send size={13} />
            <span>Publish Version</span>
          </button>
        </div>
      </div>

      {/* PUBLISH CONFIRMATION MODAL */}
      {publishModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send size={18} className="text-indigo-600" /> Publish White Label Release
              </h3>
              <button onClick={() => setPublishModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="label">Changelog & Release Notes *</label>
                <textarea
                  rows={3}
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder="e.g. Updated corporate theme colors, terminology for HR & Departments, and WCAG AA contrast check."
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Publishing Authority</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                <strong className="text-indigo-600 dark:text-indigo-400 block font-bold">System Impact Notice:</strong>
                <span>Publishing will immediately apply CSS tokens, custom terminology, navigation visibility, and login branding across all tenant active sessions.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPublishModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Deploy White Label Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
