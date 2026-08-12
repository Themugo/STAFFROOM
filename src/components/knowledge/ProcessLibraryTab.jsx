import React, { useState } from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  GitCommit,
  ArrowRight,
  User,
  Plus,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react'

export default function ProcessLibraryTab({ onNotify }) {
  const { processes, addProcess, documents } = useKnowledge()

  const [showAddModal, setShowAddModal] = useState(false)
  const [procName, setProcName] = useState('')
  const [procOwner, setProcOwner] = useState('Process Owner')
  const [procDept, setProcDept] = useState('Operations')
  const [procKpi, setProcKpi] = useState('Execution SLA < 2 days')
  const [inputs, setInputs] = useState('Requisition, Vendor Quote')
  const [outputs, setOutputs] = useState('Approved PO, Voucher')

  const handleCreateProcess = () => {
    if (!procName.trim()) return

    addProcess({
      name: procName,
      owner: procOwner,
      department: procDept,
      kpi: procKpi,
      inputs: inputs.split(',').map((s) => s.trim()),
      outputs: outputs.split(',').map((s) => s.trim()),
      steps: [
        { step: 1, title: 'Initiation & Form Submission', role: 'Requester' },
        { step: 2, title: 'Review & Verification', role: 'Department Lead' },
        { step: 3, title: 'Final Authorization & Execution', role: 'Executive Approver' }
      ]
    })

    if (onNotify) onNotify(`Created Process Flow: ${procName}`)
    setShowAddModal(false)
    setProcName('')
  }

  return (
    <div className="space-y-6">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitCommit size={18} className="text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Enterprise Business Process Library & Flowcharts
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Document end-to-end operational workflows with inputs, outputs, SLAs, and linked compliance policies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md self-start sm:self-auto"
        >
          + Map New Process
        </button>
      </div>

      {/* PROCESS CARDS LIST */}
      <div className="space-y-6">
        {processes.map((proc) => {
          const linkedDoc = documents.find((d) => d.id === proc.linkedPolicy)

          return (
            <div
              key={proc.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {proc.id}
                    </span>
                    <span className="text-slate-400">• Owner: {proc.owner} ({proc.department})</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {proc.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    KPI: {proc.kpi}
                  </span>
                </div>
              </div>

              {/* INPUTS & OUTPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">REQUIRED INPUTS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proc.inputs && proc.inputs.map((inp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold">
                        • {inp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">PROCESS OUTPUTS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proc.outputs && proc.outputs.map((out, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                        ✓ {out}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* VISUAL FLOWCHART STEPS */}
              <div className="space-y-2 pt-2">
                <span className="font-mono font-bold text-slate-400 text-[10px] uppercase block">
                  Workflow Execution Sequence:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {proc.steps && proc.steps.map((st, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 space-y-2 relative">
                      <div className="flex items-center justify-between font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        <span>STEP 0{st.step}</span>
                        <span>{st.role}</span>
                      </div>
                      <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                        {st.title}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* LINKED POLICY */}
              {linkedDoc && (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-indigo-600" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Governing SOP: {linkedDoc.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-indigo-600">{linkedDoc.id}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CREATE PROCESS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Map New Business Process Flowchart
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Process Name</label>
                <input
                  type="text"
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  placeholder="e.g. Asset Disposal & Write-Off Workflow"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Process Owner</label>
                  <input
                    type="text"
                    value={procOwner}
                    onChange={(e) => setProcOwner(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={procDept}
                    onChange={(e) => setProcDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">KPI SLA Target</label>
                <input
                  type="text"
                  value={procKpi}
                  onChange={(e) => setProcKpi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={handleCreateProcess} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                Save Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
