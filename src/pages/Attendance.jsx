import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AttendanceLogModal from "@/components/attendance/AttendanceLogModal";
import AttendanceDashboard from "@/components/attendance/AttendanceDashboard";
import { Plus, Search, Calendar, LogIn, LogOut, Clock } from "lucide-react";

const STATUS_COLORS = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  "Half Day": "bg-blue-50 text-blue-700 border-blue-200",
  Remote: "bg-violet-50 text-violet-700 border-violet-200",
};

const STATUSES = ["Present", "Absent", "Late", "Half Day", "Remote"];

function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (diff <= 0) return null;
  return (diff / 60).toFixed(1);
}

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [checkingIn, setCheckingIn] = useState(null); // employee id being checked in
  const [tab, setTab] = useState("records");

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

  // Quick check-in: find or create today's record for an employee
  const handleQuickCheckIn = async (emp) => {
    const existing = records.find(r => r.employee_id === emp.id && r.date === today);
    const now = new Date().toTimeString().slice(0, 5);
    const workStart = "09:00";
    const isLate = now > workStart;
    try {
      if (existing) {
        if (!existing.check_out) {
          await base44.entities.AttendanceRecord.update(existing.id, { check_out: now });
        }
      } else {
        await base44.entities.AttendanceRecord.create({
          employee_id: emp.id,
          employee_name: emp.full_name,
          date: today,
          check_in: now,
          status: isLate ? "Late" : "Present",
        });
      }
      load();
    } catch {
      alert("Failed to record attendance. Please try again.");
    }
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (rec) => { setEditing(rec); setModalOpen(true); };

  const handleSave = async (form) => {
    try {
      if (editing) {
        await base44.entities.AttendanceRecord.update(editing.id, form);
      } else {
        await base44.entities.AttendanceRecord.create(form);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      alert("Failed to save attendance record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await base44.entities.AttendanceRecord.delete(id);
      // Previously updated local state optimistically regardless of whether
      // the delete actually succeeded — if it failed, the record would
      // disappear from the UI while still existing on the backend, with no
      // indication anything was wrong. Now only removed from view once the
      // delete is confirmed to have worked.
      setRecords(r => r.filter(x => x.id !== id));
    } catch {
      alert("Failed to delete record. Please try again.");
    }
  };

  const filtered = records.filter(r => {
    const matchSearch = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchDate = !filterDate || r.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  // Today's records for quick check-in panel
  const todayRecords = records.filter(r => r.date === today);
  const checkedInIds = new Set(todayRecords.map(r => r.employee_id));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Today: {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Button onClick={openAdd} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> Log Attendance
        </Button>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Quick Check-In Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Quick Check-In / Check-Out — Today
        </p>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" /> Loading…
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {employees.map(emp => {
              const rec = todayRecords.find(r => r.employee_id === emp.id);
              const isIn = !!rec && !rec.check_out;
              const isDone = !!rec && !!rec.check_out;
              return (
                <button
                  key={emp.id}
                  onClick={() => handleQuickCheckIn(emp)}
                  disabled={isDone}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isDone
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      : isIn
                      ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {isDone ? <LogOut className="w-3.5 h-3.5" /> : isIn ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                  <span>{emp.full_name.split(" ")[0]}</span>
                  {rec?.check_in && <span className="text-gray-400">{rec.check_in}{rec.check_out ? `→${rec.check_out}` : ""}</span>}
                </button>
              );
            })}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-3">Click to check in (first click) or check out (second click). After 09:00 is automatically marked as Late.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="records" className="rounded-lg text-xs px-4">Records</TabsTrigger>
          <TabsTrigger value="dashboard" className="rounded-lg text-xs px-4">Dashboard & Analytics</TabsTrigger>
        </TabsList>

        {/* RECORDS TAB */}
        <TabsContent value="records" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} />
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

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => {
              const count = records.filter(r => r.status === s).length;
              return count > 0 ? (
                <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${STATUS_COLORS[s]} ${filterStatus === s ? "ring-2 ring-offset-1 ring-current" : ""}`}>
                  {s}: {count}
                </button>
              ) : null;
            })}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Calendar className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                      <th className="text-left px-5 py-3.5">Employee</th>
                      <th className="text-left px-4 py-3.5">Date</th>
                      <th className="text-left px-4 py-3.5">Check In</th>
                      <th className="text-left px-4 py-3.5">Check Out</th>
                      <th className="text-left px-4 py-3.5">Hours</th>
                      <th className="text-left px-4 py-3.5">Status</th>
                      <th className="text-left px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(rec => {
                      const hrs = calcHours(rec.check_in, rec.check_out);
                      return (
                        <tr key={rec.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-800">{rec.employee_name}</td>
                          <td className="px-4 py-3.5 text-gray-500">{rec.date}</td>
                          <td className="px-4 py-3.5 text-gray-500">{rec.check_in || "—"}</td>
                          <td className="px-4 py-3.5 text-gray-500">{rec.check_out || "—"}</td>
                          <td className="px-4 py-3.5">
                            {hrs ? <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{hrs}h</span> : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge className={`text-xs border ${STATUS_COLORS[rec.status] || ""}`}>{rec.status}</Badge>
                          </td>
                          <td className="px-4 py-3.5 text-gray-400 text-xs max-w-[140px] truncate">{rec.notes || "—"}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => openEdit(rec)} className="text-xs text-gray-400 hover:text-gray-700">Edit</button>
                              <button onClick={() => handleDelete(rec.id)} className="text-xs text-red-300 hover:text-red-500">Delete</button>
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
      </Tabs>

      <AttendanceLogModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
        employees={employees}
      />
    </div>
  );
}