import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { G as sendGroup, M as loadGroup, Q as useCurrentUserState, a as Route$5, d as useMxit, et as BackBtn, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { n as Composer, t as ChatLog } from "./ChatLog-B3pJriVH.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as useVisiblePoll } from "./use-visible-poll-44gSrftS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/multimx._id-qAmkPopM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GroupChat() {
	const { id } = Route$5.useParams();
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	const [group, setGroup] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const reload = (0, import_react.useCallback)(async () => {
		const r = await loadGroup({ data: id });
		setGroup(r.group);
		setMessages((prev) => {
			if (prev.length === r.messages.length && prev.at(-1)?.id === r.messages.at(-1)?.id) return prev;
			return r.messages;
		});
	}, [id]);
	useVisiblePoll(reload, 5e3, [id, reload]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!profile || !group) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: group.name,
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, { to: "/multimx" }),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px]",
				children: group.member_count
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatLog, {
			messages,
			meId: profile.id,
			showNames: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, { onSend: async (msg) => {
			const r = await sendGroup({ data: {
				groupId: id,
				content: msg.content,
				kind: msg.kind,
				media: msg.media
			} });
			setGroup(r.group);
			setMessages(r.messages);
		} }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/multimx",
				replace: true
			}),
			children: "Back"
		}) })
	] });
}
//#endregion
export { GroupChat as component };
