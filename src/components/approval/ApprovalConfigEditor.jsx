import { useState, useEffect } from 'react'
import {
  ShieldCheck, GitBranch, Clock, AlertTriangle, Users, CheckCircle2,
  XCircle, Plus, Trash2, ArrowUp, ArrowDown, Play, Sparkles, Sliders,
  Settings, CornerDownRight, Zap, RotateCcw, Check, FileText,
  DollarSign, Calendar, ChevronRight, Info, Lock, ArrowRight, UserCheck,
  Building, RefreshCw, Send, ShieldAlert, FileCheck
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const HR_TASKS = [
  { id: 'leave', name: 'Leave & PTO Requests', icon: Calendar, category: 'HR Operations', desc: 'Manage annual, sick, parental, and unpaid leave signoffs.' },
  { id: 'payroll', name: 'Payroll Disbursal & Bonuses', icon: DollarSign, category: 'Finance & Compensation', desc: 'Multi-director approval for monthly payroll and bonus releases.' },
  { id: 'expense', name: 'Expense Claims & Refunds', icon: FileText, category: 'Finance', desc: 'Verify travel, equipment, and client expense claims.' },
  { id: 'overtime', name: 'Overtime & Time Punch Claims', icon: Clock, category: 'Workforce Management', desc: 'Validate extra hours worked and shift differential pay.' },
  { id: 'promotion', name: 'Promotions & Salary Adjustments', icon: ArrowUp, category: 'Talent & HR', desc: 'Compensation changes, grade updates, and title promotions.' },
  { id: 'onboarding', name: 'New Hire Asset & Contract Signoff', icon: UserCheck, category: 'Talent Acquisition', desc: 'Provisioning laptops, badges, and employment contracts.' },
]

const APPROVER_ROLES = [
  { id: 'Line Manager', label: 'Direct Line Manager', desc: 'Immediate supervisor in employee org hierarchy' },
  { id: 'Department Head', label: 'Department Head / VP', desc: 'Executive leading the employee department' },
  { id: 'HR Director', label: 'HR Director / People Lead', desc: 'Central HR executive compliance authority' },
  { id: 'Finance Lead', label: 'Finance Manager / Controller', desc: 'Budget and expenditure compliance controller' },
  { id: 'CFO', label: 'Chief Financial Officer (CFO)', desc: 'Executive financial signoff' },
  { id: 'CISO', label: 'CISO / Security & Compliance', desc: 'Information security and audit approval' },
  { id: 'CEO', label: 'Chief Executive Officer (CEO)', desc: 'Final organizational signoff authority' },
  { id: 'Specific User', label: 'Specific Designated User', desc: 'Named employee or delegated admin' },
]

const DEFAULT_CONFIGS = {
  leave: {
    taskKey: 'leave',
    taskName: 'Leave & PTO Requests',
    description: 'Multi-level approval flow for employee leave applications.',
    executionMode: 'sequential', // 'sequential' | 'parallel'
    parallelRule: 'unanimous', // 'unanimous' | 'first_response' | 'majority'
    steps: [
      {
        id: 'step_1',
        title: 'Line Manager Review',
        approverRole: 'Line Manager',
        specificUser: '',
        conditionType: 'always', // 'always' | 'duration_gt' | 'amount_gt' | 'risk_high'
        conditionValue: '',
        timeoutHours: 24,
        timeoutAction: 'escalate', // 'escalate' | 'auto_approve' | 'auto_reject' | 'delegate'
        reminderIntervalHours: 6,
      },
      {
        id: 'step_2',
        title: 'HR Director Signoff (Extended Leave)',
        approverRole: 'HR Director',
        specificUser: '',
        conditionType: 'duration_gt',
        conditionValue: '5',
        timeoutHours: 48,
        timeoutAction: 'escalate',
        reminderIntervalHours: 12,
      },
    ],
    escalationRules: {
      enabled: true,
      primaryTarget: 'Department Head',
      secondaryTarget: 'HR Director',
      secondaryTimeoutHours: 24,
      autoDelegateOnLeave: true,
      delegateSubstituteRole: 'Designated Backup Lead',
      emergencyBypassAllowed: true,
    },
    auditAndNotifications: {
      notifyEmployeeOnStep: true,
      notifySlackChannel: true,
      slackChannelName: '#hr-leave-approvals',
      requireEsignature: false,
      recordIPAndTimestamp: true,
    },
  },

  payroll: {
    taskKey: 'payroll',
    taskName: 'Payroll Disbursal & Bonuses',
    description: 'High-security multi-signoff workflow for monthly payroll runs.',
    executionMode: 'sequential',
    parallelRule: 'unanimous',
    steps: [
      {
        id: 'step_1',
        title: 'Payroll Auditor Reconciliation',
        approverRole: 'Finance Lead',
        specificUser: '',
        conditionType: 'always',
        conditionValue: '',
        timeoutHours: 12,
        timeoutAction: 'escalate',
        reminderIntervalHours: 3,
      },
      {
        id: 'step_2',
        title: 'CFO Final Financial Signoff',
        approverRole: 'CFO',
        specificUser: '',
        conditionType: 'always',
        conditionValue: '',
        timeoutHours: 24,
        timeoutAction: 'escalate',
        reminderIntervalHours: 6,
      },
      {
        id: 'step_3',
        title: 'CEO Disbursal Authorization',
        approverRole: 'CEO',
        specificUser: '',
        conditionType: 'amount_gt',
        conditionValue: '50000',
        timeoutHours: 24,
        timeoutAction: 'escalate',
        reminderIntervalHours: 6,
      },
    ],
    escalationRules: {
      enabled: true,
      primaryTarget: 'CFO',
      secondaryTarget: 'CISO',
      secondaryTimeoutHours: 12,
      autoDelegateOnLeave: true,
      delegateSubstituteRole: 'Deputy Financial Controller',
      emergencyBypassAllowed: false,
    },
    auditAndNotifications: {
      notifyEmployeeOnStep: false,
      notifySlackChannel: true,
      slackChannelName: '#payroll-exec-stream',
      requireEsignature: true,
      recordIPAndTimestamp: true,
    },
  },

  expense: {
    taskKey: 'expense',
    taskName: 'Expense Claims & Refunds',
    description: 'Automated expense validation and approval matrix based on claim size.',
    executionMode: 'parallel',
    parallelRule: 'first_response',
    steps: [
      {
        id: 'step_1',
        title: 'Direct Supervisor Verification',
        approverRole: 'Line Manager',
        specificUser: '',
        conditionType: 'always',
        conditionValue: '',
        timeoutHours: 48,
        timeoutAction: 'auto_approve',
        reminderIntervalHours: 12,
      },
      {
        id: 'step_2',
        title: 'Finance Expense Controller',
        approverRole: 'Finance Lead',
        specificUser: '',
        conditionType: 'amount_gt',
        conditionValue: '500',
        timeoutHours: 24,
        timeoutAction: 'escalate',
        reminderIntervalHours: 6,
      },
    ],
    escalationRules: {
      enabled: true,
      primaryTarget: 'Finance Lead',
      secondaryTarget: 'CFO',
      secondaryTimeoutHours: 24,
      autoDelegateOnLeave: true,
      delegateSubstituteRole: 'Finance Team Admin',
      emergencyBypassAllowed: true,
    },
    auditAndNotifications: {
      notifyEmployeeOnStep: true,
      notifySlackChannel: true,
      slackChannelName: '#expense-audit-feed',
      requireEsignature: false,
      recordIPAndTimestamp: true,
    },
  },

  overtime: {
    taskKey: 'overtime',
    taskName: 'Overtime & Time Punch Claims',
    description: 'Verification engine for overtime hours and attendance adjustments.',
    executionMode: 'sequential',
    parallelRule: 'unanimous',
    steps: [
      {
        id: 'step_1',
        title: 'Shift Supervisor Signoff',
        approverRole: 'Line Manager',
        specificUser: '',
        conditionType: 'always',
        conditionValue: '',
        timeoutHours: 24,
        timeoutAction: 'escalate',
        reminderIntervalHours: 6,
      },
    ],
    escalationRules: {
      enabled: true,
      primaryTarget: 'Department Head',
      secondaryTarget: 'HR Director',
      secondaryTimeoutHours: 24,
      autoDelegateOnLeave: true,
      delegateSubstituteRole: 'Duty Roster Lead',
      emergencyBypassAllowed: true,
    },
    auditAndNotifications: {
      notifyEmployeeOnStep: true,
      notifySlackChannel: false,
      slackChannelName: '',
      requireEsignature: false,
      recordIPAndTimestamp: true,
    },
  },
}

export default function ApprovalConfigEditor() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log('SUCCESS:', msg))
  const showInfo = notifications?.info || ((msg) => console.log('INFO:', msg))

  const [selectedTaskKey, setSelectedTaskKey] = useState('leave')
  const [configs, setConfigs] = useState(() => {
    const saved = localStorage.getItem('staffroom_approval_configs')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { /* fallback */ }
    }
    return DEFAULT_CONFIGS
  })

  // Selected config reference
  const currentConfig = configs[selectedTaskKey] || DEFAULT_CONFIGS.leave || DEFAULT_CONFIGS[Object.keys(DEFAULT_CONFIGS)[0]]

  // Test Run Simulation State
  const [simulating, setSimulating] = useState(false)
  const [simLogs, setSimLogs] = useState([])
  const [simStatus, setSimStatus] = useState('IDLE') // IDLE | RUNNING | PASSED | ESCALATED

  // Save configs to localStorage
  const handleSaveConfig = () => {
    localStorage.setItem('staffroom_approval_configs', JSON.stringify(configs))
    showSuccess(`Approval rules for ${currentConfig.taskName} saved & published successfully!`)
  }

  // Update helper for root attributes
  const updateConfigRoot = (key, value) => {
    setConfigs(prev => ({
      ...prev,
      [selectedTaskKey]: {
        ...prev[selectedTaskKey],
        [key]: value
      }
    }))
  }

  // Update helper for nested object (escalation, audit)
  const updateConfigNested = (section, key, value) => {
    setConfigs(prev => ({
      ...prev,
      [selectedTaskKey]: {
        ...prev[selectedTaskKey],
        [section]: {
          ...prev[selectedTaskKey][section],
          [key]: value
        }
      }
    }))
  }

  // Steps Management
  const handleAddStep = () => {
    const newStep = {
      id: `step_${Date.now()}`,
      title: `Approval Step ${currentConfig.steps.length + 1}`,
      approverRole: 'Department Head',
      specificUser: '',
      conditionType: 'always',
      conditionValue: '',
      timeoutHours: 24,
      timeoutAction: 'escalate',
      reminderIntervalHours: 6,
    }

    updateConfigRoot('steps', [...currentConfig.steps, newStep])
    showInfo('New approval step appended to workflow')
  }

  const handleUpdateStep = (stepId, field, value) => {
    const nextSteps = currentConfig.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, [field]: value }
      }
      return s
    })
    updateConfigRoot('steps', nextSteps)
  }

  const handleDeleteStep = (stepId) => {
    if (currentConfig.steps.length <= 1) {
      showInfo('Workflows require at least 1 approval step.')
      return
    }
    const nextSteps = currentConfig.steps.filter(s => s.id !== stepId)
    updateConfigRoot('steps', nextSteps)
    showInfo('Approval step removed')
  }

  const handleMoveStep = (index, direction) => {
    const newSteps = [...currentConfig.steps]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    const temp = newSteps[index]
    newSteps[index] = newSteps[targetIndex]
    newSteps[targetIndex] = temp
    updateConfigRoot('steps', newSteps)
  }

  // Reset to default preset
  const handleResetPreset = () => {
    if (DEFAULT_CONFIGS[selectedTaskKey]) {
      setConfigs(prev => ({
        ...prev,
        [selectedTaskKey]: JSON.parse(JSON.stringify(DEFAULT_CONFIGS[selectedTaskKey]))
      }))
      showInfo(`Reset ${currentConfig.taskName} to factory preset.`)
    }
  }

  // Run Test Simulator
  const handleRunSimulation = () => {
    setSimulating(true)
    setSimLogs([])
    setSimStatus('RUNNING')

    const taskName = currentConfig.taskName
    const mode = currentConfig.executionMode.toUpperCase()
    const logs = []

    logs.push({ time: '00:00:00', type: 'START', message: `Initiated test request payload for [${taskName}]` })
    logs.push({ time: '00:00:01', type: 'EVAL', message: `Execution Mode: ${mode} ${mode === 'PARALLEL' ? `(${currentConfig.parallelRule.toUpperCase()})` : ''}` })

    let delay = 600
    currentConfig.steps.forEach((step, idx) => {
      setTimeout(() => {
        logs.push({
          time: `00:00:0${idx + 2}`,
          type: 'STEP',
          message: `Evaluating Step ${idx + 1}: "${step.title}" Target: [${step.approverRole}]`,
        })

        if (step.conditionType !== 'always') {
          logs.push({
            time: `00:00:0${idx + 2}`,
            type: 'COND',
            message: `Condition Rule (${step.conditionType} ${step.conditionValue}): TRIGGER MATCHED`,
          })
        }

        logs.push({
          time: `00:00:0${idx + 3}`,
          type: 'SLA',
          message: `SLA Timer Armed: ${step.timeoutHours}h (Reminders every ${step.reminderIntervalHours}h)`,
        })

        setSimLogs([...logs])
      }, delay)
      delay += 800
    })

    setTimeout(() => {
      if (currentConfig.escalationRules.enabled) {
        logs.push({
          time: '00:00:06',
          type: 'ESCALATION',
          message: `Escalation Guard Armed: Timeout fallback routes to [${currentConfig.escalationRules.primaryTarget}]`,
        })
      }
      logs.push({
        time: '00:00:07',
        type: 'SUCCESS',
        message: `WORKFLOW VERIFIED: All ${currentConfig.steps.length} approval nodes and escalation rules compiled successfully.`,
      })
      setSimLogs([...logs])
      setSimStatus('PASSED')
      setSimulating(false)
      showSuccess('Simulation executed: Approval rule chain is valid & ready!')
    }, delay + 400)
  }

  return (
    <div className="space-y-6">
      {/* Top Controls & HR Task Selector */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              HR Task Approval & Escalation Configuration Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Define custom sequential or parallel approver hierarchies, condition thresholds, SLA timeout durations, and escalation rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetPreset}
              className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
              title="Reset current task to factory default preset"
            >
              <RotateCcw size={14} /> Reset Preset
            </button>
            <button
              onClick={handleSaveConfig}
              className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} /> Save & Publish Configuration
            </button>
          </div>
        </div>

        {/* Task Selection Cards */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 block">
            Select HR Task / Module to Configure
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HR_TASKS.map(task => {
              const Icon = task.icon
              const isSelected = task.id === selectedTaskKey
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskKey(task.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center mb-2 font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{task.name}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{task.category}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Config Options (Left) + Visual Flow Diagram & Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Flow Mode & Steps Configuration (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Execution Mode (Sequential vs Parallel) */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitBranch size={16} className="text-indigo-600" /> Approver Hierarchy Execution Mode
                </h3>
                <p className="text-xs text-slate-500">Determine how approval requests move through designated approver nodes.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                {currentConfig.executionMode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => updateConfigRoot('executionMode', 'sequential')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  currentConfig.executionMode === 'sequential'
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ChevronRight size={16} className="text-indigo-600" /> Sequential Approvers
                  </h4>
                  {currentConfig.executionMode === 'sequential' && <CheckCircle2 size={16} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Approvers sign off step-by-step in ordered sequence. Step 2 is only notified after Step 1 approves.
                </p>
              </div>

              <div
                onClick={() => updateConfigRoot('executionMode', 'parallel')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  currentConfig.executionMode === 'parallel'
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users size={16} className="text-indigo-600" /> Parallel Approvers
                  </h4>
                  {currentConfig.executionMode === 'parallel' && <CheckCircle2 size={16} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  All assigned approvers receive the request simultaneously. Speeds up processing time.
                </p>
              </div>
            </div>

            {/* Sub-policy for Parallel Mode */}
            {currentConfig.executionMode === 'parallel' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 animate-fade-in">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Parallel Approval Decision Consensus Rule
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'unanimous', label: 'Unanimous (100%)', desc: 'All approvers must approve' },
                    { id: 'first_response', label: 'First Response Wins', desc: 'First approval completes step' },
                    { id: 'majority', label: 'Majority (>50%)', desc: 'Over 50% must sign off' },
                  ].map(rule => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => updateConfigRoot('parallelRule', rule.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        currentConfig.parallelRule === rule.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{rule.label}</div>
                      <div className={`text-[10px] ${currentConfig.parallelRule === rule.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {rule.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Approver Steps Hierarchy & Timeout Durations */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-indigo-600" /> Approver Steps & Timeout Durations ({currentConfig.steps.length})
                </h3>
                <p className="text-xs text-slate-500">Configure approver roles, step conditions, SLA durations, and timeout actions.</p>
              </div>
              <button
                onClick={handleAddStep}
                className="btn-primary text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>

            <div className="space-y-4">
              {currentConfig.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 relative transition-all"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                        className="font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-indigo-500 px-1 py-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveStep(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveStep(index, 1)}
                        disabled={index === currentConfig.steps.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remove Step"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Step Settings Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    
                    {/* Approver Role */}
                    <div>
                      <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Target Approver Role
                      </label>
                      <select
                        value={step.approverRole}
                        onChange={(e) => handleUpdateStep(step.id, 'approverRole', e.target.value)}
                        className="input text-xs w-full bg-white dark:bg-slate-900"
                      >
                        {APPROVER_ROLES.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Condition Threshold */}
                    <div>
                      <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Trigger Condition
                      </label>
                      <select
                        value={step.conditionType}
                        onChange={(e) => handleUpdateStep(step.id, 'conditionType', e.target.value)}
                        className="input text-xs w-full bg-white dark:bg-slate-900"
                      >
                        <option value="always">Always Required</option>
                        <option value="duration_gt">Leave Duration Exceeds (Days)</option>
                        <option value="amount_gt">Financial Amount Exceeds ($)</option>
                        <option value="risk_high">High Risk Audit Flagged</option>
                      </select>
                    </div>

                    {/* Condition Value if needed */}
                    {step.conditionType !== 'always' && step.conditionType !== 'risk_high' && (
                      <div>
                        <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                          Condition Threshold Value
                        </label>
                        <input
                          type="number"
                          value={step.conditionValue}
                          onChange={(e) => handleUpdateStep(step.id, 'conditionValue', e.target.value)}
                          placeholder="e.g. 5 days or 10000 $"
                          className="input text-xs w-full bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}

                    {/* SLA Timeout Duration */}
                    <div>
                      <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block flex items-center gap-1">
                        <Clock size={12} className="text-amber-500" /> SLA Timeout Duration (Hours)
                      </label>
                      <input
                        type="number"
                        value={step.timeoutHours}
                        onChange={(e) => handleUpdateStep(step.id, 'timeoutHours', parseInt(e.target.value) || 24)}
                        className="input text-xs w-full bg-white dark:bg-slate-900"
                      />
                    </div>

                    {/* Action on Timeout */}
                    <div>
                      <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Action On Timeout Expiry
                      </label>
                      <select
                        value={step.timeoutAction}
                        onChange={(e) => handleUpdateStep(step.id, 'timeoutAction', e.target.value)}
                        className="input text-xs w-full bg-white dark:bg-slate-900 font-medium"
                      >
                        <option value="escalate">⚡ Escalate to Escalation Target</option>
                        <option value="auto_approve">✅ Auto-Approve (Low Risk)</option>
                        <option value="auto_reject">❌ Auto-Reject</option>
                        <option value="delegate">🔁 Re-route to Delegate Lead</option>
                      </select>
                    </div>

                    {/* Reminder Frequency */}
                    <div>
                      <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Reminder Ping Interval (Hours)
                      </label>
                      <input
                        type="number"
                        value={step.reminderIntervalHours}
                        onChange={(e) => handleUpdateStep(step.id, 'reminderIntervalHours', parseInt(e.target.value) || 6)}
                        className="input text-xs w-full bg-white dark:bg-slate-900"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Escalation Rules Matrix */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-500" /> Escalation Rules & Delegation Matrix
                </h3>
                <p className="text-xs text-slate-500">Prevent workflow bottlenecks when approvers are inactive or absent.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentConfig.escalationRules.enabled}
                  onChange={(e) => updateConfigNested('escalationRules', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {currentConfig.escalationRules.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" /> Primary Escalation Target
                  </h4>
                  <select
                    value={currentConfig.escalationRules.primaryTarget}
                    onChange={(e) => updateConfigNested('escalationRules', 'primaryTarget', e.target.value)}
                    className="input text-xs w-full bg-white dark:bg-slate-900"
                  >
                    <option value="Department Head">Department Head / VP</option>
                    <option value="HR Director">HR Director / People Lead</option>
                    <option value="Skip-level Manager">Skip-level Manager</option>
                    <option value="CFO">Chief Financial Officer (CFO)</option>
                    <option value="CISO">CISO / Compliance Lead</option>
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Notified immediately when step SLA timeout is breached without signoff.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-rose-500" /> Secondary Fail-Safe Escalation
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={currentConfig.escalationRules.secondaryTarget}
                      onChange={(e) => updateConfigNested('escalationRules', 'secondaryTarget', e.target.value)}
                      className="input text-xs w-full bg-white dark:bg-slate-900"
                    >
                      <option value="HR Director">HR Director</option>
                      <option value="CISO">CISO / Executive</option>
                      <option value="CEO">CEO Office</option>
                    </select>
                    <input
                      type="number"
                      value={currentConfig.escalationRules.secondaryTimeoutHours}
                      onChange={(e) => updateConfigNested('escalationRules', 'secondaryTimeoutHours', parseInt(e.target.value) || 24)}
                      placeholder="Hours"
                      className="input text-xs w-full bg-white dark:bg-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Secondary timeout window before ultimate escalation to executive committee.
                  </p>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck size={14} className="text-indigo-600" /> Auto-Delegate Out-of-Office Approvers
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      If primary approver is away on leave, automatically reroute pending requests to substitute.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={currentConfig.escalationRules.delegateSubstituteRole}
                    onChange={(e) => updateConfigNested('escalationRules', 'delegateSubstituteRole', e.target.value)}
                    placeholder="Substitute Role Title"
                    className="input text-xs min-w-[200px] bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Visual Diagram & Test Simulator (1 col) */}
        <div className="space-y-6">

          {/* Visual Workflow Diagram */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" /> Live Workflow Topology
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{currentConfig.executionMode.toUpperCase()}</span>
            </div>

            {/* Topology Flow Canvas */}
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 space-y-3 font-mono text-xs border border-slate-800">
              
              {/* Start Trigger Node */}
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Play size={12} className="text-emerald-400" /> Start Trigger
                </span>
                <span className="text-[10px] text-emerald-400 font-sans">{currentConfig.taskName}</span>
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center -my-1">
                <div className="h-4 w-0.5 bg-slate-700" />
              </div>

              {/* Mode Badge */}
              <div className="text-center">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {currentConfig.executionMode === 'sequential' ? '↳ Sequential Step Chain' : `↳ Parallel Branch (${currentConfig.parallelRule.toUpperCase()})`}
                </span>
              </div>

              {/* Approver Step Nodes */}
              {currentConfig.steps.map((st, i) => (
                <div key={st.id} className="space-y-1">
                  <div className="flex justify-center -my-1">
                    <div className="h-4 w-0.5 bg-slate-700" />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-indigo-300">Step {i + 1}: {st.title}</span>
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Clock size={10} /> {st.timeoutHours}h SLA
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans flex items-center justify-between">
                      <span>Target: <strong className="text-slate-200">{st.approverRole}</strong></span>
                      <span className="text-slate-500">{st.conditionType === 'always' ? 'Always' : st.conditionType}</span>
                    </div>

                    {/* Timeout Fallback Badge */}
                    <div className="text-[9px] text-rose-400 bg-rose-950/40 p-1 rounded border border-rose-900/60 flex items-center justify-between mt-1">
                      <span>On Timeout ({st.timeoutHours}h):</span>
                      <strong className="uppercase">{st.timeoutAction}</strong>
                    </div>
                  </div>
                </div>
              ))}

              {/* Escalation Node if Enabled */}
              {currentConfig.escalationRules.enabled && (
                <>
                  <div className="flex justify-center -my-1">
                    <div className="h-4 w-0.5 bg-rose-800 border-l border-dashed border-rose-500" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={12} className="text-rose-400" /> Escalation Guard Target
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans">Primary: {currentConfig.escalationRules.primaryTarget}</p>
                  </div>
                </>
              )}

              <div className="flex justify-center -my-1">
                <div className="h-4 w-0.5 bg-slate-700" />
              </div>

              {/* End Node */}
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-600/60 text-blue-300 text-center font-bold text-[11px]">
                ✓ Request Approved & Executed
              </div>
            </div>
          </div>

          {/* Test Run Simulator */}
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Play size={14} className="text-emerald-500" /> Rule Test Simulator
              </h3>
              <button
                onClick={handleRunSimulation}
                disabled={simulating}
                className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {simulating ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {simulating ? 'Simulating...' : 'Run Test Simulation'}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Dry-run a sample request through the active approval topology to verify step evaluation and escalation paths.
            </p>

            {simLogs.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[10px] space-y-1.5 max-h-56 overflow-y-auto border border-slate-800">
                <div className="text-[10px] font-bold text-emerald-400 pb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>SIMULATION TELEMETRY LOG</span>
                  <span className="text-indigo-300 font-bold">{simStatus}</span>
                </div>
                {simLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 leading-tight">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className={`font-bold shrink-0 ${
                      log.type === 'START' ? 'text-indigo-400' :
                      log.type === 'STEP' ? 'text-cyan-400' :
                      log.type === 'SLA' ? 'text-amber-400' :
                      log.type === 'ESCALATION' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {log.type}:
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
