import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/manzeil-logo.png";

export default function Navbar() {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <header className="scent-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="scent-announcement">A scent for every version of you <span>•</span> Cash on delivery across Pakistan</div>
    <div className="scent-nav">
      <Link to="/" aria-label="Manzeil home"><img className="scent-logo" src={logo} alt="Manzeil" /></Link>
      <nav id="store-navigation" aria-label="Main navigation" className={open ? "scent-links is-open" : "scent-links"}>
        <Link to="/">Home</Link><Link to="/?category=female#collection">For her</Link>
        <Link to="/?category=male#collection">For him</Link><Link to="/?category=unisex#collection">Unisex</Link>
        <Link to="/#scent-films">Scent stories</Link><Link to="/#our-story">Our story</Link><Link to="/contact">Contact</Link>
      </nav>
      <div className="scent-nav-actions">
        <Link className="icon-button" to="/?search=1#collection" aria-label="Search fragrances"><Search size={19} /></Link>
        <Link className="icon-button cart-link" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={20} />{cartCount > 0 && <span>{cartCount}</span>}</Link>
        <button className="icon-button menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="store-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
  </header>;
}
