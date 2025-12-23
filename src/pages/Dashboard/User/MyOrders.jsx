import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/orders?email=${user.email}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handlePayment = async (order) => {
    try {
      const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, price: order.price }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (loading) return <div className="text-center py-20">Loading user info...</div>;
  if (ordersLoading) return <div className="text-center py-20">Loading your orders...</div>;
  if (orders.length === 0) return <div className="text-center py-20">No orders found.</div>;

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
            <p><strong>Order Status:</strong> {order.orderStatus}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>

            {order.orderStatus === "accepted" && order.paymentStatus === "Pending" && (
              <button
                className="btn btn-primary mt-4"
                onClick={() => handlePayment(order)}
              >
                Pay Now
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
