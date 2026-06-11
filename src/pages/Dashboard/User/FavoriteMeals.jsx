import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-black.vercel.app/favorites?email=${user.email}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        const uniqueFavs = data.filter(
          (fav, index, self) =>
            index === self.findIndex((f) => f.mealId === fav.mealId)
        );

        setFavorites(uniqueFavs);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Remove from favorites?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/favorites/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setFavorites((prev) => prev.filter((f) => f._id !== id));
        toast.success("Removed from favorites");
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-white">
        Please login first
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <Toaster />

      <div className="max-w-6xl mx-auto">

        {/* MAIN GLASS CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* HEADER */}
            <h2 className="text-4xl font-bold text-white mb-2">
              Favorite Meals
            </h2>

            <p className="text-slate-300 mb-8">
              Your saved meals collection
            </p>

            {favorites.length === 0 ? (
              <p className="text-slate-300 text-center py-10">
                No favorite meals yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">

                <table className="w-full text-white">
                  <thead className="bg-white/10 text-left">
                    <tr>
                      <th className="p-4">Meal</th>
                      <th className="p-4">Chef</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Added</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {favorites.map((fav) => (
                      <tr
                        key={fav._id}
                        className="border-t border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="p-4 font-semibold">
                          {fav.mealName}
                        </td>

                        <td className="p-4 text-slate-300">
                          {fav.chefName}
                        </td>

                        <td className="p-4 text-slate-300">
                          {fav.price ? `৳${fav.price}` : "—"}
                        </td>

                        <td className="p-4 text-slate-300">
                          {fav.addedTime
                            ? new Date(fav.addedTime).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(fav._id)}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
                          >
                            Remove
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteMeals;