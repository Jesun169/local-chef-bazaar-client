import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  // Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-black.vercel.app/meals/${id}`
        );
        const data = await res.json();
        setMeal(data);
      } catch (err) {
        console.error("Failed to fetch meal:", err);
      }
    };
    fetchMeal();
  }, [id]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/reviews?mealId=${id}`
      );
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.error("Please login first!");

    const review = {
      mealId: id,
      userEmail: user.email,
      username: user.displayName || user.email.split("@")[0], // always fallback to email name
      reviewerName: user.displayName || user.email.split("@")[0],
      reviewerImage:
        user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png",
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Review submitted!");
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Failed to submit review");
    }
  };

  // Add favorite
  const handleAddFavorite = async () => {
    if (!user) return toast.error("Login first!");

    if (!meal) return toast.error("Meal not loaded yet!");

    const favorite = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
    };

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/favorites",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(favorite),
        }
      );
      const data = await res.json();
      if (res.ok) toast.success("Added to favorites!");
      else toast.error(data.message || "Failed to add favorite");
    } catch (err) {
      console.error("Add favorite error:", err);
      toast.error("Error adding favorite");
    }
  };

  if (!meal) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  const averageRating =
    meal.rating ||
    (reviews.length
      ? (
          reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : "No rating");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      <Toaster />

      {/* Meal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 shadow-lg rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold">{meal.foodName}</h1>
        <img
          src={meal.foodImage}
          className="w-full h-64 object-cover my-4 rounded-lg"
        />

        <p>👨‍🍳 {meal.chefName}</p>
        <p>📍 {meal.deliveryArea}</p>
        <p>💰 BDT {meal.price}</p>
        <p>⭐ {averageRating}</p>

        <div className="flex gap-4 mt-6">
          <Link to={`/order/${meal._id}`}>
            <button className="btn btn-success">Order Now</button>
          </Link>

          <button onClick={handleAddFavorite} className="btn btn-primary">
            Add to Favorites
          </button>
        </div>
      </motion.div>

      {/* Review Form */}
      {user && (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-base-100 p-6 rounded-xl shadow space-y-3"
        >
          <h3 className="text-lg font-semibold">Give Review</h3>

          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({
                ...newReview,
                rating: parseInt(e.target.value),
              })
            }
            className="select select-bordered w-24"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="textarea textarea-bordered w-full"
            placeholder="Write review..."
            required
          />

          <button className="btn btn-primary">Submit</button>
        </form>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((rev) => (
          <div key={rev._id} className="bg-base-200 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={rev.reviewerImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-10 h-10 rounded-full"
                alt={rev.username || "Anonymous"}
              />
              <div>
                <p className="font-semibold">
                  {rev.username || rev.reviewerName || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex">
              {[...Array(Number(rev.rating))].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>

            <p>{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealDetails;