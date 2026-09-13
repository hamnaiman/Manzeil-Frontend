import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Card = ({ label, value }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/reports/summary");
        setSummary(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load summary");
      }
    };
    fetchSummary();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!summary) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Revenue" value={`Rs. ${summary.allTime.totalRevenue}`} />
        <Card label="Total Orders" value={summary.allTime.totalOrders} />
        <Card label="This Month Revenue" value={`Rs. ${summary.thisMonth.revenue}`} />
        <Card label="This Month Orders" value={summary.thisMonth.orders} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-3">Orders by Status</h2>
          <ul className="space-y-2 text-sm">
            {summary.statusBreakdown.map((s) => (
              <li key={s._id} className="flex justify-between text-gray-600">
                <span className="capitalize">{s._id}</span>
                <span>{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-3">Top Products</h2>
          <ul className="space-y-2 text-sm">
            {summary.topProducts.map((p) => (
              <li key={p._id} className="flex justify-between text-gray-600">
                <span>{p.name}</span>
                <span>{p.unitsSold} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
