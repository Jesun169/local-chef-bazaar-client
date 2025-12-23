import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";

const UserProfile = () => {
  const { user } = useAuth();
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) return <div>Loading...</div>;

  const handleRoleRequest = async (type) => {
    setLoadingRequest(true);
    setMessage("");

    const requestBody = {
      _id: user.uid || user._id,
      userName: user.displayName || "N/A",
      userEmail: user.email,
      requestType: type,
      requestStatus: "pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      setMessage("Request sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send request.");
    }

    setLoadingRequest(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.photoURL || "https://i.ibb.co/default-user.png"}
          alt={user.displayName || user.email}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="font-semibold">Name: {user.displayName || "N/A"}</p>
          <p>Email: {user.email}</p>
          <p className="capitalize">Role: {user.role || "user"}</p>
        </div>
      </div>

 
      <div className="flex flex-col gap-2 mt-4">
        {user.role !== "chef" && user.role !== "admin" && (
          <button
            className="btn btn-primary"
            disabled={loadingRequest}
            onClick={() => handleRoleRequest("chef")}
          >
            {loadingRequest ? "Sending..." : "Be a Chef"}
          </button>
        )}

        {user.role !== "admin" && (
          <button
            className="btn btn-secondary"
            disabled={loadingRequest}
            onClick={() => handleRoleRequest("admin")}
          >
            {loadingRequest ? "Sending..." : "Be an Admin"}
          </button>
        )}
      </div>

      {message && <p className="mt-3 text-green-600">{message}</p>}
    </motion.div>
  );
};

export default UserProfile;
