import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch("https://local-chef-bazaar-server-black.vercel.app/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
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
        Swal.fire("Error", data.message || "Failed to mark as fraud", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-blue-500 font-bold mb-4">Manage Users</h2>

      {users.length === 0 ? (
        <p className="text-black">No users found.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="p-2 border text-black">Name</th>
              <th className="p-2 border text-black">Email</th>
              <th className="p-2 border text-black">Role</th>
              <th className="p-2 border text-black">Status</th>
              <th className="p-2 border text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-center text-black">
                <td className="p-2 border text-black">{u.displayName || "N/A"}</td>
                <td className="p-2 border text-black">{u.email}</td>
                <td className="p-2 border text-black">{u.role}</td>
                <td className="p-2 border text-black">{u.status}</td>
                <td className="p-2 border text-black">
                  {(u.role !== "admin" && u.status !== "fraud") && (
                    <button
                      onClick={() => handleMakeFraud(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Make Fraud
                    </button>
                  )}
                  {(u.status === "fraud" || u.role === "admin") && (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                    >
                      Make Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
