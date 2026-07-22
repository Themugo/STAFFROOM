import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Receipt, FileSignature, FileBadge2, FolderOpen } from "lucide-react";
import { format } from "date-fns";

const TYPE_META = {
  "Pay Slip":          { icon: Receipt,        color: "bg-emerald-50 text-emerald-700 border-emerald-200", bg: "bg-emerald-50" },
  "Contract":          { icon: FileSignature,  color: "bg-blue-50 text-blue-700 border-blue-200",          bg: "bg-blue-50"    },
  "Tax Document":      { icon: FileBadge2,     color: "bg-orange-50 text-orange-700 border-orange-200",    bg: "bg-orange-50"  },
  "NDA":               { icon: FileText,       color: "bg-violet-50 text-violet-700 border-violet-200",    bg: "bg-violet-50"  },
  "Certificate":       { icon: FileBadge2,     color: "bg-teal-50 text-teal-700 border-teal-200",          bg: "bg-teal-50"    },
  "ID":                { icon: FileText,       color: "bg-purple-50 text-purple-700 border-purple-200",    bg: "bg-purple-50"  },
  "Policy":            { icon: FileText,       color: "bg-gray-100 text-gray-600 border-gray-200",         bg: "bg-gray-50"    },
  "Performance Review":{ icon: FileText,       color: "bg-indigo-50 text-indigo-700 border-indigo-200",    bg: "bg-indigo-50"  },
  "Onboarding":        { icon: FolderOpen,     color: "bg-pink-50 text-pink-700 border-pink-200",          bg: "bg-pink-50"    },
  "Other":             { icon: FileText,       color: "bg-slate-100 text-slate-600 border-slate-200",      bg: "bg-slate-50"   },
};

const CATEGORIES = ["All", "Pay Slip", "Contract", "Tax Document", "NDA", "Certificate", "ID", "Policy", "Other"];

export default function EmployeeDocPortal({ docs, employee, scoped }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // When `scoped` is true (non-HR viewer), `docs` was already fetched with a
  // server-side `employee_id` filter in Documents.jsx — this component never
  // received any other employee's records to begin with. The employee_id
  // check below is defense-in-depth, not the primary control; the
  // `hr_only` exclusion is the one thing still enforced purely here, since
  // it's specifically about hiding some of *this employee's own* records
  // from themselves, which isn't something the fetch scope alone can express.
  const myDocs = docs.filter(d =>
    d.employee_id === employee?.id && d.visibility !== "hr_only"
  );

  // If the caller told us this data was already fetched with a server-side
  // employee_id filter, but we're seeing records for someone else, the
  // upstream scoping assumption broke — surface that loudly rather than
  // silently continuing to filter it out.
  if (scoped && docs.some(d => d.employee_id !== employee?.id)) {
    console.error(
      "[EmployeeDocPortal] Expected a pre-scoped, single-employee document set (scoped=true), " +
      "but received documents for other employees. The upstream fetch in Documents.jsx may no " +
      "longer be filtering by employee_id — treat this as a data-exposure bug, not just a display issue."
    );
  }

  const filtered = myDocs.filter(d => {
    const matchSearch = !search || d.document_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.document_type === category;
    return matchSearch && matchCat;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(d => d.document_type === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  // Also bucket anything not in categories under Other
  const otherItems = filtered.filter(d => !CATEGORIES.slice(1).includes(d.document_type));
  if (otherItems.length) grouped["Other"] = [...(grouped["Other"] || []), ...otherItems];

  if (!employee) {
    return (
      <div className="py-20 text-center text-gray-400">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No employee profile linked to your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal header */}
      <div className="bg-gradient-to-r from-[#0F1B2D] to-[#1A2D45] rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg">
          {employee.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{employee.full_name}</p>
          <p className="text-white/50 text-sm">{employee.job_title} · {employee.department}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/40 text-xs">My Documents</p>
          <p className="text-amber-400 font-bold text-xl">{myDocs.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input className="pl-8 h-9 text-sm" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 h-9 rounded-lg border transition-all font-medium ${category === c ? "border-gray-800 bg-gray-800 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No documents found</p>
          <p className="text-xs mt-1">Your HR team will upload documents here as they become available.</p>
        </div>
      )}

      {/* Grouped sections */}
      {category === "All" ? (
        Object.entries(grouped).map(([cat, items]) => {
          const meta = TYPE_META[cat] || TYPE_META.Other;
          const Icon = meta.icon;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">{cat}</p>
                <span className="text-xs text-gray-400">({items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(doc => <DocCard key={doc.id} doc={doc} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(doc => <DocCard key={doc.id} doc={doc} />)}
        </div>
      )}
    </div>
  );
}

function DocCard({ doc }) {
  const meta = TYPE_META[doc.document_type] || TYPE_META.Other;
  const Icon = meta.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <Badge className={`text-[10px] border flex-shrink-0 ${meta.color}`}>{doc.document_type}</Badge>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{doc.document_name}</p>
        {doc.pay_period && <p className="text-xs text-gray-400 mt-0.5">{doc.pay_period}</p>}
        {doc.expiry_date && (
          <p className="text-xs text-gray-400 mt-0.5">
            Expires: {format(new Date(doc.expiry_date), "MMM d, yyyy")}
          </p>
        )}
        <p className="text-[10px] text-gray-300 mt-1">
          {doc.created_date ? format(new Date(doc.created_date), "MMM d, yyyy") : ""}
        </p>
      </div>
      {doc.file_url ? (
        <a href={doc.file_url} target="_blank" rel="noreferrer" className="w-full">
          <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> View / Download
          </Button>
        </a>
      ) : (
        <Button size="sm" variant="outline" className="w-full h-8 text-xs opacity-40" disabled>
          No file attached
        </Button>
      )}
    </div>
  );
}