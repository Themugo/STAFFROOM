import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmployeeCard from "../components/staff/EmployeeCard";
import OnboardingModal from "../components/staff/OnboardingModal";
import AiChatPanel from "../components/shared/AiChatPanel";

const DEPARTMENTS = ["All", "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];
const STATUSES = ["All", "Active", "On Leave", "Terminated"];

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const data = await base44.entities.Employee.list("-created_date");
      setEmployees(data);
    } catch {
      setLoadError("Failed to load employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.full_name?.toLowerCase().includes(search.toLowerCase())
      || e.job_title?.toLowerCase().includes(search.toLowerCase())
      || e.email?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchStatus = statusFilter === "All" || (e.status || "Active") === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const handleSave = async (data) => {
    try {
      if (editing) {
        await base44.entities.Employee.update(editing.id, data);
      } else {
        await base44.entities.Employee.create(data);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      alert("Failed to save employee. Please try again.");
    }
  };

  const handleEdit = (emp) => { setEditing(emp); setModalOpen(true); };
  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await base44.entities.Employee.delete(id);
      load();
    } catch {
      alert("Failed to delete employee. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
          <p className="text-sm text-gray-500 mt-0.5">{employees.length} employees total</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAiOpen(true)} variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Sparkles className="w-4 h-4" /> HR Assistant
          </Button>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="text-white gap-2" style={{ background: "#0F1B2D" }}>
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9" placeholder="Search by name, title or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="w-3 h-3 mr-2 text-gray-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">No employees found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <OnboardingModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave} employee={editing} />

      {aiOpen && (
        <AiChatPanel
          agentName="hr_policy_assistant"
          title="HR Policy Assistant"
          subtitle="AI-powered HR guidance & policy answers"
          suggestions={[
            "What documents are required for new hires?",
            "How should I handle a performance issue?",
            "What is the probation period policy?",
            "Check for employees with missing documents",
          ]}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}