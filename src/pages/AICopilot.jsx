import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Sparkles, User, Bot, Lightbulb } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, formatDate } from '../lib/format'

const SUGGESTIONS = [
  { icon: '👥', text: 'How many employees do we have?' },
  { icon: '📅', text: 'Who is on leave today?' },
  { icon: '💰', text: 'Summarize the latest payroll run' },
  { icon: '⏰', text: 'Who was absent this week?' },
  { icon: '🎯', text: 'Show employees on probation' },
  { icon: '📊', text: 'What is our department distribution?' },
  { icon: '🎂', text: 'Any upcoming birthdays?' },
  { icon: '⚠️', text: 'Show attendance risk analysis' },
  { icon: '🏆', text: 'Who deserves a promotion?' },
  { icon: '📝', text: 'Draft a warning letter for poor attendance' },
  { icon: '💵', text: 'Suggest salary adjustments' },
  { icon: '🔥', text: 'Detect burnout risk' },
  { icon: '❓', text: 'Generate interview questions' },
  { icon: '🎓', text: 'Training recommendations' },
  { icon: '🧮', text: 'Cost per employee analysis' },
  { icon: '🔄', text: 'Show recruitment funnel' },
]

export default function AICopilot() {
  const { profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages, loading])

  async function processQuery(query) {
    const q = query.toLowerCase()
    const orgId = profile?.organization_id

    if (q.includes('how many employees') || q.includes('employee count') || q.includes('headcount')) {
      const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true }).eq('organization_id', orgId)
      return { text: `You currently have **${count}** employees on record.`, data: { count } }
    }

    if (q.includes('on leave') || q.includes('who is on leave')) {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('leave_requests')
        .select('employee:employees(full_name), leave_type, start_date, end_date')
        .eq('status', 'APPROVED')
        .lte('start_date', today)
        .gte('end_date', today)
        .eq('organization_id', orgId)
      if (!data?.length) return { text: 'No employees are on leave today.' }
      const list = data.map(l => `• **${l.employee?.full_name}** — ${l.leave_type} (${formatDate(l.start_date)} to ${formatDate(l.end_date)})`).join('\n')
      return { text: `Employees currently on leave:\n\n${list}` }
    }

    if (q.includes('payroll') || q.includes('salary summary')) {
      const { data } = await supabase
        .from('payroll_runs')
        .select('name, period_start, period_end, status, total_gross, total_deductions, total_net')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!data) return { text: 'No payroll runs found.' }
      return { text: `**${data.name}** (${formatDate(data.period_start)} — ${formatDate(data.period_end)})\n\n• Status: ${data.status}\n• Gross: ${formatCurrency(data.total_gross)}\n• Deductions: ${formatCurrency(data.total_deductions)}\n• Net Pay: ${formatCurrency(data.total_net)}` }
    }

    if (q.includes('absent') || q.includes('attendance') || q.includes('who was absent')) {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      const { data } = await supabase
        .from('attendance')
        .select('employee:employees(full_name), date, check_in, check_out, method')
        .eq('organization_id', orgId)
        .gte('date', weekAgo)
        .order('date', { ascending: false })
        .limit(20)
      if (!data?.length) return { text: 'No attendance records found for this week.' }
      const late = data.filter(a => a.check_in && a.check_in > '09:00:00')
      const list = data.slice(0, 10).map(a => `• ${formatDate(a.date)} — **${a.employee?.full_name}** — ${a.check_in || 'Absent'}${a.check_in > '09:00:00' ? ' (Late)' : ''}`).join('\n')
      return { text: `Recent attendance (last 7 days):\n\n${list}${late.length ? `\n\n**${late.length} late arrivals** detected.` : ''}` }
    }

    if (q.includes('probation')) {
      const { data } = await supabase
        .from('employees')
        .select('full_name, hire_date, status')
        .eq('status', 'PROBATION')
        .eq('organization_id', orgId)
      if (!data?.length) return { text: 'No employees are currently on probation.' }
      const list = data.map(e => `• **${e.full_name}** — Hired ${formatDate(e.hire_date)}`).join('\n')
      return { text: `Employees on probation:\n\n${list}` }
    }

    if (q.includes('department') || q.includes('departments')) {
      const { data: depts } = await supabase.from('departments').select('id, name').eq('organization_id', orgId)
      if (!depts?.length) return { text: 'No departments found.' }
      const counts = await Promise.all(depts.map(async d => {
        const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true }).eq('department_id', d.id)
        return { name: d.name, count: count || 0 }
      }))
      const list = counts.map(d => `• **${d.name}**: ${d.count} employees`).join('\n')
      return { text: `Department distribution:\n\n${list}` }
    }

    if (q.includes('birthday') || q.includes('birthdays')) {
      const { data } = await supabase.from('employees').select('full_name, date_of_birth').eq('organization_id', orgId).not('date_of_birth', 'is', null)
      if (!data?.length) return { text: 'No birthday information available.' }
      const now = new Date()
      const upcoming = data
        .map(e => {
          const dob = new Date(e.date_of_birth)
          const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
          if (next < now) next.setFullYear(now.getFullYear() + 1)
          return { name: e.full_name, date: next, daysUntil: Math.ceil((next - now) / 86400000) }
        })
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5)
      if (!upcoming.length) return { text: 'No upcoming birthdays.' }
      const list = upcoming.map(e => `• **${e.name}** — ${formatDate(e.date)} (${e.daysUntil} days)`).join('\n')
      return { text: `Upcoming birthdays:\n\n${list}` }
    }

    if (q.includes('risk') || q.includes('attrition') || q.includes('resignation')) {
      const { data } = await supabase
        .from('attendance')
        .select('employee:employees(full_name, department:departments(name))')
        .eq('organization_id', orgId)
        .gte('date', new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0])
      if (!data?.length) return { text: 'Not enough data for risk analysis.' }
      const counts = {}
      data.forEach(a => { const n = a.employee?.full_name; if (n) counts[n] = (counts[n] || 0) + 1 })
      const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1])
      const lowAttendance = sorted.slice(0, 5).map(([name, days]) => `• **${name}** — ${days} attendance records in 30 days`)
      return { text: `Attendance risk analysis (last 30 days):\n\nEmployees with lowest attendance:\n\n${lowAttendance.join('\n')}\n\nThese employees may need follow-up.` }
    }

    // ─── NEW: Who deserves promotion ───
    if (q.includes('promotion') || q.includes('deserve')) {
      // Get active employees with their performance reviews and attendance
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, hire_date, department:departments(name), position:positions(title)')
        .eq('status', 'ACTIVE')
        .eq('organization_id', orgId)

      if (!employees?.length) return { text: 'No active employees found.' }

      // Get performance reviews with rating >= 4
      const { data: reviews } = await supabase
        .from('performance_reviews')
        .select('employee_id, rating, review_period, review_date')
        .eq('organization_id', orgId)
        .gte('rating', 4)
        .order('review_date', { ascending: false })

      // Get attendance records for the last 90 days to calculate attendance rate
      const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0]
      const { data: attendance } = await supabase
        .from('attendance')
        .select('employee_id, date')
        .eq('organization_id', orgId)
        .gte('date', ninetyDaysAgo)

      // Build attendance counts per employee
      const attendanceCounts = {}
      attendance?.forEach(a => {
        attendanceCounts[a.employee_id] = (attendanceCounts[a.employee_id] || 0) + 1
      })

      // Build latest review per employee (rating >= 4)
      const topReviews = {}
      reviews?.forEach(r => {
        if (!topReviews[r.employee_id] || new Date(r.review_date) > new Date(topReviews[r.employee_id].review_date)) {
          topReviews[r.employee_id] = r
        }
      })

      // Calculate working days in last 90 days (~63)
      const workingDays = 63

      // Combine: employees with high review AND attendance rate > 90%
      const candidates = employees
        .map(e => {
          const review = topReviews[e.id]
          const attCount = attendanceCounts[e.id] || 0
          const attRate = (attCount / workingDays) * 100
          return {
            name: e.full_name,
            department: e.department?.name || '—',
            position: e.position?.title || '—',
            hireDate: e.hire_date,
            rating: review?.rating,
            reviewPeriod: review?.review_period,
            attendanceRate: attRate,
          }
        })
        .filter(e => e.rating && e.attendanceRate > 90)
        .sort((a, b) => b.rating - a.rating || b.attendanceRate - a.attendanceRate)
        .slice(0, 5)

      if (!candidates.length) return { text: 'No employees currently meet the promotion criteria (rating ≥ 4 and attendance > 90%).' }

      const list = candidates.map((e, i) => `**${i + 1}. ${e.name}**\n   • Department: ${e.department}\n   • Position: ${e.position}\n   • Performance Rating: ${e.rating}/5 (${e.reviewPeriod || 'latest review'})\n   • Attendance Rate: ${e.attendanceRate.toFixed(1)}%\n   • Tenure: since ${formatDate(e.hireDate)}`).join('\n\n')

      return { text: `🏆 **Top Promotion Candidates**\n\nBased on performance rating ≥ 4 and attendance > 90%:\n\n${list}\n\n_These employees show strong performance and reliability._` }
    }

    // ─── NEW: Draft warning letter ───
    if (q.includes('warning letter') || q.includes('warning')) {
      // Try to extract an employee name from the query
      const nameMatch = query.match(/for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/)
      let employee = null

      if (nameMatch) {
        const name = nameMatch[1].toLowerCase()
        const { data } = await supabase
          .from('employees')
          .select('id, full_name, email, phone, department:departments(name), position:positions(title), hire_date')
          .ilike('full_name', `%${name}%`)
          .eq('organization_id', orgId)
          .maybeSingle()
        employee = data
      }

      if (!employee) {
        // Find the employee with the worst attendance in the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
        const { data: attendance } = await supabase
          .from('attendance')
          .select('employee_id, date, check_in')
          .eq('organization_id', orgId)
          .gte('date', thirtyDaysAgo)

        if (attendance?.length) {
          const counts = {}
          attendance.forEach(a => { counts[a.employee_id] = (counts[a.employee_id] || 0) + 1 })
          const worstId = Object.entries(counts).sort((a, b) => a[1] - b[1])[0]?.[0]
          if (worstId) {
            const { data } = await supabase
              .from('employees')
              .select('id, full_name, email, phone, department:departments(name), position:positions(title), hire_date')
              .eq('id', worstId)
              .maybeSingle()
            employee = data
          }
        }
      }

      if (!employee) return { text: 'Could not find an employee to draft a warning letter for. Try mentioning the employee by name, e.g., "Draft a warning letter for John Doe".' }

      // Get their attendance records for the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      const { data: attRecords } = await supabase
        .from('attendance')
        .select('date, check_in, check_out')
        .eq('employee_id', employee.id)
        .eq('organization_id', orgId)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: false })

      const presentDays = attRecords?.length || 0
      const absentDays = 22 - presentDays // ~22 working days in 30
      const lateDays = attRecords?.filter(a => a.check_in && a.check_in > '09:00:00').length || 0
      const today = formatDate(new Date())

      const letter = `**OFFICIAL WARNING LETTER — POOR ATTENDANCE**

Date: ${today}

To: ${employee.full_name}
${employee.position?.title || 'Employee'} — ${employee.department?.name || 'Department'}
Employee ID: ${employee.id}

Dear ${employee.full_name.split(' ')[0]},

This letter serves as a formal written warning regarding your attendance record over the past 30 days.

**Attendance Summary (Last 30 Days):**
• Days Present: ${presentDays}
• Days Absent: ${absentDays}
• Late Arrivals: ${lateDays}
• Attendance Rate: ${((presentDays / 22) * 100).toFixed(1)}%

Your current attendance pattern falls below the company's expected standard. Consistent and punctual attendance is essential to the effective operation of our team and organization.

**Required Actions:**
1. Improve your attendance rate to at least 95% within the next 30 days.
2. Ensure all absences are properly reported and approved in advance.
3. Arrive on time for all scheduled work hours.

Please be advised that failure to demonstrate immediate and sustained improvement may result in further disciplinary action, up to and including termination of employment.

We value your contributions to the team and are committed to supporting you in meeting these expectations. If there are circumstances affecting your attendance that we should be aware of, please discuss them with your manager or HR immediately.

This warning will remain on file for a period of 12 months.

Sincerely,
Human Resources Department`

      return { text: letter }
    }

    // ─── NEW: Suggest salary adjustments ───
    if (q.includes('salary adjustment') || q.includes('salary adjustments') || (q.includes('suggest') && q.includes('salary'))) {
      // Get all active employees with their salary and department
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, basic_salary, department:departments(name)')
        .eq('status', 'ACTIVE')
        .eq('organization_id', orgId)
        .not('basic_salary', 'is', null)

      if (!employees?.length) return { text: 'No salary data available for active employees.' }

      // Group by department and calculate averages
      const deptGroups = {}
      employees.forEach(e => {
        const dept = e.department?.name || 'Unassigned'
        if (!deptGroups[dept]) deptGroups[dept] = []
        deptGroups[dept].push(e)
      })

      const deptStats = Object.entries(deptGroups).map(([dept, emps]) => {
        const salaries = emps.map(e => Number(e.basic_salary))
        const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length
        return { department: dept, employees: emps, average: avg, count: emps.length }
      })

      // Find employees below their department average
      const belowAvg = []
      deptStats.forEach(d => {
        d.employees.forEach(e => {
          if (Number(e.basic_salary) < d.average) {
            const diff = d.average - Number(e.basic_salary)
            const pctBelow = ((diff / d.average) * 100).toFixed(1)
            belowAvg.push({
              name: e.full_name,
              department: d.department,
              current: Number(e.basic_salary),
              avg: d.average,
              diff,
              pctBelow,
            })
          }
        })
      })

      if (!belowAvg.length) return { text: 'All active employees are at or above their department average salary. No adjustments needed.' }

      // Sort by largest gap below average
      belowAvg.sort((a, b) => b.diff - a.diff)

      const list = belowAvg.slice(0, 10).map(e => `• **${e.name}** (${e.department})\n   Current: ${formatCurrency(e.current)} | Dept Avg: ${formatCurrency(e.avg)} | ${e.pctBelow}% below avg | Suggested increase: ${formatCurrency(e.diff)}`).join('\n\n')

      const deptSummary = deptStats.map(d => `• **${d.department}**: Avg ${formatCurrency(d.average)} (${d.count} employees)`).join('\n')

      return { text: `💵 **Salary Adjustment Recommendations**\n\nEmployees below their department average:\n\n${list}\n\n**Department Averages:**\n${deptSummary}\n\n_Consider reviewing these salaries during the next compensation cycle._` }
    }

    // ─── NEW: Detect burnout ───
    if (q.includes('burnout') || q.includes('overwork')) {
      // Get attendance records for the last 30 days with late check-outs
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      const { data: attendance } = await supabase
        .from('attendance')
        .select('employee_id, date, check_in, check_out, employee:employees(full_name, department:departments(name))')
        .eq('organization_id', orgId)
        .gte('date', thirtyDaysAgo)

      if (!attendance?.length) return { text: 'Not enough attendance data to detect burnout risk.' }

      // Get leave utilization
      const { data: leaveRequests } = await supabase
        .from('leave_requests')
        .select('employee_id, status, leave_type, start_date, end_date')
        .eq('organization_id', orgId)
        .gte('start_date', thirtyDaysAgo)

      // Build per-employee stats
      const empStats = {}
      attendance.forEach(a => {
        const id = a.employee_id
        if (!empStats[id]) {
          empStats[id] = {
            name: a.employee?.full_name || 'Unknown',
            department: a.employee?.department?.name || '—',
            totalDays: 0,
            overtimeDays: 0,
            lateCheckIns: 0,
          }
        }
        empStats[id].totalDays++
        // Overtime: check_out after 18:00
        if (a.check_out && a.check_out > '18:00:00') {
          empStats[id].overtimeDays++
        }
        // Late check-in
        if (a.check_in && a.check_in > '09:00:00') {
          empStats[id].lateCheckIns++
        }
      })

      // Add leave utilization
      const leaveCounts = {}
      leaveRequests?.forEach(l => {
        if (l.status === 'APPROVED') {
          leaveCounts[l.employee_id] = (leaveCounts[l.employee_id] || 0) + 1
        }
      })

      // Flag at-risk: high overtime (>5 days late checkout) OR no leave taken
      const atRisk = Object.entries(empStats)
        .map(([id, s]) => ({
          ...s,
          leaveTaken: leaveCounts[id] || 0,
          overtimeRate: s.totalDays ? (s.overtimeDays / s.totalDays) * 100 : 0,
          reasons: [],
        }))
        .filter(s => {
          if (s.overtimeDays >= 5) s.reasons.push(`${s.overtimeDays} overtime days (check-out after 6 PM)`)
          if (s.leaveTaken === 0) s.reasons.push('no leave taken in 30 days')
          if (s.lateCheckIns >= 5) s.reasons.push(`${s.lateCheckIns} late arrivals`)
          return s.reasons.length > 0
        })
        .sort((a, b) => b.overtimeDays - a.overtimeDays || a.leaveTaken - b.leaveTaken)
        .slice(0, 8)

      if (!atRisk.length) return { text: 'No burnout risk detected. Your team appears to have a healthy work-life balance. ✅' }

      const list = atRisk.map(e => `• **${e.name}** (${e.department})\n   Overtime days: ${e.overtimeDays} (${e.overtimeRate.toFixed(0)}%) | Leave taken: ${e.leaveTaken} | Late arrivals: ${e.lateCheckIns}\n   ⚠️ ${e.reasons.join('; ')}`).join('\n\n')

      return { text: `🔥 **Burnout Risk Detection** (last 30 days)\n\nThe following employees show signs of potential burnout:\n\n${list}\n\n_Recommend: check-in meetings, encourage leave usage, and review workload distribution._` }
    }

    // ─── NEW: Generate interview questions ───
    if (q.includes('interview question') || q.includes('interview questions')) {
      // Extract role/position from query if mentioned
      const roleMatch = query.match(/(?:for|position|role)\s+(?:a\s+)?([a-zA-Z\s]+?)(?:\?|$)/i)
      const role = roleMatch ? roleMatch[1].trim() : null

      // Try to get position from database for context
      let positionTitle = role
      if (!positionTitle) {
        const { data: positions } = await supabase
          .from('positions')
          .select('title')
          .eq('organization_id', orgId)
          .limit(1)
        positionTitle = positions?.[0]?.title || 'the role'
      }

      const behavioral = [
        'Tell me about a time you faced a significant challenge at work. How did you handle it?',
        'Describe a situation where you had to work with a difficult team member. What was the outcome?',
        'Give an example of a goal you set and how you achieved it.',
        'Tell me about a time you made a mistake. What did you learn from it?',
        'Describe a time when you had to adapt to a significant change at work.',
      ]

      const technical = [
        `What technical skills make you most qualified for ${positionTitle}?`,
        'Walk me through a complex project you completed from start to finish.',
        'What tools, technologies, or methodologies do you use to stay productive?',
        'How do you ensure quality and accuracy in your work?',
        'Describe a technical problem you solved that others could not.',
      ]

      const situational = [
        'If you were assigned a project with an unrealistic deadline, how would you handle it?',
        'How would you prioritize tasks if everything seems urgent at once?',
        'What would you do in your first 90 days in this role?',
        'How would you handle a disagreement with your manager about a project direction?',
        'If you noticed a process that could be improved, what steps would you take?',
      ]

      const formatSection = (title, questions) => `**${title}:**\n${questions.map((qst, i) => `${i + 1}. ${qst}`).join('\n')}`

      return { text: `❓ **Interview Questions${role ? ` for ${role}` : ''}**\n\n${formatSection('Behavioral Questions', behavioral)}\n\n${formatSection('Technical Questions', technical)}\n\n${formatSection('Situational Questions', situational)}\n\n_Tip: Use the STAR method (Situation, Task, Action, Result) to evaluate behavioral responses._` }
    }

    // ─── NEW: Training recommendations ───
    if (q.includes('training') && (q.includes('recommend') || q.includes('training recommendation'))) {
      // Get training records per employee
      const { data: trainingRecords } = await supabase
        .from('training_records')
        .select('id, employee_id, training_name, status, start_date, end_date')
        .eq('organization_id', orgId)

      // Get all active employees
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, department:departments(name), position:positions(title)')
        .eq('status', 'ACTIVE')
        .eq('organization_id', orgId)

      if (!employees?.length) return { text: 'No active employees found for training analysis.' }

      // Count completed trainings per employee
      const trainingCounts = {}
      trainingRecords?.forEach(t => {
        if (!trainingCounts[t.employee_id]) {
          trainingCounts[t.employee_id] = { total: 0, completed: 0, inProgress: 0, names: [] }
        }
        trainingCounts[t.employee_id].total++
        if (t.status === 'COMPLETED') {
          trainingCounts[t.employee_id].completed++
        } else if (t.status === 'IN_PROGRESS' || t.status === 'ENROLLED') {
          trainingCounts[t.employee_id].inProgress++
          trainingCounts[t.employee_id].names.push(t.training_name)
        }
      })

      // Identify employees with low or no training
      const lowTraining = employees
        .map(e => {
          const t = trainingCounts[e.id] || { total: 0, completed: 0, inProgress: 0, names: [] }
          return {
            name: e.full_name,
            department: e.department?.name || '—',
            position: e.position?.title || '—',
            total: t.total,
            completed: t.completed,
            inProgress: t.inProgress,
            completionRate: t.total > 0 ? (t.completed / t.total) * 100 : 0,
          }
        })
        .filter(e => e.completionRate < 50) // Less than 50% completion or no training
        .sort((a, b) => a.completionRate - b.completionRate)
        .slice(0, 8)

      if (!lowTraining.length) return { text: 'All employees have good training completion rates (≥ 50%). 🎓' }

      // Recommend modules based on department/position
      const moduleCatalog = {
        'IT': ['Cloud Fundamentals', 'Agile & Scrum Certification', 'Cybersecurity Best Practices'],
        'Finance': ['Advanced Excel & Reporting', 'Financial Compliance', 'Budget Management'],
        'HR': ['Employee Relations', 'HR Compliance & Labor Law', 'Performance Management'],
        'Sales': ['Negotiation Skills', 'CRM Best Practices', 'Customer Relationship Management'],
        'Operations': ['Process Optimization', 'Project Management', 'Quality Standards'],
      }

      const defaultModules = ['Workplace Communication', 'Time Management', 'Leadership Fundamentals']

      const list = lowTraining.map(e => {
        const modules = moduleCatalog[e.department] || defaultModules
        const recs = modules.slice(0, 3).map(m => `   - ${m}`).join('\n')
        return `• **${e.name}** (${e.department})\n   Position: ${e.position}\n   Training: ${e.completed}/${e.total} completed (${e.completionRate.toFixed(0)}%)\n   Recommended modules:\n${recs}`
      }).join('\n\n')

      return { text: `🎓 **Training Recommendations**\n\nEmployees with low training completion (< 50%):\n\n${list}\n\n_Recommend enrolling these employees in the suggested modules within the next quarter._` }
    }

    // ─── NEW: Cost per employee ───
    if (q.includes('cost per employee') || (q.includes('cost') && q.includes('employee'))) {
      // Get all active employees with salary and department
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, basic_salary, department:departments(name)')
        .eq('status', 'ACTIVE')
        .eq('organization_id', orgId)

      if (!employees?.length) return { text: 'No active employees found for cost analysis.' }

      const totalCost = employees.reduce((sum, e) => sum + (Number(e.basic_salary) || 0), 0)
      const avgCost = totalCost / employees.length

      // Break down by department
      const deptCosts = {}
      employees.forEach(e => {
        const dept = e.department?.name || 'Unassigned'
        if (!deptCosts[dept]) deptCosts[dept] = { total: 0, count: 0 }
        deptCosts[dept].total += Number(e.basic_salary) || 0
        deptCosts[dept].count++
      })

      const deptBreakdown = Object.entries(deptCosts)
        .map(([dept, d]) => ({
          department: dept,
          total: d.total,
          count: d.count,
          avg: d.total / d.count,
        }))
        .sort((a, b) => b.total - a.total)

      const list = deptBreakdown.map(d => `• **${d.department}**\n   Total: ${formatCurrency(d.total)} | ${d.count} employees | Avg per employee: ${formatCurrency(d.avg)}`).join('\n\n')

      return { text: `🧮 **Cost Per Employee Analysis**\n\n**Overall:**\n• Total Salary Cost: ${formatCurrency(totalCost)}\n• Total Employees: ${employees.length}\n• Average Cost Per Employee: ${formatCurrency(avgCost)}\n\n**Breakdown by Department:**\n\n${list}` }
    }

    // ─── NEW: Recruitment funnel ───
    if (q.includes('recruitment funnel') || q.includes('funnel') || (q.includes('recruitment') && !q.includes('training'))) {
      // Get vacancies
      const { data: vacancies } = await supabase
        .from('vacancies')
        .select('id, title, status, openings, department:departments(name)')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (!vacancies?.length) return { text: 'No vacancies found to build a recruitment funnel.' }

      // Get all applications
      const { data: applications } = await supabase
        .from('applications')
        .select('id, vacancy_id, status, full_name, applied_at')
        .eq('organization_id', orgId)
        .order('applied_at', { ascending: false })

      // Build funnel per vacancy
      const funnels = vacancies.slice(0, 5).map(v => {
        const apps = applications?.filter(a => a.vacancy_id === v.id) || []
        const stages = {
          APPLIED: apps.filter(a => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length,
          INTERVIEWED: apps.filter(a => a.status === 'INTERVIEWED' || a.status === 'INTERVIEW').length,
          OFFERED: apps.filter(a => a.status === 'OFFERED' || a.status === 'OFFER').length,
          HIRED: apps.filter(a => a.status === 'HIRED' || a.status === 'ACCEPTED').length,
        }
        const total = apps.length
        return {
          title: v.title,
          department: v.department?.name || '—',
          status: v.status,
          openings: v.openings,
          total,
          stages,
        }
      })

      const list = funnels.map(f => {
        const s = f.stages
        const convRate = s.APPLIED > 0 ? ((s.HIRED / s.APPLIED) * 100).toFixed(1) : '0.0'
        return `**${f.title}** (${f.department})\n   Status: ${f.status} | Openings: ${f.openings} | Total Applications: ${f.total}\n\n   APPLIED → ${s.APPLIED}\n   INTERVIEWED → ${s.INTERVIEWED}\n   OFFERED → ${s.OFFERED}\n   HIRED → ${s.HIRED}\n   Conversion Rate: ${convRate}%`
      }).join('\n\n---\n\n')

      // Overall funnel totals
      const totalApplied = funnels.reduce((sum, f) => sum + f.stages.APPLIED, 0)
      const totalInterviewed = funnels.reduce((sum, f) => sum + f.stages.INTERVIEWED, 0)
      const totalOffered = funnels.reduce((sum, f) => sum + f.stages.OFFERED, 0)
      const totalHired = funnels.reduce((sum, f) => sum + f.stages.HIRED, 0)

      return { text: `🔄 **Recruitment Funnel**\n\n**Overall Funnel:**\n\nAPPLIED → ${totalApplied}\nINTERVIEWED → ${totalInterviewed}\nOFFERED → ${totalOffered}\nHIRED → ${totalHired}\nOverall Conversion: ${totalApplied > 0 ? ((totalHired / totalApplied) * 100).toFixed(1) : '0.0'}%\n\n---\n\n**Per Vacancy Breakdown:**\n\n${list}` }
    }

    return { text: `I can help with:\n\n• Employee counts and details\n• Leave tracking\n• Payroll summaries\n• Attendance analysis\n• Probation tracking\n• Department statistics\n• Upcoming birthdays\n• Attrition risk analysis\n• Promotion candidates\n• Warning letter drafting\n• Salary adjustment suggestions\n• Burnout risk detection\n• Interview question generation\n• Training recommendations\n• Cost per employee analysis\n• Recruitment funnel\n\nTry asking: "How many employees do we have?" or "Who deserves a promotion?"` }
  }

  async function handleSend(text) {
    const query = text || input.trim()
    if (!query || loading) return

    const userMsg = { role: 'user', content: query }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const result = await processQuery(query)
      setMessages(prev => [...prev, { role: 'assistant', content: result.text }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <PageHeader
        title="AI Copilot"
        description="Your intelligent HR assistant — ask anything about your workforce"
        icon={BrainCircuit}
      />

      <div className="card flex flex-col flex-1 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40">
                <Sparkles size={28} className="text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Ask me anything about your HR data</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">I can analyze employees, attendance, payroll, leave, promotions, burnout risk, recruitment, and more.</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 hover:border-brand-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-brand-700"
                  >
                    <span className="text-lg">{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Bot size={18} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                  <User size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about employees, attendance, payroll, promotions, burnout..."
              className="input flex-1"
              disabled={loading}
            />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="btn-primary">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
