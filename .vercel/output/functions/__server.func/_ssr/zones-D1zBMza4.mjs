//#region node_modules/.nitro/vite/services/ssr/assets/zones-D1zBMza4.js
var ZONES = [
	{
		id: "ct",
		label: "Cape Town",
		short: "CT",
		city: "Mother City",
		room: "room-cpt"
	},
	{
		id: "jhb",
		label: "Johannesburg",
		short: "Jozi",
		city: "Egoli",
		room: "room-jhb"
	},
	{
		id: "dbn",
		label: "Durban",
		short: "Durbs",
		city: "The Playground",
		room: "room-dbn"
	},
	{
		id: "pta",
		label: "Pretoria",
		short: "PTA",
		city: "Jacaranda City",
		room: "room-general"
	},
	{
		id: "pe",
		label: "Gqeberha",
		short: "PE",
		city: "Windy City",
		room: "room-general"
	},
	{
		id: "other",
		label: "Elsewhere",
		short: "ZA",
		city: "Anywhere",
		room: "room-general"
	}
];
function zoneById(id) {
	return ZONES.find((z) => z.id === id) ?? ZONES[0];
}
var RESERVED_QXIO_IDS = /* @__PURE__ */ new Set([
	"joebanker",
	"jade_ct",
	"sipho",
	"thandi",
	"lurker",
	"qxiohelp",
	"qxio",
	"qx",
	"mxit",
	"admin",
	"support",
	"system",
	"official",
	"banker",
	"help",
	"post",
	"mix",
	"moola",
	"tradepost",
	"multimx",
	"moonbase",
	"qxbanker",
	"qxpost",
	"qxmix",
	"root",
	"mod",
	"moderator",
	"staff",
	"null",
	"undefined",
	"me",
	"owner",
	"team"
]);
//#endregion
export { ZONES as n, zoneById as r, RESERVED_QXIO_IDS as t };
