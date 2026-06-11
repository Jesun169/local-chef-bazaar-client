import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "https://local-chef-bazaar-server-black.vercel.app";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ADD CATEGORY */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name required");

    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        toast.success("Category added");
        setName("");
        fetchCategories();
      }
    } catch {
      toast.error("Failed to add category");
    }
  };

  /* DELETE CATEGORY */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Deleted successfully");
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <Toaster />

      <h1 className="text-2xl font-bold mb-6">📂 Manage Categories</h1>

      {/* ADD CATEGORY */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="New category name"
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {/* LOADING */}
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-4 rounded-xl bg-base-200 flex justify-between items-center"
            >
              <span>{cat.name}</span>

              <button
                onClick={() => handleDelete(cat._id)}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;