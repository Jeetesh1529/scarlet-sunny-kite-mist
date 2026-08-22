import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { c as nid, f as radioOnline, o as getSql, p as toE164, r as cn, t as authMiddleware, u as parseQxPacket } from "./sms-DtDe-rh6.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client-sGid3STf.mjs";
import { n as auth } from "./server-5LKuYKvg.mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrome-Bs2Bo7KR.js
var import_jsx_runtime = require_jsx_runtime();
/** Lightweight beep / blip generator using WebAudio — no asset files needed. */
var ctx = null;
function getCtx() {
	if (typeof window === "undefined") return null;
	if (!ctx) try {
		ctx = new (window.AudioContext || window.webkitAudioContext)();
	} catch {
		return null;
	}
	return ctx;
}
function tone(freq, durationMs, type = "square", gain = .04) {
	const c = getCtx();
	if (!c) return;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	g.gain.value = gain;
	osc.connect(g).connect(c.destination);
	osc.start();
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + durationMs / 1e3);
	osc.stop(c.currentTime + durationMs / 1e3);
}
var enabled = true;
function setSoundEnabled(v) {
	enabled = v;
}
var sfx = {
	send: () => enabled && tone(880, 60, "square", .03),
	receive: () => {
		if (!enabled) return;
		tone(660, 70, "square", .04);
		setTimeout(() => tone(990, 90, "square", .04), 80);
	},
	tap: () => enabled && tone(1200, 25, "square", .02),
	boot: () => {
		if (!enabled) return;
		[
			523,
			659,
			784,
			1046
		].forEach((f, i) => setTimeout(() => tone(f, 110, "square", .05), i * 110));
	},
	error: () => enabled && tone(220, 200, "sawtooth", .04)
};
function PhoneShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mxit-classic-bg flex h-[100dvh] w-full items-stretch justify-center overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mxit-classic-bg relative flex w-full max-w-[480px] flex-col overflow-hidden",
			style: {
				height: "100dvh",
				paddingTop: "env(safe-area-inset-top)",
				paddingBottom: "env(safe-area-inset-bottom)"
			},
			children
		})
	});
}
function Titlebar({ title, left, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-titlebar flex h-11 shrink-0 items-center gap-2 px-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-10 items-center",
				children: left
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 text-center text-[15px] font-semibold tracking-wide",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-10 items-center justify-end",
				children: right
			})
		]
	});
}
function BackBtn({ to = "/" }) {
	const router = useRouter();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => {
			sfx.tap();
			if (typeof router.history.canGoBack === "function" && router.history.canGoBack()) {
				router.history.back();
				return;
			}
			navigate({
				to,
				replace: true
			});
		},
		className: "rounded-sm border border-white/20 bg-white/10 px-2 py-0.5 text-[11px]",
		children: "‹ Back"
	});
}
function AppSplash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-classic-bg flex min-h-0 flex-1 flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "qx-logo-tile flex h-14 w-14 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/qx-mark.svg",
				alt: "",
				className: "h-9 w-9 object-contain"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-0.5 w-28 overflow-hidden rounded-full bg-white/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/2 bg-cyan-300/80 animate-boot-scan" })
		})]
	});
}
function Softkeys({ left, right, center }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-softkeys flex h-11 shrink-0 items-stretch text-sm font-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-start pl-4",
				children: left
			}),
			center,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-end pr-4",
				children: right
			})
		]
	});
}
function Screen({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mxit-classic-bg relative flex min-h-0 flex-1 flex-col", className),
		children
	});
}
function WatermarkList({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mxit-watermark relative min-h-0 flex-1 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mxit-watermark-mark",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 py-2",
			children
		})]
	});
}
function ListRow({ onClick, selected, children, leading, trailing }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left", selected && "mxit-row-active"),
		children: [
			leading,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate font-medium tracking-wide text-white",
				style: { textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" },
				children
			}),
			trailing
		]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-WQHtSf5P.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/fns-cHg-FLK3.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("eb92d1e5aafe9d1dd1ebf669b742dca9d17f4232d8e1ac3c45d63a59c5cd2d80"));
