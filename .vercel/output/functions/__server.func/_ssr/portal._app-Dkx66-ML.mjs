import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as Coins, M as Gamepad2, a as Store, n as Users } from "../_libs/lucide-react.mjs";
import { Q as useCurrentUserState, at as WatermarkList, d as useMxit, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys, tt as ListRow } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal._app-Dkx66-ML.js
var import_jsx_runtime = require_jsx_runtime();
var APPS = [
	{
		name: "Moola Hub",
		sub: "Chat is free · extras via Moola",
		icon: Coins,
		to: "/moola"
	},
	{
		name: "QX Post",
		sub: "The mall",
		icon: Store,
		to: "/tradepost"
	},
	{
		name: "Moonbase",
		sub: "Banker's favourite time-sink",
		icon: Gamepad2,
		to: "/games/moonbase"
	},
	{
		name: "QX Mix",
		sub: "Private groups",
		icon: Users,
		to: "/multimx"
	}
];
function Portal() {
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "QX Banker",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-amber-200",
				children: [profile?.moola ?? 0, " M"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WatermarkList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-2 text-[11px] italic text-white/60",
			children: "QX Banker — apps, banker bot, Moola. Same corner of the list it always was."
		}), APPS.map((a) => {
			const Icon = a.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-white" })
				}),
				onClick: () => {
					sfx.tap();
					navigate({ href: a.to });
				},
				children: [a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] font-normal text-white/60",
					children: a.sub
				})]
			}, a.name);
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { Portal as component };
