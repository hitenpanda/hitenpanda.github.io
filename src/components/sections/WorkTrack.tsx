"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import FlexCarousel, { FlexCarouselItem } from "@/components/ui/FlexCarousel";
import { PROJECT_DETAILS } from "@/utils/projectCards";

// Authentic Melon Studio liquid filter matrix calculation
function getLiquidMatrix(stdDev: number, maxBlur = 40): string {
  const r = Math.min(0.42, 0.5 * Math.min(1, 0.19 + 5.3 / Math.max(stdDev * (40 / maxBlur), 0.01)));
  const i = 24 - 18 * Math.min(1, stdDev / maxBlur);
  return `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${i.toFixed(3)} ${(0.5 - i * r).toFixed(3)}`;
}

// Coming Soon editorial media items for continuous carousel
const COMING_SOON_MEDIA_ITEMS: FlexCarouselItem[] = [
  {
    id: "autonomous-ai",
    src: "/media/work/coming-soon-01.svg",
    title: "Coming Soon",
    subtitle: "Autonomous AI // Reasoning & Eval Loops",
    alt: "Coming Soon - Autonomous AI",
    color: [0.02, 0.08, 0.16],
  },
  {
    id: "robotics-kinematics",
    src: "/media/work/coming-soon-02.svg",
    title: "Coming Soon",
    subtitle: "Robotics Kinematics // IMU Fusion & Motor Control",
    alt: "Coming Soon - Robotics Kinematics",
    color: [0.02, 0.08, 0.16],
  },
  {
    id: "event-enclave-cu",
    src: "/media/work/coming-soon-03.svg",
    title: "Coming Soon",
    subtitle: "Event Enclave CU // Live Production & Stage OS",
    alt: "Coming Soon - Event Enclave CU",
    color: [0.02, 0.08, 0.16],
  },
  {
    id: "fullstack-telemetry",
    src: "/media/work/coming-soon-04.svg",
    title: "Coming Soon",
    subtitle: "Fullstack Platform // Distributed Realtime Telemetry",
    alt: "Coming Soon - Fullstack Platform",
    color: [0.02, 0.08, 0.16],
  },
  {
    id: "adaptive-learning",
    src: "/media/work/coming-soon-05.svg",
    title: "Coming Soon",
    subtitle: "Adaptive Learning // Socratic Knowledge Engine",
    alt: "Coming Soon - Adaptive Learning",
    color: [0.02, 0.08, 0.16],
  },
  {
    id: "glsl-motion-labs",
    src: "/media/work/coming-soon-06.svg",
    title: "Coming Soon",
    subtitle: "GLSL Motion Labs // 120 FPS Refraction & Optics",
    alt: "Coming Soon - GLSL Motion Labs",
    color: [0.02, 0.08, 0.16],
  },
];

