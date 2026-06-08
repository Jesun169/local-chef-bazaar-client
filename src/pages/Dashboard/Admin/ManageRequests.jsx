import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/requests?t=${Date.now()}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status, role, userEmail) => {
    try {
      const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, role, userEmail }),
      });

      if (res.ok) {
        status === "approved" 
          ? toast.success("Request Approved! Role Updated.") 
          : toast.error("Request Rejected.");
        fetchRequests(); // Refresh data
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Requests</h2>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="table w-full bg-base-100">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userName}</td>
                <td>{req.userEmail}</td>
                <td className="capitalize font-semibold">{req.requestType}</td>
                <td>
                  <span className={`badge ${req.requestStatus === 'pending' ? 'badge-warning' : req.requestStatus === 'approved' ? 'badge-success' : 'badge-error'}`}>
                    {req.requestStatus}
                  </span>
                </td>
                <td>{new Date(req.requestTime).toLocaleString()}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleAction(req._id, "approved", req.requestType, req.userEmail)}
                    disabled={req.requestStatus !== "pending"}
                    className="btn btn-sm btn-success text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "rejected", req.requestType, req.userEmail)}
                    disabled={req.requestStatus !== "pending"}
                    className="btn btn-sm btn-error text-white"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;