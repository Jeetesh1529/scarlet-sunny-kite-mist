import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as Rocket } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as moonbaseAction, Q as useCurrentUserState, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys, y as getMoonbase } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games.moonbase-BK2MnGOr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BUILDINGS = [
	{
		key: "command_centre",
		name: "Command Centre"
	},
	{
		key: "oxygen_plant",
		name: "Oxygen Plant"
	},
	{
		key: "water_extractor",
		name: "Water Extractor"
	},
	{
		key: "iron_mine",
		name: "Iron Mine"
	},
	{
		key: "helium_drill",
		name: "Helium Drill"
	},
	{
		key: "shield_generator",
		name: "Shield"
	}
];
var UNITS = [
	{
		key: "moonbuggy",
		name: "Moonbuggy"
	},
	{
		key: "gunship",
		name: "Gunship"
	},
	{
		key: "laser_cannon",
		name: "Laser Cannon"
	}
];
function Moonbase() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [state, setState] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("base");
	const reload = () => getMoonbase().then(setState).catch(() => {});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	const act = async (kind, key) => {
		try {
			sfx.tap();
			const r = await moonbaseAction({ data: {
				kind,
				key
			} });
			setState(r.state);
			if (r.result === "win") toast.success("Raid won — loot incoming");
			if (r.result === "loss") toast.error("Raid failed. Lost a moonbuggy.");
		} catch (e) {
			sfx.error();
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Moonbase",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost/games" }),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-4 w-4" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 border-b border-white/10 px-2 py-1 text-white",
			children: [
				"base",
				"build",
				"war"
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(t),
				className: `rounded px-3 py-1 text-sm capitalize ${tab === t ? "bg-white/15" : ""}`,
				children: t
			}, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 text-white",
			children: [
				tab === "base" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-pixel text-[11px]",
							children: state.base_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Res, {
									k: "Oxygen",
									v: state.oxygen
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Res, {
									k: "Water",
									v: state.water
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Res, {
									k: "Iron",
									v: state.iron
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Res, {
									k: "Helium",
									v: state.helium
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[13px] text-white/70",
							children: ["Power score ", state.power]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-white/50",
							children: "Production ticks while you're away. Upgrade mines, train units, raid for loot and Moola."
						})
					]
				}),
				tab === "build" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: BUILDINGS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: b.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-white/50",
							children: ["Lv ", state.buildings[b.key] ?? 0]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void act("upgrade", b.key),
							children: "Upgrade"
						})]
					}, b.key))
				}),
				tab === "war" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: u.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-white/50",
							children: ["x", state.units[u.key] ?? 0]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void act("train", u.key),
							children: "Train"
						})]
					}, u.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => void act("raid", "raid"),
						children: "Launch raid"
					})]
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
function Res({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded border border-white/10 bg-white/5 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-white/50",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono-pixel text-xl",
			children: v
		})]
	});
}
//#endregion
export { Moonbase as component };
