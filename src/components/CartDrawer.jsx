import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const CartDrawer = () => {
  const {
    cartItems,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FBF9F5] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EFECE6]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8C827A]" strokeWidth={1.5} />
                <h2 className="font-serif text-lg text-[#1A1817]">
                  Your Bag{" "}
                  <span className="text-sm text-[#8C827A]">({cartItems.length})</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0EBE3] transition-colors duration-200"
              >
                <X className="w-4 h-4 text-[#5C534D]" />
              </button>
            </div>

            {/* Items */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="w-10 h-10 text-[#D4C5B9] mb-4" strokeWidth={1.2} />
                <p className="text-[#8C827A] text-sm mb-5">Your bag is empty.</p>
                <button
                  onClick={closeCart}
                  className="text-xs tracking-widest uppercase text-[#1A1817] border-b border-[#1A1817] pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F4EFEA] flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-[#1A1817] truncate">{item.name}</p>
                      <p className="text-xs text-[#8C827A] mt-0.5">Rs. {item.price.toLocaleString()}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E5DDD0] rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center text-[#8C827A] hover:bg-[#F0EBE3] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs text-[#1A1817]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#8C827A] hover:bg-[#F0EBE3] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-[#B7AEA4] hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-[#EFECE6] px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#8C827A]">Subtotal</span>
                  <span className="font-serif text-lg text-[#1A1817]">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full bg-[#1A1817] text-white py-3.5 rounded-full text-xs tracking-widest uppercase
                             flex items-center justify-center gap-2 hover:bg-[#2C2A29] transition-all duration-300 group"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs text-[#8C827A] mt-3 hover:text-[#1A1817] transition-colors duration-200"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;