import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { O as listPolls, Q as useCurrentUserState, Z as votePoll, et as BackBtn, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/polls-ja4Qr3tP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Polls() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [polls, setPolls] = (0, import_react.useState)([]);
	const reload = () => listPolls().then(setPolls).catch(() => {});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Polls",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-3 text-white",
			children: polls.map((p) => {
				const total = p.votes.reduce((a, b) => a + b, 0) || 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-white/10 bg-white/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 font-medium",
						children: p.question
					}), p.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: async () => {
							await votePoll({ data: {
								pollId: p.id,
								optionIdx: i
							} });
							reload();
						},
						className: "mb-1 w-full rounded border border-white/10 px-2 py-1.5 text-left text-sm hover:bg-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-white/50",
								children: [Math.round(p.votes[i] / total * 100), "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1 overflow-hidden rounded bg-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-mxit-glow",
								style: { width: `${p.votes[i] / total * 100}%` }
							})
						})]
					}, opt))]
				}, p.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/tradepost" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { Polls as component };
