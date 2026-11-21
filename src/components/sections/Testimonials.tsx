"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface ReviewItem {
  lines: string[];
  name: string;
  role: string;
  caseStudy?: {
    label: string;
    href: string;
  };
}

const reviews: ReviewItem[] = [
  {
    lines: [
      "Hiten Panda was responsible for the entire",
      "architecture of MIRA's autonomous platform, and he",
      "absolutely nailed it! It was a pleasure working",
      "with him, and I hope our paths cross again soon!",
    ],
    name: "Agata Rutkowska",
    role: "Brand Identity Manager at Huuuge Games",
    caseStudy: {
      label: "MIRA AI case study",
      href: "/work/mira-ai",
    },
  },
  {
    lines: [
      "Hiten built and architected eventenclavecu.xyz",
      "for the Department of Art and Cultural Affairs",
      "from the start to the end. His engineering prowess,",
      "intuitive UI, and rock-solid platform handling",
      "elevated Chandigarh University's live event operations.",
    ],
    name: "Department of Art & Cultural Affairs",
    role: "Chandigarh University",
    caseStudy: {
      label: "eventenclavecu.xyz",
      href: "https://eventenclavecu.xyz/",
    },
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const titleMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const isTransitioning = useRef(false);

  // Procedural Noise Film Grain Canvas
  useEffect(() => {
    const canvas = grainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = 256;
    const height = 256;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imgData.data.buffer);

    let frame = 0;
    let isVisible = false;

    const renderGrain = () => {
      if (!isVisible) return;
      frame++;
      if (frame % 2 === 0) {
        const len = buffer.length;
        for (let i = 0; i < len; i++) {
          const noise = (Math.random() * 255) | 0;
          buffer[i] = (16 << 24) | (noise << 16) | (noise << 8) | noise;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(renderGrain);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        animId = requestAnimationFrame(renderGrain);
      } else {
        cancelAnimationFrame(animId);
      }
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  // Liquid Title & Entrance Scroll Reveal (Reverse-engineered from Melon Studio)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    try {
      CustomEase.create("appear", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];

    // 1. Liquid title calculation
    const title = titleRef.current;
    const blurEl = titleBlurRef.current;
    const matrixEl = titleMatrixRef.current;

    if (title && blurEl && matrixEl) {
      let targetProgress = 0;
      let smoothedProgress = 0;
      let isSettled = false;
      const maxBlur = 18.0;

      const getMatrixValues = (blur: number, max: number) => {
        const r = Math.min(0.42, 0.5 * Math.min(1, 0.19 + 5.3 / Math.max(blur * (40 / max), 0.01)));
        const i = 24 - 18 * Math.min(1, blur / max);
        return `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${i.toFixed(3)} ${(0.5 - i * r).toFixed(3)}`;
      };

      const titleTrigger = ScrollTrigger.create({
        trigger: title,
        start: "top bottom",
        end: "top 40%",
        onUpdate: (self) => {
          targetProgress = self.progress;
          isSettled = false;
        },
      });
      triggers.push(titleTrigger);

      const titleTicker = () => {
        const diff = targetProgress - smoothedProgress;
        if (Math.abs(diff) < 0.0005) {
          if (isSettled) return;
          smoothedProgress = targetProgress;
          isSettled = true;
        } else {
          smoothedProgress += diff * 0.085;
          isSettled = false;
        }

        const blurVal = maxBlur * (1 - smoothedProgress);
        if (blurVal <= 0.05 || smoothedProgress >= 0.999) {
          title.style.filter = "none";
        } else {
          title.style.filter = "url(#liquid-reviews)";
          blurEl.setAttribute("stdDeviation", blurVal.toFixed(2));
          matrixEl.setAttribute("values", getMatrixValues(blurVal, maxBlur));
        }
      };

      gsap.ticker.add(titleTicker);
      triggers.push({ kill: () => gsap.ticker.remove(titleTicker) } as any);
    }

    // 2. Entrance reveal sequence on scroll
    const markIn = section.querySelector<HTMLElement>(".f-rv__mark-in");
    const activeFigure = section.querySelector<HTMLElement>(".f-rv__item:not([hidden])");
    const lines = activeFigure?.querySelectorAll<HTMLElement>(".f-line");
    const dash = activeFigure?.querySelector<HTMLElement>(".f-rv__dash");
    const metas = activeFigure?.querySelectorAll<HTMLElement>(".f-m__in");
    const nav = navRef.current;

    // Initial hidden transforms
    if (markIn) gsap.set(markIn, { yPercent: 105 });
    if (lines?.length) gsap.set(lines, { yPercent: 105 });
    if (dash) gsap.set(dash, { scaleX: 0, transformOrigin: "0% 50%" });
    if (metas?.length) gsap.set(metas, { yPercent: 105 });
    if (nav) gsap.set(nav, { y: 18, opacity: 0, visibility: "hidden" });

    const enterTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        if (markIn) {
          tl.to(markIn, { yPercent: 0, duration: 0.85, ease: "appear" }, 0);
        }
        if (lines?.length) {
          tl.to(lines, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "appear" }, 0.08);
        }
        if (dash) {
          tl.to(dash, { scaleX: 1, duration: 0.75, ease: "appear" }, 0.25);
        }
        if (metas?.length) {
          tl.to(metas, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "appear" }, 0.3);
        }
        if (nav) {
          tl.to(
            nav,
            { y: 0, opacity: 1, duration: 0.65, ease: "power2.out", onStart: () => { nav.style.visibility = "inherit"; } },
            0.4
          );
        }
      },
    });
    triggers.push(enterTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Carousel Slide Navigation (Smooth exit & stagger entry)
  const goTo = useCallback(
    (nextIdx: number) => {
      if (isTransitioning.current || nextIdx === current) return;
      isTransitioning.current = true;
      setCurrent(nextIdx);

      const stage = stageRef.current;
      if (!stage) {
        isTransitioning.current = false;
        return;
      }

      const allFigures = Array.from(stage.querySelectorAll<HTMLElement>(".f-rv__item"));
      const currentFigure = allFigures[current];
      const nextFigure = allFigures[nextIdx];

      if (!currentFigure || !nextFigure) {
        isTransitioning.current = false;
        return;
      }

      const currentLines = currentFigure.querySelectorAll<HTMLElement>(".f-line");
      const currentMetas = currentFigure.querySelectorAll<HTMLElement>(".f-m__in");
      const currentDash = currentFigure.querySelector<HTMLElement>(".f-rv__dash");

      // Animate current out (roll up)
      const tl = gsap.timeline({
        onComplete: () => {
          currentFigure.hidden = true;
          nextFigure.hidden = false;

          const nextLines = nextFigure.querySelectorAll<HTMLElement>(".f-line");
          const nextMetas = nextFigure.querySelectorAll<HTMLElement>(".f-m__in");
          const nextDash = nextFigure.querySelector<HTMLElement>(".f-rv__dash");

          // Reset initial transform for next item
          gsap.set(nextLines, { yPercent: 105 });
          gsap.set(nextMetas, { yPercent: 105 });
          if (nextDash) gsap.set(nextDash, { scaleX: 0, transformOrigin: "0% 50%" });

          // Stagger animate next in
          const inTl = gsap.timeline({
            onComplete: () => {
              isTransitioning.current = false;
            },
          });

          inTl.to(nextLines, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "appear" }, 0);
          if (nextDash) inTl.to(nextDash, { scaleX: 1, duration: 0.65, ease: "appear" }, 0.15);
          inTl.to(nextMetas, { yPercent: 0, duration: 0.75, stagger: 0.05, ease: "appear" }, 0.2);
        },
      });

      tl.to(currentLines, { yPercent: -105, duration: 0.35, stagger: 0.025, ease: "power2.in" }, 0);
      tl.to(currentMetas, { yPercent: -105, duration: 0.3, stagger: 0.02, ease: "power2.in" }, 0.05);
      if (currentDash) tl.to(currentDash, { scaleX: 0, duration: 0.25, ease: "power2.in" }, 0.05);
    },
    [current]
  );

  const prev = () => goTo((current - 1 + reviews.length) % reviews.length);
  const next = () => goTo((current + 1) % reviews.length);

  return (
    <div className="f-kw relative overflow-hidden">
      {/* Film Grain Background */}
      <div className="f-kw-bg absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="f-kw-grain absolute inset-0 w-full h-full opacity-30 mix-blend-screen pointer-events-none">
          <canvas
            ref={grainCanvasRef}
            className="w-full h-full object-repeat"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>

      <section
        ref={sectionRef}
        className="f-sec f-rv relative z-10"
        id="reviews"
        data-tone="black"
      >
        {/* Liquid Heading SVG Filter */}
        <svg className="sr-only" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter
              id="liquid-reviews"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur ref={titleBlurRef} in="SourceGraphic" stdDeviation="0" result="blur" />
              <feColorMatrix
                ref={titleMatrixRef}
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="contrast"
              />
              <feBlend in="SourceGraphic" in2="contrast" mode="normal" />
            </filter>
          </defs>
        </svg>

        <div className="f-grid">
          <h2
            ref={titleRef}
            className="f-rv__title ts-locked"
            aria-label="What people say"
            data-liquid-head="0.24"
          >
            What people say
          </h2>

          <div
            className="f-rv__box"
            role="group"
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="What people say"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
            }}
          >
            <span ref={markRef} className="f-rv__mark" aria-hidden="true">
              <span className="f-rv__mark-in" style={{ display: "inline-block" }}>
                “
              </span>
            </span>

            <div ref={stageRef} className="f-rv__stage">
              {reviews.map((rev, idx) => (
                <figure
                  key={idx}
                  className="f-rv__item"
                  hidden={idx !== current}
                >
                  <blockquote className="f-rv__quote">
                    {rev.lines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className="f-mask-line-mask f-lmask"
                        style={{ position: "relative", display: "block", textAlign: "start", overflow: "clip" }}
                      >
                        <div
                          className="f-line"
                          style={{ position: "relative", display: "block", textAlign: "start" }}
                        >
                          {line}
                        </div>
                      </div>
                    ))}
                  </blockquote>

                  <figcaption className="f-rv__who">
                    <span className="f-rv__dash" aria-hidden="true"></span>
                    <span className="f-rv__name">
                      <span className="f-m">
                        <span className="f-m__in">{rev.name}</span>
                      </span>
                    </span>
                    <span className="f-rv__role">
                      <span className="f-m">
                        <span className="f-m__in">{rev.role}</span>
                      </span>
                    </span>
                  </figcaption>

                  {rev.caseStudy && (
                    <p className="f-rv__case">
                      <span className="f-m">
                        <span className="f-m__in">
                          <Link
                            className="f-rv__link f-u"
                            href={rev.caseStudy.href}
                            target={rev.caseStudy.href.startsWith("http") ? "_blank" : undefined}
                            rel={rev.caseStudy.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {rev.caseStudy.label}
                            <svg className="f-rv__arr" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M4 12 12 4M5.5 4H12v6.5"></path>
                            </svg>
                          </Link>
                        </span>
                      </span>
                    </p>
                  )}
                </figure>
              ))}
            </div>

            <div
              ref={navRef}
              className="f-rv__nav"
              aria-label="Carousel navigation"
            >
              <button
                className="f-rv__btn"
                type="button"
                aria-label="Previous review"
                onClick={prev}
              >
                ←
              </button>
              <span className="f-rv__count">
                {String(current + 1).padStart(2, "0")}
                <span className="f-rv__sep">/</span>
                {String(reviews.length).padStart(2, "0")}
              </span>
              <button
                className="f-rv__btn"
                type="button"
                aria-label="Next review"
                onClick={next}
              >
                →
              </button>
            </div>

            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Review {current + 1} of {reviews.length}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
