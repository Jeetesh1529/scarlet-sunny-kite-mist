import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./sms-DtDe-rh6.mjs";
import { a as DialogTitle$1, i as DialogPortal, n as DialogContent$1, r as DialogOverlay, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-raCJeo9w.js
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-black/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-card p-4 shadow-xl", className),
		...props,
		children
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-3 space-y-1", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
//#endregion
export { DialogTitle as i, DialogContent as n, DialogHeader as r, Dialog as t };
