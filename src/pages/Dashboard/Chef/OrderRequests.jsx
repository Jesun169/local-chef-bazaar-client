import { useEffect, useState } from "react";
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

      if (!res.ok) {
        console.error("Failed to fetch orders");
        return;
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
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
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/orders/status/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Error updating order:", text);
        return;
      }

      await res.json();
      fetchOrders(); 
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = (order, action) => {
    if (order.orderStatus === "cancelled" || order.orderStatus === "delivered") {
      return true;
    }
    if (order.orderStatus === "accepted") {
      return action !== "deliver";
    }
    return false;
  };

  return (
    <div>
      <h2 className="text-black text-2xl font-bold mb-4">Order Requests</h2>

      {loading && <p className="text-blue-500">Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-red-500">No orders yet.</p>
      )}

      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order._id}
            className="p-4 bg-white shadow rounded flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="space-y-1 text-black">
              <p><strong>Meal:</strong> {order.mealName}</p>
              <p><strong>Price:</strong> ৳{order.price}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>User:</strong> {order.userEmail}</p>
              <p><strong>Address:</strong> {order.userAddress}</p>
              <p>
                <strong>Order Time:</strong>{" "}
                {new Date(order.orderTime).toLocaleString()}
              </p>
              <p><strong>Payment:</strong> {order.paymentStatus}</p>
            </div>

            <div className="mt-3 md:mt-0 flex gap-2">
              <button
                className="btn btn-error btn-sm"
                disabled={isDisabled(order, "cancel") || loading}
                onClick={() => updateStatus(order._id, "cancelled")}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary btn-sm"
                disabled={isDisabled(order, "accept") || loading}
                onClick={() => updateStatus(order._id, "accepted")}
              >
                Accept
              </button>

              <button
                className="btn btn-success btn-sm"
                disabled={isDisabled(order, "deliver") || loading}
                onClick={() => updateStatus(order._id, "delivered")}
              >
                Deliver
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderRequests;
