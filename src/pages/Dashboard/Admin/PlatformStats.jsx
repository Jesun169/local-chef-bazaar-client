import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PlatformStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "https://local-chef-bazaar-server-black.vercel.app/admin/stats"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch statistics");
        }

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

  if (loading) return <p className="text-center mt-6">Loading statistics...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Pending Orders", value: stats.pendingOrders },
    { name: "Delivered Orders", value: stats.deliveredOrders },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Platform Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-100 rounded text-black">
          <p className="text-sm">Total Users</p>
          <p className="text-xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded text-black">
          <p className="text-sm">Pending Orders</p>
          <p className="text-xl font-bold">{stats.pendingOrders}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded text-black">
          <p className="text-sm">Delivered Orders</p>
          <p className="text-xl font-bold">{stats.deliveredOrders}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded text-black">
          <p className="text-sm">Total Payment</p>
          <p className="text-xl font-bold">৳ {stats.totalPaymentAmount}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformStats;
