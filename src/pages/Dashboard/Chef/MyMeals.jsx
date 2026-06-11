import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const MyMeals = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [updatingMeal, setUpdatingMeal] = useState(null);

  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    rating: "",
    estimatedDeliveryTime: "",
    foodImage: "",
  });

  useEffect(() => {
    if (!user?.email) return;

    fetch("https://local-chef-bazaar-server-black.vercel.app/meals")
      .then(res => res.json())
      .then(data => {
        const chefMeals = data.filter(
          meal =>
            meal.chefId === user?.uid || meal.chefEmail === user?.email
        );
        setMeals(chefMeals);
      });
  }, [user]);

  const handleDelete = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        fetch(
          `https://local-chef-bazaar-server-black.vercel.app/meals/${id}`,
          { method: "DELETE" }
        )
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setMeals(prev => prev.filter(meal => meal._id !== id));
              Swal.fire("Deleted!", "Meal has been deleted.", "success");
            }
          });
      }
    });
  };

  const handleUpdate = meal => {
    setUpdatingMeal(meal);
    setFormData({
      foodName: meal.foodName || "",
      price: meal.price || "",
      ingredients: Array.isArray(meal.ingredients)
        ? meal.ingredients.join(", ")
        : meal.ingredients || "",
      rating: meal.rating || "",
      estimatedDeliveryTime: meal.estimatedDeliveryTime || "",
      foodImage: meal.foodImage || "",
    });
  };

  const handleUpdateSubmit = e => {
    e.preventDefault();

    const updatedMeal = {
      ...updatingMeal,
      foodName: formData.foodName,
      price: Number(formData.price),
      ingredients: formData.ingredients.split(",").map(i => i.trim()),
      rating: Number(formData.rating),
      estimatedDeliveryTime: formData.estimatedDeliveryTime,
      foodImage: formData.foodImage,
    };

    fetch(
      `https://local-chef-bazaar-server-black.vercel.app/meals/${updatingMeal._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMeal),
      }
    )
      .then(res => res.json())
      .then(() => {
        setMeals(prev =>
          prev.map(m => (m._id === updatingMeal._id ? updatedMeal : m))
        );
        setUpdatingMeal(null);

        Swal.fire("Updated!", "Meal updated successfully.", "success");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* MAIN GLASS CONTAINER */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)]">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          {/* HEADER */}
          <div className="relative px-8 py-10 border-b border-white/10">
            <h2 className="text-4xl font-bold text-white">
              My Meals
            </h2>

            <p className="text-slate-300 mt-3">
              Manage all your created meals in one powerful dashboard.
            </p>

            <div className="mt-5 w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 p-8">

            {meals.length === 0 ? (
              <p className="text-slate-300 text-center">
                No meals created yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {meals.map(meal => (
                  <motion.div
                    key={meal._id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg"
                  >

                    <img
                      src={meal.foodImage}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-5">

                      <h3 className="text-2xl font-bold text-white mb-2">
                        {meal.foodName}
                      </h3>

                      <div className="text-slate-300 space-y-1 text-sm">
                        <p>💰 Price: <span className="text-cyan-400">৳ {meal.price}</span></p>
                        <p>⭐ Rating: {meal.rating || "N/A"}</p>
                        <p>🚚 Delivery: {meal.estimatedDeliveryTime}</p>
                        <p>👨‍🍳 Chef: {meal.chefName}</p>
                      </div>

                      <div className="flex gap-3 mt-5">

                        <button
                          onClick={() => handleUpdate(meal)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => handleDelete(meal._id)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold"
                        >
                          Delete
                        </button>

                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {updatingMeal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/90 backdrop-blur-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Update Meal
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-3">

              {[
                "foodName",
                "price",
                "ingredients",
                "rating",
                "estimatedDeliveryTime",
                "foodImage",
              ].map(field => (
                <input
                  key={field}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  placeholder={field}
                  value={formData[field]}
                  onChange={e =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              ))}

              <div className="flex gap-3 mt-4">

                <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white">
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setUpdatingMeal(null)}
                  className="flex-1 py-2 rounded-xl bg-gray-600 text-white"
                >
                  Cancel
                </button>

              </div>
            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default MyMeals;