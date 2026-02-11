import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import FullPageLoader from "../components/FullPageLoader";

const RoleRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
