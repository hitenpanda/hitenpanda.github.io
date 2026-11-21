"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const mail = section.querySelector(".f-contact__mail");
    const go = section.querySelector(".f-contact__go");

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (mail) {
          gsap.fromTo(
            mail,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );
        }
        if (go) {
          gsap.fromTo(
            go,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: "power2.out" }
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} className="f-sec f-contact" id="contact" data-tone="black">
      <div className="f-grid">
        <h2 className="sr-only">Contact</h2>
        <a className="f-contact__mail f-u group" href="mailto:hello@hitenpanda.xyz">
          hello@hitenpanda.xyz
        </a>
        <Link className="f-showall f-contact__go cursor-pointer" href="/contact">
          <span className="f-roll">
            <span className="f-roll__in">
              <span className="f-roll__t">Start a project</span>
              <span className="f-roll__t f-roll__t--b" aria-hidden="true">
                Start a project
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
      </div>
    </section>
  );
}
