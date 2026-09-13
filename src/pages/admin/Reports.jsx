import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const periods = ["weekly", "monthly", "yearly"];

const formatLabel = (id, period) => {
  if (period === "monthly") return `${id.year}-${String(id.month).padStart(2, "0")}`;
  if (period === "weekly") return `${id.year}-W${id.week}`;
  return `${id.year}`;
};

/**
 * Builds a CSV file in-browser from the current report rows and
 * triggers a download — no backend round-trip or extra dependency needed.
 */
const downloadCSV = (rows, period) => {
  const header = ["Period", "Orders", "Items Sold", "Revenue", "Avg Order Value"];
  const lines = rows.map((row) => [
    formatLabel(row._id, period),
    row.totalOrders,
    row.totalItemsSold,
    row.totalRevenue,
    Math.round(row.avgOrderValue),
  ]);

  const csvContent = [header, ...lines].map((line) => line.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `manzeil-sales-report-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const [period, setPeriod] = useState("monthly");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/reports/sales", { params: { period } });
        setRows(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [period]);

  return (
    <div>
      {/* Print header - only visible on the printed page */}
      <div className="hidden print:block mb-6">
        <h1 className="text-xl font-semibold">Manzeil — Sales Report</h1>
        <p className="text-sm text-gray-500 capitalize">
          {period} report · generated {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-xl font-semibold text-gray-900">Sales Reports</h1>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded text-sm capitalize ${
                period === p ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 mb-4 print:hidden">{error}</p>}
      {loading && <p className="text-gray-500 print:hidden">Loading...</p>}

      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden print:border-none">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 print:bg-white">
            <tr>
              <th className="p-3">Period</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Items Sold</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Avg. Order Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td className="p-3">{formatLabel(row._id, period)}</td>
                <td className="p-3">{row.totalOrders}</td>
                <td className="p-3">{row.totalItemsSold}</td>
                <td className="p-3">Rs. {row.totalRevenue}</td>
                <td className="p-3">Rs. {Math.round(row.avgOrderValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <p className="p-6 text-center text-gray-500 print:hidden">No sales data yet for this period.</p>
        )}
      </div>

      {rows.length > 0 && (
        <div className="flex gap-3 mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => downloadCSV(rows, period)}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded text-sm hover:bg-gray-50"
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
