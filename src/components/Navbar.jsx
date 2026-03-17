import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo of LCB.png";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("Logged out");
      })
      .catch(err => console.log(err));
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/meals">Meals</NavLink></li>
      <li><NavLink to="/dashboard/profile">Dashboard</NavLink></li>
    </>
  );

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="navbar bg-base-100 shadow-md px-6 h-[72px]"
    >

      <div className="navbar-start">

        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50">
            {navLinks}
          </ul>
        </div>

        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={logo}
            alt="Local Chef Bazaar"
            className="h-11 w-11 object-contain"
            whileHover={{ scale: 1.05 }}
          />
          <span className="text-xl font-semibold tracking-wide">
            Local Chef Bazaar
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-3 font-medium">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-3">

        {user ? (
          <>
            <div className="tooltip tooltip-bottom" data-tip={user.displayName || user.email}>
              <img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full border cursor-pointer"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn btn-outline btn-error"
            >
              Logout
            </motion.button>
          </>
        ) : (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </motion.div>
        )}

      </div>
    </motion.nav>
  );
};

export default Navbar;
