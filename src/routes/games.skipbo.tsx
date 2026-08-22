import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/games/skipbo")({ component: SkipBo });

const STOCK = 8;
type Card = number; // 0 = Skip-Bo wild
type Side = { stock: Card[]; hand: Card[]; discards: Card[][] };
type Game = {
  draw: Card[];
  dump: Card[];
  builds: Card[][];
  you: Side;
  ai: Side;
  turn: "you" | "ai";
  winner: "you" | "ai" | null;
};
type Sel = { kind: "hand" | "stock" | "discard"; i: number } | null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function makeDeck(): Card[] {
  const d: Card[] = [];
  for (let n = 1; n <= 12; n++) for (let k = 0; k < 12; k++) d.push(n);
  for (let k = 0; k < 18; k++) d.push(0);
  return shuffle(d);
}

function freshSide(stock: Card[]): Side {
  return { stock, hand: [], discards: [[], [], [], []] };
}

function clone(g: Game): Game {
  const side = (s: Side): Side => ({
    stock: [...s.stock],
    hand: [...s.hand],
    discards: s.discards.map((p) => [...p]),
  });
  return {
    draw: [...g.draw],
    dump: [...g.dump],
    builds: g.builds.map((p) => [...p]),
    you: side(g.you),
    ai: side(g.ai),
    turn: g.turn,
    winner: g.winner,
  };
}

function deal(): Game {
  const deck = makeDeck();
  const you = freshSide(deck.splice(0, STOCK));
  const ai = freshSide(deck.splice(0, STOCK));
  const g: Game = {
    draw: deck,
    dump: [],
    builds: [[], [], [], []],
    you,
    ai,
    turn: "you",
    winner: null,
  };
  drawToFive(g, g.you);
  return g;
}

function refill(g: Game) {
  if (g.draw.length) return;
  if (!g.dump.length) return;
  g.draw = shuffle(g.dump);
  g.dump = [];
}

function drawToFive(g: Game, s: Side) {
  refill(g);
  while (s.hand.length < 5 && g.draw.length) {
    s.hand.push(g.draw.pop()!);
    refill(g);
  }
}

function canPlay(card: Card, pile: Card[]) {
  if (pile.length >= 12) return false;
  const need = pile.length + 1;
  return card === 0 || card === need;
}

function putBuild(g: Game, i: number, card: Card) {
  const need = g.builds[i]!.length + 1;
  const next = [...g.builds[i]!, need];
  if (next.length >= 12) {
    g.dump.push(...next);
    g.builds[i] = [];
  } else {
    g.builds[i] = next;
  }
  void card;
}

function takeCard(side: Side, sel: Exclude<Sel, null>): Card | null {
  if (sel.kind === "stock") {
    if (!side.stock.length) return null;
    return side.stock[side.stock.length - 1]!;
  }
  if (sel.kind === "hand") {
    const c = side.hand[sel.i];
    return c ?? null;
  }
  const pile = side.discards[sel.i];
  if (!pile?.length) return null;
  return pile[pile.length - 1]!;
}

function consume(side: Side, sel: Exclude<Sel, null>) {
  if (sel.kind === "stock") side.stock.pop();
  else if (sel.kind === "hand") side.hand.splice(sel.i, 1);
  else side.discards[sel.i]!.pop();
}

function afterPlay(g: Game, who: "you" | "ai") {
  const s = g[who];
  if (!s.stock.length) {
    g.winner = who;
    return;
  }
  if (!s.hand.length) drawToFive(g, s);
}

function findAiMove(g: Game): { sel: Exclude<Sel, null>; build: number } | null {
  const s = g.ai;
  const trySel = (sel: Exclude<Sel, null>) => {
    const card = takeCard(s, sel);
    if (card == null) return null;
    for (let i = 0; i < 4; i++) if (canPlay(card, g.builds[i]!)) return { sel, build: i };
    return null;
  };
  if (s.stock.length) {
    const hit = trySel({ kind: "stock", i: 0 });
    if (hit) return hit;
  }
  for (let i = 0; i < 4; i++) {
    if (!s.discards[i]!.length) continue;
    const hit = trySel({ kind: "discard", i });
    if (hit) return hit;
  }
  for (let i = 0; i < s.hand.length; i++) {
    const hit = trySel({ kind: "hand", i });
    if (hit) return hit;
  }
  return null;
}

function runAi(g0: Game): Game {
  const g = clone(g0);
  const s = g.ai;
  drawToFive(g, s);
  let guard = 48;
  while (guard-- && !g.winner) {
    const mv = findAiMove(g);
    if (!mv) break;
    const card = takeCard(s, mv.sel);
    if (card == null) break;
    consume(s, mv.sel);
    putBuild(g, mv.build, card);
    afterPlay(g, "ai");
  }
  if (!g.winner && s.hand.length) {
    const card = s.hand.pop()!;
    let pi = s.discards.findIndex((p) => !p.length);
    if (pi < 0) {
      pi = s.discards.reduce((best, p, i, arr) => (p.length < arr[best]!.length ? i : best), 0);
    }
    s.discards[pi]!.push(card);
  }
  if (!g.winner) {
    g.turn = "you";
    drawToFive(g, g.you);
  }
  return g;
}

