import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Gridex — AI-Native Database IDE for macOS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0F0F12 0%, #1A1318 45%, #2A1410 100%)",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={96} height={96} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
            Gridex
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            <div style={{ display: "flex" }}>The AI-Native Database IDE</div>
            <div
              style={{
                display: "flex",
                background:
                  "linear-gradient(135deg, #E83A1C 0%, #F06525 50%, #F9A83A 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              for macOS
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#A1A1AA",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Query PostgreSQL, MySQL, SQLite, Redis, MongoDB, and SQL Server
            with built-in AI chat.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#71717A",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>Claude</span>
            <span>·</span>
            <span>GPT</span>
            <span>·</span>
            <span>Ollama</span>
          </div>
          <div>gridex.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
