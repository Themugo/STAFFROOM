import React, { useState } from 'react'
import {
  GitBranch, Building2, Users, Truck, Briefcase, Boxes, DollarSign,
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, Activity, Zap,
  Search, Filter, RefreshCw, Eye, ArrowRight, Layers, Cpu, Compass,
  Sparkles, Globe, Key, Clock, ShieldAlert, Heart, HardDrive, UserCheck
} from 'lucide-react'

const DIGITAL_TWIN_NODES = [
  {
    id: 'org-root',
    name: 'StaffRoom Sovereign Enterprise',
    type: 'Organization',
    category: 'Org Structure',
    health: '98%',
    status: 'OPTIMAL',
    linkedCount: 14,
    metrics: { count: '1 Org', budget: '$18.5M', capacity: '100%' },
    details: 'Root organizational entity spanning 4 regional branches and 12 business units.'
  },
  {
    id: 'dept-eng',
    name: 'Engineering & Technology',
    type: 'Department',
    category: 'Org Structure',
    health: '94%',
    status: 'OPTIMAL',
    linkedCount: 8,
    metrics: { headcount: 84, budget: '$4.2M', utilization: '91%' },
    details: 'Core software engineering, cloud infrastructure, AI platform, and DevOps teams.'
  },
  {
    id: 'dept-hr',
    name: 'Human Resources & Talent',
    type: 'Department',
    category: 'Org Structure',
    health: '96%',
    status: 'OPTIMAL',
    linkedCount: 12,
    metrics: { headcount: 22, budget: '$1.8M', openRoles: 14 },
    details: 'People operations, payroll administration, recruitment ATS, and employee relations.'
  },
  {
    id: 'dept-logistics',
    name: 'Transport & Field Logistics',
    type: 'Department',
    category: 'Org Structure',
    health: '82%',
    status: 'ATTENTION',
    linkedCount: 15,
    metrics: { headcount: 65, budget: '$3.1M', fleetCount: 42 },
    details: 'Vehicle fleet management, driver dispatch, route planning, and fuel card management.'
  },
  {
    id: 'branch-nairobi',
    name: 'Nairobi Central HQ',
    type: 'Branch',
    category: 'Facilities',
    health: '99%',
    status: 'OPTIMAL',
    linkedCount: 28,
    metrics: { occupancy: '88%', capacity: 400, solarUtil: '94%' },
    details: 'Primary corporate headquarters with IoT building management and biometric security.'
  },
  {
    id: 'branch-mombasa',
    name: 'Mombasa Logistics Hub',
    type: 'Branch',
    category: 'Facilities',
    health: '86%',
    status: 'ATTENTION',
    linkedCount: 14,
    metrics: { occupancy: '92%', vehiclesParked: 24, warehouseCap: '84%' },
    details: 'Coastal operations branch, fleet depot, and regional distribution facility.'
  },
  {
    id: 'fleet-core',
    name: 'Sovereign Transport Fleet (42 Vans)',
    type: 'Fleet',
    category: 'Assets & Fleet',
    health: '88%',
    status: 'OPTIMAL',
    linkedCount: 42,
    metrics: { activeVehicles: 38, inMaintenance: 4, fuelEfficiency: '11.8 km/l' },
    details: 'GPS telematics-tracked transport fleet operating on Kenya national transit corridors.'
  },
  {
    id: 'asset-data-center',
    name: 'On-Premises Sovereign Data Center',
    type: 'Asset',
    category: 'Assets & Fleet',
    health: '100%',
    status: 'OPTIMAL',
    linkedCount: 18,
    metrics: { servers: 32, storageTB: 480, backupStatus: '100% Synced' },
    details: 'High-availability server infrastructure supporting localized data residency compliance.'
  },
  {
    id: 'budget-2026',
    name: 'FY2026 Consolidated Operating Budget',
    type: 'Budget',
    category: 'Finance',
    health: '91%',
    status: 'OPTIMAL',
    linkedCount: 22,
    metrics: { total: '$18.5M', committed: '$12.4M', variance: '-2.1%' },
    details: 'Master operational budget covering salaries, fleet fuel, cloud, and procurement.'
  },
  {
    id: 'procurement-pipeline',
    name: 'Active Supplier & Procurement Mesh',
    type: 'Procurement',
    category: 'Suppliers',
    health: '89%',
    status: 'OPTIMAL',
    linkedCount: 36,
    metrics: { activeVendors: 48, pendingPOs: 12, monthlySpend: '$840K' },
    details: 'Automated 3-way matching procurement pipeline for fleet, hardware, and office supplies.'
  },
  {
    id: 'policy-kra-shif',
    name: 'Statutory KRA P10 & SHIF Rules Engine',
    type: 'Policy',
    category: 'Processes & Rules',
    health: '100%',
    status: 'OPTIMAL',
    linkedCount: 1200,
    metrics: { complianceScore: '100%', autoCalculations: '1,240/mo', errorRate: '0.00%' },
    details: 'Automated tax withholding, housing levy 1.5%, and SHIF 2.75% payroll calculation rules.'
  },
  {
    id: 'project-ai-copilot',
    name: 'Enterprise AI & Twin Automation Expansion',
    type: 'Project',
    category: 'Projects',
    health: '95%',
    status: 'OPTIMAL',
    linkedCount: 8,
    metrics: { progress: '78%', lead: 'Chief AI Architect', sprint: '14' },
    details: 'Strategic initiative integrating predictive telemetry and automated workflows.'
  }
]

