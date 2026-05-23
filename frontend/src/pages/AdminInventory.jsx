import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import { motion } from "framer-motion";

import {
  FaBoxOpen,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaRupeeSign,
} from "react-icons/fa";

function AdminInventory() {
  const [items, setItems] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      quantity: "",
      price: "",
      low_stock_threshold: 3,
    });

  const fetchItems =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            "inventory/"
          );

        setItems(res.data);
      } catch (error) {
        console.error(
          "Fetch error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd =
    async () => {
      try {
        await axiosInstance.post(
          "inventory/",
          form
        );

        resetForm();
        fetchItems();
      } catch (error) {
        console.error(
          "Add error:",
          error.response?.data
        );
      }
    };

  const handleDelete =
    async (id) => {
      try {
        await axiosInstance.delete(
          `inventory/${id}/`
        );

        fetchItems();
      } catch (error) {
        console.log(
          "DELETE ERROR:",
          error.response?.data
        );

        alert(
          "Delete failed ❌"
        );
      }
    };

  const handleEdit = (
    item
  ) => {
    setForm({
      name: item.name,
      quantity:
        item.quantity,
      price: item.price,
      low_stock_threshold:
        item.low_stock_threshold,
    });

    setEditingId(item.id);
  };

  const handleUpdate =
    async () => {
      try {
        await axiosInstance.put(
          `inventory/${editingId}/`,
          form
        );

        resetForm();
        fetchItems();
      } catch (error) {
        console.error(
          "Update error:",
          error.response?.data
        );
      }
    };

  const resetForm = () => {
    setForm({
      name: "",
      quantity: "",
      price: "",
      low_stock_threshold: 3,
    });

    setEditingId(null);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* GLOW BACKGROUND */}
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
          className="flex flex-wrap justify-between items-center gap-4 mb-10"
        >

          <div>
            <h1 className="text-5xl font-black">
              Inventory{" "}

              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <p className="text-gray-400 mt-2 text-lg">
              Manage salon
              products &
              stock levels
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl flex items-center gap-4">

            <div className="bg-pink-500/20 p-4 rounded-2xl">
              <FaBoxOpen className="text-pink-500 text-3xl" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Total Items
              </p>

              <h2 className="text-3xl font-black">
                {items.length}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* FORM */}
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
            {editingId
              ? "Update Item"
              : "Add New Item"}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            <input
              value={form.name}
              placeholder="Item Name"
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
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
              value={form.quantity}
              type="number"
              placeholder="Quantity"
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity:
                    e.target
                      .value,
                })
              }
            />

            <input
              value={form.price}
              type="number"
              placeholder="Price"
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              onChange={(e) =>
                setForm({
                  ...form,
                  price:
                    e.target
                      .value,
                })
              }
            />

            <input
              value={
                form.low_stock_threshold
              }
              type="number"
              placeholder="Low Stock"
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
              onChange={(e) =>
                setForm({
                  ...form,
                  low_stock_threshold:
                    e.target
                      .value,
                })
              }
            />
          </div>

          <div className="flex gap-4 mt-8 flex-wrap">

            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={
                editingId
                  ? handleUpdate
                  : handleAdd
              }
              className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg
              
              ${
                editingId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gradient-to-r from-pink-500 to-purple-600"
              }
              `}
            >

              <FaPlus />

              {editingId
                ? "Update Item"
                : "Add Item"}
            </motion.button>

            {editingId && (
              <motion.button
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  resetForm
                }
                className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
              >
                <FaTimes />
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-2xl">
            No inventory items
            found ❌
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {items.map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={item.id}
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
                  className={`rounded-[35px] p-7 backdrop-blur-2xl border shadow-2xl transition-all
                  
                  ${
                    item.quantity <=
                    item.low_stock_threshold
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-white/[0.04] border-white/10"
                  }
                  `}
                >

                  <div className="flex justify-between items-start gap-4">

                    <div>
                      <h2 className="text-3xl font-black">
                        {
                          item.name
                        }
                      </h2>

                      <p className="text-gray-400 mt-2">
                        Inventory
                        Product
                      </p>
                    </div>

                    <div className="bg-pink-500/20 p-4 rounded-2xl">
                      <FaBoxOpen className="text-pink-500 text-2xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">

                      <p className="text-gray-400 text-sm">
                        Quantity
                      </p>

                      <h3 className="text-4xl font-black mt-2">
                        {
                          item.quantity
                        }
                      </h3>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">

                      <p className="text-gray-400 text-sm">
                        Price
                      </p>

                      <h3 className="text-4xl font-black mt-2 flex items-center">
                        <FaRupeeSign className="text-2xl" />

                        {
                          item.price
                        }
                      </h3>
                    </div>
                  </div>

                  {/* LOW STOCK */}
                  {item.quantity <=
                    item.low_stock_threshold && (
                    <div className="mt-6 bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold">

                      <FaExclamationTriangle />

                      Low Stock
                      Warning
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">

                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() =>
                        handleEdit(
                          item
                        )
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
                    >
                      <FaEdit />
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
                    >
                      <FaTrash />
                      Delete
                    </motion.button>
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

export default AdminInventory;