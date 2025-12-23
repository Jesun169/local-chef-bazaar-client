import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetch(`https://local-chef-bazaar-server-black.vercel.app/meals/${id}`)
      .then(res => res.json())
      .then(data => setMeal(data));
  }, [id]);

  if (!meal) return <div className="text-center py-20"><span className="loading loading-dots loading-xl"></span></div>;

  const totalPrice = meal.price * quantity;

  const handleConfirmOrder = () => {
    if (!address) {
      Swal.fire("Address Required!", "Please enter your delivery address", "warning");
      return;
    }

    Swal.fire({
      title: "Confirm Order",
      text: `Your total price is BDT${totalPrice}. Do you want to confirm the order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const orderData = {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity,
          chefId: meal.chefId,
          paymentStatus: "Pending",
          userEmail: user.email,
          userAddress: address,
          orderStatus: "pending",
          orderTime: new Date().toISOString(),
        };

        const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.insertedId) {
          Swal.fire("Success!", "Order placed successfully!", "success");
          navigate("/dashboard/order");
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <div className="bg-base-100 shadow-xl rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-bold text-blue-600 text-center">🛒 Confirm Your Order</h2>

        <div>
          <label className="label">Meal Name</label>
          <input
            type="text"
            value={meal.foodName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Price (BDT)</label>
          <input
            type="number"
            value={meal.price}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Chef ID</label>
          <input
            type="text"
            value={meal.chefId}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Your Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Delivery Address</label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Enter your full delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="text-right font-semibold text-blue-600 text-lg">
          Total: BDT {totalPrice}
        </div>


        <button
          onClick={handleConfirmOrder}
          className="btn btn-primary w-full mt-4"
        >
          Confirm Order
        </button>
      </div>
    </motion.div>
  );
};

export default Order;
