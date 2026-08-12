import React, { useState } from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Shield,
  Tag,
  Download,
  Printer,
  X,
  History,
  Layers,
  Sparkles,
  AlertTriangle,
  Info,
  CheckSquare,
  Lock,
  Globe,
  ArrowRight,
  BookOpen
} from 'lucide-react'

export default function DocumentExplorerAndViewer({
  selectedSpaceId,
  onOpenCreateModal,
  onNotify
}) {
  const { documents, incrementViews, updateDocumentStatus, activeLanguage, setActiveLanguage } = useKnowledge()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Filter documents
  const filtered = documents.filter((doc) => {
    const matchesSpace = selectedSpaceId === 'ALL' || doc.spaceId === selectedSpaceId
    const matchesType = selectedType === 'ALL' || doc.type === selectedType
    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))

    return matchesSpace && matchesType && matchesStatus && matchesSearch
  })

  const handleOpenDoc = (doc) => {
    incrementViews(doc.id)
    setSelectedDoc(doc)
  }

  const handleToggleCheckitem = (blockIndex, itemIndex) => {
    if (!selectedDoc) return
    const updatedBlocks = [...selectedDoc.contentBlocks]
    const checklist = updatedBlocks[blockIndex]
    if (checklist && checklist.items) {
      checklist.items[itemIndex].checked = !checklist.items[itemIndex].checked
      setSelectedDoc({ ...selectedDoc, contentBlocks: updatedBlocks })
    }
  }

  return (
    <div className="space-y-6">
      {/* SEARCH & FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SOPs, manuals, handbooks, runbooks, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* TYPE FILTER */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value="ALL">All Types</option>
              <option value="SOP">SOPs</option>
              <option value="Policy">Policies</option>
              <option value="Handbook">Handbooks</option>
              <option value="Runbook">Runbooks</option>
              <option value="Guideline">Guidelines</option>
            </select>

            {/* STATUS FILTER */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value="ALL">All Lifecycle Stages</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Review">In Review</option>
              <option value="Archived">Archived</option>
            </select>

            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer text-xs"
            >
              + Create New Document
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc) => {
          const isPublished = doc.status === 'Published'
          return (
            <div
              key={doc.id}
              onClick={() => handleOpenDoc(doc)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                {/* ID & TYPE BADGES */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                    {doc.id} • {doc.type}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      doc.classification === 'Confidential'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {doc.classification}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      isPublished
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>

                {/* TITLE & DEPT */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                  {doc.title}
                </h3>

                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 block font-bold">
                  {doc.department} • {doc.version}
                </span>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              {/* TAGS & FOOTER */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                {doc.tags && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Author: {doc.author}</span>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Eye size={12} /> {doc.views} views
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* INTERACTIVE DOCUMENT READER MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 md:p-8 relative">
            {/* WATERMARK BACKGROUND EFFECT */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center rotate-45 select-none font-mono text-4xl font-black text-slate-900 dark:text-white">
              STAFFROOM GOVERNANCE VAULT — {selectedDoc.classification} — {new Date().toISOString().split('T')[0]}
            </div>

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 relative z-10">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
                    {selectedDoc.id} • {selectedDoc.version}
                  </span>
                  <span className="text-slate-400">• Effective: {selectedDoc.effectiveDate}</span>
                  <span className="text-emerald-600 font-bold">• Review: {selectedDoc.reviewDate}</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedDoc.title}
                </h2>
                <span className="text-xs font-mono text-slate-500 block">
                  Author: {selectedDoc.author} ({selectedDoc.department})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold hover:bg-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <History size={13} /> Version Diff
                </button>
                <button
                  onClick={() => onNotify && onNotify(`Exported ${selectedDoc.id} as PDF Document`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-mono font-bold hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* APPROVAL MATRIX FLOW */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs relative z-10">
              <span className="font-mono font-bold text-slate-400 text-[10px] uppercase block">
                Governance Approval Chain:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {selectedDoc.approvals && selectedDoc.approvals.map((app, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <div>
                      <strong className="block font-bold text-slate-900 dark:text-white text-[11px]">{app.role} ({app.name})</strong>
                      <span className="text-[9px] font-mono text-slate-400">{app.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENT CONTENT BLOCKS */}
            <div className="space-y-5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed relative z-10">
              {selectedDoc.contentBlocks && selectedDoc.contentBlocks.map((block, bIdx) => {
                if (block.type === 'heading') {
                  return (
                    <h3 key={bIdx} className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 pt-2">
                      {block.text}
                    </h3>
                  )
                }
                if (block.type === 'paragraph') {
                  return <p key={bIdx}>{block.text}</p>
                }
                if (block.type === 'callout') {
                  return (
                    <div key={bIdx} className={`p-4 rounded-2xl border space-y-1 ${
                      block.variant === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : block.variant === 'danger'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                    }`}>
                      <strong className="block font-bold text-xs">{block.title}</strong>
                      <p className="text-xs">{block.text}</p>
                    </div>
                  )
                }
                if (block.type === 'table') {
                  return (
                    <div key={bIdx} className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500 uppercase">
                          <tr>
                            {block.headers.map((h, i) => (
                              <th key={i} className="p-2.5">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {block.rows.map((row, rI) => (
                            <tr key={rI} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              {row.map((cell, cI) => (
                                <td key={cI} className="p-2.5 font-mono">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                if (block.type === 'checklist') {
                  return (
                    <div key={bIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-mono font-bold text-slate-400 text-[10px] uppercase">
                        Interactive Action Items:
                      </span>
                      {block.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          onClick={() => handleToggleCheckitem(bIdx, iIdx)}
                          className="flex items-center gap-2 font-mono text-xs cursor-pointer select-none"
                        >
                          <input type="checkbox" checked={item.checked} readOnly className="rounded" />
                          <span className={item.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-bold'}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                if (block.type === 'code') {
                  return (
                    <pre key={bIdx} className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      <code>{block.code}</code>
                    </pre>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      )}

      {/* VERSION COMPARISON DIFF MODAL */}
      {showCompareModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <History size={16} className="text-indigo-600" />
                Version Comparison Diff: {selectedDoc.version} vs v3.1
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <strong className="block text-indigo-600">Current Version ({selectedDoc.version})</strong>
                <p className="text-slate-700 dark:text-slate-300">Requisitions over KES 500,000 require CFO dual sign-off within 4 hours.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <strong className="block text-amber-600">Previous Version (v3.1)</strong>
                <p className="text-slate-500">Requisitions over KES 250,000 required Finance Director sign-off within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
