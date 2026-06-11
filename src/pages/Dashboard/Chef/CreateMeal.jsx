import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUtensils,
  FaImage,
  FaMoneyBillWave,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUserTie,
} from "react-icons/fa";
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

    if (!user?.email) {
      return toast.error("Please login first");
    }

    const mealData = {
      foodName,
      foodImage,
      price: Number(price),
      rating: Number(rating),
      ingredients: ingredients
        .split(",")
        .map((item) => item.trim()),

      deliveryArea,
      estimatedDeliveryTime,
      chefExperience,
      orderNow,

      chefName: user.displayName || "Chef",
      chefEmail: user.email,
      chefId: user.uid || user._id,

      createdAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/meals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Meal created successfully!");

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
        toast.error(data.message || "Failed to create meal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)]">

          {/* Glow Effects */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          {/* Header */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">
              Create New Meal
            </h1>
          </div>

          <div className="relative p-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Food Name */}
              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaUtensils />
                  Food Name
                </label>

                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                  className="input w-full bg-white/10 border border-white/20 text-white"
                />
              </div>

              {/* Food Image */}
              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaImage />
                  Food Image URL
                </label>

                <input
                  type="text"
                  value={foodImage}
                  onChange={(e) => setFoodImage(e.target.value)}
                  className="input w-full bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Price */}
                <div>
                  <label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FaMoneyBillWave />
                    Price
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="input w-full bg-white/10 border border-white/20 text-white"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FaStar />
                    Rating
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="input w-full bg-white/10 border border-white/20 text-white"
                  />
                </div>

              </div>

              {/* Ingredients */}
              <div>
                <label className="text-slate-300 mb-2 block">
                  Ingredients (comma separated)
                </label>

                <textarea
                  rows="3"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="textarea w-full bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">

                {/* Area */}
                <div>
                  <label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt />
                    Delivery Area
                  </label>

                  <input
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="input w-full bg-white/10 border border-white/20 text-white"
                  />
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FaClock />
                    Delivery Time
                  </label>

                  <input
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    className="input w-full bg-white/10 border border-white/20 text-white"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FaUserTie />
                    Chef Experience
                  </label>

                  <input
                    value={chefExperience}
                    onChange={(e) => setChefExperience(e.target.value)}
                    className="input w-full bg-white/10 border border-white/20 text-white"
                  />
                </div>

              </div>

              {/* Available */}
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  checked={orderNow}
                  onChange={(e) => setOrderNow(e.target.checked)}
                  className="toggle toggle-primary"
                />

                <span className="text-white font-medium">
                  Available For Order
                </span>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-4
                  rounded-xl
                  font-bold
                  text-white
                  bg-gradient-to-r
                  from-blue-600
                  via-cyan-500
                  to-purple-600
                  shadow-lg
                "
              >
                {loading ? "Creating Meal..." : "Create Meal"}
              </motion.button>

            </form>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMeal;