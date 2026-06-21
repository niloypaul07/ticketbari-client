"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button, Chip } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import TicketCard from "@/components/TicketCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MdDirectionsBus, MdTrain, MdFlight, MdSecurity } from "react-icons/md";
import { GiSpeedBoat } from "react-icons/gi";
import { FaStar, FaHeadset, FaBolt } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";

const heroSlides = [
  {
    title: "Travel Smarter,\nBook Faster",
    subtitle: "Bangladesh's most trusted ticket booking platform. Bus, Train, Launch & Flight — all in one place.",
    bg: "from-brand-700 via-brand-900 to-gray-950",
    accent: "from-brand-400 to-purple-400",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
  },
  {
    title: "Every Journey\nBegins Here",
    subtitle: "Discover thousands of routes with the best prices and instant confirmation.",
    bg: "from-purple-800 via-purple-950 to-gray-950",
    accent: "from-purple-400 to-pink-400",
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80",
  },
  {
    title: "Fly High,\nBook Low",
    subtitle: "Compare flight, train and bus fares to find the perfect deal for every trip.",
    bg: "from-teal-700 via-teal-900 to-gray-950",
    accent: "from-teal-400 to-cyan-400",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  },
];

const whyUs = [
  { icon: <FaBolt size={28} />, title: "Instant Booking", desc: "Confirm your seat in seconds with real-time availability." },
  { icon: <MdSecurity size={28} />, title: "100% Secure", desc: "End-to-end encrypted payments powered by Stripe." },
  { icon: <FaStar size={28} />, title: "Best Prices", desc: "No hidden fees. What you see is what you pay." },
  { icon: <FaHeadset size={28} />, title: "24/7 Support", desc: "Our support team is always ready to help you." },
];

const popularRoutes = [
  { from: "Dhaka", to: "Chittagong", types: ["Bus", "Train"], price: 350 },
  { from: "Dhaka", to: "Sylhet", types: ["Bus", "Train"], price: 420 },
  { from: "Dhaka", to: "Cox's Bazar", types: ["Bus", "Plane"], price: 680 },
  { from: "Dhaka", to: "Khulna", types: ["Bus", "Launch"], price: 300 },
  { from: "Dhaka", to: "Rajshahi", types: ["Bus", "Train"], price: 380 },
  { from: "Chittagong", to: "Cox's Bazar", types: ["Bus"], price: 220 },
];

const routeChipColors = { Bus: "success", Train: "primary", Launch: "secondary", Plane: "warning" };

export default function HomePage() {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/advertised`)
      .then(r => setAdvertised(r.data))
      .finally(() => setLoadingAds(false));

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/latest`)
      .then(r => setLatest(r.data))
      .finally(() => setLoadingLatest(false));
  }, []);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden bg-zinc-950">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop
          className="hero-swiper w-full"
          style={{ height: "calc(100dvh - 4.5rem)", minHeight: "520px" }}
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i} className="!h-full" style={{ height: "100%" }}>
              <div className={`relative w-full h-full min-h-[520px] bg-gradient-to-br ${slide.bg} flex flex-col justify-end sm:justify-center`}>
                {/* Background image overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${slide.img})` }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pb-20 sm:pb-12 pt-6 sm:pt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl"
                  >
                    <h1 className={`text-3xl sm:text-5xl md:text-7xl font-black leading-tight mb-3 sm:mb-4 whitespace-pre-line bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-200 mb-5 sm:mb-8 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                      <Button
                        as={Link}
                        href="/tickets"
                        size="lg"
                        className={`bg-gradient-to-r ${slide.accent} text-white font-bold shadow-xl w-full sm:w-auto sm:px-8`}
                        endContent={<HiArrowRight />}
                      >
                        Explore Tickets
                      </Button>
                      <Button
                        as={Link}
                        href="/register"
                        size="lg"
                        variant="bordered"
                        className="border-white/50 text-white font-semibold w-full sm:w-auto"
                      >
                        Get Started Free
                      </Button>
                    </div>

                    {/* Transport mode pills */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-10">
                      {[
                        { label: "Bus", icon: <MdDirectionsBus size={16} />, color: "bg-green-500/20 text-green-300" },
                        { label: "Train", icon: <MdTrain size={16} />, color: "bg-blue-500/20 text-blue-300" },
                        { label: "Launch", icon: <GiSpeedBoat size={16} />, color: "bg-cyan-500/20 text-cyan-300" },
                        { label: "Plane", icon: <MdFlight size={16} />, color: "bg-purple-500/20 text-purple-300" },
                      ].map((m) => (
                        <span
                          key={m.label}
                          className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${m.color} border border-white/10 backdrop-blur-sm`}
                        >
                          {m.icon} {m.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── Advertisement Section ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="section-title">
          🌟 <span className="gradient-text">Featured Tickets</span>
        </h2>
        <p className="section-subtitle">Handpicked offers by our team — grab them before they're gone!</p>

        {loadingAds ? (
          <LoadingSpinner label="Loading featured tickets..." />
        ) : advertised.length === 0 ? (
          <p className="text-center text-default-400 py-16">No featured tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertised.map((t) => <TicketCard key={t._id} ticket={t} />)}
          </div>
        )}
      </section>

      {/* ── Latest Tickets ── */}
      <section className="bg-default-50 dark:bg-default-50/5 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">
            🚀 <span className="gradient-text">Latest Tickets</span>
          </h2>
          <p className="section-subtitle">Fresh routes just added — be the first to book!</p>

          {loadingLatest ? (
            <LoadingSpinner label="Loading latest tickets..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((t) => <TicketCard key={t._id} ticket={t} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              as={Link}
              href="/tickets"
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold px-10 shadow-lg"
              endContent={<HiArrowRight />}
            >
              View All Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="section-title">
          💡 Why Choose <span className="gradient-text">TicketBari?</span>
        </h2>
        <p className="section-subtitle">We make travel planning effortless, affordable, and stress-free.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item) => (
            <div
              key={item.title}
              className="text-center p-6 rounded-2xl border border-default-100 dark:border-default-50 hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-default-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Routes ── */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-purple-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-white">
            🗺️ Popular Routes
          </h2>
          <p className="section-subtitle text-gray-300">Most booked routes across Bangladesh</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((r) => (
              <Link
                key={`${r.from}-${r.to}`}
                href={`/tickets?from=${r.from}&to=${r.to}`}
                className="glass-card p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white text-lg">
                    {r.from} <span className="text-brand-400">→</span> {r.to}
                  </div>
                  <span className="text-brand-300 font-semibold text-sm">
                    From ৳{r.price}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.types.map((t) => (
                    <Chip
                      key={t}
                      size="sm"
                      color={routeChipColors[t] || "default"}
                      variant="flat"
                      className="text-xs"
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
