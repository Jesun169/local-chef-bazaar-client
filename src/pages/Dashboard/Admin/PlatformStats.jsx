import { useEffect, useState } from "react";

const PlatformStats = () => {
  const [stats, setStats] = useState({ users: 0, meals: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersRes, mealsRes, ordersRes] = await Promise.all([
          fetch("https://local-chef-bazaar-server-black.vercel.app/users"),
          fetch("https://local-chef-bazaar-server-black.vercel.app/meals"),
          fetch("https://local-chef-bazaar-server-black.vercel.app/orders"),
        ]);

        if (!usersRes.ok || !mealsRes.ok || !ordersRes.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const [usersData, mealsData, ordersData] = await Promise.all([
          usersRes.json(),
          mealsRes.json(),
          ordersRes.json(),
        ]);

        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          meals: Array.isArray(mealsData) ? mealsData.length : 0,
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-6">Loading stats...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-2xl text-blue-500 font-bold mb-4">Platform Statistics</h2>
      <div className="space-y-2">
        <p className="text-black">Total Users: <span className="font-semibold">{stats.users}</span></p>
        <p  className="text-black">Total Meals: <span className="font-semibold">{stats.meals}</span></p>
        <p className="text-black">Total Orders: <span className="font-semibold">{stats.orders}</span></p>
      </div>
    </div>
  );
};

export default PlatformStats;
