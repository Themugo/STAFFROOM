import React, { useState } from 'react'
import {
  BarChart3, TrendingUp, Users, DollarSign, Briefcase, Truck,
  Boxes, ShieldCheck, Clock, Award, FileText, ChevronRight,
  Filter, Download, ArrowUpRight, ArrowDownRight, Layers,
  CheckCircle2, Search, Sliders, Eye, Sparkles, Building2
} from 'lucide-react'

const EXECUTIVE_KPIS = [
  {
    id: 'kpi-growth',
    name: 'Employee Growth Rate',
    category: 'HR & People',
    value: '+14.2%',
    target: '+12.0%',
    status: 'SURPASSED',
    trend: 'up',
    sparkline: [102, 108, 114, 120, 128, 134, 142],
    description: 'Quarterly net headcount addition across technical & field operations.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '+18.5%' },
        { name: 'Mombasa Hub', val: '+12.1%' },
        { name: 'Kisumu Office', val: '+9.4%' }
      ],
      byDept: [
        { name: 'Engineering', val: '+22.0%' },
        { name: 'Transport Logistics', val: '+14.0%' },
        { name: 'Customer Service', val: '+8.5%' }
      ]
    }
  },
  {
    id: 'kpi-payroll-cost',
    name: 'Consolidated Payroll Cost',
    category: 'Finance & Payroll',
    value: '$1,248,500/mo',
    target: '$1,280,000/mo',
    status: 'OPTIMAL',
    trend: 'down',
    sparkline: [1290, 1285, 1270, 1260, 1255, 1248],
    description: 'Gross payroll liability including KRA PAYE tax, Housing Levy 1.5%, and SHIF 2.75%.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '$740,000' },
        { name: 'Mombasa Hub', val: '$320,000' },
        { name: 'Kisumu Office', val: '$188,500' }
      ],
      byDept: [
        { name: 'Engineering', val: '$510,000' },
        { name: 'Logistics', val: '$380,000' },
        { name: 'Corporate Admin', val: '$358,500' }
      ]
    }
  },
  {
    id: 'kpi-recruitment-velocity',
    name: 'Recruitment Velocity (Time-to-Hire)',
    category: 'Recruitment',
    value: '18.4 Days',
    target: '21.0 Days',
    status: 'SURPASSED',
    trend: 'down',
    sparkline: [28, 25, 22, 20, 19, 18.4],
    description: 'Average calendar days from ATS requisition approval to candidate offer acceptance.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '16.2 Days' },
        { name: 'Mombasa Hub', val: '21.5 Days' }
      ],
      byDept: [
        { name: 'Engineering', val: '24.0 Days' },
        { name: 'Logistics Drivers', val: '12.0 Days' }
      ]
    }
  },
  {
    id: 'kpi-retention-rate',
    name: 'Staff Retention Rate',
    category: 'HR & People',
    value: '94.8%',
    target: '92.0%',
    status: 'SURPASSED',
    trend: 'up',
    sparkline: [91, 92, 93.5, 94, 94.8],
    description: 'Trailing 12-month voluntary staff retention rate across core cadres.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '96.2%' },
        { name: 'Mombasa Hub', val: '92.4%' }
      ],
      byDept: [
        { name: 'Engineering', val: '97.0%' },
        { name: 'Field Logistics', val: '91.8%' }
      ]
    }
  },
  {
    id: 'kpi-vehicle-utilization',
    name: 'Transport Vehicle Utilization',
    category: 'Transport & Fleet',
    value: '88.6%',
    target: '85.0%',
    status: 'OPTIMAL',
    trend: 'up',
    sparkline: [78, 81, 84, 86, 88.6],
    description: 'Daily active operational hours vs total vehicle capacity across company fleet.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '91.2%' },
        { name: 'Mombasa Hub', val: '84.1%' }
      ],
      byDept: [
        { name: 'Passenger Dispatch', val: '94.0%' },
        { name: 'Cargo Cargo', val: '82.0%' }
      ]
    }
  },
  {
    id: 'kpi-asset-utilization',
    name: 'IT & Facilities Asset Utilization',
    category: 'Assets & Warehouses',
    value: '92.1%',
    target: '90.0%',
    status: 'OPTIMAL',
    trend: 'up',
    sparkline: [88, 89, 90, 91.5, 92.1],
    description: 'Percentage of registered hardware, laptops, and server racks actively assigned.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '95.4%' },
        { name: 'Mombasa Hub', val: '87.8%' }
      ],
      byDept: [
        { name: 'Engineering', val: '98.5%' },
        { name: 'Admin', val: '85.0%' }
      ]
    }
  },
  {
    id: 'kpi-procurement-cycle',
    name: 'Procurement Cycle Time',
    category: 'Procurement',
    value: '3.2 Days',
    target: '5.0 Days',
    status: 'SURPASSED',
    trend: 'down',
    sparkline: [6.5, 5.8, 4.2, 3.8, 3.2],
    description: 'Average duration from Purchase Requisition submission to PO dispatch to supplier.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '2.8 Days' },
        { name: 'Mombasa Hub', val: '3.9 Days' }
      ],
      byDept: [
        { name: 'IT Infrastructure', val: '2.1 Days' },
        { name: 'Fleet Repairs', val: '4.2 Days' }
      ]
    }
  },
  {
    id: 'kpi-compliance-score',
    name: 'Statutory Compliance Index',
    category: 'Governance & Security',
    value: '99.8%',
    target: '100.0%',
    status: 'OPTIMAL',
    trend: 'up',
    sparkline: [98, 98.5, 99.1, 99.5, 99.8],
    description: 'Audited statutory tax filing, SHIF submission, data protection & ISO compliance.',
    drilldown: {
      byBranch: [
        { name: 'Nairobi HQ', val: '100.0%' },
        { name: 'Mombasa Hub', val: '99.4%' }
      ],
      byDept: [
        { name: 'Finance & Tax', val: '100.0%' },
        { name: 'Legal & HR', val: '99.5%' }
      ]
    }
  }
]

