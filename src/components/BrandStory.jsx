import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import logo from "../assets/manzeil-logo.png";

const ease = [0.22, 1, 0.36, 1];

export default function BrandStory({ content }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const logoY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const title = content?.storyTitle || "Some memories begin with a scent.";
  const text = content?.storyText || "Discover fragrances that become part of your story.";
  const image = content?.media?.storyImage || "/images/posts/hitman.png";

  const dust = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        duration: 9 + Math.random() * 8,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  return (
    <section id="our-story" ref={ref} className="story-v2">
      {/* Backdrop: Manzeil logo (blurred, parallax) */}
      <div className="sv2-logo-wrap" aria-hidden="true">
        <motion.img
          src={logo}
          alt=""
          className="sv2-logo"
          style={{ y: logoY, rotate: logoRotate }}
          initial={{ opacity: 0, scale: 1.15 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        />
      </div>

      {/* Gold glow orbs */}
      <motion.div
        className="sv2-orb sv2-orb-a"
        aria-hidden="true"
        animate={{ x: [0, 90, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="sv2-orb sv2-orb-b"
        aria-hidden="true"
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating gold dust */}
      {dust.map((d) => (
        <motion.span
          key={d.id}
          className="sv2-dust"
          aria-hidden="true"
          style={{ left: `${d.left}%`, width: d.size, height: d.size }}
          animate={{ y: ["0%", "-120%"], x: [0, d.drift], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <div className="sv2-grid">
        {/* LEFT: text */}
        <div className="sv2-text">
          <motion.span
            className="sv2-eyebrow"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            <i /> THE MANZEIL PHILOSOPHY
          </motion.span>

          <h2 className="sv2-title" aria-label={title}>
            {title.split(" ").map((word, i) => (
              <React.Fragment key={i}>
                <span className="sv2-word" aria-hidden="true">
                  <motion.span
                    initial={{ y: "115%", rotate: 4 }}
                    whileInView={{ y: "0%", rotate: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.95, delay: 0.15 + i * 0.09, ease }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </React.Fragment>
            ))}
          </h2>

          <motion.div
            className="sv2-rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, delay: 0.7, ease }}
          />

          <motion.p
            className="sv2-copy"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
          >
            {text}
          </motion.p>

          <motion.a
            href="#collection"
            className="sv2-link"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 1.05, ease }}
            whileHover="hover"
          >
            Find your own story
            <motion.span variants={{ hover: { x: 6, y: -6 } }} transition={{ duration: 0.3 }}>
              <ArrowUpRight size={18} />
            </motion.span>
          </motion.a>
        </div>

        {/* RIGHT: image */}
        <motion.div className="sv2-visual" style={{ y: frameY }}>
          {/* gold offset outline */}
          <motion.div
            className="sv2-outline"
            aria-hidden="true"
            initial={{ opacity: 0, x: -30, y: -30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, delay: 0.5, ease }}
          />

          {/* image with curtain reveal */}
          <motion.div
            className="sv2-frame"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
          >
            <motion.img
              src={image}
              alt="Manzeil signature fragrance"
              loading="lazy"
              className="sv2-img"
              style={{ y: imgY }}
              initial={{ scale: 1.3 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.2, ease }}
            />
            <div className="sv2-img-shade" />
          </motion.div>

          {/* rotating seal */}
          <motion.div
            className="sv2-seal"
            initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, delay: 1, ease }}
          >
            <motion.svg
              viewBox="0 0 200 200"
              className="sv2-seal-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            >
              <defs>
                <path id="sv2-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#sv2-circle" textLength="486" lengthAdjust="spacing">
                  MANZEIL · JO TUM CHAHO · MANZEIL · JO TUM CHAHO ·
                </textPath>
              </text>
            </motion.svg>
            <img src={logo} alt="Manzeil" className="sv2-seal-logo" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}