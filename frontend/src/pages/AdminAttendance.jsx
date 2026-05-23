import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { motion } from "framer-motion";

import {
  FaUserCheck,
  FaUserTimes,
  FaFileExcel,
  FaCalendarAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";

function AdminAttendance() {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [filterType, setFilterType] =
    useState("daily");

  const getTodayLocal = () => {
    const today = new Date();

    const offset =
      today.getTimezoneOffset();

    const local = new Date(
      today.getTime() -
        offset * 60000
    );

    return local
      .toISOString()
      .split("T")[0];
  };

  const [selectedDate, setSelectedDate] =
    useState(getTodayLocal());

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 7)
    );

  const fetchData = async () => {
    try {
      setLoading(true);

      const s =
        await axiosInstance.get(
          "staff/"
        );

      const a =
        await axiosInstance.get(
          "attendance/"
        );

      setStaff(s.data);
      setAttendance(a.data);
    } catch (err) {
      console.error(
        err.response?.data ||
          err.message
      );

      alert(
        "Failed to load data ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAttendance = async (
    staffId,
    status
  ) => {
    try {
      await axiosInstance.post(
        "attendance/",
        {
          staff: staffId,
          status,
          date: selectedDate,
        }
      );

      fetchData();
    } catch (err) {
      console.error(
        err.response?.data ||
          err.message
      );

      alert(
        JSON.stringify(
          err.response?.data
        )
      );
    }
  };

  const deleteAttendance =
    async (id) => {
      if (
        !window.confirm(
          "Delete this record?"
        )
      )
        return;

      try {
        await axiosInstance.delete(
          `attendance/${id}/`
        );

        fetchData();
      } catch (err) {
        console.error(
          err.response?.data ||
            err.message
        );

        alert("Delete failed ❌");
      }
    };

  const getFilteredData = () => {
    if (filterType === "daily") {
      return attendance.filter(
        (a) =>
          a.date ===
          selectedDate
      );
    }

    if (filterType === "weekly") {
      const selected =
        new Date(selectedDate);

      const start = new Date(
        selected
      );

      start.setDate(
        selected.getDate() -
          selected.getDay()
      );

      const end = new Date(start);

      end.setDate(
        start.getDate() + 6
      );

      return attendance.filter(
        (a) => {
          const d = new Date(
            a.date
          );

          return (
            d >= start &&
            d <= end
          );
        }
      );
    }

    if (
      filterType === "monthly"
    ) {
      return attendance.filter(
        (a) =>
          a.date.startsWith(
            selectedMonth
          )
      );
    }

    return [];
  };

  const filteredAttendance =
    getFilteredData();

  const monthlyAttendance =
    attendance.filter((a) =>
      a.date.startsWith(
        selectedMonth
      )
    );

  const chartData = Object.values(
    monthlyAttendance.reduce(
      (acc, item) => {
        if (
          !acc[item.staff_name]
        ) {
          acc[item.staff_name] = {
            name: item.staff_name,
            present: 0,
            absent: 0,
            halfday: 0,
          };
        }

        if (
          item.status ===
          "present"
        ) {
          acc[
            item.staff_name
          ].present++;
        } else if (
          item.status ===
          "halfday"
        ) {
          acc[
            item.staff_name
          ].halfday++;
        } else {
          acc[
            item.staff_name
          ].absent++;
        }

        return acc;
      },
      {}
    )
  );

  const exportToExcel = () => {
    if (
      filteredAttendance.length ===
      0
    ) {
      alert(
        "No data to export ❌"
      );

      return;
    }

    const data =
      filteredAttendance.map(
        (a) => ({
          Staff: a.staff_name,
          Status: a.status,
          Date: a.date,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const file = new Blob(
      [excelBuffer],
      {
        type: "application/octet-stream",
      }
    );

    saveAs(
      file,
      `Attendance_${filterType}.xlsx`
    );
  };

  const getAttendanceStatus = (
    staffId,
    date
  ) => {
    const found =
      attendance.find(
        (a) =>
          a.staff ===
            staffId &&
          a.date === date
      );

    return found?.status || null;
  };

  const generateCalendarDays =
    () => {
      const [year, month] =
        selectedMonth.split(
          "-"
        );

      const daysInMonth =
        new Date(
          year,
          month,
          0
        ).getDate();

      return Array.from(
        {
          length:
            daysInMonth,
        },
        (_, i) => {
          const day = String(
            i + 1
          ).padStart(2, "0");

          return `${selectedMonth}-${day}`;
        }
      );
    };

  const calendarDays =
    generateCalendarDays();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER */}
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
            <h1 className="text-4xl md:text-5xl font-black">
              Staff{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Attendance
              </span>
            </h1>

            <p className="text-gray-400 mt-2">
              Manage staff presence
            </p>
          </div>

          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:scale-105 transition-all px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold shadow-lg"
          >
            <FaFileExcel />
            Export Excel
          </button>
        </motion.div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-xl outline-none"
          >
            <option value="daily">
              Daily
            </option>

            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>
          </select>

          {filterType !==
          "monthly" ? (
            <input
              type="date"
              value={selectedDate}
              max={getTodayLocal()}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl outline-none"
            />
          ) : (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl outline-none"
            />
          )}
        </div>

        {/* STAFF CARDS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          {staff.map(
            (s, index) => (
              <motion.div
                key={s.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
                whileHover={{
                  y: -5,
                }}
                className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-5">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {s.name}
                    </h2>

                    <p className="text-gray-400">
                      {s.role}
                    </p>
                  </div>

                  <div className="bg-pink-500/20 p-4 rounded-2xl">
                    <FaUsers className="text-pink-500 text-2xl" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">

                  <button
                    onClick={() =>
                      markAttendance(
                        s.id,
                        "present"
                      )
                    }
                    className="bg-green-600 hover:scale-105 transition-all py-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold"
                  >
                    <FaUserCheck />
                    <span className="text-xs">
                      Present
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(
                        s.id,
                        "halfday"
                      )
                    }
                    className="bg-yellow-500 hover:scale-105 transition-all py-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold text-black"
                  >
                    <FaClock />
                    <span className="text-xs">
                      Half
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(
                        s.id,
                        "absent"
                      )
                    }
                    className="bg-red-600 hover:scale-105 transition-all py-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-semibold"
                  >
                    <FaUserTimes />
                    <span className="text-xs">
                      Absent
                    </span>
                  </button>
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* CHART */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-6 shadow-2xl mb-10">

          <div className="flex items-center gap-3 mb-6">
            <FaCalendarAlt className="text-pink-500 text-2xl" />

            <h2 className="text-2xl font-bold">
              Monthly Analytics
            </h2>
          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />

              <XAxis
                dataKey="name"
                stroke="#aaa"
              />

              <YAxis stroke="#aaa" />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="present"
                fill="#22c55e"
                radius={[
                  8, 8, 0, 0,
                ]}
              />

              <Bar
                dataKey="halfday"
                fill="#eab308"
                radius={[
                  8, 8, 0, 0,
                ]}
              />

              <Bar
                dataKey="absent"
                fill="#ef4444"
                radius={[
                  8, 8, 0, 0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CALENDAR */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-4 shadow-2xl mb-10">

          <div className="flex items-center gap-3 mb-6">
            <FaCalendarAlt className="text-pink-500 text-2xl" />

            <h2 className="text-2xl font-bold">
              Attendance Calendar
            </h2>
          </div>

          {/* DAYS HEADER */}
          <div
            className="grid gap-1 mb-2"
            style={{
              gridTemplateColumns: `120px repeat(${calendarDays.length}, minmax(0,1fr))`,
            }}
          >
            <div className="font-bold text-gray-300 text-sm">
              Staff
            </div>

            {calendarDays.map(
              (day) => (
                <div
                  key={day}
                  className="text-center text-[9px] md:text-[10px] text-gray-400"
                >
                  {
                    day.split(
                      "-"
                    )[2]
                  }
                </div>
              )
            )}
          </div>

          {/* STAFF ROWS */}
          <div className="space-y-1">

            {staff.map((s) => (
              <div
                key={s.id}
                className="grid gap-1 items-center"
                style={{
                  gridTemplateColumns: `120px repeat(${calendarDays.length}, minmax(0,1fr))`,
                }}
              >
                <div className="truncate text-xs md:text-sm font-semibold">
                  {s.name}
                </div>

                {calendarDays.map(
                  (day) => {
                    const status =
                      getAttendanceStatus(
                        s.id,
                        day
                      );

                    return (
                      <div
                        key={`${s.id}-${day}`}
                        className={`w-full aspect-square rounded-sm ${
                          status ===
                          "present"
                            ? "bg-green-500"
                            : status ===
                              "halfday"
                            ? "bg-yellow-400"
                            : status ===
                              "absent"
                            ? "bg-red-500"
                            : "bg-white/10 border border-white/5"
                        }`}
                      ></div>
                    );
                  }
                )}
              </div>
            ))}
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap gap-5 mt-6 text-sm">

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Present
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              Half Day
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              Absent
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/10 rounded"></div>
              Not Marked
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-6 shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Attendance History
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Loading...
            </div>
          ) : filteredAttendance.length ===
            0 ? (
            <div className="text-center py-10 text-gray-400">
              No records found
            </div>
          ) : (
            <div className="space-y-4">

              {filteredAttendance.map(
                (
                  a,
                  index
                ) => (
                  <motion.div
                    key={a.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.03,
                    }}
                    className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-bold">
                        {
                          a.staff_name
                        }
                      </h3>

                      <p className="text-gray-400 mt-1">
                        {a.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <span
                        className={`px-4 py-2 rounded-full font-semibold capitalize ${
                          a.status ===
                          "present"
                            ? "bg-green-500/20 text-green-400"
                            : a.status ===
                              "halfday"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {
                          a.status
                        }
                      </span>

                      <button
                        onClick={() =>
                          deleteAttendance(
                            a.id
                          )
                        }
                        className="bg-red-600 hover:scale-105 transition px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;