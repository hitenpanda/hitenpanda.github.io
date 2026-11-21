"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  tile: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "MIRA AI",
    role: "Founder",
    period: "2025 – Present",
    tile: "/media/experience/mira-ai.jpeg",
  },
  {
    company: "ccuhacks",
    role: "Executive Organizer",
    period: "April 2026 – Present",
    tile: "/media/experience/ccuhacks.jpeg",
  },
  {
    company: "RoboX Club Cu",
    role: "Core Team Member",
    period: "August 2026 – Present",
    tile: "/media/experience/robox-club-cu.jpeg",
  },
  {
    company: "impactEd",
    role: "Co-Founder",
    period: "",
    tile: "/media/experience/impacted.jpeg",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const titleMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const endRowRef = useRef<HTMLLIElement>(null);

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
          title.style.filter = "url(#liquid-xp)";
          blurEl.setAttribute("stdDeviation", blurVal.toFixed(2));
          matrixEl.setAttribute("values", getMatrixValues(blurVal, maxBlur));
        }
      };

      gsap.ticker.add(titleTicker);
      triggers.push({ kill: () => gsap.ticker.remove(titleTicker) } as any);
    }

    // --- 2. Experience Rows Reveal (matches Melon Studio function p) ---
    const isPhone = window.innerWidth <= 809.98;
    const lineDur = isPhone ? 0.9 : 1.2;
    const ruleDur = isPhone ? 1.2 : 1.7;
    const mediaDur = isPhone ? 0.9 : 1.2;

    rowRefs.current.slice(0, experiences.length).forEach((row) => {
      if (!row) return;

      const rule = row.querySelector(".f-rule");
      const tile = row.querySelector(".f-xp__tile");
      const textInners = row.querySelectorAll<HTMLElement>(".f-m__in");

      const revealRow = (instant = false) => {
        if (instant) {
          if (rule) gsap.set(rule, { clearProps: "transform,transformOrigin" });
          if (tile) gsap.set(tile, { clearProps: "transform,opacity,visibility" });
          if (textInners.length) gsap.set(textInners, { clearProps: "transform" });
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (rule) gsap.set(rule, { clearProps: "transform,transformOrigin" });
            if (tile) gsap.set(tile, { clearProps: "transform,opacity,visibility" });
            if (textInners.length) gsap.set(textInners, { clearProps: "transform" });
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

        if (textInners.length) {
          tl.to(
            textInners,
            {
              yPercent: 0,
              duration: lineDur,
              ease: "reveal",
              stagger: 0.05,
            },
            0.06
          );
        }

        if (tile) {
          tl.to(
            tile,
            {
              autoAlpha: 1,
              y: 0,
              duration: mediaDur,
              ease: "reveal",
            },
            0.06
          );
        }
      };

      const rect = row.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealRow(true);
      } else {
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
        if (tile) gsap.set(tile, { autoAlpha: 0, y: 18 });
        if (textInners.length) gsap.set(textInners, { yPercent: 105 });

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

    // --- 3. Terminal Hairline Rule (.f-row--end) ---
    const endRow = endRowRef.current;
    if (endRow) {
      const rule = endRow.querySelector(".f-rule");
      if (rule) {
        const revealEndRule = (instant = false) => {
          if (instant) {
            gsap.set(rule, { clearProps: "transform,transformOrigin" });
            return;
          }
          gsap.to(rule, {
            scaleX: 1,
            duration: ruleDur,
            ease: "reveal",
            onComplete: () => {
              gsap.set(rule, { clearProps: "transform,transformOrigin" });
            },
          });
        };

        const rect = endRow.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          revealEndRule(true);
        } else {
          gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
          const st = ScrollTrigger.create({
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
          triggers.push(st);
        }
      }
    }

    return () => {
      triggers.forEach((st) => st.kill && st.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="ch f-sec f-split f-xp" id="experience" data-tone="black">
      {/* Liquid Title Dynamic SVG Filter Def */}
      <svg
        className="fx-defs"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter
            id="liquid-xp"
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur ref={titleBlurRef} in="SourceGraphic" stdDeviation="0" result="b" />
            <feColorMatrix
              ref={titleMatrixRef}
              in="b"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            />
          </filter>
        </defs>
      </svg>

      <div className="f-grid">
        <header className="f-split__head">
          <h2 ref={titleRef} className="f-title" data-liquid-head="0.24">
            Experience
          </h2>
        </header>

        <div className="f-split__body">
          <ol className="f-list f-xp__list">
            {experiences.map((exp, idx) => (
              <li
                key={idx}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
                className="f-row f-xp__row"
              >
                <span className="f-rule" aria-hidden="true"></span>
                <div className="f-row__in f-xp__main">
                  <Image
                    alt={`${exp.company} logo`}
                    loading="lazy"
                    width={72}
                    height={72}
                    className="f-xp__tile"
                    src={exp.tile}
                  />
                  <div className="f-xp__text">
                    <h3 className="f-xp__company">
                      <span className="f-m">
                        <span className="f-m__in">{exp.company}</span>
                      </span>
                    </h3>
                    <p className="f-xp__role">
                      <span className="f-m">
                        <span className="f-m__in">{exp.role}</span>
                      </span>
                    </p>
                  </div>
                  <span className="f-xp__years">
                    {exp.period ? (
                      <span className="f-m">
                        <span className="f-m__in">{exp.period}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
              </li>
            ))}
            <li ref={endRowRef} className="f-row f-row--end" aria-hidden="true">
              <span className="f-rule"></span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
