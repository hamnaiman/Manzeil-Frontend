import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "./styles/storefront-layout.css";
import "./styles/experience.css";
import "./styles/card-motion.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
     <AuthProvider>
      <CartProvider>
        <MotionConfig reducedMotion="user"><App /></MotionConfig>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
