import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { leaderboards } from "@/lib/mxit/fns";

export const Route = createFileRoute("/leaderboards")({ component: Boards });

function Boards() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [data, setData] = useState<Awaited<ReturnType<typeof leaderboards>> | null>(null);
  useEffect(() => {
    void leaderboards().then(setData).catch(() => {});
  }, []);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Leaderboards" left={<BackBtn />} />
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 text-white">
        <Board title="Moola" rows={(data?.moola ?? []).map((r) => ({ name: r.display_name, v: `${r.moola} M` }))} />
        <Board title="Moonbase power" rows={(data?.power ?? []).map((r) => ({ name: r.display_name, v: String(r.power) }))} />
        <Board title="Daily streak" rows={(data?.streaks ?? []).map((r) => ({ name: r.display_name, v: `${r.streak_days}d` }))} />
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}

function Board({ title, rows }: { title: string; rows: { name: string; v: string }[] }) {
  return (
    <div>
      <div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-white/60">{title}</div>
      {rows.length === 0 && <div className="text-[12px] text-white/40">No scores yet</div>}
      {rows.map((r, i) => (
        <div key={r.name + i} className="flex items-center gap-2 border-b border-white/10 py-1.5 text-sm">
          <span className="w-6 text-white/50">{i + 1}</span>
          <span className="flex-1 truncate">{r.name}</span>
          <span className="font-mono-pixel">{r.v}</span>
        </div>
      ))}
    </div>
  );
}
