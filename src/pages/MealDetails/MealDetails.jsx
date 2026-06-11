import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedMeals, setRelatedMeals] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    "https://local-chef-bazaar-server-black.vercel.app";

  /* ================= FETCH MEAL ================= */
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(`${BASE_URL}/meals/${id}`);
        const data = await res.json();
        setMeal(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}/reviews?mealId=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [id]);

  /* ================= RELATED MEALS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}/meals`)
      .then(res => res.json())
      .then(data => {
        const related = data
          .filter(item => item._id !== id)
          .slice(0, 4);
        setRelatedMeals(related);
      });
  }, [id]);

  /* ================= SUBMIT REVIEW ================= */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.error("Please login first!");

    const review = {
      mealId: id,
      userEmail: user.email,
      username: user.displayName || user.email.split("@")[0],
      reviewerName: user.displayName || user.email.split("@")[0],
      reviewerImage:
        user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png",
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        toast.success("Review submitted!");
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  /* ================= FAVORITE ================= */
  const handleAddFavorite = async () => {
    if (!user) return toast.error("Login first!");

    const favorite = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
    };

    try {
      const res = await fetch(`${BASE_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorite),
      });

      if (res.ok) toast.success("Added to favorites!");
    } catch (err) {
      toast.error("Error adding favorite");
    }
  };

  if (loading || !meal) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((a, b) => a + Number(b.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "No rating";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      <Toaster />

      {/* ================= IMAGE GALLERY ================= */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        loop
        className="rounded-xl overflow-hidden"
      >
        {[meal.foodImage, meal.foodImage, meal.foodImage].map(
          (img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                className="w-full h-[420px] object-cover"
              />
            </SwiperSlide>
          )
        )}
      </Swiper>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-base-100 p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">{meal.foodName}</h1>

        <p className="text-base-content/80 mt-2">
          👨‍🍳 {meal.chefName} | 📍 {meal.deliveryArea}
        </p>

        <p className="mt-2 font-bold text-primary">
          💰 BDT {meal.price}
        </p>

        <p className="mt-1">⭐ {averageRating}</p>

        <div className="flex gap-3 mt-5">
          <Link to={`/order/${meal._id}`}>
            <button className="btn btn-success">Order Now</button>
          </Link>

          <button
            onClick={handleAddFavorite}
            className="btn btn-primary"
          >
            Favorite
          </button>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Description / Overview
        </h2>
        <p className="text-base-content/80">
          {meal.description ||
            `${meal.foodName} is freshly prepared by ${meal.chefName}. 
            Made with high quality ingredients and delivered fresh to your location.`}
        </p>
      </div>

      {/* ================= KEY SPECS ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Key Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-base-200 rounded-lg">
            Chef: {meal.chefName}
          </div>
          <div className="p-4 bg-base-200 rounded-lg">
            Location: {meal.deliveryArea}
          </div>
          <div className="p-4 bg-base-200 rounded-lg">
            Price: BDT {meal.price}
          </div>
          <div className="p-4 bg-base-200 rounded-lg">
            Rating: {averageRating}
          </div>
        </div>
      </div>

      {/* ================= REVIEW FORM ================= */}
      {user && (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-base-100 p-6 rounded-xl shadow space-y-3"
        >
          <h2 className="font-bold text-lg">Write Review</h2>

          <select
            className="select select-bordered w-24"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({
                ...newReview,
                rating: Number(e.target.value),
              })
            }
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({
                ...newReview,
                comment: e.target.value,
              })
            }
          />

          <button className="btn btn-primary">
            Submit
          </button>
        </form>
      )}

      {/* ================= REVIEWS ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Reviews
        </h2>

        {reviews.map((rev) => (
          <div
            key={rev._id}
            className="bg-base-200 p-4 rounded-lg mb-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  rev.reviewerImage ||
                  "https://i.ibb.co/4pDNDk1/avatar.png"
                }
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="font-semibold">
                  {rev.username}
                </p>

                <p className="text-xs text-base-content/80">
                  {rev.createdAt
                    ? new Date(
                        rev.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex mt-2">
              {[...Array(Number(rev.rating || 0))].map(
                (_, i) => (
                  <FaStar
                    key={i}
                    className="text-yellow-400"
                  />
                )
              )}
            </div>

            <p className="mt-2">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* ================= RELATED ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Related Meals
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {relatedMeals.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100 shadow"
            >
              <img
                src={item.foodImage}
                className="h-32 w-full object-cover"
              />

              <div className="p-3">
                <h3 className="font-semibold">
                  {item.foodName}
                </h3>

                <p className="text-primary font-bold">
                  BDT {item.price}
                </p>

                <Link
                  to={`/meals/${item._id}`}
                  className="btn btn-sm btn-outline mt-2"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealDetails;