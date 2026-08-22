import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMoonbase, moonbaseAction } from "@/lib/mxit/fns";
import type { MoonbaseState } from "@/lib/mxit/types";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/games/moonbase")({ component: Moonbase });

const BUILDINGS = [
  { key: "command_centre", name: "Command Centre" },
  { key: "oxygen_plant", name: "Oxygen Plant" },
  { key: "water_extractor", name: "Water Extractor" },
  { key: "iron_mine", name: "Iron Mine" },
  { key: "helium_drill", name: "Helium Drill" },
  { key: "shield_generator", name: "Shield" },
];
const UNITS = [
  { key: "moonbuggy", name: "Moonbuggy", cost: "50 iron" },
  { key: "gunship", name: "Gunship", cost: "150 iron · 80 He" },
  { key: "laser_cannon", name: "Laser Cannon", cost: "900 iron · 400 He" },
];

function Moonbase() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [state, setState] = useState<MoonbaseState | null>(null);
  const [tab, setTab] = useState<"base" | "build" | "war">("base");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setErr(null);
    try {
      const next = await getMoonbase();
      setState(next);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not land");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const act = async (kind: "upgrade" | "train" | "raid", key: string) => {
    if (busy) return;
    setBusy(true);
    try {
      sfx.tap();
      const r = await moonbaseAction({ data: { kind, key } });
      setState(r.state);
      if (r.result === "win") toast.success("Raid won — loot + 8 Moola");
      else if (r.result === "loss") toast.error("Raid failed. Lost a moonbuggy.");
      else toast.success(kind === "upgrade" ? "Upgraded" : "Trained");
    } catch (e: unknown) {
      sfx.error();
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <Screen>
      <Titlebar title="Moonbase" left={<BackBtn to="/tradepost/games" />} right={<Rocket className="h-4 w-4" />} />
      <div className="flex gap-1 border-b border-white/10 px-2 py-1 text-white">
        {(["base", "build", "war"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              sfx.tap();
              setTab(t);
            }}
            className={`min-h-10 flex-1 rounded-md px-3 text-sm capitalize ${tab === t ? "bg-white/15 font-semibold" : "text-white/70"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 text-white">
        {!state && !err && <div className="py-8 text-center text-[13px] text-white/60">Landing on the moon…</div>}
        {err && (
          <div className="space-y-3 py-6 text-center">
            <p className="text-[13px] text-white/70">{err}</p>
            <Button onClick={() => void reload()}>Retry</Button>
          </div>
        )}
        {state && tab === "base" && (
          <div className="space-y-3">
            <div className="font-pixel text-[11px]">{state.base_name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Res k="Oxygen" v={state.oxygen} />
              <Res k="Water" v={state.water} />
              <Res k="Iron" v={state.iron} />
              <Res k="Helium" v={state.helium} />
            </div>
            <div className="text-[13px] text-white/70">Power score {state.power}</div>
            <p className="text-[12px] text-white/50">
              Mines tick while you're away. Open Build to upgrade, War to train and raid — raids pay 8 Moola.
            </p>
            <Button className="w-full min-h-11" onClick={() => { sfx.tap(); setTab("build"); }}>
              Go build
            </Button>
          </div>
        )}
        {state && tab === "build" && (
          <div className="space-y-2">
            {BUILDINGS.map((b) => {
              const lvl = state.buildings[b.key] ?? 0;
              return (
                <div key={b.key} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-[11px] text-white/50">Lv {lvl} · next {40 * (lvl + 1)} O/W</div>
                  </div>
                  <Button size="sm" className="min-h-10 min-w-[88px]" disabled={busy} onClick={() => void act("upgrade", b.key)}>
                    Upgrade
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        {state && tab === "war" && (
          <div className="space-y-3">
            {UNITS.map((u) => (
              <div key={u.key} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-[11px] text-white/50">x{state.units[u.key] ?? 0} · {u.cost}</div>
                </div>
                <Button size="sm" className="min-h-10 min-w-[88px]" disabled={busy} onClick={() => void act("train", u.key)}>
                  Train
                </Button>
              </div>
            ))}
            <Button className="w-full min-h-11" disabled={busy} onClick={() => void act("raid", "raid")}>
              Launch raid
            </Button>
          </div>
        )}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost/$slug", params: { slug: "games" } })}>Back</button>} />
    </Screen>
  );
}

function Res({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-[11px] text-white/50">{k}</div>
      <div className="font-mono-pixel text-xl">{v}</div>
    </div>
  );
}
