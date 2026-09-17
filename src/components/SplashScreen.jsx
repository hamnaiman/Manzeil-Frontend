import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/manzeil-logo.png";

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#FAF9F6",
      }}
    >
      {/* Velvet fold shadows — soft, matte, off-white toned */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 45% 70% at 8% 25%, rgba(0,0,0,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 35% 55% at 95% 8%, rgba(0,0,0,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 78% 92%, rgba(0,0,0,0.045) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 20% 95%, rgba(0,0,0,0.035) 0%, transparent 55%),
            radial-gradient(ellipse 30% 45% at 50% 45%, rgba(0,0,0,0.025) 0%, transparent 55%)
          `,
        }}
      />

      {/* Velvet highlight sheen */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 35% at 22% 18%, rgba(255,255,255,0.7) 0%, transparent 60%),
            radial-gradient(ellipse 45% 30% at 85% 28%, rgba(255,255,255,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 55% 78%, rgba(255,255,255,0.5) 0%, transparent 60%)
          `,
        }}
      />

      {/* Fine velvet nap ridges — subtle matte fabric texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            repeating-linear-gradient(96deg, transparent 0px, transparent 14px, rgba(0,0,0,0.02) 15px, transparent 16px, transparent 28px, rgba(255,255,255,0.04) 29px),
            repeating-linear-gradient(80deg, transparent 0px, transparent 22px, rgba(0,0,0,0.015) 23px, transparent 45px)
          `,
        }}
      />

      {/* Soft outer vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 200px 70px rgba(0,0,0,0.06)",
        }}
      />

      {/* Large blurred background logo for depth */}
      <motion.img
        src={logo}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.12, scale: 1.3 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-[520px] md:w-[720px] object-contain blur-2xl select-none pointer-events-none"
      />

      {/* Foreground content */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-6 px-6"
      >
        <img
          src={logo}
          alt="Manzeil"
          className="h-28 md:h-36 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-gray-500 text-sm md:text-base tracking-[0.25em] uppercase font-light"
        >
          Welcome to the World of Fragrance
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="h-px bg-black/20"
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;