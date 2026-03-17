import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const containerVariant = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariant = {
  hidden: { opacity: 1, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const ITEMS_PER_PAGE = 10;

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://local-chef-bazaar-server-black.vercel.app/meals")
      .then(res => res.json())
      .then(data => setMeals(data));
  }, []);

  const sortedMeals = [...meals].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedMeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMeals = sortedMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDetails = (id) => {
    if (user) navigate(`/meals/${id}`);
    else navigate("/login");
  };

  return (
    <motion.div className="max-w-7xl mx-auto px-4 py-14" variants={containerVariant} initial="hidden" animate="show">

      <motion.h2 variants={cardVariant} className="text-3xl font-bold text-center mb-10">
        🍽 Daily Meals
      </motion.h2>

      {/* Sort Dropdown */}
      <motion.div variants={cardVariant} className="flex justify-end mb-8">
        <select
          className="select select-bordered"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </motion.div>

      {/* Meals Grid */}
      <motion.div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8" variants={containerVariant}>
        {paginatedMeals.map(meal => (
          <motion.div
            key={meal._id}
            variants={cardVariant}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="card bg-base-100 shadow-md overflow-hidden"
          >
            <motion.figure whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
              <img src={meal.foodImage} alt={meal.foodName} className="h-48 w-full object-cover" />
            </motion.figure>

            <div className="card-body">
              <h3 className="card-title">{meal.foodName}</h3>
              <p className="text-sm text-gray-500">👨‍🍳 {meal.chefName} ({meal.chefId})</p>
              <p className="text-sm text-gray-500">📍 {meal.deliveryArea}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span>{meal.rating}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-primary">BDT {meal.price}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDetails(meal._id)} className="btn btn-sm btn-outline">
                  See Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Buttons Below Grid */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span className="btn btn-sm btn-disabled">{currentPage}</span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Meals;