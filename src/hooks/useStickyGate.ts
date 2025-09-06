import React, { useEffect, useState } from "react";

export default function useStickyGate(sentinelId: string): boolean {
  const [passed, setPassed] = useState<boolean>(false);
  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPassed(!entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sentinelId]);
  return passed;
}
