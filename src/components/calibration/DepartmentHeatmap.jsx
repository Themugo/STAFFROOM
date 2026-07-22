// Heatmap: each dept row, columns = rating buckets 1-5, cell shading by count

const RATING_LABELS = ["1★","2★","3★","4★","5★"];

function cellColor(count, max) {
  if (max === 0 || count === 0) return "bg-gray-50 text-gray-300";
  const pct = count / max;
  if (pct > 0.75) return "bg-indigo-600 text-white";
  if (pct > 0.5)  return "bg-indigo-400 text-white";
  if (pct > 0.25) return "bg-indigo-200 text-indigo-900";
  return "bg-indigo-100 text-indigo-700";
}

export default function DepartmentHeatmap({ deptData }) {
  const keys = ["rating1","rating2","rating3","rating4","rating5"];
  const allCounts = deptData.flatMap(d => keys.map(k => d[k]));
  const max = Math.max(...allCounts, 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Rating Heatmap by Department</h3>
      <p className="text-xs text-gray-400 mb-4">Count of employees per rating bucket</p>
      {deptData.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium pb-2 pr-4 w-28">Dept</th>
                {RATING_LABELS.map(l => (
                  <th key={l} className="text-center font-medium text-gray-500 pb-2 px-1 min-w-[44px]">{l}</th>
                ))}
                <th className="text-center font-medium text-gray-500 pb-2 px-2">Avg</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {deptData.map(d => (
                <tr key={d.dept}>
                  <td className="pr-3 py-1 font-medium text-gray-700 truncate max-w-[112px]">{d.dept}</td>
                  {keys.map((k, i) => (
                    <td key={k} className="px-1 py-1">
                      <div className={`rounded-lg w-10 h-9 flex items-center justify-center font-semibold mx-auto transition-colors ${cellColor(d[k], max)}`}>
                        {d[k] > 0 ? d[k] : "—"}
                      </div>
                    </td>
                  ))}
                  <td className="text-center py-1 px-2">
                    <span className={`font-bold ${d.avgRating >= 4 ? "text-emerald-600" : d.avgRating >= 3 ? "text-indigo-600" : "text-red-500"}`}>
                      {d.avgRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Legend */}
          <div className="flex gap-3 mt-4 justify-end items-center text-xs text-gray-400">
            <span>Low</span>
            {["bg-indigo-100","bg-indigo-200","bg-indigo-400","bg-indigo-600"].map(c => (
              <span key={c} className={`w-5 h-5 rounded ${c} inline-block`} />
            ))}
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
}