"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

const ledeWords = [
  { text: "I'm", isFace: false },
  { text: "Hiten", isFace: false },
  { text: "", isFace: true },
  { text: "-", isFace: false },
  { text: "Website", isFace: false },
  { text: "Designer", isFace: false },
  { text: "/", isFace: false },
  { text: "Hardware", isFace: false },
  { text: "Engineer", isFace: false },
  { text: "/", isFace: false },
  { text: "AI", isFace: false },
  { text: "Engineer", isFace: false },
  { text: "based", isFace: false },
  { text: "in", isFace: false },
  { text: "India,", isFace: false },
  { text: "deep", isFace: false },
  { text: "into", isFace: false },
  { text: "AI", isFace: false },
  { text: "Systems.", isFace: false },
  { text: "I", isFace: false },
  { text: "build", isFace: false },
  { text: "AI", isFace: false },
  { text: "products,", isFace: false },
  { text: "models,", isFace: false },
  { text: "hardware", isFace: false },
  { text: "projects", isFace: false },
  { text: "and", isFace: false },
  { text: "websites", isFace: false },
  { text: "out", isFace: false },
  { text: "of", isFace: false },
  { text: "interest", isFace: false },
  { text: "and", isFace: false },
  { text: "curiosity.", isFace: false },
];

const bodyLinesP1 = [
  "Currently exploring the intersection ",
  "of modern AI architectures and ",
  "physical hardware. I design and code ",
  "intelligent systems from the ground up, ",
  "bridging the gap between software ",
  "models and tangible devices. Building ",
  "things that think and interact excites me.",
];

