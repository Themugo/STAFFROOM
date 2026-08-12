import React, { useState, useMemo } from 'react'
import {
  Bus,
  Route,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  Calendar,
  MapPin,
  Send,
  ShieldAlert,
  Check,
  UserX,
  AlertOctagon,
  FileText,
  ChevronRight,
  Navigation,
  Car
} from 'lucide-react'

// Initial Operational Data
const INITIAL_TODAY_TRIPS = [
  {
    id: 'TRIP-001',
    route: 'Westlands - Lavington Express',
    zone: 'West Zone',
    departure: '06:30 AM',
    vehicle: 'KCB 412A (Bus)',
    driver: 'Joseph Mwangi',
    passengers: 28,
    capacity: 33,
    status: 'En Route',
    shift: 'Morning Shift'
  },
  {
    id: 'TRIP-002',
    route: 'Kilimani - Kileleshwa Rapid',
    zone: 'East Zone',
    departure: '06:45 AM',
    vehicle: 'KDD 891B (Van)',
    driver: 'Amina Hassan',
    passengers: 12,
    capacity: 14,
    status: 'Boarding',
    shift: 'Morning Shift'
  },
  {
    id: 'TRIP-003',
    route: 'Mombasa Rd Industrial Corridor',
    zone: 'South Zone',
    departure: '06:15 AM',
    vehicle: 'KCR 104C (Van)',
    driver: 'Peter Ochieng',
    passengers: 14,
    capacity: 14,
    status: 'Delayed',
    shift: 'Morning Shift'
  },
  {
    id: 'TRIP-004',
    route: 'Thika Rd Superhighway Shuttle',
    zone: 'North Zone',
    departure: '07:00 AM',
    vehicle: 'KDB 302D (Coaster)',
    driver: 'Samuel Kilonzo',
    passengers: 22,
    capacity: 25,
    status: 'Planned',
    shift: 'Morning Shift'
  },
  {
    id: 'TRIP-005',
    route: 'Upper Hill Executive Direct',
    zone: 'Central Zone',
    departure: '07:15 AM',
    vehicle: 'KCE 711E (Van)',
    driver: 'David Otieno',
    passengers: 11,
    capacity: 14,
    status: 'Arrived',
    shift: 'Morning Shift'
  },
  {
    id: 'TRIP-006',
    route: 'HQ Early Shift Campus Shuttle',
    zone: 'HQ Zone',
    departure: '05:45 AM',
    vehicle: 'KCF 505F (Shuttle)',
    driver: 'Francis Njoroge',
    passengers: 18,
    capacity: 20,
    status: 'Completed',
    shift: 'Early Shift'
  }
]

const INITIAL_ATTENTION_ITEMS = [
  {
    id: 'ATTN-01',
    category: 'Unassigned Passengers',
    title: '5 employees without assigned transport',
    description: 'Engineering shift staff in Westlands / Lavington cluster requested morning pickup but have no route assigned.',
    type: 'unassigned',
    severity: 'HIGH',
    impact: '5 Passengers'
  },
  {
    id: 'ATTN-02',
    category: 'Vehicle Capacity Issue',
    title: 'Coaster KDB 302D at 100% full capacity',
    description: 'Thika Rd Superhighway afternoon return trip has 25 confirmed passengers with 2 waitlisted.',
    type: 'capacity',
    severity: 'MEDIUM',
    impact: 'Overbooked'
  },
  {
    id: 'ATTN-03',
    category: 'Driver Conflict',
    title: 'Joseph Mwangi back-to-back overlap',
    description: 'Assigned to TRIP-001 (arrives 07:15 AM) and TRIP-007 (departs 07:20 AM), leaving only 5 mins turn-around.',
    type: 'driver',
    severity: 'HIGH',
    impact: 'Schedule Risk'
  },
  {
    id: 'ATTN-04',
    category: 'Delayed Trip',
    title: 'TRIP-003 delayed by 15 mins (Expressway Traffic)',
    description: 'Mombasa Rd Industrial shuttle stuck in heavy bottleneck near Capital Centre stage.',
    type: 'delay',
    severity: 'MEDIUM',
    impact: '+15m Delay'
  },
  {
    id: 'ATTN-05',
    category: 'Route Conflict',
    title: 'Route 4 pickup timing overlaps shift start',
    description: 'Estimated arrival at HQ (07:55 AM) leaves insufficient time for 08:00 AM clock-in gate clearance.',
    type: 'route',
    severity: 'LOW',
    impact: 'Late Risk'
  }
]

