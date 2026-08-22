import { _ as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as AppSplash, Q as useCurrentUserState, d as useMxit } from "./router-BLZVt4yB.mjs";
import { t as AuthScreen } from "./AuthScreen-DUwXcE5G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CCc5tCYx.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const { profile, loading } = useMxit();
	if (isPending || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSplash, {});
	if (user && profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (user && !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, { needsProfile: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, {});
}
//#endregion
export { Login as component };
