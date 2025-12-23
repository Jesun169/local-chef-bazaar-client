import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const sendRequest = async (role) => {
    const payload = {
      userName: user.displayName || "N/A",
      userEmail: user.email,
      requestType: role,
      requestStatus: "pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${role.toUpperCase()} request sent successfully`);
      } else {
        toast.error(data.message || "Request already pending");
      }
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  const role = user.role || "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center gap-4">
        <img
          src={user.photoURL || "https://i.ibb.co/default-user.png"}
          alt="user"
          className="w-20 h-20 rounded-full"
        />

        <div>
          <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="capitalize"><strong>Role:</strong> {role}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {role === "user" && (
          <>
            <button
              onClick={() => sendRequest("chef")}
              className="btn btn-primary"
            >
              Be a Chef
            </button>

            <button
              onClick={() => sendRequest("admin")}
              className="btn btn-secondary"
            >
              Be an Admin
            </button>
          </>
        )}

        {role === "chef" && (
          <button
            onClick={() => sendRequest("admin")}
            className="btn btn-secondary"
          >
            Be an Admin
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MyProfile;
