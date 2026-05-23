import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import { motion } from "framer-motion";

import {
  FaUsers,
  FaUserTie,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

function AdminStaff() {
  const [staff, setStaff] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      role: "",
      phone: "",
      salary: "",
    });

  const fetchStaff =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            "staff/"
          );

        setStaff(res.data);
      } catch (err) {
        console.error(err);

        alert(
          "Failed to load staff ❌"
        );
      }
    };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ADD STAFF
  const handleAdd =
    async () => {
      try {
        await axiosInstance.post(
          "staff/",
          form
        );

        setForm({
          name: "",
          role: "",
          phone: "",
          salary: "",
        });

        fetchStaff();
      } catch (err) {
        console.error(err);

        alert(
          "Failed to add staff ❌"
        );
      }
    };

  const handleDelete =
    async (id) => {
      if (
        !window.confirm(
          "Delete this staff?"
        )
      )
        return;

      try {
        await axiosInstance.delete(
          `staff/${id}/`
        );

        fetchStaff();
      } catch (err) {
        console.error(err);

        alert(
          "Delete failed ❌"
        );
      }
    };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-pink-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-wrap justify-between items-center gap-5 mb-10"
        >

          <div>
            <h1 className="text-5xl font-black">
              Staff{" "}

              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <p className="text-gray-400 mt-2 text-lg">
              Manage salon staff
              & employees
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-[30px] p-6 flex items-center gap-5 shadow-2xl">

            <div className="bg-pink-500/20 p-5 rounded-2xl">
              <FaUsers className="text-4xl text-pink-500" />
            </div>

            <div>
              <p className="text-gray-400">
                Total Staff
              </p>

              <h2 className="text-4xl font-black">
                {staff.length}
              </h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl mb-10"
        >

          <h2 className="text-3xl font-bold mb-8">
            Add New Staff
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              placeholder="Staff Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target
                      .value,
                })
              }
            />

            <input
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              placeholder="Role"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role:
                    e.target
                      .value,
                })
              }
            />

            <input
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone:
                    e.target
                      .value,
                })
              }
            />

            <input
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  ...form,
                  salary:
                    e.target
                      .value,
                })
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
            onClick={handleAdd}
            className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-pink-500/20"
          >
            <FaPlus />
            Add Staff
          </motion.button>
        </motion.div>

        {staff.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-2xl">
            No staff found ❌
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {staff.map(
              (
                s,
                index
              ) => (
                <motion.div
                  key={s.id}
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
                  className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-[35px] p-7 shadow-2xl"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h2 className="text-3xl font-black">
                        {s.name}
                      </h2>

                      <div className="flex items-center gap-2 text-pink-400 mt-2">

                        <FaUserTie />

                        <p className="font-medium">
                          {s.role}
                        </p>
                      </div>
                    </div>

                    <div className="bg-pink-500/20 p-4 rounded-2xl">
                      <FaUsers className="text-2xl text-pink-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">

                      <div className="flex items-center gap-2 text-gray-400 text-sm">

                        <FaPhoneAlt />

                        <span>
                          Phone
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mt-3">
                        {s.phone}
                      </h3>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">

                      <div className="flex items-center gap-2 text-gray-400 text-sm">

                        <FaMoneyBillWave />

                        <span>
                          Salary
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mt-3 text-green-400">
                        ₹
                        {s.salary}
                      </h3>
                    </div>
                  </div>

                  {/* DELETE BUTTON */}
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={() =>
                      handleDelete(
                        s.id
                      )
                    }
                    className="mt-8 w-full bg-red-600 hover:bg-red-700 transition-all py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
                  >
                    <FaTrash />
                    Delete Staff
                  </motion.button>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStaff;