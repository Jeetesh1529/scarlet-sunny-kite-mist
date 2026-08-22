/**
 * QXio message costs — honest version.
 *
 * The OG app (SA, ~2005–2010) really did send 1-to-1 chats for ~1–2c by
 * riding 2G GPRS packets billed straight off airtime. That billing model was a
 * feature-phone / 2G thing the networks offered at the time. It does NOT exist
 * for a modern smartphone web app: every byte this app sends travels as
 * ordinary mobile data, billed from your data bundle (or your out-of-bundle
 * data rate) — there is no separate "1–2c from airtime" channel any more.
 *
 * So, truthfully:
 *   - Chat on data: QXio charges R0. It uses a tiny bit of your normal mobile
 *     data (a fraction of a cent per message on a bundle).
 *   - "Lean" mode (labelled GPRS, a nod to the OG app): text-only, clipped to
 *     400 chars, so it uses the least data possible — but it still uses data.
 *   - SMS: the ONLY path that works with no data at all. It sends over your
 *     phone's normal SMS (cellular signalling / airtime), so your network
 *     charges its SMS tariff (~80c). QXio itself adds nothing.
 *
 * Moola extras stay as they are. Do not debit Moola from send paths.
 */

export const MSG_COST_MOOLA = 0;
export const MSG_COST_ZAR = 0;

/** Shop prices — keep in lockstep with spend paths in fns.ts. Do not change. */
export const MOOLA_EXTRAS = {
  welcome: 100,
  emoticard: 5,
  skinz: 40,
} as const;

export const RATE_ROWS = [
  {
    item: "1-to-1 chat (data)",
    then: "~1–2c 2G data",
    now: "FREE",
    note: "Send and receive on data. QXio adds no charge — just a little mobile data.",
  },
  {
    item: "Lean mode (GPRS)",
    then: "~1–2c GPRS",
    now: "FREE · low data",
    note: "Text only, 400 chars, tiny packets — least data possible. Still uses your bundle, not a separate airtime channel.",
  },
  {
    item: "Zone rooms",
    then: "~2 Moola / msg",
    now: "FREE",
    note: "Cheaper than old paid rooms.",
  },
  {
    item: "QX Mix groups",
    then: "n/a",
    now: "FREE",
    note: "Send and receive on data.",
  },
  {
    item: "SMS (no data)",
    then: "~80c / SMS",
    now: "network SMS rate",
    note: "The only path that works with no data bundle. Sends over your phone's SMS — your network's tariff. QXio adds nothing.",
  },
  {
    item: "Pics & voice",
    then: "n/a",
    now: "FREE on data",
    note: "Data only. Not available on the lean or SMS text paths.",
  },
] as const;

export const DATA_CHAT_HINT = "Data chat · FREE (uses a little mobile data)";
export const GPRS_COST_HINT =
  "Lean mode · text-only, smallest packets. A fraction of a cent of data on a bundle — still uses data, not a separate airtime channel.";
export const AIRTIME_COST_HINT =
  "SMS · the no-data fallback. Sends over your phone's SMS at your network's rate (~80c). QXio adds nothing.";
