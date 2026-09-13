import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("adminToken", data.data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" placeholder="Email" required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password" placeholder="Password" required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit" disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded hover:bg-brand-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
