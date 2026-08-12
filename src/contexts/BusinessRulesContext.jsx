import React, { createContext, useContext, useState, useEffect } from 'react'

const BusinessRulesContext = createContext(null)

const INITIAL_RULES = [
  {
    id: 'RULE-LV-001',
    name: 'Maximum Leave Carry Forward Cap',
    category: 'Leave',
    subCategory: 'Annual Leave',
    status: 'Active',
    version: 'v2.1',
    author: 'Chief HR Officer',
    lastUpdated: '2026-06-15',
    description: 'Enforces statutory cap on annual leave rollover into the new financial year.',
    triggerEvent: 'BEFORE_LEAVE_ROLLOVER',
    priority: 10,
    conditions: [
      { field: 'employee.type', operator: 'EQUALS', value: 'FULL_TIME' },
      { field: 'leave.unclaimedDays', operator: 'GREATER_THAN', value: 5 }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'CAP_VALUE', target: 'leave.carriedForwardDays', value: 5 },
      { type: 'SEND_NOTIFICATION', recipient: 'employee', template: 'LEAVE_FORFEIT_WARNING' }
    ],
    executionCount: 1420,
    conflictStatus: 'OK'
  },
  {
    id: 'RULE-AP-002',
    name: 'CFO Approval Requirement for High-Value Purchases',
    category: 'Procurement',
    subCategory: 'Financial Approvals',
    status: 'Active',
    version: 'v1.4',
    author: 'Finance Director',
    lastUpdated: '2026-07-01',
    description: 'Routes any purchase requisition or expense over KES 500,000 directly to the CFO for approval.',
    triggerEvent: 'ON_REQUISITION_SUBMIT',
    priority: 1,
    conditions: [
      { field: 'requisition.amount', operator: 'GREATER_THAN', value: 500000 },
      { field: 'requester.grade', operator: 'LESS_THAN', value: 'DIRECTOR' }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'REQUIRE_APPROVAL', role: 'CFO', sequence: 1 },
      { type: 'ADD_TAG', value: 'HIGH_VALUE_EXPENDITURE' }
    ],
    executionCount: 382,
    conflictStatus: 'OK'
  },
  {
    id: 'RULE-PR-003',
    name: 'Kenyan PAYE Tax & Statutory NHIF/NSSF Deduction Engine',
    category: 'Payroll',
    subCategory: 'Tax & Deductions',
    status: 'Active',
    version: 'v3.0',
    author: 'Payroll Manager',
    lastUpdated: '2026-07-20',
    description: 'Calculates progressive income tax rates (PAYE) according to Kenyan Revenue Authority 2026 guidelines.',
    triggerEvent: 'ON_PAYROLL_CALCULATION',
    priority: 5,
    conditions: [
      { field: 'employee.taxJurisdiction', operator: 'EQUALS', value: 'KENYA' }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'CALCULATE_FORMULA', target: 'payroll.payeTax', formula: 'PROGRESSIVE_TAX(taxableGross, [24000:10%, 8333:25%, 300000:30%])' },
      { type: 'DEDUCT_STATUTORY', target: 'payroll.nssf', formula: 'MIN(grossPay * 0.06, 2160)' }
    ],
    executionCount: 2840,
    conflictStatus: 'OK'
  },
  {
    id: 'RULE-TR-004',
    name: 'Emergency Ambulance & Fleet Priority Pass',
    category: 'Transport',
    subCategory: 'Fleet Dispatch',
    status: 'Active',
    version: 'v1.1',
    author: 'Fleet Director',
    lastUpdated: '2026-05-12',
    description: 'Bypasses standard multi-step supervisor approval when dispatching emergency medical vehicles.',
    triggerEvent: 'ON_VEHICLE_REQUEST',
    priority: 0,
    conditions: [
      { field: 'vehicle.type', operator: 'EQUALS', value: 'AMBULANCE' },
      { field: 'request.urgency', operator: 'EQUALS', value: 'EMERGENCY' }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'AUTO_APPROVE', reason: 'EMERGENCY_DISPATCH' },
      { type: 'SEND_NOTIFICATION', recipient: 'CONTROL_ROOM', template: 'EMERGENCY_FLEET_ALERT' }
    ],
    executionCount: 64,
    conflictStatus: 'OK'
  },
  {
    id: 'RULE-SEC-005',
    name: 'Geofenced Mobile Punch & IP Access Restriction',
    category: 'Security',
    subCategory: 'Access Control',
    status: 'Active',
    version: 'v2.0',
    author: 'IT Security Lead',
    lastUpdated: '2026-06-02',
    description: 'Blocks attendance punch-in if employee location is further than 200m from assigned branch GPS coordinates.',
    triggerEvent: 'ON_PUNCH_IN',
    priority: 2,
    conditions: [
      { field: 'punch.distanceFromBranchMeters', operator: 'GREATER_THAN', value: 200 },
      { field: 'employee.isRemoteWorker', operator: 'EQUALS', value: false }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'BLOCK_SUBMISSION', errorMessage: 'You are outside the permitted branch location radius.' },
      { type: 'LOG_AUDIT_ALERT', severity: 'MEDIUM' }
    ],
    executionCount: 910,
    conflictStatus: 'OK'
  },
  {
    id: 'RULE-HR-006',
    name: 'Probationary Period Leave Restriction',
    category: 'HR Policies',
    subCategory: 'Onboarding',
    status: 'Active',
    version: 'v1.0',
    author: 'HR Operations',
    lastUpdated: '2026-04-10',
    description: 'Restricts paid annual leave requests during the initial 90 days of probation.',
    triggerEvent: 'ON_LEAVE_APPLY',
    priority: 4,
    conditions: [
      { field: 'employee.tenureDays', operator: 'LESS_THAN', value: 90 },
      { field: 'leave.type', operator: 'EQUALS', value: 'ANNUAL' }
    ],
    logicalOperator: 'AND',
    actions: [
      { type: 'BLOCK_SUBMISSION', errorMessage: 'Annual paid leave is restricted during the 90-day probation period.' }
    ],
    executionCount: 112,
    conflictStatus: 'OK'
  }
]

