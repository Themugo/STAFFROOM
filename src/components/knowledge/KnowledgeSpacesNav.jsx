import React from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  Globe,
  Users,
  DollarSign,
  Shield,
  Activity,
  Briefcase,
  Folder,
  Layers,
  Lock,
  ChevronRight,
  Check
} from 'lucide-react'

const ICON_MAP = {
  Globe: Globe,
  Users: Users,
  DollarSign: DollarSign,
  Shield: Shield,
  Activity: Activity,
  Briefcase: Briefcase
}

export default function KnowledgeSpacesNav({ selectedSpaceId, onSelectSpace }) {
  const { spaces, documents } = useKnowledge()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-indigo-600" />
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Organizational Knowledge Spaces
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400">
          {spaces.length} Spaces
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* ALL SPACES BUTTON */}
        <button
          onClick={() => onSelectSpace('ALL')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
            selectedSpaceId === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${selectedSpaceId === 'ALL' ? 'bg-indigo-500/40 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>
              <Folder size={16} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${selectedSpaceId === 'ALL' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
              {documents.length} Docs
            </span>
          </div>

          <div>
            <strong className="block text-xs font-bold leading-snug">
              All Knowledge Spaces
            </strong>
            <span className={`text-[10px] block font-mono mt-0.5 ${selectedSpaceId === 'ALL' ? 'text-indigo-200' : 'text-slate-400'}`}>
              Global Repository
            </span>
          </div>
        </button>

        {/* INDIVIDUAL SPACES */}
        {spaces.map((sp) => {
          const IconComponent = ICON_MAP[sp.icon] || Folder
          const isSelected = selectedSpaceId === sp.id
          const spaceDocs = documents.filter((d) => d.spaceId === sp.id)

          return (
            <button
              key={sp.id}
              onClick={() => onSelectSpace(sp.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-500/40 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>
                  <IconComponent size={16} />
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                  {spaceDocs.length}
                </span>
              </div>

              <div>
                <strong className="block text-xs font-bold leading-snug truncate">
                  {sp.name}
                </strong>
                <span className={`text-[10px] block font-mono mt-0.5 truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {sp.access}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
