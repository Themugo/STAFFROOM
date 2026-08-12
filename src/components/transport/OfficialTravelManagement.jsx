import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Plane,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  ChevronRight,
  Sparkles,
  Hotel,
  Car,
  CreditCard,
  Send,
  Navigation,
  Compass,
  Zap,
  TrendingUp,
  Award,
  Check,
  X,
  Radio,
  FileCheck,
  Globe,
  PieChart,
  UserCheck
} from 'lucide-react'

// Sample Data for Official Travel Management
export const SAMPLE_TRAVEL_REQUESTS = [
  {
    id: 'TRV-2026-801',
    travelerName: 'Dr. Jane Muthoni',
    employeeId: 'EMP-101',
    department: 'Medical & Clinical Operations',
    jobGrade: 'Grade 15 - Senior Medical Specialist',
    travelType: 'County Visit',
    purpose: 'Kiambu & Murang’a Regional Health Audits & Vaccine Cold-Chain Inspection',
    priority: 'HIGH',
    costCentre: 'CC-MED-402 (Health Field Ops)',
    donorProject: 'USAID Health Systems Grant (GRANT-USAID-2026)',
    itinerary: [
      { from: 'Nairobi HQ', to: 'Kiambu Level 5 Hospital', county: 'Kiambu', date: '2026-08-05' },
      { from: 'Kiambu Town', to: 'Murang’a General Hospital', county: 'Murang’a', date: '2026-08-07' }
    ],
    travelDates: { start: '2026-08-05', return: '2026-08-09', durationDays: 5 },
    expectedOutcomes: 'Audit 12 vaccine storage centers and submit compliance report to Ministry of Health.',
    approvalChain: [
      { role: 'Supervisor', name: 'Dr. David Kimani', status: 'APPROVED', date: '2026-08-01' },
      { role: 'Department Head', name: 'Prof. Alice Ndung’u', status: 'APPROVED', date: '2026-08-01' },
      { role: 'Finance', name: 'Samuel Ochieng', status: 'APPROVED', date: '2026-08-02' },
      { role: 'Transport', name: 'Joseph Mwangi', status: 'APPROVED', date: '2026-08-02' },
      { role: 'HR & Security', name: 'Grace Wambui', status: 'APPROVED', date: '2026-08-02' }
    ],
    overallStatus: 'APPROVED',
    transportMode: 'Company Pool Vehicle (4x4 SUV)',
    assignedVehicle: 'KCG 552X - Toyota Prado (Fleet Pool)',
    driverName: 'Peter Kamau (+254 712 334 455)',
    accommodation: {
      facilityName: 'Blue Post Hotel & Resort Thika',
      type: 'Hotel',
      bookingNo: 'HOTEL-BPH-8821',
      checkIn: '2026-08-05',
      checkOut: '2026-08-09',
      ratePerNightKsh: 8500,
      vendor: 'Blue Post Hospitality Ltd'
    },
    perDiem: {
      dailyRateKsh: 6500,
      totalDays: 5,
      breakfastAllowanceKsh: 5000,
      lunchAllowanceKsh: 7500,
      dinnerAllowanceKsh: 10000,
      incidentalsKsh: 10000,
      totalPerDiemKsh: 32500
    },
    advance: {
      requestedAmountKsh: 45000,
      disbursementMethod: 'Mobile Money (M-Pesa)',
      disbursementStatus: 'DISBURSED',
      referenceNo: 'MPESA-QRT8812993'
    },
    riskAdvisory: {
      level: 'LOW_RISK',
      notes: 'Standard road travel. All emergency medical protocols in place.',
      emergencyContact: 'Dr. Jane Muthoni (+254 722 001 122)'
    }
  },
  {
    id: 'TRV-2026-802',
    travelerName: 'Eng. Francis Mutua',
    employeeId: 'EMP-105',
    department: 'Engineering & Infrastructure',
    jobGrade: 'Grade 14 - Lead Civil Engineer',
    travelType: 'Regional Travel',
    purpose: 'Eldoret & Kisumu Branch Solar Microgrid Technical Installation',
    priority: 'URGENT_EMERGENCY',
    costCentre: 'CC-ENG-108 (Green Energy Ops)',
    donorProject: 'EU Green Climate Fund (GRANT-EU-772)',
    itinerary: [
      { from: 'Nairobi HQ', to: 'Eldoret Regional Branch', county: 'Uasin Gishu', date: '2026-08-10' },
      { from: 'Eldoret Branch', to: 'Kisumu Sub-Office', county: 'Kisumu', date: '2026-08-13' }
    ],
    travelDates: { start: '2026-08-10', return: '2026-08-16', durationDays: 7 },
    expectedOutcomes: 'Commission 50kW solar array and train local branch technicians.',
    approvalChain: [
      { role: 'Supervisor', name: 'Eng. Charles Otieno', status: 'APPROVED', date: '2026-08-01' },
      { role: 'Department Head', name: 'Eng. Charles Otieno', status: 'APPROVED', date: '2026-08-01' },
      { role: 'Finance', name: 'Samuel Ochieng', status: 'PENDING', date: 'Pending Review' },
      { role: 'Transport', name: 'Joseph Mwangi', status: 'PENDING', date: 'Pending Review' },
      { role: 'HR & Security', name: 'Grace Wambui', status: 'PENDING', date: 'Pending Review' }
    ],
    overallStatus: 'PENDING_APPROVAL',
    transportMode: 'Air Ticket (Domestic Flight) + Car Hire',
    assignedVehicle: 'Fly540 Flight + Eldoret Car Hire Pickup',
    driverName: 'Self-Drive / Local Chauffeur',
    accommodation: {
      facilityName: 'Boma Inn Eldoret & Imperial Hotel Kisumu',
      type: 'Hotel',
      bookingNo: 'HOTEL-BOMA-9912',
      checkIn: '2026-08-10',
      checkOut: '2026-08-16',
      ratePerNightKsh: 12000,
      vendor: 'The Boma Hotels Group'
    },
    perDiem: {
      dailyRateKsh: 8000,
      totalDays: 7,
      breakfastAllowanceKsh: 7000,
      lunchAllowanceKsh: 14000,
      dinnerAllowanceKsh: 21000,
      incidentalsKsh: 14000,
      totalPerDiemKsh: 56000
    },
    advance: {
      requestedAmountKsh: 75000,
      disbursementMethod: 'Bank Transfer (RTGS)',
      disbursementStatus: 'APPROVED_AWAITING_PAYMENT',
      referenceNo: 'RTGS-PEND-0021'
    },
    riskAdvisory: {
      level: 'LOW_RISK',
      notes: 'Monitored flight schedule and hotel security clearance confirmed.',
      emergencyContact: 'Eng. Francis Mutua (+254 711 889 900)'
    }
  },
  {
    id: 'TRV-2026-803',
    travelerName: 'Amina Zainab',
    employeeId: 'EMP-102',
    department: 'Finance & Compliance',
    jobGrade: 'Grade 13 - Senior Financial Auditor',
    travelType: 'International Travel',
    purpose: 'Kigali Rwanda East African Financial Regulatory Summit',
    priority: 'NORMAL',
    costCentre: 'CC-FIN-201 (Corporate Governance)',
    donorProject: 'World Bank PFM Capacity Program',
    itinerary: [
      { from: 'Nairobi JKIA (NBO)', to: 'Kigali International (KGL)', county: 'Rwanda', date: '2026-08-18' }
    ],
    travelDates: { start: '2026-08-18', return: '2026-08-22', durationDays: 5 },
    expectedOutcomes: 'Present StaffRoom financial compliance framework and network with East African regulators.',
    approvalChain: [
      { role: 'Supervisor', name: 'Patrick Njuguna', status: 'APPROVED', date: '2026-07-28' },
      { role: 'Department Head', name: 'Patrick Njuguna', status: 'APPROVED', date: '2026-07-28' },
      { role: 'Finance', name: 'Samuel Ochieng', status: 'APPROVED', date: '2026-07-29' },
      { role: 'HR', name: 'Grace Wambui', status: 'APPROVED', date: '2026-07-29' },
      { role: 'CEO', name: 'Dr. Michael Thorne', status: 'APPROVED', date: '2026-07-30' }
    ],
    overallStatus: 'APPROVED',
    transportMode: 'RwandAir Flight (Economy)',
    assignedVehicle: 'Flight WB 402 Nairobi-Kigali',
    driverName: 'Airport Shuttle Taxi',
    accommodation: {
      facilityName: 'Kigali Marriott Hotel',
      type: 'Hotel',
      bookingNo: 'MAR-KGL-00293',
      checkIn: '2026-08-18',
      checkOut: '2026-08-22',
      ratePerNightKsh: 28000,
      vendor: 'Marriott International'
    },
    perDiem: {
      dailyRateKsh: 32000, // USD equivalent
      totalDays: 5,
      breakfastAllowanceKsh: 20000,
      lunchAllowanceKsh: 40000,
      dinnerAllowanceKsh: 60000,
      incidentalsKsh: 40000,
      totalPerDiemKsh: 160000
    },
    advance: {
      requestedAmountKsh: 180000,
      disbursementMethod: 'Corporate Visa Travel Card',
      disbursementStatus: 'DISBURSED',
      referenceNo: 'CARD-VISA-7712'
    },
    riskAdvisory: {
      level: 'LOW_RISK',
      notes: 'Yellow fever certificate required. Travel insurance policy issued.',
      emergencyContact: 'Hassan Zainab (+254 722 443 322)'
    }
  }
]

