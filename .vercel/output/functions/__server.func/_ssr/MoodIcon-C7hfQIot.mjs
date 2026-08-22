import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as Emoticon } from "./Emoticon-cZQWoCya.mjs";
import { t as MOODS } from "./types-DkbMrLlo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MoodIcon-C7hfQIot.js
var import_jsx_runtime = require_jsx_runtime();
var angry_default = "/assets/angry-Dy2wxRgL.png";
var excited_default = "/assets/excited-Cqe0KSye.png";
var grumpy_default = "/assets/grumpy-BzCbd21d.png";
var happy_default = "/assets/happy-DtK5lb60.png";
var hot_default = "/assets/hot-noVplZn1.png";
var inlove_default = "/assets/inlove-BwC4SAvw.png";
var invincible_default = "/assets/invincible-DzWoVcLK.png";
var sad_default = "/assets/sad-D0rghFnp.png";
var sick_default = "/assets/sick-BiVfankt.png";
var sleepy_default = "/assets/sleepy-Be7NiG6G.png";
var MOOD_ICONS = {
	":)": happy_default,
	":-)": happy_default,
	":(": sad_default,
	":-(": sad_default,
	":D": excited_default,
	":-D": excited_default,
	"(cool)": invincible_default,
	"8-)": invincible_default,
	"8)": invincible_default,
	"(blush)": hot_default,
	"(hot)": hot_default,
	"(rage)": angry_default,
	"(angry)": angry_default,
	">:( ": angry_default,
	">:(": angry_default,
	"(evil)": grumpy_default,
	"(grumpy)": grumpy_default,
	"(dizzy)": sick_default,
	"(sick)": sick_default,
	"<3": inlove_default,
	"(heart)": inlove_default,
	":|": sleepy_default,
	":-|": sleepy_default
};
function MoodIcon({ code, size = 18, className }) {
	if (!code) return null;
	const src = MOOD_ICONS[code] ?? MOOD_ICONS[code.trim()];
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		width: size,
		height: size,
		className: className ?? "inline-block shrink-0 object-contain",
		style: {
			width: size,
			height: size,
			imageRendering: "auto"
		}
	});
	const known = MOODS.find((m) => m.code === code || m.label.toLowerCase() === code.toLowerCase());
	if (known && MOOD_ICONS[known.code]) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: MOOD_ICONS[known.code],
		alt: known.label,
		width: size,
		height: size,
		className: className ?? "inline-block shrink-0 object-contain",
		style: {
			width: size,
			height: size
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emoticon, {
		code,
		size
	});
}
function orbClass(p) {
	if (p === "online") return "status-orb orb-online";
	if (p === "away") return "status-orb orb-away";
	if (p === "busy") return "status-orb orb-busy";
	if (p === "invite") return "status-orb orb-invite";
	return "status-orb orb-offline";
}
//#endregion
export { orbClass as n, MoodIcon as t };
