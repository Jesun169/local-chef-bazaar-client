import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaStar, FaUtensils, FaTruck, FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/meals?limit=6")
      .then(res => res.json())
      .then(data => setMeals(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/reviews")
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-24">

      {/* Hero Banner */}
      <section className="bg-base-200 py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Fresh Homemade Meals <br />
              <span className="text-primary">From Local Chefs</span>
            </h1>
            <p className="mt-5 text-gray-600">
              Discover delicious, hygienic and affordable meals cooked with love
              by trusted local chefs near you.
            </p>
            <Link to='/meals'>
              <button className="btn btn-primary mt-6">
                Explore Meals
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="h-[320px] md:h-[400px]"
            >
              <SwiperSlide>
                <img src="/src/assets/banner-1.png" className="h-full w-full object-cover" alt="Food 1"/>
              </SwiperSlide>
              <SwiperSlide>
                <img src="/src/assets/banner-2.jpg" className="h-full w-full object-cover" alt="Food 2"/>
              </SwiperSlide>
              <SwiperSlide>
                <img src="/src/assets/banner-3.jpg" className="h-full w-full object-cover" alt="Food 3"/>
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* Daily Meals */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          🍽 Today’s Special Meals
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {meals.map(meal => (
            <motion.div
              key={meal._id}
              className="card bg-base-100 shadow-md"
              whileHover={{ scale: 1.03 }}
            >
              <figure>
                <img src={meal.image} alt={meal.name} className="h-48 w-full object-cover" />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{meal.foodName}</h3>
                <p className="text-sm text-gray-500">{meal.chefName}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-primary">BDT{meal.price}</span>
                  <Link to={`/meals/${meal._id}`}>
                    <button className="btn btn-sm btn-outline">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      {/* Customer Reviews */}
<section className="bg-base-200 py-20">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      💬 What Our Customers Say
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {reviews
        .slice(-3)
        .reverse()
        .map((review) => (
          <motion.div
            key={review._id}
            className="bg-base-100 p-6 rounded-xl shadow"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">“{review.comment}”</p>
            <h4 className="font-semibold text-yellow-300">{review.name}</h4>
          </motion.div>
        ))}
    </div>
  </div>
</section>


      {/* Why Choose Local Chef Bazaar */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          🌟 Why Choose Local Chef Bazaar
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaUtensils className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Home Cooked</h4>
            <p className="text-sm text-gray-500">
              Hygienic meals cooked by verified local chefs.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaTruck className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Fast Delivery</h4>
            <p className="text-sm text-gray-500">
              Hot meals delivered right to your doorstep.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow bg-base-100">
            <FaHeart className="text-4xl text-primary mx-auto mb-4" />
            <h4 className="font-semibold">Loved by Customers</h4>
            <p className="text-sm text-gray-500">
              Thousands of happy food lovers across the city.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
