import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaCamera,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user, updateUserProfile, resetPassword } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const role = user?.role || "user";

  // Update Profile
  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(name, photo);

      toast.success("Profile updated successfully 🎉");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  // Password Reset
  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);

      toast.success("Password reset email sent 📧");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email");
    }
  };

  // Request Role
  const sendRequest = async (requestRole) => {
    const payload = {
      userName: user.displayName,
      userEmail: user.email,
      requestType: requestRole,
      requestStatus: "pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `${requestRole.toUpperCase()} request sent successfully`
        );
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(59,130,246,0.25)]">

          {/* Glow Effects */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

          {/* Cover */}
          <div className="h-64 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content */}
          <div className="relative px-8 pb-10">

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">

              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                className="relative"
              >
                <img
                  src={
                    photo ||
                    user.photoURL ||
                    "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-[0_0_40px_rgba(59,130,246,0.7)]"
                />

                <div className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
                  <FaCamera className="text-white" />
                </div>
              </motion.div>

              <div className="text-center md:text-left">
                <h2 className="text-4xl font-bold text-white">
                  {user.displayName || "User"}
                </h2>

                <p className="text-slate-300 mt-2">
                  {user.email}
                </p>

                <span className="inline-block mt-3 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold capitalize shadow-lg">
                  {role}
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">

              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaUser />
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaCamera />
                  Profile Image URL
                </label>

                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="Paste image URL"
                  className="input w-full bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaEnvelope />
                  Email
                </label>

                <input
                  readOnly
                  value={user.email}
                  className="input w-full bg-white/5 border border-white/20 text-slate-400"
                />
              </div>

              <div>
                <label className="text-slate-300 flex items-center gap-2 mb-2">
                  <FaUserShield />
                  Role
                </label>

                <input
                  readOnly
                  value={role}
                  className="input w-full bg-white/5 border border-white/20 text-slate-400 capitalize"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleUpdateProfile}
                className="btn border-0 text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600"
              >
                Update Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePasswordReset}
                className="btn bg-white/10 border border-white/20 text-white"
              >
                <FaLock />
                Reset Password
              </motion.button>
            </div>

            {/* Upgrade Account */}
            <div className="mt-10">

              <h3 className="text-2xl font-semibold text-white mb-5">
                Upgrade Account
              </h3>

              <div className="flex flex-wrap gap-4">

                {role === "user" && (
                  <>
                    <button
                      onClick={() => sendRequest("chef")}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg"
                    >
                      Request Chef Access
                    </button>

                    <button
                      onClick={() => sendRequest("admin")}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg"
                    >
                      Request Admin Access
                    </button>
                  </>
                )}

                {role === "chef" && (
                  <button
                    onClick={() => sendRequest("admin")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg"
                  >
                    Request Admin Access
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;