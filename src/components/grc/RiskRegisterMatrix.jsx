import React, { useState } from 'react'
import {
  AlertTriangle, ShieldAlert, Plus, Filter, Search, CheckCircle2,
  Sliders, Grid, RefreshCw, ChevronRight, Zap, Eye, Check, X, ShieldCheck
} from 'lucide-react'

const INITIAL_RISKS = [
  {
    id: 'RSK-STRAT-01',
    title: 'Regional Competitor Rapid Expansion in Coast Region',
    category: 'Strategic Risks',
    owner: 'Chief Strategy Officer',
    likelihood: 3, // 1 to 5
    impact: 4,     // 1 to 5
    rating: 'HIGH', // Calculated: 3x4 = 12 (High)
    treatment: 'MITIGATE',
    mitigation: 'Accelerate Mombasa hub automation & launch localized corporate pricing tier.',
    reviewFreq: 'QUARTERLY',
    residualRisk: 'MEDIUM',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-FIN-02',
    title: 'Uncapped Overtime Spike in Mombasa Fleet Operations',
    category: 'Financial Risks',
    owner: 'Chief Financial Officer',
    likelihood: 4,
    impact: 4,
    rating: 'CRITICAL', // 16
    treatment: 'MITIGATE',
    mitigation: 'Implement automated night shift overtime approval limit & fleet rotation.',
    reviewFreq: 'MONTHLY',
    residualRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-CYBER-03',
    title: 'Unauthorized Privileged Access to Biometric Attendance Database',
    category: 'Cyber Risks',
    owner: 'Chief Information Security Officer',
    likelihood: 2,
    impact: 5,
    rating: 'HIGH', // 10
    treatment: 'TRANSFER / CONTROL',
    mitigation: 'Enforce MFA, IP restriction, & mandatory database field encryption.',
    reviewFreq: 'MONTHLY',
    residualRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-HR-04',
    title: 'Key Technical Talent Attrition in Software Engineering',
    category: 'HR Risks',
    owner: 'Chief Human Resources Officer',
    likelihood: 3,
    impact: 3,
    rating: 'MEDIUM', // 9
    treatment: 'MITIGATE',
    mitigation: 'Introduce remote work flexibility, retention bonus stock units & clear career ladders.',
    reviewFreq: 'QUARTERLY',
    residualRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-OPER-05',
    title: 'Single Point of Failure in Freight Clearing Vendor',
    category: 'Vendor Risks',
    owner: 'Head of Logistics',
    likelihood: 3,
    impact: 4,
    rating: 'HIGH', // 12
    treatment: 'MITIGATE',
    mitigation: 'Onboard secondary clearing agent "Summit Logistics" to balance cargo volume.',
    reviewFreq: 'SEMI-ANNUAL',
    residualRisk: 'MEDIUM',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-HS-06',
    title: 'Warehouse Safety Non-Compliance during Night Shift Cargo Loading',
    category: 'Health & Safety Risks',
    owner: 'HSE Manager',
    likelihood: 2,
    impact: 4,
    rating: 'MEDIUM',
    treatment: 'MITIGATE',
    mitigation: 'Mandatory PPE checks & weekly night shift safety tool-box talks.',
    reviewFreq: 'MONTHLY',
    residualRisk: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: 'RSK-BC-07',
    title: 'Fiber Internet Backbone Disruption at Nairobi Central HQ',
    category: 'Business Continuity Risks',
    owner: 'IT Operations Lead',
    likelihood: 3,
    impact: 3,
    rating: 'MEDIUM',
    treatment: 'MITIGATE',
    mitigation: 'Deploy redundant 5G microwave failover line with automatic BGP switching.',
    reviewFreq: 'ANNUAL',
    residualRisk: 'LOW',
    status: 'ACTIVE'
  }
]

const CATEGORIES = [
  'ALL',
  'Strategic Risks',
  'Operational Risks',
  'Financial Risks',
  'HR Risks',
  'Cyber Risks',
  'Legal Risks',
  'Vendor Risks',
  'Project Risks',
  'Health & Safety Risks',
  'Business Continuity Risks'
]

