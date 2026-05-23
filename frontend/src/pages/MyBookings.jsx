import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] =
    useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get(
        "booking/my/"
      );
      setBookings(res.data);
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "approved":
        return "bg-green-500/20 text-green-400";

      case "completed":
        return "bg-blue-500/20 text-blue-400";

      case "cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const openRatingModal = (serviceId) => {
    if (!serviceId) {
      alert("Service not found ❌");
      return;
    }

    setSelectedService(serviceId);
  };

  const submitReview = async () => {
    try {
      await axiosInstance.post(
        "reviews/create/",
        {
          service: selectedService,
          rating: Number(rating),
          comment,
        }
      );

      alert(
        "Review submitted successfully ✅"
      );

      setSelectedService(null);
      setRating(5);
      setComment("");

      fetchBookings();
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.error ||
          "Failed ❌"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">

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
                <FaCheckCircle className="text-4xl text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black">
              My{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>

            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
              Manage your salon appointments,
              track booking status, and rate
              completed services.
            </p>
          </motion.div>

          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h2 className="text-3xl font-bold text-gray-400">
                No Bookings Found
              </h2>

              <p className="text-gray-500 mt-3">
                Your salon appointments will
                appear here.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {bookings.map((b, index) => (
                <motion.div
                  key={b.id}
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
                    scale: 1.02,
                  }}
                  className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl overflow-hidden"
                >

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                  <div className="flex justify-between items-center mb-5">

                    <h2 className="text-2xl font-bold">
                      Booking #{b.id}
                    </h2>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${statusColor(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-4 text-gray-300">

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-pink-500" />

                      <p>
                        <span className="font-semibold text-white">
                          Date:
                        </span>{" "}
                        {b.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-pink-500" />

                      <p>
                        <span className="font-semibold text-white">
                          Time:
                        </span>{" "}
                        {b.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaRupeeSign className="text-pink-500" />

                      <p>
                        <span className="font-semibold text-white">
                          Total:
                        </span>{" "}
                        ₹{b.total_amount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">
                      Services
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {b.services?.map((s) => (
                        <span
                          key={s.id}
                          className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {b.status === "completed" &&
                    b.services?.length >
                      0 && (
                      <button
                        onClick={() =>
                          openRatingModal(
                            b.services[0].id
                          )
                        }
                        className="mt-7 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition py-3 rounded-2xl font-bold shadow-xl"
                      >
                        ⭐ Rate Service
                      </button>
                    )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedService !== null && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 px-4"
          >
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="bg-[#111] border border-white/10 rounded-[30px] p-8 w-full max-w-md shadow-2xl"
            >

              <h2 className="text-3xl font-bold text-center mb-6">
                Rate Service
              </h2>

              <label className="text-sm text-gray-400">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    e.target.value
                  )
                }
                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 mt-2 outline-none focus:border-pink-500"
              >
                {[1, 2, 3, 4, 5].map(
                  (n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n} ⭐
                    </option>
                  )
                )}
              </select>

              <label className="text-sm text-gray-400 mt-5 block">
                Comment
              </label>

              <textarea
                rows="4"
                placeholder="Write your experience..."
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 mt-2 outline-none focus:border-pink-500"
              />

              <div className="flex gap-4 mt-7">

                <button
                  onClick={() =>
                    setSelectedService(
                      null
                    )
                  }
                  className="flex-1 text-gray-200 border border-gray-700 hover:bg-white/10 transition py-3 rounded-2xl"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    submitReview
                  }
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition py-3 rounded-2xl font-bold"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MyBookings;