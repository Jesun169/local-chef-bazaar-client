import { motion } from "framer-motion";
import { Link } from "react-router";

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "How Local Chefs Prepare Fresh Homemade Meals",
      desc: "Discover the secrets behind healthy, hygienic, and delicious homemade food from local chefs.",
      tag: "Food Tips",
    },
    {
      id: 2,
      title: "Why Homemade Food is Healthier Than Fast Food",
      desc: "Learn how home-cooked meals improve your health, lifestyle, and energy levels.",
      tag: "Health",
    },
    {
      id: 3,
      title: "Top 5 Must-Try Meals from Local Chefs",
      desc: "A curated list of the most loved dishes by our users this month.",
      tag: "Trending",
    },
    {
      id: 4,
      title: "How We Ensure Food Safety & Hygiene",
      desc: "Behind the scenes of our strict food safety and chef verification process.",
      tag: "Safety",
    },
    {
      id: 5,
      title: "Supporting Local Chefs in Your Community",
      desc: "Why choosing local chefs helps your community grow economically.",
      tag: "Community",
    },
    {
      id: 6,
      title: "Best Time-Saving Meal Ideas for Busy People",
      desc: "Quick and healthy meal options from verified home chefs.",
      tag: "Lifestyle",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 -z-10"></div>

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-16">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            Food Stories &
            <span className="text-primary"> Chef Insights</span>
          </h1>

          <p className="text-base-content/80 max-w-3xl mx-auto">
            Explore cooking tips, healthy eating guides, food trends,
            community stories, and expert insights from talented local chefs.
          </p>
        </motion.div>

        {/* FEATURED BLOG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-10"
        >
          <span className="badge badge-primary mb-4">
            Featured Article
          </span>

          <h2 className="text-3xl font-bold mb-4">
            Why Homemade Food is Changing the Future of Healthy Living
          </h2>

          <p className="text-base-content/80 mb-6">
            More people are choosing homemade meals over processed fast food.
            Learn how local chefs are helping communities enjoy healthier,
            fresher, and more affordable food every day.
          </p>

          <Link
            to="/meals"
            className="btn btn-primary"
          >
            Explore Meals
          </Link>
        </motion.div>

        {/* BLOG GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden"
            >

              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://picsum.photos/600/400?random=${blog.id}`}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6">

                <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                  {blog.tag}
                </span>

                <h2 className="text-xl font-bold mt-4 mb-3">
                  {blog.title}
                </h2>

                <p className="text-sm text-base-content/80 mb-5">
                  {blog.desc}
                </p>

                <Link
                  to={`/blog/${blog.id}`}
                  className="btn btn-primary btn-sm w-full"
                >
                  Read More
                </Link>

              </div>
            </motion.div>
          ))}
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-base-100/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-4xl font-bold text-primary">50+</h3>
            <p className="mt-2 text-base-content/80">
              Verified Local Chefs
            </p>
          </div>

          <div className="bg-base-100/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-4xl font-bold text-primary">100+</h3>
            <p className="mt-2 text-base-content/80">
              Homemade Meals
            </p>
          </div>

          <div className="bg-base-100/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-4xl font-bold text-primary">4.8★</h3>
            <p className="mt-2 text-base-content/80">
              Average Customer Rating
            </p>
          </div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center bg-primary text-white rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Taste Something Amazing?
          </h2>

          <p className="mb-6 max-w-2xl mx-auto">
            Discover delicious homemade meals prepared by trusted local chefs
            near you.
          </p>

          <Link
            to="/meals"
            className="btn btn-neutral btn-lg"
          >
            Explore Meals
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Blog;