var checkMxitId = createServerFn({ method: "POST" }).validator((raw) => raw).handler(createSsrRpc("3ae6a2bfa12af92332c86a202ab6be7ccea768e28cf7f233158f44d2ddeb4ef9"));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("6698db258ed2c3aba8b021790559e72615e9920ecbf95f8578de71b4a5c589c5"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("94009ed2dbef6c1d96bcc0f0cff78329f0be5c66514953862c0a0ff8553e9573"));
var listContacts = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("06cca0ecd00fe5d6cf1b4c22de6879f0e5a601324fae3f77185e187d6ea6c257"));
var pinContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("293e4b4a5164204cc88eb3faf592b07138dc80e28235c517e4318e7cdf1f8d93"));
var addContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((mxitId) => mxitId.trim().toLowerCase()).handler(createSsrRpc("6c9454e3fc275dd1afe7199eac1fca6cd4edfa51a79544910192500b43e1b2f9"));
var respondContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e00b116c6992180687d977867e884de9d80667851caa61a442000206a8b815da"));
var searchUsers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((q) => q.trim().toLowerCase()).handler(createSsrRpc("79afb658a35e97f8e96cf1cd8ebc3dd11fd3e361bbea5bd97b54a36fb68f0928"));
var getPublicProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((mxitId) => mxitId).handler(createSsrRpc("0d93d6e3926f98ca3e7cd5d764e402baff16e96340af4584e89ea1816e3e6ac1"));
var openChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((otherId) => otherId).handler(createSsrRpc("a2c7031aadb548e51653f2e0d1fcecd3b48f3e3a9dba230d3bfa4d687a8736b4"));
var loadConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((convId) => convId).handler(createSsrRpc("9a29a0c1a02fe123d2e3a7ca14f3f0ff97a5e5d484b0b4d62e450870d98c1576"));
var pollConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("ff6aa89f6b17e19df193caea7d944ec2b7ed5aef0814a79ce2483e3161b801d7"));
var sendDirect = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("6df0be92c14a93a7f014aade1987a161704f06621ef6b9300c8659357099d9e2"));
var setTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((convId) => convId).handler(createSsrRpc("d3f9b4aa60927aa7023f99c0e0f02b1c509973dda89294ac5fa03ceaf2c6d10d"));
var listRooms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1085afd111f7bb6d359c838cf1c0bf86b2f31db513cc36401377e4ddcceb78c6"));
var loadRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((roomId) => roomId).handler(createSsrRpc("3a7e3923a58d5cff650c8582a0478d3f713595f7b6759084945ad668732f7c1e"));
var sendRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("23c8abab4cf699b5099c0fa4d5e51887bd83b177730fdefbdfbf67e4f86774c0"));
var listGroups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7a4a2c8af1810302d2fc9dc40448bd806d8a007cc831e1eae536a6fb7785335a"));
var createGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5615440b4d5d6704614f9afbd9151c1409844281dd8a2c85dad32d5e490240d6"));
var loadGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((groupId) => groupId).handler(createSsrRpc("94cc902986e0ac987c6a147aa7bf88be6630184ea844ee2eab006ff8f73c08c8"));
var sendGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1ad5278982ddc3d7a28e874b914ae42ab1e341d77f8eea1de62ad8c72b76b1f6"));
var listStatuses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("139960cd0f380d9186a977f495ff6a7cda165747848b842377ea51279cb65b3f"));
var postStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8c92ef4cf93227337cee9f6fef93d717480ed8db5a101152269ae003e36a78f3"));
var viewStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((statusId) => statusId).handler(createSsrRpc("89e901fedf9111308afaa439e9a79be1580076ef9fea9c49a27674a38ca5d383"));
var claimDaily = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c0ab006c8d6764dc167f874a391f793043c5b44c4c75b2b6e5182f9535defdfa"));
var giftMoola = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("71fa88dd40bf45611e4ec01f0f04790564e280f5ac399f799403d842b7caa0cb"));
var spendMoola = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8bfa05c50e438d791a61cc8e241d3099f7e338cd8ac68774788b805e9ed9678b"));
var buyEmoticard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code).handler(createSsrRpc("2eada6da236d926369de4493732d6e74aa75fadd5229722e27b2dea82314bcfa"));
var listMoola = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c9291c34a6aa12eb467a29550bcb049d30a4fc18eaa438d26401b5eb3d17c235"));
var listConfessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e9f88b7551aa38f048b414750ca6224d17f681a1964a28da9ea455b713ff3f67"));
var postConfession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((body) => body.trim()).handler(createSsrRpc("bad39e308a92fb4d89425cc45c60e2651d59e9063590691d807688f77773ade2"));
var heartConfession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("83ba845a1017017f3ee68eefad2a98bd708e7500b6def5b3eff4505106654ab0"));
var listPolls = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b52119a3aef1b0f73624e3447877d5cf2354e28f2d8c93e78303f1628c68621d"));
var votePoll = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("25fa3bc3d9240c15e1f8e81f3ab49f960a12625ff0cf4e8a2eb348edc7e6d3f7"));
var getMoonbase = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("585a9e76486bb264f26402a3f7956ab0c174803824b1abf33ef75e227f4b9164"));
var moonbaseAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("cb9dd5b8873d341b1cbea6e9e9f12a9717151f63be1fa8aa6c89acd982190dad"));
var leaderboards = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("741463a92f3076b5ea016ad5a69a279d91dc7aef1b3abc4b4ce7c86c3b7bbed1"));
var meetPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f053022183f734fadbf30e607d0b608280269b30ff5dff627420072f0705612f"));
var myAchievements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0c5a300a895fd73c633367f1373341cc178dd31608f0eeb5177dea1074b2ac20"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BLZVt4yB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var KEY = "qxio-airtime-queue-v1";
function read() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function write(items) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 80)));
	} catch {}
}
function enqueueAirtime(item) {
	const row = {
		id: item.id || nid(),
		convId: item.convId,
		content: item.content,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	write([...read(), row]);
	return row;
}
async function flushAirtimeQueue(send) {
	const items = read();
	if (!items.length) return 0;
	const kept = [];
	let flushed = 0;
	for (const item of items) try {
		await send(item);
		flushed += 1;
	} catch {
		kept.push(item);
	}
	write(kept);
	return flushed;
}
var MxitCtx = (0, import_react.createContext)(null);
function MxitProvider({ children }) {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const p = await getMyProfile();
			setProfile(p);
		} catch {
			setProfile(null);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setProfile(null);
			setLoading(false);
			return;
		}
		refresh();
	}, [
		isPending,
		user,
		refresh
	]);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		const run = () => {
			if (!radioOnline()) return;
			flushAirtimeQueue(async (item) => {
				await sendDirect({ data: {
					convId: item.convId,
					content: item.content,
					channel: "sms"
				} });
			});
		};
		run();
		window.addEventListener("online", run);
		return () => window.removeEventListener("online", run);
	}, [profile?.id]);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		document.documentElement.setAttribute("data-theme", profile.theme || "classic");
		document.documentElement.setAttribute("data-mode", profile.display_mode || "normal");
		setSoundEnabled(profile.sound_enabled);
	}, [profile]);
	const setPresence = (0, import_react.useCallback)(async (p) => {
		const next = await updateProfile({ data: { presence: p } });
		setProfile(next);
	}, []);
	const patch = (0, import_react.useCallback)((p) => {
		setProfile((cur) => cur ? {
			...cur,
			...p
		} : cur);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		profile,
		loading: loading || isPending,
		refresh,
		setPresence,
		patch
	}), [
		profile,
		loading,
		isPending,
		refresh,
		setPresence,
		patch
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MxitCtx.Provider, {
		value,
		children
	});
}
function useMxit() {
	const ctx = (0, import_react.useContext)(MxitCtx);
	if (!ctx) throw new Error("useMxit");
	return ctx;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var APP_NAME = "QXio";
var APP_TAGLINE = "Blast From The Past";
var APP_DESCRIPTION = "QXio — Blast From The Past. Chat is free. Rooms, Moola extras, QX Post.";
var ID_LABEL = "QXio ID";
var THEME_COLOR = "#0A1B3D";
var styles_default = "/assets/styles-DPQ4jS7o.css";
var Route$22 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: THEME_COLOR
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			},
			{
				name: "description",
				content: APP_DESCRIPTION
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MxitProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				theme: "dark"
			})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$19 = () => import("./routes-D-M8WC_b.mjs");
