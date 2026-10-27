import RouteSeo from "./components/Seo.jsx";
import { trackPage } from "./utils/trackVisit.js";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import Home from "./pages/Home.jsx";

const Reviews=lazy(()=>import('./pages/admin/Reviews.jsx'));
const Blog=lazy(()=>import('./pages/Blog.jsx'));
const BlogArticle=lazy(()=>import('./pages/Blog.jsx').then(module=>({default:module.BlogArticle})));
const BlogPosts=lazy(()=>import('./pages/admin/BlogPosts.jsx'));
const Collection=lazy(()=>import("./pages/Collection.jsx"));

const ProductDetail=lazy(()=>import("./pages/ProductDetail.jsx"));
const Cart=lazy(()=>import("./pages/Cart.jsx"));
const Checkout=lazy(()=>import("./pages/Checkout.jsx"));
const AdminLogin=lazy(()=>import("./pages/AdminLogin.jsx"));
const AdminDashboard=lazy(()=>import("./pages/AdminDashboard.jsx"));
const Overview=lazy(()=>import("./pages/admin/Overview.jsx"));
const AddProduct=lazy(()=>import("./pages/admin/AddProduct.jsx"));
const Orders=lazy(()=>import("./pages/admin/Orders.jsx"));
const VisitorAnalytics=lazy(()=>import("./pages/admin/VisitorAnalytics.jsx"));
const Reports=lazy(()=>import("./pages/admin/Reports.jsx"));

const Contact=lazy(()=>import("./pages/Contact.jsx"));

const WebsiteSettings=lazy(()=>import("./pages/admin/WebsiteSettings.jsx"));
const ContactMessages=lazy(()=>import("./pages/admin/ContactMessages.jsx"));

function StorefrontLayout({ children }) {
  const location = useLocation();
  useEffect(()=>{const timer=setTimeout(()=>trackPage(location.pathname),150);return()=>clearTimeout(timer);},[location.pathname]);
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  useEffect(()=>{
    const header=document.querySelector('.luxe-header');if(!header)return;
    const measure=()=>document.documentElement.style.setProperty('--storefront-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');
    measure();const observer=new ResizeObserver(measure);observer.observe(header);
    return()=>observer.disconnect();
  },[]);
  return <div className="storefront-shell"><RouteSeo /><Navbar /><div key={location.pathname} className="storefront-page route-enter">{children}</div></div>;
}
function App() {
  const [showSplash, setShowSplash] = useState(true);

  const finishSplash = React.useCallback(() => setShowSplash(false), []);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen onComplete={finishSplash} />}</AnimatePresence>

      <Suspense fallback={<div className="route-loading" role="status">Loading your page…</div>}>
        <Routes>
          <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
          <Route path="/products" element={<StorefrontLayout><Collection /></StorefrontLayout>} />
          <Route path="/collections/:slug" element={<StorefrontLayout><Collection /></StorefrontLayout>} />
          <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
          <Route path="/blog" element={<StorefrontLayout><Blog /></StorefrontLayout>} />
          <Route path="/blog/:slug" element={<StorefrontLayout><BlogArticle /></StorefrontLayout>} />
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
            <Route path="products" element={<AddProduct />} /><Route path="reviews" element={<Reviews />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} /><Route path="visitors" element={<VisitorAnalytics />} /><Route path="blog" element={<BlogPosts />} /><Route path="stories" element={<Navigate to="/admin/blog" replace />} /><Route path="website" element={<WebsiteSettings />} /><Route path="messages" element={<ContactMessages />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