function Face({
  n,
  selected,
  empty,
  onClick,
  label,
  wide,
}: {
  n: Card | null;
  selected?: boolean;
  empty?: boolean;
  onClick?: () => void;
  label: string;
  wide?: boolean;
}) {
  const text = empty || n == null ? "—" : n === 0 ? "SB" : String(n);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex ${wide ? "h-16 w-14" : "h-12 w-10"} flex-col items-center justify-center rounded-md border text-[13px] font-semibold ${
        selected
          ? "border-amber-300 bg-amber-400/35 text-amber-50 ring-1 ring-amber-200"
          : n === 0
            ? "border-amber-400/50 bg-amber-500/20 text-amber-100"
            : empty || n == null
              ? "border-white/15 bg-white/5 text-white/35"
              : "border-white/25 bg-white/15 text-white"
      }`}
    >
      {text}
    </button>
  );
}

function SkipBo() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [g, setG] = useState<Game>(deal);
  const [sel, setSel] = useState<Sel>(null);
  const [score, setScore] = useState({ you: 0, ai: 0 });
  const [msg, setMsg] = useState("Play onto a build, or discard to end your turn");

  const you = g.you;
  const locked = g.turn !== "you" || !!g.winner;

  const playToBuild = (i: number) => {
    if (locked || !sel) return;
    const card = takeCard(you, sel);
    if (card == null || !canPlay(card, g.builds[i]!)) {
      setMsg("That card can't go there");
      return;
    }
    const next = clone(g);
    consume(next.you, sel);
    putBuild(next, i, card);
    afterPlay(next, "you");
    sfx.tap();
    setSel(null);
    if (next.winner === "you") {
      setScore((s) => ({ ...s, you: s.you + 1 }));
      setMsg("You cleared your stock");
      setG(next);
      return;
    }
    setG(next);
    setMsg(next.you.stock.length ? `${next.you.stock.length} left in your stock` : "Go");
  };

  const tapDiscard = (i: number) => {
    if (locked) return;
    if (sel?.kind === "hand") {
      const next = clone(g);
      const card = next.you.hand[sel.i];
      if (card == null) return;
      next.you.hand.splice(sel.i, 1);
      next.you.discards[i]!.push(card);
      next.turn = "ai";
      sfx.tap();
      setSel(null);
      setMsg("AI playing…");
      setG(next);
      window.setTimeout(() => {
        const after = runAi(next);
        if (after.winner === "ai") {
          setScore((s) => ({ ...s, ai: s.ai + 1 }));
          setMsg("AI cleared its stock");
        } else {
          setMsg("Your turn");
          sfx.receive();
        }
        setG(after);
      }, 280);
      return;
    }
    if (you.discards[i]!.length) {
      sfx.tap();
      setSel({ kind: "discard", i });
    }
  };

  const reset = () => {
    sfx.tap();
    setG(deal());
    setSel(null);
    setMsg("Play onto a build, or discard to end your turn");
  };

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const stockTop = you.stock[you.stock.length - 1] ?? null;

  return (
    <Screen>
      <Titlebar title="Skip-Bo" left={<BackBtn to="/tradepost/games" />} />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 text-white">
        <div className="font-mono-pixel text-center text-sm">
          You {score.you} · AI {score.ai}
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 p-2">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-white/50">AI · stock {g.ai.stock.length}</div>
          <div className="flex gap-1.5">
            {g.ai.discards.map((p, i) => (
              <Face key={i} n={p[p.length - 1] ?? null} empty={!p.length} label={`AI discard ${i + 1}`} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wide text-white/50">Build piles · draw {g.draw.length}</div>
          <div className="flex justify-center gap-2">
            {g.builds.map((p, i) => (
              <Face
                key={i}
                n={p.length ? p[p.length - 1]! : null}
                empty={!p.length}
                label={`build ${i + 1}`}
                onClick={() => playToBuild(i)}
                wide
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 p-2">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-white/50">You · stock {you.stock.length}</div>
          <div className="flex items-end gap-3">
            <Face
              n={stockTop}
              empty={!you.stock.length}
              selected={sel?.kind === "stock"}
              label="Your stock"
              wide
              onClick={() => {
                if (locked || !you.stock.length) return;
                sfx.tap();
                setSel({ kind: "stock", i: 0 });
              }}
            />
            <div className="flex flex-1 gap-1.5">
              {you.discards.map((p, i) => (
                <Face
                  key={i}
                  n={p[p.length - 1] ?? null}
                  empty={!p.length}
                  selected={sel?.kind === "discard" && sel.i === i}
                  label={`your discard ${i + 1}`}
                  onClick={() => tapDiscard(i)}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-wide text-white/50">Hand</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {you.hand.map((c, i) => (
              <Face
                key={`${c}-${i}`}
                n={c}
                selected={sel?.kind === "hand" && sel.i === i}
                label={`hand ${c === 0 ? "skipbo" : c}`}
                onClick={() => {
                  if (locked) return;
                  sfx.tap();
                  setSel({ kind: "hand", i });
                }}
              />
            ))}
          </div>
        </div>
        <div className="text-center text-[13px] text-white/75">{g.winner ? (g.winner === "you" ? "You win" : "AI wins") : msg}</div>
        <p className="text-center text-[11px] text-white/45">
          Build 1→12. Skip-Bo (SB) is wild. Empty your stock. Discard a hand card to pass the turn.
        </p>
        <button type="button" onClick={reset} className="min-h-11 self-center rounded-md border border-white/20 px-4 text-sm">
          New game
        </button>
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost/$slug", params: { slug: "games" } })}>Back</button>} />
    </Screen>
  );
}
