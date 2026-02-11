import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites for the logged-in user
  useEffect(() => {
    if (user?.email) {
      fetch(`https://local-chef-bazaar-server-black.vercel.app/favorites?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(fav => ({
            ...fav,
            _id: fav._id.toString(), // always convert to string
          }));
          setFavorites(formatted);
        })
        .catch(err => console.error("Failed to fetch favorites:", err));
    }
  }, [user]);

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Remove this meal from favorites?");
    if (!confirmDelete) return;

    try {
      console.log("Deleting favorite ID:", id);

      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/favorites/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== id));
        alert("Meal removed from favorites successfully.");
      } else {
        alert(data.message || "Failed to delete favorite.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl text-blue-500 font-bold mb-4">Favorite Meals</h2>

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
            {favorites.map(fav => (
              <motion.tr
                key={fav._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td>{fav.mealName}</td>
                <td>{fav.chefName}</td>
                <td>{fav.price ? `BDT ${fav.price}` : "—"}</td>
                <td>{new Date(fav.addedTime).toLocaleDateString()}</td>
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
