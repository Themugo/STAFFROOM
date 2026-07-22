import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mail, Phone, Building2, Briefcase, Calendar, Users, FileText, Award,
  Clock, DollarSign, MapPin, Camera, Edit2, MoreVertical, CheckCircle,
  AlertCircle, XCircle, TrendingUp, GraduationCap, Upload, ArrowUpRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, formatCurrency } from '../lib/format'
import {
  StatusBadge, Avatar, EmptyState, PageHeader, Tabs, Spinner, DataTable,
} from '../components/ui'

const TABS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'Attendance', label: 'Attendance' },
  { id: 'Leave', label: 'Leave' },
  { id: 'Payroll', label: 'Payroll' },
  { id: 'Performance', label: 'Performance' },
  { id: 'Training', label: 'Training' },
  { id: 'Documents', label: 'Documents' },
  { id: 'Salary History', label: 'Salary History' },
  { id: 'History', label: 'History' },
]

// Map a performance rating (numeric or label) to a StatusBadge-compatible status
function ratingToStatus(rating) {
  if (rating == null) return 'gray'
  const r = String(rating).toLowerCase()
  if (['5', 'excellent', 'outstanding', 'exceeds', 'a+', 'a'].includes(r)) return 'green'
  if (['4', 'good', 'above average', 'meets+', 'b'].includes(r)) return 'blue'
  if (['3', 'average', 'meets', 'satisfactory', 'c'].includes(r)) return 'yellow'
  if (['2', 'below average', 'needs improvement', 'd'].includes(r)) return 'purple'
  if (['1', 'poor', 'unsatisfactory', 'f'].includes(r)) return 'red'
  return 'gray'
}

