import React, { useState, useMemo } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Activity,
  Car,
  Bus,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Key,
  ShieldCheck,
  ShieldAlert,
  Bot,
  MapPin,
  Navigation,
  Calendar,
  Fuel,
  Wrench,
  Sparkles,
  Camera,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Phone,
  DollarSign,
  Briefcase,
  Layers,
  Building2,
  Smartphone,
  Info,
  TrendingUp,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  UserCheck,
  RefreshCw,
  Send,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

// --- INITIAL MOCK DATA ---
const INITIAL_CONTROL_ROOM_STATS = {
  vehiclesAvailable: 18,
  vehiclesOnTrip: 12,
  vehiclesMaintenance: 3,
  vehiclesReserved: 5,
  driversOnDuty: 14,
  driversOffDuty: 6,
  emergencyIncidents: 1,
  lateReturns: 2,
  pendingRequests: 4
}

const INITIAL_VEHICLES = [
  {
    id: 'V-101',
    plate: 'KDG 482B',
    model: 'Toyota Prado TX 4x4',
    type: 'SUV 4x4',
    status: 'ON_TRIP', // AVAILABLE, ON_TRIP, MAINTENANCE, RESERVED
    assignedDriver: 'David Kamau',
    fuelLevel: 85, // %
    odometer: 112450, // km
    location: 'Thika Highway En-Route',
    destination: 'Kiambu Regional Depot',
    expectedReturn: '17:30 Today',
    assignedDepartment: 'Operations & Logistics',
    keyStatus: 'ISSUED', // IN_SAFE, ISSUED, MISSING
    insuranceExpiry: '2026-11-15',
    inspectionExpiry: '2026-09-30',
    roadLicenceExpiry: '2026-12-31'
  },
  {
    id: 'V-102',
    plate: 'KDF 991A',
    model: 'Isuzu NQR 33-Seater Bus',
    type: 'Staff Bus',
    status: 'AVAILABLE',
    assignedDriver: 'Peter Otieno',
    fuelLevel: 92,
    odometer: 84300,
    location: 'Central HQ Fleet Bay 4',
    destination: 'N/A (Ready for Dispatch)',
    expectedReturn: 'N/A',
    assignedDepartment: 'HR & Staff Welfare',
    keyStatus: 'IN_SAFE',
    insuranceExpiry: '2026-10-20',
    inspectionExpiry: '2026-08-15',
    roadLicenceExpiry: '2026-12-31'
  },
  {
    id: 'V-103',
    plate: 'KDC 304C',
    model: 'Toyota HiAce 14-Seater Shuttle',
    type: 'Van Shuttle',
    status: 'ON_TRIP',
    assignedDriver: 'Grace Wanjiru',
    fuelLevel: 45,
    odometer: 145890,
    location: 'JKIA Airport Cargo Terminal',
    destination: 'Upper Hill HQ',
    expectedReturn: '16:00 Today (LATE)',
    assignedDepartment: 'Executive & Protocol',
    keyStatus: 'ISSUED',
    insuranceExpiry: '2026-08-05', // Warning imminent
    inspectionExpiry: '2026-10-10',
    roadLicenceExpiry: '2026-12-31'
  },
  {
    id: 'V-104',
    plate: 'KDA 112X',
    model: 'Nissan Isuzu D-Max Double Cabin',
    type: 'Pickup 4x4',
    status: 'MAINTENANCE',
    assignedDriver: 'Unassigned',
    fuelLevel: 30,
    odometer: 198200,
    location: 'AutoXpress Workshop - Industrial Area',
    destination: 'Routine Maintenance',
    expectedReturn: 'Tomorrow 10:00',
    assignedDepartment: 'Engineering & Field Ops',
    keyStatus: 'IN_SAFE',
    insuranceExpiry: '2027-01-10',
    inspectionExpiry: '2026-07-28', // Expired
    roadLicenceExpiry: '2026-12-31'
  },
  {
    id: 'V-105',
    plate: 'KDJ 778Y',
    model: 'Subaru Forester AWD',
    type: 'Executive SUV',
    status: 'RESERVED',
    assignedDriver: 'Samuel Mutua',
    fuelLevel: 100,
    odometer: 62100,
    location: 'Executive Parking Bay 1',
    destination: 'Mombasa Road Regional Office',
    expectedReturn: 'Reserved for 14:00',
    assignedDepartment: 'Internal Audit',
    keyStatus: 'IN_SAFE',
    insuranceExpiry: '2026-12-01',
    inspectionExpiry: '2026-11-20',
    roadLicenceExpiry: '2026-12-31'
  }
]