export default function RiskRegisterMatrix() {
  const [risks, setRisks] = useState(INITIAL_RISKS)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [activeView, setActiveView] = useState('REGISTER') // 'REGISTER' or 'MATRIX'
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // New Risk Form State
  const [newRisk, setNewRisk] = useState({
    title: '',
    category: 'Operational Risks',
    owner: '',
    likelihood: 3,
    impact: 3,
    treatment: 'MITIGATE',
    mitigation: '',
    reviewFreq: 'QUARTERLY'
  })

  const getRating = (l, i) => {
    const score = l * i
    if (score >= 15) return 'CRITICAL'
    if (score >= 10) return 'HIGH'
    if (score >= 5) return 'MEDIUM'
    return 'LOW'
  }

  const handleAddRisk = (e) => {
    e.preventDefault()
    if (!newRisk.title || !newRisk.owner) return

    const rating = getRating(newRisk.likelihood, newRisk.impact)
    const riskObj = {
      id: `RSK-CUSTOM-${Date.now().toString().slice(-4)}`,
      ...newRisk,
      rating,
      residualRisk: 'LOW',
      status: 'ACTIVE'
    }

    setRisks([riskObj, ...risks])
    setShowAddModal(false)
    setNewRisk({
      title: '',
      category: 'Operational Risks',
      owner: '',
      likelihood: 3,
      impact: 3,
      treatment: 'MITIGATE',
      mitigation: '',
      reviewFreq: 'QUARTERLY'
    })
  }

  const filteredRisks = risks.filter(r => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.owner.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <AlertTriangle size={13} className="text-amber-400" /> Enterprise Risk Register & 5x5 Heat Matrix
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-400" /> Enterprise Risk Governance & Heat Map Matrix
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Catalog and evaluate enterprise risks across Strategic, Operational, Financial, Cyber, Legal, Vendor, HR, Health & Safety, and Business Continuity domains.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => setActiveView('REGISTER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeView === 'REGISTER' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Risk Register
              </button>
              <button
                onClick={() => setActiveView('MATRIX')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeView === 'MATRIX' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                5x5 Heat Map Matrix
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <Plus size={15} /> Log New Risk
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search risk, owner, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <span className="text-xs font-bold text-slate-500 font-mono">
            Showing {filteredRisks.length} of {risks.length} Registered Risks
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: RISK REGISTER LIST */}
      {activeView === 'REGISTER' && (
        <div className="space-y-3">
          {filteredRisks.map((risk) => {
            const isCritical = risk.rating === 'CRITICAL'
            const isHigh = risk.rating === 'HIGH'

            return (
              <div
                key={risk.id}
                className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{risk.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {risk.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isCritical
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : isHigh
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {risk.rating} (L:{risk.likelihood} × I:{risk.impact})
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    Owner: {risk.owner}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">{risk.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    <strong className="text-slate-800 dark:text-slate-200">Treatment Plan:</strong> {risk.mitigation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-mono">
                  <div>Strategy: <strong className="text-slate-800 dark:text-slate-200">{risk.treatment}</strong></div>
                  <div>Review Freq: <strong className="text-slate-800 dark:text-slate-200">{risk.reviewFreq}</strong></div>
                  <div>Residual Risk: <strong className="text-emerald-600 dark:text-emerald-400">{risk.residualRisk}</strong></div>
                  <div>Status: <strong className="text-slate-800 dark:text-slate-200">{risk.status}</strong></div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW 2: 5x5 HEAT MAP MATRIX */}
      {activeView === 'MATRIX' && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Grid size={16} className="text-amber-500" /> 5x5 Risk Likelihood vs. Impact Heat Map Grid
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Standard ISO 31000 Grid</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] space-y-2">
              {/* Grid Rows: Impact (5 down to 1) */}
              {[5, 4, 3, 2, 1].map((imp) => (
                <div key={imp} className="flex items-center gap-2">
                  <div className="w-20 text-[10px] font-bold text-slate-400 font-mono text-right shrink-0">
                    Impact {imp}
                  </div>

                  <div className="grid grid-cols-5 gap-2 flex-1">
                    {[1, 2, 3, 4, 5].map((lh) => {
                      const score = imp * lh
                      const cellRisks = risks.filter(r => r.likelihood === lh && r.impact === imp)
                      
                      let bgColor = 'bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      if (score >= 15) bgColor = 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 dark:border-rose-800'
                      else if (score >= 10) bgColor = 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800'

                      return (
                        <div
                          key={lh}
                          className={`p-3 rounded-2xl border ${bgColor} text-center space-y-1 min-h-[70px] flex flex-col justify-between`}
                        >
                          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                            <span>Score: {score}</span>
                            <span>L:{lh}×I:{imp}</span>
                          </div>

                          {cellRisks.length > 0 ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {cellRisks.map(cr => (
                                <span key={cr.id} className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                  {cr.id}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Clear</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Bottom Column Labels */}
              <div className="flex items-center gap-2 pt-2">
                <div className="w-20" />
                <div className="grid grid-cols-5 gap-2 flex-1 text-center text-[10px] font-bold font-mono text-slate-400">
                  <div>Likelihood 1</div>
                  <div>Likelihood 2</div>
                  <div>Likelihood 3</div>
                  <div>Likelihood 4</div>
                  <div>Likelihood 5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log New Risk */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Log Enterprise Risk Entry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRisk} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Risk Title / Description</label>
                <input
                  type="text"
                  required
                  value={newRisk.title}
                  onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                  placeholder="e.g. Foreign Exchange Volatility Impact on Fleet Fuel Imports"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newRisk.category}
                    onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Risk Owner</label>
                  <input
                    type="text"
                    required
                    value={newRisk.owner}
                    onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                    placeholder="e.g. Chief Risk Officer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Likelihood (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRisk.likelihood}
                    onChange={(e) => setNewRisk({ ...newRisk, likelihood: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Impact (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRisk.impact}
                    onChange={(e) => setNewRisk({ ...newRisk, impact: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Treatment & Mitigation Plan</label>
                <textarea
                  rows={2}
                  value={newRisk.mitigation}
                  onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
                  placeholder="Specific operational actions to mitigate this risk..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  Save Risk Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
