import StoreImage from './StoreImage.jsx';
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, ArrowUpRight, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/manzeil-logo.png";

const items = [
  ["/", "Home"], ["/collections/for-her", "For her"],
  ["/collections/for-him", "For him"], ["/collections/unisex", "Unisex"],
  ["/blog", "Blog"], ["/#our-story", "Our story"], ["/contact", "Contact"],
];
export default function Navbar() {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef(null);
  const header = useRef(null);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 32);
    const escape = event => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } };
    const outside = event => { if (!header.current?.contains(event.target)) setOpen(false); };
    const desktop = window.matchMedia("(min-width: 1061px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); desktop.removeEventListener("change", resize); };
  }, [open]);
  function active(to) {
    const url = new URL(to, window.location.origin);
    return (location.pathname === url.pathname || (url.pathname === "/blog" && location.pathname.startsWith("/blog/"))) && (url.pathname !== "/" || (location.search === url.search && location.hash === url.hash));
  }
  return <header ref={header} className={"scent-header luxe-header" + (scrolled ? " is-scrolled" : "")}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className={"luxe-announcement luxe-ticker" + (tickerPaused ? " is-paused" : "")}>
      <div className="luxe-ticker-window"><div className="luxe-ticker-track">
        {[0, 1].map(copy => <div className="luxe-ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {[0, 1, 2].map(repeat => <span className="luxe-ticker-message" key={repeat} aria-hidden={repeat > 0 ? true : undefined}><Sparkles size={12} aria-hidden="true" /> A scent for every version of you <i /> Cash on delivery across Pakistan <i /> MANZEIL — JO TUM CHAHO</span>)}
        </div>)}
      </div></div>
      <button className="luxe-ticker-control" aria-label={tickerPaused ? "Resume announcements" : "Pause announcements"} onClick={() => setTickerPaused(value => !value)}>{tickerPaused ? "▶" : "Ⅱ"}</button>
    </div>
    <div className="luxe-nav">
      <Link className="luxe-brand" to="/" aria-label="Manzeil home"><span className="luxe-logo-crop"><StoreImage src={logo} alt="Manzeil" /></span></Link>
      <nav id="store-navigation" aria-label="Main navigation" className={"luxe-links" + (open ? " is-open" : "")}>
        <div className="luxe-mobile-intro"><span>FIND YOUR SIGNATURE</span><p>A little luxury. Entirely yours.</p></div>
        {items.map(([to, label], i) => <Link key={to} to={to} aria-current={active(to) ? "page" : undefined} style={{ "--link-order": i }}><span>{label}</span><ArrowUpRight size={15} /></Link>)}
        <div className="luxe-mobile-footer"><span>MANZEIL</span><Link className="luxe-mobile-search" to="/products?search=1"><Search size={16} /> Search fragrances</Link></div>
      </nav>
      <div className="luxe-actions"><Link className="luxe-shop-now" to="/products">Shop now <ArrowUpRight size={14} /></Link>
        <Link className="luxe-search" to="/products?search=1" aria-label="Search fragrances"><Search size={17} strokeWidth={1.6} /></Link>
        <span className="luxe-action-divider" aria-hidden="true" />
        <Link className="luxe-bag" to="/cart" aria-label={"Shopping bag, " + cartCount + " items"}><ShoppingBag size={20} strokeWidth={1.5} /><span key={cartCount}>{cartCount}</span></Link>
        <button ref={toggle} className="luxe-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="store-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {open && <button className="luxe-menu-backdrop" aria-label="Close navigation" tabIndex={-1} onClick={() => setOpen(false)} />}
  </header>;
}
