import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedRating, setUpdatedRating] = useState("");

  // Fetch reviews
  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://local-chef-bazaar-server-black.vercel.app/reviews?userEmail=${user.email}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => toast.error("Failed to fetch reviews"));
  }, [user?.email]);

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReviews(reviews.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  // Open update modal
  const handleEdit = (review) => {
    setEditingReview(review);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  // Submit updated review
  const handleUpdate = async () => {
    if (!updatedComment || !updatedRating) return toast.error("All fields are required");
    try {
      const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/reviews/${editingReview._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: updatedComment, rating: updatedRating }),
      });
      if (!res.ok) throw new Error();

      setReviews(
        reviews.map((r) =>
          r._id === editingReview._id ? { ...r, comment: updatedComment, rating: updatedRating } : r
        )
      );
      toast.success("Review updated successfully");
      setEditingReview(null);
    } catch {
      toast.error("Failed to update review");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      <h2 className="text-2xl text-blue-500 font-bold mb-4">My Reviews</h2>
      {reviews.length === 0 && <p className="text-black">No reviews yet.</p>}

      {reviews.map((review) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 shadow-lg rounded-xl p-4"
        >
          <p className="font-semibold">Meal: {review.mealName}</p>
          <p>Rating: {review.rating}</p>
          <p>Comment: {review.comment}</p>
          <p>Date: {review.date ? new Date(review.date).toLocaleString() : "Unknown"}</p>

          <div className="mt-2 flex gap-2">
            <button className="btn btn-sm btn-error" onClick={() => handleDelete(review._id)}>Delete</button>
            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(review)}>Update</button>
          </div>
        </motion.div>
      ))}

      {/* Update Modal */}
      {editingReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Update Review</h3>
            <label className="block mb-2">
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={updatedRating}
                onChange={(e) => setUpdatedRating(e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </label>
            <label className="block mb-4">
              Comment:
              <textarea
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
                className="textarea textarea-bordered w-full mt-1"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => setEditingReview(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
