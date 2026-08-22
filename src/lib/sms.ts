/** GSM airtime SMS — texts ride the telco radio, not a data bundle. */

export const SMS_LIMIT = 160;

const GSM_RE =
  /^[\x20-\x5F\x61-\x7E\n\r\t£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ¤¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]*$/;

export function toE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let n = trimmed.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (n.startsWith("0") && n.length === 10) n = `27${n.slice(1)}`;
  if (n.startsWith("27") && n.length === 11) return `+${n}`;
  if (n.length >= 10 && n.length <= 15 && /^[1-9]\d+$/.test(n)) return `+${n}`;
  return null;
}

export function prettyPhone(e164: string | null | undefined) {
  if (!e164) return "";
  const m = e164.match(/^\+27(\d{2})(\d{3})(\d{4})$/);
  if (m) return `0${m[1]} ${m[2]} ${m[3]}`;
  return e164;
}

export function smsEncoding(text: string): "gsm" | "ucs2" {
  return GSM_RE.test(text) ? "gsm" : "ucs2";
}

export function smsSegments(text: string) {
  const enc = smsEncoding(text);
  const per = enc === "gsm" ? 160 : 70;
  const n = Math.max(1, Math.ceil(text.length / per) || 1);
  return { encoding: enc, per, segments: n, remaining: per * n - text.length };
}

export function clipSms(text: string) {
  const enc = smsEncoding(text);
  const max = enc === "gsm" ? SMS_LIMIT : 70;
  return text.slice(0, max);
}

/** Packet that an SMSC / aggregator can relay into QXio. */
export function encodeQxPacket(toHandle: string, text: string) {
  return clipSms(`QX ${toHandle} ${text.trim()}`);
}

export function parseQxPacket(body: string): { handle: string | null; content: string } {
  const t = body.replace(/\r/g, "").trim();
  const tagged = t.match(/^(?:QXIO|QX|MXIT)\s+@?([a-z0-9_]{3,20})\s+([\s\S]+)$/i);
  if (tagged) return { handle: tagged[1]!.toLowerCase(), content: tagged[2]!.trim() };
  const at = t.match(/^@([a-z0-9_]{3,20})\s+([\s\S]+)$/i);
  if (at) return { handle: at[1]!.toLowerCase(), content: at[2]!.trim() };
  return { handle: null, content: t };
}

/** Open the handset SMS composer — this is the GSM radio, not IP. */
export function openSmsCompose(toE164: string, body: string) {
  if (typeof window === "undefined") return;
  const num = toE164.replace(/[^\d+]/g, "");
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const href = ios
    ? `sms:${num}&body=${encodeURIComponent(body)}`
    : `sms:${num}?body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

/** Invite SMS — pick a recipient in the phone's Messages app. */
export function openSmsBlank(body: string) {
  if (typeof window === "undefined") return;
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const href = ios
    ? `sms:&body=${encodeURIComponent(body)}`
    : `sms:?body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

export function radioOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine !== false;
}
