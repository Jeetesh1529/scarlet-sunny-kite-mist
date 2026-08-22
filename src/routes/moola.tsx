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
import { claimDaily, listMoola } from "@/lib/mxit/fns";
import type { MoolaTx } from "@/lib/mxit/types";
import { hhmm } from "@/lib/utils";

export const Route = createFileRoute("/moola")({ component: MoolaHub });

function MoolaHub() {
  const { user, isPending } = useCurrentUserState();
  const { profile, refresh } = useMxit();
  const navigate = useNavigate();
  const [tx, setTx] = useState<MoolaTx[]>([]);
  useEffect(() => {
    void listMoola().then(setTx).catch(() => {});
  }, []);
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
