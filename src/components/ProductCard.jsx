import {productPath} from "../utils/productPath.js";
import "../styles/product-campaign.css";
import StoreImage from './StoreImage.jsx';
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Check, Flower2, Expand, X, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { heroBottles } from "../data/heroBottles.js";


export default function ProductCard({ product, media = {} }) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const inBag = cartItems.find(item=>item.product===product._id)?.quantity||0;
  const available = Math.max(0,Number(product.stock||0)-inBag);
  const buyNow = () => { if(Number(product.stock)<=0)return; if(available>0)addToCart(product,1); navigate("/checkout"); };
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
      <Link to={productPath(product)} aria-label={"View " + product.name}>
        {image && !failed ? <>
          <StoreImage sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" className="campaign-photo" src={image} alt={product.name} loading="lazy" onError={() => setFailed(true)} />

        </> : <div className="product-fallback"><Flower2 size={52} /><span>MANZEIL</span></div>}
      </Link>
      {product.discountPrice > 0 && <span className="product-tag">Special price</span>}
      {image && !failed && <button className="product-enlarge" aria-label={"Enlarge " + product.name} onClick={() => dialog.current?.showModal()}><Expand size={15} /><span>Enlarge</span></button>}
      <button disabled={!available} className="quick-add" aria-label={"Add " + product.name + " to bag"} onClick={() => { addToCart(product, 1); setAdded(true); }}>{added ? <Check size={18} /> : <Plus size={18} />}</button>
    </div>
    <div className="product-meta"><span>{({ female: "For her", male: "For him", unisex: "For everyone" })[product.category] || "Signature fragrance"}</span><span aria-live="polite">{added ? "Added to bag" : "EAU DE PARFUM"}</span></div>
    <Link to={productPath(product)}><h3>{product.name}</h3></Link>
    <div className="product-purchase-row"><p className="product-price">Rs. {Number(price || 0).toLocaleString()}{product.discountPrice > 0 && <del>Rs. {Number(product.price).toLocaleString()}</del>}</p>
    <button className="product-buy-now" disabled={Number(product.stock||0)<=0} onClick={buyNow} aria-label={"Buy "+product.name+" now"}>{Number(product.stock||0)>0?'Buy now':'Sold out'}<ArrowUpRight size={14}/></button></div>
    {createPortal(<dialog className="perfume-preview" ref={dialog} aria-label={product.name + " image preview"} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="perfume-preview-content">
        <button autoFocus className="perfume-preview-close" aria-label="Close image preview" onClick={() => dialog.current.close()}><X size={22} /></button>
        <StoreImage src={image} alt={product.name} loading="lazy" />
        <div><span>{product.name}</span><Link to={productPath(product)} onClick={() => dialog.current.close()}>View fragrance</Link></div>
      </div>
    </dialog>, document.body)}
  </article>;
}
