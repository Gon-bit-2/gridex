"use client";

import { useEffect, useState } from "react";
import { detectBuild, type BuildId } from "../lib/platform";

export function useDetectedBuild(): BuildId | null {
  const [id, setId] = useState<BuildId | null>(null);

  useEffect(() => {
    let cancelled = false;
    detectBuild().then((result) => {
      if (!cancelled) setId(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return id;
}
