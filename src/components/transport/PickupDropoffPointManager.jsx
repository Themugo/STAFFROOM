import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  MapPin,
  Building,
  Plus,
  Search,
  CheckCircle2,
  Navigation,
  Sparkles,
  Users,
  ShieldCheck,
  Building2,
  Compass,
  Check,
  X
} from 'lucide-react'

export const SAMPLE_PICKUP_POINTS = [
  {
    id: 'PKP-101',
    name: 'Westlands Mall Bus Stage',
    category: 'Shopping Centre / Bus Stop',
    gpsCoordinates: '-1.2683, 36.8111',
    googlePlaceId: 'ChIJX_122gXLxgR810Jp',
    maxCapacity: 50,
    waitingArea: 'Sheltered Bus Stop with CCTV',
    assignedCount: 18,
    status: 'ACTIVE',
    zone: 'West Route',
    notes: 'Primary pickup hub for Westlands & Parklands staff.'
  },
  {
    id: 'PKP-102',
    name: 'Yaya Centre Main Stage',
    category: 'Shopping Centre',
    gpsCoordinates: '-1.2921, 36.7822',
    googlePlaceId: 'ChIJ_2833gXLxgR729Jp',
    maxCapacity: 35,
    waitingArea: 'Covered Canopy Waiting Area',
    assignedCount: 14,
    status: 'ACTIVE',
    zone: 'West Route',
    notes: 'Kilimani & Hurlingham shuttle stop.'
  },
  {
    id: 'PKP-103',
    name: 'TRM Mall Bus Bay (Thika Road)',
    category: 'Landmark / Shopping Mall',
    gpsCoordinates: '-1.2188, 36.8820',
    googlePlaceId: 'ChIJ44_1a_gXLxgR_mJp2b',
    maxCapacity: 60,
    waitingArea: 'Dedicated Express Loading Bay',
    assignedCount: 28,
    status: 'ACTIVE',
    zone: 'North Route',
    notes: 'Roysambu & Kasarani commuter pickup hub.'
  },
  {
    id: 'PKP-104',
    name: 'South B Shopping Center Stage',
    category: 'Estate Landmark Stage',
    gpsCoordinates: '-1.3102, 36.8390',
    googlePlaceId: 'ChIJz3c11XgXLxgR_pK31c',
    maxCapacity: 30,
    waitingArea: 'Designated Security Bay',
    assignedCount: 12,
    status: 'ACTIVE',
    zone: 'South Route',
    notes: 'South B & Bellevue staff pickup node.'
  }
]

export const SAMPLE_DROPOFF_POINTS = [
  {
    id: 'DRP-001',
    name: 'StaffRoom Corporate HQ - Upper Hill',
    type: 'Headquarters Building',
    gpsCoordinates: '-1.286389, 36.817223',
    capacity: 250,
    dropZoneType: 'Underground Bus Bay 2',
    status: 'ACTIVE'
  },
  {
    id: 'DRP-002',
    name: 'Thika Industrial Plant & Factory',
    type: 'Factory Plant',
    gpsCoordinates: '-1.0332, 37.0691',
    capacity: 180,
    dropZoneType: 'Gate 4 Industrial Bay',
    status: 'ACTIVE'
  },
  {
    id: 'DRP-003',
    name: 'Kiambu Level 5 Hospital Annex',
    type: 'Hospital Facility',
    gpsCoordinates: '-1.1712, 36.8322',
    capacity: 120,
    dropZoneType: 'Emergency Ward Drop-off Zone',
    status: 'ACTIVE'
  },
  {
    id: 'DRP-004',
    name: 'Jomo Kenyatta Campus Center',
    type: 'University Campus',
    gpsCoordinates: '-1.0922, 37.0122',
    capacity: 200,
    dropZoneType: 'Main Administration Plaza',
    status: 'ACTIVE'
  }
]

