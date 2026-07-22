import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_BAND = { min_years: 0, max_years: null, days_per_year: 20, label: "" };

export default function TenureBandsEditor({ bands = [], onChange }) {
  const update = (i, key, val) => {
    const next = bands.map((b, idx) => idx === i ? { ...b, [key]: val } : b);
    onChange(next);
  };

  const addBand = () => {
    const lastMax = bands[bands.length - 1]?.max_years ?? 0;
    onChange([...bands, { ...DEFAULT_BAND, min_years: lastMax || bands.length * 2 }]);
  };

  const removeBand = (i) => onChange(bands.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tenure Bands</Label>
        <Button type="button" variant="outline" size="sm" onClick={addBand} className="h-7 text-xs gap-1">
          <Plus className="w-3 h-3" /> Add Band
        </Button>
      </div>

      {bands.length === 0 && (
        <p className="text-xs text-gray-400 italic">No bands yet. Add one to get started.</p>
      )}

      <div className="space-y-2">
        {bands.map((band, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end bg-gray-50 rounded-xl p-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400">Min Years</Label>
              <Input
                type="number" min="0" step="1"
                value={band.min_years ?? ""}
                onChange={e => update(i, "min_years", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400">Max Years</Label>
              <Input
                type="number" min="0" step="1"
                value={band.max_years ?? ""}
                onChange={e => update(i, "max_years", e.target.value ? parseFloat(e.target.value) : null)}
                className="h-8 text-xs"
                placeholder="No limit"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400">Days / Year</Label>
              <Input
                type="number" min="0" step="0.5"
                value={band.days_per_year ?? ""}
                onChange={e => update(i, "days_per_year", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs"
                placeholder="e.g. 20"
              />
            </div>
            <button type="button" onClick={() => removeBand(i)} className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {bands.length > 0 && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 space-y-1">
          {bands.map((b, i) => (
            <p key={i} className="text-xs text-blue-700">
              <strong>{b.min_years}–{b.max_years ?? "∞"} years:</strong> {b.days_per_year} days/year ({(b.days_per_year / 12).toFixed(2)} days/month)
            </p>
          ))}
        </div>
      )}
    </div>
  );
}