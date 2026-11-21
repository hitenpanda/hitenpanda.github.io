import re

with open('/tmp/melon_sections/clients.html', 'r', encoding='utf-8') as fp:
    txt = fp.read()

# Cut off after </section>
idx = txt.find('</section>')
if idx != -1:
    txt = txt[:idx + len('</section>')]

# Convert class to className
jsx = re.sub(r'\bclass=', 'className=', txt)
jsx = re.sub(r'\btabindex=', 'tabIndex=', jsx)

svg_attrs = {
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'clip-path': 'clipPath',
    'xlink:href': 'xlinkHref',
    'fill-opacity': 'fillOpacity',
    'xmlns:xlink': 'xmlnsXlink'
}
for old, new in svg_attrs.items():
    jsx = jsx.replace(f' {old}=', f' {new}=')

# style attribute conversion
def replace_style(m):
    s = m.group(1)
    parts = [p.strip() for p in s.split(';') if p.strip()]
    props = []
    for p in parts:
        if ':' in p:
            k, v = p.split(':', 1)
            props.append(f"['{k.strip()}' as any]: '{v.strip()}'")
    return 'style={{ ' + ', '.join(props) + ' }}'

jsx = re.sub(r'style=\"([^\"]+)\"', replace_style, jsx)

# Remove HTML comments
jsx = re.sub(r'<!--.*?-->', '', jsx)

# Self-close img tags
jsx = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', jsx)

# Replace section tag
jsx = re.sub(r'<section\s+className=\"f-clients\"', r'<section ref={sectionRef} className="f-clients"', jsx, count=1)
# Replace head div
jsx = re.sub(r'<div\s+className=\"f-grid f-clients__head\">', r'<div ref={headRef} className="f-grid f-clients__head">', jsx, count=1)
# Replace h2
jsx = re.sub(r'<h2\s+className=\"f-clients__title\"', r'<h2 ref={titleRef} className="f-clients__title"', jsx, count=1)

# Replace note paragraph to ensure mask wrapping:
note_regex = r'<p\s+className=\"f-clients__note\">(.*?)</p>'
note_repl = r'<p className="f-clients__note"><span className="f-m"><span className="f-m__in">\1</span></span></p>'
jsx = re.sub(note_regex, note_repl, jsx, flags=re.DOTALL)

# Replace ul tag
jsx = re.sub(r'<ul\s+className=\"f-cl\">', r'<ul ref={listRef} className="f-cl">', jsx, count=1)

# Add liquid filter right before f-clients__head
svg_filter = '''{/* Liquid Title SVG Filter for Clients */}
      <svg className="sr-only" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter
            id="liquid-clients"
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
      '''

jsx = jsx.replace('<div ref={headRef} className="f-grid f-clients__head">', svg_filter + '<div ref={headRef} className="f-grid f-clients__head">')

header_code = '''"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const titleMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    try {
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];
    const isPhone = window.innerWidth <= 809.98;
    const dur = isPhone ? 0.9 : 1.2;

    // --- 1. Liquid Title Animation (matches Melon Studio --liquid and filter) ---
    const title = titleRef.current;
    const blurEl = titleBlurRef.current;
    const matrixEl = titleMatrixRef.current;

    let targetProgress = 0;
    let smoothedProgress = 0;
    let isSettled = false;
    let maxBlur = 12.44;

    const computeMaxBlur = () => {
      if (!title) return;
      const fontSize = parseFloat(window.getComputedStyle(title).fontSize);
      if (fontSize > 0) {
        maxBlur = Math.min(30, Math.max(2, 0.24 * fontSize));
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
        end: "top 45%",
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
          title.style.color = "";
          title.style.removeProperty("--liquid");
        } else {
          title.style.filter = "url(#liquid-clients)";
          title.style.setProperty("--liquid", blurVal.toFixed(2));
          const colorPct = (100 * (1 - smoothedProgress)).toFixed(1);
          title.style.color = `color-mix(in srgb, var(--liquid-from) ${colorPct}%, currentColor)`;
          blurEl.setAttribute("stdDeviation", blurVal.toFixed(2));
          matrixEl.setAttribute("values", getMatrixValues(blurVal, maxBlur));
        }
      };

      gsap.ticker.add(titleTicker);
      triggers.push({ kill: () => gsap.ticker.remove(titleTicker) } as any);
    }

    // --- 2. Clients Explanatory Note Animation (matches Melon Studio clients-note) ---
    const head = headRef.current;
    if (head) {
      const noteInners = head.querySelectorAll<HTMLElement>(".f-clients__note .f-m__in");
      const revealNote = (instant = false) => {
        if (instant) {
          if (noteInners.length) gsap.set(noteInners, { clearProps: "transform" });
          return;
        }
        gsap.to(noteInners, {
          yPercent: 0,
          duration: dur,
          ease: "reveal",
          onComplete: () => {
            gsap.set(noteInners, { clearProps: "transform" });
          },
        });
      };

      const rect = head.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealNote(true);
      } else {
        if (noteInners.length) gsap.set(noteInners, { yPercent: 105 });
        const noteSt = ScrollTrigger.create({
          trigger: head,
          start: "top 85%",
          once: true,
          onEnter: () => revealNote(false),
          onRefresh: () => {
            if (head.getBoundingClientRect().top < window.innerHeight * 0.85) {
              revealNote(true);
            }
          },
        });
        triggers.push(noteSt);
      }
    }

    // --- 3. Clients Grid Cells Staggered Entrance (matches Melon Studio function G) ---
    const list = listRef.current;
    if (list) {
      const cells = list.querySelectorAll<HTMLElement>(":scope > .f-cl__cell");
      const revealGrid = (instant = false) => {
        if (instant) {
          if (cells.length) gsap.set(cells, { clearProps: "transform,opacity,visibility" });
          return;
        }

        const tl = gsap.timeline({
          delay: 0.06, // o.at from Melon Studio
          onComplete: () => {
            if (cells.length) gsap.set(cells, { clearProps: "transform,opacity,visibility" });
          },
        });

        tl.to(cells, {
          autoAlpha: 1,
          y: 0,
          duration: dur,
          ease: "reveal",
          stagger: 0.025, // o.cellStep from Melon Studio
        });
      };

      const rect = list.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        revealGrid(true);
      } else {
        if (cells.length) gsap.set(cells, { autoAlpha: 0, y: 18 });
        const listSt = ScrollTrigger.create({
          trigger: list,
          start: "top 85%",
          once: true,
          onEnter: () => revealGrid(false),
          onRefresh: () => {
            if (list.getBoundingClientRect().top < window.innerHeight * 0.85) {
              revealGrid(true);
            }
          },
        });
        triggers.push(listSt);
      }
    }

    return () => {
      triggers.forEach((st) => st?.kill?.());
    };
  }, []);

  return (
'''

full_file = header_code + jsx + '''
  );
}
'''

with open('src/components/sections/Clients.tsx', 'w', encoding='utf-8') as out:
    out.write(full_file)

print('Generated Clients.tsx successfully! File size:', len(full_file))
