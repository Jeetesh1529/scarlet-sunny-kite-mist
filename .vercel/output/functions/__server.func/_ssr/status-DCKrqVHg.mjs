import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as listStatuses, Q as useCurrentUserState, V as postStatus, X as viewStatus, d as useMxit, et as BackBtn, it as Titlebar, nt as Screen, rt as Softkeys } from "./router-BLZVt4yB.mjs";
import { n as EmoText } from "./Emoticon-cZQWoCya.mjs";
import { n as PixelAvatar } from "./PixelAvatar-DvmVLcYv.mjs";
import { t as RedirectToSignIn } from "./gates-DVIy2uwz.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as Textarea } from "./textarea-BesYy3E8.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-raCJeo9w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-DCKrqVHg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BGS = [
	"#0A2A5E",
	"#1E78D6",
	"#2E9F4D",
	"#E04B98",
	"#111111",
	"#7C3AED",
	"#F59E0B",
	"#DC2626"
];
function StatusPage() {
	const { user, isPending } = useCurrentUserState();
	const { profile } = useMxit();
	const navigate = useNavigate();
	const [items, setItems] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [caption, setCaption] = (0, import_react.useState)("");
	const [bg, setBg] = (0, import_react.useState)(BGS[0]);
	const [view, setView] = (0, import_react.useState)(null);
	const reload = () => listStatuses().then(setItems).catch(() => {});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const mine = items.filter((s) => s.author_id === profile?.id);
	const others = items.filter((s) => s.author_id !== profile?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: "Status",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(true),
					className: "mb-3 w-full rounded-md border border-dashed border-white/30 py-6 text-sm text-white/70",
					children: "Post a 24h status"
				}),
				mine[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 text-[12px] text-white/50",
					children: [
						"Yours · ",
						mine.length,
						" · ",
						mine[0].views,
						" views"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: others.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: async () => {
							setView(s);
							await viewStatus({ data: s.id });
						},
						className: "flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/5 p-2 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
							seed: s.author_seed,
							size: 40
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: s.author_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[12px] text-white/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoText, {
									text: s.caption ?? "",
									size: 14
								})
							})]
						})]
					}, s.id))
				})
			]
		}),
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
				className: "border-white/20 text-white",
				style: { background: bg },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New status" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						rows: 4,
						className: "border-white/20 bg-black/20 text-white",
						placeholder: "What's the vibe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-2",
						children: BGS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setBg(c),
							className: "h-6 w-6 rounded-full border border-white/40",
							style: { background: c }
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: async () => {
							try {
								await postStatus({ data: {
									caption,
									background: bg
								} });
								setOpen(false);
								setCaption("");
								reload();
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Failed");
							}
						},
						children: "Post"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!view,
			onOpenChange: () => setView(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "min-h-48 border-white/20 text-white",
				style: { background: view?.background ?? "#0A2A5E" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: view?.author_name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 text-lg leading-snug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoText, {
						text: view?.caption ?? "",
						size: 22
					})
				})]
			})
		})
	] });
}
//#endregion
export { StatusPage as component };
