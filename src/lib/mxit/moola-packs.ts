/**
 * Paid Moola packs — sold through Google Play Billing (Digital Goods API) inside
 * the installed Play (TWA) app ONLY. On the plain website there is no purchase
 * path, so the buy UI is hidden there (see `billingAvailable`).
 *
 * This is the single source of truth shared by:
 *   - the client buy flow (moola.tsx)
 *   - the server verifier (fns.ts → verifyMoolaPurchase)
 *   - the Play Console product sheet (docs)
 *
 * Product IDs MUST match the managed-product (consumable) IDs created in
 * Play Console EXACTLY. Prices are set per-country in Play Console; `zar` here is
 * the intended South-Africa price for display fallback + the setup sheet. The
 * real localized price string comes from the Digital Goods API at runtime.
 *
 * Moola is a consumable in-app currency: earned free (welcome, daily claim,
 * streaks, gifts) and optionally topped up with these packs. It is NOT cash,
 * cannot be cashed out, and is not an investment.
 */

export type MoolaPack = {
  /** Play Console managed-product (consumable) id. Lowercase [a-z0-9._]. */
  id: string;
  /** Moola credited on a verified purchase. */
  moola: number;
  /** Intended ZAR price (display fallback + Play Console sheet). */
  zar: number;
  /** Marketing label. */
  label: string;
  /** Small "best value" style tag, optional. */
  tag?: string;
};

/** Starter ZAR ladder — confirmed with the owner. */
export const MOOLA_PACKS: readonly MoolaPack[] = [
  { id: "moola_150", moola: 150, zar: 15, label: "Handful" },
  { id: "moola_600", moola: 600, zar: 49, label: "Stack", tag: "Popular" },
  { id: "moola_1400", moola: 1400, zar: 99, label: "Bag", tag: "+16% bonus" },
  { id: "moola_3200", moola: 3200, zar: 199, label: "Sack", tag: "Best value" },
] as const;

export const MOOLA_PACK_BY_ID: Record<string, MoolaPack> = Object.fromEntries(
  MOOLA_PACKS.map((p) => [p.id, p]),
);

/** The Play Billing payment method / Digital Goods service URL. */
export const PLAY_BILLING_METHOD = "https://play.google.com/billing";

/** ZAR display string, e.g. 49 -> "R49". */
export function zarLabel(zar: number): string {
  return `R${zar}`;
}

/**
 * True only when running inside an installed TWA that exposes the Play Billing
 * Digital Goods service. Always false on the plain website / iOS / desktop, so
 * the buy UI stays hidden and the site copy stays truthful there.
 */
export async function billingAvailable(): Promise<boolean> {
  try {
    // @ts-expect-error - Digital Goods API is not in the TS DOM lib yet.
    if (typeof window === "undefined" || !window.getDigitalGoodsService) return false;
    // @ts-expect-error - see above.
    const svc = await window.getDigitalGoodsService(PLAY_BILLING_METHOD);
    return !!svc;
  } catch {
    return false;
  }
}
