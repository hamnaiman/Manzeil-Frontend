import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Check, Flower2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  return <article className="scent-product">
    <div className="product-image">
      <Link to={`/product/${product._id}`} aria-label={`View ${product.name}`}>
        {product.images?.[0]?.url && !failed ? <img src={product.images[0].url} alt={product.name} loading="lazy" onError={() => setFailed(true)} /> : <div className="product-fallback"><Flower2 size={52} /><span>MANZEIL</span></div>}
      </Link>
      {product.discountPrice > 0 && <span className="product-tag">Special price</span>}
      <button className="quick-add" aria-label={`Add ${product.name} to bag`} onClick={() => { addToCart(product, 1); setAdded(true); }}>{added ? <Check size={18} /> : <Plus size={18} />}</button>
    </div>
    <div className="product-meta"><span>{({ female: "For her", male: "For him", unisex: "For everyone" })[product.category] || "Signature fragrance"}</span><span aria-live="polite">{added ? "Added to bag" : "EAU DE PARFUM"}</span></div>
    <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
    <p className="product-price">Rs. {Number(price || 0).toLocaleString()}{product.discountPrice > 0 && <del>Rs. {Number(product.price).toLocaleString()}</del>}</p>
  </article>;
}
