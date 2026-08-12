import React, { useState, useMemo } from 'react'
import {
  Target, TrendingUp, Compass, Layers, Award, ShieldAlert, PieChart, BarChart3,
  Bot, Sparkles, Plus, Search, Filter, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, CheckSquare, FileText, Users, Building2, DollarSign, Briefcase,
  Scale, RefreshCw, GitFork, Zap, ChevronRight, ChevronDown, Sliders, Download,
  Eye, Check, X, Tag, ShieldCheck, Activity, LineChart, FileSpreadsheet
} from 'lucide-react'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Modal,
  SearchInput
} from '../components/ui'

// Mock Data Generators for Strategy, OKRs & Performance OS
const INITIAL_STRATEGIC_PILLARS = [
  {
    id: 'pil-1',
    code: 'PIL-01',
    title: 'Operational Excellence & Scalability',
    owner: 'Chief Operating Officer',
    weight: 30,
    progress: 78,
    status: 'ON_TRACK',
    color: 'emerald',
    description: 'Optimize organizational workflows, lower unit economics, and automate department handoffs.',
    objectivesCount: 4
  },
  {
    id: 'pil-2',
    code: 'PIL-02',
    title: 'Market Expansion & Enterprise Growth',
    owner: 'Chief Revenue Officer',
    weight: 25,
    progress: 82,
    status: 'ON_TRACK',
    color: 'indigo',
    description: 'Expand EMEA and LATAM market footprint with strategic enterprise partnerships.',
    objectivesCount: 3
  },
  {
    id: 'pil-3',
    code: 'PIL-03',
    title: 'Product Innovation & AI Leadership',
    owner: 'Chief Technology Officer',
    weight: 25,
    progress: 64,
    status: 'AT_RISK',
    color: 'amber',
    description: 'Deliver next-generation AI Copilot tools across all StaffRoom product suites.',
    objectivesCount: 5
  },
  {
    id: 'pil-4',
    code: 'PIL-04',
    title: 'Talent Retention & Cultural Agility',
    owner: 'Chief People Officer',
    weight: 20,
    progress: 91,
    status: 'ON_TRACK',
    color: 'purple',
    description: 'Foster employee development, competitive benefits, and leadership succession pipelines.',
    objectivesCount: 3
  }
]

const INITIAL_OKRS = [
  {
    id: 'okr-101',
    code: 'OKR-CORP-01',
    level: 'CORPORATE',
    title: 'Scale Annual Recurring Revenue to $50M',
    pillarId: 'pil-2',
    deptId: 'dept_sales',
    department: 'Sales & Growth',
    owner: 'Evelyn Carter (CRO)',
    period: 'FY2026',
    progress: 84,
    confidence: 'HIGH',
    status: 'ON_TRACK',
    keyResults: [
      { id: 'kr-1', text: 'Increase EMEA Enterprise accounts from 120 to 180', current: 165, target: 180, unit: 'accounts', progress: 91 },
      { id: 'kr-2', text: 'Achieve Net Revenue Retention (NRR) of 125%', current: 122, target: 125, unit: '%', progress: 88 },
      { id: 'kr-3', text: 'Reduce average sales cycle length from 90 to 60 days', current: 68, target: 60, unit: 'days', progress: 73 }
    ]
  },
  {
    id: 'okr-102',
    code: 'OKR-ENG-02',
    level: 'DEPARTMENT',
    title: 'Deliver Enterprise AI Copilot Engine v4.0',
    pillarId: 'pil-3',
    deptId: 'dept_eng',
    department: 'Engineering',
    owner: 'David Miller (VP Eng)',
    period: 'Q3 2026',
    progress: 62,
    confidence: 'MEDIUM',
    status: 'AT_RISK',
    keyResults: [
      { id: 'kr-4', text: 'Achieve sub-200ms latency on AI query synthesis', current: 240, target: 200, unit: 'ms', progress: 60 },
      { id: 'kr-5', text: 'Maintain 99.99% high-availability SLA on core endpoints', current: 99.95, target: 99.99, unit: '%', progress: 75 },
      { id: 'kr-6', text: 'Complete SOC2 Type II security audit compliance certification', current: 50, target: 100, unit: '%', progress: 50 }
    ]
  },
  {
    id: 'okr-103',
    code: 'OKR-HR-03',
    level: 'DEPARTMENT',
    title: 'Elevate Staff Retention & Leadership Readiness',
    pillarId: 'pil-4',
    deptId: 'dept_hr',
    department: 'People Operations',
    owner: 'Sarah Jenkins (VP People)',
    period: 'Q3 2026',
    progress: 89,
    confidence: 'HIGH',
    status: 'ON_TRACK',
    keyResults: [
      { id: 'kr-7', text: 'Maintain voluntary staff turnover below 5%', current: 3.8, target: 5.0, unit: '%', progress: 95 },
      { id: 'kr-8', text: 'Achieve 85%+ completion in quarterly leadership coaching', current: 82, target: 85, unit: '%', progress: 85 }
    ]
  },
  {
    id: 'okr-104',
    code: 'OKR-OPS-04',
    level: 'DEPARTMENT',
    title: 'Optimize Logistics & Fleet Cost Efficiencies',
    pillarId: 'pil-1',
    deptId: 'dept_ops',
    department: 'Operations',
    owner: 'James Wilson (COO)',
    period: 'FY2026',
    progress: 76,
    confidence: 'HIGH',
    status: 'ON_TRACK',
    keyResults: [
      { id: 'kr-9', text: 'Reduce warehouse processing bottleneck lead time by 30%', current: 24, target: 30, unit: '%', progress: 80 },
      { id: 'kr-10', text: 'Achieve 98% on-time equipment dispatch rate', current: 96.5, target: 98.0, unit: '%', progress: 72 }
    ]
  }
]

