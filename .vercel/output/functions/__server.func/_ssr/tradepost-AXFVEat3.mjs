import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as MessagesSquare, F as Coins, I as CloudSun, L as ChevronRight, M as Gamepad2, V as ChartColumn, a as Store, b as Music, c as Sparkles, j as Grid3x3, n as Users, w as MessageCircle, y as Palette } from "../_libs/lucide-react.mjs";
import { Q as useCurrentUserState, at as WatermarkList, d as useMxit, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys, tt as ListRow } from "./router-BLZVt4yB.mjs";
import { t as MOOLA_EXTRAS } from "./rates-DzKarHBy.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tradepost-AXFVEat3.js
var import_jsx_runtime = require_jsx_runtime();
var SERVICES = [
	{
		name: "Chat Rooms",
		desc: "FREE · CT · Jozi · Durbs",
		icon: MessagesSquare,
		to: "/tradepost/chatrooms",
		cost: 0
	},
	{
		name: "Games",
		desc: "Moonbase · Tic-Tac-Toe",
		icon: Gamepad2,
		to: "/tradepost/games",
		cost: 0
	},
	{
		name: "Music Room",
		desc: "Drop a track, drop a mood",
		icon: Music,
		to: "/music",
		cost: 0
	},
	{
		name: "Horoscopes",
		desc: "What's in the stars today",
		icon: Sparkles,
		to: "/tradepost/horoscopes",
		cost: 0
	},
	{
		name: "Weather",
		desc: "Mzansi cities",
		icon: CloudSun,
		to: "/tradepost/weather",
		cost: 0
	},
	{
		name: "Skinz",
		desc: "Colour themes for your QXio",
		icon: Palette,
		to: "/tradepost/skinz",
		cost: MOOLA_EXTRAS.skinz
	},
	{
		name: "Emoticards",
		desc: "Classic sticker shop",
		icon: Sparkles,
		to: "/tradepost/emoticards",
		cost: MOOLA_EXTRAS.emoticard
	},
	{
		name: "Confessions",
		desc: "Anonymous, 2007-style",
		icon: MessageCircle,
		to: "/confessions",
		cost: 0
	},
	{
		name: "Polls",
		desc: "Vote with the nation",
		icon: ChartColumn,
		to: "/polls",
		cost: 0
	},
	{
		name: "Meet",
		desc: "Find someone new",
		icon: Users,
		to: "/meet",
		cost: 0
	},
	{
		name: "Tic-Tac-Toe",
		desc: "Vs the house",
		icon: Grid3x3,
		to: "/games/tictactoe",
		cost: 0
	}
];
function Tradepost() {
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "QX Post",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 text-[11px] text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3 w-3" }),
					" ",
					profile?.moola ?? 0
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WatermarkList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-2 text-[11px] italic text-white/60",
			children: "Chat, rooms and games are free. Spend Moola only on extras — Emoticards and Skinz."
		}), SERVICES.map((s) => {
			const Icon = s.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				onClick: () => {
					sfx.tap();
					navigate({ href: s.to });
				},
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				}),
				trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [s.cost > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mr-1 flex items-center gap-0.5 text-[10px] text-amber-200",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3 w-3" }),
							" ",
							s.cost
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90",
						children: "Free"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-white/60" })]
				}),
				children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-[11px] font-normal text-white/60",
					children: s.desc
				})]
			}, s.name);
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({ to: "/" }),
				children: "Back"
			}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 text-[12px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }), " Mall"]
			})
		})
	] });
}
//#endregion
export { Tradepost as component };
