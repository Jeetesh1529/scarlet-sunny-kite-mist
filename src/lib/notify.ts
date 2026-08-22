const ICON = "/icon-192.png";

export function canNotify() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestPushPermission(): Promise<boolean> {
  if (!canNotify()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const p = await Notification.requestPermission();
    return p === "granted";
  } catch {
    return false;
  }
}

export function notifyIncoming(title: string, body: string, tag?: string) {
  if (!canNotify()) return;
  if (Notification.permission !== "granted") return;
  if (typeof document !== "undefined" && document.visibilityState === "visible") return;
  try {
    const n = new Notification(title, {
      body: body.slice(0, 120),
      tag: tag || "qxio-msg",
      icon: ICON,
      silent: false,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* ignore */
  }
}

export function pushPermission(): NotificationPermission | "unsupported" {
  if (!canNotify()) return "unsupported";
  return Notification.permission;
}
