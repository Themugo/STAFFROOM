import React, { createContext, useContext, useState, useEffect } from 'react'

const AutomationContext = createContext(null)

const INITIAL_FLOWS = [
  {
    id: 'FLOW-001',
    name: 'New Employee Digital Onboarding & Laptop Provisioning',
    category: 'HR & People Ops',
    trigger: 'Employee Hired (Recruitment ATS)',
    status: 'Active',
    version: 'v2.1',
    author: 'Chief HR Officer',
    lastRun: '2026-08-01 01:15',
    totalRuns: 142,
    successRate: '99.3%',
    timeSavedHours: 180,
    description: 'Triggers upon offer letter acceptance. Sends welcome kit via WhatsApp, generates employment contract PDF, dispatches IT equipment request, and schedules Day 1 orientation calendar event.',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Trigger: Candidate Status = Hired', detail: 'Event: ATS Offer Accepted' },
      { id: 'n2', type: 'action', label: 'Action: Generate Offer Letter PDF', detail: 'Template: DOCX Standard Contract 2026' },
      { id: 'n3', type: 'condition', label: 'Condition: Is Remote Employee?', detail: 'IF Department == Remote' },
      { id: 'n4', type: 'action', label: 'Action: Send Courier Dispatch Request', detail: 'Integration: Transport & Logistics API' },
      { id: 'n5', type: 'action', label: 'Action: Send Welcome SMS & WhatsApp', detail: 'Channel: Twilio / WhatsApp Business' },
      { id: 'n6', type: 'ai_action', label: 'AI Action: Generate Personalized Onboarding Plan', detail: 'Gemini 1.5 Flash' }
    ]
  },
  {
    id: 'FLOW-002',
    name: 'Emergency Expense Escalation & Dual CFO Sign-Off',
    category: 'Finance & Supply Chain',
    trigger: 'Expense Claim Submitted',
    status: 'Active',
    version: 'v1.4',
    author: 'Finance Lead',
    lastRun: '2026-07-31 16:40',
    totalRuns: 89,
    successRate: '100%',
    timeSavedHours: 120,
    description: 'Evaluates claim dollar thresholds. Requisitions > KES 500,000 trigger instant dual mobile push notifications to CFO and auto-generate an audit voucher.',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Trigger: Expense Requisition Created', detail: 'Event: Procurement Hub' },
      { id: 'n2', type: 'condition', label: 'Condition: Amount > KES 500,000?', detail: 'IF Amount >= 500000' },
      { id: 'n3', type: 'action', label: 'Action: Lock Budget Line Item', detail: 'System Action: Finance Vault' },
      { id: 'n4', type: 'action', label: 'Action: Send Executive Mobile Push & Email', detail: 'Approvers: Finance Director & CFO' },
      { id: 'n5', type: 'ai_action', label: 'AI Action: Duplicate & Anomaly Risk Score', detail: 'Fraud Prevention Model' }
    ]
  },
  {
    id: 'FLOW-003',
    name: 'Fleet Vehicle Service Alert & Fuel Voucher Release',
    category: 'Transport & Fleet',
    trigger: 'Vehicle Mileage Reached',
    status: 'Active',
    version: 'v3.0',
    author: 'Logistics Manager',
    lastRun: '2026-07-30 09:20',
    totalRuns: 210,
    successRate: '98.5%',
    timeSavedHours: 95,
    description: 'Monitors odometer telemetry. When mileage passes 10,000 KM threshold, locks non-essential dispatch, generates maintenance PO, and alerts head mechanic.',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Trigger: Mileage >= 10,000 KM', detail: 'Event: Vehicle Telemetry' },
      { id: 'n2', type: 'action', label: 'Action: Flag Vehicle Pending Maintenance', detail: 'Module: Fleet Management' },
      { id: 'n3', type: 'action', label: 'Action: Create Maintenance PO', detail: 'Module: Procurement' }
    ]
  }
]

const MARKETPLACE_TEMPLATES = [
  { id: 'TMP-01', title: 'Automated Leave Approval & Calendar Sync', category: 'HR', downloads: 1420, description: 'Auto-approves leave under 2 days for staff with clean leave balance and updates team Google/Outlook calendar.' },
  { id: 'TMP-02', title: 'Contract Renewal & 60-Day Expiry Escalation', category: 'Legal & HR', downloads: 980, description: 'Sends automated reminders to department heads 60, 30, and 15 days before employee contract expiry.' },
  { id: 'TMP-03', title: 'AI Fraud Detection & Invoice Matching', category: 'Finance', downloads: 2100, description: 'Extracts invoice metadata using AI vision, cross-references PO numbers, and flags budget variance above 5%.' },
  { id: 'TMP-04', title: 'Disaster Recovery Failover & Slack Alert', category: 'IT Ops', downloads: 750, description: 'Triggers when primary API error rate exceeds 2%, sends urgent Slack PagerDuty alert, and initiates standby database cluster.' }
]

