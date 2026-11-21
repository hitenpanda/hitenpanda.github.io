"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const markFillRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const labelLoadingRef = useRef<HTMLSpanElement>(null);
  const labelReadyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Register custom eases
    try {
      CustomEase.create("hesitate", "0.65, 0.01, 0.05, 0.99");
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {
      // Ease registration fallback
    }

    const docEl = document.documentElement;
    docEl.classList.add("f-loading", "motion");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Prevent scrolling and navigation keys during preloader
    const keysToPrevent = new Set([
      " ",
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
    ]);
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const preventKeys = (e: KeyboardEvent) => {
      if (keysToPrevent.has(e.key)) e.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });
    window.addEventListener("keydown", preventKeys, true);

    const cleanupScroll = () => {
      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
      window.removeEventListener("keydown", preventKeys, true);
    };

    const loader = loaderRef.current;
    const bar = barRef.current;
    const markFill = markFillRef.current;
    const content = contentRef.current;
    const panel = panelRef.current;
    const sheet = sheetRef.current;
    const numEl = numRef.current;
    const loadingEl = labelLoadingRef.current;
    const readyEl = labelReadyRef.current;

    const loadingChars = loadingEl?.querySelectorAll<HTMLElement>(".f-ld__ch");
    const readyChars = readyEl?.querySelectorAll<HTMLElement>(".f-ld__ch");

    let countTween: gsap.core.Tween | null = null;
    let exitTl: gsap.core.Timeline | null = null;

    if (reduced) {
      if (loadingEl) loadingEl.style.visibility = "visible";
      if (numEl) numEl.textContent = "100";
      if (bar) gsap.set(bar, { scaleX: 1 });
      if (markFill) gsap.set(markFill, { clipPath: "inset(0% 0% 0% 0%)" });

      const t = setTimeout(() => {
        cleanupScroll();
        docEl.classList.remove("f-loading");
        docEl.classList.add("motion-revealed", "motion-live");
        if (loader) {
          loader.setAttribute("hidden", "");
          loader.setAttribute("aria-hidden", "true");
          loader.style.display = "none";
        }
        window.dispatchEvent(new CustomEvent("melon:revealed"));
        if (onComplete) onComplete();
      }, 500);

      return () => {
        clearTimeout(t);
        cleanupScroll();
      };
    }

    // 1. Setup typography roll:
    // Initial state: characters below baseline
    if (loadingEl) loadingEl.style.visibility = "visible";
    if (readyEl) readyEl.style.visibility = "visible";

    if (loadingChars) {
      gsap.set(loadingChars, { yPercent: 125, autoAlpha: 0 });
      gsap.to(loadingChars, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "hesitate",
        stagger: 0.02,
        delay: 0.1,
      });
    }

    if (readyChars) {
      gsap.set(readyChars, { yPercent: 125, autoAlpha: 0 });
    }

    // 2. Animate counter from 0 to 100 with 'hesitate' curve (exact 2.2s duration from melon.studio)
    const S = { v: 0 };
    let currentCount = 0;

    countTween = gsap.to(S, {
      v: 1,
      duration: 2.2,
      ease: "hesitate",
      onUpdate: () => {
        const e = S.v;
        if (bar) {
          gsap.set(bar, { scaleX: e });
        }
        if (markFill) {
          const rightClip = ((1 - e) * 100).toFixed(2);
          gsap.set(markFill, { clipPath: `inset(0% ${rightClip}% 0% 0%)` });
        }

        const nextCount = Math.max(currentCount, Math.min(100, Math.round(100 * e)));
        if (nextCount !== currentCount) {
          currentCount = nextCount;
          if (numEl) {
            numEl.textContent = String(nextCount).padStart(3, "0");
          }
          if (loader) {
            loader.setAttribute("aria-valuenow", String(nextCount));
          }
        }
      },
      onComplete: () => {
        // Enforce 100% final state
        if (numEl) numEl.textContent = "100";
        if (loader) loader.setAttribute("aria-valuenow", "100");
        if (bar) gsap.set(bar, { scaleX: 1 });
        if (markFill) gsap.set(markFill, { clipPath: "inset(0% 0% 0% 0%)" });

        // Trigger Exit Sequence!
        startExit();
      },
    });

    const startExit = () => {
      cleanupScroll();

      const l = { v: 0 };
      const r = { v: 0 };
      const s = () => {
        const t = window.innerHeight / 100;
        const sVal = Math.min(r.v, l.v + 100 * 0.07);
        if (panel) gsap.set(panel, { y: l.v * t });
        if (sheet) gsap.set(sheet, { y: sVal * t });
      };

      exitTl = gsap.timeline({
        defaults: { ease: "hesitate" },
        onComplete: () => {
          docEl.classList.remove("f-loading");
          docEl.classList.add("motion-revealed", "motion-live");
          if (loader) {
            loader.setAttribute("hidden", "");
            loader.setAttribute("aria-hidden", "true");
            loader.style.display = "none";
          }
          window.dispatchEvent(new CustomEvent("melon:revealed"));
          if (onComplete) onComplete();
        },
      });

      // Character transition: "Loading" rolls up and out, "Ready" rolls up and in
      if (loadingChars) {
        exitTl.to(
          loadingChars,
          { yPercent: -125, autoAlpha: 0, duration: 0.35, stagger: 0.015 },
          0
        );
      }
      if (readyChars) {
        exitTl.to(
          readyChars,
          { yPercent: 0, autoAlpha: 1, duration: 0.45, stagger: 0.02 },
          0.06
        );
      }

      // Brief hold so "READY" is clearly readable before dual-layer curtain wipe
      exitTl.addLabel("hide", "+=0.35");

      if (content) {
        exitTl.to(content, { autoAlpha: 0, duration: 0.5 }, "hide");
      }
      if (bar) {
        exitTl.to(bar, { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5 }, "hide");
      }

      // Black panel & Crimson sheet dual-layer wipe with 7% viewport offset
      exitTl.to(l, { v: -101, duration: 1.0, ease: "hesitate", onUpdate: s }, "hide");
      exitTl.to(r, { v: -101, duration: 1.0, ease: "hesitate", onUpdate: s }, "hide+=0.1");
    };

    return () => {
      cleanupScroll();
      if (countTween) countTween.kill();
      if (exitTl) exitTl.kill();
      docEl.classList.remove("f-loading");
    };
  }, [onComplete]);

  const loadingLetters = ["L", "O", "A", "D", "I", "N", "G"];
  const readyLetters = ["R", "E", "A", "D", "Y"];

  return (
    <div
      ref={loaderRef}
      className="f-ld"
      role="progressbar"
      aria-label="Loading the page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={sheetRef} className="f-ld__sheet" aria-hidden="true"></div>
      <div ref={panelRef} className="f-ld__panel">
        <div ref={contentRef} className="f-ld__content" aria-hidden="true">
          <div className="f-ld__mark">
            <span className="f-ld__mark-ghost"></span>
            <span ref={markFillRef} className="f-ld__mark-fill"></span>
          </div>
          <div className="f-ld__labels">
            <span ref={labelLoadingRef} className="f-ld__label">
              <span className="f-ld__mask f-ld__ln">
                {loadingLetters.map((ch, i) => (
                  <span key={i} className="f-ld__ch">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
            <span ref={labelReadyRef} className="f-ld__label">
              <span className="f-ld__mask f-ld__ln">
                {readyLetters.map((ch, i) => (
                  <span key={i} className="f-ld__ch">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          </div>
          <p className="f-ld__count">
            <span ref={numRef} className="f-ld__num">
              000
            </span>
            <span className="f-ld__pct">%</span>
          </p>
        </div>
        <div ref={barRef} className="f-ld__bar" aria-hidden="true"></div>
      </div>
    </div>
  );
}
