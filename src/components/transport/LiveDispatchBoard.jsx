import React from 'react'
import {
  Activity,
  Bus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Send,
  MapPin,
  ShieldAlert,
  XCircle,
  RefreshCw
} from 'lucide-react'

export default function LiveDispatchBoard({
  vehicles = [],
  trips = [],
  onActionClick
}) {
  const handleTriggerAction = (msg) => {
    if (onActionClick) onActionClick(msg)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
            Live Enterprise Dispatch & Fleet Operational Board
          </h3>
          <p className="text-xs text-slate-500">
            Real-time status board tracking pending, approved, in-transit, delayed, emergency, and completed company trips.
          </p>
        </div>

        <button
          onClick={() => handleTriggerAction('Live dispatch board synchronized with GPS stream.')}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={14} /> Refresh Operational Board
        </button>
      </div>

      {/* Operational Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Column 1: Approved & Scheduled */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500" /> Approved & Scheduled
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold">
              2
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>TRIP-2026-0804</span>
              <span>02:00 PM Departure</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">Thika Road Superhighway Shuttle</strong>
            <p className="text-[11px] text-slate-500">Vehicle: KDB 302D (Coaster) • Driver: Samuel Kilonzo</p>
            <button
              onClick={() => handleTriggerAction('Pushed early reminder to Driver Samuel Kilonzo for 02:00 PM trip.')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-[11px] block pt-1"
            >
              Ping Driver Roster
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>TRIP-2026-0805</span>
              <span>02:30 PM Departure</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">CBD Executive Shuttle</strong>
            <p className="text-[11px] text-slate-500">Vehicle: KCE 711E (Van) • Driver: David Otieno</p>
          </div>
        </div>

        {/* Column 2: In Transit / Active En Route */}
        <div className="p-4 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-emerald-200 dark:border-emerald-900/60">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Navigation size={14} className="text-emerald-600 animate-pulse" /> Active En Route
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
              2
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-emerald-600">
              <span>TRIP-2026-0801</span>
              <span>EN ROUTE (38 km/h)</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">West Zone Express</strong>
            <p className="text-[11px] text-slate-500">KCB 412A Bus • Pass: 28/33 • Driver: Joseph Mwangi</p>
            <div className="text-[10px] text-indigo-600 font-mono font-semibold pt-1">Next: Westlands Mall Stage (4m)</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-emerald-600">
              <span>TRIP-2026-0802</span>
              <span>ON SCHEDULE (42 km/h)</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">East Zone Rapid</strong>
            <p className="text-[11px] text-slate-500">KDD 891B Van • Pass: 12/14 • Driver: Amina Hassan</p>
            <div className="text-[10px] text-indigo-600 font-mono font-semibold pt-1">Next: Yaya Centre (2m)</div>
          </div>
        </div>

        {/* Column 3: Traffic & Delayed Trips */}
        <div className="p-4 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-amber-200 dark:border-amber-900/60">
            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" /> Delayed / Traffic Alert
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-bold">
              1
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/80 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-amber-600">
              <span>TRIP-2026-0803</span>
              <span>+11m TRAFFIC DELAY</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">South Industrial Corridor</strong>
            <p className="text-[11px] text-slate-500">KCR 104C Van • Pass: 10/14 • Driver: Peter Ochieng</p>
            <button
              onClick={() => handleTriggerAction('Sent automatic route adjustment advice to driver Peter Ochieng.')}
              className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] mt-1 cursor-pointer"
            >
              Reroute Advice
            </button>
          </div>
        </div>

        {/* Column 4: Night Shift & Emergency */}
        <div className="p-4 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-purple-200 dark:border-purple-900/60">
            <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-purple-600" /> Night & Emergency
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono font-bold">
              1
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/80 space-y-1.5 shadow-sm">
            <div className="flex justify-between font-mono text-[10px] text-purple-600">
              <span>TRIP-2026-0806</span>
              <span>09:30 PM Departure</span>
            </div>
            <strong className="text-slate-900 dark:text-white block">Night Shift Plant & Campus Shuttle</strong>
            <p className="text-[11px] text-slate-500">KCB 412A Bus • Pass: 30/33 • Driver: Francis Njoroge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
