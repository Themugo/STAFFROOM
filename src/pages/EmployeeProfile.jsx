import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  ShieldCheck,
  Award,
  FileText,
  Laptop,
  Clock,
  Palmtree,
  TrendingUp,
  GraduationCap,
  Edit3,
  Plus,
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  ExternalLink,
  Sparkles,
  Users,
  ShieldAlert,
  Layers,
  Send,
  KeyRound,
  UserCheck,
  MoreHorizontal,
  Bus
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Spinner from "@/components/ui/Spinner";
import EmployeeModal from "@/components/staff/EmployeeModal";

// Subcomponents for tabs
import { OverviewTab } from "@/components/staff/profile/OverviewTab";
import { PersonalTab } from "@/components/staff/profile/PersonalTab";
import { EmploymentOrgTab } from "@/components/staff/profile/EmploymentOrgTab";
import { TimelineTab } from "@/components/staff/profile/TimelineTab";
import { DocumentCenterTab } from "@/components/staff/profile/DocumentCenterTab";
import { LeaveWorkspaceTab } from "@/components/staff/profile/LeaveWorkspaceTab";
import { AttendanceWorkspaceTab } from "@/components/staff/profile/AttendanceWorkspaceTab";
import { PayrollWorkspaceTab } from "@/components/staff/profile/PayrollWorkspaceTab";
import { PerformanceWorkspaceTab } from "@/components/staff/profile/PerformanceWorkspaceTab";
import { TrainingSkillsTab } from "@/components/staff/profile/TrainingSkillsTab";
import { AssetManagementTab } from "@/components/staff/profile/AssetManagementTab";
import { AuditLogTab } from "@/components/staff/profile/AuditLogTab";
import { EmployeeTransportTab } from "@/components/staff/profile/EmployeeTransportTab";

const PROFILE_TABS = [
  { id: "overview", label: "360° Overview", icon: User },
  { id: "personal", label: "Personal & Family", icon: Users },
  { id: "employment", label: "Employment & Org", icon: Building2 },
  { id: "transport", label: "Transport Profile", icon: Bus },
  { id: "timeline", label: "Timeline & Activity", icon: History },
  { id: "documents", label: "Document Center", icon: FileText },
  { id: "leave", label: "Leave Workspace", icon: Palmtree },
  { id: "attendance", label: "Attendance Log", icon: Clock },
  { id: "payroll", label: "Payroll History", icon: DollarSign },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "training", label: "Training & Skills", icon: GraduationCap },
  { id: "assets", label: "Assigned Assets", icon: Laptop },
  { id: "audit", label: "Audit Log", icon: ShieldAlert },
];

import { useToast } from "@/contexts/ToastContext";

