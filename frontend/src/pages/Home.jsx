import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Sparkles,
  ArrowRight,
  Star,
  Clock3,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import { FaSpa, FaCut, FaInstagram } from "react-icons/fa";
import { GiLipstick } from "react-icons/gi";
import { MdFaceRetouchingNatural } from "react-icons/md";

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/gallery/`)
      .then((res) => setGallery(res.data))
      .catch((err) => console.log(err));
  }, []);

  const services = [
    {
      icon: <FaSpa size={28} />,
      title: "Luxury Spa",
      desc: "Relaxing skincare & premium glow treatments.",
    },
    {
      icon: <FaCut size={28} />,
      title: "Hair Styling",
      desc: "Modern cuts, styling & hair transformations.",
    },
    {
      icon: <GiLipstick size={28} />,
      title: "Nail Art",
      desc: "Elegant manicure & modern nail aesthetics.",
    },
    {
      icon: <MdFaceRetouchingNatural size={28} />,
      title: "Makeup",
      desc: "Bridal & celebrity makeup experiences.",
    },
  ];

  return (
    <div className="bg-[#050505] text-white overflow-hidden">
      <Navbar />

      <section className="relative min-h-screen flex items-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
          alt="Salon"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />


        <div className="absolute inset-0 bg-black/70" />


        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full">

              <Sparkles size={15} className="text-pink-300" />

              <span className="uppercase tracking-[4px] text-xs text-white/80">
                Luxury Salon Experience
              </span>

            </div>

            <h1 className="mt-8 text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">

              Beauty
              <span className="block text-pink-400">
                Refined.
              </span>

            </h1>

            <p className="mt-8 text-lg md:text-2xl text-white/60 max-w-2xl leading-relaxed">
              Premium beauty experiences designed with elegance,
              confidence and modern luxury aesthetics.
            </p>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-5 mt-12">

              <button
                onClick={() => navigate("/services")}
                className="bg-pink-500 hover:bg-pink-600 transition px-8 py-4 rounded-full text-lg font-medium flex items-center gap-3"
              >

                Book Appointment

                <ArrowRight size={18} />

              </button>

              <button
                onClick={() => navigate("/gallery")}
                className="border border-white/10 bg-white/10 backdrop-blur-xl hover:bg-white/15 transition px-8 py-4 rounded-full"
              >
                Explore Gallery
              </button>

            </div>

            <div className="flex flex-wrap gap-10 mt-20">

              {[
                ["10K+", "Happy Clients"],
                ["15+", "Expert Team"],
                ["50+", "Premium Services"],
              ].map((item, i) => (
                <div key={i}>

                  <h2 className="text-4xl font-bold text-pink-300">
                    {item[0]}
                  </h2>

                  <p className="text-white/50 mt-2">
                    {item[1]}
                  </p>

                </div>
              ))}

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >

            <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />

            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
              alt="Beauty"
              className="relative rounded-3xl h-[700px] w-full object-cover border border-white/10"
            />

            <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                  <Star className="text-pink-300 fill-pink-300" />
                </div>

                <div>

                  <h3 className="text-2xl font-bold">
                    4.9
                  </h3>

                  <p className="text-white/60 text-sm">
                    Client Satisfaction
                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      <section className="py-32 px-6 bg-[#080808]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="uppercase tracking-[4px] text-sm text-pink-300">
              Our Services
            </p>

            <h2 className="text-5xl md:text-7xl font-black mt-6 leading-tight">

              Crafted For
              <span className="block text-white/40">
                Luxury & Elegance
              </span>

            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

            {services.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition duration-500"
              >

                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-semibold mt-8">
                  {item.title}
                </h3>

                <p className="text-white/50 mt-4 leading-relaxed">
                  {item.desc}
                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      <section className="py-32 px-6">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl"
          >

            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
              alt="Salon"
              className="w-full h-[750px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          </motion.div>

          <div>

            <p className="uppercase tracking-[4px] text-sm text-pink-300">
              Why Choose Us
            </p>

            <h2 className="text-5xl md:text-7xl font-black mt-6 leading-[0.95]">

              Timeless
              <span className="block text-white/40">
                Beauty Experience
              </span>

            </h2>

            <p className="text-white/55 text-xl leading-relaxed mt-10 max-w-xl">
              Every detail is designed with intention — from luxury
              ambience to expert beauty experiences.
            </p>

            <div className="space-y-6 mt-14">

              <motion.div
                whileHover={{ x: 8 }}
                className="flex gap-5 border border-white/10 bg-white/5 rounded-3xl p-6"
              >

                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300">
                  <Clock3 size={22} />
                </div>

                <div>

                  <h4 className="text-2xl font-semibold">
                    Fast Professional Service
                  </h4>

                  <p className="text-white/50 mt-2">
                    Premium care by expert stylists.
                  </p>

                </div>

              </motion.div>

              <motion.div
                whileHover={{ x: 8 }}
                className="flex gap-5 border border-white/10 bg-white/5 rounded-3xl p-6"
              >

                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300">
                  <ShieldCheck size={22} />
                </div>

                <div>

                  <h4 className="text-2xl font-semibold">
                    Luxury Products
                  </h4>

                  <p className="text-white/50 mt-2">
                    Only premium international beauty brands.
                  </p>

                </div>

              </motion.div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-32 px-6 bg-[#080808]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="uppercase tracking-[4px] text-sm text-pink-300">
              Gallery
            </p>

            <h2 className="text-5xl md:text-7xl font-black mt-6">

              Recent
              <span className="block text-white/40">
                Transformations
              </span>

            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {gallery.slice(0, 6).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10"
              >

                {item.media_type === "image" ? (
                  <img
                    src={`${BASE_URL}${item.file}`}
                    alt="Gallery"
                    className="w-full h-[450px] object-cover group-hover:scale-110 transition duration-700"
                  />
                ) : (
                  <video
                    src={`${BASE_URL}${item.file}`}
                    className="w-full h-[450px] object-cover"
                    autoPlay
                    muted
                    loop
                  />
                )}

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-500" />

              </motion.div>
            ))}

          </div>

        </div>

      </section>


      <footer className="relative border-t border-white/10 bg-[#050505] overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14">

            <div>

              <h2 className="text-4xl font-black tracking-tight">

                ＲＩ𝕍Λ 
                <span className="text-pink-400">
                  .
                </span>

              </h2>

              <p className="text-white/50 leading-relaxed mt-6">

                Premium beauty salon crafted with luxury,
                elegance and modern aesthetics for timeless beauty experiences.

              </p>

            </div>

            <div>

              <h3 className="text-xl font-semibold mb-6">
                Contact Us
              </h3>

              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone size={18} className="text-pink-300" />
                  </div>

                  <div>

                    <p className="text-white/40 text-sm">
                      Phone
                    </p>

                    <p className="text-white/80">
                      +91 98765 43210
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail size={18} className="text-pink-300" />
                  </div>

                  <div>

                    <p className="text-white/40 text-sm">
                      Email
                    </p>

                    <p className="text-white/80">
                      rivasalon@gmail.com
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin size={18} className="text-pink-300" />
                  </div>

                  <div>

                    <p className="text-white/40 text-sm">
                      Location
                    </p>

                    <p className="text-white/80">
                      Lucknow, India
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div>

              <h3 className="text-xl font-semibold mb-6">
                Quick Links
              </h3>

              <div className="flex flex-col gap-4">

                <button
                  onClick={() => navigate("/")}
                  className="text-left text-white/60 hover:text-pink-300 transition"
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("/services")}
                  className="text-left text-white/60 hover:text-pink-300 transition"
                >
                  Services
                </button>

                <button
                  onClick={() => navigate("/gallery")}
                  className="text-left text-white/60 hover:text-pink-300 transition"
                >
                  Gallery
                </button>

              </div>

            </div>

            <div>

              <h3 className="text-xl font-semibold mb-6">
                Connect With Us
              </h3>

              <p className="text-white/50 leading-relaxed">

                Follow us on Instagram for latest beauty transformations,
                salon updates and luxury experiences.

              </p>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:scale-105 transition duration-300 px-6 py-4 rounded-2xl font-medium"
              >

                <FaInstagram size={20} />

                Instagram

              </a>

            </div>

          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">

            <p className="text-white/40 text-sm">
              © 2026 RIVA Salon. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-white/40">

              <span className="hover:text-pink-300 transition cursor-pointer">
                Privacy Policy
              </span>

              <span className="hover:text-pink-300 transition cursor-pointer">
                Terms & Conditions
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}