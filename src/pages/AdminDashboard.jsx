import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/manzeil-logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const linkClass = "block px-4 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar hidden automatically when printing a report */}
      <aside className="print:hidden w-56 bg-white border-r border-gray-100 p-4">
        <img src={logo} alt="Manzeil" className="h-7 mb-6" />
        <nav className="space-y-1">
          <Link to="/admin" className={linkClass}>Overview</Link>
          <Link to="/admin/products" className={linkClass}>Add Product</Link>
          <Link to="/admin/orders" className={linkClass}>Orders</Link>
          <Link to="/admin/reports" className={linkClass}>Reports</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 print:bg-white print:p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
