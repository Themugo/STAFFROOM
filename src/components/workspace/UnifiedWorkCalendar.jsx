import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Users,
  Palmtree,
  GraduationCap,
  Briefcase,
  Plane,
  CheckSquare,
  AlertCircle,
  Tag
} from 'lucide-react'

export default function UnifiedWorkCalendar() {
  const [currentMonth, setCurrentMonth] = useState('August 2026')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    { name: 'All', icon: CalendarIcon, color: 'bg-indigo-600 text-white' },
    { name: 'Meetings', icon: Users, color: 'bg-blue-500 text-white' },
    { name: 'Leave', icon: Palmtree, color: 'bg-emerald-500 text-white' },
    { name: 'Training', icon: GraduationCap, color: 'bg-purple-500 text-white' },
    { name: 'Deadlines', icon: AlertCircle, color: 'bg-rose-500 text-white' },
    { name: 'Travel', icon: Plane, color: 'bg-amber-500 text-white' },
  ]

  const calendarEvents = [
    {
      id: 1,
      day: 3,
      title: 'Executive Leadership Sync',
      time: '09:00 - 10:30 AM',
      category: 'Meetings',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      owner: 'Boardroom A',
    },
    {
      id: 2,
      day: 5,
      title: 'Annual Leave: Alex Rivera',
      time: 'All Day',
      category: 'Leave',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
      owner: 'Engineering',
    },
    {
      id: 3,
      day: 8,
      title: 'Cybersecurity & Compliance Training',
      time: '02:00 - 04:00 PM',
      category: 'Training',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
      owner: 'Virtual Workshop',
    },
    {
      id: 4,
      day: 12,
      title: 'Q3 Payroll Audit Sign-off',
      time: '11:00 AM Deadline',
      category: 'Deadlines',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
      owner: 'Finance Hub',
    },
    {
      id: 5,
      day: 15,
      title: 'Regional Operations Field Travel',
      time: 'Aug 15 - Aug 18',
      category: 'Travel',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
      owner: 'Mombasa Branch',
    },
    {
      id: 6,
      day: 20,
      title: 'Performance Calibration Session',
      time: '10:00 AM - 12:00 PM',
      category: 'Meetings',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      owner: 'HR Conference Room',
    },
  ]

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  const filteredEvents = calendarEvents.filter(
    (event) => selectedCategory === 'All' || event.category === selectedCategory
  )

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Unified Work Calendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrated schedule for Meetings, Leave, Deadlines, Travel & Training
            </p>
          </div>
        </div>

        {/* Month Selector & Category Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 font-mono text-xs font-bold">
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-slate-800 dark:text-slate-200">{currentMonth}</span>
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>

          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer">
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={14} />
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      {/* MINI CALENDAR GRID */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-center font-mono text-[11px] font-bold text-slate-500 py-2.5">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span className="text-rose-500">SAT</span>
          <span className="text-rose-500">SUN</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
          {daysInMonth.map((day) => {
            const dayEvents = filteredEvents.filter((e) => e.day === day)
            const isToday = day === 1 // Simulation today

            return (
              <div
                key={day}
                className={`min-h-[90px] p-2 space-y-1 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                  isToday ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </div>

                {/* Event Pills */}
                <div className="space-y-1 mt-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-1.5 rounded-lg border text-[10px] font-medium leading-tight shadow-xs ${ev.color}`}
                    >
                      <p className="font-bold truncate">{ev.title}</p>
                      <p className="text-[9px] opacity-80 truncate">{ev.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
