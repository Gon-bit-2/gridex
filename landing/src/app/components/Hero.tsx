"use client";

import Image from "next/image";
import { SiApple, SiIntel } from "react-icons/si";
import { BsWindows } from "react-icons/bs";
import type { IconType } from "react-icons";
import { useReveal } from "../hooks/useReveal";
import { useDetectedBuild } from "../hooks/useDetectedBuild";
import { BUILD_LABELS, type BuildId } from "../lib/platform";

const BUILD_ICONS: Record<BuildId, IconType> = {
  "mac-arm": SiApple,
  "mac-x64": SiIntel,
  windows: BsWindows,
};

export default function Hero() {
  const ref = useReveal();
  const detected = useDetectedBuild();
  const DetectedIcon = detected ? BUILD_ICONS[detected] : null;
  const downloadLabel = detected ? BUILD_LABELS[detected] : "Download Gridex";

  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-b from-phoenix/15 via-flame/8 to-transparent blur-[100px] dark:from-phoenix/10 dark:via-flame/5" />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg" />
        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Logo */}
        <div className="reveal flex justify-center mb-8">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Gridex"
              width={80}
              height={80}
              className="rounded-2xl"
              priority
            />
            <div className="absolute inset-0 rounded-2xl glow-phoenix" />
          </div>
        </div>

        {/* Badge */}
        <div className="reveal reveal-delay-1 flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-phoenix/20 bg-phoenix/5 dark:bg-phoenix/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-phoenix opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-phoenix" />
            </span>
            <span className="text-xs font-medium text-phoenix tracking-wide uppercase">
              Now with MongoDB &amp; SQL Server
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="reveal reveal-delay-2 text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.1] mb-6">
          The database IDE{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">powered by AI</span>
        </h1>

        {/* Subheadline */}
        <p className="reveal reveal-delay-3 text-base md:text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Query, explore, and manage all your databases from one native macOS app.
          With built-in AI chat powered by Claude, GPT, or local Ollama.
        </p>

        {/* CTAs */}
        <div className="reveal reveal-delay-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/download"
            className="w-full sm:w-auto gradient-primary text-white font-medium px-7 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-phoenix/20 hover:shadow-phoenix/30 flex items-center justify-center gap-2.5"
          >
            {DetectedIcon ? (
              <DetectedIcon className="w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {downloadLabel}
          </a>
          <a
            href="/#features"
            className="w-full sm:w-auto text-foreground font-medium px-7 py-3 rounded-xl border border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            See features
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Social proof */}
        <div className="reveal reveal-delay-5 mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free to use
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            6 databases supported
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Native macOS
          </div>
        </div>
      </div>
    </section>
  );
}
