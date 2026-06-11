import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

import {
  FaStar,
  FaUtensils,
  FaTruck,
  FaHeart,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://local-chef-bazaar-server-black.vercel.app";

  /* ================= MEALS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}/meals`)
      .then(res => res.json())
      .then(data => setMeals(data.slice(0, 6)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= REVIEWS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  /* ================= STATS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
        <section className="min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="max-w-7xl glass mx-auto px-4 grid md:grid-cols-2 items-center gap-10 w-full">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Fresh Homemade Meals <br />
              <span className="text-primary">From Local Chefs</span>
            </h1>

            <p className="mt-5 text-base-content/110 max-w-md">
              Discover hygienic, affordable, and freshly cooked meals from trusted local chefs near you.
            </p>

            <div className="flex gap-3 mt-6">
              <Link to="/meals" className="btn btn-primary">
                Explore Meals
              </Link>

              <Link to="/explore" className="btn btn-outline">
                Learn More
              </Link>
            </div>

            <div className="mt-6 flex gap-6 text-sm text-base-content/110">
              <p>🔥 100+ Meals</p>
              <p>👨‍🍳 50+ Chefs</p>
              <p>⭐ 4.8 Rating</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              loop
              className="h-[320px] md:h-[420px]"
            >
              <SwiperSlide>
                <img src="/assets/banner-1.png" className="h-full w-full object-cover" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/assets/banner-2.jpg" className="h-full w-full object-cover" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/assets/banner-3.jpg" className="h-full w-full object-cover" />
              </SwiperSlide>
            </Swiper>
          </motion.div>

        </div>
      </section>

      {/* ================= DAILY MEALS ================= */}
<section className="max-w-7xl mx-auto px-4">
  <h2 className="text-3xl font-bold text-center mb-12">
    🍽 Today’s Special Meals
  </h2>

  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-base-100 rounded-2xl shadow animate-pulse overflow-hidden"
        >
          <div className="h-48 bg-gray-300"></div>

          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-300 rounded"></div>

            <div className="h-4 bg-gray-300 rounded w-3/4"></div>

            <div className="h-4 bg-gray-300 rounded"></div>

            <div className="h-4 bg-gray-300 rounded w-1/2"></div>

            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  ) : meals.length === 0 ? (
    <p className="text-center text-base-content/80">
      No meals available
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {meals.map((meal) => (
  <motion.div
    key={meal._id}
    whileHover={{ scale: 1.03, y: -6 }}
    className="
      rounded-2xl overflow-hidden
      bg-base-100
      border border-base-300
      shadow-xl
      transition-all
      flex flex-col h-full
    "
  >
    {/* IMAGE */}
    <img
      src={meal.foodImage}
      alt={meal.foodName || meal.mealName}
      className="h-52 w-full object-cover"
    />

    {/* CONTENT */}
    <div className="p-4 flex flex-col flex-grow">

      <h3 className="font-bold text-lg text-base-content line-clamp-1">
        {meal.foodName || meal.mealName}
      </h3>

      <p className="text-sm text-base-content/70 mt-2 line-clamp-2">
        {meal.description ||
          "Fresh homemade meal prepared by local chefs."}
      </p>

      <div className="mt-4 space-y-2 text-sm text-base-content/80">

        <p className="flex items-center gap-2">
          <FaMapMarkerAlt />
          {meal.location || meal.deliveryArea || "Dhaka"}
        </p>

        <p className="flex items-center gap-2">
          <FaCalendarAlt />
          {meal.createdAt
            ? new Date(meal.createdAt).toLocaleDateString()
            : "Recently Added"}
        </p>

        <p className="flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          {Number(meal.rating || 0).toFixed(1)}
        </p>

      </div>

      <div className="flex justify-between items-center mt-5">

        <span className="text-primary font-bold text-lg">
          ৳{meal.price}
        </span>

        <Link to={`/meals/${meal._id}`}>
          <button className="btn btn-primary btn-sm">
            View Details
          </button>
        </Link>

      </div>
    </div>
  </motion.div>
))}
    </div>
  )}
