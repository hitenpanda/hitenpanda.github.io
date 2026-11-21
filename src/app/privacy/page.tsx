import React from "react";
import Link from "next/link";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Topbar from "@/components/navigation/Topbar";
import Footer from "@/components/navigation/Footer";

export default function PrivacyPage() {
  return (
    <SmoothScrollProvider>
      <Topbar />
      <main id="main" className="min-h-screen bg-[#021024] text-white pt-36 pb-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#5483B3] hover:text-[#C1E8FF] transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 16 16" fill="none">
              <path d="M11 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            back to overview
          </Link>
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-[#C1E8FF]/80 leading-relaxed font-light text-base md:text-lg">
            <p>
              Your privacy is paramount. This site does not track personal identifying data or sell telemetry to third parties.
            </p>
            <h2 className="text-xl font-normal text-white pt-4">Analytics &amp; Data</h2>
            <p>
              We prioritize privacy-preserving metrics to understand site performance and visitor interests without storing tracking cookies.
            </p>
            <h2 className="text-xl font-normal text-white pt-4">Contact &amp; Inquiries</h2>
            <p>
              Any information sent via our contact channels is used exclusively to respond to your project inquiries.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
