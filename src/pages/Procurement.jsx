import React, { useState, useMemo } from 'react'
import {
  ShoppingCart, ShoppingBag, FileText, Building2, Truck, ShieldCheck, CheckCircle2,
  AlertTriangle, Clock, Plus, Search, Filter, DollarSign, Award, Layers, Bot,
  Download, ChevronRight, Eye, Send, Check, X, Sparkles, FileCheck, Scale, Star,
  BarChart3, PieChart, Receipt, PackageCheck, AlertCircle, ArrowUpRight, Lock,
  RefreshCw, CheckSquare, Edit3, Trash2, Sliders, Users
} from 'lucide-react'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  EmptyState,
  Modal,
  SearchInput
} from '../components/ui'

// Mock Data Sets
const INITIAL_REQUESTS = [
  {
    id: 'PR-2026-089',
    title: 'High-Performance Developer Laptops (x10)',
    deptId: 'dept_eng',
    department: 'Engineering',
    category: 'Computers & Tech',
    requester: 'David Miller',
    items: [
      { name: 'MacBook Pro 16" M3 Max 64GB', qty: 10, unitCost: 3499, total: 34990 }
    ],
    totalCost: 34990,
    preferredVendor: 'Apple Enterprise Direct',
    budgetCode: 'ENG-CAPEX-2026-Q3',
    costCentre: 'CC-102-DEV',
    priority: 'HIGH',
    status: 'PENDING_APPROVAL',
    approvalStep: 'Finance Review',
    deliveryDate: '2026-08-15',
    justification: 'Required for new senior engineering cohort joining in August.',
    createdDate: '2026-07-28'
  },
  {
    id: 'PR-2026-088',
    title: 'AWS Cloud Reserved Instance Renewal',
    deptId: 'dept_eng',
    department: 'Engineering',
    category: 'Cloud Services',
    requester: 'Alex Rivers',
    items: [
      { name: '3-Year Savings Plan Commitment', qty: 1, unitCost: 45000, total: 45000 }
    ],
    totalCost: 45000,
    preferredVendor: 'Amazon Web Services Inc',
    budgetCode: 'ENG-OPEX-CLOUD',
    costCentre: 'CC-102-INFRA',
    priority: 'CRITICAL',
    status: 'APPROVED',
    approvalStep: 'Fully Approved',
    deliveryDate: '2026-08-01',
    justification: 'Locks in 38% compute cost discount for core infrastructure.',
    createdDate: '2026-07-25'
  },
  {
    id: 'PR-2026-085',
    title: 'Ergonomic Standing Desks & Chairs',
    deptId: 'dept_hr',
    department: 'People Operations',
    category: 'Furniture',
    requester: 'Sarah Jenkins',
    items: [
      { name: 'Electric Motorized Desk 60x30', qty: 15, unitCost: 650, total: 9750 },
      { name: 'Ergonomic Mesh Chair v2', qty: 15, unitCost: 420, total: 6300 }
    ],
    totalCost: 16050,
    preferredVendor: 'Herman Miller Commercial',
    budgetCode: 'HR-CAPEX-HQ',
    costCentre: 'CC-201-PEOPLE',
    priority: 'MEDIUM',
    status: 'ORDERED',
    approvalStep: 'PO Issued',
    deliveryDate: '2026-08-10',
    justification: 'HQ workplace wellness upgrade for floor 4.',
    createdDate: '2026-07-20'
  },
  {
    id: 'PR-2026-081',
    title: 'Annual Tax Compliance Audit Engagement',
    deptId: 'dept_fin',
    department: 'Finance & Accounting',
    category: 'Professional Services',
    requester: 'Michael Chen',
    items: [
      { name: 'KPMG Statutory Audit Retainer', qty: 1, unitCost: 28000, total: 28000 }
    ],
    totalCost: 28000,
    preferredVendor: 'KPMG Advisory LLP',
    budgetCode: 'FIN-AUDIT-2026',
    costCentre: 'CC-301-GOV',
    priority: 'HIGH',
    status: 'APPROVED',
    approvalStep: 'Fully Approved',
    deliveryDate: '2026-08-30',
    justification: 'Mandatory statutory audit and global tax filing compliance.',
    createdDate: '2026-07-18'
  },
]

