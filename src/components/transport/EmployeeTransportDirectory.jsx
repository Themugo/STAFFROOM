import React, { useState, useMemo } from 'react'
import {
  Users,
  Bus,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  X,
  Plus,
  Download,
  AlertCircle,
  Check,
  Send,
  Navigation,
  UserCheck
} from 'lucide-react'

// Initial Employee Transport Registry Data
const INITIAL_TRANSPORT_EMPLOYEES = [
  {
    id: 'EMP-101',
    name: 'Sarah Jenkins',
    department: 'Engineering',
    role: 'Senior Software Architect',
    transportRequired: true,
    residenceArea: 'Westlands, Brookside Drive',
    pickupPoint: 'Westlands Square Mall',
    destination: 'STAFFROOM Enterprise HQ',
    shift: 'Morning Shift',
    route: 'Westlands - Lavington Express',
    vehicle: 'KCB 412A (Bus)',
    status: 'Active / Assigned'
  },
  {
    id: 'EMP-102',
    name: 'Michael Chen',
    department: 'Operations',
    role: 'Logistics Supervisor',
    transportRequired: true,
    residenceArea: 'Kilimani, Yaya Avenue',
    pickupPoint: 'Yaya Centre Bus Stop',
    destination: 'STAFFROOM Enterprise HQ',
    shift: 'Morning Shift',
    route: 'Kilimani - Kileleshwa Rapid',
    vehicle: 'KDD 891B (Van)',
    status: 'Active / Assigned'
  },
  {
    id: 'EMP-103',
    name: 'Purity Wanjiru',
    department: 'Human Resources',
    role: 'HR Business Partner',
    transportRequired: false,
    residenceArea: 'Kileleshwa, Oloitokitok Rd',
    pickupPoint: 'Self Transport',
    destination: 'STAFFROOM Enterprise HQ',
    shift: 'Morning Shift',
    route: 'N/A (Opted Out)',
    vehicle: 'Personal Vehicle',
    status: 'Opted Out'
  },
  {
    id: 'EMP-104',
    name: 'Dennis Ochieng',
    department: 'Manufacturing',
    role: 'Plant Maintenance Tech',
    transportRequired: true,
    residenceArea: 'Mombasa Road, Syokimau',
    pickupPoint: 'Gateway Mall Stage',
    destination: 'Industrial Plant HQ',
    shift: 'Early Shift',
    route: 'Mombasa Rd Industrial Corridor',
    vehicle: 'KCR 104C (Van)',
    status: 'Active / Assigned'
  },
  {
    id: 'EMP-105',
    name: 'Amina Mohamed',
    department: 'Finance',
    role: 'Financial Analyst',
    transportRequired: true,
    residenceArea: 'Thika Road, Kasarani',
    pickupPoint: 'Roysambu Stage',
    destination: 'STAFFROOM Enterprise HQ',
    shift: 'Morning Shift',
    route: 'Thika Rd Superhighway Shuttle',
    vehicle: 'KDB 302D (Coaster)',
    status: 'Active / Assigned'
  },
  {
    id: 'EMP-106',
    name: 'Kevin Mutua',
    department: 'Customer Success',
    role: 'Support Lead',
    transportRequired: true,
    residenceArea: 'Upper Hill, Elgon Rd',
    pickupPoint: 'KCB Towers Stage',
    destination: 'STAFFROOM Enterprise HQ',
    shift: 'Afternoon Shift',
    route: 'Upper Hill Direct',
    vehicle: 'KCE 711E (Van)',
    status: 'Pending Review'
  }
]

