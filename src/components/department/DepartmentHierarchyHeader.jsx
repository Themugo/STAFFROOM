import React from 'react'
import { Layers, ShieldCheck, Lock, ChevronRight, Building2, User, Users, CheckCircle2 } from 'lucide-react'

export default function DepartmentHierarchyHeader({ currentDept, isElevatedRole }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#DCE6F2] space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE6F2] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#2563EB] text-white font-bold shadow-2xs">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-[#2563EB] tracking-wider">
                StaffRoom Department Operating System
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20">
                DB-Isolated Scope
              </span>
            </div>
            <h2 className="text-xl font-black text-[#102A43] flex items-center gap-2">
              {currentDept.name} Operational Workspace
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#F6F9FD] text-[#52677F] border border-[#DCE6F2]">
                {currentDept.code}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-[#52677F] flex items-center gap-2">
            <User size={14} className="text-[#2563EB]" />
            <span>HOD: <strong className="text-[#102A43]">{currentDept.head || 'Department Manager'}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-[#52677F] flex items-center gap-2">
            <Users size={14} className="text-[#159A68]" />
            <span>Headcount: <strong className="text-[#102A43]">{currentDept.memberCount || 28}</strong></span>
          </div>
        </div>
      </div>

      {/* Hierarchy Flow Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#52677F] font-mono">
          <span className="flex items-center gap-1.5">
            <Layers size={13} className="text-[#2563EB]" /> Policy Hierarchy & Governance Cascade
          </span>
          <span className="text-[#159A68] flex items-center gap-1 font-bold">
            <CheckCircle2 size={12} /> Local Rule Enforcement Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-medium">
          {/* Level 1: Global Policy */}
          <div className="p-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#2563EB] font-mono uppercase block">1. Global Org Policy</span>
              <p className="font-bold text-[#102A43] text-[11px]">StaffRoom Platform Rules</p>
              <p className="text-[10px] text-[#7890A8]">Org Limits & Compliance</p>
            </div>
            <Lock size={14} className="text-[#7890A8] shrink-0" />
          </div>

          {/* Level 2: Department Config */}
          <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#2563EB]/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#2563EB] font-mono uppercase block">2. Dept Configuration</span>
              <p className="font-bold text-[#2563EB] text-[11px]">{currentDept.code} Workflows & SOPs</p>
              <p className="text-[10px] text-[#52677F]">Manager Self-Configured</p>
            </div>
            <ShieldCheck size={14} className="text-[#2563EB] shrink-0" />
          </div>

          {/* Level 3: Team Config */}
          <div className="p-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#7890A8] font-mono uppercase block">3. Team Roster & Shifts</span>
              <p className="font-bold text-[#102A43] text-[11px]">Sub-Team Allocations</p>
              <p className="text-[10px] text-[#7890A8]">Duty Schedule & Tasks</p>
            </div>
            <ChevronRight size={14} className="text-[#7890A8] shrink-0" />
          </div>

          {/* Level 4: Individual Assignment */}
          <div className="p-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#7890A8] font-mono uppercase block">4. Individual Assignment</span>
              <p className="font-bold text-[#102A43] text-[11px]">Direct Member Workload</p>
              <p className="text-[10px] text-[#7890A8]">Personal Tasks & KPI Target</p>
            </div>
            <ChevronRight size={14} className="text-[#7890A8] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
