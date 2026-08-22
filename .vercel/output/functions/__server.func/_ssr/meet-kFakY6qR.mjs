import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as zoneById } from "./zones-D1zBMza4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as meetPeople, Q as useCurrentUserState, et as BackBtn, it as Titlebar, nt as Screen, p as addContact, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { n as PixelAvatar } from "./PixelAvatar-DvmVLcYv.mjs";
import { n as orbClass, t as MoodIcon } from "./MoodIcon-C7hfQIot.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meet-kFakY6qR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Meet() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [people, setPeople] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		meetPeople().then(setPeople).catch(() => {});
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Meet",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-white",
			children: [people.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[13px] text-white/60",
				children: "Everyone you could meet is already on your list. Bring a friend."
			}), people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
						seed: p.avatar_seed,
						size: 40
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-medium",
							children: [p.display_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
								code: p.mood_code,
								size: 16
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate text-[12px] text-white/60",
							children: [
								"@",
								p.mxit_id,
								" · ",
								zoneById(p.zone).short,
								" · ",
								p.mood
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: orbClass(p.presence) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							try {
								await addContact({ data: p.mxit_id });
								toast.success("Added");
								setPeople((list) => list.filter((x) => x.id !== p.id));
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Failed");
							}
						},
						children: "Add"
					})
				]
			}, p.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { Meet as component };