const INITIAL_LOGS = [
  { id: 'LOG-991', timestamp: '2026-08-01 01:15:22', flowId: 'FLOW-001', flowName: 'New Employee Digital Onboarding', status: 'Success', duration: '1.2s', triggerBy: 'Event: ATS_OFFER_ACCEPTED' },
  { id: 'LOG-990', timestamp: '2026-07-31 16:40:05', flowId: 'FLOW-002', flowName: 'Emergency Expense Escalation', status: 'Success', duration: '0.8s', triggerBy: 'Event: EXPENSE_CREATED' },
  { id: 'LOG-989', timestamp: '2026-07-30 09:20:11', flowId: 'FLOW-003', flowName: 'Fleet Vehicle Service Alert', status: 'Success', duration: '1.5s', triggerBy: 'Event: ODOMETER_THRESHOLD' },
  { id: 'LOG-988', timestamp: '2026-07-29 14:10:00', flowId: 'FLOW-001', flowName: 'New Employee Digital Onboarding', status: 'Retried / Resolved', duration: '3.1s', triggerBy: 'Event: ATS_OFFER_ACCEPTED' }
]

export function AutomationProvider({ children }) {
  const [flows, setFlows] = useState(() => {
    const saved = localStorage.getItem('staffroom_automation_flows')
    return saved ? JSON.parse(saved) : INITIAL_FLOWS
  })

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('staffroom_automation_logs')
    return saved ? JSON.parse(saved) : INITIAL_LOGS
  })

  useEffect(() => {
    localStorage.setItem('staffroom_automation_flows', JSON.stringify(flows))
  }, [flows])

  useEffect(() => {
    localStorage.setItem('staffroom_automation_logs', JSON.stringify(logs))
  }, [logs])

  const addFlow = (newFlow) => {
    const created = {
      ...newFlow,
      id: newFlow.id || `FLOW-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      version: 'v1.0',
      author: newFlow.author || 'Automation Architect',
      lastRun: 'Never',
      totalRuns: 0,
      successRate: '100%',
      timeSavedHours: 0
    }
    setFlows((prev) => [created, ...prev])
    return created
  }

  const toggleFlowStatus = (id) => {
    setFlows((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: f.status === 'Active' ? 'Paused' : 'Active' } : f))
    )
  }

  const runSimulation = (flowId) => {
    const target = flows.find((f) => f.id === flowId)
    if (!target) return

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      flowId: target.id,
      flowName: target.name,
      status: 'Success',
      duration: `${(Math.random() * 1.5 + 0.3).toFixed(1)}s`,
      triggerBy: `Manual Test Run: ${target.trigger}`
    }

    setLogs((prev) => [newLog, ...prev])

    setFlows((prev) =>
      prev.map((f) =>
        f.id === flowId
          ? {
              ...f,
              lastRun: newLog.timestamp,
              totalRuns: f.totalRuns + 1,
              timeSavedHours: f.timeSavedHours + 2
            }
          : f
      )
    )
    return newLog
  }

  const installMarketplaceTemplate = (template) => {
    const newFlow = {
      name: template.title,
      category: template.category,
      trigger: 'Marketplace Automation Trigger',
      description: template.description,
      nodes: [
        { id: 'n1', type: 'trigger', label: `Trigger: ${template.title}`, detail: 'Marketplace Event' },
        { id: 'n2', type: 'condition', label: 'Condition: Standard Enterprise Rules', detail: 'IF Status == Valid' },
        { id: 'n3', type: 'action', label: 'Action: Notify Stakeholders & Update Record', detail: 'System Action' },
        { id: 'n4', type: 'ai_action', label: 'AI Action: Process & Audit', detail: 'Gemini Model' }
      ]
    }
    return addFlow(newFlow)
  }

  return (
    <AutomationContext.Provider
      value={{
        flows,
        logs,
        marketplaceTemplates: MARKETPLACE_TEMPLATES,
        addFlow,
        toggleFlowStatus,
        runSimulation,
        installMarketplaceTemplate
      }}
    >
      {children}
    </AutomationContext.Provider>
  )
}

export function useAutomation() {
  const context = useContext(AutomationContext)
  if (!context) {
    throw new Error('useAutomation must be used within an AutomationProvider')
  }
  return context
}
