import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, FileText, Download, Trash2, Upload, AlertTriangle, Sparkles, Pencil, Eye, EyeOff } from "lucide-react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";

const DOC_TYPES = ["Pay Slip", "Contract", "Tax Document", "ID", "Certificate", "Performance Review", "Onboarding", "Policy", "Other"];
const DEPARTMENTS = ["All", "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];

const TYPE_COLORS = {
  "Pay Slip": "bg-emerald-100 text-emerald-700",
  "Contract": "bg-blue-100 text-blue-700",
  "Tax Document": "bg-orange-100 text-orange-700",
  "ID": "bg-purple-100 text-purple-700",
  "Certificate": "bg-green-100 text-green-700",
  "Performance Review": "bg-indigo-100 text-indigo-700",
  "Onboarding": "bg-teal-100 text-teal-700",
  "Policy": "bg-gray-100 text-gray-700",
  "Other": "bg-slate-100 text-slate-700",
};

function SingleUploadModal({ open, onClose, onSave, employees, doc }) {
  const [form, setForm] = useState({ employee_id: "", document_name: "", document_type: "Other", expiry_date: "", period: "", visible_to_employee: true, notes: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useState(() => {
    if (doc) setForm({ ...doc });
    else setForm({ employee_id: "", document_name: "", document_type: "Other", expiry_date: "", period: "", visible_to_employee: true, notes: "" });
    setFile(null);
  }, [doc, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let file_url = form.file_url || "";
    if (file) {
      setUploading(true);
      const res = await base44.integrations.Core.UploadFile({ file });
      file_url = res.file_url;
      setUploading(false);
    }
    const emp = employees.find(e => e.id === form.employee_id);
    onSave({ ...form, file_url, employee_name: emp?.full_name || "", department: emp?.department || "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{doc ? "Edit Document" : "Upload Document"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={form.employee_id} onValueChange={v => set("employee_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{employees.filter(e => e.status !== "Terminated").map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Document Name *</Label>
              <Input value={form.document_name} onChange={e => set("document_name", e.target.value)} required placeholder="e.g. March 2026 Pay Slip" />
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select value={form.document_type} onValueChange={v => set("document_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Period / Reference</Label>
              <Input value={form.period || ""} onChange={e => set("period", e.target.value)} placeholder="e.g. March 2026" />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiry_date || ""} onChange={e => set("expiry_date", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <Label className="cursor-pointer">Visible to Employee</Label>
            <Switch checked={!!form.visible_to_employee} onCheckedChange={v => set("visible_to_employee", v)} />
          </div>
          <div className="space-y-1.5">
            <Label>Upload File</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors">
              <input type="file" id="single-file-upload" className="hidden" onChange={e => setFile(e.target.files[0])} />
              <label htmlFor="single-file-upload" className="cursor-pointer">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500">{file ? file.name : (form.file_url ? "Replace file" : "Click to upload")}</p>
              </label>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Optional internal notes…" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={uploading} className="text-white" style={{ background: "#0F1B2D" }}>
              {uploading ? "Uploading…" : doc ? "Save Changes" : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function HRDocumentsTab({ docs, employees, onSave, onDelete, onBulkUpload, onAnalyze, loading }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const getExpiryStatus = (expiry) => {
    if (!expiry) return null;
    const d = new Date(expiry);
    if (isPast(d)) return "expired";
    if (isWithinInterval(d, { start: new Date(), end: addDays(new Date(), 30) })) return "expiring";
    return "ok";
  };

  const filtered = docs.filter(d => {
    const ms = !search || d.document_name?.toLowerCase().includes(search.toLowerCase()) || d.employee_name?.toLowerCase().includes(search.toLowerCase());
    const ts = typeFilter === "All" || d.document_type === typeFilter;
    const ds = deptFilter === "All" || d.department === deptFilter;
    return ms && ts && ds;
  });

  const handleSave = (data) => {
    onSave(data, editing);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative min-w-48 flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9 h-9 text-sm" placeholder="Search documents or employees…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 text-sm w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-9 text-sm w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d === "All" ? "All Departments" : d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBulkUpload} className="gap-2 h-9 text-sm">
            <Upload className="w-4 h-4" /> Bulk Upload
          </Button>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="text-white gap-2 h-9" style={{ background: "#0F1B2D" }}>
            <Plus className="w-4 h-4" /> Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Documents", value: docs.length, color: "text-gray-900" },
          { label: "Visible to Employees", value: docs.filter(d => d.visible_to_employee !== false).length, color: "text-emerald-700" },
          { label: "Expiring / Expired", value: docs.filter(d => getExpiryStatus(d.expiry_date) && getExpiryStatus(d.expiry_date) !== "ok").length, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400"><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">No documents found</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Document</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Employee</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Period</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Visibility</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Expiry</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => {
                  const expiryStatus = getExpiryStatus(doc.expiry_date);
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{doc.document_name}</p>
                            {doc.is_bulk && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">bulk</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <p className="text-sm text-gray-700">{doc.employee_name}</p>
                        <p className="text-xs text-gray-400">{doc.department}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <Badge className={`text-xs ${TYPE_COLORS[doc.document_type] || TYPE_COLORS.Other}`}>{doc.document_type}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-gray-500">{doc.period || "—"}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-center">
                        {doc.visible_to_employee !== false
                          ? <span title="Visible to employee"><Eye className="w-4 h-4 text-emerald-500 mx-auto" /></span>
                          : <span title="HR only"><EyeOff className="w-4 h-4 text-gray-300 mx-auto" /></span>
                        }
                      </td>
                      <td className="px-5 py-3.5 hidden xl:table-cell">
                        {doc.expiry_date ? (
                          <div className="flex items-center gap-1.5">
                            {expiryStatus !== "ok" && <AlertTriangle className={`w-3.5 h-3.5 ${expiryStatus === "expired" ? "text-red-500" : "text-amber-500"}`} />}
                            <span className={`text-xs ${expiryStatus === "expired" ? "text-red-600 font-medium" : expiryStatus === "expiring" ? "text-amber-600" : "text-gray-600"}`}>
                              {format(new Date(doc.expiry_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"><Download className="w-3.5 h-3.5" /></Button>
                            </a>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-amber-500" onClick={() => onAnalyze(doc)}><Sparkles className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700" onClick={() => { setEditing(doc); setModalOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-600" onClick={() => onDelete(doc.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SingleUploadModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        employees={employees}
        doc={editing}
      />
    </div>
  );
}