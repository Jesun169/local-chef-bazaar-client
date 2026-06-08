import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo of LCB.png";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `relative px-2 py-1 transition-colors duration-300 ${
      isActive ? "text-primary font-semibold" : "hover:text-primary"
    }`;

  const underline = ({ isActive }) =>
    isActive
      ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
      : "";

  const navLinks = (
    <>
      {["/", "/meals", "/explore", "/about"].map((path, i) => (
        <li key={i}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              `${linkClass({ isActive })} ${underline({ isActive })}`
            }
            onClick={() => setOpen(false)}
          >
            {path === "/"
              ? "Home"
              : path.replace("/", "").charAt(0).toUpperCase() +
                path.replace("/", "").slice(1)}
          </NavLink>
        </li>
      ))}

      {user && (
        <>
          <li>
            <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/70 border-b border-white/10 shadow-md"
      >
        <div className="navbar px-4 md:px-8 h-[72px]">

          {/* LEFT */}
          <div className="navbar-start flex gap-2 items-center">
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <Link className="flex items-center gap-2" to="/">
              <motion.img
                whileHover={{ rotate: 5, scale: 1.05 }}
                src={logo}
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold hidden sm:block">
                Local Chef Bazaar
              </span>
            </Link>
          </div>

          {/* CENTER */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-2">{navLinks}</ul>
          </div>

          {/* RIGHT */}
          <div className="navbar-end flex gap-2 items-center">

            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* ✅ FIXED AUTH LOADING (NO FLICKER) */}
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <img
                    className="rounded-full"
                    src={
                      user.photoURL ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                  />
                </label>

                <ul className="menu dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60">
                  <li className="font-bold truncate">{user.displayName}</li>
                  <li className="text-xs truncate">{user.email}</li>
                  <hr />
                  <li>
                    <Link to="/dashboard/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 h-full w-72 bg-base-100 z-50 shadow-xl p-5"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold">Menu</h2>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <ul className="menu gap-2">{navLinks}</ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;