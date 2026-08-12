import React, { useState, useMemo } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps'
import {
  Bus, Car, MapPin, Navigation, Route, Users, Calendar, Clock,
  ShieldCheck, AlertTriangle, Search, Plus, Filter, CheckCircle2,
  RefreshCw, Download, Eye, EyeOff, Phone, Sparkles, Bot, Zap,
  TrendingUp, Sliders, Building2, Fuel, Activity, Check, X, FileText,
  Send, Radio, Map as MapIcon, ChevronRight, Share2, Locate, Shield
} from 'lucide-react'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Modal,
  SearchInput
} from '../components/ui'
import TransportCommandCenter from '../components/TransportCommandCenter'
import TransportBookingPortal from '../components/transport/TransportBookingPortal'
import ApprovalWorkflowQueue from '../components/transport/ApprovalWorkflowQueue'
import DispatchCenter from '../components/transport/DispatchCenter'
import PoolVehicleManager from '../components/transport/PoolVehicleManager'
import DriverAssignmentEngine from '../components/transport/DriverAssignmentEngine'
import LiveDispatchBoard from '../components/transport/LiveDispatchBoard'
import TripExecutionConsole from '../components/transport/TripExecutionConsole'
import TransportCalendarView from '../components/transport/TransportCalendarView'
import TransportAnalyticsReports from '../components/transport/TransportAnalyticsReports'
import ShiftEligibilityManager from '../components/transport/ShiftEligibilityManager'
import FieldVisitCountyPlanner from '../components/transport/FieldVisitCountyPlanner'
import MultiBranchVehicleSharing from '../components/transport/MultiBranchVehicleSharing'
import OvertimeAbsenteeismOptimizer from '../components/transport/OvertimeAbsenteeismOptimizer'
import SafetyBreakdownEmergencySOS from '../components/transport/SafetyBreakdownEmergencySOS'
import TransportAttendanceAndAIAssistant from '../components/transport/TransportAttendanceAndAIAssistant'
import EmployeeResidenceRegistry from '../components/transport/EmployeeResidenceRegistry'
import PickupDropoffPointManager from '../components/transport/PickupDropoffPointManager'
import AIRoutePlannerAndZoneOptimizer from '../components/transport/AIRoutePlannerAndZoneOptimizer'
import DriverWorkspaceApp from '../components/transport/DriverWorkspaceApp'
import OfficialTravelManagement from '../components/transport/OfficialTravelManagement'
import TransportRequestForm from '../components/transport/TransportRequestForm'
import DigitalTransportControlRoom from '../components/transport/DigitalTransportControlRoom'
import EmployeeTransportDirectory from '../components/transport/EmployeeTransportDirectory'

// Retrieve Google Maps API Key safely according to skill constitution
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  import.meta.env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  globalThis.GOOGLE_MAPS_PLATFORM_KEY ||
  ''
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY'

// Sample Coordinates (Nairobi Metro Region as Default HQ Hub)
const HQ_COORDS = { lat: -1.286389, lng: 36.817223 }

const INITIAL_VEHICLES = [
  {
    id: 'FLEET-BUS-01',
    name: 'KCB 412A - Enterprise Express Bus',
    type: '33-Seater Bus',
    capacity: 33,
    assignedPassengers: 28,
    driver: 'Joseph Mwangi',
    backupDriver: 'David Otieno',
    driverPhone: '+254 712 345 678',
    routeId: 'ROUTE-WEST-01',
    routeName: 'Westlands - Lavington - HQ Route',
    status: 'EN_ROUTE',
    currentLocation: { lat: -1.2683, lng: 36.8111 },
    speed: '38 km/h',
    fuelLevel: '82%',
    nextStop: 'Westlands Mall Stage',
    etaNextStop: '4 mins',
    shift: 'Morning Shift'
  },
  {
    id: 'FLEET-VAN-02',
    name: 'KDD 891B - Executive Shuttle Van',
    type: '14-Seater Van',
    capacity: 14,
    assignedPassengers: 12,
    driver: 'Amina Hassan',
    backupDriver: 'Samuel Kilonzo',
    driverPhone: '+254 722 987 654',
    routeId: 'ROUTE-EAST-02',
    routeName: 'Kilimani - Kileleshwa - HQ Route',
    status: 'ON_SCHEDULE',
    currentLocation: { lat: -1.2921, lng: 36.7822 },
    speed: '42 km/h',
    fuelLevel: '91%',
    nextStop: 'Yaya Centre Bus Stop',
    etaNextStop: '2 mins',
    shift: 'Morning Shift'
  },
  {
    id: 'FLEET-VAN-03',
    name: 'KCR 104C - Industrial Shuttle Shuttle',
    type: '14-Seater Van',
    capacity: 14,
    assignedPassengers: 10,
    driver: 'Peter Ochieng',
    backupDriver: 'Francis Njoroge',
    driverPhone: '+254 733 456 789',
    routeId: 'ROUTE-SOUTH-03',
    routeName: 'Mombasa Road - South B - HQ Route',
    status: 'DELAYED_TRAFFIC',
    currentLocation: { lat: -1.3121, lng: 36.8344 },
    speed: '12 km/h',
    fuelLevel: '65%',
    nextStop: 'Capital Centre Stage',
    etaNextStop: '11 mins (Traffic)',
    shift: 'Morning Shift'
  }
]

