import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { MatchRow } from "@/lib/mxit/challenge";
import { getMatch, playMatch } from "@/lib/mxit/fns";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/games/tictactoe")({
  component: TicTacToe,
  validateSearch: (s: Record<string, unknown>) => {
    const match = typeof s.match === "string" ? s.match : undefined;
    return match ? { match } : {};
  },
});

type Cell = "X" | "O" | null;
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function emptyBoard(): Cell[] {
  return Array(9).fill(null);
}

function pack(board: Cell[]) {
  return JSON.stringify({ board, turn: "X" });
}

function unpack(state: string): Cell[] {
  try {
    const j = JSON.parse(state) as { board?: Cell[] } | Cell[];
    const b = Array.isArray(j) ? j : j.board;
    if (Array.isArray(b) && b.length === 9) return b as Cell[];
  } catch {
    /* house board */
  }
  return emptyBoard();
}

function winner(b: Cell[]): Cell | "draw" | null {
  for (const [a, bI, c] of LINES) {
    if (b[a] && b[a] === b[bI] && b[a] === b[c]) return b[a];
  }
  if (b.every(Boolean)) return "draw";
  return null;
}

function bestMove(b: Cell[], me: Cell): number {
  for (let i = 0; i < 9; i++) if (!b[i]) {
    const t = [...b]; t[i] = me;
    if (winner(t) === me) return i;
  }
  const opp: Cell = me === "O" ? "X" : "O";
  for (let i = 0; i < 9; i++) if (!b[i]) {
    const t = [...b]; t[i] = opp;
    if (winner(t) === opp) return i;
  }
  if (!b[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !b[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]!;
  const empty = b.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  return empty[Math.floor(Math.random() * empty.length)]!;
}

function TicTacToe() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const { match: matchId } = Route.useSearch();
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState({ you: 0, ai: 0, draw: 0 });
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [thinking, setThinking] = useState(false);
  const myMark: Cell = match ? (match.player_a === user?.id ? "X" : "O") : "X";
  const aiMark: Cell = myMark === "X" ? "O" : "X";
  const vsBot = !match || match.opponent.is_bot;
  const w = winner(board) || (match?.winner ? (match.winner === "draw" ? "draw" : match.winner === user?.id ? myMark : aiMark) : null);
  const myTurn = !w && (match ? match.turn === user?.id : turn === myMark);

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
    if (!matchId || vsBot || w) return;
    const t = window.setInterval(() => {
      void getMatch({ data: matchId }).then((m) => {
        setMatch(m);
        setBoard(unpack(m.state));
      });
    }, 2000);
    return () => window.clearInterval(t);
  }, [matchId, vsBot, w]);

  useEffect(() => {
    if (matchId) return;
    if (w === "X") setScore((s) => ({ ...s, you: s.you + 1 }));
    else if (w === "O") setScore((s) => ({ ...s, ai: s.ai + 1 }));
    else if (w === "draw") setScore((s) => ({ ...s, draw: s.draw + 1 }));
  }, [w, matchId]);

  useEffect(() => {
    if (w || thinking) return;
    const botShould = match ? vsBot && match.turn === match.opponent.id : turn === aiMark;
    if (!botShould) return;
    setThinking(true);
    const t = window.setTimeout(() => {
      const i = bestMove(board, aiMark);
      const nb = [...board];
      nb[i] = aiMark;
      setBoard(nb);
      const fin = winner(nb);
      if (!match) {
        setTurn(myMark === "X" ? "X" : "O");
      } else if (matchId && user) {
        const packed = pack(nb);
        const winId = fin === aiMark ? match.opponent.id : fin === "draw" ? "draw" : null;
        void playMatch({ data: { id: matchId, state: packed, turn: user.id, winner: winId } });
        setMatch({ ...match, state: packed, turn: user.id, winner: winId });
      }
      sfx.tap();
      setThinking(false);
    }, 380);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, board, w, vsBot, matchId, match?.turn, aiMark, myMark, user?.id]);

  const play = (i: number) => {
    if (board[i] || w || thinking || !myTurn || !myMark) return;
    sfx.tap();
    const nb = [...board];
    nb[i] = myMark;
    setBoard(nb);
    if (!match) {
      setTurn(aiMark === "O" ? "O" : "X");
      return;
    }
    if (!user) return;
    const fin = winner(nb);
    const packed = pack(nb);
    const winId = fin === myMark ? user.id : fin === "draw" ? "draw" : null;
    const nextTurn = winId ? user.id : match.opponent.id;
    void playMatch({ data: { id: match.id, state: packed, turn: nextTurn, winner: winId } });
    setMatch({ ...match, state: packed, turn: nextTurn, winner: winId });
  };

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const themName = match?.opponent.display_name ?? "AI";
  const status =
    w === myMark || match?.winner === user.id
      ? "You win"
      : w === aiMark
        ? `${themName} wins`
        : w === "draw" || match?.winner === "draw"
          ? "Draw"
          : thinking || !myTurn
            ? vsBot
              ? `${themName} thinking…`
              : `Waiting for ${themName}`
            : "Your move";

  return (
    <Screen>
      <Titlebar title={match ? `Tic-Tac-Toe vs ${match.opponent.display_name}` : "Tic-Tac-Toe"} left={<BackBtn to="/tradepost/games" />} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-white">
        <div className="font-mono-pixel text-lg">
          {match ? `You are ${myMark}` : `You ${score.you} · AI ${score.ai} · Draw ${score.draw}`}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {board.map((c, i) => (
            <button
              key={i}
              type="button"
              aria-label={`cell ${i + 1}`}
              onClick={() => play(i)}
              className="flex h-20 w-20 items-center justify-center rounded-md border border-white/20 bg-white/10 font-pixel text-xl"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="font-pixel text-[11px]">{status}</div>
        {!matchId && (
          <button
            type="button"
            className="rounded border border-white/20 px-4 py-2 text-sm"
            onClick={() => {
              setBoard(emptyBoard());
              setTurn("X");
              setThinking(false);
            }}
          >
            New round
          </button>
        )}
      </div>
      <Softkeys
        left={<button type="button" onClick={() => navigate({ to: "/tradepost/$slug", params: { slug: "games" } })}>Back</button>}
      />
    </Screen>
  );
}
