import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Database,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Server,
  Key,
  Globe
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function PlatformAdminView() {
  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (PLATFORM HEALTH METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#2563EB]" /> What Matters (Platform Health & Infrastructure)
          </h2>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            All Systems Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Activity size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                SLA 99.9%
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">API Availability</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">99.99%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Database size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Fast
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">DB Query Latency</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">14 ms</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Globe size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Isolated
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Active Org Tenants</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">12</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Cpu size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Healthy
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Running Background Jobs</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">32</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION & WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-500" /> What Needs My Attention
            </h3>
            <span className="text-[10px] font-mono text-[#526581]">System Warnings</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Expiring SSL Certificate (*.staffroom.app)</strong>
                <span className="text-[11px] text-[#526581]">Expires in 14 days • Auto-renewal queued</span>
              </div>
              <Link to={createPageUrl("SecurityCenter")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Renew
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Worker Node #3 RAM Spike (84%)</strong>
                <span className="text-[11px] text-[#526581]">Auto-scaling container instance triggered</span>
              </div>
              <Link to={createPageUrl("SystemControlCenter")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Inspect
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened Recently
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Platform Logs</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Applied Phase 6 RLS Security Policies</strong>
                <span className="text-[11px] text-[#526581]">Multi-tenant isolation verified on all tables</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Today</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Automated Database Snapshot Completed</strong>
                <span className="text-[11px] text-[#526581]">Point-in-time recovery backup verified</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">3 hrs ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#102A56] dark:text-white">
          What Should I Do Next? (Platform Admin Controls)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to={createPageUrl("SecurityCenter")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Open Security Audit Center</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("SystemControlCenter")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Manage Organization Tenants</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("SystemControlCenter")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Configure Global Feature Flags</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