const INITIAL_KPIS = [
  {
    id: 'kpi-1',
    name: 'Net Revenue Retention (NRR)',
    category: 'Financial',
    deptId: 'dept_sales',
    department: 'Sales & Growth',
    current: 122,
    target: 125,
    unit: '%',
    trend: 'UP',
    status: 'ON_TARGET',
    frequency: 'Monthly'
  },
  {
    id: 'kpi-2',
    name: 'Customer Satisfaction Score (CSAT)',
    category: 'Customer',
    deptId: 'dept_ops',
    department: 'Operations',
    current: 4.8,
    target: 4.9,
    unit: '/ 5.0',
    trend: 'STABLE',
    status: 'ON_TARGET',
    frequency: 'Weekly'
  },
  {
    id: 'kpi-3',
    name: 'Core System API Latency',
    category: 'IT & Infrastructure',
    deptId: 'dept_eng',
    department: 'Engineering',
    current: 240,
    target: 200,
    unit: 'ms',
    trend: 'DOWN',
    status: 'NEEDS_ATTENTION',
    frequency: 'Real-time'
  },
  {
    id: 'kpi-4',
    name: 'Voluntary Staff Turnover Rate',
    category: 'HR & People',
    deptId: 'dept_hr',
    department: 'People Operations',
    current: 3.8,
    target: 5.0,
    unit: '%',
    trend: 'UP',
    status: 'EXCEEDING',
    frequency: 'Quarterly'
  }
]

const BALANCED_SCORECARD_DATA = [
  {
    perspective: 'Financial',
    weight: '25%',
    score: 88,
    objectives: 'Maximize ARR growth, maintain 25% EBITDA margin, optimize capex.',
    status: 'HEALTHY'
  },
  {
    perspective: 'Customer',
    weight: '25%',
    score: 92,
    objectives: 'Exceed CSAT benchmarks, reduce customer onboarding churn to <2%.',
    status: 'HEALTHY'
  },
  {
    perspective: 'Internal Processes',
    weight: '25%',
    score: 74,
    objectives: 'Automate PR approval workflows, streamline IT deployment pipelines.',
    status: 'NEEDS_ATTENTION'
  },
  {
    perspective: 'Learning & Growth',
    weight: '25%',
    score: 90,
    objectives: 'Drive engineering AI upskilling, foster cross-departmental agility.',
    status: 'HEALTHY'
  }
]

const INITIAL_RISKS = [
  {
    id: 'rsk-01',
    title: 'Delay in SOC2 Certification Audit Completion',
    category: 'Compliance & Security',
    deptId: 'dept_eng',
    department: 'Engineering',
    impact: 'HIGH',
    likelihood: 'MEDIUM',
    owner: 'David Miller',
    status: 'OPEN',
    mitigation: 'Engaged external security auditor and assigned 2 dedicated DevOps leads.'
  },
  {
    id: 'rsk-02',
    title: 'Supplier Supply Chain Disruptions for Hardware Assets',
    category: 'Operations & Procurement',
    deptId: 'dept_ops',
    department: 'Operations',
    impact: 'MEDIUM',
    likelihood: 'HIGH',
    owner: 'James Wilson',
    status: 'MITIGATED',
    mitigation: 'Established multi-vendor SLA backups with secondary regional distributors.'
  }
]

