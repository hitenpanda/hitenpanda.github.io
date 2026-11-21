"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";

const projects = [
  {
    title: "MIRA AI",
    category: "AI Systems // Autonomous Foundation",
    year: "2025 – Present",
    role: "Founder & Lead Architect",
    desc: "Autonomous AI agent architecture with deterministic tool harnesses, self-correcting evaluation loops, and multimodal reasoning pipelines.",
    tags: ["Agentic AI", "PyTorch", "Next.js", "Systems"],
    slug: "mira-ai",
  },
  {
    title: "ccuhacks Platform",
    category: "Fullstack Platform // Community",
    year: "2026",
    role: "Executive Organizer",
    desc: "Production hackathon platform handling real-time project submissions, live judging telemetry, and team matchmaking for hundreds of developers.",
    tags: ["Web Architecture", "Realtime", "Postgres", "Community"],
    slug: "ccuhacks",
  },
  {
    title: "RoboX Embedded Kinematics",
    category: "Hardware // Robotics & Control",
    year: "2026",
    role: "Core Team Member",
    desc: "Embedded microcontroller control routines, IMU sensor fusion, motor drivers, and low-latency serial telemetry for autonomous rovers.",
    tags: ["Embedded C/C++", "Sensors", "Hardware", "Robotics"],
    slug: "robox-kinematics",
  },
  {
    title: "impactEd Knowledge Engine",
    category: "EdTech // Adaptive Learning",
    year: "2025",
    role: "Co-Founder",
    desc: "Adaptive Socratic dialogue system designed to break down complex technical concepts into interactive student learning pathways.",
    tags: ["EdTech", "LLMs", "Interactive UI", "Social Impact"],
    slug: "impact-ed",
  },
  {
    title: "Melon Studio Digital Experience",
    category: "Design Engineering // WebGL & Shaders",
    year: "2026",
    role: "Design Engineer",
    desc: "120 FPS high-performance digital presence with custom GLSL WebGL waves, dynamic SVG liquid filters, and cubic-bezier scroll reveals.",
    tags: ["WebGL", "GLSL", "GSAP", "Design Systems"],
    slug: "melon-experience",
  },
];

export default function WorkPage() {
  useEffect(() => {
    document.documentElement.classList.add("motion-revealed", "motion-live");
    document.documentElement.classList.remove("f-loading");
    window.dispatchEvent(new CustomEvent("melon:revealed"));
  }, []);

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
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
            <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-4">
              Work<sup className="count text-2xl font-mono text-[#5483B3] ml-2">(7)</sup>
            </h1>
            <p className="text-lg md:text-xl text-[#C1E8FF] max-w-2xl font-light mb-6">
              Engineering systems, physical hardware, and reactive digital products built out of curiosity and first principles.
            </p>
            <div className="flex items-center gap-6 text-sm font-mono border-b border-[#5483B3]/20 pb-4">
              <span className="text-white border-b-2 border-[#5483B3] pb-2 font-medium">
                Active Projects<sup className="count text-[#5483B3] ml-1">(7)</sup>
              </span>
              <span className="text-[#8892b0] hover:text-white transition-colors cursor-pointer pb-2">
                Archive<sup className="count text-[#5483B3] ml-1">(12)</sup>
              </span>
            </div>
          </div>

          {/* Projects List */}
          <div className="divide-y divide-[#5483B3]/20 border-y border-[#5483B3]/20">
            {projects.map((proj, idx) => (
              <div
                key={proj.slug}
                className="py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline group hover:bg-[#052659]/10 transition-colors px-4 -mx-4 rounded-xl"
              >
                <div className="lg:col-span-1 text-xs font-mono text-[#5483B3]">
                  0{idx + 1}
                </div>

                <div className="lg:col-span-5">
                  <span className="text-xs font-mono text-[#5483B3] block mb-1">
                    {proj.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-medium text-white group-hover:text-[#C1E8FF] transition-colors">
                    {proj.title}
                  </h2>
                  <span className="text-xs font-mono text-[#8892b0] block mt-1">
                    {proj.role} • {proj.year}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <p className="text-sm md:text-base text-[#C1E8FF]/80 leading-relaxed font-light">
                    {proj.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded text-[11px] font-mono border border-[#5483B3]/20 bg-[#052659]/30 text-[#C1E8FF]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <Link
                    href={`/work/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C1E8FF] hover:text-white transition-colors"
                  >
                    View details
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
