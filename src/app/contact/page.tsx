"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-revealed", "motion-live");
    document.documentElement.classList.remove("f-loading");
    window.dispatchEvent(new CustomEvent("melon:revealed"));
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@hitenpanda.xyz");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors mb-6 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              back to overview
            </Link>
            <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-4">
              Let&apos;s Talk
            </h1>
            <p className="text-lg md:text-xl text-[#C1E8FF] max-w-2xl font-light">
              Interested in collaborating on autonomous AI systems, embedded hardware, or high-performance reactive web platforms? Get in touch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-2xl border border-[#5483B3]/25 bg-[#052659]/20 space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">DIRECT INQUIRIES</span>
                  <a
                    href="mailto:hello@hitenpanda.xyz"
                    className="text-xl md:text-2xl font-mono text-white hover:text-[#C1E8FF] transition-colors block break-all"
                  >
                    hello@hitenpanda.xyz
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="mt-2 text-xs font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors inline-flex items-center gap-1"
                  >
                    {copied ? "✓ Copied to clipboard" : "Click to copy address"}
                  </button>
                </div>

                <div className="pt-6 border-t border-[#5483B3]/20">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">LOCATION &amp; TIMEZONE</span>
                  <p className="text-base text-[#C1E8FF]">India // IST (UTC +5:30)</p>
                  <p className="text-xs text-[#8892b0] mt-1">Remote-first collaborations worldwide</p>
                </div>

                <div className="pt-6 border-t border-[#5483B3]/20">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">AVAILABILITY</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-sm text-[#C1E8FF]">Open for Q4/Q1 engineering projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-10 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-4">
                  <span className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-mono text-xl">
                    ✓
                  </span>
                  <h3 className="text-2xl font-medium text-white">Message Dispatched</h3>
                  <p className="text-sm text-[#C1E8FF]/80 max-w-md mx-auto">
                    Thanks for reaching out! I typically respond within 24–48 hours. You can also reach me directly at{" "}
                    <a href="mailto:hello@hitenpanda.xyz" className="text-[#C1E8FF] underline">
                      hello@hitenpanda.xyz
                    </a>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full border border-[#5483B3]/40 text-xs font-mono text-[#C1E8FF] hover:border-[#C1E8FF]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 md:p-10 rounded-2xl border border-[#5483B3]/25 bg-[#052659]/15 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-[#5483B3] mb-2 uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-3 rounded-lg bg-[#021024] border border-[#5483B3]/30 text-white placeholder-[#8892b0]/50 text-sm focus:outline-none focus:border-[#C1E8FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#5483B3] mb-2 uppercase">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ada@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[#021024] border border-[#5483B3]/30 text-white placeholder-[#8892b0]/50 text-sm focus:outline-none focus:border-[#C1E8FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#5483B3] mb-2 uppercase">
                      Interest / Domain
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg bg-[#021024] border border-[#5483B3]/30 text-white text-sm focus:outline-none focus:border-[#C1E8FF] transition-colors"
                    >
                      <option value="ai">Autonomous AI Systems &amp; Agents (MIRA AI)</option>
                      <option value="hardware">Hardware Engineering &amp; Robotics (RoboX)</option>
                      <option value="web">Fullstack &amp; Reactive Web Design</option>
                      <option value="hackathon">Hackathon Organization &amp; Mentorship (ccuhacks)</option>
                      <option value="other">General Inquiries &amp; Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#5483B3] mb-2 uppercase">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell me about what you're building, timeline, and goals..."
                      className="w-full px-4 py-3 rounded-lg bg-[#021024] border border-[#5483B3]/30 text-white placeholder-[#8892b0]/50 text-sm focus:outline-none focus:border-[#C1E8FF] transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#5483B3] text-white font-medium hover:bg-[#C1E8FF] hover:text-[#021024] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#5483B3]/20"
                  >
                    Send message
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
