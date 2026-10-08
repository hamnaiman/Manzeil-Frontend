import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return <footer className="scent-footer">
    <div className="footer-top"><div><span className="eyebrow">YOUR NEXT SIGNATURE AWAITS</span><h2>Leave a little<br /><em>of yourself everywhere.</em></h2></div><Link className="scent-button light" to="/#collection">Find your fragrance <ArrowUpRight size={18} /></Link></div>
    <div className="footer-bottom"><div><Link className="footer-wordmark" to="/">manzeil.</Link><p>Jo Tum Chaho. A world of fragrance.</p></div><nav aria-label="Footer navigation"><Link to="/?category=female#collection">For her</Link><Link to="/?category=male#collection">For him</Link><Link to="/?category=unisex#collection">Unisex</Link><Link to="/cart">Your bag</Link><Link to="/contact">Contact us</Link></nav><p>© {new Date().getFullYear()} Manzeil<br />Pakistan · Made for your everyday</p></div>
  </footer>;
}
