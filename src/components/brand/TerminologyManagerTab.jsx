import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  BookOpen,
  Sparkles,
  RefreshCw,
  Building,
  Heart,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Search,
  ArrowRight
} from 'lucide-react'

const TERMINOLOGY_PRESETS = {
  default: {
    name: 'Standard Corporate HCM',
    icon: Briefcase,
    terms: {
      Employee: 'Employee',
      Employees: 'Employees',
      Department: 'Department',
      Departments: 'Departments',
      Manager: 'Manager',
      Managers: 'Managers',
      Leave: 'Leave',
      HR: 'HR & People',
      Branch: 'Branch',
      Branches: 'Branches',
      Company: 'Company',
      Vehicle: 'Vehicle',
      Vehicles: 'Vehicles',
      Project: 'Project',
      Approval: 'Approval'
    }
  },
  healthcare: {
    name: 'Healthcare & Clinical',
    icon: Heart,
    terms: {
      Employee: 'Staff Clinician',
      Employees: 'Clinical Staff',
      Department: 'Medical Ward',
      Departments: 'Medical Wards',
      Manager: 'Chief Consultant',
      Managers: 'Chief Consultants',
      Leave: 'Duty Shift Relief',
      HR: 'Clinical Human Resources',
      Branch: 'Hospital Branch',
      Branches: 'Hospital Branches',
      Company: 'Health Network',
      Vehicle: 'Ambulance / Mobile Unit',
      Vehicles: 'Ambulances / Fleet Units',
      Project: 'Clinical Initiative',
      Approval: 'Medical Director Sign-off'
    }
  },
  higher_education: {
    name: 'Higher Education & Campus',
    icon: GraduationCap,
    terms: {
      Employee: 'Faculty Member',
      Employees: 'Faculty & Staff',
      Department: 'Academic Department',
      Departments: 'Academic Departments',
      Manager: 'Dean of Faculty',
      Managers: 'Deans',
      Leave: 'Academic Sabbatical / Leave',
      HR: 'Academic Affairs & HR',
      Branch: 'University Campus',
      Branches: 'University Campuses',
      Company: 'Institution',
      Vehicle: 'Campus Shuttle',
      Vehicles: 'Campus Shuttles',
      Project: 'Research Grant',
      Approval: 'Senate Authorization'
    }
  },
  government: {
    name: 'Public Sector & Government',
    icon: ShieldAlert,
    terms: {
      Employee: 'Public Officer',
      Employees: 'Public Officers',
      Department: 'Directorate',
      Departments: 'Directorates',
      Manager: 'Director General',
      Managers: 'Director Generals',
      Leave: 'Official Duty Leave',
      HR: 'Public Service Commission',
      Branch: 'Regional Depot',
      Branches: 'Regional Depots',
      Company: 'State Authority',
      Vehicle: 'Government Fleet Unit',
      Vehicles: 'Government Fleet Units',
      Project: 'National Programme',
      Approval: 'Cabinet Sanction'
    }
  },
  ngo: {
    name: 'NGO & International Development',
    icon: Building,
    terms: {
      Employee: 'Field Specialist',
      Employees: 'Field Specialists',
      Department: 'Program Pillar',
      Departments: 'Program Pillars',
      Manager: 'Country Director',
      Managers: 'Country Directors',
      Leave: 'Field Rest & Recuperation',
      HR: 'People & Operations',
      Branch: 'Field Office',
      Branches: 'Field Offices',
      Company: 'Organization',
      Vehicle: 'Field 4x4 Vehicle',
      Vehicles: 'Field 4x4 Vehicles',
      Project: 'Grant Project',
      Approval: 'HQ Sign-Off'
    }
  }
}

export default function TerminologyManagerTab({ onNotify }) {
  const { brandConfig, updateBrandConfig } = useBrand()
  const [searchTerm, setSearchTerm] = useState('')

  const currentTerms = brandConfig.terminology || TERMINOLOGY_PRESETS.default.terms

  const handleTermChange = (key, val) => {
    updateBrandConfig({
      terminology: {
        ...currentTerms,
        [key]: val
      }
    })
    if (onNotify) onNotify(`Renamed '${key}' to '${val}' across system`)
  }

  const applyPreset = (presetKey) => {
    const preset = TERMINOLOGY_PRESETS[presetKey]
    if (!preset) return
    updateBrandConfig({
      terminology: { ...preset.terms }
    })
    if (onNotify) onNotify(`Applied Terminology Dictionary: ${preset.name}`)
  }

  const filteredKeys = Object.keys(currentTerms).filter(
    (k) =>
      k.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currentTerms[k].toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <BookOpen size={13} className="text-cyan-400" />
            Centralized Organization Terminology & Dictionary Manager
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Customize StaffRoom Core Concept Names
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Rename standard terms (such as Employee, Department, Manager, Leave, Vehicle, Branch) to match your organizational lexicon. Every page and module updates dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Total Custom Terms:</span>
          <strong className="text-cyan-300 font-bold">{Object.keys(currentTerms).length}</strong>
        </div>
      </div>

      {/* INDUSTRY DICTIONARY PRESETS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Industry Lexicon Presets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(TERMINOLOGY_PRESETS).map(([key, preset]) => {
            const Icon = preset.icon
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500 text-left transition-all cursor-pointer space-y-2"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 w-fit shadow-sm">
                  <Icon size={16} />
                </div>
                <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                  {preset.name}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">
                  e.g. {preset.terms.Employee}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* DICTIONARY EDITOR LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              Live Terminology Dictionary
            </h3>
            <p className="text-xs text-slate-500">Edit the display labels used throughout StaffRoom UI components.</p>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-1.5 pl-7 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKeys.map((key) => (
            <div
              key={key}
              className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span>System Key:</span>
                <strong className="text-slate-800 dark:text-slate-200">{key}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[10px] shrink-0">Default: {key}</span>
                <ArrowRight size={12} className="text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={currentTerms[key]}
                  onChange={(e) => handleTermChange(key, e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
