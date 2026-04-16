"use client";

import { useReveal } from "../hooks/useReveal";

const rows = [
  { feature: "Native macOS", gridex: true, tableplus: true, dbeaver: "Java" },
  { feature: "AI Chat", gridex: true, tableplus: false, dbeaver: false },
  { feature: "Local AI (Ollama)", gridex: true, tableplus: false, dbeaver: false },
  { feature: "Multi-DB", gridex: true, tableplus: true, dbeaver: true },
  { feature: "SSH Tunnel", gridex: true, tableplus: true, dbeaver: true },
  { feature: "Free tier", gridex: true, tableplus: "Limited", dbeaver: true },
];

function Check() {
  return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10">
      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function Cross() {
  return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5 dark:bg-white/5">
      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
      </svg>
    </div>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check />;
  if (value === false) return <Cross />;
  return <span className="text-xs font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{value}</span>;
}

export default function Comparison() {
  const ref = useReveal();

  return (
    <section id="comparison" className="py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-3xl px-6">
        <div className="reveal text-center mb-12">
          <p className="text-xs font-medium text-phoenix uppercase tracking-[0.2em] mb-3">
            Compare
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Why choose <span className="gradient-text">Gridex</span>?
          </h2>
          <p className="text-muted max-w-md mx-auto">
            A fast, native database IDE with AI built right in.
          </p>
        </div>

        <div className="reveal reveal-delay-1 rounded-2xl border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="text-left px-5 py-3.5 font-medium text-muted text-xs uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-5 py-3.5 text-center">
                  <span className="font-semibold text-phoenix text-xs uppercase tracking-wider">
                    Gridex
                  </span>
                </th>
                <th className="px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                  TablePlus
                </th>
                <th className="px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                  DBeaver
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "" : "bg-black/[0.01] dark:bg-white/[0.01]"
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium text-foreground text-sm">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.gridex} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.tableplus} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.dbeaver} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
