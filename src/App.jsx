import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import useAuth from "./hooks/useAuth";
import FullPageLoader from "./components/FullPageLoader";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;
