import { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");
    setShowRegister(false);

    try {
      await signInUser(email, password);
      navigate("/");
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("User not found or incorrect password.");
        setShowRegister(true);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-3">
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

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button className="btn btn-primary w-full">
          Login
        </button>
      </form>

      
      <p className="text-sm text-center mt-4">
  Don't have any account? <Link to="/register" className="text-primary">Create an account</Link>
</p>

    </div>
  );
};

export default Login;
