import { useState } from 'react'
import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Calendar,
  MapPin,
  Building,
  Mail,
  Briefcase,
  Star,
  CheckCircle2,
  Globe,
  Award,
} from 'lucide-react'

const DIRECTORY_STAFF = [
  {
    id: 's-1',
    name: 'Sarah Jenkins',
    role: 'HR Director',
    dept: 'Human Resources',
    email: 'sarah.jenkins@staffroom.demo',
    phone: '+1 555-019-2831',
    location: 'HQ - New York (Floor 4)',
    status: { label: 'Available', icon: '🟢', note: 'In office until 5 PM' },
    skills: ['Talent Acquisition', 'Labor Compliance', 'Employee Retention', 'Policy Design'],
    languages: ['English', 'Spanish'],
    projects: ['Global HR Policy Harmonization'],
    manager: 'Alex Vance (CEO)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 's-2',
    name: 'Elena Rostova',
    role: 'Chief Technology Officer',
    dept: 'ICT & Engineering',
    email: 'elena.rostova@staffroom.demo',
    phone: '+1 555-014-9922',
    location: 'Innovation Hub - San Francisco',
    status: { label: 'Working Remotely', icon: '🏠', note: 'Sprint Planning Phase' },
    skills: ['Cloud Architecture', 'Cybersecurity', 'Kubernetes', 'Disaster Recovery'],
    languages: ['English', 'German'],
    projects: ['Cloud Infrastructure v4.2 Migration'],
    manager: 'Alex Vance (CEO)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: 's-3',
    name: 'Michael Chen',
    role: 'Finance & Payroll Manager',
    dept: 'Finance',
    email: 'michael.chen@staffroom.demo',
    phone: '+1 555-018-4411',
    location: 'HQ - New York (Floor 3)',
    status: { label: 'In Meeting', icon: '📅', note: 'Audit Call with Tax Authority' },
    skills: ['Tax Compliance', 'Financial Modeling', 'Payroll Reconciliation'],
    languages: ['English', 'Mandarin'],
    projects: ['Q3 Budget Rebalance'],
    manager: 'Alex Vance (CEO)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 's-4',
    name: 'David Kim',
    role: 'Transport & Fleet Controller',
    dept: 'Transport Operations',
    email: 'david.kim@staffroom.demo',
    phone: '+1 555-012-7744',
    location: 'Logistics Depot West',
    status: { label: 'Available', icon: '🟢', note: 'Monitoring fleet telemetry' },
    skills: ['Fleet Telemetry', 'Route Optimization', 'Driver SLA Management'],
    languages: ['English', 'Korean'],
    projects: ['Transport Dispatch v2.0'],
    manager: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
]

export default function EnhancedDirectory({ onStartChat }) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')

  const departments = ['ALL', 'Human Resources', 'ICT & Engineering', 'Finance', 'Transport Operations']

  const filteredStaff = DIRECTORY_STAFF.filter(s => {
    const matchDept = selectedDept === 'ALL' || s.dept === selectedDept
    const q = search.toLowerCase()
    const matchQuery = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.skills.some(sk => sk.toLowerCase().includes(q))
    return matchDept && matchQuery
  })

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="text-indigo-600 dark:text-indigo-400" size={24} /> Enhanced Enterprise People Directory
            </h1>
            <p className="text-xs text-slate-500">Live work status, skill matrix, language competencies, active project assignments, and direct contact actions.</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {departments.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedDept === d
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, skill..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Directory Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map(staff => (
          <div key={staff.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
                  <span className="absolute -bottom-1 -right-1 text-sm" title={staff.status.label}>{staff.status.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{staff.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{staff.role}</p>
                  <p className="text-[11px] text-slate-500">{staff.dept}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {staff.status.label}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <p className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {staff.location}</p>
              <p className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> {staff.email}</p>
              <p className="flex items-center gap-1.5"><Briefcase size={13} className="text-slate-400" /> Manager: {staff.manager}</p>
            </div>

            {/* Skills & Projects */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Skills:</span>
                {staff.skills.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Globe size={12} className="text-slate-400" /> Languages: <strong className="text-slate-700 dark:text-slate-300">{staff.languages.join(', ')}</strong>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onStartChat?.(staff)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1 shadow-xs"
              >
                <MessageSquare size={14} /> Send Direct Message
              </button>
              <div className="flex items-center gap-1">
                <a href={`tel:${staff.phone}`} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300" title="Call Extension">
                  <Phone size={14} />
                </a>
                <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300" title="Schedule Meeting">
                  <Calendar size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
