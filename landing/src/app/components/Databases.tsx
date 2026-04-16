"use client";

import {
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiMongodb,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import type { IconType } from "react-icons";
import { useReveal } from "../hooks/useReveal";

const databases: { name: string; Icon: IconType }[] = [
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "MySQL", Icon: SiMysql },
  { name: "SQLite", Icon: SiSqlite },
  { name: "Redis", Icon: SiRedis },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "SQL Server", Icon: DiMsqlServer },
];

export default function Databases() {
  const ref = useReveal();

  return (
    <section className="py-14 border-y border-border">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <p className="reveal text-center text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-10">
          Connect to all your databases
        </p>
        <div className="reveal reveal-delay-1 grid grid-cols-3 md:grid-cols-6 gap-4">
          {databases.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 py-4 px-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors cursor-default"
            >
              <div className="text-muted-foreground opacity-60 hover:opacity-100 transition-opacity">
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-medium text-muted">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
