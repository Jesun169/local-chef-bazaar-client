import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://local-chef-bazaar-server-black.vercel.app/favorites?email=${user.email}`)
        .then(res => res.json())
        .then(data => setFavorites(data));
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      <h2 className="text-2xl text-blue-500 font-bold mb-4">Favorite Meals</h2>
      {favorites.length === 0 && <p className="text-black">No favorite meals yet.</p>}
      {favorites.map(fav => (
        <motion.div
          key={fav._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 shadow-lg rounded-xl p-4"
        >
          <div>  <h2 className="text-2xl font-bold mb-4">My Favorite Meal</h2></div>
          <p className="font-semibold">{fav.mealName}</p>
          <p>Chef: {fav.chefName}</p>
          <p>Price: BDT {fav.price}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FavoriteMeals;
