import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as nid, f as radioOnline, l as openSmsCompose, n as clipSms } from "./sms-DtDe-rh6.mjs";
import { r as zoneById } from "./zones-D1zBMza4.mjs";
import { U as Antenna } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Q as useCurrentUserState, W as sendDirect, d as useMxit, et as BackBtn, f as enqueueAirtime, it as Titlebar, j as loadConversation, nt as Screen, ot as sfx, q as setTyping, rt as Softkeys, s as Route$9, z as pollConversation } from "./router-BLZVt4yB.mjs";
import { n as PixelAvatar } from "./PixelAvatar-DvmVLcYv.mjs";
import { n as Composer, t as ChatLog } from "./ChatLog-B3pJriVH.mjs";
import { n as orbClass, t as MoodIcon } from "./MoodIcon-C7hfQIot.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as useVisiblePoll } from "./use-visible-poll-44gSrftS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._id-CQzmRu-H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function mergeIncoming(prev, incoming, meId) {
	if (!incoming.length) return prev;
	const ids = new Set(prev.map((m) => m.id));
	const extras = incoming.filter((m) => !ids.has(m.id));
	if (!extras.length) return prev;
	const extraMine = new Set(extras.filter((m) => m.sender_id === meId).map((m) => m.content));
	const cleaned = prev.filter((m) => !(m.id.startsWith("tmp-") && extraMine.has(m.content)));
	const have = new Set(cleaned.map((m) => m.id));
	return [...cleaned, ...extras.filter((m) => !have.has(m.id))];
}
function ChatPage() {
	const { id } = Route$9.useParams();
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [offline, setOffline] = (0, import_react.useState)(() => !radioOnline());
	const [airtime, setAirtime] = (0, import_react.useState)(() => !radioOnline());
	const typingPing = (0, import_react.useRef)(0);
	const afterId = (0, import_react.useRef)(null);
	const loaded = (0, import_react.useRef)(false);
	const expectBot = (0, import_react.useRef)(false);
	const meIdRef = (0, import_react.useRef)(profile?.id ?? "");
	meIdRef.current = profile?.id ?? "";
	(0, import_react.useEffect)(() => {
		if (!radioOnline()) setAirtime(true);
		else if (profile?.airtime_sms) setAirtime(true);
	}, [profile?.airtime_sms]);
	(0, import_react.useEffect)(() => {
		const sync = () => {
			const off = !radioOnline();
			setOffline(off);
			if (off) setAirtime(true);
		};
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
		};
	}, []);
	const pull = (0, import_react.useCallback)(async (full = false) => {
		try {
			if (full || !loaded.current) {
				const view = await loadConversation({ data: id });
				loaded.current = true;
				afterId.current = view.messages.at(-1)?.id ?? null;
				setData(view);
				return;
			}
			const r = await pollConversation({ data: {
				convId: id,
				afterId: afterId.current
			} });
			if (r.messages.length) afterId.current = r.messages.at(-1).id;
			setData((d) => {
				if (!d) return d;
				const meId = meIdRef.current;
				const msgs = r.messages.length ? mergeIncoming(d.messages, r.messages, meId) : d.messages;
				if (r.messages.some((m) => m.sender_id !== meId)) expectBot.current = false;
				const typing = r.typing || expectBot.current;
				if (msgs === d.messages && d.typing === typing) return d;
				return {
					...d,
					messages: msgs,
					typing
				};
			});
		} catch {
			if (full) navigate({ to: "/" });
		}
	}, [id, navigate]);
	(0, import_react.useEffect)(() => {
		loaded.current = false;
		afterId.current = null;
		expectBot.current = false;
		setData(null);
		pull(true);
	}, [id, pull]);
	useVisiblePoll(() => {
		if (!loaded.current) return;
		return pull(false);
	}, 2e3, [id, pull]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!profile || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mxit-classic-bg flex flex-1 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[13px] text-white/50",
			children: "opening chat…"
		})
	});
	const zone = zoneById(data.other.zone);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: data.other.display_name,
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					sfx.tap();
					navigate({
						to: "/u/$mxitId",
						params: { mxitId: data.other.mxit_id }
					});
				},
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
					code: data.other.mood_code,
					size: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: orbClass(data.other.presence) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-white/10 px-3 py-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
				seed: data.other.avatar_seed,
				size: 22
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-1.5 text-[11px] text-white/75",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-white/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide",
						children: zone.short
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-white/35",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: data.other.mood || `@${data.other.mxit_id}`
					}),
					airtime ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Antenna, { className: "h-3 w-3" }), " GSM"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto shrink-0 rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-100",
						children: "FREE"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatLog, {
			messages: data.messages,
			meId: profile.id,
			typing: !!data.typing,
			typingName: data.other.display_name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
			airtime,
			offline,
			onAirtimeChange: setAirtime,
			onTyping: () => {
				if (airtime || offline) return;
				const now = Date.now();
				if (now - typingPing.current < 1800) return;
				typingPing.current = now;
				setTyping({ data: id });
			},
			onSend: async (msg) => {
				const viaSms = msg.channel === "sms" || airtime;
				const body = viaSms ? clipSms(msg.content) : msg.content;
				const tempId = `tmp-${nid()}`;
				const optimistic = {
					id: tempId,
					sender_id: profile.id,
					content: body,
					delivery: "sending",
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					kind: viaSms ? "text" : msg.kind || "text",
					media: viaSms ? null : msg.media || null,
					channel: viaSms ? "sms" : "data"
				};
				if (!viaSms) expectBot.current = true;
				setData((d) => d ? {
					...d,
					messages: [...d.messages, optimistic],
					typing: !viaSms
				} : d);
				const fireRadio = () => {
					const dest = data.other.phone;
					if (viaSms && dest && !data.other.is_bot) openSmsCompose(dest, body);
				};
				try {
					const saved = await sendDirect({ data: {
						convId: id,
						content: body,
						kind: viaSms ? "text" : msg.kind,
						media: viaSms ? null : msg.media,
						channel: viaSms ? "sms" : "data"
					} });
					afterId.current = saved.id;
					setData((d) => {
						if (!d) return d;
						const next = d.messages.map((m) => m.id === tempId ? saved : m);
						return {
							...d,
							messages: next,
							typing: !viaSms
						};
					});
					fireRadio();
					if (!viaSms) {
						window.setTimeout(() => void pull(false), 700);
						window.setTimeout(() => void pull(false), 1600);
					}
				} catch (e) {
					if (viaSms) {
						enqueueAirtime({
							convId: id,
							content: body
						});
						fireRadio();
						setData((d) => {
							if (!d) return d;
							const next = d.messages.map((m) => m.id === tempId ? {
								...m,
								delivery: "sent",
								channel: "sms"
							} : m);
							return {
								...d,
								messages: next,
								typing: false
							};
						});
						toast.message(data.other.phone ? "On the radio — confirm Send in Messages" : "Queued on airtime — hits QXio when you're back on data");
						return;
					}
					expectBot.current = false;
					setData((d) => d ? {
						...d,
						messages: d.messages.filter((m) => m.id !== tempId),
						typing: false
					} : d);
					toast.error(e instanceof Error ? e.message : "Couldn't send");
					throw e;
				}
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({
					to: "/",
					replace: true
				}),
				children: "Back"
			}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({
					to: "/u/$mxitId",
					params: { mxitId: data.other.mxit_id }
				}),
				children: "Profile"
			})
		})
	] });
}
//#endregion
export { ChatPage as component };
