import { useState } from 'react'
import {
  Handshake,
  Building,
  Award,
  BookOpen,
  Key,
  Layers,
  CheckCircle2,
  ExternalLink,
  Users,
  Search,
  Plus
} from 'lucide-react'

const PARTNER_PROJECTS = [
  { id: 'p-1', client: 'Kiambu County Government', partner: 'AfriTech Systems Integration', status: 'IN_PROGRESS', progress: 75, lead: 'James Ochieng' },
  { id: 'p-2', client: 'Mombasa Hospital Group', partner: 'MedFlow Solutions Ltd', status: 'GO_LIVE', progress: 100, lead: 'Dr. Amina Hassan' },
  { id: 'p-3', client: 'Standard Group Logistics', partner: 'LogiCore Africa', status: 'UAT_TESTING', progress: 90, lead: 'Peter Kamau' }
]

export default function PartnerPortalWorkspace() {
  const [projects] = useState(PARTNER_PROJECTS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-gradient-to-r from-[#102A43] via-[#1E3A8A] to-[#2563EB] text-white rounded-3xl space-y-4 shadow-sm border border-[#DCE6F2] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-white/10 text-white border border-white/20 flex items-center gap-1.5 w-fit mb-2">
              <Handshake size={13} className="text-[#38BDF8]" /> Implementation Partner & SI Ecosystem
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Handshake className="text-[#38BDF8]" /> Enterprise Partner & Solution Integrator Workspace
            </h1>
            <p className="text-xs text-slate-200 max-w-2xl mt-1">
              Dedicated partner console for system integrators, solution architects, and ISVs to manage client implementations, partner developer SDK keys, and certification status.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-[#52677F] uppercase font-bold">Partner Tier</span>
          <h3 className="text-lg font-black text-[#2563EB] flex items-center gap-1.5">
            <Award size={18} /> Gold Certified SI Partner
          </h3>
        </div>
        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-[#52677F] uppercase font-bold">Active Deployments</span>
          <h3 className="text-lg font-black text-[#102A43]">3 Enterprise Clients</h3>
        </div>
        <div className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-[#52677F] uppercase font-bold">Certified Consultants</span>
          <h3 className="text-lg font-black text-emerald-600">14 Architects</h3>
        </div>
      </div>

      {/* Projects List */}
      <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
        <h2 className="text-sm font-black text-[#102A43] flex items-center gap-2">
          <Building size={16} className="text-[#2563EB]" /> Active Client Implementation Deployments
        </h2>

        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#102A43]">{p.client}</h4>
                  <p className="text-[10px] text-[#52677F]">SI Lead: {p.lead} • Partner: {p.partner}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  p.status === 'GO_LIVE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full rounded-full transition-all" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
