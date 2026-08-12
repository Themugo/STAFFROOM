import React, { useState } from 'react'
import {
  MapPin,
  Compass,
  Layers,
  Calendar,
  Users,
  Route,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Car,
  Search,
  Building,
  Navigation,
  Check
} from 'lucide-react'

export const KENYA_COUNTIES = [
  'Nairobi', 'Kiambu', 'Machakos', 'Nakuru', 'Mombasa', 'Kisumu', 'Uasin Gishu',
  'Kakamega', 'Nyeri', 'Kilifi', 'Kajiado', 'Meru', 'Murang’a', 'Bungoma', 'Turkana'
]

export const VISIT_TYPES = [
  { id: 'SITE_VISIT', label: 'Site Visit' },
  { id: 'COUNTY_VISIT', label: 'County Administrative Visit' },
  { id: 'HOSPITAL_VISIT', label: 'Hospital Audit / Support' },
  { id: 'SCHOOL_VISIT', label: 'School / Academic Program' },
  { id: 'BRANCH_VISIT', label: 'Branch / Sub-Office Audit' },
  { id: 'CUSTOMER_VISIT', label: 'Client / Merchant Onboarding' },
  { id: 'INSPECTION', label: 'Safety & Quality Inspection' }
]

export const SAMPLE_FIELD_VISITS = [
  {
    id: 'FVT-2026-001',
    title: 'Kiambu Hospital Medical Supply Inspection',
    visitType: 'HOSPITAL_VISIT',
    organizer: 'Dr. Lucy Wanjiru',
    department: 'Health Operations',
    date: '2026-08-05',
    passengers: 4,
    locationHierarchy: {
      county: 'Kiambu',
      subCounty: 'Thika West',
      ward: 'Township',
      town: 'Thika',
      estate: 'Level 5 Hospital Zone',
      gps: '-1.0332, 37.0691'
    },
    status: 'SCHEDULED',
    assignedRouteId: 'ROUTE-NORTH-04'
  },
  {
    id: 'FVT-2026-002',
    title: 'Nakuru Agriculture County Extension Audit',
    visitType: 'COUNTY_VISIT',
    organizer: 'Peter Mwangi',
    department: 'NGO Field Programs',
    date: '2026-08-06',
    passengers: 6,
    locationHierarchy: {
      county: 'Nakuru',
      subCounty: 'Naivasha',
      ward: 'Viwandani',
      town: 'Naivasha Town',
      estate: 'Lake Road Office',
      gps: '-0.7172, 36.4310'
    },
    status: 'OPTIMIZED',
    assignedRouteId: 'ROUTE-RIFT-01'
  },
  {
    id: 'FVT-2026-003',
    title: 'Machakos Sub-County Water Project Inspection',
    visitType: 'INSPECTION',
    organizer: 'Eng. Francis Mutua',
    department: 'Infrastructure',
    date: '2026-08-07',
    passengers: 3,
    locationHierarchy: {
      county: 'Machakos',
      subCounty: 'Athi River',
      ward: 'Mavoko',
      town: 'Mlolongo',
      estate: 'Syokimau Water Works',
      gps: '-1.3650, 36.9200'
    },
    status: 'PENDING_GROUPING',
    assignedRouteId: null
  }
]

