import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Maximize2,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts'

/**
 * Reusable Automation KPI Card Component
 *
 * Supports dynamic data visualization (Sparkline Area, Bar, Line, Progress)
 * for metrics like 'Automation Success Rate', 'Average Runtime', and 'Total Tasks Processed'.
 * Accepts an optional 'trend' prop (e.g. "+2.4%") and renders a small arrow icon with green/red indicator.
 */
export default function AutomationKpiCard({
  title,
  value,
  unit = '',
  trend = '',
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  isGoodTrend = true,
  subtitle = '',
  badgeText = '',
  badgeVariant = 'emerald', // 'emerald' | 'indigo' | 'amber' | 'cyan' | 'purple'
  icon: Icon = Zap,
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
  chartData = [],
  chartType = 'area', // 'area' | 'bar' | 'line' | 'progress'
  chartColor = '#6366f1',
  targetValue = null,
  targetLabel = '',
  timeframe = '24h',
  onTimeframeChange = null,
  details = null, // Extra object with metrics like { peak: '12ms', errorRate: '0.02%', throughput: '240/m' }
}) {
  const [showModal, setShowModal] = useState(false)

  // Determine trend direction and color indicators
  const trendStr = typeof trend === 'string' ? trend : String(trend || '')
  const isNegativeString = trendStr.startsWith('-') || trendStr.toLowerCase().includes('down')
  const isUp = trendDirection === 'up' || (!isNegativeString && trendDirection !== 'down')
  const isGreen = isGoodTrend !== undefined ? isGoodTrend : !isNegativeString

  // Badge variant styling mapping
  const badgeStyles = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }

  const selectedBadgeClass = badgeStyles[badgeVariant] || badgeStyles.indigo

  return (
    <>
      {/* MAIN CARD CONTAINER */}
      <div className="group relative p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between overflow-hidden">
        {/* HEADER SECTION */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${iconBgColor} shrink-0 transition-transform group-hover:scale-105`}>
              <Icon size={20} />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {title}
              </h4>
              {subtitle && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {badgeText && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${selectedBadgeClass}`}>
                {badgeText}
              </span>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Expand Metric Breakdown"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* METRIC VALUE & TREND ROW */}
        <div className="flex items-baseline justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}

            {/* OPTIONAL TREND INDICATOR NEXT TO METRIC VALUE WITH ARROW & GREEN/RED COLOR INDICATOR */}
            {trendStr && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold transition-colors ${
                  isGreen
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight size={13} className="shrink-0 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight size={13} className="shrink-0 stroke-[2.5]" />
                )}
                <span>{trendStr}</span>
              </span>
            )}
          </div>
        </div>

        {/* TARGET & SLA THRESHOLD FOOTER */}
        {targetValue && (
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>{targetLabel || 'Target Benchmark'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" /> {targetValue}
            </span>
          </div>
        )}

        {/* DYNAMIC DATA VISUALIZATION SPARKLINE */}
        {chartData && chartData.length > 0 && (
          <div className="pt-2 h-16 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg text-[10px] font-mono border border-slate-700">
                            <p className="font-bold text-indigo-300">{data.label || data.time}</p>
                            <p className="text-white">
                              Value: <span className="font-black">{data.value}</span> {unit}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#grad-${title.replace(/\s+/g, '')})`}
                  />
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg text-[10px] font-mono border border-slate-700">
                            <p className="font-bold text-indigo-300">{data.label || data.time}</p>
                            <p className="text-white">
                              Tasks: <span className="font-black">{data.value}</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg text-[10px] font-mono border border-slate-700">
                            <p className="font-bold text-indigo-300">{data.label || data.time}</p>
                            <p className="text-white">
                              Runtime: <span className="font-black">{data.value}</span> {unit}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: chartColor }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* DETAILED BREAKDOWN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${iconBgColor}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {title} — Detailed Intelligence
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time telemetry breakdown and historical distribution
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Metrics Summary Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Current Metric</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {value} <span className="text-xs font-normal text-slate-500">{unit}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">MoM Trend</span>
                <p className={`text-xl font-black mt-0.5 ${isGoodTrend ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {trend}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">SLA Target</span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {targetValue || '100%'}
                </p>
              </div>
            </div>

            {/* Expanded Telemetry Chart */}
            {chartData && chartData.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Telemetry Trend & Distribution
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                          fontSize: 12
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={3} fill={chartColor} fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Additional Details List if provided */}
            {details && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <h4 className="font-mono font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  Operational Metrics Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(details).map(([k, v]) => (
                    <div key={k} className="flex justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
