"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { getDailyInsights, InsightArticle } from "@/lib/insights";

gsap.registerPlugin(ScrollTrigger, CustomEase);

const articles: InsightArticle[] = getDailyInsights();

// Clip path constants matching Melon Studio
const K = {
  full: "inset(0% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

// Directional weighted edge detector from Melon Studio chunk
function getClosestEdge(rect: DOMRect, x: number, y: number): "top" | "bottom" | "left" | "right" {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return "left";
  const top = (y - rect.top) / rect.height;
  const bottom = (rect.bottom - y) / rect.height;
  const left = ((x - rect.left) / rect.width) * 4; // 4x weighting for row aspect ratio
  const right = ((rect.right - x) / rect.width) * 4;

  const entries: ["top" | "bottom" | "left" | "right", number][] = [
    ["top", top],
    ["bottom", bottom],
    ["left", left],
    ["right", right],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

function BrandLogo({ source }: { source: string }) {
  if (source === "Forbes") {
    return (
      <span className="inline-flex items-center gap-1.5 opacity-90 text-current" title="Forbes">
        <svg viewBox="0 0 200 54" className="h-3 w-auto fill-current">
          <path d="M113.3 18.2c0-5.8.1-11.2.4-16.2L98.4 4.9v1.4l1.5.2c1.1.1 1.8.5 2.2 1.1.4.7.7 1.7.9 3.2.2 2.9.4 9.5.3 19.9 0 10.3-.1 16.8-.3 19.3 5.5 1.2 9.8 1.7 13 1.7 6 0 10.7-1.7 14.1-5.2 3.4-3.4 5.2-8.2 5.2-14.1 0-4.7-1.3-8.6-3.9-11.7-2.6-3.1-5.9-4.6-9.8-4.6-2.6 0-5.3.7-8.3 2.1zm.3 30.8c-.2-3.2-.4-12.8-.4-28.5.9-.3 2.1-.5 3.6-.5 2.4 0 4.3 1.2 5.7 3.7 1.4 2.5 2.1 5.5 2.1 9.3 0 4.7-.8 8.5-2.4 11.7-1.6 3.1-3.6 4.7-6.1 4.7-.8-.2-1.6-.3-2.5-.4zM41 3H1v2l2.1.2c1.6.3 2.7.9 3.4 1.8.7 1 1.1 2.6 1.2 4.8.8 10.8.8 20.9 0 30.2-.2 2.2-.6 3.8-1.2 4.8-.7 1-1.8 1.6-3.4 1.8l-2.1.3v2h25.8v-2l-2.7-.2a4.9 4.9 0 0 1-3.4-1.8c-.7-1-1.1-2.6-1.2-4.8-.3-4-.5-8.6-.5-13.7l5.4.1c2.9.1 4.9 2.3 5.9 6.7h2V18.9h-2c-1 4.3-2.9 6.5-5.9 6.6l-5.4.1c0-9 .2-15.4.5-19.3h7.9c5.6 0 9.4 3.6 11.6 10.8l2.4-.7L41 3zm-4.7 30.8c0 5.2 1.5 9.5 4.4 12.9 2.9 3.4 7.2 5 12.6 5s9.8-1.7 13-5.2c3.2-3.4 4.7-7.7 4.7-12.9s-1.5-9.5-4.4-12.9c-2.9-3.4-7.2-5-12.6-5s-9.8 1.7-13 5.2c-3.2 3.4-4.7 7.7-4.7 12.9zm22.3-11.4c1.2 2.9 1.7 6.7 1.7 11.3 0 10.6-2.2 15.8-6.5 15.8-2.2 0-3.9-1.5-5.1-4.5-1.2-3-1.7-6.8-1.7-11.3C47 23.2 49.2 18 53.5 18c2.2-.1 3.9 1.4 5.1 4.4zm84.5 24.3c3.3 3.3 7.5 5 12.5 5 3.1 0 5.8-.6 8.2-1.9 2.4-1.2 4.3-2.7 5.6-4.5l-1-1.2c-2.2 1.7-4.7 2.5-7.6 2.5-4 0-7.1-1.3-9.2-4-2.2-2.7-3.2-6.1-3-10.5H170c0-4.8-1.2-8.7-3.7-11.8-2.5-3-6-4.5-10.5-4.5-5.6 0-9.9 1.8-13 5.3-3.1 3.5-4.6 7.8-4.6 12.9 0 5.2 1.6 9.4 4.9 12.7zm7.4-25.1c1.1-2.4 2.5-3.6 4.4-3.6 3 0 4.5 3.8 4.5 11.5l-10.6.2c.1-3 .6-5.7 1.7-8.1zm46.4-4c-2.7-1.2-6.1-1.9-10.2-1.9-4.2 0-7.5 1.1-10 3.2s-3.8 4.7-3.8 7.8c0 2.7.8 4.8 2.3 6.3 1.5 1.5 3.9 2.8 7 3.9 2.8 1 4.8 2 5.8 2.9 1 1 1.6 2.1 1.6 3.6 0 1.4-.5 2.7-1.6 3.7-1 1.1-2.4 1.6-4.2 1.6-4.4 0-7.7-3.2-10-9.6l-1.7.5.4 10c3.6 1.4 7.6 2.1 12 2.1 4.6 0 8.1-1 10.7-3.1 2.6-2 3.9-4.9 3.9-8.5 0-2.4-.6-4.4-1.9-5.9-1.3-1.5-3.4-2.8-6.4-4-3.3-1.2-5.6-2.3-6.8-3.3-1.2-1-1.8-2.2-1.8-3.7s.4-2.7 1.3-3.7 2-1.4 3.4-1.4c4 0 6.9 2.9 8.7 8.6l1.7-.5-.4-8.6zm-96.2-.9c-1.4-.7-2.9-1-4.6-1-1.7 0-3.4.7-5.3 2.1-1.9 1.4-3.3 3.3-4.4 5.9l.1-8-15.2 3v1.4l1.5.1c1.9.2 3 1.7 3.2 4.4.6 6.2.6 12.8 0 19.8-.2 2.7-1.3 4.1-3.2 4.4l-1.5.2v1.9h21.2V49l-2.7-.2c-1.9-.2-3-1.7-3.2-4.4-.6-5.8-.7-12-.2-18.4.6-1 1.9-1.6 3.9-1.8 2-.2 4.3.4 6.7 1.8l3.7-9.3z" />
        </svg>
      </span>
    );
  }
  if (source === "GitHub") {
    return (
      <span className="inline-flex items-center gap-1.5 opacity-90 text-current" title="GitHub">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </span>
    );
  }
  if (source === "SubStack") {
    return (
      <span className="inline-flex items-center gap-1.5 opacity-90 text-current" title="Substack">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#FF6719]">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
      </span>
    );
  }
  if (source.includes("X") || source.includes("Twitter")) {
    return (
      <span className="inline-flex items-center gap-1.5 opacity-90 text-current" title="X">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
        </svg>
      </span>
    );
  }
  return null;
}

export default function Insights() {
  const [activeSlug, setActiveSlug] = useState<string>(articles[0].slug);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const titleMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const showallRef = useRef<HTMLAnchorElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Directional Hover Engine
  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLAnchorElement>, slug: string) => {
    if (e.pointerType === "touch") return;
    setActiveSlug(slug);
    const link = e.currentTarget;
    const fill = link.querySelector<HTMLElement>(".hb-fill");
    if (!fill) return;

    link.classList.add("is-hot");
    const edge = getClosestEdge(link.getBoundingClientRect(), e.clientX, e.clientY);
    gsap.fromTo(
      fill,
      { clipPath: K[edge] },
      { clipPath: K.full, duration: 0.38, ease: "power3.out", overwrite: true }
    );
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "touch") return;
    const link = e.currentTarget;
    const fill = link.querySelector<HTMLElement>(".hb-fill");
    if (!fill) return;

    link.classList.remove("is-hot");
    const edge = getClosestEdge(link.getBoundingClientRect(), e.clientX, e.clientY);
    gsap.to(fill, {
      clipPath: K[edge],
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
    });
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLAnchorElement>, slug: string) => {
    setActiveSlug(slug);
    const link = e.currentTarget;
    const fill = link.querySelector<HTMLElement>(".hb-fill");
    if (!fill) return;

    link.classList.add("is-hot");
    gsap.fromTo(
      fill,
      { clipPath: K.left },
      { clipPath: K.full, duration: 0.38, ease: "power3.out", overwrite: true }
    );
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const fill = link.querySelector<HTMLElement>(".hb-fill");
    if (!fill) return;

    link.classList.remove("is-hot");
    gsap.to(fill, {
      clipPath: K.right,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    try {
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];

    // --- 1. Liquid Title Animation (matches Melon Studio data-liquid-head="0.24") ---
    const title = titleRef.current;
    const blurEl = titleBlurRef.current;
    const matrixEl = titleMatrixRef.current;

    let targetProgress = 0;
    let smoothedProgress = 0;
    let isSettled = false;
    let maxBlur = 17.28;

    const computeMaxBlur = () => {
      if (!title) return;
      const fontSize = parseFloat(window.getComputedStyle(title).fontSize);
      if (fontSize > 0) {
        maxBlur = Math.min(40, Math.max(2, 0.24 * fontSize));
      }
    };
    computeMaxBlur();

    const getMatrixValues = (blur: number, max: number) => {
      const r = Math.min(0.42, 0.5 * Math.min(1, 0.19 + 5.3 / Math.max(blur * (40 / max), 0.01)));
      const i = 24 - 18 * Math.min(1, blur / max);
      return `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${i.toFixed(3)} ${(0.5 - i * r).toFixed(3)}`;
    };

    if (title && blurEl && matrixEl) {
      const titleTrigger = ScrollTrigger.create({
        trigger: title,
        start: "top bottom",
        end: "top 40%",
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
      triggers.push(titleTrigger);

      targetProgress = titleTrigger.progress;
      smoothedProgress = titleTrigger.progress;

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
          title.style.filter = "url(#liquid-insights)";
          blurEl.setAttribute("stdDeviation", blurVal.toFixed(2));
          matrixEl.setAttribute("values", getMatrixValues(blurVal, maxBlur));
        }
      };

      gsap.ticker.add(titleTicker);
      triggers.push({ kill: () => gsap.ticker.remove(titleTicker) } as any);
    }

    // --- 2. "All notes" Button Scroll Animation (matches Melon Studio function d) ---
    const showall = showallRef.current;
    if (showall) {
      const rollIn = showall.querySelector<HTMLElement>(".f-roll__in");
      const arrs = showall.querySelector<HTMLElement>(".f-showall__arrs");

      const revealBtn = (instant = false) => {
        if (instant) {
          if (rollIn) gsap.set(rollIn, { clearProps: "transform" });
          if (arrs) gsap.set(arrs, { clearProps: "opacity,visibility,transform" });
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (rollIn) gsap.set(rollIn, { clearProps: "transform" });
            if (arrs) gsap.set(arrs, { clearProps: "opacity,visibility,transform" });
          },
        });

        if (rollIn) {
          tl.fromTo(
            rollIn,
            { yPercent: 105 },
            { yPercent: 0, duration: 1.2, ease: "reveal" },
            0
          );
        }

        if (arrs) {
          tl.fromTo(
            arrs,
            { autoAlpha: 0, x: -6 },
            { autoAlpha: 1, x: 0, duration: 0.9, ease: "reveal" },
            0.1
          );
        }
      };

      const rect = showall.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealBtn(true);
      } else {
        if (rollIn) gsap.set(rollIn, { yPercent: 105 });
        if (arrs) gsap.set(arrs, { autoAlpha: 0, x: -6 });

        const btnTrigger = ScrollTrigger.create({
          trigger: showall,
          start: "top 85%",
          once: true,
          onEnter: () => revealBtn(false),
          onRefresh: () => {
            if (showall.getBoundingClientRect().top < window.innerHeight * 0.85) {
              revealBtn(true);
            }
          },
        });
        triggers.push(btnTrigger);
      }
    }

    // --- 3. Sticky Preview Frame Scroll Reveal (.hb1-peek) ---
    const peek = peekRef.current;
    if (peek) {
      const peekFrame = peek.querySelector<HTMLElement>(".hb1-peek__frame");
      const peekImgs = peek.querySelectorAll<HTMLElement>(".hb-img");

      const revealPeek = (instant = false) => {
        if (instant) {
          if (peekFrame) gsap.set(peekFrame, { clearProps: "clipPath" });
          if (peekImgs.length) gsap.set(peekImgs, { clearProps: "transform,opacity,visibility" });
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (peekFrame) gsap.set(peekFrame, { clearProps: "clipPath" });
            if (peekImgs.length) gsap.set(peekImgs, { clearProps: "transform,opacity,visibility" });
          },
        });

        if (peekFrame) {
          tl.fromTo(
            peekFrame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out" },
            0
          );
        }

        if (peekImgs.length) {
          tl.fromTo(
            peekImgs,
            { yPercent: 18, scale: 1.08, transformOrigin: "50% 100%" },
            { yPercent: 0, scale: 1, duration: 1.2, ease: "expo.out" },
            0
          );
        }
      };

      const rect = peek.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealPeek(true);
      } else {
        if (peekFrame) gsap.set(peekFrame, { clipPath: "inset(100% 0% 0% 0%)" });
        if (peekImgs.length) gsap.set(peekImgs, { yPercent: 18, scale: 1.08, transformOrigin: "50% 100%" });

        const peekTrigger = ScrollTrigger.create({
          trigger: peek,
          start: "top 85%",
          once: true,
          onEnter: () => revealPeek(false),
          onRefresh: () => {
            if (peek.getBoundingClientRect().top < window.innerHeight * 0.85) {
              revealPeek(true);
            }
          },
        });
        triggers.push(peekTrigger);
      }
    }

    // --- 4. Insights Rows Reveal (matches Melon Studio function(e,t)) ---
    const isPhone = window.innerWidth <= 809.98;
    const lineDur = isPhone ? 0.9 : 1.2;
    const ruleDur = isPhone ? 1.2 : 1.7;

    rowRefs.current.forEach((row) => {
      if (!row) return;

      const rule = row.querySelector(".f-rule");
      const labels = row.querySelectorAll<HTMLElement>(".hb1-date, .hb1-meta > span");
      const textInners = row.querySelectorAll<HTMLElement>(".f-m__in");
      const thumb = row.querySelector<HTMLElement>(".hb1-thumb");
      const thumbImg = thumb?.querySelector<HTMLElement>(".hb-img");

      const revealRow = (instant = false) => {
        if (instant) {
          if (rule) gsap.set(rule, { clearProps: "transform,transformOrigin" });
          if (labels.length) gsap.set(labels, { clearProps: "transform,clipPath" });
          if (textInners.length) gsap.set(textInners, { clearProps: "transform" });
          if (thumb) gsap.set(thumb, { clearProps: "clipPath" });
          if (thumbImg) gsap.set(thumbImg, { clearProps: "transform" });
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (rule) gsap.set(rule, { clearProps: "transform,transformOrigin" });
            if (labels.length) gsap.set(labels, { clearProps: "transform,clipPath" });
            if (textInners.length) gsap.set(textInners, { clearProps: "transform" });
            if (thumb) gsap.set(thumb, { clearProps: "clipPath" });
            if (thumbImg) gsap.set(thumbImg, { clearProps: "transform" });
          },
        });

        if (rule) {
          tl.to(
            rule,
            {
              scaleX: 1,
              duration: ruleDur,
              ease: "reveal",
            },
            0
          );
        }

        if (labels.length) {
          tl.to(
            labels,
            {
              yPercent: 0,
              clipPath: "inset(-20% -6% -20% -6%)",
              duration: lineDur,
              ease: "reveal",
              stagger: 0.05,
            },
            0.08
          );
        }

        if (textInners.length) {
          tl.to(
            textInners,
            {
              yPercent: 0,
              duration: lineDur,
              ease: "reveal",
              stagger: 0.06,
            },
            0.08
          );
        }

        if (thumb) {
          tl.to(
            thumb,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              ease: "expo.out",
            },
            0
          );
        }

        if (thumbImg) {
          tl.to(
            thumbImg,
            {
              yPercent: 0,
              scale: 1,
              duration: 1.2,
              ease: "expo.out",
            },
            0
          );
        }
      };

      const rect = row.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealRow(true);
      } else {
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
        if (labels.length) gsap.set(labels, { yPercent: 100, clipPath: "inset(-120% -6% 100% -6%)" });
        if (textInners.length) gsap.set(textInners, { yPercent: 105 });
        if (thumb) gsap.set(thumb, { clipPath: "inset(100% 0% 0% 0%)" });
        if (thumbImg) gsap.set(thumbImg, { yPercent: 18, scale: 1.08, transformOrigin: "50% 100%" });

        const st = ScrollTrigger.create({
          trigger: row,
          start: "top 85%",
          once: true,
          onEnter: () => revealRow(false),
          onRefresh: () => {
            if (row.getBoundingClientRect().top < window.innerHeight * 0.85) {
              revealRow(true);
            }
          },
        });
        triggers.push(st);
      }
    });

    // --- 5. Terminal rule expansion ---
    const endRow = section.querySelector<HTMLElement>(".f-row--end");
    if (endRow) {
      const endRule = endRow.querySelector<HTMLElement>(".f-rule");
      if (endRule) {
        const revealEndRule = (instant = false) => {
          if (instant) {
            gsap.set(endRule, { clearProps: "transform,transformOrigin" });
            return;
          }
          gsap.to(endRule, {
            scaleX: 1,
            duration: ruleDur,
            ease: "reveal",
            onComplete: () => {
              gsap.set(endRule, { clearProps: "transform,transformOrigin" });
            },
          });
        };

        const rect = endRow.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          revealEndRule(true);
        } else {
          gsap.set(endRule, { scaleX: 0, transformOrigin: "0% 50%" });
          const endSt = ScrollTrigger.create({
            trigger: endRow,
            start: "top 85%",
            once: true,
            onEnter: () => revealEndRule(false),
            onRefresh: () => {
              if (endRow.getBoundingClientRect().top < window.innerHeight * 0.85) {
                revealEndRule(true);
              }
            },
          });
          triggers.push(endSt);
        }
      }
    }

    return () => {
      triggers.forEach((st) => st?.kill?.());
    };
  }, []);

  return (
    <section ref={sectionRef} className="f-sec f-ins" id="insights" data-tone="white">
      {/* Liquid Title SVG Filter */}
      <svg className="sr-only" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter
            id="liquid-insights"
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

      <div className="f-grid hb1">
        <header className="hb-head hb1-head">
          <h2 ref={titleRef} className="f-title" data-liquid-head="0.24">
            Insights
          </h2>
          <Link ref={showallRef} className="f-showall hb-all cursor-pointer" href="/insights">
            <span className="f-roll">
              <span className="f-roll__in">
                <span className="f-roll__t">All notes</span>
                <span className="f-roll__t f-roll__t--b" aria-hidden="true">
                  All notes
                </span>
              </span>
            </span>
            <span className="f-showall__arrs" aria-hidden="true">
              <svg className="f-showall__arr" viewBox="0 0 16 16">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <svg className="f-showall__arr f-showall__arr--b" viewBox="0 0 16 16">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </Link>
        </header>

        {/* Sticky Desktop Preview Peek Frame */}
        <div ref={peekRef} className="hb1-peek" aria-hidden="true">
          <div
            className="hb1-peek__frame hb-pic pfx relative overflow-hidden"
            data-post-media="true"
            data-post={activeSlug}
          >
            {articles.map((art) => (
              <span
                key={art.slug}
                className={`pfx__l hb1-peek__l ${activeSlug === art.slug ? "is-on" : ""}`}
                data-slug={art.slug}
              >
                <Image
                  alt={art.title}
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="hb-img object-cover w-full h-full"
                  src={art.thumbnail}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Article Rows List */}
        <ol ref={listRef} className="f-list hb1-list">
          {articles.map((art, idx) => (
            <li
              key={art.slug}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              className="f-row"
              data-post-item="true"
            >
              <span className="f-rule" aria-hidden="true"></span>
              <Link
                className="hb1-a"
                data-post={art.slug}
                href={`/insights/${art.slug}`}
                onPointerEnter={(e) => handlePointerEnter(e, art.slug)}
                onPointerLeave={handlePointerLeave}
                onFocus={(e) => handleFocus(e, art.slug)}
                onBlur={handleBlur}
              >
                {/* Directional Hover Fill Layer */}
                <span className="hb-fill" aria-hidden="true"></span>

                <time className="hb1-date" dateTime={art.publishedDate}>
                  {art.dateDisplay}
                </time>

                <div className="hb1-main">
                  <div className="flex items-center gap-2 mb-1.5 text-[#5483B3]">
                    <BrandLogo source={art.source} />
                    <span className="text-[12px] font-mono tracking-wider opacity-85">
                      {art.sourceLabel}
                    </span>
                  </div>
                  <h3 className="hb1-title" data-no-swap="" data-post-title="true">
                    <span className="f-m">
                      <span className="f-m__in">{art.title}</span>
                    </span>
                  </h3>
                  <span className="hb1-ex">
                    <span className="f-m">
                      <span className="f-m__in">{art.excerpt}</span>
                    </span>
                  </span>
                </div>

                <span className="hb1-meta">
                  <span>{art.category}</span>
                  <span className="hb1-read">
                    {art.readTime}
                    <svg
                      className="hb-arr"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </span>

                <span className="hb1-thumb hb-pic" aria-hidden="true" data-post-media="true">
                  <Image
                    alt={art.title}
                    loading="lazy"
                    width={720}
                    height={900}
                    className="hb-img object-cover w-full h-full rounded"
                    src={art.thumbnail}
                  />
                </span>
              </Link>
            </li>
          ))}
          <li className="f-row f-row--end" aria-hidden="true">
            <span className="f-rule"></span>
          </li>
        </ol>
      </div>
    </section>
  );
}
