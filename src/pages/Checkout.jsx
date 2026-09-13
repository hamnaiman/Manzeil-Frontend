import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
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

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-green-700">Order Placed!</h1>
        <p className="text-gray-600 mt-2">
          Order #{success._id.slice(-6).toUpperCase()} — Cash on Delivery, total Rs. {success.totalPrice}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-500"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <p className="p-6 text-gray-500 text-center">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Checkout (Cash on Delivery)</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="address" placeholder="Street Address" required value={form.address} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="city" placeholder="City" required value={form.city} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="postalCode" placeholder="Postal Code (optional)" value={form.postalCode} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2" />

        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">Total: Rs. {cartTotal}</span>
          <button
            type="submit"
            disabled={placing}
            className="bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-500 disabled:opacity-50"
          >
            {placing ? "Placing Order..." : "Place Order (COD)"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
