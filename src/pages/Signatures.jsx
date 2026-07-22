import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Search, FilePen, Send, CheckCircle2, Clock, XCircle,
  Trash2, Eye, Upload, FileText, AlertCircle
} from "lucide-react";
import { format } from "date-fns";

const DOC_TYPES = ["Employment Contract", "NDA", "Policy Acknowledgement", "Offer Letter", "Termination Letter", "Promotion Letter", "Other"];

const STATUS_CONFIG = {
  Draft:             { color: "bg-gray-100 text-gray-600",    icon: FileText },
  Sent:              { color: "bg-blue-100 text-blue-700",     icon: Send },
  "Partially Signed":{ color: "bg-amber-100 text-amber-700",  icon: Clock },
  Completed:         { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Cancelled:         { color: "bg-red-100 text-red-600",      icon: XCircle },
};

const SIGNER_STATUS = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Signed:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Declined:"bg-red-50 text-red-600 border-red-200",
};

function computeStatus(signers) {
  if (!signers || signers.length === 0) return "Sent";
  const allSigned = signers.every(s => s.status === "Signed");
  const anySigned = signers.some(s => s.status === "Signed");
  const anyDeclined = signers.some(s => s.status === "Declined");
  if (allSigned) return "Completed";
  if (anyDeclined) return "Cancelled";
  if (anySigned) return "Partially Signed";
  return "Sent";
}

