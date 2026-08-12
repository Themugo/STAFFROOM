import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Bus,
  Car,
  Fuel,
  Wrench,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react'

export const INITIAL_POOL_VEHICLES = [
  {
    id: 'POOL-BUS-01',
    plate: 'KCB 412A',
    model: 'Toyota Coaster 33-Seater',
    category: 'Bus',
    capacity: 33,
    fuelLevel: 85,
    status: 'IN_SERVICE',
    cleaningStatus: 'CLEAN',
    maintenanceStatus: 'HEALTHY',
    lastServiceDate: '2026-07-15',
    insuranceExpiry: '2027-03-31',
    assignedDriver: 'Joseph Mwangi',
    mileageKm: 42350
  },
  {
    id: 'POOL-VAN-02',
    plate: 'KDD 891B',
    model: 'Nissan NV350 14-Seater Executive Van',
    category: 'Van',
    capacity: 14,
    fuelLevel: 92,
    status: 'AVAILABLE',
    cleaningStatus: 'CLEAN',
    maintenanceStatus: 'HEALTHY',
    lastServiceDate: '2026-06-20',
    insuranceExpiry: '2027-01-15',
    assignedDriver: 'Amina Hassan',
    mileageKm: 28100
  },
  {
    id: 'POOL-SUV-03',
    plate: 'KCG 302D',
    model: 'Toyota Land Cruiser Prado 4x4',
    category: 'SUV 4x4',
    capacity: 7,
    fuelLevel: 78,
    status: 'AVAILABLE',
    cleaningStatus: 'CLEAN',
    maintenanceStatus: 'HEALTHY',
    lastServiceDate: '2026-07-02',
    insuranceExpiry: '2026-11-30',
    assignedDriver: 'Peter Ochieng',
    mileageKm: 51200
  },
  {
    id: 'POOL-SEDAN-04',
    plate: 'KDF 555E',
    model: 'Mercedes-Benz E-Class Executive Sedan',
    category: 'Executive Sedan',
    capacity: 4,
    fuelLevel: 95,
    status: 'AVAILABLE',
    cleaningStatus: 'CLEAN',
    maintenanceStatus: 'HEALTHY',
    lastServiceDate: '2026-07-25',
    insuranceExpiry: '2027-05-10',
    assignedDriver: 'David Otieno',
    mileageKm: 18400
  },
  {
    id: 'POOL-PICKUP-05',
    plate: 'KCK 701F',
    model: 'Isuzu D-Max Double Cab 4x4',
    category: 'Pickup Utility',
    capacity: 5,
    fuelLevel: 62,
    status: 'MAINTENANCE',
    cleaningStatus: 'NEEDS_CLEANING',
    maintenanceStatus: 'IN_SERVICE_BAY',
    lastServiceDate: '2026-07-31',
    insuranceExpiry: '2026-12-01',
    assignedDriver: 'Francis Njoroge',
    mileageKm: 68900
  }
]

export default function PoolVehicleManager({ onNotify }) {
  const toast = useToast()
  const [vehicles, setVehicles] = useState(INITIAL_POOL_VEHICLES)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    model: '',
    category: 'Van',
    capacity: 14,
    fuelLevel: 100,
    assignedDriver: 'Joseph Mwangi'
  })

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault()
    if (!newVehicle.plate || !newVehicle.model) {
      toast.error('Plate and model are required.')
      return
    }

    const created = {
      id: `POOL-VEH-${Math.floor(100 + Math.random() * 900)}`,
      ...newVehicle,
      status: 'AVAILABLE',
      cleaningStatus: 'CLEAN',
      maintenanceStatus: 'HEALTHY',
      lastServiceDate: new Date().toISOString().split('T')[0],
      insuranceExpiry: '2027-08-01',
      mileageKm: 1000
    }

    setVehicles(prev => [created, ...prev])
    if (onNotify) onNotify(`Vehicle ${created.plate} (${created.model}) added to pool inventory!`)
    setIsAddModalOpen(false)
    setNewVehicle({
      plate: '',
      model: '',
      category: 'Van',
      capacity: 14,
      fuelLevel: 100,
      assignedDriver: 'Joseph Mwangi'
    })
  }

  const toggleVehicleMaintenance = (vehId) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehId
          ? {
              ...v,
              status: v.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE',
              maintenanceStatus: v.status === 'MAINTENANCE' ? 'HEALTHY' : 'IN_SERVICE_BAY'
            }
          : v
      )
    )
    if (onNotify) onNotify(`Vehicle ${vehId} maintenance status updated.`)
  }

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || v.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bus size={20} className="text-indigo-600 dark:text-indigo-400" />
            Pool Vehicle Inventory & Fleet Maintenance Register
          </h3>
          <p className="text-xs text-slate-500">
            Real-time readiness, fuel levels, cleaning status, and maintenance bay schedules across company pool assets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
        >
          <Plus size={16} /> Register Pool Vehicle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            placeholder="Search plate number or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-slate-400 font-bold shrink-0">Category:</span>
          {['ALL', 'Bus', 'Van', 'SUV 4x4', 'Executive Sedan', 'Pickup Utility'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs block">
                  {v.plate}
                </span>
                <strong className="text-sm text-slate-900 dark:text-white block">{v.model}</strong>
                <span className="text-[11px] text-slate-500">{v.category} • {v.capacity} Passengers</span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                v.status === 'AVAILABLE'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : v.status === 'IN_SERVICE'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {v.status.replace('_', ' ')}
              </span>
            </div>

            {/* Fuel & Maintenance Metrics */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Fuel size={13} className="text-amber-500" /> Fuel Level:
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{v.fuelLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${v.fuelLevel > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${v.fuelLevel}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Driver: <strong className="text-slate-800 dark:text-slate-200">{v.assignedDriver}</strong></span>
                <span>{v.mileageKm.toLocaleString()} km</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => toggleVehicleMaintenance(v.id)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Wrench size={13} /> Toggle Service Bay Mode
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD VEHICLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bus size={18} className="text-indigo-600 dark:text-indigo-400" />
              Register New Pool Vehicle
            </h3>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KDL 123G"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Make & Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota HiAce 14-Seater"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {['Bus', 'Van', 'SUV 4x4', 'Executive Sedan', 'Pickup Utility'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
