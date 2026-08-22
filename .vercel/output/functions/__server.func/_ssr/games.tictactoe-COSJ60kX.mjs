import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Q as useCurrentUserState, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games.tictactoe-COSJ60kX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINES = [
	[
		0,
		1,
		2
	],
	[
		3,
		4,
		5
	],
	[
		6,
		7,
		8
	],
	[
		0,
		3,
		6
	],
	[
		1,
		4,
		7
	],
	[
		2,
		5,
		8
	],
	[
		0,
		4,
		8
	],
	[
		2,
		4,
		6
	]
];
function winner(b) {
	for (const [a, bI, c] of LINES) if (b[a] && b[a] === b[bI] && b[a] === b[c]) return b[a];
	if (b.every(Boolean)) return "draw";
	return null;
}
function bestMove(b, me) {
	for (let i = 0; i < 9; i++) if (!b[i]) {
		const t = [...b];
		t[i] = me;
		if (winner(t) === me) return i;
	}
	const opp = me === "O" ? "X" : "O";
	for (let i = 0; i < 9; i++) if (!b[i]) {
		const t = [...b];
		t[i] = opp;
		if (winner(t) === opp) return i;
	}
	if (!b[4]) return 4;
	const corners = [
		0,
		2,
		6,
		8
	].filter((i) => !b[i]);
	if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
	const empty = b.map((c, i) => c ? -1 : i).filter((i) => i >= 0);
	return empty[Math.floor(Math.random() * empty.length)];
}
function TicTacToe() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [board, setBoard] = (0, import_react.useState)(Array(9).fill(null));
	const [turn, setTurn] = (0, import_react.useState)("X");
	const [score, setScore] = (0, import_react.useState)({
		you: 0,
		ai: 0,
		draw: 0
	});
	const w = winner(board);
	(0, import_react.useEffect)(() => {
		if (w || turn !== "O") return;
		const t = setTimeout(() => {
			const i = bestMove(board, "O");
			const nb = [...board];
			nb[i] = "O";
			setBoard(nb);
			setTurn("X");
			sfx.tap();
		}, 380);
		return () => clearTimeout(t);
	}, [
		turn,
		board,
		w
	]);
	(0, import_react.useEffect)(() => {
		if (w === "X") setScore((s) => ({
			...s,
			you: s.you + 1
		}));
		else if (w === "O") setScore((s) => ({
			...s,
			ai: s.ai + 1
		}));
		else if (w === "draw") setScore((s) => ({
			...s,
			draw: s.draw + 1
		}));
	}, [w]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Tic-Tac-Toe",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost/games" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono-pixel text-lg",
					children: [
						"You ",
						score.you,
						" · AI ",
						score.ai,
						" · Draw ",
						score.draw
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1",
					children: board.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (board[i] || w || turn !== "X") return;
							sfx.tap();
							const nb = [...board];
							nb[i] = "X";
							setBoard(nb);
							setTurn("O");
						},
						className: "flex h-20 w-20 items-center justify-center rounded-md border border-white/20 bg-white/10 font-pixel text-xl",
						children: c
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-pixel text-[11px]",
					children: w === "X" ? "You win" : w === "O" ? "AI wins" : w === "draw" ? "Draw" : "Your move"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded border border-white/20 px-4 py-2 text-sm",
					onClick: () => {
						setBoard(Array(9).fill(null));
						setTurn("X");
					},
					children: "New round"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/tradepost/$slug",
				params: { slug: "games" }
			}),
			children: "Back"
		}) })
	] });
}
//#endregion
export { TicTacToe as component };
