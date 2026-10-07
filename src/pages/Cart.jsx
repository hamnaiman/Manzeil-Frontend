import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/Footer.jsx";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
      <div className="flex-1">
        {isEmpty ? (
          /* =========================================================
             EMPTY STATE
          ========================================================= */
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="min-h-[65vh] flex items-center justify-center px-6"
          >
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="w-7 h-7 text-[#8C827A]" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-serif tracking-wide text-[#1A1817] mb-2">
                Your cart is empty
              </h2>
              <p className="text-[#8C827A] text-sm mb-7 leading-relaxed">
                Discover our signature scents and find your perfect fragrance.
              </p>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 bg-[#1A1817] text-white px-6 py-3 rounded-full text-sm tracking-wide shadow-[0_8px_18px_-8px_rgba(26,24,23,0.45)] hover:bg-[#2C2A29] hover:shadow-[0_10px_22px_-6px_rgba(26,24,23,0.5)] transition-all duration-300"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* =========================================================
             CART
          ========================================================= */
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-8 sm:mb-10"
            >
              <p className="text-xs tracking-[0.3em] text-[#8C827A] uppercase font-medium mb-2">
                Shopping Bag
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif tracking-wide text-[#1A1817]">
                Your Cart{" "}
                <span className="text-[#B7AEA4] text-lg sm:text-xl font-sans">
                  ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                </span>
              </h1>
            </motion.div>

            {/* Cart Items */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={gridContainer}
              className="bg-white rounded-2xl border border-[#EFECE6] shadow-[0_1px_12px_rgba(26,24,23,0.04)] overflow-hidden"
            >
              {cartItems.map((item, idx) => (
                <motion.div
                  key={item.product}
                  variants={fadeUp}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 transition-colors duration-300 hover:bg-[#FBF9F5] ${
                    idx !== cartItems.length - 1 ? "border-b border-[#EFECE6]" : ""
                  }`}
                >
                  {/* Image + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F4EFEA]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[#1A1817] text-sm sm:text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-[#B7AEA4] text-xs sm:text-sm mt-1">
                        Rs. {item.price.toLocaleString()} each
                      </p>
                      {/* Mobile-only subtotal */}
                      <p className="sm:hidden text-sm font-medium text-[#1A1817] mt-2">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-shrink-0">
                    <div className="flex items-center border border-[#EFECE6] rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.product, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#8C827A] hover:bg-[#F4EFEA] hover:text-[#1A1817] transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-[#1A1817]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#8C827A] hover:bg-[#F4EFEA] hover:text-[#1A1817] transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Desktop-only subtotal */}
                    <span className="hidden sm:block w-24 text-right text-sm font-medium text-[#1A1817]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-[#B7AEA4] hover:text-red-500 transition-colors duration-200 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Summary */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="mt-6 sm:mt-8 bg-white rounded-2xl border border-[#EFECE6] shadow-[0_1px_12px_rgba(26,24,23,0.04)] p-5 sm:p-7"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#8C827A] text-sm">Subtotal</span>
                <span className="text-[#1A1817] font-medium text-sm">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[#B7AEA4] mb-5">
                Shipping & taxes calculated at checkout
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#EFECE6]">
                <span className="text-lg sm:text-xl font-serif tracking-wide text-[#1A1817]">
                  Total:{" "}
                  <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
                </span>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#1A1817] text-white px-7 py-3.5 rounded-full text-sm tracking-wide shadow-[0_8px_18px_-8px_rgba(26,24,23,0.45)] hover:bg-[#2C2A29] hover:shadow-[0_10px_22px_-6px_rgba(26,24,23,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>

            <Link
              to="/"
              className="inline-block mt-6 text-sm text-[#8C827A] hover:text-[#1A1817] transition-colors duration-200"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;