const bodyLinesP2 = [
  "Always experimenting with new tech — ",
  "whether it's prototyping custom hardware, ",
  "training and fine-tuning models, or ",
  "crafting fluid web experiences. I love ",
  "taking wild ideas and turning them into ",
  "working, real-world prototypes.",
];

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const blurFiltersRef = useRef<(SVGFEGaussianBlurElement | null)[]>([]);
  const matrixFiltersRef = useRef<(SVGFEColorMatrixElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLElement[]>([]);
  const rollInRef = useRef<HTMLSpanElement>(null);
  const arrsRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const lede = ledeRef.current;
    if (!section || !lede) return;

    try {
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      wordsRef.current.forEach((w) => {
        if (w) {
          w.style.filter = "none";
          w.style.color = "";
        }
      });
      return;
    }

    const n = ledeWords.length;
    const win = 0.22;
    let maxBlur = 14.83;

    // Dynamically calculate max blur based on font size (0.2 * fontSize)
    const computeMaxBlur = () => {
      const fontSize = parseFloat(window.getComputedStyle(lede).fontSize);
      if (fontSize > 0) {
        maxBlur = Math.min(40, Math.max(2, 0.2 * fontSize));
      }
    };
    computeMaxBlur();

    // Word blur tracking array for per-word spring interpolation
    const currentWordBlurs = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      currentWordBlurs[i] = maxBlur;
    }

    let targetProgress = 0;
    let smoothedProgress = 0;
    let isSettled = false;
    const wordSettled = new Uint8Array(n); // 0 = initial, 1 = fully resolved sharp

    // ScrollTrigger updates targetProgress without blocking or stuttering
    const isPhone = window.innerWidth <= 809.98;
    const ledeTrigger = ScrollTrigger.create({
      trigger: lede,
      start: isPhone ? "top 95%" : "top 92%",
      end: isPhone ? "bottom 60%" : "bottom 45%",
      onUpdate: (self) => {
        targetProgress = self.progress;
        isSettled = false;
      },
      onRefresh: (self) => {
        computeMaxBlur();
        targetProgress = self.progress;
        isSettled = false;
      },
    });

    targetProgress = ledeTrigger.progress;
    smoothedProgress = ledeTrigger.progress;

    // Ultra-smooth 120fps physics loop: sleeps when idle (0 DOM overhead)
    const tickerCallback = () => {
      const pDiff = targetProgress - smoothedProgress;
      if (Math.abs(pDiff) < 0.0005) {
        if (isSettled) return; // Completely asleep when stationary!
        smoothedProgress = targetProgress;
        isSettled = true;
      } else {
        smoothedProgress += pDiff * 0.085;
        isSettled = false;
      }

      for (let i = 0; i < n; i++) {
        const wordEl = wordsRef.current[i];
        if (!wordEl) continue;

        const at = n > 1 ? (i / (n - 1)) * (1 - win) : 0;
        const localP = Math.min(1, Math.max(0, (smoothedProgress - at) / win));

        const targetBlur = localP >= 1 ? 0 : maxBlur * Math.pow(1 - localP, 1.6);
        const prevBlur = currentWordBlurs[i];
        const nextBlur = prevBlur + (targetBlur - prevBlur) * 0.12;
        currentWordBlurs[i] = nextBlur;

        if (nextBlur <= 0.08 && localP >= 1) {
          if (wordSettled[i] !== 1) {
            wordEl.style.filter = "none";
            wordEl.style.color = "";
            wordEl.style.removeProperty("--liquid");
            wordSettled[i] = 1;
          }
        } else {
          wordSettled[i] = 0;
          if (Math.abs(nextBlur - prevBlur) < 0.03 && isSettled) continue;

          const blurFilter = blurFiltersRef.current[i];
          const matrixFilter = matrixFiltersRef.current[i];

          if (blurFilter) {
            blurFilter.setAttribute("stdDeviation", nextBlur.toFixed(2));
          }
          if (matrixFilter) {
            const r = Math.min(
              0.42,
              0.5 * Math.min(1, 0.19 + 5.3 / Math.max(nextBlur * (40 / maxBlur), 0.01))
            );
            const val = 24 - 18 * Math.min(1, nextBlur / maxBlur);
            matrixFilter.setAttribute(
              "values",
              `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${val.toFixed(3)} ${(0.5 - val * r).toFixed(3)}`
            );
          }

          const colorA = Math.min(1, nextBlur / ((8 * maxBlur) / 40));
          wordEl.style.filter = `url(#liquid-about-${i})`;
          wordEl.style.color = `color-mix(in srgb, var(--liquid-from, #C1E8FF) ${(100 * colorA).toFixed(1)}%, currentColor)`;
          wordEl.style.setProperty("--liquid", nextBlur.toFixed(2));
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    // ScrollTrigger for body lines reveal and more button
    const bodyEl = bodyRef.current;
    let bodyTrigger: ScrollTrigger | null = null;
    let hasRevealed = false;

    const playReveal = (instant = false) => {
      if (hasRevealed) return;
      hasRevealed = true;

      const validLines = linesRef.current.filter(Boolean);

      if (instant) {
        if (validLines.length) gsap.set(validLines, { clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (validLines.length) gsap.set(validLines, { clearProps: "transform" });
        },
      });

      if (validLines.length) {
        tl.to(
          validLines,
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.035,
            ease: "reveal",
            overwrite: true,
          },
          0
        );
      }
    };

    if (bodyEl) {
      const validLines = linesRef.current.filter(Boolean);

      // Check if already in viewport
      const rect = bodyEl.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        playReveal(true);
      } else {
        if (validLines.length) gsap.set(validLines, { yPercent: 105 });

        bodyTrigger = ScrollTrigger.create({
          trigger: bodyEl,
          start: "top 92%",
          once: true,
          onEnter: () => playReveal(false),
          onRefresh: (self) => {
            if (bodyEl.getBoundingClientRect().top < window.innerHeight * 0.92) {
              playReveal(true);
            }
          },
        });
      }
    }

    // Dedicated Button ScrollTrigger matching Melon Studio function d
    let btnTrigger: ScrollTrigger | null = null;
    const btnEl = buttonRef.current;
    if (btnEl) {
      const rollIn = rollInRef.current;
      const arrs = arrsRef.current;
      if (rollIn && arrs) {
        const isPhone = window.innerWidth <= 809.98;
        const dur = isPhone ? 0.9 : 1.2;

        const revealBtn = (instant = false) => {
          if (instant) {
            gsap.set([rollIn, arrs], { clearProps: "transform,opacity,visibility" });
            return;
          }
          gsap.timeline({
            delay: 0.25,
            onComplete: () => {
              gsap.set([rollIn, arrs], { clearProps: "transform,opacity,visibility" });
            },
          })
          .to(rollIn, { yPercent: 0, duration: dur, ease: "reveal" }, 0)
          .to(arrs, { autoAlpha: 1, x: 0, duration: dur, ease: "reveal" }, 0.1);
        };

        const rect = btnEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          revealBtn(true);
        } else {
          gsap.set(rollIn, { yPercent: 105 });
          gsap.set(arrs, { autoAlpha: 0, x: -6 });

          btnTrigger = ScrollTrigger.create({
            trigger: btnEl,
            start: "top 85%",
            once: true,
            onEnter: () => revealBtn(false),
            onRefresh: () => {
              if (btnEl.getBoundingClientRect().top < window.innerHeight * 0.85) {
                revealBtn(true);
              }
            },
          });
        }
      }
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      ledeTrigger.kill();
      if (bodyTrigger) bodyTrigger.kill();
      if (btnTrigger) btnTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ch f-sec f-about"
      id="about"
      data-tone="white"
    >
      {/* Dynamic SVG Filter Defs for 33 Lede Words */}
      <svg
        className="fx-defs"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          {ledeWords.map((_, i) => (
            <filter
              key={i}
              id={`liquid-about-${i}`}
              x="-20%"
              y="-40%"
              width="140%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                ref={(el) => {
                  blurFiltersRef.current[i] = el;
                }}
                in="SourceGraphic"
                stdDeviation="14.83"
                result="b"
              />
              <feColorMatrix
                ref={(el) => {
                  matrixFiltersRef.current[i] = el;
                }}
                in="b"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6.000 -0.468"
              />
            </filter>
          ))}
        </defs>
      </svg>

      <div className="f-grid">
        <h2 className="sr-only">About me</h2>
        <p ref={ledeRef} className="f-lede">
          {ledeWords.map((w, i) =>
            w.isFace ? (
              <React.Fragment key={i}>
                <span
                  ref={(el) => {
                    wordsRef.current[i] = el;
                  }}
                  className="f-w f-face group cursor-pointer"
                  role="img"
                  aria-label="Hiten"
                  data-liquid-head="0.2"
                  data-liquid-drive=""
                  style={{
                    backgroundColor: "#5483B3",
                    ["--liquid" as any]: "14.83",
                    filter: `url("#liquid-about-${i}")`,
                    color: "color-mix(in srgb, var(--liquid-from, #C1E8FF) 100.0%, currentColor)",
                  }}
                >
                  <Image
                    alt="Hiten"
                    width={120}
                    height={120}
                    decoding="async"
                    className="f-face__img transition-transform duration-500 ease-out group-hover:scale-110 object-cover object-center"
                    style={{ color: "transparent" }}
                    src="/media/home/about/hiten.jpeg"
                  />
                </span>{" "}
              </React.Fragment>
            ) : (
              <React.Fragment key={i}>
                <span
                  ref={(el) => {
                    wordsRef.current[i] = el;
                  }}
                  className="f-w"
                  data-liquid-head="0.2"
                  data-liquid-drive=""
                  style={{
                    ["--liquid" as any]: "14.83",
                    filter: `url("#liquid-about-${i}")`,
                    color: "color-mix(in srgb, var(--liquid-from, #C1E8FF) 100.0%, currentColor)",
                  }}
                >
                  {w.text}
                </span>{" "}
              </React.Fragment>
            )
          )}
        </p>

        <div ref={bodyRef} className="f-about__body">
          <p>
            {bodyLinesP1.map((line, idx) => (
              <span
                key={idx}
                className="f-mask-line-mask f-lmask"
                style={{
                  position: "relative",
                  display: "block",
                  textAlign: "start",
                  overflow: "clip",
                }}
              >
                <span
                  ref={(el) => {
                    if (el) linesRef.current[idx] = el;
                  }}
                  className="f-line"
                  style={{
                    position: "relative",
                    display: "block",
                    textAlign: "start",
                    willChange: "transform",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </p>
          <p>
            {bodyLinesP2.map((line, idx) => (
              <span
                key={idx}
                className="f-mask-line-mask f-lmask"
                style={{
                  position: "relative",
                  display: "block",
                  textAlign: "start",
                  overflow: "clip",
                }}
              >
                <span
                  ref={(el) => {
                    if (el) linesRef.current[bodyLinesP1.length + idx] = el;
                  }}
                  className="f-line"
                  style={{
                    position: "relative",
                    display: "block",
                    textAlign: "start",
                    willChange: "transform",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </p>
        </div>

        <Link
          ref={buttonRef}
          className={`f-showall f-about__more cursor-pointer ${isHovered ? "is-hover" : ""}`}
          href="/about"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="f-roll">
            <span ref={rollInRef} className="f-roll__in">
              <span className="f-roll__t">More about me</span>
              <span className="f-roll__t f-roll__t--b" aria-hidden="true">
                More about me
              </span>
            </span>
          </span>
          <span
            ref={arrsRef}
            className="f-showall__arrs"
            aria-hidden="true"
          >
            <svg className="f-showall__arr" viewBox="0 0 16 16">
              <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <svg className="f-showall__arr f-showall__arr--b" viewBox="0 0 16 16">
              <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
