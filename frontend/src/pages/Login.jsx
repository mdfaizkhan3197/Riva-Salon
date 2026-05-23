import { useState } from "react";
import axios from "axios";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUser,
  FaArrowRight,
  FaCrown,
} from "react-icons/fa";

function Login() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert(
        "Please fill all fields ❌"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          username,
          password,
        }
      );

      console.log(
        "LOGIN RESPONSE",
        res.data
      );

      localStorage.setItem(
        "token",
        res.data.access
      );

      localStorage.setItem(
        "refresh",
        res.data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          username:
            res.data.user.username,
          is_staff:
            res.data.user.is_staff,
        })
      );

      alert("Login successful ✅");

      if (
        res.data.user.is_staff
      ) {
        navigate("/admin");
      } else {
        navigate("/services");
      }
    } catch (error) {
      console.log(
        error.response?.data
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Invalid username or password ❌"
        );
      } else {
        alert("Login failed ❌");
      }
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
              Welcome Back
            </h2>

            <p className="text-gray-400 mt-3">
              Login to continue your
              luxury salon experience.
            </p>
          </div>

          <div className="relative mb-5">

            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="text"
              placeholder="Username"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />
          </div>

          <div className="relative mb-6">

            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-500 transition"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition shadow-2xl ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500"
            }`}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login
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

          <Link to="/register">
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="w-full border border-white/10 bg-white/5 hover:bg-white/10 transition py-4 rounded-2xl font-semibold"
            >
              Create Account
            </motion.button>
          </Link>

          <p className="text-center text-gray-500 text-sm mt-7">
            Luxury Beauty • Premium
            Experience • Trusted Salon
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Login;