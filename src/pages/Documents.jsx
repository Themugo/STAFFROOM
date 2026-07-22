import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, Download, Trash2, Sparkles, Upload, Eye, EyeOff, UploadCloud, UserCircle } from "lucide-react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";
import AiDocumentPanel from "../components/documents/AiDocumentPanel";
import BulkUploadModal from "../components/documents/BulkUploadModal";
import SingleDocModal from "../components/documents/SingleDocModal";
import EmployeeDocPortal from "../components/documents/EmployeeDocPortal";
import { resolveDocumentAccess } from "@/utils/documentAccess";

const DOC_TYPES = ["Pay Slip", "Contract", "Tax Document", "ID", "Certificate", "NDA", "Policy", "Performance Review", "Onboarding", "Other"];

const TYPE_COLORS = {
  "Pay Slip": "bg-emerald-100 text-emerald-700",
  "Contract": "bg-blue-100 text-blue-700",
  "Tax Document": "bg-orange-100 text-orange-700",
  "ID": "bg-purple-100 text-purple-700",
  "Certificate": "bg-teal-100 text-teal-700",
  "NDA": "bg-violet-100 text-violet-700",
  "Policy": "bg-gray-100 text-gray-700",
  "Performance Review": "bg-indigo-100 text-indigo-700",
  "Onboarding": "bg-pink-100 text-pink-700",
  "Other": "bg-slate-100 text-slate-700",
};

