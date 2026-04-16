"use client";

import { useReveal } from "../hooks/useReveal";

export default function CTA() {
  const ref = useReveal();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-t from-phoenix/10 via-flame/5 to-transparent blur-[100px]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-2xl px-6 text-center">
        <div className="reveal">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready to try <span className="gradient-text">Gridex</span>?
          </h2>
          <p className="text-muted mb-10 max-w-md mx-auto">
            Free to download. No account required.
            <br />
            Available for macOS and Windows.
          </p>
        </div>

        <div className="reveal reveal-delay-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/download"
            className="w-full sm:w-auto gradient-primary text-white font-medium px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-phoenix/20 flex items-center justify-center gap-2.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Gridex
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-foreground font-medium px-8 py-3.5 rounded-xl border border-border hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
