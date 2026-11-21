"use client";

import React, { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
});

export function useLenis() {
  return useContext(SmoothScrollContext).lenis;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Register melon.studio exact cubic-bezier easing curves
    try {
      CustomEase.create("hesitate", "0.65, 0.01, 0.05, 0.99");
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
      CustomEase.create("underline", "0.18, 0.83, 0.27, 1");
      CustomEase.create(
        "snappy",
        "M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1"
      );
    } catch (e) {
      // Eases already registered or fallback
    }

    const docEl = document.documentElement;
    docEl.classList.add("motion");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      docEl.classList.add("motion-revealed", "motion-live");
      return;
    }

    // Initialize Lenis smooth scroll with Melon Studio exact parameters (module 27773: lerp 0.09, wheelMultiplier 1.1)
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Bridge Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Priority true ensures Lenis processes scroll at the very start of the frame
    gsap.ticker.add(tickerCb, false, true);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
