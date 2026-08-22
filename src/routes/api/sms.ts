import { createFileRoute } from "@tanstack/react-router";
import { ingestSms, readInbound, smsWebhookAuthorized } from "@/lib/mxit/sms-inbound";
import { smsOutboundEnabled } from "@/lib/mxit/sms-out";

async function handlePost({ request }: { request: Request }) {
  if (!smsWebhookAuthorized(request)) {
    return Response.json(
      {
        ok: false,
        error: "unauthorized",
        hint: "GSM inbound is live once SMS_WEBHOOK_SECRET (or a Clickatell / Africa's Talking / Twilio token) is set. Until then the handset radio still sends via Airtime SMS.",
      },
      { status: 401 },
    );
  }
  const ctype = request.headers.get("content-type") || "";
  let json: Record<string, unknown> | null = null;
  let params = new URL(request.url).searchParams;
  try {
    if (ctype.includes("application/json")) {
      json = (await request.json()) as Record<string, unknown>;
    } else {
      const body = await request.text();
      params = new URLSearchParams(body);
    }
  } catch {
    /* empty */
  }
  const inbound = readInbound(params, json);
  if (!inbound) {
    return Response.json({ ok: false, error: "Need from + text" }, { status: 400 });
  }
  try {
    const r = await ingestSms(inbound);
    return Response.json(r);
  } catch (e: unknown) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "failed" }, { status: 400 });
  }
}

export const Route = createFileRoute("/api/sms")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          ok: true,
          radio: "gsm",
          accept: "text only — no pictures, no files",
          format: "QX their_qxio_id your message",
          inbound: {
            configured: !!(
              (typeof process !== "undefined" &&
                (process.env.SMS_WEBHOOK_SECRET || process.env.TWILIO_AUTH_TOKEN)) ||
              false
            ),
            hint: "POST here from your SMS aggregator (Africa's Talking / Twilio / Clickatell). Set SMS_WEBHOOK_SECRET and send it as header x-qxio-sms-secret (or ?secret=).",
          },
          outbound: {
            enabled: smsOutboundEnabled(),
            hint: "Set SMS_OUTBOUND=1 plus a provider (AT_*/TWILIO_*/CLICKATELL_*) to deliver SMS to handsets that have no data.",
          },
        }),
      POST: handlePost,
    },
  },
});