export default function EmployeeProfile() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const empId = searchParams.get("id") || "emp_1";

  const [employee, setEmployee] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Collections
  const [documents, setDocuments] = useState([
    { id: "doc_1", name: "Employment Contract 2024.pdf", category: "Contract", date: "2024-01-15", size: "2.4 MB", status: "Signed" },
    { id: "doc_2", name: "Non-Disclosure Agreement (NDA).pdf", category: "Legal", date: "2024-01-15", size: "1.1 MB", status: "Signed" },
    { id: "doc_3", name: "W-4 Tax Withholding Form.pdf", category: "Tax", date: "2024-01-20", size: "850 KB", status: "Verified" },
    { id: "doc_4", name: "Emergency Contact Consent.pdf", category: "HR", date: "2024-02-01", size: "520 KB", status: "Signed" },
  ]);

  const [assets, setAssets] = useState([
    { id: "ast_1", name: 'MacBook Pro 16" M3 Max', serial: "C02G401XMD6R", category: "Hardware", status: "Active", assignedDate: "2024-01-15" },
    { id: "ast_2", name: 'Dell UltraSharp 32" 4K Monitor', serial: "CN-093412-881", category: "Hardware", status: "Active", assignedDate: "2024-01-16" },
    { id: "ast_3", name: "YubiKey 5C NFC Security Key", serial: "YK-9940123", category: "Security", status: "Active", assignedDate: "2024-01-15" },
    { id: "ast_4", name: "Figma Enterprise License", serial: "FIG-ENT-8841", category: "Software", status: "Active", assignedDate: "2024-01-20" },
  ]);

  const [trainingRecords] = useState([
    { id: "trn_1", course: "Annual Information Security & Compliance 2026", progress: 100, status: "Completed", completedDate: "2026-02-10" },
    { id: "trn_2", course: "Inclusive Leadership & Workplace Dynamics", progress: 100, status: "Completed", completedDate: "2025-09-15" },
    { id: "trn_3", course: "Advanced Data Analytics with Python & SQL", progress: 65, status: "In Progress", dueDate: "2026-08-30" },
  ]);

  const [timeline] = useState([
    { id: "t1", event: "Annual Salary Review Approved", date: "2026-01-15", type: "compensation", details: "Base salary adjusted by +8.5% for high performance." },
    { id: "t2", event: "Q4 Performance Review Completed", date: "2025-12-20", type: "performance", details: "Rating: 4.8 / 5.0 (Exceeds Expectations)." },
    { id: "t3", event: "Promoted to Senior Position", date: "2024-07-01", type: "career", details: "Transitioned role level and expanded team responsibilities." },
    { id: "t4", event: "Completed Information Security Certification", date: "2024-02-10", type: "training", details: "Scored 98% on compliance examination." },
    { id: "t5", event: "Joined STAFFROOM Enterprise Roster", date: "2021-03-15", type: "onboarding", details: "Official start date." },
  ]);

  const loadEmployeeWorkspace = async () => {
    setLoading(true);
    try {
      const emps = await base44.entities.Employee.list();
      setAllEmployees(emps || []);
      const emp = emps.find((e) => e.id === empId) || emps[0];
      setEmployee(emp);

      if (emp) {
        const [atts, leaves, pays] = await Promise.all([
          base44.entities.AttendanceRecord.filter({ employee_id: emp.id }),
          base44.entities.LeaveRequest.filter({ employee_id: emp.id }),
          base44.entities.PayrollRecord.filter({ employee_id: emp.id }),
        ]);
        setAttendance(atts || []);
        setLeaveRequests(leaves || []);
        setPayrollRecords(pays || []);
      }
    } catch (err) {
      console.error("Error loading employee profile workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeWorkspace();
  }, [empId]);

  const handleUpdateEmployee = async (updatedData) => {
    try {
      await base44.entities.Employee.update(employee.id, updatedData);
      setEmployee((prev) => ({ ...prev, ...updatedData }));
      toast.success("Employee profile updated.");
      setEditModalOpen(false);
    } catch (err) {
      toast.error("Failed to update employee profile.");
    }
  };

  const handleUploadDocument = () => {
    const docName = prompt("Enter document name (e.g. Updated Tax Clearance.pdf):");
    if (!docName) return;
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: docName,
      category: "Upload",
      date: new Date().toISOString().split("T")[0],
      size: "1.2 MB",
      status: "Verified",
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleAssignAsset = () => {
    const assetName = prompt("Enter asset name (e.g. iPad Pro 12.9):");
    if (!assetName) return;
    const newAsset = {
      id: `ast_${Date.now()}`,
      name: assetName,
      serial: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      category: "Hardware",
      status: "Active",
      assignedDate: new Date().toISOString().split("T")[0],
    };
    setAssets((prev) => [newAsset, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 font-medium">Loading 360° employee workspace...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-slate-100 dark:border-slate-800">
        <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Employee Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested profile record could not be loaded.</p>
        <Link
          to={createPageUrl("Staff")}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Staff Directory
        </Link>
      </div>
    );
  }

  const initials = employee.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={createPageUrl("Staff")}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Back to Staff Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Employee Workspace</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive 360° talent record & workspace</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Switcher */}
          <select
            value={employee.id}
            onChange={(e) => navigate(createPageUrl("EmployeeProfile", { id: e.target.value }))}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {allEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name} ({e.job_title})
              </option>
            ))}
          </select>

          <button
            onClick={() => toast.info(`Direct message dispatched to ${employee.full_name}`)}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Header Banner Card */}
      <div className="bg-white rounded-3xl border border-[#DCE6F2] shadow-2xs overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-[#102A43] via-[#1E3A8A] to-[#2563EB] relative" />

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#2563EB] text-white font-black text-2xl flex items-center justify-center ring-4 ring-white shadow-md shrink-0">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-black text-[#102A43] tracking-tight">{employee.full_name}</h2>
                <StatusBadge status={employee.status || "Active"} />
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20">
                  {employee.department}
                </span>
                <span className="text-xs font-mono text-[#52677F]">ID: {employee.id}</span>
              </div>
              <p className="text-xs font-semibold text-[#52677F]">
                {employee.job_title} • {employee.employment_type || "Full-Time"}
              </p>
              <div className="flex items-center gap-4 text-xs text-[#52677F] pt-1 flex-wrap">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#2563EB]" /> {employee.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#2563EB]" /> {employee.phone || "+1 (555) 019-2834"}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> {employee.location || "HQ - Austin, TX"}</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="p-3.5 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] shrink-0 w-full md:w-56 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#52677F]">Profile Completion</span>
              <span className="text-[#2563EB] font-extrabold">95%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "95%" }} />
            </div>
            <p className="text-[10px] text-[#52677F]">1 missing document (Medical Waiver)</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-[#DCE6F2]">
        {PROFILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-2xs font-bold"
                  : "bg-[#F6F9FD] text-[#52677F] border border-[#DCE6F2] hover:bg-white hover:text-[#102A43]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            employee={employee}
            leaveRequests={leaveRequests}
            assets={assets}
            documents={documents}
            payrollRecords={payrollRecords}
            attendance={attendance}
            timeline={timeline}
          />
        )}
        {activeTab === "personal" && <PersonalTab employee={employee} />}
        {activeTab === "employment" && <EmploymentOrgTab employee={employee} allEmployees={allEmployees} />}
        {activeTab === "transport" && <EmployeeTransportTab employee={employee} />}
        {activeTab === "timeline" && <TimelineTab timeline={timeline} />}
        {activeTab === "documents" && <DocumentCenterTab documents={documents} onUploadDocument={handleUploadDocument} />}
        {activeTab === "leave" && <LeaveWorkspaceTab leaveRequests={leaveRequests} />}
        {activeTab === "attendance" && <AttendanceWorkspaceTab attendance={attendance} />}
        {activeTab === "payroll" && <PayrollWorkspaceTab employee={employee} payrollRecords={payrollRecords} />}
        {activeTab === "performance" && <PerformanceWorkspaceTab />}
        {activeTab === "training" && <TrainingSkillsTab trainingRecords={trainingRecords} />}
        {activeTab === "assets" && <AssetManagementTab assets={assets} onAssignAsset={handleAssignAsset} />}
        {activeTab === "audit" && <AuditLogTab />}
      </div>

      {/* Edit Employee Modal */}
      {editModalOpen && (
        <EmployeeModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateEmployee}
          employee={employee}
        />
      )}
    </div>
  );
}
