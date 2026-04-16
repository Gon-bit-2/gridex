"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SiApple, SiIntel } from "react-icons/si";
import { BsWindows } from "react-icons/bs";
import type { IconType } from "react-icons";
import { useReveal } from "../hooks/useReveal";
import { useDetectedBuild } from "../hooks/useDetectedBuild";
import type { BuildId } from "../lib/platform";

type Build = {
  id: BuildId;
  platform: string;
  arch: string;
  Icon: IconType;
  archIcon?: IconType;
  description: string;
  fileFormat: string;
  size: string;
  href: string;
};

const APP_VERSION = "0.1.0";

const builds: Build[] = [
  {
    id: "mac-arm",
    platform: "macOS",
    arch: "Apple Silicon",
    Icon: SiApple,
    archIcon: SiApple,
    description: "For Mac with M1, M2, M3, or M4 chip.",
    fileFormat: "Universal .dmg",
    size: "~48 MB",
    href:
      process.env.NEXT_PUBLIC_DOWNLOAD_MAC_ARM64 ??
      `/downloads/Gridex-${APP_VERSION}-arm64.dmg`,
  },
  {
    id: "mac-x64",
    platform: "macOS",
    arch: "Intel",
    Icon: SiApple,
    archIcon: SiIntel,
    description: "For Mac with Intel processor (2015 – 2020).",
    fileFormat: ".dmg",
    size: "~52 MB",
    href:
      process.env.NEXT_PUBLIC_DOWNLOAD_MAC_X64 ??
      `/downloads/Gridex-${APP_VERSION}-x64.dmg`,
  },
  {
    id: "windows",
    platform: "Windows",
    arch: "x64",
    Icon: BsWindows,
    description: "For Windows 10 and Windows 11 (64-bit).",
    fileFormat: ".exe installer",
    size: "~62 MB",
    href:
      process.env.NEXT_PUBLIC_DOWNLOAD_WIN_X64 ??
      `/downloads/Gridex-${APP_VERSION}-setup.exe`,
  },
];


function DownloadHero() {
  const ref = useReveal();
  return (
    <section className="relative pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b from-phoenix/10 via-flame/5 to-transparent blur-[100px]" />
      </div>
      <div ref={ref} className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="reveal flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-phoenix/20 bg-phoenix/5 dark:bg-phoenix/10">
            <svg className="w-3.5 h-3.5 text-phoenix" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="text-xs font-semibold text-phoenix tracking-wide uppercase">
              Community Edition
            </span>
          </div>
        </div>

        <p className="reveal reveal-delay-1 text-xs font-medium text-phoenix uppercase tracking-[0.2em] mb-3">
          Download
        </p>
        <h1 className="reveal reveal-delay-2 text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Get <span className="gradient-text">Gridex</span> for your platform
        </h1>
        <p className="reveal reveal-delay-3 text-muted max-w-lg mx-auto">
          Free and open for the community. No account, no license key, no
          usage limits — choose the build that matches your hardware.
        </p>
        <div className="reveal reveal-delay-4 mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-black/[0.04] dark:bg-white/[0.06] font-mono">
            Community v{APP_VERSION}
          </span>
          <span>·</span>
          <a href="#" className="hover:text-foreground transition-colors">
            View changelog
          </a>
        </div>
      </div>
    </section>
  );
}

function DownloadCard({
  build,
  index,
  recommended,
}: {
  build: Build;
  index: number;
  recommended: boolean;
}) {
  const { platform, arch, Icon, archIcon: ArchIcon, description, fileFormat, size, href } = build;
  const delayClass = `reveal-delay-${Math.min(index + 1, 5)}`;

  return (
    <div
      className={`reveal ${delayClass} relative flex flex-col rounded-2xl p-7 transition-all ${
        recommended
          ? "border-2 border-phoenix/30 bg-card shadow-xl shadow-phoenix/5"
          : "border border-border bg-card hover:border-border"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="gradient-primary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
            Recommended for you
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-foreground">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground leading-tight">
            {platform}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
            {ArchIcon && <ArchIcon className="w-3.5 h-3.5" />}
            <span>{arch}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-5">{description}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6 pb-6 border-b border-border">
        <span className="font-mono">{fileFormat}</span>
        <span>·</span>
        <span>{size}</span>
      </div>

      <a
        href={href}
        download
        className={`mt-auto block w-full text-center font-medium py-2.5 rounded-xl text-sm transition-all ${
          recommended
            ? "gradient-primary text-white hover:opacity-90 shadow-lg shadow-phoenix/15"
            : "border border-border text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
        }`}
      >
        Download for {platform}
      </a>
    </div>
  );
}

function DownloadGrid({ recommendedId }: { recommendedId: BuildId | null }) {
  const ref = useReveal();
  return (
    <section className="py-8 md:py-12">
      <div ref={ref} className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {builds.map((b, i) => (
            <DownloadCard
              key={b.id}
              build={b}
              index={i}
              recommended={b.id === recommendedId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemRequirements() {
  const ref = useReveal();
  return (
    <section className="py-16 md:py-20 border-t border-border mt-12">
      <div ref={ref} className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            System requirements
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Gridex is native on every platform — small binary, fast startup,
            low memory.
          </p>
        </div>

        <div className="reveal reveal-delay-1 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <SiApple className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                macOS Apple Silicon
              </span>
            </div>
            <ul className="text-sm text-muted space-y-1.5">
              <li>macOS 14 Sonoma or later</li>
              <li>M1 / M2 / M3 / M4</li>
              <li>150 MB disk space</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <SiIntel className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                macOS Intel
              </span>
            </div>
            <ul className="text-sm text-muted space-y-1.5">
              <li>macOS 14 Sonoma or later</li>
              <li>Intel Core i5 or later</li>
              <li>150 MB disk space</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BsWindows className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Windows
              </span>
            </div>
            <ul className="text-sm text-muted space-y-1.5">
              <li>Windows 10 / 11 (64-bit)</li>
              <li>.NET 8 runtime (bundled)</li>
              <li>200 MB disk space</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowToInstall() {
  const ref = useReveal();
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div ref={ref} className="mx-auto max-w-3xl px-6">
        <div className="reveal text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            How to install
          </h2>
        </div>
        <div className="reveal reveal-delay-1 space-y-5">
          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-phoenix/10 text-phoenix text-sm font-semibold flex items-center justify-center">
              1
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground mb-1">
                Download the build for your platform
              </div>
              <div className="text-sm text-muted">
                Not sure which Mac you have? Click{" "}
                <span className="text-foreground font-medium">Apple menu → About This Mac</span>{" "}
                to check your chip.
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-phoenix/10 text-phoenix text-sm font-semibold flex items-center justify-center">
              2
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground mb-1">
                Open the installer
              </div>
              <div className="text-sm text-muted">
                macOS: open the .dmg and drag Gridex into Applications.
                Windows: run the .exe and follow the setup wizard.
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-7 h-7 rounded-full bg-phoenix/10 text-phoenix text-sm font-semibold flex items-center justify-center">
              3
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground mb-1">
                Launch Gridex
              </div>
              <div className="text-sm text-muted">
                Add your first connection and start querying. Your credentials
                stay on your machine.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DownloadContent() {
  const recommendedId = useDetectedBuild();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DownloadHero />
        <DownloadGrid recommendedId={recommendedId} />
        <SystemRequirements />
        <HowToInstall />
      </main>
      <Footer />
    </>
  );
}
