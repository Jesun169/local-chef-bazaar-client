import { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const CreateMeal = () => {
  const { user } = useAuth();
  const [foodName, setFoodName] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [chefExperience, setChefExperience] = useState("");
  const [orderNow, setOrderNow] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return alert("You must be logged in!");

    const mealData = {
      foodName,
      foodImage,
      price: Number(price),
      rating: Number(rating),
      ingredients: ingredients.split(",").map(i => i.trim()),
      deliveryArea,
      estimatedDeliveryTime,
      chefExperience,
      orderNow,
      chefName: user.displayName || "Chef",
      chefId: user.uid || user._id,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Meal created successfully!");
        // Reset form
        setFoodName("");
        setFoodImage("");
        setPrice("");
        setRating("");
        setIngredients("");
        setDeliveryArea("");
        setEstimatedDeliveryTime("");
        setChefExperience("");
        setOrderNow(true);
      } else {
        alert(data.message || "Failed to create meal.");
      }
    } catch (err) {
      console.error("Create meal error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Meal</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input input-bordered w-full"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />

        <input
          className="input input-bordered w-full"
          placeholder="Food Image URL"
          value={foodImage}
          onChange={(e) => setFoodImage(e.target.value)}
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Price (BDT)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
        />

        <input
          className="input input-bordered w-full"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Delivery Area"
          value={deliveryArea}
          onChange={(e) => setDeliveryArea(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Estimated Delivery Time"
          value={estimatedDeliveryTime}
          onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Chef Experience"
          value={chefExperience}
          onChange={(e) => setChefExperience(e.target.value)}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={orderNow}
            onChange={(e) => setOrderNow(e.target.checked)}
            className="checkbox"
          />
          <span>Available for Order Now</span>
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add Meal"}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateMeal;
