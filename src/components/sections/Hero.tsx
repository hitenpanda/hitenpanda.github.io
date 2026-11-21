"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import wordmarkData from "@/data/wordmark.json";
import HeroWave from "@/components/ui/HeroWave";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function Hero() {
  const [timeStr, setTimeStr] = useState<string>("12:00");
  const [tzStr, setTzStr] = useState<string>("IST");

  const heroRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const atfWhatRef = useRef<HTMLDivElement>(null);

  // Time in Chandigarh, India
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setTimeStr(formatter.format(now));
        setTzStr("IST");
      } catch (e) {
        // Fallback
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Wordmark Split and Kinetic Motion
  useEffect(() => {
    const hero = heroRef.current;
    const wmContainer = wordmarkRef.current;
    const silContainer = silhouetteRef.current;
    const atfWhat = atfWhatRef.current;
    if (!hero || !wmContainer || !silContainer) return;

    try {
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Wordmark splitting matching hero centerpiece typography
    const viewBox = wordmarkData.viewBox
      ? wordmarkData.viewBox.split(" ").map(Number)
      : [0, 0, 2400, 595];
    const [a, o, i, s] = viewBox;
    const nY = 6;
    const hPct = (val: number, max: number) => `${((val / max) * 100).toFixed(4)}%`;

    // Measure bounding boxes using invisible SVG
    const svgMeasure = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgMeasure.setAttribute("viewBox", viewBox.join(" "));
    svgMeasure.style.cssText =
      "position:absolute;left:0;top:0;width:10px;height:10px;visibility:hidden;pointer-events:none";

    for (const pD of wordmarkData.paths) {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", pD);
      svgMeasure.append(p);
    }
    document.body.append(svgMeasure);
    const bboxes = [...svgMeasure.children].map((c) => (c as SVGGraphicsElement).getBBox());
    svgMeasure.remove();

    const wmClips: HTMLElement[] = [];
    const silClips: HTMLElement[] = [];
    const letterObjects: {
      layers: HTMLElement[];
      initialY: number;
      speedMult: number;
    }[] = [];

    const speedMultipliers = [1.2, 0.85, 1.45, 0.75, 1.25];

    wordmarkData.paths
      .map((d, idx) => ({ d, b: bboxes[idx], idx }))
      .sort((itemA, itemB) => itemA.b.x - itemB.b.x)
      .forEach(({ d, b: bbox, idx }) => {
        const top = Math.max(o, bbox.y - nY);
        const bot = Math.min(o + s, bbox.y + bbox.height + nY);
        const left = Math.max(a, bbox.x - nY);
        const right = Math.min(a + i, bbox.x + bbox.width + nY);

        const clipPath = `inset(${hPct(top - o, s)} ${hPct(a + i - right, i)} ${hPct(
          o + s - bot,
          s
        )} ${hPct(left - a, i)})`;

        const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a} ${o} ${i} ${s}" width="${i}" height="${s}" preserveAspectRatio="none"><path fill="white" fill-rule="evenodd" d="${d}"/></svg>`;
        const maskUri = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

        const createLayer = (className: string, targetList: HTMLElement[]) => {
          const clipDiv = document.createElement("div");
          clipDiv.className = "f-wm__clip";
          clipDiv.style.clipPath = clipPath;
          clipDiv.style.overflow = "hidden";

          const layerDiv = document.createElement("div");
          layerDiv.className = className;
          layerDiv.style.setProperty("--m", maskUri);
          layerDiv.style.webkitMask = `${maskUri} center / 100% 100% no-repeat`;
          layerDiv.style.mask = `${maskUri} center / 100% 100% no-repeat`;

          clipDiv.append(layerDiv);
          targetList.push(clipDiv);
          return layerDiv;
        };

        const wmL = createLayer("f-wm__l", wmClips);

        letterObjects.push({
          layers: [wmL],
          initialY: Math.max(105, ((bot - top) / s) * 115),
          speedMult: speedMultipliers[idx] || 1,
        });
      });

    wmContainer.replaceChildren(...wmClips);
    silContainer.replaceChildren();
    hero.dataset.wm = "split";

    // Initial states: letter translateY and atf-what translateY
    const atfLines = atfWhat ? atfWhat.querySelectorAll(".atf-line") : [];
    const atfMetas = atfWhat ? atfWhat.querySelectorAll(".atf-meta .atf-m__in") : [];

    if (!reduced) {
      letterObjects.forEach((letter) => {
        gsap.set(letter.layers, { yPercent: letter.initialY });
      });
      if (atfLines.length) {
        gsap.set(atfLines, { yPercent: 105 });
      }
      if (atfMetas.length) {
        gsap.set(atfMetas, { yPercent: 105 });
      }
    }

    // Function to run the kinetic entrance animation
    const runEntrance = () => {
      if (reduced) return;

      const tl = gsap.timeline({
        delay: 0.05,
        onComplete: () => {
          if (atfLines.length) gsap.set(atfLines, { clearProps: "transform" });
          if (atfMetas.length) gsap.set(atfMetas, { clearProps: "transform" });
          letterObjects.forEach((letter) => {
            gsap.set(letter.layers, { clearProps: "transform" });
          });
        },
      });

      // Reveal wordmark letters with stagger & reveal ease
      letterObjects.forEach((letter, i) => {
        tl.to(
          letter.layers,
          {
            yPercent: 0,
            duration: 1.2,
            ease: "reveal",
          },
          i * 0.06
        );
      });

      // Reveal subtitle lines with stagger
      if (atfLines.length) {
        tl.to(
          atfLines,
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "reveal",
          },
          0.34
        );
      }

      // Reveal Poznań metadata
      if (atfMetas.length) {
        tl.to(
          atfMetas,
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "reveal",
          },
          0.44
        );
      }
    };

    // Listen for melon:revealed event from Loader, or trigger if already revealed
    const onRevealed = () => runEntrance();
    window.addEventListener("melon:revealed", onRevealed);

    if (document.documentElement.classList.contains("motion-revealed")) {
      runEntrance();
    }

    // Parallax scroll scrub matching melon.studio
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const scrollY = window.scrollY;
        const progress = self.progress;

        const heroInner = hero.querySelector<HTMLElement>(".hero__inner");
        const heroY = (scrollY * 0.4).toFixed(2);

        if (heroInner) {
          heroInner.style.transform = scrollY > 0 ? `translate3d(0, ${heroY}px, 0)` : "";
        }
        if (atfWhat) {
          if (scrollY > 0) {
            atfWhat.style.setProperty("--hero-y", `${heroY}px`);
          } else {
            atfWhat.style.removeProperty("--hero-y");
          }
        }

        const fade = Math.min(1, Math.max(0, (progress - 0.03) / 0.22));
        hero.style.setProperty("--hero-fade", fade.toFixed(3));
      },
    });

    return () => {
      window.removeEventListener("melon:revealed", onRevealed);
      st.kill();
      wmContainer.replaceChildren();
      silContainer.replaceChildren();
      delete hero.dataset.wm;
    };
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        className="hero"
        id="hero"
        aria-label="Introduction"
        style={{ willChange: "transform" }}
      >
        <div className="hero__inner">
          <div className="hero__logo-blend" aria-hidden="true">
            <div ref={wordmarkRef} className="hero__wordmark"></div>
          </div>
          <div
            ref={silhouetteRef}
            className="hero__silhouette"
            aria-hidden="true"
          ></div>
          <div className="hero__gradient">
            <HeroWave />
          </div>
          <h1 className="sr-only">
            飛天パンダ (Hiten Panda) — UX/UI, web, app and digital experience design studio
          </h1>
        </div>
        <div
          className="hero__fade"
          aria-hidden="true"
        ></div>
      </section>

      <div className="atf-what-box">
        <div ref={atfWhatRef} className="atf-what">
          <p className="atf-st">
            <span className="atf-mask-line-mask atf-lmask">
              <span className="atf-line">I design and build websites, </span>
            </span>
            <span className="atf-mask-line-mask atf-lmask">
              <span className="atf-line">interested in hardware </span>
            </span>
            <span className="atf-mask-line-mask atf-lmask">
              <span className="atf-line">and making fun projects.</span>
            </span>
          </p>
          <div className="atf-meta">
            <p className="atf-meta__l">
              <span className="atf-m">
                <span className="atf-m__in">
                  <time className="f-clock">{timeStr}</time>{" "}
                  <span className="f-clock__tz">{tzStr}</span> Chandigarh, India
                </span>
              </span>
            </p>
            <p className="atf-meta__l">
              <span className="atf-m">
                <span className="atf-m__in">
                  <span className="atf-dot" aria-hidden="true"></span>
                  Open to new projects.
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
