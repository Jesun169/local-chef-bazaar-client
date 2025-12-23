import useAuth from "../../../hooks/useAuth";

const ChefProfile = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Chef Profile</h1>

      <div className="bg-gray-800 p-4 rounded">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default ChefProfile;
