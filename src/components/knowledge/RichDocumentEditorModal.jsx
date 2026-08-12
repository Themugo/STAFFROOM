import React, { useState } from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import { useToast } from '@/contexts/ToastContext'
import {
  FileText,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Heading,
  AlignLeft,
  AlertTriangle,
  Table,
  CheckSquare,
  Code
} from 'lucide-react'

export default function RichDocumentEditorModal({ isOpen, onClose, onNotify }) {
  const toast = useToast()
  const { spaces, addDocument } = useKnowledge()

  const [title, setTitle] = useState('')
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || 'SPC-ORG')
  const [type, setType] = useState('SOP')
  const [department, setDepartment] = useState('Operations')
  const [classification, setClassification] = useState('Internal')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('SOP, Operations, Policy')
  const [author, setAuthor] = useState('Document Author')

  const [contentBlocks, setContentBlocks] = useState([
    { type: 'heading', level: 1, text: '1. Purpose & Organizational Scope' },
    { type: 'paragraph', text: 'Enter detailed procedural guidelines, rules, and operational requirements.' },
    { type: 'callout', variant: 'warning', title: 'Compliance Requirement', text: 'Important policy constraint or safety warning.' }
  ])

  if (!isOpen) return null

  const handleAddBlock = (blockType) => {
    if (blockType === 'heading') {
      setContentBlocks([...contentBlocks, { type: 'heading', level: 2, text: 'New Section Heading' }])
    } else if (blockType === 'paragraph') {
      setContentBlocks([...contentBlocks, { type: 'paragraph', text: 'New procedural description paragraph.' }])
    } else if (blockType === 'callout') {
      setContentBlocks([...contentBlocks, { type: 'callout', variant: 'info', title: 'Operational Note', text: 'Callout notification content.' }])
    } else if (blockType === 'checklist') {
      setContentBlocks([
        ...contentBlocks,
        {
          type: 'checklist',
          items: [
            { text: 'Verification step 1', checked: false },
            { text: 'Verification step 2', checked: false }
          ]
        }
      ])
    } else if (blockType === 'code') {
      setContentBlocks([...contentBlocks, { type: 'code', code: '// Automated CLI or System Commands' }])
    }
  }

  const handleRemoveBlock = (index) => {
    if (contentBlocks.length === 1) return
    setContentBlocks(contentBlocks.filter((_, i) => i !== index))
  }

  const handleBlockChange = (index, field, value) => {
    const updated = [...contentBlocks]
    updated[index][field] = value
    setContentBlocks(updated)
  }

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a Document Title')
      return
    }

    const payload = {
      title,
      spaceId,
      type,
      department,
      classification,
      description: description || 'New enterprise document created via Rich Knowledge Studio.',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      author,
      contentBlocks,
      status: 'Published',
      version: 'v1.0',
      approvals: [
        { role: 'Author', name: author, status: 'Approved', date: new Date().toISOString().split('T')[0] }
      ]
    }

    addDocument(payload)
    if (onNotify) onNotify(`Published new document: ${title}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 md:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[11px] font-mono font-bold border border-indigo-200 dark:border-indigo-800">
              Rich Enterprise Document Studio
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Create New Policy, SOP, or Runbook
            </h2>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl">
            <X size={18} />
          </button>
        </div>

        {/* METADATA FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standard Operating Procedure: Regional Cash Disbursement"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Knowledge Space
            </label>
            <select
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Document Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value="SOP">Standard Operating Procedure (SOP)</option>
              <option value="Policy">Policy</option>
              <option value="Handbook">Employee Handbook</option>
              <option value="Runbook">IT / Ops Runbook</option>
              <option value="Guideline">Guideline</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Classification
            </label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value="Public">Public</option>
              <option value="Internal">Internal</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>
        </div>

        {/* CONTENT BLOCK EDITOR BAR */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Document Content Blocks
            </h3>

            <div className="flex gap-1 text-[11px] font-mono">
              <button
                onClick={() => handleAddBlock('heading')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Heading size={13} /> + Heading
              </button>
              <button
                onClick={() => handleAddBlock('paragraph')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <AlignLeft size={13} /> + Text
              </button>
              <button
                onClick={() => handleAddBlock('callout')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle size={13} /> + Callout
              </button>
              <button
                onClick={() => handleAddBlock('checklist')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare size={13} /> + Checklist
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {contentBlocks.map((block, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs relative">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                  <span>BLOCK #{idx + 1} — {block.type.toUpperCase()}</span>
                  <button onClick={() => handleRemoveBlock(idx)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 size={14} />
                  </button>
                </div>

                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.text}
                    onChange={(e) => handleBlockChange(idx, 'text', e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                  />
                )}

                {block.type === 'paragraph' && (
                  <textarea
                    rows={2}
                    value={block.text}
                    onChange={(e) => handleBlockChange(idx, 'text', e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                )}

                {block.type === 'callout' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => handleBlockChange(idx, 'title', e.target.value)}
                      placeholder="Callout Title"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                    />
                    <textarea
                      rows={2}
                      value={block.text}
                      onChange={(e) => handleBlockChange(idx, 'text', e.target.value)}
                      placeholder="Callout description"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-100 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
            Publish Document
          </button>
        </div>
      </div>
    </div>
  )
}
