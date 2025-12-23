import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const MyMeals = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://local-chef-bazaar-server-black.vercel.app/meals?chefEmail=${user.email}`)
      .then(res => res.json())
      .then(data => setMeals(data));
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Meals</h2>
      {meals.length === 0 ? <p>No meals created yet.</p> :
        <ul className="space-y-2">
          {meals.map(meal => (
            <li key={meal._id} className="p-4 bg-white shadow rounded">
              <p className="text-black">Name: {meal.name}</p>
              <p className="text-black">Price: ${meal.price}</p>
              <p className="text-black">Description: {meal.description}</p>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default MyMeals;
