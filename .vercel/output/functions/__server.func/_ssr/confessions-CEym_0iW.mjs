import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as hhmm } from "./sms-DtDe-rh6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as postConfession, Q as useCurrentUserState, S as heartConfession, et as BackBtn, it as Titlebar, nt as Screen, rt as Softkeys, w as listConfessions } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as Textarea } from "./textarea-BesYy3E8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confessions-CEym_0iW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Confessions() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [items, setItems] = (0, import_react.useState)([]);
	const [body, setBody] = (0, import_react.useState)("");
	const reload = () => listConfessions().then(setItems).catch(() => {});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Confessions",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-3 overflow-y-auto p-3 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Anonymous. Be kind.",
					className: "border-white/20 bg-white/10 text-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						try {
							await postConfession({ data: body });
							setBody("");
							reload();
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Failed");
						}
					},
					children: "Post anonymous"
				}),
				items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-white/10 bg-white/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed",
						children: c.body
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between text-[11px] text-white/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hhmm(c.created_at) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: async () => {
								await heartConfession({ data: c.id });
								reload();
							},
							children: [c.hearts, " hearts"]
						})]
					})]
				}, c.id))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/tradepost" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { Confessions as component };
