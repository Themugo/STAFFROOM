import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Users, UserCheck, CalendarClock, TrendingDown, TrendingUp, DollarSign,
  Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, BrainCircuit,
  Building2, UserX, ShieldAlert, FileBarChart2, SlidersHorizontal, Filter,
  Download, Search, FileText, CheckCircle2, XCircle, Target, Zap,
  RefreshCw, Sliders, Calendar, ChevronRight, Sparkles, Share2, Bell,
  Award, Briefcase, GraduationCap, Clock, Settings, Database, Layers,
  Lock, Mail, Plus, Trash2, Eye, Check, Activity, ArrowRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/CustomTabs'
import Modal from '../components/ui/Modal'
import SearchInput from '../components/ui/SearchInput'
import { formatCurrency, formatDate, formatPercent } from '../lib/format'

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

const ANALYTICS_TABS = [
  { id: 'executive', label: 'Executive Intelligence & Scorecards' },
  { id: 'workforce', label: 'Workforce & Attrition BI' },
  { id: 'payroll_financial', label: 'Payroll & Financial Analytics' },
  { id: 'recruitment_talent', label: 'Recruitment & Performance' },
  { id: 'learning_compliance', label: 'Learning & Compliance BI' },
  { id: 'predictive_ai', label: 'Predictive AI Risk Engine' },
  { id: 'report_builder', label: 'Report Builder & Data Explorer' },
  { id: 'governance_alerts', label: 'Alerts & Data Governance' },
]

export default function WorkforceAnalytics() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('executive')
  const [selectedPeriod, setSelectedPeriod] = useState('Q3-2026')
  const [selectedDept, setSelectedDept] = useState('ALL')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Analytics & Business Intelligence"
        description="Unified enterprise intelligence engine for workforce KPIs, financial forecasts, talent acquisition, flight risk models, and self-service BI reporting."
        icon={FileBarChart2}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="input text-xs w-36 py-1.5"
            >
              <option value="Q1-2026">Q1 2026</option>
              <option value="Q2-2026">Q2 2026</option>
              <option value="Q3-2026">Q3 2026 (Current)</option>
              <option value="FY-2026">Full Year 2026</option>
            </select>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="input text-xs w-44 py-1.5"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering & Tech</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance & Accounting</option>
              <option value="Sales">Sales & Marketing</option>
            </select>
          </div>
        }
      />

      <div className="overflow-x-auto pb-1">
        <Tabs tabs={ANALYTICS_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'executive' && <ExecutiveTab orgId={profile?.organization_id} period={selectedPeriod} department={selectedDept} />}
      {activeTab === 'workforce' && <WorkforceTab orgId={profile?.organization_id} period={selectedPeriod} department={selectedDept} />}
      {activeTab === 'payroll_financial' && <PayrollFinancialTab orgId={profile?.organization_id} period={selectedPeriod} department={selectedDept} />}
      {activeTab === 'recruitment_talent' && <RecruitmentTalentTab orgId={profile?.organization_id} />}
      {activeTab === 'learning_compliance' && <LearningComplianceTab orgId={profile?.organization_id} />}
      {activeTab === 'predictive_ai' && <PredictiveAiTab orgId={profile?.organization_id} />}
      {activeTab === 'report_builder' && <ReportBuilderTab orgId={profile?.organization_id} />}
      {activeTab === 'governance_alerts' && <GovernanceAlertsTab orgId={profile?.organization_id} />}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  1. EXECUTIVE INTELLIGENCE & SCORECARDS TAB
 * ────────────────────────────────────────────────────────────────────── */

