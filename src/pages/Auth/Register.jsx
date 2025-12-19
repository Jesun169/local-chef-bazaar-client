import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const address = form.address.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photo);
      const userInfo = {
        name,
        email,
        photo,
        address,
        role: "user",
        status: "active"
      };

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo)
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleRegister} className="space-y-3">
        <input name="name" placeholder="Name" className="input input-bordered w-full" required />
        <input name="email" type="email" placeholder="Email" className="input input-bordered w-full" required />
        <input name="photo" placeholder="Profile Image URL" className="input input-bordered w-full" />
        <input name="address" placeholder="Address" className="input input-bordered w-full" required />
        <input name="password" type="password" placeholder="Password" className="input input-bordered w-full" required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="input input-bordered w-full" required />

        {error && <p className="text-red-500">{error}</p>}

        <button className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