export default function FieldVisitCountyPlanner({ onNotify }) {
  const [fieldVisits, setFieldVisits] = useState(SAMPLE_FIELD_VISITS)
  const [selectedCounty, setSelectedCounty] = useState('ALL')
  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false)

  const [newVisit, setNewVisit] = useState({
    title: '',
    visitType: 'SITE_VISIT',
    organizer: '',
    department: 'NGO Field Operations',
    date: '2026-08-10',
    passengers: 2,
    county: 'Nairobi',
    subCounty: 'Westlands',
    ward: 'Parklands',
    town: 'Nairobi',
    estate: 'Gigiri UN Avenue',
    gps: '-1.2321, 36.8122'
  })

  const handleGroupVisitsAI = () => {
    // Simulates AI route grouping for nearby field locations
    setFieldVisits(prev =>
      prev.map(v => ({
        ...v,
        status: 'OPTIMIZED',
        assignedRouteId: v.assignedRouteId || 'ROUTE-AI-OPTIMIZED'
      }))
    )
    if (onNotify) {
      onNotify('AI Route Grouping complete: 3 field visits grouped into 1 consolidated regional cluster trip!')
    }
  }

  const handleCreateVisitSubmit = (e) => {
    e.preventDefault()
    const created = {
      id: `FVT-2026-0${Math.floor(10 + Math.random() * 90)}`,
      title: newVisit.title,
      visitType: newVisit.visitType,
      organizer: newVisit.organizer || 'Operations Manager',
      department: newVisit.department,
      date: newVisit.date,
      passengers: Number(newVisit.passengers),
      locationHierarchy: {
        county: newVisit.county,
        subCounty: newVisit.subCounty,
        ward: newVisit.ward,
        town: newVisit.town,
        estate: newVisit.estate,
        gps: newVisit.gps
      },
      status: 'PENDING_GROUPING',
      assignedRouteId: null
    }

    setFieldVisits(prev => [created, ...prev])
    if (onNotify) onNotify(`Field visit "${created.title}" scheduled for ${created.locationHierarchy.county} County.`)
    setIsNewVisitModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold mb-1">
              <Compass size={13} /> Regional & County Field Operations Dispatch
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Field Visit Planning & Geographic Cluster Routing
            </h3>
            <p className="text-xs text-slate-500">
              Schedule county, branch, school, and hospital inspection visits down to Ward and GPS coordinates. AI automatically groups geographically contiguous visits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGroupVisitsAI}
              className="btn-secondary bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs cursor-pointer"
            >
              <Sparkles size={16} /> AI Group Nearby Visits
            </button>
            <button
              onClick={() => setIsNewVisitModalOpen(true)}
              className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
            >
              <Plus size={16} /> Schedule Field Visit
            </button>
          </div>
        </div>

        {/* Filter bar by County */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-2">
          <span className="font-mono text-slate-400 font-bold shrink-0">County Filter:</span>
          <button
            onClick={() => setSelectedCounty('ALL')}
            className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
              selectedCounty === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Counties
          </button>
          {KENYA_COUNTIES.slice(0, 8).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCounty(c)}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                selectedCounty === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Field Visit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fieldVisits
          .filter(f => selectedCounty === 'ALL' || f.locationHierarchy.county === selectedCounty)
          .map((visit) => (
            <div
              key={visit.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {visit.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    visit.status === 'OPTIMIZED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {visit.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {visit.title}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>Organizer: {visit.organizer}</span>
                  <span>•</span>
                  <span>{visit.passengers} Passengers</span>
                </div>
              </div>

              {/* Geographical Hierarchy Breakdown */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <strong className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Location Breakdown:
                </strong>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400">County:</span> <strong className="text-slate-900 dark:text-white">{visit.locationHierarchy.county}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Sub-County:</span> <strong className="text-slate-900 dark:text-white">{visit.locationHierarchy.subCounty}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Ward:</span> <strong className="text-slate-900 dark:text-white">{visit.locationHierarchy.ward}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Town:</span> <strong className="text-slate-900 dark:text-white">{visit.locationHierarchy.town}</strong>
                  </div>
                </div>
                <div className="pt-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <MapPin size={11} /> GPS Pin: {visit.locationHierarchy.gps}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Date: {visit.date}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {visit.assignedRouteId ? `Route: ${visit.assignedRouteId}` : 'Awaiting Grouping'}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* NEW VISIT MODAL */}
      {isNewVisitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass size={18} className="text-emerald-600 dark:text-emerald-400" />
              Schedule Regional Field / County Visit
            </h3>

            <form onSubmit={handleCreateVisitSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Visit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiambu County Health Audit"
                  value={newVisit.title}
                  onChange={(e) => setNewVisit({ ...newVisit, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Visit Type</label>
                  <select
                    value={newVisit.visitType}
                    onChange={(e) => setNewVisit({ ...newVisit, visitType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {VISIT_TYPES.map(vt => (
                      <option key={vt.id} value={vt.id}>{vt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newVisit.date}
                    onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">County *</label>
                  <select
                    value={newVisit.county}
                    onChange={(e) => setNewVisit({ ...newVisit, county: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sub-County</label>
                  <input
                    type="text"
                    placeholder="e.g. Thika West / Naivasha"
                    value={newVisit.subCounty}
                    onChange={(e) => setNewVisit({ ...newVisit, subCounty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ward</label>
                  <input
                    type="text"
                    value={newVisit.ward}
                    onChange={(e) => setNewVisit({ ...newVisit, ward: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Town</label>
                  <input
                    type="text"
                    value={newVisit.town}
                    onChange={(e) => setNewVisit({ ...newVisit, town: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Passengers</label>
                  <input
                    type="number"
                    min={1}
                    value={newVisit.passengers}
                    onChange={(e) => setNewVisit({ ...newVisit, passengers: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GPS Point / Coordinates</label>
                <input
                  type="text"
                  placeholder="e.g. -1.0332, 37.0691"
                  value={newVisit.gps}
                  onChange={(e) => setNewVisit({ ...newVisit, gps: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewVisitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  Confirm Field Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
