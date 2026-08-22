import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMatch, playMatch } from "@/lib/mxit/fns";
import type { MatchRow } from "@/lib/mxit/challenge";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/games/chess")({
  component: ChessGame,
  validateSearch: (s: Record<string, unknown>) => {
    const match = typeof s.match === "string" ? s.match : undefined;
    return match ? { match } : {};
  },
});

const FILES = "abcdefgh";
const GLYPH: Record<string, Record<string, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};
const MAT: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

function squares(): Square[] {
  const out: Square[] = [];
  for (let r = 8; r >= 1; r--) {
    for (const f of FILES) out.push(`${f}${r}` as Square);
  }
  return out;
}

const SQ = squares();

function evalBoard(g: Chess) {
  let s = 0;
  for (const row of g.board()) {
    for (const p of row) {
      if (!p) continue;
      const v = MAT[p.type] ?? 0;
      s += p.color === "w" ? v : -v;
    }
  }
  if (g.isCheckmate()) return g.turn() === "w" ? -99999 : 99999;
  if (g.isDraw()) return 0;
  if (g.inCheck()) s += g.turn() === "w" ? -18 : 18;
  return s;
}

function pickAiMove(fen: string): string | null {
  const g = new Chess(fen);
  const moves = g.moves();
  if (!moves.length) return null;
  let best = moves[0]!;
  let bestScore = Infinity;
  for (const m of moves) {
    g.move(m);
    const score = evalBoard(g);
    g.undo();
    if (score < bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

function ChessGame() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const { match: matchId } = Route.useSearch();
  const [fen, setFen] = useState(() => new Chess().fen());
  const [sel, setSel] = useState<Square | null>(null);
  const [score, setScore] = useState({ you: 0, ai: 0, draw: 0 });
  const [thinking, setThinking] = useState(false);
  const [match, setMatch] = useState<MatchRow | null>(null);
  const game = useMemo(() => new Chess(fen), [fen]);
  const over = game.isGameOver() || !!match?.winner;
  const legal = sel ? game.moves({ square: sel, verbose: true }).map((m) => m.to) : [];
  const turn = game.turn();
  const myColor: "w" | "b" = match ? (match.player_a === user?.id ? "w" : "b") : "w";
  const vsBot = !match || match.opponent.is_bot;
  const myTurn = !match || match.turn === user?.id;

  useEffect(() => {
    if (!matchId) return;
    void getMatch({ data: matchId })
      .then((m) => {
        setMatch(m);
        setFen(m.state);
      })
      .catch(() => {});
  }, [matchId]);

  useEffect(() => {
    if (!matchId || vsBot || over) return;
    const t = window.setInterval(() => {
      void getMatch({ data: matchId }).then((m) => {
        setMatch(m);
        setFen(m.state);
      });
    }, 2000);
    return () => window.clearInterval(t);
  }, [matchId, vsBot, over]);

  useEffect(() => {
    if (over || thinking) return;
    const aiColor = myColor === "w" ? "b" : "w";
    if (!vsBot) return;
    if (turn !== aiColor) return;
    setThinking(true);
    const t = window.setTimeout(() => {
      const mv = pickAiMove(fen);
      if (mv) {
        const g = new Chess(fen);
        g.move(mv);
        setFen(g.fen());
        sfx.receive();
        if (matchId && user) {
          const winner = g.isCheckmate() ? user.id : g.isDraw() ? "draw" : null;
          void playMatch({
            data: {
              id: matchId,
              state: g.fen(),
              turn: winner ? match?.player_a ?? user.id : user.id,
              winner,
            },
          });
          if (match) setMatch({ ...match, state: g.fen(), turn: winner ? match.player_a : user.id, winner });
        }
      }
      setThinking(false);
    }, 220);
    return () => window.clearTimeout(t);
  }, [fen, over, turn, vsBot, myColor, matchId, user, match]);

  useEffect(() => {
    if (!over) return;
    if (game.isCheckmate()) {
      setScore((s) => (game.turn() === "b" ? { ...s, you: s.you + 1 } : { ...s, ai: s.ai + 1 }));
    } else if (game.isDraw()) {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over, fen]);

  const play = (sq: Square) => {
    if (over || thinking || !myTurn) return;
    if (turn !== myColor) return;
    const piece = game.get(sq);
    if (sel && legal.includes(sq)) {
      const g = new Chess(fen);
      const ok = g.move({ from: sel, to: sq, promotion: "q" });
      if (!ok) return;
      sfx.tap();
      setSel(null);
      setFen(g.fen());
      if (matchId && match && user) {
        const winner = g.isCheckmate() ? user.id : g.isDraw() ? "draw" : null;
        const nextTurn = winner ? user.id : match.opponent.id;
        void playMatch({ data: { id: matchId, state: g.fen(), turn: nextTurn, winner } });
        setMatch({ ...match, state: g.fen(), turn: nextTurn, winner });
      }
      return;
    }
    if (piece && piece.color === myColor) {
      sfx.tap();
      setSel(sq);
      return;
    }
    setSel(null);
  };

  const reset = () => {
    if (matchId) return;
    sfx.tap();
    setFen(new Chess().fen());
    setSel(null);
    setThinking(false);
  };

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const status = over
    ? match?.winner === "draw" || game.isDraw()
      ? game.isStalemate()
        ? "Stalemate"
        : "Draw"
      : match?.winner === user?.id || (game.isCheckmate() && turn !== myColor)
        ? "Checkmate — you win"
        : `Checkmate — ${match?.opponent.display_name ?? "AI"} wins`
    : thinking || (vsBot && turn !== myColor)
      ? `${match?.opponent.display_name ?? "AI"} thinking…`
      : !myTurn
        ? `Waiting for ${match?.opponent.display_name ?? "them"}`
        : game.inCheck()
          ? "Check — your move"
          : "Your move";

  return (
    <Screen>
      <Titlebar title={match ? `Chess vs ${match.opponent.display_name}` : "Chess"} left={<BackBtn to="/tradepost/games" />} />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-3 text-white">
        <div className="font-mono-pixel text-sm">
          {match ? `You are ${myColor === "w" ? "white" : "black"}` : `You ${score.you} · AI ${score.ai} · Draw ${score.draw}`}
        </div>
        <div className="grid grid-cols-8 overflow-hidden rounded-md border border-white/20">
          {SQ.map((sq, i) => {
            const file = i % 8;
            const rank = 7 - Math.floor(i / 8);
            const dark = (file + rank) % 2 === 1;
            const p = game.get(sq);
            const on = sel === sq;
            const can = legal.includes(sq);
            return (
              <button
                key={sq}
                type="button"
                aria-label={sq}
                onClick={() => play(sq)}
                className={`relative flex h-10 w-10 items-center justify-center text-[22px] leading-none ${
                  on ? "bg-amber-400/70 text-[#0A1B3D]" : can ? "bg-emerald-400/40" : dark ? "bg-[#1b4e8a]" : "bg-[#c9d7ea] text-[#0A1B3D]"
                }`}
              >
                {p ? GLYPH[p.color]?.[p.type] : can ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-200/90" /> : null}
              </button>
            );
          })}
        </div>
        <div className="text-[13px] text-white/75">{status}</div>
        {!matchId && (
          <button type="button" onClick={reset} className="min-h-11 rounded-md border border-white/20 px-4 text-sm">
            New game
          </button>
        )}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost/$slug", params: { slug: "games" } })}>Back</button>} />
    </Screen>
  );
}