export default function PickupDropoffPointManager({ onNotify }) {
  const toast = useToast()
  const [pickups, setPickups] = useState(SAMPLE_PICKUP_POINTS)
  const [dropoffs, setDropoffs] = useState(SAMPLE_DROPOFF_POINTS)
  const [activeTab, setActiveTab] = useState('PICKUPS')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newPoint, setNewPoint] = useState({
    name: '',
    category: 'Bus Stop / Landmark',
    gpsCoordinates: '-1.2863, 36.8172',
    maxCapacity: 30,
    waitingArea: 'Sheltered Stage',
    zone: 'West Route',
    notes: ''
  })

  const handleAddPointSubmit = (e) => {
    e.preventDefault()
    if (!newPoint.name) {
      toast.error('Point name is required.')
      return
    }

    if (activeTab === 'PICKUPS') {
      const created = {
        id: `PKP-${Math.floor(100 + Math.random() * 900)}`,
        ...newPoint,
        googlePlaceId: `ChIJ_${Math.random().toString(36).substring(7)}`,
        assignedCount: 0,
        status: 'ACTIVE'
      }
      setPickups(prev => [created, ...prev])
      if (onNotify) onNotify(`Pickup point "${created.name}" created!`)
    } else {
      const created = {
        id: `DRP-${Math.floor(100 + Math.random() * 900)}`,
        name: newPoint.name,
        type: newPoint.category,
        gpsCoordinates: newPoint.gpsCoordinates,
        capacity: Number(newPoint.maxCapacity),
        dropZoneType: newPoint.waitingArea,
        status: 'ACTIVE'
      }
      setDropoffs(prev => [created, ...prev])
      if (onNotify) onNotify(`Drop-off facility "${created.name}" created!`)
    }

    setIsAddModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold mb-1">
              <MapPin size={13} /> Google Maps Platform Geographic Point Manager
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Commuter Pickup Points & Drop-Off Facility Destinations
            </h3>
            <p className="text-xs text-slate-500">
              Configure designated bus stops, company pickup hubs, landmarks, and corporate drop-off facilities. Integrates Google Place IDs and Distance Matrix routing.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
          >
            <Plus size={16} /> Add {activeTab === 'PICKUPS' ? 'Pickup Point' : 'Drop-off Destination'}
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('PICKUPS')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PICKUPS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <MapPin size={15} /> Designated Pickup Points ({pickups.length})
          </button>
          <button
            onClick={() => setActiveTab('DROPOFFS')}
            className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'DROPOFFS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 size={15} /> Corporate Drop-off Facilities ({dropoffs.length})
          </button>
        </div>
      </div>

      {/* PICKUPS TAB */}
      {activeTab === 'PICKUPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {p.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    {p.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{p.category} • Zone: <strong className="text-indigo-600 dark:text-indigo-400">{p.zone}</strong></p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS Coordinates:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{p.gpsCoordinates}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waiting Area Type:</span>
                  <span className="text-slate-800 dark:text-slate-200">{p.waitingArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Occupancy Capacity:</span>
                  <strong className="text-blue-600 dark:text-blue-400">{p.assignedCount} / {p.maxCapacity} Staff</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">{p.notes}</p>
            </div>
          ))}
        </div>
      )}

      {/* DROPOFFS TAB */}
      {activeTab === 'DROPOFFS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dropoffs.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {d.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    {d.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{d.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{d.type}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS Location:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{d.gpsCoordinates}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drop Zone:</span>
                  <span className="text-slate-800 dark:text-slate-200">{d.dropZoneType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Facility Capacity:</span>
                  <strong className="text-indigo-600 dark:text-indigo-400">{d.capacity} Passengers / hr</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD POINT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              Add {activeTab === 'PICKUPS' ? 'New Commuter Pickup Point' : 'New Drop-Off Facility'}
            </h3>

            <form onSubmit={handleAddPointSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Point Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westlands Mall Bus Stage"
                  value={newPoint.name}
                  onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category / Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Shopping Mall Stage"
                    value={newPoint.category}
                    onChange={(e) => setNewPoint({ ...newPoint, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min={5}
                    value={newPoint.maxCapacity}
                    onChange={(e) => setNewPoint({ ...newPoint, maxCapacity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GPS Coordinates</label>
                <input
                  type="text"
                  placeholder="-1.2683, 36.8111"
                  value={newPoint.gpsCoordinates}
                  onChange={(e) => setNewPoint({ ...newPoint, gpsCoordinates: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Waiting Area Description</label>
                <input
                  type="text"
                  placeholder="e.g. Sheltered bus stop with security canopy"
                  value={newPoint.waitingArea}
                  onChange={(e) => setNewPoint({ ...newPoint, waitingArea: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
