import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { K as sendRoom, N as loadRoom, Q as useCurrentUserState, d as useMxit, et as BackBtn, i as Route$3, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { n as Composer, t as ChatLog } from "./ChatLog-B3pJriVH.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as useVisiblePoll } from "./use-visible-poll-44gSrftS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/room._id-BQETiAj5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoomPage() {
	const { id } = Route$3.useParams();
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const reload = (0, import_react.useCallback)(async () => {
		const r = await loadRoom({ data: id });
		setRoom(r.room);
		setMessages((prev) => {
			if (prev.length === r.messages.length && prev.at(-1)?.id === r.messages.at(-1)?.id) return prev;
			return r.messages;
		});
	}, [id]);
	useVisiblePoll(reload, 5e3, [id, reload]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!profile || !room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: room.name,
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/tradepost" }),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-emerald-200",
				children: ["FREE · ", room.member_count]
			})
		}),
		room.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 py-1 text-[11px] text-white/70",
			children: room.topic
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatLog, {
			messages,
			meId: profile.id,
			showNames: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, { onSend: async (msg) => {
			const r = await sendRoom({ data: {
				roomId: id,
				content: msg.content,
				kind: msg.kind,
				media: msg.media
			} });
			setRoom(r.room);
			setMessages(r.messages);
		} }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({
					to: "/tradepost",
					replace: true
				}),
				children: "Back"
			}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] opacity-70",
				children: "Zone"
			})
		})
	] });
}
//#endregion
export { RoomPage as component };
