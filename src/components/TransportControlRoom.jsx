import React, { useState } from 'react'
import {
  Activity,
  Car,
  Navigation,
  Wrench,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  Key,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  RefreshCw,
  TrendingUp,
  FileText,
  Building,
  UserCheck,
  Phone,
  Bot,
  MapPin,
  ArrowRight,
  Send,
  Fuel,
  Info
} from 'lucide-react'

// Real-time Mock Control Room Data
const DEFAULT_STATS = {
  vehiclesAvailable: 18,
  vehiclesOnTrip: 12,
  vehiclesUnderMaintenance: 3,
  vehiclesReserved: 5,
  driversOnDuty: 14,
  driversOffDuty: 6,
  emergencyIncidents: 1,
  lateReturns: 2,
  pendingRequests: 4,
  fuelAvgEfficiency: '92%'
}

const DEFAULT_ACTIVE_TRIPS = [
  {
    id: 'JRN-8801',
    plate: 'KDG 482B',
    model: 'Toyota Prado 4x4',
    driver: 'David Kamau',
    department: 'Medical & Clinical Ops',
    origin: 'StaffRoom HQ Upper Hill',
    destination: 'Kiambu Level 5 Hospital',
    startTime: '08:15 AM',
    expectedReturn: '05:30 PM',
    status: 'ON_SCHEDULE',
    progress: 65,
    passengers: 3
  },
  {
    id: 'JRN-8802',
    plate: 'KDC 304C',
    model: 'Toyota HiAce 14-Seater',
    driver: 'Grace Wanjiru',
    department: 'Executive Protocol',
    origin: 'JKIA Airport Terminal 1A',
    destination: 'Upper Hill HQ',
    startTime: '07:00 AM',
    expectedReturn: '03:00 PM',
    status: 'LATE_RETURN',
    progress: 95,
    passengers: 5
  },
  {
    id: 'JRN-8803',
    plate: 'KDF 991A',
    model: 'Isuzu 33-Seater Staff Bus',
    driver: 'Peter Otieno',
    department: 'Operations & Logistics',
    origin: 'Ruiru Logistics Hub',
    destination: 'Thika Sub-Branch Depot',
    startTime: '10:30 AM',
    expectedReturn: '04:00 PM',
    status: 'ON_SCHEDULE',
    progress: 40,
    passengers: 18
  }
]

const DEFAULT_PENDING_REQUESTS = [
  {
    id: 'REQ-901',
    requester: 'Dr. Elizabeth Mwangi',
    department: 'Clinical Research',
    type: 'Field Site Visit',
    route: 'Nairobi HQ -> Murang’a Hospital',
    date: '2026-08-02',
    passengers: 4,
    priority: 'HIGH'
  },
  {
    id: 'REQ-902',
    requester: 'Engineer John Kimani',
    department: 'Infrastructure',
    type: 'Emergency Site Repair',
    route: 'Nairobi -> Machakos Solar Farm',
    date: '2026-08-01',
    passengers: 2,
    priority: 'URGENT'
  },
  {
    id: 'REQ-903',
    requester: 'Mary Wambui',
    department: 'HR & Welfare',
    type: 'Inter-Branch Shuttle',
    route: 'Upper Hill -> Westlands Annex',
    date: '2026-08-03',
    passengers: 8,
    priority: 'NORMAL'
  }
]