export default function ExecutiveKpiLibrary() {
  const [selectedKpi, setSelectedKpi] = useState(null)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['ALL', 'HR & People', 'Finance & Payroll', 'Recruitment', 'Transport & Fleet', 'Assets & Warehouses', 'Procurement', 'Governance & Security']

  const filteredKpis = EXECUTIVE_KPIS.filter(kpi => {
    const matchesCategory = filterCategory === 'ALL' || kpi.category === filterCategory
    const matchesSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kpi.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-2">
              <BarChart3 size={13} className="text-indigo-400" /> Executive Intelligence KPI Library
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="text-indigo-400" /> Executive Metrics & Multi-Dimensional Drill-Down
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Configurable executive KPI repository uniting HR, Payroll, Transport, Fleet, Procurement, and Statutory Compliance metrics with drill-down down to branch and team level.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md">
              <Download size={14} /> Export KPI Pack
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executive KPIs..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKpis.map(kpi => (
          <div
            key={kpi.id}
            onClick={() => setSelectedKpi(kpi)}
            className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-3xl space-y-3 shadow-xs cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                {kpi.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 size={10} /> {kpi.status}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {kpi.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {kpi.value}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Target: {kpi.target}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-2">
              {kpi.description}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <span className="flex items-center gap-1">
                <Eye size={12} /> Click to Drill Down
              </span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Drill-Down Modal Drawer */}
      {selectedKpi && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Multi-Dimensional KPI Drill-Down
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedKpi.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedKpi(null)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Current Metric</span>
                <strong className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                  {selectedKpi.value}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Target Threshold</span>
                <strong className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                  {selectedKpi.target}
                </strong>
              </div>
            </div>

            {/* Drilldown Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 size={13} className="text-indigo-500" /> By Regional Branch:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedKpi.drilldown.byBranch.map((b, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-600 dark:text-slate-300">{b.name}</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{b.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers size={13} className="text-indigo-500" /> By Department:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedKpi.drilldown.byDept.map((d, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{d.val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedKpi(null)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs cursor-pointer hover:bg-indigo-700"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
