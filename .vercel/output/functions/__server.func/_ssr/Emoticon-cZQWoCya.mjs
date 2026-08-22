import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./sms-DtDe-rh6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Emoticon-cZQWoCya.js
var import_jsx_runtime = require_jsx_runtime();
var emoticons_default = "/assets/emoticons-CasL8Q1B.png";
var EMOTICONS = [
	{
		code: ":)",
		aliases: [":-)"],
		col: 0,
		row: 0,
		label: "happy"
	},
	{
		code: ":(",
		aliases: [":-("],
		col: 1,
		row: 0,
		label: "sad"
	},
	{
		code: ";)",
		aliases: [";-)"],
		col: 2,
		row: 0,
		label: "wink"
	},
	{
		code: ":D",
		aliases: [
			":-D",
			":->",
			":>"
		],
		col: 3,
		row: 0,
		label: "excited"
	},
	{
		code: ":|",
		aliases: [":-|"],
		col: 4,
		row: 0,
		label: "neutral"
	},
	{
		code: ":P",
		aliases: [
			":p",
			":-P",
			":-p"
		],
		col: 5,
		row: 0,
		label: "tongue"
	},
	{
		code: "=-O",
		aliases: [
			"=-o",
			"=O",
			"=o"
		],
		col: 0,
		row: 1,
		label: "shocked"
	},
	{
		code: ":-*",
		aliases: [":*"],
		col: 1,
		row: 1,
		label: "kiss"
	},
	{
		code: "8-)",
		aliases: [
			"8)",
			"B)",
			"(cool)",
			"(invincible)"
		],
		col: 2,
		row: 1,
		label: "cool"
	},
	{
		code: ":-[",
		aliases: [":["],
		col: 3,
		row: 1,
		label: "embarrassed"
	},
	{
		code: ":'(",
		aliases: [":'-("],
		col: 4,
		row: 1,
		label: "crying"
	},
	{
		code: ":-/",
		aliases: [
			":-\\",
			":/",
			"(sick)",
			"(dizzy)"
		],
		col: 5,
		row: 1,
		label: "thinking"
	},
	{
		code: "O:)",
		aliases: [
			"o:)",
			"O:-)",
			"o:-)",
			"(angel)"
		],
		col: 0,
		row: 2,
		label: "angel"
	},
	{
		code: ":-X",
		aliases: [
			":X",
			":-x",
			":x"
		],
		col: 1,
		row: 2,
		label: "shut mouth"
	},
	{
		code: ":-$",
		aliases: [":$"],
		col: 2,
		row: 2,
		label: "money mouth"
	},
	{
		code: ":-!",
		aliases: [":!"],
		col: 3,
		row: 2,
		label: "foot in mouth"
	},
	{
		code: ">:O",
		aliases: [
			">:o",
			"(grumpy)",
			"(evil)"
		],
		col: 4,
		row: 2,
		label: "shout"
	},
	{
		code: ">:(",
		aliases: [
			">:-(",
			"(angry)",
			"(rage)"
		],
		col: 5,
		row: 2,
		label: "angry"
	},
	{
		code: "C:-)",
		aliases: [
			"C:)",
			"c:-)",
			"c:)"
		],
		col: 0,
		row: 3,
		label: "skywalker"
	},
	{
		code: ":-(|)",
		aliases: [
			":(|)",
			"8-|",
			"(monkey)"
		],
		col: 1,
		row: 3,
		label: "monkey"
	},
	{
		code: "O-)",
		aliases: ["o-)", "(cyclops)"],
		col: 2,
		row: 3,
		label: "cyclops"
	},
	{
		code: "(hot)",
		aliases: [
			":chili:",
			"(blush)",
			"(chili)"
		],
		col: 3,
		row: 3,
		label: "hot"
	},
	{
		code: "(greedy)",
		aliases: ["$_$"],
		col: 4,
		row: 3,
		label: "greedy"
	},
	{
		code: "(male)",
		aliases: [":male:"],
		col: 5,
		row: 3,
		label: "male sign"
	},
	{
		code: "(female)",
		aliases: [":female:"],
		col: 0,
		row: 4,
		label: "female sign"
	},
	{
		code: "<3",
		aliases: [
			":heart:",
			":love:",
			"(heart)"
		],
		col: 1,
		row: 4,
		label: "in love"
	},
	{
		code: ":brokenheart:",
		aliases: ["</3"],
		col: 2,
		row: 4,
		label: "broken heart"
	},
	{
		code: "@>--",
		aliases: [":rose:", "@->--"],
		col: 3,
		row: 4,
		label: "rose"
	},
	{
		code: ":music:",
		aliases: ["(music)"],
		col: 4,
		row: 4,
		label: "musical note"
	},
	{
		code: "\\m/",
		aliases: ["(victory)", "(rock)"],
		col: 5,
		row: 4,
		label: "victory"
	}
];
var lookup = /* @__PURE__ */ new Map();
EMOTICONS.forEach((e) => {
	lookup.set(e.code.toLowerCase(), e);
	e.aliases.forEach((a) => lookup.set(a.toLowerCase(), e));
});
function findEmoticon(token) {
	return lookup.get(token.toLowerCase());
}
var EMOTICON_REGEX = (() => {
	const all = EMOTICONS.flatMap((e) => [e.code, ...e.aliases]).sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	return new RegExp(`(${all.join("|")})`, "g");
})();
function Emoticon({ code, size = 18, className }) {
	const e = findEmoticon(code);
	if (!e) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: code });
	const sheetW = size * 6;
	const sheetH = size * 5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"aria-label": e.label,
		className: cn("mx-px inline-block shrink-0 align-text-bottom", className),
		style: {
			width: size,
			height: size,
			backgroundImage: `url(${emoticons_default})`,
			backgroundSize: `${sheetW}px ${sheetH}px`,
			backgroundPosition: `-${e.col * size}px -${e.row * size}px`,
			imageRendering: "pixelated"
		}
	});
}
function withMentions(text, key) {
	return text.split(/(@[A-Za-z0-9_]{2,32})/g).map((p, i) => {
		if (p.startsWith("@")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded bg-mxit-primary/10 px-0.5 font-semibold text-mxit-primary",
			children: p
		}, `${key}-m-${i}`);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { whiteSpace: "pre-wrap" },
			children: p
		}, `${key}-t-${i}`);
	});
}
function EmoText({ text, size = 18 }) {
	const parts = text.split(EMOTICON_REGEX);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((part, i) => {
		if (i % 2 === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emoticon, {
			code: part,
			size
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: withMentions(part, i) }, i);
	}) });
}
//#endregion
export { EmoText as n, Emoticon as r, EMOTICONS as t };
