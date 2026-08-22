export function isStandaloneApp() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    Boolean(nav.standalone)
  );
}

/** iOS uses the platform Add-to-Home tutorial. Android's query is ignored there — send them to Get QXio. */
export function openPhoneInstall(platform: "ios" | "android") {
  if (platform === "android") {
    window.location.assign("/get#android");
    return;
  }
  window.location.assign("/?install=1&platform=ios");
}

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

export function captureInstallPrompt() {
  if (typeof window === "undefined") return () => {};
  const onPrompt = (e: Event) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn(deferred));
  };
  window.addEventListener("beforeinstallprompt", onPrompt);
  return () => window.removeEventListener("beforeinstallprompt", onPrompt);
}

export function subscribeInstallPrompt(fn: (e: BeforeInstallPromptEvent | null) => void) {
  listeners.add(fn);
  fn(deferred);
  return () => {
    listeners.delete(fn);
  };
}

export async function promptAndroidInstall() {
  if (!deferred) return false;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  listeners.forEach((fn) => fn(null));
  return outcome === "accepted";
}

export function shouldRegisterServiceWorker() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.endsWith(".grok.me") || import.meta.env.PROD;
}
