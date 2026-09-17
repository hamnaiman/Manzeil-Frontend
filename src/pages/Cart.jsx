import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#faf7f2] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#f0ebe3] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-[#a8895f]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-light tracking-wide text-neutral-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            Discover our signature scents and find your perfect fragrance.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full text-sm tracking-wide hover:bg-neutral-800 transition-all duration-300 hover:gap-3"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs tracking-[0.2em] text-[#a8895f] uppercase mb-1">
            Shopping Bag
          </p>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-neutral-900">
            Your Cart{" "}
            <span className="text-neutral-400 text-lg sm:text-xl">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          {cartItems.map((item, idx) => (
            <div
              key={item.product}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 transition-colors duration-300 hover:bg-[#fdfcfa] ${
                idx !== cartItems.length - 1 ? "border-b border-neutral-100" : ""
              }`}
            >
              {/* Image + Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5f1ea]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900 text-sm sm:text-base truncate">
                    {item.name}
                  </p>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Rs. {item.price.toLocaleString()} each
                  </p>
                  {/* Mobile-only subtotal */}
                  <p className="sm:hidden text-sm font-medium text-neutral-900 mt-2">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quantity + Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-shrink-0">
                <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.product, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-neutral-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Desktop-only subtotal */}
                <span className="hidden sm:block w-24 text-right text-sm font-medium text-neutral-900">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-neutral-400 hover:text-red-500 transition-colors duration-200 p-1"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 sm:p-7">
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-500 text-sm">Subtotal</span>
            <span className="text-neutral-900 font-medium text-sm">
              Rs. {cartTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-5">
            Shipping & taxes calculated at checkout
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-neutral-100">
            <span className="text-lg sm:text-xl font-light tracking-wide text-neutral-900">
              Total:{" "}
              <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
            </span>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-neutral-900 text-white px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-neutral-800 transition-all duration-300"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block mt-6 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;