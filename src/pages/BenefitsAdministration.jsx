import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/Tabs'
import {
  HeartPulse,
  Plus,
  ShieldCheck,
  Users,
  TrendingUp,
  TrendingDown,
  Database,
  AlertTriangle,
} from 'lucide-react'

const BENEFIT_CATEGORIES = [
  'MEDICAL',
  'LIFE',
  'RETIREMENT',
  'TRANSPORT',
  'MEALS',
  'HOUSING',
  'OTHER',
]

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500'
const labelClass =
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

export default function BenefitsAdministration() {
  const { profile } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const organizationId = profile?.organization_id

  const [activeTab, setActiveTab] = useState('types')
  const [loading, setLoading] = useState(true)

  // Benefit Types state
  const [benefitTypes, setBenefitTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [typeForm, setTypeForm] = useState({
    name: '',
    description: '',
    category: 'MEDICAL',
    employer_contribution: '',
    employee_contribution: '',
  })
  const [savingType, setSavingType] = useState(false)
  const [togglingTypeId, setTogglingTypeId] = useState(null)

  // Enrollments state
  const [enrollments, setEnrollments] = useState([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [enrollmentsTableExists, setEnrollmentsTableExists] = useState(true)
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)
  const [enrollmentForm, setEnrollmentForm] = useState({
    employee_id: '',
    benefit_type_id: '',
    enrollment_date: new Date().toISOString().slice(0, 10),
  })
  const [savingEnrollment, setSavingEnrollment] = useState(false)
  const [employees, setEmployees] = useState([])

  // Health Insurance state
  const [healthRates, setHealthRates] = useState([])
  const [healthLoading, setHealthLoading] = useState(true)
  const [healthTableExists, setHealthTableExists] = useState(true)

  // -----------------------------------------------------------------------
  // Benefit Types
  // -----------------------------------------------------------------------
  const fetchBenefitTypes = useCallback(async () => {
    if (!organizationId) return
    setTypesLoading(true)
    try {
      const { data, error } = await supabase
        .from('benefit_types')
        .select(
          'id, name, description, category, employer_contribution, employee_contribution, is_active, created_at'
        )
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setBenefitTypes(data || [])
    } catch (err) {
      console.error('fetchBenefitTypes error:', err)
      notifyError('Failed to load benefit types')
    } finally {
      setTypesLoading(false)
    }
  }, [organizationId, notifyError])

  const handleSaveType = async () => {
    if (!typeForm.name.trim()) {
      notifyError('Name is required')
      return
    }
    if (!organizationId) {
      notifyError('Organization not found')
      return
    }
    setSavingType(true)
    try {
      const payload = {
        name: typeForm.name.trim(),
        description: typeForm.description.trim(),
        category: typeForm.category,
        employer_contribution: Number(typeForm.employer_contribution) || 0,
        employee_contribution: Number(typeForm.employee_contribution) || 0,
        is_active: true,
        organization_id: organizationId,
      }
      const { error } = await supabase.from('benefit_types').insert(payload)
      if (error) throw error
      success('Benefit type created successfully')
      setShowTypeModal(false)
      setTypeForm({
        name: '',
        description: '',
        category: 'MEDICAL',
        employer_contribution: '',
        employee_contribution: '',
      })
      fetchBenefitTypes()
    } catch (err) {
      console.error('handleSaveType error:', err)
      notifyError('Failed to create benefit type')
    } finally {
      setSavingType(false)
    }
  }

  const toggleTypeActive = async (type) => {
    setTogglingTypeId(type.id)
    try {
      const { error } = await supabase
        .from('benefit_types')
        .update({ is_active: !type.is_active })
        .eq('id', type.id)
      if (error) throw error
      success(`Benefit type ${type.is_active ? 'deactivated' : 'activated'}`)
      fetchBenefitTypes()
    } catch (err) {
      console.error('toggleTypeActive error:', err)
      notifyError('Failed to update benefit type')
    } finally {
      setTogglingTypeId(null)
    }
  }

  // -----------------------------------------------------------------------
  // Enrollments
  // -----------------------------------------------------------------------
  const fetchEnrollments = useCallback(async () => {
    if (!organizationId) return
    setEnrollmentsLoading(true)
    try {
      const { data, error } = await supabase
        .from('employee_benefits')
        .select(
          'id, employee_id, employee:employees(full_name), benefit_type_id, benefit_type:benefit_types(name), enrollment_date, status, created_at'
        )
        .order('created_at', { ascending: false })
      if (error) {
        // Table likely doesn't exist
        if (
          error.code === '42P01' ||
          error.message?.toLowerCase().includes('does not exist') ||
          error.message?.toLowerCase().includes('relation')
        ) {
          setEnrollmentsTableExists(false)
          setEnrollments([])
        } else {
          throw error
        }
      } else {
        setEnrollmentsTableExists(true)
        setEnrollments(data || [])
      }
    } catch (err) {
      console.error('fetchEnrollments error:', err)
      notifyError('Failed to load enrollments')
    } finally {
      setEnrollmentsLoading(false)
    }
  }, [notifyError])

  const fetchEmployees = useCallback(async () => {
    if (!organizationId) return
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('organization_id', organizationId)
        .order('full_name', { ascending: true })
      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      console.error('fetchEmployees error:', err)
    }
  }, [organizationId])

  const handleSaveEnrollment = async () => {
    if (!enrollmentForm.employee_id) {
      notifyError('Please select an employee')
      return
    }
    if (!enrollmentForm.benefit_type_id) {
      notifyError('Please select a benefit type')
      return
    }
    if (!enrollmentForm.enrollment_date) {
      notifyError('Enrollment date is required')
      return
    }
    setSavingEnrollment(true)
    try {
      const payload = {
        employee_id: enrollmentForm.employee_id,
        benefit_type_id: enrollmentForm.benefit_type_id,
        enrollment_date: enrollmentForm.enrollment_date,
        status: 'ACTIVE',
      }
      const { error } = await supabase.from('employee_benefits').insert(payload)
      if (error) throw error
      success('Enrollment created successfully')
      setShowEnrollmentModal(false)
      setEnrollmentForm({
        employee_id: '',
        benefit_type_id: '',
        enrollment_date: new Date().toISOString().slice(0, 10),
      })
      fetchEnrollments()
    } catch (err) {
      console.error('handleSaveEnrollment error:', err)
      notifyError('Failed to create enrollment')
    } finally {
      setSavingEnrollment(false)
    }
  }

  // -----------------------------------------------------------------------
  // Health Insurance Rates
  // -----------------------------------------------------------------------
  const fetchHealthRates = useCallback(async () => {
    setHealthLoading(true)
    try {
      const { data, error } = await supabase
        .from('health_insurance_rates')
        .select('id, scheme, tier, employer_rate, employee_rate, created_at')
        .order('created_at', { ascending: false })
      if (error) {
        if (
          error.code === '42P01' ||
          error.message?.toLowerCase().includes('does not exist') ||
          error.message?.toLowerCase().includes('relation')
        ) {
          setHealthTableExists(false)
          setHealthRates([])
        } else {
          throw error
        }
      } else {
        setHealthTableExists(true)
        setHealthRates(data || [])
      }
    } catch (err) {
      console.error('fetchHealthRates error:', err)
      notifyError('Failed to load health insurance rates')
    } finally {
      setHealthLoading(false)
    }
  }, [notifyError])

  // -----------------------------------------------------------------------
  // Effects
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!organizationId) {
      setLoading(false)
      return
    }
    setLoading(false)
    fetchBenefitTypes()
    fetchEnrollments()
    fetchHealthRates()
  }, [organizationId, fetchBenefitTypes, fetchEnrollments, fetchHealthRates])

  useEffect(() => {
    if (showEnrollmentModal) {
      fetchEmployees()
    }
  }, [showEnrollmentModal, fetchEmployees])

  // -----------------------------------------------------------------------
  // Derived stats
  // -----------------------------------------------------------------------
  const totalTypes = benefitTypes.length
  const activeTypes = benefitTypes.filter((t) => t.is_active).length
  const totalEmployerCost = benefitTypes.reduce(
    (sum, t) => sum + (Number(t.employer_contribution) || 0),
    0
  )
  const totalEmployeeCost = benefitTypes.reduce(
    (sum, t) => sum + (Number(t.employee_contribution) || 0),
    0
  )

  // -----------------------------------------------------------------------
  // Column definitions
  // -----------------------------------------------------------------------
  const typeColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          {row.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.category?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) =>
            c.toUpperCase()
          )}
        </span>
      ),
    },
    {
      key: 'employer_contribution',
      header: 'Employer Contribution',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.employer_contribution)}
        </span>
      ),
    },
    {
      key: 'employee_contribution',
      header: 'Employee Contribution',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.employee_contribution)}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.is_active ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      key: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleTypeActive(row)
          }}
          disabled={togglingTypeId === row.id}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 disabled:opacity-50"
        >
          {togglingTypeId === row.id
            ? 'Updating…'
            : row.is_active
            ? 'Deactivate'
            : 'Activate'}
        </button>
      ),
    },
  ]

  const enrollmentColumns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.employee?.full_name || '—'}
        </span>
      ),
    },
    {
      key: 'benefit_type',
      header: 'Benefit Type',
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.benefit_type?.name || '—'}
        </span>
      ),
    },
    {
      key: 'enrollment_date',
      header: 'Enrollment Date',
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatDate(row.enrollment_date)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  const healthColumns = [
    {
      key: 'scheme',
      header: 'Scheme',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.scheme || '—'}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.tier || '—'}
        </span>
      ),
    },
    {
      key: 'employer_rate',
      header: 'Employer Rate',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {row.employer_rate != null ? `${row.employer_rate}%` : '—'}
        </span>
      ),
    },
    {
      key: 'employee_rate',
      header: 'Employee Rate',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {row.employee_rate != null ? `${row.employee_rate}%` : '—'}
        </span>
      ),
    },
  ]

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="card">
        <EmptyState
          icon={AlertTriangle}
          title="Organization required"
          description="You must be assigned to an organization to manage benefits."
        />
      </div>
    )
  }

  const tabs = [
    { id: 'types', label: 'Benefit Types', count: totalTypes },
    { id: 'enrollments', label: 'Enrollments', count: enrollments.length },
    { id: 'health', label: 'Health Insurance', count: healthRates.length },
  ]

  return (
    <div>
      <PageHeader
        title="Benefits Administration"
        description="Manage benefit types, employee enrollments, and health insurance rates"
        icon={HeartPulse}
        actions={
          activeTab === 'types' ? (
            <button
              onClick={() => setShowTypeModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <Plus size={16} />
              New Benefit Type
            </button>
          ) : activeTab === 'enrollments' && enrollmentsTableExists ? (
            <button
              onClick={() => setShowEnrollmentModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <Plus size={16} />
              New Enrollment
            </button>
          ) : null
        }
      />

      <div className="mb-6">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Benefit Types Tab                                                  */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'types' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ShieldCheck}
              label="Total Types"
              value={totalTypes}
              color="blue"
              loading={typesLoading}
            />
            <StatCard
              icon={TrendingUp}
              label="Active"
              value={activeTypes}
              color="green"
              loading={typesLoading}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Employer Cost"
              value={formatCurrency(totalEmployerCost)}
              color="purple"
              loading={typesLoading}
            />
            <StatCard
              icon={TrendingDown}
              label="Total Employee Cost"
              value={formatCurrency(totalEmployeeCost)}
              color="cyan"
              loading={typesLoading}
            />
          </div>

          <DataTable
            columns={typeColumns}
            data={benefitTypes}
            loading={typesLoading}
            emptyTitle="No benefit types found"
            emptyDescription="Create your first benefit type to get started."
            emptyIcon={ShieldCheck}
            keyField="id"
          />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Enrollments Tab                                                    */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'enrollments' && (
        <div className="space-y-6">
          {!enrollmentsTableExists ? (
            <div className="card">
              <EmptyState
                icon={Database}
                title="Enrollments table not available"
                description="The 'employee_benefits' table has not been set up in your database yet. Please create it to start managing enrollments."
              />
            </div>
          ) : (
            <DataTable
              columns={enrollmentColumns}
              data={enrollments}
              loading={enrollmentsLoading}
              emptyTitle="No enrollments found"
              emptyDescription="Enroll employees in benefit types to see them here."
              emptyIcon={Users}
              keyField="id"
            />
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Health Insurance Tab                                               */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {!healthTableExists ? (
            <div className="card">
              <EmptyState
                icon={Database}
                title="Health insurance rates table not available"
                description="The 'health_insurance_rates' table has not been set up in your database yet. Please create it to manage rates."
              />
            </div>
          ) : healthLoading ? (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-center py-16">
                <Spinner size="lg" />
              </div>
            </div>
          ) : healthRates.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={HeartPulse}
                title="No health insurance rates found"
                description="Health insurance rates will appear here once they are configured."
              />
            </div>
          ) : (
            <DataTable
              columns={healthColumns}
              data={healthRates}
              loading={healthLoading}
              emptyTitle="No health insurance rates found"
              emptyDescription="Health insurance rates will appear here once they are configured."
              emptyIcon={HeartPulse}
              keyField="id"
            />
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* New Benefit Type Modal                                             */}
      {/* ----------------------------------------------------------------- */}
      <Modal
        open={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        title="New Benefit Type"
        description="Create a new benefit type for your organization"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowTypeModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveType}
              disabled={savingType}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {savingType ? 'Saving…' : 'Save Benefit Type'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={typeForm.name}
              onChange={(e) =>
                setTypeForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g. Medical Insurance"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={typeForm.description}
              onChange={(e) =>
                setTypeForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description of the benefit"
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={typeForm.category}
              onChange={(e) =>
                setTypeForm((f) => ({ ...f, category: e.target.value }))
              }
              className={inputClass}
            >
              {BENEFIT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Employer Contribution</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={typeForm.employer_contribution}
                onChange={(e) =>
                  setTypeForm((f) => ({
                    ...f,
                    employer_contribution: e.target.value,
                  }))
                }
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Employee Contribution</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={typeForm.employee_contribution}
                onChange={(e) =>
                  setTypeForm((f) => ({
                    ...f,
                    employee_contribution: e.target.value,
                  }))
                }
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ----------------------------------------------------------------- */}
      {/* New Enrollment Modal                                               */}
      {/* ----------------------------------------------------------------- */}
      <Modal
        open={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        title="New Enrollment"
        description="Enroll an employee in a benefit type"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowEnrollmentModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEnrollment}
              disabled={savingEnrollment}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {savingEnrollment ? 'Saving…' : 'Save Enrollment'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Employee</label>
            <select
              value={enrollmentForm.employee_id}
              onChange={(e) =>
                setEnrollmentForm((f) => ({
                  ...f,
                  employee_id: e.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="">Select an employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Benefit Type</label>
            <select
              value={enrollmentForm.benefit_type_id}
              onChange={(e) =>
                setEnrollmentForm((f) => ({
                  ...f,
                  benefit_type_id: e.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="">Select a benefit type…</option>
              {benefitTypes
                .filter((t) => t.is_active)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Enrollment Date</label>
            <input
              type="date"
              value={enrollmentForm.enrollment_date}
              onChange={(e) =>
                setEnrollmentForm((f) => ({
                  ...f,
                  enrollment_date: e.target.value,
                }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
