import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Clock, Calendar, DollarSign, UserCheck, AlertCircle,
  Building2, UserSearch, UserPlus, Shield, BarChart3,
  Award, Cake, Sparkles, BrainCircuit, Download, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, Legend,
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, formatDate } from '../lib/format'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function exportToCSV(filename, rows) {
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function RoleBasedDashboard() {
  const { profile } = useAuth()

  if (profile?.role === 'SYSTEM_OWNER') return <SystemOwnerDashboard />
  if (profile?.role === 'ADMIN') return <AdminDashboard />
  if (profile?.role === 'DEPARTMENT_ADMIN') return <DeptAdminDashboard />
  return <EmployeeDashboard />
}

function useDashboardData(orgId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled([
          supabase.from('employees').select('id, full_name, status, hire_date, department_id, basic_salary, gender, date_of_birth').eq('organization_id', orgId),
          supabase.from('departments').select('id, name').eq('organization_id', orgId),
          supabase.from('attendance').select('employee_id, date, check_in, check_out, method').eq('organization_id', orgId).gte('date', new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]),
          supabase.from('leave_requests').select('id, status, leave_type, employee_id, start_date, end_date').eq('organization_id', orgId),
          supabase.from('payroll_runs').select('id, name, status, total_gross, total_deductions, total_net, period_start, period_end').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(5),
          supabase.from('vacancies').select('id, title, status, department_id').eq('organization_id', orgId),
          supabase.from('applications').select('id, status, vacancy_id').eq('organization_id', orgId),
        ])

        const employees = results[0].value?.data || []
        const departments = results[1].value?.data || []
        const attendance = results[2].value?.data || []
        const leave = results[3].value?.data || []
        const payroll = results[4].value?.data || []
        const vacancies = results[5].value?.data || []
        const applications = results[6].value?.data || []

      const today = new Date().toISOString().split('T')[0]
      const onLeaveToday = leave.filter(l => l.status === 'APPROVED' && l.start_date <= today && l.end_date >= today)
      const presentToday = new Set(attendance.filter(a => a.date === today).map(a => a.employee_id))
      const absentToday = employees.filter(e => !presentToday.has(e.id) && e.status === 'ACTIVE')
      const lateThisWeek = attendance.filter(a => a.check_in && a.check_in > '09:00:00')
      const pendingLeave = leave.filter(l => l.status === 'PENDING')
      const openVacancies = vacancies.filter(v => v.status === 'OPEN')
      const hiredCount = applications.filter(a => a.status === 'HIRED').length
      const activeEmployees = employees.filter(e => e.status === 'ACTIVE')
      const onProbation = employees.filter(e => e.status === 'PROBATION')

      const deptDist = departments.map(d => ({ name: d.name, value: employees.filter(e => e.department_id === d.id).length })).filter(d => d.value > 0)
      const genderDist = [
        { name: 'Male', value: employees.filter(e => e.gender === 'M').length },
        { name: 'Female', value: employees.filter(e => e.gender === 'F').length },
      ].filter(g => g.value > 0)

      const attTrend = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
        const dayAtt = attendance.filter(a => a.date === d)
        attTrend.push({ date: d.slice(5), present: dayAtt.length, late: dayAtt.filter(a => a.check_in > '09:00:00').length })
      }

      const upcomingBirthdays = employees
        .filter(e => e.date_of_birth)
        .map(e => {
          const dob = new Date(e.date_of_birth)
          const next = new Date(new Date().getFullYear(), dob.getMonth(), dob.getDate())
          if (next < new Date()) next.setFullYear(next.getFullYear() + 1)
          return { name: e.full_name, date: next, daysUntil: Math.ceil((next - new Date()) / 86400000) }
        })
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5)

      const upcomingAnniversaries = employees
        .filter(e => e.hire_date)
        .map(e => {
          const hd = new Date(e.hire_date)
          const next = new Date(new Date().getFullYear(), hd.getMonth(), hd.getDate())
          if (next < new Date()) next.setFullYear(next.getFullYear() + 1)
          return { name: e.full_name, date: next, daysUntil: Math.ceil((next - new Date()) / 86400000), years: next.getFullYear() - hd.getFullYear() }
        })
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5)

      setData({
        employees, departments, attendance, leave, payroll, vacancies, applications,
        onLeaveToday, presentToday: presentToday.size, absentToday: absentToday.length,
        lateThisWeek: lateThisWeek.length, pendingLeave: pendingLeave.length,
        openVacancies: openVacancies.length, hiredCount, activeEmployees, onProbation,
        deptDist, genderDist, attTrend, upcomingBirthdays, upcomingAnniversaries,
        totalPayroll: payroll[0]?.total_net || 0,
      })
      } catch (err) {
        console.error('Dashboard data load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (orgId) load()
    else setLoading(false)
  }, [orgId])

  return { data, loading }
}

