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

        if (!res.ok) throw new Error("Failed to fetch");

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
    return <div className="text-center py-20">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-20">No orders found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 shadow-lg rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-2">{order.mealName}</h3>
            <p><strong>Chef:</strong> {order.chefName}</p>
            <p><strong>Price:</strong> BDT {order.price}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
