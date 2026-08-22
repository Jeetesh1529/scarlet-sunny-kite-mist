# SMS gateway — making the no-data path a real round-trip

QXio's SMS mode is the one path that works when a user has **no data at all**.
It rides the phone's normal SMS (cellular signalling / airtime), so the user's
network charges its SMS tariff (~80c in SA). QXio adds nothing.

There are two directions. Each is independent — turn on whichever you need.

## What already works with zero setup

- **Outbound from the sender's own phone.** In SMS mode the app opens the
  sender's Messages app pre-filled (`sms:` link). The sender pays their SMS
  tariff. No server, no accounts.
- **Offline queue.** If a send fails offline it is stored and retried when the
  connection returns.

The gaps this doc closes: (1) *receiving* an SMS back **into** QXio, and
(2) delivering an SMS to a recipient **who has no data**, from the server.

## 1. Inbound — a handset texting QXio shows up in the chat

Endpoint: `POST /api/sms` (already implemented in `src/routes/api/sms.ts` →
`ingestSms` in `src/lib/mxit/sms-inbound.ts`).

It accepts JSON or form-encoded webhooks and reads the common field names used
by **Africa's Talking**, **Twilio**, and **Clickatell** (`from`/`From`/`msisdn`,
`text`/`Body`/`message`). The sender's cell number must be saved on their QXio
profile (Settings → phone). Message format from the handset:

```
QX their_qxio_id your message here
```

**Enable it:** set `SMS_WEBHOOK_SECRET` and have your aggregator include it as
the `x-qxio-sms-secret` header (or `?secret=` query param). Twilio's
`TWILIO_AUTH_TOKEN` is also accepted. Until a secret is set the endpoint returns
`401` by design, so nobody can inject messages.

Point your aggregator's inbound webhook at `https://<your-host>/api/sms`.

## 2. Outbound — deliver to a handset that has no data

Module: `src/lib/mxit/sms-out.ts`, wired into `sendDirect`. When a user sends on
the **SMS channel** and the recipient has a phone number saved, the server
delivers the message via an aggregator so it reaches them even with no data.

**This is OFF by default** — sending real SMS costs money. Turn it on with
`SMS_OUTBOUND=1` **and** one configured provider:

| Provider | Env vars |
| --- | --- |
| Africa's Talking (SA) | `AT_USERNAME`, `AT_API_KEY`, `AT_FROM?`, `AT_SANDBOX=1?` |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` |
| Clickatell | `CLICKATELL_API_KEY`, `CLICKATELL_FROM?` |

The first fully-configured provider wins. A delivery failure is logged and never
fails the in-app send.

## Check status

`GET /api/sms` reports whether each direction is configured:

```json
{
  "inbound":  { "configured": true,  "hint": "..." },
  "outbound": { "enabled": false, "hint": "..." }
}
```

## Notes / honesty

- SMS is text-only, and QXio clips it to 160 chars.
- SMS is genuinely the only no-data path. "Lean" mode still uses mobile data —
  it just uses very little (see `src/lib/gprs.ts`).
- Two-way SMS requires a paid aggregator account and, for outbound, either a
  long/short code or a registered sender ID (per-country rules apply).
