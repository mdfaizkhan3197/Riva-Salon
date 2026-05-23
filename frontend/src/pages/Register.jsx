import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { registerUser } from "../api/authAPI";
import Navbar from "../components/Navbar.jsx";

import { motion } from "framer-motion";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaArrowRight,
  FaCrown,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleRegister =
    async () => {
      const {
        username,
        email,
        phone,
        address,
        password,
      } = form;

      if (
        !username ||
        !email ||
        !phone ||
        !address ||
        !password
      ) {
        alert(
          "Please fill all fields ❌"
        );
        return;
      }

      try {
        setLoading(true);

        await registerUser(form);

        alert(
          "Registration successful ✅ Please login"
        );

        navigate("/login");
      } catch (error) {
        console.log(
          error.response?.data
        );

        alert(
          error.response?.data
            ?.error ||
            "Registration failed ❌"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-4">

        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl"
        >

          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 rounded-full shadow-2xl">
              <FaCrown className="text-4xl text-white" />
            </div>
          </div>

          <div className="text-center mb-8">

            <h2 className="text-4xl font-black">
              Create Account
            </h2>

            <p className="text-gray-400 mt-3">
              Join our premium salon
              experience today.
            </p>
          </div>

          <div className="relative mb-4">

            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative mb-4">

            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative mb-4">

            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="relative mb-4">

            <FaMapMarkerAlt className="absolute left-4 top-6 text-pink-500" />

            <textarea
              name="address"
              rows="3"
              placeholder="Address"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition resize-none"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="relative mb-6">

            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={
              handleRegister
            }
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition shadow-2xl ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500"
            }`}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Register
                <FaArrowRight />
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-[1px] bg-white/10"></div>

            <span className="text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <Link to="/login">
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="w-full border border-white/10 bg-white/5 hover:bg-white/10 transition py-4 rounded-2xl font-semibold"
            >
              Login Instead
            </motion.button>
          </Link>

          <p className="text-center text-gray-500 text-sm mt-7">
            Luxury Beauty • Premium
            Care • Trusted Salon
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Register;