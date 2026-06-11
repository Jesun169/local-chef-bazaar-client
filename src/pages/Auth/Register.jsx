import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../firebase/firebase.init";

const Register = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const address = form.address.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      let photoURL = "";

      // 2. Upload image to Firebase Storage
      if (file) {
        const imageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(imageRef, file);
        photoURL = await getDownloadURL(imageRef);
      }

      // 3. Update Firebase profile (IMPORTANT FIX)
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      // 4. Save to MongoDB
      const userInfo = {
        name,
        email,
        photo: photoURL || "",
        address,
        role: "user",
        status: "active",
      };

      await fetch(
        "https://local-chef-bazaar-server-black.vercel.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleRegister} className="space-y-3 text-base-content">

        <input
          name="name"
          placeholder="Name"
          className="input input-bordered w-full"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />

        {/* FILE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
        />

        <input
          name="address"
          placeholder="Address"
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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;