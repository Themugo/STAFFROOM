import { useState } from 'react'
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Download,
  Upload,
  Play,
  Settings,
  Shield,
  FileText,
  Workflow,
  BookOpen,
  Palette,
  Bot,
  Layout,
  Database,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react'

const CAPABILITY_CATALOG = [
  { id: 'm-hr', name: 'Core HR & Employee Directory', category: 'Modules', icon: Layout, desc: 'Personnel records, org structure, onboarding' },
  { id: 'm-payroll', name: 'Statutory Payroll Engine (KRA/SHIF/NSSF)', category: 'Modules', icon: Database, desc: 'Tax calculators, iTax export, M-Pesa payouts' },
  { id: 'm-transport', name: 'Transport & Fleet Operations', category: 'Modules', icon: Layout, desc: 'Vehicle dispatches, driver SLAs, fuel logs' },
  { id: 'm-procure', name: 'Procurement & Vendor Portal', category: 'Modules', icon: Layout, desc: 'Requisitions, LPO issuance, 3-way matching' },
  
  { id: 'w-leave', name: 'Multi-Tier Leave Approval Workflow', category: 'Workflows', icon: Workflow, desc: 'Escalations, proxy approvals, policy checks' },
  { id: 'w-expense', name: 'Expense Claim Audit & Approval', category: 'Workflows', icon: Workflow, desc: 'Receipt OCR validation, budget limit check' },
  { id: 'w-fleet', name: 'Vehicle Breakdown Emergency Escalation', category: 'Workflows', icon: Workflow, desc: 'GPS alert, mechanic dispatch, manager alert' },
  
  { id: 'r-kra', name: 'Kenya KRA P10 Tax Deduction Rules', category: 'Business Rules', icon: Sliders, desc: 'Tax bands, personal relief, housing levy' },
  { id: 'r-leave-accrual', name: 'Pro-Rata Annual Leave Accrual Rule', category: 'Business Rules', icon: Sliders, desc: '1.75 days per month active service calculation' },

  { id: 'k-hr-handbook', name: 'Enterprise HR SOP & Policy Pack', category: 'Knowledge Packs', icon: BookOpen, desc: '14 standardized HR & Code of Conduct policies' },
  { id: 'k-compliance', name: 'Data Protection & ISO 27001 Pack', category: 'Knowledge Packs', icon: BookOpen, desc: 'GDPR, Kenya DPA, & Information Security SOPs' },

  { id: 'a-cfo', name: 'Autonomous CFO Financial Advisor AI', category: 'AI Assistants', icon: Bot, desc: 'Budget variance alerts, expense trend forecasting' },
  { id: 'a-hr-copilot', name: 'Policy Assistant & Employee Concierge AI', category: 'AI Assistants', icon: Bot, desc: 'Instant policy Q&A, leave balance inquiries' },

  { id: 't-midnight', name: 'Dark Navy Luxury Enterprise Theme', category: 'Themes', icon: Palette, desc: 'Deep navy canvas, cyan accents, glass borders' },
  { id: 't-emerald', name: 'Government Emerald Official Theme', category: 'Themes', icon: Palette, desc: 'Rich green palette, crisp high-contrast layout' }
]

export default function SolutionBuilder() {
  const [solutionName, setSolutionName] = useState('County Government HR & Fleet Solution Pack')
  const [industry, setIndustry] = useState('Public Sector & Governance')
  const [version, setVersion] = useState('1.0.0')
  const [description, setDescription] = useState('Complete tailored enterprise platform configuration for county government operations, payroll compliance, and transport dispatch.')

  const [selectedCapabilities, setSelectedCapabilities] = useState([
    'm-hr', 'm-payroll', 'm-transport', 'w-leave', 'w-fleet', 'r-kra', 'k-hr-handbook', 'a-hr-copilot', 't-emerald'
  ])

  const [isBuilding, setIsBuilding] = useState(false)
  const [buildSuccess, setBuildSuccess] = useState(false)

  const toggleCapability = (id) => {
    if (selectedCapabilities.includes(id)) {
      setSelectedCapabilities(selectedCapabilities.filter(c => c !== id))
    } else {
      setSelectedCapabilities([...selectedCapabilities, id])
    }
  }

  const handleBuildPack = () => {
    setIsBuilding(true)
    setBuildSuccess(false)
    setTimeout(() => {
      setIsBuilding(false)
      setBuildSuccess(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Sparkles size={13} className="text-indigo-400" /> Enterprise Solution Architect Studio
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Layers className="text-indigo-400" /> No-Code Enterprise Solution Builder
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Assemble modular solution packs combining pages, forms, workflows, business rules, knowledge packs, themes, permissions, and AI assistants for instant multi-tenant deployment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuildPack}
              disabled={isBuilding}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2 shadow-lg transition-all"
            >
              {isBuilding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Assembling Pack Manifest...
                </>
              ) : (
                <>
                  <Play size={15} /> Build & Publish Solution Pack
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {buildSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span>Solution Pack <strong>"{solutionName}" v{version}</strong> successfully assembled and published to Enterprise Package Registry!</span>
          </div>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ solutionName, industry, version, description, capabilities: selectedCapabilities }, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `${solutionName.toLowerCase().replace(/\s+/g, '-')}-v${version}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
          >
            <Download size={13} /> Download Solution Manifest
          </button>
        </div>
      )}

      {/* Builder Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Solution Metadata Panel */}
        <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
          <h2 className="text-sm font-black text-[#102A43] flex items-center gap-2">
            <Settings size={16} className="text-[#2563EB]" /> Solution Pack Specification
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-[#52677F] block mb-1">Solution Name</label>
              <input
                type="text"
                value={solutionName}
                onChange={(e) => setSolutionName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#52677F] block mb-1">Target Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
                >
                  <option>Public Sector & Governance</option>
                  <option>Corporate HR & Enterprise</option>
                  <option>Healthcare & Hospitals</option>
                  <option>Higher Education & Universities</option>
                  <option>Logistics & Fleet Operations</option>
                  <option>Financial Services & Banking</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#52677F] block mb-1">Pack Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#52677F] block mb-1">Solution Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 space-y-2">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Solution Manifest Stats</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#52677F] block text-[10px]">Selected Components</span>
                <strong className="text-[#102A43] font-mono">{selectedCapabilities.length} items</strong>
              </div>
              <div>
                <span className="text-[#52677F] block text-[10px]">Compatibility</span>
                <strong className="text-emerald-600 font-mono">v3.4 Universal</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Capability Picker List */}
        <div className="lg:col-span-2 card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#102A43] flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" /> Modular Platform Component Selector
            </h2>
            <span className="text-xs font-bold text-[#52677F]">{selectedCapabilities.length} Selected</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {CAPABILITY_CATALOG.map(cap => {
              const Icon = cap.icon
              const isSelected = selectedCapabilities.includes(cap.id)
              return (
                <div
                  key={cap.id}
                  onClick={() => toggleCapability(cap.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#EAF3FF] border-[#2563EB]/40 text-[#102A43] shadow-2xs'
                      : 'bg-[#F6F9FD] border-[#DCE6F2] hover:border-[#2563EB]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl text-white font-bold shrink-0 ${isSelected ? 'bg-[#2563EB]' : 'bg-slate-400'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#102A43]">{cap.name}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-white border border-[#DCE6F2] text-[#52677F]">
                          {cap.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#52677F] mt-0.5">{cap.desc}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#DCE6F2] bg-white'
                  }`}>
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
