import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Navigation,
  Bus,
  Car,
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Fuel,
  MapPin,
  ChevronRight,
  Calendar,
  Send,
  Sliders,
  Check
} from 'lucide-react'

const MOCK_FLEET_POOL = [
  {
    id: 'FLEET-BUS-01',
    name: 'KCB 412A (33-Seater Bus)',
    type: 'Bus',
    capacity: 33,
    fuelLevel: '82%',
    status: 'AVAILABLE',
    roadType: 'HIGHWAY_URBAN',
    wheelDrive: '2WD',
    assignedDriver: 'Joseph Mwangi',
    backupDriver: 'David Otieno',
    maintenanceOk: true,
    docsExpiryOk: true
  },
  {
    id: 'FLEET-VAN-02',
    name: 'KDD 891B (14-Seater Executive Van)',
    type: 'Van',
    capacity: 14,
    fuelLevel: '91%',
    status: 'AVAILABLE',
    roadType: 'HIGHWAY_URBAN',
    wheelDrive: '2WD',
    assignedDriver: 'Amina Hassan',
    backupDriver: 'Samuel Kilonzo',
    maintenanceOk: true,
    docsExpiryOk: true
  },
  {
    id: 'FLEET-SUV-04',
    name: 'KCG 302D (Land Cruiser 4x4 Prado)',
    type: 'SUV 4x4',
    capacity: 7,
    fuelLevel: '78%',
    status: 'AVAILABLE',
    roadType: 'OFFROAD_ROUGH',
    wheelDrive: '4WD',
    assignedDriver: 'Peter Ochieng',
    backupDriver: 'Francis Njoroge',
    maintenanceOk: true,
    docsExpiryOk: true
  },
  {
    id: 'FLEET-SEDAN-05',
    name: 'KDF 555E (Executive Mercedes E-Class)',
    type: 'Executive Sedan',
    capacity: 4,
    fuelLevel: '95%',
    status: 'AVAILABLE',
    roadType: 'HIGHWAY_URBAN',
    wheelDrive: '2WD',
    assignedDriver: 'David Otieno',
    backupDriver: 'Amina Hassan',
    maintenanceOk: true,
    docsExpiryOk: true
  }
]

