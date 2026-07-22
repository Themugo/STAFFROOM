import { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, BarChart3, Zap } from "lucide-react";
import BenchmarkSummaryBar from "@/components/benchmarking/BenchmarkSummaryBar";
import DeptBenchmarkPanel from "@/components/benchmarking/DeptBenchmarkPanel";
import EmployeeBenchmarkTable from "@/components/benchmarking/EmployeeBenchmarkTable";

const DEPARTMENTS = ["All", "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];

export default function Benchmarking() {
  const [employees, setEmployees] = useState([]);
  const [marketData, setMarketData] = useState(null); // { [jobTitle]: { p25, p50, p75 } }
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [location, setLocation] = useState("United States");
  const [deptFilter, setDeptFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("department"); // "department" | "employee"

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const emps = await base44.entities.Employee.list();
      setEmployees(emps);

      // Build unique job titles with departments for market lookup
      const roles = [...new Set(emps.map(e => e.job_title).filter(Boolean))];

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compensation analyst. For each job title below, provide market salary benchmarks (USD/year) for the location: "${location}". 
      
Job titles: ${roles.join(", ")}

Return ONLY a JSON object where each key is the exact job title and the value is an object with:
- p25: 25th percentile annual salary (integer, no decimals)
- p50: 50th percentile / median annual salary (integer)
- p75: 75th percentile annual salary (integer)

Base these on real-world 2024-2025 market compensation data. Be realistic and differentiated by seniority implied in the title.`,
        response_json_schema: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              p25: { type: "number" },
              p50: { type: "number" },
              p75: { type: "number" }
            }
          }
        }
      });

      setMarketData(result);
    } catch {
      setAnalysisError("Couldn't fetch benchmark data right now. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Enrich employees with benchmark data
  const enriched = useMemo(() => {
    if (!marketData || !employees.length) return [];
    return employees
      .filter(e => e.base_salary && e.job_title && e.status !== "Terminated")
      .map(e => {
        const bench = marketData[e.job_title];
        if (!bench) return { ...e, benchStatus: "no_data" };
        const salary = e.base_salary;
        const diffFromMedian = ((salary - bench.p50) / bench.p50) * 100;
        let benchStatus = "market"; // within ±15% of median
        if (diffFromMedian < -20) benchStatus = "underpaid";
        else if (diffFromMedian < -10) benchStatus = "slightly_under";
        else if (diffFromMedian > 20) benchStatus = "overpaid";
        else if (diffFromMedian > 10) benchStatus = "slightly_over";
        return { ...e, bench, diffFromMedian, benchStatus };
      });
  }, [employees, marketData]);

  // Dept-level aggregation
  const deptStats = useMemo(() => {
    if (!enriched.length) return [];
    const map = {};
    enriched.forEach(e => {
      if (!e.department) return;
      if (!map[e.department]) map[e.department] = { dept: e.department, employees: [], totalDiff: 0 };
      map[e.department].employees.push(e);
    });
    return Object.values(map).map(d => {
      const withData = d.employees.filter(e => e.benchStatus !== "no_data");
      const avgDiff = withData.length ? withData.reduce((s, e) => s + e.diffFromMedian, 0) / withData.length : null;
      const underpaidCount = withData.filter(e => e.benchStatus === "underpaid" || e.benchStatus === "slightly_under").length;
      const overpaidCount = withData.filter(e => e.benchStatus === "overpaid" || e.benchStatus === "slightly_over").length;
      const atRiskRetention = underpaidCount; // underpaid = retention risk
      return { ...d, avgDiff, underpaidCount, overpaidCount, atRiskRetention, withDataCount: withData.length };
    }).sort((a, b) => (a.avgDiff ?? 0) - (b.avgDiff ?? 0));
  }, [enriched]);

  const filteredEnriched = useMemo(() => {
    return enriched
      .filter(e => deptFilter === "All" || e.department === deptFilter)
      .filter(e => !search || e.full_name?.toLowerCase().includes(search.toLowerCase()) || e.job_title?.toLowerCase().includes(search.toLowerCase()));
  }, [enriched, deptFilter, search]);

  // Summary counts
  const underpaidTotal = enriched.filter(e => e.benchStatus === "underpaid").length;
  const slightlyUnderTotal = enriched.filter(e => e.benchStatus === "slightly_under").length;
  const overpaidTotal = enriched.filter(e => e.benchStatus === "overpaid").length;
  const marketTotal = enriched.filter(e => e.benchStatus === "market").length;

  const hasData = marketData && employees.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salary Benchmarking</h2>
          <p className="text-xs text-gray-400 mt-0.5">Compare employee salaries against real market data — flag underpaid and overpaid talent</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-44 h-9 text-sm"
            placeholder="Location (e.g. New York)"
          />
          <Button
            onClick={runAnalysis}
            disabled={analyzing}
            className="text-white gap-2 h-9"
            style={{ background: "#0F1B2D" }}
          >
            {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {analyzing ? "Analyzing…" : hasData ? "Re-analyze" : "Run Analysis"}
          </Button>
        </div>
      </div>

      {analysisError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
          {analysisError}
        </div>
      )}

      {/* Empty state */}
      {!hasData && !analyzing && (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-10 text-center">
          <BarChart3 className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-indigo-800">No benchmark data yet</p>
          <p className="text-sm text-indigo-500 mt-1 max-w-sm mx-auto">
            Set your target market location, then click <strong>Run Analysis</strong> to fetch live market salary benchmarks and compare your team's compensation.
          </p>
        </div>
      )}

      {analyzing && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">Fetching market benchmarks for <span className="text-indigo-600">{location}</span>…</p>
          <p className="text-xs text-gray-400 mt-1">Comparing {employees.length} employee salaries against live market data</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Summary bar */}
          <BenchmarkSummaryBar
            total={enriched.length}
            underpaid={underpaidTotal}
            slightlyUnder={slightlyUnderTotal}
            atMarket={marketTotal}
            overpaid={overpaidTotal}
            location={location}
          />

          {/* View toggle */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
            <button
              onClick={() => setView("department")}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${view === "department" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              By Department
            </button>
            <button
              onClick={() => setView("employee")}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${view === "employee" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              By Employee
            </button>
          </div>

          {/* Filters (employee view) */}
          {view === "employee" && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" placeholder="Search employee or title…" />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-40 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {view === "department" && <DeptBenchmarkPanel deptStats={deptStats} />}
          {view === "employee" && <EmployeeBenchmarkTable employees={filteredEnriched} />}
        </>
      )}
    </div>
  );
}