import React, { useMemo } from "react";
import { motion } from "framer-motion";
import logo from "../assets/manzeil-logo.png";

// true = dark cinematic (reference jaisa), false = aapka off-white theme
const DARK = false;

const theme = DARK
  ? { bg: "#0b0b0b", text: "rgba(255,255,255,0.92)", line: "rgba(212,175,55,0.8)", vignette: "rgba(0,0,0,0.7)" }
  : { bg: "#FAF9F6", text: "rgba(40,40,40,0.95)", line: "rgba(184,150,60,0.9)", vignette: "rgba(0,0,0,0.05)" };

const GOLD = "212,175,55";
const TAGLINE = "Welcome to the World of Fragrance";

const SplashScreen = () => {
  // Floating bokeh particles (sirf ek dafa generate hote hain)
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        duration: 7 + Math.random() * 8,
        delay: Math.random() * 5,
        drift: (Math.random() - 0.5) * 120,
        blur: Math.random() > 0.55 ? 3 : 0,
      })),
    []
  );

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {/* 1. Moving champagne glow orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700, left: "-10%", top: "-15%",
          background: `radial-gradient(circle, rgba(${GOLD},0.45) 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 160, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, right: "-8%", bottom: "-15%",
          background: `radial-gradient(circle, rgba(${GOLD},0.38) 0%, transparent 65%)`,
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -140, 0], y: [0, -70, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. Blurred logo backdrop */}
      <motion.img
        src={logo}
        alt=""
        aria-hidden="true"
        className="absolute w-[620px] md:w-[900px] object-contain select-none pointer-events-none"
        style={{ filter: "blur(18px)" }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: [0, 0.5, 0.38, 0.5],
          scale: [1.1, 1.3, 1.2, 1.3],
          x: [-40, 40, -40],
          rotate: [-2, 2, -2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={logo}
        alt=""
        aria-hidden="true"
        className="absolute w-[380px] md:w-[560px] object-contain select-none pointer-events-none"
        style={{ filter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0.2, 0.3],
          scale: [1, 1.12, 1],
          x: [40, -40, 40],
          y: [-20, 20, -20],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3. Diagonal light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(115deg, transparent 40%, rgba(${GOLD},0.14) 50%, transparent 60%)`,
          backgroundSize: "250% 100%",
        }}
        animate={{ backgroundPosition: ["150% 0", "-50% 0"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
      />

      {/* 4. Floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.left}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: `rgba(${GOLD},1)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${GOLD},0.8)`,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{ y: ["0vh", "-115vh"], x: [0, p.drift], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* 5. Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: `inset 0 0 220px 80px ${theme.vignette}` }}
      />

      {/* Foreground */}
      <div className="relative flex flex-col items-center gap-7 px-6">
        {/* Logo: blur se sharp reveal + gold shimmer */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={logo}
            alt="Manzeil"
            className="h-28 md:h-40 w-auto object-contain block"
            style={{ filter: "drop-shadow(0 6px 28px rgba(0,0,0,0.18))" }}
          />
          {/* shimmer sirf logo ki shape ke andar chalta hai (mask) */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(110deg, transparent 35%, rgba(${GOLD},1) 50%, transparent 65%)`,
              backgroundSize: "250% 100%",
              WebkitMaskImage: `url(${logo})`,
              maskImage: `url(${logo})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              mixBlendMode: "overlay",
            }}
            animate={{ backgroundPosition: ["200% 0", "-100% 0"] }}
            transition={{ duration: 2.2, delay: 1, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Tagline: jaldi start, tez letters, gehra colour */}
        <p
          className="text-sm md:text-base tracking-[0.25em] uppercase font-normal flex flex-wrap justify-center"
          style={{ color: theme.text }}
          aria-label={TAGLINE}
        >
          {TAGLINE.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.02, ease: "easeOut" }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </p>

        {/* Gold line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
          className="h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.line}, transparent)` }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;