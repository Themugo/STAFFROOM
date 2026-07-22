import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { Upload, X, CheckCircle2, Users, User } from "lucide-react";

const DOC_TYPES = ["Pay Slip", "Contract", "Tax Document", "ID", "Certificate", "Performance Review", "Onboarding", "Policy", "Other"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];

export default function BulkUploadModal({ open, onClose, employees, currentUser, onDone }) {
  const [mode, setMode] = useState("department"); // "department" | "individual"
  const [targetDept, setTargetDept] = useState("");
  const [targetEmpId, setTargetEmpId] = useState("");
  const [docType, setDocType] = useState("Pay Slip");
  const [period, setPeriod] = useState("");
  const [visibleToEmployee, setVisibleToEmployee] = useState(true);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState([]); // [{name, status: 'pending'|'uploading'|'done'|'error'}]
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const reset = () => {
    setMode("department"); setTargetDept(""); setTargetEmpId(""); setDocType("Pay Slip");
    setPeriod(""); setVisibleToEmployee(true); setFiles([]); setProgress([]); setRunning(false); setDone(false);
    setUploadError(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files || e.target.files || []);
    setFiles(prev => [...prev, ...dropped]);
  };

  const removeFile = (idx) => setFiles(f => f.filter((_, i) => i !== idx));

  // For department mode: try to match filename to employee name, else assign to all in dept
  const matchEmployee = (fileName) => {
    if (mode === "individual") return employees.find(e => e.id === targetEmpId);
    // Try to find employee name in filename
    const lower = fileName.toLowerCase();
    const match = employees.find(e =>
      e.department === targetDept &&
      e.full_name?.toLowerCase().split(" ").some(part => part.length > 2 && lower.includes(part))
    );
    return match || null;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setRunning(true);
    setUploadError(null);
    const initial = files.map(f => ({ name: f.name, status: "pending" }));
    setProgress(initial);

    let failureCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(p => p.map((x, idx) => idx === i ? { ...x, status: "uploading" } : x));

      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        // Determine target employee(s)
        let targets = [];
        if (mode === "individual") {
          const emp = employees.find(e => e.id === targetEmpId);
          if (emp) targets = [emp];
        } else {
          const matched = matchEmployee(file.name);
          if (matched) {
            targets = [matched];
          } else {
            // Assign to entire department
            targets = employees.filter(e => e.department === targetDept && e.status !== "Terminated");
          }
        }

        for (const emp of targets) {
          await base44.entities.EmployeeDocument.create({
            employee_id: emp.id,
            employee_name: emp.full_name,
            department: emp.department,
            document_name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
            document_type: docType,
            file_url,
            pay_period: period || undefined,
            // The entity's actual field is `visibility` (enum: "employee" |
            // "hr_only"), not `visible_to_employee` (boolean). Writing the
            // wrong field name meant this toggle did nothing at all —
            // `visibility` was never set, so it silently defaulted to
            // "employee" regardless of what HR selected here, meaning a
            // document meant to be HR-only would still show up in the
            // employee's self-service view. `document_category` and
            // `is_bulk` aren't in the schema either and aren't read
            // anywhere in the app — dropped as dead weight.
            visibility: visibleToEmployee ? "employee" : "hr_only",
            uploaded_by: currentUser?.email || "HR",
          });
        }

        setProgress(p => p.map((x, idx) => idx === i ? { ...x, status: "done", assignedTo: targets.map(e => e.full_name).join(", ") || "Unknown" } : x));
      } catch {
        // Previously any single file's failure (upload or entity create)
        // threw out of the whole function — the loop never continued to
        // the remaining files, `running` stayed true forever, and
        // onDone() never fired, so the HR document table wouldn't even
        // refresh to show whichever files DID succeed before the failure.
        // Now a failed file is marked and the batch continues.
        failureCount++;
        setProgress(p => p.map((x, idx) => idx === i ? { ...x, status: "error" } : x));
      }
    }

    setRunning(false);
    setDone(true);
    if (failureCount > 0) {
      setUploadError(`${failureCount} of ${files.length} file${files.length !== 1 ? "s" : ""} failed to upload. Files that succeeded were saved.`);
    }
    onDone();
  };

  const targetEmployees = mode === "department"
    ? employees.filter(e => e.department === targetDept && e.status !== "Terminated")
    : [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Bulk Upload Documents
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-8 text-center space-y-4">
            {uploadError ? (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                  <X className="w-6 h-6 text-amber-500" />
                </div>
                <p className="font-semibold text-gray-900">Upload Finished With Errors</p>
                <p className="text-sm text-amber-700">{uploadError}</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-semibold text-gray-900">Upload Complete!</p>
                <p className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? "s" : ""} processed and assigned.</p>
              </>
            )}
            <div className="text-left space-y-1.5 max-h-48 overflow-y-auto">
              {progress.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-gray-50 rounded-lg px-3 py-2">
                  {p.status === "error"
                    ? <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-gray-500">{p.status === "error" ? "Failed to upload" : `→ ${p.assignedTo}`}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleClose} className="text-white" style={{ background: "#0F1B2D" }}>Done</Button>
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            {/* Target Mode */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("department")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${mode === "department" ? "border-gray-800 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
              >
                <Users className={`w-5 h-5 ${mode === "department" ? "text-gray-800" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">By Department</p>
                  <p className="text-xs text-gray-500">Push to all in a dept</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode("individual")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${mode === "individual" ? "border-gray-800 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
              >
                <User className={`w-5 h-5 ${mode === "individual" ? "text-gray-800" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Individual</p>
                  <p className="text-xs text-gray-500">Upload for one employee</p>
                </div>
              </button>
            </div>

            {/* Target Selector */}
            {mode === "department" ? (
              <div className="space-y-1.5">
                <Label>Target Department *</Label>
                <Select value={targetDept} onValueChange={setTargetDept}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
                {targetDept && (
                  <p className="text-xs text-gray-500">{targetEmployees.length} active employee{targetEmployees.length !== 1 ? "s" : ""} in {targetDept}.</p>
                )}
                {targetDept && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                    <p className="font-semibold mb-1">Smart file matching:</p>
                    <p>Files will be matched to employees by name in the filename (e.g. <em>john-doe-payslip.pdf</em> → John Doe). Unmatched files are assigned to all {targetEmployees.length} employees.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Employee *</Label>
                <Select value={targetEmpId} onValueChange={setTargetEmpId}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.filter(e => e.status !== "Terminated").map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Doc Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Document Type *</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Period / Reference</Label>
                <Input value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. March 2026, FY2025" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <Label className="cursor-pointer">Visible to Employee</Label>
                <p className="text-xs text-gray-400 mt-0.5">Employees can see this in their self-service portal</p>
              </div>
              <Switch checked={visibleToEmployee} onCheckedChange={setVisibleToEmployee} />
            </div>

            {/* File Drop Zone */}
            <div
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <input type="file" id="bulk-upload" multiple className="hidden" onChange={handleFileDrop} />
              <label htmlFor="bulk-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Drag & drop files or <span className="text-blue-600 underline">browse</span></p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG, JPG — multiple files supported</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {files.map((f, i) => {
                    const prog = progress[i];
                    return (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-xs">
                        <div className="flex-1 truncate text-gray-700">{f.name}</div>
                        {prog?.status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                        {prog?.status === "uploading" && <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin flex-shrink-0" />}
                        {prog?.status === "error" && <span className="text-xs text-red-600 flex-shrink-0">Failed</span>}
                        {!prog && (
                          <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleUpload}
                disabled={running || files.length === 0 || (mode === "department" && !targetDept) || (mode === "individual" && !targetEmpId)}
                className="text-white gap-2"
                style={{ background: "#0F1B2D" }}
              >
                {running ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload {files.length > 0 ? `${files.length} File${files.length !== 1 ? "s" : ""}` : ""}</>}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}