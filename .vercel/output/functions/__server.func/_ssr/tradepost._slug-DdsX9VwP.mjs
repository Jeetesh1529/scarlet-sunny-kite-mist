import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as spendMoola, Q as useCurrentUserState, Y as updateProfile, at as WatermarkList, d as useMxit, et as BackBtn, it as Titlebar, k as listRooms, m as buyEmoticard, nt as Screen, ot as sfx, r as Route$2, rt as Softkeys, tt as ListRow } from "./router-BLZVt4yB.mjs";
import { t as MOOLA_EXTRAS } from "./rates-DzKarHBy.mjs";
import { r as Emoticon, t as EMOTICONS } from "./Emoticon-cZQWoCya.mjs";
import { i as THEMES } from "./types-DkbMrLlo.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tradepost._slug-DdsX9VwP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIGNS = [
	["Aries", "Bold week. Send the message you've been sitting on."],
	["Taurus", "Treat yourself — but maybe not 400 Moola on Skinz."],
	["Gemini", "Two chats, one brain. QX Mix is calling."],
	["Cancer", "A farewell message would land tonight."],
	["Leo", "Main character in the Cape Town room. Obviously."],
	["Virgo", "Clean your contact list. Offline lurkers can wait."],
	["Libra", "Gift 25 Moola. Balance restored."],
	["Scorpio", "Someone read your status twice. You know who."],
	["Sagittarius", "Raid Moonbase. Fortune favours gunships."],
	["Capricorn", "Daily claim first. Then vibes."],
	["Aquarius", "A new QXio ID just searched for you."],
	["Pisces", "The 2007 chatrooms miss you too."]
];
var CITIES = [
	{
		city: "Cape Town",
		t: 18,
		s: "SE wind, Table cloth incoming"
	},
	{
		city: "Johannesburg",
		t: 16,
		s: "Highveld clear, jacket after 6"
	},
	{
		city: "Durban",
		t: 24,
		s: "Humid, late thunderstorm"
	},
	{
		city: "Pretoria",
		t: 17,
		s: "Jacarandas in the imagination"
	},
	{
		city: "Port Elizabeth",
		t: 19,
		s: "Windy as always"
	},
	{
		city: "Bloemfontein",
		t: 14,
		s: "Dry and honest"
	}
];
function TradepostSlug() {
	const { slug } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const { profile, refresh } = useMxit();
	const navigate = useNavigate();
	const [rooms, setRooms] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (slug === "chatrooms") listRooms().then(setRooms).catch(() => {});
	}, [slug]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: slug === "chatrooms" ? "Chat Rooms" : slug === "games" ? "Games" : slug === "horoscopes" ? "Horoscopes" : slug === "weather" ? "Weather" : slug === "skinz" ? "Skinz" : slug === "emoticards" ? "Emoticards" : "QX Post",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WatermarkList, { children: [
			slug === "chatrooms" && rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				onClick: () => {
					sfx.tap();
					navigate({
						to: "/room/$id",
						params: { id: r.id }
					});
				},
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
				trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-emerald-300/90",
					children: ["FREE · ", r.member_count]
				}),
				children: [r.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-[11px] font-normal text-white/60",
					children: r.topic
				})]
			}, r.id)),
			slug === "games" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
				onClick: () => navigate({ to: "/games/moonbase" }),
				children: ["Moonbase", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] font-normal text-white/60",
					children: "Build, raid, loot helium"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
				onClick: () => navigate({ to: "/games/tictactoe" }),
				children: ["Tic-Tac-Toe", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] font-normal text-white/60",
					children: "Vs the house · free"
				})]
			})] }),
			slug === "horoscopes" && SIGNS.map(([name, line]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-2 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] text-white/70",
					children: line
				})]
			}, name)),
			slug === "weather" && CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-2 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: c.city
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] text-white/60",
					children: c.s
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-pixel text-[12px]",
					children: [c.t, "°"]
				})]
			}, c.city)),
			slug === "skinz" && THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListRow, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-6 w-6 rounded-full border border-white/30",
					style: { background: t.swatch }
				}),
				onClick: async () => {
					try {
						if (profile && profile.theme !== t.id && t.id !== "classic") await spendMoola({ data: {
							amount: MOOLA_EXTRAS.skinz,
							reason: `Skinz · ${t.name}`
						} });
						await updateProfile({ data: { theme: t.id } });
						await refresh();
						toast.success(`${t.name} applied`);
					} catch (e) {
						toast.error(e instanceof Error ? e.message : `Need ${MOOLA_EXTRAS.skinz} Moola`);
					}
				},
				children: [t.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] font-normal text-white/60",
					children: t.id === "classic" ? "free" : `${MOOLA_EXTRAS.skinz} Moola`
				})]
			}, t.id)),
			slug === "emoticards" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-6 gap-2 px-4 py-3",
				children: EMOTICONS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex aspect-square items-center justify-center rounded-md bg-white/10",
					onClick: async () => {
						try {
							const r = await buyEmoticard({ data: e.code });
							await refresh();
							toast.success(r.already ? `Already in your pack` : `Unlocked ${e.label}`);
						} catch (e2) {
							toast.error(e2 instanceof Error ? e2.message : `Need ${MOOLA_EXTRAS.emoticard} Moola`);
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emoticon, {
						code: e.code,
						size: 28
					})
				}, e.code))
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({ to: "/tradepost" }),
				children: "Back"
			}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "h-7 bg-white/10 text-xs",
				onClick: () => navigate({ to: "/moola" }),
				children: "Moola"
			})
		})
	] });
}
//#endregion
export { TradepostSlug as component };