const INITIAL_PICKUP_POINTS = [
  {
    id: 'PICKUP-101',
    name: 'Westlands Shopping Mall Bus Stop',
    type: 'Public Bus Stop / Landmark',
    area: 'Westlands',
    zone: 'West Zone',
    coords: { lat: -1.2650, lng: 36.8040 },
    maxCapacity: 25,
    assignedCount: 12,
    waitingArea: 'Main Mall Gate 2 Covered Canopy',
    placeId: 'ChIJb4aL6NQXLxgR8f7u5V2q',
    status: 'ACTIVE'
  },
  {
    id: 'PICKUP-102',
    name: 'Yaya Centre Bus Stop',
    type: 'Company Stop',
    area: 'Kilimani',
    zone: 'West Zone',
    coords: { lat: -1.2930, lng: 36.7870 },
    maxCapacity: 15,
    assignedCount: 8,
    waitingArea: 'Ring Road Junction Stage',
    placeId: 'ChIJzX4V1NAXLxgRe5k7u3',
    status: 'ACTIVE'
  },
  {
    id: 'PICKUP-103',
    name: 'Capital Centre Mombasa Road',
    type: 'Shopping Centre Stage',
    area: 'South B / Mombasa Rd',
    zone: 'South Zone',
    coords: { lat: -1.3100, lng: 36.8320 },
    maxCapacity: 20,
    assignedCount: 10,
    waitingArea: 'Expressway Entrance Bus Bay',
    placeId: 'ChIJy8fL1NAXLxgRp9x2k2',
    status: 'ACTIVE'
  },
  {
    id: 'PICKUP-104',
    name: 'Thika Road Mall (TRM) Transit Bay',
    type: 'Major Hub Stop',
    area: 'Ruaraka / Roysambu',
    zone: 'North Zone',
    coords: { lat: -1.2188, lng: 36.8882 },
    maxCapacity: 30,
    assignedCount: 18,
    waitingArea: 'TRM Overpass Passenger Bay',
    placeId: 'ChIJs8fL2NAXLxgRp9x2k9',
    status: 'ACTIVE'
  }
]

const INITIAL_DROP_OFF_POINTS = [
  {
    id: 'DROP-01',
    name: 'StaffRoom Enterprise HQ - Tower A',
    category: 'Corporate Headquarters',
    coords: { lat: -1.286389, lng: 36.817223 },
    capacity: 1200,
    activeShifts: ['Morning', 'Afternoon', 'Night']
  },
  {
    id: 'DROP-02',
    name: 'StaffRoom Industrial Plant & Warehouse',
    category: 'Manufacturing Plant',
    coords: { lat: -1.3250, lng: 36.8610 },
    capacity: 450,
    activeShifts: ['Morning', 'Night']
  }
]

