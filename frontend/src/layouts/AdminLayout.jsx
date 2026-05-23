import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaHome,
  FaChartPie,
  FaCalendarCheck,
  FaImages,
  FaBoxOpen,
  FaUserCheck,
  FaUsers,
  FaCut,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCashRegister,
} from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("refresh");

    localStorage.removeItem("user");

    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartPie />,
    },

    {
      name: "POS",
      path: "/admin/pos",
      icon: <FaCashRegister />,
    },

    {
      name: "Bookings",
      path: "/my-bookings",
      icon: <FaCalendarCheck />,
    },

    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },

    {
      name: "Gallery",
      path: "/gallery",
      icon: <FaImages />,
    },

    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: <FaBoxOpen />,
    },

    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: <FaUserCheck />,
    },

    {
      name: "Staff",
      path: "/admin/staff",
      icon: <FaUsers />,
    },

    {
      name: "Services",
      path: "/services",
      icon: <FaCut />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-50 bg-[#050505]" />

      <div className="fixed top-[-150px] left-[-150px] w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full -z-40" />

      <div className="fixed bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full -z-40" />

      {/* MOBILE TOPBAR */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/70 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 lg:hidden">

        <h1 className="text-2xl font-black">
          RIVA
        </h1>

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="bg-pink-500 p-3 rounded-xl"
        >
          <FaBars />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>

        {sidebarOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setSidebarOpen(false)
              }
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                damping: 20,
              }}
              className="fixed top-0 left-0 h-full w-72 bg-[#081120]/95 backdrop-blur-2xl border-r border-white/10 p-5 z-50 lg:hidden flex flex-col"
            >

              <div className="flex items-center justify-between mb-10">

                <div>
                  <h1 className="text-3xl font-black">
                    RIVA
                  </h1>

                  <p className="text-gray-400 text-sm mt-1">
                    Admin Panel
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className="text-2xl"
                >
                  <FaTimes />
                </button>

              </div>

              <nav className="flex flex-col gap-3 flex-1">

                {menuItems.map(
                  (item, index) => {
                    const active =
                      location.pathname ===
                      item.path;

                    return (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() =>
                          setSidebarOpen(
                            false
                          )
                        }
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium
                        
                        ${
                          active
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : "bg-white/5 border border-white/5"
                        }
                        `}
                      >
                        <span>
                          {item.icon}
                        </span>

                        <span>
                          {item.name}
                        </span>
                      </Link>
                    );
                  }
                )}

              </nav>

              <button
                onClick={handleLogout}
                className="mt-6 bg-gradient-to-r from-red-500 to-pink-600 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.div
        initial={{
          x: -50,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        className="hidden lg:flex w-72 min-h-screen bg-[#081120]/90 backdrop-blur-2xl border-r border-white/10 p-5 flex-col"
      >

        <div className="mb-10">

          <h1 className="text-4xl font-black tracking-tight">
            ＲＩＶΛ{" "}

            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Panel
            </span>
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Salon Management System
          </p>

        </div>

        <nav className="flex flex-col gap-3 flex-1">

          {menuItems.map((item, index) => {
            const active =
              location.pathname ===
              item.path;

            return (
              <motion.div
                key={index}
                whileHover={{
                  x: 5,
                }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium
                  
                  ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
                      : "bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300"
                  }
                  `}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}

        </nav>

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={handleLogout}
          className="mt-6 bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition-all py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-lg shadow-red-500/20"
        >
          <FaSignOutAlt />
          Logout
        </motion.button>

      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        <div className="p-4 pt-24 lg:pt-6 md:p-6 lg:p-8">

          <Outlet />

        </div>

      </div>
    </div>
  );
}

export default AdminLayout;