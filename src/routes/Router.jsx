import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../pages/Home/Home";
import Banner from "../pages/Home/Banner/Banner";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
      {
        index: true,
        Component:Home
      },
       {
        index: true,
        Component:Banner
      },
    ]
  },
]);