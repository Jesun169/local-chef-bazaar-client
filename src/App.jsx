import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import useAuth from "./hooks/useAuth";
import FullPageLoader from "./components/FullPageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading } = useAuth();

  return (
    <>
      {/* Only one Toaster at the root */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { zIndex: 999999 },
        }}
      />

      {loading ? <FullPageLoader /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
