import { getSql } from "@/lib/db";
import { parseQxPacket, toE164 } from "@/lib/sms";
import { nid } from "@/lib/utils";

function pair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export type SmsInbound = {
  from: string;
  text: string;
  to?: string | null;
};

export async function ingestSms(raw: SmsInbound) {
  const from = toE164(raw.from);
  const text = (raw.text || "").trim();
  if (!from) throw new Error("Need a cell number on the SMS");
  if (!text) throw new Error("Empty SMS");
  if (text.length > 480) throw new Error("SMS too long");

  const sql = await getSql();
  const sender = await sql<{ id: string; mxit_id: string }>`
    select id, mxit_id from profiles where phone = ${from} limit 1
  `;
  if (!sender[0]) {
    throw new Error("That cell isn't linked to a QXio ID — save it in Profile");
  }

  const parsed = parseQxPacket(text);
  let other = parsed.handle
    ? await sql<{ id: string; mxit_id: string }>`
        select id, mxit_id from profiles where lower(mxit_id) = ${parsed.handle} limit 1
      `
    : [];

  if (!other[0]) {
    const last = await sql<{ other_id: string }>`
      select case when conv.user_a = ${sender[0].id} then conv.user_b else conv.user_a end as other_id
      from conversations conv
      where conv.user_a = ${sender[0].id} or conv.user_b = ${sender[0].id}
      order by conv.last_message_at desc
      limit 1
    `;
    if (last[0]) {
      other = await sql<{ id: string; mxit_id: string }>`
        select id, mxit_id from profiles where id = ${last[0].other_id} limit 1
      `;
    }
  }
  if (!other[0]) throw new Error("Start the SMS with: QX their_id your message");

  const [a, b] = pair(sender[0].id, other[0].id);
  await sql`
    insert into conversations (id, user_a, user_b)
    values (${nid()}, ${a}, ${b})
    on conflict (user_a, user_b) do nothing
  `;
  const conv = await sql<{ id: string }>`select id from conversations where user_a = ${a} and user_b = ${b}`;
  const convId = conv[0]?.id;
  if (!convId) throw new Error("Could not open chat");

  const content = parsed.content || text;
  const rows = await sql<{ id: string }>`
    insert into messages (id, conversation_id, sender_id, content, delivery, kind, channel)
    values (${nid()}, ${convId}, ${sender[0].id}, ${content}, 'sent', 'text', 'sms')
    returning id
  `;
  await sql`update conversations set last_message_at = now() where id = ${convId}`;
  return {
    ok: true as const,
    id: rows[0]!.id,
    from: sender[0].mxit_id,
    to: other[0].mxit_id,
    channel: "sms" as const,
  };
}

export function readInbound(params: URLSearchParams, json: Record<string, unknown> | null): SmsInbound | null {
  const from =
    String(json?.from ?? json?.From ?? json?.msisdn ?? json?.source ?? params.get("From") ?? params.get("from") ?? params.get("msisdn") ?? "").trim();
  const text = String(
    json?.text ?? json?.Body ?? json?.message ?? json?.content ?? params.get("Body") ?? params.get("text") ?? params.get("message") ?? "",
  ).trim();
  const to = String(json?.to ?? json?.To ?? params.get("To") ?? params.get("to") ?? "").trim() || null;
  if (!from || !text) return null;
  return { from, text, to };
}

export function smsWebhookAuthorized(request: Request) {
  const secret = (typeof process !== "undefined" && (process.env.SMS_WEBHOOK_SECRET || process.env.TWILIO_AUTH_TOKEN)) || "";
  if (!secret) return false;
  const url = new URL(request.url);
  const hdr =
    request.headers.get("x-qxio-sms-secret") ||
    request.headers.get("x-sms-secret") ||
    url.searchParams.get("secret") ||
    "";
  return hdr === secret;
}
