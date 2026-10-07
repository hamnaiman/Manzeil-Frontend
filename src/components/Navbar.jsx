import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/manzeil-logo.png";

const navLinks = [
  { label: "Men", category: "male" },
  { label: "Women", category: "female" },
  { label: "Unisex", category: "unisex" },
];

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#EFECE6]/70 shadow-[0_12px_30px_-18px_rgba(26,24,23,0.25)]">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Left: logo */}
        <Link to="/" className="shrink-0 group">
          <img
            src={logo}
            alt="Manzeil"
            className="h-16 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.category}
              to={`/?category=${link.category}`}
              className="text-[#2C2A29] hover:text-[#1A1817] relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#1A1817] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: cart + Shop Now */}
        <div className="flex items-center gap-5">
          <Link
            to="/cart"
            className="relative text-sm font-medium text-[#2C2A29] hover:text-[#1A1817] transition-colors duration-200"
          >
            Cart
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute -top-2 -right-3 bg-[#1A1817] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          <Link
            to="/"
            className="bg-[#1A1817] text-white text-sm font-medium px-5 py-2 rounded-full shadow-[0_8px_18px_-8px_rgba(26,24,23,0.45)] transition-all duration-300 hover:bg-[#2C2A29] hover:shadow-[0_10px_22px_-6px_rgba(26,24,23,0.5)] hover:-translate-y-0.5"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;