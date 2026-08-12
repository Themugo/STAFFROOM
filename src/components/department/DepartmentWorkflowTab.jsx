import React, { useState } from 'react'
import {
  GitFork, Plus, CheckCircle2, ShieldCheck, Play, Settings, AlertCircle,
  Sliders, ArrowRight, Zap, RefreshCw, Trash2
} from 'lucide-react'

export default function DepartmentWorkflowTab({ currentDept, showSuccess }) {
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: 'Department Purchase Approval Chain',
      trigger: 'Expense Claim > $500',
      action: 'Require Dept Head Approval → Notify Finance Lead',
      active: true,
      lastRun: '2 hours ago',
      executions: 42
    },
    {
      id: 'wf-2',
      name: 'Peer Shift Swap Auto-Approval',
      trigger: 'Shift Swap Request Created',
      action: 'Check Skill Qualifications Match → Auto-Approve & Update Roster',
      active: true,
      lastRun: 'Yesterday',
      executions: 18
    },
    {
      id: 'wf-3',
      name: 'High-Priority Task SLA Escalation',
      trigger: 'Task Status = IN_PROGRESS for > 48h',
      action: 'Notify Department Manager & Ping Assigned Member',
      active: false,
      lastRun: '3 days ago',
      executions: 9
    }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger: 'Expense Request',
    threshold: '1000',
    action: 'Dept Head Signoff'
  })

  const handleToggleWorkflow = (id) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, active: !w.active } : w))
    showSuccess('Department workflow rule updated.')
  }

  const handleCreateWorkflow = (e) => {
    e.preventDefault()
    if (!ruleForm.name) return
    const newWf = {
      id: `wf-${Date.now()}`,
      name: ruleForm.name,
      trigger: `${ruleForm.trigger} (> $${ruleForm.threshold})`,
      action: ruleForm.action,
      active: true,
      lastRun: 'Just created',
      executions: 0
    }
    setWorkflows([newWf, ...workflows])
    setRuleForm({ name: '', trigger: 'Expense Request', threshold: '1000', action: 'Dept Head Signoff' })
    setModalOpen(false)
    showSuccess(`New operational workflow rule "${newWf.name}" enabled for ${currentDept.name}!`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Self-Service Manager Rules
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <GitFork size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Operational Workflow Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Department managers can configure local operational workflows & approval rules independently without platform admin intervention.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Plus size={15} /> Build Department Workflow
          </button>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${wf.active ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 text-slate-400'}`}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{wf.name}</h4>
                  <p className="text-slate-400 text-[11px] font-mono">Executions: {wf.executions} • Last active: {wf.lastRun}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleWorkflow(wf.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    wf.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {wf.active ? 'ACTIVE' : 'DISABLED'}
                </button>
                <button
                  onClick={() => showSuccess(`Tested workflow "${wf.name}" execution against dry-run context.`)}
                  className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
                >
                  <Play size={12} /> Dry Run
                </button>
              </div>
            </div>

            {/* Visual Trigger -> Action Flow */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">WHEN:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{wf.trigger}</span>
              </div>
              <ArrowRight size={14} className="text-indigo-500 hidden md:block shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-indigo-500 font-bold">THEN:</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">{wf.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Build Workflow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitFork size={18} className="text-indigo-600" />
              Configure Custom Department Workflow
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Set automated operational rules and manager approval gates for {currentDept.name}.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="label">Workflow Title *</label>
                <input
                  className="input"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  placeholder="e.g. Equipment Purchase Gatekeeper"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Event Trigger</label>
                  <select
                    className="input"
                    value={ruleForm.trigger}
                    onChange={(e) => setRuleForm({ ...ruleForm, trigger: e.target.value })}
                  >
                    <option value="Expense Claim">Expense Claim</option>
                    <option value="Shift Swap Request">Shift Swap Request</option>
                    <option value="Overtime Authorization">Overtime Authorization</option>
                    <option value="SOP Document Revision">SOP Document Revision</option>
                  </select>
                </div>

                <div>
                  <label className="label">Threshold Value ($/Hrs)</label>
                  <input
                    type="number"
                    className="input"
                    value={ruleForm.threshold}
                    onChange={(e) => setRuleForm({ ...ruleForm, threshold: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Action / Approval Chain</label>
                <select
                  className="input"
                  value={ruleForm.action}
                  onChange={(e) => setRuleForm({ ...ruleForm, action: e.target.value })}
                >
                  <option value="Dept Head Signoff Required">Dept Head Signoff Required</option>
                  <option value="Require Dept Head + Finance Lead">Require Dept Head + Finance Lead</option>
                  <option value="Auto-Approve if Skill Qualified">Auto-Approve if Skill Qualified</option>
                  <option value="Notify Department Manager">Notify Department Manager</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Enable Workflow Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
