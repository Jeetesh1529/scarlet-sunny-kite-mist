import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as APP_NAME, et as BackBtn, it as Titlebar, nt as Screen, o as Route$6, rt as Softkeys, u as ID_LABEL } from "./router-BLZVt4yB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._kind-CG7jYvLB.js
var import_jsx_runtime = require_jsx_runtime();
function Legal() {
	const { kind } = Route$6.useParams();
	const navigate = useNavigate();
	const isPrivacy = kind === "privacy";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titlebar, {
			title: isPrivacy ? "Privacy" : "Terms",
			left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackBtn, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "prose-invert min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-[13px] leading-relaxed text-white/85",
			children: isPrivacy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [APP_NAME, " is a messenger inspired by early-2000s South African mobile chat. We collect the minimum needed to run the app."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Account info (email, hashed password, ",
					ID_LABEL,
					", display name, optional age/gender, avatar), chat content, contact list, and Moola ledger are stored to deliver the service. We do not sell your data."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Other users can see your public profile and messages you send them. You can edit your profile any time and sign out from Settings." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You must be 14 or older. Last updated August 2026." })
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"By using ",
					APP_NAME,
					" you agree to these terms. If you don't, please don't use the app."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You must be at least 14. Don't harass, impersonate, spam, or post illegal content. We may suspend accounts that break this." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Moola is virtual currency for extras inside the app (Skinz, Emoticards, gifts). Sending and receiving messages is free. Airtime SMS is not billed by ",
					APP_NAME,
					"; your mobile network may charge its SMS tariff. Moola cannot be exchanged for cash."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [APP_NAME, " is an original product provided as-is. It is not affiliated with, endorsed by, or a continuation of any prior messaging service."] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Softkeys, { left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({ to: "/" }),
			children: "Back"
		}) })
	] });
}
//#endregion
export { Legal as component };
