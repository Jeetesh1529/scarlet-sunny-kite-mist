import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as prettyPhone } from "./sms-DtDe-rh6.mjs";
import { r as zoneById } from "./zones-D1zBMza4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as openChat, Q as useCurrentUserState, b as getPublicProfile, et as BackBtn, it as Titlebar, n as Route$1, nt as Screen, p as addContact, rt as Softkeys, x as giftMoola } from "./router-BLZVt4yB.mjs";
import { n as PixelAvatar } from "./PixelAvatar-DvmVLcYv.mjs";
import { n as orbClass, t as MoodIcon } from "./MoodIcon-C7hfQIot.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._mxitId-ZV-8MqyK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { mxitId } = Route$1.useParams();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [p, setP] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getPublicProfile({ data: mxitId }).then(setP).catch(() => setP(null));
	}, [mxitId]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
		title: "Profile",
		left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-white/70",
		children: "User not found."
	})] });
	const zone = zoneById(p.zone);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: p.display_name,
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: orbClass(p.presence) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center gap-3 p-6 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
					seed: p.avatar_seed,
					size: 88,
					ring: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[13px] text-white/80",
					children: [
						"@",
						p.mxit_id,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-200",
							children: "unique"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-white/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
						code: p.mood_code,
						size: 22
					}), p.mood]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold",
					children: [
						zone.short,
						" · ",
						zone.label
					]
				}),
				p.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full bg-amber-400/15 px-3 py-1 text-[12px] font-semibold text-amber-100",
					children: ["Airtime SMS · ", prettyPhone(p.phone)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						p.contact_status !== "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								try {
									await addContact({ data: p.mxit_id });
									toast.success("Request sent");
								} catch (e) {
									toast.error(e instanceof Error ? e.message : "Failed");
								}
							},
							children: "Add"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: async () => {
								const { id } = await openChat({ data: p.id });
								navigate({
									to: "/chat/$id",
									params: { id }
								});
							},
							children: "Chat"
						}),
						p.contact_status === "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: async () => {
								try {
									await giftMoola({ data: {
										otherId: p.id,
										amount: 25
									} });
									toast.success("Sent 25 Moola");
								} catch (e) {
									toast.error(e instanceof Error ? e.message : "Gift failed");
								}
							},
							children: "Gift 25"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { ProfilePage as component };
