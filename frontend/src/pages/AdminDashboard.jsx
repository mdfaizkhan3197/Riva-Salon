import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { motion } from "framer-motion";

import {
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSyncAlt,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [filter, setFilter] =
    useState("all");

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const res =
        await axiosInstance.get(
          `booking/all/?t=${Date.now()}`
        );

      setBookings(res.data);
      setFilteredBookings(
        res.data
      );
    } catch (err) {
      console.log(
        "Admin fetch error:",
        err.response?.data
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const today = new Date();

    const filtered =
      bookings.filter((b) => {
        const bookingDate =
          new Date(b.date);

        if (filter === "daily") {
          return (
            bookingDate.toDateString() ===
            today.toDateString()
          );
        }

        if (filter === "weekly") {
          const weekAgo =
            new Date();

          weekAgo.setDate(
            today.getDate() - 7
          );

          return (
            bookingDate >= weekAgo
          );
        }

        if (
          filter === "monthly"
        ) {
          return (
            bookingDate.getMonth() ===
              today.getMonth() &&
            bookingDate.getFullYear() ===
              today.getFullYear()
          );
        }

        return true;
      });

    setFilteredBookings(
      filtered
    );
  }, [filter, bookings]);

  const completedBookings =
    filteredBookings.filter(
      (b) =>
        b.status ===
        "completed"
    );

  const totalRevenue =
    completedBookings.reduce(
      (sum, b) =>
        sum +
        Number(
          b.total_amount || 0
        ),
      0
    );

  const totalBookings =
    filteredBookings.length;

  const chartData = Object.values(
    completedBookings.reduce(
      (acc, b) => {
        if (!acc[b.date]) {
          acc[b.date] = {
            date: b.date,
            total: 0,
          };
        }

        acc[b.date].total +=
          Number(
            b.total_amount || 0
          );

        return acc;
      },
      {}
    )
  );

  const statusColor = (
    status
  ) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "approved":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "completed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";

      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const exportExcel = () => {
    const data =
      filteredBookings.map(
        (b) => ({
          User: b.user,
          Date: b.date,
          Time: b.time,
          Status: b.status,
          Amount:
            b.total_amount,
        })
      );

    const ws =
      XLSX.utils.json_to_sheet(
        data
      );

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Bookings"
    );

    const buffer = XLSX.write(
      wb,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    saveAs(
      new Blob([buffer]),
      "bookings.xlsx"
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text(
      "Bookings Report",
      14,
      15
    );

    const rows =
      filteredBookings.map(
        (b) => [
          b.user,
          b.date,
          b.time,
          b.status,
          b.total_amount,
        ]
      );

    doc.autoTable({
      head: [
        [
          "User",
          "Date",
          "Time",
          "Status",
          "Amount",
        ],
      ],

      body: rows,

      startY: 20,
    });

    doc.save("bookings.pdf");
  };

  const updateStatus =
    async (id, status) => {
      try {
        await axiosInstance.patch(
          `booking/update/${id}/`,
          { status }
        );

        fetchBookings();
      } catch (err) {
        console.log(
          "Status update error:",
          err.response?.data
        );
      }
    };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative p-6">

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-wrap justify-between items-center gap-4 mb-10"
        >

          <div>
            <h1 className="text-5xl font-black">
              ＲＩＶΛ{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>

            <p className="text-gray-400 mt-2">
              Manage bookings,
              revenue &
              appointments
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="bg-black border border-white/10 rounded-2xl px-4 py-3 outline-none"
            >
              <option value="all">
                All
              </option>

              <option value="daily">
                Today
              </option>

              <option value="weekly">
                Last 7 Days
              </option>

              <option value="monthly">
                This Month
              </option>
            </select>

            <button
              onClick={
                exportExcel
              }
              className="bg-green-600 hover:scale-105 transition px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
            >
              <FaFileExcel />
              Excel
            </button>

            <button
              onClick={
                exportPDF
              }
              className="bg-red-600 hover:scale-105 transition px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
            >
              <FaFilePdf />
              PDF
            </button>

            <button
              onClick={
                fetchBookings
              }
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <motion.div
            whileHover={{
              y: -8,
            }}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-400">
                  Total
                  Bookings
                </p>

                <h2 className="text-5xl font-black mt-2">
                  {
                    totalBookings
                  }
                </h2>
              </div>

              <div className="bg-pink-500/20 p-5 rounded-2xl">
                <FaUsers className="text-3xl text-pink-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -8,
            }}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-400">
                  Revenue
                </p>

                <h2 className="text-5xl font-black mt-2">
                  ₹
                  {
                    totalRevenue
                  }
                </h2>
              </div>

              <div className="bg-green-500/20 p-5 rounded-2xl">
                <FaMoneyBillWave className="text-3xl text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -8,
            }}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-400">
                  Completed
                </p>

                <h2 className="text-5xl font-black mt-2">
                  {
                    completedBookings.length
                  }
                </h2>
              </div>

              <div className="bg-blue-500/20 p-5 rounded-2xl">
                <FaCheckCircle className="text-3xl text-blue-500" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl mb-10"
        >

          <div className="flex items-center gap-3 mb-6">
            <FaChartLine className="text-pink-500 text-2xl" />

            <h2 className="text-2xl font-bold">
              Sales Trend
            </h2>
          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <AreaChart
              data={chartData}
            >
              <defs>
                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#ec4899"
                    stopOpacity={
                      0.8
                    }
                  />

                  <stop
                    offset="95%"
                    stopColor="#ec4899"
                    stopOpacity={
                      0
                    }
                  />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <CartesianGrid strokeDasharray="3 3" />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#ec4899"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {loading ? (
          <div className="text-center text-xl py-20">
            Loading...
          </div>
        ) : filteredBookings.length ===
          0 ? (
          <div className="text-center text-2xl text-gray-400 py-20">
            No bookings found ❌
          </div>
        ) : (
          <div className="space-y-6">

            {filteredBookings.map(
              (b, index) => (
                <motion.div
                  key={b.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.05,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-7 shadow-2xl"
                >

                  <div className="flex flex-wrap justify-between gap-4">

                    <div>
                      <h2 className="text-2xl font-bold">
                        {b.user}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-400 mt-2">

                        <FaCalendarAlt />

                        <p>
                          {b.date} •{" "}
                          {
                            b.time
                          }
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-5 py-2 rounded-full h-fit capitalize font-semibold ${statusColor(
                        b.status
                      )}`}
                    >
                      {
                        b.status
                      }
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-gray-400">
                      Total Amount
                    </p>

                    <h2 className="text-4xl font-black text-pink-500 mt-1">
                      ₹
                      {
                        b.total_amount
                      }
                    </h2>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-7 flex-wrap">

                    <button
                      onClick={() =>
                        updateStatus(
                          b.id,
                          "approved"
                        )
                      }
                      className="bg-green-600 hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          b.id,
                          "cancelled"
                        )
                      }
                      className="bg-red-600 hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          b.id,
                          "completed"
                        )
                      }
                      className="bg-blue-600 hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold"
                    >
                      Complete
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;