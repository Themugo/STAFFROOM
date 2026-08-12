import { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText, ShieldCheck, Plus, CheckCircle2, AlertCircle, Eye, RefreshCw, BookOpen, Users, Clock, Download
} from "lucide-react";

export default function PolicyCenter() {
  const [policies, setPolicies] = useState([
    {
      id: "pol_1",
      title: "Annual Leave & Paid Time Off Policy",
      code: "POL-HR-2026-01",
      category: "Leave",
      version: "v3.2",
      updated: "2026-01-15",
      status: "Active",
      acknowledgedCount: 24,
      totalCount: 24,
      summary: "Governs entitlement rules, rollover limits (max 5 days), probation restrictions (90 days), and multi-step manager approvals.",
      documents_required: ["Medical certificate for 3+ consecutive sick days"]
    },
    {
      id: "pol_2",
      title: "Attendance, Punctuality & Remote Work Rules",
      code: "POL-HR-2026-02",
      category: "Attendance",
      version: "v2.1",
      updated: "2026-03-01",
      status: "Active",
      acknowledgedCount: 23,
      totalCount: 24,
      summary: "Defines core working hours (09:00 - 17:00), 15-minute grace period, mobile GPS punch rules, and hybrid remote work eligibility.",
      documents_required: ["Remote location safety declaration"]
    },
    {
      id: "pol_3",
      title: "Code of Conduct & Workplace Ethics",
      code: "POL-ETH-2026-01",
      category: "Governance",
      version: "v4.0",
      updated: "2026-01-02",
      status: "Active",
      acknowledgedCount: 24,
      totalCount: 24,
      summary: "Comprehensive professional guidelines on anti-harassment, data privacy, social media usage, and conflict of interest declarations.",
      documents_required: ["Signed Acknowledgement Form"]
    },
    {
      id: "pol_4",
      title: "Travel & Expense Reimbursement Guidelines",
      code: "POL-FIN-2026-03",
      category: "Financials",
      version: "v1.4",
      updated: "2026-05-10",
      status: "Active",
      acknowledgedCount: 21,
      totalCount: 24,
      summary: "Daily per diem rates, flight booking class limits, meal expense receipt thresholds, and 14-day claim submission deadline.",
      documents_required: ["Itemized VAT Receipts", "Manager pre-approval email"]
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [testDays, setTestDays] = useState(10);
  const [testTenureMonths, setTestTenureMonths] = useState(12);

  const filtered = policies.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" /> HR Policy & Compliance Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized policy repository, version control & staff compliance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.location.href = createPageUrl("BusinessRulesStudio")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-md cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Launch Zero-Code Business Rules Studio
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Publish New Policy
          </Button>
        </div>
      </div>

      {/* Compliance Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Policies</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{policies.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Global Staff Compliance</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">96.8%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Signatures</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">3 Staff</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Users size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Grid */}
        <div className="lg:col-span-2 space-y-4">
          <Input
            placeholder="Search policies by title, code, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 text-sm"
          />

          <div className="space-y-3">
            {filtered.map(policy => (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm cursor-pointer hover:border-indigo-500 transition-all ${
                  selectedPolicy?.id === policy.id ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-base">{policy.title}</span>
                      <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-0 text-[10px]">
                        {policy.code}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{policy.summary}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 text-xs shrink-0">
                    {policy.version}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Updated: {policy.updated}</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {policy.acknowledgedCount}/{policy.totalCount} Staff Acknowledged
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Detail & Rules Simulator */}
        <div className="space-y-4">
          {selectedPolicy ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px]">
                  {selectedPolicy.category} Category
                </Badge>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mt-1">{selectedPolicy.title}</h4>
                <p className="text-xs text-slate-400">Code: {selectedPolicy.code} · Revision {selectedPolicy.version}</p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Policy Scope & Objective</span>
                  <p>{selectedPolicy.summary}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Mandatory Supporting Documents</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                    {selectedPolicy.documents_required.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policy Rule Simulator */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h5 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <RefreshCw size={12} className="text-indigo-600" /> Policy Rule Eligibility Simulator
                </h5>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Tenure (Months)</label>
                    <Input
                      type="number"
                      value={testTenureMonths}
                      onChange={e => setTestTenureMonths(Number(e.target.value))}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Requested Days</label>
                    <Input
                      type="number"
                      value={testDays}
                      onChange={e => setTestDays(Number(e.target.value))}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-medium ${
                  testTenureMonths < 3
                    ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}>
                  {testTenureMonths < 3 ? (
                    <p> probation status restriction: Employee must complete 3 months probation before taking paid leave.</p>
                  ) : (
                    <p> Eligible under policy limits! Request falls within normal entitlement brackets.</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  <Download size={14} /> Download PDF Policy
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-xs">
              Select any policy from the repository to view rule parameters, required document specs, and test eligibility via the Simulator.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