const INITIAL_PURCHASE_ORDERS = [
  {
    poNumber: 'PO-2026-0042',
    prId: 'PR-2026-088',
    vendor: 'Amazon Web Services Inc',
    deptId: 'dept_eng',
    department: 'Engineering',
    totalAmount: 45000,
    status: 'ISSUED',
    paymentTerms: 'Net 30',
    deliveryTerms: 'Digital Delivery',
    issuedDate: '2026-07-26',
    matchStatus: 'MATCHED_OK'
  },
  {
    poNumber: 'PO-2026-0039',
    prId: 'PR-2026-085',
    vendor: 'Herman Miller Commercial',
    deptId: 'dept_hr',
    department: 'People Operations',
    totalAmount: 16050,
    status: 'PARTIALLY_DELIVERED',
    paymentTerms: 'Net 45',
    deliveryTerms: 'FOB Destination',
    issuedDate: '2026-07-22',
    matchStatus: 'PENDING_GR'
  },
  {
    poNumber: 'PO-2026-0035',
    prId: 'PR-2026-081',
    vendor: 'KPMG Advisory LLP',
    deptId: 'dept_fin',
    department: 'Finance & Accounting',
    totalAmount: 28000,
    status: 'ISSUED',
    paymentTerms: 'Milestone Payments',
    deliveryTerms: 'Professional Service SLA',
    issuedDate: '2026-07-20',
    matchStatus: 'MATCHED_OK'
  }
]

const INITIAL_VENDORS = [
  {
    id: 'v-101',
    name: 'Apple Enterprise Direct',
    category: 'Computers & Tech',
    rating: 4.9,
    status: 'PREFERRED',
    compliance: 'VERIFIED',
    contactPerson: 'Marcus Vance',
    email: 'm.vance@apple.com',
    spendYtd: 142000,
    contractsCount: 2,
    taxId: 'US-94-1238910',
    leadTimeDays: 5
  },
  {
    id: 'v-102',
    name: 'Amazon Web Services Inc',
    category: 'Cloud Services',
    rating: 4.8,
    status: 'PREFERRED',
    compliance: 'VERIFIED',
    contactPerson: 'Elena Rostova',
    email: 'aws-enterprise@amazon.com',
    spendYtd: 380000,
    contractsCount: 1,
    taxId: 'US-91-1652391',
    leadTimeDays: 1
  },
  {
    id: 'v-103',
    name: 'Herman Miller Commercial',
    category: 'Furniture',
    rating: 4.6,
    status: 'APPROVED',
    compliance: 'VERIFIED',
    contactPerson: 'David Miller',
    email: 'b2b@hermanmiller.com',
    spendYtd: 48000,
    contractsCount: 1,
    taxId: 'US-38-0921823',
    leadTimeDays: 14
  },
  {
    id: 'v-104',
    name: 'KPMG Advisory LLP',
    category: 'Professional Services',
    rating: 4.7,
    status: 'APPROVED',
    compliance: 'VERIFIED',
    contactPerson: 'Sarah Lin',
    email: 'partner@kpmg.com',
    spendYtd: 95000,
    contractsCount: 3,
    taxId: 'US-13-5591029',
    leadTimeDays: 3
  }
]

const INITIAL_RFQS = [
  {
    id: 'RFQ-2026-012',
    title: 'Global Cybersecurity Threat Monitoring SLA',
    deptId: 'dept_eng',
    department: 'Engineering',
    category: 'Security Software',
    estBudget: 75000,
    status: 'EVALUATING',
    responsesCount: 3,
    deadline: '2026-08-10',
    bidders: [
      { name: 'CrowdStrike Inc', score: 92, bid: 68000, techEval: 'Pass', status: 'RECOMMENDED' },
      { name: 'Palo Alto Networks', score: 88, bid: 72000, techEval: 'Pass', status: 'SHORTLISTED' },
      { name: 'SentinelOne Corp', score: 84, bid: 65000, techEval: 'Pass', status: 'EVALUATED' }
    ]
  },
  {
    id: 'RFP-2026-004',
    title: 'Enterprise AI Infrastructure Server Upgrade',
    deptId: 'dept_eng',
    department: 'Engineering',
    category: 'Computers & Tech',
    estBudget: 180000,
    status: 'OPEN_FOR_BIDS',
    responsesCount: 2,
    deadline: '2026-08-20',
    bidders: [
      { name: 'NVIDIA Enterprise', score: 95, bid: 175000, techEval: 'Exceptional', status: 'SUBMITTED' },
      { name: 'Dell Technologies', score: 89, bid: 162000, techEval: 'Pass', status: 'SUBMITTED' }
    ]
  }
]

