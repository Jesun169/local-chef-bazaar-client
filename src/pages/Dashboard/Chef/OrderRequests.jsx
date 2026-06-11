import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const OrderRequests = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/orders?chefId=${user.uid}`
      );

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);

      await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/orders/status/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = (order, action) => {
    if (order.orderStatus === "cancelled" || order.orderStatus === "delivered")
      return true;

    if (order.orderStatus === "accepted") {
      return action !== "deliver";
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* Header */}
            <h2 className="text-4xl font-bold text-white mb-2">
              Order Requests
            </h2>

            <p className="text-slate-300 mb-8">
              Manage customer orders in real time.
            </p>

            {/* Loading */}
            {loading && (
              <p className="text-cyan-400 mb-4">Loading orders...</p>
            )}

            {/* Empty state */}
            {!loading && orders.length === 0 && (
              <p className="text-red-400">No orders yet.</p>
            )}

            {/* Orders List */}
            <div className="space-y-5">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg"
                >
                  <div className="grid md:grid-cols-2 gap-4 text-slate-200">

                    <div className="space-y-1">
                      <p><span className="text-cyan-300">Meal:</span> {order.mealName}</p>
                      <p><span className="text-cyan-300">Price:</span> ৳{order.price}</p>
                      <p><span className="text-cyan-300">Quantity:</span> {order.quantity}</p>
                      <p><span className="text-cyan-300">Status:</span> {order.orderStatus}</p>
                    </div>

                    <div className="space-y-1">
                      <p><span className="text-cyan-300">User:</span> {order.userEmail}</p>
                      <p><span className="text-cyan-300">Address:</span> {order.userAddress}</p>
                      <p>
                        <span className="text-cyan-300">Time:</span>{" "}
                        {new Date(order.orderTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="text-cyan-300">Payment:</span>{" "}
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-5">

                    <button
                      className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition"
                      disabled={isDisabled(order, "cancel") || loading}
                      onClick={() => updateStatus(order._id, "cancelled")}
                    >
                      Cancel
                    </button>

                    <button
                      className="px-4 py-2 rounded-xl bg-blue-500/80 hover:bg-blue-500 text-white transition"
                      disabled={isDisabled(order, "accept") || loading}
                      onClick={() => updateStatus(order._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="px-4 py-2 rounded-xl bg-green-500/80 hover:bg-green-500 text-white transition"
                      disabled={isDisabled(order, "deliver") || loading}
                      onClick={() => updateStatus(order._id, "delivered")}
                    >
                      Deliver
                    </button>

                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderRequests;