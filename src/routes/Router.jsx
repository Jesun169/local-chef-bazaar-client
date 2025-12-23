import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";

// Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Meals from "../pages/Meals/Meals";
import MealDetails from "../pages/MealDetails/MealDetails";
import Order from "../pages/Order/Order";

// User
import MyProfile from "../pages/Dashboard/User/MyProfile";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import FavoriteMeals from "../pages/Dashboard/User/FavoriteMeals";
import MyReviews from "../pages/Dashboard/User/MyReviews";

// Chef
import ChefProfile from "../pages/Dashboard/Chef/ChefProfile";
import CreateMeal from "../pages/Dashboard/Chef/CreateMeal";
import MyMeals from "../pages/Dashboard/Chef/MyMeals";
import OrderRequests from "../pages/Dashboard/Chef/OrderRequests";

// Admin
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageRequests from "../pages/Dashboard/Admin/ManageRequests";
import PlatformStats from "../pages/Dashboard/Admin/PlatformStats";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};


const RoleCheck = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "meals", element: <Meals /> },
      { path: "meals/:id", element: <PrivateRoute><MealDetails /></PrivateRoute>  },
      {
        path: "order/:id",
        element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // USER
      { path: "profile", element: <MyProfile /> },
      { path: "order", element: <MyOrders /> },
      { path: "favorites", element: <FavoriteMeals /> },
      { path: "reviews", element: <MyReviews /> },

      // CHEF
      {
        path: "chef/profile",
        element: (
          <RoleCheck role="chef">
            <ChefProfile />
          </RoleCheck>
        ),
      },
      {
        path: "chef/create-meal",
        element: (
          <RoleCheck role="chef">
            <CreateMeal />
          </RoleCheck>
        ),
      },
      {
        path: "chef/my-meals",
        element: (
          <RoleCheck role="chef">
            <MyMeals />
          </RoleCheck>
        ),
      },
      {
        path: "chef/order-requests",
        element: (
          <RoleCheck role="chef">
            <OrderRequests />
          </RoleCheck>
        ),
      },

      // ADMIN
      {
        path: "admin/profile",
        element: (
          <RoleCheck role="admin">
            <AdminProfile />
          </RoleCheck>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleCheck role="admin">
            <ManageUsers />
          </RoleCheck>
        ),
      },
      {
        path: "admin/manage-requests",
        element: (
          <RoleCheck role="admin">
            <ManageRequests />
          </RoleCheck>
        ),
      },
      {
        path: "admin/platform-stats",
        element: (
          <RoleCheck role="admin">
            <PlatformStats />
          </RoleCheck>
        ),
      },
    ],
  },
]);
