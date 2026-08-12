import React, { createContext, useContext, useState, useEffect } from 'react'

const KnowledgeContext = createContext(null)

const INITIAL_SPACES = [
  { id: 'SPC-ORG', name: 'Organization-Wide', icon: 'Globe', description: 'Company-wide policies, handbooks, code of conduct, and core values.', docCount: 14, access: 'All Staff' },
  { id: 'SPC-HR', name: 'HR & People Operations', icon: 'Users', description: 'Recruitment SOPs, onboarding handbooks, leave policies, and payroll guides.', docCount: 22, access: 'HR & Staff' },
  { id: 'SPC-FIN', name: 'Finance & Procurement', icon: 'DollarSign', description: 'Expense matrices, payment approval runbooks, procurement guidelines, tax guides.', docCount: 18, access: 'Finance & Managers' },
  { id: 'SPC-IT', name: 'IT, Cloud & Security Ops', icon: 'Shield', description: 'System runbooks, disaster recovery, incident response, access control procedures.', docCount: 29, access: 'IT & Security Team' },
  { id: 'SPC-CLIN', name: 'Clinical & Healthcare Ops', icon: 'Activity', description: 'Patient intake SOPs, medical triage workflows, sanitation checklists, emergency protocols.', docCount: 16, access: 'Medical Staff' },
  { id: 'SPC-GOV', name: 'Board & Governance', icon: 'Briefcase', description: 'Board charters, committee minutes, donor grant compliance, audit frameworks.', docCount: 12, access: 'Board & Executives' }
]

