import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Plus, Check, Flower2, Expand, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { heroBottles } from "../data/heroBottles.js";
import "../styles/product-campaign.css";

export default function ProductCard({ product, media = {} }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef(null);
  const normalize = value => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const campaign = heroBottles.find(item => normalize(item.name) === normalize(product.name));
  const image = product.images?.[0]?.url || (campaign ? media[campaign.key+"Post"] || "/images/posts/" + campaign.key + ".png" : "");
  useEffect(() => setFailed(false), [image]);
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  return <article className={"scent-product" + (campaign ? " campaign-product" : "")}>
    <div className="product-image">
      <Link to={"/product/" + product._id} aria-label={"View " + product.name}>
        {image && !failed ? <>
          <img className="campaign-photo" src={image} alt={product.name} loading="lazy" onError={() => setFailed(true)} />
          {campaign && <img className="campaign-bottle" src={media[campaign.key+"Bottle"] || campaign.image} alt="" aria-hidden="true" loading="lazy" />}
        </> : <div className="product-fallback"><Flower2 size={52} /><span>MANZEIL</span></div>}
      </Link>
      {product.discountPrice > 0 && <span className="product-tag">Special price</span>}
      {image && !failed && <button className="product-enlarge" aria-label={"Enlarge " + product.name} onClick={() => dialog.current?.showModal()}><Expand size={15} /><span>Enlarge</span></button>}
      <button className="quick-add" aria-label={"Add " + product.name + " to bag"} onClick={() => { addToCart(product, 1); setAdded(true); }}>{added ? <Check size={18} /> : <Plus size={18} />}</button>
    </div>
    <div className="product-meta"><span>{({ female: "For her", male: "For him", unisex: "For everyone" })[product.category] || "Signature fragrance"}</span><span aria-live="polite">{added ? "Added to bag" : "EAU DE PARFUM"}</span></div>
    <Link to={"/product/" + product._id}><h3>{product.name}</h3></Link>
    <p className="product-price">Rs. {Number(price || 0).toLocaleString()}{product.discountPrice > 0 && <del>Rs. {Number(product.price).toLocaleString()}</del>}</p>
    {createPortal(<dialog className="perfume-preview" ref={dialog} aria-label={product.name + " image preview"} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="perfume-preview-content">
        <button autoFocus className="perfume-preview-close" aria-label="Close image preview" onClick={() => dialog.current.close()}><X size={22} /></button>
        <img src={image} alt={product.name} loading="lazy" />
        <div><span>{product.name}</span><Link to={"/product/" + product._id} onClick={() => dialog.current.close()}>View fragrance</Link></div>
      </div>
    </dialog>, document.body)}
  </article>;
}
