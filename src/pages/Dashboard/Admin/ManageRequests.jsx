import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/requests?t=${Date.now()}`
      );

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status, role, userEmail) => {
    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, role, userEmail }),
        }
      );

      if (res.ok) {
        status === "approved"
          ? toast.success("Request Approved! Role Updated.")
          : toast.error("Request Rejected.");

        fetchRequests();
      }
    } catch (err) {
      toast.error("Network error. Try again.");
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
              Manage Requests
            </h2>

            <p className="text-slate-300 mb-8">
              Approve or reject role upgrade requests.
            </p>

            {loading && (
              <p className="text-cyan-400 mb-4">Loading requests...</p>
            )}

            {!loading && requests.length === 0 && (
              <p className="text-red-400">No requests found.</p>
            )}

            {/* Requests Cards */}
            <div className="space-y-5">

              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg"
                >
                  {/* Info Grid */}
                  <div className="grid md:grid-cols-4 gap-4 text-slate-200">

                    <div>
                      <p className="text-cyan-300">Name</p>
                      <p>{req.userName}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Email</p>
                      <p className="break-all">{req.userEmail}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Type</p>
                      <p className="capitalize">{req.requestType}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300">Status</p>
                      <p className="capitalize">{req.requestStatus}</p>
                    </div>

                    <div className="md:col-span-4">
                      <p className="text-cyan-300">Time</p>
                      <p>{new Date(req.requestTime).toLocaleString()}</p>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "approved",
                          req.requestType,
                          req.userEmail
                        )
                      }
                      disabled={req.requestStatus !== "pending"}
                      className="px-4 py-2 rounded-xl bg-green-500/80 hover:bg-green-500 text-white transition disabled:opacity-40"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "rejected",
                          req.requestType,
                          req.userEmail
                        )
                      }
                      disabled={req.requestStatus !== "pending"}
                      className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition disabled:opacity-40"
                    >
                      Reject
                    </button>

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

export default ManageRequests;