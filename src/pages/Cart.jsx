import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="text-brand-600 underline mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product} className="flex items-center gap-4 border-b border-gray-100 pb-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-gray-500 text-sm">Rs. {item.price} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => removeFromCart(item.product)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold">Total: Rs. {cartTotal}</span>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-500"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