const INITIAL_DOCUMENTS = [
  {
    id: 'DOC-SOP-001',
    title: 'Standard Operating Procedure: Emergency Procurement & Expense Approval',
    spaceId: 'SPC-FIN',
    type: 'SOP',
    status: 'Published',
    version: 'v3.2',
    author: 'Sarah W. (Finance Lead)',
    department: 'Finance & Procurement',
    classification: 'Internal',
    effectiveDate: '2026-06-01',
    reviewDate: '2027-06-01',
    language: 'English (US)',
    views: 1420,
    tags: ['Procurement', 'Finance', 'Approval', 'Expenses'],
    description: 'Defines threshold rules, fast-track signatory workflows, and voucher posting steps for emergency capital purchases.',
    summary: 'Establishes clear authority limits for urgent operational procurement. Requisitions over KES 500,000 require dual approval from Finance Director and CFO within 4 hours.',
    contentBlocks: [
      { type: 'heading', level: 1, text: '1. Objective & Operational Scope' },
      { type: 'paragraph', text: 'This Standard Operating Procedure ensures that emergency operational requisitions are processed with strict audit compliance while bypassing standard multi-day vendor quotation cycles.' },
      { type: 'callout', variant: 'warning', title: 'Mandatory Compliance Requirement', text: 'All emergency vouchers must have attached photo evidence or vendor quotes within 48 hours post-dispatch.' },
      { type: 'heading', level: 2, text: '2. Approval Matrix & Dollar Thresholds' },
      {
        type: 'table',
        headers: ['Threshold Limit', 'Primary Approver', 'Secondary Approver', 'SLA Response'],
        rows: [
          ['Below KES 100,000', 'Line Manager', 'Not Required', '1 Hour'],
          ['KES 100,000 - KES 500,000', 'Department Head', 'Finance Director', '2 Hours'],
          ['Above KES 500,000', 'Finance Director', 'Chief Financial Officer (CFO)', '4 Hours']
        ]
      },
      { type: 'heading', level: 2, text: '3. Step-by-Step Execution Checklist' },
      {
        type: 'checklist',
        items: [
          { text: 'Verify emergency condition meets Fleet / Clinical threshold guidelines.', checked: true },
          { text: 'Submit requisition in StaffRoom Procurement Module tagged "EMERGENCY_DISPATCH".', checked: true },
          { text: 'Auto-notify Finance Director on mobile push & SMS.', checked: true },
          { text: 'Log payment reference voucher into Audit Vault.', checked: false }
        ]
      }
    ],
    approvals: [
      { role: 'Author', name: 'Sarah W.', status: 'Approved', date: '2026-05-28' },
      { role: 'Legal & Compliance', name: 'J. Mwangi (Legal)', status: 'Approved', date: '2026-05-29' },
      { role: 'Executive Approval', name: 'CFO Office', status: 'Approved', date: '2026-05-30' }
    ],
    history: [
      { version: 'v3.2', date: '2026-06-01', author: 'Sarah W.', change: 'Updated threshold upper limit to KES 500,000 as per Q2 Board resolution.' },
      { version: 'v3.1', date: '2026-01-15', author: 'Sarah W.', change: 'Added instant SMS alert trigger integration.' }
    ]
  },
  {
    id: 'DOC-POL-002',
    title: 'StaffRoom Employee Handbook & Remote Work Conduct Policy 2026',
    spaceId: 'SPC-ORG',
    type: 'Handbook',
    status: 'Published',
    version: 'v4.0',
    author: 'Chief HR Officer',
    department: 'People Operations',
    classification: 'Public',
    effectiveDate: '2026-01-01',
    reviewDate: '2027-01-01',
    language: 'English (US)',
    views: 3890,
    tags: ['HR', 'Handbook', 'Conduct', 'Remote Work', 'Benefits'],
    description: 'Comprehensive employment guidelines, leave entitlements, code of ethics, health safety, and hybrid work protocols.',
    summary: 'The official 2026 StaffRoom Employee Handbook outlining 21 days annual paid leave, probation protocols, medical coverage, and digital workplace security rules.',
    contentBlocks: [
      { type: 'heading', level: 1, text: 'Welcome to StaffRoom Enterprise' },
      { type: 'paragraph', text: 'Our mission is to foster an inclusive, high-trust digital workplace where every employee has the tools, clear guidelines, and empowerment to excel.' },
      { type: 'callout', variant: 'info', title: 'Key Leave Policy Note', text: 'Annual leave carries forward up to 5 unused days into the new financial year ending March 31st.' },
      { type: 'heading', level: 2, text: 'Core Employment Guarantees' },
      {
        type: 'checklist',
        items: [
          { text: 'Equal Opportunity & Anti-Harassment commitment.', checked: true },
          { text: 'Comprehensive inpatient/outpatient medical insurance coverage.', checked: true },
          { text: 'Continuous learning stipend ($500/year per employee).', checked: true }
        ]
      }
    ],
    approvals: [
      { role: 'Author', name: 'Chief HR Officer', status: 'Approved', date: '2025-12-15' },
      { role: 'Board Approval', name: 'Governance Committee', status: 'Approved', date: '2025-12-20' }
    ],
    history: [
      { version: 'v4.0', date: '2026-01-01', author: 'Chief HR Officer', change: 'Integrated Kenya Labor Act 2026 statutory amendments.' }
    ]
  },
  {
    id: 'DOC-RUN-003',
    title: 'IT Incident Response Runbook: Database Failover & Cyber Breach Contained',
    spaceId: 'SPC-IT',
    type: 'Runbook',
    status: 'Published',
    version: 'v2.1',
    author: 'Lead DevSecOps Engineer',
    department: 'IT & Security Ops',
    classification: 'Confidential',
    effectiveDate: '2026-04-10',
    reviewDate: '2026-10-10',
    language: 'English (US)',
    views: 890,
    tags: ['IT', 'Security', 'Disaster Recovery', 'Runbook'],
    description: 'Step-by-step technical recovery procedure for multi-region cloud database failover and DDoS isolation.',
    summary: 'P1 Emergency Incident Runbook. Outlines automated cloud cluster failover, IP quarantine, and key rotation procedures.',
    contentBlocks: [
      { type: 'heading', level: 1, text: 'P1 Emergency Incident Response Protocol' },
      { type: 'paragraph', text: 'When primary database connection latencies exceed 2000ms or unauthorized access attempts exceed 100/sec, execute this runbook immediately.' },
      { type: 'callout', variant: 'danger', title: 'Restricted Confidential Runbook', text: 'Do not share service account secret credentials outside the IT Security Operations channel.' },
      { type: 'code', code: '# Trigger automated secondary database cluster promote\ngcloud sql instances failover staffroom-prod-db --project=staffroom-cloud\n# Rotate active JWT access tokens\nnpm run security:rotate-keys' }
    ],
    approvals: [
      { role: 'Author', name: 'DevSecOps Lead', status: 'Approved', date: '2026-04-01' },
      { role: 'CTO Sign-off', name: 'Office of CTO', status: 'Approved', date: '2026-04-05' }
    ],
    history: [
      { version: 'v2.1', date: '2026-04-10', author: 'DevSecOps Lead', change: 'Added Cloud SQL zero-downtime failover step.' }
    ]
  }
]

