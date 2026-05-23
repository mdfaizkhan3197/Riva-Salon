import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar.jsx";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCloudUploadAlt,
  FaPlay,
  FaImages,
} from "react-icons/fa";

function Gallery() {
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");

  const BASE_URL = "https://riva-salon-backend.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.is_staff === true);
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axiosInstance.get("gallery/");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();

    formData.append("title", title || file.name);
    formData.append("media_type", mediaType);
    formData.append("file", file);

    await axiosInstance.post(
      "gallery/upload/",
      formData
    );

    setFile(null);
    setTitle("");

    fetchGallery();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete media?")) return;

    await axiosInstance.delete(`gallery/${id}/`);
    fetchGallery();
  };

  const closeViewer = () => setSelectedIndex(null);

  const next = () =>
    setSelectedIndex((prev) =>
      prev === items.length - 1 ? 0 : prev + 1
    );

  const prev = () =>
    setSelectedIndex((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
    );

  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex === null) return;

      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">

        {/* Animated Background */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full animate-pulse"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-5">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 rounded-full shadow-2xl">
                <FaImages className="text-4xl text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              Riva{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>

            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore luxury transformations, glamorous styles,
              premium salon experiences & beauty artistry.
            </p>
          </motion.div>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] p-8 shadow-[0_0_50px_rgba(236,72,153,0.15)] mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-500 p-3 rounded-2xl">
                  <FaCloudUploadAlt className="text-2xl" />
                </div>

                <h2 className="text-3xl font-bold">
                  Upload New Media
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-5">

                <select
                  value={mediaType}
                  onChange={(e) =>
                    setMediaType(e.target.value)
                  }
                  className="bg-black/40 border border-gray-700 p-4 rounded-2xl outline-none focus:border-pink-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  className="bg-black/40 border border-gray-700 p-4 rounded-2xl outline-none focus:border-pink-500"
                />

                <input
                  type="text"
                  placeholder="Media title..."
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="bg-black/40 border border-gray-700 p-4 rounded-2xl outline-none focus:border-pink-500"
                />
              </div>

              <button
                onClick={handleUpload}
                className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition px-10 py-4 rounded-2xl font-bold shadow-2xl"
              >
                Upload Media
              </button>
            </motion.div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">

            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative group overflow-hidden rounded-[30px] break-inside-avoid cursor-pointer"
                onClick={() =>
                  setSelectedIndex(index)
                }
              >

                {item.media_type === "image" ? (
                  <img
                    src={`${BASE_URL}${item.file}`}
                    alt={item.title}
                    className="w-full object-cover rounded-[30px] transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={`${BASE_URL}${item.file}`}
                      className="w-full rounded-[30px]"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 p-5 rounded-full backdrop-blur-lg">
                        <FaPlay className="text-white text-3xl" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {item.title}
                  </motion.h2>

                  <p className="text-gray-300 capitalize mt-1">
                    {item.media_type}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center"
            >

              <button
                onClick={closeViewer}
                className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-4 rounded-full"
              >
                <FaTimes className="text-2xl" />
              </button>

              <button
                onClick={prev}
                className="absolute left-6 bg-white/10 hover:bg-white/20 p-4 rounded-full"
              >
                <FaChevronLeft className="text-3xl" />
              </button>

              <button
                onClick={next}
                className="absolute right-6 bg-white/10 hover:bg-white/20 p-4 rounded-full"
              >
                <FaChevronRight className="text-3xl" />
              </button>

              <motion.div
                key={selectedIndex}
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
                transition={{ duration: 0.4 }}
                className="max-w-6xl w-full px-6"
              >
                {items[selectedIndex].media_type ===
                "image" ? (
                  <img
                    src={`${BASE_URL}${items[selectedIndex].file}`}
                    alt={
                      items[selectedIndex].title
                    }
                    className="max-h-[82vh] mx-auto rounded-[30px] shadow-[0_0_80px_rgba(236,72,153,0.25)]"
                  />
                ) : (
                  <video
                    src={`${BASE_URL}${items[selectedIndex].file}`}
                    controls
                    autoPlay
                    className="max-h-[82vh] mx-auto rounded-[30px]"
                  />
                )}

                <div className="text-center mt-6">
                  <h2 className="text-4xl font-bold">
                    {items[selectedIndex].title}
                  </h2>

                  <p className="text-gray-400 mt-2 capitalize">
                    {
                      items[selectedIndex]
                        .media_type
                    }
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Gallery;