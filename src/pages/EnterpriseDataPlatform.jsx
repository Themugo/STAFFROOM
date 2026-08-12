import React, { useState, useMemo } from 'react'
import {
  Database, BarChart3, PieChart, TrendingUp, Sparkles, Bot, LineChart,
  Search, Filter, Plus, CheckCircle2, AlertTriangle, RefreshCw, FileText,
  Download, Eye, ShieldCheck, Cpu, Layers, Radio, Globe, Terminal, Server,
  Table, GitBranch, ArrowUpRight, ArrowDownRight, Activity, Zap, Lock,
  Play, Sliders, Check, X, FileSpreadsheet, Share2, HelpCircle
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

// Mock Data Sets for Enterprise Data Platform & BI
const INITIAL_DATA_PIPELINES = [
  {
    id: 'pipe-hr-01',
    name: 'HR Core & Employee Census ETL',
    source: 'StaffRoom HR Module',
    destination: 'Warehouse Fact_Employee_Events',
    type: 'Streaming / Webhook',
    frequency: 'Real-time',
    status: 'HEALTHY',
    qualityScore: '99.4%',
    recordsProcessed24h: '14,250',
    lastSync: '1 min ago'
  },
  {
    id: 'pipe-fin-02',
    name: 'Payroll Ledger & Tax Deductions Ingestion',
    source: 'Payroll & Bank Gateway',
    destination: 'Warehouse Fact_Payroll_Transactions',
    type: 'Batch Incremental',
    frequency: 'Every 15 mins',
    status: 'HEALTHY',
    qualityScore: '100%',
    recordsProcessed24h: '8,900',
    lastSync: '5 mins ago'
  },
  {
    id: 'pipe-proc-03',
    name: 'Procurement Purchase Orders & Inventory Sync',
    source: 'Procurement & Assets',
    destination: 'Warehouse Fact_Purchase_Orders',
    type: 'Batch Delta',
    frequency: 'Hourly',
    status: 'HEALTHY',
    qualityScore: '98.8%',
    recordsProcessed24h: '3,410',
    lastSync: '12 mins ago'
  },
  {
    id: 'pipe-tele-04',
    name: 'Fleet Telematics & IoT GPS Stream',
    source: 'Logistics IoT Gateways',
    destination: 'Data Lake /raw/telematics',
    type: 'Kafka Stream',
    frequency: 'Real-time',
    status: 'HEALTHY',
    qualityScore: '97.2%',
    recordsProcessed24h: '184,000',
    lastSync: 'Just now'
  }
]

const INITIAL_MDM_RECORDS = [
  {
    id: 'MDM-EMP-104',
    entity: 'Employee Master Golden Record',
    domain: 'People & HR',
    totalDuplicatesResolved: 142,
    sourceSystems: ['StaffRoom HR', 'Azure AD', 'Workday Legacy', 'Payroll OS'],
    completeness: '99.8%',
    steward: 'Chief People Officer',
    lastUpdated: '2026-07-31 20:10'
  },
  {
    id: 'MDM-SUP-082',
    entity: 'Supplier & Vendor Golden Directory',
    domain: 'Procurement & Finance',
    totalDuplicatesResolved: 88,
    sourceSystems: ['StaffRoom Procurement', 'SAP ERP', 'QuickBooks'],
    completeness: '98.5%',
    steward: 'VP Procurement',
    lastUpdated: '2026-07-31 18:45'
  }
]

const INITIAL_PREDICTIVE_MODELS = [
  {
    id: 'ML-MOD-01',
    name: 'Employee Retention & Attrition Predictor v3.2',
    accuracy: '94.2%',
    type: 'Gradient Boosted Trees (XGBoost)',
    primaryDrivers: ['Overtime Hours', 'Compa-Ratio', 'Time Since Promotion', 'Peer Review Score'],
    forecastInsight: 'Engineering dept attrition risk is 12% lower than Q1 due to newly introduced remote flexibility policies.',
    status: 'DEPLOYED'
  },
  {
    id: 'ML-MOD-02',
    name: 'Enterprise Budget & Capex Variance Forecast',
    accuracy: '96.8%',
    type: 'Prophet Time Series Ensemble',
    primaryDrivers: ['Cloud Compute Load', 'Regional Fleet Fuel Prices', 'Quarterly Hiring Plan'],
    forecastInsight: 'Projected Q4 Capex spend expected to align within ±1.5% of approved budget.',
    status: 'DEPLOYED'
  }
]

export default function EnterpriseDataPlatform() {
  const {
    departments,
    activeDepartmentId,
    userDepartment
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Main Operating Tabs
  const [activeTab, setActiveTab] = useState('overview') // overview, warehouse, mdm, catalog, bi, predictive, nlq, mlstudio, quality, reporting
  const [nlqQuery, setNlqQuery] = useState('')
  const [nlqAnswer, setNlqAnswer] = useState(null)
  const [isQuerying, setIsQuerying] = useState(false)

  // Data States
  const [pipelines, setPipelines] = useState(INITIAL_DATA_PIPELINES)
  const [mdmRecords, setMdmRecords] = useState(INITIAL_MDM_RECORDS)
  const [models, setModels] = useState(INITIAL_PREDICTIVE_MODELS)

  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  // Handlers
  const handleRunNlq = (e) => {
    e.preventDefault()
    if (!nlqQuery.trim()) return

    setIsQuerying(true)
    setTimeout(() => {
      setIsQuerying(false)
      setNlqAnswer({
        query: nlqQuery,
        summary: `Analysis across ${currentDeptObj.name} and Enterprise Data Warehouse indicates a 8.4% variance against Q3 budget allocations.`,
        keyMetrics: [
          { label: 'Budget Utilization', value: '88.4%' },
          { label: 'Forecasted Variance', value: '-$34,200 (Under budget)' },
          { label: 'Confidence Score', value: '98.2%' }
        ],
        chartData: [
          { label: 'May', val: 68 },
          { label: 'Jun', val: 82 },
          { label: 'Jul', val: 88.4 }
        ],
        recommendation: 'Reallocate $15,000 under-utilized training reserves toward Q4 Cloud Infrastructure scaling.'
      })
      showSuccess('Natural Language Intelligence Query executed successfully!')
    }, 600)
  }

  const handleTriggerETL = (pipeName) => {
    showSuccess(`Manual ETL Pipeline Sync initiated for: ${pipeName}`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <PageHeader
        title="Enterprise Data Platform, BI & Predictive Intelligence"
        description={`Central data warehouse, star schemas, Master Data Management (MDM), predictive attrition & budget models, and AI natural language analytics.`}
        icon={Database}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('nlq')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Bot size={14} /> Ask Data Platform (AI Query)
            </button>
            <button
              onClick={() => showSuccess('Exporting Executive BI Report Pack (PDF)...')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export BI Pack
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Enterprise Data Hub', icon: Database },
          { id: 'warehouse', label: 'Data Warehouse & Lake', icon: Server, badge: pipelines.length },
          { id: 'mdm', label: 'Master Data (MDM)', icon: Layers, badge: mdmRecords.length },
          { id: 'catalog', label: 'Data Catalog & Lineage', icon: Table },
          { id: 'bi', label: 'Self-Service BI & Dashboards', icon: BarChart3 },
          { id: 'predictive', label: 'Predictive & Prescriptive AI', icon: TrendingUp },
          { id: 'nlq', label: 'Natural Language Analytics', icon: Bot },
          { id: 'mlstudio', label: 'Machine Learning Studio', icon: Cpu, badge: models.length },
          { id: 'quality', label: 'Data Quality & Governance', icon: ShieldCheck }
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

      {/* TAB 1: ENTERPRISE DATA HUB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Database}
              label="Data Platform Storage Volume"
              value="4.2 TB"
              color="indigo"
            />
            <StatCard
              icon={Activity}
              label="Records Ingested (24h)"
              value="210,560"
              color="emerald"
            />
            <StatCard
              icon={ShieldCheck}
              label="Overall Data Quality Score"
              value="98.8%"
              color="purple"
            />
            <StatCard
              icon={Cpu}
              label="Active ML Models"
              value={`${models.length} Deployed`}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Ingestion Pipelines */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Server size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Enterprise Ingestion Pipelines & ETL Health
                  </h3>
                  <button onClick={() => setActiveTab('warehouse')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Pipelines ({pipelines.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {pipelines.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.id}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Source: {p.source} → Dest: {p.destination} • Type: {p.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-[11px]">
                          <span className="text-emerald-600 font-bold block">Quality: {p.qualityScore}</span>
                          <span className="text-slate-400">{p.recordsProcessed24h} recs/24h</span>
                        </div>
                        <button
                          onClick={() => handleTriggerETL(p.name)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={12} /> Sync Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Predictive Insight Highlights */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                  Active ML Predictive Models
                </h3>
                <div className="space-y-3 text-xs">
                  {models.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">Accuracy {m.accuracy}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{m.forecastInsight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NATURAL LANGUAGE ANALYTICS */}
      {activeTab === 'nlq' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Natural Language Business Intelligence (NLQ)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ask plain-English questions across HR, Payroll, Budget, Fleet, and Procurement warehouse data.</p>
              </div>
            </div>

            <form onSubmit={handleRunNlq} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <input
                  className="input text-sm py-2.5"
                  placeholder="e.g. Which department exceeded budget in Q2? or Show engineering turnover trends..."
                  value={nlqQuery}
                  onChange={(e) => setNlqQuery(e.target.value)}
                />
                <button type="submit" disabled={isQuerying} className="btn-primary text-xs py-2 px-5 shrink-0 flex items-center gap-1.5 cursor-pointer">
                  {isQuerying ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Query Data
                </button>
              </div>
            </form>

            {nlqAnswer && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Query Result Summary</span>
                  <span className="text-[10px] text-slate-400 font-mono">SQL Exec Time: 18ms</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{nlqAnswer.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {nlqAnswer.keyMetrics.map((km, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{km.label}</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white block">{km.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 space-y-1">
                  <span className="font-bold block">AI Prescriptive Recommendation:</span>
                  <p className="text-[11px]">{nlqAnswer.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER DATA MANAGEMENT */}
      {activeTab === 'mdm' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Master Data Management (MDM) Golden Records</h3>
            <div className="space-y-4 text-xs">
              {mdmRecords.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{m.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                      Completeness: {m.completeness}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{m.entity}</h4>
                  <p className="text-slate-400 text-[11px]">Domain: {m.domain} • Data Steward: {m.steward}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold mr-2">Synchronized Source Systems:</span>
                    {m.sourceSystems.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
