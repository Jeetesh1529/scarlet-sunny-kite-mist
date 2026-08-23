import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RatesCard } from "@/components/mxit/RatesCard";
import { useMxit } from "@/components/mxit/provider";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimDaily, listMoola, verifyMoolaPurchase } from "@/lib/mxit/fns";
import {
  billingAvailable,
  MOOLA_PACKS,
  type MoolaPack,
  PLAY_BILLING_METHOD,
  zarLabel,
} from "@/lib/mxit/moola-packs";
import type { MoolaTx } from "@/lib/mxit/types";
import { hhmm } from "@/lib/utils";

export const Route = createFileRoute("/moola")({ component: MoolaHub });

// The Digital Goods + Play Billing Payment Request APIs are not in the TS DOM
// lib yet, so these calls are loosely typed and only ever run inside the
// installed Play (TWA) app (guarded by billingAvailable()).
type PriceMap = Record<string, { currency: string; value: string }>;

// Digital Goods returns prices as micros-ish decimal strings (e.g. "16.990000")
// with an ISO currency code. Render them cleanly: "R16.99" for ZAR, otherwise
// "USD 4.99". Trailing ".00" is dropped so whole amounts read "R15".
function fmtPrice(p?: { currency: string; value: string }): string | null {
  if (!p) return null;
  const n = Number(p.value);
  const amount = Number.isFinite(n) ? n.toFixed(2).replace(/\.00$/, "") : p.value;
  return p.currency === "ZAR" ? `R${amount}` : `${p.currency} ${amount}`;
}

