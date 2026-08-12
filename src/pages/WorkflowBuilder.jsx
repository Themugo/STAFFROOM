import { useEffect, useState, useRef } from 'react'
import {
  GitBranch, Play, CheckCircle, Clock, AlertCircle, Settings, Users, FileText, Briefcase,
  DollarSign, Calendar, Plus, Sparkles, Send, ShieldCheck, RefreshCw, Layers, Trash2, Edit3,
  Copy, Download, Upload, Zap, Eye, Filter, ArrowRight, CornerDownRight, CheckCircle2, XCircle,
  Sliders, Server, Cpu, Mail, MessageSquare, Terminal, FileCheck, AlertTriangle, Workflow,
  ChevronRight, PlayCircle, PauseCircle, RotateCcw, Activity, HelpCircle, Lock, Database,
  Globe, Share2, Check, ExternalLink, ChevronDown, ListChecks, ArrowUp, ArrowDown
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { StatCard, Modal, DataTable, StatusBadge, EmptyState, PageHeader, Tabs, Spinner } from '../components/ui'
import { formatDate, formatCurrency } from '../lib/format'
import ApprovalConfigEditor from '../components/approval/ApprovalConfigEditor'

const MAIN_TABS = [
  { id: 'designer', label: 'Visual Workflow Designer' },
  { id: 'templates', label: 'Workflow Template Library (16)' },
  { id: 'triggers_rules', label: 'Triggers & Business Rules Engine' },
  { id: 'executions', label: 'Live Executions & Telemetry' },
  { id: 'approvals', label: 'Approval Engine & Tasks' },
  { id: 'integrations', label: 'Integrations & Webhooks' },
  { id: 'analytics', label: 'Automation Analytics & ROI' },
  { id: 'governance', label: 'Versioning & Audit Governance' },
]

const NODE_TYPES = [
  { type: 'start', label: 'Start Trigger', icon: PlayCircle, color: 'bg-emerald-500 text-white', desc: 'Event or schedule trigger' },
  { type: 'approval', label: 'Approval Step', icon: ShieldCheck, color: 'bg-indigo-600 text-white', desc: 'Single or multi-level signoff' },
  { type: 'condition', label: 'Decision / Condition', icon: Sliders, color: 'bg-amber-500 text-white', desc: 'If / Else branching logic' },
  { type: 'ai_action', label: 'AI Action Engine', icon: Sparkles, color: 'bg-purple-600 text-white', desc: 'AI summary, review, or prompt' },
  { type: 'task', label: 'Task Assignment', icon: ListChecks, color: 'bg-blue-600 text-white', desc: 'Assign work item with due date' },
  { type: 'doc_gen', label: 'Document Generation', icon: FileCheck, color: 'bg-cyan-600 text-white', desc: 'Auto-generate contract or PDF' },
  { type: 'notification', label: 'Multi-Channel Alert', icon: Mail, color: 'bg-pink-600 text-white', desc: 'Email, SMS, Teams, Slack, WhatsApp' },
  { type: 'delay', label: 'Delay / Timeout Guard', icon: Clock, color: 'bg-slate-600 text-white', desc: 'Wait duration or SLA escalation' },
  { type: 'webhook', label: 'REST API Webhook', icon: Server, color: 'bg-orange-600 text-white', desc: 'Call external endpoint / ERP' },
  { type: 'script', label: 'Field Update / Script', icon: Terminal, color: 'bg-teal-600 text-white', desc: 'Update record status or values' },
  { type: 'escalation', label: 'Escalation Path', icon: AlertTriangle, color: 'bg-rose-600 text-white', desc: 'Escalate if timeout exceeded' },
  { type: 'end', label: 'End Flow', icon: CheckCircle2, color: 'bg-slate-800 text-white', desc: 'Workflow completion point' },
]

const SYSTEM_TEMPLATES = [
  {
    id: 'tpl_leave',
    name: 'Leave Request & Multi-Level Approval',
    category: 'LEAVE',
    trigger: 'Leave Submitted',
    description: 'Auto-routes leave applications to Line Manager. Requests exceeding 5 days trigger secondary HR Director signoff and auto-sync to Organization Calendar.',
    version: '2.1',
    executionsCount: 142,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Employee Submits Leave', config: { event: 'leave.created' } },
      { id: 'n2', type: 'condition', title: 'Check Duration > 5 Days?', config: { field: 'duration_days', operator: '>', value: '5' } },
      { id: 'n3', type: 'approval', title: 'Line Manager Signoff', config: { approver: 'Line Manager', timeout_hours: 24 } },
      { id: 'n4', type: 'approval', title: 'HR Director Signoff', config: { approver: 'HR Director', timeout_hours: 48 } },
      { id: 'n5', type: 'ai_action', title: 'AI Overlap & Capacity Check', config: { prompt: 'Analyze department coverage during requested leave dates' } },
      { id: 'n6', type: 'notification', title: 'Send Approval Confirmation & Sync Calendar', config: { channels: ['Email', 'In-App', 'Teams'] } },
      { id: 'n7', type: 'end', title: 'Complete Workflow', config: {} },
    ],
  },
  {
    id: 'tpl_onboarding',
    name: 'Employee Onboarding & Asset Provisioning',
    category: 'ONBOARDING',
    trigger: 'Employee Created',
    description: 'Triggers upon new hire record creation. Auto-assigns IT equipment tasks, generates employment contract, creates email credentials, and notifies buddy mentor.',
    version: '1.4',
    executionsCount: 89,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: New Employee Created', config: { event: 'employee.created' } },
      { id: 'n2', type: 'doc_gen', title: 'Generate Contract & NDA Package', config: { template: 'Employment Agreement 2026' } },
      { id: 'n3', type: 'task', title: 'IT Dept: Provision Laptop & Credentials', config: { assignee: 'IT Support Team', due_days: 2 } },
      { id: 'n4', type: 'task', title: 'Assign Onboarding Peer Buddy', config: { assignee: 'Department Lead', due_days: 1 } },
      { id: 'n5', type: 'notification', title: 'Send Welcome Packet & Credentials via SMS/Email', config: { channels: ['Email', 'SMS'] } },
      { id: 'n6', type: 'end', title: 'Onboarding Activated', config: {} },
    ],
  },
  {
    id: 'tpl_recruitment',
    name: 'Recruitment Pipeline & Offer Letter Engine',
    category: 'RECRUITMENT',
    trigger: 'Candidate Offer Approved',
    description: 'Generates customized offer letters using AI, routes to CFO for salary verification, sends digital e-signature link, and updates ATS candidate status.',
    version: '3.0',
    executionsCount: 64,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Candidate Moves to Offer Stage', config: { event: 'candidate.offer_stage' } },
      { id: 'n2', type: 'ai_action', title: 'AI Compensation & Market Benchmark Check', config: { prompt: 'Verify salary band compliance' } },
      { id: 'n3', type: 'approval', title: 'CFO Compensation Approval', config: { approver: 'CFO Office', timeout_hours: 24 } },
      { id: 'n4', type: 'doc_gen', title: 'Auto-Generate Formatted Offer Contract', config: { template: 'Official Offer Letter' } },
      { id: 'n5', type: 'notification', title: 'Dispatch Offer via e-Sign Portal', config: { channels: ['Email', 'WhatsApp'] } },
      { id: 'n6', type: 'end', title: 'Offer Dispatched', config: {} },
    ],
  },
  {
    id: 'tpl_payroll',
    name: 'Monthly Payroll Multi-Director Signoff',
    category: 'EXPENSE',
    trigger: 'Payroll Generated',
    description: 'Executes automated audits on overtime hours, tax withholdings, and bank balances before requiring sequential Finance Lead & CEO signoffs.',
    version: '2.0',
    executionsCount: 24,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Monthly Payroll Calculation Run', config: { event: 'payroll.generated' } },
      { id: 'n2', type: 'ai_action', title: 'AI Payroll Variance & Overtime Audit', config: { prompt: 'Detect salary discrepancies exceeding 3%' } },
      { id: 'n3', type: 'approval', title: 'Finance Director Signoff', config: { approver: 'Finance Director' } },
      { id: 'n4', type: 'approval', title: 'CEO Final Disbursal Approval', config: { approver: 'CEO' } },
      { id: 'n5', type: 'webhook', title: 'Execute Direct Bank Disbursal API', config: { url: 'https://api.banking.internal/v1/disburse' } },
      { id: 'n6', type: 'doc_gen', title: 'Generate & Email Employee Payslips', config: { template: 'Monthly Payslip PDF' } },
      { id: 'n7', type: 'end', title: 'Payroll Disbursed', config: {} },
    ],
  },
  {
    id: 'tpl_offboarding',
    name: 'Offboarding & Clearance Matrix',
    category: 'OFFBOARDING',
    trigger: 'Employee Separation Initiated',
    description: 'Automates asset return checklist, revokes system access rights, calculates final settlement pay, and conducts automated exit survey.',
    version: '1.2',
    executionsCount: 19,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Resignation / Separation Notice', config: { event: 'employee.offboarding' } },
      { id: 'n2', type: 'task', title: 'IT Dept: Revoke System Permissions & Tokens', config: { assignee: 'Security Admin' } },
      { id: 'n3', type: 'task', title: 'Asset Mgmt: Collect Laptop, Keys & Badges', config: { assignee: 'Facilities Team' } },
      { id: 'n4', type: 'script', title: 'Calculate Final Dues & Severance Pay', config: { script: 'calculate_final_settlement()' } },
      { id: 'n5', type: 'notification', title: 'Send Exit Survey & Experience Certificate', config: { channels: ['Email'] } },
      { id: 'n6', type: 'end', title: 'Offboarding Completed', config: {} },
    ],
  },
  {
    id: 'tpl_promotion',
    name: 'Promotion & Salary Adjustment Review',
    category: 'APPROVAL',
    trigger: 'Promotion Recommended',
    description: 'Validates 24-month tenure and performance rating (>4.5) using AI rules before routing to Department Head and HR Compensation Committee.',
    version: '1.8',
    executionsCount: 31,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Manager Recommends Promotion', config: { event: 'performance.promotion_request' } },
      { id: 'n2', type: 'condition', title: 'Tenure > 12 Months & Rating > 4.2?', config: { field: 'performance_score', operator: '>', value: '4.2' } },
      { id: 'n3', type: 'approval', title: 'Department Head Approval', config: { approver: 'Department VP' } },
      { id: 'n4', type: 'approval', title: 'HR Compensation Committee Signoff', config: { approver: 'Comp Committee' } },
      { id: 'n5', type: 'doc_gen', title: 'Generate Promotion Letter & Salary Update', config: { template: 'Promotion Certificate' } },
      { id: 'n6', type: 'end', title: 'Promotion Granted', config: {} },
    ],
  },
  {
    id: 'tpl_expense',
    name: 'Expense Claim & AI Receipt Audit',
    category: 'EXPENSE',
    trigger: 'Expense Claim Submitted',
    description: 'AI OCR scans uploaded receipts for tax validity and duplicate entries. Claims under $200 are auto-approved; higher amounts route to Manager.',
    version: '2.4',
    executionsCount: 210,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Employee Submits Expense Claim', config: { event: 'expense.submitted' } },
      { id: 'n2', type: 'ai_action', title: 'AI OCR Receipt Audit & Fraud Check', config: { prompt: 'Verify receipt date, VAT number, and total math' } },
      { id: 'n3', type: 'condition', title: 'Claim Amount <= $200?', config: { field: 'amount', operator: '<=', value: '200' } },
      { id: 'n4', type: 'approval', title: 'Manager Expense Approval', config: { approver: 'Line Manager' } },
      { id: 'n5', type: 'webhook', title: 'Post Expense Record to QuickBooks', config: { url: 'https://api.quickbooks.com/v3/expenses' } },
      { id: 'n6', type: 'end', title: 'Expense Reimbursed', config: {} },
    ],
  },
  {
    id: 'tpl_attendance',
    name: 'Attendance Anomaly & Warning Trigger',
    category: 'APPROVAL',
    trigger: 'Attendance Exception Logged',
    description: 'Monitors unexcused absences and late check-ins. If 3 violations occur within 30 days, auto-generates formal warning letter and notifies HR.',
    version: '1.5',
    executionsCount: 47,
    nodes: [
      { id: 'n1', type: 'start', title: 'Trigger: Late Check-in / Missing Clock Out', config: { event: 'attendance.exception' } },
      { id: 'n2', type: 'condition', title: 'Violations in 30 Days >= 3?', config: { field: 'exception_count', operator: '>=', value: '3' } },
      { id: 'n3', type: 'doc_gen', title: 'Generate Formal Attendance Warning Letter', config: { template: 'Warning Letter' } },
      { id: 'n4', type: 'notification', title: 'Alert Employee & Line Manager', config: { channels: ['Email', 'In-App'] } },
      { id: 'n5', type: 'end', title: 'Anomaly Logged', config: {} },
    ],
  },
]