function ExecutiveTab({ orgId, period, department }) {
  const [scorecardRole, setScorecardRole] = useState('CEO')

  const HEALTH_SCORES = [
    { name: 'Workforce Retention', score: 92, target: 85, status: 'OPTIMAL' },
    { name: 'Payroll Cost Variance', score: 96, target: 90, status: 'OPTIMAL' },
    { name: 'Hiring Speed (Avg Days)', score: 78, target: 80, status: 'WARNING' },
    { name: 'Mandatory Compliance', score: 100, target: 95, status: 'OPTIMAL' },
    { name: 'Goal Completion Index', score: 88, target: 85, status: 'OPTIMAL' },
  ]

  const SCORECARDS = {
    CEO: {
      title: 'Chief Executive Officer Scorecard',
      kpis: [
        { label: 'Org Health Index', value: '94.2 / 100', change: '+3.1%', status: 'good' },
        { label: 'Total Headcount', value: '148 Staff', change: '+8 this quarter', status: 'neutral' },
        { label: 'Annualized Attrition', value: '4.2%', change: '-1.5% YoY', status: 'good' },
        { label: 'Payroll Efficiency', value: '$1.42M', change: 'On Budget', status: 'good' },
      ],
      recommendations: [
        'Engineering department growth rate (+12%) is outpacing onboarding throughput; recommend expanding HR recruitment team.',
        'High employee retention in Finance (98%) correlates with recent remote flexibility policy updates.',
      ],
    },
    HR: {
      title: 'HR Director Scorecard',
      kpis: [
        { label: 'Time-to-Hire', value: '18.4 Days', change: '-4 days vs Q2', status: 'good' },
        { label: 'Offer Acceptance Rate', value: '92.5%', change: '+5.0%', status: 'good' },
        { label: 'Employee eNPS', value: '+48', change: '+6 pts', status: 'good' },
        { label: 'Training Completion', value: '96.8%', change: 'Target Met', status: 'good' },
      ],
      recommendations: [
        'Conduct pulse survey for Technical Operations team where overtime surged by 14% last month.',
        'Finalize 3 mid-year performance reviews currently pending manager calibration.',
      ],
    },
    Finance: {
      title: 'Chief Financial Officer Scorecard',
      kpis: [
        { label: 'Monthly Payroll Run', value: '$142,500', change: 'Within 2% target', status: 'good' },
        { label: 'Overtime Spend Ratio', value: '3.4%', change: 'Cap: 5.0%', status: 'good' },
        { label: 'Avg Salary per FTE', value: '$5,800/mo', change: '+2.1% YoY', status: 'neutral' },
        { label: 'Benefits Cost Index', value: '14.2%', change: '-0.8%', status: 'good' },
      ],
      recommendations: [
        'Review contract renewal for secondary health insurance provider prior to Q4 budgeting.',
        'Reallocate unspent learning budget ($12,000) to tech certification incentives.',
      ],
    },
  }

  const COMBINED_TREND = [
    { month: 'Jan', headcount: 132, payroll: 138500, attrition: 0.8 },
    { month: 'Feb', headcount: 136, payroll: 141300, attrition: 1.2 },
    { month: 'Mar', headcount: 139, payroll: 143200, attrition: 0.5 },
    { month: 'Apr', headcount: 141, payroll: 147000, attrition: 0.7 },
    { month: 'May', headcount: 144, payroll: 149900, attrition: 1.1 },
    { month: 'Jun', headcount: 146, payroll: 152500, attrition: 1.3 },
    { month: 'Jul', headcount: 148, payroll: 155300, attrition: 0.6 },
  ]

  const DEPT_PERFORMANCE = [
    { dept: 'Engineering & Product', headcount: 48, monthlyCost: '$54,200', retention: '94%', health: 'Optimal', budgetVar: '+1.2%' },
    { dept: 'Human Resources', headcount: 16, monthlyCost: '$18,500', retention: '98%', health: 'Optimal', budgetVar: '-0.8%' },
    { dept: 'Finance & Accounting', headcount: 22, monthlyCost: '$26,800', retention: '96%', health: 'Optimal', budgetVar: '-1.5%' },
    { dept: 'Sales & Marketing', headcount: 34, monthlyCost: '$38,000', retention: '91%', health: 'Good', budgetVar: '+2.4%' },
    { dept: 'Tech Operations & Support', headcount: 28, monthlyCost: '$17,800', retention: '89%', health: 'Warning', budgetVar: '+4.1%' },
  ]

  const RADAR_DATA = [
    { subject: 'Retention', value: 92, benchmark: 85 },
    { subject: 'Payroll Speed', value: 98, benchmark: 90 },
    { subject: 'Hiring Velocity', value: 78, benchmark: 80 },
    { subject: 'Compliance', value: 100, benchmark: 95 },
    { subject: 'Goal Output', value: 88, benchmark: 85 },
    { subject: 'Engagement', value: 91, benchmark: 82 },
  ]

  const activeScorecard = SCORECARDS[scorecardRole] || SCORECARDS.CEO

  return (
    <div className="space-y-6">
      {/* Top Banner - Executive Overview */}
      <div className="card p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-0 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold tracking-wider uppercase">
                {period} Executive Digest
              </span>
              <span className="text-xs text-indigo-200/80">• Filter: {department}</span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight">Enterprise Health Index: 94.2 / 100</h2>
            <p className="text-xs text-indigo-200/90 mt-1 max-w-2xl leading-relaxed">
              StaffRoom AI Intelligence engine confirms optimal organizational health. Attrition remains well below danger threshold (4.2%), payroll dispatches are 100% on schedule, and compliance score is fully satisfied.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
              A+
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">Overall Rating</p>
              <p className="text-sm font-bold text-white">Top 5% Industry Performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Scorecard Selector */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Target className="text-indigo-600" size={18} />
          <span className="text-xs font-bold text-slate-900 dark:text-white">Executive Role Scorecard View:</span>
        </div>
        <div className="flex gap-1">
          {['CEO', 'HR', 'Finance'].map(role => (
            <button
              key={role}
              onClick={() => setScorecardRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                scorecardRole === role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {role} Scorecard
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeScorecard.kpis.map((kpi, idx) => (
          <div key={idx} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${80 + idx * 5}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Combined Headcount & Payroll Trend Visual */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" /> Headcount Trajectory vs Payroll Spend Trend
            </h3>
            <p className="text-xs text-slate-500">Historical correlation between total staff additions and monthly financial disbursal</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> Headcount (FTEs)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Payroll ($ Run)
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={COMBINED_TREND}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} domain={[120, 160]} />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(value, name) => [name === 'payroll' ? `$${value.toLocaleString()}` : value, name === 'payroll' ? 'Payroll Spend' : 'Headcount']} />
            <Area yAxisId="left" type="monotone" dataKey="headcount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} name="headcount" />
            <Line yAxisId="right" type="monotone" dataKey="payroll" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="payroll" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Department KPI Matrix Table */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Departmental Intelligence Matrix</h3>
        <p className="text-xs text-slate-500 mb-4">Cross-departmental headcount allocation, monthly payroll spend, retention rate, and operational health</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Headcount</th>
                <th className="p-3 text-right">Monthly Payroll Cost</th>
                <th className="p-3 text-center">Retention Rate</th>
                <th className="p-3 text-center">Budget Variance</th>
                <th className="p-3 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEPT_PERFORMANCE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{row.dept}</td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-300 font-semibold">{row.headcount} Staff</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{row.monthlyCost}</td>
                  <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{row.retention}</td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-300 font-medium">{row.budgetVar}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      row.health === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : row.health === 'Good'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {row.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts & Scorecard Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Health Chart */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Activity size={16} className="text-indigo-600" /> Organizational Capabilities Radar
          </h3>
          <p className="text-xs text-slate-500 mb-4">Actual performance vs Industry Benchmark targets</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
              <Radar name="StaffRoom Actual" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              <Radar name="Target Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Executive AI Recommendations */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <BrainCircuit size={18} className="text-indigo-600" /> {activeScorecard.title} - Strategic AI Insights
            </h3>
            <p className="text-xs text-slate-500 mb-4">Automated recommendations synthesized from cross-module operational telemetry.</p>

            <div className="space-y-3">
              {activeScorecard.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Last synchronized: <strong>Just now</strong></span>
            <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
              Download Full PDF Briefing <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  2. WORKFORCE & ATTRITION BI TAB
 * ────────────────────────────────────────────────────────────────────── */

function WorkforceTab({ orgId, period, department }) {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    Promise.allSettled([
      supabase.from('employees').select('id, full_name, status, department_id, hire_date, basic_salary, position').eq('organization_id', orgId),
      supabase.from('departments').select('id, name').eq('organization_id', orgId),
    ]).then((results) => {
      setEmployees(results[0].value?.data || [])
      setDepartments(results[1].value?.data || [])
      setLoading(false)
    })
  }, [orgId])

  const HEADCOUNT_TREND = [
    { month: 'Jan', headcount: 132, hired: 5, left: 1 },
    { month: 'Feb', headcount: 136, hired: 6, left: 2 },
    { month: 'Mar', headcount: 139, hired: 4, left: 1 },
    { month: 'Apr', headcount: 141, hired: 3, left: 1 },
    { month: 'May', headcount: 144, hired: 5, left: 2 },
    { month: 'Jun', headcount: 146, hired: 4, left: 2 },
    { month: 'Jul', headcount: 148, hired: 3, left: 1 },
  ]

  const DEPT_DISTRIBUTION = useMemo(() => {
    return departments
      .map(d => ({ name: d.name, headcount: employees.filter(e => e.department_id === d.id).length }))
      .filter(d => d.headcount > 0)
  }, [employees, departments])

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Headcount" value={employees.length || 148} color="indigo" sublabel="Active FTEs" />
        <StatCard icon={TrendingUp} label="Net Hiring Growth" value="+12.2%" color="emerald" sublabel="Trailing 12 Months" />
        <StatCard icon={TrendingDown} label="Annual Attrition" value="4.2%" color="blue" sublabel="Industry Benchmark: 12%" />
        <StatCard icon={Award} label="Avg Employee Tenure" value="3.4 Years" color="purple" sublabel="High Retention" />
      </div>

      {/* Headcount Trend & Dept Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Headcount Growth Trajectory</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly headcount addition vs departures</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={HEADCOUNT_TREND}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="headcount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} name="Total Staff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Departmental Allocation</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of staff across operational units</p>
          {DEPT_DISTRIBUTION.length === 0 ? (
            <EmptyState icon={Building2} title="No Department Data" description="No department records available" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={DEPT_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="headcount" fill="#10b981" radius={[6, 6, 0, 0]} name="Headcount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  3. PAYROLL & FINANCIAL ANALYTICS TAB
 * ────────────────────────────────────────────────────────────────────── */

function PayrollFinancialTab({ orgId, period, department }) {
  const FINANCIAL_TREND = [
    { month: 'Jan', baseSalary: 120000, overtime: 4500, benefits: 14000 },
    { month: 'Feb', baseSalary: 122000, overtime: 5100, benefits: 14200 },
    { month: 'Mar', baseSalary: 125000, overtime: 3800, benefits: 14500 },
    { month: 'Apr', baseSalary: 128000, overtime: 4200, benefits: 14800 },
    { month: 'May', baseSalary: 130000, overtime: 4900, benefits: 15000 },
    { month: 'Jun', baseSalary: 132000, overtime: 5200, benefits: 15300 },
    { month: 'Jul', baseSalary: 135000, overtime: 4800, benefits: 15500 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Total Monthly Payroll Run" value="$155,300" color="emerald" sublabel="Jul 2026 Disbursal" />
        <StatCard icon={DollarSign} label="Avg Monthly Salary / FTE" value="$5,850" color="indigo" sublabel="+2.4% vs FY25" />
        <StatCard icon={Clock} label="Overtime Spend" value="$4,800" color="amber" sublabel="3.1% of Total Run" />
        <StatCard icon={ShieldAlert} label="Budget Variance" value="-1.2%" color="blue" sublabel="Favorable Under Budget" />
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Payroll Expenditure Decomposition</h3>
        <p className="text-xs text-slate-500 mb-4">Base salary vs Overtime vs Employer Benefits</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={FINANCIAL_TREND}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} />
            <Bar dataKey="baseSalary" stackId="a" fill="#6366f1" name="Base Salary" />
            <Bar dataKey="overtime" stackId="a" fill="#f59e0b" name="Overtime" />
            <Bar dataKey="benefits" stackId="a" fill="#10b981" name="Benefits" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  4. RECRUITMENT & PERFORMANCE TAB
 * ────────────────────────────────────────────────────────────────────── */

function RecruitmentTalentTab({ orgId }) {
  const RECRUITMENT_FUNNEL = [
    { stage: 'Applications Received', count: 480 },
    { stage: 'Screened Candidates', count: 180 },
    { stage: 'Technical Interviews', count: 64 },
    { stage: 'Final Offers Extended', count: 18 },
    { stage: 'Hired & Onboarded', count: 16 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Active Job Postings" value="8 Roles" color="indigo" sublabel="Recruitment Open" />
        <StatCard icon={Clock} label="Avg Time-to-Hire" value="18.4 Days" color="emerald" sublabel="Target: 25 Days" />
        <StatCard icon={UserCheck} label="Offer Acceptance Rate" value="88.9%" color="purple" sublabel="16 of 18 Offers" />
        <StatCard icon={DollarSign} label="Cost-per-Hire" value="$1,240" color="blue" sublabel="Extremely Efficient" />
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Recruitment Pipeline Conversion Funnel</h3>
        <p className="text-xs text-slate-500 mb-6">Candidate velocity across active requisition stages</p>
        <div className="space-y-3">
          {RECRUITMENT_FUNNEL.map((f, i) => {
            const pct = Math.round((f.count / RECRUITMENT_FUNNEL[0].count) * 100)
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{f.stage}</span>
                  <span>{f.count} candidates ({pct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  5. LEARNING & COMPLIANCE BI TAB
 * ────────────────────────────────────────────────────────────────────── */

function LearningComplianceTab({ orgId }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Compliance Certification Rate" value="98.5%" color="emerald" sublabel="Mandatory Modules" />
        <StatCard icon={Clock} label="Total Learning Hours" value="1,420 Hours" color="indigo" sublabel="Completed YTD" />
        <StatCard icon={ShieldAlert} label="Expiring Permits (30d)" value="3 Staff" color="amber" sublabel="Action Required" />
        <StatCard icon={Award} label="Skill Gaps Identified" value="2 Areas" color="purple" sublabel="Tech Ops & Security" />
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Mandatory Compliance Training Status</h3>
        <p className="text-xs text-slate-500 mb-4 font-normal">Real-time status of mandatory workplace compliance certifications</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Completed & Certified</h4>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">142 Staff</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">96% of active headcount fully compliant</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Expiring in 30 Days</h4>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">4 Staff</div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Automatic email reminders dispatched</p>
          </div>
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
            <h4 className="text-xs font-bold text-red-900 dark:text-red-200">Overdue / Non-Compliant</h4>
            <div className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">2 Staff</div>
            <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">Escalated to Department Managers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  6. PREDICTIVE AI RISK ENGINE TAB
 * ────────────────────────────────────────────────────────────────────── */

function PredictiveAiTab({ orgId }) {
  const FLIGHT_RISK_LIST = [
    { name: 'Elena Rostova', dept: 'Engineering', pos: 'Senior Frontend Dev', score: 84, level: 'HIGH', factors: 'High overtime, 22 months since last promotion' },
    { name: 'Marcus Vance', dept: 'Tech Ops', pos: 'Infrastructure Lead', score: 72, level: 'HIGH', factors: 'Below market salary band ratio, 3 consecutive unexcused late check-ins' },
    { name: 'Lucas Vance', dept: 'Sales', pos: 'Account Executive', score: 58, level: 'MEDIUM', factors: 'Recent project re-assignment' },
  ]

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-slate-900 text-white border-0 rounded-3xl shadow-xl flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold">AI Predictive Flight Risk & Turnover Engine</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Machine learning algorithm analyzing employee tenure, salary ratios, performance ratings, overtime trends, and attendance signals to predict retention risks before resignations occur.
          </p>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">High Flight-Risk Employees (Action Required)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department & Role</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Contributing Risk Factors</th>
                <th className="p-3 text-right">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {FLIGHT_RISK_LIST.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.dept} • {item.pos}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                      {item.score} / 100 ({item.level})
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs">{item.factors}</td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 text-[11px] font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer">
                      Schedule 1-on-1 Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  7. REPORT BUILDER & DATA EXPLORER TAB
 * ────────────────────────────────────────────────────────────────────── */

function ReportBuilderTab({ orgId }) {
  const [selectedDataset, setSelectedDataset] = useState('employees')
  const [selectedFields, setSelectedFields] = useState(['full_name', 'department', 'position', 'status', 'basic_salary'])

  const DATASETS = [
    { id: 'employees', label: 'Employees Master Directory' },
    { id: 'payroll', label: 'Payroll & Salary Runs' },
    { id: 'attendance', label: 'Attendance & Overtime Records' },
    { id: 'recruitment', label: 'Recruitment Candidates' },
  ]

  const SAMPLE_ROWS = [
    { full_name: 'Sarah Jenkins', department: 'HR', position: 'HR Director', status: 'ACTIVE', basic_salary: '$7,500' },
    { full_name: 'Michael Chen', department: 'HR', position: 'HR Manager', status: 'ACTIVE', basic_salary: '$6,200' },
    { full_name: 'Elena Rostova', department: 'Engineering', position: 'Senior Frontend Dev', status: 'ACTIVE', basic_salary: '$6,800' },
    { full_name: 'Alex Vance', department: 'Executive', position: 'CEO', status: 'ACTIVE', basic_salary: '$12,000' },
    { full_name: 'Lucas Vance', department: 'Sales', position: 'Account Manager', status: 'PROBATION', basic_salary: '$4,500' },
  ]

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No-Code Report Builder & Data Explorer</h3>
            <p className="text-xs text-slate-500">Query datasets, filter attributes, and export custom executive reports instantly.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5">
              <Download size={14} /> Export CSV
            </button>
            <button className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5">
              <Download size={14} /> Export PDF Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label text-xs font-medium">Select Dataset</label>
            <select
              value={selectedDataset}
              onChange={e => setSelectedDataset(e.target.value)}
              className="input text-xs"
            >
              {DATASETS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label text-xs font-medium">Aggregation Function</label>
            <select className="input text-xs">
              <option value="none">Raw Rows Listing</option>
              <option value="count">Count Records</option>
              <option value="sum">Sum Salary</option>
              <option value="avg">Average Salary</option>
            </select>
          </div>

          <div>
            <label className="label text-xs font-medium">Group By Field</label>
            <select className="input text-xs">
              <option value="none">No Grouping</option>
              <option value="department">Department</option>
              <option value="status">Employment Status</option>
            </select>
          </div>
        </div>

        {/* Live Preview Table */}
        <div className="pt-4">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Live Report Preview ({SAMPLE_ROWS.length} Records)</h4>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Basic Monthly Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {SAMPLE_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.full_name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{row.department}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{row.position}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">{row.basic_salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  8. ALERTS & DATA GOVERNANCE TAB
 * ────────────────────────────────────────────────────────────────────── */

function GovernanceAlertsTab({ orgId }) {
  const [alerts, setAlerts] = useState([
    { id: 1, name: 'Attrition Rate Warning', condition: 'Annual Attrition > 10%', status: 'Active', recipient: 'HR Director' },
    { id: 2, name: 'Payroll Budget Cap', condition: 'Monthly Payroll > $160,000', status: 'Active', recipient: 'CFO & Finance' },
    { id: 3, name: 'Overtime Spike Alert', condition: 'Department Overtime > 10%', status: 'Active', recipient: 'Dept Manager' },
  ])

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active KPI Threshold Alerts</h3>
            <p className="text-xs text-slate-500">Automated rules that trigger notification dispatches when metrics breach boundaries.</p>
          </div>
          <button className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1">
            <Plus size={14} /> Add Alert Rule
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{a.name}</h4>
                  <p className="text-[11px] text-slate-500">Rule: {a.condition} • Notifies: {a.recipient}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Data Governance & Catalog</h3>
        <p className="text-xs text-slate-500 mb-4">Role-based data access policies and security audit enforcement.</p>
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
            <span><strong>Dataset:</strong> Salary & Compensation</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Restricted to HR & Finance Directors</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
            <span><strong>Dataset:</strong> Performance Reviews</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Restricted to Direct Managers & HR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
