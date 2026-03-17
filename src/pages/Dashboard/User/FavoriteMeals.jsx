import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-black.vercel.app/favorites?email=${user.email}`,
          { cache: "no-store" } // prevent browser caching
        );

        const data = await res.json();

        // remove duplicates by mealId
        const uniqueFavs = data.filter(
          (fav, index, self) =>
            index === self.findIndex((f) => f.mealId === fav.mealId)
        );

        setFavorites(uniqueFavs);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Remove this meal from favorites?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/favorites/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setFavorites((prev) => prev.filter((fav) => fav._id !== id));
        toast.success("Meal removed from favorites!");
      } else {
        toast.error(data.message || "Failed to delete favorite.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10">Please login first.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <Toaster />

      <h2 className="text-2xl text-blue-500 font-bold mb-4">
        Favorite Meals
      </h2>

      {favorites.length === 0 ? (
        <p className="text-black">No favorite meals yet.</p>
      ) : (
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="table w-full bg-base-100 shadow-lg rounded-xl"
        >
          <thead>
            <tr>
              <th>Meal Name</th>
              <th>Chef Name</th>
              <th>Price</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {favorites.map((fav) => (
              <motion.tr
                key={fav._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td>{fav.mealName}</td>
                <td>{fav.chefName}</td>
                <td>{fav.price ? `BDT ${fav.price}` : "—"}</td>
                <td>
                  {fav.addedTime
                    ? new Date(fav.addedTime).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(fav._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default FavoriteMeals;