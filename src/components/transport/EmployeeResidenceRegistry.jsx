import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Home,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Lock,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Eye,
  EyeOff,
  User,
  Sparkles,
  Building,
  Check,
  X
} from 'lucide-react'

export const SAMPLE_RESIDENCES = [
  {
    id: 'RES-EMP-001',
    employeeId: 'EMP-101',
    employeeName: 'Dr. Jane Muthoni',
    department: 'Hospital Staff (Medical)',
    role: 'Senior Medical Officer',
    residenceName: 'Greenpark Estate Villa B4',
    apartmentNo: 'House B4',
    street: 'Kitisuru Road',
    estate: 'Kitisuru Estate',
    areaWard: 'Karura Ward',
    town: 'Nairobi',
    county: 'Nairobi',
    postalAddress: 'P.O. Box 40100 Nairobi',
    gpsCoordinates: '-1.2341, 36.7812',
    googlePlaceId: 'ChIJ5c_S52gXLxgR_pP3-M_1aAQ',
    preferredPickupPoint: 'Kitisuru Shopping Stage',
    alternativePickup: 'Westlands Mall Main Gate',
    emergencyContact: 'Dr. David Muthoni (+254 712 990 112)',
    accessLevel: 'CONFIDENTIAL_HR_ONLY',
    zone: 'West Route'
  },
  {
    id: 'RES-EMP-002',
    employeeId: 'EMP-102',
    employeeName: 'Amina Zainab',
    department: 'Finance & Accounting',
    role: 'Senior Accountant',
    residenceName: 'Kilimani Palms Heights',
    apartmentNo: 'Apt 5C',
    street: 'Argwings Kodhek Road',
    estate: 'Kilimani',
    areaWard: 'Kilimani Ward',
    town: 'Nairobi',
    county: 'Nairobi',
    postalAddress: 'P.O. Box 00100 Nairobi',
    gpsCoordinates: '-1.2911, 36.7891',
    googlePlaceId: 'ChIJxX21z1gXLxgR90Jp1a',
    preferredPickupPoint: 'Yaya Centre Bus Stop',
    alternativePickup: 'Adlife Plaza Junction',
    emergencyContact: 'Hassan Zainab (+254 722 443 322)',
    accessLevel: 'CONFIDENTIAL_HR_ONLY',
    zone: 'West Route'
  },
  {
    id: 'RES-EMP-003',
    employeeId: 'EMP-103',
    employeeName: 'Brian Omondi',
    department: 'Sales & Marketing',
    role: 'Regional Sales Rep',
    residenceName: 'Safari Park Estate House 12',
    apartmentNo: 'House 12',
    street: 'Thika Superhighway Exit 7',
    estate: 'Roysambu',
    areaWard: 'Ruaraka Ward',
    town: 'Nairobi',
    county: 'Nairobi',
    postalAddress: 'P.O. Box 00200 Nairobi',
    gpsCoordinates: '-1.2188, 36.8820',
    googlePlaceId: 'ChIJV4a1a_gXLxgR_mJp2b',
    preferredPickupPoint: 'Ruaraka Flyover Stage',
    alternativePickup: 'TRM Mall Bus Stop',
    emergencyContact: 'Mary Omondi (+254 733 881 122)',
    accessLevel: 'CONFIDENTIAL_HR_ONLY',
    zone: 'North Route'
  },
  {
    id: 'RES-EMP-004',
    employeeId: 'EMP-104',
    employeeName: 'Kevin Otieno',
    department: 'Engineering & IT',
    role: 'Lead Systems Architect',
    residenceName: 'South B Golden Gate Phase 2',
    apartmentNo: 'House 89',
    street: 'Mariakani Road',
    estate: 'South B',
    areaWard: 'Maji Mazuri Ward',
    town: 'Nairobi',
    county: 'Nairobi',
    postalAddress: 'P.O. Box 00500 Nairobi',
    gpsCoordinates: '-1.3102, 36.8390',
    googlePlaceId: 'ChIJz3c11XgXLxgR_pK31c',
    preferredPickupPoint: 'South B Shopping Center',
    alternativePickup: 'Bellevue Bus Stop',
    emergencyContact: 'Grace Otieno (+254 711 223 344)',
    accessLevel: 'CONFIDENTIAL_HR_ONLY',
    zone: 'South Route'
  }
]

