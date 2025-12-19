import { Link, NavLink } from "react-router";
import { motion } from "framer-motion";
import logo from "../assets/logo of LCB.png";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
      })
      .catch(err => console.log(err));
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="navbar bg-base-100 shadow-md px-6 h-[72px]"
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/meals">Meals</NavLink></li>
            <li><NavLink to="/dashboard/profile">Dashboard</NavLink></li>
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={logo}
            alt="Local Chef Bazaar"
            className="h-11 w-11 object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <span className="text-xl font-semibold tracking-wide">
            Local Chef Bazaar
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 text-base font-medium">
          <li>
            <NavLink to="/" className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : ""
            }>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/meals" className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : ""
            }>
              Meals
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : ""
            }>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn btn-outline btn-error px-6"
          >
            Logout
          </motion.button>
        ) : (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="btn btn-primary px-6">
              Login
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
