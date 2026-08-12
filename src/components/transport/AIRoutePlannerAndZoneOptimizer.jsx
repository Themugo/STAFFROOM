import React, { useState } from 'react'
import {
  Sparkles,
  Route,
  Zap,
  MapPin,
  Clock,
  Fuel,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  Activity,
  Sliders,
  Send,
  Navigation
} from 'lucide-react'

export const OPTIMIZED_ROUTES = [
  {
    id: 'ROUTE-WEST-01',
    name: 'Westlands - Lavington - HQ Route',
    zone: 'West Route',
    shift: 'Morning Shift',
    distanceKm: 18.4,
    travelTimeMins: 32,
    assignedVehicle: 'KCB 412A - Enterprise Express Bus (33-Seater)',
    occupancy: '28 / 33 Passengers (84.8% Occupancy)',
    estimatedFuelLiters: 4.6,
    estimatedCostKsh: 920,
    co2EmissionsKg: 10.8,
    pickupSequence: [
      '1. Kitisuru Shopping Stage (06:45 AM)',
      '2. Lavington Green Mall Stage (06:55 AM)',
      '3. Westlands Mall Bus Stage (07:08 AM)',
      '4. Upper Hill Corporate HQ (Arrival 07:22 AM)'
    ],
    status: 'OPTIMIZED',
    savingsPercentage: '14.2% Fuel Reduced'
  },
  {
    id: 'ROUTE-EAST-02',
    name: 'Kilimani - Kileleshwa - HQ Route',
    zone: 'West Route',
    shift: 'Morning Shift',
    distanceKm: 14.1,
    travelTimeMins: 24,
    assignedVehicle: 'KDD 891B - Executive Shuttle Van (14-Seater)',
    occupancy: '12 / 14 Passengers (85.7% Occupancy)',
    estimatedFuelLiters: 2.8,
    estimatedCostKsh: 560,
    co2EmissionsKg: 6.5,
    pickupSequence: [
      '1. Yaya Centre Main Stage (07:00 AM)',
      '2. Kileleshwa Kasuku Centre (07:10 AM)',
      '3. Upper Hill Corporate HQ (Arrival 07:24 AM)'
    ],
    status: 'OPTIMIZED',
    savingsPercentage: '18.5% Fuel Reduced'
  },
  {
    id: 'ROUTE-NORTH-03',
    name: 'Thika Highway - Roysambu Express Route',
    zone: 'North Route',
    shift: 'Morning Shift',
    distanceKm: 26.8,
    travelTimeMins: 45,
    assignedVehicle: 'KCT 302D - Express Shuttle Bus (33-Seater)',
    occupancy: '31 / 33 Passengers (93.9% Occupancy)',
    estimatedFuelLiters: 6.7,
    estimatedCostKsh: 1340,
    co2EmissionsKg: 15.7,
    pickupSequence: [
      '1. TRM Mall Bus Bay (06:30 AM)',
      '2. Ruaraka Flyover Stage (06:42 AM)',
      '3. Muthaiga Express Interchange (06:58 AM)',
      '4. Upper Hill Corporate HQ (Arrival 07:20 AM)'
    ],
    status: 'OPTIMIZED',
    savingsPercentage: '21.0% Distance Reduced'
  }
]

export default function AIRoutePlannerAndZoneOptimizer({ onNotify }) {
  const [routes, setRoutes] = useState(OPTIMIZED_ROUTES)
  const [selectedShift, setSelectedShift] = useState('Morning Shift')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationSummary, setOptimizationSummary] = useState({
    totalKm: 59.3,
    fuelSavedLiters: 12.4,
    costSavedKsh: 2480,
    co2ReducedKg: 29.1
  })

  const handleRunAIOptimizer = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      const updated = routes.map(r => ({
        ...r,
        distanceKm: Number((r.distanceKm * 0.94).toFixed(1)),
        travelTimeMins: Math.max(18, r.travelTimeMins - 3),
        estimatedFuelLiters: Number((r.estimatedFuelLiters * 0.92).toFixed(1)),
        estimatedCostKsh: Math.round(r.estimatedCostKsh * 0.92),
        savingsPercentage: '24.5% Peak Efficiency Achieved'
      }))
      setRoutes(updated)
      setOptimizationSummary({
        totalKm: 54.8,
        fuelSavedLiters: 18.2,
        costSavedKsh: 3640,
        co2ReducedKg: 42.8
      })
      if (onNotify) onNotify('AI Route Clustering & Traffic Optimization Engine updated all routes!')
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900 text-indigo-200 border border-indigo-700 font-mono text-[11px] font-bold">
              <Sparkles size={14} className="text-amber-400" /> Google Maps Directions & Routes Clustering AI
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Route size={20} className="text-indigo-400" />
              Intelligent Route Planner & Transport Zone Optimizer
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Clusters employee residences into optimal zones (West, East, North, South, CBD), minimizes travel distance, prevents empty seating, and bypasses live traffic jams using Google Maps Platform APIs.
            </p>
          </div>

          <button
            onClick={handleRunAIOptimizer}
            disabled={isOptimizing}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center gap-2 shrink-0 transition-all"
          >
            <Zap size={16} className={isOptimizing ? 'animate-spin text-amber-300' : 'text-amber-300'} />
            {isOptimizing ? 'Recalculating Google Directions...' : 'Run AI Route Optimization'}
          </button>
        </div>

        {/* Impact Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Total Optimized Distance</span>
            <strong className="text-base text-white">{optimizationSummary.totalKm} km</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Monthly Fuel Saved</span>
            <strong className="text-base text-emerald-400">{optimizationSummary.fuelSavedLiters} L</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Estimated Cost Reduction</span>
            <strong className="text-base text-amber-300">KSh {optimizationSummary.costSavedKsh.toLocaleString()}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Carbon Emissions Saved</span>
            <strong className="text-base text-teal-300">{optimizationSummary.co2ReducedKg} kg CO2</strong>
          </div>
        </div>
      </div>

      {/* Shift Selector */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
        <span className="text-slate-400 shrink-0">Filter Shift Route:</span>
        {['Morning Shift', 'Afternoon Shift', 'Night Shift', 'Weekend Shift'].map((sh) => (
          <button
            key={sh}
            onClick={() => setSelectedShift(sh)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedShift === sh
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {sh}
          </button>
        ))}
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {routes.map((rt) => (
          <div
            key={rt.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                    {rt.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    {rt.savingsPercentage}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{rt.name}</h4>
                <p className="text-xs text-slate-500 font-mono">Assigned Vehicle: {rt.assignedVehicle}</p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-right">
                <div>
                  <span className="text-slate-400 text-[10px] block">Trip Distance</span>
                  <strong className="text-slate-900 dark:text-white">{rt.distanceKm} km</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">EST Travel Time</span>
                  <strong className="text-indigo-600 dark:text-indigo-400">{rt.travelTimeMins} mins</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Fuel & Cost</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{rt.estimatedFuelLiters} L (KSh {rt.estimatedCostKsh})</strong>
                </div>
              </div>
            </div>

            {/* Sequence */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
                <Navigation size={14} className="text-indigo-600 dark:text-indigo-400" />
                Optimized Pickup Order Sequence:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {rt.pickupSequence.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