export default function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [contracts, setContracts] = useState([])
  const [assets, setAssets] = useState([])
  const [performanceReviews, setPerformanceReviews] = useState([])
  const [trainingRecords, setTrainingRecords] = useState([])
  const [documents, setDocuments] = useState([])
  const [salaryHistory, setSalaryHistory] = useState([])
  const [activeTab, setActiveTab] = useState('Overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchEmployee()
  }, [id])

  async function fetchEmployee() {
    setLoading(true)

    // Core queries — these tables are expected to exist. Use Promise.all so
    // the profile fails loudly if the employee record itself is missing.
    const [empRes, attRes, leaveRes, contractRes, assetRes] = await Promise.all([
      supabase.from('employees')
        .select('*, department:departments(id, name), position:positions(id, title)')
        .eq('id', id)
        .single(),
      supabase.from('attendance')
        .select('*')
        .eq('employee_id', id)
        .order('date', { ascending: false })
        .limit(30),
      supabase.from('leave_requests')
        .select('*')
        .eq('employee_id', id)
        .order('created_at', { ascending: false }),
      supabase.from('contracts')
        .select('*')
        .eq('employee_id', id)
        .order('start_date', { ascending: false }),
      supabase.from('assets')
        .select('*')
        .eq('assigned_to', id)
    ])

    setEmployee(empRes.data)
    setAttendance(attRes.data || [])
    setLeaveRequests(leaveRes.data || [])
    setContracts(contractRes.data || [])
    setAssets(assetRes.data || [])

    // Enterprise tab queries — these tables may not exist yet in every
    // project, so use Promise.allSettled to avoid breaking the page when
    // a table is missing or errors out.
    const enterpriseQueries = [
      supabase.from('performance_reviews')
        .select('id, review_period, rating, goals, comments, reviewer_id, created_at')
        .eq('employee_id', id)
        .order('created_at', { ascending: false }),
      supabase.from('training_records')
        .select('id, course_name, status, completion_date, certificate_expiry')
        .eq('employee_id', id)
        .order('completion_date', { ascending: false }),
      supabase.from('employee_documents')
        .select('*')
        .eq('employee_id', id)
        .order('created_at', { ascending: false }),
      supabase.from('salary_history')
        .select('id, old_salary, new_salary, change_date, reason')
        .eq('employee_id', id)
        .order('change_date', { ascending: false }),
    ]

    const [perfRes, trainRes, docRes, salaryRes] = await Promise.allSettled(enterpriseQueries)

    setPerformanceReviews(perfRes.status === 'fulfilled' ? (perfRes.value.data || []) : [])
    setTrainingRecords(trainRes.status === 'fulfilled' ? (trainRes.value.data || []) : [])
    setDocuments(docRes.status === 'fulfilled' ? (docRes.value.data || []) : [])
    setSalaryHistory(salaryRes.status === 'fulfilled' ? (salaryRes.value.data || []) : [])

    setLoading(false)
  }

  if (loading) {
    return <Spinner size="lg" className="h-64" />
  }

  if (!employee) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Employee not found"
        description="The employee you're looking for doesn't exist or has been removed."
        action={
          <button
            onClick={() => navigate('/employees')}
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm"
          >
            Back to Employees
          </button>
        }
      />
    )
  }

  const stats = [
    { label: 'Attendance Rate', value: '95%', icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
    { label: 'Leave Balance', value: '12 days', icon: Calendar, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Contract', value: contracts[0]?.status || 'Active', icon: FileText, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Assets', value: assets.length, icon: Briefcase, color: 'text-amber-600 dark:text-amber-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Employee Profile"
        description="View and manage employee details"
        actions={
          <>
            <button className="btn-secondary">
              <Edit2 size={16} className="mr-1" /> Edit
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </>
        }
      />

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar
                name={employee.full_name}
                size="xl"
                className="!h-28 !w-28 !text-4xl !rounded-2xl"
              />
              <button className="absolute bottom-0 right-0 p-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                <Camera size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="text-center">
              <StatusBadge status={employee.status} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{employee.full_name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {employee.position?.title || 'No position'} • {employee.department?.name || 'No department'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem icon={Mail} label="Email" value={employee.email} />
              <InfoItem icon={Phone} label="Phone" value={employee.phone || 'Not provided'} />
              <InfoItem icon={Building2} label="Department" value={employee.department?.name || 'Not assigned'} />
              <InfoItem icon={Briefcase} label="Position" value={employee.position?.title || 'Not assigned'} />
              <InfoItem icon={Calendar} label="Hire Date" value={formatDate(employee.hire_date)} />
              <InfoItem icon={DollarSign} label="Basic Salary" value={employee.basic_salary ? formatCurrency(employee.basic_salary) : 'Not set'} />
              <InfoItem icon={MapPin} label="National ID" value={employee.national_id || 'Not provided'} />
              <InfoItem icon={Users} label="Employee ID" value={employee.id.slice(0, 8).toUpperCase()} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="card p-6">
        {activeTab === 'Overview' && <OverviewTab employee={employee} contracts={contracts} assets={assets} />}
        {activeTab === 'Attendance' && <AttendanceTab attendance={attendance} />}
        {activeTab === 'Leave' && <LeaveTab leaveRequests={leaveRequests} />}
        {activeTab === 'Payroll' && <PayrollTab employee={employee} />}
        {activeTab === 'Performance' && <PerformanceTab reviews={performanceReviews} />}
        {activeTab === 'Training' && <TrainingTab records={trainingRecords} />}
        {activeTab === 'Documents' && <DocumentsTab documents={documents} />}
        {activeTab === 'Salary History' && <SalaryHistoryTab history={salaryHistory} />}
        {activeTab === 'History' && <HistoryTab contracts={contracts} leaveRequests={leaveRequests} />}
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-gray-400 dark:text-gray-500 mt-0.5" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}

function OverviewTab({ employee, contracts, assets }) {
  const currentContract = contracts[0]

  return (
    <div className="space-y-6">
      {/* Contract Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Contract Information</h3>
        {currentContract ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(currentContract.start_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(currentContract.end_date) === '—' ? 'Ongoing' : formatDate(currentContract.end_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <StatusBadge status={currentContract.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentContract.type || 'Full-time'}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No contracts found"
            description="This employee doesn't have any contracts on record yet."
          />
        )}
      </div>

      {/* Assigned Assets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Assigned Assets</h3>
        {assets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assets.map(asset => (
              <div key={asset.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3">
                <Briefcase size={18} className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{asset.name || 'Asset'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{asset.serial_number || 'No serial'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No assets assigned"
            description="There are no assets currently assigned to this employee."
          />
        )}
      </div>
    </div>
  )
}

function AttendanceTab({ attendance }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Attendance</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{attendance.length} records</span>
      </div>
      {attendance.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Check In</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Check Out</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {attendance.slice(0, 10).map(att => (
                <tr key={att.id}>
                  <td className="py-2 px-3 text-sm text-gray-900 dark:text-gray-100">{formatDate(att.date)}</td>
                  <td className="py-2 px-3 text-sm text-gray-900 dark:text-gray-100 font-mono">{att.check_in?.slice(0, 5) || '--:--'}</td>
                  <td className="py-2 px-3 text-sm text-gray-900 dark:text-gray-100 font-mono">{att.check_out?.slice(0, 5) || '--:--'}</td>
                  <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">{att.method || 'MANUAL'}</td>
                  <td className="py-2 px-3">
                    {att.check_out ? (
                      <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
                    ) : (
                      <Clock size={16} className="text-amber-500 dark:text-amber-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title="No attendance records"
          description="This employee has no attendance history yet."
        />
      )}
    </div>
  )
}

function LeaveTab({ leaveRequests }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Leave Requests</h3>
        <button className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">Request Leave</button>
      </div>
      {leaveRequests.length > 0 ? (
        <div className="space-y-2">
          {leaveRequests.map(leave => (
            <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{leave.leave_type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(leave.start_date)} to {formatDate(leave.end_date)}</p>
              </div>
              <StatusBadge status={leave.status} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No leave requests"
          description="This employee hasn't submitted any leave requests."
        />
      )}
    </div>
  )
}

function PayrollTab({ employee }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Salary Information</h3>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Basic Salary</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {employee.basic_salary ? formatCurrency(employee.basic_salary) : 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pay Frequency</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Monthly</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">View and download payslips in the Payroll section.</p>
    </div>
  )
}

function PerformanceTab({ reviews }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Performance Reviews</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} reviews</span>
      </div>
      {reviews.length > 0 ? (
        <div className="relative space-y-4 pl-6">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
          {reviews.map((review) => (
            <div key={review.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[18px] top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white dark:ring-gray-900">
                <TrendingUp size={8} className="text-white" />
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {review.review_period || 'Review'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                  <StatusBadge
                    status={ratingToStatus(review.rating)}
                    label={review.rating != null ? `Rating: ${review.rating}` : 'No rating'}
                  />
                </div>
                {review.goals && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Goals</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.goals}</p>
                  </div>
                )}
                {review.comments && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Comments</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.comments}</p>
                  </div>
                )}
                {review.reviewer_id && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Reviewer: {review.reviewer_id.slice(0, 8).toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No performance reviews"
          description="This employee has no performance reviews on record yet."
        />
      )}
    </div>
  )
}

function TrainingTab({ records }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Training Records</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{records.length} courses</span>
      </div>
      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <GraduationCap size={18} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {record.course_name || 'Training Course'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={record.status} />
                {record.certificate_expiry && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Expires {formatDate(record.certificate_expiry)}
                  </span>
                )}
              </div>
              {record.completion_date && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Completed on {formatDate(record.completion_date)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No training records"
          description="This employee has no training or certification records yet."
        />
      )}
    </div>
  )
}

function DocumentsTab({ documents }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Documents</h3>
        <button className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
          <Upload size={14} /> Upload Document
        </button>
      </div>
      {documents.length > 0 ? (
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (row) => (
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {row.name || row.file_name || 'Document'}
                </span>
              </div>
            )},
            { key: 'type', header: 'Type', render: (row) => (
              <span className="text-sm text-gray-600 dark:text-gray-400">{row.type || row.document_type || '—'}</span>
            )},
            { key: 'created_at', header: 'Uploaded', render: (row) => (
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(row.created_at || row.uploaded_at)}</span>
            )},
            { key: 'status', header: 'Status', render: (row) => (
              <StatusBadge status={row.status || 'ACTIVE'} />
            )},
          ]}
          data={documents}
          emptyTitle="No documents uploaded"
          emptyDescription="There are no documents associated with this employee yet."
          emptyIcon={FileText}
        />
      ) : (
        <EmptyState
          icon={FileText}
          title="No documents uploaded"
          description="There are no documents associated with this employee yet."
          action={
            <button className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
              <Upload size={14} /> Upload Document
            </button>
          }
        />
      )}
    </div>
  )
}

function SalaryHistoryTab({ history }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Salary History</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{history.length} changes</span>
      </div>
      {history.length > 0 ? (
        <div className="relative space-y-4 pl-6">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
          {history.map((entry) => {
            const diff = (entry.new_salary != null && entry.old_salary != null)
              ? entry.new_salary - entry.old_salary
              : null
            const isIncrease = diff != null && diff >= 0
            return (
              <div key={entry.id} className="relative">
                {/* Timeline dot */}
                <div className={`absolute -left-[18px] top-3 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 ${
                  isIncrease ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  <ArrowUpRight size={8} className={`text-white ${isIncrease ? '' : 'rotate-90'}`} />
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(entry.change_date)}
                      </p>
                      {entry.reason && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{entry.reason}</p>
                      )}
                    </div>
                    {diff != null && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        isIncrease
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        <ArrowUpRight size={12} className={isIncrease ? '' : 'rotate-90'} />
                        {isIncrease ? '+' : ''}{formatCurrency(Math.abs(diff))}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Previous Salary</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.old_salary != null ? formatCurrency(entry.old_salary) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">New Salary</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {entry.new_salary != null ? formatCurrency(entry.new_salary) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={DollarSign}
          title="No salary history"
          description="There is no salary change history recorded for this employee."
        />
      )}
    </div>
  )
}

function HistoryTab({ contracts, leaveRequests }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Contract History</h3>
        {contracts.length > 0 ? (
          <div className="space-y-2">
            {contracts.map((contract, i) => (
              <div key={contract.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contract.type || 'Contract'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(contract.start_date)} - {formatDate(contract.end_date) === '—' ? 'Ongoing' : formatDate(contract.end_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No contract history"
            description="This employee has no contract history on record."
          />
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Leave Activity</h3>
        {leaveRequests.length > 0 ? (
          <div className="space-y-2">
            {leaveRequests.slice(0, 5).map(leave => (
              <div key={leave.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{leave.leave_type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(leave.start_date)} to {formatDate(leave.end_date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No leave history"
            description="This employee has no leave activity to display."
          />
        )}
      </div>
    </div>
  )
}
