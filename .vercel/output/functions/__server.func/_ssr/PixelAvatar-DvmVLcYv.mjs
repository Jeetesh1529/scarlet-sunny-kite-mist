import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./sms-DtDe-rh6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PixelAvatar-DvmVLcYv.js
var import_jsx_runtime = require_jsx_runtime();
var avatars_default = "/assets/avatars-yTdEXqRX.png";
var AVATAR_SEEDS = Array.from({ length: 10 }, (_, i) => `pixel-${i}`);
function avatarTile(seed) {
	const idx = seed ? Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 10 : 0;
	return {
		col: idx % 5,
		row: Math.floor(idx / 5)
	};
}
function PixelAvatar({ seed, url, size = 40, className, ring, idle, online }) {
	const animClass = idle ? "animate-avatar-idle" : "";
	const wrap = (inner) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("relative inline-block shrink-0", className),
		style: {
			width: size,
			height: size
		},
		children: [inner, online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -bottom-0.5 -right-0.5 block rounded-full bg-mxit-online ring-2 ring-card animate-pulse-soft",
			style: {
				width: Math.max(8, size * .25),
				height: Math.max(8, size * .25)
			},
			"aria-hidden": true
		})]
	});
	if (url) return wrap(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		width: size,
		height: size,
		className: cn("block rounded-md object-cover", ring && "ring-2 ring-white/40", animClass),
		style: {
			width: size,
			height: size
		}
	}));
	const { col, row } = avatarTile(seed);
	const sheetW = size * 5;
	const sheetH = size * 2;
	return wrap(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": "avatar",
		className: cn("inline-block overflow-hidden rounded-md bg-white/10", ring && "ring-2 ring-white/40", animClass),
		style: {
			width: size,
			height: size,
			backgroundImage: `url(${avatars_default})`,
			backgroundSize: `${sheetW}px ${sheetH}px`,
			backgroundPosition: `-${col * size}px -${row * size}px`,
			imageRendering: "pixelated"
		}
	}));
}
//#endregion
export { PixelAvatar as n, AVATAR_SEEDS as t };
