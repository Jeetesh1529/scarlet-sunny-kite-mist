import { useEffect, useState } from "react";
import logo from "@/assets/qxio-logo.png";
import { APP_NAME } from "@/lib/brand";
import { sfx } from "@/lib/sfx";

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "loading" | "gone">("logo");

  useEffect(() => {
    sfx.boot();
    const t1 = setTimeout(() => setPhase("loading"), 900);
    const t2 = setTimeout(() => setPhase("gone"), 2800);
    const t3 = setTimeout(onDone, 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      className={`fixed inset-0 z-50 overflow-hidden bg-white transition-opacity duration-500 ${
        phase === "gone" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,hsl(190_80%_94%)_0%,#fff_62%)]" />
      <div className="absolute left-[10%] top-[26%] h-44 w-44 rounded-full bg-teal-300/35 blur-3xl" />
      <div className="absolute right-[14%] top-[34%] h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        <img src={logo} alt={APP_NAME} className="h-auto w-[78%] max-w-[320px] object-contain" />
        <div className={`mt-10 transition-opacity duration-500 ${phase === "logo" ? "opacity-0" : "opacity-100"}`}>
          <div className="h-[3px] w-56 overflow-hidden rounded bg-slate-200">
            <div className="h-full bg-gradient-to-r from-teal-400 via-blue-500 to-violet-500 animate-boot-scan" />
          </div>
          <div className="mt-4 text-center font-mono-pixel text-xs uppercase tracking-[0.3em] text-slate-400">
            connecting
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-6 text-center font-mono-pixel text-[10px] tracking-widest text-slate-400">
        TAP TO SKIP
      </div>
    </div>
  );
}