// ─── Create/Edit Modal ────────────────────────────────────────────────────────
function SignatureRequestModal({ open, onClose, onSave, employees, request }) {
  const [form, setForm] = useState({ title: "", document_type: "Other", file_url: "", due_date: "", message: "", notes: "" });
  const [selectedSigners, setSelectedSigners] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (request) {
      setForm({ title: request.title || "", document_type: request.document_type || "Other", file_url: request.file_url || "", due_date: request.due_date || "", message: request.message || "", notes: request.notes || "" });
      setSelectedSigners(request.signers || []);
    } else {
      setForm({ title: "", document_type: "Other", file_url: "", due_date: "", message: "", notes: "" });
      setSelectedSigners([]);
    }
  }, [request, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSigner = (empId) => {
    if (!empId || selectedSigners.find(s => s.employee_id === empId)) return;
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    setSelectedSigners(prev => [...prev, { employee_id: emp.id, employee_name: emp.full_name, employee_email: emp.email || "", status: "Pending" }]);
  };

  const removeSigner = (empId) => setSelectedSigners(prev => prev.filter(s => s.employee_id !== empId));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("file_url", file_url);
    } catch {
      // Previously unhandled: a failed upload left `uploading` stuck true
      // forever, the file input disabled indefinitely with no explanation.
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, signers: selectedSigners });
  };

  const availableToAdd = employees.filter(e => !selectedSigners.find(s => s.employee_id === e.id));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{request ? "Edit Signature Request" : "New Signature Request"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Document Title *</Label>
              <Input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Employment Contract – John Smith" />
            </div>
            <div className="space-y-1.5">
              <Label>Document Type</Label>
              <Select value={form.document_type} onValueChange={v => set("document_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={e => set("due_date", e.target.value)} />
            </div>
          </div>

          {/* File upload */}
          <div className="space-y-1.5">
            <Label>Document File</Label>
            {form.file_url ? (
              <div className="flex items-center gap-2 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline truncate flex-1">File uploaded</a>
                <button type="button" onClick={() => set("file_url", "")} className="text-gray-400 hover:text-red-500 ml-auto"><XCircle className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-gray-400 transition-colors">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{uploading ? "Uploading…" : "Click to upload document"}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
          </div>

          {/* Signers */}
          <div className="space-y-2">
            <Label>Signers</Label>
            {selectedSigners.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {selectedSigners.map(s => (
                  <div key={s.employee_id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.employee_name}</p>
                      <p className="text-xs text-gray-400">{s.employee_email}</p>
                    </div>
                    {!request && <button type="button" onClick={() => removeSigner(s.employee_id)} className="text-gray-300 hover:text-red-400"><XCircle className="w-4 h-4" /></button>}
                    {request && <Badge className={`text-xs border ${SIGNER_STATUS[s.status] || ""}`}>{s.status}</Badge>}
                  </div>
                ))}
              </div>
            )}
            {!request && availableToAdd.length > 0 && (
              <Select onValueChange={addSigner}>
                <SelectTrigger><SelectValue placeholder="+ Add signer…" /></SelectTrigger>
                <SelectContent>{availableToAdd.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} {e.email ? `— ${e.email}` : ""}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Message to Signers</Label>
            <Textarea value={form.message} onChange={e => set("message", e.target.value)} rows={2} placeholder="Please review and sign the attached document…" />
          </div>
          <div className="space-y-1.5">
            <Label>Internal Notes</Label>
            <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Internal notes (not visible to signers)…" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>{request ? "Save Changes" : "Create Request"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail / Signer Action Modal ─────────────────────────────────────────────
function SignerActionsModal({ open, onClose, request, onUpdate }) {
  const [declineReason, setDeclineReason] = useState("");
  const [actingSigner, setActingSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (!request) return null;

  const updateSignerStatus = async (signerEmpId, newStatus) => {
    setLoading(true);
    setActionError(null);
    const updatedSigners = request.signers.map(s =>
      s.employee_id === signerEmpId
        ? { ...s, status: newStatus, signed_at: newStatus === "Signed" ? new Date().toISOString() : undefined, declined_reason: newStatus === "Declined" ? declineReason : undefined }
        : s
    );
    const newStatus2 = computeStatus(updatedSigners);
    try {
      await base44.entities.SignatureRequest.update(request.id, { signers: updatedSigners, status: newStatus2 });
      setActingSigner(null);
      setDeclineReason("");
      onUpdate();
    } catch {
      // Previously unhandled: a failed update left the Sign/Decline buttons
      // disabled forever (gated on `loading`), with the locally-computed
      // signer update thrown away — the user had to close and reopen the
      // modal to even try again, with no indication anything had failed.
      setActionError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const overallStatus = computeStatus(request.signers);
  const StatusIcon = STATUS_CONFIG[overallStatus]?.icon || FileText;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePen className="w-5 h-5 text-gray-500" />
            {request.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-1">
          {actionError && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
              {actionError}
            </div>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{request.document_type}</span>
            {request.due_date && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Due {request.due_date}</span>}
            <Badge className={STATUS_CONFIG[overallStatus]?.color || ""}><StatusIcon className="w-3 h-3 mr-1 inline" />{overallStatus}</Badge>
          </div>

          {request.file_url && (
            <a href={request.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 rounded-lg px-3 py-2">
              <Eye className="w-4 h-4" /> View Document
            </a>
          )}

          {request.message && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 italic">"{request.message}"</div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Signers</p>
            {(request.signers || []).map(s => (
              <div key={s.employee_id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{s.employee_name}</p>
                    <p className="text-xs text-gray-400">{s.employee_email}</p>
                  </div>
                  <Badge className={`text-xs border ${SIGNER_STATUS[s.status] || ""}`}>{s.status}</Badge>
                </div>
                {s.status === "Signed" && s.signed_at && (
                  <p className="text-xs text-gray-400">Signed {format(new Date(s.signed_at), "MMM d, yyyy 'at' h:mm a")}</p>
                )}
                {s.status === "Declined" && s.declined_reason && (
                  <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{s.declined_reason}</p>
                )}
                {s.status === "Pending" && overallStatus !== "Cancelled" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {actingSigner === s.employee_id ? (
                      <div className="w-full space-y-2">
                        <Input placeholder="Reason for declining…" value={declineReason} onChange={e => setDeclineReason(e.target.value)} className="text-xs h-8" />
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setActingSigner(null)}>Cancel</Button>
                          <Button size="sm" className="text-xs h-7 bg-red-500 hover:bg-red-600 text-white" disabled={loading} onClick={() => updateSignerStatus(s.employee_id, "Declined")}>Confirm Decline</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" disabled={loading} className="text-xs h-7 text-white" style={{ background: "#0F1B2D" }} onClick={() => updateSignerStatus(s.employee_id, "Signed")}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Signed
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 text-red-500 border-red-200 hover:bg-red-50" onClick={() => setActingSigner(s.employee_id)}>
                          <XCircle className="w-3 h-3 mr-1" /> Decline
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {request.notes && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-medium text-gray-500">Notes: </span>{request.notes}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Signatures() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoadError(null);
    try {
      const [reqs, emps] = await Promise.all([
        base44.entities.SignatureRequest.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setRequests(reqs); setEmployees(emps);
    } catch {
      setLoadError("Failed to load signature requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => {
    try {
      const user = await base44.auth.me();
      await base44.entities.SignatureRequest.create({
        ...data,
        status: data.signers?.length > 0 ? "Sent" : "Draft",
        sent_by: user.email,
        sent_at: data.signers?.length > 0 ? new Date().toISOString() : undefined,
      });
      setCreateOpen(false); load();
    } catch {
      alert("Failed to create signature request. Please try again.");
    }
  };

  const handleEdit = async (data) => {
    // Editing is only offered for Draft requests. If signers are present after
    // the edit, this should leave Draft the same way creating-with-signers does
    // — otherwise a request can sit permanently mislabeled as "Draft" (missing
    // from the Active/Awaiting Signature filters and stats) even though it has
    // signers who can already act on it via the detail view.
    const wasDraft = selected?.status === "Draft";
    const nowHasSigners = data.signers?.length > 0;
    const payload = { ...data };
    try {
      if (wasDraft && nowHasSigners) {
        const user = await base44.auth.me();
        payload.status = "Sent";
        payload.sent_by = user.email;
        payload.sent_at = new Date().toISOString();
      }
      await base44.entities.SignatureRequest.update(selected.id, payload);
      setEditOpen(false); setSelected(null); load();
    } catch {
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this signature request?")) return;
    try {
      await base44.entities.SignatureRequest.delete(id);
      load();
    } catch {
      alert("Failed to delete signature request. Please try again.");
    }
  };

  const handleCancel = async (req) => {
    if (!confirm("Cancel this signature request?")) return;
    try {
      await base44.entities.SignatureRequest.update(req.id, { status: "Cancelled" });
      load();
    } catch {
      alert("Failed to cancel signature request. Please try again.");
    }
  };

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) || r.document_type?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tabFilter === "all" || r.status === tabFilter || (tabFilter === "active" && ["Sent", "Partially Signed"].includes(r.status));
    return matchSearch && matchTab;
  });

  // Stats
  const total = requests.length;
  const pending = requests.filter(r => ["Sent", "Partially Signed"].includes(r.status)).length;
  const completed = requests.filter(r => r.status === "Completed").length;
  const draft = requests.filter(r => r.status === "Draft").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Signatures</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} signature request{total !== 1 ? "s" : ""} total</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, icon: FilePen, color: "#6366f1" },
          { label: "Awaiting Signature", value: pending, icon: Clock, color: "#f59e0b" },
          { label: "Completed", value: completed, icon: CheckCircle2, color: "#10b981" },
          { label: "Drafts", value: draft, icon: FileText, color: "#94a3b8" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-400">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9" placeholder="Search by title or type…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={tabFilter} onValueChange={setTabFilter}>
          <TabsList className="bg-gray-100 rounded-xl p-1 h-9">
            <TabsTrigger value="all" className="rounded-lg text-xs px-3 h-7">All</TabsTrigger>
            <TabsTrigger value="Draft" className="rounded-lg text-xs px-3 h-7">Draft</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg text-xs px-3 h-7">Active</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-lg text-xs px-3 h-7">Completed</TabsTrigger>
            <TabsTrigger value="Cancelled" className="rounded-lg text-xs px-3 h-7">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>
      ) : loadError ? (
        <div className="text-center py-24">
          <p className="text-sm font-medium text-red-600">{loadError}</p>
          <button onClick={load} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <FilePen className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No signature requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.Draft;
            const StatusIcon = cfg.icon;
            const signers = r.signers || [];
            const signedCount = signers.filter(s => s.status === "Signed").length;
            const isOverdue = r.due_date && new Date(r.due_date) < new Date() && !["Completed", "Cancelled"].includes(r.status);

            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <FilePen className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{r.title}</p>
                        <Badge className={`text-xs ${cfg.color}`}><StatusIcon className="w-3 h-3 mr-1 inline" />{r.status}</Badge>
                        {isOverdue && <Badge className="text-xs bg-red-50 text-red-600 border border-red-200"><AlertCircle className="w-3 h-3 mr-1 inline" />Overdue</Badge>}
                      </div>
                      <p className="text-xs text-gray-400">{r.document_type}{r.due_date ? ` · Due ${r.due_date}` : ""}</p>

                      {/* Signers progress */}
                      {signers.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1">
                            {signers.map(s => (
                              <div key={s.employee_id} className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white ${s.status === "Signed" ? "bg-emerald-500" : s.status === "Declined" ? "bg-red-400" : "bg-gray-300"}`} title={`${s.employee_name}: ${s.status}`}>
                                {s.employee_name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">{signedCount}/{signers.length} signed</p>
                          {signers.length > 0 && (
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-24">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${signers.length ? (signedCount / signers.length) * 100 : 0}%` }} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600" title="View details"
                      onClick={() => { setSelected(r); setDetailOpen(true); }}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {r.status === "Draft" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700" title="Edit"
                        onClick={() => { setSelected(r); setEditOpen(true); }}>
                        <FilePen className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {!["Completed", "Cancelled"].includes(r.status) && r.status !== "Draft" && (
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-gray-400 hover:text-red-600" onClick={() => handleCancel(r)}>
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600" title="Delete"
                      onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <SignatureRequestModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} employees={employees} request={null} />
      <SignatureRequestModal open={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSave={handleEdit} employees={employees} request={selected} />
      <SignerActionsModal open={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} request={selected} onUpdate={() => { load(); }} />
    </div>
  );
}