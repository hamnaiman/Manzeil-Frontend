import React, { useEffect, useRef } from "react";

/** Animate on viewport entry, never leave content hidden if observation fails. */
export default function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !window.IntersectionObserver || !element.animate) return;
    let animation;
    const offset = direction === "left" ? "translate3d(-32px, 20px, 0)" :
      direction === "right" ? "translate3d(32px, 20px, 0)" : "translate3d(0, 42px, 0)";
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (preference.matches) return;
      animation = element.animate([
        { opacity: 0.12, transform: offset + " scale(.965)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ], { duration: 850, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
    }, { threshold: 0.12, rootMargin: "0px 0px -16px 0px" });
    const stop = () => { if (preference.matches) { animation?.cancel(); observer.disconnect(); } };
    preference.addEventListener("change", stop);
    observer.observe(element);
    return () => { observer.disconnect(); animation?.cancel(); preference.removeEventListener("change", stop); };
  }, [delay, direction]);
  return <div ref={ref} className={className}>{children}</div>;
}
