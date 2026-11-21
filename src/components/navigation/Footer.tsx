"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const [timeStr, setTimeStr] = useState<string>("12:00");
  const [tzStr, setTzStr] = useState<string>("IST");
  const footerRef = useRef<HTMLElement>(null);

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

  // Scroll reveal for footer columns
  useEffect(() => {
    const foot = footerRef.current;
    if (!foot) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cols = foot.querySelectorAll(".f-foot__col, .f-now");
    const bottomRow = foot.querySelector(".foot__row");

    const st = ScrollTrigger.create({
      trigger: foot,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (cols.length) {
          gsap.fromTo(
            cols,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
          );
        }
        if (bottomRow) {
          gsap.fromTo(
            bottomRow,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, delay: 0.35, ease: "power1.out" }
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <footer ref={footerRef} className="foot" id="foot">
      <div className="f-foot__col f-foot__contact">
        <p className="f-foot__label">Contact</p>
        <p className="f-foot__cta flex items-center gap-2">
          <span className="f-foot__dot inline-block w-2 h-2 rounded-full bg-[#34c759] animate-pulse" aria-hidden="true"></span>
          Open to new projects.
        </p>
        <nav className="f-foot__services" aria-label="Services">
          <p className="f-foot__label" aria-hidden="true">
            Services
          </p>
          <ul className="f-foot__list">
            <li>
              <Link className="f-foot__link f-u group" href="/services/saas-product-design">
                SaaS &amp; product design
              </Link>
            </li>
            <li>
              <Link className="f-foot__link f-u group" href="/services/web-design">
                Web design
              </Link>
            </li>
            <li>
              <Link className="f-foot__link f-u group" href="/services/design-for-agencies">
                Design for agencies
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <nav className="f-foot__col f-foot__social" aria-label="Social">
        <p className="f-foot__label" aria-hidden="true">
          Social
        </p>
        <ul className="f-foot__list">
          <li>
            <a
              className="f-foot__link f-u group"
              href="https://www.instagram.com/thehitenpanda"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
              <svg className="f-foot__arr transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className="f-foot__link f-u group"
              href="https://github.com/hitenpanda"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <svg className="f-foot__arr transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className="f-foot__link f-u group"
              href="https://www.linkedin.com/in/hiten-panda/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <svg className="f-foot__arr transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>

      {/* Added is-live class so the 4 equalizer bars dance in real time */}
      <div className="f-now is-live" role="group" aria-label="Listening and reading">
        <p className="f-now__label f-foot__label">Listening &amp; Reading</p>
        <div className="f-now__list">
          <a
            className="f-now__item f-now__music group block"
            href="https://music.youtube.com/watch?v=Gg2TB2OnN6A&si=Gd5qRw1QUJpGVUI4&drli=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="f-cover f-cover--album transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-1" aria-hidden="true">
              <span className="f-rec__gen">
                <span className="f-rec__gen-t">Two Cents</span>
                <span className="f-rec__gen-a">Alumni Cloud</span>
              </span>
            </span>
            <span className="f-now__meta">
              <span className="f-now__kicker flex items-center gap-1.5">
                <span className="f-eq" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </span>
                Now playing
              </span>
              <span className="f-now__title f-u">Two Cents</span>
              <span className="f-now__by">Alumni Cloud</span>
            </span>
          </a>

          <div className="f-now__item f-now__reading group block">
            <span
              className="f-cover f-cover--book transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-1"
              aria-hidden="true"
            >
              <span className="f-book__gen">
                <span className="f-book__gen-a"></span>
                <span className="f-book__gen-t"></span>
              </span>
            </span>
            <span className="f-now__meta">
              <span className="f-now__kicker">Reading</span>
              <span className="f-now__title">Nothing</span>
            </span>
          </div>
        </div>
      </div>

      <span className="f-foot__rule" aria-hidden="true"></span>

      <div className="foot__row">
        <Image
          alt="Hiten Panda"
          loading="lazy"
          width={32}
          height={52}
          className="foot__logo w-auto h-[48px]"
          src="/brand/hiten-panda-logo.svg"
        />
        <p className="f-foot__where">
          <time className="f-clock">{timeStr}</time> <span className="f-clock__tz">{tzStr}</span> Chandigarh, India
        </p>
        <p className="f-foot__copy">© 2026 Hiten Panda</p>
        <nav className="f-foot__legal" aria-label="Legal">
          <ul>
            <li>
              <Link className="f-u" href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="f-u" href="/cookies">
                Cookies
              </Link>
            </li>
            <li>
              <Link className="f-u" href="/terms">
                Terms
              </Link>
            </li>
            <li>
              <Link className="f-u" hrefLang="pl" href="/pl">
                Polski
              </Link>
            </li>
            <li className="f-foot__settings">
              <button type="button" className="f-u f-foot__btn cursor-pointer">
                Cookie settings
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
