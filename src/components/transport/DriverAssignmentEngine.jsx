import React, { useState } from 'react'
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Award,
  Phone,
  Calendar,
  Search,
  Filter,
  UserCheck
} from 'lucide-react'

export const INITIAL_DRIVERS = [
  {
    id: 'DRV-101',
    name: 'Joseph Mwangi',
    phone: '+254 712 345 678',
    licenseClass: 'Heavy PSV Class A/B/C',
    experienceYears: 11,
    performanceRating: 4.9,
    hoursDrivenToday: 3.5,
    restCompliance: 'COMPLIANT',
    assignedVehicle: 'KCB 412A (33-Seater Bus)',
    status: 'ACTIVE_TRIP'
  },
  {
    id: 'DRV-102',
    name: 'Amina Hassan',
    phone: '+254 722 987 654',
    licenseClass: 'Executive Shuttle PSV Class B',
    experienceYears: 8,
    performanceRating: 4.8,
    hoursDrivenToday: 2.0,
    restCompliance: 'COMPLIANT',
    assignedVehicle: 'KDD 891B (14-Seater Van)',
    status: 'ACTIVE_TRIP'
  },
  {
    id: 'DRV-103',
    name: 'Peter Ochieng',
    phone: '+254 733 456 789',
    licenseClass: 'Offroad 4x4 & Heavy Commercial',
    experienceYears: 14,
    performanceRating: 5.0,
    hoursDrivenToday: 5.0,
    restCompliance: 'COMPLIANT',
    assignedVehicle: 'KCG 302D (Land Cruiser Prado)',
    status: 'STANDBY'
  },
  {
    id: 'DRV-104',
    name: 'David Otieno',
    phone: '+254 744 112 233',
    licenseClass: 'VIP Executive Sedan & Defensive Driving',
    experienceYears: 9,
    performanceRating: 4.95,
    hoursDrivenToday: 1.5,
    restCompliance: 'COMPLIANT',
    assignedVehicle: 'KDF 555E (Executive Mercedes)',
    status: 'STANDBY'
  },
  {
    id: 'DRV-105',
    name: 'Francis Njoroge',
    phone: '+254 755 334 455',
    licenseClass: 'Commercial Pickup & Heavy Van',
    experienceYears: 6,
    performanceRating: 4.7,
    hoursDrivenToday: 7.8,
    restCompliance: 'MANDATORY_REST_REQUIRED',
    assignedVehicle: 'KCK 701F (Pickup 4x4)',
    status: 'REST_PERIOD'
  }
]

export default function DriverAssignmentEngine({ onNotify }) {
  const [drivers] = useState(INITIAL_DRIVERS)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.licenseClass.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
            Driver Roster & Rest Period Compliance Roster
          </h3>
          <p className="text-xs text-slate-500">
            Monitor driver availability, license qualifications, safety ratings, and NTSA mandatory rest hours (&lt; 8 hrs daily driving cap).
          </p>
        </div>

        <div className="relative w-full sm:w-64 text-xs">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            placeholder="Search driver name or license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Driver Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {filtered.map((drv) => (
          <div
            key={drv.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                  {drv.id}
                </span>
                <strong className="text-sm text-slate-900 dark:text-white block">{drv.name}</strong>
                <span className="text-[11px] text-slate-500 font-medium">{drv.licenseClass}</span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                drv.status === 'ACTIVE_TRIP'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : drv.status === 'STANDBY'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {drv.status.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-amber-500 fill-amber-500" /> Rating:
                </span>
                <strong className="font-mono text-slate-900 dark:text-white">{drv.performanceRating} / 5.0</strong>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-indigo-500" /> Driving Hours Today:
                </span>
                <strong className="font-mono text-slate-900 dark:text-white">{drv.hoursDrivenToday} / 8.0 hrs</strong>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-[11px]">
                <span>Rest Compliance:</span>
                <span className={`font-bold ${
                  drv.restCompliance === 'COMPLIANT' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {drv.restCompliance}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Phone size={12} /> {drv.phone}
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{drv.experienceYears} Yrs Exp.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
