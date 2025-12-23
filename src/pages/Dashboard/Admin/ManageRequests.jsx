import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://local-chef-bazaar-server-black.vercel.app/requests");
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

      const data = await res.json();

      if (res.ok) {
        toast.success(`Request ${status}`);
        fetchRequests(); // refresh list
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (requests.length === 0) return <p>No pending requests</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Requests</h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-base-100 shadow-lg rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p><strong>Name:</strong> {req.userName}</p>
              <p><strong>Email:</strong> {req.userEmail}</p>
              <p><strong>Type:</strong> {req.requestType}</p>
              <p><strong>Status:</strong> {req.requestStatus}</p>
              <p><strong>Time:</strong> {new Date(req.requestTime).toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() =>
                  handleAction(req._id, "approved", req.requestType, req.userEmail)
                }
              >
                Approve
              </button>

              <button
                className="btn btn-error btn-sm"
                onClick={() =>
                  handleAction(req._id, "rejected", req.requestType, req.userEmail)
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRequests;
