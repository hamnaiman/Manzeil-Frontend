import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { heroBottles } from "../data/heroBottles.js";
import "../styles/bottle-hero.css";

export default function Hero({ products = [], media = {} }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(document.hidden);
  const playing = !paused && !reduced && !hidden;
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    heroBottles.forEach(bottle => {
      [bottle.image, bottle.decor].forEach(src => { const image = new Image(); image.src = src; });
    });
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % heroBottles.length), 2000);
    return () => window.clearTimeout(timer);
  }, [index, playing]);
  const selected = heroBottles[index];
  const active = {...selected, image: media[selected.key+"Bottle"] || selected.image, decor: media[selected.key+"Decor"] || selected.decor};
  const product = products.find(item => item.name?.trim().toLowerCase() === active.name.toLowerCase());
  return <section className={"bottle-hero theme-" + active.theme + (paused || reduced ? " motion-paused" : "")} aria-roledescription="carousel" aria-label="Featured Manzeil fragrances">
    <div className="bottle-hero-top"><span className="bottle-hero-edition">THE FRAGRANCE COLLECTION <i /> 01—{String(heroBottles.length).padStart(2, "0")}</span><a href="#collection">All fragrances</a></div>
    <div className="bottle-hero-layout">
      <div className="bottle-hero-copy">
        <div aria-live={playing ? "off" : "polite"} aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.div key={active.key} initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: reduced ? 0 : -8, filter: reduced ? "none" : "blur(4px)" }} transition={{ duration: reduced ? 0 : .4, ease: [.22, 1, .36, 1] }}>
          <span className="bottle-eyebrow">{active.eyebrow}</span>
          <h2>{active.headline[0]}<br /><em>{active.headline[1]}</em></h2>
          <p>{active.description}</p>
          {product ? <Link className="bottle-shop" to={"/product/" + product._id}>Discover {active.name}</Link> : <a className="bottle-shop" href="#collection">Explore the collection</a>}
        </motion.div></AnimatePresence></div>
      </div>
      <div className="bottle-stage">
        <div className="bottle-decorations" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.div className="bottle-decor-set" key={active.key}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] }}>
              
              <img className="bottle-decor bottle-decor-lower" src={active.decor} alt="" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="bottle-name-backdrop" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.span key={active.key} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .7 }}>{active.name}</motion.span>
          </AnimatePresence>
        </div>
        <img className="bottle-stage-logo" src={media.logo || "/manzeil-logo.png"} alt="Manzeil" /><div className="bottle-botanical-backdrop" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.img key={active.key} src={active.decor} alt=""
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: .42 }} exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : .9 }} />
          </AnimatePresence>
        </div>
        
        <div className="bottle-image-area"><AnimatePresence mode="sync" initial={false}><motion.div className="bottle-transition" key={active.key} initial={reduced ? false : { opacity: 0, x: "46%", y: "42%", scale: .22 }} animate={{ opacity: 1, x: "0%", y: "0%", scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: "-12%", y: "-4%", scale: .92 }} transition={{ duration: reduced ? 0 : .9, ease: [.22, 1, .36, 1], opacity: { duration: reduced ? 0 : .45 } }}><img className="bottle-float" src={active.image} alt={active.name + " by Manzeil"} fetchPriority="high" /></motion.div></AnimatePresence></div>
        <span className="bottle-floor-shadow" aria-hidden="true" />
        <p className="bottle-caption">{active.caption}</p>
      </div>
      <div className="bottle-hero-info">
        <span className="bottle-eyebrow">IN THE SPOTLIGHT</span><h3>{active.name}</h3><span className="bottle-edition">{active.edition}</span>
        {product?.sizeMl > 0 && <span className="bottle-size">{product.sizeMl} ml</span>}
        <div className="bottle-selector"><span>Find your signature</span><div role="group" aria-label="Choose a fragrance">{heroBottles.map((bottle, itemIndex) => <button key={bottle.key} aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)} aria-label={"Show " + bottle.name}><img src={media[bottle.key+"Bottle"] || bottle.image} alt="" width="38" height="64" /><span>{bottle.name}</span></button>)}</div></div>
      </div>
    </div>
    <div className="bottle-hero-bottom"><span>YOUR SCENT. YOUR STORY.</span><span className="bottle-pagination" aria-hidden="true">{heroBottles.map((bottle, i) => <i key={bottle.key} className={index === i ? "active" : ""} />)}</span><button onClick={() => setPaused(!paused)} disabled={!!reduced} aria-label={paused || reduced ? "Resume automatic slideshow" : "Pause automatic slideshow"}>{paused || reduced ? <Play size={12} /> : <Pause size={12} />}</button></div>
  </section>;
}