export default function WorkflowBuilder() {
  const { profile } = useAuth()
  const { success, error, info, warning } = useNotifications()
  const [activeTab, setActiveTab] = useState('designer')
  const [loading, setLoading] = useState(true)

  // Canvas / Designer state
  const [selectedTemplate, setSelectedTemplate] = useState(SYSTEM_TEMPLATES[0])
  const [designerNodes, setDesignerNodes] = useState(SYSTEM_TEMPLATES[0].nodes)
  const [selectedNodeId, setSelectedNodeId] = useState('n1')
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [activeSimNodeId, setActiveSimNodeId] = useState(null)
  const [simLogs, setSimLogs] = useState([])

  // Executions & Approvals state
  const [executions, setExecutions] = useState([
    {
      id: 'exec_901',
      template_name: 'Leave Request & Multi-Level Approval',
      category: 'LEAVE',
      initiated_by: 'Elena Rostova (Engineering)',
      started_at: '2026-07-31 10:14:22',
      status: 'IN_PROGRESS',
      current_step: 'HR Director Signoff',
      duration: '4h 12m',
      logs: [
        { time: '10:14:22', step: 'Start Trigger', msg: 'Leave application received for 7 days (Annual Leave)' },
        { time: '10:14:25', step: 'Duration Check', msg: 'Condition evaluated: 7 days > 5 days -> TRUE. Routing to HR Director.' },
        { time: '10:15:00', step: 'Line Manager Signoff', msg: 'Approved by Marcus Vance (Engineering Lead)' },
        { time: '10:15:02', step: 'HR Director Signoff', msg: 'Pending review by Sarah Jenkins (HR Director)' },
      ],
    },
    {
      id: 'exec_902',
      template_name: 'Employee Onboarding & Asset Provisioning',
      category: 'ONBOARDING',
      initiated_by: 'Lucas Vance (Junior Developer)',
      started_at: '2026-07-30 14:00:00',
      status: 'COMPLETED',
      current_step: 'Onboarding Activated',
      duration: '1h 45m',
      logs: [
        { time: '14:00:00', step: 'New Employee Created', msg: 'Employee record #149 inserted into Database' },
        { time: '14:00:05', step: 'Generate Contract', msg: 'Employment Agreement PDF rendered & saved to Storage' },
        { time: '14:30:00', step: 'IT Provisioning', msg: 'MacBook Pro & Slack credentials provisioned' },
        { time: '15:45:00', step: 'Welcome Email Sent', msg: 'Welcome email dispatched successfully' },
      ],
    },
    {
      id: 'exec_903',
      template_name: 'Expense Claim & AI Receipt Audit',
      category: 'EXPENSE',
      initiated_by: 'David Kim (Sales)',
      started_at: '2026-07-31 08:30:00',
      status: 'FAILED',
      current_step: 'QuickBooks API Webhook',
      duration: '12m',
      logs: [
        { time: '08:30:00', step: 'Claim Submitted', msg: 'Expense claim #EX-8821 for $450.00 submitted' },
        { time: '08:30:04', step: 'AI OCR Receipt Audit', msg: 'Receipt math verified. VAT ID: GB9928172' },
        { time: '08:42:00', step: 'QuickBooks API Webhook', msg: 'HTTP 502 Bad Gateway response from QuickBooks API' },
      ],
    },
  ])

  // Triggers & Rules state
  const [businessRules, setBusinessRules] = useState([
    { id: 'rule_1', name: 'Executive Overtime Escalation', trigger: 'Attendance Exception', condition: 'Overtime > 20 Hours', action: 'Require CEO Notification', status: 'ACTIVE' },
    { id: 'rule_2', name: 'High Value Expense Routing', trigger: 'Expense Claim Submitted', condition: 'Amount > $5,000', action: 'Require CFO Signoff', status: 'ACTIVE' },
    { id: 'rule_3', name: 'Probation Completion Auto-Task', trigger: 'Tenure == 90 Days', condition: 'Rating >= 4.0', action: 'Generate Confirmation Letter', status: 'ACTIVE' },
  ])

  // Integrations state
  const [connectors, setConnectors] = useState([
    { name: 'Microsoft Teams', type: 'Messaging', status: 'Connected', events: 'Approvals, System Alerts', icon: MessageSquare },
    { name: 'Slack Workspace', type: 'Messaging', status: 'Connected', events: 'Leave Alerts, Hires', icon: Globe },
    { name: 'Google Workspace', type: 'Identity & Cal', status: 'Connected', events: 'Calendar Sync, Gmail', icon: Mail },
    { name: 'WhatsApp Business API', type: 'SMS / Direct', status: 'Connected', events: 'Urgent OTP & Signoffs', icon: Send },
    { name: 'QuickBooks Online', type: 'Accounting / ERP', status: 'Connected', events: 'Payroll & Expenses', icon: Database },
    { name: 'Twilio SMS Gateway', type: 'Telephony', status: 'Standby', events: 'SMS Notifications', icon: Zap },
  ])

  // Modal controls
  const [modalType, setModalType] = useState(null)
  const [newRule, setNewRule] = useState({ name: '', trigger: 'Leave Submitted', condition: '', action: '' })

  useEffect(() => {
    // Initial data load simulation
    setLoading(false)
  }, [])

  // Canvas Node Operations
  function handleAddNode(typeConfig) {
    const newNode = {
      id: 'n_' + Date.now().toString().slice(-4),
      type: typeConfig.type,
      title: `${typeConfig.label}`,
      config: { note: 'Configured by User' },
    }
    setDesignerNodes(prev => [...prev, newNode])
    setSelectedNodeId(newNode.id)
    success(`Added ${typeConfig.label} to visual canvas`)
  }

  function handleDeleteNode(id) {
    if (designerNodes.length <= 2) {
      warning('A workflow requires at least a Start and End node')
      return
    }
    setDesignerNodes(prev => prev.filter(n => n.id !== id))
    if (selectedNodeId === id) setSelectedNodeId(designerNodes[0]?.id || null)
    info('Node removed from canvas')
  }

  function handleMoveNode(index, direction) {
    const newIdx = index + direction
    if (newIdx < 0 || newIdx >= designerNodes.length) return
    const updated = [...designerNodes]
    const temp = updated[index]
    updated[index] = updated[newIdx]
    updated[newIdx] = temp
    setDesignerNodes(updated)
  }

  function handleUpdateSelectedNodeTitle(title) {
    setDesignerNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, title } : n))
  }

  // Live Simulation Trigger
  function runSimulation() {
    if (simulationRunning) return
    setSimulationRunning(true)
    setSimLogs([])
    success('Starting visual execution simulation...')

    designerNodes.forEach((node, idx) => {
      setTimeout(() => {
        setActiveSimNodeId(node.id)
        setSimLogs(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            nodeTitle: node.title,
            nodeType: node.type.toUpperCase(),
            status: 'EXECUTED_SUCCESS',
            detail: `Evaluated step ${idx + 1} of ${designerNodes.length}: ${node.title}`,
          },
        ])

        if (idx === designerNodes.length - 1) {
          setTimeout(() => {
            setSimulationRunning(false)
            setActiveSimNodeId(null)
            success('Workflow execution completed successfully with 0 errors!')
          }, 600)
        }
      }, (idx + 1) * 900)
    })
  }

  function handleLoadTemplate(tpl) {
    setSelectedTemplate(tpl)
    setDesignerNodes(tpl.nodes)
    setSelectedNodeId(tpl.nodes[0]?.id)
    setActiveTab('designer')
    success(`Loaded template: "${tpl.name}" into visual designer`)
  }

  const selectedNode = designerNodes.find(n => n.id === selectedNodeId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Automation & Process Engine"
        description="Enterprise visual workflow builder, trigger matrix, multi-level approval engine, document generators, and automated business process orchestrator."
        icon={Workflow}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setModalType('create_template')} className="btn-secondary text-xs">
              <Upload size={14} className="mr-1" /> Import Workflow JSON
            </button>
            <button onClick={() => runSimulation()} disabled={simulationRunning} className="btn-primary text-xs flex items-center gap-1.5">
              {simulationRunning ? <Spinner size="sm" /> : <Play size={14} />}
              <span>{simulationRunning ? 'Simulating Flow...' : 'Test Execution Flow'}</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard icon={GitBranch} label="Active Workflows" value="16 Templates" color="indigo" />
        <StatCard icon={Play} label="Executions / Mo" value="1,842 Runs" color="blue" />
        <StatCard icon={CheckCircle2} label="Success Rate" value="99.4%" color="green" />
        <StatCard icon={Zap} label="Hours Saved" value="1,420 hrs/mo" color="purple" />
        <StatCard icon={Clock} label="Pending Approvals" value="4 Waiting" color="yellow" />
      </div>

      <div className="overflow-x-auto pb-1">
        <Tabs tabs={MAIN_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 1: VISUAL WORKFLOW DESIGNER & CANVAS
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'designer' && (
        <div className="space-y-4">
          {/* Active Template Switcher Bar */}
          <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Workflow size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedTemplate?.name}
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold">v{selectedTemplate?.version || '1.0'} Live</span>
                </h3>
                <p className="text-xs text-slate-500">Trigger: <strong>{selectedTemplate?.trigger}</strong> • {designerNodes.length} Step Nodes Configured</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={runSimulation} disabled={simulationRunning} className="btn-secondary text-xs">
                <Play size={14} className="mr-1 text-emerald-600" /> Run Simulation
              </button>
              <button onClick={() => success('Workflow published as v2.2 to production queue')} className="btn-primary text-xs">
                <CheckCircle size={14} className="mr-1" /> Publish Workflow
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: Drag/Add Node Library */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus size={14} className="text-indigo-600" /> Add Step Node to Flow
                </h3>
                <p className="text-[11px] text-slate-500">Click any step type below to append it to the visual canvas.</p>

                <div className="space-y-1.5 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
                  {NODE_TYPES.map((nt, idx) => {
                    const Icon = nt.icon
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddNode(nt)}
                        className="w-full text-left p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer group flex items-center gap-2.5"
                      >
                        <div className={`h-7 w-7 rounded-xl ${nt.color} flex items-center justify-center shrink-0 shadow-xs`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                            {nt.label}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{nt.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Middle Column: Interactive Visual Node Tree Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6 bg-slate-900/5 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl relative min-h-[580px] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity size={14} className="text-indigo-500" /> Interactive Execution Sequence Canvas
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Total Steps: {designerNodes.length}</span>
                </div>

                {/* Node Canvas Sequence */}
                <div className="py-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar px-2">
                  {designerNodes.map((node, index) => {
                    const nodeTypeInfo = NODE_TYPES.find(t => t.type === node.type) || NODE_TYPES[0]
                    const Icon = nodeTypeInfo.icon
                    const isSelected = node.id === selectedNodeId
                    const isSimulating = node.id === activeSimNodeId

                    return (
                      <div key={node.id} className="relative flex flex-col items-center">
                        {/* Connecting Arrow Line */}
                        {index > 0 && (
                          <div className="h-6 w-0.5 bg-indigo-300 dark:bg-indigo-800 my-1 flex items-center justify-center">
                            <ChevronDown size={14} className="text-indigo-500 -mb-2" />
                          </div>
                        )}

                        {/* Node Card */}
                        <div
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`w-full p-4 rounded-2xl border transition-all cursor-pointer relative ${
                            isSimulating
                              ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 shadow-lg ring-2 ring-amber-400 animate-pulse'
                              : isSelected
                              ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[10px] font-mono font-bold text-slate-400">Step {index + 1}</span>
                              <div className={`h-8 w-8 rounded-xl ${nodeTypeInfo.color} flex items-center justify-center shrink-0 shadow-xs`}>
                                <Icon size={16} />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{node.title}</h4>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{nodeTypeInfo.label}</span>
                              </div>
                            </div>

                            {/* Node Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveNode(index, -1) }}
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                title="Move Step Up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveNode(index, 1) }}
                                disabled={index === designerNodes.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                title="Move Step Down"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id) }}
                                className="p-1 text-slate-400 hover:text-red-600"
                                title="Delete Step"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Live Simulation Output Terminal Footer */}
                {simLogs.length > 0 && (
                  <div className="mt-4 p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] border border-slate-800 space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      <Terminal size={12} /> Execution Simulator Telemetry Output
                    </div>
                    {simLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-slate-400">[{log.time}]</span>
                        <span className="text-indigo-300 font-bold">{log.nodeTitle}</span>
                        <span className="text-emerald-400">{log.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Node Inspector & Configuration Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-indigo-600" /> Step Inspector & Config
                </h3>

                {selectedNode ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="label text-xs font-medium">Step Title</label>
                      <input
                        type="text"
                        value={selectedNode.title}
                        onChange={(e) => handleUpdateSelectedNodeTitle(e.target.value)}
                        className="input text-xs w-full"
                      />
                    </div>

                    <div>
                      <label className="label text-xs font-medium">Node Classification</label>
                      <input
                        type="text"
                        disabled
                        value={selectedNode.type.toUpperCase()}
                        className="input text-xs w-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-500"
                      />
                    </div>

                    {selectedNode.type === 'approval' && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="label text-xs font-medium">Approver Role Target</label>
                          <select className="input text-xs w-full">
                            <option value="Line Manager">Direct Line Manager</option>
                            <option value="HR Director">HR Director</option>
                            <option value="Finance Lead">Finance Lead / CFO</option>
                            <option value="Department VP">Department VP</option>
                          </select>
                        </div>
                        <div>
                          <label className="label text-xs font-medium">SLA Timeout (Hours)</label>
                          <input type="number" defaultValue={24} className="input text-xs w-full" />
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'ai_action' && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="label text-xs font-medium">AI Prompt Instruction</label>
                          <textarea
                            rows={3}
                            defaultValue={selectedNode.config?.prompt || 'Perform intelligent audit on payload'}
                            className="input text-xs w-full leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'condition' && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="label text-xs font-medium">Evaluated Field</label>
                          <input type="text" defaultValue="leave_duration_days" className="input text-xs w-full font-mono" />
                        </div>
                        <div>
                          <label className="label text-xs font-medium">Operator</label>
                          <select className="input text-xs w-full">
                            <option value=">">Greater Than (&gt;)</option>
                            <option value="<">Less Than (&lt;)</option>
                            <option value="==">Equals (==)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                      <span>Node ID: <strong className="font-mono">{selectedNode.id}</strong></span>
                      <span className="text-emerald-600 font-bold">Validated OK</span>
                    </div>
                  </div>
                ) : (
                  <EmptyState icon={Sliders} title="No Node Selected" description="Click any step on the canvas to inspect and edit parameters." />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 2: TEMPLATE LIBRARY
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise Workflow Templates</h3>
              <p className="text-xs text-slate-500">16 Pre-configured workflow blueprints supporting HR, Payroll, Talent, and Operations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYSTEM_TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col justify-between hover:shadow-md transition space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                      {tpl.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">v{tpl.version}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tpl.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{tpl.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Trigger: <strong>{tpl.trigger}</strong></span>
                    <span>{tpl.executionsCount} Runs</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadTemplate(tpl)}
                      className="w-full py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit3 size={14} /> Open in Designer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 3: TRIGGERS & BUSINESS RULES ENGINE
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'triggers_rules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Events Trigger Catalog */}
            <div className="lg:col-span-1 card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={16} className="text-amber-500" /> Supported System Triggers
              </h3>
              <p className="text-xs text-slate-500">Every event inside StaffRoom fires payload telemetry to the workflow engine.</p>

              <div className="space-y-2 text-xs">
                {['employee.created', 'leave.submitted', 'payroll.generated', 'candidate.applied', 'attendance.exception', 'contract.expiring'].map((evt, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{evt}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Rules Matrix */}
            <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders size={16} className="text-indigo-600" /> Dynamic Business Rule Engine
                  </h3>
                  <p className="text-xs text-slate-500">Define custom IF / ELSE business policies without software deployment.</p>
                </div>
                <button onClick={() => setModalType('add_rule')} className="btn-primary text-xs">
                  <Plus size={14} className="mr-1" /> Add Rule
                </button>
              </div>

              <div className="space-y-3">
                {businessRules.map((rule) => (
                  <div key={rule.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rule.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {rule.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-mono space-y-1 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p><span className="text-indigo-600 font-bold">ON TRIGGER:</span> {rule.trigger}</p>
                      <p><span className="text-amber-600 font-bold">IF CONDITION:</span> {rule.condition}</p>
                      <p><span className="text-emerald-600 font-bold">THEN ACTION:</span> {rule.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 4: LIVE EXECUTIONS & TELEMETRY
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'executions' && (
        <div className="space-y-6">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" /> Real-time Execution Telemetry & Step Logs
            </h3>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Execution ID</th>
                    <th className="p-3">Workflow Template</th>
                    <th className="p-3">Initiated By</th>
                    <th className="p-3">Current Step</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {executions.map((exec) => (
                    <tr key={exec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{exec.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{exec.template_name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{exec.initiated_by}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{exec.current_step}</td>
                      <td className="p-3 text-slate-500">{exec.duration}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          exec.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : exec.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {exec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 5: APPROVAL ENGINE & TASKS
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'approvals' && (
        <ApprovalConfigEditor />
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 6: INTEGRATIONS & WEBHOOKS
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((c, i) => {
            const Icon = c.icon
            return (
              <div key={i} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Icon size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {c.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.type}</p>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Events: <strong>{c.events}</strong></p>
              </div>
            )
          })}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 7: ANALYTICS & ROI
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={Zap} label="Monthly Hours Saved" value="1,420 Hours" color="indigo" />
            <StatCard icon={DollarSign} label="Estimated ROI Savings" value="$42,500 / mo" color="green" />
            <StatCard icon={CheckCircle2} label="Automation Rate" value="94.2%" color="purple" />
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
       *  TAB 8: GOVERNANCE & VERSIONING
       * ────────────────────────────────────────────────────────────────── */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock size={16} className="text-emerald-500" /> Workflow Security & Versioning Controls
            </h3>
            <p className="text-xs text-slate-500">Full audit log of workflow updates, version comparisons, and RBAC permissions.</p>
          </div>
        </div>
      )}

      {/* Modal: Add Rule */}
      <Modal
        open={modalType === 'add_rule'}
        onClose={() => setModalType(null)}
        title="Create Custom Business Rule"
        size="sm"
        footer={
          <>
            <button onClick={() => setModalType(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => {
                if (!newRule.name) return
                setBusinessRules(prev => [...prev, { id: 'rule_' + Date.now(), ...newRule, status: 'ACTIVE' }])
                setModalType(null)
                success('Business rule added')
              }}
              className="btn-primary"
            >
              Add Rule
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="label">Rule Name</label>
            <input type="text" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} className="input w-full" placeholder="e.g. VIP Client Fast-Track" />
          </div>
          <div>
            <label className="label">Trigger</label>
            <select value={newRule.trigger} onChange={e => setNewRule({ ...newRule, trigger: e.target.value })} className="input w-full">
              <option value="Leave Submitted">Leave Submitted</option>
              <option value="Expense Claim Submitted">Expense Claim Submitted</option>
              <option value="Attendance Exception">Attendance Exception</option>
            </select>
          </div>
          <div>
            <label className="label">IF Condition</label>
            <input type="text" value={newRule.condition} onChange={e => setNewRule({ ...newRule, condition: e.target.value })} className="input w-full" placeholder="e.g. Amount > $10,000" />
          </div>
          <div>
            <label className="label">THEN Action</label>
            <input type="text" value={newRule.action} onChange={e => setNewRule({ ...newRule, action: e.target.value })} className="input w-full" placeholder="e.g. Require Board Signoff" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
