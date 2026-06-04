import { useEffect, useState } from "react";

export type NetworkQuality = "fast" | "slow" | "unknown";

interface AdaptiveConfig {
  /** true on 2G/slow-2g/saveData — disable heavy animations & auto-play */
  reducedData: boolean;
  /** true if prefers-reduced-motion */
  reducedMotion: boolean;
  /** Combined: should skip framer-motion, videos, heavy blur effects */
  lightweight: boolean;
  quality: NetworkQuality;
}

function getNetworkQuality(): NetworkQuality {
  if (typeof navigator === "undefined") return "unknown";
  // @ts-expect-error — NetworkInformation API (Chrome/Android)
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return "unknown";
  if (conn.saveData) return "slow";
  const type = conn.effectiveType as string;
  if (type === "slow-2g" || type === "2g") return "slow";
  if (type === "3g") return "slow";
  return "fast";
}

export function useAdaptiveLoading(): AdaptiveConfig {
  const [config, setConfig] = useState<AdaptiveConfig>(() => {
    if (typeof window === "undefined") {
      return { reducedData: false, reducedMotion: false, lightweight: false, quality: "unknown" };
    }
    const quality = getNetworkQuality();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reducedData = quality === "slow";
    return { reducedData, reducedMotion, lightweight: reducedData || reducedMotion, quality };
  });

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const quality = getNetworkQuality();
      const reducedMotion = motionMq.matches;
      const reducedData = quality === "slow";
      setConfig({ reducedData, reducedMotion, lightweight: reducedData || reducedMotion, quality });
    };
    motionMq.addEventListener("change", update);
    // @ts-expect-error
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    conn?.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      conn?.removeEventListener("change", update);
    };
  }, []);

  return config;
}
