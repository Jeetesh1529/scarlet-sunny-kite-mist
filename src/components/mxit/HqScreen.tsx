import { useNavigate, useSearch } from "@tanstack/react-router";
import { Flag, Lock, RefreshCw, Search, Unlock, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppSplash } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimHq, clearHqReport, hqAccess, loadHq, searchHq, setHqBan, type HqMix, type HqPulse, type HqSnapshot, type HqUser } from "@/lib/mxit/hq";
import { zoneById } from "@/lib/mxit/zones";
import { sfx } from "@/lib/sfx";
import { PixelAvatar } from "./PixelAvatar";
import { useMxit } from "./provider";

type Tab = "analytics" | "people";

function ago(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function pct(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/6 px-3 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 font-mono text-[28px] font-semibold tabular-nums leading-none text-white">{value}</div>
      {hint ? <div className="mt-1 text-[11px] text-white/45">{hint}</div> : null}
    </div>
  );
}

function Bars({ days, color }: { days: { day: string; n: number }[]; color: string }) {
  const max = Math.max(1, ...days.map((d) => d.n));
  return (
    <>
      <div className="flex h-20 items-end gap-1">
        {days.map((d) => {
          const h = Math.max(d.n ? 12 : 3, Math.round((d.n / max) * 80));
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.n}`}>
              <div className={`w-full rounded-sm ${color}`} style={{ height: h }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-white/40">
        <span>{days[0]?.day.slice(5)}</span>
        <span>{days[days.length - 1]?.day.slice(5)}</span>
      </div>
    </>
  );
}

function MixRows({ rows, labels }: { rows: HqMix[]; labels?: Record<string, string> }) {
  const total = rows.reduce((s, r) => s + r.n, 0) || 1;
  if (!rows.length) return <p className="text-[13px] text-white/50">Nothing yet this week.</p>;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.k}>
          <div className="mb-1 flex justify-between text-[12px] text-white/70">
            <span className="capitalize">{labels?.[r.k] ?? r.k}</span>
            <span className="font-mono tabular-nums">
              {r.n} · {pct(r.n, total)}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300/80" style={{ width: `${pct(r.n, total)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Funnel({ pulse }: { pulse: HqPulse }) {
  const steps: { label: string; n: number }[] = [
    { label: "Created an ID", n: pulse.funnel.signed },
    { label: "Sent a message", n: pulse.funnel.chatted },
    { label: "Added a human", n: pulse.funnel.friended },
    { label: "Spoke in a room", n: pulse.funnel.roomed },
  ];
  const top = Math.max(1, steps[0]?.n ?? 1);
  return (
    <div className="space-y-2">
      {steps.map((s) => (
        <div key={s.label}>
          <div className="mb-1 flex justify-between text-[12px] text-white/75">
            <span>{s.label}</span>
            <span className="font-mono tabular-nums">
              {s.n} · {pct(s.n, top)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white/70" style={{ width: `${Math.max(s.n ? 8 : 0, pct(s.n, top))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel({ snap }: { snap: HqSnapshot }) {
  const p = snap.pulse;
  const d1 = p.d1Eligible ? `${pct(p.d1Returned, p.d1Eligible)}%` : "—";
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="People" value={snap.humans} hint="not bots" />
        <Stat label="DAU" value={p.dau} hint="seen today" />
        <Stat label="WAU" value={p.wau} hint="seen 7 days" />
        <Stat label="D1 return" value={d1} hint={p.d1Eligible ? `${p.d1Returned} of ${p.d1Eligible}` : "need a day"} />
        <Stat label="Msgs 24h" value={snap.messages24h} hint="human senders" />
        <Stat label="Claimed" value={p.claimedToday} hint="daily bonus" />
      </div>

      <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Activation</div>
        <Funnel pulse={p} />
        <p className="mt-3 text-[12px] text-white/45">Share of people who created an ID, then actually used chat.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Signups · 14 days</div>
          <Bars days={snap.days} color="bg-cyan-300/85" />
          {snap.zones.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {snap.zones.map((z) => (
                <span key={z.zone} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/75">
                  {zoneById(z.zone).short} {z.n}
                </span>
              ))}
            </div>
          ) : null}
        </section>
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Messages · 14 days</div>
          <Bars days={p.msgDays} color="bg-white/70" />
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Path · 7 days</div>
          <MixRows rows={p.channels} labels={{ data: "Data bundle", gprs: "GPRS airtime", sms: "SMS last resort" }} />
        </section>
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Kind · 7 days</div>
          <MixRows rows={p.kinds} labels={{ text: "Text", image: "Photo", voice: "Voice", challenge: "Challenge" }} />
        </section>
      </div>

      <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Rooms · 7 days</div>
        {p.rooms.every((r) => r.n === 0) ? (
          <p className="text-[13px] text-white/50">No room chatter from humans this week.</p>
        ) : (
          <div className="space-y-2">
            {p.rooms.map((r) => (
              <div key={r.name} className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="text-white/85">{r.name}</span>
                <span className="font-mono text-[12px] tabular-nums text-white/55">
                  {r.n} msgs · {r.people} people
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Games</div>
          {p.games.length === 0 ? (
            <p className="text-[13px] text-white/50">{p.matches} matches on record. Challenge a friend to fill this.</p>
          ) : (
            <div className="space-y-2">
              {p.games.map((g) => (
                <div key={g.game} className="flex justify-between text-[13px] text-white/85">
                  <span className="capitalize">{g.game}</span>
                  <span className="font-mono text-[12px] tabular-nums text-white/55">
                    {g.n} · {g.done} finished
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-white/50">Loudest · 7 days</div>
          {p.senders.length === 0 ? (
            <p className="text-[13px] text-white/50">No human messages this week.</p>
          ) : (
            <div className="space-y-2">
              {p.senders.map((s) => (
                <div key={s.mxit_id} className="flex justify-between gap-3 text-[13px]">
                  <span className="truncate text-white/85">
                    {s.display_name} <span className="font-mono text-cyan-200/70">@{s.mxit_id}</span>
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-white/55">{s.n}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat label="GPRS on" value={p.gprsOn} hint="airtime radio" />
        <Stat label="SMS on" value={p.smsOn} hint="last resort" />
      </div>
    </div>
  );
}

function UserRow({
  u,
  onBan,
}: {
  u: HqUser;
  onBan: (u: HqUser, banned: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-white/8 py-3 last:border-0">
      <PixelAvatar seed={u.avatar_seed} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate font-medium text-white">{u.display_name}</span>
          <span className="font-mono text-[12px] text-cyan-200/80">@{u.mxit_id}</span>
          {u.is_admin ? (
            <span className="rounded-full bg-white/15 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-white/80">
              HQ
            </span>
          ) : null}
          {u.banned_at ? (
            <span className="rounded-full bg-red-500/20 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-red-200">
              locked
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 truncate text-[12px] text-white/55">
          {u.email || "no email"} · {zoneById(u.zone).short}
          {u.phone ? ` · ${u.phone}` : ""} · {u.msgs ?? 0} msgs · seen {ago(u.last_seen)}
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <Button variant="secondary" className="h-8 px-2 text-[11px]" onClick={() => onBan(u, !u.banned_at)}>
          {u.banned_at ? (
            <>
              <Unlock className="h-3 w-3" /> Unlock
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" /> Lock
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function LockedScreen() {
  return (
    <div className="mxit-classic-bg flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <Lock className="h-8 w-8 text-white/70" />
      <h1 className="text-[20px] font-semibold text-white">This QXio ID is locked</h1>
      <p className="max-w-[36ch] text-[14px] leading-relaxed text-white/70">
        HQ closed this account. You can still delete it from the legal page if you want your data wiped.
      </p>
      <a href="/legal/delete" className="text-[13px] text-cyan-200 underline">
        Delete my data
      </a>
    </div>
  );
}

function HiddenPage() {
  return (
    <div className="qx-hq fixed inset-0 z-[1] flex flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-[20px] font-semibold text-white">Not found</h1>
      <p className="text-[14px] text-white/55">This page does not exist.</p>
      <a href="/" className="text-[13px] text-white/70 underline">
        Home
      </a>
    </div>
  );
}

export function HqScreen() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/hq" });
  const unlock = "unlock" in search && search.unlock === true;
  const { user, isPending } = useCurrentUserState();
  const { profile, loading, refresh } = useMxit();
  const [snap, setSnap] = useState<HqSnapshot | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<HqUser[] | null>(null);
  const [tab, setTab] = useState<Tab>("analytics");
  const [gate, setGate] = useState<"check" | "gone" | "claim" | "ok">("check");
  const [key, setKey] = useState("");
  const [claiming, setClaiming] = useState(false);

  const pull = useCallback(async () => {
    setBusy(true);
    try {
      const next = await loadHq();
      setSnap(next);
      setErr(null);
      setGate("ok");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Couldn't load HQ");
      setSnap(null);
      setGate("gone");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (isPending || loading) return;
    if (!user || !profile) {
      setGate("gone");
      return;
    }
    let live = true;
    void hqAccess()
      .then((g) => {
        if (!live) return;
        if (g.access) {
          setGate("ok");
          void pull();
          return;
        }
        setGate(g.claimable && unlock ? "claim" : "gone");
      })
      .catch(() => {
        if (live) setGate("gone");
      });
    return () => {
      live = false;
    };
  }, [isPending, loading, user, profile, unlock, pull]);

  useEffect(() => {
    const t = setTimeout(() => {
      const s = q.trim();
      if (s.length < 2) {
        setHits(null);
        return;
      }
      void searchHq({ data: s })
        .then(setHits)
        .catch(() => setHits([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const onBan = async (u: HqUser, banned: boolean) => {
    try {
      await setHqBan({ data: { id: u.id, banned } });
      sfx.tap();
      toast.success(banned ? `Locked @${u.mxit_id}` : `Unlocked @${u.mxit_id}`);
      await pull();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const submitKey = async () => {
    setClaiming(true);
    try {
      await claimHq({ data: key });
      await refresh();
      sfx.tap();
      toast.success("HQ is yours");
      setGate("ok");
      await pull();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Wrong key");
    } finally {
      setClaiming(false);
    }
  };

  if (isPending || loading || gate === "check") return <AppSplash />;
  if (gate === "gone") return <HiddenPage />;
  if (gate === "claim") {
    return (
      <div className="qx-hq fixed inset-0 z-[1] flex flex-col items-center justify-center px-6">
        <form
          className="w-full max-w-sm space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submitKey();
          }}
        >
          <h1 className="text-[18px] font-semibold text-white">Operator</h1>
          <Input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoComplete="off"
            className="h-11 border-white/15 bg-white/8 text-white"
            aria-label="Operator key"
          />
          <Button type="submit" className="h-11 w-full" disabled={claiming || key.trim().length < 4}>
            {claiming ? "…" : "Continue"}
          </Button>
        </form>
      </div>
    );
  }

  const list = hits ?? snap?.recent ?? [];

  return (
    <div className="qx-hq fixed inset-0 z-[1] overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200/70">QXio HQ</div>
            <h1 className="text-[24px] font-semibold tracking-tight text-white">
              {tab === "analytics" ? "How they use it" : "Who signed up"}
            </h1>
            <p className="mt-1 text-[13px] text-white/55">
              {snap?.persist === "neon"
                ? "Live database — every Create my ID stays here."
                : "Preview sandbox — this list wipes if the preview restarts. Publish qxio.live to keep real signups."}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <Button variant="secondary" className="h-10 w-10 px-0" onClick={() => void pull()} disabled={busy} aria-label="Refresh">
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="secondary" className="h-10 px-3" onClick={() => void navigate({ to: "/" })}>
              Chat
            </Button>
          </div>
        </header>

        <div className="mb-5 flex rounded-2xl border border-white/12 bg-black/25 p-1">
          {(["analytics", "people"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                sfx.tap();
                setTab(t);
              }}
              className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold capitalize transition ${
                tab === t ? "bg-white text-[#0A1B3D] shadow-sm" : "text-white/55 hover:text-white"
              }`}
            >
              {t === "analytics" ? "Analytics" : "People"}
            </button>
          ))}
        </div>

        {err && err !== "Unauthorized" ? (
          <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-100">{err}</p>
        ) : null}

        {snap ? (
          tab === "analytics" ? (
            <AnalyticsPanel snap={snap} />
          ) : (
            <>
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="People" value={snap.humans} hint="not bots" />
                <Stat label="Today" value={snap.today} />
                <Stat label="Online" value={snap.online} hint="last 10 min" />
              </div>

              {snap.inbox.length > 0 ? (
                <section className="mb-5 rounded-2xl border border-white/12 bg-white/6 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/50">
                    <Flag className="h-3.5 w-3.5" /> Reports
                  </div>
                  <div className="divide-y divide-white/8">
                    {snap.inbox.map((r) => (
                      <div key={r.id} className="flex items-start gap-2 py-2">
                        <div className="min-w-0 flex-1 text-[13px] text-white/80">
                          <span className="font-medium text-white">@{r.reporter_mxit || "gone"}</span> reported{" "}
                          <span className="font-medium text-white">@{r.target_mxit || "gone"}</span>
                          <span className="ml-1 capitalize text-white/50">{r.reason}</span>
                          <span className="ml-1 text-white/40">{ago(r.created_at)}</span>
                        </div>
                        <Button
                          variant="secondary"
                          className="h-8 px-2 text-[11px]"
                          onClick={async () => {
                            try {
                              await clearHqReport({ data: r.id });
                              await pull();
                            } catch (e: unknown) {
                              toast.error(e instanceof Error ? e.message : "Failed");
                            }
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-2xl border border-white/12 bg-white/6 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-white/50" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Find ID, name, email, cell"
                    className="h-10 border-white/15 bg-white/8 text-white placeholder:text-white/35"
                  />
                </div>
                {list.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <UserPlus className="h-6 w-6 text-white/40" />
                    <p className="text-[14px] text-white/65">
                      {hits ? "No match." : "No humans yet. After Publish, every Create my ID lands here."}
                    </p>
                  </div>
                ) : (
                  list.map((u) => <UserRow key={u.id} u={u} onBan={onBan} />)
                )}
              </section>
            </>
          )
        ) : (
          <div className="h-40 animate-pulse rounded-2xl bg-white/8" />
        )}
      </div>
    </div>
  );
}