export default function StrategyManagement() {
  const {
    departments,
    activeDepartmentId,
    filterByDepartment,
    userDepartment
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Main Tabs
  const [activeTab, setActiveTab] = useState('overview') // overview, okrs, kpis, scorecard, cascade, initiatives, risks, ai, reviews, reports
  const [searchQuery, setSearchQuery] = useState('')

  // State Management
  const [pillars] = useState(INITIAL_STRATEGIC_PILLARS)
  const [okrs, setOkrs] = useState(INITIAL_OKRS)
  const [kpis, setKpis] = useState(INITIAL_KPIS)
  const [risks, setRisks] = useState(INITIAL_RISKS)

  // Modals & Form States
  const [modalMode, setModalMode] = useState(null) // 'new_okr', 'new_kpi', 'new_risk'
  const [okrForm, setOkrForm] = useState({
    title: '',
    level: 'DEPARTMENT',
    period: 'Q3 2026',
    pillarId: 'pil-1',
    kr1Text: '',
    kr1Target: 100,
    kr1Unit: '%'
  })

  // Scoped Data
  const filteredOkrs = useMemo(() => filterByDepartment(okrs), [okrs, activeDepartmentId])
  const filteredKpis = useMemo(() => filterByDepartment(kpis), [kpis, activeDepartmentId])
  const filteredRisks = useMemo(() => filterByDepartment(risks), [risks, activeDepartmentId])

  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  // Handlers
  const handleCreateOkr = (e) => {
    e.preventDefault()
    if (!okrForm.title) return

    const newOkr = {
      id: `okr-${Date.now()}`,
      code: `OKR-${currentDeptObj.code}-${Math.floor(10 + Math.random() * 90)}`,
      level: okrForm.level,
      title: okrForm.title,
      pillarId: okrForm.pillarId,
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      department: currentDeptObj.name,
      owner: 'Department Lead',
      period: okrForm.period,
      progress: 0,
      confidence: 'HIGH',
      status: 'ON_TRACK',
      keyResults: [
        {
          id: `kr-${Date.now()}-1`,
          text: okrForm.kr1Text || 'Achieve target deliverable benchmark',
          current: 0,
          target: Number(okrForm.kr1Target),
          unit: okrForm.kr1Unit,
          progress: 0
        }
      ]
    }

    setOkrs([newOkr, ...okrs])
    setModalMode(null)
    setOkrForm({
      title: '',
      level: 'DEPARTMENT',
      period: 'Q3 2026',
      pillarId: 'pil-1',
      kr1Text: '',
      kr1Target: 100,
      kr1Unit: '%'
    })
    showSuccess(`Strategic Goal/OKR registered for ${currentDeptObj.name}!`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <PageHeader
        title="Strategy Execution, OKRs & Performance OS"
        description={`Aligning vision to execution across ${currentDeptObj.name}. Real-time OKR tracking, KPI library, balanced scorecards, and AI strategy forecasting.`}
        icon={Target}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode('new_okr')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Define Goal / OKR
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} /> Executive Review Pack
            </button>
          </div>
        }
      />

      {/* Main OS Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Strategy Command Center', icon: Compass },
          { id: 'okrs', label: 'OKR Management', icon: Target, badge: filteredOkrs.length },
          { id: 'kpis', label: 'KPI Library & Trends', icon: LineChart, badge: filteredKpis.length },
          { id: 'scorecard', label: 'Balanced Scorecard', icon: PieChart },
          { id: 'cascade', label: 'Cascade & Alignment Map', icon: GitFork },
          { id: 'risks', label: 'Strategic Risk Register', icon: ShieldAlert, badge: filteredRisks.length },
          { id: 'ai', label: 'AI Strategy Copilot', icon: Bot },
          { id: 'reviews', label: 'Executive Reviews & QBRs', icon: Award },
          { id: 'reports', label: 'Board Reports', icon: FileText }
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

      {/* TAB 1: STRATEGY COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Target}
              label="Overall Strategy Score"
              value="82.4%"
              color="indigo"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active Department OKRs"
              value={filteredOkrs.length}
              color="emerald"
            />
            <StatCard
              icon={Activity}
              label="On-Track Key Performance Indicators"
              value={`${filteredKpis.filter(k => k.status === 'ON_TARGET' || k.status === 'EXCEEDING').length} / ${filteredKpis.length}`}
              color="purple"
            />
            <StatCard
              icon={ShieldAlert}
              label="Strategic Risks Identified"
              value={filteredRisks.length}
              color="amber"
            />
          </div>

          {/* Strategic Pillars Progress */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass size={20} className="text-indigo-600 dark:text-indigo-400" />
                  Corporate Strategic Pillars & Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">High-level enterprise priorities guiding FY2026 organizational objectives.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                4 Core Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map((pil) => (
                <div key={pil.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">{pil.code}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pil.title}</h4>
                    </div>
                    <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">{pil.progress}%</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{pil.description}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${pil.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Owner: {pil.owner}</span>
                    <span>{pil.objectivesCount} Linked Objectives</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department OKRs Snapshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target size={20} className="text-emerald-600 dark:text-emerald-400" />
                Key Departmental OKRs ({currentDeptObj.name})
              </h3>
              <button onClick={() => setActiveTab('okrs')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All OKRs
              </button>
            </div>

            <div className="space-y-3">
              {filteredOkrs.map((okr) => (
                <div key={okr.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{okr.code}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{okr.title}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{okr.progress}% Completed</span>
                      <StatusBadge status={okr.status} />
                    </div>
                  </div>

                  {/* Key Results */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {okr.keyResults.map((kr) => (
                      <div key={kr.id} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-300">• {kr.text}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {kr.current} / {kr.target} {kr.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${kr.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OKR MANAGEMENT */}
      {activeTab === 'okrs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Objectives & Key Results (OKRs)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quarterly and annual strategic goals mapped to key result milestones for {currentDeptObj.name}.</p>
              </div>
              <button onClick={() => setModalMode('new_okr')} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Add Objective & Key Result
              </button>
            </div>

            <div className="space-y-4">
              {filteredOkrs.map((okr) => (
                <div key={okr.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{okr.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">{okr.level}</span>
                        <span className="text-slate-400 text-[11px]">• {okr.period}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{okr.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">Owner: {okr.owner} • Department: {okr.department}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Confidence</span>
                        <span className="font-bold text-emerald-600">{okr.confidence}</span>
                      </div>
                      <StatusBadge status={okr.status} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Key Results Progression:</h5>
                    {okr.keyResults.map((kr) => (
                      <div key={kr.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                          <span>{kr.text}</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{kr.current} / {kr.target} {kr.unit} ({kr.progress}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${kr.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KPI LIBRARY */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise KPI Library & Target Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKpis.map((kpi) => (
                <div key={kpi.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase">{kpi.category}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{kpi.name}</h4>
                    </div>
                    <StatusBadge status={kpi.status} />
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Current Metric</span>
                      <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{kpi.current} {kpi.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">Target</span>
                      <span className="text-sm font-bold font-mono text-slate-600 dark:text-slate-300">{kpi.target} {kpi.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BALANCED SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-600 text-white font-bold">
                <PieChart size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">4-Perspective Balanced Scorecard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Holistic performance matrix balancing Financial, Customer, Internal Processes, and Learning & Growth goals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BALANCED_SCORECARD_DATA.map((bsc, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sm text-slate-900 dark:text-white">{bsc.perspective} Perspective</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">{bsc.score}/100</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{bsc.objectives}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${bsc.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AI STRATEGY ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Strategy Copilot & Predictive Recommendations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated risk forecasting, underperforming KPI alerts, and scenario simulation for {currentDeptObj.name}.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={16} /> Objective Timeline Slip Forecast
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineering OKR "Deliver Enterprise AI Copilot Engine v4.0" is running 12 days behind projected sprintvelocity. Recommending resource reallocation from non-critical maintenance tasks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles size={16} /> Growth Opportunity Recommendation
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sales NRR KPI has exceeded target benchmarks by 8%. Consider raising Q4 enterprise renewal targets and expanding EMEA account manager staffing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DEFINE NEW OKR */}
      {modalMode === 'new_okr' && (
        <Modal
          open={true}
          onClose={() => setModalMode(null)}
          title={`Define Strategic Goal / OKR (${currentDeptObj.name})`}
          size="md"
        >
          <form onSubmit={handleCreateOkr} className="space-y-4 text-xs">
            <div>
              <label className="label">Objective Title *</label>
              <input
                className="input"
                placeholder="e.g. Expand Customer Retention & Renewal Rates"
                value={okrForm.title}
                onChange={(e) => setOkrForm({ ...okrForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Alignment Level</label>
                <select
                  className="input"
                  value={okrForm.level}
                  onChange={(e) => setOkrForm({ ...okrForm, level: e.target.value })}
                >
                  <option value="CORPORATE">Corporate Level</option>
                  <option value="DEPARTMENT">Department Level</option>
                  <option value="TEAM">Team Level</option>
                </select>
              </div>
              <div>
                <label className="label">Period</label>
                <select
                  className="input"
                  value={okrForm.period}
                  onChange={(e) => setOkrForm({ ...okrForm, period: e.target.value })}
                >
                  <option value="Q3 2026">Q3 2026</option>
                  <option value="Q4 2026">Q4 2026</option>
                  <option value="FY2026">FY2026</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Primary Key Result Description</label>
              <input
                className="input"
                placeholder="e.g. Increase CSAT score from 4.2 to 4.8"
                value={okrForm.kr1Text}
                onChange={(e) => setOkrForm({ ...okrForm, kr1Text: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Target Value</label>
                <input
                  type="number"
                  className="input"
                  value={okrForm.kr1Target}
                  onChange={(e) => setOkrForm({ ...okrForm, kr1Target: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Measurement Unit</label>
                <input
                  className="input"
                  placeholder="e.g. %, accounts, ms, $"
                  value={okrForm.kr1Unit}
                  onChange={(e) => setOkrForm({ ...okrForm, kr1Unit: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setModalMode(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Create Goal / OKR
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
