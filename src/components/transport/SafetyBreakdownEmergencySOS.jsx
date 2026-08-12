import React, { useState } from 'react'
import {
  ShieldAlert,
  CheckSquare,
  AlertTriangle,
  PhoneCall,
  Car,
  Wrench,
  Radio,
  Sparkles,
  CheckCircle2,
  XCircle,
  Siren,
  Shield,
  LifeBuoy
} from 'lucide-react'

export const INITIAL_CHECKLIST_ITEMS = [
  { id: 'CHK-01', label: 'Fuel Level Check (> 50% Full)', status: 'PASS' },
  { id: 'CHK-02', label: 'Tyre Pressure & Spare Tyre Inspection', status: 'PASS' },
  { id: 'CHK-03', label: 'Brake Fluid & Hydraulic Brakes Test', status: 'PASS' },
  { id: 'CHK-04', label: 'Headlights, Indicators & Hazard Lights', status: 'PASS' },
  { id: 'CHK-05', label: 'Fire Extinguisher & Life Safety Kit', status: 'PASS' },
  { id: 'CHK-06', label: 'First Aid Kit & Emergency Reflector Triangles', status: 'PASS' },
  { id: 'CHK-07', label: 'Vehicle Interior Sanitization & Cleanliness', status: 'PASS' }
]

export const SAMPLE_BREAKDOWNS = [
  {
    id: 'BRK-901',
    vehicleName: 'KCR 104C - Industrial Van',
    driver: 'Peter Ochieng',
    driverPhone: '+254 733 456 789',
    location: 'Mombasa Road (Near Bellevue Stage)',
    issue: 'Alternator & Battery Failure',
    passengersOnboard: 10,
    status: 'REPLACEMENT_DISPATCHED',
    replacementVehicle: 'FLEET-VAN-09 (KDD 990Z)',
    etaReplacement: '8 mins'
  }
]

