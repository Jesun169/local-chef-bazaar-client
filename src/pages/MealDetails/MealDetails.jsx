import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
    fetch(`http://localhost:5000/meals/${id}`)
      .then(res => res.json())
      .then(data => setMeal(data));
  }, [id]);

  // Fetch reviews for this meal
  const fetchReviews = () => {
    fetch(`http://localhost:5000/reviews?foodId=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Submit a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first!");

    const review = {
      foodId: id,
      reviewerName: user.displayName || "Anonymous",
      reviewerImage: user.photoURL || "https://i.ibb.co/default-user.png",
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (data.insertedId) {
        toast.success("Review submitted successfully!");
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Add meal to favorites
  const handleAddFavorite = async () => {
    if (!user) return toast.error("Please login first!");
    if (!meal) return;

    const favorite = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
    };

    try {
      const res = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorite),
      });
      const data = await res.json();
      if (data.insertedId) {
        toast.success("Added to favorites!");
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to add to favorites");
    }
  };

  if (!meal) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      <Toaster />

      {/* Meal Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 shadow-lg rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold mb-4">{meal.foodName}</h1>
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />
        <p>👨‍🍳 {meal.chefName}</p>
        <p>📍 {meal.deliveryArea}</p>
        <p>💰 BDT {meal.price}</p>
        <p>⭐ {meal.rating}</p>
        <button
          className="btn btn-primary mt-4 mr-4"
          onClick={handleAddFavorite}
        >
          Add to Favorites
        </button>
      </motion.div>

      {/* Review Form */}
      {user && (
        <form
          onSubmit={handleReviewSubmit}
          className="space-y-3 mt-4 bg-base-100 p-6 rounded-xl shadow"
        >
          <h3 className="font-semibold text-lg">Give Review</h3>
          <div className="flex items-center gap-2">
            <label>Rating:</label>
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
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="textarea textarea-bordered w-full"
            placeholder="Write your review..."
            required
          />
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6 mt-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((rev) => (
          <motion.div
            key={rev._id}
            className="bg-base-200 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={rev.reviewerImage}
                alt={rev.reviewerName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{rev.reviewerName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(rev.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-1 mb-1">
              {[...Array(rev.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            <p>{rev.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MealDetails;