export default function DispatchCenter({ onDispatch, onNotify }) {
  const toast = useToast()
  const [fleet] = useState(MOCK_FLEET_POOL)

  // Pending Requests to Dispatch
  const [dispatchRequests, setDispatchRequests] = useState([
    {
      id: 'TR-REQ-9012',
      requester: 'Dr. John Kamau',
      department: 'Engineering & IT',
      purpose: 'Project Site Visit',
      destination: 'Naivasha Geothermal Site',
      date: '2026-08-02',
      pickupTime: '07:30 AM',
      passengers: 5,
      needs4x4: true,
      priority: 'HIGH',
      status: 'APPROVED'
    },
    {
      id: 'TR-REQ-9018',
      requester: 'Grace Wanjiku',
      department: 'Sales & Marketing',
      purpose: 'Client Visit',
      destination: 'Naivasha Town Center (Overlapping Route)',
      date: '2026-08-02',
      pickupTime: '07:45 AM',
      passengers: 2,
      needs4x4: false,
      priority: 'STANDARD',
      status: 'APPROVED'
    }
  ])

  const [selectedReqForDispatch, setSelectedReqForDispatch] = useState(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedBackupDriver, setSelectedBackupDriver] = useState('')

  // Trip Consolidation Feature
  const handleConsolidateTrips = () => {
    if (onNotify) {
      onNotify('Trip Consolidation AI Engine: Combined TR-REQ-9012 & TR-REQ-9018 into a single Naivasha SUV Shuttle trip! Saved $65 in fuel.')
    }
    setDispatchRequests(prev =>
      prev.map(r => ({ ...r, isConsolidated: true, consolidatedNote: 'Merged into Naivasha Express Shuttle' }))
    )
  }

  const handleConfirmDispatch = (e) => {
    e.preventDefault()
    if (!selectedVehicleId || !selectedDriver) {
      toast.error('Please select both a vehicle and primary driver.')
      return
    }

    const veh = fleet.find(f => f.id === selectedVehicleId)

    if (onDispatch) {
      onDispatch({
        reqId: selectedReqForDispatch.id,
        vehicle: veh?.name,
        driver: selectedDriver,
        backupDriver: selectedBackupDriver
      })
    }

    if (onNotify) {
      onNotify(`Trip ${selectedReqForDispatch.id} successfully dispatched with ${veh?.name} driven by ${selectedDriver}!`)
    }

    setDispatchRequests(prev => prev.filter(r => r.id !== selectedReqForDispatch.id))
    setSelectedReqForDispatch(null)
  }

  return (
    <div className="space-y-6">
      {/* Smart Matching & Consolidation AI Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold mb-1">
              <Sparkles size={13} /> AI Dispatch & Trip Consolidation Engine
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Vehicle Matching & Route Consolidation
            </h3>
            <p className="text-xs text-slate-500">
              Matches approved requisitions against passenger capacity, terrain requirements (4x4 vs Sedan), driver rest hours, and identifies overlapping routes to merge trips.
            </p>
          </div>

          <button
            onClick={handleConsolidateTrips}
            className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
          >
            <Zap size={15} /> Auto-Consolidate Similar Trips
          </button>
        </div>

        {/* Conflict Detection Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <strong className="text-emerald-950 dark:text-emerald-200 block">0 Double Bookings</strong>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400">All vehicles schedule-clear</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
            <Clock size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <strong className="text-indigo-950 dark:text-indigo-200 block">Rest Period Compliance</strong>
              <span className="text-[11px] text-indigo-800 dark:text-indigo-400">Drivers &lt; 8 hrs driving today</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
            <ShieldAlert size={18} className="text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <strong className="text-purple-950 dark:text-purple-200 block">Documents & Inspection</strong>
              <span className="text-[11px] text-purple-800 dark:text-purple-400">Insurance & NTSA inspections valid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Pending Dispatch */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Navigation size={18} className="text-indigo-600 dark:text-indigo-400" />
          Requisitions Ready for Dispatch Assignment ({dispatchRequests.length})
        </h3>

        <div className="space-y-4 text-xs">
          {dispatchRequests.map((req) => (
            <div
              key={req.id}
              className={`p-5 rounded-2xl border transition-all ${
                req.isConsolidated
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{req.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      {req.department}
                    </span>
                    {req.needs4x4 && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Requires 4x4 Offroad
                      </span>
                    )}
                    {req.isConsolidated && (
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold animate-pulse">
                        Consolidated Shuttle
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <span>{req.purpose}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-indigo-600 dark:text-indigo-300">{req.destination}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-500">
                    <span>Date: <strong>{req.date}</strong></span>
                    <span>Departure: <strong>{req.pickupTime}</strong></span>
                    <span>Passengers: <strong>{req.passengers} Passengers</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedReqForDispatch(req)
                    // Smart recommendation logic default
                    const best = req.needs4x4
                      ? fleet.find(f => f.type.includes('SUV'))
                      : fleet.find(f => f.capacity >= req.passengers)
                    if (best) {
                      setSelectedVehicleId(best.id)
                      setSelectedDriver(best.assignedDriver)
                      setSelectedBackupDriver(best.backupDriver)
                    }
                  }}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 text-xs"
                >
                  <Sliders size={14} /> Assign Vehicle & Dispatch
                </button>
              </div>
            </div>
          ))}

          {dispatchRequests.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All Requisitions Dispatched!</p>
              <p className="text-xs text-slate-500">No pending vehicle assignments in queue.</p>
            </div>
          )}
        </div>
      </div>

      {/* DISPATCH ASSIGNMENT MODAL */}
      {selectedReqForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bus size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Dispatch Assignment for {selectedReqForDispatch.id}
                </h3>
                <p className="text-xs text-slate-500">Assign optimal vehicle and driver roster.</p>
              </div>
              <button
                onClick={() => setSelectedReqForDispatch(null)}
                className="text-slate-400 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Pool Vehicle *</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value)
                    const v = fleet.find(f => f.id === e.target.value)
                    if (v) {
                      setSelectedDriver(v.assignedDriver)
                      setSelectedBackupDriver(v.backupDriver)
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="">-- Choose Pool Vehicle --</option>
                  {fleet.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type} - Cap: {v.capacity} - Fuel: {v.fuelLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Driver *</label>
                <input
                  type="text"
                  required
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Backup Driver</label>
                <input
                  type="text"
                  value={selectedBackupDriver}
                  onChange={(e) => setSelectedBackupDriver(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqForDispatch(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send size={14} /> Confirm & Transmit Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
