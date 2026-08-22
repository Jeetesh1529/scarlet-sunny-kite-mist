import { Coins } from "lucide-react";
import { MOOLA_EXTRAS, RATE_ROWS } from "@/lib/mxit/rates";

export function RatesCard({ className = "" }: { className?: string }) {
  return (
    <section className={`space-y-2 ${className}`}>
      <div className="text-[12px] font-medium uppercase tracking-wide text-white/80">Rates · Then vs now</div>
      <p className="text-[12px] leading-relaxed text-white/70">
        The OG app rode cheap 2G GPRS off airtime. On today's phones that channel is gone — chat here is normal
        mobile data, and QXio adds no charge (a fraction of a cent of data per message). Lean mode keeps it tiny;
        SMS is the only no-data fallback (~80c, your network). Moola is only for extras.
      </p>
      <div className="overflow-hidden rounded-lg border border-white/15">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
          <span>What</span>
          <span>Then</span>
          <span>QXio</span>
        </div>
        {RATE_ROWS.map((row) => (
          <div
            key={row.item}
            className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-white/10 px-2.5 py-1.5 text-[11px] leading-snug"
          >
            <span className="text-white/85">{row.item}</span>
            <span className="text-white/50">{row.then}</span>
            <span className={/FREE/i.test(row.now) ? "font-semibold text-emerald-300" : "text-white/85"}>
              {row.now}
            </span>
          </div>
        ))}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-white/55">
        <Coins className="mt-0.5 h-3 w-3 shrink-0 text-amber-200" />
        Wallet unchanged: +{MOOLA_EXTRAS.welcome} welcome, daily claim, gifts. Shop still {MOOLA_EXTRAS.emoticard} M
        Emoticards · {MOOLA_EXTRAS.skinz} M Skinz.
      </p>
    </section>
  );
}
