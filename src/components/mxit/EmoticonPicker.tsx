import { useState } from "react";
import { EMOTICONS } from "@/lib/emoticons";
import { sfx } from "@/lib/sfx";
import { Emoticon } from "./Emoticon";

export function EmoticonPicker({ onPick, onClose }: { onPick: (code: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState<"emo" | "mzansi">("emo");
  const mzansi = [":)", ":D", ";)", "<3", "8-)", "(hot)", "(greedy)", "\\m/", "@>--", ":music:", ":'(", ">:("];
  return (
    <div className="absolute bottom-full left-0 right-0 z-20 mx-2 mb-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-3 mxit-shadow-pop animate-fade-up">
      <div className="mb-2 flex gap-1 border-b border-border">
        {(["emo", "mzansi"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              sfx.tap();
              setTab(t);
            }}
            className={`whitespace-nowrap px-3 py-1.5 font-pixel text-[10px] uppercase ${tab === t ? "border-b-2 border-mxit-primary text-mxit-primary" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {(tab === "emo" ? EMOTICONS.map((e) => e.code) : mzansi).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              sfx.tap();
              onPick(code);
            }}
            className="flex aspect-square items-center justify-center rounded-md hover:bg-muted tap-scale"
          >
            <Emoticon code={code} size={36} />
          </button>
        ))}
      </div>
      <button type="button" onClick={onClose} className="mt-2 w-full py-1 text-xs text-muted-foreground hover:text-foreground">
        close
      </button>
    </div>
  );
}
