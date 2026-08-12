import React from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  FileCode,
  Download,
  Copy,
  FolderArchive,
  CheckCircle2,
  FileText,
  Sparkles,
  Search
} from 'lucide-react'

export default function TemplateLibraryTab({ onNotify }) {
  const { templates } = useKnowledge()

  const handleUseTemplate = (tpl) => {
    if (onNotify) onNotify(`Cloned and opened template: ${tpl.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-indigo-600" />
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Institutional Reusable Template & Contract Library
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Standardized legal, financial, HR, and project document structures ready for immediate auto-population.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  {tpl.category}
                </span>
                <span className="text-slate-400">{tpl.format}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {tpl.name}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">
                {tpl.downloads} Institutional Uses
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Copy size={13} /> Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
