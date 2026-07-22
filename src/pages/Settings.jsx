import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Bell, Shield, AlertTriangle } from "lucide-react";

const DEFAULTS = {
  company_name: "StaffCore Inc.",
  currency: "USD",
  timezone: "UTC-5",
  email_notifications: true,
  payroll_alerts: true,
  leave_alerts: false,
  require_2fa: false,
  session_timeout_minutes: 60,
};

export default function Settings() {
  // recordId is null until we know whether a CompanySettings row already
  // exists. Save creates the first time, updates every time after — this is
  // a singleton entity, so we never want more than one row.
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.entities.CompanySettings.list()
      .then(rows => {
        if (rows?.length) {
          const existing = rows[0];
          setRecordId(existing.id);
          setForm({ ...DEFAULTS, ...existing });
        }
      })
      .catch(() => setError("Couldn't load settings — showing defaults. Saving will create a new record."))
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (recordId) {
        await base44.entities.CompanySettings.update(recordId, form);
      } else {
        const created = await base44.entities.CompanySettings.create(form);
        setRecordId(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e?.message || "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, desc, children }) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-800 font-medium">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-400">
          Loading settings…
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-xs text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Section icon={Building2} title="Company">
        <div className="space-y-1.5">
          <Label>Company Name</Label>
          <Input value={form.company_name} onChange={e => set("company_name")(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={form.currency} onValueChange={set("currency")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={set("timezone")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-8">UTC-8 (PT)</SelectItem>
                <SelectItem value="UTC-7">UTC-7 (MT)</SelectItem>
                <SelectItem value="UTC-6">UTC-6 (CT)</SelectItem>
                <SelectItem value="UTC-5">UTC-5 (ET)</SelectItem>
                <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Row label="Email Notifications" desc="Receive system emails for important events">
          <Switch checked={form.email_notifications} onCheckedChange={set("email_notifications")} />
        </Row>
        <Row label="Payroll Alerts" desc="Get notified when payroll needs approval">
          <Switch checked={form.payroll_alerts} onCheckedChange={set("payroll_alerts")} />
        </Row>
        <Row label="Leave Request Alerts" desc="Notify when employees submit leave requests">
          <Switch checked={form.leave_alerts} onCheckedChange={set("leave_alerts")} />
        </Row>
      </Section>

      <Section icon={Shield} title="Security">
        <Row label="Two-Factor Authentication" desc="Require 2FA for all admin logins">
          <Switch checked={form.require_2fa} onCheckedChange={set("require_2fa")} />
        </Row>
        <Row label="Session Timeout" desc="Auto-logout after inactivity">
          <Select value={String(form.session_timeout_minutes)} onValueChange={v => set("session_timeout_minutes")(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="480">8 hours</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="text-white px-8" style={{ background: "#0F1B2D" }}>
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
