import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ITEMS_PER_PAGE = 12;

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch("https://local-chef-bazaar-server-black.vercel.app/meals")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 Debounce Search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDetails = (id) => {
    if (user) navigate(`/meals/${id}`);
    else navigate("/login");
  };

  // 🔥 FILTER + SEARCH + SORT
  const processedMeals = useMemo(() => {
    let data = [...meals];

    // SEARCH
    if (debouncedSearch) {
      data = data.filter(
        (meal) =>
          meal.foodName?.toLowerCase().includes(debouncedSearch) ||
          meal.deliveryArea?.toLowerCase().includes(debouncedSearch) ||
          meal.chefName?.toLowerCase().includes(debouncedSearch)
      );
    }

    // SORT
    const price = (a, b) => Number(a.price) - Number(b.price);
    const rating = (a, b) => Number(b.rating || 0) - Number(a.rating || 0);

    switch (sortOrder) {
      case "priceAsc":
        data.sort(price);
        break;
      case "priceDesc":
        data.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        data.sort(rating);
        break;
      case "newest":
        data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    return data;
  }, [meals, debouncedSearch, sortOrder]);

  // PAGINATION
  const totalPages = Math.ceil(processedMeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMeals = processedMeals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* TITLE */}
      <h2 className="text-4xl font-bold text-center mb-8">
        🍽 Daily Meals
      </h2>

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 w-full md:w-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 shadow-lg">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search meals, chef, location..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* SORT */}
        <select
          className="select 
          select-bordered text-base-content/80"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Default</option>
          <option value="priceAsc">Price Low → High</option>
          <option value="priceDesc">Price High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-white/10 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMeals.map((meal) => (
              <motion.div
                key={meal._id}
                whileHover={{ scale: 1.03, y: -6 }}
                className="
                  rounded-2xl overflow-hidden
                  bg-white/10 backdrop-blur-xl
                  border border-white/20
                  shadow-xl
                  transition-all
                "
              >
                {/* IMAGE */}
                <img
                  src={meal.foodImage}
                  className="h-48 w-full object-cover"
                  alt={meal.foodName}
                />

                {/* CONTENT */}
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg line-clamp-1">
                    {meal.foodName}
                  </h3>

                  <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                    {meal.description}
                  </p>

                  <div className="mt-3 text-sm space-y-1">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt /> {meal.deliveryArea}
                    </p>

                    <p className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {meal.createdAt
                        ? new Date(meal.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>

                    <p className="flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      {Number(meal.rating || 0).toFixed(1)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold">
                      ৳ {meal.price}
                    </span>

                    <button
                      onClick={() => handleDetails(meal._id)}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EMPTY */}
          {currentMeals.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              No meals found
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 mt-10">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            <span className="btn btn-sm btn-disabled">
              {currentPage} / {totalPages}
            </span>

            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Meals;