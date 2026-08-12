import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bus,
  Wrench,
  Clock,
  Filter,
  Users
} from 'lucide-react'

export const CALENDAR_EVENTS = [
  { id: 'EV-1', date: '2026-08-01', title: 'Morning Shuttle (West Zone)', type: 'RECURRING_TRIP', vehicle: 'KCB 412A Bus' },
  { id: 'EV-2', date: '2026-08-01', title: 'Executive VIP Airport Drop', type: 'RESERVATION', vehicle: 'KDF 555E Sedan' },
  { id: 'EV-3', date: '2026-08-02', title: 'Pickup 4x4 10k km Service', type: 'MAINTENANCE', vehicle: 'KCK 701F Pickup' },
  { id: 'EV-4', date: '2026-08-03', title: 'Naivasha Site Visit Shuttle', type: 'RESERVATION', vehicle: 'KCG 302D SUV' },
  { id: 'EV-5', date: '2026-08-05', title: 'National Public Holiday', type: 'HOLIDAY', vehicle: 'All Fleet' }
]

export default function TransportCalendarView() {
  const [currentMonth, setCurrentMonth] = useState('August 2026')
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL')

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const filteredEvents = CALENDAR_EVENTS.filter(ev =>
    eventTypeFilter === 'ALL' || ev.type === eventTypeFilter
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
            Transport Operations Schedule & Maintenance Calendar
          </h3>
          <p className="text-xs text-slate-500">
            Monthly schedule of vehicle reservations, driver shifts, service bay maintenance, and recurring shuttle trips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-slate-900 dark:text-white">{currentMonth}</span>
            <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Filters */}
      <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <span className="text-slate-400 font-bold shrink-0">Filter Event Category:</span>
        {['ALL', 'RESERVATION', 'RECURRING_TRIP', 'MAINTENANCE', 'HOLIDAY'].map((t) => (
          <button
            key={t}
            onClick={() => setEventTypeFilter(t)}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              eventTypeFilter === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {t === 'ALL' ? 'All Schedule Events' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Calendar Grid View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-400 uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs">
          {days.map((d) => {
            const dayFormatted = `2026-08-${d < 10 ? '0' + d : d}`
            const dayEvs = filteredEvents.filter(e => e.date === dayFormatted)

            return (
              <div
                key={d}
                className="min-h-[90px] p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <span className="font-mono font-bold text-slate-400 text-[11px]">{d}</span>

                <div className="space-y-1">
                  {dayEvs.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-1.5 rounded-lg text-[10px] font-bold leading-tight ${
                        ev.type === 'MAINTENANCE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : ev.type === 'RECURRING_TRIP'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ev.type === 'HOLIDAY'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      <div className="truncate">{ev.title}</div>
                      <span className="text-[9px] opacity-80 block truncate">{ev.vehicle}</span>
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
