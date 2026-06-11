import { motion } from "framer-motion";
import { useParams, Link } from "react-router";

const BlogDetails = () => {
  const { id } = useParams();

  const blogs = [
    {
      id: "1",
      title: "How Local Chefs Prepare Fresh Homemade Meals",
      content: `
Local chefs focus on quality ingredients sourced fresh from local markets every day. Unlike mass-produced meals, homemade dishes are prepared in smaller batches, allowing chefs to maintain exceptional taste and hygiene.

They carefully select vegetables, meats, and spices while avoiding unnecessary preservatives. Most local chefs follow traditional cooking methods that preserve nutritional value while delivering authentic flavors.

Customers benefit from healthier food choices, personalized cooking styles, and meals prepared with genuine care and attention to detail.
      `,
      tag: "Food Tips",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    },
    {
      id: "2",
      title: "Why Homemade Food is Healthier Than Fast Food",
      content: `
Homemade meals contain fewer artificial ingredients, less sodium, and healthier cooking oils than many fast-food alternatives.

Preparing food at home allows better portion control and balanced nutrition. Fresh ingredients retain more vitamins and minerals, helping improve digestion, energy levels, and overall wellness.

Many people who switch to homemade meals notice long-term improvements in their health and eating habits.
      `,
      tag: "Health",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
    {
      id: "3",
      title: "Top 5 Must-Try Meals from Local Chefs",
      content: `
Local chefs offer an incredible variety of dishes ranging from traditional recipes to modern healthy meals.

Popular favorites include:
• Chicken Biryani
• Beef Tehari
• Grilled Chicken Bowl
• Fresh Vegetable Salad
• Homemade Pasta

These meals combine authentic flavors, fresh ingredients, and affordable pricing for an excellent dining experience.
      `,
      tag: "Trending",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    },
  ];

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Blog Not Found
          </h2>

          <Link
            to="/blog"
            className="btn btn-primary mt-6"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 -z-10"></div>

      {/* Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
        >

          {/* Hero Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[300px] md:h-[450px] object-cover"
          />

          <div className="p-8 md:p-10">

            {/* Tag */}
            <span className="badge badge-primary badge-lg">
              {blog.tag}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mt-5 leading-tight">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 text-base-content/70 text-sm">
              Published by Local Chef Bazaar • 5 min read
            </div>

            {/* Content */}
            <div className="mt-8 text-lg leading-relaxed text-base-content/90 whitespace-pre-line">
              {blog.content}
            </div>

            {/* CTA */}
            <div className="mt-10 flex gap-4 flex-wrap">

              <Link
                to="/blog"
                className="btn btn-outline"
              >
                ← Back to Blog
              </Link>

              <Link
                to="/meals"
                className="btn btn-primary"
              >
                Explore Meals
              </Link>

            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default BlogDetails;