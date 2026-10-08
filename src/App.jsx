import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SplashScreen from "./components/SplashScreen.jsx";

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

import Contact from "./pages/Contact.jsx";
import Stories from "./pages/admin/Stories.jsx";
import WebsiteSettings from "./pages/admin/WebsiteSettings.jsx";
import ContactMessages from "./pages/admin/ContactMessages.jsx";

function StorefrontLayout({ children }) {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return <div className="storefront-shell"><Navbar /><div key={location.pathname} className="storefront-page route-enter">{children}</div></div>;
}
function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // 1.5 second — chahen to 1000 (1 sec) kar dein

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      {!showSplash && (
        <Routes>
          <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
          <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
          <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
          <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
          <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />

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
            <Route path="reports" element={<Reports />} /><Route path="stories" element={<Stories />} /><Route path="website" element={<WebsiteSettings />} /><Route path="messages" element={<ContactMessages />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
