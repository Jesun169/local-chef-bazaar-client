import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const OrderRequests = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://local-chef-bazaar-server-black.vercel.app/orders?chefEmail=${user.email}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
      {orders.length === 0 ? <p>No orders yet.</p> :
        <ul className="space-y-2">
          {orders.map(order => (
            <li key={order._id} className="p-4 bg-white shadow rounded">
              <p>Meal: {order.mealName}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Status: {order.orderStatus}</p>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default OrderRequests;
