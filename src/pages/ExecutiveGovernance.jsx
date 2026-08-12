import React, { useState, useMemo } from 'react'
import {
  ShieldCheck, Building2, Crown, Briefcase, FileText, Vote, BarChart3, PieChart,
  Bot, Sparkles, Plus, Search, Filter, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, CheckSquare, Users, DollarSign, Scale, RefreshCw, GitFork,
  Zap, ChevronRight, ChevronDown, Sliders, Download, Eye, Check, X, Tag,
  Activity, LineChart, FileSpreadsheet, Lock, AlertCircle, TrendingUp, Compass,
  Layers, Award, ShieldAlert, Layers3, FolderKanban, Milestone
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

// Mock Data Sets for Executive Portfolio, Governance & Decision Center
const INITIAL_PORTFOLIO = [
  {
    id: 'PRG-2026-01',
    name: 'Global Cloud & Infrastructure Modernization',
    sponsor: 'Chief Technology Officer',
    category: 'Digital Transformation',
    budget: 2500000,
    spent: 1850000,
    progress: 74,
    status: 'ON_TRACK',
    health: 'GREEN',
    deptId: 'dept_eng',
    department: 'Engineering',
    milestonesCount: 12,
    completedMilestones: 9,
    benefits: '$1.2M Annual AWS Compute Cost Reduction & 99.99% Uptime',
    nextDeliverable: 'EMEA Data Center Migration Cutover (2026-08-15)'
  },
  {
    id: 'PRG-2026-02',
    name: 'Next-Gen Enterprise AI Copilot Rollout',
    sponsor: 'Chief Product Officer',
    category: 'Innovation Program',
    budget: 1800000,
    spent: 1200000,
    progress: 68,
    status: 'AT_RISK',
    health: 'AMBER',
    deptId: 'dept_eng',
    department: 'Engineering',
    milestonesCount: 10,
    completedMilestones: 6,
    benefits: '35% Automated Ticket Resolution & Automated Procurement Matching',
    nextDeliverable: 'SOC2 Type II Security Compliance Audit (2026-08-30)'
  },
  {
    id: 'PRG-2026-03',
    name: 'EMEA Market Footprint & Regional HQ Expansion',
    sponsor: 'Chief Operating Officer',
    category: 'Strategic Expansion',
    budget: 4200000,
    spent: 3900000,
    progress: 92,
    status: 'ON_TRACK',
    health: 'GREEN',
    deptId: 'dept_ops',
    department: 'Operations',
    milestonesCount: 15,
    completedMilestones: 14,
    benefits: 'Direct LATAM & European Enterprise Client Coverage (+28% ARR)',
    nextDeliverable: 'London Office Facility Commissioning (2026-08-10)'
  }
]

const INITIAL_BOARD_MEETINGS = [
  {
    id: 'BRD-2026-Q3',
    title: 'Q3 Enterprise Strategy & Capital Allocation Review',
    date: '2026-08-20',
    committee: 'Main Executive Board',
    chair: 'Elena Rostova (Board Chair)',
    status: 'SCHEDULED',
    attendeesCount: 9,
    packReady: true,
    agendaItems: [
      'FY2027 Capital Budget Allocation & Capex Approvals',
      'EMEA Expansion ROI & Regional Fleet Licensing',
      'Enterprise AI Security & SOC2 Governance Audit'
    ]
  },
  {
    id: 'CMT-AUDIT-08',
    title: 'Audit & Compliance Committee Review',
    date: '2026-08-12',
    committee: 'Audit & Risk Committee',
    chair: 'Marcus Vance (Independent Director)',
    status: 'SCHEDULED',
    attendeesCount: 5,
    packReady: true,
    agendaItems: [
      'Statutory Financial Audit Findings (KPMG)',
      'Enterprise Cybersecurity Threat Assessment',
      'Internal Control Framework & Delegation Matrix'
    ]
  }
]

const INITIAL_GOVERNANCE_DECISIONS = [
  {
    id: 'DEC-2026-042',
    title: 'Approval of AWS 3-Year Savings Plan Commitment ($1.35M)',
    category: 'Capital Commitment',
    requester: 'David Miller (VP Eng)',
    sponsor: 'Chief Financial Officer',
    status: 'APPROVED',
    approvedDate: '2026-07-28',
    votingResult: 'Unanimous (7/7)',
    impact: 'Locks in 38% compute cost discount across all production clusters.'
  },
  {
    id: 'DEC-2026-045',
    title: 'Delegation of Authority Threshold Matrix Revision (v3.2)',
    category: 'Policy & Governance',
    requester: 'Governance Committee',
    sponsor: 'Chief Executive Officer',
    status: 'PENDING_BOARD_VOTE',
    approvedDate: '-',
    votingResult: 'Pending Q3 Meeting',
    impact: 'Raises Department VP single-signature approval limit from $25k to $50k.'
  }
]

const INITIAL_ENTERPRISE_RISKS = [
  {
    id: 'ERM-2026-01',
    title: 'Regulatory Data Privacy Compliance (EU GDPR & CCPA)',
    category: 'Legal & Regulatory',
    inherentRisk: 'CRITICAL',
    residualRisk: 'LOW',
    owner: 'Chief Legal Officer',
    mitigation: 'Automated data encryption at rest, automated purge policies, and monthly DPO audits.',
    status: 'MONITORED'
  },
  {
    id: 'ERM-2026-02',
    title: 'Supply Chain Bottlenecks for Server & Hardware Procurement',
    category: 'Operational',
    inherentRisk: 'HIGH',
    residualRisk: 'MEDIUM',
    owner: 'VP Operations',
    mitigation: 'Multi-vendor agreements with Apple Direct and Dell Enterprise with 3-month buffer inventory.',
    status: 'ACTION_REQUIRED'
  }
]

export default function ExecutiveGovernance() {
  const {
    departments,
    activeDepartmentId,
    filterByDepartment,
    userDepartment
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Main Operating Tabs
  const [activeTab, setActiveTab] = useState('overview') // overview, portfolio, governance, board, risks, decisions, briefings, scenario, ai, analytics
  const [searchQuery, setSearchQuery] = useState('')

  // OS Data States
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO)
  const [meetings, setMeetings] = useState(INITIAL_BOARD_MEETINGS)
  const [decisions, setDecisions] = useState(INITIAL_GOVERNANCE_DECISIONS)
  const [risks, setRisks] = useState(INITIAL_ENTERPRISE_RISKS)

  // Modals & Form State
  const [modalMode, setModalMode] = useState(null) // 'new_program', 'new_decision', 'new_risk'
  const [programForm, setProgramForm] = useState({
    name: '',
    category: 'Digital Transformation',
    sponsor: 'Chief Technology Officer',
    budget: 1000000,
    benefits: ''
  })

  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  // Handlers
  const handleCreateProgram = (e) => {
    e.preventDefault()
    if (!programForm.name) return

    const newPrg = {
      id: `PRG-2026-${Math.floor(10 + Math.random() * 90)}`,
      name: programForm.name,
      sponsor: programForm.sponsor,
      category: programForm.category,
      budget: Number(programForm.budget),
      spent: 0,
      progress: 0,
      status: 'ON_TRACK',
      health: 'GREEN',
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      department: currentDeptObj.name,
      milestonesCount: 5,
      completedMilestones: 0,
      benefits: programForm.benefits || 'Strategic efficiency gains and enterprise alignment.',
      nextDeliverable: 'Project Charter Signoff & Phase 1 Kickoff'
    }

    setPortfolio([newPrg, ...portfolio])
    setModalMode(null)
    setProgramForm({
      name: '',
      category: 'Digital Transformation',
      sponsor: 'Chief Technology Officer',
      budget: 1000000,
      benefits: ''
    })
    showSuccess(`Strategic Initiative "${newPrg.name}" registered in Enterprise Portfolio!`)
  }

  const handleApproveDecision = (decId) => {
    setDecisions(decisions.map((d) => {
      if (d.id === decId) {
        return { ...d, status: 'APPROVED', approvedDate: new Date().toISOString().split('T')[0], votingResult: 'Passed (Unanimous)' }
      }
      return d
    }))
    showSuccess(`Decision ${decId} approved by Board / Executive Committee.`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <PageHeader
        title="Executive Portfolio, Governance & Decision Center"
        description={`Enterprise-wide strategic portfolio management, board governance, risk heatmaps, decision register, and AI executive decision advisor.`}
        icon={Crown}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMode('new_program')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> New Strategic Program
            </button>
            <button
              onClick={() => setActiveTab('briefings')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} /> Executive Briefing Pack
            </button>
          </div>
        }
      />

      {/* Main OS Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Executive Command Center', icon: Crown },
          { id: 'portfolio', label: 'Strategic Program Portfolio', icon: FolderKanban, badge: portfolio.length },
          { id: 'board', label: 'Board & Committee Management', icon: Building2, badge: meetings.length },
          { id: 'decisions', label: 'Executive Decision Register', icon: Vote, badge: decisions.filter(d => d.status.includes('PENDING')).length },
          { id: 'risks', label: 'Enterprise Risk & Compliance', icon: ShieldAlert, badge: risks.length },
          { id: 'briefings', label: 'Executive Briefings & QBRs', icon: FileText },
          { id: 'scenario', label: 'Scenario Planning & Forecasts', icon: LineChart },
          { id: 'ai', label: 'AI Executive Advisor', icon: Bot },
          { id: 'analytics', label: 'Organization Scorecard', icon: PieChart },
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

      {/* TAB 1: EXECUTIVE COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Crown}
              label="Organization Health Index"
              value="91.8 / 100"
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              label="Total Program Portfolio Budget"
              value={`$${portfolio.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}`}
              color="emerald"
            />
            <StatCard
              icon={Vote}
              label="Pending Board / Exec Decisions"
              value={decisions.filter(d => d.status.includes('PENDING')).length}
              color="amber"
            />
            <StatCard
              icon={ShieldAlert}
              label="Enterprise Monitored Risks"
              value={risks.length}
              color="rose"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Strategic Program Portfolio & Decision Queue */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderKanban size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Major Enterprise Programs & Capital Investments
                  </h3>
                  <button onClick={() => setActiveTab('portfolio')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Portfolio ({portfolio.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {portfolio.map((prg) => (
                    <div key={prg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{prg.id}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{prg.name}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            Category: {prg.category} • Sponsor: {prg.sponsor} • Dept: {prg.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ${prg.spent.toLocaleString()} / ${prg.budget.toLocaleString()}
                          </span>
                          <StatusBadge status={prg.status} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>Milestones: {prg.completedMilestones} of {prg.milestonesCount} Completed</span>
                          <span>{prg.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${prg.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Executive Decision Queue */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Vote size={18} className="text-amber-600 dark:text-amber-400" />
                    Executive & Board Decision Register Queue
                  </h3>
                  <button onClick={() => setActiveTab('decisions')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Manage Decisions
                  </button>
                </div>

                <div className="space-y-3">
                  {decisions.map((dec) => (
                    <div key={dec.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{dec.id}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{dec.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Requester: {dec.requester} • Sponsor: {dec.sponsor}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {dec.status.includes('PENDING') ? (
                          <button
                            onClick={() => handleApproveDecision(dec.id)}
                            className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
                          >
                            Board Signoff
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {dec.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Board Meetings & Risk Heatmap */}
            <div className="space-y-6">
              {/* Upcoming Board & Committee Calendar */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                    Board & Governance Committee Calendar
                  </h3>
                  <button onClick={() => setActiveTab('board')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Packs
                  </button>
                </div>

                <div className="space-y-3">
                  {meetings.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                      <div className="flex justify-between items-start font-bold text-slate-900 dark:text-white">
                        <span>{m.title}</span>
                        <span className="font-mono text-purple-600 text-[11px]">{m.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Committee: {m.committee} • Chair: {m.chair}</p>
                      <div className="pt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Board Pack Complete</span>
                        <span>{m.attendeesCount} Confirmed Attendees</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Risk Summary */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-500" />
                  Top Monitored Enterprise Risks
                </h3>
                <div className="space-y-2">
                  {risks.map((r) => (
                    <div key={r.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                        <span>{r.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 font-mono">
                          Inherent: {r.inherentRisk}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{r.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRATEGIC PROGRAM PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Strategic Program Portfolio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Multi-departmental digital transformation programs, capital investments, and benefits tracking.</p>
              </div>
              <button onClick={() => setModalMode('new_program')} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Register Strategic Program
              </button>
            </div>

            <div className="space-y-4">
              {portfolio.map((prg) => (
                <div key={prg.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{prg.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">{prg.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{prg.name}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">Executive Sponsor: {prg.sponsor} • Department: {prg.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                        ${prg.spent.toLocaleString()} / ${prg.budget.toLocaleString()}
                      </span>
                      <StatusBadge status={prg.status} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">Target Benefits Realization:</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{prg.benefits}</p>
                    <div className="flex justify-between text-[10px] text-indigo-600 dark:text-indigo-400 font-mono pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Next Deliverable: {prg.nextDeliverable}</span>
                      <span>Progress: {prg.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI EXECUTIVE ADVISOR */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Executive Strategic Advisor</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated board summaries, capital allocation optimization, risk forecasts, and natural language scenario insights.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles size={16} /> Capital Allocation Insight
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Consolidating hardware and cloud infrastructure commitments across Engineering and Operations under a single 3-year commitment reduces annual Capex by $420,000.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={16} /> Governance Recommendation
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Decision DEC-2026-045 raises single-signature VP approval limits to $50k. Recommending adopting secondary audit controls for recurring cloud commitments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STRATEGIC PROGRAM MODAL */}
      {modalMode === 'new_program' && (
        <Modal
          open={true}
          onClose={() => setModalMode(null)}
          title="Register Strategic Enterprise Program"
          size="md"
        >
          <form onSubmit={handleCreateProgram} className="space-y-4 text-xs">
            <div>
              <label className="label">Program Title *</label>
              <input
                className="input"
                placeholder="e.g. Enterprise AI & Cloud Transformation"
                value={programForm.name}
                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={programForm.category}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                >
                  <option value="Digital Transformation">Digital Transformation</option>
                  <option value="Strategic Expansion">Strategic Expansion</option>
                  <option value="Innovation Program">Innovation Program</option>
                  <option value="Capital Infrastructure">Capital Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="label">Executive Sponsor</label>
                <input
                  className="input"
                  placeholder="e.g. Chief Technology Officer"
                  value={programForm.sponsor}
                  onChange={(e) => setProgramForm({ ...programForm, sponsor: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Total Approved Budget ($)</label>
              <input
                type="number"
                className="input"
                value={programForm.budget}
                onChange={(e) => setProgramForm({ ...programForm, budget: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Expected Business Benefits & ROI</label>
              <textarea
                className="input h-20"
                placeholder="Detail annual cost savings, revenue increase, or SLA improvements..."
                value={programForm.benefits}
                onChange={(e) => setProgramForm({ ...programForm, benefits: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setModalMode(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Register Program
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
