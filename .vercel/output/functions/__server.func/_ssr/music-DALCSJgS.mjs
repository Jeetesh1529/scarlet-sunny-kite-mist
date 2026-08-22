import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Q as useCurrentUserState, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/music-DALCSJgS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TRACKS = [
	{
		t: "Mabhida Nights",
		a: "Jozi FM tribute",
		bpm: 108
	},
	{
		t: "Sea Point Drift",
		a: "CT lounge",
		bpm: 92
	},
	{
		t: "Airtime Anthem",
		a: "Feature-phone era",
		bpm: 124
	},
	{
		t: "Load Shedding Lullaby",
		a: "Candlelight mix",
		bpm: 76
	},
	{
		t: "Chatroom 2007",
		a: "Nostalgia pack",
		bpm: 118
	}
];
function MusicRoom() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [on, setOn] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Music Room",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] text-white/60",
				children: "A tiny radio for the revival. Beeps, not Spotify — same energy as waiting for a 16kbps ringtone."
			}), TRACKS.map((tr, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					sfx.receive();
					setOn(i);
				},
				className: `w-full rounded-md border px-3 py-3 text-left ${on === i ? "border-amber-300/40 bg-amber-400/10" : "border-white/10 bg-white/5"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: tr.t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[12px] text-white/60",
					children: [
						tr.a,
						" · ",
						tr.bpm,
						" bpm ",
						on === i ? "· playing" : ""
					]
				})]
			}, tr.t))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/tradepost" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { MusicRoom as component };
