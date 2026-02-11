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

  // Fetch meals of this chef
  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://local-chef-bazaar-server-black.vercel.app/meals`)
      .then(res => res.json())
      .then(data => {
        // Filter meals by this chef
        const chefMeals = data.filter(meal => meal.chefId === user?.uid || meal.chefEmail === user?.email);
        setMeals(chefMeals);
      });
  }, [user]);

  // Delete meal function
  const handleDelete = id => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`https://local-chef-bazaar-server-black.vercel.app/meals/${id}`, {
          method: "DELETE",
        })
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

  // Open update modal
  const handleUpdate = meal => {
    setUpdatingMeal(meal);
    setFormData({
      foodName: meal.foodName || "",
      price: meal.price || "",
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : meal.ingredients || "",
      rating: meal.rating || "",
      estimatedDeliveryTime: meal.estimatedDeliveryTime || "",
      foodImage: meal.foodImage || "",
    });
  };

  // Submit update
  const handleUpdateSubmit = e => {
    e.preventDefault();
    const updatedMeal = {
      ...updatingMeal,
      foodName: formData.foodName,
      price: parseFloat(formData.price),
      ingredients: formData.ingredients.split(",").map(i => i.trim()),
      rating: parseFloat(formData.rating),
      estimatedDeliveryTime: formData.estimatedDeliveryTime,
      foodImage: formData.foodImage,
    };

    fetch(`https://local-chef-bazaar-server-black.vercel.app/meals/${updatingMeal._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMeal),
    })
      .then(res => res.json())
      .then(() => {
        setMeals(prev => prev.map(m => (m._id === updatingMeal._id ? updatedMeal : m)));
        setUpdatingMeal(null);
        Swal.fire("Updated!", "Meal has been updated.", "success");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-6">My Meals</h2>

      {meals.length === 0 ? (
        <p className="text-gray-600">No meals created yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map(meal => (
            <motion.li
              key={meal._id}
              layout
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
            >
              <img src={meal.foodImage} alt={meal.foodName} className="h-48 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-black text-xl font-bold  mb-1">{meal.foodName}</h3>
                <p className="text-gray-700 mb-1">Price: ${meal.price}</p>
                <p className="text-gray-700 mb-1">
                  Ingredients:{" "}
                  {Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : meal.ingredients || "N/A"}
                </p>
                <p className="text-gray-700 mb-1">Rating: {meal.rating || "N/A"}</p>
                <p className="text-gray-700 mb-1">Delivery: {meal.estimatedDeliveryTime || "N/A"}</p>
                <p className="text-gray-700 mb-1">Chef: {meal.chefName}</p>
                <p className="text-gray-700 mb-2">Chef ID: {meal.chefId}</p>
                <div className="mt-auto flex gap-2">
                  <button className="btn btn-error flex-1" onClick={() => handleDelete(meal._id)}>
                    Delete
                  </button>
                  <button className="btn btn-primary flex-1" onClick={() => handleUpdate(meal)}>
                    Update
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Update Modal */}
      {updatingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold mb-4">Update Meal</h3>
            <form className="space-y-3" onSubmit={handleUpdateSubmit}>
              <input
                className="input input-bordered w-full"
                placeholder="Food Name"
                value={formData.foodName}
                onChange={e => setFormData({ ...formData, foodName: e.target.value })}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Price"
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Ingredients (comma separated)"
                value={formData.ingredients}
                onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Rating"
                type="number"
                step="0.1"
                value={formData.rating}
                onChange={e => setFormData({ ...formData, rating: e.target.value })}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Estimated Delivery Time"
                value={formData.estimatedDeliveryTime}
                onChange={e => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
              />
              <input
                className="input input-bordered w-full"
                placeholder="Food Image URL"
                value={formData.foodImage}
                onChange={e => setFormData({ ...formData, foodImage: e.target.value })}
              />
              <div className="flex gap-2 mt-4">
                <button className="btn btn-primary flex-1" type="submit">
                  Save
                </button>
                <button className="btn btn-outline flex-1" type="button" onClick={() => setUpdatingMeal(null)}>
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
