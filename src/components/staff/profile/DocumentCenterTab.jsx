import { useState } from "react";
import { FileText, Download, Upload, Eye, CheckCircle2, AlertTriangle, RefreshCw, Plus, FileCheck, Shield } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export function DocumentCenterTab({ documents, onUploadDocument }) {
  const toast = useToast();
  const [docList, setDocList] = useState(documents || []);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleDownloadMock = (doc) => {
    toast.info(`Downloading ${doc.name}...`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Centralized Document Center
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Secure repository for contracts, compliance forms, IDs, and performance appraisals.</p>
        </div>

        <button
          onClick={onUploadDocument}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docList.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">{doc.name}</p>
                <p className="text-[11px] text-slate-400">
                  {doc.category} • {doc.size} • Uploaded {doc.date}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    {doc.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Expires: 2028-12-31</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownloadMock(doc)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                title="Download File"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{previewDoc.name}</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Close
              </button>
            </div>

            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileText className="w-12 h-12 text-indigo-500 opacity-80" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Verification Preview</p>
              <p className="text-[11px] text-slate-400">
                Official encrypted record verified by STAFFROOM Enterprise Vault on {previewDoc.date}.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDownloadMock(previewDoc)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