const INITIAL_UPCOMING_TRIPS = [
  {
    id: 'UP-TRIP-101',
    route: 'Afternoon Plant & Factory Return',
    zone: 'Industrial Corridor',
    departure: '02:00 PM',
    vehicle: 'KDB 302D (Coaster)',
    driver: 'Samuel Kilonzo',
    passengers: 24,
    capacity: 25,
    status: 'Planned',
    shift: 'Afternoon Shift'
  },
  {
    id: 'UP-TRIP-102',
    route: 'CBD Direct Executive Shuttle',
    zone: 'Central Zone',
    departure: '02:30 PM',
    vehicle: 'KCE 711E (Van)',
    driver: 'David Otieno',
    passengers: 12,
    capacity: 14,
    status: 'Planned',
    shift: 'Afternoon Shift'
  },
  {
    id: 'UP-TRIP-103',
    route: 'Night Shift Plant Arrivals',
    zone: 'West & South Zone',
    departure: '09:30 PM',
    vehicle: 'KCB 412A (Bus)',
    driver: 'Francis Njoroge',
    passengers: 30,
    capacity: 33,
    status: 'Planned',
    shift: 'Night Shift'
  }
]

export default function TransportCommandCenter({ onActionClick }) {
  const [todayTrips, setTodayTrips] = useState(INITIAL_TODAY_TRIPS)
  const [attentionItems, setAttentionItems] = useState(INITIAL_ATTENTION_ITEMS)
  const [upcomingTrips, setUpcomingTrips] = useState(INITIAL_UPCOMING_TRIPS)

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [shiftFilter, setShiftFilter] = useState('ALL')
  const [notificationMsg, setNotificationMsg] = useState(null)

  // Modal States
  const [activeModal, setActiveModal] = useState(null) // 'create_trip', 'create_route', 'add_vehicle'
  const [tripForm, setTripForm] = useState({
    route: '',
    departure: '',
    vehicle: '',
    driver: '',
    passengers: 15,
    capacity: 20,
    shift: 'Morning Shift'
  })
  const [routeForm, setRouteForm] = useState({
    name: '',
    zone: 'West Zone',
    distance: '12 km',
    duration: '25 mins',
    pickupsCount: 3
  })
  const [vehicleForm, setVehicleForm] = useState({
    registration: '',
    type: '14-Seater Van',
    capacity: 14,
    driver: ''
  })

  // Toast Handler
  const notify = (msg) => {
    setNotificationMsg(msg)
    setTimeout(() => setNotificationMsg(null), 3500)
    if (onActionClick) onActionClick(msg)
  }

  // Calculated Metrics
  const tripsTodayCount = todayTrips.length
  const totalPassengersCount = useMemo(() => {
    return todayTrips.reduce((acc, t) => acc + (parseInt(t.passengers) || 0), 0)
  }, [todayTrips])
  const activeRoutesCount = useMemo(() => {
    return new Set(todayTrips.map(t => t.route)).size
  }, [todayTrips])
  const activeVehiclesCount = useMemo(() => {
    return new Set(todayTrips.map(t => t.vehicle)).size
  }, [todayTrips])
  const issuesCount = attentionItems.length

  // Filtered Today's Transport
  const filteredTodayTrips = useMemo(() => {
    return todayTrips.filter((t) => {
      const matchesSearch =
        t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
      const matchesShift = shiftFilter === 'ALL' || t.shift === shiftFilter

      return matchesSearch && matchesStatus && matchesShift
    })
  }, [todayTrips, searchQuery, statusFilter, shiftFilter])

  // Resolve Attention Item
  const handleResolveAttention = (id, title) => {
    setAttentionItems(prev => prev.filter(item => item.id !== id))
    notify(`Resolved operational issue: "${title}"`)
  }

  // Create Trip Submit
  const handleCreateTripSubmit = (e) => {
    e.preventDefault()
    if (!tripForm.route.trim()) return

    const newTrip = {
      id: `TRIP-${String(todayTrips.length + 1).padStart(3, '0')}`,
      route: tripForm.route,
      zone: 'Active Zone',
      departure: tripForm.departure || '07:30 AM',
      vehicle: tripForm.vehicle || 'KDD 891B (Van)',
      driver: tripForm.driver || 'Assigned Driver',
      passengers: parseInt(tripForm.passengers) || 12,
      capacity: parseInt(tripForm.capacity) || 14,
      status: 'Planned',
      shift: tripForm.shift
    }

    setTodayTrips([newTrip, ...todayTrips])
    setActiveModal(null)
    setTripForm({ route: '', departure: '', vehicle: '', driver: '', passengers: 15, capacity: 20, shift: 'Morning Shift' })
    notify(`New trip "${newTrip.route}" created and dispatched to roster.`)
  }

  // Create Route Submit
  const handleCreateRouteSubmit = (e) => {
    e.preventDefault()
    if (!routeForm.name.trim()) return

    setActiveModal(null)
    const name = routeForm.name
    setRouteForm({ name: '', zone: 'West Zone', distance: '12 km', duration: '25 mins', pickupsCount: 3 })
    notify(`Route "${name}" created and configured in transport master.`)
  }

  // Add Vehicle Submit
  const handleAddVehicleSubmit = (e) => {
    e.preventDefault()
    if (!vehicleForm.registration.trim()) return

    const reg = vehicleForm.registration
    setActiveModal(null)
    setVehicleForm({ registration: '', type: '14-Seater Van', capacity: 14, driver: '' })
    notify(`Vehicle "${reg}" added to enterprise transport fleet registry.`)
  }

  // Badge Status Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'En Route':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#159A68]/15 text-[#159A68] border border-[#159A68]/30 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#159A68] animate-pulse" />
            En Route
          </span>
        )
      case 'Boarding':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D98B00]/15 text-[#D98B00] border border-[#D98B00]/30 flex items-center gap-1.5 w-fit">
            <Clock size={12} className="text-[#D98B00]" />
            Boarding
          </span>
        )
      case 'Planned':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 flex items-center gap-1.5 w-fit">
            <Calendar size={12} className="text-[#2563EB]" />
            Planned
          </span>
        )
      case 'Arrived':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20 flex items-center gap-1.5 w-fit">
            <MapPin size={12} className="text-[#2563EB]" />
            Arrived
          </span>
        )
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#52677F] border border-[#DCE6F2] flex items-center gap-1.5 w-fit">
            <CheckCircle2 size={12} className="text-[#159A68]" />
            Completed
          </span>
        )
      case 'Delayed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D94B61]/15 text-[#D94B61] border border-[#D94B61]/30 flex items-center gap-1.5 w-fit">
            <AlertTriangle size={12} className="text-[#D94B61]" />
            Delayed
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#102A43] border border-[#DCE6F2]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 text-[#102A43]">
      {/* Toast Banner */}
      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2563EB] text-white text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {notificationMsg}
          </span>
          <button
            onClick={() => setNotificationMsg(null)}
            className="hover:opacity-80 text-white cursor-pointer font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE6F2] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider mb-1">
            <Bus size={16} /> Operational Command
          </div>
          <h1 className="text-2xl font-black text-[#102A43] tracking-tight">
            Transport & Logistics
          </h1>
          <p className="text-xs text-[#52677F] mt-0.5">
            Plan and monitor employee transportation.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveModal('create_trip')}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all hover:scale-[1.02]"
          >
            <Plus size={15} /> Create Trip
          </button>
          <button
            onClick={() => setActiveModal('create_route')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all hover:border-[#2563EB]"
          >
            <Plus size={15} /> Create Route
          </button>
          <button
            onClick={() => setActiveModal('add_vehicle')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all hover:border-[#2563EB]"
          >
            <Plus size={15} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI CARDS (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Trips Today */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">
              Trips Today
            </span>
            <div className="p-2.5 rounded-2xl bg-[#EAF3FF] text-[#2563EB]">
              <Calendar size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#102A43]">{tripsTodayCount}</span>
            <span className="text-[11px] font-bold text-[#159A68] flex items-center">
              <ArrowUpRight size={12} /> Active
            </span>
          </div>
          <p className="text-[11px] text-[#52677F] font-medium">Scheduled & running</p>
        </div>

        {/* KPI 2: Passengers */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">
              Passengers
            </span>
            <div className="p-2.5 rounded-2xl bg-[#EAF3FF] text-[#2563EB]">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#102A43]">{totalPassengersCount}</span>
            <span className="text-[11px] font-bold text-[#2563EB]">Booked</span>
          </div>
          <p className="text-[11px] text-[#52677F] font-medium">Employee commuters</p>
        </div>

        {/* KPI 3: Active Routes */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">
              Active Routes
            </span>
            <div className="p-2.5 rounded-2xl bg-[#EAF3FF] text-[#2563EB]">
              <Route size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#102A43]">{activeRoutesCount}</span>
            <span className="text-[11px] font-bold text-[#159A68]">100% Coverage</span>
          </div>
          <p className="text-[11px] text-[#52677F] font-medium">Transport corridors</p>
        </div>

        {/* KPI 4: Vehicles */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">
              Vehicles
            </span>
            <div className="p-2.5 rounded-2xl bg-[#EAF3FF] text-[#2563EB]">
              <Bus size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#102A43]">{activeVehiclesCount}</span>
            <span className="text-[11px] font-bold text-[#159A68]">Running</span>
          </div>
          <p className="text-[11px] text-[#52677F] font-medium">Buses & Shuttles</p>
        </div>

        {/* KPI 5: Issues */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-2 hover:shadow-xs transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52677F] uppercase tracking-wider">
              Issues
            </span>
            <div className="p-2.5 rounded-2xl bg-[#D98B00]/15 text-[#D98B00]">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#D98B00]">{issuesCount}</span>
            <span className="text-[11px] font-bold text-[#D94B61]">Attention</span>
          </div>
          <p className="text-[11px] text-[#52677F] font-medium">Operational items</p>
        </div>
      </div>

      {/* MAIN AREA: TODAY'S TRANSPORT TABLE */}
      <div className="bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
              <Bus size={20} className="text-[#2563EB]" />
              Today's Transport
            </h2>
            <p className="text-xs text-[#52677F]">
              Live operational monitor for today's scheduled employee transportation trips.
            </p>
          </div>

          <button
            onClick={() => notify("Today's transport dispatch schedule refreshed.")}
            className="px-3.5 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
          >
            <RefreshCw size={14} /> Refresh Schedule
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#F6F9FD] p-3 rounded-2xl border border-[#DCE6F2]">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-[#52677F]" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Search route, driver, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[#52677F] font-bold text-[11px]">Shift:</span>
              {['ALL', 'Morning Shift', 'Early Shift'].map((s) => (
                <button
                  key={s}
                  onClick={() => setShiftFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    shiftFilter === s
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-white text-[#52677F] border border-[#DCE6F2] hover:bg-[#EAF3FF]'
                  }`}
                >
                  {s === 'ALL' ? 'All Shifts' : s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#52677F] font-bold text-[11px] ml-2">Status:</span>
              {['ALL', 'Planned', 'Boarding', 'En Route', 'Arrived', 'Completed', 'Delayed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-white text-[#52677F] border border-[#DCE6F2] hover:bg-[#EAF3FF]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCE6F2] text-[#52677F] uppercase font-mono text-[10px] tracking-wider bg-[#F6F9FD]">
                <th className="py-3 px-3">Route</th>
                <th className="py-3 px-3">Departure</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Passengers / Capacity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6F2] font-medium">
              {filteredTodayTrips.map((t) => {
                const occupancyPercent = Math.round((t.passengers / t.capacity) * 100)
                return (
                  <tr key={t.id} className="hover:bg-[#F6F9FD] transition-all">
                    {/* Route */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#2563EB] text-[11px]">{t.id}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#EAF3FF] text-[#2563EB] font-mono">
                          {t.zone}
                        </span>
                      </div>
                      <div className="font-bold text-[#102A43] mt-0.5">{t.route}</div>
                    </td>

                    {/* Departure */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="font-bold text-[#102A43]">{t.departure}</div>
                      <span className="text-[10px] text-[#52677F]">{t.shift}</span>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[#102A43] flex items-center gap-1.5">
                        <Bus size={13} className="text-[#2563EB] shrink-0" />
                        {t.vehicle}
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#102A43]">{t.driver}</span>
                    </td>

                    {/* Passengers / Capacity */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#DCE6F2] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              occupancyPercent >= 100
                                ? 'bg-[#D94B61]'
                                : occupancyPercent >= 85
                                ? 'bg-[#D98B00]'
                                : 'bg-[#159A68]'
                            }`}
                            style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#102A43]">
                          {t.passengers} / {t.capacity}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#52677F] block mt-0.5">
                        {occupancyPercent}% seat occupancy
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => notify(`Dispatched SMS notification to passengers on ${t.route}`)}
                          className="p-1.5 rounded-lg bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] hover:text-[#2563EB] transition-all cursor-pointer border border-[#DCE6F2]"
                          title="Notify Passengers"
                        >
                          <Send size={13} />
                        </button>
                        <button
                          onClick={() => notify(`Driver ${t.driver} pinged with route details.`)}
                          className="p-1.5 rounded-lg bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] hover:text-[#2563EB] transition-all cursor-pointer border border-[#DCE6F2]"
                          title="Contact Driver"
                        >
                          <Navigation size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredTodayTrips.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#52677F]">
                    No transport trips match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECOND AREA: NEEDS ATTENTION */}
      <div className="bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#D98B00]" />
              Needs Attention
            </h2>
            <p className="text-xs text-[#52677F]">
              Operational conflicts, capacity bottlenecks, delays, and unassigned passenger alerts.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#D98B00]/15 text-[#D98B00] border border-[#D98B00]/30 font-bold text-xs">
            {attentionItems.length} Issues Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-3 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#2563EB] uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    item.severity === 'HIGH'
                      ? 'bg-[#D94B61]/15 text-[#D94B61]'
                      : item.severity === 'MEDIUM'
                      ? 'bg-[#D98B00]/15 text-[#D98B00]'
                      : 'bg-[#2563EB]/15 text-[#2563EB]'
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#102A43] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#52677F] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#DCE6F2] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#52677F]">{item.id}</span>
                <button
                  onClick={() => handleResolveAttention(item.id, item.title)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                >
                  <Check size={13} /> Resolve Issue
                </button>
              </div>
            </div>
          ))}

          {attentionItems.length === 0 && (
            <div className="col-span-full py-8 text-center bg-[#F6F9FD] rounded-2xl border border-[#DCE6F2] text-[#159A68] font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              All operational transport issues resolved! No pending attention items.
            </div>
          )}
        </div>
      </div>

      {/* THIRD AREA: UPCOMING TRIPS */}
      <div className="bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
              <Clock size={20} className="text-[#2563EB]" />
              Upcoming Trips
            </h2>
            <p className="text-xs text-[#52677F]">
              Scheduled future shuttle departures for upcoming shifts.
            </p>
          </div>
          <button
            onClick={() => setActiveModal('create_trip')}
            className="px-3 py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus size={14} /> Schedule Upcoming
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCE6F2] text-[#52677F] uppercase font-mono text-[10px] tracking-wider bg-[#F6F9FD]">
                <th className="py-3 px-3">Trip ID</th>
                <th className="py-3 px-3">Route & Zone</th>
                <th className="py-3 px-3">Departure Time</th>
                <th className="py-3 px-3">Vehicle & Driver</th>
                <th className="py-3 px-3">Booked Seats</th>
                <th className="py-3 px-3">Shift</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6F2] font-medium">
              {upcomingTrips.map((ut) => (
                <tr key={ut.id} className="hover:bg-[#F6F9FD] transition-all">
                  <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">{ut.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102A43]">{ut.route}</div>
                    <span className="text-[10px] text-[#52677F]">{ut.zone}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#102A43]">{ut.departure}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102A43]">{ut.vehicle}</div>
                    <span className="text-[10px] text-[#52677F]">Driver: {ut.driver}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="font-bold text-[#102A43]">{ut.passengers} / {ut.capacity}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FF] text-[#2563EB]">
                      {ut.shift}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2563EB]/15 text-[#2563EB]">
                      {ut.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRIP MODAL */}
      {activeModal === 'create_trip' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <Plus size={18} className="text-[#2563EB]" />
                Create New Transport Trip
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#52677F] hover:text-[#102A43] p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTripSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#102A43] font-bold mb-1">Route Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Westlands - Lavington Express"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={tripForm.route}
                  onChange={(e) => setTripForm({ ...tripForm, route: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Departure Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:30 AM"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.departure}
                    onChange={(e) => setTripForm({ ...tripForm, departure: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Shift</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.shift}
                    onChange={(e) => setTripForm({ ...tripForm, shift: e.target.value })}
                  >
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Early Shift">Early Shift</option>
                    <option value="Afternoon Shift">Afternoon Shift</option>
                    <option value="Night Shift">Night Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Vehicle</label>
                  <input
                    type="text"
                    placeholder="e.g. KCB 412A (Bus)"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.vehicle}
                    onChange={(e) => setTripForm({ ...tripForm, vehicle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Driver</label>
                  <input
                    type="text"
                    placeholder="e.g. Joseph Mwangi"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.driver}
                    onChange={(e) => setTripForm({ ...tripForm, driver: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Passengers</label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.passengers}
                    onChange={(e) => setTripForm({ ...tripForm, passengers: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={tripForm.capacity}
                    onChange={(e) => setTripForm({ ...tripForm, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Save & Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ROUTE MODAL */}
      {activeModal === 'create_route' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <Route size={18} className="text-[#2563EB]" />
                Create Transport Route
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#52677F] hover:text-[#102A43] p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRouteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#102A43] font-bold mb-1">Route Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Kasarani - Roysambu Corridor"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={routeForm.name}
                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Zone</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={routeForm.zone}
                    onChange={(e) => setRouteForm({ ...routeForm, zone: e.target.value })}
                  >
                    <option value="West Zone">West Zone</option>
                    <option value="East Zone">East Zone</option>
                    <option value="South Zone">South Zone</option>
                    <option value="North Zone">North Zone</option>
                    <option value="Central Zone">Central Zone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Estimated Distance</label>
                  <input
                    type="text"
                    placeholder="e.g. 14.2 km"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={routeForm.distance}
                    onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Save & Configure Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {activeModal === 'add_vehicle' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <Bus size={18} className="text-[#2563EB]" />
                Add Fleet Vehicle
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#52677F] hover:text-[#102A43] p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#102A43] font-bold mb-1">Registration Number</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. KDE 202G"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={vehicleForm.registration}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registration: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Vehicle Type</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  >
                    <option value="33-Seater Bus">33-Seater Bus</option>
                    <option value="25-Seater Coaster">25-Seater Coaster</option>
                    <option value="14-Seater Van">14-Seater Van</option>
                    <option value="7-Seater Shuttle">7-Seater Shuttle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#102A43] font-bold mb-1">Capacity</label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    value={vehicleForm.capacity}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Assigned Driver</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Kilonzo"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={vehicleForm.driver}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, driver: e.target.value })}
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