var Route$21 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./confessions-CEym_0iW.mjs");
var Route$20 = createFileRoute("/confessions")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./leaderboards-43gqjJtr.mjs");
var Route$19 = createFileRoute("/leaderboards")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./login-CCc5tCYx.mjs");
var Route$18 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./meet-kFakY6qR.mjs");
var Route$17 = createFileRoute("/meet")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./moola-CR5DVqgv.mjs");
var Route$16 = createFileRoute("/moola")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./multimx-gCvseOp-.mjs");
var Route$15 = createFileRoute("/multimx")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./music-DALCSJgS.mjs");
var Route$14 = createFileRoute("/music")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./polls-ja4Qr3tP.mjs");
var Route$13 = createFileRoute("/polls")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./status-DCKrqVHg.mjs");
var Route$12 = createFileRoute("/status")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./tradepost-AXFVEat3.mjs");
var Route$11 = createFileRoute("/tradepost")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
function pair(a, b) {
	return a < b ? [a, b] : [b, a];
}
async function ingestSms(raw) {
	const from = toE164(raw.from);
	const text = (raw.text || "").trim();
	if (!from) throw new Error("Need a cell number on the SMS");
	if (!text) throw new Error("Empty SMS");
	if (text.length > 480) throw new Error("SMS too long");
	const sql = await getSql();
	const sender = await sql`
    select id, mxit_id from profiles where phone = ${from} limit 1
  `;
	if (!sender[0]) throw new Error("That cell isn't linked to a QXio ID — save it in Profile");
	const parsed = parseQxPacket(text);
	let other = parsed.handle ? await sql`
        select id, mxit_id from profiles where lower(mxit_id) = ${parsed.handle} limit 1
      ` : [];
	if (!other[0]) {
		const last = await sql`
      select case when conv.user_a = ${sender[0].id} then conv.user_b else conv.user_a end as other_id
      from conversations conv
      where conv.user_a = ${sender[0].id} or conv.user_b = ${sender[0].id}
      order by conv.last_message_at desc
      limit 1
    `;
		if (last[0]) other = await sql`
        select id, mxit_id from profiles where id = ${last[0].other_id} limit 1
      `;
	}
	if (!other[0]) throw new Error("Start the SMS with: QX their_id your message");
	const [a, b] = pair(sender[0].id, other[0].id);
	await sql`
    insert into conversations (id, user_a, user_b)
    values (${nid()}, ${a}, ${b})
    on conflict (user_a, user_b) do nothing
  `;
	const convId = (await sql`select id from conversations where user_a = ${a} and user_b = ${b}`)[0]?.id;
	if (!convId) throw new Error("Could not open chat");
	const content = parsed.content || text;
	const rows = await sql`
    insert into messages (id, conversation_id, sender_id, content, delivery, kind, channel)
    values (${nid()}, ${convId}, ${sender[0].id}, ${content}, 'sent', 'text', 'sms')
    returning id
  `;
	await sql`update conversations set last_message_at = now() where id = ${convId}`;
	return {
		ok: true,
		id: rows[0].id,
		from: sender[0].mxit_id,
		to: other[0].mxit_id,
		channel: "sms"
	};
}
function readInbound(params, json) {
	const from = String(json?.from ?? json?.From ?? json?.msisdn ?? json?.source ?? params.get("From") ?? params.get("from") ?? params.get("msisdn") ?? "").trim();
	const text = String(json?.text ?? json?.Body ?? json?.message ?? json?.content ?? params.get("Body") ?? params.get("text") ?? params.get("message") ?? "").trim();
	const to = String(json?.to ?? json?.To ?? params.get("To") ?? params.get("to") ?? "").trim() || null;
	if (!from || !text) return null;
	return {
		from,
		text,
		to
	};
}
function smsWebhookAuthorized(request) {
	const secret = typeof process !== "undefined" && (process.env.SMS_WEBHOOK_SECRET || process.env.TWILIO_AUTH_TOKEN) || "";
	if (!secret) return false;
	const url = new URL(request.url);
	return (request.headers.get("x-qxio-sms-secret") || request.headers.get("x-sms-secret") || url.searchParams.get("secret") || "") === secret;
}
async function handlePost({ request }) {
	if (!smsWebhookAuthorized(request)) return Response.json({
		ok: false,
		error: "unauthorized",
		hint: "GSM inbound is live once SMS_WEBHOOK_SECRET (or a Clickatell / Africa's Talking / Twilio token) is set. Until then the handset radio still sends via Airtime SMS."
	}, { status: 401 });
	const ctype = request.headers.get("content-type") || "";
	let json = null;
	let params = new URL(request.url).searchParams;
	try {
		if (ctype.includes("application/json")) json = await request.json();
		else {
			const body = await request.text();
			params = new URLSearchParams(body);
		}
	} catch {}
	const inbound = readInbound(params, json);
	if (!inbound) return Response.json({
		ok: false,
		error: "Need from + text"
	}, { status: 400 });
	try {
		const r = await ingestSms(inbound);
		return Response.json(r);
	} catch (e) {
		return Response.json({
			ok: false,
			error: e instanceof Error ? e.message : "failed"
		}, { status: 400 });
	}
}
var Route$10 = createFileRoute("/api/sms")({ server: { handlers: {
	GET: () => Response.json({
		ok: true,
		radio: "gsm",
		accept: "text only — no pictures, no files",
		format: "QX their_qxio_id your message"
	}),
	POST: handlePost
} } });
var $$splitComponentImporter$8 = () => import("./chat._id-CQzmRu-H.mjs");
var Route$9 = createFileRoute("/chat/$id")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./games.moonbase-BK2MnGOr.mjs");
var Route$8 = createFileRoute("/games/moonbase")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./games.tictactoe-COSJ60kX.mjs");
var Route$7 = createFileRoute("/games/tictactoe")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./legal._kind-CG7jYvLB.mjs");
var Route$6 = createFileRoute("/legal/$kind")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./multimx._id-qAmkPopM.mjs");
var Route$5 = createFileRoute("/multimx/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./portal._app-Dkx66-ML.mjs");
var Route$4 = createFileRoute("/portal/$app")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./room._id-BQETiAj5.mjs");
var Route$3 = createFileRoute("/room/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./tradepost._slug-DdsX9VwP.mjs");
var Route$2 = createFileRoute("/tradepost/$slug")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./u._mxitId-ZV-8MqyK.mjs");
var Route$1 = createFileRoute("/u/$mxitId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$22
});
var ConfessionsRoute = Route$20.update({
	id: "/confessions",
	path: "/confessions",
	getParentRoute: () => Route$22
});
var LeaderboardsRoute = Route$19.update({
	id: "/leaderboards",
	path: "/leaderboards",
	getParentRoute: () => Route$22
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$22
});
var MeetRoute = Route$17.update({
	id: "/meet",
	path: "/meet",
	getParentRoute: () => Route$22
});
var MoolaRoute = Route$16.update({
	id: "/moola",
	path: "/moola",
	getParentRoute: () => Route$22
});
var MultimxRoute = Route$15.update({
	id: "/multimx",
	path: "/multimx",
	getParentRoute: () => Route$22
});
var MusicRoute = Route$14.update({
	id: "/music",
	path: "/music",
	getParentRoute: () => Route$22
});
var PollsRoute = Route$13.update({
	id: "/polls",
	path: "/polls",
	getParentRoute: () => Route$22
});
var StatusRoute = Route$12.update({
	id: "/status",
	path: "/status",
	getParentRoute: () => Route$22
});
var TradepostRoute = Route$11.update({
	id: "/tradepost",
	path: "/tradepost",
	getParentRoute: () => Route$22
});
var ApiSmsRoute = Route$10.update({
	id: "/api/sms",
	path: "/api/sms",
	getParentRoute: () => Route$22
});
var ChatIdRoute = Route$9.update({
	id: "/chat/$id",
	path: "/chat/$id",
	getParentRoute: () => Route$22
});
var GamesMoonbaseRoute = Route$8.update({
	id: "/games/moonbase",
	path: "/games/moonbase",
	getParentRoute: () => Route$22
});
var GamesTictactoeRoute = Route$7.update({
	id: "/games/tictactoe",
	path: "/games/tictactoe",
	getParentRoute: () => Route$22
});
var LegalKindRoute = Route$6.update({
	id: "/legal/$kind",
	path: "/legal/$kind",
	getParentRoute: () => Route$22
});
var MultimxIdRoute = Route$5.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => MultimxRoute
});
var PortalAppRoute = Route$4.update({
	id: "/portal/$app",
	path: "/portal/$app",
	getParentRoute: () => Route$22
});
var RoomIdRoute = Route$3.update({
	id: "/room/$id",
	path: "/room/$id",
	getParentRoute: () => Route$22
});
var TradepostSlugRoute = Route$2.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => TradepostRoute
});
var UMxitIdRoute = Route$1.update({
	id: "/u/$mxitId",
	path: "/u/$mxitId",
	getParentRoute: () => Route$22
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$22
});
var MultimxRouteChildren = { MultimxIdRoute };
var MultimxRouteWithChildren = MultimxRoute._addFileChildren(MultimxRouteChildren);
var TradepostRouteChildren = { TradepostSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	ConfessionsRoute,
	LeaderboardsRoute,
	LoginRoute,
	MeetRoute,
	MoolaRoute,
	MultimxRoute: MultimxRouteWithChildren,
	MusicRoute,
	PollsRoute,
	StatusRoute,
	TradepostRoute: TradepostRoute._addFileChildren(TradepostRouteChildren),
	ApiSmsRoute,
	ChatIdRoute,
	GamesMoonbaseRoute,
	GamesTictactoeRoute,
	LegalKindRoute,
	PortalAppRoute,
	RoomIdRoute,
	UMxitIdRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$22._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { AppSplash as $, listStatuses as A, postConfession as B, leaderboards as C, listMoola as D, listGroups as E, moonbaseAction as F, sendGroup as G, respondContact as H, myAchievements as I, spendMoola as J, sendRoom as K, openChat as L, loadGroup as M, loadRoom as N, listPolls as O, meetPeople as P, useCurrentUserState as Q, pinContact as R, heartConfession as S, listContacts as T, searchUsers as U, postStatus as V, sendDirect as W, viewStatus as X, updateProfile as Y, votePoll as Z, createGroup as _, Route$5 as a, WatermarkList as at, getPublicProfile as b, APP_NAME as c, useMxit as d, BackBtn as et, enqueueAirtime as f, claimDaily as g, checkMxitId as h, Route$3 as i, Titlebar as it, loadConversation as j, listRooms as k, APP_TAGLINE as l, buyEmoticard as m, Route$1 as n, Screen as nt, Route$6 as o, sfx as ot, addContact as p, setTyping as q, Route$2 as r, Softkeys as rt, Route$9 as s, router_exports as t, ListRow as tt, ID_LABEL as u, createProfile as v, listConfessions as w, giftMoola as x, getMoonbase as y, pollConversation as z };
