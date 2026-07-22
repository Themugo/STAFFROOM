import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Lock, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

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

const TYPE_ICONS = {
  "Pay Slip": "💰",
  "Contract": "📋",
  "Tax Document": "🧾",
  "ID": "🪪",
  "Certificate": "🏅",
  "Performance Review": "📊",
  "Policy": "📌",
};

export default function MyDocumentsTab({ docs, currentEmployee }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const myDocs = docs.filter(d =>
    d.visible_to_employee !== false &&
    (currentEmployee ? d.employee_id === currentEmployee.id : true)
  );

  const types = ["All", ...new Set(myDocs.map(d => d.document_type).filter(Boolean))];

  const filtered = myDocs.filter(d => {
    const ms = !search || d.document_name?.toLowerCase().includes(search.toLowerCase());
    const ts = typeFilter === "All" || d.document_type === typeFilter;
    return ms && ts;
  });

  // Group by type
  const grouped = {};
  filtered.forEach(d => {
    const group = d.document_type || "Other";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(d);
  });

  if (!currentEmployee) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
        <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-amber-800">Your employee profile wasn't found</p>
        <p className="text-xs text-amber-600 mt-1">Contact HR to ensure your account email matches your employee record.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div className="rounded-2xl p-5 text-white flex items-center gap-4" style={{ background: "#0F1B2D" }}>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {currentEmployee.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{currentEmployee.full_name}</p>
          <p className="text-white/60 text-xs">{currentEmployee.department} · {currentEmployee.job_title}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">{myDocs.length}</p>
          <p className="text-white/60 text-xs">Document{myDocs.length !== 1 ? "s" : ""} available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9 h-9 text-sm" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-sm">No documents available</p>
          <p className="text-xs mt-1">HR will upload your documents here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([type, typeDocs]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{TYPE_ICONS[type] || "📄"}</span>
                <h3 className="font-semibold text-gray-800 text-sm">{type}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{typeDocs.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {typeDocs.map(doc => (
                  <div key={doc.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow group">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-lg">
                        {TYPE_ICONS[doc.document_type] || "📄"}
                      </div>
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-opacity">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2">{doc.document_name}</p>
                    {doc.period && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{doc.period}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={`text-xs ${TYPE_COLORS[doc.document_type] || TYPE_COLORS.Other}`}>{doc.document_type}</Badge>
                      <p className="text-[10px] text-gray-400">{doc.created_date ? format(new Date(doc.created_date), "MMM d, yyyy") : ""}</p>
                    </div>
                    {!doc.file_url && (
                      <p className="text-xs text-amber-600 mt-2">File not yet available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}