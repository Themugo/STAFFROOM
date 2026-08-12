import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AttendanceLogModal from "@/components/attendance/AttendanceLogModal";
import AttendanceDashboard from "@/components/attendance/AttendanceDashboard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/SkeletonLoaders";
import { useToast } from "@/contexts/ToastContext";
import {
  Plus, Search, Calendar, LogIn, LogOut, Clock, AlertCircle, Download,
  Smartphone, Cpu, Sliders, CheckCircle2, ShieldCheck, MapPin, RefreshCw
} from "lucide-react";

const STATUS_COLORS = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  Absent: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  Late: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  "Half Day": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  Remote: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400",
};

const STATUSES = ["Present", "Absent", "Late", "Half Day", "Remote"];

function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut || checkIn === "-" || checkOut === "-") return null;
  const parseTime = (str) => {
    const isPM = str.toLowerCase().includes("pm");
    const isAM = str.toLowerCase().includes("am");
    let [h, m] = str.replace(/[^\d:]/g, "").split(":").map(Number);
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    return h * 60 + m;
  };

  try {
    const diff = parseTime(checkOut) - parseTime(checkIn);
    if (diff <= 0) return null;
    return (diff / 60).toFixed(1);
  } catch {
    return null;
  }
}

export default function Attendance() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("records");

  // Device & Terminal management state
  const [devices, setDevices] = useState([
    { id: "dev_1", name: "HQ Lobby Biometric Terminal #1", type: "Biometric Scanner", location: "Building A Entrance", status: "Online", ip: "192.168.1.102", last_ping: "2 mins ago" },
    { id: "dev_2", name: "Mobile GPS Geo-Fence Terminal", type: "Mobile App GPS", location: "Global / Remote", status: "Active", ip: "Dynamic", last_ping: "Just now" },
    { id: "dev_3", name: "Warehouse B Wall Scanner", type: "NFC Reader", location: "Logistics Bay 3", status: "Online", ip: "192.168.1.108", last_ping: "12 mins ago" }
  ]);

  // Attendance Rules State
  const [workRules, setWorkRules] = useState({
    standard_check_in: "09:00",
    standard_check_out: "17:00",
    grace_period_mins: 15,
    overtime_threshold_hrs: 8,
    require_geofence: true
  });

  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    setLoadError(null);
    try {
      const [recs, emps] = await Promise.all([
        base44.entities.AttendanceRecord.list("-date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setRecords(recs);
      setEmployees(emps.filter(e => e.status === "Active" || e.status === "On Leave"));
    } catch {
      setLoadError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleQuickCheckIn = async (emp) => {
    const existing = records.find(r => r.employee_id === emp.id && r.date === today);
    const now = new Date().toTimeString().slice(0, 5);
    const graceTime = "09:15"; // 09:00 + 15 mins grace period
    const isLate = now > graceTime;

    try {
      if (existing) {
        if (!existing.check_out || existing.check_out === "-") {
          await base44.entities.AttendanceRecord.update(existing.id, { check_out: now, check_out_time: now });
        }
      } else {
        await base44.entities.AttendanceRecord.create({
          employee_id: emp.id,
          employee_name: emp.full_name,
          date: today,
          check_in: now,
          check_in_time: now,
          status: isLate ? "Late" : "Present",
          work_location: "Office"
        });
      }
      toast.success("Attendance updated successfully.");
      load();
    } catch {
      toast.error("Failed to record attendance. Please try again.");
    }
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (rec) => { setEditing(rec); setModalOpen(true); };

  const handleSave = async (form) => {
    try {
      if (editing) {
        await base44.entities.AttendanceRecord.update(editing.id, form);
        toast.success("Attendance record updated.");
      } else {
        await base44.entities.AttendanceRecord.create(form);
        toast.success("New attendance record created.");
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save attendance record. Please try again.");
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await base44.entities.AttendanceRecord.delete(confirmDeleteId);
      setRecords(r => r.filter(x => x.id !== confirmDeleteId));
      toast.success("Attendance record deleted successfully.");
      setConfirmDeleteId(null);
    } catch {
      toast.error("Failed to delete record. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["Employee", "Date", "Check In", "Check Out", "Hours", "Status", "Location", "Notes"];
    const rows = filtered.map(r => [
      r.employee_name || "",
      r.date || "",
      r.check_in || r.check_in_time || "-",
      r.check_out || r.check_out_time || "-",
      r.hours_worked || calcHours(r.check_in || r.check_in_time, r.check_out || r.check_out_time) || "0",
      r.status || "Present",
      r.work_location || "Office",
      (r.notes || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-logs-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter(r => {
    const matchSearch = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchDate = !filterDate || r.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const todayRecords = records.filter(r => r.date === today);

  // Anomaly calculation
  const anomalies = useMemo(() => {
    return todayRecords.filter(r => r.status === "Late" || r.status === "Absent");
  }, [todayRecords]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#DCE6F2] dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF3FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 shrink-0 shadow-2xs">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#102A43] dark:text-white">Attendance Operations Center</h2>
            <p className="text-xs sm:text-sm text-[#52677F] dark:text-slate-400 mt-0.5">
              Real-time biometric & digital punch records · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button onClick={exportCSV} variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={openAdd} className="bg-[#2563EB] hover:bg-blue-700 text-white gap-2 shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" /> Log Manual Attendance
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button onClick={load} variant="outline" size="sm" className="h-8 text-xs gap-1 cursor-pointer">
            <RefreshCw size={12} /> Retry
          </Button>
        </div>
      )}

      {/* Quick Check-In Terminal Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Live Time Punch Station — Today</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click staff card to record check-in / check-out. Auto-flagged Late after 09:15 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} /> {todayRecords.filter(r => r.status === 'Present' || r.status === 'Remote').length} Checked In
            </span>
            <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
              <AlertCircle size={12} /> {todayRecords.filter(r => r.status === 'Late').length} Late
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" /> Loading punch panel…
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {employees.map(emp => {
              const rec = todayRecords.find(r => r.employee_id === emp.id);
              const inTime = rec?.check_in || rec?.check_in_time;
              const outTime = rec?.check_out || rec?.check_out_time;
              const isIn = !!rec && (!outTime || outTime === "-");
              const isDone = !!rec && (!!outTime && outTime !== "-");

              return (
                <button
                  key={emp.id}
                  onClick={() => handleQuickCheckIn(emp)}
                  disabled={isDone}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left text-xs transition-all ${
                    isDone
                      ? "bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800 cursor-not-allowed"
                      : isIn
                      ? "bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200"
                      : "bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold truncate max-w-[100px]">{emp.full_name}</span>
                    {isDone ? <LogOut className="w-3.5 h-3.5 text-slate-400" /> : isIn ? <LogOut className="w-3.5 h-3.5 text-amber-600" /> : <LogIn className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">
                    {inTime ? `${inTime}${outTime && outTime !== "-" ? ` → ${outTime}` : " (In)"}` : "Not Checked In"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Attendance Anomalies Banner */}
      {anomalies.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-800 p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {anomalies.length} Attendance Anomalies Detected Today
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Staff flagged: {anomalies.map(a => a.employee_name).join(", ")}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs border-amber-300 text-amber-800 hover:bg-amber-100" onClick={() => setTab("records")}>
            View Log Details
          </Button>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
          <TabsTrigger value="records" className="rounded-lg text-xs px-4">Punch Logs & Records</TabsTrigger>
          <TabsTrigger value="dashboard" className="rounded-lg text-xs px-4">Attendance Analytics</TabsTrigger>
          <TabsTrigger value="devices" className="rounded-lg text-xs px-4">Terminals & Biometrics</TabsTrigger>
          <TabsTrigger value="rules" className="rounded-lg text-xs px-4">Attendance Rules & Policies</TabsTrigger>
        </TabsList>

        {/* RECORDS TAB */}
        <TabsContent value="records" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search employee name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Input type="date" className="h-9 text-sm w-auto" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-sm w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-4">
                <SkeletonTable rows={5} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Clock}
                  title="No Attendance Logs Found"
                  description="No time punch or manual attendance records match your current search and filters."
                  action={
                    <Button
                      onClick={() => { setSearch(""); setFilterDate(""); setFilterStatus("all"); }}
                      variant="outline"
                      className="text-xs cursor-pointer"
                    >
                      Reset Filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="text-left px-5 py-3.5">Employee</th>
                      <th className="text-left px-4 py-3.5">Date</th>
                      <th className="text-left px-4 py-3.5">Check In</th>
                      <th className="text-left px-4 py-3.5">Check Out</th>
                      <th className="text-left px-4 py-3.5">Total Hours</th>
                      <th className="text-left px-4 py-3.5">Location</th>
                      <th className="text-left px-4 py-3.5">Status</th>
                      <th className="text-left px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(rec => {
                      const inTime = rec.check_in || rec.check_in_time || "—";
                      const outTime = rec.check_out || rec.check_out_time || "—";
                      const hrs = rec.hours_worked || calcHours(inTime, outTime);

                      return (
                        <tr key={rec.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{rec.employee_name}</td>
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{rec.date}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">{inTime}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">{outTime}</td>
                          <td className="px-4 py-3.5">
                            {hrs ? <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{hrs}h</span> : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400" />
                              {rec.work_location || "Office"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge className={`text-xs border ${STATUS_COLORS[rec.status] || ""}`}>{rec.status}</Badge>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs max-w-[140px] truncate">{rec.notes || "—"}</td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(rec)} className="text-xs font-medium text-slate-500 hover:text-indigo-600">Edit</button>
                              <button onClick={() => handleDelete(rec.id)} className="text-xs font-medium text-red-400 hover:text-red-600">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="mt-4">
          <AttendanceDashboard records={records} employees={employees} />
        </TabsContent>

        {/* DEVICES TAB */}
        <TabsContent value="devices" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Registered Biometric & Terminal Devices</h3>
            <Button size="sm" className="bg-indigo-600 text-white gap-1.5 text-xs">
              <Plus size={14} /> Register New Terminal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map(dev => (
              <div key={dev.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                      {dev.type.includes("Mobile") ? <Smartphone size={18} /> : <Cpu size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{dev.name}</h4>
                      <p className="text-xs text-slate-400">{dev.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {dev.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p>Location: <span className="font-medium text-slate-700 dark:text-slate-200">{dev.location}</span></p>
                  <p>IP Address: <span className="font-mono text-slate-700 dark:text-slate-200">{dev.ip}</span></p>
                  <p>Last Sync: <span className="text-slate-400">{dev.last_ping}</span></p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* RULES TAB */}
        <TabsContent value="rules" className="mt-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Attendance Threshold & Punctuality Rules</h3>
                <p className="text-xs text-slate-500">Configure global grace periods, shift boundaries, and geofencing limits</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Standard Workday Start</label>
                <Input
                  type="time"
                  value={workRules.standard_check_in}
                  onChange={e => setWorkRules(r => ({ ...r, standard_check_in: e.target.value }))}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Standard Workday End</label>
                <Input
                  type="time"
                  value={workRules.standard_check_out}
                  onChange={e => setWorkRules(r => ({ ...r, standard_check_out: e.target.value }))}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grace Period (Minutes)</label>
                <Input
                  type="number"
                  value={workRules.grace_period_mins}
                  onChange={e => setWorkRules(r => ({ ...r, grace_period_mins: Number(e.target.value) }))}
                  className="mt-1 h-9 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Arrivals after 09:15 AM are flagged Late</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Daily Overtime Threshold (Hours)</label>
                <Input
                  type="number"
                  value={workRules.overtime_threshold_hrs}
                  onChange={e => setWorkRules(r => ({ ...r, overtime_threshold_hrs: Number(e.target.value) }))}
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button size="sm" className="bg-indigo-600 text-white">Save Attendance Rules</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AttendanceLogModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
        employees={employees}
      />

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDelete}
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
        confirmLabel="Delete Record"
        danger={true}
        loading={deleting}
      />
    </div>
  );
}
