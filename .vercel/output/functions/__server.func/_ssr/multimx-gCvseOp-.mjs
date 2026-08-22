import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as listGroups, Q as useCurrentUserState, T as listContacts, _ as createGroup, at as WatermarkList, et as BackBtn, it as Titlebar, nt as Screen, ot as sfx, rt as Softkeys, tt as ListRow } from "./router-BLZVt4yB.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as Input } from "./input-ZuA8S123.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-raCJeo9w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/multimx-gCvseOp-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MultiMx() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [contacts, setContacts] = (0, import_react.useState)([]);
	const [picked, setPicked] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listGroups().then(setGroups).catch(() => {});
		listContacts().then(setContacts).catch(() => {});
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "QX Mix",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WatermarkList, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-2 text-[11px] italic text-white/60",
				children: "Private groups. Classic QXio, minus the 160-char tax."
			}),
			groups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-6 text-[13px] text-white/60",
				children: "No groups yet. Tap New."
			}),
			groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListRow, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-orb orb-online" }),
				trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-white/60",
					children: g.member_count
				}),
				onClick: () => {
					sfx.tap();
					navigate({
						to: "/multimx/$id",
						params: { id: g.id }
					});
				},
				children: g.name
			}, g.id))
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, {
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => navigate({ to: "/" }),
				children: "Back"
			}),
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(true),
				children: "New"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "mxit-presence-dialog border-white/20 text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New QX Mix" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Group name",
						className: "border-white/20 bg-white/10 text-white"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 max-h-40 overflow-y-auto text-sm",
						children: contacts.filter((c) => c.status === "accepted").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: picked.includes(c.other.id),
								onChange: (e) => setPicked((p) => e.target.checked ? [...p, c.other.id] : p.filter((x) => x !== c.other.id))
							}), c.other.display_name]
						}, c.other.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: async () => {
							try {
								const r = await createGroup({ data: {
									name,
									memberIds: picked
								} });
								setOpen(false);
								navigate({
									to: "/multimx/$id",
									params: { id: r.id }
								});
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Failed");
							}
						},
						children: "Create"
					})
				]
			})
		})
	] });
}
//#endregion
export { MultiMx as component };
