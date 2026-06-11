import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_0iz32vs",
        "template_b9jwmld",
        form.current,
        "VzFZoaS8su5BHF7lU"
      )
      .then(
        () => {
          setSuccess(true);
          setLoading(false);
          form.current.reset();
        },
        (error) => {
          console.log(error);
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 -z-10"></div>

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Contact <span className="text-primary">Us</span>
          </h1>

          <p className="text-base-content/80 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We are here to help you
            anytime.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-4 gap-6">

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 text-center"
          >
            <FaPhone className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-base-content/80">
              +880 1234 567 890
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 text-center"
          >
            <FaEnvelope className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-base-content/80">
              support@localchefbazaar.com
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 text-center"
          >
            <FaMapMarkerAlt className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Location</h3>
            <p className="text-sm text-base-content/80">
              Dhaka, Bangladesh
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 text-center"
          >
            <FaClock className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Working Hours</h3>
            <p className="text-sm text-base-content/80">
              9AM - 10PM
            </p>
          </motion.div>

        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-8 grid md:grid-cols-2 gap-10"
        >

          {/* Left Side */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Send us a message
            </h2>

            <p className="text-base-content/80">
              Fill out the form and our team will get back to you as soon as
              possible.
            </p>

            <div className="space-y-2 text-sm text-base-content/90">
              <p>✔ Fast response within 24 hours</p>
              <p>✔ Dedicated support team</p>
              <p>✔ Available 7 days a week</p>
              <p>✔ Trusted Local Chef Support</p>
            </div>
          </div>

          {/* Form */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="space-y-4"
          >

            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              className="input input-bordered w-full bg-base-100/60 backdrop-blur-sm"
              required
            />

            <input
              type="email"
              name="user_email"
              placeholder="Your Email"
              className="input input-bordered w-full bg-base-100/60 backdrop-blur-sm"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="input input-bordered w-full bg-base-100/60 backdrop-blur-sm"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              className="textarea textarea-bordered w-full h-32 bg-base-100/60 backdrop-blur-sm"
              required
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {success && (
              <p className="text-green-500 text-center font-medium">
                Message sent successfully ✅
              </p>
            )}

          </form>

        </motion.div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-base-100/70 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden"
        >
          <iframe
            title="location"
            src="https://maps.google.com/maps?q=Dhaka%20Bangladesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[400px]"
            loading="lazy"
          />
        </motion.div>

      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8801234567890"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="btn btn-success rounded-full shadow-2xl">
          💬 WhatsApp
        </button>
      </a>

    </div>
  );
};

export default Contact;