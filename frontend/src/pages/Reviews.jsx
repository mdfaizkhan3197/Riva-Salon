import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("reviews/");
      setReviews(res.data);
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">

        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">

          <motion.div
            initial={{
              opacity: 0,
              y: -40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-5">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 rounded-full shadow-2xl">
                <FaHeart className="text-4xl text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black">
              Client{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Reviews
              </span>
            </h1>

            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
              Hear what our happy clients say about their
              luxury salon experience and beauty
              transformation.
            </p>
          </motion.div>

          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h2 className="text-3xl font-bold text-gray-400">
                No Reviews Yet
              </h2>

              <p className="text-gray-500 mt-3">
                Customer reviews will appear here.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {reviews.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-8 overflow-hidden shadow-2xl"
                >

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                  <div className="absolute top-6 right-6 opacity-10">
                    <FaQuoteLeft className="text-6xl" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    {r.service_name || "Salon Service"}
                  </h2>

                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-5">

                    <div className="text-yellow-400 text-xl">
                      {renderStars(r.rating)}
                    </div>

                    <span className="text-gray-400 text-sm">
                      ({r.rating}/5)
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-300 leading-relaxed text-lg min-h-[120px]">
                    "
                    {r.comment ||
                      "Amazing salon experience!"}
                    "
                  </p>

                  {/* Bottom */}
                  <div className="mt-8 flex items-center justify-between">

                    <div>
                      <p className="font-semibold text-white">
                        {r.user || "Customer"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Verified Client
                      </p>
                    </div>

                    <div className="bg-pink-500/20 p-3 rounded-2xl">
                      <FaStar className="text-pink-500 text-xl" />
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
                </motion.div>
              ))}
            </div>
          )}

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
              delay: 0.4,
            }}
            className="mt-20 text-center"
          >
            <h2 className="text-4xl font-bold">
              Trusted By{" "}
              <span className="text-pink-500">
                Happy Clients
              </span>
            </h2>

            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              We believe every client deserves a premium
              beauty experience with luxury care and
              perfection.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition px-10 py-4 rounded-2xl font-bold shadow-2xl"
            >
              Book Appointment
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Reviews;