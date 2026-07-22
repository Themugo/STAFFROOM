import { useEffect, useState, useMemo } from 'react'
import {
  GraduationCap,
  BookOpen,
  Grid3x3,
  Plus,
  Download,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Power,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate } from '../lib/format'
import {
  PageHeader,
  Modal,
  StatCard,
  StatusBadge,
  EmptyState,
  Tabs,
  SearchInput,
  DataTable,
} from '../components/ui'

const TRAINING_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
const DIFFICULTY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

const DIFFICULTY_CONFIG = {
  BEGINNER: { label: 'Beginner', color: 'green' },
  INTERMEDIATE: { label: 'Intermediate', color: 'yellow' },
  ADVANCED: { label: 'Advanced', color: 'red' },
}

const PROFICIENCY_COLORS = {
  1: 'bg-red-500 text-white',
  2: 'bg-red-400 text-white',
  3: 'bg-yellow-400 text-yellow-900',
  4: 'bg-green-400 text-white',
  5: 'bg-green-500 text-white',
}

const PROFICIENCY_LABELS = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Competent',
  4: 'Proficient',
  5: 'Expert',
}

export default function LearningDevelopment() {
  const { profile } = useAuth()
  const { success, error: errorNotify } = useNotifications()

  const [activeTab, setActiveTab] = useState('training')
  const [loading, setLoading] = useState(true)

  // Training records
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [searchRecords, setSearchRecords] = useState('')
  const [trainingModal, setTrainingModal] = useState(false)
  const [trainingForm, setTrainingForm] = useState({
    employee_id: '',
    course_name: '',
    status: 'PENDING',
    completion_date: '',
    certificate_expiry: '',
    score: '',
  })
  const [savingTraining, setSavingTraining] = useState(false)
  const [trainingError, setTrainingError] = useState('')

  // Courses
  const [courses, setCourses] = useState([])
  const [searchCourses, setSearchCourses] = useState('')
  const [courseModal, setCourseModal] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    duration_hours: '',
    difficulty: 'BEGINNER',
  })
  const [savingCourse, setSavingCourse] = useState(false)
  const [courseError, setCourseError] = useState('')

  // Skills
  const [skills, setSkills] = useState([])
  const [skillModal, setSkillModal] = useState(false)
  const [skillForm, setSkillForm] = useState({
    employee_id: '',
    skill_name: '',
    proficiency_level: 3,
    certified: false,
  })
  const [savingSkill, setSavingSkill] = useState(false)
  const [skillError, setSkillError] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const orgId = profile?.organization_id
    const empQuery = orgId
      ? supabase.from('employees').select('id, full_name').eq('organization_id', orgId).order('full_name')
      : supabase.from('employees').select('id, full_name').order('full_name')

    const [recordsRes, coursesRes, skillsRes, empRes] = await Promise.all([
      orgId
        ? supabase
            .from('training_records')
            .select(
              'id, employee_id, employee:employees(full_name, department:departments(name)), course_name, status, completion_date, certificate_expiry, score, created_at'
            )
            .eq('organization_id', orgId)
            .order('created_at', { ascending: false })
        : supabase
            .from('training_records')
            .select(
              'id, employee_id, employee:employees(full_name, department:departments(name)), course_name, status, completion_date, certificate_expiry, score, created_at'
            )
            .order('created_at', { ascending: false }),
      supabase.from('learning_modules').select('id, title, description, category, duration_hours, difficulty, is_active, created_at').order('created_at', { ascending: false }),
      supabase
        .from('employee_skills')
        .select('id, employee_id, employee:employees(full_name), skill_name, proficiency_level, last_assessed, certified')
        .order('created_at', { ascending: false }),
      empQuery,
    ])

    setRecords(recordsRes.data ?? [])
    setCourses(coursesRes.data ?? [])
    setSkills(skillsRes.data ?? [])
    setEmployees(empRes.data ?? [])
    setLoading(false)
  }

  // ─── Training Records: stats ──────────────────────────────────────────────
  const now = new Date()
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const stats = useMemo(() => {
    const completed = records.filter((r) => r.status === 'COMPLETED').length
    const inProgress = records.filter((r) => r.status === 'IN_PROGRESS').length
    const expiring = records.filter((r) => {
      if (!r.certificate_expiry) return false
      const expiry = new Date(r.certificate_expiry)
      return expiry >= now && expiry <= in30Days
    }).length
    return {
      total: records.length,
      completed,
      inProgress,
      expiring,
    }
  }, [records])

  const filteredRecords = useMemo(() => {
    if (!searchRecords.trim()) return records
    const q = searchRecords.toLowerCase()
    return records.filter(
      (r) =>
        (r.employee?.full_name || '').toLowerCase().includes(q) ||
        (r.course_name || '').toLowerCase().includes(q) ||
        (r.status || '').toLowerCase().includes(q)
    )
  }, [records, searchRecords])

  function exportTrainingCSV() {
    const headers = ['Employee', 'Department', 'Course', 'Status', 'Completion Date', 'Score', 'Certificate Expiry']
    const rows = filteredRecords.map((r) => [
      r.employee?.full_name || 'Unknown',
      r.employee?.department?.name || '',
      r.course_name || '',
      r.status || '',
      r.completion_date ? formatDate(r.completion_date) : '',
      r.score ?? '',
      r.certificate_expiry ? formatDate(r.certificate_expiry) : '',
    ])

    const escape = (val) => {
      const s = String(val ?? '')
      if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
      return s
    }

    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `training_records_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function handleSaveTraining() {
    if (!trainingForm.employee_id || !trainingForm.course_name) {
      setTrainingError('Employee and course name are required.')
      return
    }
    setSavingTraining(true)
    setTrainingError('')
    const payload = {
      employee_id: trainingForm.employee_id,
      course_name: trainingForm.course_name,
      status: trainingForm.status,
      completion_date: trainingForm.completion_date || null,
      certificate_expiry: trainingForm.certificate_expiry || null,
      score: trainingForm.score !== '' ? Number(trainingForm.score) : null,
      organization_id: profile?.organization_id ?? null,
    }
    const { error } = await supabase.from('training_records').insert(payload)
    setSavingTraining(false)
    if (error) {
      setTrainingError(error.message)
      return
    }
    success('Training record added successfully.')
    setTrainingModal(false)
    loadAll()
  }

  // ─── Courses ──────────────────────────────────────────────────────────────
  const filteredCourses = useMemo(() => {
    if (!searchCourses.trim()) return courses
    const q = searchCourses.toLowerCase()
    return courses.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
    )
  }, [courses, searchCourses])

  async function handleSaveCourse() {
    if (!courseForm.title) {
      setCourseError('Course title is required.')
      return
    }
    setSavingCourse(true)
    setCourseError('')
    const payload = {
      title: courseForm.title,
      description: courseForm.description || null,
      category: courseForm.category || null,
      duration_hours: courseForm.duration_hours !== '' ? Number(courseForm.duration_hours) : null,
      difficulty: courseForm.difficulty,
      is_active: true,
      organization_id: profile?.organization_id ?? null,
    }
    const { error } = await supabase.from('learning_modules').insert(payload)
    setSavingCourse(false)
    if (error) {
      setCourseError(error.message)
      return
    }
    success('Course created successfully.')
    setCourseModal(false)
    loadAll()
  }

  async function toggleCourseActive(course) {
    const { error } = await supabase.from('learning_modules').update({ is_active: !course.is_active }).eq('id', course.id)
    if (error) {
      errorNotify(error.message)
      return
    }
    success(course.is_active ? 'Course deactivated.' : 'Course activated.')
    loadAll()
  }

  // ─── Skills Matrix ────────────────────────────────────────────────────────
  const { matrixEmployees, matrixSkills } = useMemo(() => {
    const empMap = new Map()
    const skillSet = new Set()
    skills.forEach((s) => {
      if (!empMap.has(s.employee_id)) {
        empMap.set(s.employee_id, { id: s.employee_id, name: s.employee?.full_name || 'Unknown', skills: {} })
      }
      const emp = empMap.get(s.employee_id)
      emp.skills[s.skill_name] = {
        proficiency: s.proficiency_level,
        certified: s.certified,
        lastAssessed: s.last_assessed,
      }
      skillSet.add(s.skill_name)
    })
    return {
      matrixEmployees: Array.from(empMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      matrixSkills: Array.from(skillSet).sort(),
    }
  }, [skills])

  async function handleSaveSkill() {
    if (!skillForm.employee_id || !skillForm.skill_name) {
      setSkillError('Employee and skill name are required.')
      return
    }
    setSavingSkill(true)
    setSkillError('')
    const payload = {
      employee_id: skillForm.employee_id,
      skill_name: skillForm.skill_name,
      proficiency_level: Number(skillForm.proficiency_level),
      certified: skillForm.certified,
      last_assessed: new Date().toISOString().slice(0, 10),
      organization_id: profile?.organization_id ?? null,
    }
    const { error } = await supabase.from('employee_skills').insert(payload)
    setSavingSkill(false)
    if (error) {
      setSkillError(error.message)
      return
    }
    success('Skill added successfully.')
    setSkillModal(false)
    loadAll()
  }

  // ─── Training Records columns ─────────────────────────────────────────────
  const trainingColumns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-semibold dark:from-brand-600 dark:to-brand-700">
            {r.employee?.full_name?.[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">{r.employee?.full_name || 'Unknown'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{r.employee?.department?.name || '—'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'course_name',
      header: 'Course',
      render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.course_name || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'completion_date',
      header: 'Completion Date',
      render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(r.completion_date)}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      render: (r) =>
        r.score != null ? (
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{r.score}</span>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'certificate_expiry',
      header: 'Certificate Expiry',
      render: (r) => {
        if (!r.certificate_expiry) return <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        const expiry = new Date(r.certificate_expiry)
        const isExpiring = expiry >= now && expiry <= in30Days
        const isExpired = expiry < now
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(r.certificate_expiry)}</span>
            {isExpired && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                <AlertTriangle size={10} /> Expired
              </span>
            )}
            {isExpiring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Clock size={10} /> Soon
              </span>
            )}
          </div>
        )
      },
    },
  ]

  // ─── Tabs config ──────────────────────────────────────────────────────────
  const tabs = [
    { id: 'training', label: 'Training Records', count: records.length },
    { id: 'courses', label: 'Courses', count: courses.length },
    { id: 'skills', label: 'Skills Matrix', count: skills.length },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning & Development"
        description="Manage training records, courses, and employee skills"
        icon={GraduationCap}
        actions={
          activeTab === 'training' ? (
            <>
              <button
                onClick={exportTrainingCSV}
                className="btn-secondary flex items-center"
                disabled={filteredRecords.length === 0}
              >
                <Download size={18} className="mr-2" /> Export CSV
              </button>
              <button
                onClick={() => {
                  setTrainingForm({
                    employee_id: '',
                    course_name: '',
                    status: 'PENDING',
                    completion_date: '',
                    certificate_expiry: '',
                    score: '',
                  })
                  setTrainingError('')
                  setTrainingModal(true)
                }}
                className="btn-primary"
              >
                <Plus size={18} className="mr-2" /> New Training
              </button>
            </>
          ) : activeTab === 'courses' ? (
            <button
              onClick={() => {
                setCourseForm({
                  title: '',
                  description: '',
                  category: '',
                  duration_hours: '',
                  difficulty: 'BEGINNER',
                })
                setCourseError('')
                setCourseModal(true)
              }}
              className="btn-primary"
            >
              <Plus size={18} className="mr-2" /> New Course
            </button>
          ) : (
            <button
              onClick={() => {
                setSkillForm({
                  employee_id: '',
                  skill_name: '',
                  proficiency_level: 3,
                  certified: false,
                })
                setSkillError('')
                setSkillModal(true)
              }}
              className="btn-primary"
            >
              <Plus size={18} className="mr-2" /> Add Skill
            </button>
          )
        }
      />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ─── Training Records Tab ─────────────────────────────────────────── */}
      {activeTab === 'training' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Award} label="Total Trainings" value={stats.total} color="blue" loading={loading} />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="green" loading={loading} />
            <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="yellow" loading={loading} />
            <StatCard icon={AlertTriangle} label="Expiring Certs" value={stats.expiring} sublabel="Within 30 days" color="red" loading={loading} />
          </div>

          <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
            <SearchInput
              value={searchRecords}
              onChange={setSearchRecords}
              placeholder="Search by employee, course, or status..."
              className="sm:max-w-md"
            />
          </div>

          <DataTable
            columns={trainingColumns}
            data={filteredRecords}
            loading={loading}
            emptyIcon={Award}
            emptyTitle="No training records found"
            emptyDescription="Add a training record to get started."
            emptyAction={
              <button
                onClick={() => {
                  setTrainingForm({
                    employee_id: '',
                    course_name: '',
                    status: 'PENDING',
                    completion_date: '',
                    certificate_expiry: '',
                    score: '',
                  })
                  setTrainingError('')
                  setTrainingModal(true)
                }}
                className="btn-primary"
              >
                <Plus size={16} className="mr-2" /> Add first training record
              </button>
            }
          />
        </>
      )}

      {/* ─── Courses Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'courses' && (
        <>
          <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
            <SearchInput
              value={searchCourses}
              onChange={setSearchCourses}
              placeholder="Search courses by title, description, or category..."
              className="sm:max-w-md"
            />
          </div>

          {loading ? (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-brand-400 dark:border-t-transparent" />
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={BookOpen}
                title="No courses found"
                description="Create a new course to get started."
                action={
                  <button
                    onClick={() => {
                      setCourseForm({
                        title: '',
                        description: '',
                        category: '',
                        duration_hours: '',
                        difficulty: 'BEGINNER',
                      })
                      setCourseError('')
                      setCourseModal(true)
                    }}
                    className="btn-primary"
                  >
                    <Plus size={16} className="mr-2" /> Create first course
                  </button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => {
                const diff = DIFFICULTY_CONFIG[course.difficulty] || DIFFICULTY_CONFIG.BEGINNER
                return (
                  <div
                    key={course.id}
                    className={`card p-5 flex flex-col gap-3 transition-opacity ${!course.is_active ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                          {course.title}
                        </h3>
                      </div>
                      <span className={`badge-${diff.color} whitespace-nowrap`}>{diff.label}</span>
                    </div>

                    {course.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{course.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {course.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                          <Sparkles size={11} />
                          {course.category}
                        </span>
                      )}
                      {course.duration_hours != null && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          <Clock size={11} />
                          {course.duration_hours}h
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          course.is_active
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${course.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Added {formatDate(course.created_at)}</span>
                      <button
                        onClick={() => toggleCourseActive(course)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          course.is_active
                            ? 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                            : 'border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30'
                        }`}
                      >
                        <Power size={13} />
                        {course.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ─── Skills Matrix Tab ──────────────────────────────────────────── */}
      {activeTab === 'skills' && (
        <>
          {loading ? (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-brand-400 dark:border-t-transparent" />
              </div>
            </div>
          ) : matrixEmployees.length === 0 || matrixSkills.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Grid3x3}
                title="No skills data yet"
                description="Add employee skills to build the skills matrix."
                action={
                  <button
                    onClick={() => {
                      setSkillForm({
                        employee_id: '',
                        skill_name: '',
                        proficiency_level: 3,
                        certified: false,
                      })
                      setSkillError('')
                      setSkillModal(true)
                    }}
                    className="btn-primary"
                  >
                    <Plus size={16} className="mr-2" /> Add first skill
                  </button>
                }
              />
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="card p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Proficiency:</span>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div key={lvl} className="flex items-center gap-1.5">
                      <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${PROFICIENCY_COLORS[lvl]}`}>
                        {lvl}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{PROFICIENCY_LABELS[lvl]}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Award size={14} className="text-brand-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">= Certified</span>
                  </div>
                </div>
              </div>

              {/* Matrix */}
              <div className="card overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="table-header sticky left-0 bg-gray-50 dark:bg-gray-900/50 z-10" style={{ minWidth: '180px' }}>
                          Employee
                        </th>
                        {matrixSkills.map((skill) => (
                          <th key={skill} className="table-header text-center" style={{ minWidth: '100px' }}>
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-xs">{skill}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                      {matrixEmployees.map((emp) => (
                        <tr key={emp.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="table-cell sticky left-0 bg-white dark:bg-gray-900 z-10">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-xs font-semibold dark:from-brand-600 dark:to-brand-700">
                                {emp.name[0] || 'U'}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                            </div>
                          </td>
                          {matrixSkills.map((skill) => {
                            const cell = emp.skills[skill]
                            if (!cell) {
                              return (
                                <td key={skill} className="table-cell text-center">
                                  <span className="text-gray-300 dark:text-gray-700">—</span>
                                </td>
                              )
                            }
                            return (
                              <td key={skill} className="table-cell text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span
                                    className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${PROFICIENCY_COLORS[cell.proficiency]}`}
                                    title={`${PROFICIENCY_LABELS[cell.proficiency]}${cell.certified ? ' (Certified)' : ''}`}
                                  >
                                    {cell.proficiency}
                                  </span>
                                  {cell.certified && <Award size={12} className="text-brand-500" />}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ─── New Training Modal ─────────────────────────────────────────── */}
      <Modal
        open={trainingModal}
        onClose={() => setTrainingModal(false)}
        title="New Training Record"
        description="Record a training assignment for an employee."
        size="lg"
        footer={
          <>
            <button onClick={() => setTrainingModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveTraining} className="btn-primary" disabled={savingTraining}>
              {savingTraining ? 'Saving...' : 'Save Training'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Employee *</label>
            <select
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={trainingForm.employee_id}
              onChange={(e) => setTrainingForm((f) => ({ ...f, employee_id: e.target.value }))}
            >
              <option value="">— Select Employee —</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label dark:text-gray-300">Course Name *</label>
            <input
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={trainingForm.course_name}
              onChange={(e) => setTrainingForm((f) => ({ ...f, course_name: e.target.value }))}
              placeholder="e.g. Workplace Safety Training"
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Status</label>
            <select
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={trainingForm.status}
              onChange={(e) => setTrainingForm((f) => ({ ...f, status: e.target.value }))}
            >
              {TRAINING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-300">Completion Date</label>
              <input
                type="date"
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={trainingForm.completion_date}
                onChange={(e) => setTrainingForm((f) => ({ ...f, completion_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="label dark:text-gray-300">Certificate Expiry</label>
              <input
                type="date"
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={trainingForm.certificate_expiry}
                onChange={(e) => setTrainingForm((f) => ({ ...f, certificate_expiry: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label dark:text-gray-300">Score</label>
            <input
              type="number"
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={trainingForm.score}
              onChange={(e) => setTrainingForm((f) => ({ ...f, score: e.target.value }))}
              placeholder="e.g. 85"
              min="0"
              max="100"
            />
          </div>
          {trainingError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {trainingError}
            </div>
          )}
        </div>
      </Modal>

      {/* ─── New Course Modal ───────────────────────────────────────────── */}
      <Modal
        open={courseModal}
        onClose={() => setCourseModal(false)}
        title="New Course"
        description="Create a new learning module."
        size="lg"
        footer={
          <>
            <button onClick={() => setCourseModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveCourse} className="btn-primary" disabled={savingCourse}>
              {savingCourse ? 'Saving...' : 'Create Course'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Title *</label>
            <input
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={courseForm.title}
              onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Introduction to Project Management"
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Description</label>
            <textarea
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={courseForm.description}
              onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the course..."
              rows={3}
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Category</label>
            <input
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={courseForm.category}
              onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Leadership, Compliance, Technical"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-300">Duration (hours)</label>
              <input
                type="number"
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={courseForm.duration_hours}
                onChange={(e) => setCourseForm((f) => ({ ...f, duration_hours: e.target.value }))}
                placeholder="e.g. 4"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="label dark:text-gray-300">Difficulty</label>
              <select
                className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={courseForm.difficulty}
                onChange={(e) => setCourseForm((f) => ({ ...f, difficulty: e.target.value }))}
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_CONFIG[d].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {courseError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {courseError}
            </div>
          )}
        </div>
      </Modal>

      {/* ─── Add Skill Modal ────────────────────────────────────────────── */}
      <Modal
        open={skillModal}
        onClose={() => setSkillModal(false)}
        title="Add Skill"
        description="Record an employee's proficiency in a skill."
        size="md"
        footer={
          <>
            <button onClick={() => setSkillModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveSkill} className="btn-primary" disabled={savingSkill}>
              {savingSkill ? 'Saving...' : 'Add Skill'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Employee *</label>
            <select
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={skillForm.employee_id}
              onChange={(e) => setSkillForm((f) => ({ ...f, employee_id: e.target.value }))}
            >
              <option value="">— Select Employee —</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label dark:text-gray-300">Skill Name *</label>
            <input
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={skillForm.skill_name}
              onChange={(e) => setSkillForm((f) => ({ ...f, skill_name: e.target.value }))}
              placeholder="e.g. JavaScript, Public Speaking, Excel"
            />
          </div>
          <div>
            <label className="label dark:text-gray-300">Proficiency Level</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSkillForm((f) => ({ ...f, proficiency_level: lvl }))}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition ${
                    skillForm.proficiency_level === lvl
                      ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold ${PROFICIENCY_COLORS[lvl]}`}>
                    {lvl}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{PROFICIENCY_LABELS[lvl]}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={skillForm.certified}
                onChange={(e) => setSkillForm((f) => ({ ...f, certified: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Award size={15} className="text-brand-500" />
                Certified
              </span>
            </label>
          </div>
          {skillError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {skillError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