const INITIAL_PROCESSES = [
  {
    id: 'PROC-01',
    name: 'New Employee Digital Onboarding Workflow',
    owner: 'HR Operations Lead',
    department: 'People Operations',
    kpi: 'Average onboarding completion: < 2.5 days',
    inputs: ['Signed Offer Letter', 'National ID / Passport', 'Tax PIN Certificate'],
    outputs: ['StaffRoom Account Created', 'Payroll Profile Active', 'Laptop Dispatched'],
    linkedPolicy: 'DOC-POL-002',
    steps: [
      { step: 1, title: 'Offer Letter Acceptance & Document Upload', role: 'Candidate / Employee' },
      { step: 2, title: 'Background Check & ID Verification', role: 'HR Operations' },
      { step: 3, title: 'StaffRoom System Provisioning & Email Setup', role: 'IT Support' },
      { step: 4, title: 'Welcome Session & Department Orientation', role: 'Line Manager' }
    ]
  },
  {
    id: 'PROC-02',
    name: 'Capital Purchase Requisition & Supplier Disbursement',
    owner: 'Procurement Specialist',
    department: 'Finance & Supply Chain',
    kpi: 'Invoice disbursement cycle: < 5 working days',
    inputs: ['Vendor 3-Way Quotations', 'Budget Line Item Code', 'Department Approval'],
    outputs: ['Purchase Order (PO)', 'Goods Received Note (GRN)', 'Bank Payment Voucher'],
    linkedPolicy: 'DOC-SOP-001',
    steps: [
      { step: 1, title: 'Create Purchase Requisition in Procurement Hub', role: 'Requester' },
      { step: 2, title: 'Budget Allocation Verification', role: 'Finance Analyst' },
      { step: 3, title: 'Executive Approval Matrix Evaluation', role: 'Department Head / CFO' },
      { step: 4, title: 'PO Generation & Supplier Dispatch', role: 'Procurement' }
    ]
  }
]

const INITIAL_TEMPLATES = [
  { id: 'TPL-01', name: 'Standard Employment Contract Template 2026', category: 'HR Contracts', downloads: 840, format: 'DOCX / PDF' },
  { id: 'TPL-02', name: 'Non-Disclosure Agreement (NDA) - Multi-Party', category: 'Legal Documents', downloads: 1250, format: 'PDF' },
  { id: 'TPL-03', name: 'Project Status & Steering Committee Report', category: 'Project Management', downloads: 610, format: 'PPTX / PDF' },
  { id: 'TPL-04', name: 'Quarterly Financial Variance & Audit Report', category: 'Finance', downloads: 490, format: 'XLSX / PDF' }
]

const INITIAL_MEETINGS = [
  {
    id: 'MTG-2026-12',
    title: 'Executive Committee Strategic Review & Q3 Policy Sign-Off',
    date: '2026-07-28',
    organizer: 'Chief Executive Officer',
    attendees: ['CEO', 'CFO', 'CHRO', 'CTO', 'Legal Counsel'],
    summary: 'Reviewed Q3 budget allocations, approved new Statutory Payroll Tax policy, and signed off on IT Security Disaster Recovery Runbook.',
    decisions: [
      'Approved KES 12M capital expenditure for regional branch expansion.',
      'Adopted mandatory zero-trust IT access controls effective August 15th.'
    ],
    actionItems: [
      { task: 'Update Emergency Procurement SOP threshold in Knowledge Center.', owner: 'Sarah W.', deadline: '2026-08-05', status: 'Completed' },
      { task: 'Schedule branch manager security training workshops.', owner: 'IT Security Lead', deadline: '2026-08-20', status: 'In Progress' }
    ]
  }
]

