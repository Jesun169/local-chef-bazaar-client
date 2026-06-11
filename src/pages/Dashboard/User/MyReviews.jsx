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

  useEffect(() => {
    if (!user?.email) return;

    fetch(
      `https://local-chef-bazaar-server-black.vercel.app/reviews?userEmail=${user.email}`
    )
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => toast.error("Failed to fetch reviews"));
  }, [user?.email]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/reviews/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  const handleUpdate = async () => {
    if (!updatedComment || !updatedRating)
      return toast.error("All fields required");

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/reviews/${editingReview._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: updatedComment,
            rating: Number(updatedRating),
          }),
        }
      );

      if (!res.ok) throw new Error();

      setReviews((prev) =>
        prev.map((r) =>
          r._id === editingReview._id
            ? { ...r, comment: updatedComment, rating: Number(updatedRating) }
            : r
        )
      );

      toast.success("Review updated");
      setEditingReview(null);
    } catch {
      toast.error("Update failed");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-white">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <div className="max-w-6xl mx-auto">

        {/* MAIN GLASS CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* HEADER */}
            <h2 className="text-4xl font-bold text-white mb-2">
              My Reviews
            </h2>

            <p className="text-slate-300 mb-8">
              Manage your feedback and ratings
            </p>

            {/* EMPTY */}
            {reviews.length === 0 ? (
              <p className="text-slate-300 text-center py-10">
                No reviews yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">

                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5"
                  >
                    {/* glow */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 blur-[80px]" />

                    <div className="relative z-10 text-white space-y-2">

                      <h3 className="text-xl font-bold">
                        {review.mealName || "Unknown Meal"}
                      </h3>

                      <p className="text-slate-300">
                        Rating:{" "}
                        <span className="text-yellow-400 font-semibold">
                          {review.rating}
                        </span>
                      </p>

                      <p className="text-slate-300">
                        {review.comment}
                      </p>

                      <p className="text-xs text-slate-400">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString()
                          : "Unknown"}
                      </p>

                      {/* BUTTONS */}
                      <div className="flex gap-3 pt-2">

                        <button
                          onClick={() => handleDelete(review._id)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => handleEdit(review)}
                          className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition"
                        >
                          Edit
                        </button>

                      </div>
                    </div>
                  </motion.div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[90%] max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 text-white"
          >

            <h3 className="text-2xl font-bold mb-4">Update Review</h3>

            <input
              type="number"
              min="1"
              max="5"
              value={updatedRating}
              onChange={(e) => setUpdatedRating(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-white/10 border border-white/20 text-white"
              placeholder="Rating"
            />

            <textarea
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-white/10 border border-white/20 text-white"
              placeholder="Comment"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded bg-white/10 border border-white/20"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                Save
              </button>

            </div>

          </motion.div>

        </div>
      )}
    </motion.div>
  );
};

export default MyReviews;