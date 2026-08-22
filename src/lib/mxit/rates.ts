/**
 * QXio message costs vs the OG app (SA, ~2005–2010).
 *
 * Then:
 *   - SMS was ~75–80c per 160 chars (the expensive path the OG app escaped).
 *   - 1-to-1 over GPRS was ~1–2c in telco data, billed from airtime, not a bundle.
 *   - The client was free to download after a failed paid launch.
 *   - Paid chatrooms charged ~2 Moola (~2c) per message.
 *   - 1 Moola = 1c ZAR. 200 Moola via premium SMS cost R2.
 *
 * Now (QXio):
 *   - Send and receive on a data bundle is R0 / 0 Moola.
 *   - No bundle + a bit of airtime: GPRS lean packets, ~1–2c to the network (OG path).
 *   - Airtime SMS is the 80c last resort when there is no packet radio.
 *   - Zone rooms and QX Mix are free (old paid rooms were 2 Moola).
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
    item: "1-to-1 (bundle)",
    then: "~1–2c data (telco)",
    now: "FREE",
    note: "Send and receive. No Moola.",
  },
  {
    item: "GPRS airtime",
    then: "~1–2c GPRS",
    now: "~1–2c to network",
    note: "No bundle. Tiny packets from airtime, same as the OG app. QXio R0.",
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
    note: "Send and receive.",
  },
  {
    item: "Airtime SMS",
    then: "~80c / SMS",
    now: "last resort · ~80c",
    note: "Only when there is no packet radio. Network SMS tariff.",
  },
  {
    item: "Pics & voice",
    then: "n/a",
    now: "FREE on bundle",
    note: "Not on GPRS or SMS.",
  },
] as const;

export const DATA_CHAT_HINT = "Data chat · FREE";
export const GPRS_COST_HINT =
  "GPRS · ~1–2c from airtime, no bundle. Same as the OG app. QXio R0.";
export const AIRTIME_COST_HINT =
  "SMS last resort. QXio is free; your network may charge ~80c. GPRS is the cheap ~1–2c path.";
