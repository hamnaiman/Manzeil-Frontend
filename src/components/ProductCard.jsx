import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-widest text-gray-400">{product.category}</p>
        <h3 className="font-medium text-gray-900 mt-1">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-gray-900">Rs. {finalPrice}</span>
          {product.discountPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">Rs. {product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
