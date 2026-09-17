
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Hero from "../components/Hero.jsx";

/* =========================================================
   ANIMATION SYSTEM
========================================================= */

const ease = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -60,
    rotate: -1.5,
  },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 60,
    rotate: 1.5,
  },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const sideVariant = (idx) =>
  idx % 2 === 0 ? fadeLeft : fadeRight;

const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

/* =========================================================
   ICONS
========================================================= */

const TruckIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    {...props}
  >
    <path d="M3 7h11v8H3z" />
    <path d="M14 10h3.5L20 12.5V15h-6z" />
    <circle cx="7" cy="17" r="1.6" />
    <circle cx="17" cy="17" r="1.6" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    {...props}
  >
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const BanknoteIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    {...props}
  >
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7 9v.01M17 15v.01" />
  </svg>
);

const ArrowIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

/* =========================================================
   DATA
========================================================= */

const trustItems = [
  {
    icon: TruckIcon,
    title: "Nationwide Delivery",
    desc: "Dispatched within 24–48 hours",
  },
  {
    icon: BanknoteIcon,
    title: "Cash on Delivery",
    desc: "Pay only when it arrives",
  },
  {
    icon: ShieldIcon,
    title: "100% Authentic",
    desc: "Every bottle sealed & verified",
  },
];

const categoryShowcase = [
  {
    label: "For Him",
    value: "male",
    note: "Bold, woody, intense",
  },
  {
    label: "For Her",
    value: "female",
    note: "Floral, warm, elegant",
  },
  {
    label: "Unisex",
    value: "unisex",
    note: "Balanced, versatile",
  },
];

/* =========================================================
   ANIMATED PRODUCT WRAPPER
========================================================= */

