import { useEffect, useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://local-chef-bazaar-server-black.vercel.app/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-blue-500 font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? <p>No users found.</p> :
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u._id} className="p-4 bg-white shadow rounded">
              <p className="text-black">Name: {u.displayName || "N/A"}</p>
              <p className="text-black">Email: {u.email}</p>
              <p className="text-black">Role: {u.role}</p>
              <p className="text-black">Status: {u.status}</p>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default ManageUsers;
