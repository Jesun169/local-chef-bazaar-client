import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const UserProfile = () => {
  const { user } = useAuth();
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [message, setMessage] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  // 🔥 fetch role function
  const fetchLatestRole = async () => {
    if (user?.email) {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-black.vercel.app/users/role/${user.email}?t=${Date.now()}`
        );
        const data = await res.json();
        setCurrentRole(data.role);
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    }
  };

  // 🔥 auto refresh role every 3 sec
  useEffect(() => {
    fetchLatestRole();

    const interval = setInterval(fetchLatestRole, 3000);
    return () => clearInterval(interval);
  }, [user?.email]);

  if (!user) return <div>Loading...</div>;

  const handleRoleRequest = async (type) => {
    setLoadingRequest(true);
    setMessage("");

    const requestBody = {
      _id: user.uid || user._id,
      userName: user.displayName || "N/A",
      userEmail: user.email,
      requestType: type.toLowerCase(), // ✅ FIXED
      requestStatus: "pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(`Request for ${type} sent successfully!`);
      } else {
        setMessage(data.message || "Failed to send request.");
      }
    } catch (err) {
      setMessage("Request already sent.");
    } finally {
      setLoadingRequest(false);
    }
  };

  const displayRole = currentRole || user.role || "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 mt-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.photoURL || "https://i.ibb.co/default-user.png"}
          alt={user.displayName || user.email}
          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
        />

        <div>
          <p className="font-semibold text-lg">
            Name: {user.displayName || "N/A"}
          </p>
          <p className="text-gray-600">Email: {user.email}</p>

          <div className="flex items-center gap-2 mt-1">
            <span>Role:</span>
            <span className="badge badge-primary capitalize px-3 py-2">
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        {displayRole !== "chef" && displayRole !== "admin" && (
          <button
            className="btn btn-primary"
            disabled={loadingRequest}
            onClick={() => handleRoleRequest("chef")}
          >
            {loadingRequest ? "Sending..." : "Apply to be a Chef"}
          </button>
        )}

        {displayRole !== "admin" && (
          <button
            className="btn btn-secondary"
            disabled={loadingRequest}
            onClick={() => handleRoleRequest("admin")}
          >
            {loadingRequest ? "Sending..." : "Apply to be an Admin"}
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile;