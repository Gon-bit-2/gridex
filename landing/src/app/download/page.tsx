import type { Metadata } from "next";
import DownloadContent from "./DownloadContent";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Gridex for macOS (Apple Silicon / Intel) or Windows. Free, native, and privacy-first — no account required.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Gridex — AI-Native Database IDE",
    description:
      "Get Gridex for macOS (Apple Silicon / Intel) or Windows. Free and native.",
    url: "/download",
    type: "website",
  },
};

export default function DownloadPage() {
  return <DownloadContent />;
}
