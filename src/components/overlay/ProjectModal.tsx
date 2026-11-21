"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

interface ProjectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function ProjectModal({
  isOpen = false,
  onClose,
  children,
}: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [pullProgress, setPullProgress] = useState(0);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Entrance & Exit animation
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (isOpen) {
      el.removeAttribute("hidden");
      gsap.fromTo(
        el,
        { yPercent: 100, opacity: 0.8 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  // Touch pull-to-dismiss gesture
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !isOpen) return;

    let startY = 0;
    let currentY = 0;
    const threshold = 120;

    const onTouchStart = (e: TouchEvent) => {
      const scrollEl = el.querySelector(".ov-scroll");
      if (scrollEl && scrollEl.scrollTop <= 0) {
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!startY) return;
      currentY = e.touches[0].clientY;
      const delta = Math.max(0, currentY - startY);
      const progress = Math.min(1, delta / threshold);
      setPullProgress(progress);

      // Dasharray calculation for circumference (2 * PI * 10 ≈ 62.83)
      if (ringRef.current) {
        const circumference = 62.83;
        ringRef.current.style.strokeDashoffset = `${circumference * (1 - progress)}`;
      }

      gsap.set(el, { y: delta * 0.5 });
    };

    const onTouchEnd = () => {
      if (!startY) return;
      const delta = Math.max(0, currentY - startY);

      if (delta >= threshold && onClose) {
        gsap.to(el, {
          yPercent: 100,
          duration: 0.35,
          ease: "power2.in",
          onComplete: onClose,
        });
      } else {
        gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = "62.83";
        }
      }

      startY = 0;
      currentY = 0;
      setPullProgress(0);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return (
      <div
        ref={overlayRef}
        id="overlay"
        className="overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Project"
        aria-hidden="true"
        hidden
      >
        <div className="ov-bar">
          <Link className="ov-close" href="/" data-close="true">
            Close
          </Link>
        </div>
        <button className="ov-pull" type="button" tabIndex={-1}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ov-pull__track" cx="12" cy="12" r="10"></circle>
            <circle
              ref={ringRef}
              className="ov-pull__ring"
              cx="12"
              cy="12"
              r="10"
              style={{ strokeDasharray: 62.83, strokeDashoffset: 62.83 }}
            ></circle>
          </svg>
          <span className="ov-pull__label"></span>
        </button>
        <div className="ov-scroll" data-lenis-prevent="true">
          <div className="ov-content">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      id="overlay"
      className="overlay is-open"
      role="dialog"
      aria-modal="true"
      aria-label="Project"
      aria-hidden="false"
    >
      <div className="ov-bar">
        <button
          className="ov-close cursor-pointer"
          onClick={onClose}
          type="button"
          data-close="true"
        >
          Close
        </button>
      </div>
      <button className="ov-pull" type="button" tabIndex={-1}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle className="ov-pull__track" cx="12" cy="12" r="10"></circle>
          <circle
            ref={ringRef}
            className="ov-pull__ring"
            cx="12"
            cy="12"
            r="10"
            style={{ strokeDasharray: 62.83, strokeDashoffset: 62.83 }}
          ></circle>
        </svg>
        <span className="ov-pull__label"></span>
      </button>
      <div className="ov-scroll" data-lenis-prevent="true">
        <div className="ov-content">{children}</div>
      </div>
    </div>
  );
}
