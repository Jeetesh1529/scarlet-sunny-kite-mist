import { useEffect, useRef } from "react";

/** Poll `fn` on an interval, but never overlap, and pause while the tab is hidden. */
export function useVisiblePoll(fn: () => void | Promise<void>, ms: number, deps: unknown[] = []) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let cancelled = false;
    let busy = false;
    const run = async () => {
      if (cancelled || busy || (typeof document !== "undefined" && document.hidden)) return;
      busy = true;
      try {
        await fnRef.current();
      } catch {
        /* caller handles */
      } finally {
        busy = false;
      }
    };
    void run();
    const t = setInterval(() => void run(), ms);
    const vis = () => {
      if (!document.hidden) void run();
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelled = true;
      clearInterval(t);
      document.removeEventListener("visibilitychange", vis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
