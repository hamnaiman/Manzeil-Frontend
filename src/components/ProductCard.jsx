import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const FlowerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
    <circle cx="12" cy="12" r="2.1" />
    <path d="M12 9.9c0-2.2-1.6-4-3.6-4.4 1.6 1.6 1.9 3.1 1.5 4.4" />
    <path d="M14.1 12c2.2 0 4-1.6 4.4-3.6-1.6 1.6-3.1 1.9-4.4 1.5" />
    <path d="M12 14.1c0 2.2 1.6 4 3.6 4.4-1.6-1.6-1.9-3.1-1.5-4.4" />
    <path d="M9.9 12c-2.2 0-4 1.6-4.4 3.6 1.6-1.6 3.1-1.9 4.4-1.5" />
  </svg>
);

const LeafIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
    <path d="M5 19c8-1 11-7 11-14-8 0-12 5-12 11 0 1.5.4 2.6 1 3z" />
    <path d="M6 18c2.5-3.5 5-7 9.5-11.5" />
  </svg>
);

const DropletIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
    <path d="M12 4c3 4 5.5 7.3 5.5 10.3A5.5 5.5 0 0 1 6.5 14.3C6.5 11.3 9 8 12 4z" />
  </svg>
);

const cornerIcon = {
  female: FlowerIcon,
  male: LeafIcon,
  unisex: DropletIcon,
};

const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const CornerIcon = cornerIcon[product.category] || DropletIcon;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        product: product._id,
        name: product.name,
        price: finalPrice,
        image: product.images?.[0]?.url,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    openCart();
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-square bg-[#F4EFEA] rounded-lg overflow-hidden relative">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {product.discountPrice > 0 && (
          <span className="absolute top-3 left-3 bg-[#1A1817] text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide z-10">
            Sale
          </span>
        )}

        {/* Category reveal icon */}
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center
                     text-[#8C827A] opacity-0 scale-50 rotate-12
                     group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0
                     transition-all duration-500 ease-out z-10"
        >
          <CornerIcon className="w-5 h-5" />
        </div>

        {/* Quick Add bar — slides up from bottom, always faintly visible on touch devices */}
        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0
                     max-md:translate-y-0 transition-transform duration-400 ease-out z-10"
        >
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#1A1817]/95 backdrop-blur-sm text-white text-xs tracking-widest uppercase
                       py-3 flex items-center justify-center gap-2 hover:bg-[#2C2A29] transition-colors duration-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-widest text-[#8C827A]">{product.category}</p>
        <h3 className="font-serif text-[#1A1817] mt-1">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-[#2C2A29]">Rs. {finalPrice}</span>
          {product.discountPrice > 0 && (
            <span className="text-sm text-[#B7AEA4] line-through">Rs. {product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;