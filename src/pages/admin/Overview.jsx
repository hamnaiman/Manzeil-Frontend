import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Eye,
  CalendarDays,
  CalendarRange,
  Package,
} from "lucide-react";
import api from "../../api/axios.js";

const COLORS = ["#8C827A", "#C9BFB3", "#B08D57", "#D9CFC2", "#A89A8A"];

/* ---------- Stat Card (no black bg — soft off-white / tinted) ---------- */
const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 transition-shadow duration-200 hover:shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FBF9F5]">
        <Icon className="w-4.5 h-4.5 text-[#8C827A]" strokeWidth={1.5} />
      </div>
      {trend !== undefined && (
        <span
          className={`text-xs font-medium flex items-center gap-1 ${
            trend >= 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          <TrendingUp className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-xs mb-1 text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

/* ---------- Section Header ---------- */
const SectionLabel = ({ children }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
    {children}
  </h2>
);

/* ---------- Reusable Chart Card wrapper ---------- */
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6">
    <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-400 mb-4">{subtitle}</p>
    {children}
  </div>
);

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [visits, setVisits] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, visitsRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/visits/stats"),
        ]);
        setSummary(summaryRes.data.data);
        setVisits(visitsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load summary");
      }
    };
    fetchData();
  }, []);

  if (error)
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
        {error}
      </div>
    );

  if (!summary)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );

  const revenueGrowth =
    summary.allTime.totalRevenue > 0
      ? Math.round((summary.thisMonth.revenue / summary.allTime.totalRevenue) * 100)
      : 0;

  const statusChartData = summary.statusBreakdown.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  const topProductsData = summary.topProducts.map((p) => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name,
    sold: p.unitsSold,
  }));

  // Reusable trend data — falls back gracefully if backend doesn't send a
  // daily/monthly series yet. Replace `summary.revenueTrend` with your
  // actual field name once the endpoint provides it.
  const revenueTrendData =
    summary.revenueTrend?.map((d) => ({
      label: d.label,
      revenue: d.revenue,
      orders: d.orders,
    })) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your store's performance at a glance
        </p>
      </div>

      {/* ===== CHARTS FIRST ===== */}
      <SectionLabel>Insights</SectionLabel>

      {/* Revenue Trend — full width, reusable anywhere summary.revenueTrend exists */}
      {revenueTrendData.length > 0 && (
        <div className="mb-5">
          <ChartCard title="Revenue Trend" subtitle="Order revenue over time">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueTrendData} margin={{ left: 0, right: 16, top: 8 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8C827A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8C827A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#B7AEA4" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#B7AEA4" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #EFECE6",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8C827A"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Orders by Status — Donut */}
        <ChartCard title="Orders by Status" subtitle="Distribution across order lifecycle">
          {statusChartData.length === 0 ? (
            <p className="text-sm text-gray-400 py-12 text-center">No order data yet</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {statusChartData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #EFECE6",
                      fontSize: "13px",
                      textTransform: "capitalize",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex sm:flex-col gap-3 flex-wrap justify-center">
                {statusChartData.map((s, idx) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="capitalize text-gray-600">{s.name}</span>
                    <span className="text-gray-400 text-xs">({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Top Products — Bar Chart */}
        <ChartCard title="Top Products" subtitle="Best-selling fragrances by units sold">
          {topProductsData.length === 0 ? (
            <p className="text-sm text-gray-400 py-12 text-center">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EBE3" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#B7AEA4" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#5C534D" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "#FBF9F5" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #EFECE6",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="sold" fill="#8C827A" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ===== STAT CARDS BELOW ===== */}
      <SectionLabel>Sales Performance</SectionLabel>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`Rs. ${summary.allTime.totalRevenue.toLocaleString()}`}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={summary.allTime.totalOrders.toLocaleString()}
        />
        <StatCard
          icon={CalendarDays}
          label="This Month Revenue"
          value={`Rs. ${summary.thisMonth.revenue.toLocaleString()}`}
          trend={revenueGrowth}
        />
        <StatCard
          icon={Package}
          label="This Month Orders"
          value={summary.thisMonth.orders.toLocaleString()}
        />
      </div>

      <SectionLabel>Site Traffic</SectionLabel>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Visits" value={visits ? visits.total.toLocaleString() : "—"} />
        <StatCard icon={Users} label="Today" value={visits ? visits.today.toLocaleString() : "—"} />
        <StatCard
          icon={CalendarRange}
          label="Last 7 Days"
          value={visits ? visits.thisWeek.toLocaleString() : "—"}
        />
        <StatCard
          icon={CalendarDays}
          label="This Month"
          value={visits ? visits.thisMonth.toLocaleString() : "—"}
        />
      </div>
    </div>
  );
};

export default Overview;