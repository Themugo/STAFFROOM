import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  History,
  GitCommit,
  RotateCcw,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  FileCode2,
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react'

export default function VersionHistoryAndAuditTab({ onNotify }) {
  const { versions, auditLogs, activeConfig, draftConfig, restoreVersion } = useBrand()
  const [selectedVerId, setSelectedVerId] = useState(versions[0]?.id || null)
  const [diffModalOpen, setDiffModalOpen] = useState(false)

  const selectedVer = versions.find((v) => v.id === selectedVerId) || versions[0]

  const handleRestoreVersion = (verId, versionTag) => {
    if (window.confirm(`Are you sure you want to restore white-label configuration snapshot ${versionTag}? This will overwrite active brand settings.`)) {
      const ok = restoreVersion(verId)
      if (ok && onNotify) {
        onNotify(`Successfully restored configuration snapshot ${versionTag}!`)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <History size={13} className="text-cyan-400" />
            White-Label Version Control & Change Audit Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Configuration Snapshots, Versioning & Audit Trail
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Track historical white-label releases, view side-by-side JSON diffs, perform 1-click version rollbacks, and audit change logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono shrink-0">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Active Version: <strong className="text-cyan-300">{activeConfig.currentVersion}</strong></span>
        </div>
      </div>

      {/* SNAPSHOTS & DIFF VIEWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SNAPSHOTS LIST (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit size={16} className="text-indigo-600" />
            Published Configuration Releases
          </h3>

          <div className="space-y-3">
            {versions.map((ver) => {
              const isSelected = selectedVer?.id === ver.id
              const isActive = activeConfig.currentVersion?.includes(ver.version)
              return (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVerId(ver.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 text-sm">{ver.version}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          LIVE ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{ver.publishedAt?.split(' ')[0]}</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">{ver.changelog}</p>
                  <p className="text-[10px] text-slate-400 font-mono">By {ver.publishedBy}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* SELECTED VERSION DETAILS & DIFF PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          {selectedVer ? (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono uppercase">
                    Snapshot Details
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Release {selectedVer.version}
                  </h3>
                  <p className="text-slate-400 text-[11px] font-mono">
                    Published on {selectedVer.publishedAt} by {selectedVer.publishedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDiffModalOpen(true)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={14} /> View Configuration JSON
                  </button>
                  <button
                    onClick={() => handleRestoreVersion(selectedVer.id, selectedVer.version)}
                    className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RotateCcw size={14} /> Restore Snapshot
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Release Notes & Changelog</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">{selectedVer.changelog}</p>
              </div>

              {/* Key Highlights Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Snapshot Token Highlights</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Org Name</span>
                    <strong className="text-slate-900 dark:text-white">{selectedVer.config?.orgName || 'StaffRoom'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Primary Color</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: selectedVer.config?.primaryColor }} />
                      <strong className="text-slate-900 dark:text-white">{selectedVer.config?.primaryColor}</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Theme Preset</span>
                    <strong className="text-slate-900 dark:text-white uppercase">{selectedVer.config?.presetTheme || 'Default'}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs">Select a release snapshot to view details.</p>
          )}
        </div>
      </div>

      {/* FULL AUDIT TRAIL LOGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              White-Label Configuration Audit Trail
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} Audit Events Recorded</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{log.details}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Executed by {log.user}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* JSON CONFIG MODAL */}
      {diffModalOpen && selectedVer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode2 size={18} className="text-indigo-600" /> Configuration Payload ({selectedVer.version})
              </h3>
              <button onClick={() => setDiffModalOpen(false)} className="btn-secondary text-xs py-1 px-3">
                Close
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-[11px] max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
              {JSON.stringify(selectedVer.config, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button onClick={() => setDiffModalOpen(false)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
