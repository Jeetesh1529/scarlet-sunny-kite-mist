import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-visible-poll-44gSrftS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Poll `fn` on an interval, but never overlap, and pause while the tab is hidden. */
function useVisiblePoll(fn, ms, deps = []) {
	const fnRef = (0, import_react.useRef)(fn);
	fnRef.current = fn;
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let busy = false;
		const run = async () => {
			if (cancelled || busy || typeof document !== "undefined" && document.hidden) return;
			busy = true;
			try {
				await fnRef.current();
			} catch {} finally {
				busy = false;
			}
		};
		run();
		const t = setInterval(() => void run(), ms);
		const vis = () => {
			if (!document.hidden) run();
		};
		document.addEventListener("visibilitychange", vis);
		return () => {
			cancelled = true;
			clearInterval(t);
			document.removeEventListener("visibilitychange", vis);
		};
	}, deps);
}
//#endregion
export { useVisiblePoll as t };