const MARKETPLACE_TEMPLATES = [
  {
    id: 'TPL-KE-LV',
    name: 'Kenyan Employment Act 2026 Leave Policy',
    category: 'Leave Policies',
    region: 'Kenya',
    author: 'StaffRoom Compliance Pack',
    description: 'Pre-configured rules for 21 days paid annual leave, 7 days sick leave with full pay, 3 months maternity, and 2 weeks paternity leave.',
    rulesIncluded: 5,
    rating: '4.9/5',
    downloads: 1240
  },
  {
    id: 'TPL-KE-TAX',
    name: 'KRA Statutory Payroll & Relief Tax Pack',
    category: 'Payroll Policies',
    region: 'Kenya',
    author: 'StaffRoom Financials',
    description: 'Includes PAYE tax brackets, Personal Relief (KES 2,400/mo), Insurance Relief (15%), SHIF, NSSF Tier I & II, and Housing Levy rules.',
    rulesIncluded: 8,
    rating: '5.0/5',
    downloads: 3100
  },
  {
    id: 'TPL-NGO-GRANT',
    name: 'NGO Multi-Donor Grant Approval & Expenditure Matrix',
    category: 'Procurement Policies',
    region: 'Global NGO',
    author: 'Humanitarian Governance Team',
    description: 'Multi-level approval thresholds for USAID, EU, and UN grant compliance, requiring dual signatories above $10,000.',
    rulesIncluded: 6,
    rating: '4.8/5',
    downloads: 850
  },
  {
    id: 'TPL-HOSP-SHIFT',
    name: 'Hospital Medical Staff Night Allowance & Shift Relief',
    category: 'Healthcare Policies',
    region: 'Healthcare / Clinical',
    author: 'Clinical Operations Lead',
    description: 'Auto-calculates night duty allowances, mandatory 11-hour rest periods between consecutive clinical shifts, and emergency locum rates.',
    rulesIncluded: 4,
    rating: '4.9/5',
    downloads: 620
  }
]

