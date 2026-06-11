import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const res = await fetch(
          `https://local-chef-bazaar-server-black.vercel.app/orders?email=${user.email}`
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email, loading]);

  if (loading || ordersLoading) {
    return (
      <div className="text-center py-20 text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <div className="max-w-6xl mx-auto">

        {/* MAIN GLASS CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* HEADER */}
            <h2 className="text-4xl font-bold text-white mb-2">
              My Orders
            </h2>

            <p className="text-slate-300 mb-8">
              Track all your food orders in one place.
            </p>

            {/* EMPTY STATE */}
            {orders.length === 0 ? (
              <div className="text-slate-300 text-center py-10">
                No orders found.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-lg"
                  >
                    {/* CARD GLOW */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 blur-[80px]" />

                    <div className="relative z-10 text-white space-y-2">

                      <h3 className="text-xl font-bold text-white">
                        {order.mealName}
                      </h3>

                      <p className="text-slate-300">
                        <span className="text-blue-400">Chef:</span>{" "}
                        {order.chefName}
                      </p>

                      <p className="text-slate-300">
                        <span className="text-blue-400">Price:</span>{" "}
                        ৳{order.price}
                      </p>

                      <p className="text-slate-300">
                        <span className="text-blue-400">Quantity:</span>{" "}
                        {order.quantity}
                      </p>

                      <p className="text-slate-300 text-sm">
                        {new Date(order.orderTime).toLocaleString()}
                      </p>

                      {/* STATUS BADGE */}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          order.orderStatus === "delivered"
                            ? "bg-green-500/20 text-green-300"
                            : order.orderStatus === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                      <p className="text-slate-300 mt-2">
                        <span className="text-blue-400">Payment:</span>{" "}
                        {order.paymentStatus}
                      </p>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyOrders;