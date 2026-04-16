export type BuildId = "mac-arm" | "mac-x64" | "windows";

type NavigatorUAData = {
  platform: string;
  getHighEntropyValues: (hints: string[]) => Promise<{ architecture?: string }>;
};

export async function detectBuild(): Promise<BuildId | null> {
  if (typeof navigator === "undefined") return null;

  const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData })
    .userAgentData;
  const ua = navigator.userAgent;

  const isWindows = uaData?.platform === "Windows" || /Windows/i.test(ua);
  if (isWindows) return "windows";

  const isMac = uaData?.platform === "macOS" || /Mac/i.test(ua);
  if (!isMac) return null;

  if (uaData?.getHighEntropyValues) {
    try {
      const data = await uaData.getHighEntropyValues(["architecture"]);
      if (data.architecture === "arm") return "mac-arm";
      if (data.architecture === "x86") return "mac-x64";
    } catch {
      // fall through
    }
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    const dbg =
      gl && (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (dbg && gl) {
      const renderer = (gl as WebGLRenderingContext).getParameter(
        (dbg as { UNMASKED_RENDERER_WEBGL: number }).UNMASKED_RENDERER_WEBGL,
      ) as string;
      if (/Apple (M\d|GPU)/i.test(renderer)) return "mac-arm";
      if (/Intel/i.test(renderer)) return "mac-x64";
    }
  } catch {
    // ignore
  }

  return "mac-arm";
}

export const BUILD_LABELS: Record<BuildId, string> = {
  "mac-arm": "Download for Mac (Apple Silicon)",
  "mac-x64": "Download for Mac (Intel)",
  windows: "Download for Windows",
};