function AdminDashboard() {
  const { profile } = useAuth()
  const { data, loading } = useDashboardData(profile?.organization_id)

  if (loading || !data) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>

  const { employees, activeEmployees, onProbation, onLeaveToday, presentToday, absentToday,
    lateThisWeek, pendingLeave, openVacancies, hiredCount, deptDist, genderDist,
    attTrend, upcomingBirthdays, upcomingAnniversaries, payroll, totalPayroll } = data

  const handleExport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Employees', employees.length],
      ['Active Employees', activeEmployees.length],
      ['On Probation', onProbation.length],
      ['Present Today', presentToday],
      ['Absent Today', absentToday],
      ['On Leave Today', onLeaveToday.length],
      ['Late This Week', lateThisWeek],
      ['Pending Leave Requests', pendingLeave],
      ['Open Vacancies', openVacancies],
      ['Hired (Total)', hiredCount],
      ['Latest Payroll Net', totalPayroll],
    ]
    exportToCSV('hr-dashboard-summary.csv', rows)
  }

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time HR analytics and workforce insights"
        icon={BarChart3}
        actions={
          <button onClick={handleExport} className="btn-secondary">
            <Download size={18} /> Export
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Employees" value={employees.length} sublabel={`${activeEmployees.length} active`} color="blue" loading={loading} />
        <StatCard icon={UserCheck} label="Present Today" value={presentToday} sublabel={`${absentToday} absent`} color="green" trend={employees.length > 0 ? Math.round((presentToday / employees.length) * 100) - 85 : 0} />
        <StatCard icon={Calendar} label="On Leave Today" value={onLeaveToday.length} sublabel={`${pendingLeave} pending approval`} color="yellow" />
        <StatCard icon={DollarSign} label="Latest Payroll" value={formatCurrency(totalPayroll)} sublabel={payroll[0]?.name || 'No runs'} color="purple" />
      </div>

      {/* Proactive Alerts — What needs attention today */}
      {(pendingLeave > 0 || absentToday > 0 || onProbation.length > 0 || openVacancies > 0) && (
        <div className="card p-5 mb-6 border-l-4 border-l-amber-400 dark:border-l-amber-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">What Needs Your Attention</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pendingLeave > 0 && (
              <Link to="/leave" className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{pendingLeave} leave {pendingLeave === 1 ? 'request' : 'requests'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting approval</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
            )}
            {absentToday > 0 && (
              <Link to="/attendance" className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{absentToday} {absentToday === 1 ? 'employee' : 'employees'} absent</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No check-in today</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
            )}
            {onProbation.length > 0 && (
              <Link to="/employees" className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <UserCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{onProbation.length} on probation</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Review progress</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
            )}
            {openVacancies > 0 && (
              <Link to="/recruitment" className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <UserSearch size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{openVacancies} open {openVacancies === 1 ? 'position' : 'positions'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active recruitment</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attTrend}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
              <Area type="monotone" dataKey="present" stroke="#3b82f6" fill="url(#presentGrad)" strokeWidth={2} name="Present" />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="url(#lateGrad)" strokeWidth={2} name="Late" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Gender Diversity</h3>
          {genderDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {genderDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '13px' }} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No gender data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Department Distribution</h3>
          {deptDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '13px' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No departments</p>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cake size={18} className="text-warning-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Birthdays</h3>
          </div>
          <div className="space-y-3">
            {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(b => (
              <div key={b.name} className="flex items-center gap-3">
                <Avatar name={b.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{b.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(b.date)}</p>
                </div>
                <span className="text-xs text-gray-400">{b.daysUntil === 0 ? 'Today!' : `${b.daysUntil}d`}</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No birthdays</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Work Anniversaries</h3>
          </div>
          <div className="space-y-3">
            {upcomingAnniversaries.length > 0 ? upcomingAnniversaries.map(a => (
              <div key={a.name} className="flex items-center gap-3">
                <Avatar name={a.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.years} years — {formatDate(a.date)}</p>
                </div>
                <span className="text-xs text-gray-400">{a.daysUntil}d</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No anniversaries</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Payroll Runs</h3>
            <Link to="/payroll" className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {payroll.length > 0 ? payroll.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(p.period_start)} — {formatDate(p.period_end)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(p.total_net)}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No payroll runs</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <InsightCard
              icon={AlertCircle}
              color="yellow"
              title="Attendance Attention"
              message={`${absentToday} employees absent today and ${lateThisWeek} late arrivals this week. Consider follow-up.`}
            />
            <InsightCard
              icon={Calendar}
              color="blue"
              title="Pending Approvals"
              message={`${pendingLeave} leave requests awaiting approval. Review them to avoid delays.`}
            />
            <InsightCard
              icon={UserSearch}
              color="green"
              title="Recruitment Pipeline"
              message={`${openVacancies} open positions with ${data.applications.length} total applications. ${hiredCount} hired so far.`}
            />
            {onProbation.length > 0 && (
              <InsightCard
                icon={UserCheck}
                color="purple"
                title="Probation Tracking"
                message={`${onProbation.length} employees currently on probation. Review their progress.`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link to="/employees" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <UserPlus size={20} className="text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Add Employee</span>
            </Link>
            <Link to="/leave" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Review Leave</span>
            </Link>
            <Link to="/payroll" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <DollarSign size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Run Payroll</span>
            </Link>
            <Link to="/recruitment" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <UserSearch size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Recruit</span>
            </Link>
            <Link to="/announcements" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <Sparkles size={20} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Announce</span>
            </Link>
            <Link to="/ai-copilot" className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition">
              <BrainCircuit size={20} className="text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ask AI</span>
            </Link>
          </div>
        </div>

        <Link to="/ai-copilot" className="card-hover flex items-center gap-4 p-5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
            <BrainCircuit size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">Ask AI Copilot</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get instant answers about your workforce data</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-brand-600 transition" />
        </Link>
      </div>
    </div>
  )
}

function InsightCard({ icon: Icon, color, title, message }) {
  const colors = {
    blue: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    green: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    yellow: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
    red: 'bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{message}</p>
      </div>
    </div>
  )
}

function SystemOwnerDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ companies: 0, users: 0, admins: 0, employees: 0, pendingUsers: 0 })
  const [recentUsers, setRecentUsers] = useState([])
  const [roleDist, setRoleDist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled([
          supabase.from('profiles').select('id, full_name, role, created_at, must_change_password').order('created_at', { ascending: false }).limit(10),
          supabase.from('employees').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('role'),
          supabase.from('organizations').select('id, name, subscription_tier, status', { count: 'exact' }),
        ])

        const usersRes = results[0].value
        const empRes = results[1].value
        const profilesRes = results[2].value
        const orgRes = results[3].value

        const users = usersRes?.data || []
        const admins = users.filter(u => ['ADMIN', 'SYSTEM_OWNER', 'DEPARTMENT_ADMIN'].includes(u.role)).length
        const pendingUsers = users.filter(u => u.must_change_password).length

        setStats({
          companies: orgRes?.count || 0,
          users: profilesRes?.data?.length || 0,
          admins,
          employees: empRes?.count || 0,
          pendingUsers,
        })
        setRecentUsers(users)

        const roleCounts = {}
        profilesRes?.data?.forEach(p => { roleCounts[p.role] = (roleCounts[p.role] || 0) + 1 })
        setRoleDist(Object.entries(roleCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value })))
      } catch (err) {
        console.error('SystemOwner dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleExport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Organizations', stats.companies],
      ['Total Users', stats.users],
      ['Admin Users', stats.admins],
      ['Total Employees', stats.employees],
      ['Pending Password Changes', stats.pendingUsers],
    ]
    exportToCSV('platform-summary.csv', rows)
  }

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Manage your StaffRoom platform and client organizations"
        icon={Shield}
        actions={
          <>
            <button onClick={handleExport} className="btn-secondary"><Download size={18} /> Export</button>
            <Link to="/users" className="btn-primary"><UserPlus size={18} /> Manage Users</Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="Organizations" value={stats.companies} color="blue" loading={loading} />
        <StatCard icon={Users} label="Total Users" value={stats.users} sublabel={`${stats.admins} admins`} color="green" loading={loading} />
        <StatCard icon={UserCheck} label="Total Employees" value={stats.employees} color="purple" loading={loading} />
        <StatCard icon={AlertCircle} label="Pending Setup" value={stats.pendingUsers} sublabel="Password changes required" color="yellow" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Role Distribution</h3>
          {roleDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roleDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '13px' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar name={u.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{u.role?.toLowerCase().replace('_', ' ')}</p>
                </div>
                {u.must_change_password && <StatusBadge status="PENDING" label="Password" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeptAdminDashboard() {
  const { profile } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [empRes, leaveRes, attRes] = await Promise.allSettled([
          supabase.from('employees').select('id, full_name, status, department_id').eq('organization_id', profile?.organization_id),
          supabase.from('leave_requests').select('id, status, employee_id').eq('organization_id', profile?.organization_id),
          supabase.from('attendance').select('employee_id, date, check_in').eq('organization_id', profile?.organization_id).gte('date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
        ])

        setData({
          employees: empRes.value?.data || [],
          leave: leaveRes.value?.data || [],
          attendance: attRes.value?.data || [],
        })
      } catch (err) {
        console.error('DeptAdmin dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile?.organization_id) load()
    else setLoading(false)
  }, [profile?.organization_id])

  if (loading || !data) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>

  const pending = data.leave.filter(l => l.status === 'PENDING')
  const today = new Date().toISOString().split('T')[0]
  const presentToday = new Set(data.attendance.filter(a => a.date === today).map(a => a.employee_id)).size

  return (
    <div>
      <PageHeader title="Department Dashboard" description="Your team overview" icon={BarChart3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Team Members" value={data.employees.length} color="blue" />
        <StatCard icon={UserCheck} label="Present Today" value={presentToday} color="green" />
        <StatCard icon={Calendar} label="Pending Leave" value={pending.length} color="yellow" />
        <StatCard icon={Clock} label="Attendance (7d)" value={data.attendance.length} color="purple" />
      </div>
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pending Leave Approvals</h3>
        {pending.length > 0 ? (
          <div className="space-y-3">
            {pending.map(l => {
              const emp = data.employees.find(e => e.id === l.employee_id)
              return (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp?.full_name || '?'} size="sm" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{emp?.full_name || 'Unknown'}</span>
                  </div>
                  <Link to="/leave" className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400">Review</Link>
                </div>
              )
            })}
          </div>
        ) : <p className="text-sm text-gray-400 text-center py-4">No pending approvals</p>}
      </div>
    </div>
  )
}

function EmployeeDashboard() {
  const { profile } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data: emp } = await supabase.from('employees').select('*').eq('email', profile?.email).maybeSingle()
        const empId = emp?.id
        if (!empId) {
          setData({ employee: null, attendance: [], leave: [], payslips: [] })
          setLoading(false)
          return
        }
        const [attRes, leaveRes, payslipsRes] = await Promise.allSettled([
          supabase.from('attendance').select('*').eq('employee_id', empId).order('date', { ascending: false }).limit(7),
          supabase.from('leave_requests').select('*').eq('employee_id', empId).order('created_at', { ascending: false }).limit(5),
          supabase.from('payslips').select('*, payroll_runs(name, period_start, period_end)').eq('employee_id', empId).order('created_at', { ascending: false }).limit(3),
        ])

        setData({
          employee: emp,
          attendance: attRes.value?.data || [],
          leave: leaveRes.value?.data || [],
          payslips: payslipsRes.value?.data || [],
        })
      } catch (err) {
        console.error('Employee dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile) load()
    else setLoading(false)
  }, [profile])

  if (loading || !data) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div>
      <PageHeader title="My Dashboard" description="Your attendance, leave, and payroll overview" icon={BarChart3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock} label="Days Present (7d)" value={data.attendance.length} color="green" />
        <StatCard icon={Calendar} label="Leave Requests" value={data.leave.length} color="blue" />
        <StatCard icon={DollarSign} label="Payslips" value={data.payslips.length} color="purple" />
        <StatCard icon={UserCheck} label="Status" value={data.employee?.status || 'ACTIVE'} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            {data.attendance.length > 0 ? data.attendance.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm text-gray-900 dark:text-white">{formatDate(a.date)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{a.check_in?.slice(0, 5)} — {a.check_out?.slice(0, 5) || '—'}</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No attendance records</p>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Payslips</h3>
          <div className="space-y-3">
            {data.payslips.length > 0 ? data.payslips.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.payroll_runs?.name || 'Payroll'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(p.net_pay)}</p>
                </div>
                <StatusBadge status={p.payroll_runs?.status || 'PROCESSED'} />
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No payslips</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