export function BusinessRulesProvider({ children }) {
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('staffroom_business_rules')
    return saved ? JSON.parse(saved) : INITIAL_RULES
  })

  const [auditLog, setAuditLog] = useState(() => {
    const saved = localStorage.getItem('staffroom_rules_audit')
    return saved ? JSON.parse(saved) : [
      {
        id: 'LOG-101',
        timestamp: '2026-07-28 14:32',
        ruleId: 'RULE-AP-002',
        ruleName: 'CFO Approval Requirement for High-Value Purchases',
        action: 'PUBLISHED',
        version: 'v1.4',
        user: 'Finance Director (John Doe)',
        reason: 'Adjusted approval threshold to KES 500,000 per updated Q3 board approval matrix.'
      },
      {
        id: 'LOG-100',
        timestamp: '2026-07-20 09:15',
        ruleId: 'RULE-PR-003',
        ruleName: 'Kenyan PAYE Tax & Statutory NHIF/NSSF Deduction Engine',
        action: 'UPDATED',
        version: 'v3.0',
        user: 'Payroll Manager (Sarah W.)',
        reason: 'Updated NSSF Tier II upper cap limits as per gazetted statutory notice.'
      }
    ]
  })

  useEffect(() => {
    localStorage.setItem('staffroom_business_rules', JSON.stringify(rules))
  }, [rules])

  useEffect(() => {
    localStorage.setItem('staffroom_rules_audit', JSON.stringify(auditLog))
  }, [auditLog])

  const addRule = (newRule) => {
    const created = {
      ...newRule,
      id: newRule.id || `RULE-CUST-${Date.now().toString().slice(-4)}`,
      status: newRule.status || 'Draft',
      version: newRule.version || 'v1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      executionCount: 0,
      conflictStatus: 'OK'
    }
    setRules((prev) => [created, ...prev])

    // Log action
    setAuditLog((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        ruleId: created.id,
        ruleName: created.name,
        action: 'CREATED',
        version: created.version,
        user: 'System Admin',
        reason: 'New policy rule defined in Rule Studio.'
      },
      ...prev
    ])
    return created
  }

  const updateRule = (id, updatedFields) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = {
            ...r,
            ...updatedFields,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
          return updated
        }
        return r
      })
    )

    const targetRule = rules.find((r) => r.id === id)
    if (targetRule) {
      setAuditLog((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          ruleId: id,
          ruleName: targetRule.name,
          action: 'UPDATED',
          version: targetRule.version,
          user: 'System Admin',
          reason: 'Rule configuration modified.'
        },
        ...prev
      ])
    }
  }

  const toggleRuleStatus = (id) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'Active' ? 'Disabled' : 'Active'
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
  }

  const deleteRule = (id) => {
    const target = rules.find((r) => r.id === id)
    setRules((prev) => prev.filter((r) => r.id !== id))
    if (target) {
      setAuditLog((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          ruleId: id,
          ruleName: target.name,
          action: 'DELETED',
          version: target.version,
          user: 'System Admin',
          reason: 'Rule removed from system.'
        },
        ...prev
      ])
    }
  }

  const installTemplate = (template) => {
    const newRule = {
      id: `RULE-TPL-${Date.now().toString().slice(-4)}`,
      name: template.name,
      category: template.category.replace(' Policies', ''),
      subCategory: template.region || 'Standard Pack',
      status: 'Active',
      version: 'v1.0',
      author: template.author,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: template.description,
      triggerEvent: 'ON_POLICY_EVALUATION',
      priority: 5,
      conditions: [
        { field: 'policy.region', operator: 'EQUALS', value: template.region }
      ],
      logicalOperator: 'AND',
      actions: [
        { type: 'ENFORCE_TEMPLATE_POLICY', templateId: template.id }
      ],
      executionCount: 0,
      conflictStatus: 'OK'
    }

    setRules((prev) => [newRule, ...prev])
    setAuditLog((prev) => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        ruleId: newRule.id,
        ruleName: newRule.name,
        action: 'INSTALLED_FROM_MARKETPLACE',
        version: 'v1.0',
        user: 'System Admin',
        reason: `Installed pre-packaged template '${template.name}'.`
      },
      ...prev
    ])
  }

  return (
    <BusinessRulesContext.Provider
      value={{
        rules,
        auditLog,
        marketplaceTemplates: MARKETPLACE_TEMPLATES,
        addRule,
        updateRule,
        toggleRuleStatus,
        deleteRule,
        installTemplate
      }}
    >
      {children}
    </BusinessRulesContext.Provider>
  )
}

export function useBusinessRules() {
  const context = useContext(BusinessRulesContext)
  if (!context) {
    throw new Error('useBusinessRules must be used within a BusinessRulesProvider')
  }
  return context
}