export default function EmployeeTransportDirectory({ onActionClick }) {
  const [employees, setEmployees] = useState(INITIAL_TRANSPORT_EMPLOYEES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [shiftFilter, setShiftFilter] = useState('ALL')
  const [showConfidentialData, setShowConfidentialData] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState(null)

  // Configure Modal State
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const notify = (msg) => {
    setNotificationMsg(msg)
    setTimeout(() => setNotificationMsg(null), 3500)
    if (onActionClick) onActionClick(msg)
  }

  // Filtered Roster
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.residenceArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.pickupPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.route.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'REQUIRED' && emp.transportRequired) ||
        (statusFilter === 'OPTED_OUT' && !emp.transportRequired) ||
        emp.status === statusFilter

      const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter
      const matchesShift = shiftFilter === 'ALL' || emp.shift === shiftFilter

      return matchesSearch && matchesStatus && matchesDept && matchesShift
    })
  }, [employees, searchQuery, statusFilter, departmentFilter, shiftFilter])

  // KPI Calculations
  const totalEmployeesCount = employees.length
  const transportRequiredCount = employees.filter((e) => e.transportRequired).length
  const assignedActiveCount = employees.filter((e) => e.status === 'Active / Assigned').length
  const pendingReviewCount = employees.filter((e) => e.status === 'Pending Review').length

  const handleOpenConfigure = (emp) => {
    setSelectedEmployee(emp)
    setEditForm({ ...emp })
  }

  const handleSaveConfigure = (e) => {
    e.preventDefault()
    if (!editForm) return

    setEmployees((prev) => prev.map((e) => (e.id === editForm.id ? editForm : e)))
    notify(`Transport profile updated for ${editForm.name}.`)
    setSelectedEmployee(null)
    setEditForm(null)
  }

  return (
    <div className="space-y-6 text-[#102A43]">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2563EB] text-white text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {notificationMsg}
          </span>
          <button onClick={() => setNotificationMsg(null)} className="hover:opacity-80 font-bold px-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE6F2] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider mb-1">
            <Users size={16} /> HR & Transport Administration
          </div>
          <h1 className="text-2xl font-black text-[#102A43] tracking-tight">
            Employee Transport Roster
          </h1>
          <p className="text-xs text-[#52677F] mt-0.5">
            Configure employee transport requirements, pickup points, shifts, and sensitive residence data.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowConfidentialData(!showConfidentialData)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all hover:border-[#2563EB]"
          >
            {showConfidentialData ? <EyeOff size={15} /> : <Eye size={15} />}
            {showConfidentialData ? 'Mask Residence Addresses' : 'HR Unmask Residence Data'}
          </button>

          <button
            onClick={() => notify('Employee transport roster exported to CSV.')}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
          >
            <Download size={15} /> Export Roster
          </button>
        </div>
      </div>

      {/* KPI METRICS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">Total Roster</span>
          <div className="text-2xl font-black text-[#102A43] pt-1">{totalEmployeesCount}</div>
          <p className="text-[11px] text-[#52677F]">Registered staff members</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">Transport Required</span>
          <div className="text-2xl font-black text-[#2563EB] pt-1">{transportRequiredCount}</div>
          <p className="text-[11px] text-[#52677F]">Enrolled for staff shuttle</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">Assigned & Active</span>
          <div className="text-2xl font-black text-[#159A68] pt-1">{assignedActiveCount}</div>
          <p className="text-[11px] text-[#52677F]">Active route allocation</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">Pending Review</span>
          <div className="text-2xl font-black text-[#D98B00] pt-1">{pendingReviewCount}</div>
          <p className="text-[11px] text-[#52677F]">Awaiting route assignment</p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#F6F9FD] p-3.5 rounded-2xl border border-[#DCE6F2]">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-2.5 text-[#52677F]" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Search by name, ID, residence, pickup, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[#52677F] font-bold text-[11px]">Requirement:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white text-[#52677F] border border-[#DCE6F2] hover:bg-[#EAF3FF]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('REQUIRED')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'REQUIRED'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white text-[#52677F] border border-[#DCE6F2] hover:bg-[#EAF3FF]'
                }`}
              >
                Required (Yes)
              </button>
              <button
                onClick={() => setStatusFilter('OPTED_OUT')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === 'OPTED_OUT'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white text-[#52677F] border border-[#DCE6F2] hover:bg-[#EAF3FF]'
                }`}
              >
                Opted Out (No)
              </button>
            </div>
          </div>
        </div>

        {/* EMPLOYEE TRANSPORT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCE6F2] text-[#52677F] uppercase font-mono text-[10px] tracking-wider bg-[#F6F9FD]">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Transport Required</th>
                <th className="py-3 px-3">Residence Area (Sensitive)</th>
                <th className="py-3 px-3">Preferred Pickup Point</th>
                <th className="py-3 px-3">Destination / Work Site</th>
                <th className="py-3 px-3">Shift & Route</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6F2] font-medium">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F6F9FD] transition-all">
                  {/* Employee Name & Dept */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#102A43]">{emp.name}</div>
                    <div className="text-[10px] text-[#52677F]">
                      {emp.role} • <span className="font-semibold text-[#2563EB]">{emp.department}</span>
                    </div>
                  </td>

                  {/* Transport Required */}
                  <td className="py-3.5 px-3">
                    {emp.transportRequired ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#159A68]/15 text-[#159A68] border border-[#159A68]/30 inline-flex items-center gap-1">
                        <Check size={12} /> Yes
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#52677F] border border-[#DCE6F2] inline-flex items-center gap-1">
                        No (Self)
                      </span>
                    )}
                  </td>

                  {/* Residence Area */}
                  <td className="py-3.5 px-3">
                    {showConfidentialData ? (
                      <span className="font-bold text-[#102A43] flex items-center gap-1">
                        <MapPin size={13} className="text-[#2563EB]" />
                        {emp.residenceArea}
                      </span>
                    ) : (
                      <span className="font-mono text-[#52677F] text-[11px]">
                        {emp.residenceArea.split(',')[0]} [MASKED]
                      </span>
                    )}
                  </td>

                  {/* Pickup Point */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#102A43]">{emp.pickupPoint}</div>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-3">
                    <div className="text-[#102A43]">{emp.destination}</div>
                  </td>

                  {/* Shift & Route */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#2563EB]">{emp.shift}</div>
                    <div className="text-[10px] text-[#52677F]">{emp.route}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        emp.status === 'Active / Assigned'
                          ? 'bg-[#159A68]/15 text-[#159A68] border border-[#159A68]/30'
                          : emp.status === 'Pending Review'
                          ? 'bg-[#D98B00]/15 text-[#D98B00] border border-[#D98B00]/30'
                          : 'bg-slate-100 text-[#52677F] border border-[#DCE6F2]'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  {/* Configure Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleOpenConfigure(emp)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/30 font-bold text-xs cursor-pointer transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Edit3 size={13} /> Configure
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#52677F]">
                    No employees found matching search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIGURE EMPLOYEE TRANSPORT MODAL */}
      {selectedEmployee && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                  <UserCheck size={18} className="text-[#2563EB]" />
                  Configure Transport Requirements
                </h3>
                <p className="text-xs text-[#52677F]">
                  Updating profile for <strong className="text-[#102A43]">{editForm.name}</strong> ({editForm.department})
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-[#52677F] hover:text-[#102A43] p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveConfigure} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Transport Required</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={editForm.transportRequired ? 'YES' : 'NO'}
                    onChange={(e) =>
                      setEditForm({ ...editForm, transportRequired: e.target.value === 'YES' })
                    }
                  >
                    <option value="YES">Yes - Enrolled</option>
                    <option value="NO">No - Opted Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Transport Status</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active / Assigned">Active / Assigned</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Opted Out">Opted Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Residence / Area (Sensitive)</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={editForm.residenceArea}
                  onChange={(e) => setEditForm({ ...editForm, residenceArea: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Preferred Pickup Point</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={editForm.pickupPoint}
                  onChange={(e) => setEditForm({ ...editForm, pickupPoint: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Destination Work Site</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={editForm.destination}
                  onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Shift</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={editForm.shift}
                    onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                  >
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Early Shift">Early Shift</option>
                    <option value="Afternoon Shift">Afternoon Shift</option>
                    <option value="Night Shift">Night Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Assigned Route</label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={editForm.route}
                    onChange={(e) => setEditForm({ ...editForm, route: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Save Transport Requirements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
