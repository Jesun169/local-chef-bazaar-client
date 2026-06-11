import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/users"
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeFraud = async (userId) => {
    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/users/fraud/${userId}`,
        { method: "PATCH" }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        fetchUsers();
      } else {
        Swal.fire("Error", data.message || "Failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* Glass Container */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(59,130,246,0.25)] p-8">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 blur-[120px]" />

          <div className="relative z-10">

            {/* Header */}
            <h2 className="text-4xl font-bold text-white mb-2">
              Manage Users
            </h2>

            <p className="text-slate-300 mb-8">
              Control user roles and safety status.
            </p>

            {loading && (
              <p className="text-cyan-400 mb-4">Loading users...</p>
            )}

            {!loading && users.length === 0 && (
              <p className="text-red-400">No users found.</p>
            )}

            {/* Users Table (Glass Cards instead of table) */}
            <div className="space-y-5">

              {users.map((u) => (
                <motion.div
                  key={u._id}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg"
                >
                  <div className="grid md:grid-cols-4 gap-4 text-slate-200">

                    <div>
                      <p className="text-cyan-300">Name</p>
                      <p>{u.displayName || "N/A"}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Email</p>
                      <p className="break-all">{u.email}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Role</p>
                      <p className="capitalize">{u.role}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Status</p>
                      <p className="capitalize">{u.status || "active"}</p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-4 flex gap-3">

                    {(u.role !== "admin" && u.status !== "fraud") ? (
                      <button
                        onClick={() => handleMakeFraud(u._id)}
                        className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition"
                      >
                        Mark as Fraud
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-gray-500/40 text-white cursor-not-allowed"
                      >
                        Mark as Fraud
                      </button>
                    )}

                  </div>
                </motion.div>
              ))}

            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageUsers;