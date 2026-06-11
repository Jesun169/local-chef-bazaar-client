import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BASE_URL = "https://local-chef-bazaar-server-black.vercel.app";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

const PlatformStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/stats`);

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-cyan-400">Loading statistics...</p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-400">{error}</p>
    );

  const safeStats = {
    totalUsers: stats?.totalUsers || 0,
    totalMeals: stats?.totalMeals || 0,
    totalChefs: stats?.totalChefs || 0,
    totalOrders: stats?.totalOrders || 0,
    pendingOrders: stats?.pendingOrders || 0,
    deliveredOrders: stats?.deliveredOrders || 0,
    totalRevenue: stats?.totalRevenue || 0,
  };

  const barData = [
    { name: "Users", value: safeStats.totalUsers },
    { name: "Meals", value: safeStats.totalMeals },
    { name: "Orders", value: safeStats.totalOrders },
    { name: "Chefs", value: safeStats.totalChefs },
  ];

  const lineData = [
    { name: "Pending", value: safeStats.pendingOrders },
    { name: "Delivered", value: safeStats.deliveredOrders },
    { name: "Total", value: safeStats.totalOrders },
  ];

  const pieData = [
    { name: "Pending", value: safeStats.pendingOrders },
    { name: "Delivered", value: safeStats.deliveredOrders },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Glass Container */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* Header */}
            <h2 className="text-4xl font-bold text-white mb-2">
              📊 Platform Analytics
            </h2>

            <p className="text-slate-300 mb-8">
              Real-time system overview and performance metrics.
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

              <StatCard title="Users" value={safeStats.totalUsers} />
              <StatCard title="Meals" value={safeStats.totalMeals} />
              <StatCard title="Orders" value={safeStats.totalOrders} />
              <StatCard
                title="Revenue"
                value={`৳ ${safeStats.totalRevenue}`}
              />

            </div>

            {/* BAR CHART */}
            <ChartCard title="Overview (Bar Chart)">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* LINE CHART */}
            <ChartCard title="Orders Trend (Line Chart)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* PIE CHART */}
            <ChartCard title="Order Status (Pie Chart)">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

const StatCard = ({ title, value }) => (
  <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg text-white shadow-lg">
    <p className="text-slate-300 text-sm">{title}</p>
    <p className="text-2xl font-bold text-blue-400">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="mt-8 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg">
    <h3 className="text-blue-300 font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default PlatformStats;