import React, { useState } from 'react'
import {
  Building2,
  Car,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Users,
  Search,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Check,
  X
} from 'lucide-react'

export const HUB_LOCATIONS = [
  { id: 'HQ_NAIROBI', name: 'Head Office - Upper Hill, Nairobi', type: 'Headquarters' },
  { id: 'MOMBASA_BRANCH', name: 'Mombasa Regional Office - Nyali', type: 'Regional Office' },
  { id: 'KISUMU_BRANCH', name: 'Kisumu Hub - Oginga Odinga Road', type: 'Branch Office' },
  { id: 'THIKA_FACTORY', name: 'Thika Industrial Plant & Factory', type: 'Factory' },
  { id: 'NAIVASHA_WAREHOUSE', name: 'Naivasha Logistics Center', type: 'Warehouse' },
  { id: 'LEVEL5_HOSPITAL', name: 'Kiambu Hospital Annex', type: 'Hospital' },
  { id: 'JUJA_CAMPUS', name: 'Jomo Kenyatta Campus Center', type: 'University Campus' }
]

export const POOL_RESERVATIONS = [
  {
    id: 'RES-801',
    vehicleName: 'KDD 891B - Executive Shuttle Van',
    department: 'Hospital Emergency Unit',
    requester: 'Dr. Samuel Otieno',
    origin: 'Head Office - Upper Hill, Nairobi',
    destination: 'Kiambu Hospital Annex',
    timeSlot: '08:00 AM - 12:00 PM',
    priority: 'EMERGENCY',
    status: 'APPROVED',
    hasConflict: false
  },
  {
    id: 'RES-802',
    vehicleName: 'KCR 104C - Industrial Van',
    department: 'Logistics & Warehouse',
    requester: 'Grace Wambui',
    origin: 'Head Office - Upper Hill, Nairobi',
    destination: 'Naivasha Logistics Center',
    timeSlot: '10:00 AM - 04:00 PM',
    priority: 'STANDARD',
    status: 'CONFLICT_DETECTED',
    hasConflict: true,
    conflictDetails: 'Overlaps with Routine Audit Reservation RES-803 (11:00 AM - 03:00 PM)'
  },
  {
    id: 'RES-803',
    vehicleName: 'KCB 412A - Enterprise Bus',
    department: 'University Staff Training',
    requester: 'Prof. Mark Njuguna',
    origin: 'Head Office - Upper Hill, Nairobi',
    destination: 'Jomo Kenyatta Campus Center',
    timeSlot: '07:30 AM - 05:00 PM',
    priority: 'HIGH',
    status: 'APPROVED',
    hasConflict: false
  }
]

export default function MultiBranchVehicleSharing({ onNotify }) {
  const [hubs] = useState(HUB_LOCATIONS)
  const [reservations, setReservations] = useState(POOL_RESERVATIONS)
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)

  const [newRes, setNewRes] = useState({
    department: 'Finance & Operations',
    requester: '',
    origin: 'HQ_NAIROBI',
    destination: 'THIKA_FACTORY',
    date: '2026-08-05',
    timeSlot: '09:00 AM - 01:00 PM',
    priority: 'STANDARD'
  })

  const handleResolveConflict = (resId) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === resId) {
          return {
            ...r,
            status: 'APPROVED',
            hasConflict: false,
            conflictDetails: null,
            vehicleName: 'KDD 990Z - Backup Pool Shuttle'
          }
        }
        return r;
      })
    )
    if (onNotify) {
      onNotify(`Conflict resolved for reservation ${resId}! Reassigned to Backup Pool Vehicle KDD 990Z.`)
    }
  }

  const handleReserveSubmit = (e) => {
    e.preventDefault()
    const origName = hubs.find(h => h.id === newRes.origin)?.name || newRes.origin
    const destName = hubs.find(h => h.id === newRes.destination)?.name || newRes.destination

    const created = {
      id: `RES-${Math.floor(800 + Math.random() * 100)}`,
      vehicleName: 'Shared Pool Shuttle (Auto-Assigned)',
      department: newRes.department,
      requester: newRes.requester || 'Department Lead',
      origin: origName,
      destination: destName,
      timeSlot: newRes.timeSlot,
      priority: newRes.priority,
      status: 'APPROVED',
      hasConflict: false
    }

    setReservations(prev => [created, ...prev])
    if (onNotify) onNotify(`Shared vehicle reserved for ${newRes.department} from ${origName} to ${destName}.`)
    setIsReserveModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold mb-1">
              <Building2 size={13} /> Enterprise Multi-Branch & Shared Pool Routing
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Branch Inter-Hub Transport & Shared Vehicle Reservations
            </h3>
            <p className="text-xs text-slate-500">
              Connect Head Office, regional branches, factories, hospitals, and campuses. Reserve shared pool vehicles with real-time time-slot conflict detection.
            </p>
          </div>

          <button
            onClick={() => setIsReserveModalOpen(true)}
            className="btn-primary bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
          >
            <Plus size={16} /> Reserve Shared Pool Vehicle
          </button>
        </div>

        {/* Hub Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 text-xs">
          {hubs.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            >
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">{h.type}</span>
              <strong className="text-slate-900 dark:text-white text-[11px] block mt-0.5 truncate" title={h.name}>
                {h.name}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Active Pool Reservations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Car size={18} className="text-blue-600 dark:text-blue-400" />
          Active Multi-Branch Pool Reservations & Time-Slot Conflicts
        </h3>

        <div className="space-y-4">
          {reservations.map((res) => (
            <div
              key={res.id}
              className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                res.hasConflict
                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{res.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-900 dark:text-white">{res.vehicleName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    res.priority === 'EMERGENCY'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : res.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {res.priority} PRIORITY
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    res.hasConflict
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>

              {/* Route Path */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-bold">{res.origin}</span>
                <ArrowRight size={14} className="text-blue-600 dark:text-blue-400 shrink-0 hidden sm:block" />
                <span className="text-slate-700 dark:text-slate-300 font-bold">{res.destination}</span>
              </div>

              {res.hasConflict && (
                <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="shrink-0" />
                    <span><strong>Conflict Warning:</strong> {res.conflictDetails}</span>
                  </div>
                  <button
                    onClick={() => handleResolveConflict(res.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold cursor-pointer text-[11px] shrink-0"
                  >
                    Auto-Reassign Alternate Vehicle
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                <span>Department: <strong className="text-slate-800 dark:text-slate-200">{res.department}</strong> ({res.requester})</span>
                <span>Time Slot: <strong className="text-blue-600 dark:text-blue-400">{res.timeSlot}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESERVE MODAL */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={18} className="text-blue-600 dark:text-blue-400" />
              Reserve Multi-Branch Pool Vehicle
            </h3>

            <form onSubmit={handleReserveSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quality Control / Medical Unit"
                  value={newRes.department}
                  onChange={(e) => setNewRes({ ...newRes, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Origin Hub</label>
                  <select
                    value={newRes.origin}
                    onChange={(e) => setNewRes({ ...newRes, origin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {hubs.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination Hub</label>
                  <select
                    value={newRes.destination}
                    onChange={(e) => setNewRes({ ...newRes, destination: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {hubs.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot Window</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 01:00 PM"
                    value={newRes.timeSlot}
                    onChange={(e) => setNewRes({ ...newRes, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Rule</label>
                  <select
                    value={newRes.priority}
                    onChange={(e) => setNewRes({ ...newRes, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="STANDARD">Standard Business</option>
                    <option value="HIGH">High Priority Field Operation</option>
                    <option value="EMERGENCY">Medical / Emergency First</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
