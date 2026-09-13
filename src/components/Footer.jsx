import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/manzeil-logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <img src={logo} alt="Manzeil" className="h-8 mb-4 brightness-0 invert" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Jo Tum Chaho — signature fragrances crafted for every mood, every moment.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/?category=male" className="hover:text-white transition-colors">Men</Link></li>
            <li><Link to="/?category=female" className="hover:text-white transition-colors">Women</Link></li>
            <li><Link to="/?category=unisex" className="hover:text-white transition-colors">Unisex</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/cart" className="hover:text-white transition-colors">Your Cart</Link></li>
            <li><span className="text-gray-500">Shipping Info</span></li>
            <li><span className="text-gray-500">Returns &amp; Exchanges</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Cash on Delivery available nationwide</li>
            <li className="text-gray-500">Email &amp; phone coming soon</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {year} Manzeil. All rights reserved.</span>
          <span>Jo Tum Chaho</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