export default function DigitalTwinGraph() {
  const [selectedNode, setSelectedNode] = useState(DIGITAL_TWIN_NODES[0])
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [simulationActive, setSimulationActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['ALL', 'Org Structure', 'Facilities', 'Assets & Fleet', 'Finance', 'Suppliers', 'Processes & Rules', 'Projects']

  const filteredNodes = DIGITAL_TWIN_NODES.filter(node => {
    const matchesCategory = filterCategory === 'ALL' || node.category === filterCategory
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Room */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit mb-2">
              <GitBranch size={13} className="text-cyan-400 animate-pulse" /> Live Enterprise Digital Twin Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Globe className="text-cyan-400" /> Organizational Digital Twin & Topology Map
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time mirror of enterprise structure, facilities, fleet assets, staff, budgets, and automated business workflows. Changes in operations stream live to the twin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs cursor-pointer flex items-center gap-2 transition-all shadow-md ${
                simulationActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              <Zap size={15} />
              {simulationActive ? 'Pause Live Telemetry' : 'Simulate Live Stream'}
            </button>

            <button
              onClick={() => setSelectedNode(DIGITAL_TWIN_NODES[0])}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Reset View
            </button>
          </div>
        </div>

        {/* Live Metrics Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Mapped Entities</span>
            <strong className="text-white font-mono font-bold">1,842 Objects</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Active Links</span>
            <strong className="text-cyan-400 font-mono font-bold">8,910 Rel.</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Telemetry Stream</span>
            <strong className="text-emerald-400 font-mono font-bold">12 ms Latency</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Health Index</span>
            <strong className="text-emerald-400 font-mono font-bold">96.4 / 100</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Anomaly Watch</span>
            <strong className="text-amber-400 font-mono font-bold">2 Minor Alerts</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Data Residency</span>
            <strong className="text-purple-400 font-mono font-bold">Sovereign Vault</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter size={13} /> Filter:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Twin entities..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Entity Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Node Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id
              const isAttention = node.status === 'ATTENTION'

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`card p-4 rounded-3xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                      : isAttention
                      ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 hover:border-amber-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {node.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isAttention
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {isAttention ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                      {node.health} Health
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      {node.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {node.details}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Linked Relations: <strong className="font-mono text-cyan-600 dark:text-cyan-400">{node.linkedCount}</strong></span>
                    <span className="font-mono text-slate-400 uppercase">{node.category}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        {selectedNode && (
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 shadow-lg h-fit sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400">
                  Digital Twin Object Telemetry
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedNode.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                {selectedNode.health} Health
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {selectedNode.details}
            </p>

            {/* Key Metrics Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity size={14} className="text-cyan-500" /> Operational Metrics Stream:
              </h4>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedNode.metrics).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <strong className="text-xs font-mono font-black text-slate-900 dark:text-white">
                      {val}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Events Feed */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-500" /> Recent Digital Twin Activity:
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">State Synced</strong>
                    <span className="text-slate-500">Updated metrics via automated platform telemetry 2 mins ago.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Policy & Rule Linked</strong>
                    <span className="text-slate-500">Connected to Kenya Statutory Tax Rules & Approval Workflows.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button className="w-full py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                <Eye size={14} /> Open Entity Command View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