export default function EmployeeResidenceRegistry({ onNotify }) {
  const toast = useToast()
  const [residences, setResidences] = useState(SAMPLE_RESIDENCES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL')
  const [showConfidentialDetails, setShowConfidentialDetails] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const [newResidence, setNewResidence] = useState({
    employeeId: '',
    employeeName: '',
    department: 'Corporate Office',
    role: 'Staff Member',
    residenceName: '',
    apartmentNo: '',
    street: '',
    estate: '',
    areaWard: '',
    town: 'Nairobi',
    county: 'Nairobi',
    postalAddress: '',
    gpsCoordinates: '-1.2863, 36.8172',
    preferredPickupPoint: 'Standard Zone Hub',
    alternativePickup: 'Highway Main Gate',
    emergencyContact: '',
    zone: 'West Route'
  })

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!newResidence.employeeName || !newResidence.residenceName) {
      toast.error('Employee Name and Residence Name are required.')
      return
    }

    const created = {
      id: `RES-EMP-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: newResidence.employeeId || `EMP-${Math.floor(200 + Math.random() * 800)}`,
      ...newResidence,
      googlePlaceId: `ChIJ_${Math.random().toString(36).substring(7)}`,
      accessLevel: 'CONFIDENTIAL_HR_ONLY'
    }

    setResidences(prev => [created, ...prev])
    if (onNotify) onNotify(`Residence registered for ${created.employeeName} (${created.estate}) under HR Privacy Security Protocol!`)
    setIsRegisterModalOpen(false)
    setNewResidence({
      employeeId: '',
      employeeName: '',
      department: 'Corporate Office',
      role: 'Staff Member',
      residenceName: '',
      apartmentNo: '',
      street: '',
      estate: '',
      areaWard: '',
      town: 'Nairobi',
      county: 'Nairobi',
      postalAddress: '',
      gpsCoordinates: '-1.2863, 36.8172',
      preferredPickupPoint: 'Standard Zone Hub',
      alternativePickup: 'Highway Main Gate',
      emergencyContact: '',
      zone: 'West Route'
    })
  }

  const filteredResidences = residences.filter(r => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.estate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.residenceName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZoneFilter === 'ALL' || r.zone === selectedZoneFilter
    return matchesSearch && matchesZone
  })

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header Banner */}
      <div className="bg-white border border-[#DCE6F2] rounded-2xl p-6 text-[#102A43] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20 font-mono text-[11px] font-bold">
              <ShieldCheck size={14} /> HR Confidential Privacy Safeguard Active
            </div>
            <h3 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
              <Lock size={18} className="text-[#2563EB]" />
              Employee Residence Location Registry & GPS Geocoding
            </h3>
            <p className="text-xs text-[#52677F] max-w-2xl">
              Employee home locations and exact GPS coordinates are confidential. Access is restricted strictly to HR, Transport Managers, and authorized dispatchers. Other department managers see masked pickup nodes only.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfidentialDetails(!showConfidentialDetails)}
              className="px-3.5 py-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs cursor-pointer flex items-center gap-2 transition-all"
            >
              {showConfidentialDetails ? <EyeOff size={15} /> : <Eye size={15} />}
              {showConfidentialDetails ? 'Mask Exact GPS Points' : 'Reveal HR GPS Details'}
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Plus size={16} /> Register Residence
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee, estate, residence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto font-mono">
            <span className="text-slate-400 font-bold shrink-0">Transport Zone:</span>
            {['ALL', 'West Route', 'East Route', 'North Route', 'South Route'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZoneFilter(z)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
                  selectedZoneFilter === z
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Residence Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Employee Name & HR ID</th>
                <th className="py-3 px-3">Department & Role</th>
                <th className="py-3 px-3">Estate / Area / Town</th>
                <th className="py-3 px-3">Residence & House #</th>
                <th className="py-3 px-3">GPS Geocode Pin</th>
                <th className="py-3 px-3">Preferred Pickup Point</th>
                <th className="py-3 px-3">Transport Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredResidences.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">{res.employeeName}</strong>
                    <span className="text-[10px] text-slate-400 font-mono block">{res.employeeId}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-800 dark:text-slate-200 block">{res.department}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{res.role}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <strong className="text-indigo-600 dark:text-indigo-400 block">{res.estate}</strong>
                    <span className="text-[10px] text-slate-400 block">{res.areaWard}, {res.county}</span>
                  </td>
                  <td className="py-3 px-3">
                    {showConfidentialDetails ? (
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{res.residenceName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono block">{res.apartmentNo} • {res.street}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-slate-400 italic text-[11px] flex items-center gap-1">
                        <Lock size={12} className="text-amber-500" /> Confidential [HR Protected]
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {showConfidentialDetails ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <MapPin size={13} /> {res.gpsCoordinates}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Lat/Lng Masked</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                    <span className="font-bold block">{res.preferredPickupPoint}</span>
                    <span className="text-[10px] text-slate-400 block">Alt: {res.alternativePickup}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                      {res.zone}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER RESIDENCE MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Home size={18} className="text-emerald-600 dark:text-emerald-400" />
              Register Employee Residence Location
            </h3>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employee Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Wanjiru"
                    value={newResidence.employeeName}
                    onChange={(e) => setNewResidence({ ...newResidence, employeeName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employee HR ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-108"
                    value={newResidence.employeeId}
                    onChange={(e) => setNewResidence({ ...newResidence, employeeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kilimani / Kitisuru / South B"
                    value={newResidence.estate}
                    onChange={(e) => setNewResidence({ ...newResidence, estate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Residence Name / Apt *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Palms Heights Apt 4B"
                    value={newResidence.residenceName}
                    onChange={(e) => setNewResidence({ ...newResidence, residenceName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Street</label>
                  <input
                    type="text"
                    placeholder="Argwings Kodhek"
                    value={newResidence.street}
                    onChange={(e) => setNewResidence({ ...newResidence, street: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Area / Ward</label>
                  <input
                    type="text"
                    placeholder="Kilimani Ward"
                    value={newResidence.areaWard}
                    onChange={(e) => setNewResidence({ ...newResidence, areaWard: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">County</label>
                  <input
                    type="text"
                    value={newResidence.county}
                    onChange={(e) => setNewResidence({ ...newResidence, county: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GPS Pin Coordinates</label>
                  <input
                    type="text"
                    placeholder="-1.2911, 36.7891"
                    value={newResidence.gpsCoordinates}
                    onChange={(e) => setNewResidence({ ...newResidence, gpsCoordinates: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Transport Zone</label>
                  <select
                    value={newResidence.zone}
                    onChange={(e) => setNewResidence({ ...newResidence, zone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="West Route">West Route</option>
                    <option value="East Route">East Route</option>
                    <option value="North Route">North Route</option>
                    <option value="South Route">South Route</option>
                    <option value="CBD Route">CBD Route</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Pickup Point</label>
                  <input
                    type="text"
                    placeholder="e.g. Yaya Centre Bus Stop"
                    value={newResidence.preferredPickupPoint}
                    onChange={(e) => setNewResidence({ ...newResidence, preferredPickupPoint: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="+254 7XX XXX XXX"
                    value={newResidence.emergencyContact}
                    onChange={(e) => setNewResidence({ ...newResidence, emergencyContact: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  Save Confidential Residence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
