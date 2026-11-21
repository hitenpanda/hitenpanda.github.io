"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";
import { getDailyInsights, InsightArticle } from "@/lib/insights";

function BrandLogo({ source }: { source: string }) {
  if (source === "Forbes") {
    return (
      <svg viewBox="0 0 200 54" className="h-2.5 w-auto fill-current">
        <path d="M113.3 18.2c0-5.8.1-11.2.4-16.2L98.4 4.9v1.4l1.5.2c1.1.1 1.8.5 2.2 1.1.4.7.7 1.7.9 3.2.2 2.9.4 9.5.3 19.9 0 10.3-.1 16.8-.3 19.3 5.5 1.2 9.8 1.7 13 1.7 6 0 10.7-1.7 14.1-5.2 3.4-3.4 5.2-8.2 5.2-14.1 0-4.7-1.3-8.6-3.9-11.7-2.6-3.1-5.9-4.6-9.8-4.6-2.6 0-5.3.7-8.3 2.1zm.3 30.8c-.2-3.2-.4-12.8-.4-28.5.9-.3 2.1-.5 3.6-.5 2.4 0 4.3 1.2 5.7 3.7 1.4 2.5 2.1 5.5 2.1 9.3 0 4.7-.8 8.5-2.4 11.7-1.6 3.1-3.6 4.7-6.1 4.7-.8-.2-1.6-.3-2.5-.4zM41 3H1v2l2.1.2c1.6.3 2.7.9 3.4 1.8.7 1 1.1 2.6 1.2 4.8.8 10.8.8 20.9 0 30.2-.2 2.2-.6 3.8-1.2 4.8-.7 1-1.8 1.6-3.4 1.8l-2.1.3v2h25.8v-2l-2.7-.2a4.9 4.9 0 0 1-3.4-1.8c-.7-1-1.1-2.6-1.2-4.8-.3-4-.5-8.6-.5-13.7l5.4.1c2.9.1 4.9 2.3 5.9 6.7h2V18.9h-2c-1 4.3-2.9 6.5-5.9 6.6l-5.4.1c0-9 .2-15.4.5-19.3h7.9c5.6 0 9.4 3.6 11.6 10.8l2.4-.7L41 3zm-4.7 30.8c0 5.2 1.5 9.5 4.4 12.9 2.9 3.4 7.2 5 12.6 5s9.8-1.7 13-5.2c3.2-3.4 4.7-7.7 4.7-12.9s-1.5-9.5-4.4-12.9c-2.9-3.4-7.2-5-12.6-5s-9.8 1.7-13 5.2c-3.2 3.4-4.7 7.7-4.7 12.9zm22.3-11.4c1.2 2.9 1.7 6.7 1.7 11.3 0 10.6-2.2 15.8-6.5 15.8-2.2 0-3.9-1.5-5.1-4.5-1.2-3-1.7-6.8-1.7-11.3C47 23.2 49.2 18 53.5 18c2.2-.1 3.9 1.4 5.1 4.4zm84.5 24.3c3.3 3.3 7.5 5 12.5 5 3.1 0 5.8-.6 8.2-1.9 2.4-1.2 4.3-2.7 5.6-4.5l-1-1.2c-2.2 1.7-4.7 2.5-7.6 2.5-4 0-7.1-1.3-9.2-4-2.2-2.7-3.2-6.1-3-10.5H170c0-4.8-1.2-8.7-3.7-11.8-2.5-3-6-4.5-10.5-4.5-5.6 0-9.9 1.8-13 5.3-3.1 3.5-4.6 7.8-4.6 12.9 0 5.2 1.6 9.4 4.9 12.7zm7.4-25.1c1.1-2.4 2.5-3.6 4.4-3.6 3 0 4.5 3.8 4.5 11.5l-10.6.2c.1-3 .6-5.7 1.7-8.1zm46.4-4c-2.7-1.2-6.1-1.9-10.2-1.9-4.2 0-7.5 1.1-10 3.2s-3.8 4.7-3.8 7.8c0 2.7.8 4.8 2.3 6.3 1.5 1.5 3.9 2.8 7 3.9 2.8 1 4.8 2 5.8 2.9 1 1 1.6 2.1 1.6 3.6 0 1.4-.5 2.7-1.6 3.7-1 1.1-2.4 1.6-4.2 1.6-4.4 0-7.7-3.2-10-9.6l-1.7.5.4 10c3.6 1.4 7.6 2.1 12 2.1 4.6 0 8.1-1 10.7-3.1 2.6-2 3.9-4.9 3.9-8.5 0-2.4-.6-4.4-1.9-5.9-1.3-1.5-3.4-2.8-6.4-4-3.3-1.2-5.6-2.3-6.8-3.3-1.2-1-1.8-2.2-1.8-3.7s.4-2.7 1.3-3.7 2-1.4 3.4-1.4c4 0 6.9 2.9 8.7 8.6l1.7-.5-.4-8.6zm-96.2-.9c-1.4-.7-2.9-1-4.6-1-1.7 0-3.4.7-5.3 2.1-1.9 1.4-3.3 3.3-4.4 5.9l.1-8-15.2 3v1.4l1.5.1c1.9.2 3 1.7 3.2 4.4.6 6.2.6 12.8 0 19.8-.2 2.7-1.3 4.1-3.2 4.4l-1.5.2v1.9h21.2V49l-2.7-.2c-1.9-.2-3-1.7-3.2-4.4-.6-5.8-.7-12-.2-18.4.6-1 1.9-1.6 3.9-1.8 2-.2 4.3.4 6.7 1.8l3.7-9.3z" />
      </svg>
    );
  }
  if (source === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }
  if (source === "SubStack") {
    return (
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#FF6719]">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    );
  }
  if (source.includes("X") || source.includes("Twitter")) {
    return (
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
        <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
      </svg>
    );
  }
  return null;
}

export default function InsightsPage() {
  const [articles, setArticles] = useState<InsightArticle[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    document.documentElement.classList.add("motion-revealed", "motion-live");
    document.documentElement.classList.remove("f-loading");
    window.dispatchEvent(new CustomEvent("melon:revealed"));
    setArticles(getDailyInsights());
  }, []);

  const sources = ["All", "Forbes", "GitHub", "SubStack", "X (Twitter)"];
  const filtered = filter === "All" ? articles : articles.filter((a) => a.source.includes(filter));

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors mb-6 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              back to overview
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#5483B3]/20">
              <div>
                <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-4">
                  Insights &amp; Radar
                </h1>
                <p className="text-lg md:text-xl text-[#C1E8FF] max-w-2xl font-light">
                  Daily-curated articles and research from X, GitHub, SubStack, and Forbes spanning AI systems, hardware silicon, and robotics.
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#5483B3]/30 bg-[#052659]/30 text-xs font-mono text-[#C1E8FF]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>UPDATED DAILY // LIVE FEED</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setFilter(src)}
                className={`px-5 py-2 rounded-full text-xs font-mono transition-all ${
                  filter === src
                    ? "bg-[#5483B3] text-white font-medium shadow-md shadow-[#5483B3]/20"
                    : "border border-[#5483B3]/25 bg-[#052659]/20 text-[#C1E8FF]/80 hover:border-[#5483B3]/60 hover:text-white"
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col rounded-2xl border border-[#5483B3]/20 bg-[#052659]/15 hover:border-[#5483B3]/60 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-[#5483B3]/10"
              >
                {/* Custom Thumbnail */}
                <Link href={`/insights/${art.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#021024]">
                  <Image
                    src={art.thumbnail}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#021024]/85 backdrop-blur-md border border-[#5483B3]/40 text-xs font-mono text-[#C1E8FF]">
                    <BrandLogo source={art.source} />
                    <span>{art.sourceLabel}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-[#021024]/80 backdrop-blur-md border border-[#5483B3]/30 text-[10px] font-mono text-[#8892b0]">
                    {art.readTime}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#8892b0] mb-3">
                      <span className="text-[#5483B3]">{art.category}</span>
                      <span>{art.dateDisplay}</span>
                    </div>
                    <h2 className="text-xl font-medium text-white group-hover:text-[#C1E8FF] transition-colors leading-snug mb-3">
                      <Link href={`/insights/${art.slug}`}>{art.title}</Link>
                    </h2>
                    <p className="text-sm text-[#C1E8FF]/70 line-clamp-3 leading-relaxed mb-6">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#5483B3]/15 flex items-center justify-between text-xs font-mono">
                    <Link
                      href={`/insights/${art.slug}`}
                      className="text-[#C1E8FF] hover:text-white inline-flex items-center gap-1 group/btn"
                    >
                      Read summary
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>

                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5483B3] hover:text-[#C1E8FF] inline-flex items-center gap-1"
                      title="Open source"
                    >
                      source ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
