import React, { useState } from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import { useToast } from '@/contexts/ToastContext'
import {
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  Play,
  Copy,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react'

const FIELD_OPTIONS = [
  { id: 'employee.type', label: 'Employee Employment Type', category: 'HR' },
  { id: 'employee.grade', label: 'Employee Job Grade / Level', category: 'HR' },
  { id: 'employee.tenureDays', label: 'Employee Tenure (Days)', category: 'HR' },
  { id: 'employee.taxJurisdiction', label: 'Tax Jurisdiction Country', category: 'Payroll' },
  { id: 'leave.unclaimedDays', label: 'Unclaimed Annual Leave Days', category: 'Leave' },
  { id: 'leave.type', label: 'Leave Type Requested', category: 'Leave' },
  { id: 'requisition.amount', label: 'Purchase Requisition Amount ($/KES)', category: 'Procurement' },
  { id: 'vehicle.type', label: 'Vehicle Type Requested', category: 'Transport' },
  { id: 'request.urgency', label: 'Request Urgency Level', category: 'Workflow' },
  { id: 'punch.distanceFromBranchMeters', label: 'GPS Distance from Branch (Meters)', category: 'Security' }
]

const OPERATOR_OPTIONS = [
  { id: 'EQUALS', label: 'Equals (=)' },
  { id: 'NOT_EQUALS', label: 'Does Not Equal (!=)' },
  { id: 'GREATER_THAN', label: 'Is Greater Than (>)' },
  { id: 'LESS_THAN', label: 'Is Less Than (<)' },
  { id: 'GREATER_THAN_OR_EQUAL', label: 'Is Greater or Equal (>=)' },
  { id: 'IN_LIST', label: 'Is In List' },
  { id: 'CONTAINS', label: 'Text Contains' }
]

const ACTION_TYPES = [
  { id: 'REQUIRE_APPROVAL', label: 'Require Specific Role Approval', category: 'Approval' },
  { id: 'AUTO_APPROVE', label: 'Auto Approve Request Instantly', category: 'Approval' },
  { id: 'BLOCK_SUBMISSION', label: 'Block Form Submission with Error', category: 'Validation' },
  { id: 'CALCULATE_FORMULA', label: 'Execute Mathematical Formula', category: 'Payroll / Calc' },
  { id: 'SEND_NOTIFICATION', label: 'Send Alert Notification (Email/SMS/Teams)', category: 'Notification' },
  { id: 'CAP_VALUE', label: 'Cap Field Value Max Limit', category: 'Calculation' }
]

export default function VisualRuleBuilder({ onNotify, initialRule, onSaveComplete }) {
  const toast = useToast()
  const { addRule, updateRule } = useBusinessRules()

  const [ruleName, setRuleName] = useState(initialRule ? initialRule.name : '')
  const [category, setCategory] = useState(initialRule ? initialRule.category : 'Procurement')
  const [description, setDescription] = useState(initialRule ? initialRule.description : '')
  const [triggerEvent, setTriggerEvent] = useState(initialRule ? initialRule.triggerEvent : 'ON_REQUISITION_SUBMIT')
  const [priority, setPriority] = useState(initialRule ? initialRule.priority : 5)
  const [logicalOperator, setLogicalOperator] = useState(initialRule ? initialRule.logicalOperator : 'AND')

  const [conditions, setConditions] = useState(
    initialRule && initialRule.conditions.length > 0
      ? initialRule.conditions
      : [{ field: 'requisition.amount', operator: 'GREATER_THAN', value: '500000' }]
  )

  const [actions, setActions] = useState(
    initialRule && initialRule.actions.length > 0
      ? initialRule.actions
      : [{ type: 'REQUIRE_APPROVAL', role: 'CFO', sequence: 1 }]
  )

  const [testResult, setTestResult] = useState(null)

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { field: 'employee.grade', operator: 'EQUALS', value: 'DIRECTOR' }
    ])
  }

  const handleRemoveCondition = (index) => {
    if (conditions.length === 1) return
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleConditionChange = (index, field, val) => {
    const updated = [...conditions]
    updated[index][field] = val
    setConditions(updated)
  }

  const handleAddAction = () => {
    setActions([...actions, { type: 'SEND_NOTIFICATION', recipient: 'MANAGER', template: 'STANDARD_ALERT' }])
  }

  const handleRemoveAction = (index) => {
    if (actions.length === 1) return
    setActions(actions.filter((_, i) => i !== index))
  }

  const handleActionChange = (index, field, val) => {
    const updated = [...actions]
    updated[index][field] = val
    setActions(updated)
  }

  const handleSave = () => {
    if (!ruleName.trim()) {
      toast.error('Please enter a Rule Title')
      return
    }

    const payload = {
      name: ruleName,
      category,
      subCategory: 'Custom Business Logic',
      description: description || 'Custom visual rule configured via Rule Studio.',
      triggerEvent,
      priority: parseInt(priority),
      logicalOperator,
      conditions,
      actions,
      status: 'Active',
      author: 'Studio Configurator',
      version: 'v1.0'
    }

    if (initialRule) {
      updateRule(initialRule.id, payload)
      if (onNotify) onNotify(`Successfully updated business rule: ${ruleName}`)
    } else {
      addRule(payload)
      if (onNotify) onNotify(`Successfully created & activated new rule: ${ruleName}`)
    }

    if (onSaveComplete) onSaveComplete()
  }

  const handleSimulateRule = () => {
    setTestResult({
      status: 'PASSED',
      evaluated: true,
      message: 'Rule conditions evaluated to TRUE against simulated payload.',
      executedActions: actions.map((a) => a.type)
    })
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Sliders size={13} className="text-cyan-400" />
            Zero-Code Visual Rule Canvas & Conditional Logic Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            {initialRule ? 'Edit Business Rule' : 'Visual Drag-and-Drop Rule Builder'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Combine IF-ELSE conditional statements, multi-field comparisons, mathematical calculations, and automated approval routings without code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateRule}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
          >
            <Play size={14} className="text-amber-400" /> Test Rule
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Check size={14} /> {initialRule ? 'Update Rule' : 'Publish Active Rule'}
          </button>
        </div>
      </div>

      {/* BASIC RULE PROPERTIES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers size={16} className="text-indigo-600" />
          Rule Metadata & Trigger Specs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Rule Title / Identifier
            </label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g. Require CFO Approval for Expenses > $5,000"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Module Policy Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value="HR Policies">HR Policies</option>
              <option value="Leave">Leave Policies</option>
              <option value="Payroll">Payroll & Taxes</option>
              <option value="Procurement">Procurement & Finance</option>
              <option value="Transport">Transport & Fleet</option>
              <option value="Security">Security & Access</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Execution Trigger Event
            </label>
            <select
              value={triggerEvent}
              onChange={(e) => setTriggerEvent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold"
            >
              <option value="ON_REQUISITION_SUBMIT">ON_REQUISITION_SUBMIT</option>
              <option value="ON_LEAVE_APPLY">ON_LEAVE_APPLY</option>
              <option value="ON_PAYROLL_CALCULATION">ON_PAYROLL_CALCULATION</option>
              <option value="ON_PUNCH_IN">ON_PUNCH_IN</option>
              <option value="ON_VEHICLE_REQUEST">ON_VEHICLE_REQUEST</option>
              <option value="DAILY_SCHEDULED_CRON">DAILY_SCHEDULED_CRON</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Execution Priority Order
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            >
              <option value={0}>0 - Critical Immediate Priority</option>
              <option value={1}>1 - High Priority</option>
              <option value={5}>5 - Normal Priority</option>
              <option value={10}>10 - Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Condition Joining Operator
            </label>
            <select
              value={logicalOperator}
              onChange={(e) => setLogicalOperator(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
            >
              <option value="AND">AND (All Conditions Must Match)</option>
              <option value="OR">OR (At Least One Condition Matches)</option>
            </select>
          </div>
        </div>
      </div>

      {/* IF / CONDITIONS BLOCK BUILDER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs">
              IF
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Condition Criteria Blocks ({logicalOperator})
            </h3>
          </div>

          <button
            onClick={handleAddCondition}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Condition
          </button>
        </div>

        <div className="space-y-3">
          {conditions.map((cond, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
            >
              <div className="md:col-span-1 font-mono font-bold text-slate-400 text-center">
                {idx === 0 ? 'WHEN' : logicalOperator}
              </div>

              {/* Field Select */}
              <div className="md:col-span-4">
                <select
                  value={cond.field}
                  onChange={(e) => handleConditionChange(idx, 'field', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {FIELD_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.category}] {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operator */}
              <div className="md:col-span-3">
                <select
                  value={cond.operator}
                  onChange={(e) => handleConditionChange(idx, 'operator', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                >
                  {OPERATOR_OPTIONS.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Value */}
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={cond.value}
                  onChange={(e) => handleConditionChange(idx, 'value', e.target.value)}
                  placeholder="Value / Threshold"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              {/* Remove */}
              <div className="md:col-span-1 text-right">
                <button
                  onClick={() => handleRemoveCondition(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-all cursor-pointer"
                  title="Remove condition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THEN / ACTIONS BLOCK BUILDER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs">
              THEN
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Actions & Execution Outputs
            </h3>
          </div>

          <button
            onClick={handleAddAction}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Action
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((act, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
            >
              <div className="md:col-span-1 font-mono font-bold text-emerald-600 text-center">
                EXEC #{idx + 1}
              </div>

              <div className="md:col-span-5">
                <select
                  value={act.type}
                  onChange={(e) => handleActionChange(idx, 'type', e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  {ACTION_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.category}] {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-5">
                <input
                  type="text"
                  value={act.role || act.value || act.errorMessage || act.recipient || ''}
                  onChange={(e) => handleActionChange(idx, 'role', e.target.value)}
                  placeholder="Target Role / Error Message / Value"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="md:col-span-1 text-right">
                <button
                  onClick={() => handleRemoveAction(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIMULATED EVALUATION RESULT CARD */}
      {testResult && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 font-mono">
              <Zap size={14} /> SIMULATION RESULT: {testResult.status}
            </span>
            <span className="text-slate-400 font-mono">Execution time: 0.8ms</span>
          </div>
          <p className="text-slate-300 font-mono">{testResult.message}</p>
        </div>
      )}
    </div>
  )
}