const INITIAL_RESIDENCES = [
  {
    id: 'RES-EMP-101',
    employeeName: 'Sarah Jenkins',
    employeeId: 'EMP-101',
    department: 'Engineering',
    residenceName: 'Coral Crest Apartments, Apt 4B',
    street: 'Rhapta Road',
    estate: 'Westlands',
    town: 'Nairobi',
    county: 'Nairobi',
    coords: { lat: -1.2612, lng: 36.8011 },
    preferredPickupId: 'PICKUP-101',
    preferredPickupName: 'Westlands Shopping Mall Bus Stop',
    emergencyContact: '+254 700 112 233 (Spouse)',
    shift: 'Morning Shift',
    privacyLevel: 'CONFIDENTIAL_HR_ONLY'
  },
  {
    id: 'RES-EMP-102',
    employeeName: 'David Kiptoo',
    employeeId: 'EMP-102',
    department: 'Finance & Payroll',
    residenceName: 'Kilimani Heights Court, House 12',
    street: 'Argwings Kodhek Rd',
    estate: 'Kilimani',
    town: 'Nairobi',
    county: 'Nairobi',
    coords: { lat: -1.2910, lng: 36.7850 },
    preferredPickupId: 'PICKUP-102',
    preferredPickupName: 'Yaya Centre Bus Stop',
    emergencyContact: '+254 711 445 566 (Brother)',
    shift: 'Morning Shift',
    privacyLevel: 'CONFIDENTIAL_HR_ONLY'
  },
  {
    id: 'RES-EMP-103',
    employeeName: 'Mercy Wanjiku',
    employeeId: 'EMP-103',
    department: 'Operations',
    residenceName: 'South B Executive Villas, Block C',
    street: 'Mariakani Avenue',
    estate: 'South B',
    town: 'Nairobi',
    county: 'Nairobi',
    coords: { lat: -1.3080, lng: 36.8310 },
    preferredPickupId: 'PICKUP-103',
    preferredPickupName: 'Capital Centre Mombasa Road',
    emergencyContact: '+254 722 778 899 (Father)',
    shift: 'Morning Shift',
    privacyLevel: 'CONFIDENTIAL_HR_ONLY'
  }
]

const INITIAL_ROUTES = [
  {
    id: 'ROUTE-WEST-01',
    name: 'West Zone Express Route (Westlands - Lavington - HQ)',
    zone: 'West Route',
    assignedVehicle: 'KCB 412A - Enterprise Express Bus',
    totalDistance: '14.2 km',
    estDuration: '32 mins',
    fuelEstimate: '2.8 L',
    totalPickups: 3,
    passengers: 28,
    status: 'ACTIVE',
    waypointNames: ['Westlands Stage', 'Lavington Green Stop', 'Riverside Drive', 'StaffRoom HQ']
  },
  {
    id: 'ROUTE-EAST-02',
    name: 'East Zone Rapid Route (Kilimani - Kileleshwa - HQ)',
    zone: 'East Route',
    assignedVehicle: 'KDD 891B - Executive Shuttle Van',
    totalDistance: '9.8 km',
    estDuration: '24 mins',
    fuelEstimate: '1.6 L',
    totalPickups: 2,
    passengers: 12,
    status: 'ACTIVE',
    waypointNames: ['Yaya Centre', 'Kileleshwa Stage', 'StaffRoom HQ']
  },
  {
    id: 'ROUTE-SOUTH-03',
    name: 'South Industrial Corridor (Mombasa Rd - South B - HQ)',
    zone: 'South Route',
    assignedVehicle: 'KCR 104C - Industrial Shuttle',
    totalDistance: '18.5 km',
    estDuration: '45 mins',
    fuelEstimate: '3.4 L',
    totalPickups: 4,
    passengers: 10,
    status: 'ACTIVE_TRAFFIC_ALERT',
    waypointNames: ['Cabanas Stage', 'Capital Centre', 'South B Junction', 'StaffRoom HQ']
  }
]

