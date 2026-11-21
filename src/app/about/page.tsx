"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";

export default function AboutPage() {
  useEffect(() => {
    document.documentElement.classList.add("motion-revealed", "motion-live");
    document.documentElement.classList.remove("f-loading");
    window.dispatchEvent(new CustomEvent("melon:revealed"));
  }, []);

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors mb-6 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              back to overview
            </Link>
            <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-6">
              About Hiten
            </h1>
            <p className="text-xl md:text-2xl text-[#C1E8FF] max-w-3xl leading-relaxed font-light">
              Website Designer, Hardware Engineer, and AI Engineer based in India. Deep into AI systems, physical computing, and reactive digital experiences.
            </p>
          </div>

          {/* Grid: Photo & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#5483B3]/20 bg-[#052659]/30 aspect-[4/5]">
                <Image
                  src="/hiten.jpeg"
                  alt="Hiten Panda"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-mono text-[#8892b0] border-t border-[#5483B3]/20 pt-4">
                <span>LOC // INDIA (IST)</span>
                <span className="text-[#C1E8FF]">AI &amp; HARDWARE SYSTEMS</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 text-base md:text-lg text-[#C1E8FF]/90 leading-relaxed font-normal">
              <p>
                I build AI products, neural models, hardware projects, and websites out of genuine curiosity. My approach sits at the intersection of raw silicon and expressive user interfaces — understanding computational hardware constraints and translating them into fluid, intuitive systems.
              </p>
              <p>
                From architecting autonomous agent pipelines at <strong className="text-white font-medium">MIRA AI</strong> to organizing hackathons with hundreds of makers at <strong className="text-white font-medium">ccuhacks</strong>, I thrive on shipping things that work reliably in the real world.
              </p>
              <p>
                In the robotics domain with <strong className="text-white font-medium">RoboX Club CU</strong>, I work directly with embedded microcontrollers, sensor telemetry, and motor kinematics. With <strong className="text-white font-medium">impactEd</strong>, we focus on leveraging intelligent learning platforms to expand educational accessibility.
              </p>

              {/* Roles Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-6 rounded-xl border border-[#5483B3]/25 bg-[#052659]/20 hover:border-[#5483B3]/50 transition-colors">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">FOUNDER</span>
                  <h4 className="text-lg font-medium text-white mb-1">MIRA AI</h4>
                  <p className="text-xs text-[#8892b0]">Autonomous agent architectures &amp; foundation models (2025–Present)</p>
                </div>
                <div className="p-6 rounded-xl border border-[#5483B3]/25 bg-[#052659]/20 hover:border-[#5483B3]/50 transition-colors">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">EXECUTIVE ORGANIZER</span>
                  <h4 className="text-lg font-medium text-white mb-1">ccuhacks</h4>
                  <p className="text-xs text-[#8892b0]">Community hackathon platform for makers (April 2026–Present)</p>
                </div>
                <div className="p-6 rounded-xl border border-[#5483B3]/25 bg-[#052659]/20 hover:border-[#5483B3]/50 transition-colors">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">CORE TEAM MEMBER</span>
                  <h4 className="text-lg font-medium text-white mb-1">RoboX Club CU</h4>
                  <p className="text-xs text-[#8892b0]">Robotics kinematics, hardware telemetry &amp; control (August 2026–Present)</p>
                </div>
                <div className="p-6 rounded-xl border border-[#5483B3]/25 bg-[#052659]/20 hover:border-[#5483B3]/50 transition-colors">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">CO-FOUNDER</span>
                  <h4 className="text-lg font-medium text-white mb-1">impactEd</h4>
                  <p className="text-xs text-[#8892b0]">Scalable adaptive learning &amp; education technology</p>
                </div>
              </div>

              {/* Direct CTA */}
              <div className="pt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-[#5483B3] text-white font-medium hover:bg-[#C1E8FF] hover:text-[#021024] transition-all inline-flex items-center gap-2"
                >
                  Start a project
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="mailto:hello@hitenpanda.xyz"
                  className="px-8 py-4 rounded-full border border-[#5483B3]/40 text-[#C1E8FF] font-mono text-sm hover:border-[#C1E8FF] transition-all"
                >
                  hello@hitenpanda.xyz
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
