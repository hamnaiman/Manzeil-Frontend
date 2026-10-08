import React from "react";
import { ArrowUpRight, Sparkles, ShoppingBag } from "lucide-react";

export default function Hero() {
  return <section className="campaign-hero" aria-labelledby="campaign-title">
    <img className="campaign-art" src="/images/manzeil-amber-hero.png" alt="Manzeil perfume concept with golden amber light, citrus and white flowers" fetchPriority="high" width="1536" height="1024" />
    <div className="campaign-shade" aria-hidden="true" />
    <div className="campaign-copy">
      <span className="campaign-kicker">THE WORLD OF MANZEIL</span>
      <h2 id="campaign-title">Make your<br /><em>presence felt.</em></h2>
      <p>A scent that speaks before you do.<br />Find your signature. Make it unforgettable.</p>
      <a href="#collection" className="campaign-cta">Explore the collection <ArrowUpRight size={18} /></a>
      <div className="campaign-details"><span><Sparkles size={14} /> Your scent. Your story.</span><span><ShoppingBag size={14} /> Cash on delivery</span></div>
    </div>
    <span className="campaign-signature" aria-hidden="true">JO TUM CHAHO</span>
  </section>;
}
