import React, { useState, useEffect, useRef } from 'react'
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Layers,
  FileText,
  Navigation,
  ShieldCheck,
  Compass,
  Package,
  DollarSign,
  ArrowRight,
  Search,
  Building
} from 'lucide-react'

// Common Kenya & East Africa official destination suggestions for autocomplete fallback
const POPULAR_DESTINATIONS = [
  'Nairobi HQ - Upper Hill, Nairobi',
  'JKIA Airport - Terminal 1A, Nairobi',
  'Kiambu Level 5 Hospital, Kiambu',
  'Thika Sub-Branch & Medical Depot, Thika',
  'Eldoret Regional Innovation Hub, Eldoret',
  'Kisumu Lakefront Office & Logistics, Kisumu',
  'Mombasa Port Logistics & Warehouse, Mombasa',
  'Machakos County Field Office, Machakos',
  'Nakuru Agricultural Research Station, Nakuru',
  'Nyeri Central Referral Center, Nyeri',
  'Kigali Regional Office, Rwanda',
  'Kampala East Africa Operations Hub, Uganda'
]

export default function TransportRequestForm({ onSubmitSuccess, onNotify, initialData = {} }) {
  // Purpose & Metadata
  const [requestType, setRequestType] = useState(initialData.requestType || 'Official Travel')
  const [priority, setPriority] = useState(initialData.priority || 'NORMAL')
  const [purpose, setPurpose] = useState(initialData.purpose || '')
  const [department, setDepartment] = useState(initialData.department || 'Operations & Logistics')
  const [costCentre, setCostCentre] = useState(initialData.costCentre || 'CC-OPS-101 (General Operations)')
  const [projectGrantCode, setProjectGrantCode] = useState(initialData.projectGrantCode || '')

  // Origin & Destination with Places Autocomplete support
  const [origin, setOrigin] = useState(initialData.origin || 'StaffRoom Corporate HQ - Upper Hill')
  const [primaryDestination, setPrimaryDestination] = useState(initialData.primaryDestination || '')
  const [destinationCounty, setDestinationCounty] = useState(initialData.destinationCounty || 'Nairobi')
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)

  // Multiple Intermediate Stops
  const [intermediateStops, setIntermediateStops] = useState(
    initialData.intermediateStops || [
      { id: 1, locationName: '', county: 'Kiambu', expectedWaitMins: 30 }
    ]
  )

  // Dates & Times
  const [departureDate, setDepartureDate] = useState(initialData.departureDate || '')
  const [departureTime, setDepartureTime] = useState(initialData.departureTime || '08:00')
  const [returnDate, setReturnDate] = useState(initialData.returnDate || '')
  const [returnTime, setReturnTime] = useState(initialData.returnTime || '17:00')

  // Passenger List
  const [leadPassenger, setLeadPassenger] = useState(
    initialData.leadPassenger || {
      name: '',
      staffId: '',
      phone: '',
      email: ''
    }
  )
  const [additionalPassengers, setAdditionalPassengers] = useState(initialData.additionalPassengers || [])

  // Vehicle & Equipment Specs
  const [vehicleTypePreference, setVehicleTypePreference] = useState('4x4 SUV (Rough Terrain)')
  const [driverPreference, setDriverPreference] = useState('CHAUFFEUR_REQUIRED')
  const [cargoLuggageDetails, setCargoLuggageDetails] = useState('')
  const [needsPerDiemAdvance, setNeedsPerDiemAdvance] = useState(true)

  // Form Validation Errors
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(null)

  // Google Places Autocomplete Ref
  const destInputRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    // Attach Google Places Autocomplete if Google Maps JS SDK is loaded on the page
    if (window.google && window.google.maps && window.google.maps.places && destInputRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(destInputRef.current, {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: ['ke', 'ug', 'rw', 'tz'] }
        })
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace()
          if (place && place.formatted_address) {
            setPrimaryDestination(place.formatted_address || place.name)
            // Attempt to extract county or administrative area
            const countyComp = place.address_components?.find(c =>
              c.types.includes('administrative_area_level_1') || c.types.includes('administrative_area_level_2')
            )
            if (countyComp) {
              setDestinationCounty(countyComp.long_name)
            }
          }
        })
      } catch (err) {
        console.warn('Google Places Autocomplete initialization notice:', err)
      }
    }
  }, [])

  // Filtered destination suggestions for manual fallback
  const filteredDestinations = POPULAR_DESTINATIONS.filter(item =>
    item.toLowerCase().includes(primaryDestination.toLowerCase())
  )

  // Handlers for Intermediate Stops
  const handleAddStop = () => {
    setIntermediateStops(prev => [
      ...prev,
      { id: Date.now(), locationName: '', county: destinationCounty || 'Nairobi', expectedWaitMins: 30 }
    ])
  }

  const handleRemoveStop = (id) => {
    setIntermediateStops(prev => prev.filter(s => s.id !== id))
  }

  const handleUpdateStop = (id, field, value) => {
    setIntermediateStops(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  // Handlers for Passengers
  const handleAddPassenger = () => {
    setAdditionalPassengers(prev => [
      ...prev,
      { id: Date.now(), name: '', staffId: '', department: 'Field Team', specialNeeds: '' }
    ])
  }

  const handleRemovePassenger = (id) => {
    setAdditionalPassengers(prev => prev.filter(p => p.id !== id))
  }

  const handleUpdatePassenger = (id, field, value) => {
    setAdditionalPassengers(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  // Validation Logic
  const validateForm = () => {
    const newErrors = {}
    if (!purpose.trim()) {
      newErrors.purpose = 'Official travel purpose and justification is required.'
    }
    if (!primaryDestination.trim()) {
      newErrors.primaryDestination = 'Primary destination address is required.'
    }
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required.'
    }
    if (!leadPassenger.name.trim()) {
      newErrors.leadPassengerName = 'Lead passenger full name is required.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccessMsg(null)

    if (!validateForm()) {
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const payload = {
      id: `TRV-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType,
      priority,
      purpose,
      department,
      costCentre,
      projectGrantCode: projectGrantCode || 'Internal Operational Budget',
      route: {
        origin,
        primaryDestination,
        destinationCounty,
        intermediateStops: intermediateStops.filter(s => s.locationName.trim() !== '')
      },
      schedule: {
        departureDate,
        departureTime,
        returnDate: returnDate || departureDate,
        returnTime
      },
      passengers: {
        lead: leadPassenger,
        additional: additionalPassengers.filter(p => p.name.trim() !== '')
      },
      vehicleAndEquipment: {
        typePreference: vehicleTypePreference,
        driverPreference,
        cargoLuggageDetails,
        needsPerDiemAdvance
      },
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccessMsg(`Transport Request ${payload.id} successfully created and submitted for approval!`)
      if (onNotify) {
        onNotify(`Transport Request ${payload.id} submitted for ${leadPassenger.name}!`)
      }
      if (onSubmitSuccess) {
        onSubmitSuccess(payload)
      }
    }, 600)
  }

  const totalPassengersCount = 1 + additionalPassengers.filter(p => p.name.trim() !== '').length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-[11px] font-bold">
              <Briefcase size={13} className="text-amber-400" /> Official Transport & Site Visit Requisition
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Car size={20} className="text-indigo-400" />
              Official Transport Request Form
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Submit travel requisitions for official duty journeys, county field site visits, multi-stop missions, and inter-branch trips with Google Places autocomplete integration.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-right font-mono text-xs shrink-0">
            <span className="text-slate-400 text-[10px] block">Passengers Manifest</span>
            <strong className="text-base text-amber-300">{totalPassengersCount} Person(s)</strong>
          </div>
        </div>
      </div>

      {/* Validation Error Alert Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-mono space-y-1">
          <strong className="font-bold flex items-center gap-1.5 text-sm">
            <AlertCircle size={16} /> Form Validation Issues
          </strong>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Notification */}
      {submitSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold">{submitSuccessMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 text-xs">
        {/* SECTION 1: TRAVEL CATEGORY & PURPOSE */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
            1. Travel Category & Official Purpose
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Travel Type *</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="Official Travel">Official Travel (Out of Station)</option>
                <option value="Site Visit">Site Visit / Field Inspection</option>
                <option value="Inter-Branch">Inter-Branch Official Transfer</option>
                <option value="Client Meeting">Client / Partner Meeting</option>
                <option value="Airport Transfer">Airport Shuttle / Transfer</option>
                <option value="Emergency Response">Emergency / Critical Field Deployment</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="NORMAL">NORMAL (3+ Days Notice)</option>
                <option value="HIGH">HIGH (Urgent Official Assignment)</option>
                <option value="URGENT_EMERGENCY">URGENT EMERGENCY (Immediate Dispatch)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="Operations & Logistics">Operations & Logistics</option>
                <option value="Medical & Clinical Operations">Medical & Clinical Operations</option>
                <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                <option value="Finance & Compliance">Finance & Compliance</option>
                <option value="Executive Management">Executive Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Purpose & Travel Justification *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Provide clear justification e.g., 'Kiambu & Murang’a Regional Health Audits & Vaccine Cold-Chain Inspection.'"
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value)
                if (errors.purpose) setErrors(prev => ({ ...prev, purpose: null }))
              }}
              className={`w-full p-3 rounded-xl border ${
                errors.purpose ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white`}
            />
            {errors.purpose && <p className="text-rose-500 text-[11px] mt-0.5">{errors.purpose}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cost Centre Code</label>
              <input
                type="text"
                value={costCentre}
                onChange={(e) => setCostCentre(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Donor Grant / Project Code</label>
              <input
                type="text"
                placeholder="e.g. GRANT-USAID-2026 or EU-GREEN-772"
                value={projectGrantCode}
                onChange={(e) => setProjectGrantCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: GOOGLE PLACES DESTINATION & MULTIPLE STOPS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
              2. Origin, Primary Destination & Multi-Stop Waypoints
            </h4>
            <button
              type="button"
              onClick={handleAddStop}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] hover:bg-indigo-100 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Intermediate Stop
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Origin / Departure Location *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>

            <div className="relative">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Destination (Google Places Autocomplete) *
              </label>
              <div className="relative">
                <input
                  ref={destInputRef}
                  type="text"
                  required
                  placeholder="Type address, hospital, or city..."
                  value={primaryDestination}
                  onFocus={() => setShowDestSuggestions(true)}
                  onChange={(e) => {
                    setPrimaryDestination(e.target.value)
                    if (errors.primaryDestination) setErrors(prev => ({ ...prev, primaryDestination: null }))
                  }}
                  className={`w-full p-2.5 pl-8 rounded-xl border ${
                    errors.primaryDestination ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-800 font-bold`}
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Autocomplete Suggestions Dropdown Fallback */}
              {showDestSuggestions && primaryDestination.length > 0 && filteredDestinations.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto font-mono text-xs">
                  {filteredDestinations.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrimaryDestination(item)
                        setShowDestSuggestions(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 last:border-none"
                    >
                      <MapPin size={12} className="text-indigo-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              )}
              {errors.primaryDestination && <p className="text-rose-500 text-[11px] mt-0.5">{errors.primaryDestination}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination County / Country</label>
              <input
                type="text"
                placeholder="Kiambu County"
                value={destinationCounty}
                onChange={(e) => setDestinationCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Multiple Intermediate Stops */}
          {intermediateStops.length > 0 && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">
                Intermediate Waypoint Stops ({intermediateStops.length}):
              </span>

              {intermediateStops.map((stop, index) => (
                <div key={stop.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <span className="sm:col-span-1 font-mono text-[10px] font-bold text-slate-400">Stop #{index + 1}</span>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Stop Location Name (e.g. Ruiru Sub-County Hospital)"
                      value={stop.locationName}
                      onChange={(e) => handleUpdateStop(stop.id, 'locationName', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="County / Area"
                      value={stop.county}
                      onChange={(e) => handleUpdateStop(stop.id, 'county', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Wait Mins"
                      value={stop.expectedWaitMins}
                      onChange={(e) => handleUpdateStop(stop.id, 'expectedWaitMins', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl cursor-pointer"
                      title="Remove Stop"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: DATE & TIME FIELDS */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
            3. Date & Time Schedule
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Departure Date *</label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value)
                  if (errors.departureDate) setErrors(prev => ({ ...prev, departureDate: null }))
                }}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.departureDate ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-800 font-bold`}
              />
              {errors.departureDate && <p className="text-rose-500 text-[10px] mt-0.5">{errors.departureDate}</p>}
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Departure Time *</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Return Time</label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PASSENGERS LIST */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
              4. Lead Passenger & Passenger List Manifest
            </h4>
            <button
              type="button"
              onClick={handleAddPassenger}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] hover:bg-indigo-100 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Co-Passenger
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lead Passenger Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Jane Muthoni"
                value={leadPassenger.name}
                onChange={(e) => {
                  setLeadPassenger({ ...leadPassenger, name: e.target.value })
                  if (errors.leadPassengerName) setErrors(prev => ({ ...prev, leadPassengerName: null }))
                }}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.leadPassengerName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-800 font-bold`}
              />
              {errors.leadPassengerName && <p className="text-rose-500 text-[10px] mt-0.5">{errors.leadPassengerName}</p>}
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff ID</label>
              <input
                type="text"
                placeholder="EMP-101"
                value={leadPassenger.staffId}
                onChange={(e) => setLeadPassenger({ ...leadPassenger, staffId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Mobile Phone</label>
              <input
                type="text"
                placeholder="+254 712 345 678"
                value={leadPassenger.phone}
                onChange={(e) => setLeadPassenger({ ...leadPassenger, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Additional Passengers List */}
          {additionalPassengers.length > 0 && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">
                Additional Co-Passengers Manifest ({additionalPassengers.length}):
              </span>

              {additionalPassengers.map((pass, index) => (
                <div key={pass.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <span className="sm:col-span-1 font-mono text-[10px] font-bold text-slate-400">P #{index + 2}</span>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Passenger Name"
                      value={pass.name}
                      onChange={(e) => handleUpdatePassenger(pass.id, 'name', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Staff ID"
                      value={pass.staffId}
                      onChange={(e) => handleUpdatePassenger(pass.id, 'staffId', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Department"
                      value={pass.department}
                      onChange={(e) => handleUpdatePassenger(pass.id, 'department', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(pass.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: VEHICLE PREFERENCE & CARGO */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Package size={16} className="text-indigo-600 dark:text-indigo-400" />
            5. Vehicle Class & Cargo/Equipment Specifications
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Vehicle Class</label>
              <select
                value={vehicleTypePreference}
                onChange={(e) => setVehicleTypePreference(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="4x4 SUV (Rough Terrain)">4x4 SUV (Rough Terrain / Field Sites)</option>
                <option value="Executive Sedan">Executive Sedan (Corporate / Urban Meetings)</option>
                <option value="14-Seater Shuttle Van">14-Seater Executive Shuttle Van</option>
                <option value="33-Seater Express Bus">33-Seater Staff Express Bus</option>
                <option value="Double Cabin Pickup / Cargo">Double Cabin Pickup / Heavy Cargo</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Driver Allocation Preference</label>
              <select
                value={driverPreference}
                onChange={(e) => setDriverPreference(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="CHAUFFEUR_REQUIRED">Designated Fleet Chauffeur Required</option>
                <option value="SELF_DRIVE_APPROVED">Approved Self-Drive (Staff Authorization Active)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo & Equipment Notes</label>
            <input
              type="text"
              placeholder="e.g. Carrying 2 cold-chain storage boxes and 1 portable generator kit."
              value={cargoLuggageDetails}
              onChange={(e) => setCargoLuggageDetails(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="perDiemCheckDirect"
              checked={needsPerDiemAdvance}
              onChange={(e) => setNeedsPerDiemAdvance(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="perDiemCheckDirect" className="font-bold text-slate-800 dark:text-slate-200 text-xs cursor-pointer">
              Auto-calculate Per Diem & Travel Advance Workflow for this Requisition
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Automatic approval chain dispatch to Supervisor & Transport Fleet Manager.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Request...</span>
            ) : (
              <>
                <Send size={16} /> Submit Transport Requisition
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
