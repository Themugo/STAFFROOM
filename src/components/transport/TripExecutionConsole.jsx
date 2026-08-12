import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  QrCode,
  ShieldAlert,
  Fuel,
  MapPin,
  Clock,
  UserCheck,
  Star,
  FileText,
  Camera,
  Check
} from 'lucide-react'

export default function TripExecutionConsole({ onNotify }) {
  const toast = useToast()
  const [tripState, setTripState] = useState({
    id: 'TRIP-2026-0801',
    route: 'West Zone Express (Westlands - HQ)',
    vehicle: 'KCB 412A (33-Seater Bus)',
    driver: 'Joseph Mwangi',
    status: 'EN_ROUTE', // NOT_STARTED, ACCEPTED, EN_ROUTE, PAUSED, COMPLETED
    startOdometer: 42350,
    endOdometer: 42378,
    fuelAddedLiters: 0,
    fuelCostDollars: 0,
    passengers: [
      { id: 'EMP-101', name: 'Dr. Jane Muthoni', checkedIn: true, seat: '04A' },
      { id: 'EMP-102', name: 'Kevin Omondi', checkedIn: true, seat: '04B' },
      { id: 'EMP-103', name: 'Faith Chebet', checkedIn: false, seat: '05A' },
      { id: 'EMP-104', name: 'Daniel Kiprop', checkedIn: true, seat: '05B' }
    ]
  })

  const [incidentNote, setIncidentNote] = useState('')
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)
  const [isOdometerModalOpen, setIsOdometerModalOpen] = useState(false)

  const toggleCheckIn = (empId) => {
    setTripState(prev => ({
      ...prev,
      passengers: prev.passengers.map(p =>
        p.id === empId ? { ...p, checkedIn: !p.checkedIn } : p
      )
    }))
    if (onNotify) onNotify(`Passenger check-in status toggled for ${empId}.`)
  }

  const handleStartTrip = () => {
    setTripState(prev => ({ ...prev, status: 'EN_ROUTE' }))
    if (onNotify) onNotify('Trip TRIP-2026-0801 started! GPS telemetry stream live.')
  }

  const handlePauseTrip = () => {
    setTripState(prev => ({ ...prev, status: 'PAUSED' }))
    if (onNotify) onNotify('Trip TRIP-2026-0801 paused by driver Joseph Mwangi.')
  }

  const handleResumeTrip = () => {
    setTripState(prev => ({ ...prev, status: 'EN_ROUTE' }))
    if (onNotify) onNotify('Trip TRIP-2026-0801 resumed.')
  }

  const handleCompleteTrip = () => {
    setTripState(prev => ({ ...prev, status: 'COMPLETED' }))
    if (onNotify) onNotify('Trip TRIP-2026-0801 marked COMPLETED! Final odometer & passenger logs submitted.')
  }

  const handleIncidentSubmit = (e) => {
    e.preventDefault()
    if (!incidentNote.trim()) {
      toast.error('Please enter incident details.')
      return
    }
    if (onNotify) onNotify(`Incident report submitted to Transport Manager & Safety Officer: "${incidentNote}"`)
    setIsIncidentModalOpen(false)
    setIncidentNote('')
  }

  return (
    <div className="space-y-6">
      {/* Driver Workspace Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[11px] font-bold mb-1">
              <Navigation size={13} className="animate-pulse" /> Active Trip Execution Console
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tripState.route}</h3>
            <p className="text-xs text-slate-500">
              Vehicle: <strong>{tripState.vehicle}</strong> • Driver: <strong>{tripState.driver}</strong>
            </p>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center gap-2">
            {tripState.status === 'NOT_STARTED' && (
              <button
                onClick={handleStartTrip}
                className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-md cursor-pointer"
              >
                <Play size={16} /> Start Trip
              </button>
            )}

            {tripState.status === 'EN_ROUTE' && (
              <>
                <button
                  onClick={handlePauseTrip}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Pause size={15} /> Pause
                </button>
                <button
                  onClick={handleCompleteTrip}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 text-xs cursor-pointer shadow-md"
                >
                  <CheckCircle2 size={15} /> Complete Trip
                </button>
              </>
            )}

            {tripState.status === 'PAUSED' && (
              <button
                onClick={handleResumeTrip}
                className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs shadow-md cursor-pointer"
              >
                <Play size={16} /> Resume Trip
              </button>
            )}

            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <AlertTriangle size={15} /> Report Incident
            </button>
          </div>
        </div>

        {/* Telematics & Odometer Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Start Odometer</span>
            <strong className="text-lg text-slate-900 dark:text-white block">{tripState.startOdometer} km</strong>
            <span className="text-slate-500 text-[11px]">Logged at Departure</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">End Odometer</span>
            <strong className="text-lg text-slate-900 dark:text-white block">{tripState.endOdometer} km</strong>
            <span className="text-emerald-600 text-[11px] font-bold">+28 km Distance Travelled</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Fuel & Odometer Log</span>
            <button
              onClick={() => setIsOdometerModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline block text-xs pt-1"
            >
              Log Fuel / Capture Receipt
            </button>
          </div>
        </div>

        {/* Passenger Manifest & QR Boarding Check-In */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
              Passenger Boarding Manifest & Check-In ({tripState.passengers.filter(p => p.checkedIn).length} / {tripState.passengers.length} Boarded)
            </h4>

            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <QrCode size={14} /> Scan QR Boarding Pass Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {tripState.passengers.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white">{p.name}</strong>
                    <span className="font-mono text-[10px] text-slate-400">Seat {p.seat}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{p.id}</span>
                </div>

                <button
                  onClick={() => toggleCheckIn(p.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    p.checkedIn
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p.checkedIn ? 'Boarded ✓' : 'Mark Boarded'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REPORT INCIDENT MODAL */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-500" />
              Report Incident / Emergency Assistance
            </h3>

            <form onSubmit={handleIncidentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Incident Type</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold">
                  <option>Traffic Gridlock Delay (&gt; 20 mins)</option>
                  <option>Flat Tire / Minor Breakdown</option>
                  <option>Road Accident / Collision</option>
                  <option>Passenger Medical Emergency</option>
                  <option>Vehicle Fuel Exhaustion</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Details & Location Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe location, road conditions, and assistance required..."
                  value={incidentNote}
                  onChange={(e) => setIncidentNote(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                >
                  Transmit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUEL & ODOMETER MODAL */}
      {isOdometerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Fuel size={18} className="text-amber-500" />
              Capture Fuel Refill & Odometer Log
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fuel Added (Liters)</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Cost ($ or KSh)</label>
                <input
                  type="number"
                  placeholder="e.g. 65.50"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOdometerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onNotify) onNotify('Fuel refill receipt log saved successfully!')
                    setIsOdometerModalOpen(false)
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
