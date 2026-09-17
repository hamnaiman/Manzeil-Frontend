import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import api from "../api/axios.js";
import logo from "../assets/manzeil-logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="h-screen w-screen bg-[#FBF9F5] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Large blurred logo watermark in background */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[110vw] max-w-[900px] opacity-[0.05] blur-sm pointer-events-none select-none"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#EFECE6] px-7 py-7 sm:px-8 sm:py-8">
        {/* Small logo + heading */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Manzeil" className="h-9 w-auto mb-3" />
          <p className="text-[10px] tracking-[0.3em] text-[#B7AEA4] uppercase">
            Administrator Portal
          </p>
        </div>

        <div className="mb-5 text-center">
          <p className="text-xs tracking-[0.2em] text-[#8C827A] uppercase mb-1">
            Welcome Back
          </p>
          <h1 className="text-lg font-serif text-[#1A1817]">
            Sign in to manage your store
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 text-[#B7AEA4] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DDD0] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1A1817]
                         placeholder:text-[#B7AEA4] focus:outline-none focus:ring-2 focus:ring-[#1A1817]/10
                         focus:border-[#8C827A] transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-[#B7AEA4] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DDD0] rounded-xl pl-10 pr-10 py-3 text-sm text-[#1A1817]
                         placeholder:text-[#B7AEA4] focus:outline-none focus:ring-2 focus:ring-[#1A1817]/10
                         focus:border-[#8C827A] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B7AEA4] hover:text-[#8C827A] transition-colors duration-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1817] text-white py-3 rounded-full text-xs tracking-widest uppercase
                       hover:bg-[#2C2A29] disabled:opacity-50 transition-all duration-300
                       flex items-center justify-center gap-2 group mt-1"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-5 pt-5 border-t border-[#EFECE6] text-[11px] text-[#B7AEA4]">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          Restricted access — authorized personnel only.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;