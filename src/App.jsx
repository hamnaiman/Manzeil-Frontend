import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Overview from "./pages/admin/Overview.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Reports from "./pages/admin/Reports.jsx";

const StorefrontLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Storefront (public) */}
      <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
      <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
      <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
      <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="products" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
