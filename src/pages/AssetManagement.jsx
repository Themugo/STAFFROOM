import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Package,
  Plus,
  Download,
  Wrench,
  UserCheck,
  UserMinus,
  CheckCircle,
  Boxes,
  CircleDollarSign,
  CalendarClock,
  History,
  Search,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, formatCurrency } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/Tabs'
import SearchInput from '../components/ui/SearchInput'

// ---- Constants ---------------------------------------------------------------

const CATEGORIES = ['LAPTOP', 'PHONE', 'VEHICLE', 'SIM', 'TOOL', 'FURNITURE', 'LICENSE', 'OTHER']
const CONDITIONS = ['NEW', 'GOOD', 'FAIR', 'POOR']
const MAINTENANCE_TYPES = ['REPAIR', 'SERVICE', 'UPGRADE', 'INSPECTION']

const EMPTY_ASSET = {
  name: '',
  asset_tag: '',
  category: 'LAPTOP',
  serial_number: '',
  purchase_date: '',
  purchase_cost: '',
  condition: 'NEW',
}

const EMPTY_ASSIGNMENT = {
  asset_id: '',
  employee_id: '',
  assignment_date: new Date().toISOString().slice(0, 10),
}

const EMPTY_MAINTENANCE = {
  asset_id: '',
  maintenance_type: 'SERVICE',
  scheduled_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

// ---- Helpers -----------------------------------------------------------------

const CATEGORY_LABELS = {
  LAPTOP: 'Laptop',
  PHONE: 'Phone',
  VEHICLE: 'Vehicle',
  SIM: 'SIM',
  TOOL: 'Tool',
  FURNITURE: 'Furniture',
  LICENSE: 'License',
  OTHER: 'Other',
}

const CONDITION_LABELS = {
  NEW: 'New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
}

const CONDITION_COLORS = {
  NEW: 'green',
  GOOD: 'blue',
  FAIR: 'yellow',
  POOR: 'red',
}

const MAINTENANCE_TYPE_LABELS = {
  REPAIR: 'Repair',
  SERVICE: 'Service',
  UPGRADE: 'Upgrade',
  INSPECTION: 'Inspection',
}

// ---- Component ---------------------------------------------------------------

export default function AssetManagement() {
  const { profile } = useAuth()
  const { success, error: errorNotify } = useNotifications()

  const [activeTab, setActiveTab] = useState('assets')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  // Data
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [assignments, setAssignments] = useState([])
  const [maintenanceRecords, setMaintenanceRecords] = useState([])

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modals
  const [assetModalOpen, setAssetModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)

  // Forms
  const [assetForm, setAssetForm] = useState(EMPTY_ASSET)
  const [assignmentForm, setAssignmentForm] = useState(EMPTY_ASSIGNMENT)
  const [maintenanceForm, setMaintenanceForm] = useState(EMPTY_MAINTENANCE)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // ---- Fetch -----------------------------------------------------------------

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [assetsRes, employeesRes, assignmentsRes, maintenanceRes] = await Promise.all([
        supabase
          .from('assets')
          .select('id, name, asset_tag, category, serial_number, status, purchase_date, purchase_cost, assigned_to, condition, created_at, assigned_date')
          .order('created_at', { ascending: false }),
        supabase
          .from('employees')
          .select('id, full_name, email')
          .eq('status', 'ACTIVE')
          .order('full_name'),
        supabase
          .from('asset_assignments')
          .select('id, asset_id, employee_id, employee:employees(full_name), assigned_by, assigner:profiles(full_name), assignment_date, return_date, notes, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('asset_maintenance')
          .select('id, asset_id, asset:assets(name, asset_tag), maintenance_type, scheduled_date, completed_date, status, notes, created_at')
          .order('created_at', { ascending: false }),
      ])

      if (assetsRes.error) throw assetsRes.error
      if (employeesRes.error) throw employeesRes.error
      if (assignmentsRes.error) throw assignmentsRes.error
      if (maintenanceRes.error) throw maintenanceRes.error

      setAssets(assetsRes.data || [])
      setEmployees(employeesRes.data || [])
      setAssignments(assignmentsRes.data || [])
      setMaintenanceRecords(maintenanceRes.data || [])
    } catch (err) {
      console.error('fetchAll error:', err)
      errorNotify('Failed to load asset data')
    } finally {
      setLoading(false)
    }
  }, [errorNotify])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ---- Derived data ----------------------------------------------------------

  const employeeMap = useMemo(() => {
    const map = new Map()
    employees.forEach((e) => map.set(e.id, e))
    return map
  }, [employees])

  // Enrich assets with assigned employee name
  const enrichedAssets = useMemo(() => {
    return assets.map((a) => ({
      ...a,
      assigned_employee: a.assigned_to ? employeeMap.get(a.assigned_to) : null,
    }))
  }, [assets, employeeMap])

  const stats = useMemo(() => {
    const total = assets.length
    const assigned = assets.filter((a) => a.status === 'ASSIGNED').length
    const available = assets.filter((a) => a.status === 'AVAILABLE').length
    const inMaintenance = assets.filter((a) => a.status === 'MAINTENANCE').length
    const totalValue = assets.reduce((sum, a) => sum + Number(a.purchase_cost || 0), 0)
    return { total, assigned, available, inMaintenance, totalValue }
  }, [assets])

  const filteredAssets = useMemo(() => {
    let result = enrichedAssets
    if (categoryFilter !== 'all') {
      result = result.filter((a) => a.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.asset_tag?.toLowerCase().includes(q) ||
          a.serial_number?.toLowerCase().includes(q) ||
          a.assigned_employee?.full_name?.toLowerCase().includes(q)
      )
    }
    return result
  }, [enrichedAssets, categoryFilter, search])

  const assignedAssets = useMemo(
    () => enrichedAssets.filter((a) => a.status === 'ASSIGNED'),
    [enrichedAssets]
  )

  const maintenanceAssets = useMemo(
    () => enrichedAssets.filter((a) => a.status === 'MAINTENANCE' || a.condition === 'POOR'),
    [enrichedAssets]
  )

  const availableAssets = useMemo(
    () => assets.filter((a) => a.status === 'AVAILABLE'),
    [assets]
  )

  // ---- CSV Export ------------------------------------------------------------

  const handleExportCSV = useCallback(() => {
    if (filteredAssets.length === 0) {
      errorNotify('No assets to export')
      return
    }
    const headers = ['Name', 'Asset Tag', 'Category', 'Serial Number', 'Status', 'Assigned To', 'Condition', 'Purchase Date', 'Purchase Cost']
    const rows = filteredAssets.map((a) => [
      a.name || '',
      a.asset_tag || '',
      CATEGORY_LABELS[a.category] || a.category || '',
      a.serial_number || '',
      a.status || '',
      a.assigned_employee?.full_name || '',
      CONDITION_LABELS[a.condition] || a.condition || '',
      a.purchase_date || '',
      a.purchase_cost || '',
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assets-export-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    success('CSV exported successfully')
  }, [filteredAssets, success, errorNotify])

  // ---- Create Asset ----------------------------------------------------------

  const openAssetModal = () => {
    setAssetForm(EMPTY_ASSET)
    setFormError('')
    setAssetModalOpen(true)
  }

  const handleCreateAsset = async (e) => {
    e.preventDefault()
    if (!assetForm.name) {
      setFormError('Asset name is required.')
      return
    }
    if (!profile?.organization_id) {
      setFormError('Your organization is not set. Please contact an administrator.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        name: assetForm.name,
        asset_tag: assetForm.asset_tag || null,
        category: assetForm.category,
        serial_number: assetForm.serial_number || null,
        purchase_date: assetForm.purchase_date || null,
        purchase_cost: assetForm.purchase_cost ? Number(assetForm.purchase_cost) : null,
        condition: assetForm.condition,
        status: 'AVAILABLE',
        organization_id: profile.organization_id,
      }
      const { error } = await supabase.from('assets').insert(payload)
      if (error) throw error
      setAssetModalOpen(false)
      success('Asset created successfully')
      fetchAll()
    } catch (err) {
      console.error('createAsset error:', err)
      setFormError(err.message || 'Failed to create asset')
    } finally {
      setSaving(false)
    }
  }

  // ---- Assign Asset ----------------------------------------------------------

  const openAssignmentModal = () => {
    setAssignmentForm(EMPTY_ASSIGNMENT)
    setFormError('')
    setAssignmentModalOpen(true)
  }

  const handleAssignAsset = async (e) => {
    e.preventDefault()
    if (!assignmentForm.asset_id) {
      setFormError('Please select an asset to assign.')
      return
    }
    if (!assignmentForm.employee_id) {
      setFormError('Please select an employee.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      // 1. Update the asset: set status to ASSIGNED, set assigned_to and assigned_date
      const { error: updateErr } = await supabase
        .from('assets')
        .update({
          status: 'ASSIGNED',
          assigned_to: assignmentForm.employee_id,
          assigned_date: assignmentForm.assignment_date,
        })
        .eq('id', assignmentForm.asset_id)
      if (updateErr) throw updateErr

      // 2. Close any existing open assignment for this asset
      await supabase
        .from('asset_assignments')
        .update({ return_date: assignmentForm.assignment_date })
        .eq('asset_id', assignmentForm.asset_id)
        .is('return_date', null)

      // 3. Create a new assignment history record
      const { error: assignErr } = await supabase.from('asset_assignments').insert({
        asset_id: assignmentForm.asset_id,
        employee_id: assignmentForm.employee_id,
        assigned_by: profile?.id || null,
        assignment_date: assignmentForm.assignment_date,
        organization_id: profile?.organization_id || null,
      })
      if (assignErr) throw assignErr

      setAssignmentModalOpen(false)
      success('Asset assigned successfully')
      fetchAll()
    } catch (err) {
      console.error('assignAsset error:', err)
      setFormError(err.message || 'Failed to assign asset')
    } finally {
      setSaving(false)
    }
  }

  // ---- Unassign Asset --------------------------------------------------------

  const handleUnassign = async (asset) => {
    setActionLoading(asset.id)
    try {
      const today = new Date().toISOString().slice(0, 10)
      // 1. Update the asset: set status back to AVAILABLE, clear assigned_to
      const { error: updateErr } = await supabase
        .from('assets')
        .update({
          status: 'AVAILABLE',
          assigned_to: null,
          assigned_date: null,
        })
        .eq('id', asset.id)
      if (updateErr) throw updateErr

      // 2. Close the open assignment record
      await supabase
        .from('asset_assignments')
        .update({ return_date: today })
        .eq('asset_id', asset.id)
        .is('return_date', null)

      success('Asset unassigned successfully')
      fetchAll()
    } catch (err) {
      console.error('unassignAsset error:', err)
      errorNotify('Failed to unassign asset')
    } finally {
      setActionLoading(null)
    }
  }

  // ---- Schedule Maintenance --------------------------------------------------

  const openMaintenanceModal = () => {
    setMaintenanceForm(EMPTY_MAINTENANCE)
    setFormError('')
    setMaintenanceModalOpen(true)
  }

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault()
    if (!maintenanceForm.asset_id) {
      setFormError('Please select an asset.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      // 1. Create the maintenance record
      const { error: maintErr } = await supabase.from('asset_maintenance').insert({
        asset_id: maintenanceForm.asset_id,
        maintenance_type: maintenanceForm.maintenance_type,
        scheduled_date: maintenanceForm.scheduled_date,
        notes: maintenanceForm.notes || null,
        status: 'SCHEDULED',
        organization_id: profile?.organization_id || null,
      })
      if (maintErr) throw maintErr

      // 2. Update the asset status to MAINTENANCE
      const { error: updateErr } = await supabase
        .from('assets')
        .update({ status: 'MAINTENANCE' })
        .eq('id', maintenanceForm.asset_id)
      if (updateErr) throw updateErr

      setMaintenanceModalOpen(false)
      success('Maintenance scheduled successfully')
      fetchAll()
    } catch (err) {
      console.error('scheduleMaintenance error:', err)
      setFormError(err.message || 'Failed to schedule maintenance')
    } finally {
      setSaving(false)
    }
  }

  // ---- Complete Maintenance --------------------------------------------------

  const handleCompleteMaintenance = async (record) => {
    setActionLoading(record.id)
    try {
      const today = new Date().toISOString().slice(0, 10)
      // 1. Update the maintenance record to COMPLETED
      const { error: maintErr } = await supabase
        .from('asset_maintenance')
        .update({
          status: 'COMPLETED',
          completed_date: today,
        })
        .eq('id', record.id)
      if (maintErr) throw maintErr

      // 2. Update the asset status back to AVAILABLE
      const { error: updateErr } = await supabase
        .from('assets')
        .update({ status: 'AVAILABLE' })
        .eq('id', record.asset_id)
      if (updateErr) throw updateErr

      success('Maintenance completed successfully')
      fetchAll()
    } catch (err) {
      console.error('completeMaintenance error:', err)
      errorNotify('Failed to complete maintenance')
    } finally {
      setActionLoading(null)
    }
  }

  // ---- Table Columns ---------------------------------------------------------

  const assetColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          {row.asset_tag && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.asset_tag}</p>
          )}
        </div>
      ),
    },
    {
      key: 'asset_tag',
      header: 'Asset Tag',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.asset_tag || '—'}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {CATEGORY_LABELS[row.category] || row.category || '—'}
        </span>
      ),
    },
    {
      key: 'serial_number',
      header: 'Serial',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {row.serial_number || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'assigned_to',
      header: 'Assigned To',
      render: (row) =>
        row.assigned_employee ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              {row.assigned_employee.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
              {row.assigned_employee.full_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (row) =>
        row.condition ? (
          <StatusBadge
            status={CONDITION_COLORS[row.condition] || 'gray'}
            label={CONDITION_LABELS[row.condition] || row.condition}
          />
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'purchase_cost',
      header: 'Value',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.purchase_cost)}
        </span>
      ),
    },
  ]

  const assignmentColumns = [
    {
      key: 'name',
      header: 'Asset',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          {row.asset_tag && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.asset_tag}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {CATEGORY_LABELS[row.category] || row.category || '—'}
        </span>
      ),
    },
    {
      key: 'serial_number',
      header: 'Serial',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {row.serial_number || '—'}
        </span>
      ),
    },
    {
      key: 'assigned_to',
      header: 'Assigned To',
      render: (row) =>
        row.assigned_employee ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              {row.assigned_employee.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
              {row.assigned_employee.full_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'assigned_date',
      header: 'Assigned Date',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.assigned_date)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleUnassign(row)}
          disabled={actionLoading === row.id}
          className="flex items-center gap-1.5 rounded-lg bg-danger-100 px-2.5 py-1.5 text-xs font-medium text-danger-700 transition hover:bg-danger-200 disabled:opacity-50 dark:bg-danger-900/40 dark:text-danger-400 dark:hover:bg-danger-900/60"
        >
          {actionLoading === row.id ? (
            <Spinner size="sm" className="!h-3 !w-3" />
          ) : (
            <UserMinus size={14} />
          )}
          Unassign
        </button>
      ),
    },
  ]

  const maintenanceColumns = [
    {
      key: 'name',
      header: 'Asset',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          {row.asset_tag && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.asset_tag}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {CATEGORY_LABELS[row.category] || row.category || '—'}
        </span>
      ),
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (row) =>
        row.condition ? (
          <StatusBadge
            status={CONDITION_COLORS[row.condition] || 'gray'}
            label={CONDITION_LABELS[row.condition] || row.condition}
          />
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleCompleteMaintenance({ id: row.id, asset_id: row.id })}
          disabled={actionLoading === row.id}
          className="flex items-center gap-1.5 rounded-lg bg-success-100 px-2.5 py-1.5 text-xs font-medium text-success-700 transition hover:bg-success-200 disabled:opacity-50 dark:bg-success-900/40 dark:text-success-400 dark:hover:bg-success-900/60"
        >
          {actionLoading === row.id ? (
            <Spinner size="sm" className="!h-3 !w-3" />
          ) : (
            <CheckCircle size={14} />
          )}
          Mark Complete
        </button>
      ),
    },
  ]

  const maintenanceHistoryColumns = [
    {
      key: 'asset',
      header: 'Asset',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {row.asset?.name || '—'}
          </p>
          {row.asset?.asset_tag && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.asset.asset_tag}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'maintenance_type',
      header: 'Type',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {MAINTENANCE_TYPE_LABELS[row.maintenance_type] || row.maintenance_type}
        </span>
      ),
    },
    {
      key: 'scheduled_date',
      header: 'Scheduled',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.scheduled_date)}
        </span>
      ),
    },
    {
      key: 'completed_date',
      header: 'Completed',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.completed_date)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">
          {row.notes || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) =>
        row.status !== 'COMPLETED' ? (
          <button
            onClick={() => handleCompleteMaintenance(row)}
            disabled={actionLoading === row.id}
            className="flex items-center gap-1.5 rounded-lg bg-success-100 px-2.5 py-1.5 text-xs font-medium text-success-700 transition hover:bg-success-200 disabled:opacity-50 dark:bg-success-900/40 dark:text-success-400 dark:hover:bg-success-900/60"
          >
            {actionLoading === row.id ? (
              <Spinner size="sm" className="!h-3 !w-3" />
            ) : (
              <CheckCircle size={14} />
            )}
            Complete
          </button>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">No actions</span>
        ),
    },
  ]

  const assignmentHistoryColumns = [
    {
      key: 'asset_id',
      header: 'Asset',
      render: (row) => {
        const asset = assets.find((a) => a.id === row.asset_id)
        return (
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {asset?.name || '—'}
            </p>
            {asset?.asset_tag && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {asset.asset_tag}
              </p>
            )}
          </div>
        )
      },
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (row) =>
        row.employee?.full_name ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              {row.employee.full_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
              {row.employee.full_name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ),
    },
    {
      key: 'assignment_date',
      header: 'Assigned',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.assignment_date)}
        </span>
      ),
    },
    {
      key: 'return_date',
      header: 'Returned',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.return_date)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.return_date ? 'CLOSED' : 'ACTIVE'}
          label={row.return_date ? 'Returned' : 'Active'}
        />
      ),
    },
  ]

  // ---- Tabs config -----------------------------------------------------------

  const tabs = [
    { id: 'assets', label: 'Assets', count: stats.total },
    { id: 'assignments', label: 'Assignments', count: stats.assigned },
    { id: 'maintenance', label: 'Maintenance', count: maintenanceAssets.length },
  ]

  // ---- Render ----------------------------------------------------------------

  return (
    <div>
      <PageHeader
        title="Asset Management"
        description="Track, assign, and maintain company assets"
        icon={Package}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === 'assets' && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Download size={18} />
                  Export CSV
                </button>
                <button
                  onClick={openAssetModal}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  <Plus size={18} />
                  New Asset
                </button>
              </>
            )}
            {activeTab === 'assignments' && (
              <button
                onClick={openAssignmentModal}
                disabled={availableAssets.length === 0}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                <UserCheck size={18} />
                Assign Asset
              </button>
            )}
            {activeTab === 'maintenance' && (
              <button
                onClick={openMaintenanceModal}
                disabled={assets.length === 0}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                <Wrench size={18} />
                Schedule Maintenance
              </button>
            )}
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard
          icon={Boxes}
          label="Total Assets"
          value={stats.total}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={UserCheck}
          label="Assigned"
          value={stats.assigned}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={Package}
          label="Available"
          value={stats.available}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={Wrench}
          label="In Maintenance"
          value={stats.inMaintenance}
          color="yellow"
          loading={loading}
        />
        <StatCard
          icon={CircleDollarSign}
          label="Total Value"
          value={formatCurrency(stats.totalValue)}
          color="cyan"
          loading={loading}
        />
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ---- Assets Tab ---- */}
      {activeTab === 'assets' && (
        <>
          {/* Search + Category Filter */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, tag, serial, or assignee..."
              className="sm:w-80"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Category:
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input sm:w-48"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={assetColumns}
            data={filteredAssets}
            loading={loading}
            keyField="id"
            emptyIcon={Package}
            emptyTitle="No assets found"
            emptyDescription={
              search || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Add a new asset to get started.'
            }
          />
        </>
      )}

      {/* ---- Assignments Tab ---- */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Currently Assigned */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Currently Assigned ({assignedAssets.length})
            </h2>
            <DataTable
              columns={assignmentColumns}
              data={assignedAssets}
              loading={loading}
              keyField="id"
              emptyIcon={UserCheck}
              emptyTitle="No assigned assets"
              emptyDescription="Assign an asset to an employee to see it here."
            />
          </div>

          {/* Assignment History */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <History size={16} />
              Assignment History
            </h2>
            <DataTable
              columns={assignmentHistoryColumns}
              data={assignments}
              loading={loading}
              keyField="id"
              emptyIcon={History}
              emptyTitle="No assignment history"
              emptyDescription="Assignment records will appear here once assets are assigned."
            />
          </div>
        </div>
      )}

      {/* ---- Maintenance Tab ---- */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Assets needing maintenance */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Assets Needing Maintenance ({maintenanceAssets.length})
            </h2>
            <DataTable
              columns={maintenanceColumns}
              data={maintenanceAssets}
              loading={loading}
              keyField="id"
              emptyIcon={Wrench}
              emptyTitle="No assets need maintenance"
              emptyDescription="Assets in maintenance or in poor condition will appear here."
            />
          </div>

          {/* Maintenance History */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <CalendarClock size={16} />
              Maintenance Records
            </h2>
            <DataTable
              columns={maintenanceHistoryColumns}
              data={maintenanceRecords}
              loading={loading}
              keyField="id"
              emptyIcon={CalendarClock}
              emptyTitle="No maintenance records"
              emptyDescription="Scheduled and completed maintenance will appear here."
            />
          </div>
        </div>
      )}

      {/* ---- New Asset Modal ---- */}
      <Modal
        open={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        title="New Asset"
        description="Register a new company asset"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setAssetModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAsset}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {saving ? <Spinner size="sm" className="!h-4 !w-4" /> : <Plus size={16} />}
              Create Asset
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                placeholder="e.g. MacBook Pro 16"
                required
                className="input"
              />
            </div>

            {/* Asset Tag */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Asset Tag
              </label>
              <input
                type="text"
                value={assetForm.asset_tag}
                onChange={(e) => setAssetForm({ ...assetForm, asset_tag: e.target.value })}
                placeholder="e.g. AST-001"
                className="input"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={assetForm.category}
                onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            {/* Serial Number */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Serial Number
              </label>
              <input
                type="text"
                value={assetForm.serial_number}
                onChange={(e) => setAssetForm({ ...assetForm, serial_number: e.target.value })}
                placeholder="e.g. SN-123456789"
                className="input"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Purchase Date
              </label>
              <input
                type="date"
                value={assetForm.purchase_date}
                onChange={(e) => setAssetForm({ ...assetForm, purchase_date: e.target.value })}
                className="input"
              />
            </div>

            {/* Purchase Cost */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Purchase Cost
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={assetForm.purchase_cost}
                onChange={(e) => setAssetForm({ ...assetForm, purchase_cost: e.target.value })}
                placeholder="0.00"
                className="input"
              />
            </div>

            {/* Condition */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Condition
              </label>
              <div className="flex gap-3 flex-wrap">
                {CONDITIONS.map((c) => (
                  <label
                    key={c}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition min-w-[100px] ${
                      assetForm.condition === c
                        ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/30'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={c}
                      checked={assetForm.condition === c}
                      onChange={() => setAssetForm({ ...assetForm, condition: c })}
                      className="sr-only"
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${
                        c === 'NEW'
                          ? 'bg-green-500'
                          : c === 'GOOD'
                          ? 'bg-blue-500'
                          : c === 'FAIR'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {CONDITION_LABELS[c]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {formError}
            </div>
          )}
        </form>
      </Modal>

      {/* ---- Assign Asset Modal ---- */}
      <Modal
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title="Assign Asset"
        description="Assign an available asset to an employee"
        size="md"
        footer={
          <>
            <button
              onClick={() => setAssignmentModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignAsset}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {saving ? <Spinner size="sm" className="!h-4 !w-4" /> : <UserCheck size={16} />}
              Assign
            </button>
          </>
        }
      >
        <form onSubmit={handleAssignAsset} className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset <span className="text-danger-500">*</span>
            </label>
            <select
              value={assignmentForm.asset_id}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, asset_id: e.target.value })}
              className="input"
              required
            >
              <option value="">— Select an available asset —</option>
              {availableAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.asset_tag ? ` (${a.asset_tag})` : ''}
                </option>
              ))}
            </select>
            {availableAssets.length === 0 && (
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                No available assets. All assets are currently assigned or in maintenance.
              </p>
            )}
          </div>

          {/* Employee Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee <span className="text-danger-500">*</span>
            </label>
            <select
              value={assignmentForm.employee_id}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, employee_id: e.target.value })}
              className="input"
              required
            >
              <option value="">— Select an employee —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignment Date <span className="text-danger-500">*</span>
            </label>
            <input
              type="date"
              value={assignmentForm.assignment_date}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, assignment_date: e.target.value })}
              className="input"
              required
            />
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {formError}
            </div>
          )}
        </form>
      </Modal>

      {/* ---- Schedule Maintenance Modal ---- */}
      <Modal
        open={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        title="Schedule Maintenance"
        description="Schedule maintenance for an asset"
        size="md"
        footer={
          <>
            <button
              onClick={() => setMaintenanceModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleMaintenance}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {saving ? <Spinner size="sm" className="!h-4 !w-4" /> : <Wrench size={16} />}
              Schedule
            </button>
          </>
        }
      >
        <form onSubmit={handleScheduleMaintenance} className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset <span className="text-danger-500">*</span>
            </label>
            <select
              value={maintenanceForm.asset_id}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, asset_id: e.target.value })}
              className="input"
              required
            >
              <option value="">— Select an asset —</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.asset_tag ? ` (${a.asset_tag})` : ''}
                  {a.status === 'MAINTENANCE' ? ' — already in maintenance' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Maintenance Type
            </label>
            <div className="flex gap-3 flex-wrap">
              {MAINTENANCE_TYPES.map((t) => (
                <label
                  key={t}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition min-w-[100px] ${
                    maintenanceForm.maintenance_type === t
                      ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="maintenance_type"
                    value={t}
                    checked={maintenanceForm.maintenance_type === t}
                    onChange={() => setMaintenanceForm({ ...maintenanceForm, maintenance_type: t })}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {MAINTENANCE_TYPE_LABELS[t]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Scheduled Date <span className="text-danger-500">*</span>
            </label>
            <input
              type="date"
              value={maintenanceForm.scheduled_date}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduled_date: e.target.value })}
              className="input"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              value={maintenanceForm.notes}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
              placeholder="Describe the maintenance needed..."
              rows={4}
              className="input resize-none"
            />
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {formError}
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}
