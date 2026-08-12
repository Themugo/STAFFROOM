import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Briefcase,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  ShieldAlert,
  Luggage,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  Car,
  Bus,
  ArrowRight
} from 'lucide-react'

export const REQUEST_PURPOSES = [
  'Official Meeting',
  'Client Visit',
  'Field Work',
  'Project Site Visit',
  'Bank Errands',
  'Court Attendance',
  'Medical Referral',
  'Airport Pickup',
  'Airport Drop-off',
  'Document Delivery',
  'Inter-Branch Travel',
  'Executive Transport',
  'VIP Transport',
  'Emergency Transport',
  'Training',
  'Workshop',
  'Conference'
]

export const DEPARTMENTS = [
  'Operations',
  'Finance & Accounting',
  'Human Resources',
  'Engineering & IT',
  'Sales & Marketing',
  'Legal & Compliance',
  'Executive Office',
  'Supply Chain & Logistics'
]

export const PRIORITIES = [
  { id: 'STANDARD', label: 'Standard', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'HIGH', label: 'High Priority', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'URGENT', label: 'Urgent', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'EMERGENCY', label: 'VIP / Emergency', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse' }
]

export default function TransportBookingPortal({
  requests = [],
  onSubmitRequest,
  onCancelRequest,
  onNotify
}) {
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form State
  const [form, setForm] = useState({
    purpose: 'Official Meeting',
    destination: '',
    mapsLocation: '',
    stops: [''],
    passengerCount: 1,
    passengers: [''],
    department: 'Operations',
    costCentre: 'CC-OPS-101',
    projectCode: 'PRJ-2026-NBO',
    priority: 'STANDARD',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '08:30',
    returnTime: '17:00',
    estimatedDurationHours: 4,
    luggageRequirements: 'Standard Hand Luggage',
    specialInstructions: '',
    accessibilityNeeded: false,
    needsOffroad4x4: false
  })

  const handleAddStop = () => {
    setForm(prev => ({ ...prev, stops: [...prev.stops, ''] }))
  }

  const handleRemoveStop = (index) => {
    setForm(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }))
  }

  const handleStopChange = (index, value) => {
    const updated = [...form.stops]
    updated[index] = value
    setForm(prev => ({ ...prev, stops: updated }))
  }

  const handleAddPassenger = () => {
    setForm(prev => ({ ...prev, passengers: [...prev.passengers, ''] }))
  }

  const handlePassengerChange = (index, value) => {
    const updated = [...form.passengers]
    updated[index] = value
    setForm(prev => ({ ...prev, passengers: updated }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.destination.trim()) {
      toast.error('Please specify a primary destination.')
      return
    }

    const newReq = {
      id: `TR-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: form.priority === 'EMERGENCY' ? 'APPROVED' : 'PENDING_SUPERVISOR',
      approvalStage: form.priority === 'EMERGENCY' ? 'Emergency Override Auto-Approved' : 'Stage 1: Supervisor Review',
      ...form,
      passengersClean: form.passengers.filter(p => p.trim())
    }

    if (onSubmitRequest) onSubmitRequest(newReq)
    if (onNotify) {
      onNotify(
        form.priority === 'EMERGENCY'
          ? `Emergency Transport Request ${newReq.id} auto-approved & dispatched to Transport Office!`
          : `Transport Request ${newReq.id} submitted for ${form.purpose} to ${form.destination}.`
      )
    }

    setIsModalOpen(false)
    // Reset Form
    setForm({
      purpose: 'Official Meeting',
      destination: '',
      mapsLocation: '',
      stops: [''],
      passengerCount: 1,
      passengers: [''],
      department: 'Operations',
      costCentre: 'CC-OPS-101',
      projectCode: 'PRJ-2026-NBO',
      priority: 'STANDARD',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '08:30',
      returnTime: '17:00',
      estimatedDurationHours: 4,
      luggageRequirements: 'Standard Hand Luggage',
      specialInstructions: '',
      accessibilityNeeded: false,
      needsOffroad4x4: false
    })
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Create Callout */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles size={14} />
            <span>StaffRoom Centralized Vehicle Booking Engine</span>
          </div>
          <h2 className="text-xl font-black">Transport Booking & Official Travel Portal</h2>
          <p className="text-xs text-slate-300">
            Submit official travel requisitions for meetings, field site visits, airport shuttles, and inter-branch missions with automatic vehicle capacity and route matrix matching.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="z-10 btn-primary bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-5 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer shrink-0 text-xs"
        >
          <Plus size={16} /> Submit Transport Request
        </button>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search request ID, destination, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-bold shrink-0">Filter Status:</span>
          {['ALL', 'PENDING_SUPERVISOR', 'APPROVED', 'DISPATCHED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
            Company Vehicle Booking Register ({filteredRequests.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">Real-time Approval & Dispatch Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-3">Req ID & Priority</th>
                <th className="py-3 px-3">Purpose & Destination</th>
                <th className="py-3 px-3">Schedule & Duration</th>
                <th className="py-3 px-3">Department & Cost Centre</th>
                <th className="py-3 px-3">Approval Stage</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all">
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                      {req.id}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1 ${
                      PRIORITIES.find(p => p.id === req.priority)?.color || 'bg-slate-100 text-slate-700'
                    }`}>
                      {req.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Briefcase size={13} className="text-indigo-500 shrink-0" />
                      {req.purpose}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span>{req.destination}</span>
                    </div>
                    {req.stops && req.stops.filter(s => s).length > 0 && (
                      <span className="text-[10px] text-indigo-500 block font-mono mt-0.5">
                        +{req.stops.filter(s => s).length} Intermediate Waypoint Stops
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="text-slate-900 dark:text-white font-bold">{req.pickupDate}</div>
                    <span className="text-[11px] text-slate-500 block">
                      {req.pickupTime} - {req.returnTime} ({req.estimatedDurationHours} hrs)
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-900 dark:text-white font-bold">{req.department}</div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Cost Center: {req.costCentre}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Project: {req.projectCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${
                      req.status === 'APPROVED' || req.status === 'DISPATCHED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : req.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {req.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 truncate max-w-[160px]">
                      {req.approvalStage}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          if (onCancelRequest) onCancelRequest(req.id)
                          if (onNotify) onNotify(`Transport request ${req.id} cancelled.`)
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Cancel Request"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transport booking requests found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="text-indigo-600 dark:text-indigo-400" size={20} />
                  New Corporate Transport Booking Requisition
                </h3>
                <p className="text-xs text-slate-500">Provide official purpose, destination, stopovers, and travel parameters.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Purpose & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Trip Purpose *</label>
                  <select
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
                    {REQUEST_PURPOSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Classification *</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
                    {PRIORITIES.map((pr) => (
                      <option key={pr.id} value={pr.id}>{pr.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Destination & Google Maps Lookup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Destination Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Westlands Office Park / JKA Airport / Naivasha Site"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Google Maps Geolocation Search</label>
                  <input
                    type="text"
                    placeholder="e.g. -1.286389, 36.817223 or Building Name"
                    value={form.mapsLocation}
                    onChange={(e) => setForm({ ...form, mapsLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Intermediate Stops */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                    <MapPin size={14} className="text-indigo-500" /> Intermediate Waypoint Stops (Multi-Stop Itinerary)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-[11px] flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Waypoint
                  </button>
                </div>
                {form.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">Stop #{idx + 1}:</span>
                    <input
                      type="text"
                      placeholder={`Stopover ${idx + 1} address/point`}
                      value={stop}
                      onChange={(e) => handleStopChange(idx, e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    {form.stops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(idx)}
                        className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Department, Cost Center, Project Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cost Centre</label>
                  <input
                    type="text"
                    value={form.costCentre}
                    onChange={(e) => setForm({ ...form, costCentre: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Code</label>
                  <input
                    type="text"
                    value={form.projectCode}
                    onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Date & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.pickupDate}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pickup Time *</label>
                  <input
                    type="time"
                    required
                    value={form.pickupTime}
                    onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Return Time *</label>
                  <input
                    type="time"
                    required
                    value={form.returnTime}
                    onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Vehicle Specs & Luggage Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Luggage & Cargo Requirements</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Heavy Field Kits, 2 Laptops"
                    value={form.luggageRequirements}
                    onChange={(e) => setForm({ ...form, luggageRequirements: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.needsOffroad4x4}
                      onChange={(e) => setForm({ ...form, needsOffroad4x4: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Requires 4x4 Offroad Vehicle (Rough Terrain)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.accessibilityNeeded}
                      onChange={(e) => setForm({ ...form, accessibilityNeeded: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Requires Wheelchair / Special Assistance Access</span>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Special Instructions for Dispatch Officer</label>
                <textarea
                  rows={2}
                  placeholder="Additional notes, VIP protocol, gates security clearance instructions..."
                  value={form.specialInstructions}
                  onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send size={15} /> Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
