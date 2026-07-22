import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function AiDocumentPanel({ doc, onClose }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setAnalysis("");
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an HR document specialist. Analyze this employee document record and provide a concise report.

Document name: ${doc.document_name}
Type: ${doc.document_type}
Employee: ${doc.employee_name}
Expiry date: ${doc.expiry_date || "None"}
Notes: ${doc.notes || "None"}

Provide:
1. **Document Overview** — what this document type typically contains and its HR purpose
2. **Compliance Notes** — any compliance considerations or risks (especially regarding expiry)
3. **Recommended Actions** — 2-3 specific next steps for HR

Be concise and practical.`
      });
      setAnalysis(res);
    } catch {
      setAnalysis("⚠ Couldn't generate analysis right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This was previously `useState(() => { analyze(); }, [])` — useState
  // doesn't take a second "deps" argument at all (that's useEffect); it was
  // silently ignored, and analyze() ran as a useState lazy initializer,
  // which React calls synchronously *during* the initial render, not after
  // mount. That's against React's rule that initializers must be pure, and
  // is fragile under Strict Mode's double-invocation of render — it worked
  // here mostly by accident. useEffect is the correct tool for "run this
  // once after mount."
  useEffect(() => { analyze(); }, []);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
        style={{ background: "#0F1B2D" }}>
        <div>
          <p className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> AI Document Analysis
          </p>
          <p className="text-white/50 text-xs mt-0.5 truncate max-w-[220px]">{doc.document_name}</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Analyzing document…</p>
            <p className="text-xs text-gray-400 mt-1">This takes a moment</p>
          </div>
        )}

        {!loading && analysis && (
          <ReactMarkdown
            className="prose prose-sm max-w-none text-gray-700"
            components={{
              h2: ({ children }) => <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mt-4 mb-1.5 first:mt-0">{children}</h2>,
              ul: ({ children }) => <ul className="space-y-1 my-1">{children}</ul>,
              li: ({ children }) => <li className="flex items-start gap-1.5 text-xs text-gray-700"><span className="text-amber-400 mt-0.5 flex-shrink-0">•</span><span>{children}</span></li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              p: ({ children }) => <p className="text-xs text-gray-600 my-1.5 leading-relaxed">{children}</p>,
            }}
          >
            {analysis}
          </ReactMarkdown>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <Button onClick={analyze} disabled={loading} size="sm" className="w-full gap-2 text-white" style={{ background: "#0F1B2D" }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Re-analyze
        </Button>
      </div>
    </div>
  );
}