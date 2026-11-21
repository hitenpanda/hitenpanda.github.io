"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function Topbar() {
  const topbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = topbarRef.current;
    if (!el) return;

    try {
      CustomEase.create("reveal", "0.18, 0.66, 0.18, 1");
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const logoImg = el.querySelector(".topbar__logo img");
    const leftNavItems = el.querySelectorAll(".topbar__nav--left .f-nav__in");
    const rightNavItems = el.querySelectorAll(".topbar__nav--right .f-nav__in");
    const animTargets = [logoImg, ...Array.from(leftNavItems), ...Array.from(rightNavItems)].filter(Boolean);

    // Initial state
    if (!reduced && animTargets.length) {
      gsap.set(animTargets, { yPercent: 105, autoAlpha: 0 });
    }

    // Run entrance sequence when revealed
    const runEntrance = () => {
      if (reduced) {
        el.classList.add("f-nav-done");
        return;
      }

      gsap.to(animTargets, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.2,
        stagger: 0.05,
        delay: 0.1,
        ease: "reveal",
        onComplete: () => {
          el.classList.add("f-nav-done");
        },
      });
    };

    window.addEventListener("melon:revealed", runEntrance);
    if (document.documentElement.classList.contains("motion-revealed")) {
      runEntrance();
    }

    // Directional hide / show on scroll (Melon Studio module 41116 c.J parameters)
    const cJ = { px: 96, dur: 0.3, after: 80, up: 24, down: 4 };
    let isHidden = false;

    const setHidden = (hide: boolean) => {
      if (hide !== isHidden) {
        isHidden = hide;
        gsap.to(el, {
          y: hide ? -cJ.px : 0,
          duration: cJ.dur,
          ease: "power1.out",
          overwrite: true,
        });
      }
    };

    let lastScroll = 0;
    const navTrigger = ScrollTrigger.create({
      id: "f-nav",
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const current = self.scroll();
        const diff = current - lastScroll;

        if (current <= cJ.after) {
          setHidden(false);
          lastScroll = current;
          return;
        }

        if (diff > 0) {
          if (diff < cJ.down) return;
          setHidden(true);
          lastScroll = current;
          return;
        }

        if (-diff < cJ.up) return;
        setHidden(false);
        lastScroll = current;
      },
    });

    const onFocusIn = () => setHidden(false);
    el.addEventListener("focusin", onFocusIn);

    // ScrollTrigger to manage blend mode with hero (Melon Studio module 2v6rdw)
    const heroEl = document.getElementById("hero");
    let blendTrigger: ScrollTrigger | null = null;

    if (heroEl) {
      blendTrigger = ScrollTrigger.create({
        id: "topbar-blend",
        trigger: heroEl,
        start: "bottom 96px",
        end: "max",
        onEnter: () => el.classList.add("is-blend"),
        onLeaveBack: () => el.classList.remove("is-blend"),
        onRefresh: (self) => el.classList.toggle("is-blend", self.scroll() >= self.start),
      });
    }

    return () => {
      window.removeEventListener("melon:revealed", runEntrance);
      el.removeEventListener("focusin", onFocusIn);
      navTrigger.kill();
      if (blendTrigger) blendTrigger.kill();
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
      if (animTargets.length) gsap.killTweensOf(animTargets);
    };
  }, []);

  return (
    <header
      ref={topbarRef}
      className="topbar is-blend"
      style={{ willChange: "transform" }}
    >
      <nav className="topbar__nav topbar__nav--left" aria-label="Work & Articles">
        <Link className="f-u group" href="/work">
          <span className="f-nav__in">
            work<sup className="count">(7)</sup>
          </span>
        </Link>
        <Link className="f-u group" href="/insights">
          <span className="f-nav__in">
            articles<sup className="count">(7)</sup>
          </span>
        </Link>
      </nav>

      <Link
        className="topbar__logo group"
        href="#hero"
        data-nav="hero"
        aria-label="Hiten Panda, back to top"
      >
        <Image
          alt="Hiten Panda"
          width={32}
          height={52}
          priority
          className="w-auto h-[48px] transition-opacity duration-200 group-hover:opacity-80 block"
          src="/brand/hiten-panda-logo.svg"
        />
      </Link>

      <nav className="topbar__nav topbar__nav--right" aria-label="About & Contact">
        <Link className="f-u group" href="#about">
          <span className="f-nav__in">about</span>
        </Link>
        <Link className="f-u group" href="#contact">
          <span className="f-nav__in">contact</span>
        </Link>
      </nav>
    </header>
  );
}
