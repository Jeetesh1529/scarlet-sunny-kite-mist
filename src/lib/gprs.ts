/**
 * "Lean" mode — a nod to the OG app's GPRS trick. It keeps a message as small
 * as possible: text only, clipped to GPRS_LIMIT chars, one tiny packet.
 *
 * HONESTY NOTE: on the OG app (2G feature phones) these packets were billed
 * ~1–2c straight off airtime, no bundle. That billing model no longer exists
 * for a smartphone web app — lean packets still travel as ordinary mobile
 * data (from your bundle / out-of-bundle data), NOT a separate airtime GPRS
 * channel. So "lean" means "smallest possible data", not "free of a bundle".
 * The only path that truly works with no data is the SMS fallback.
 */

export const GPRS_LIMIT = 400;
export const GPRS_OVERHEAD = 96;
export const GPRS_CENTS = "low-data";

export type RadioMode = "data" | "gprs" | "sms";

export function clipGprs(text: string) {
  return text.trim().slice(0, GPRS_LIMIT);
}

/** Compact wire body — keep this small so out-of-bundle airtime stays ~1–2c. */
export function encodeGprsPacket(toHandle: string, text: string) {
  return JSON.stringify({ v: 1, t: toHandle, b: clipGprs(text) });
}

export function gprsBytes(text: string) {
  if (typeof TextEncoder === "undefined") return GPRS_OVERHEAD + clipGprs(text).length;
  return GPRS_OVERHEAD + new TextEncoder().encode(clipGprs(text)).length;
}

export function nextRadioMode(cur: RadioMode): RadioMode {
  if (cur === "data") return "gprs";
  if (cur === "gprs") return "sms";
  return "data";
}

type NavConnection = { saveData?: boolean; effectiveType?: string };

export function looksLikeLeanRadio() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: NavConnection }).connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === "slow-2g" || c.effectiveType === "2g";
}

export function defaultRadioMode(opts: {
  offline: boolean;
  preferGprs?: boolean;
  preferSms?: boolean;
}): RadioMode {
  if (opts.offline) return "sms";
  if (opts.preferGprs || looksLikeLeanRadio()) return "gprs";
  if (opts.preferSms) return "sms";
  return "data";
}
