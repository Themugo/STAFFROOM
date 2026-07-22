import { useEffect, useState } from 'react'
import { Clock, Smartphone, Settings, Plus, CheckCircle, AlertCircle, Calendar, Users, Search, Wifi } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, formatTime, formatDateTime } from '../lib/format'
import { StatCard, Modal, DataTable, StatusBadge, EmptyState, PageHeader, Tabs } from '../components/ui'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'shifts', label: 'Shift Schedules' },
  { id: 'rules', label: 'Attendance Rules' },
  { id: 'devices', label: 'Registered Devices' },
]

const EMPTY_SHIFT = { name: '', start_time: '', end_time: '', break_duration: 30, type: 'STANDARD' }
const EMPTY_RULE = { name: '', type: 'GRACE_PERIOD', value: 15, action: 'WARN' }

export default function AttendanceIntelligence() {
  const { success } = useNotifications()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Mock data for demonstration
  const shifts = [
    { id: 1, name: 'Morning Shift', start_time: '08:00', end_time: '17:00', break_duration: 60, type: 'STANDARD', is_active: true },
    { id: 2, name: 'Evening Shift', start_time: '14:00', end_time: '23:00', break_duration: 60, type: 'SPLIT', is_active: true },
    { id: 3, name: 'Night Shift', start_time: '22:00', end_time: '07:00', break_duration: 45, type: 'NIGHT', is_active: true },
  ]

  const rules = [
    { id: 1, name: 'Grace Period', type: 'GRACE_PERIOD', value: 15, action: 'WARN', is_active: true },
    { id: 2, name: 'Late Arrival Threshold', type: 'LATE_THRESHOLD', value: 30, action: 'DEDUCT_LEAVE', is_active: true },
    { id: 3, name: 'Early Departure', type: 'EARLY_DEPARTURE', value: 30, action: 'WARN', is_active: true },
  ]

  const devices = [
    { id: 1, device_name: 'Main Office Terminal', device_type: 'BIOMETRIC', status: 'ACTIVE', last_used: new Date().toISOString() },
    { id: 2, device_name: 'Reception Tablet', device_type: 'TABLET', status: 'ACTIVE', last_used: new Date().toISOString() },
    { id: 3, device_name: 'Gate Entry System', device_type: 'NFC', status: 'ACTIVE', last_used: new Date().toISOString() },
  ]

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10)
    const [attRes, empRes] = await Promise.all([
      supabase.from('attendance')
        .select('*, employee:employees(id, full_name, department:departments(name))')
        .eq('date', today)
        .order('check_in'),
      supabase.from('employees').select('id, full_name').eq('status', 'ACTIVE').order('full_name'),
    ])
    setAttendance(attRes.data || [])
    setEmployees(empRes.data || [])
    setLoading(false)
  }

  const stats = {
    present: attendance.filter(a => a.check_in).length,
    late: attendance.filter(a => a.check_in && a.check_in > '09:00:00').length,
    onTime: attendance.filter(a => a.check_in && a.check_in <= '09:00:00').length,
    absent: employees.length > 0 ? employees.length - new Set(attendance.map(a => a.employee_id)).size : 0,
  }

  const filteredAttendance = attendance.filter(a =>
    a.employee?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  function openModal(type, data = {}) {
    setForm(data)
    setFormError('')
    setModal(type)
  }

  async function handleSaveShift() {
    if (!form.name || !form.start_time || !form.end_time) {
      setFormError('Name, start time, and end time are required.')
      return
    }
    setSaving(true)
    // Would save to database
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Shift schedule saved successfully')
    setSaving(false)
    setModal(null)
  }

  async function handleSaveRule() {
    if (!form.name || !form.value) {
      setFormError('Name and value are required.')
      return
    }
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Attendance rule saved successfully')
    setSaving(false)
    setModal(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent dark:border-brand-500 dark:border-t-transparent" />
      </div>
    )
  }

  const attendanceColumns = [
    { key: 'employee', header: 'Employee', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.employee?.full_name}</span> },
    { key: 'department', header: 'Department', render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.employee?.department?.name || '—'}</span> },
    { key: 'check_in', header: 'Check In', render: (row) => <span className="text-sm font-mono text-gray-900 dark:text-white">{row.check_in?.slice(0, 5) || '—'}</span> },
    { key: 'status', header: 'Status', render: (row) => (
      <StatusBadge status={row.check_in > '09:00:00' ? 'LATE' : 'ON_TIME'} />
    ) },
    { key: 'method', header: 'Method', render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.method || 'MANUAL'}</span> },
  ]

  const ruleColumns = [
    { key: 'name', header: 'Rule Name', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span> },
    { key: 'type', header: 'Type', render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.type.replace('_', ' ')}</span> },
    { key: 'value', header: 'Value', render: (row) => <span className="text-sm text-gray-900 dark:text-white">{row.value} min</span> },
    { key: 'action', header: 'Action', render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.action}</span> },
    { key: 'is_active', header: 'Status', render: (row) => <StatusBadge status={row.is_active ? 'ACTIVE' : 'INACTIVE'} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Intelligence"
        description="Smart attendance management and rules"
        icon={Clock}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle} label="Present Today" value={stats.present} color="green" />
        <StatCard icon={Clock} label="On Time" value={stats.onTime} color="blue" />
        <StatCard icon={AlertCircle} label="Late Arrivals" value={stats.late} color="yellow" />
        <StatCard icon={Users} label="Absent" value={stats.absent} color="red" />
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
            <div className="relative max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                className="input pl-9 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Search employees..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            columns={attendanceColumns}
            data={filteredAttendance}
            keyField="id"
            emptyTitle="No attendance records for today"
            emptyDescription="Check back once employees start checking in."
            emptyIcon={Calendar}
          />
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openModal('shift', EMPTY_SHIFT)} className="btn-primary">
              <Plus size={16} className="mr-1" /> Add Shift
            </button>
          </div>
          {shifts.length === 0 ? (
            <div className="card">
              <EmptyState icon={Calendar} title="No shift schedules" description="Add a shift schedule to get started." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map(shift => (
                <div key={shift.id} className="card p-5 hover:shadow-md transition dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{shift.name}</h3>
                      <StatusBadge status={shift.type} />
                    </div>
                    {shift.is_active && (
                      <StatusBadge status="ACTIVE" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {shift.start_time} - {shift.end_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Break: {shift.break_duration} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openModal('rule', EMPTY_RULE)} className="btn-primary">
              <Plus size={16} className="mr-1" /> Add Rule
            </button>
          </div>
          <DataTable
            columns={ruleColumns}
            data={rules}
            keyField="id"
            emptyTitle="No attendance rules"
            emptyDescription="Create attendance rules to automate enforcement."
            emptyIcon={Settings}
          />
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="btn-primary">
              <Plus size={16} className="mr-1" /> Register Device
            </button>
          </div>
          {devices.length === 0 ? (
            <div className="card">
              <EmptyState icon={Smartphone} title="No registered devices" description="Register a device to start tracking attendance." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(device => (
                <div key={device.id} className="card p-5 hover:shadow-md transition dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        device.device_type === 'BIOMETRIC' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' :
                        device.device_type === 'TABLET' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                      }`}>
                        {device.device_type === 'BIOMETRIC' ? <Wifi size={18} /> : <Smartphone size={18} />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{device.device_name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{device.device_type}</p>
                      </div>
                    </div>
                    <StatusBadge status={device.status} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last used: {device.last_used ? formatDateTime(device.last_used) : 'Never'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shift Modal */}
      <Modal
        open={modal === 'shift'}
        onClose={() => setModal(null)}
        title="Add Shift Schedule"
        size="md"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveShift} className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Shift Name *</label>
            <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning Shift" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-300">Start Time *</label>
              <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
            </div>
            <div>
              <label className="label dark:text-gray-300">End Time *</label>
              <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label dark:text-gray-300">Break Duration (minutes)</label>
            <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" type="number" value={form.break_duration} onChange={e => setForm({ ...form, break_duration: e.target.value })} />
          </div>
          {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 dark:text-red-400 dark:bg-red-900/30">{formError}</p>}
        </div>
      </Modal>

      {/* Rule Modal */}
      <Modal
        open={modal === 'rule'}
        onClose={() => setModal(null)}
        title="Add Attendance Rule"
        size="md"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveRule} className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Rule Name *</label>
            <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grace Period" />
          </div>
          <div>
            <label className="label dark:text-gray-300">Rule Type</label>
            <select className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="GRACE_PERIOD">Grace Period</option>
              <option value="LATE_THRESHOLD">Late Threshold</option>
              <option value="EARLY_DEPARTURE">Early Departure</option>
            </select>
          </div>
          <div>
            <label className="label dark:text-gray-300">Value (minutes) *</label>
            <input className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          </div>
          <div>
            <label className="label dark:text-gray-300">Action</label>
            <select className="input dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })}>
              <option value="WARN">Warning Only</option>
              <option value="DEDUCT_LEAVE">Deduct Leave</option>
              <option value="EMAIL">Send Email</option>
            </select>
          </div>
          {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 dark:text-red-400 dark:bg-red-900/30">{formError}</p>}
        </div>
      </Modal>
    </div>
  )
}
