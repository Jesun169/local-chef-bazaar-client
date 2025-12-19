import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import logo from "../assets/logo of LCB.png";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="footer p-10 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-3">
            <motion.img
              src={logo}
              alt="Local Chef Bazaar"
              className="h-11 w-11 object-contain"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="text-xl font-semibold tracking-wide">
              Local Chef Bazaar
            </span>
          </Link>

          <p className="text-sm leading-relaxed opacity-80">
            Connecting local chefs with food lovers. Fresh, homemade meals
            delivered with love and care.
          </p>
        </div>
        <div>
          <h6 className="footer-title">Contact</h6>
          <p>Email: support@localchefbazaar.com</p>
          <p>Phone: +880 1234 567 890</p>
          <p>Address: Dhaka, Bangladesh</p>
        </div>
        <div>
          <h6 className="footer-title">Working Hours</h6>
          <p>Mon – Fri: 9:00 AM – 10:00 PM</p>
          <p>Saturday: 10:00 AM – 11:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
        <div>
          <h6 className="footer-title">Follow Us</h6>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-primary transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-primary transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-primary transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-primary transition">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>
      <div className="border-t border-neutral-content/20 py-4 text-center text-sm">
        © {new Date().getFullYear()} Local Chef Bazaar. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
