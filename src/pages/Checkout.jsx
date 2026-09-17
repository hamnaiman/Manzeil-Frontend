import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  User,
  Phone,
  Home,
  MapPin,
  ArrowRight,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ---------- Reusable Input ---------- */
const Field = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="w-4 h-4 text-[#B7AEA4] absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
    <input
      {...props}
      className="w-full bg-white border border-[#E5DDD0] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#1A1817]
                 placeholder:text-[#B7AEA4] focus:outline-none focus:ring-2 focus:ring-[#1A1817]/10
                 focus:border-[#8C827A] transition-all duration-200"
    />
  </div>
);

/* ---------- Account / Sign-in Panel ---------- */
const AccountPanel = ({ onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="border border-[#EFECE6] rounded-2xl p-5 sm:p-6 mb-6 bg-white">
        <div className="flex gap-6 mb-5 text-sm">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pb-2 tracking-wide transition-colors duration-200 border-b-2 ${
                mode === m
                  ? "text-[#1A1817] border-[#1A1817] font-medium"
                  : "text-[#B7AEA4] border-transparent hover:text-[#8C827A]"
              }`}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <Field icon={User} name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} />
          )}
          <Field icon={MapPin} type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          <Field icon={ShieldCheck} type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} />
          {mode === "register" && (
            <Field icon={Phone} name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1A1817] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full
                         hover:bg-[#2C2A29] disabled:opacity-50 transition-all duration-300"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#8C827A] hover:text-[#1A1817] underline underline-offset-4 transition-colors duration-200"
            >
              Continue as guest instead
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* ---------- Main Checkout ---------- */
const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [form, setForm] = useState({
    fullName: customer?.name || "",
    phone: customer?.phone || "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const payload = {
        orderItems: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: form,
        paymentMethod: "COD",
      };
      const { data } = await api.post("/orders", payload);
      setSuccess(data.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  /* ---------- Success State ---------- */
  if (success) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#EFECE6] p-8 sm:p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#F0F5F0] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
          </div>
          <p className="text-xs tracking-[0.3em] text-[#8C827A] uppercase mb-2">Order Confirmed</p>
          <h1 className="text-2xl font-serif text-[#1A1817] mb-3">Thank You</h1>
          <p className="text-[#6E655D] text-sm leading-relaxed mb-6">
            Order{" "}
            <span className="font-medium text-[#1A1817]">
              #{success._id.slice(-6).toUpperCase()}
            </span>{" "}
            has been placed. Pay via Cash on Delivery upon arrival.
          </p>

          <div className="bg-[#FBF9F5] rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-[#8C827A]">Total Amount</span>
            <span className="font-serif text-lg text-[#1A1817]">
              Rs. {success.totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#1A1817] text-white px-6 py-3.5 rounded-full text-xs tracking-widest uppercase
                       hover:bg-[#2C2A29] transition-all duration-300 inline-flex items-center justify-center gap-2 group"
          >
            Continue Shopping
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ---------- Empty Cart ---------- */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FBF9F5] flex items-center justify-center px-6">
        <p className="text-[#8C827A] text-sm">Your cart is empty.</p>
      </div>
    );
  }

  /* ---------- Main Layout ---------- */
  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8 sm:mb-10">
          <p className="text-xs tracking-[0.3em] text-[#8C827A] uppercase mb-1">Cash on Delivery</p>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1A1817]">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Account + Shipping Form */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#EFECE6] p-5 sm:p-8"
          >
            {/* Account status / sign-in toggle */}
            {customer ? (
              <div className="flex items-center justify-between bg-[#FBF9F5] border border-[#EFECE6] rounded-xl px-4 py-3 mb-6 text-sm">
                <span className="text-[#5C534D]">
                  Signed in as <strong className="text-[#1A1817]">{customer.name}</strong>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-[#8C827A] hover:text-[#1A1817] transition-colors duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            ) : (
              <div className="mb-2">
                <button
                  onClick={() => setShowAccountPanel((v) => !v)}
                  className="flex items-center gap-1.5 text-sm text-[#5C534D] hover:text-[#1A1817] transition-colors duration-200 mb-2"
                >
                  Have an account? Sign in{" "}
                  <span className="text-[#B7AEA4]">(optional — guest checkout works too)</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      showAccountPanel ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {showAccountPanel && <AccountPanel onClose={() => setShowAccountPanel(false)} />}
                </AnimatePresence>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6 mt-2">
              <Home className="w-4 h-4 text-[#8C827A]" strokeWidth={1.5} />
              <h2 className="text-sm font-medium tracking-widest text-[#5C534D] uppercase">
                Shipping Details
              </h2>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field icon={User} name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} />
              <Field icon={Phone} name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange} />
              <Field icon={Home} name="address" placeholder="Street Address" required value={form.address} onChange={handleChange} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={MapPin} name="city" placeholder="City" required value={form.city} onChange={handleChange} />
                <Field icon={MapPin} name="postalCode" placeholder="Postal Code (optional)" value={form.postalCode} onChange={handleChange} />
              </div>

              <button
                type="submit"
                disabled={placing}
                className="lg:hidden w-full mt-2 bg-[#1A1817] text-white px-6 py-3.5 rounded-full text-xs tracking-widest uppercase
                           hover:bg-[#2C2A29] disabled:opacity-50 transition-all duration-300"
              >
                {placing ? "Placing Order..." : `Place Order · Rs. ${cartTotal.toLocaleString()}`}
              </button>
            </form>

            <div className="hidden lg:flex items-center gap-2 mt-6 pt-6 border-t border-[#EFECE6] text-xs text-[#B7AEA4]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your information is safe and used only for delivery purposes.
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#EFECE6] p-5 sm:p-7 lg:sticky lg:top-6">
              <h2 className="text-sm font-medium tracking-widest text-[#5C534D] uppercase mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F4EFEA]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-[#1A1817] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1A1817] truncate font-serif">{item.name}</p>
                      <p className="text-xs text-[#B7AEA4]">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-medium text-[#1A1817]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#EFECE6] space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8C827A]">Subtotal</span>
                  <span className="text-[#1A1817]">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8C827A]">Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#EFECE6]">
                  <span className="text-base font-serif text-[#1A1817]">Total</span>
                  <span className="text-lg font-serif text-[#1A1817]">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={placing}
                className="hidden lg:flex w-full mt-6 bg-[#1A1817] text-white px-6 py-3.5 rounded-full text-xs tracking-widest uppercase
                           hover:bg-[#2C2A29] disabled:opacity-50 transition-all duration-300 items-center justify-center gap-2 group"
              >
                {placing ? (
                  "Placing Order..."
                ) : (
                  <>
                    Place Order (COD)
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-xs text-[#B7AEA4] text-center mt-4">
                Pay in cash when your order arrives
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;