import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";
import { getDailyInsights, getInsightBySlug } from "@/lib/insights";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getDailyInsights();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-3 text-sm font-mono text-[#5483B3]">
            <Link href="/insights" className="hover:text-[#C1E8FF] transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All insights
            </Link>
            <span className="text-[#8892b0]">/</span>
            <span className="text-[#C1E8FF] truncate">{article.category}</span>
          </div>

          {/* Article Header */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-[#5483B3]/20 border border-[#5483B3]/40 text-[#C1E8FF]">
                {article.source}
              </span>
              <span className="text-[#8892b0]">{article.dateDisplay}</span>
              <span className="text-[#8892b0]">•</span>
              <span className="text-[#8892b0]">{article.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-[#C1E8FF]/80 leading-relaxed font-light">
              {article.excerpt}
            </p>
          </div>

          {/* Custom Thumbnail Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#5483B3]/25 bg-[#052659]/20 mb-12 shadow-2xl">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Analysis & Key Takeaways */}
          <div className="space-y-10 text-base md:text-lg text-[#C1E8FF]/90 leading-relaxed">
            <div>
              <h2 className="text-2xl font-normal text-white mb-4">Core Takeaways for Engineers &amp; Builders</h2>
              <ul className="space-y-3">
                {article.takeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl border border-[#5483B3]/15 bg-[#052659]/10">
                    <span className="w-6 h-6 rounded-full bg-[#5483B3]/30 text-[#C1E8FF] flex items-center justify-center font-mono text-xs flex-none mt-0.5">
                      {i + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-normal text-white mb-4">Relevance to Systems &amp; Hardware Engineering</h2>
              <p>
                In production AI and physical engineering, theoretical performance numbers fall apart without robust systems infrastructure. Whether deploying neural agents onto embedded robotics controllers or streaming inference across constrained hardware buses, the key insight is deterministic reliability over raw scale.
              </p>
            </div>

            {/* Read Original Source CTA */}
            <div className="p-8 rounded-2xl border border-[#5483B3]/40 bg-[#052659]/30 flex flex-col sm:flex-row items-center justify-between gap-6 my-12">
              <div>
                <span className="text-xs font-mono text-[#5483B3] block mb-1">ORIGINAL PUBLICATION</span>
                <h3 className="text-xl font-medium text-white">{article.sourceLabel}</h3>
                <p className="text-sm text-[#C1E8FF]/70">Read the complete article and original discussion.</p>
              </div>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#5483B3] text-white font-medium hover:bg-[#C1E8FF] hover:text-[#021024] transition-all inline-flex items-center gap-2 whitespace-nowrap shadow-lg shadow-[#5483B3]/25"
              >
                Read on {article.source}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Navigation footer */}
            <div className="pt-8 border-t border-[#5483B3]/20 flex items-center justify-between">
              <Link
                href="/insights"
                className="text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors"
              >
                ← Back to all insights
              </Link>
              <Link
                href="/contact"
                className="text-sm font-mono text-[#C1E8FF] hover:text-white transition-colors"
              >
                Start a discussion →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
