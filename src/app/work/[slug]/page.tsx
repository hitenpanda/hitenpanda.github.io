import React from "react";
import Link from "next/link";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const workDetails: Record<
  string,
  {
    title: string;
    category: string;
    year: string;
    role: string;
    overview: string;
    highlights: string[];
    tech: string[];
  }
> = {
  "mira-ai": {
    title: "MIRA AI Platform",
    category: "AI Systems // Autonomous Foundation",
    year: "2025 – Present",
    role: "Founder & Lead Architect",
    overview:
      "MIRA AI explores the boundaries of autonomous software synthesis and self-governing agents. Built on first-principles evaluation loops, deterministic tool harnesses, and multi-model consensus.",
    highlights: [
      "Engineered multi-agent runtime with deterministic tool execution and state rollbacks.",
      "Optimized local inference pipelines using quantized weights and GPU streaming.",
      "Deployed automated test harness reducing hallucinated tool arguments to near zero."
    ],
    tech: ["Python", "PyTorch", "Next.js", "TypeScript", "FastAPI", "Vector DBs"]
  },
  "ccuhacks": {
    title: "ccuhacks Platform",
    category: "Fullstack Platform // Community",
    year: "April 2026 – Present",
    role: "Executive Organizer",
    overview:
      "A complete hackathon infrastructure stack built to orchestrate hundreds of participating developers, real-time project submissions, mentor requests, and live judge scorecards under high concurrent load.",
    highlights: [
      "Real-time project submission flow with instant thumbnail generation and media hosting.",
      "Concurrent judge scoring portal with normalized evaluation metrics and conflict prevention.",
      "Handled over 500+ makers and dozens of hardware submissions seamlessly."
    ],
    tech: ["Next.js", "PostgreSQL", "WebSocket", "Tailwind CSS", "Redis"]
  },
  "robox-kinematics": {
    title: "RoboX Embedded Kinematics",
    category: "Hardware // Robotics & Control",
    year: "August 2026 – Present",
    role: "Core Team Member",
    overview:
      "Physical computing and autonomous rover navigation using embedded microcontrollers, Kalman-filtered IMU telemetry, and PID closed-loop motor drivers.",
    highlights: [
      "Wrote low-level C/C++ firmware for dual-core microcontrollers managing sensor polling.",
      "Implemented hardware timer interrupts for precise microsecond pulse-width modulation.",
      "Engineered autonomous obstacle traversal using ultrasonic and infrared sensor arrays."
    ],
    tech: ["Embedded C/C++", "FreeRTOS", "UART/SPI/I2C", "PID Control", "Hardware Schematics"]
  },
  "impact-ed": {
    title: "impactEd Knowledge Engine",
    category: "EdTech // Adaptive Learning",
    year: "2025",
    role: "Co-Founder",
    overview:
      "An intelligent, interactive learning interface that dynamically adjusts lesson difficulty, provides Socratic counter-questions, and breaks abstract academic topics into hands-on simulations.",
    highlights: [
      "Designed adaptive questioning engine that reduces student frustration through micro-scaffolding.",
      "Created lightweight client-side state machine enabling seamless offline progression.",
      "Helped hundreds of students master foundational STEM topics at their own pace."
    ],
    tech: ["React", "Generative AI", "TypeScript", "Canvas API", "Tailwind CSS"]
  },
  "melon-experience": {
    title: "Melon Studio Digital Experience",
    category: "Design Engineering // WebGL & Shaders",
    year: "2026",
    role: "Design Engineer",
    overview:
      "120 FPS high-performance digital presence replicating the fluid beauty of Melon Studio. Featuring custom WebGL fragment shaders, SVG liquid displacement filters, and directional clip-path interactions.",
    highlights: [
      "Custom WebGL noise fragment shader running at 120 FPS with zero layout thrashing.",
      "Dynamic SVG Gaussian blur and color matrix filter creating organic liquid typography.",
      "Directional hover clip-path calculations with quad-weighted aspect ratio heuristics."
    ],
    tech: ["WebGL", "GLSL Shaders", "GSAP ScrollTrigger", "SVG Filters", "Next.js"]
  },
  "mastercard-music": {
    title: "Mastercard Music Case Study",
    category: "Digital Product // Web Experience",
    year: "2024",
    role: "Product Designer & Engineer",
    overview:
      "An interactive music exploration platform pairing sonic branding with cutting-edge web audio interfaces and generative visuals.",
    highlights: [
      "Seamless integration between Web Audio API frequencies and reactive SVG animations.",
      "Accessible keyboard navigation across all musical touchpoints."
    ],
    tech: ["Web Audio API", "SVG Animations", "React", "Next.js"]
  },
  "huuuge-games": {
    title: "Huuuge Games Case Study",
    category: "Gaming Platform // Design Systems",
    year: "2024",
    role: "Design Engineer",
    overview:
      "Component library and interactive portal for millions of active mobile and web gaming players, emphasizing lightning-fast load times and rich motion design.",
    highlights: [
      "Universal design token system shared between web and native applications.",
      "Custom micro-interactions and tactile feedback states."
    ],
    tech: ["Design Systems", "TypeScript", "React", "Figma Tokens"]
  }
};

export async function generateStaticParams() {
  return Object.keys(workDetails).map((slug) => ({ slug }));
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = workDetails[slug] || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "Engineering Project",
    year: "2025",
    role: "Lead Engineer",
    overview:
      "Detailed architectural overview and engineering implementation of this selected project.",
    highlights: [
      "High-performance design engineering following modern reactive patterns.",
      "Robust implementation with strict type safety and accessibility."
    ],
    tech: ["TypeScript", "Next.js", "GSAP", "Tailwind CSS"]
  };

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-3 text-sm font-mono text-[#5483B3]">
            <Link href="/work" className="hover:text-[#C1E8FF] transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All projects
            </Link>
            <span className="text-[#8892b0]">/</span>
            <span className="text-[#C1E8FF] truncate">{project.category}</span>
          </div>

          {/* Header */}
          <div className="mb-12 pb-8 border-b border-[#5483B3]/20 space-y-4">
            <span className="text-xs font-mono text-[#5483B3] block">
              {project.role} • {project.year}
            </span>
            <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-white">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-[#C1E8FF]/80 leading-relaxed font-light">
              {project.overview}
            </p>
          </div>

          {/* Highlights & Tech Stack */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-normal text-white mb-6">Key Engineering Highlights</h2>
              <div className="space-y-4">
                {project.highlights.map((h, i) => (
                  <div key={i} className="p-5 rounded-xl border border-[#5483B3]/20 bg-[#052659]/20 flex items-start gap-3">
                    <span className="text-xs font-mono text-[#5483B3] mt-1">0{i + 1}</span>
                    <p className="text-base text-[#C1E8FF]/90 leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-normal text-white mb-4">Technologies &amp; Tools</h2>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-lg border border-[#5483B3]/30 bg-[#052659]/30 text-sm font-mono text-[#C1E8FF]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-12 border-t border-[#5483B3]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                href="/work"
                className="text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors"
              >
                ← Back to all projects
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-[#5483B3] text-white font-medium hover:bg-[#C1E8FF] hover:text-[#021024] transition-all inline-flex items-center gap-2"
              >
                Let&apos;s build together
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