function MoolaHub() {
  const { user, isPending } = useCurrentUserState();
  const { profile, refresh } = useMxit();
  const navigate = useNavigate();
  const [tx, setTx] = useState<MoolaTx[]>([]);
  const [canBuy, setCanBuy] = useState(false);
  const [prices, setPrices] = useState<PriceMap>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    void listMoola().then(setTx).catch(() => {});
  }, []);

  // Only inside the Play app: detect billing + pull localized prices.
  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!(await billingAvailable())) return;
      if (!alive) return;
      setCanBuy(true);
      try {
        // @ts-expect-error - Digital Goods API not in TS DOM lib.
        const svc = await window.getDigitalGoodsService(PLAY_BILLING_METHOD);
        const details: Array<{ itemId: string; price?: { currency: string; value: string } }> =
          await svc.getDetails(MOOLA_PACKS.map((p) => p.id));
        if (!alive) return;
        const map: PriceMap = {};
        for (const d of details) if (d.price) map[d.itemId] = d.price;
        setPrices(map);
      } catch {
        /* prices fall back to ZAR labels */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function buy(pack: MoolaPack) {
    setBusy(pack.id);
    try {
      // @ts-expect-error - Digital Goods API not in TS DOM lib.
      const svc = await window.getDigitalGoodsService(PLAY_BILLING_METHOD);

      // A consumable that was bought but never consumed (e.g. a prior attempt
      // whose verify/consume was interrupted) stays "owned", and Play then
      // rejects a fresh purchase of the same SKU — which surfaces to the user
      // as an "Invalid state" error. Before buying, reconcile any stranded copy
      // of this pack: credit it server-side (idempotent) then consume it so the
      // slot is free again.
      if (svc?.listPurchases) {
        try {
          const owned: Array<{ itemId: string; purchaseToken: string }> = await svc.listPurchases();
          const mine = owned.filter((o) => o.itemId === pack.id);
          if (mine.length) {
            for (const o of mine) {
              try {
                await verifyMoolaPurchase({ data: { productId: o.itemId, purchaseToken: o.purchaseToken } });
              } catch {
                /* keep going — still try to consume so the SKU frees up */
              }
              if (svc.consume) {
                try {
                  await svc.consume(o.purchaseToken);
                } catch {
                  /* consume best-effort */
                }
              }
            }
            // The stranded purchase was the user's Moola — it's now credited.
            await refresh();
            setTx(await listMoola());
            toast.success("Restored a previous top-up — tap again to buy more");
            return;
          }
        } catch {
          /* listPurchases unsupported or failed — proceed to a normal buy */
        }
      }

      const price = prices[pack.id] ?? { currency: "ZAR", value: String(pack.zar) };
      const req = new PaymentRequest(
        [{ supportedMethods: PLAY_BILLING_METHOD, data: { sku: pack.id } } as PaymentMethodData],
        { total: { label: pack.label, amount: price } },
      );
      const resp = await req.show();
      const det = (resp as unknown as { details?: Record<string, string> }).details ?? {};
      const purchaseToken = det.token ?? det.purchaseToken ?? "";
      const r = await verifyMoolaPurchase({ data: { productId: pack.id, purchaseToken } });
      await resp.complete("success");
      // Consume client-side too, so the consumable never gets stuck "owned"
      // even if the server-side consume didn't land.
      if (svc?.consume && purchaseToken) {
        try {
          await svc.consume(purchaseToken);
        } catch {
          /* already consumed server-side */
        }
      }
      toast.success(`+${r.credited || pack.moola} Moola`);
      await refresh();
      setTx(await listMoola());
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      const name = err?.name ?? "";
      const msg = err?.message || "Purchase failed";
      // User dismissed the Play sheet — stay quiet.
      if (/abort/i.test(name) || /cancel/i.test(msg)) return;
      // Surface the real DOMException name so failures are diagnosable.
      toast.error(name ? `${name}: ${msg}` : msg);
    } finally {
      setBusy(null);
    }
  }

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Moola Hub" left={<BackBtn />} right={<Coins className="h-4 w-4 text-amber-200" />} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-white">
        <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-400/10 p-4 text-center">
          <div className="text-[11px] uppercase tracking-widest text-amber-200/80">Balance</div>
          <div className="font-pixel text-2xl text-amber-200">{profile?.moola ?? 0}</div>
          <Button
            className="mt-3"
            onClick={async () => {
              try {
                const r = await claimDaily();
                toast.success(`+${r.amount} Moola`);
                await refresh();
                setTx(await listMoola());
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Already claimed");
              }
            }}
          >
            Daily claim
          </Button>
          <p className="mt-2 text-[11px] text-amber-100/70">Chat does not spend this. Wallet is for extras.</p>
        </div>

        {canBuy && (
          <div className="mb-4 rounded-lg border border-cyan-300/25 bg-cyan-400/10 p-3">
            <div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-cyan-100/90">Top up Moola</div>
            <p className="mb-3 text-[11px] text-white/60">
              Optional. Moola is also earned free — daily claim, streaks and gifts. Moola can't be cashed out.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOOLA_PACKS.map((pack) => {
                const priceLabel = fmtPrice(prices[pack.id]) ?? zarLabel(pack.zar);
                return (
                  <button
                    key={pack.id}
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void buy(pack)}
                    className="flex flex-col items-start rounded-lg border border-white/15 bg-white/8 p-3 text-left active:scale-[.98] disabled:opacity-50"
                  >
                    <span className="flex items-center gap-1 text-amber-200">
                      <Coins className="h-4 w-4" />
                      <span className="text-[15px] font-semibold">{pack.moola}</span>
                    </span>
                    <span className="mt-0.5 text-[11px] text-white/60">{pack.label}</span>
                    {pack.tag && (
                      <span className="mt-1 rounded-full bg-cyan-400/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cyan-100">
                        {pack.tag}
                      </span>
                    )}
                    <span className="mt-2 w-full rounded-md bg-cyan-500/90 py-1 text-center text-[12px] font-semibold text-[#04121f]">
                      {busy === pack.id ? "…" : priceLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-white/40">Billed by Google Play. Prices shown in your Play region.</p>
          </div>
        )}

        <div className="mb-4 rounded-lg border border-white/15 bg-white/8 p-3">
          <RatesCard />
        </div>
        <div className="space-y-1 text-sm">
          {tx.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-white/10 py-2">
              <div>
                <div>{t.reason}</div>
                <div className="text-[11px] text-white/50">{hhmm(t.created_at)}</div>
              </div>
              <div className={t.amount >= 0 ? "text-emerald-300" : "text-red-300"}>
                {t.amount >= 0 ? "+" : ""}
                {t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}