const INITIAL_CONTRACTS = [
  {
    id: 'CTR-2026-09',
    vendor: 'Amazon Web Services Inc',
    title: 'Enterprise Compute & Cloud SLA',
    deptId: 'dept_eng',
    value: 380000,
    startDate: '2024-08-01',
    endDate: '2026-08-01',
    renewalStatus: 'ACTION_REQUIRED_EXPIRING_SOON',
    daysToExpiry: 1,
    autoRenew: false
  },
  {
    id: 'CTR-2025-14',
    vendor: 'Apple Enterprise Direct',
    title: 'Hardware Procurement Master Agreement',
    deptId: 'dept_eng',
    value: 200000,
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    renewalStatus: 'ACTIVE',
    daysToExpiry: 518,
    autoRenew: true
  }
]

export default function Procurement() {
  const {
    departments,
    activeDepartmentId,
    setActiveDepartmentId,
    userDepartment,
    filterByDepartment,
    isDepartmentScoped
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('overview') // overview, requests, orders, rfq_rfp, vendors, contracts, receiving, budgets, ai, analytics, audit
  const [searchQuery, setSearchQuery] = useState('')

  // Data State
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [orders, setOrders] = useState(INITIAL_PURCHASE_ORDERS)
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [rfqs, setRfqs] = useState(INITIAL_RFQS)
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS)

  // Modals & Form State
  const [modalMode, setModalMode] = useState(null) // 'new_pr', 'new_vendor', 'view_pr', 'match_invoice'
  const [selectedPr, setSelectedPr] = useState(null)

  const [prForm, setPrForm] = useState({
    title: '',
    category: 'Computers & Tech',
    priority: 'MEDIUM',
    preferredVendor: 'Apple Enterprise Direct',
    itemName: '',
    qty: 1,
    unitCost: 1000,
    justification: '',
    budgetCode: 'DEPT-CAPEX-2026',
    costCentre: 'CC-101-GEN'
  })

  // Filtered datasets based on Department Context
  const filteredRequests = useMemo(() => filterByDepartment(requests), [requests, activeDepartmentId])
  const filteredOrders = useMemo(() => filterByDepartment(orders), [orders, activeDepartmentId])
  const filteredContracts = useMemo(() => filterByDepartment(contracts), [contracts, activeDepartmentId])
  const filteredRfqs = useMemo(() => filterByDepartment(rfqs), [rfqs, activeDepartmentId])

  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  // Handlers
  const handleCreatePr = (e) => {
    e.preventDefault()
    if (!prForm.title || !prForm.itemName) return

    const totalCost = Number(prForm.qty) * Number(prForm.unitCost)
    const newPr = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: prForm.title,
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      department: currentDeptObj.name,
      category: prForm.category,
      requester: 'Current User',
      items: [{ name: prForm.itemName, qty: Number(prForm.qty), unitCost: Number(prForm.unitCost), total: totalCost }],
      totalCost,
      preferredVendor: prForm.preferredVendor,
      budgetCode: prForm.budgetCode,
      costCentre: prForm.costCentre,
      priority: prForm.priority,
      status: 'PENDING_APPROVAL',
      approvalStep: 'Supervisor Review',
      deliveryDate: '2026-08-25',
      justification: prForm.justification || 'Department operational request.',
      createdDate: new Date().toISOString().split('T')[0]
    }

    setRequests([newPr, ...requests])
    setModalMode(null)
    setPrForm({
      title: '',
      category: 'Computers & Tech',
      priority: 'MEDIUM',
      preferredVendor: 'Apple Enterprise Direct',
      itemName: '',
      qty: 1,
      unitCost: 1000,
      justification: '',
      budgetCode: 'DEPT-CAPEX-2026',
      costCentre: 'CC-101-GEN'
    })
    showSuccess(`Purchase Request ${newPr.id} submitted for approval!`)
  }

  const handleApprovePR = (prId) => {
    setRequests(requests.map((r) => {
      if (r.id === prId) {
        return { ...r, status: 'APPROVED', approvalStep: 'Fully Approved' }
      }
      return r
    }))

    // Auto generate Purchase Order for approved PR
    const prToPo = requests.find((r) => r.id === prId)
    if (prToPo) {
      const newPo = {
        poNumber: `PO-2026-00${Math.floor(50 + Math.random() * 40)}`,
        prId: prToPo.id,
        vendor: prToPo.preferredVendor,
        deptId: prToPo.deptId,
        department: prToPo.department,
        totalAmount: prToPo.totalCost,
        status: 'ISSUED',
        paymentTerms: 'Net 30',
        deliveryTerms: 'FOB Destination',
        issuedDate: new Date().toISOString().split('T')[0],
        matchStatus: 'MATCHED_OK'
      }
      setOrders([newPo, ...orders])
    }

    showSuccess(`PR ${prId} approved! Generated Purchase Order successfully.`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Procurement & Vendor OS"
        description={`Enterprise purchasing, RFQs, vendor performance, 3-way matching, and budget commitments for ${currentDeptObj.name}.`}
        icon={ShoppingCart}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode('new_pr')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> New Purchase Request
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Bot size={14} /> AI Spend Copilot
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Procurement Dashboard', icon: BarChart3 },
          { id: 'requests', label: 'Purchase Requests', icon: ShoppingBag, badge: filteredRequests.filter(r => r.status === 'PENDING_APPROVAL').length },
          { id: 'orders', label: 'Purchase Orders', icon: FileText, badge: filteredOrders.length },
          { id: 'rfq_rfp', label: 'RFQs & RFPs', icon: Scale, badge: filteredRfqs.length },
          { id: 'vendors', label: 'Vendor Directory', icon: Building2, badge: vendors.length },
          { id: 'contracts', label: 'Contracts & Expiries', icon: FileCheck, badge: filteredContracts.filter(c => c.daysToExpiry <= 30).length },
          { id: 'receiving', label: 'Goods Receipt & 3-Way Match', icon: PackageCheck },
          { id: 'budgets', label: 'Budget Commitments', icon: DollarSign },
          { id: 'ai', label: 'AI Procurement Assistant', icon: Bot },
          { id: 'analytics', label: 'Spend Analytics & Reports', icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={ShoppingBag}
              label="Pending Requests"
              value={filteredRequests.filter(r => r.status === 'PENDING_APPROVAL').length}
              color="amber"
            />
            <StatCard
              icon={FileText}
              label="Active Purchase Orders"
              value={filteredOrders.length}
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              label="Committed Spend (YTD)"
              value={`$${filteredRequests.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()}`}
              color="emerald"
            />
            <StatCard
              icon={AlertTriangle}
              label="Expiring Contracts (<30 Days)"
              value={filteredContracts.filter(c => c.daysToExpiry <= 30).length}
              color="rose"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Purchase Requests & PO Pipeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Recent Department Purchase Requests
                  </h3>
                  <button onClick={() => setActiveTab('requests')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All ({filteredRequests.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{req.id}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{req.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Category: {req.category} • Requester: {req.requester} • Vendor: {req.preferredVendor}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">${req.totalCost.toLocaleString()}</span>
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Orders Track */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                    Active Purchase Orders & Delivery SLA
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Manage Orders
                  </button>
                </div>

                <div className="space-y-2.5">
                  {filteredOrders.map((po) => (
                    <div key={po.poNumber} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-900 dark:text-white">{po.poNumber}</span>
                          <span className="text-slate-500">• {po.vendor}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">Issued: {po.issuedDate} • Terms: {po.paymentTerms}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white font-mono text-xs block">${po.totalAmount.toLocaleString()}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {po.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Top Preferred Vendors & Contract Expiries */}
            <div className="space-y-6">
              {/* Preferred Vendor Direct Directory */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                    Preferred Enterprise Vendors
                  </h3>
                  <button onClick={() => setActiveTab('vendors')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All ({vendors.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {vendors.slice(0, 3).map((v) => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{v.name}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                          <Star size={12} fill="currentColor" /> {v.rating}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">Category: {v.category} • Lead Time: ~{v.leadTimeDays} Days</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>YTD Spend: ${v.spendYtd.toLocaleString()}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{v.compliance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expiring Contracts Alert Widget */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold">Contract Renewal & Expiry Watch</h3>
                </div>
                {filteredContracts.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{c.vendor}</span>
                      <span className="text-rose-600 font-mono text-[11px]">{c.daysToExpiry} Days Remaining</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{c.title} (${c.value.toLocaleString()})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE REQUESTS CENTER */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Purchase Requests (PR)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage requisitions, budget codes, and multi-tier manager approvals for {currentDeptObj.name}.</p>
              </div>
              <button onClick={() => setModalMode('new_pr')} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Submit Purchase Request
              </button>
            </div>

            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">
                        {req.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{req.title}</h4>
                        <p className="text-slate-400 text-[11px]">Category: {req.category} • Budget Code: {req.budgetCode} • Cost Centre: {req.costCentre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-base text-slate-900 dark:text-white">${req.totalCost.toLocaleString()}</span>
                      {req.status === 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => handleApprovePR(req.id)}
                          className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
                        >
                          Approve PR
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Justification & Approval Status */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">Justification: {req.justification}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Stage: {req.approvalStep}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASE ORDERS (PO) MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Purchase Orders (PO) & Legal Commitments</h3>
            <div className="space-y-3">
              {filteredOrders.map((po) => (
                <div key={po.poNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{po.poNumber}</span>
                      <span className="font-bold text-slate-900 dark:text-white">Vendor: {po.vendor}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Associated PR: {po.prId} • Payment Terms: {po.paymentTerms} • Delivery SLA: {po.deliveryTerms}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">${po.totalAmount.toLocaleString()}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RFQS & RFPS EVALUATION */}
      {activeTab === 'rfq_rfp' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Requests for Quotation (RFQ) & Proposals (RFP)</h3>
            <div className="space-y-6">
              {filteredRfqs.map((rfq) => (
                <div key={rfq.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{rfq.id}</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{rfq.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Category: {rfq.category} • Estimated Budget: ${rfq.estBudget.toLocaleString()} • Responses: {rfq.responsesCount} Bidders
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 self-start sm:self-auto">
                      {rfq.status}
                    </span>
                  </div>

                  {/* Bidders Scoring Matrix */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Bidders Evaluation Matrix</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {rfq.bidders.map((b, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                            <span>{b.name}</span>
                            <span className="text-indigo-600 font-mono">{b.score} / 100</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">Bid Amount: ${b.bid.toLocaleString()}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                            b.status === 'RECOMMENDED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VENDOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Vendor Master Directory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((v) => (
                <div key={v.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</h4>
                      <p className="text-slate-400 text-[11px]">{v.category} • Contact: {v.contactPerson} ({v.email})</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {v.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>YTD Spend: ${v.spendYtd.toLocaleString()}</span>
                    <span>Lead Time: ~{v.leadTimeDays} Days</span>
                    <span>Tax ID: {v.taxId}</span>
                    <span>Compliance: {v.compliance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI PROCUREMENT ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Procurement & Spend Copilot</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated spend analysis, duplicate purchase detection, contract renewal alerts, and cost optimization.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles size={16} /> Cost Optimization Opportunity Identified
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Consolidating Engineering & People Operations hardware requisitions under Apple Enterprise Direct can unlock a tier-2 bulk discount of 8.5% ($4,120 estimated savings).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={16} /> Contract Expiry Action Alert
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  AWS Master Compute Contract expires tomorrow (2026-08-01). Recommending immediate approval of PR-2026-088 to avoid standard on-demand rate spikes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PURCHASE REQUEST MODAL */}
      {modalMode === 'new_pr' && (
        <Modal
          open={true}
          onClose={() => setModalMode(null)}
          title={`Create Purchase Request (${currentDeptObj.name})`}
          size="md"
        >
          <form onSubmit={handleCreatePr} className="space-y-4 text-xs">
            <div>
              <label className="label">Request Title / Requisition *</label>
              <input
                className="input"
                placeholder="e.g. Developer Laptops Upgrade"
                value={prForm.title}
                onChange={(e) => setPrForm({ ...prForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={prForm.category}
                  onChange={(e) => setPrForm({ ...prForm, category: e.target.value })}
                >
                  <option value="Computers & Tech">Computers & Tech</option>
                  <option value="Cloud Services">Cloud Services</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Training & Courses">Training & Courses</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={prForm.priority}
                  onChange={(e) => setPrForm({ ...prForm, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Item Name / Description *</label>
              <input
                className="input"
                placeholder="e.g. MacBook Pro M3 Max"
                value={prForm.itemName}
                onChange={(e) => setPrForm({ ...prForm, itemName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={prForm.qty}
                  onChange={(e) => setPrForm({ ...prForm, qty: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Estimated Unit Cost ($)</label>
                <input
                  type="number"
                  className="input"
                  value={prForm.unitCost}
                  onChange={(e) => setPrForm({ ...prForm, unitCost: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Budget Code</label>
                <input
                  className="input"
                  value={prForm.budgetCode}
                  onChange={(e) => setPrForm({ ...prForm, budgetCode: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Cost Centre</label>
                <input
                  className="input"
                  value={prForm.costCentre}
                  onChange={(e) => setPrForm({ ...prForm, costCentre: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Business Justification</label>
              <textarea
                className="input h-20"
                placeholder="Explain the business need and project alignment..."
                value={prForm.justification}
                onChange={(e) => setPrForm({ ...prForm, justification: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setModalMode(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Submit Requisition
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
