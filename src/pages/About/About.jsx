import { motion } from "framer-motion";
import { FaUtensils, FaUsers, FaShieldAlt, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 -z-10"></div>

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-16">

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            About <span className="text-primary">Local Chef Bazaar</span>
          </h1>

          <p className="text-base-content/80 max-w-2xl mx-auto">
            We connect food lovers with passionate local chefs to deliver fresh,
            homemade, and hygienic meals straight to your doorstep.
          </p>
        </motion.div>

        {/* MISSION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-base-content/80">
            Our Mission
          </h2>

          <p className="text-base-content/90 leading-relaxed">
            Our mission is to empower local chefs and home cooks by giving them
            a platform to showcase their talent while providing customers with
            healthy, affordable, and freshly cooked meals. We believe food should
            be personal, safe, and made with love.
          </p>
        </motion.div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-4 gap-6">

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow text-center"
          >
            <FaUtensils className="text-4xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Fresh Food</h3>
            <p className="text-sm text-base-content/80">
              Cooked daily by verified chefs
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow text-center"
          >
            <FaUsers className="text-4xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Trusted Chefs</h3>
            <p className="text-sm text-base-content/80">
              Verified and rated professionals
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow text-center"
          >
            <FaTruck className="text-4xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-sm text-base-content/80">
              Hot meals delivered quickly
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow text-center"
          >
            <FaShieldAlt className="text-4xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Safe & Hygienic</h3>
            <p className="text-sm text-base-content/80">
              Clean cooking standards
            </p>
          </motion.div>

        </div>

        {/* STORY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-base-content/80">
            Our Story
          </h2>

          <p className="text-base-content/90 leading-relaxed">
            Local Chef Bazaar started with a simple idea — everyone deserves
            access to fresh homemade food, not just fast food. We built this
            platform to support small chefs and bring real homemade taste
            to people’s daily lives.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center bg-primary text-white rounded-2xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-2">
            Join Our Food Community
          </h2>

          <p className="mb-4">
            Taste the difference of homemade meals today.
          </p>

          <button
            onClick={() => navigate("/meals")}
            className="btn btn-neutral"
          >
            Meals
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default About;