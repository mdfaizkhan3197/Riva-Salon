import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import {
  Menu,
  X,
  Scissors,
  Sparkles,
  Image,
  Star,
  Calendar,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    setToken(savedToken);

    // ✅ FIXED ADMIN DETECTION
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsStaff(parsedUser.is_staff === true);
      } catch (err) {
        setIsStaff(false);
      }
    } else if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setIsStaff(decoded.is_staff === true);
      } catch (err) {
        setIsStaff(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <Sparkles size={16} />,
    },
    {
      name: "Services",
      path: "/services",
      icon: <Scissors size={16} />,
    },
    {
      name: "Gallery",
      path: "/gallery",
      icon: <Image size={16} />,
    },
    {
      name: "Reviews",
      path: "/reviews",
      icon: <Star size={16} />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl overflow-hidden">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-0 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"></div>

          <div className="absolute -top-20 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-2xl shadow-lg shadow-pink-500/30"
            >
              <Scissors
                size={22}
                className="text-white"
              />
            </motion.div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wide bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
                ＲＩ𝕍Λ Salon
              </h1>

              <p className="text-xs text-gray-400 hidden sm:block">
                Beauty • Luxury • Confidence
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-3">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all duration-300 font-medium ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {token && (
              <Link
                to="/my-bookings"
                className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all duration-300 font-medium ${
                  isActive("/my-bookings")
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Calendar size={16} />
                My Bookings
              </Link>
            )}

            {token && isStaff && (
              <Link
                to="/admin"
                className={`px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105 ${
                  isActive("/admin")
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                }`}
              >
                <ShieldCheck size={18} />
                Admin Panel
              </Link>
            )}

            {!token ? (
              <div className="flex items-center gap-3 ml-2">

                <Link
                  to="/login"
                  className="border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl transition-all duration-300 text-white font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-all duration-300 px-5 py-2.5 rounded-2xl text-white font-semibold shadow-xl shadow-pink-500/30"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-2xl transition-all duration-300 text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 hover:scale-105"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="lg:hidden bg-white/10 border border-white/10 p-3 rounded-2xl text-white"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.3,
              }}
              className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl"
            >
              <div className="px-5 py-6 flex flex-col gap-3">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}

                {token && (
                  <Link
                    to="/my-bookings"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive("/my-bookings")
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Calendar size={18} />
                    My Bookings
                  </Link>
                )}

                {token && isStaff && (
                  <Link
                    to="/admin"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/20"
                  >
                    <ShieldCheck size={18} />
                    Admin Panel
                  </Link>
                )}

                {!token ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="border border-white/10 bg-white/5 py-3 rounded-2xl text-center text-white font-medium"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="bg-gradient-to-r from-pink-500 to-purple-500 py-3 rounded-2xl text-center text-white font-semibold shadow-lg"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

export default Navbar;