function getExpiryStatus(expiry) {
  if (!expiry) return null;
  const d = new Date(expiry);
  if (isPast(d)) return "expired";
  if (isWithinInterval(d, { start: new Date(), end: addDays(new Date(), 30) })) return "expiring";
  return "ok";
}

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [myEmployee, setMyEmployee] = useState(null);
  const [isHR, setIsHR] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(null);

  // Loading is split into two phases on purpose:
  //  1) figure out who's asking (their role + linked employee record), then
  //  2) only request the document set that role is actually allowed to see.
  // Previously this fetched *every* employee's documents unconditionally on
  // every load, for every signed-in user, and just hid the "All Documents"
  // tab in the UI for non-HR users — the full HR-only document set (payslips,
  // contracts, disciplinary notes, everything, for everyone) still went over
  // the network to every employee's browser on every page load. `.filter()`
  // on the Base44 SDK sends a real server-side query (`?q=...`), it doesn't
  // fetch-then-filter client-side, so scoping the request itself here is a
  // real reduction in what's ever sent — not just a UI-level hide.
  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const user = await base44.auth.me().catch(() => null);
      setCurrentUser(user);

      let myEmp = null;
      if (user?.email) {
        // Try an exact-match server-side filter first — this is the narrow,
        // low-exposure path and covers the common case. Only fall back to
        // fetching the full roster if that comes back empty, since email
        // casing mismatches are a real, anticipated case elsewhere in this
        // app (see the .toLowerCase() comparison in SelfService.jsx) — an
        // exact-match filter alone could otherwise silently lock a
        // legitimately-linked employee out of their own documents over a
        // casing difference.
        const exactMatches = await base44.entities.Employee.filter({ email: user.email });
        myEmp = exactMatches?.[0] || null;
        if (!myEmp) {
          const allEmployees = await base44.entities.Employee.list();
          myEmp = allEmployees.find(e => e.email?.toLowerCase() === user.email?.toLowerCase()) || null;
        }
      }
      setMyEmployee(myEmp);

      // Only an explicit admin role gets the HR view. The previous version
      // also granted it to any signed-in user with *no linked employee
      // record at all* — meant as a fallback for admin accounts not modeled
      // as an employee, but in practice it meant "we don't recognize you"
      // silently defaulted to "so here's every HR-only document in the
      // company." That's backwards from least-privilege. An unrecognized,
      // non-admin account now sees neither view rather than defaulting to
      // the most-privileged one. See src/utils/documentAccess.js.
      const access = resolveDocumentAccess(user, myEmp);
      setIsHR(access.isHR);

      if (access.scope === "all") {
        const [d, e] = await Promise.all([
          base44.entities.EmployeeDocument.list("-created_date"),
          base44.entities.Employee.list("full_name"),
        ]);
        setDocs(d);
        setEmployees(e);
      } else if (access.scope === "own") {
        const d = await base44.entities.EmployeeDocument.filter({ employee_id: myEmp.id }, "-created_date");
        setDocs(d);
        setEmployees([myEmp]);
      } else {
        setDocs([]);
        setEmployees([]);
      }
    } catch (e) {
      setLoadError(e?.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];

  const filtered = docs.filter(d => {
    const matchSearch = !search ||
      d.document_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.employee_name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || d.document_type === typeFilter;
    const matchDept = deptFilter === "All" || d.department === deptFilter;
    return matchSearch && matchType && matchDept;
  });

  const handleSaveSingle = async (data) => {
    try {
      if (editing) await base44.entities.EmployeeDocument.update(editing.id, data);
      else await base44.entities.EmployeeDocument.create(data);
      setSingleModalOpen(false); setEditing(null); load();
    } catch {
      alert("Failed to save document. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try {
      await base44.entities.EmployeeDocument.delete(id);
      load();
    } catch {
      alert("Failed to delete document. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="text-center py-20 text-gray-400">
      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium text-red-500">{loadError}</p>
    </div>
  );

  if (!isHR && !myEmployee) return (
    <div className="text-center py-20 text-gray-400">
      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">No employee profile linked to your account.</p>
      <p className="text-xs mt-1">Contact HR to link your account before documents can be shown here.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{docs.length} document{docs.length !== 1 ? "s" : ""} on file</p>
        </div>
        {isHR && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setBulkModalOpen(true)} variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
              <UploadCloud className="w-4 h-4" /> Bulk Upload
            </Button>
            <Button onClick={() => { setEditing(null); setSingleModalOpen(true); }} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
              <Plus className="w-4 h-4" /> Upload Document
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue={isHR ? "hr" : "mine"}>
        <TabsList className="bg-gray-100">
          {isHR && <TabsTrigger value="hr" className="gap-1.5"><FileText className="w-3.5 h-3.5" /> All Documents</TabsTrigger>}
          <TabsTrigger value="mine" className="gap-1.5"><UserCircle className="w-3.5 h-3.5" /> My Documents</TabsTrigger>
        </TabsList>

        {/* ── HR ALL DOCUMENTS TAB ── */}
        {isHR && (
          <TabsContent value="hr" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-8 h-9 text-sm" placeholder="Search by name or employee…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-sm w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-9 text-sm w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d} value={d}>{d === "All" ? "All Departments" : d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Summary strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Pay Slips", count: docs.filter(d => d.document_type === "Pay Slip").length, color: "emerald" },
                { label: "Contracts", count: docs.filter(d => d.document_type === "Contract").length, color: "blue" },
                { label: "Tax Docs", count: docs.filter(d => d.document_type === "Tax Document").length, color: "orange" },
                { label: "HR Only", count: docs.filter(d => d.visibility === "hr_only").length, color: "gray" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className="text-lg font-bold text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No documents found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 font-medium">
                        <th className="text-left px-5 py-3">Document</th>
                        <th className="text-left px-4 py-3 hidden sm:table-cell">Employee</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                        <th className="text-left px-4 py-3 hidden lg:table-cell">Period / Expiry</th>
                        <th className="text-center px-4 py-3 hidden sm:table-cell">Visibility</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(doc => {
                        const expiryStatus = getExpiryStatus(doc.expiry_date);
                        return (
                          <tr key={doc.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{doc.document_name}</p>
                                  <p className="text-xs text-gray-400 sm:hidden">{doc.employee_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <p className="text-sm text-gray-700">{doc.employee_name}</p>
                              <p className="text-xs text-gray-400">{doc.department}</p>
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <Badge className={`${TYPE_COLORS[doc.document_type] || TYPE_COLORS.Other} text-xs`}>{doc.document_type}</Badge>
                            </td>
                            <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-500">
                              {doc.pay_period || (doc.expiry_date ? (
                                <span className={expiryStatus === "expired" ? "text-red-600 font-medium" : expiryStatus === "expiring" ? "text-amber-600" : ""}>
                                  Exp: {format(new Date(doc.expiry_date), "MMM d, yyyy")}
                                </span>
                              ) : "—")}
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell text-center">
                              {doc.visibility === "hr_only"
                                ? <span className="inline-flex items-center gap-1 text-xs text-gray-400"><EyeOff className="w-3 h-3" /> HR only</span>
                                : <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><Eye className="w-3 h-3" /> Employee</span>
                              }
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                {doc.file_url && (
                                  <a href={doc.file_url} target="_blank" rel="noreferrer">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700">
                                      <Download className="w-3.5 h-3.5" />
                                    </Button>
                                  </a>
                                )}
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-amber-500"
                                  onClick={() => setAnalyzingDoc(doc)} title="AI Analysis">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"
                                  onClick={() => { setEditing(doc); setSingleModalOpen(true); }}>
                                  <Upload className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                                  onClick={() => handleDelete(doc.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
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
          </TabsContent>
        )}

        {/* ── EMPLOYEE SELF-SERVICE TAB ── */}
        <TabsContent value="mine" className="mt-4">
          <EmployeeDocPortal docs={docs} employee={myEmployee} scoped={!isHR} />
        </TabsContent>
      </Tabs>

      <SingleDocModal
        open={singleModalOpen}
        onClose={() => { setSingleModalOpen(false); setEditing(null); }}
        onSave={handleSaveSingle}
        employees={employees}
        doc={editing}
      />

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        employees={employees}
        onDone={load}
      />

      {analyzingDoc && <AiDocumentPanel doc={analyzingDoc} onClose={() => setAnalyzingDoc(null)} />}
    </div>
  );
}
