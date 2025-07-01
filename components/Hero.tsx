"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="md:h-[82vh] w-full max-w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <div className="inset-0 z-0 md:mx-60">
        <img
          src="/thevaultprofile.png"
          alt="Vault Background"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}
