import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ArrowUpCircle, DollarSign, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import PromotionRequestModal from "@/components/promotions/PromotionRequestModal";
import ApprovalModal from "@/components/promotions/ApprovalModal";
import PromotionCard from "@/components/promotions/PromotionCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonLoaders";

const STATUS_TABS = ["All", "Draft", "Pending HR", "Pending Finance", "Approved", "Rejected"];

import { useToast } from "@/contexts/ToastContext";

export default function Promotions() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [approvalTarget, setApprovalTarget] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const [reqs, emps] = await Promise.all([
        base44.entities.PromotionRequest.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setRequests(reqs); setEmployees(emps);
    } catch {
      setLoadError("Failed to load promotion data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await base44.entities.PromotionRequest.update(editing.id, data);
        toast.success("Promotion request updated.");
      } else {
        await base44.entities.PromotionRequest.create(data);
        toast.success("New promotion request created.");
      }
      setModalOpen(false); setEditing(null); load();
    } catch {
      toast.error("Failed to save promotion request. Please try again.");
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await base44.entities.PromotionRequest.delete(confirmDeleteId);
      toast.success("Promotion request deleted.");
      setConfirmDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete promotion request. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDecision = async (id, stage, decision, notes, reviewer) => {
    const req = requests.find(r => r.id === id);
    let update = {};

    if (stage === "HR") {
      update.hr_decision = decision;
      update.hr_notes = notes;
      update.hr_reviewed_by = reviewer;
      update.hr_reviewed_at = new Date().toISOString();
      update.status = decision === "Approved" ? "Pending Finance" : "Rejected";
    } else {
      update.finance_decision = decision;
      update.finance_notes = notes;
      update.finance_reviewed_by = reviewer;
      update.finance_reviewed_at = new Date().toISOString();
      update.status = decision === "Approved" ? "Approved" : "Rejected";
    }

    try {
      await base44.entities.PromotionRequest.update(id, update);
      toast.success(`Decision recorded: ${decision}`);
      setApprovalTarget(null); load();
    } catch {
      toast.error("Failed to record decision. Please try again.");
    }
  };

  const filtered = requests.filter(r => {
    const matchSearch = !search ||
      r.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.department?.toLowerCase().includes(search.toLowerCase()) ||
      r.proposed_title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusTab === "All" || r.status === statusTab;
    return matchSearch && matchStatus;
  });

  // Stats
  const pending = requests.filter(r => r.status === "Pending HR" || r.status === "Pending Finance").length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const totalComp = requests.filter(r => r.status === "Approved")
    .reduce((s, r) => s + ((r.proposed_salary || 0) - (r.current_salary || 0)), 0);
  const avgIncrease = approved > 0
    ? (requests.filter(r => r.status === "Approved").reduce((s,r) => s + (r.salary_increase_pct||0), 0) / approved).toFixed(1)
    : "—";

  if (loading) return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );

  if (loadError) return (
    <div className="max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 p-8 rounded-3xl text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <ArrowUpCircle size={24} />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-900 dark:text-white">Unable to Load Promotion Requests</h3>
        <p className="text-xs text-slate-500 mt-1">{loadError}</p>
      </div>
      <Button
        onClick={load}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <RefreshCw size={14} />
        <span>Retry Loading</span>
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promotion Requests</h2>
          <p className="text-xs text-gray-400 mt-0.5">{requests.length} total · multi-step HR & Finance approval</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: requests.length, icon: ArrowUpCircle, color: "#6366f1", bg: "bg-violet-50" },
          { label: "Awaiting Review", value: pending, icon: Clock, color: "#f59e0b", bg: "bg-amber-50" },
          { label: "Approved", value: approved, icon: CheckCircle2, color: "#10b981", bg: "bg-emerald-50" },
          { label: "Approved Comp Δ", value: totalComp > 0 ? `+$${totalComp.toLocaleString()}` : "—", icon: DollarSign, color: "#0ea5e9", bg: "bg-sky-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending HR notice */}
      {requests.filter(r => r.status === "Pending HR").length > 0 && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex items-center gap-3">
          <Clock className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <p className="text-sm text-violet-800">
            <strong>{requests.filter(r => r.status === "Pending HR").length}</strong> request(s) awaiting HR review.
            Click <strong>Review →</strong> on a card to approve or reject.
          </p>
        </div>
      )}
      {requests.filter(r => r.status === "Pending Finance").length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{requests.filter(r => r.status === "Pending Finance").length}</strong> request(s) awaiting Finance approval.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input className="pl-8 h-9 text-sm" placeholder="Search employee, department, title…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={statusTab} onValueChange={setStatusTab}>
          <TabsList className="bg-gray-100 rounded-xl p-1 h-9">
            {STATUS_TABS.map(s => (
              <TabsTrigger key={s} value={s} className="rounded-lg text-xs px-3 h-7">{s}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <EmptyState
            icon={ArrowUpCircle}
            title="No Promotion Requests Found"
            description="No promotion request records match your search query or status filter."
            action={
              <Button
                onClick={() => { setSearch(""); setStatusTab("All"); }}
                variant="outline"
                className="text-xs cursor-pointer"
              >
                Reset Filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(r => (
            <PromotionCard
              key={r.id}
              request={r}
              onEdit={req => { setEditing(req); setModalOpen(true); }}
              onDelete={handleDelete}
              onReview={req => setApprovalTarget(req)}
              canReview={true}
            />
          ))}
        </div>
      )}

      <PromotionRequestModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        employees={employees}
        request={editing}
      />

      <ApprovalModal
        open={!!approvalTarget}
        onClose={() => setApprovalTarget(null)}
        request={approvalTarget}
        onDecision={handleDecision}
      />

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDelete}
        title="Delete Promotion Request"
        message="Are you sure you want to delete this promotion request? This action cannot be undone."
        confirmLabel="Delete Request"
        danger={true}
        loading={deleting}
      />
    </div>
  );
}