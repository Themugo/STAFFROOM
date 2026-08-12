import React, { useState } from 'react'
import {
  Navigation,
  CheckCircle2,
  Phone,
  AlertTriangle,
  Clock,
  User,
  Users,
  Check,
  Send,
  Radio,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Flame
} from 'lucide-react'

export const SAMPLE_DRIVER_TRIP = {
  tripId: 'TRIP-EXEC-2026-081',
  driverName: 'Joseph Mwangi',
  vehicleName: 'KCB 412A - Enterprise Express Bus (33-Seater)',
  routeTitle: 'Westlands - Lavington - HQ Route',
  shift: 'Morning Shift',
  scheduledStart: '06:45 AM',
  expectedArrival: '07:22 AM',
  totalPassengers: 4,
  boardedPassengers: 2,
  passengers: [
    {
      id: 'P1',
      name: 'Dr. Jane Muthoni',
      pickupPoint: 'Kitisuru Shopping Stage',
      scheduledTime: '06:45 AM',
      phone: '+254 712 990 112',
      status: 'BOARDED'
    },
    {
      id: 'P2',
      name: 'Amina Zainab',
      pickupPoint: 'Yaya Centre Main Stage',
      scheduledTime: '07:00 AM',
      phone: '+254 722 443 322',
      status: 'BOARDED'
    },
    {
      id: 'P3',
      name: 'Samuel Kilonzo',
      pickupPoint: 'Westlands Mall Bus Stage',
      scheduledTime: '07:08 AM',
      phone: '+254 711 009 887',
      status: 'WAITING'
    },
    {
      id: 'P4',
      name: 'Grace Wanjiru',
      pickupPoint: 'Parklands Road Junction Stage',
      scheduledTime: '07:14 AM',
      phone: '+254 733 112 233',
      status: 'WAITING'
    }
  ]
}

export default function DriverWorkspaceApp({ onNotify }) {
  const [trip, setTrip] = useState(SAMPLE_DRIVER_TRIP)
  const [incidentReport, setIncidentReport] = useState('')
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)

  const handleToggleBoarding = (pId) => {
    setTrip(prev => {
      const updatedP = prev.passengers.map(p => {
        if (p.id === pId) {
          const nextStatus = p.status === 'BOARDED' ? 'WAITING' : 'BOARDED'
          return { ...p, status: nextStatus }
        }
        return p
      })
      const boardedCount = updatedP.filter(p => p.status === 'BOARDED').length
      return { ...prev, passengers: updatedP, boardedPassengers: boardedCount }
    })
  }

  const handleReportIncidentSubmit = (e) => {
    e.preventDefault()
    if (!incidentReport) return
    if (onNotify) onNotify(`Incident logged to Transport Dispatch: "${incidentReport}"`)
    setIncidentReport('')
    setIsIncidentModalOpen(false)
  }

  const handleCompleteTrip = () => {
    if (onNotify) onNotify(`Trip ${trip.tripId} marked COMPLETED by Driver ${trip.driverName}!`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mobile-style Driver Navigation Frame Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px] font-bold">
            <Radio size={13} className="animate-pulse text-emerald-400" /> Driver Navigation Console Active
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">{trip.shift}</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">{trip.routeTitle}</h3>
          <p className="text-xs text-slate-400 font-mono">{trip.vehicleName} • Driver: <strong className="text-emerald-400">{trip.driverName}</strong></p>
        </div>

        {/* Boarding Headcount Bar */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Boarding Progress</span>
            <strong className="text-base text-emerald-400">{trip.boardedPassengers} / {trip.totalPassengers} Staff Boarded</strong>
          </div>
          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle size={14} /> Log Incident
          </button>
        </div>
      </div>

      {/* Passenger Pickup Sequence Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Passenger Pickup Manifest & Boarding</span>
          <span className="text-xs font-mono text-slate-400 font-normal">Tap name to toggle boarding</span>
        </h4>

        <div className="space-y-3">
          {trip.passengers.map((p) => {
            const isBoarded = p.status === 'BOARDED'
            return (
              <div
                key={p.id}
                onClick={() => handleToggleBoarding(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isBoarded
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900 dark:text-white">{p.name}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isBoarded ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-mono">
                    Stop: <strong className="text-indigo-600 dark:text-indigo-400">{p.pickupPoint}</strong> ({p.scheduledTime})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${p.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 cursor-pointer"
                    title="Call Passenger"
                  >
                    <Phone size={15} />
                  </a>

                  <div className={`p-2.5 rounded-xl ${isBoarded ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleCompleteTrip}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle2 size={18} /> Mark Trip Route Completed
        </button>
      </div>

      {/* INCIDENT REPORT MODAL */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Report Route Incident to Dispatch
            </h3>

            <form onSubmit={handleReportIncidentSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Incident Details / Delay Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Heavy traffic jam on Museum Hill Flyover. ETA delayed by 10 mins."
                  value={incidentReport}
                  onChange={(e) => setIncidentReport(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
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
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold cursor-pointer"
                >
                  Send Urgent Incident Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
