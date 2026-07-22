import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Users, UserCheck, CalendarClock, TrendingDown, DollarSign,
  Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, BrainCircuit,
  Building2, UserX, ShieldAlert,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/Tabs'
import { formatCurrency, formatDate, formatPercent } from '../lib/format'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attrition', label: 'Attrition' },
  { id: 'cost', label: 'Cost' },
  { id: 'risk', label: 'Risk' },
]

export default function WorkforceAnalytics() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      <PageHeader
        title="Workforce Analytics"
        description="Insights into your organization's workforce, attrition, costs, and risk"
        icon={Users}
      />

      <div className="mb-6">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'overview' && <OverviewTab orgId={profile?.organization_id} />}
      {activeTab === 'attrition' && <AttritionTab orgId={profile?.organization_id} />}
      {activeTab === 'cost' && <CostTab orgId={profile?.organization_id} />}
      {activeTab === 'risk' && <RiskTab orgId={profile?.organization_id} />}
    </div>
  )
}

/* ============================
   Overview Tab
   ============================ */
function OverviewTab({ orgId }) {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leave, setLeave] = useState([])

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    const since = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]

    Promise.allSettled([
      supabase.from('employees').select('id, full_name, status, department_id, hire_date').eq('organization_id', orgId),
      supabase.from('departments').select('id, name').eq('organization_id', orgId),
      supabase.from('attendance').select('employee_id, date, check_in, check_out').eq('organization_id', orgId).gte('date', since),
      supabase.from('leave_requests').select('id, status, employee_id, start_date, end_date').eq('organization_id', orgId).gte('start_date', since),
    ]).then((results) => {
      setEmployees(results[0].value?.data || [])
      setDepartments(results[1].value?.data || [])
      setAttendance(results[2].value?.data || [])
      setLeave(results[3].value?.data || [])
      setLoading(false)
    })
  }, [orgId])

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const active = employees.filter((e) => e.status === 'ACTIVE').length
    const onLeaveToday = leave.filter(
      (l) => l.status === 'APPROVED' && l.start_date <= today && l.end_date >= today
    ).length

    const twelveMonthsAgo = new Date(Date.now() - 365 * 86400000).toISOString()
    const departed = employees.filter(
      (e) => (e.status === 'TERMINATED' || e.status === 'RESIGNED') && e.hire_date && new Date(e.hire_date) >= new Date(twelveMonthsAgo)
    ).length
    const attritionRate = employees.length > 0 ? (departed / employees.length) * 100 : 0

    return { headcount: employees.length, active, onLeaveToday, attritionRate }
  }, [employees, leave])

  const deptDistribution = useMemo(() => {
    return departments
      .map((d) => ({ name: d.name, value: employees.filter((e) => e.department_id === d.id).length }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [employees, departments])

  const statusDistribution = useMemo(() => {
    const statuses = ['ACTIVE', 'PROBATION', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED']
    return statuses
      .map((s) => ({ name: s.replace('_', ' '), value: employees.filter((e) => e.status === s).length }))
      .filter((s) => s.value > 0)
  }, [employees])

  if (loading) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Headcount" value={stats.headcount} color="blue" sublabel="Total employees" />
        <StatCard icon={UserCheck} label="Active Employees" value={stats.active} color="green" sublabel="Currently active" />
        <StatCard icon={CalendarClock} label="On Leave Today" value={stats.onLeaveToday} color="yellow" sublabel="Approved leave" />
        <StatCard icon={TrendingDown} label="Attrition Rate" value={formatPercent(stats.attritionRate)} color="red" sublabel="Last 12 months" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department distribution */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Department Distribution</h3>
          {deptDistribution.length === 0 ? (
            <EmptyState icon={Building2} title="No departments" description="No employee department data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {deptDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status distribution */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Employee Status Distribution</h3>
          {statusDistribution.length === 0 ? (
            <EmptyState icon={Users} title="No data" description="No employee status data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {statusDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {statusDistribution.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {statusDistribution.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================
   Attrition Tab
   ============================ */
function AttritionTab({ orgId }) {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    Promise.allSettled([
      supabase
        .from('employees')
        .select('id, full_name, status, department_id, hire_date, basic_salary, position')
        .eq('organization_id', orgId),
      supabase.from('departments').select('id, name').eq('organization_id', orgId),
    ]).then((results) => {
      setEmployees(results[0].value?.data || [])
      setDepartments(results[1].value?.data || [])
      setLoading(false)
    })
  }, [orgId])

  const attritionData = useMemo(() => {
    const twelveMonthsAgo = new Date(Date.now() - 365 * 86400000)
    const departedStatuses = ['TERMINATED', 'RESIGNED']
    const departed = employees.filter(
      (e) => departedStatuses.includes(e.status) && e.hire_date && new Date(e.hire_date) >= twelveMonthsAgo
    )
    const total = employees.length
    const rate = total > 0 ? (departed.length / total) * 100 : 0

    const byDept = departments
      .map((d) => {
        const deptEmployees = employees.filter((e) => e.department_id === d.id)
        const deptDeparted = deptEmployees.filter(
          (e) => departedStatuses.includes(e.status) && e.hire_date && new Date(e.hire_date) >= twelveMonthsAgo
        )
        return {
          name: d.name,
          departed: deptDeparted.length,
          total: deptEmployees.length,
          rate: deptEmployees.length > 0 ? (deptDeparted.length / deptEmployees.length) * 100 : 0,
        }
      })
      .filter((d) => d.total > 0)
      .sort((a, b) => b.rate - a.rate)

    return { departed, total, rate, byDept }
  }, [employees, departments])

  const insight = useMemo(() => {
    const { rate, departed, byDept, total } = attritionData
    if (total === 0) return 'No employee data available to calculate attrition.'
    const highestDept = byDept[0]
    const parts = []
    parts.push(`Your organization's 12-month attrition rate is ${rate.toFixed(1)}%, with ${departed.length} departures out of ${total} total employees.`)
    if (rate > 20) {
      parts.push('This is above the recommended 20% threshold — consider reviewing retention strategies.')
    } else if (rate > 10) {
      parts.push('This is within a moderate range — monitor trends closely.')
    } else {
      parts.push('This is below the 10% threshold, indicating healthy retention.')
    }
    if (highestDept && highestDept.rate > 0) {
      parts.push(`The ${highestDept.name} department has the highest attrition rate at ${highestDept.rate.toFixed(1)}%.`)
    }
    return parts.join(' ')
  }, [attritionData])

  if (loading) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingDown} label="Attrition Rate" value={formatPercent(attritionData.rate)} color="red" sublabel="Last 12 months" />
        <StatCard icon={UserX} label="Departed" value={attritionData.departed.length} color="yellow" sublabel="Employees who left" />
        <StatCard icon={Users} label="Total Headcount" value={attritionData.total} color="blue" sublabel="All employees" />
        <StatCard icon={Building2} label="Highest Attrition Dept" value={attritionData.byDept[0]?.name || '—'} color="purple" sublabel={attritionData.byDept[0] ? formatPercent(attritionData.byDept[0].rate) : 'No data'} />
      </div>

      {/* AI Insight */}
      <div className="card p-6 border-l-4 border-l-brand-500">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Insight</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{insight}</p>
          </div>
        </div>
      </div>

      {/* Attrition by department chart */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Attrition by Department</h3>
        {attritionData.byDept.length === 0 ? (
          <EmptyState icon={Building2} title="No attrition data" description="No department attrition data available" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attritionData.byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="departed" name="Departed" radius={[4, 4, 0, 0]} fill="#ef4444" />
              <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* List of departed employees */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Employees Who Left (Last 12 Months)</h3>
        {attritionData.departed.length === 0 ? (
          <EmptyState icon={UserCheck} title="No departures" description="No employees have left in the last 12 months" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Position</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Hire Date</th>
                  <th className="pb-3 pr-4 font-medium">Salary</th>
                </tr>
              </thead>
              <tbody>
                {attritionData.departed.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{e.full_name}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{e.position || '—'}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-600 dark:bg-danger-900/40 dark:text-danger-400">
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formatDate(e.hire_date)}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formatCurrency(e.basic_salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================
   Cost Tab
   ============================ */
function CostTab({ orgId }) {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    Promise.allSettled([
      supabase.from('employees').select('id, full_name, basic_salary, department_id, status').eq('organization_id', orgId),
      supabase.from('departments').select('id, name').eq('organization_id', orgId),
    ]).then((results) => {
      setEmployees(results[0].value?.data || [])
      setDepartments(results[1].value?.data || [])
      setLoading(false)
    })
  }, [orgId])

  const costData = useMemo(() => {
    const salaried = employees.filter((e) => e.basic_salary != null && e.basic_salary > 0)
    const totalMonthly = salaried.reduce((sum, e) => sum + Number(e.basic_salary), 0)
    const avgSalary = salaried.length > 0 ? totalMonthly / salaried.length : 0

    const byDept = departments
      .map((d) => {
        const deptEmployees = employees.filter((e) => e.department_id === d.id && e.basic_salary != null)
        const total = deptEmployees.reduce((sum, e) => sum + Number(e.basic_salary), 0)
        const avg = deptEmployees.length > 0 ? total / deptEmployees.length : 0
        return { name: d.name, total, avg, count: deptEmployees.length }
      })
      .filter((d) => d.count > 0)
      .sort((a, b) => b.total - a.total)

    const highestDept = byDept[0]
    const lowestDept = byDept[byDept.length - 1]

    return { totalMonthly, avgSalary, byDept, highestDept, lowestDept, salariedCount: salaried.length }
  }, [employees, departments])

  if (loading) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Total Monthly Cost" value={formatCurrency(costData.totalMonthly)} color="blue" sublabel={`${costData.salariedCount} salaried employees`} />
        <StatCard icon={DollarSign} label="Average Salary" value={formatCurrency(costData.avgSalary)} color="green" sublabel="Per employee per month" />
        <StatCard icon={ArrowUpRight} label="Highest Paid Dept" value={costData.highestDept?.name || '—'} color="purple" sublabel={costData.highestDept ? formatCurrency(costData.highestDept.avg) : 'No data'} />
        <StatCard icon={ArrowDownRight} label="Lowest Paid Dept" value={costData.lowestDept?.name || '—'} color="cyan" sublabel={costData.lowestDept ? formatCurrency(costData.lowestDept.avg) : 'No data'} />
      </div>

      {/* Salary cost by department */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Salary Cost by Department</h3>
        {costData.byDept.length === 0 ? (
          <EmptyState icon={DollarSign} title="No salary data" description="No salary cost data available" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={costData.byDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v).replace('KSh ', '')}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [formatCurrency(value), 'Monthly Cost']}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {costData.byDept.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Department salary breakdown table */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Department Salary Breakdown</h3>
        {costData.byDept.length === 0 ? (
          <EmptyState icon={Building2} title="No data" description="No department salary data available" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Department</th>
                  <th className="pb-3 pr-4 font-medium">Employees</th>
                  <th className="pb-3 pr-4 font-medium">Total Monthly</th>
                  <th className="pb-3 pr-4 font-medium">Average Salary</th>
                </tr>
              </thead>
              <tbody>
                {costData.byDept.map((d) => (
                  <tr key={d.name} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{d.name}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{d.count}</td>
                    <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">{formatCurrency(d.total)}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formatCurrency(d.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================
   Risk Tab
   ============================ */
function RiskTab({ orgId }) {
  const [loading, setLoading] = useState(true)
  const [riskScores, setRiskScores] = useState([])
  const [employees, setEmployees] = useState([])
  const [tableExists, setTableExists] = useState(true)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)

    async function load() {
      try {
        const [riskRes, empRes] = await Promise.allSettled([
          supabase.from('employee_risk_scores').select('id, employee_id, risk_level, score, factors, created_at').eq('organization_id', orgId),
          supabase.from('employees').select('id, full_name, department_id, position, status').eq('organization_id', orgId),
        ])

        // If the table doesn't exist, we get a specific error
        if (riskRes.reason?.code === '42P01' || riskRes.value?.error?.message?.includes('does not exist')) {
          setTableExists(false)
          setRiskScores([])
        } else {
          setRiskScores(riskRes.value?.data || [])
          setTableExists(true)
        }
        setEmployees(empRes.value?.data || [])
      } catch (err) {
        setTableExists(false)
        setRiskScores([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [orgId])

  const riskData = useMemo(() => {
    const levels = ['HIGH', 'MEDIUM', 'LOW']
    const distribution = levels
      .map((level) => ({
        name: level,
        value: riskScores.filter((r) => r.risk_level === level).length,
      }))
      .filter((d) => d.value > 0)

    const highRisk = riskScores
      .filter((r) => r.risk_level === 'HIGH')
      .map((r) => {
        const emp = employees.find((e) => e.id === r.employee_id)
        return {
          ...r,
          employee_name: emp?.full_name || 'Unknown',
          position: emp?.position || '—',
          status: emp?.status || '—',
        }
      })

    return { distribution, highRisk }
  }, [riskScores, employees])

  if (loading) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!tableExists || riskScores.length === 0) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={ShieldAlert}
          title="No Risk Data Available"
          description="The employee risk scores table is empty or hasn't been set up. Run a risk assessment to populate this tab with workforce risk insights."
        />
      </div>
    )
  }

  const riskColors = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="High Risk" value={riskData.highRisk.length} color="red" sublabel="Employees needing attention" />
        <StatCard icon={ShieldAlert} label="Medium Risk" value={riskData.distribution.find((d) => d.name === 'MEDIUM')?.value || 0} color="yellow" sublabel="Monitor closely" />
        <StatCard icon={UserCheck} label="Low Risk" value={riskData.distribution.find((d) => d.name === 'LOW')?.value || 0} color="green" sublabel="Stable employees" />
        <StatCard icon={Users} label="Total Assessed" value={riskScores.length} color="blue" sublabel="Risk evaluations" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Risk distribution pie chart */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData.distribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
              >
                {riskData.distribution.map((entry) => (
                  <Cell key={entry.name} fill={riskColors[entry.name] || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {riskData.distribution.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: riskColors[s.name] }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High risk summary */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Risk Summary</h3>
          <div className="space-y-4">
            {riskData.distribution.map((d) => {
              const pct = riskScores.length > 0 ? (d.value / riskScores.length) * 100 : 0
              return (
                <div key={d.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.name} Risk</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{d.value} ({formatPercent(pct)})</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: riskColors[d.name] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* High risk employees list */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">High-Risk Employees</h3>
        {riskData.highRisk.length === 0 ? (
          <EmptyState icon={UserCheck} title="No high-risk employees" description="All assessed employees are at medium or low risk" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Position</th>
                  <th className="pb-3 pr-4 font-medium">Risk Score</th>
                  <th className="pb-3 pr-4 font-medium">Factors</th>
                  <th className="pb-3 pr-4 font-medium">Assessed On</th>
                </tr>
              </thead>
              <tbody>
                {riskData.highRisk.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{r.employee_name}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{r.position}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-600 dark:bg-danger-900/40 dark:text-danger-400">
                        {r.score != null ? r.score : 'HIGH'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {r.factors || '—'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