const INITIAL_JOURNEYS = [
  {
    id: 'JRN-2026-8801',
    vehiclePlate: 'KDG 482B',
    driverName: 'David Kamau',
    leadPassenger: 'Dr. Jane Muthoni',
    passengersCount: 3,
    department: 'Medical & Clinical Operations',
    costCentre: 'CC-MED-402',
    purpose: 'Vaccine Cold-Chain Inspection & County Hospital Audit',
    route: 'HQ Upper Hill -> Ruiru Sub-Branch -> Kiambu Level 5 Hospital',
    startTime: '2026-08-01 08:15',
    expectedReturn: '2026-08-01 17:30',
    status: 'IN_PROGRESS', // IN_PROGRESS, COMPLETED, OVERDUE, CANCELLED
    startOdometer: 112320,
    endOdometer: null,
    distanceKm: 130,
    stops: [
      { location: 'Ruiru Depot', arriveTime: '09:20', departTime: '10:05', reason: 'Unload cold storage box', notes: 'Temperature checked at 3.2°C' },
      { location: 'Kiambu Level 5', arriveTime: '11:00', departTime: 'In Progress', reason: 'Pharmacy Audit', notes: 'Meeting Superintendent' }
    ],
    isAfterHours: false,
    afterHoursApproval: null
  },
  {
    id: 'JRN-2026-8802',
    vehiclePlate: 'KDC 304C',
    driverName: 'Grace Wanjiru',
    leadPassenger: 'Mr. James Ochieng',
    passengersCount: 5,
    department: 'Executive & Protocol',
    costCentre: 'CC-EXEC-101',
    purpose: 'Delegation Airport Shuttle Transfer',
    route: 'Upper Hill HQ -> JKIA Airport -> Serena Hotel',
    startTime: '2026-08-01 07:00',
    expectedReturn: '2026-08-01 15:00',
    status: 'OVERDUE',
    startOdometer: 145750,
    endOdometer: null,
    distanceKm: 140,
    stops: [
      { location: 'JKIA Airport', arriveTime: '07:45', departTime: '09:30', reason: 'Flight Delay Pick-up', notes: 'Flight KQ310 delayed 1.5 hrs' }
    ],
    isAfterHours: false,
    afterHoursApproval: null
  },
  {
    id: 'JRN-2026-8799',
    vehiclePlate: 'KDF 991A',
    driverName: 'Peter Otieno',
    leadPassenger: 'Mary Wambui',
    passengersCount: 28,
    department: 'HR & Staff Welfare',
    costCentre: 'CC-HR-201',
    purpose: 'Morning Shift Staff Shuttle Express',
    route: 'Kasarani -> Thika Road -> HQ Upper Hill',
    startTime: '2026-08-01 06:00',
    expectedReturn: '2026-08-01 08:30',
    status: 'COMPLETED',
    startOdometer: 84250,
    endOdometer: 84300,
    distanceKm: 50,
    stops: [
      { location: 'Roysambu Stage', arriveTime: '06:20', departTime: '06:25', reason: 'Staff Pick-up', notes: '12 staff boarded' }
    ],
    isAfterHours: true,
    afterHoursApproval: 'Approved by HR Director (Permit #NIGHT-882)'
  }
]

const INITIAL_INCIDENTS = [
  {
    id: 'INC-2026-041',
    journeyId: 'JRN-2026-8802',
    vehiclePlate: 'KDC 304C',
    driverName: 'Grace Wanjiru',
    type: 'Traffic Delay', // Accident, Breakdown, Traffic Delay, Flat Tyre, Mechanical Failure, Medical Emergency, Security Incident
    severity: 'MEDIUM',
    timestamp: '2026-08-01 15:15',
    location: 'Mombasa Road Outer Ring Junction',
    description: 'Heavy traffic gridlock due to ongoing highway roadworks. Expected 45-minute delay.',
    policeReportNo: 'N/A',
    insuranceReference: 'N/A',
    photosAttached: 1,
    status: 'OPEN'
  },
  {
    id: 'INC-2026-039',
    journeyId: 'JRN-2026-8750',
    vehiclePlate: 'KDA 112X',
    driverName: 'John Njoroge',
    type: 'Mechanical Failure',
    severity: 'HIGH',
    timestamp: '2026-07-29 14:10',
    location: 'Industrial Area Enterprise Road',
    description: 'Overheating radiator light triggered. Vehicle towed safely to AutoXpress workshop.',
    policeReportNo: 'OB 12/29/07/2026',
    insuranceReference: 'INS-CLAIM-88192',
    photosAttached: 3,
    status: 'UNDER_REPAIR'
  }
]

const INITIAL_DAMAGES = [
  {
    id: 'DMG-102',
    vehiclePlate: 'KDA 112X',
    reportedDate: '2026-07-29',
    component: 'Front Bumper & Radiator Grille',
    severity: 'MODERATE',
    description: 'Minor impact damage during reversing near warehouse loading dock.',
    responsibleDriver: 'John Njoroge',
    repairCostKsh: 45000,
    repairStatus: 'IN_WORKSHOP', // PENDING, IN_WORKSHOP, REPAIRED
    insuranceClaimNo: 'CLAIM-APA-40192',
    workshopName: 'AutoXpress Industrial Area'
  }
]

const INITIAL_KEY_LOGS = [
  { id: 'KEY-01', vehiclePlate: 'KDG 482B', issuedTo: 'David Kamau (Driver)', issuedBy: 'Francis Kimani (Fleet Mgr)', timeOut: '2026-08-01 08:00', timeReturned: 'Pending', status: 'ISSUED' },
  { id: 'KEY-02', vehiclePlate: 'KDC 304C', issuedTo: 'Grace Wanjiru (Driver)', issuedBy: 'Francis Kimani (Fleet Mgr)', timeOut: '2026-08-01 06:45', timeReturned: 'Pending', status: 'ISSUED' },
  { id: 'KEY-03', vehiclePlate: 'KDF 991A', issuedTo: 'Peter Otieno (Driver)', issuedBy: 'Francis Kimani (Fleet Mgr)', timeOut: '2026-08-01 05:45', timeReturned: '2026-08-01 08:40', status: 'RETURNED' }
]

const PRE_DEPARTURE_CHECKLIST_ITEMS = [
  { key: 'fuel', label: 'Fuel Level Adequate for Trip' },
  { key: 'tyres', label: 'Tyre Pressure & Tread Condition' },
  { key: 'brakes', label: 'Brake Fluid & Response Test' },
  { key: 'lights', label: 'Headlights, High Beams & Brake Lights' },
  { key: 'indicators', label: 'Turn Indicators & Hazard Flashers' },
  { key: 'mirrors', label: 'Side & Rearview Mirrors Clean' },
  { key: 'horn', label: 'Horn Operational' },
  { key: 'seatBelts', label: 'All Passenger Seat Belts Functional' },
  { key: 'fireExtinguisher', label: 'Fire Extinguisher Present & Charged' },
  { key: 'firstAidKit', label: 'First Aid Medical Kit Fully Stocked' },
  { key: 'reflectiveTriangle', label: 'Reflective Safety Triangles (2x)' },
  { key: 'spareWheel', label: 'Spare Wheel & Jack Included' },
  { key: 'cleanliness', label: 'Vehicle Interior & Exterior Clean' },
  { key: 'insurance', label: 'Valid Physical Insurance Sticker Displayed' },
  { key: 'inspection', label: 'NTSA Inspection Sticker Valid' }
]

