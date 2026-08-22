import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as prettyPhone, r as cn } from "./sms-DtDe-rh6.mjs";
import { n as ZONES, r as zoneById } from "./zones-D1zBMza4.mjs";
import { i as signOut } from "./client-sGid3STf.mjs";
import { D as MailOpen, E as Mail, F as Coins, H as Bell, N as Flame, O as LogOut, P as Copy, R as ChevronDown, T as MapPin, _ as Pin, d as Signal, f as Share2, g as Plus, m as Search, o as Star, t as X, v as PinOff, x as Minus, z as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as AppSplash, H as respondContact, I as myAchievements, L as openChat, Q as useCurrentUserState, R as pinContact, T as listContacts, U as searchUsers, Y as updateProfile, at as WatermarkList, d as useMxit, g as claimDaily, it as Titlebar, ot as sfx, p as addContact, rt as Softkeys, x as giftMoola } from "./router-BLZVt4yB.mjs";
import { n as EmoText } from "./Emoticon-cZQWoCya.mjs";
import { n as PixelAvatar, t as AVATAR_SEEDS } from "./PixelAvatar-DvmVLcYv.mjs";
import { a as ZONE_ROOMS, i as THEMES, n as MXIT_SYSTEM, r as PRESENCES, t as MOODS } from "./types-DkbMrLlo.mjs";
import { n as orbClass, t as MoodIcon } from "./MoodIcon-C7hfQIot.mjs";
import { t as useVisiblePoll } from "./use-visible-poll-44gSrftS.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as Textarea } from "./textarea-BesYy3E8.mjs";
import { t as Input } from "./input-ZuA8S123.mjs";
import { i as openPhoneInstall, n as Label, r as isStandaloneApp, t as AuthScreen } from "./AuthScreen-DUwXcE5G.mjs";
import { t as RatesCard } from "./RatesCard-42QjotzG.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-raCJeo9w.mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D-M8WC_b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSeparator = Separator2;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-md border border-white/15 bg-[#0d2a3a] p-1 text-white shadow-lg", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none data-[highlighted]:bg-white/10", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/20 transition-colors data-[state=checked]:bg-mxit-primary data-[state=unchecked]:bg-white/15", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5" })
	});
}
var ICON = "/icon-192.png";
function canNotify() {
	return typeof window !== "undefined" && "Notification" in window;
}
async function requestPushPermission() {
	if (!canNotify()) return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;
	try {
		return await Notification.requestPermission() === "granted";
	} catch {
		return false;
	}
}
function notifyIncoming(title, body, tag) {
	if (!canNotify()) return;
	if (Notification.permission !== "granted") return;
	if (typeof document !== "undefined" && document.visibilityState === "visible") return;
	try {
		const n = new Notification(title, {
			body: body.slice(0, 120),
			tag: tag || "qxio-msg",
			icon: ICON,
			silent: false
		});
		n.onclick = () => {
			window.focus();
			n.close();
		};
	} catch {}
}
function pushPermission() {
	if (!canNotify()) return "unsupported";
	return Notification.permission;
}
function contactsSig(list) {
	return list.map((c) => `${c.id}:${c.pinned ? 1 : 0}:${c.unread_count}:${c.status}:${c.last_message ?? ""}:${c.other.presence}:${c.other.mood_code ?? ""}`).join("|");
}
var ContactRowBtn = (0, import_react.memo)(function ContactRowBtn({ c, selected, onOpen, onActions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(c),
		onContextMenu: (e) => {
			e.preventDefault();
			onActions(c);
		},
		className: `flex w-full items-center gap-2.5 py-2 pl-6 pr-3 text-left ${selected ? "mxit-row-active" : ""}`,
		"data-contact": c.other.display_name,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
					seed: c.other.avatar_seed,
					size: 32
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${orbClass(c.other.presence)} absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1 font-medium tracking-wide text-white",
				style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [
						c.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 shrink-0 fill-amber-300 text-amber-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: c.other.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
							code: c.other.mood_code || c.other.mood,
							size: 18
						}),
						c.other.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signal, { className: "h-3 w-3 shrink-0 text-amber-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-full bg-white/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white/70",
							children: zoneById(c.other.zone).short
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-[11px] font-normal text-white/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoText, {
						text: c.last_message || c.other.mood || `@${c.other.mxit_id}`,
						size: 12
					})
				})]
			}),
			c.unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "envelope-unread h-4 w-4" }), (c.unread_count ?? 0) > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-black",
					children: c.unread_count
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "envelope-read h-4 w-4" })
		]
	});
});
function HomeScreen() {
	const [view, setView] = (0, import_react.useState)("contacts");
	if (view === "profile") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, { onBack: () => setView("contacts") });
	if (view === "settings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, { onBack: () => setView("contacts") });
	if (view === "help") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpView, { onBack: () => setView("contacts") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactsTab, { onViewChange: setView });
}
function ContactsTab({ onViewChange }) {
	const { profile, setPresence, refresh } = useMxit();
	const navigate = useNavigate();
	const [contacts, setContacts] = (0, import_react.useState)([]);
	const [openGroups, setOpenGroups] = (0, import_react.useState)({
		Favourites: true,
		QXio: true,
		Zones: true,
		Friends: true,
		Invites: true,
		Offline: false,
		Sent: true
	});
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [addId, setAddId] = (0, import_react.useState)("");
	const [moodOpen, setMoodOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [giftFor, setGiftFor] = (0, import_react.useState)(null);
	const [giftAmt, setGiftAmt] = (0, import_react.useState)(25);
	const [zoneFilter, setZoneFilter] = (0, import_react.useState)("all");
	const [actionsFor, setActionsFor] = (0, import_react.useState)(null);
	const seenUnread = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const primed = (0, import_react.useRef)(false);
	const sig = (0, import_react.useRef)("");
	const load = (0, import_react.useCallback)(async () => {
		try {
			const list = await listContacts();
			if (primed.current && profile?.notify_push !== false) for (const c of list) {
				const prev = seenUnread.current.get(c.other.id) ?? 0;
				if (c.unread_count > prev) {
					sfx.receive();
					notifyIncoming(c.other.display_name, c.last_message || "New message", `qx-${c.other.id}`);
				}
			}
			primed.current = true;
			const next = /* @__PURE__ */ new Map();
			for (const c of list) next.set(c.other.id, c.unread_count);
			seenUnread.current = next;
			const nextSig = contactsSig(list);
			if (nextSig === sig.current) return;
			sig.current = nextSig;
			setContacts(list);
		} catch {}
	}, [profile?.notify_push]);
	useVisiblePoll(load, 1e4, [load]);
	(0, import_react.useEffect)(() => {
		if (profile?.notify_push !== false && pushPermission() === "default") requestPushPermission();
	}, [profile?.notify_push]);
	const groups = (0, import_react.useMemo)(() => {
		const incoming = contacts.filter((c) => c.status === "pending" && c.addressee_id === profile?.id);
		const sentOut = contacts.filter((c) => c.status === "pending" && c.requester_id === profile?.id);
		const accepted = contacts.filter((c) => c.status === "accepted");
		const inZone = (c) => zoneFilter === "all" || c.other.zone === zoneFilter;
		const byActivity = (a, b) => {
			const au = a.unread_count ?? (a.unread ? 1 : 0);
			const bu = b.unread_count ?? (b.unread ? 1 : 0);
			if (au !== bu) return bu - au;
			const at = a.last_message_at ?? "";
			const bt = b.last_message_at ?? "";
			if (at !== bt) return String(bt).localeCompare(String(at));
			return a.other.display_name.localeCompare(b.other.display_name);
		};
		const pinned = accepted.filter((c) => c.pinned && inZone(c)).sort(byActivity);
		return {
			incoming,
			sentOut,
			friends: accepted.filter((c) => !c.pinned && c.other.presence !== "offline" && inZone(c)).sort(byActivity),
			offline: accepted.filter((c) => !c.pinned && c.other.presence === "offline" && inZone(c)).sort(byActivity),
			pinned
		};
	}, [
		contacts,
		profile?.id,
		zoneFilter
	]);
	const toggleGroup = (k) => {
		sfx.tap();
		setOpenGroups((g) => ({
			...g,
			[k]: !g[k]
		}));
	};
	const goChat = (c) => {
		sfx.tap();
		setSelectedId(c.id);
		if (c.conversation_id) {
			navigate({
				to: "/chat/$id",
				params: { id: c.conversation_id }
			});
			return;
		}
		openChat({ data: c.other.id }).then(({ id }) => {
			navigate({
				to: "/chat/$id",
				params: { id }
			});
		});
	};
	const claim = async () => {
		try {
			const r = await claimDaily();
			sfx.receive();
			toast.success(`+${r.amount} Moola · ${r.streak}-day streak`);
			await refresh();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Already claimed");
		}
	};
	const togglePin = async (c) => {
		const next = !c.pinned;
		setContacts((prev) => prev.map((x) => x.id === c.id ? {
			...x,
			pinned: next
		} : x));
		try {
			await pinContact({ data: {
				id: c.id,
				pinned: next
			} });
			sfx.tap();
		} catch (e) {
			setContacts((prev) => prev.map((x) => x.id === c.id ? {
				...x,
				pinned: c.pinned
			} : x));
			toast.error(e instanceof Error ? e.message : "Could not pin");
		}
	};
	const myKind = profile?.presence ?? "offline";
	const canClaim = profile && String(profile.last_daily_claim ?? "").slice(0, 10) !== (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const GroupHeader = ({ name, count }) => {
		const open = !!openGroups[name];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => toggleGroup(name),
			className: "flex w-full items-center gap-2 px-3 py-1.5 text-white",
			style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex h-4 w-4 items-center justify-center border border-white/40 bg-white/5 text-[10px] text-white",
				children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-2.5 w-2.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-medium tracking-wide",
				children: [
					name,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "opacity-80",
						children: [
							"(",
							count,
							")"
						]
					})
				]
			})]
		});
	};
	const FriendRow = ({ c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRowBtn, {
		c,
		selected: selectedId === c.id,
		onOpen: goChat,
		onActions: setActionsFor
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-classic-bg flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
				title: "Contacts",
				left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "cycle status",
					onClick: () => {
						sfx.tap();
						const next = profile?.presence === "online" ? "away" : profile?.presence === "away" ? "busy" : profile?.presence === "busy" ? "offline" : "online";
						setPresence(next);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: orbClass(myKind) })
				}),
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "set mood",
					onClick: () => {
						sfx.tap();
						setMoodOpen(true);
					},
					className: "flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
						code: profile?.mood_code || profile?.mood,
						size: 22
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1.5 overflow-x-auto px-3 py-2 no-scrollbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setZoneFilter("all"),
					className: `shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${zoneFilter === "all" ? "bg-white text-[#0A1B3D]" : "bg-white/10 text-white/80"}`,
					children: "All"
				}), ZONES.filter((z) => z.id === "ct" || z.id === "jhb" || z.id === "dbn").map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setZoneFilter(z.id),
					className: `shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${zoneFilter === z.id ? "bg-white text-[#0A1B3D]" : "bg-white/10 text-white/80"}`,
					children: z.short
				}, z.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WatermarkList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						sfx.tap();
						onViewChange("help");
					},
					className: "flex w-full items-center gap-3 px-3 py-1.5 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 font-medium text-white",
							style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
							children: "Info"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "envelope-read h-4 w-4" })
					]
				}),
				canClaim && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: claim,
					className: "mx-3 my-2 flex w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/20 px-3 py-2 text-[12px] text-amber-50 hover:bg-amber-500/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-amber-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Daily login bonus ready"
							}), profile && profile.streak_days > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 text-amber-200/80",
								children: [
									"· ",
									profile.streak_days,
									"-day streak"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold tracking-wider text-amber-200",
							children: "CLAIM"
						})
					]
				}),
				!canClaim && profile && profile.streak_days > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-3 my-1 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-amber-200/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3 text-amber-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold",
							children: [profile.streak_days, "-day streak"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/50",
							children: "· come back tomorrow"
						})
					]
				}),
				groups.pinned.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Favourites",
					count: groups.pinned.length
				}), openGroups.Favourites && groups.pinned.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendRow, { c }, c.id))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "QXio",
					count: MXIT_SYSTEM.length
				}),
				openGroups.QXio && MXIT_SYSTEM.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-contact": s.name,
					onClick: () => {
						sfx.tap();
						navigate({ href: s.route });
					},
					className: "flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 truncate font-medium tracking-wide text-white",
							style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
							children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate text-[11px] font-normal text-white/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
										code: s.mood,
										size: 14
									}),
									" ",
									s.sub
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "envelope-read h-4 w-4" })
					]
				}, s.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Zones",
					count: ZONE_ROOMS.length
				}),
				openGroups.Zones && ZONE_ROOMS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-contact": s.name,
					onClick: () => {
						sfx.tap();
						navigate({ href: s.route });
					},
					className: "flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-cyan-100",
							children: zoneById(s.zone).short
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 truncate font-medium tracking-wide text-white",
							style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
							children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate text-[11px] font-normal text-white/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
										code: s.mood,
										size: 14
									}),
									" ",
									s.sub
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-white/50" })
					]
				}, s.id)),
				groups.incoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Invites",
					count: groups.incoming.length
				}), openGroups.Invites && groups.incoming.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 py-1.5 pl-7 pr-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-invite" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 font-medium text-white",
							children: c.other.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded bg-emerald-600/80 p-1 text-white",
							onClick: async () => {
								await respondContact({ data: {
									id: c.id,
									accept: true
								} });
								load();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded bg-red-700/80 p-1 text-white",
							onClick: async () => {
								await respondContact({ data: {
									id: c.id,
									accept: false
								} });
								load();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})
					]
				}, c.id))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Friends",
					count: groups.friends.length
				}),
				openGroups.Friends && (groups.friends.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-7 py-2 text-[12px] italic text-white/50",
					children: "No friends in this zone. Menu → Add contact, or Meet people."
				}) : groups.friends.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendRow, { c }, c.id))),
				groups.sentOut.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Sent",
					count: groups.sentOut.length
				}), openGroups.Sent && groups.sentOut.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 py-1.5 pl-7 pr-3 text-white/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-invite" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: c.other.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-white/50",
							children: "waiting…"
						})
					]
				}, c.id))] }),
				!profile?.hide_offline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					name: "Offline",
					count: groups.offline.length
				}), openGroups.Offline && groups.offline.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void goChat(c),
					onContextMenu: (e) => {
						e.preventDefault();
						setActionsFor(c);
					},
					className: "flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
							seed: c.other.avatar_seed,
							size: 28
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 truncate font-medium text-white",
							children: [c.other.display_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
								code: c.other.mood_code,
								size: 14,
								className: "ml-1 inline-block"
							})]
						}),
						c.unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "envelope-unread h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "envelope-read h-4 w-4" })
					]
				}, c.id))] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
				left: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex items-center gap-1 active:bg-black/30",
						children: ["Menu ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 opacity-70" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "start",
					side: "top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setAddOpen(true),
							children: "Add contact…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => setMoodOpen(true),
							children: "Set mood…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1 h-px bg-white/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => onViewChange("profile"),
							children: "My profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => onViewChange("settings"),
							children: "Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => navigate({ to: "/meet" }),
							children: "Meet people"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => navigate({ to: "/leaderboards" }),
							children: "Leaderboards"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => onViewChange("help"),
							children: "Help"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1 h-px bg-white/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => void signOut(),
							children: "Logout"
						})
					]
				})] }),
				center: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						sfx.tap();
						navigate({ to: "/status" });
					},
					className: "flex items-center gap-1 border-l border-white/10 px-2 text-[12px] font-semibold active:bg-black/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-emerald-400" }), " Status"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						sfx.tap();
						setSearchOpen(true);
					},
					className: "flex items-center justify-center border-l border-r border-white/10 px-2 active:bg-black/30",
					"aria-label": "Search",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
				})] }),
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						const sel = contacts.find((c) => c.id === selectedId);
						if (sel && sel.status === "accepted") goChat(sel);
						else toast.message("Select a contact to chat");
					},
					className: "active:bg-black/30",
					children: "Chat"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "mxit-presence-dialog border-white/20 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add contact" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-white/80",
							children: "QXio ID — unique to each person"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: addId,
							onChange: (e) => setAddId(e.target.value),
							placeholder: "jade_ct",
							className: "border-white/20 bg-white/10 text-white"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							onClick: async () => {
								try {
									await addContact({ data: addId });
									toast.success("Request sent");
									setAddOpen(false);
									setAddId("");
									load();
								} catch (e) {
									toast.error(e instanceof Error ? e.message : "Failed");
								}
							},
							children: "Add"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: moodOpen,
				onOpenChange: setMoodOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "mxit-presence-dialog border-white/20 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Mood" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: async () => {
								sfx.tap();
								await updateProfile({ data: {
									mood_code: m.code,
									mood: m.label,
									presence: m.presence
								} });
								await refresh();
								setMoodOpen(false);
							},
							className: "flex items-center gap-2 rounded-xl border border-white/15 px-2 py-2 text-left hover:bg-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
								code: m.code,
								size: 28
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: m.label
							})]
						}, m.code))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: searchOpen,
				onOpenChange: setSearchOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "mxit-presence-dialog border-white/20 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Search QXio" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPanel, { onPick: async (id) => {
						setSearchOpen(false);
						await addContact({ data: id }).catch(() => {});
						load();
					} })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!giftFor,
				onOpenChange: () => setGiftFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "mxit-presence-dialog border-white/20 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Gift Moola to ", giftFor?.display_name] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: giftAmt,
							onChange: (e) => setGiftAmt(parseInt(e.target.value || "0", 10)),
							className: "border-white/20 bg-white/10 text-white"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-3 w-full",
							onClick: async () => {
								if (!giftFor) return;
								try {
									await giftMoola({ data: {
										otherId: giftFor.id,
										amount: giftAmt
									} });
									toast.success("Gift sent");
									setGiftFor(null);
									await refresh();
								} catch (e) {
									toast.error(e instanceof Error ? e.message : "Failed");
								}
							},
							children: [
								"Send ",
								giftAmt,
								" M"
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!actionsFor,
				onOpenChange: () => setActionsFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "mxit-presence-dialog border-white/20 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: actionsFor?.other.display_name }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									if (actionsFor) goChat(actionsFor);
									setActionsFor(null);
								},
								children: "Chat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									if (actionsFor) togglePin(actionsFor);
									setActionsFor(null);
								},
								children: actionsFor?.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "h-4 w-4" }), " Unpin"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-4 w-4" }), " Pin favourite"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									if (actionsFor) setGiftFor(actionsFor.other);
									setActionsFor(null);
								},
								children: "Gift Moola"
							})
						]
					})]
				})
			})
		]
	});
}
function SearchPanel({ onPick }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => {
			if (q.trim().length < 2) {
				setHits([]);
				return;
			}
			searchUsers({ data: q }).then(setHits).catch(() => setHits([]));
		}, 250);
		return () => clearTimeout(t);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "name or QXio ID",
			className: "border-white/20 bg-white/10 text-white"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-56 space-y-1 overflow-y-auto",
			children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick(h.mxit_id),
				className: "flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
						seed: h.avatar_seed,
						size: 28
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex-1",
						children: [h.display_name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-[11px] text-white/60",
							children: [
								"@",
								h.mxit_id,
								" · ",
								zoneById(h.zone).short
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
						code: h.mood_code,
						size: 18
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: orbClass(h.presence) })
				]
			}, h.id))
		})]
	});
}
function ChromeInner({ title, onBack, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-classic-bg flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
				title,
				left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					className: "rounded-sm border border-white/20 bg-white/10 px-2 py-0.5 text-[11px]",
					children: "‹ Back"
				}),
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mxit-watermark relative min-h-0 flex-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mxit-watermark-mark",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 space-y-3 p-3 text-white",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
				left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					children: "Back"
				}),
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					children: "OK"
				})
			})
		]
	});
}
function Card({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "space-y-2 rounded-xl border border-white/15 bg-white/8 p-3 backdrop-blur-sm",
		children
	});
}
function ProfileView({ onBack }) {
	const { profile, refresh, setPresence } = useMxit();
	const [displayName, setDisplayName] = (0, import_react.useState)(profile?.display_name ?? "");
	const [mood, setMood] = (0, import_react.useState)(profile?.mood ?? "");
	const [farewell, setFarewell] = (0, import_react.useState)(profile?.farewell ?? "");
	const [avatarSeed, setAvatarSeed] = (0, import_react.useState)(profile?.avatar_seed ?? AVATAR_SEEDS[0]);
	const [zone, setZone] = (0, import_react.useState)(profile?.zone ?? "ct");
	const [phone, setPhone] = (0, import_react.useState)(profile?.phone ?? "");
	const [ach, setAch] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		myAchievements().then(setAch).catch(() => {});
	}, []);
	if (!profile) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChromeInner, {
		title: "My profile",
		onBack,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
					seed: avatarSeed,
					size: 56
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[11px] text-white/80",
							children: [
								"@",
								profile.mxit_id,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-200",
									children: "unique"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-[11px] text-amber-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3 w-3" }),
								" ",
								profile.moola,
								" Moola"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-1.5 text-[11px] text-white/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
									code: profile.mood_code,
									size: 16
								}),
								" ",
								profile.mood,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-white/10 px-1.5",
									children: zoneById(profile.zone).short
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/80",
								onClick: async () => {
									try {
										await navigator.clipboard.writeText(`@${profile.mxit_id}`);
										toast.success("QXio ID copied");
									} catch {
										toast.message(`@${profile.mxit_id}`);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copy ID"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/80",
								onClick: async () => {
									const text = `Add me on QXio — my ID is @${profile.mxit_id}`;
									try {
										if (navigator.share) {
											await navigator.share({
												title: "QXio",
												text
											});
											return;
										}
									} catch {}
									try {
										await navigator.clipboard.writeText(text);
										toast.success("Invite copied");
									} catch {
										toast.message(text);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3 w-3" }), " Invite"]
							})]
						})
					]
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: PRESENCES.map(({ p, label, orb }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void setPresence(p),
					className: `flex items-center gap-2 rounded-xl border px-2 py-1.5 ${profile.presence === p ? "border-white/40 bg-white/15" : "border-white/10 hover:bg-white/5"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-orb ${orb}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13px]",
						children: label
					})]
				}, p))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Zone"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1.5",
				children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setZone(z.id),
					className: `rounded-xl border px-2 py-2 text-left ${zone === z.id ? "border-white/50 bg-white/15" : "border-white/10"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-semibold",
						children: z.short
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[10px] text-white/60",
						children: z.label
					})]
				}, z.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] font-medium uppercase opacity-80",
					children: "Cell · Airtime SMS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-white/55",
					children: "Optional fallback when you have reception but no bundle. QXio still charges R0 — your network may charge SMS (~80c), the expensive path old Mxit escaped. Data chat is free."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-[12px] text-white/80",
					children: "SA cell number"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: phone,
					onChange: (e) => setPhone(e.target.value),
					placeholder: "082 123 4567",
					inputMode: "tel",
					className: "border-white/20 bg-white/10 text-white"
				}),
				profile.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-amber-200/80",
					children: [
						"Linked ",
						prettyPhone(profile.phone),
						" · unique to this QXio ID"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-[12px] text-white/80",
					children: "Display name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: displayName,
					onChange: (e) => setDisplayName(e.target.value),
					className: "border-white/20 bg-white/10 text-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "pt-1 text-[12px] text-white/80",
					children: "Mood message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: mood,
					onChange: (e) => setMood(e.target.value),
					maxLength: 80,
					className: "border-white/20 bg-white/10 text-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5 gap-1.5 pt-1",
					children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: m.label,
						onClick: async () => {
							await updateProfile({ data: {
								mood_code: m.code,
								mood: m.label,
								presence: m.presence
							} });
							setMood(m.label);
							await refresh();
						},
						className: `flex items-center justify-center rounded-lg border p-1.5 ${profile.mood_code === m.code ? "border-white/50 bg-white/15" : "border-white/10"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
							code: m.code,
							size: 22
						})
					}, m.code))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "pt-1 text-[12px] text-white/80",
					children: "Farewell (sent on logout)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: farewell,
					onChange: (e) => setFarewell(e.target.value),
					rows: 2,
					className: "border-white/20 bg-white/10 text-white"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Pixel avatar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-5 gap-2",
				children: AVATAR_SEEDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAvatarSeed(s),
					className: `rounded p-1 ${avatarSeed === s ? "bg-amber-400/30 ring-1 ring-amber-300" : "bg-white/5"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
						seed: s,
						size: 40
					})
				}, s))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					await updateProfile({ data: {
						display_name: displayName,
						mood,
						farewell,
						avatar_seed: avatarSeed,
						zone,
						phone
					} });
					await refresh();
					toast.success("Profile saved");
				},
				className: "w-full",
				children: "Save profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Achievements"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 text-[12px]",
				children: [
					"welcome",
					"first_chat",
					"first_friend",
					"daily",
					"status",
					"raid"
				].map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded border px-2 py-1 ${ach.some((a) => a.code === code) ? "border-amber-300/40 bg-amber-400/20 text-amber-100" : "border-white/10 text-white/40"}`,
					children: code.replace("_", " ")
				}, code))
			})] })
		]
	});
}
function SettingsView({ onBack }) {
	const { profile, refresh } = useMxit();
	if (!profile) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChromeInner, {
		title: "Settings",
		onBack,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Skinz"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: async () => {
						await updateProfile({ data: { theme: t.id } });
						await refresh();
					},
					className: `flex items-center gap-2 rounded-xl border px-2 py-2 ${profile.theme === t.id ? "border-white/50 bg-white/15" : "border-white/10"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-4 w-4 rounded-full",
						style: { background: t.swatch }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13px]",
						children: t.name
					})]
				}, t.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "Display mode"
			}), [
				"normal",
				"light",
				"dark"
			].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: async () => {
					await updateProfile({ data: { display_mode: m } });
					await refresh();
				},
				className: `mr-2 mt-1 rounded border px-3 py-1 text-sm capitalize ${profile.display_mode === m ? "border-white/40 bg-white/15" : "border-white/10"}`,
				children: m
			}, m))] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sound" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: profile.sound_enabled,
						onCheckedChange: async (v) => {
							await updateProfile({ data: { sound_enabled: v } });
							await refresh();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hide offline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: profile.hide_offline,
						onCheckedChange: async (v) => {
							await updateProfile({ data: { hide_offline: v } });
							await refresh();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Read receipts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: profile.read_receipts,
						onCheckedChange: async (v) => {
							await updateProfile({ data: { read_receipts: v } });
							await refresh();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), " Message alerts"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: profile.notify_push !== false,
						onCheckedChange: async (v) => {
							if (v) await requestPushPermission();
							await updateProfile({ data: { notify_push: v } });
							await refresh();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-white/50",
					children: "Get a banner when someone messages you, even if QXio is in the background."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signal, { className: "h-4 w-4 text-amber-300" }), " Airtime SMS"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: !!profile.airtime_sms,
					onCheckedChange: async (v) => {
						await updateProfile({ data: { airtime_sms: v } });
						await refresh();
					}
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-white/50",
				children: "Prefer GSM for texts when you have no data. QXio is still free; your telco may charge SMS (~80c). Pictures and voice stay on data chat, which is R0."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "destructive",
				className: "w-full",
				onClick: () => void signOut(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Logout"]
			})
		]
	});
}
function HelpView({ onBack }) {
	const [installed, setInstalled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setInstalled(isStandaloneApp());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChromeInner, {
		title: "Help",
		onBack,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[13px] font-semibold",
				children: "QXio v1.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-white/80",
				children: "A blast from the past — contacts, zones, airtime SMS, QX Mix, Moola, QX Post and Moonbase, rebuilt for phones."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatesCard, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] font-medium uppercase opacity-80",
					children: "Airtime SMS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-white/80",
					children: "Texts can leave your phone over the GSM radio — reception and airtime, no data bundle. Pictures and files cannot. QXio does not charge; your network might."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc space-y-1 pl-4 text-[13px] text-white/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Save your cell on My profile." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "In chat, tap the antenna. 160 characters, one SMS." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "If they saved a number, your phone opens Messages and the network carries it." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Use data chat when you can — send and receive is free." })
					]
				})
			] }),
			!installed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] font-medium uppercase opacity-80",
					children: "Install on your phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-white/80",
					children: "QXio installs to your home screen like a native app — glossy list, soft-keys, full screen. Add it from your browser, or look for QXio on the stores."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => {
							sfx.tap();
							openPhoneInstall("ios");
						},
						children: "iPhone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => {
							sfx.tap();
							openPhoneInstall("android");
						},
						children: "Android"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-white/50",
					children: "iPhone: Share → Add to Home Screen. Android: menu → Install app / Add to Home screen."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium uppercase opacity-80",
				children: "How to QXio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "list-disc space-y-1 pl-4 text-[13px] text-white/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Your QXio ID is unique and locked. Nobody else can claim it." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Send and receive is free on data. Rooms too. Moola is for extras only." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Airtime SMS: antenna in chat — texts over reception. QXio R0; network may charge SMS." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Long-press a friend to pin them as a favourite." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Zones: CT, Jozi, Durbs — filter the list or jump into the room." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "In chat: photos, voice notes, and typing dots." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Turn on Message alerts in Settings for push when someone pings you." })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/legal/terms",
				className: "block text-[13px] underline",
				children: "Terms"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/legal/privacy",
				className: "block text-[13px] underline",
				children: "Privacy"
			})] })
		]
	});
}
function Home() {
	const { user, isPending } = useCurrentUserState();
	const { profile, loading } = useMxit();
	if (isPending || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSplash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, {});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, { needsProfile: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
}
//#endregion
export { Home as component };
