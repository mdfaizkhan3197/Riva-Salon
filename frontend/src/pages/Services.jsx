import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaClock,
  FaStar,
  FaEdit,
  FaTrash,
  FaSpa,
} from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    duration: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(user.is_staff === true);
    }
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("services/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setServices(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axiosInstance.patch(`services/${editingId}/`, form);
      } else {
        await axiosInstance.post("services/", form);
      }

      setForm({
        name: "",
        price: "",
        description: "",
        duration: "",
      });

      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name || "",
      price: s.price || "",
      description: s.description || "",
      duration: s.duration || "",
    });

    setEditingId(s.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await axiosInstance.delete(`services/${id}/`);
      fetchServices();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500/20 p-5 rounded-full">
                <FaSpa className="text-pink-500 text-4xl" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Our <span className="text-pink-500">Services</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto">
              Luxury beauty treatments crafted to elevate your confidence,
              style, and self-care experience.
            </p>
          </motion.div>

          {/* Admin Form */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-14 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6">
                {editingId ? (
                  <span className="text-yellow-400">
                    Update Service
                  </span>
                ) : (
                  <span className="text-pink-500">
                    Add New Service
                  </span>
                )}
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  className="bg-black/40 border border-gray-700 rounded-2xl p-4 outline-none focus:border-pink-500 transition"
                  placeholder="Service Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  className="bg-black/40 border border-gray-700 rounded-2xl p-4 outline-none focus:border-pink-500 transition"
                  placeholder="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />

                <input
                  className="bg-black/40 border border-gray-700 rounded-2xl p-4 outline-none focus:border-pink-500 transition"
                  placeholder="Duration (minutes)"
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration: e.target.value,
                    })
                  }
                />

                <textarea
                  rows="4"
                  className="bg-black/40 border border-gray-700 rounded-2xl p-4 outline-none focus:border-pink-500 transition md:col-span-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handleSubmit}
                className={`mt-6 w-full py-4 rounded-2xl font-semibold text-lg transition duration-300 ${
                  editingId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {editingId
                  ? "Update Service"
                  : "Add Service"}
              </button>
            </motion.div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {services.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 text-xl">
                No services available
              </div>
            ) : (
              services.map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}
                  className="relative bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl"
                >

                  <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                  <div className="p-6 flex flex-col h-full">

                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        {s.name}
                      </h2>

                      <p className="text-pink-500 text-3xl font-bold mt-2">
                        ₹{s.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <FaStar className="text-yellow-400" />

                      <span className="font-semibold">
                        {s.avg_rating || 0}
                      </span>

                      <span className="text-gray-400 text-sm">
                        ({s.total_reviews || 0} reviews)
                      </span>
                    </div>

                    <p className="text-gray-300 leading-relaxed flex-1">
                      {s.description}
                    </p>

                    <div className="flex items-center gap-2 mt-5 text-gray-400">
                      <FaClock />
                      <span>{s.duration} mins</span>
                    </div>

                    <div className="mt-6 flex gap-3">

                      {isLoggedIn ? (
                        <button
                          onClick={() =>
                            navigate(`/booking/${s.id}`)
                          }
                          className="flex-1 bg-pink-500 hover:bg-pink-600 transition py-3 rounded-2xl font-semibold"
                        >
                          Book Now
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate("/login")
                          }
                          className="flex-1 bg-gray-700 hover:bg-gray-600 transition py-3 rounded-2xl font-semibold"
                        >
                          Login
                        </button>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(s)}
                            className="bg-blue-500 hover:bg-blue-600 transition px-4 rounded-2xl"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(s.id)
                            }
                            className="bg-red-500 hover:bg-red-600 transition px-4 rounded-2xl"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;