export default function DigitalTransportControlRoom({ onNotify }) {
  const toast = useToast()
  // Navigation Sub-Tabs inside Control Room
  const [activeSubTab, setActiveSubTab] = useState('control_room') // 'control_room', 'checkout', 'active_journeys', 'return', 'incidents_damage', 'keys_compliance', 'after_hours', 'ai_auditor', 'reports'

  // User Role View Filter
  const [userRole, setUserRole] = useState('Fleet Operations Director') // Fleet Operations Director, Transport Officer, Field Driver, Internal Auditor

  // State Collections
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES)
  const [journeys, setJourneys] = useState(INITIAL_JOURNEYS)
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS)
  const [damages, setDamages] = useState(INITIAL_DAMAGES)
  const [keyLogs, setKeyLogs] = useState(INITIAL_KEY_LOGS)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Mobile Mode Simulator Toggle
  const [isMobileView, setIsMobileView] = useState(false)

  // --- MODAL STATES ---
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)

  // Selected Journey for Details or Return Workflow
  const [selectedJourney, setSelectedJourney] = useState(null)

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    bookingId: 'BK-2026-9901',
    vehiclePlate: 'KDF 991A',
    driverName: 'Peter Otieno',
    leadPassenger: 'Dr. Elizabeth Mwangi',
    passengersCount: 4,
    tripPurpose: 'Quarterly Kiambu Health Audit & Site Visit',
    destination: 'Kiambu Level 5 Hospital',
    expectedReturnTime: '18:00',
    initialFuelLevel: 90,
    currentOdometer: 84300,
    checklist: PRE_DEPARTURE_CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: true }), {}),
    driverDeclaration: true,
    signatureName: 'Peter Otieno'
  })

  // Vehicle Return Form State
  const [returnForm, setReturnForm] = useState({
    journeyId: '',
    returnOdometer: 84380,
    fuelRemaining: 75,
    vehicleCondition: 'EXCELLENT', // EXCELLENT, GOOD, MINOR_DIRT, DAMAGE_REPORTED
    damageNotes: '',
    hasIncident: false,
    incidentType: 'Traffic Delay',
    incidentDescription: '',
    cleaningStatus: 'CLEAN',
    outstandingIssues: 'None',
    driverSignature: 'Grace Wanjiru',
    officerSignOff: 'Francis Kimani (Transport Mgr)'
  })

  // Incident Form State
  const [incidentForm, setIncidentForm] = useState({
    vehiclePlate: 'KDG 482B',
    driverName: 'David Kamau',
    type: 'Traffic Delay',
    severity: 'LOW',
    location: 'Thika Superhighway Exit 7',
    description: 'Road closure due to VIP convoy causing 30-min delay.',
    policeReportNo: '',
    insuranceReference: ''
  })

  // Key Checkout Action
  const handleIssueKey = (vehiclePlate, driverName) => {
    setKeyLogs(prev => [
      {
        id: `KEY-${Date.now().toString().slice(-4)}`,
        vehiclePlate,
        issuedTo: `${driverName} (Driver)`,
        issuedBy: 'Francis Kimani (Fleet Mgr)',
        timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeReturned: 'Pending',
        status: 'ISSUED'
      },
      ...prev
    ])

    setVehicles(prev =>
      prev.map(v => (v.plate === vehiclePlate ? { ...v, keyStatus: 'ISSUED' } : v))
    )

    if (onNotify) {
      onNotify(`Ignition Key for ${vehiclePlate} successfully issued to ${driverName}!`)
    }
  }

  const handleReturnKey = (vehiclePlate) => {
    setKeyLogs(prev =>
      prev.map(k => (k.vehiclePlate === vehiclePlate && k.status === 'ISSUED' ? { ...k, status: 'RETURNED', timeReturned: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : k))
    )

    setVehicles(prev =>
      prev.map(v => (v.plate === vehiclePlate ? { ...v, keyStatus: 'IN_SAFE' } : v))
    )

    if (onNotify) {
      onNotify(`Key for ${vehiclePlate} returned and locked in Secure Vault Safe!`)
    }
  }

  // Handle Checkout Submit
  const handleProcessCheckout = (e) => {
    e.preventDefault()

    // Check all checklist mandatory
    const unconfirmed = Object.entries(checkoutForm.checklist).filter(([_, val]) => !val)
    if (unconfirmed.length > 0) {
      toast.error(`Safety Compliance Error: All ${PRE_DEPARTURE_CHECKLIST_ITEMS.length} pre-departure checklist items must be confirmed before vehicle dispatch!`)
      return
    }

    const newJourneyId = `JRN-2026-${Math.floor(8800 + Math.random() * 200)}`
    const newJourney = {
      id: newJourneyId,
      vehiclePlate: checkoutForm.vehiclePlate,
      driverName: checkoutForm.driverName,
      leadPassenger: checkoutForm.leadPassenger,
      passengersCount: checkoutForm.passengersCount,
      department: 'Operations & Logistics',
      costCentre: 'CC-OPS-101',
      purpose: checkoutForm.tripPurpose,
      route: `HQ Upper Hill -> ${checkoutForm.destination}`,
      startTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedReturn: checkoutForm.expectedReturnTime,
      status: 'IN_PROGRESS',
      startOdometer: Number(checkoutForm.currentOdometer),
      endOdometer: null,
      distanceKm: 0,
      stops: [],
      isAfterHours: false,
      afterHoursApproval: null
    }

    setJourneys(prev => [newJourney, ...prev])

    // Update Vehicle Status
    setVehicles(prev =>
      prev.map(v => (v.plate === checkoutForm.vehiclePlate ? { ...v, status: 'ON_TRIP', location: `En-route to ${checkoutForm.destination}`, keyStatus: 'ISSUED' } : v))
    )

    // Issue Key
    handleIssueKey(checkoutForm.vehiclePlate, checkoutForm.driverName)

    setIsCheckoutModalOpen(false)
    if (onNotify) {
      onNotify(`Vehicle Checkout Authorized! Journey ${newJourneyId} started for ${checkoutForm.vehiclePlate}.`)
    }
  }

  // Handle Vehicle Return Submit
  const handleProcessReturn = (e) => {
    e.preventDefault()

    if (!selectedJourney) return

    const startOdo = selectedJourney.startOdometer || 84200
    const endOdo = Number(returnForm.returnOdometer)
    const dist = Math.max(0, endOdo - startOdo)

    // Update Journey
    setJourneys(prev =>
      prev.map(j =>
        j.id === selectedJourney.id
          ? {
              ...j,
              status: 'COMPLETED',
              endOdometer: endOdo,
              distanceKm: dist,
              endTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : j
      )
    )

    // Update Vehicle
    setVehicles(prev =>
      prev.map(v =>
        v.plate === selectedJourney.vehiclePlate
          ? {
              ...v,
              status: 'AVAILABLE',
              location: 'HQ Central Fleet Yard',
              odometer: endOdo,
              fuelLevel: Number(returnForm.fuelRemaining),
              keyStatus: 'IN_SAFE'
            }
          : v
      )
    )

    // Return Key Log
    handleReturnKey(selectedJourney.vehiclePlate)

    // If Damage or Incident Reported
    if (returnForm.vehicleCondition === 'DAMAGE_REPORTED' || returnForm.hasIncident) {
      const newDmg = {
        id: `DMG-${Math.floor(100 + Math.random() * 900)}`,
        vehiclePlate: selectedJourney.vehiclePlate,
        reportedDate: new Date().toISOString().split('T')[0],
        component: returnForm.damageNotes || 'Post-Trip Exterior Inspection Notice',
        severity: 'MODERATE',
        description: returnForm.damageNotes || 'Reported during post-journey sign-off.',
        responsibleDriver: selectedJourney.driverName,
        repairCostKsh: 15000,
        repairStatus: 'PENDING',
        insuranceClaimNo: 'PENDING_ASSESSMENT',
        workshopName: 'Pending Inspection'
      }
      setDamages(prev => [newDmg, ...prev])
    }

    setIsReturnModalOpen(false)
    setSelectedJourney(null)

    if (onNotify) {
      onNotify(`Vehicle ${selectedJourney.vehiclePlate} returned! Journey logged: ${dist} km traveled.`)
    }
  }

  // Handle Incident Submit
  const handleReportIncident = (e) => {
    e.preventDefault()

    const newInc = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      journeyId: 'JRN-ACTIVE',
      vehiclePlate: incidentForm.vehiclePlate,
      driverName: incidentForm.driverName,
      type: incidentForm.type,
      severity: incidentForm.severity,
      timestamp: new Date().toLocaleString(),
      location: incidentForm.location,
      description: incidentForm.description,
      policeReportNo: incidentForm.policeReportNo || 'N/A',
      insuranceReference: incidentForm.insuranceReference || 'N/A',
      photosAttached: 2,
      status: 'OPEN'
    }

    setIncidents(prev => [newInc, ...prev])
    setIsIncidentModalOpen(false)

    if (onNotify) {
      onNotify(`INCIDENT RECORDED: ${incidentForm.type} for ${incidentForm.vehiclePlate} at ${incidentForm.location}. Emergency Response Dispatch Notified!`)
    }
  }

  // Document Expiry Alerts Computed List
  const expiringDocuments = useMemo(() => {
    return vehicles.map(v => {
      const alerts = []
      if (new Date(v.inspectionExpiry) < new Date()) {
        alerts.push({ type: 'INSPECTION_EXPIRED', date: v.inspectionExpiry, label: 'NTSA Inspection Expired' })
      } else if ((new Date(v.inspectionExpiry) - new Date()) / (1000 * 3600 * 24) < 30) {
        alerts.push({ type: 'INSPECTION_DUE', date: v.inspectionExpiry, label: 'Inspection Due Soon' })
      }

      if (new Date(v.insuranceExpiry) < new Date()) {
        alerts.push({ type: 'INSURANCE_EXPIRED', date: v.insuranceExpiry, label: 'Commercial Insurance Expired' })
      } else if ((new Date(v.insuranceExpiry) - new Date()) / (1000 * 3600 * 24) < 30) {
        alerts.push({ type: 'INSURANCE_DUE', date: v.insuranceExpiry, label: 'Insurance Renewal Imminent' })
      }
      return { vehicle: v, alerts }
    }).filter(item => item.alerts.length > 0)
  }, [vehicles])

  return (
    <div className={`space-y-6 ${isMobileView ? 'max-w-md mx-auto border-4 border-slate-900 rounded-3xl p-3 bg-slate-100 dark:bg-slate-950 shadow-2xl' : ''}`}>
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 font-mono text-[11px] font-bold">
              <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
              StaffRoom Fleet Governance & Compliance Control Suite
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-400" size={26} />
              Digital Transport Control Room & Journey Compliance
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Real-time vehicle checkout, pre-departure safety checklists, digital journey logbooks, vehicle return sign-offs, incident management, key custody, document compliance alerts, and AI audit governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mobile View Toggle */}
            <button
              onClick={() => setIsMobileView(!isMobileView)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMobileView ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Smartphone size={15} />
              <span>{isMobileView ? 'Exit Mobile App View' : 'Driver Mobile App View'}</span>
            </button>

            {/* Quick Actions */}
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={15} /> Digital Vehicle Checkout
            </button>

            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle size={15} /> Report Emergency Incident
            </button>
          </div>
        </div>

        {/* ROLE SELECTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Active Governance Persona:</span>
            {['Fleet Operations Director', 'Transport Officer', 'Field Driver', 'Internal Auditor'].map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  userRole === role
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock size={13} className="text-emerald-400" /> Immutable Audit Stream Active
            </span>
            <span className="flex items-center gap-1">
              <Key size={13} className="text-amber-400" /> Vault Key Custody Locked
            </span>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'control_room', label: 'Control Room Dashboard', icon: Activity, badge: INITIAL_CONTROL_ROOM_STATS.vehiclesOnTrip },
          { id: 'checkout', label: 'Digital Vehicle Checkout', icon: Key },
          { id: 'active_journeys', label: 'Active & Historic Journeys', icon: Navigation, badge: journeys.length },
          { id: 'return', label: 'Vehicle Return Workflow', icon: RotateCcw },
          { id: 'incidents_damage', label: 'Incidents & Damage Register', icon: ShieldAlert, badge: incidents.length },
          { id: 'keys_compliance', label: 'Keys & Document Compliance', icon: FileCheckIcon, badge: expiringDocuments.length },
          { id: 'after_hours', label: 'After-Hours & Special Permits', icon: Clock },
          { id: 'ai_auditor', label: 'AI Transport Auditor', icon: Bot },
          { id: 'reports', label: 'Compliance Reports', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* --- TAB 1: TRANSPORT CONTROL ROOM DASHBOARD --- */}
      {activeSubTab === 'control_room' && (
        <div className="space-y-6">
          {/* REAL-TIME KPI GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase font-mono">Vehicles Available</span>
                <Car size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{INITIAL_CONTROL_ROOM_STATS.vehiclesAvailable}</p>
              <span className="text-[10px] text-emerald-600 font-bold font-mono">Ready for Dispatch</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase font-mono">Vehicles On Trip</span>
                <Navigation size={16} className="text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{INITIAL_CONTROL_ROOM_STATS.vehiclesOnTrip}</p>
              <span className="text-[10px] text-slate-500 font-mono">Live Journeys Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase font-mono">Under Maintenance</span>
                <Wrench size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{INITIAL_CONTROL_ROOM_STATS.vehiclesMaintenance}</p>
              <span className="text-[10px] text-amber-600 font-mono">Workshop Bay Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase font-mono">Emergency / Incidents</span>
                <AlertTriangle size={16} className="text-rose-500" />
              </div>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{incidents.filter(i => i.status === 'OPEN').length}</p>
              <span className="text-[10px] text-rose-600 font-mono font-bold">Action Required</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase font-mono">Drivers On Duty</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{INITIAL_CONTROL_ROOM_STATS.driversOnDuty}</p>
              <span className="text-[10px] text-slate-500 font-mono">6 Off-Duty Roster</span>
            </div>
          </div>

          {/* ACTIVE FLEET REAL-TIME STATUS TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Car size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Real-Time Fleet Status & Key Custody Monitor
                </h3>
                <p className="text-xs text-slate-500">Live operational state of every pool vehicle and driver assignment.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter Plate / Driver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 pl-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ON_TRIP">ON_TRIP</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="RESERVED">RESERVED</option>
                </select>
              </div>
            </div>

            {/* VEHICLES GRID / TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-3 px-3">Registration & Vehicle</th>
                    <th className="py-3 px-3">Driver Assigned</th>
                    <th className="py-3 px-3">Status & Location</th>
                    <th className="py-3 px-3">Fuel & Odometer</th>
                    <th className="py-3 px-3">Key Safe Status</th>
                    <th className="py-3 px-3">Doc Compliance</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {vehicles
                    .filter(v =>
                      (statusFilter === 'ALL' || v.status === statusFilter) &&
                      (v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(v => (
                      <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                        <td className="py-3 px-3">
                          <strong className="text-slate-900 dark:text-white font-mono block text-sm">{v.plate}</strong>
                          <span className="text-slate-500 text-[11px]">{v.model} ({v.type})</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{v.assignedDriver}</span>
                          <span className="text-slate-400 text-[10px] block">{v.assignedDepartment}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold inline-block ${
                              v.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              v.status === 'ON_TRIP' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                              v.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {v.status}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{v.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Fuel size={12} className="text-amber-500" />
                              <span className="font-bold">{v.fuelLevel}%</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{v.odometer.toLocaleString()} km</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            v.keyStatus === 'ISSUED' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' :
                            v.keyStatus === 'IN_SAFE' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                            'bg-rose-50 text-rose-700 font-black'
                          }`}>
                            <Key size={11} className="inline mr-1" />
                            {v.keyStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {new Date(v.inspectionExpiry) < new Date() ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px] font-mono">
                              Inspection Expired
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                              Valid Compliance
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {v.status === 'AVAILABLE' && (
                              <button
                                onClick={() => {
                                  setCheckoutForm(prev => ({ ...prev, vehiclePlate: v.plate, driverName: v.assignedDriver }))
                                  setIsCheckoutModalOpen(true)
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Checkout
                              </button>
                            )}

                            {v.keyStatus === 'ISSUED' ? (
                              <button
                                onClick={() => handleReturnKey(v.plate)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] cursor-pointer"
                              >
                                Return Key
                              </button>
                            ) : (
                              <button
                                onClick={() => handleIssueKey(v.plate, v.assignedDriver)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-[11px] cursor-pointer"
                              >
                                Issue Key
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: DIGITAL VEHICLE CHECKOUT & PRE-DEPARTURE CHECKLIST --- */}
      {activeSubTab === 'checkout' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key size={18} className="text-indigo-600 dark:text-indigo-400" />
                Digital Vehicle Checkout & Pre-Departure Safety Inspection
              </h3>
              <p className="text-xs text-slate-500">15-Point vehicle inspection checklist, driver declaration, and odometer verification before departure.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-bold">
              Form TRV-CHECKOUT-v2.4
            </span>
          </div>

          <form onSubmit={handleProcessCheckout} className="space-y-6 text-xs">
            {/* TRIP & DRIVER DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Selected *</label>
                <select
                  value={checkoutForm.vehiclePlate}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, vehiclePlate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plate}>
                      {v.plate} — {v.model} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Driver *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.driverName}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, driverName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lead Passenger *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.leadPassenger}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, leadPassenger: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Destination</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.destination}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, destination: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  required
                  value={checkoutForm.currentOdometer}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, currentOdometer: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Fuel Level (%)</label>
                <input
                  type="number"
                  max={100}
                  min={10}
                  required
                  value={checkoutForm.initialFuelLevel}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, initialFuelLevel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Return Time</label>
                <input
                  type="time"
                  required
                  value={checkoutForm.expectedReturnTime}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, expectedReturnTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            {/* PRE-DEPARTURE 15-POINT CHECKLIST */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" /> Mandatory Pre-Departure Vehicle Inspection Checklist (15 Safety Items)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allTrue = PRE_DEPARTURE_CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: true }), {})
                    setCheckoutForm({ ...checkoutForm, checklist: allTrue })
                  }}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-mono"
                >
                  Confirm All 15 Items Valid
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {PRE_DEPARTURE_CHECKLIST_ITEMS.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutForm.checklist[item.key] || false}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          checklist: { ...checkoutForm.checklist, [item.key]: e.target.checked }
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DRIVER DECLARATION & DIGITAL SIGNATURE */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-bold text-xs font-mono">
                <ShieldCheck size={16} className="text-emerald-500" />
                Driver Compliance Declaration & Digital Sign-off
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                "I hereby declare that I have inspected the vehicle and confirmed that all safety equipment is functional. I commit to adhering to traffic regulations and StaffRoom official travel guidelines."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    required
                    id="declarationCheck"
                    checked={checkoutForm.driverDeclaration}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, driverDeclaration: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <label htmlFor="declarationCheck" className="font-bold text-slate-800 dark:text-slate-200 text-xs cursor-pointer">
                    I accept the driver safety declaration
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Type Full Name for Digital Signature"
                    value={checkoutForm.signatureName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, signatureName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Send size={15} /> Confirm & Authorize Vehicle Departure
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 3: ACTIVE & HISTORIC JOURNEY LOGS --- */}
      {activeSubTab === 'active_journeys' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation size={18} className="text-indigo-600 dark:text-indigo-400" />
                Digital Journey Logbook & Stop Management
              </h3>
              <p className="text-xs text-slate-500">Track active journeys, multi-stop arrivals/departures, distance traveled, and trip status.</p>
            </div>
          </div>

          <div className="space-y-4">
            {journeys.map(jrn => (
              <div key={jrn.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{jrn.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[11px] font-bold">
                      {jrn.vehiclePlate}
                    </span>
                    {jrn.status === 'OVERDUE' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono font-bold text-[10px] animate-pulse">
                        LATE RETURN OVERDUE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-mono">Started: {jrn.startTime}</span>
                    <button
                      onClick={() => {
                        setSelectedJourney(jrn)
                        setReturnForm(prev => ({ ...prev, journeyId: jrn.id }))
                        setIsReturnModalOpen(true)
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Process Return Sign-off
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Driver & Department</span>
                    <strong className="text-slate-800 dark:text-slate-200 block">{jrn.driverName}</strong>
                    <span className="text-slate-500 text-[11px]">{jrn.department} ({jrn.costCentre})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Lead Passenger</span>
                    <strong className="text-slate-800 dark:text-slate-200 block">{jrn.leadPassenger}</strong>
                    <span className="text-slate-500 text-[11px]">{jrn.passengersCount} Passengers</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Route & Purpose</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium block truncate">{jrn.route}</span>
                    <span className="text-slate-500 text-[11px] block truncate">{jrn.purpose}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Odometer Log</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                      Start: {jrn.startOdometer} km
                    </span>
                    <span className="text-slate-500 text-[11px] block">
                      {jrn.endOdometer ? `End: ${jrn.endOdometer} km (${jrn.distanceKm} km dist)` : 'Trip Active'}
                    </span>
                  </div>
                </div>

                {/* STOP MANAGEMENT SUB-LOG */}
                {jrn.stops.length > 0 && (
                  <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
                      En-Route Stop Logs ({jrn.stops.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {jrn.stops.map((st, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-mono">
                          <strong className="text-slate-900 dark:text-white block">{st.location}</strong>
                          <span className="text-slate-500 text-[10px] block">Arrived: {st.arriveTime} | Departed: {st.departTime}</span>
                          <span className="text-slate-400 text-[10px] block">Reason: {st.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: VEHICLE RETURN WORKFLOW --- */}
      {activeSubTab === 'return' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw size={18} className="text-indigo-600 dark:text-indigo-400" />
              Post-Trip Vehicle Return & Damage Inspection Sign-Off
            </h3>
            <p className="text-xs text-slate-500">Record final odometer reading, fuel remaining, vehicle cleanliness, outstanding issues, and transport officer sign-off.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">Select Active Journey to Return *</label>
              <div className="space-y-2">
                {journeys.filter(j => j.status !== 'COMPLETED').map(j => (
                  <div
                    key={j.id}
                    onClick={() => {
                      setSelectedJourney(j)
                      setReturnForm(prev => ({ ...prev, journeyId: j.id }))
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all text-xs ${
                      selectedJourney?.id === j.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white font-mono">{j.id} — {j.vehiclePlate}</strong>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">Active</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{j.driverName} | {j.route}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedJourney ? (
              <form onSubmit={handleProcessReturn} className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Return Verification for {selectedJourney.vehiclePlate}
                </h4>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Final Odometer (km)</label>
                    <input
                      type="number"
                      required
                      value={returnForm.returnOdometer}
                      onChange={(e) => setReturnForm({ ...returnForm, returnOdometer: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fuel Remaining (%)</label>
                    <input
                      type="number"
                      required
                      value={returnForm.fuelRemaining}
                      onChange={(e) => setReturnForm({ ...returnForm, fuelRemaining: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Physical Condition</label>
                  <select
                    value={returnForm.vehicleCondition}
                    onChange={(e) => setReturnForm({ ...returnForm, vehicleCondition: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="EXCELLENT">EXCELLENT (No Damages, Clean)</option>
                    <option value="GOOD">GOOD (Normal Wear)</option>
                    <option value="MINOR_DIRT">DIRTY (Requires Bay Cleaning)</option>
                    <option value="DAMAGE_REPORTED">DAMAGE REPORTED (Record Damage Register)</option>
                  </select>
                </div>

                {returnForm.vehicleCondition === 'DAMAGE_REPORTED' && (
                  <div>
                    <label className="block font-bold text-rose-600 dark:text-rose-400 mb-1">Damage Description Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Describe scratches, dents, or broken lights..."
                      value={returnForm.damageNotes}
                      onChange={(e) => setReturnForm({ ...returnForm, damageNotes: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Driver Sign-Off Signature</label>
                    <input
                      type="text"
                      required
                      value={returnForm.driverSignature}
                      onChange={(e) => setReturnForm({ ...returnForm, driverSignature: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Transport Officer Sign-Off</label>
                    <input
                      type="text"
                      required
                      value={returnForm.officerSignOff}
                      onChange={(e) => setReturnForm({ ...returnForm, officerSignOff: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Complete Vehicle Return & Lock Key in Safe
                </button>
              </form>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 space-y-2">
                <RotateCcw size={28} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold">Select an active journey on the left to initiate the return workflow.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: INCIDENTS & DAMAGE REGISTER --- */}
      {activeSubTab === 'incidents_damage' && (
        <div className="space-y-6">
          {/* INCIDENTS LIST */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-600 dark:text-rose-400" />
                  Emergency Incident Management Register
                </h3>
                <p className="text-xs text-slate-500">Accident, breakdown, traffic delay, flat tyre, and mechanical failure reports with police OB & insurance tracking.</p>
              </div>
              <button
                onClick={() => setIsIncidentModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} /> Log Incident
              </button>
            </div>

            <div className="space-y-3">
              {incidents.map(inc => (
                <div key={inc.id} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-950 dark:text-rose-200">{inc.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono font-bold text-[10px]">
                        {inc.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px]">
                        {inc.vehiclePlate}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">{inc.timestamp}</span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-200 font-medium">{inc.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600 dark:text-slate-400 border-t border-rose-200 dark:border-rose-900/60 pt-2">
                    <span>Location: {inc.location}</span>
                    <span>Police OB: {inc.policeReportNo}</span>
                    <span>Insurance Ref: {inc.insuranceReference}</span>
                    <span className="text-rose-600 font-bold">Driver: {inc.driverName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DAMAGE REGISTER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench size={18} className="text-amber-600 dark:text-amber-400" />
                Vehicle Damage & Workshop Repair Register
              </h3>
              <p className="text-xs text-slate-500">Track damage history, repair costs, driver accountability, and insurance claims.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Damage ID & Plate</th>
                    <th className="py-2.5 px-3">Component Damaged</th>
                    <th className="py-2.5 px-3">Responsible Driver</th>
                    <th className="py-2.5 px-3">Repair Cost (KSh)</th>
                    <th className="py-2.5 px-3">Workshop & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {damages.map(dmg => (
                    <tr key={dmg.id}>
                      <td className="py-3 px-3 font-mono">
                        <strong className="text-slate-900 dark:text-white block">{dmg.id}</strong>
                        <span className="text-indigo-600 font-bold">{dmg.vehiclePlate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{dmg.component}</span>
                        <span className="text-slate-500 text-[11px]">{dmg.description}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">{dmg.responsibleDriver}</td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">
                        KSh {dmg.repairCostKsh.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">
                          {dmg.repairStatus}
                        </span>
                        <span className="text-slate-400 text-[10px] block mt-0.5">{dmg.workshopName}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: KEYS & DOCUMENT COMPLIANCE MONITOR --- */}
      {activeSubTab === 'keys_compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KEY VAULT LOG */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key size={18} className="text-amber-500" />
                Physical Key Custody & Vault Audit Log
              </h3>
              <p className="text-xs text-slate-500">Track key checkout, issuer authority, time out, and return status.</p>
            </div>

            <div className="space-y-2">
              {keyLogs.map(k => (
                <div key={k.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-indigo-600">{k.vehiclePlate}</strong>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{k.issuedTo}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] block font-mono">Issued By: {k.issuedBy} @ {k.timeOut}</span>
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold ${
                      k.status === 'ISSUED' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {k.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOCUMENT EXPIRY COMPLIANCE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheckIcon size={18} className="text-emerald-500" />
                Vehicle Statutory Document Compliance Monitor
              </h3>
              <p className="text-xs text-slate-500">Automated alerts for Insurance, NTSA Inspection, and Road Licence expiration.</p>
            </div>

            <div className="space-y-3">
              {expiringDocuments.length === 0 ? (
                <p className="text-xs text-emerald-600 font-mono font-bold p-4 bg-emerald-50 rounded-2xl">
                  All fleet statutory licenses and inspection certificates are 100% compliant!
                </p>
              ) : (
                expiringDocuments.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs">
                    <div>
                      <strong className="font-mono text-slate-900 dark:text-white text-sm block">{item.vehicle.plate}</strong>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{item.vehicle.model}</span>
                    </div>

                    <div className="space-y-1 text-right font-mono">
                      {item.alerts.map((alt, aIdx) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold block">
                          {alt.label} ({alt.date})
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: AFTER-HOURS & SPECIAL PERMIT CONTROL --- */}
      {activeSubTab === 'after_hours' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
              After-Hours & Special Journey Permit Control
            </h3>
            <p className="text-xs text-slate-500">Executive authorization workflow for weekend travel, night missions, and public holiday vehicle dispatch.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
            <strong className="text-amber-950 dark:text-amber-200 font-bold flex items-center gap-1.5 text-xs font-mono">
              <AlertCircle size={15} /> Policy Threshold Notice
            </strong>
            <p className="text-amber-900 dark:text-amber-300 text-[11px]">
              Any vehicle checkout requested between 18:00 and 06:00, or on Saturday/Sunday, automatically requires Executive Fleet Director digital authorization before key release.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Active Special Night Permits Approved</h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Permit #NIGHT-882</span>
                    <span className="text-emerald-600">APPROVED</span>
                  </div>
                  <span className="text-slate-500 block">KDF 991A — Peter Otieno</span>
                  <span className="text-slate-400 text-[10px] block">Reason: Early Staff Shuttle Dispatch (05:00 AM)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Request After-Hours Exemption Permit</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Vehicle Plate & Driver"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Justification for Night/Weekend travel..."
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  onClick={() => {
                    if (onNotify) onNotify('After-Hours Travel Permit Request routed to Executive Fleet Director!')
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
                >
                  Submit Executive Exemption
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 8: AI TRANSPORT AUDITOR --- */}
      {activeSubTab === 'ai_auditor' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
                AI Transport Auditor & Anomaly Intelligence Engine
              </h3>
              <p className="text-xs text-slate-500">Autonomous analysis of unusual trips, fuel variances, driver behavior patterns, and idle vehicle risks.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[11px] font-bold">
              Gemini AI Fleet Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
              <strong className="font-bold text-amber-950 dark:text-amber-200 block font-mono">Fuel Variance Anomaly Detected</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                Vehicle KDC 304C recorded a 18% fuel consumption variance compared to standard distance benchmarks on the JKIA route.
              </p>
              <button
                onClick={() => {
                  if (onNotify) onNotify('AI Auditor triggered fuel tank calibration check for KDC 304C.')
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[10px] cursor-pointer"
              >
                Trigger Fuel Calibration
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-2">
              <strong className="font-bold text-indigo-950 dark:text-indigo-200 block font-mono">Idle Vehicle Optimization</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                Vehicle KDA 112X has been idle in workshop for 3 days. Recommend reallocating pending field trips to KDF 991A.
              </p>
              <button
                onClick={() => {
                  if (onNotify) onNotify('AI Reallocation plan applied to Dispatch Queue.')
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] cursor-pointer"
              >
                Apply AI Reallocation
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <strong className="font-bold text-emerald-950 dark:text-emerald-200 block font-mono">Driver Safety Score: 96%</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                Zero harsh braking or speeding alerts recorded across the active 12 journeys today. Compliance is exemplary.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 9: COMPLIANCE REPORTS --- */}
      {activeSubTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-indigo-600 dark:text-indigo-400" />
                Fleet Audit & Journey Compliance Reports Export
              </h3>
              <p className="text-xs text-slate-500">Download immutable audit registers for internal compliance and statutory inspection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Vehicle Movement Register', desc: 'Complete log of checkout & check-in timestamps' },
              { title: 'Official Journey Logbook', desc: 'Driver, passenger manifest, route & cost centre logs' },
              { title: 'Damage & Repair Register', desc: 'Workshop invoices, responsible drivers & claims' },
              { title: 'Fuel Variance Audit Report', desc: 'Distance vs fuel consumption anomaly logs' },
              { title: 'Late Returns & Overdue Report', desc: 'Schedule adherence & driver delay logs' },
              { title: 'Statutory License Compliance', desc: 'Insurance & NTSA inspection certificates' }
            ].map((rep, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <strong className="font-bold text-slate-900 dark:text-white block">{rep.title}</strong>
                <p className="text-slate-500 text-[11px]">{rep.desc}</p>
                <button
                  onClick={() => {
                    if (onNotify) onNotify(`Exporting ${rep.title} in CSV/PDF format...`)
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                >
                  <Download size={13} /> Download Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL: DIGITAL CHECKOUT MODAL --- */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <strong className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key size={18} className="text-indigo-600" /> Dispatch & Checkout Modal
              </strong>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Plate</label>
                  <select
                    value={checkoutForm.vehiclePlate}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, vehiclePlate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.plate}>{v.plate} — {v.model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.driverName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, driverName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Destination</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.destination}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, destination: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono space-y-1">
                <span className="font-bold text-emerald-600 block">✓ All 15 Pre-Departure Checklist Items Verified</span>
                <span className="text-slate-500 block">Initial Odometer: {checkoutForm.currentOdometer} km</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Authorize Checkout & Issue Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: REPORT EMERGENCY INCIDENT --- */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <strong className="text-base font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle size={18} /> Report Incident or Breakdown
              </strong>
              <button
                onClick={() => setIsIncidentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportIncident} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Plate</label>
                  <input
                    type="text"
                    required
                    value={incidentForm.vehiclePlate}
                    onChange={(e) => setIncidentForm({ ...incidentForm, vehiclePlate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Incident Type</label>
                  <select
                    value={incidentForm.type}
                    onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Traffic Delay">Traffic Delay</option>
                    <option value="Breakdown">Breakdown / Overheating</option>
                    <option value="Accident">Accident / Collision</option>
                    <option value="Flat Tyre">Flat Tyre</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Exact Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thika Highway Exit 7"
                  value={incidentForm.location}
                  onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description & Details</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide incident context..."
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Log Incident Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper icon
function FileCheckIcon(props) {
  return <FileText {...props} />
}