export default function TransportManagement() {
  const { departments, activeDepartmentId, userDepartment } = useDepartment()
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('command_center') // command_center, live_map, routes, residences, pickups, fleet, driver_app, employee_portal, ai_assistant, analytics
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShift, setSelectedShift] = useState('Morning Shift') // Morning Shift, Afternoon Shift, Night Shift
  const [maskPrivacy, setMaskPrivacy] = useState(true) // Confidentiality Privacy Boundary toggle for residences

  // State
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES)
  const [pickupPoints, setPickupPoints] = useState(INITIAL_PICKUP_POINTS)
  const [residences, setResidences] = useState(INITIAL_RESIDENCES)
  const [routes, setRoutes] = useState(INITIAL_ROUTES)

  // Map state
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [driverChecklist, setDriverChecklist] = useState({
    'EMP-101': true,
    'EMP-102': true,
    'EMP-103': false
  })

  // Modal States
  const [modalMode, setModalMode] = useState(null) // 'new_residence', 'new_pickup', 'new_vehicle', 'temp_change'
  const [newResidenceForm, setNewResidenceForm] = useState({
    employeeName: '',
    employeeId: '',
    department: 'Engineering',
    residenceName: '',
    street: '',
    estate: '',
    town: 'Nairobi',
    county: 'Nairobi',
    lat: -1.2800,
    lng: 36.8200,
    preferredPickupId: 'PICKUP-101',
    emergencyContact: ''
  })

  // Filtering
  const filteredResidences = useMemo(() => {
    return residences.filter(r =>
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.estate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.residenceName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [residences, searchQuery])

  // Handlers
  const handleOptimizeRoutes = () => {
    showSuccess('AI Route Optimizer recalibrated 3 transport zones. Reduced total route distance by 4.2 km & saved 1.8L fuel!')
  }

  const handleDriverCheckin = (empId) => {
    setDriverChecklist(prev => ({ ...prev, [empId]: !prev[empId] }))
    showSuccess(`Passenger check-in status updated for ${empId}.`)
  }

  const handleAddResidence = (e) => {
    e.preventDefault()
    if (!newResidenceForm.employeeName.trim()) return

    const selectedPickup = pickupPoints.find(p => p.id === newResidenceForm.preferredPickupId)
    const newEntry = {
      id: `RES-EMP-${Date.now().toString().slice(-3)}`,
      employeeName: newResidenceForm.employeeName,
      employeeId: newResidenceForm.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      department: newResidenceForm.department,
      residenceName: newResidenceForm.residenceName,
      street: newResidenceForm.street,
      estate: newResidenceForm.estate,
      town: newResidenceForm.town,
      county: newResidenceForm.county,
      coords: { lat: newResidenceForm.lat, lng: newResidenceForm.lng },
      preferredPickupId: newResidenceForm.preferredPickupId,
      preferredPickupName: selectedPickup ? selectedPickup.name : 'Westlands Stage',
      emergencyContact: newResidenceForm.emergencyContact || '+254 700 000 000',
      shift: selectedShift,
      privacyLevel: 'CONFIDENTIAL_HR_ONLY'
    }

    setResidences([newEntry, ...residences])
    setModalMode(null)
    showSuccess(`Employee residence registered & geocoded for ${newResidenceForm.employeeName}!`)
  }

  const handleSendNotification = (msg) => {
    showSuccess(`Broadcast SMS & Push Notification dispatched: "${msg}"`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Transport & Logistics"
        description="Plan and monitor employee transportation."
        icon={Bus}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOptimizeRoutes}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles size={14} /> AI Route Optimizer
            </button>
            <button
              onClick={() => setModalMode('new_residence')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Register Residence
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'digital_control_room', label: 'Digital Transport Control Room', icon: ShieldCheck, badge: 12 },
          { id: 'employee_directory', label: 'Employee Transport Profiles', icon: Users },
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'request_form', label: 'Transport Request Form', icon: FileText },
          { id: 'official_travel', label: 'Official Travel & Duty Journeys', icon: Briefcase },
          { id: 'shift_eligibility', label: 'Shift & Eligibility Policy', icon: Sliders },
          { id: 'field_county', label: 'Field & County Visit Planner', icon: Locate },
          { id: 'branch_sharing', label: 'Multi-Branch Shared Pool', icon: Building2 },
          { id: 'overtime_absenteeism', label: 'Overtime & Route Optimizer', icon: Zap },
          { id: 'safety_breakdown_sos', label: 'Safety Checklist & Panic SOS', icon: ShieldAlert },
          { id: 'attendance_ai', label: 'Attendance & AI Assistant', icon: Bot },
          { id: 'booking_portal', label: 'Booking & Requests', icon: Car },
          { id: 'approval_queue', label: 'Approvals Queue', icon: ShieldCheck },
          { id: 'dispatch_center', label: 'Dispatch & Matching', icon: Navigation },
          { id: 'pool_vehicles', label: 'Pool Fleet Manager', icon: Bus },
          { id: 'driver_engine', label: 'Driver Roster', icon: Users },
          { id: 'live_board', label: 'Live Dispatch Board', icon: Activity },
          { id: 'trip_execution', label: 'Trip Execution Console', icon: Zap },
          { id: 'calendar_view', label: 'Schedule Calendar', icon: Calendar },
          { id: 'analytics_reports', label: 'Analytics & Reports', icon: TrendingUp },
          { id: 'live_map', label: 'Live GPS Fleet Map', icon: MapIcon, badge: vehicles.length },
          { id: 'routes', label: 'AI Route Planner & Zones', icon: Route, badge: routes.length },
          { id: 'residences', label: 'Employee Residence Registry', icon: ShieldCheck, badge: residences.length },
          { id: 'pickups', label: 'Pickup & Drop-off Points', icon: MapPin, badge: pickupPoints.length },
          { id: 'driver_app', label: 'Driver Navigation Workspace', icon: Navigation },
          { id: 'employee_portal', label: 'Employee Transport Portal', icon: Users },
          { id: 'ai_assistant', label: 'AI Transport Advisor', icon: Bot }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Active Shift:</span>
          {['Morning Shift', 'Afternoon Shift', 'Night Shift'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedShift(s)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedShift === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span>GPS Stream: Online</span>
          </div>
          <button
            onClick={() => setMaskPrivacy(!maskPrivacy)}
            className={`btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 cursor-pointer ${
              maskPrivacy ? 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300' : ''
            }`}
          >
            {maskPrivacy ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{maskPrivacy ? 'Privacy Boundaries Enforced' : 'Unmask Residences (HR Only)'}</span>
          </button>
        </div>
      </div>

      {/* TAB: DIGITAL TRANSPORT CONTROL ROOM */}
      {activeTab === 'digital_control_room' && (
        <DigitalTransportControlRoom onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: EMPLOYEE TRANSPORT PROFILES */}
      {activeTab === 'employee_directory' && (
        <EmployeeTransportDirectory onActionClick={(msg) => showSuccess(msg)} />
      )}

      {/* TAB 0: TRANSPORT COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <TransportCommandCenter onActionClick={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: TRANSPORT REQUEST FORM */}
      {activeTab === 'request_form' && (
        <TransportRequestForm onNotify={(msg) => showSuccess(msg)} onSubmitSuccess={() => setActiveTab('official_travel')} />
      )}

      {/* TAB: OFFICIAL TRAVEL & DUTY JOURNEYS */}
      {activeTab === 'official_travel' && (
        <OfficialTravelManagement onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: SHIFT & ELIGIBILITY POLICY */}
      {activeTab === 'shift_eligibility' && (
        <ShiftEligibilityManager onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: FIELD & COUNTY VISIT PLANNER */}
      {activeTab === 'field_county' && (
        <FieldVisitCountyPlanner onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: MULTI-BRANCH SHARED POOL */}
      {activeTab === 'branch_sharing' && (
        <MultiBranchVehicleSharing onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: OVERTIME & ROUTE OPTIMIZER */}
      {activeTab === 'overtime_absenteeism' && (
        <OvertimeAbsenteeismOptimizer onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: SAFETY CHECKLIST & PANIC SOS */}
      {activeTab === 'safety_breakdown_sos' && (
        <SafetyBreakdownEmergencySOS onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: ATTENDANCE & AI ASSISTANT */}
      {activeTab === 'attendance_ai' && (
        <TransportAttendanceAndAIAssistant onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: BOOKING PORTAL */}
      {activeTab === 'booking_portal' && (
        <TransportBookingPortal
          onSubmitRequest={(req) => showSuccess(`Requisition ${req.id} submitted`)}
          onNotify={(msg) => showSuccess(msg)}
        />
      )}

      {/* TAB: APPROVAL WORKFLOW QUEUE */}
      {activeTab === 'approval_queue' && (
        <ApprovalWorkflowQueue
          onApprove={(req) => showSuccess(`Request ${req.id} approved`)}
          onReject={(req, reason) => showSuccess(`Request ${req.id} rejected`)}
          onNotify={(msg) => showSuccess(msg)}
        />
      )}

      {/* TAB: DISPATCH CENTER */}
      {activeTab === 'dispatch_center' && (
        <DispatchCenter
          onDispatch={(info) => showSuccess(`Dispatched ${info.reqId} with ${info.vehicle}`)}
          onNotify={(msg) => showSuccess(msg)}
        />
      )}

      {/* TAB: POOL VEHICLE MANAGER */}
      {activeTab === 'pool_vehicles' && (
        <PoolVehicleManager onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: DRIVER ASSIGNMENT ENGINE */}
      {activeTab === 'driver_engine' && (
        <DriverAssignmentEngine onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: LIVE DISPATCH BOARD */}
      {activeTab === 'live_board' && (
        <LiveDispatchBoard
          vehicles={vehicles}
          onActionClick={(msg) => showSuccess(msg)}
        />
      )}

      {/* TAB: TRIP EXECUTION CONSOLE */}
      {activeTab === 'trip_execution' && (
        <TripExecutionConsole onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: TRANSPORT CALENDAR VIEW */}
      {activeTab === 'calendar_view' && (
        <TransportCalendarView />
      )}

      {/* TAB: ANALYTICS & REPORTS */}
      {activeTab === 'analytics_reports' && (
        <TransportAnalyticsReports onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB 1: LIVE GPS FLEET MAP */}
      {activeTab === 'live_map' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Bus}
              label="Active Shuttles En-Route"
              value={`${vehicles.length} Vehicles`}
              color="indigo"
            />
            <StatCard
              icon={Users}
              label="Passengers Boarded Today"
              value="50 / 61 Seats"
              color="emerald"
            />
            <StatCard
              icon={Clock}
              label="On-Time Arrival Rate"
              value="96.4%"
              color="purple"
            />
            <StatCard
              icon={Fuel}
              label="Est. Daily Fuel Savings"
              value="$142.50"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Google Map Container */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Live Google Maps Transport Tracking & Geocoded Stops
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">● Live Traffic Layer Active</span>
                </div>

                {/* Google Maps Render Box */}
                <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-950">
                  {hasValidKey ? (
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <Map
                        defaultCenter={HQ_COORDS}
                        defaultZoom={12}
                        mapId="DEMO_MAP_ID"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%' }}
                      >
                        {/* HQ Drop-off Location */}
                        <AdvancedMarker position={HQ_COORDS} onClick={() => setSelectedMarker({ name: 'StaffRoom Corporate HQ', details: 'Primary Drop-off Hub' })}>
                          <Pin background="#4F46E5" glyphColor="#FFFFFF" borderColor="#312E81" />
                        </AdvancedMarker>

                        {/* Fleet Vehicles Markers */}
                        {vehicles.map((v) => (
                          <AdvancedMarker
                            key={v.id}
                            position={v.currentLocation}
                            onClick={() => setSelectedMarker({ name: v.name, details: `Driver: ${v.driver} • Speed: ${v.speed} • Next: ${v.nextStop}` })}
                          >
                            <Pin background="#10B981" glyphColor="#FFFFFF" borderColor="#065F46" />
                          </AdvancedMarker>
                        ))}

                        {/* Pickup Point Markers */}
                        {pickupPoints.map((p) => (
                          <AdvancedMarker
                            key={p.id}
                            position={p.coords}
                            onClick={() => setSelectedMarker({ name: p.name, details: `Zone: ${p.zone} • Capacity: ${p.assignedCount}/${p.maxCapacity}` })}
                          >
                            <Pin background="#F59E0B" glyphColor="#FFFFFF" borderColor="#92400E" />
                          </AdvancedMarker>
                        ))}

                        {selectedMarker && (
                          <InfoWindow
                            position={HQ_COORDS}
                            onCloseClick={() => setSelectedMarker(null)}
                          >
                            <div className="p-1 text-xs">
                              <strong className="text-slate-900 block">{selectedMarker.name}</strong>
                              <p className="text-slate-600 text-[11px]">{selectedMarker.details}</p>
                            </div>
                          </InfoWindow>
                        )}
                      </Map>
                    </APIProvider>
                  ) : (
                    /* Fallback Instructions when Google Maps Key is not yet set in Secrets */
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                      <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <MapIcon size={32} />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">Google Maps Platform API Key Setup Required</h4>
                      <p className="text-xs text-slate-500 max-w-md">
                        To enable live interactive map views, geocoding, and Google Directions route overlays:
                      </p>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
                        <p>1. Open <strong>Settings (⚙️ top right)</strong> → <strong>Secrets</strong></p>
                        <p>2. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
                        <p>3. Paste key and press Enter (app rebuilds automatically)</p>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-200 max-w-md">
                        <strong>Simulated GIS Engine Active:</strong> Interactive route list, pickup points, driver check-in, and residence geocoding are fully operational below.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Active Vehicles Status Stream */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bus size={18} className="text-indigo-600 dark:text-indigo-400" />
                    En-Route Shuttle Status
                  </h3>
                  <button onClick={() => showSuccess('Fleet GPS locations refreshed.')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer">
                    <RefreshCw size={12} /> Sync GPS
                  </button>
                </div>

                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{v.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{v.routeId}</span>
                        </div>
                        <StatusBadge status={v.status} />
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-[11px] font-mono">
                        <span>Passengers: {v.assignedPassengers} / {v.capacity}</span>
                        <span>Fuel: {v.fuelLevel}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <p>Driver: <strong>{v.driver}</strong> ({v.driverPhone})</p>
                        <p>Next Stop: <strong className="text-indigo-600 dark:text-indigo-400">{v.nextStop}</strong> ({v.etaNextStop})</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <button
                          onClick={() => handleSendNotification(`Notice to ${v.routeName}: Bus ${v.name} is approaching ${v.nextStop} in ${v.etaNextStop}.`)}
                          className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={11} /> Alert Passengers
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AI ROUTE PLANNER & ZONES */}
      {activeTab === 'routes' && (
        <AIRoutePlannerAndZoneOptimizer onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: EMPLOYEE RESIDENCE REGISTRY */}
      {activeTab === 'residences' && (
        <EmployeeResidenceRegistry onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: PICKUP & DROPOFF POINTS */}
      {activeTab === 'pickups' && (
        <PickupDropoffPointManager onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB: DRIVER NAVIGATION WORKSPACE */}
      {activeTab === 'driver_app' && (
        <DriverWorkspaceApp onNotify={(msg) => showSuccess(msg)} />
      )}

      {/* TAB 7: EMPLOYEE TRANSPORT PORTAL */}
      {activeTab === 'employee_portal' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">My Employee Transport Pass & Shuttle Live ETA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-4 font-mono">
                <div className="flex justify-between items-center text-indigo-300">
                  <span className="font-bold text-sm">StaffRoom Mobile Transport Pass</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">ACTIVE</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-slate-300 text-[11px]">Emp ID: EMP-101 • Engineering Dept</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-800 space-y-1">
                  <span className="text-[10px] text-indigo-300 uppercase block">Assigned Shuttle & Stop:</span>
                  <strong className="text-white block text-sm">Westlands Shopping Mall Bus Stop</strong>
                  <span className="text-emerald-400 text-[11px]">Bus KCB 412A ETA: 4 Mins</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Self-Service Transport Requests</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => showSuccess('Temporary pickup location change request submitted to Transport Manager.')}
                    className="btn-secondary text-xs py-2 w-full flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin size={14} /> Request Temporary Pickup Change
                  </button>
                  <button
                    onClick={() => showSuccess('Vacation transport suspension scheduled for Sarah Jenkins.')}
                    className="btn-secondary text-xs py-2 w-full flex justify-center items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <Calendar size={14} /> Suspend Transport (Vacation / Leave)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER EMPLOYEE RESIDENCE */}
      {modalMode === 'new_residence' && (
        <Modal title="Register Employee Residence (Confidential)" onClose={() => setModalMode(null)}>
          <form onSubmit={handleAddResidence} className="space-y-4 text-xs">
            <div>
              <label className="label">Employee Name</label>
              <input
                className="input"
                required
                placeholder="e.g. Jane Doe"
                value={newResidenceForm.employeeName}
                onChange={(e) => setNewResidenceForm({ ...newResidenceForm, employeeName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Department</label>
                <select
                  className="input"
                  value={newResidenceForm.department}
                  onChange={(e) => setNewResidenceForm({ ...newResidenceForm, department: e.target.value })}
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Estate / Suburb</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Lavington"
                  value={newResidenceForm.estate}
                  onChange={(e) => setNewResidenceForm({ ...newResidenceForm, estate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Residence Name & Building</label>
              <input
                className="input"
                required
                placeholder="e.g. Green Palm Apartments, Apt 3A"
                value={newResidenceForm.residenceName}
                onChange={(e) => setNewResidenceForm({ ...newResidenceForm, residenceName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Preferred Pickup Point</label>
                <select
                  className="input"
                  value={newResidenceForm.preferredPickupId}
                  onChange={(e) => setNewResidenceForm({ ...newResidenceForm, preferredPickupId: e.target.value })}
                >
                  {pickupPoints.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.zone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Emergency Phone</label>
                <input
                  className="input"
                  placeholder="+254 700 000 000"
                  value={newResidenceForm.emergencyContact}
                  onChange={(e) => setNewResidenceForm({ ...newResidenceForm, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0 text-amber-600" />
              <span>Geocoded coordinates will be masked under HR Privacy Boundary rules.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalMode(null)} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" className="btn-primary text-xs py-2 px-4">Register Residence</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
