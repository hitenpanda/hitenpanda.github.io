"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Color conversions matching Melon Studio modules 17811 & 56385
const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const rgbLuminance = (rgb: [number, number, number]) => {
  const [r, g, b] = rgb.map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (
  c1: [number, number, number],
  c2: [number, number, number]
) => {
  const l1 = rgbLuminance(c1);
  const l2 = rgbLuminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const blendRgb = (
  fg: [number, number, number],
  bg: [number, number, number],
  alpha: number
): [number, number, number] => [
  Math.round(fg[0] * alpha + bg[0] * (1 - alpha)),
  Math.round(fg[1] * alpha + bg[1] * (1 - alpha)),
  Math.round(fg[2] * alpha + bg[2] * (1 - alpha)),
];

const oklabToSrgb = ([L, a, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((val) =>
    Math.round(
      255 *
        Math.min(
          1,
          Math.max(
            0,
            val <= 0.0031308 ? 12.92 * val : 1.055 * val ** (1 / 2.4) - 0.055
          )
        )
    )
  ) as [number, number, number];
};

const srgbToOklab = ([r, g, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const [o, i, a] = [r, g, b].map((c) => toLinear(c / 255));
  const l = Math.cbrt(0.4122214708 * o + 0.5363325363 * i + 0.0514459929 * a);
  const m = Math.cbrt(0.2119034982 * o + 0.6806995451 * i + 0.1073969566 * a);
  const s = Math.cbrt(0.0883024619 * o + 0.2817188376 * i + 0.6299787005 * a);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const oklabToOklchString = (
  [L, a, b]: [number, number, number],
  alpha?: number
): string => {
  const C = Math.hypot(a, b);
  const H = C < 1e-6 ? 0 : ((180 * Math.atan2(b, a)) / Math.PI + 360) % 360;
  const aStr = alpha === undefined ? "" : ` / ${alpha.toFixed(3)}`;
  return `oklch(${(100 * L).toFixed(3)}% ${C.toFixed(5)} ${H.toFixed(2)}${aStr})`;
};

// Melon Studio exact tone parameters (Module 88718)
const lConfig = { band: 0.6, centre: 0.48, pace: 0.14, aa: 4.5 };
const aConfig = { band: 0.85, pace: 0.06 };

// Black tone: #021024 (Midnight Navy) -> OKLab [0.1728, -0.0127, -0.0456]
// White tone: #C1E8FF (Ice Blue)      -> OKLab [0.9106, -0.0302, -0.0416]
const toneSpecs = {
  black: {
    bgL: [0.1728, -0.0127, -0.0456] as [number, number, number],
    fg: [255, 255, 255] as [number, number, number],
    a2: 0.55,
    rule: 0.16,
  },
  white: {
    bgL: [0.9106, -0.0302, -0.0416] as [number, number, number],
    fg: [2, 16, 36] as [number, number, number], // #021024 in sRGB
    a2: 0.62,
    rule: 0.16,
  },
};

// Dynamic tone sequence state
let activeTones: ("black" | "white")[] = ["black", "white", "black", "white", "black"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const cosEase = (v: number) => -(Math.cos(Math.PI * v) - 1) / 2;

export default function ToneManager() {
  const isSetupRef = useRef(false);

  useEffect(() => {
    if (isSetupRef.current) return;
    isSetupRef.current = true;

    const docEl = document.documentElement;
    const bodyEl = document.body;
    const fPage = document.querySelector<HTMLElement>(".f-page");

    let windows: [number, number][] = [];
    let firstWindowStart = 0;
    let isPhone = window.innerWidth <= 809.98;
    let lastCacheKey = "";

    const computeWindows = () => {
      const h = window.innerHeight;
      const docHeight = docEl.scrollHeight;
      const maxScroll = Math.max(0, docHeight - h);
      isPhone = window.innerWidth <= 809.98;

      const band = isPhone ? aConfig.band : lConfig.band;
      const t = h * band;

      // Dynamically discover all active sections with [data-tone]
      const discovered = Array.from(document.querySelectorAll<HTMLElement>("section[data-tone]"));
      const activeSections: { id: string; tone: "black" | "white"; top: number }[] = [];

      for (const sec of discovered) {
        // Skip hidden sections or sections with zero geometry
        if (sec.offsetParent !== null || sec.offsetHeight > 0) {
          const tone = sec.getAttribute("data-tone") as "black" | "white";
          if (tone === "black" || tone === "white") {
            const top = sec.getBoundingClientRect().top + window.scrollY;
            activeSections.push({ id: sec.id, tone, top });
          }
        }
      }

      // Sort strictly by vertical position
      activeSections.sort((a, b) => a.top - b.top);

      // Hero & WorkTrack start as black
      activeTones = ["black", ...activeSections.map((s) => s.tone)];

      windows = activeSections.map((sec) => {
        const r = sec.top - h * lConfig.centre;
        let aStart = r - t / 2;
        let iEnd = r + t / 2;
        if (iEnd > maxScroll) {
          aStart -= iEnd - maxScroll;
          iEnd = maxScroll;
        }
        return [aStart, iEnd];
      });

      firstWindowStart = windows.length > 0 ? windows[0][0] - 1 : 0;
    };

    // Module 88718 pure scroll-to-tone evaluation
    const updateToneFromScroll = (scrollPos: number) => {
      if (!windows.length) return;

      let c = 0;
      let u = 0;
      for (; c < windows.length; c++) {
        const [tStart, rEnd] = windows[c];
        if (scrollPos < tStart) break;
        if (scrollPos < rEnd) {
          u = (scrollPos - tStart) / (rEnd - tStart);
          break;
        }
      }

      const startTone = toneSpecs[activeTones[Math.min(c, activeTones.length - 1)]];
      const endTone = toneSpecs[activeTones[Math.min(c + 1, activeTones.length - 1)]];

      // Exact Melon Studio intra-interval easing formula
      const pace = isPhone ? aConfig.pace : lConfig.pace;
      const p = clamp01((u - pace) / (1 - 2 * pace));
      const s = isPhone ? p : p * p * (3 - 2 * p);
      const y = cosEase(s);

      // Interpolate background in OKLab color space
      const bgLab: [number, number, number] = [
        startTone.bgL[0] + (endTone.bgL[0] - startTone.bgL[0]) * y,
        startTone.bgL[1] + (endTone.bgL[1] - startTone.bgL[1]) * y,
        startTone.bgL[2] + (endTone.bgL[2] - startTone.bgL[2]) * y,
      ];
      const bgRgb = oklabToSrgb(bgLab);

      // WCAG contrast picker: choose foreground that maximizes contrast against current bg
      const contrastStart = contrastRatio(startTone.fg, bgRgb);
      const contrastEnd = contrastRatio(endTone.fg, bgRgb);
      const pickedSpec = contrastEnd > contrastStart ? endTone : startTone;
      const fgRgb = pickedSpec.fg;

      // Secondary text opacity with AA compliance
      let a2 =
        startTone.fg.join() === endTone.fg.join()
          ? startTone.a2 + (endTone.a2 - startTone.a2) * y
          : pickedSpec.a2;
      while (a2 < 1 && contrastRatio(blendRgb(fgRgb, bgRgb, a2), bgRgb) < lConfig.aa) {
        a2 = Math.min(1, a2 + 0.01);
      }

      const rule = startTone.rule + (endTone.rule - startTone.rule) * y;

      // Toggle f-solid at boundary
      docEl.classList.toggle("f-solid", scrollPos >= firstWindowStart);

      // Manage .f-page fixed backdrop visibility
      if (fPage) {
        const isHidden = c === 0 && u === 0;
        const targetVis = isHidden ? "hidden" : "visible";
        if (fPage.style.visibility !== targetVis) {
          fPage.style.visibility = targetVis;
        }
      }

      // Avoid unnecessary DOM property writes
      const cacheKey = `${bgRgb.join(",")}|${fgRgb.join(",")}|${a2.toFixed(3)}|${rule.toFixed(3)}`;
      if (cacheKey === lastCacheKey) return;
      lastCacheKey = cacheKey;

      const bgOklch = oklabToOklchString(bgLab);
      const fgLab = srgbToOklab(fgRgb);
      const fgOklch = oklabToOklchString(fgLab);
      const fg2Oklch = oklabToOklchString(fgLab, a2);
      const ruleOklch = oklabToOklchString(fgLab, rule);
      const invStr = (1 - (fgRgb[0] - 15) / 240).toFixed(3);

      const bStyle = bodyEl.style;
      bStyle.setProperty("--f-bg", bgOklch);
      bStyle.setProperty("--f-fg", fgOklch);
      bStyle.setProperty("--f-fg2", fg2Oklch);
      bStyle.setProperty("--f-rule", ruleOklch);
      bStyle.setProperty("--f-inv", invStr);
    };

    computeWindows();
    updateToneFromScroll(window.scrollY);

    // GSAP ScrollTrigger for tone engine, matching Melon Studio module 88718
    const st = ScrollTrigger.create({
      id: "f-tone",
      start: 0,
      end: "max",
      onUpdate: (self) => updateToneFromScroll(self.scroll()),
      onRefresh: (self) => {
        computeWindows();
        lastCacheKey = "";
        updateToneFromScroll(self.scroll());
      },
    });

    const onResize = () => {
      computeWindows();
      lastCacheKey = "";
      updateToneFromScroll(window.scrollY);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
      isSetupRef.current = false;
      docEl.classList.remove("f-solid");
      if (fPage) fPage.style.visibility = "hidden";
      const b = bodyEl.style;
      b.removeProperty("--f-bg");
      b.removeProperty("--f-fg");
      b.removeProperty("--f-fg2");
      b.removeProperty("--f-rule");
      b.removeProperty("--f-inv");
    };
  }, []);

  return null;
}