export function KnowledgeProvider({ children }) {
  const [spaces] = useState(INITIAL_SPACES)

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('staffroom_knowledge_docs')
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS
  })

  const [processes, setProcesses] = useState(() => {
    const saved = localStorage.getItem('staffroom_knowledge_processes')
    return saved ? JSON.parse(saved) : INITIAL_PROCESSES
  })

  const [templates] = useState(INITIAL_TEMPLATES)
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('staffroom_knowledge_meetings')
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS
  })

  const [auditLog, setAuditLog] = useState(() => {
    const saved = localStorage.getItem('staffroom_knowledge_audit')
    return saved ? JSON.parse(saved) : [
      { id: 'AUD-901', timestamp: '2026-07-29 11:20', docId: 'DOC-SOP-001', action: 'PUBLISHED', version: 'v3.2', user: 'Sarah W.', note: 'Published updated Emergency Procurement SOP.' },
      { id: 'AUD-900', timestamp: '2026-07-25 14:05', docId: 'DOC-POL-002', action: 'REVIEW_COMPLETED', version: 'v4.0', user: 'CHRO', note: 'Annual Employee Handbook review completed and ratified.' }
    ]
  })

  const [activeLanguage, setActiveLanguage] = useState('English')

  useEffect(() => {
    localStorage.setItem('staffroom_knowledge_docs', JSON.stringify(documents))
  }, [documents])

  useEffect(() => {
    localStorage.setItem('staffroom_knowledge_processes', JSON.stringify(processes))
  }, [processes])

  useEffect(() => {
    localStorage.setItem('staffroom_knowledge_meetings', JSON.stringify(meetings))
  }, [meetings])

  useEffect(() => {
    localStorage.setItem('staffroom_knowledge_audit', JSON.stringify(auditLog))
  }, [auditLog])

  const addDocument = (newDoc) => {
    const doc = {
      ...newDoc,
      id: newDoc.id || `DOC-CUST-${Date.now().toString().slice(-4)}`,
      views: 0,
      status: newDoc.status || 'Published',
      version: newDoc.version || 'v1.0',
      effectiveDate: newDoc.effectiveDate || new Date().toISOString().split('T')[0],
      history: [
        { version: 'v1.0', date: new Date().toISOString().split('T')[0], author: newDoc.author || 'Knowledge Author', change: 'Initial publication.' }
      ]
    }
    setDocuments((prev) => [doc, ...prev])

    setAuditLog((prev) => [
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString(),
        docId: doc.id,
        action: 'CREATED_DOC',
        version: doc.version,
        user: doc.author || 'System User',
        note: `Created and saved document '${doc.title}'.`
      },
      ...prev
    ])
    return doc
  }

  const updateDocumentStatus = (id, newStatus) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    )
    const target = documents.find((d) => d.id === id)
    if (target) {
      setAuditLog((prev) => [
        {
          id: `AUD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleString(),
          docId: id,
          action: 'STATUS_CHANGED',
          version: target.version,
          user: 'Knowledge Custodian',
          note: `Updated document lifecycle status to '${newStatus}'.`
        },
        ...prev
      ])
    }
  }

  const incrementViews = (id) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, views: d.views + 1 } : d))
    )
  }

  const addProcess = (proc) => {
    const newProc = {
      ...proc,
      id: `PROC-${Date.now().toString().slice(-4)}`
    }
    setProcesses((prev) => [newProc, ...prev])
  }

  const addMeeting = (mtg) => {
    const newMtg = {
      ...mtg,
      id: `MTG-${Date.now().toString().slice(-4)}`
    }
    setMeetings((prev) => [newMtg, ...prev])
  }

  return (
    <KnowledgeContext.Provider
      value={{
        spaces,
        documents,
        processes,
        templates,
        meetings,
        auditLog,
        activeLanguage,
        setActiveLanguage,
        addDocument,
        updateDocumentStatus,
        incrementViews,
        addProcess,
        addMeeting
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext)
  if (!context) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider')
  }
  return context
}
