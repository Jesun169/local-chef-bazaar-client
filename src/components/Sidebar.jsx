import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { IoArrowBackCircle } from "react-icons/io5";

const Sidebar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <aside className="w-64 bg-black shadow-md p-6 flex flex-col space-y-4 text-white">
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-black shadow-md p-6 flex flex-col space-y-4 text-white">
      <Link
        to="/"
        className="flex items-center gap-2 mb-4 text-white hover:text-yellow-300"
      >
        <IoArrowBackCircle size={24} />
        Back to Home
      </Link>

      <h2 className="text-xl font-bold mb-4">Dashboard</h2>


      {user?.role === "user" && (
        <>
          <Link to="/dashboard/profile" className="hover:text-yellow-300">
            My Profile
          </Link>
          <Link to="/dashboard/order" className="hover:text-yellow-300">
            My Orders
          </Link>
          <Link to="/dashboard/favorites" className="hover:text-yellow-300">
            Favorite Meals
          </Link>
          <Link to="/dashboard/reviews" className="hover:text-yellow-300">
            My Reviews
          </Link>
        </>
      )}


      {user?.role === "chef" && (
        <>
          <Link to="/dashboard/profile" className="hover:text-yellow-300">
            My Profile
          </Link>
          <Link to="/dashboard/chef/create-meal" className="hover:text-yellow-300">
            Create Meal
          </Link>
          <Link to="/dashboard/chef/my-meals" className="hover:text-yellow-300">
            My Meals
          </Link>
          <Link to="/dashboard/chef/order-requests" className="hover:text-yellow-300">
            Order Requests
          </Link>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <Link to="/dashboard/profile" className="hover:text-yellow-300">
            My Profile
          </Link>
          <Link to="/dashboard/admin/manage-users" className="hover:text-yellow-300">
            Manage Users
          </Link>
          <Link to="/dashboard/admin/manage-requests" className="hover:text-yellow-300">
            Manage Requests
          </Link>
          <Link to="/dashboard/admin/platform-stats" className="hover:text-yellow-300">
            Platform Stats
          </Link>
        </>
      )}

      {!user && <p>Please login to see dashboard links.</p>}
    </aside>
  );
};

export default Sidebar;
