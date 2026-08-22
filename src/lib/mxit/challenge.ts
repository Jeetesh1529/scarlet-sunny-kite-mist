export const CHALLENGE_GAMES = [
  { id: "chess" as const, label: "Chess", path: "/games/chess" },
  { id: "connect4" as const, label: "Connect 4", path: "/games/connect4" },
  { id: "tictactoe" as const, label: "Tic-Tac-Toe", path: "/games/tictactoe" },
];

export type ChallengeGame = (typeof CHALLENGE_GAMES)[number]["id"];

export const CHESS_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function parseChallenge(content: string): { game: ChallengeGame; matchId: string } | null {
  const m = content.match(/^(chess|connect4|tictactoe):([A-Za-z0-9_-]+)$/i);
  if (!m) return null;
  const game = m[1]!.toLowerCase() as ChallengeGame;
  return { game, matchId: m[2]! };
}

export function challengeLabel(game: string) {
  return CHALLENGE_GAMES.find((g) => g.id === game)?.label ?? game;
}

export function challengePath(game: string) {
  return CHALLENGE_GAMES.find((g) => g.id === game)?.path ?? "/games/chess";
}

export function startState(game: ChallengeGame) {
  if (game === "chess") return CHESS_START;
  if (game === "connect4") return JSON.stringify({ board: Array(42).fill(0), turn: 1 });
  return JSON.stringify({ board: Array(9).fill(null), turn: "X" });
}

export type MatchRow = {
  id: string;
  game: ChallengeGame | string;
  player_a: string;
  player_b: string;
  state: string;
  turn: string;
  winner: string | null;
  opponent: { id: string; display_name: string; is_bot: boolean };
};
