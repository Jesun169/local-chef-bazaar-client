import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");


  const from = location.state?.from?.pathname || "/dashboard/profile";

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");

    try {

      await signInUser(email, password);


      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your email and password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          required
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