const AnimatedProductCard = ({ product, idx, reduceMotion }) => {
  return (
    <motion.div
      variants={sideVariant(idx)}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -10,
              scale: 1.018,
              transition: {
                type: "spring",
                stiffness: 280,
                damping: 22,
                mass: 0.7,
              },
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.985,
            }
      }
      className="relative group"
    >
      {/* Soft hover glow */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-2 rounded-[28px] bg-[#D8C7B8]/0 blur-xl pointer-events-none"
        whileHover={
          reduceMotion
            ? undefined
            : {
                backgroundColor: "rgba(216, 199, 184, 0.18)",
                transition: {
                  duration: 0.45,
                },
              }
        }
      />

      <div className="relative">
        <ProductCard product={product} />
      </div>
    </motion.div>
  );
};

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#211E1C] text-[#F7F3EE]">
      {/* Ambient decoration */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full bg-[#C7B5A5]/10 blur-[100px]"
      />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.15 }}
        className="absolute -bottom-48 -left-40 w-[420px] h-[420px] rounded-full bg-[#C7B5A5]/5 blur-[110px]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Newsletter / CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          className="py-20 border-b border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#BDAE9F]">
                Stay in the scent
              </span>

              <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">
                Discover your
                <br />
                signature fragrance.
              </h2>
            </div>

            <div className="lg:justify-self-end max-w-md w-full">
              <p className="text-sm text-white/55 leading-relaxed mb-6">
                Explore new compositions, exclusive collections and
                carefully selected fragrances.
              </p>

              <Link
                to="/?category=unisex"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#F7F3EE]"
              >
                Explore Collection

                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 transition-all duration-500 group-hover:bg-white group-hover:text-[#211E1C] group-hover:border-white group-hover:translate-x-1">
                  <ArrowIcon className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={gridContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16"
        >
          {/* Brand */}
          <motion.div variants={fadeUp}>
            <h3 className="font-serif text-3xl tracking-wide">
              Manzil
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-white/45 max-w-xs">
              Fragrance crafted for presence, memory and everyday
              moments worth remembering.
            </p>
          </motion.div>

          {/* Shop */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#BDAE9F] mb-5">
              Shop
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/55">
              <Link
                to="/?category=male"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                For Him
              </Link>

              <Link
                to="/?category=female"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                For Her
              </Link>

              <Link
                to="/?category=unisex"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                Unisex
              </Link>

              <Link
                to="/"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                All Fragrances
              </Link>
            </div>
          </motion.div>

          {/* Information */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#BDAE9F] mb-5">
              Information
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/55">
              <Link
                to="/about"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                Contact
              </Link>

              <Link
                to="/shipping"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                Shipping
              </Link>

              <Link
                to="/privacy"
                className="w-fit hover:text-white transition-colors duration-300"
              >
                Privacy
              </Link>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#BDAE9F] mb-5">
              Contact
            </h4>

            <div className="space-y-3 text-sm text-white/55">
              <p>Pakistan</p>

              <p>
                Nationwide delivery
                <br />
                available.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} Manzil. All rights reserved.
          </p>

          <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
            Crafted with intention.
          </p>
        </div>
      </div>
    </footer>
  );
};

/* =========================================================
   PAGE
========================================================= */

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"],
  });

  const watermarkY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 160]
  );

  const watermarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.35],
    reduceMotion ? [0.035, 0.035] : [0.035, 0]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/products", {
          params: { category },
        });

        const items = data.data || [];

        setProducts(items);
        setBestSellers(items.slice(0, 4));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load collection"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FBF9F5] text-[#2C2A29] relative overflow-hidden selection:bg-[#E5DDD0] selection:text-[#1A1817]"
    >
      {/* =====================================================
          AMBIENT BRAND WATERMARK
      ===================================================== */}

      <motion.div
        style={{
          y: watermarkY,
          opacity: watermarkOpacity,
        }}
        aria-hidden="true"
        className="absolute top-40 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none select-none z-0 flex items-center justify-center blur-[80px]"
      >
        <span className="font-serif text-[18vw] tracking-widest uppercase font-bold text-[#1A1817]">
          Manzil
        </span>
      </motion.div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative z-10">
        <Hero />
      </div>

      {/* =====================================================
          CATEGORY SHOWCASE
      ===================================================== */}

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={gridContainer}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {categoryShowcase.map((cat, idx) => (
          <motion.div
            key={cat.value}
            variants={sideVariant(idx)}
          >
            <Link
              to={`/?category=${cat.value}`}
              className="group relative block overflow-hidden rounded-2xl border border-[#EFECE6] bg-[#F4EFEA]/60 px-8 py-11 text-center transition-all duration-700 ease-out hover:bg-[#F4EFEA] hover:border-[#DED5CB] hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(44,42,41,0.08)]"
            >
              {/* Decorative corner */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#D4C5B9]/0 group-hover:border-[#D4C5B9] transition-all duration-700"
              />

              {/* Number */}
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#B0A49B] mb-5 transition-transform duration-500 group-hover:-translate-y-1">
                0{idx + 1}
              </span>

              <h3 className="font-serif text-2xl text-[#1A1817] transition-transform duration-500 group-hover:-translate-y-1">
                {cat.label}
              </h3>

              <p className="text-sm text-[#8C827A] mt-2">
                {cat.note}
              </p>

              <span className="inline-flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.25em] text-[#6E655D] border-b border-[#D4C5B9] pb-1 transition-all duration-500 group-hover:text-[#1A1817] group-hover:border-[#1A1817] group-hover:gap-3">
                Explore
                <ArrowIcon className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      {!category && !loading && bestSellers.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={fadeUp}
          className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-16 border-b border-[#EFECE6]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#8C827A] font-medium block mb-3">
                Signature Collection
              </span>

              <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-[#1A1817]">
                The Best Sellers
              </h2>
            </div>

            <p className="text-sm text-[#6E655D] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Timeless compositions meticulously blended with rare
              ouds, exotic florals, and warm ambers.
            </p>
          </div>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {bestSellers.map((product, idx) => (
              <AnimatedProductCard
                key={`bestseller-${product._id || idx}`}
                product={product}
                idx={idx}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* =====================================================
          TRUST STRIP
      ===================================================== */}

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        variants={gridContainer}
        className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-[#EFECE6]"
      >
        {trustItems.map((t, idx) => {
          const Icon = t.icon;

          return (
            <motion.div
              key={t.title}
              variants={sideVariant(idx)}
              className="group flex items-center gap-4"
            >
              <motion.span
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        scale: 1.08,
                        rotate: 3,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
                className="w-12 h-12 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8C827A] shrink-0 transition-colors duration-500 group-hover:bg-[#EDE4DB] group-hover:text-[#5C534D]"
              >
                <Icon className="w-5 h-5" />
              </motion.span>

              <div>
                <p className="font-medium text-[#1A1817] text-sm">
                  {t.title}
                </p>

                <p className="text-xs text-[#8C827A] mt-0.5">
                  {t.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* =====================================================
          MAIN SHOP
      ===================================================== */}

      <section
        id="shop"
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#8C827A] font-medium block mb-3">
              Catalog
            </span>

            <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-[#1A1817] capitalize">
              {category
                ? `${category} Fragrances`
                : "All Compositions"}
            </h1>
          </div>

          <p className="text-sm text-[#6E655D] mt-3 md:mt-0">
            Showing {products.length} artisanal fragrance
            {products.length === 1 ? "" : "s"}
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-5"
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border border-[#D4C5B9]" />

              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        rotate: 360,
                      }
                }
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2C2A29]"
              />
            </div>

            <motion.p
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.45, 1, 0.45],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="text-sm tracking-widest uppercase text-[#8C827A]"
            >
              Curating experience...
            </motion.p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-[#F8D7DA]/30 border border-[#F5C6CB] text-[#721C24] p-6 rounded-xl text-center max-w-lg mx-auto my-12"
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease,
            }}
            className="text-center py-28 bg-[#F4EFEA]/50 rounded-2xl border border-[#EBE5DE]"
          >
            <p className="text-lg font-serif text-[#5C534D] mb-2">
              No fragrances found
            </p>

            <p className="text-sm text-[#8C827A]">
              Explore other olfactory profiles or add items from
              the admin panel.
            </p>
          </motion.div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.05,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product, idx) => (
              <AnimatedProductCard
                key={product._id}
                product={product}
                idx={idx}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
};

export default Home;