export default function TransportControlRoom({ onNotify, onNewCheckout, onManageRequests }) {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [activeTrips, setActiveTrips] = useState(DEFAULT_ACTIVE_TRIPS)
  const [pendingRequests, setPendingRequests] = useState(DEFAULT_PENDING_REQUESTS)
  const [filterType, setFilterType] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      if (onNotify) {
        onNotify('Transport Control Room telemetry updated with live GPS feed!')
      }
    }, 500)
  }

  const handleApproveRequest = (id) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id))
    setStats(prev => ({
      ...prev,
      pendingRequests: Math.max(0, prev.pendingRequests - 1),
      vehiclesReserved: prev.vehiclesReserved + 1
    }))
    if (onNotify) {
      onNotify(`Transport Requisition ${id} approved and dispatched to Fleet Pool!`)
    }
  }

  const filteredTrips = activeTrips.filter(t => {
    const matchesSearch = t.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.destination.toLowerCase().includes(searchTerm.toLowerCase())
    if (filterType === 'LATE') return matchesSearch && t.status === 'LATE_RETURN'
    if (filterType === 'ON_SCHEDULE') return matchesSearch && t.status === 'ON_SCHEDULE'
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* CONTROL ROOM HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-[11px] font-bold">
              <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
              Live Transport Control Room & Operations Dashboard
            </div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-400" size={24} />
              Digital Fleet Control Room
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time telemetry, vehicle dispatch tracking, driver shift management, emergency alert stream, and automated requisition routing.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs font-bold cursor-pointer flex items-center gap-2 ${
                isRefreshing ? 'animate-spin text-indigo-400' : ''
              }`}
              title="Refresh Live Telemetry"
            >
              <RefreshCw size={15} />
            </button>

            {onNewCheckout && (
              <button
                onClick={onNewCheckout}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={15} /> Dispatch / Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Available */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Vehicles Available</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Car size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.vehiclesAvailable}</p>
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            <span>Ready for Checkout</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">100% Valid</span>
          </div>
        </div>

        {/* Card 2: On Trip */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-indigo-500 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Vehicles On Trip</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Navigation size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{stats.vehiclesOnTrip}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>En-route / Active</span>
            <span className="text-indigo-600 font-bold">{stats.lateReturns} Late</span>
          </div>
        </div>

        {/* Card 3: Pending Requisitions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{stats.pendingRequests}</p>
          <div className="flex items-center justify-between text-[10px] text-amber-600 font-bold font-mono">
            <span>Awaiting Approval</span>
            <span>2 Urgent</span>
          </div>
        </div>

        {/* Card 4: Under Maintenance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-rose-500 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">In Maintenance</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Wrench size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.vehiclesUnderMaintenance}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Workshop Bay</span>
            <span className="text-rose-600 font-bold">1 Inspection</span>
          </div>
        </div>

        {/* Card 5: Drivers On Duty */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Drivers On Duty</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.driversOnDuty}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>{stats.driversOffDuty} Off Duty</span>
            <span className="text-blue-600 font-bold">Roster Active</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE DISPATCHED TRIPS & TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTIVE TRIPS LIST (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation size={16} className="text-indigo-600 dark:text-indigo-400" />
                Live Active Journeys Telemetry
              </h3>
              <p className="text-xs text-slate-500">Real-time trip progress, driver route tracking, and expected return times.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter Plate / Driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-1.5 pl-7 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="ALL">All Trips</option>
                <option value="ON_SCHEDULE">On Schedule</option>
                <option value="LATE">Late Returns</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  trip.status === 'LATE_RETURN'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      {trip.plate}
                    </span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200 block text-xs">{trip.driver}</strong>
                      <span className="text-[10px] text-slate-500">{trip.department}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        trip.status === 'LATE_RETURN'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {trip.status === 'LATE_RETURN' ? 'OVERDUE / LATE RETURN' : 'ON SCHEDULE'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">ETA: {trip.expectedReturn}</span>
                  </div>
                </div>

                {/* Route Info */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <MapPin size={13} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{trip.origin}</span>
                  <ArrowRight size={12} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate">{trip.destination}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Departure: {trip.startTime}</span>
                    <span>{trip.passengers} Passengers</span>
                    <span>{trip.progress}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        trip.status === 'LATE_RETURN' ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PENDING REQUISITIONS SIDEBAR (1 COL) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              Pending Requisitions
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-mono font-bold">
              {pendingRequests.length} Waiting
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{req.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      req.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : req.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>

                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block text-xs">{req.requester}</strong>
                  <span className="text-[10px] text-slate-500">{req.department} • {req.type}</span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono truncate">
                  {req.route}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-mono">Date: {req.date}</span>
                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Approve & Dispatch
                  </button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="p-6 text-center text-slate-400 font-mono text-xs space-y-2">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500" />
                <p>All transport requisitions cleared!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
