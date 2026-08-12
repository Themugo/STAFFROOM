import React, { useState } from 'react'
import {
  BookOpen, Plus, Search, FileText, CheckCircle2, Download, Eye,
  ShieldCheck, Clock, FileUp, Sparkles
} from 'lucide-react'

export default function DepartmentDocumentsTab({ currentDept, showSuccess }) {
  const [docs, setDocs] = useState([
    { id: 'doc-1', title: `${currentDept.name} Standard Operating Procedure (SOP)`, category: 'SOP', version: '2.4', updated: '2026-07-28', reads: 142, status: 'MANDATORY' },
    { id: 'doc-2', title: `${currentDept.code} Escalation & Incident Response Playbook`, category: 'Playbook', version: '1.2', updated: '2026-07-20', reads: 88, status: 'MANDATORY' },
    { id: 'doc-3', title: 'Department Equipment & Asset Allocation Guidelines', category: 'Policy', version: '3.0', updated: '2026-06-15', reads: 210, status: 'STANDARD' }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [docForm, setDocForm] = useState({ title: '', category: 'SOP', version: '1.0' })

  const handleUploadDoc = (e) => {
    e.preventDefault()
    if (!docForm.title) return
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: docForm.title,
      category: docForm.category,
      version: docForm.version || '1.0',
      updated: new Date().toISOString().split('T')[0],
      reads: 1,
      status: 'STANDARD'
    }
    setDocs([newDoc, ...docs])
    setModalOpen(false)
    setDocForm({ title: '', category: 'SOP', version: '1.0' })
    showSuccess(`Document "${newDoc.title}" published to ${currentDept.name} repository.`)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Knowledge Repository & SOP Wiki
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Isolated documentation, SOPs, and operational guidelines for {currentDept.name}.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Plus size={15} /> Upload SOP Document
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docs.map((d) => (
          <div key={d.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {d.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">v{d.version}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{d.title}</h4>
              <p className="text-slate-400 text-[11px] font-mono">Updated {d.updated} • {d.reads} Reads</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => showSuccess(`Opened document "${d.title}".`)}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
              >
                <Eye size={12} /> View Document
              </button>
              <button
                onClick={() => showSuccess(`Downloaded "${d.title}".`)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <Download size={12} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Document / SOP</h3>
            <form onSubmit={handleUploadDoc} className="space-y-3">
              <div>
                <label className="label">Document Title *</label>
                <input
                  className="input"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="e.g. Q3 Operations SOP & Escalation Flow"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                  >
                    <option value="SOP">SOP</option>
                    <option value="Policy">Policy</option>
                    <option value="Playbook">Playbook</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>
                <div>
                  <label className="label">Version</label>
                  <input
                    className="input"
                    value={docForm.version}
                    onChange={(e) => setDocForm({ ...docForm, version: e.target.value })}
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center space-y-1">
                <FileUp size={20} className="mx-auto text-indigo-500" />
                <p className="text-slate-600 dark:text-slate-300 font-semibold">Click or drag file to attach</p>
                <p className="text-[10px] text-slate-400">PDF, DOCX, or Markdown up to 25MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish to {currentDept.code}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