export default function WorkTrack() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const matrixRef = useRef<SVGFEColorMatrixElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Liquid heading smooth scroll-driven transition state
  const liquidState = useRef({
    p: 0,
    targetP: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 120fps motion update loop (liquid bleed heading + pinned track progress)
  useEffect(() => {
    const heading = headingRef.current;
    const blurEl = blurRef.current;
    const matrixEl = matrixRef.current;
    if (!heading || !blurEl || !matrixEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      heading.style.filter = "none";
      heading.style.color = "";
      heading.classList.remove("is-liquid");
    }

    const maxBlur = 29.90;
    let lastAppliedBlur = -1;

    const applyLiquid = (blur: number) => {
      if (blur <= 0.05) {
        if (lastAppliedBlur !== 0) {
          heading.style.filter = "none";
          heading.style.color = "";
          heading.classList.remove("is-liquid");
          lastAppliedBlur = 0;
        }
      } else {
        if (Math.abs(blur - lastAppliedBlur) > 0.05 || lastAppliedBlur === 0) {
          blurEl.setAttribute("stdDeviation", blur.toFixed(2));
          matrixEl.setAttribute("values", getLiquidMatrix(blur, 40));
          const n = Math.min(1, blur / 8);
          heading.style.color = `color-mix(in srgb, var(--liquid-from, var(--red, #C1E8FF)) ${(100 * n).toFixed(1)}%, currentColor)`;
          heading.style.filter = 'url("#liquid-work-filter")';
          heading.classList.add("is-liquid");
          lastAppliedBlur = blur;
        }
      }
    };

    if (!reduced) {
      applyLiquid(maxBlur);
    }

    let running = true;
    const updateMotion = () => {
      if (!running) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // 1. Heading Ink Bleed: animates as user scrolls from top of page
      if (!reduced) {
        const scrollThreshold = Math.max(180, Math.min(300, vh * 0.35));
        liquidState.current.targetP = Math.min(1, Math.max(0, scrollY / scrollThreshold));

        const pDiff = liquidState.current.targetP - liquidState.current.p;
        if (Math.abs(pDiff) > 0.001) {
          liquidState.current.p += pDiff * 0.12;
        } else {
          liquidState.current.p = liquidState.current.targetP;
        }

        if (scrollY <= 2 && liquidState.current.p < 0.04) {
          liquidState.current.p = 0;
          liquidState.current.targetP = 0;
        }

        const currentBlur =
          liquidState.current.p >= 0.96 ? 0 : maxBlur * Math.pow(1 - liquidState.current.p, 1.6);
        applyLiquid(currentBlur);
      }

      // 2. Viewport Pinning & Carousel Scroll Scrub:
      // Fixed to the carousel until and unless the work count goes from 1 to 6 and then 1 again
      const track = pinTrackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const maxScroll = rect.height - vh;
        if (maxScroll > 0) {
          const rawProgress = -rect.top / maxScroll;
          const clamped = Math.min(1, Math.max(0, rawProgress));
          scrollProgressRef.current = clamped;
        }
      }
    };

    gsap.ticker.add(updateMotion);

    return () => {
      running = false;
      gsap.ticker.remove(updateMotion);
    };
  }, []);

  return (
    <section className="work" id="work" aria-label="Selected work">
      {/* SVG Liquid Filter Definition matching Melon Studio parameters */}
      <svg
        className="fx-defs"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <filter
          id="liquid-work-filter"
          x="-0.1602"
          y="-0.8054"
          width="1.3204"
          height="2.6107"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="29.90" result="b" />
          <feColorMatrix
            ref={matrixRef}
            in="b"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10.545 -1.436"
          />
        </filter>
      </svg>

      {/* Pinned Scroll Track: pins viewport while scrolling through items 1 -> 6 -> 1 */}
      <div className="work__pin-track" ref={pinTrackRef}>
        <div className="work__sticky-stage">
          <div className="f-work__head">
            <div className="flex items-baseline gap-4 md:gap-6">
              <h2
                ref={headingRef}
                className="work__heading is-liquid"
                style={{
                  filter: 'url("#liquid-work-filter")',
                  color: "color-mix(in srgb, var(--liquid-from, var(--red, #C1E8FF)) 100%, currentColor)",
                }}
              >
                Latest Work
              </h2>
              <span className="font-mono text-xs md:text-sm tracking-widest uppercase px-3 py-1 rounded-full border border-[#5483B3]/40 bg-[#5483B3]/10 text-[#C1E8FF]">
                Coming Soon
              </span>
            </div>
            <Link
              className="f-showall"
              href="/work"
              onMouseEnter={(e) => e.currentTarget.classList.add("is-hover")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("is-hover")}
            >
              <span className="f-roll">
                <span className="f-roll__in">
                  <span className="f-roll__t">Show all</span>
                  <span className="f-roll__t f-roll__t--b" aria-hidden="true">
                    Show all
                  </span>
                </span>
              </span>
              <span className="f-showall__arrs" aria-hidden="true">
                <svg className="f-showall__arr" viewBox="0 0 16 16">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg className="f-showall__arr f-showall__arr--b" viewBox="0 0 16 16">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* React Bits FlexCarousel WebGL Liquid Glass Container with seamless edge blends */}
          <div className="work__carousel-wrap">
            {mounted && (
              <FlexCarousel
                items={COMING_SOON_MEDIA_ITEMS}
                preset="liquid"
                intro="bloom"
                continuous={true}
                continuousSpeed={55}
                pauseOnHover={true}
                cardHeight={0.56}
                gap={24}
                radius={16}
                squeeze={0.16}
                focusOnClick={true}
                captions={true}
                captureWheel={false}
              />
            )}
          </div>

          {/* Seamless bottom vignette blend into #chapters */}
          <div className="work__blend-bottom" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
