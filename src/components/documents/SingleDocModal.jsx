import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Upload } from "lucide-react";

const DOC_TYPES = ["Pay Slip", "Contract", "Tax Document", "ID", "Certificate", "NDA", "Policy", "Performance Review", "Onboarding", "Other"];

export default function SingleDocModal({ open, onClose, onSave, employees, doc }) {
  const [form, setForm] = useState({ employee_id: "", document_name: "", document_type: "Other", expiry_date: "", pay_period: "", visibility: "employee", notes: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(doc ? { ...doc } : { employee_id: "", document_name: "", document_type: "Other", expiry_date: "", pay_period: "", visibility: "employee", notes: "" });
      setFile(null);
      setUploadError(null);
    }
  }, [doc, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let file_url = form.file_url || "";
    if (file) {
      setUploading(true);
      setUploadError(null);
      try {
        const res = await base44.integrations.Core.UploadFile({ file });
        file_url = res.file_url;
      } catch {
        // Previously unhandled: a failed upload left `uploading` stuck true
        // forever (button frozen on "Uploading…") and silently never called
        // onSave — no error shown, no way to retry without closing the modal.
        setUploadError("Upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const emp = employees.find(e => e.id === form.employee_id);
    onSave({ ...form, file_url, employee_name: emp?.full_name || "", department: emp?.department || "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{doc ? "Edit Document" : "Upload Document"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={form.employee_id} onValueChange={v => set("employee_id", v)} required>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{employees.filter(e => e.status !== "Terminated").map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Document Name *</Label>
              <Input value={form.document_name} onChange={e => set("document_name", e.target.value)} required placeholder="Employment Contract" />
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select value={form.document_type} onValueChange={v => set("document_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {form.document_type === "Pay Slip" && (
            <div className="space-y-1.5">
              <Label>Pay Period</Label>
              <Input value={form.pay_period} onChange={e => set("pay_period", e.target.value)} placeholder="e.g. March 2026" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiry_date} onChange={e => set("expiry_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select value={form.visibility} onValueChange={v => set("visibility", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Visible to employee</SelectItem>
                  <SelectItem value="hr_only">HR only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>File</Label>
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
            <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Optional notes…" />
          </div>

          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

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