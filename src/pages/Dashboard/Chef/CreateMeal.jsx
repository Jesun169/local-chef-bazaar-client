import { motion } from "framer-motion";

const CreateMeal = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Create Meal</h2>

      <form className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Meal Name" />
        <input className="input input-bordered w-full" placeholder="Price" />
        <textarea className="textarea textarea-bordered w-full" placeholder="Description" />
        <button className="btn btn-primary w-full">Add Meal</button>
      </form>
    </motion.div>
  );
};

export default CreateMeal;
