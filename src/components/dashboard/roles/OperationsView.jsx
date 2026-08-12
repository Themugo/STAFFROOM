import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Boxes,
  ShoppingCart,
  Wrench,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Settings
} from "lucide-react";
import { transportService, assetsService, procurementService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

export default function OperationsView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function loadOpsData() {
      try {
        setLoading(true);
        const [vList, aList] = await Promise.all([
          transportService.getVehicles(),
          assetsService.getAssets()
        ]);
        setVehicles(vList || []);
        setAssets(aList || []);
      } catch (err) {
        setError("Unable to load operations dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadOpsData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (OPERATIONS METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <Settings size={14} className="text-[#2563EB]" /> What Matters (Fleet, Assets & Logistics)
          </h2>
          <span className="text-[11px] text-[#526581]">Operations Control Room</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Bus size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                88% Active
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Fleet Vehicles Active</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{vehicles.length || 18}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Boxes size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Tracked
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Registered Asset Items</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{assets.length || 340}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <ShoppingCart size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                7 Pending
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Open Procurement POs</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">7</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Wrench size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Priority
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Facility Maintenance Tickets</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION & WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-rose-500" /> What Needs My Attention
            </h3>
            <Link to={createPageUrl("TransportManagement")} className="text-[11px] font-bold text-[#2563EB] hover:underline">
              Transport Fleet →
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Vehicle KCD 123A Service Due</strong>
                <span className="text-[11px] text-[#526581]">10,000 km Mileage threshold reached</span>
              </div>
              <Link to={createPageUrl("TransportManagement")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Book Service
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Procurement PO #PO-8842 Overbudget</strong>
                <span className="text-[11px] text-[#526581]">IT Hardware Bulk Purchase Approval</span>
              </div>
              <Link to={createPageUrl("Procurement")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Review PO
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened Recently
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Logistics Feed</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Dispatched Mombasa Field Logistics Shuttle</strong>
                <span className="text-[11px] text-[#526581]">14 Staff passengers on board</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">2 hrs ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Assigned 12 Laptops to Engineering Cohort</strong>
                <span className="text-[11px] text-[#526581]">Asset tags barcode verified</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
          What Should I Do Next? (Operations Quick Actions)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to={createPageUrl("TransportManagement")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Book Fleet Trip Dispatch</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("AssetManagement")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Tag New Hardware Asset</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("Procurement")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Issue Vendor LPO</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
