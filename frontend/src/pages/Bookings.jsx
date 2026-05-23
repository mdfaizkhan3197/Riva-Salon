import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/Navbar.jsx";
import { createBooking } from "../api/bookingAPI";

import {
  CalendarDays,
  Clock3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login first ❌"
      );
      navigate("/login");
      return;
    }

    if (!date || !time) {
      alert(
        "Please select date & time ❌"
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        services: [
          parseInt(serviceId),
        ],
        booking_date: date,
        booking_time: time,
      };

      console.log(
        "Sending:",
        data
      );

      const res =
        await createBooking(
          data
        );

      console.log(res);

      alert(
        "Booking created successfully ✅"
      );

      navigate(
        "/my-bookings"
      );
    } catch (error) {
      console.log(
        error.response?.data
      );

      alert(
        error.response?.data
          ?.error ||
          "Booking failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-4 py-10">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

        {/* CARD */}
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
            duration: 0.5,
          }}
          className="relative z-10 w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl"
        >

          {/* ICON */}
          <div className="flex justify-center mb-6">

            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 rounded-3xl shadow-lg shadow-pink-500/30">
              <Sparkles
                size={35}
                className="text-white"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">

            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
              Book Appointment
            </h1>

            <p className="text-gray-400 mt-3">
              Schedule your salon
              appointment easily
            </p>
          </div>

          {/* DATE */}
          <div className="mb-5">

            <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
              <CalendarDays
                size={18}
              />
              Select Date
            </label>

            <input
              type="date"
              value={date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-500 transition"
            />
          </div>

          {/* TIME */}
          <div className="mb-8">

            <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
              <Clock3 size={18} />
              Select Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(
                  e.target.value
                )
              }
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-2xl hover:shadow-pink-500/30"
            }`}
          >
            <CheckCircle2
              size={22}
            />

            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </motion.button>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Your appointment will
            be reviewed by admin
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Booking;