</section>

      {/* ================= BLOG PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          📰 Latest Blogs
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "How Local Chefs Prepare Fresh Meals",
              desc: "Discover the secret behind homemade food quality..."
            },
            {
              id: 2,
              title: "Why Home Food is Healthier",
              desc: "Learn why home-cooked meals are better than fast food..."
            },
            {
              id: 3,
              title: "Top 5 Meals You Must Try",
              desc: "Our chef recommendations for this month..."
            }
          ].map(blog => (
            <motion.div
              key={blog.id}
              whileHover={{ y: -5 }}
              className="bg-base-100 p-6 rounded-xl shadow"
            >
              <h3 className="font-bold text-lg text-base-content/80">{blog.title}</h3>
              <p className="text-sm text-base-content/80 mt-2">
                {blog.desc}
              </p>

              <button className="btn btn-sm btn-primary mt-4">
                Read More
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          ❓ Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-base-content/80">

          <div className="collapse collapse-plus bg-base-100 shadow">
            <input type="radio" name="faq" defaultChecked />
            <div className="collapse-title font-medium">
              Are the meals fresh?
            </div>
            <div className="collapse-content">
              <p>Yes, all meals are cooked fresh daily by verified local chefs.</p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 shadow">
            <input type="radio" name="faq" />
            <div className="collapse-title font-medium">
              How long does delivery take?
            </div>
            <div className="collapse-content">
              <p>Usually 30–45 minutes depending on your location.</p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 shadow">
            <input type="radio" name="faq" />
            <div className="collapse-title font-medium">
              Can I trust local chefs?
            </div>
            <div className="collapse-content">
              <p>Yes, all chefs are verified and rated by customers.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          🌟 Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center text-base-content/80">
          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaUtensils className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Home Cooked</h4>
            <p className="text-sm text-base-content/80">Verified chefs only</p>
          </div>

          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaTruck className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Fast Delivery</h4>
            <p className="text-sm text-base-content/80">Hot & fresh delivery</p>
          </div>

          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaHeart className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Loved by Users</h4>
            <p className="text-sm text-base-content/80">Trusted platform</p>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="bg-base-200 py-20">
        <div className="max-w-7xl mx-auto px-4 text-base-content/80">
          <h2 className="text-3xl font-bold text-center mb-12">
            💬 Customer Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map(review => (
              <motion.div
                key={review._id}
                className="bg-base-100 p-6 rounded-xl shadow"
              >
                <div className="flex gap-1 mb-2">
                  {[...Array(Number(review.rating || 0))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm">“{review.comment}”</p>

                <h4 className="font-semibold mt-3">
                  {review.reviewerName}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DASHBOARD ANALYTICS ================= */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          📊 Platform Analytics Dashboard
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-base-content/80">

          <div className="bg-base-100 p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4">Meals Growth</h3>
            <p className="text-sm text-base-content/80">
              Live data coming soon
            </p>
          </div>

          <div className="bg-base-100 p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4">Orders Overview</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Orders</span>
                <span className="font-bold text-primary">
                  {stats?.totalOrders || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Pending</span>
                <span>{stats?.pendingOrders || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivered</span>
                <span>{stats?.deliveredOrders || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-6 rounded-xl shadow">
            <h3 className="font-bold mb-4">Ratings</h3>

            <p className="text-sm">
              ⭐ Average Rating: {stats?.avgRating || 0}
            </p>

            <p className="text-sm mt-2">
              💰 Revenue: {stats?.totalRevenue || 0}
            </p>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">⚙ How It Works</h2>
        <p className="text-base-content/110">
          Choose food → Order → Get delivered from local chefs
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">✨ Features</h2>
        <p className="py-10 text-base-content/110">
          Secure payments, verified chefs, real-time updates
        </p>
      </section>

    </div>
  );
};

export default Home;