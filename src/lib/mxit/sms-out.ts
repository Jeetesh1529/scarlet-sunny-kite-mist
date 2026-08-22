/**
 * Outbound SMS via a real aggregator — the piece that makes the SMS path a true
 * round-trip. Inbound (a handset texting QXio) already lands at POST /api/sms;
 * this sends the other direction, so an sms-channel message can be delivered to
 * a recipient's phone even when THEY have no data — the genuine no-data path.
 *
 * SAFETY: this is OFF unless you explicitly opt in with SMS_OUTBOUND=1 *and*
 * configure a provider. Sending real SMS costs money at your network's tariff,
 * so it must never turn on by accident. When it is off, nothing changes — the
 * sender's own Messages app is still used as before.
 *
 * Providers (first one fully configured wins):
 *   - Africa's Talking (SA-friendly): AT_USERNAME, AT_API_KEY, AT_FROM?, AT_SANDBOX=1?
 *   - Twilio:                         TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
 *   - Clickatell:                     CLICKATELL_API_KEY, CLICKATELL_FROM?
 */

export type SmsOutResult = {
  ok: boolean;
  provider?: string;
  skipped?: "disabled" | "no-provider" | "no-number";
  error?: string;
};

type Provider = "africastalking" | "twilio" | "clickatell";

function env(key: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const v = process.env[key];
  return v && v.trim() ? v.trim() : undefined;
}

function activeProvider(): Provider | null {
  if (env("AT_USERNAME") && env("AT_API_KEY")) return "africastalking";
  if (env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_FROM")) return "twilio";
  if (env("CLICKATELL_API_KEY")) return "clickatell";
  return null;
}

/** True only when opted in AND a provider is configured. */
export function smsOutboundEnabled(): boolean {
  return env("SMS_OUTBOUND") === "1" && activeProvider() !== null;
}

export async function sendSmsOut(toE164: string | null | undefined, body: string): Promise<SmsOutResult> {
  if (env("SMS_OUTBOUND") !== "1") return { ok: false, skipped: "disabled" };
  const provider = activeProvider();
  if (!provider) return { ok: false, skipped: "no-provider" };
  if (!toE164) return { ok: false, provider, skipped: "no-number" };
  try {
    if (provider === "africastalking") return await sendAfricasTalking(toE164, body);
    if (provider === "twilio") return await sendTwilio(toE164, body);
    return await sendClickatell(toE164, body);
  } catch (e) {
    return { ok: false, provider, error: e instanceof Error ? e.message : "failed" };
  }
}

async function sendAfricasTalking(to: string, body: string): Promise<SmsOutResult> {
  const base = env("AT_SANDBOX") === "1" ? "https://api.sandbox.africastalking.com" : "https://api.africastalking.com";
  const form = new URLSearchParams({ username: env("AT_USERNAME")!, to, message: body });
  const from = env("AT_FROM");
  if (from) form.set("from", from);
  const res = await fetch(`${base}/version1/messaging`, {
    method: "POST",
    headers: {
      apiKey: env("AT_API_KEY")!,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: form.toString(),
  });
  if (!res.ok) return { ok: false, provider: "africastalking", error: `HTTP ${res.status}: ${await safeText(res)}` };
  return { ok: true, provider: "africastalking" };
}

async function sendTwilio(to: string, body: string): Promise<SmsOutResult> {
  const sid = env("TWILIO_ACCOUNT_SID")!;
  const auth = Buffer.from(`${sid}:${env("TWILIO_AUTH_TOKEN")!}`).toString("base64");
  const form = new URLSearchParams({ To: to, From: env("TWILIO_FROM")!, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) return { ok: false, provider: "twilio", error: `HTTP ${res.status}: ${await safeText(res)}` };
  return { ok: true, provider: "twilio" };
}

async function sendClickatell(to: string, body: string): Promise<SmsOutResult> {
  const payload: Record<string, unknown> = { messages: [{ channel: "sms", to, content: body }] };
  const from = env("CLICKATELL_FROM");
  if (from) (payload.messages as Record<string, unknown>[])[0]!.from = from;
  const res = await fetch("https://platform.clickatell.com/v1/message", {
    method: "POST",
    headers: {
      Authorization: env("CLICKATELL_API_KEY")!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, provider: "clickatell", error: `HTTP ${res.status}: ${await safeText(res)}` };
  return { ok: true, provider: "clickatell" };
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 200);
  } catch {
    return "";
  }
}
