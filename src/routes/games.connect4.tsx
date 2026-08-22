import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { MatchRow } from "@/lib/mxit/challenge";
import { getMatch, playMatch } from "@/lib/mxit/fns";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/games/connect4")({
  component: Connect4,
  validateSearch: (s: Record<string, unknown>) => {
    const match = typeof s.match === "string" ? s.match : undefined;
    return match ? { match } : {};
  },
});

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2;

function emptyBoard(): Cell[] {
  return Array(COLS * ROWS).fill(0);
}

function idx(c: number, r: number) {
  return r * COLS + c;
}

function pack(board: Cell[]) {
  return JSON.stringify({ board, turn: 1 });
}

function unpack(state: string): Cell[] {
  try {
    const j = JSON.parse(state) as { board?: Cell[] } | Cell[];
    const b = Array.isArray(j) ? j : j.board;
    if (Array.isArray(b) && b.length === COLS * ROWS) return b as Cell[];
  } catch {
    /* house board */
  }
  return emptyBoard();
}

function drop(board: Cell[], col: number, who: 1 | 2): Cell[] | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[idx(col, r)]) {
      const next = [...board];
      next[idx(col, r)] = who;
      return next;
    }
  }
  return null;
}

function wins(board: Cell[], who: 1 | 2) {
  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board[idx(c, r)] !== who) continue;
      for (const [dc, dr] of dirs) {
        let n = 1;
        for (let k = 1; k < 4; k++) {
          const cc = c + dc * k;
          const rr = r + dr * k;
          if (cc < 0 || cc >= COLS || rr < 0 || rr >= ROWS) break;
          if (board[idx(cc, rr)] !== who) break;
          n++;
        }
        if (n >= 4) return true;
      }
    }
  }
  return false;
}

function aiMove(board: Cell[], who: 1 | 2): number {
  const opp: 1 | 2 = who === 1 ? 2 : 1;
  for (let c = 0; c < COLS; c++) {
    const t = drop(board, c, who);
    if (t && wins(t, who)) return c;
  }
  for (let c = 0; c < COLS; c++) {
    const t = drop(board, c, opp);
    if (t && wins(t, opp)) return c;
  }
  const mid = [3, 2, 4, 1, 5, 0, 6];
  return mid.find((c) => drop(board, c, who)) ?? 3;
}

function Connect4() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const { match: matchId } = Route.useSearch();
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [localTurn, setLocalTurn] = useState<1 | 2>(1);
  const [score, setScore] = useState({ you: 0, ai: 0, draw: 0 });
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [thinking, setThinking] = useState(false);
  const myPiece: 1 | 2 = match ? (match.player_a === user?.id ? 1 : 2) : 1;
  const vsBot = !match || match.opponent.is_bot;
  const youWin = useMemo(() => wins(board, myPiece), [board, myPiece]);
  const themWin = useMemo(() => wins(board, myPiece === 1 ? 2 : 1), [board, myPiece]);
  const draw = board.every(Boolean) && !youWin && !themWin;
  const over = youWin || themWin || draw || !!match?.winner;
  const myTurn = match ? match.turn === user?.id && !match.winner : localTurn === 1;

  useEffect(() => {
    if (!matchId) return;
    void getMatch({ data: matchId })
      .then((m) => {
        setMatch(m);
        setBoard(unpack(m.state));
      })
      .catch(() => {});
  }, [matchId]);

  useEffect(() => {
    if (!matchId || vsBot || over) return;
    const t = window.setInterval(() => {
      void getMatch({ data: matchId }).then((m) => {
        setMatch(m);
        setBoard(unpack(m.state));
      });
    }, 2000);
    return () => window.clearInterval(t);
  }, [matchId, vsBot, over]);

  useEffect(() => {
    if (over || thinking) return;
    const botPiece: 1 | 2 = match ? (match.player_a === user?.id ? 2 : 1) : 2;
    const botShould = match ? vsBot && match.turn === match.opponent.id : localTurn === 2;
    if (!botShould) return;
    setThinking(true);
    const t = window.setTimeout(() => {
      const col = aiMove(board, botPiece);
      const after = drop(board, col, botPiece) ?? board;
      setBoard(after);
      const botWin = wins(after, botPiece);
      const isDraw = after.every(Boolean) && !botWin;
      if (!match) {
        if (botWin) setScore((s) => ({ ...s, ai: s.ai + 1 }));
        else if (isDraw) setScore((s) => ({ ...s, draw: s.draw + 1 }));
        setLocalTurn(1);
      } else if (matchId && user) {
        const winner = botWin ? match.opponent.id : isDraw ? "draw" : null;
        const packed = pack(after);
        void playMatch({ data: { id: matchId, state: packed, turn: user.id, winner } });
        setMatch({ ...match, state: packed, turn: user.id, winner });
      }
      sfx.receive();
      setThinking(false);
    }, 280);
    return () => window.clearTimeout(t);
    // thinking is a latch — leaving it out of deps keeps the timeout alive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, over, localTurn, vsBot, matchId, match?.turn, user?.id]);

  const play = (col: number) => {
    if (over || thinking || !myTurn) return;
    const next = drop(board, col, myPiece);
    if (!next) return;
    sfx.tap();
    setBoard(next);
    const iWin = wins(next, myPiece);
    const isDraw = next.every(Boolean) && !iWin;
    if (!match) {
      if (iWin) setScore((s) => ({ ...s, you: s.you + 1 }));
      else if (isDraw) setScore((s) => ({ ...s, draw: s.draw + 1 }));
      if (!iWin && !isDraw) setLocalTurn(2);
      return;
    }
    if (!user) return;
    const winner = iWin ? user.id : isDraw ? "draw" : null;
    const nextTurn = winner ? user.id : match.opponent.id;
    const packed = pack(next);
    void playMatch({ data: { id: match.id, state: packed, turn: nextTurn, winner } });
    setMatch({ ...match, state: packed, turn: nextTurn, winner });
  };

  const reset = () => {
    if (matchId) return;
    sfx.tap();
    setBoard(emptyBoard());
    setLocalTurn(1);
    setThinking(false);
  };

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const themName = match?.opponent.display_name ?? "AI";
  const status = over
    ? match?.winner === "draw" || draw
      ? "Draw"
      : youWin || match?.winner === user.id
        ? "You win"
        : `${themName} wins`
    : thinking || !myTurn
      ? vsBot
        ? `${themName} thinking…`
        : `Waiting for ${themName}`
      : "Your drop — yellow";

  return (
    <Screen>
      <Titlebar title={match ? `Connect 4 vs ${match.opponent.display_name}` : "Connect 4"} left={<BackBtn to="/tradepost/games" />} />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-3 text-white">
        <div className="font-mono-pixel text-sm">
          {match ? `You are ${myPiece === 1 ? "yellow" : "red"}` : `You ${score.you} · AI ${score.ai} · Draw ${score.draw}`}
        </div>
        <div className="grid grid-cols-7 gap-1 rounded-xl bg-sky-900/80 p-2">
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const c = i % COLS;
            const r = Math.floor(i / COLS);
            const v = board[idx(c, r)];
            return (
              <button
                key={i}
                type="button"
                aria-label={`column ${c + 1}`}
                onClick={() => play(c)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-950"
              >
                <span
                  className={`h-8 w-8 rounded-full ${v === 1 ? "bg-amber-400" : v === 2 ? "bg-rose-400" : "bg-white/15"}`}
                />
              </button>
            );
          })}
        </div>
        <div className="text-[13px] text-white/70">{status}</div>
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