export default function OfficialTravelManagement({ onNotify }) {
  const toast = useToast()
  const [requests, setRequests] = useState(SAMPLE_TRAVEL_REQUESTS)
  const [activeSubTab, setActiveSubTab] = useState('REQUESTS')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL')
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)

  // New Travel Request Form State
  const [newRequest, setNewRequest] = useState({
    travelerName: '',
    employeeId: '',
    department: 'Corporate Operations',
    jobGrade: 'Grade 12 - Staff Specialist',
    travelType: 'County Visit',
    purpose: '',
    priority: 'NORMAL',
    costCentre: 'CC-GEN-101 (General Operations)',
    donorProject: 'Internal Corporate Budget',
    fromLocation: 'Nairobi HQ',
    toDestination: '',
    countyCountry: 'Kiambu',
    startDate: '',
    returnDate: '',
    durationDays: 3,
    expectedOutcomes: '',
    transportMode: 'Company Pool Vehicle (4x4 SUV)',
    requestedAdvanceKsh: 30000,
    disbursementMethod: 'Mobile Money (M-Pesa)'
  })

  const handleCreateRequestSubmit = (e) => {
    e.preventDefault()
    if (!newRequest.travelerName || !newRequest.purpose || !newRequest.toDestination) {
      toast.error('Traveler Name, Purpose, and Destination are required!')
      return
    }

    const created = {
      id: `TRV-2026-${Math.floor(800 + Math.random() * 100)}`,
      travelerName: newRequest.travelerName,
      employeeId: newRequest.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      department: newRequest.department,
      jobGrade: newRequest.jobGrade,
      travelType: newRequest.travelType,
      purpose: newRequest.purpose,
      priority: newRequest.priority,
      costCentre: newRequest.costCentre,
      donorProject: newRequest.donorProject,
      itinerary: [
        { from: newRequest.fromLocation, to: newRequest.toDestination, county: newRequest.countyCountry, date: newRequest.startDate }
      ],
      travelDates: {
        start: newRequest.startDate || '2026-08-10',
        return: newRequest.returnDate || '2026-08-13',
        durationDays: Number(newRequest.durationDays) || 3
      },
      expectedOutcomes: newRequest.expectedOutcomes || 'Achieve mission objectives.',
      approvalChain: [
        { role: 'Supervisor', name: 'Direct Supervisor', status: 'PENDING', date: 'Pending Review' },
        { role: 'Department Head', name: 'Dept Manager', status: 'PENDING', date: 'Pending Review' },
        { role: 'Finance', name: 'Finance Controller', status: 'PENDING', date: 'Pending Review' },
        { role: 'Transport', name: 'Fleet Coordinator', status: 'PENDING', date: 'Pending Review' },
        { role: 'HR & Security', name: 'HR Lead', status: 'PENDING', date: 'Pending Review' }
      ],
      overallStatus: 'PENDING_APPROVAL',
      transportMode: newRequest.transportMode,
      assignedVehicle: 'To be assigned upon Transport approval',
      driverName: 'To be assigned',
      accommodation: {
        facilityName: 'Partner Executive Guest House',
        type: 'Guest House',
        bookingNo: 'PENDING-BOOKING',
        checkIn: newRequest.startDate,
        checkOut: newRequest.returnDate,
        ratePerNightKsh: 7500,
        vendor: 'Approved Corporate Vendor'
      },
      perDiem: {
        dailyRateKsh: 6000,
        totalDays: Number(newRequest.durationDays) || 3,
        breakfastAllowanceKsh: 3000,
        lunchAllowanceKsh: 6000,
        dinnerAllowanceKsh: 9000,
        incidentalsKsh: 3000,
        totalPerDiemKsh: (Number(newRequest.durationDays) || 3) * 6000
      },
      advance: {
        requestedAmountKsh: Number(newRequest.requestedAdvanceKsh) || 30000,
        disbursementMethod: newRequest.disbursementMethod,
        disbursementStatus: 'PENDING_APPROVAL',
        referenceNo: 'REF-PENDING'
      },
      riskAdvisory: {
        level: 'LOW_RISK',
        notes: 'Standard field visit security clearance applied.',
        emergencyContact: 'HR Duty Desk (+254 700 000 111)'
      }
    }

    setRequests(prev => [created, ...prev])
    if (onNotify) onNotify(`Official Travel Request ${created.id} submitted for ${created.travelerName}! Workflow routed to Supervisor & Finance.`)
    setIsNewRequestModalOpen(false)
  }

  const filteredRequests = requests.filter(r => {
    const matchesSearch =
      r.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypeFilter === 'ALL' || r.travelType === selectedTypeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-[11px] font-bold">
              <Plane size={14} className="text-amber-400" /> Official Duty Journeys & Field Missions Management
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-400" />
              Official Travel, Duty Journeys & Per Diem Engine
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Manage local, regional, and international travel, field mission itineraries, multi-tier approvals, automated per diem policies, accommodation bookings, travel advances, and donor project allocations.
            </p>
          </div>

          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center gap-2 shrink-0 transition-all"
          >
            <Plus size={16} /> Request Official Travel
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800 pt-3 text-xs font-mono font-bold">
          {[
            { id: 'REQUESTS', label: 'Travel Requests & Approvals', icon: FileText, count: requests.length },
            { id: 'TRANSPORT_HOTEL', label: 'Transport & Accommodation Linkage', icon: Hotel },
            { id: 'PER_DIEM', label: 'Per Diem & Travel Advance Engine', icon: DollarSign },
            { id: 'FIELD_MISSION', label: 'Field Mission & Team Travel Planner', icon: Compass },
            { id: 'EXPENSE_REPORT', label: 'Expenses & Trip Completion Reports', icon: FileCheck },
            { id: 'ANALYTICS_DONOR', label: 'Travel Analytics & Donor Allocations', icon: PieChart }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* SUB-TAB 1: TRAVEL REQUESTS & APPROVAL WORKFLOW */}
      {activeSubTab === 'REQUESTS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search traveler, purpose, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto font-mono">
                <span className="text-slate-400 font-bold shrink-0">Filter Category:</span>
                {['ALL', 'County Visit', 'Regional Travel', 'International Travel', 'Field Mission', 'Emergency Deployment'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
                      selectedTypeFilter === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Request Cards */}
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                          {req.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold">
                          {req.travelType}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          req.priority === 'URGENT_EMERGENCY'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {req.priority}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{req.purpose}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Traveler: <strong className="text-slate-800 dark:text-slate-200">{req.travelerName}</strong> ({req.employeeId}) • {req.department}
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="text-slate-400 text-[10px] block">Travel Duration</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 text-sm">{req.travelDates.start} to {req.travelDates.return} ({req.travelDates.durationDays} Days)</strong>
                      <span className="text-slate-400 text-[10px] block mt-0.5">Project: {req.donorProject}</span>
                    </div>
                  </div>

                  {/* Multi-tier Approval Chain Pipeline */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                      Multi-Tier Approval Chain Pipeline:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                      {req.approvalChain.map((step, idx) => {
                        const isApproved = step.status === 'APPROVED'
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-2xl border ${
                              isApproved
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            <span className="text-[10px] font-bold block text-slate-400 uppercase">{step.role}</span>
                            <strong className="block text-slate-900 dark:text-white truncate">{step.name}</strong>
                            <span className="text-[10px] font-bold">{step.status}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quick Summary Row */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px]">Transport & Accommodation Allocation:</span>
                      <p className="text-slate-800 dark:text-slate-200">
                        Method: <strong className="text-indigo-600 dark:text-indigo-400">{req.transportMode}</strong> | Hotel: <strong>{req.accommodation.facilityName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { if (onNotify) onNotify(`Travel Advance KSh ${req.advance.requestedAmountKsh.toLocaleString()} approved for ${req.travelerName}`) }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                      >
                        Approve Advance (KSh {req.advance.requestedAmountKsh.toLocaleString()})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TRANSPORT & ACCOMMODATION LINKAGE */}
      {activeSubTab === 'TRANSPORT_HOTEL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transport Linkage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car size={18} className="text-indigo-600 dark:text-indigo-400" />
              Official Journey Transport Linkage Engine
            </h3>
            <p className="text-xs text-slate-500">
              Automatically recommends and links the most cost-effective travel method based on distance, duration, and terrain.
            </p>

            <div className="space-y-3 font-mono text-xs">
              {[
                { type: 'Company Pool Vehicle (4x4 SUV)', detail: 'KCG 552X - Toyota Prado (Driver: Peter Kamau)', status: 'ASSIGNED', cost: 'KSh 18,500 Fuel & Mileage' },
                { type: 'Domestic Air Ticket (Economy)', detail: 'RwandAir Flight WB 402 Nairobi-Kigali', status: 'BOOKED', cost: 'KSh 42,000 Airfare' },
                { type: 'Express Inter-County Shuttle Bus', detail: 'EasyCoach Express Bus Ticket #TK-8821', status: 'RESERVED', cost: 'KSh 2,500 Ticket' },
                { type: 'Personal Vehicle Mileage Reimbursement', detail: 'AA Kenya Rate KSh 68/km for 240 km', status: 'CLAIMABLE', cost: 'KSh 16,320 Claim' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 dark:text-white">{item.type}</strong>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">{item.status}</span>
                  </div>
                  <p className="text-slate-500">{item.detail}</p>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block">{item.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation Manager */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Hotel size={18} className="text-amber-500" />
              Corporate Accommodation & Lodging Manager
            </h3>
            <p className="text-xs text-slate-500">
              Approved corporate hotels, field guest houses, hostels, and partner accommodation reservations.
            </p>

            <div className="space-y-3 font-mono text-xs">
              {[
                { name: 'Blue Post Hotel & Resort Thika', nights: '4 Nights', rate: 'KSh 8,500 / night', booking: 'HOTEL-BPH-8821', total: 'KSh 34,000' },
                { name: 'The Boma Inn Eldoret', nights: '3 Nights', rate: 'KSh 12,000 / night', booking: 'HOTEL-BOMA-9912', total: 'KSh 36,000' },
                { name: 'Kigali Marriott Hotel', nights: '4 Nights', rate: 'KSh 28,000 / night', booking: 'MAR-KGL-00293', total: 'KSh 112,000' }
              ].map((h, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 dark:text-white">{h.name}</strong>
                    <span className="text-slate-400 text-[10px]">{h.booking}</span>
                  </div>
                  <p className="text-slate-500">{h.nights} @ {h.rate}</p>
                  <strong className="text-emerald-600 dark:text-emerald-400 block">Total Accommodation: {h.total}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PER DIEM & TRAVEL ADVANCE ENGINE */}
      {activeSubTab === 'PER_DIEM' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold mb-1">
                <DollarSign size={13} /> Policy-Driven Allowance Calculator
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Automated Per Diem Policy & Travel Advance Settlement Engine
              </h3>
              <p className="text-xs text-slate-500">
                Calculates daily subsistence allowances (Breakfast, Lunch, Dinner, Incidentals) based on job grade, destination county/country, donor grant limits, and trip duration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Grade 15 - Senior Specialist Rate</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">KSh 6,500 / Day</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• Breakfast: KSh 1,000</li>
                <li>• Lunch: KSh 1,500</li>
                <li>• Dinner: KSh 2,000</li>
                <li>• Incidentals: KSh 2,000</li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Grade 14 - Technical Lead Rate</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">KSh 8,000 / Day</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• Breakfast: KSh 1,000</li>
                <li>• Lunch: KSh 2,000</li>
                <li>• Dinner: KSh 3,000</li>
                <li>• Incidentals: KSh 2,000</li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">International Allowance (East Africa)</span>
              <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">$220 USD / Day</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• Breakfast: $30 USD</li>
                <li>• Lunch: $60 USD</li>
                <li>• Dinner: $80 USD</li>
                <li>• Incidentals: $50 USD</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FIELD MISSION & TEAM TRAVEL PLANNER */}
      {activeSubTab === 'FIELD_MISSION' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass size={18} className="text-indigo-600 dark:text-indigo-400" />
              Multi-Day Field Mission Itinerary & Team Travel Workspace
            </h3>
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold">
              Team Mission Active
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-sm text-slate-900 dark:text-white block">Kiambu & Murang’a Health Field Mission</strong>
                <span className="text-slate-400">Team Leader: Dr. Jane Muthoni (3 Team Members)</span>
              </div>
              <span className="text-emerald-600 font-bold">4 Days Remaining</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Day 1 - Aug 5</span>
                <strong className="text-slate-800 dark:text-slate-200 block">Kiambu Hospital Audit</strong>
                <span className="text-slate-500">GPS: -1.0332, 37.0691</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Day 2 - Aug 6</span>
                <strong className="text-slate-800 dark:text-slate-200 block">Thika Health Sub-Center</strong>
                <span className="text-slate-500">GPS: -1.0388, 37.0812</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Day 3 - Aug 7</span>
                <strong className="text-slate-800 dark:text-slate-200 block">Murang’a Vaccine Depot</strong>
                <span className="text-slate-500">GPS: -0.7211, 37.1522</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: EXPENSES & TRIP COMPLETION REPORTS */}
      {activeSubTab === 'EXPENSE_REPORT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            Trip Completion Mission Reports & Expense Settlement Ledger
          </h3>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-slate-900 dark:text-white block">Dr. Jane Muthoni - Kiambu Health Audit Report</strong>
                <span className="text-slate-400">Advance Received: KSh 45,000 | Total Spent: KSh 41,200</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">SURPLUS REFUND KSH 3,800</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Mission Objectives Achieved: Inspected 12 cold-chain storage facilities, identified 2 backup generator maintenance needs, and submitted report to County Ministry of Health.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: TRAVEL ANALYTICS & DONOR ALLOCATIONS */}
      {activeSubTab === 'ANALYTICS_DONOR' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart size={18} className="text-indigo-600 dark:text-indigo-400" />
            Official Travel Expenditure & Donor Project Cost Allocations
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] block">Total Travel Budget (Q3)</span>
              <strong className="text-base text-slate-900 dark:text-white">KSh 4.2M</strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] block">Donor Funded Portion</span>
              <strong className="text-base text-indigo-600 dark:text-indigo-400">KSh 2.8M (66.6%)</strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] block">Per Diem Disbursed</span>
              <strong className="text-base text-emerald-600 dark:text-emerald-400">KSh 1.45M</strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] block">Outstanding Advances</span>
              <strong className="text-base text-amber-500">KSh 245,000</strong>
            </div>
          </div>
        </div>
      )}

      {/* NEW TRAVEL REQUEST MODAL */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600 dark:text-indigo-400" />
              Request Official Duty Journey / Travel
            </h3>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Traveler Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Muthoni"
                    value={newRequest.travelerName}
                    onChange={(e) => setNewRequest({ ...newRequest, travelerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="EMP-101"
                    value={newRequest.employeeId}
                    onChange={(e) => setNewRequest({ ...newRequest, employeeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Purpose of Travel *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Regional Health Audits & Vaccine Cold-Chain Inspection"
                  value={newRequest.purpose}
                  onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Travel Category</label>
                  <select
                    value={newRequest.travelType}
                    onChange={(e) => setNewRequest({ ...newRequest, travelType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="County Visit">County Visit</option>
                    <option value="Regional Travel">Regional Travel</option>
                    <option value="International Travel">International Travel</option>
                    <option value="Field Mission">Field Mission</option>
                    <option value="Emergency Deployment">Emergency Deployment</option>
                    <option value="Training / Conference">Training / Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT_EMERGENCY">URGENT EMERGENCY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Main Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kiambu Level 5 & Thika Hospital"
                    value={newRequest.toDestination}
                    onChange={(e) => setNewRequest({ ...newRequest, toDestination: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">County / Country</label>
                  <input
                    type="text"
                    placeholder="Kiambu / Kenya"
                    value={newRequest.countyCountry}
                    onChange={(e) => setNewRequest({ ...newRequest, countyCountry: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={newRequest.returnDate}
                    onChange={(e) => setNewRequest({ ...newRequest, returnDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Days</label>
                  <input
                    type="number"
                    min={1}
                    value={newRequest.durationDays}
                    onChange={(e) => setNewRequest({ ...newRequest, durationDays: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Donor Project / Grant</label>
                  <input
                    type="text"
                    placeholder="USAID Health Systems Grant"
                    value={newRequest.donorProject}
                    onChange={(e) => setNewRequest({ ...newRequest, donorProject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Requested Advance (KSh)</label>
                  <input
                    type="number"
                    value={newRequest.requestedAdvanceKsh}
                    onChange={(e) => setNewRequest({ ...newRequest, requestedAdvanceKsh: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Submit Travel Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
