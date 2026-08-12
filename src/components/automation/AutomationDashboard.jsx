import React, { useState } from 'react'
import { useAutomation } from '@/contexts/AutomationContext'
import AutomationKpiCard from './AutomationKpiCard'
import {
  Zap,
  Plus,
  Play,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Filter,
  ShieldCheck,
  RotateCw,
  Calendar,
  Layers
} from 'lucide-react'

export default function AutomationDashboard({ onEditFlow, onCreateNewFlow, onNotify }) {
  const { flows, toggleFlowStatus, runSimulation } = useAutomation()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [timeframe, setTimeframe] = useState('24h') // '24h' | '7d' | '30d'

  // Calculate health & execution metrics
  const activeFlowsCount = flows.filter((f) => f.status === 'Active').length
  const totalRuns = flows.reduce((acc, f) => acc + (f.totalRuns || 0), 0)
  const totalTimeSaved = flows.reduce((acc, f) => acc + (f.timeSavedHours || 0), 0)

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(flows.map((f) => f.category)))]

  // Dynamic timeframe-based dataset generators for KPI cards
  const kpiDatasets = {
    '24h': {
      successRate: [
        { label: '00:00', value: 99.2 },
        { label: '04:00', value: 99.4 },
        { label: '08:00', value: 99.7 },
        { label: '12:00', value: 99.6 },
        { label: '16:00', value: 99.9 },
        { label: '20:00', value: 99.8 },
      ],
      runtime: [
        { label: '00:00', value: 185 },
        { label: '04:00', value: 162 },
        { label: '08:00', value: 150 },
        { label: '12:00', value: 148 },
        { label: '16:00', value: 140 },
        { label: '20:00', value: 142 },
      ],
      tasks: [
        { label: '00:00', value: 1200 },
        { label: '04:00', value: 850 },
        { label: '08:00', value: 2900 },
        { label: '12:00', value: 4100 },
        { label: '16:00', value: 3800 },
        { label: '20:00', value: 1970 },
      ],
      hoursSaved: [
        { label: '00:00', value: 12 },
        { label: '04:00', value: 24 },
        { label: '08:00', value: 48 },
        { label: '12:00', value: 92 },
        { label: '16:00', value: 140 },
        { label: '20:00', value: 184 },
      ],
    },
    '7d': {
      successRate: [
        { label: 'Mon', value: 98.9 },
        { label: 'Tue', value: 99.2 },
        { label: 'Wed', value: 99.6 },
        { label: 'Thu', value: 99.5 },
        { label: 'Fri', value: 99.8 },
        { label: 'Sat', value: 99.9 },
        { label: 'Sun', value: 99.8 },
      ],
      runtime: [
        { label: 'Mon', value: 190 },
        { label: 'Tue', value: 175 },
        { label: 'Wed', value: 160 },
        { label: 'Thu', value: 152 },
        { label: 'Fri', value: 145 },
        { label: 'Sat', value: 140 },
        { label: 'Sun', value: 142 },
      ],
      tasks: [
        { label: 'Mon', value: 11200 },
        { label: 'Tue', value: 14500 },
        { label: 'Wed', value: 16800 },
        { label: 'Thu', value: 15200 },
        { label: 'Fri', value: 18900 },
        { label: 'Sat', value: 9200 },
        { label: 'Sun', value: 8100 },
      ],
      hoursSaved: [
        { label: 'Mon', value: 120 },
        { label: 'Tue', value: 135 },
        { label: 'Wed', value: 150 },
        { label: 'Thu', value: 165 },
        { label: 'Fri', value: 178 },
        { label: 'Sat', value: 180 },
        { label: 'Sun', value: 184 },
      ],
    },
    '30d': {
      successRate: [
        { label: 'Week 1', value: 98.4 },
        { label: 'Week 2', value: 99.1 },
        { label: 'Week 3', value: 99.5 },
        { label: 'Week 4', value: 99.8 },
      ],
      runtime: [
        { label: 'Week 1', value: 210 },
        { label: 'Week 2', value: 180 },
        { label: 'Week 3', value: 155 },
        { label: 'Week 4', value: 142 },
      ],
      tasks: [
        { label: 'Week 1', value: 45000 },
        { label: 'Week 2', value: 52000 },
        { label: 'Week 3', value: 58000 },
        { label: 'Week 4', value: 64000 },
      ],
      hoursSaved: [
        { label: 'Week 1', value: 420 },
        { label: 'Week 2', value: 490 },
        { label: 'Week 3', value: 560 },
        { label: 'Week 4', value: 630 },
      ],
    },
  }

  const currentDataset = kpiDatasets[timeframe] || kpiDatasets['24h']

  const filteredFlows = flows.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.trigger.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* TIMEFRAME CONTROL & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Automation Health & Telemetry Center
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live workflow KPIs, SLA compliance, and execution runtime trends
            </p>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl font-mono text-xs">
          {[
            { id: '24h', label: '24 Hours' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* HEALTH & PERFORMANCE REUSABLE KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Automation Success Rate */}
        <AutomationKpiCard
          title="Automation Success Rate"
          value="99.8"
          unit="%"
          trend="+0.4% MoM"
          trendDirection="up"
          isGoodTrend={true}
          subtitle="SLA benchmark evaluation"
          badgeText="SLA Compliant"
          badgeVariant="emerald"
          icon={ShieldCheck}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
          chartData={currentDataset.successRate}
          chartType="area"
          chartColor="#10b981"
          targetValue="99.0%"
          targetLabel="SLA Threshold"
          timeframe={timeframe}
          details={{
            peakRate: '99.98%',
            errorIncidents: '0 Uncaught',
            autoRetryRecovery: '100% Success',
            slaBreaches: '0 in last 30d',
          }}
        />

        {/* Metric 2: Average Runtime */}
        <AutomationKpiCard
          title="Average Runtime"
          value="142"
          unit="ms"
          trend="-28ms Faster"
          trendDirection="down"
          isGoodTrend={true}
          subtitle="Step execution latency"
          badgeText="Optimal Speed"
          badgeVariant="indigo"
          icon={Clock}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
          chartData={currentDataset.runtime}
          chartType="line"
          chartColor="#6366f1"
          targetValue="< 250ms"
          targetLabel="Max Latency Ceiling"
          timeframe={timeframe}
          details={{
            p95Latency: '185 ms',
            p99Latency: '210 ms',
            coldStartDelay: '< 0.8%',
            avgNodeCount: '4.2 steps / flow',
          }}
        />

        {/* Metric 3: Total Tasks Processed */}
        <AutomationKpiCard
          title="Total Tasks Processed"
          value={
            timeframe === '24h'
              ? '14,820'
              : timeframe === '7d'
              ? '94,200'
              : '219,000'
          }
          unit="tasks"
          trend="+18.5% Volume"
          trendDirection="up"
          isGoodTrend={true}
          subtitle="System task execution"
          badgeText="High Throughput"
          badgeVariant="purple"
          icon={Activity}
          iconBgColor="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
          chartData={currentDataset.tasks}
          chartType="bar"
          chartColor="#8b5cf6"
          targetValue="10,000 / day"
          targetLabel="Capacity Baseline"
          timeframe={timeframe}
          details={{
            peakThroughput: '480 tasks / min',
            activeQueueDelay: '0.04s',
            concurrentWorkers: '12 Workers',
            failedExecutions: '3 (Recovered)',
          }}
        />

        {/* Metric 4: Workforce Hours Saved */}
        <AutomationKpiCard
          title="Workforce Hours Saved"
          value={totalTimeSaved || 184}
          unit="hrs"
          trend="+32 hrs MoM"
          trendDirection="up"
          isGoodTrend={true}
          subtitle="Staff productivity gain"
          badgeText="ROI Multiplier"
          badgeVariant="cyan"
          icon={Zap}
          iconBgColor="bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400"
          chartData={currentDataset.hoursSaved}
          chartType="area"
          chartColor="#06b6d4"
          targetValue="150 hrs / mo"
          targetLabel="Target Productivity"
          timeframe={timeframe}
          details={{
            estimatedCostSavings: '$9,200 / mo',
            humanErrorsPrevented: '142',
            highestYieldFlow: 'Payroll Pre-audit Sync',
            roiMultiplier: '14.2x',
          }}
        />
      </div>

      {/* FILTER & CREATE BAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter active flows..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CREATE NEW FLOW BUTTON */}
        <button
          onClick={onCreateNewFlow}
          className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:opacity-95 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap"
        >
          <Plus size={16} /> Create New Flow
        </button>
      </div>

      {/* ACTIVE FLOWS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlows.map((flow) => {
          const isActive = flow.status === 'Active'

          return (
            <div
              key={flow.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                    {flow.category}
                  </span>
                  <button
                    onClick={() => {
                      toggleFlowStatus(flow.id)
                      if (onNotify) onNotify(`Status toggled for '${flow.name}'`)
                    }}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {flow.status}
                  </button>
                </div>

                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                    {flow.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {flow.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>TRIGGER</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{flow.trigger}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>STEPS CHAIN</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {flow.nodes?.length || 0} Nodes
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>LAST RUN</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {flow.lastRun || 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    runSimulation(flow.id)
                    if (onNotify) onNotify(`Executed test simulation for '${flow.name}'`)
                  }}
                  className="text-xs font-mono font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer flex items-center gap-1"
                >
                  <Play size={12} /> Test Simulation
                </button>

                <button
                  onClick={() => onEditFlow(flow)}
                  className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer flex items-center gap-1 transition-all"
                >
                  Launch Builder <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