export default function SafetyBreakdownEmergencySOS({ onNotify }) {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST_ITEMS)
  const [breakdowns, setBreakdowns] = useState(SAMPLE_BREAKDOWNS)
  const [isSosActive, setIsSosActive] = useState(false)
  const [sosType, setSosType] = useState('PASSENGER_SOS')
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false)

  const [newBreakdown, setNewBreakdown] = useState({
    vehicleName: 'KCB 412A - Enterprise Bus',
    driver: 'Joseph Mwangi',
    location: 'Waiyaki Way - Kangemi Stage',
    issue: 'Puncture / Flat Tyre',
    passengersOnboard: 28
  })

  const handleToggleChecklist = (id) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'PASS' ? 'FAIL' : 'PASS' }
          : item
      )
    )
  }

  const handleTriggerSOS = (type) => {
    setIsSosActive(true)
    setSosType(type)
    if (onNotify) {
      onNotify(`🚨 SECURITY SOS TRIGGERED (${type})! Command Center and Emergency Services notified. Live GPS broadcasting!`)
    }
  }

  const handleDeactivateSOS = () => {
    setIsSosActive(false)
    if (onNotify) onNotify('SOS Incident resolved and reset by Security Dispatch.')
  }

  const handleReportBreakdownSubmit = (e) => {
    e.preventDefault()
    const created = {
      id: `BRK-${Math.floor(900 + Math.random() * 100)}`,
      ...newBreakdown,
      driverPhone: '+254 712 345 678',
      status: 'REPLACEMENT_DISPATCHED',
      replacementVehicle: 'FLEET-SHUTTLE-04 (Auto-Dispatched)',
      etaReplacement: '12 mins'
    }

    setBreakdowns(prev => [created, ...prev])
    if (onNotify) onNotify(`Breakdown reported for ${created.vehicleName}. Replacement vehicle dispatched!`)
    setIsBreakdownModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Panic SOS Banner */}
      <div className={`p-6 rounded-3xl border shadow-lg space-y-4 transition-all ${
        isSosActive
          ? 'bg-rose-900 text-white border-rose-500 animate-pulse'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono text-[11px] font-bold mb-1">
              <Siren size={14} className="animate-spin" /> Emergency & Live Safety Command Center
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Emergency Panic SOS & Incident Response System
            </h3>
            <p className="text-xs text-slate-500">
              One-tap Emergency Panic SOS for Drivers and Passengers. Instantly broadcasts GPS position to Enterprise Security Command, Kenya Police, and Ambulance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSosActive ? (
              <button
                onClick={handleDeactivateSOS}
                className="px-5 py-3 rounded-2xl bg-white text-rose-900 font-extrabold text-xs cursor-pointer shadow-xl hover:bg-rose-50"
              >
                Deactivate & Reset SOS Incident
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerSOS('DRIVER_SOS')}
                  className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-2"
                >
                  <ShieldAlert size={16} /> Driver SOS
                </button>
                <button
                  onClick={() => handleTriggerSOS('PASSENGER_SOS')}
                  className="px-4 py-3 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Siren size={16} /> Passenger SOS
                </button>
              </div>
            )}
          </div>
        </div>

        {isSosActive && (
          <div className="p-4 rounded-2xl bg-rose-950 text-rose-100 border border-rose-700 space-y-2 text-xs font-mono">
            <strong className="text-sm block">🚨 LIVE SECURITY ALERT IN PROGRESS ({sosType})</strong>
            <p>GPS Pin: -1.2863, 36.8172 | Driver: Joseph Mwangi | Vehicle: KCB 412A Bus</p>
            <p className="text-amber-300">Enterprise Security Response & Nairobi County Emergency Services Notified.</p>
          </div>
        )}
      </div>

      {/* Driver Daily Pre-Trip Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
            Driver Daily Pre-Trip Safety & Equipment Checklist
          </h3>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Mandatory Sign-off Before Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {checklist.map((chk) => (
            <div
              key={chk.id}
              onClick={() => handleToggleChecklist(chk.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                chk.status === 'PASS'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
              }`}
            >
              <span className="font-bold">{chk.label}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                chk.status === 'PASS' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Breakdown & Replacement Dispatch */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench size={18} className="text-amber-600 dark:text-amber-400" />
            Vehicle Breakdown Management & Replacement Auto-Dispatch
          </h3>

          <button
            onClick={() => setIsBreakdownModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle size={15} /> Report Vehicle Breakdown
          </button>
        </div>

        <div className="space-y-3">
          {breakdowns.map((brk) => (
            <div
              key={brk.id}
              className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold text-[10px]">{brk.id}</span>
                  <strong className="text-slate-900 dark:text-white text-sm block">{brk.vehicleName}</strong>
                  <span className="text-[11px] text-slate-500 font-mono">Driver: {brk.driver} ({brk.driverPhone})</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-[10px] font-mono self-start sm:self-center">
                  {brk.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div><span className="text-slate-400">Location:</span> <strong>{brk.location}</strong></div>
                <div><span className="text-slate-400">Issue:</span> <strong className="text-rose-600 dark:text-rose-400">{brk.issue}</strong></div>
                <div><span className="text-slate-400">Passengers Onboard:</span> <strong>{brk.passengersOnboard} Passengers</strong></div>
                <div><span className="text-slate-400">Replacement Vehicle:</span> <strong className="text-emerald-600 dark:text-emerald-400">{brk.replacementVehicle} (ETA {brk.etaReplacement})</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT BREAKDOWN MODAL */}
      {isBreakdownModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench size={18} className="text-amber-600 dark:text-amber-400" />
              Report Vehicle Mechanical Breakdown
            </h3>

            <form onSubmit={handleReportBreakdownSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Name / Reg *</label>
                <input
                  type="text"
                  required
                  value={newBreakdown.vehicleName}
                  onChange={(e) => setNewBreakdown({ ...newBreakdown, vehicleName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Breakdown Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mombasa Road, near South B flyover"
                  value={newBreakdown.location}
                  onChange={(e) => setNewBreakdown({ ...newBreakdown, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Overheating / Flat Tyre"
                  value={newBreakdown.issue}
                  onChange={(e) => setNewBreakdown({ ...newBreakdown, issue: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Passengers Onboard</label>
                <input
                  type="number"
                  min={1}
                  value={newBreakdown.passengersOnboard}
                  onChange={(e) => setNewBreakdown({ ...newBreakdown, passengersOnboard: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBreakdownModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold cursor-pointer"
                >
                  Dispatch Replacement Shuttle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
