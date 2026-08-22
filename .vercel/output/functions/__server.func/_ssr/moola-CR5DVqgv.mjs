import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as hhmm } from "./sms-DtDe-rh6.mjs";
import { F as Coins } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as listMoola, Q as useCurrentUserState, d as useMxit, et as BackBtn, g as claimDaily, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as RatesCard } from "./RatesCard-42QjotzG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/moola-CR5DVqgv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MoolaHub() {
	const { user, isPending } = useCurrentUserState();
	const { profile, refresh } = useMxit();
	const navigate = useNavigate();
	const [tx, setTx] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listMoola().then(setTx).catch(() => {});
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Moola Hub",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-amber-200" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-4 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 rounded-lg border border-amber-300/30 bg-amber-400/10 p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-widest text-amber-200/80",
							children: "Balance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-pixel text-2xl text-amber-200",
							children: profile?.moola ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							onClick: async () => {
								try {
									const r = await claimDaily();
									toast.success(`+${r.amount} Moola`);
									await refresh();
									setTx(await listMoola());
								} catch (e) {
									toast.error(e instanceof Error ? e.message : "Already claimed");
								}
							},
							children: "Daily claim"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-amber-100/70",
							children: "Chat does not spend this. Wallet is for extras."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 rounded-lg border border-white/15 bg-white/8 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatesCard, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1 text-sm",
					children: tx.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-white/10 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t.reason }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-white/50",
							children: hhmm(t.created_at)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: t.amount >= 0 ? "text-emerald-300" : "text-red-300",
							children: [t.amount >= 0 ? "+" : "", t.amount]
						})]
					}, t.id))
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
//#endregion
export { MoolaHub as component };
