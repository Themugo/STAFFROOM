import { useState } from 'react'
import {
  Package,
  CheckCircle2,
  Building,
  GraduationCap,
  Truck,
  HeartPulse,
  Landmark,
  Factory,
  ShoppingBag,
  Briefcase,
  HardHat,
  Search,
  Filter,
  Download,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react'

const SOLUTION_PACKS = [
  {
    id: 'pack-county-gov',
    name: 'County & Local Government Solution Pack',
    category: 'Public Sector',
    icon: Landmark,
    rating: 5.0,
    installs: '14 County Governments',
    developer: 'StaffRoom Public Sector Team',
    description: 'Statutory Kenya iTax & Housing Levy payroll, fleet dispatch with fuel control, officer duty roster, and public officer performance appraisal.',
    modules: ['Payroll', 'Fleet', 'Duty Roster', 'Performance Appraisal', 'Citizen Desk'],
    installed: true,
  },
  {
    id: 'pack-corp-hr',
    name: 'Enterprise Corporate HR & Workforce Pack',
    category: 'Corporate HR',
    icon: Building,
    rating: 4.9,
    installs: '85 Enterprises',
    developer: 'StaffRoom Core Product',
    description: '360 Performance appraisal, leave management, recruitment ATS, expense claims, employee self-service portal, and AI HR assistant.',
    modules: ['HR', 'Payroll', 'Recruitment', 'Leave', 'Expenses', 'AI Copilot'],
    installed: true,
  },
  {
    id: 'pack-university',
    name: 'University & Higher Education Workforce Pack',
    category: 'Education',
    icon: GraduationCap,
    rating: 4.8,
    installs: '12 Universities',
    developer: 'EduTech Solutions Partner',
    description: 'Faculty workload allocation, research grant tracking, academic leave policies, part-time lecturer payroll, and campus facilities booking.',
    modules: ['Faculty Roster', 'Grant Payroll', 'Academic Leave', 'Facilities'],
    installed: false,
  },
  {
    id: 'pack-hospital',
    name: 'Healthcare & Clinical Operations Pack',
    category: 'Healthcare',
    icon: HeartPulse,
    rating: 4.9,
    installs: '22 Hospitals',
    developer: 'MedFlow Systems',
    description: 'Doctor shift roster, nurse call-out dispatch, medical license compliance tracking, emergency ward standby, and locum doctor payouts.',
    modules: ['Clinical Roster', 'Locum Payouts', 'Credential Audit', 'Duty Standby'],
    installed: false,
  },
  {
    id: 'pack-logistics',
    name: 'Transport, Fleet & Logistics Accelerator',
    category: 'Logistics',
    icon: Truck,
    rating: 4.9,
    installs: '48 Logistics Firms',
    developer: 'StaffRoom Fleet Labs',
    description: 'GPS telemetry dispatch, driver mileage allowance, vehicle maintenance SOP, fuel card reconciliations, and cargo trip manifests.',
    modules: ['Fleet Telemetry', 'Fuel Control', 'Driver Allowances', 'Maintenance'],
    installed: false,
  },
  {
    id: 'pack-banking',
    name: 'Financial Services & Banking Compliance Pack',
    category: 'Finance',
    icon: Briefcase,
    rating: 5.0,
    installs: '18 Financial Institutions',
    developer: 'FinTech Governance Group',
    description: 'Central bank compliance reporting, insider trade declarations, mandatory block leave tracking, PEP employee screening, and audit logs.',
    modules: ['Block Leave', 'AML Audit', 'PEP Screening', 'Regulatory Reports'],
    installed: false,
  },
  {
    id: 'pack-manufacturing',
    name: 'Manufacturing & Shift Operations Pack',
    category: 'Manufacturing',
    icon: Factory,
    rating: 4.7,
    installs: '31 Manufacturing Plants',
    developer: 'Industry Operations Co.',
    description: 'Plant shift management, piece-rate wages, overtime automation, HSE incident reporting, and safety equipment issuance logs.',
    modules: ['Shift Roster', 'Overtime Calc', 'Piece-Rate Wages', 'HSE Incidents'],
    installed: false,
  },
  {
    id: 'pack-construction',
    name: 'Construction & Site Project Pack',
    category: 'Construction',
    icon: HardHat,
    rating: 4.8,
    installs: '19 General Contractors',
    developer: 'BuildTech Integration',
    description: 'Site casual worker biometric attendance, contractor sub-payouts, site safety briefings, and heavy equipment logbooks.',
    modules: ['Site Attendance', 'Casual Payroll', 'Safety Briefings', 'Asset Logs'],
    installed: false,
  }
]

export default function SolutionPacksMarketplace() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [packs, setPacks] = useState(SOLUTION_PACKS)

  const categories = ['ALL', 'Public Sector', 'Corporate HR', 'Education', 'Healthcare', 'Logistics', 'Finance', 'Manufacturing', 'Construction']

  const toggleInstall = (id) => {
    setPacks(packs.map(p => p.id === id ? { ...p, installed: !p.installed } : p))
  }

  const filteredPacks = packs.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory
    const q = search.toLowerCase()
    const matchQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Package size={13} className="text-emerald-400" /> Enterprise Solution Pack Marketplace
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Package className="text-emerald-400" /> Industry Solution Packs & Extension Modules
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              1-click install pre-configured enterprise solution packs complete with industry workflows, statutory rules, custom forms, and pre-built dashboards.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64 relative shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search solution packs..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-slate-700 bg-slate-800 text-white"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Solution Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPacks.map(pack => {
          const Icon = pack.icon
          return (
            <div key={pack.id} className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs hover:border-[#2563EB]/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20 flex items-center justify-center font-bold">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#102A43]">{pack.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-[#52677F]">{pack.developer}</span>
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {pack.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {pack.installed ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={12} /> INSTALLED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F6F9FD] border border-[#DCE6F2] text-[#52677F]">
                      AVAILABLE
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#52677F] leading-relaxed">{pack.description}</p>

                {/* Included Capabilities Tags */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-bold text-[#52677F] mr-1">Includes:</span>
                  {pack.modules.map((mod, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F6F9FD] border border-[#DCE6F2] text-[#102A43]">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#52677F]">{pack.installs}</span>
                <button
                  onClick={() => toggleInstall(pack.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    pack.installed
                      ? 'bg-[#F6F9FD] border border-[#DCE6F2] text-[#52677F] hover:bg-slate-200/60'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xs'
                  }`}
                >
                  {pack.installed ? 'Uninstall Pack' : '1-Click Install Solution'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
