import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as leaderboards, Q as useCurrentUserState, et as BackBtn, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboards-43gqjJtr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Boards() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		leaderboards().then(setData).catch(() => {});
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Leaderboards",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-3 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
					title: "Moola",
					rows: (data?.moola ?? []).map((r) => ({
						name: r.display_name,
						v: `${r.moola} M`
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
					title: "Moonbase power",
					rows: (data?.power ?? []).map((r) => ({
						name: r.display_name,
						v: String(r.power)
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
					title: "Daily streak",
					rows: (data?.streaks ?? []).map((r) => ({
						name: r.display_name,
						v: `${r.streak_days}d`
					}))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/" }),
			children: "Back"
		}) })
	] });
}
function Board({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[12px] font-medium uppercase tracking-wide text-white/60",
			children: title
		}),
		rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[12px] text-white/40",
			children: "No scores yet"
		}),
		rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-white/10 py-1.5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-6 text-white/50",
					children: i + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 truncate",
					children: r.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono-pixel",
					children: r.v
				})
			]
		}, r.name + i))
	] });
}
//#endregion
export { Boards as component };
