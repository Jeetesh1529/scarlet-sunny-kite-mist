import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as Coins } from "../_libs/lucide-react.mjs";
import { n as RATE_ROWS, t as MOOLA_EXTRAS } from "./rates-DzKarHBy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RatesCard-42QjotzG.js
var import_jsx_runtime = require_jsx_runtime();
function RatesCard({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `space-y-2 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase tracking-wide text-white/80",
				children: "Rates · Then vs now"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] leading-relaxed text-white/70",
				children: "Old Mxit ran cheap over GPRS (~1–2c) so you could skip ~80c SMS. QXio goes further: send and receive is free. Moola is only for extras."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-lg border border-white/15",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1.2fr_1fr_1fr] bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/55",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Then" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "QXio" })
					]
				}), RATE_ROWS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1.2fr_1fr_1fr] border-t border-white/10 px-2.5 py-1.5 text-[11px] leading-snug",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/85",
							children: row.item
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/50",
							children: row.then
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: row.now.startsWith("FREE") || row.now.startsWith("QXio R0") ? "font-semibold text-emerald-300" : "text-white/85",
							children: row.now
						})
					]
				}, row.item))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-1.5 text-[11px] text-white/55",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "mt-0.5 h-3 w-3 shrink-0 text-amber-200" }),
					"Wallet unchanged: +",
					MOOLA_EXTRAS.welcome,
					" welcome, daily claim, gifts. Shop still ",
					MOOLA_EXTRAS.emoticard,
					" M Emoticards · ",
					MOOLA_EXTRAS.skinz,
					" M Skinz."
				]
			})
		]
	});
}
//#endregion
export { RatesCard as t };
