import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Meals from "../pages/Meals/Meals";
import MealDetails from "../pages/MealDetails/MealDetails";
import Order from "../pages/Order/Order";

import MyProfile from "../pages/Dashboard/User/MyProfile";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import FavoriteMeals from "../pages/Dashboard/User/FavoriteMeals";
import MyReviews from "../pages/Dashboard/User/MyReviews";

import ChefProfile from "../pages/Dashboard/Chef/ChefProfile";
import CreateMeal from "../pages/Dashboard/Chef/CreateMeal";
import MyMeals from "../pages/Dashboard/Chef/MyMeals";
import OrderRequests from "../pages/Dashboard/Chef/OrderRequests";

import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageRequests from "../pages/Dashboard/Admin/ManageRequests";
import PlatformStats from "../pages/Dashboard/Admin/PlatformStats";


import PrivateRoute from "../components/PrivateRoute";

import RoleRoute from "./RoleRoute";
import ErrorPage from "../components/ErrorPage";
import Categories from "../pages/Dashboard/Admin/Categories";
import Settings from "../pages/Dashboard/Admin/Settings";
import About from "../pages/About/About";
import Blog from "../pages/Blog/Blog";
import BlogDetails from "../pages/Blog/BlogDetails";
import Contact from "../pages/Contact/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "meals", element: <Meals /> }, 
      { path: "about", element: <About/> }, 
      { path: "blog", element: <Blog/>},
      { path: "blog/:id", element: <BlogDetails/> },
      { path: "contact", element: <Contact/> },
      {
        path: "meals/:id",
        element: (
          <PrivateRoute>
            <MealDetails />
          </PrivateRoute>
        ),
      },
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
    errorElement: <ErrorPage />,
    children: [
      // User
      { path: "profile", element: <MyProfile /> },
      { path: "order", element: <MyOrders /> },
      { path: "favorites", element: <FavoriteMeals /> },
      { path: "reviews", element: <MyReviews /> },

      // Chef
      {
        path: "chef/profile",
        element: (
          <RoleRoute role="chef">
            <ChefProfile />
          </RoleRoute>
        ),
      },
      {
        path: "chef/create-meal",
        element: (
          <RoleRoute role="chef">
            <CreateMeal />
          </RoleRoute>
        ),
      },
      {
        path: "chef/my-meals",
        element: (
          <RoleRoute role="chef">
            <MyMeals />
          </RoleRoute>
        ),
      },
      {
        path: "chef/order-requests",
        element: (
          <RoleRoute role="chef">
            <OrderRequests />
          </RoleRoute>
        ),
      },

      // admin
      {
        path: "admin/profile",
        element: (
          <RoleRoute role="admin">
            <AdminProfile />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleRoute role="admin">
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-requests",
        element: (
          <RoleRoute role="admin">
            <ManageRequests />
          </RoleRoute>
        ),
      },
      {
        path: "admin/platform-stats",
        element: (
          <RoleRoute role="admin">
            <PlatformStats />
          </RoleRoute>
        ),
      },
      {
        path: "admin/categories",
        element: (
          <RoleRoute role="admin">
            <Categories/>
          </RoleRoute>
        ),
      },
      {
        path: "admin/settings",
        element: (
          <RoleRoute role="admin">
            <Settings/>
          </RoleRoute>
        ),
      },
    ],
  },
]);
