import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { nid } from "@/lib/utils";
import { botReply, BOT_IDS, isBotId } from "./bots";
import { startState, type ChallengeGame } from "./challenge";
import type {
  ChatMessage,
  Chatroom,
  Confession,
  ContactRow,
  ConversationView,
  MoonbaseState,
  MoolaTx,
  MsgChannel,
  MsgKind,
  MultiMxGroup,
  Poll,
  Profile,
  PublicProfile,
  StatusItem,
} from "./types";
import { RESERVED_QXIO_IDS } from "./zones";
import { clipSms, SMS_LIMIT, toE164 } from "@/lib/sms";
import { clipGprs, GPRS_LIMIT } from "@/lib/gprs";
import { MSG_COST_MOOLA, MOOLA_EXTRAS } from "./rates";
import { sendSmsOut, smsOutboundEnabled } from "./sms-out";
let seedJob: Promise<void> | null = null;
const onboarded = new Map<string, Promise<void>>();

async function ensureSeed(sql: Sql) {
  if (seedJob) return seedJob;
  seedJob = (async () => {
    await sql`
    insert into profiles (id, mxit_id, display_name, mood, mood_code, avatar_seed, presence, is_bot, moola, zone)
    values
      ('bot-joe-banker', 'joebanker', 'QX Banker', 'Need Moola? I got you :D', ':D', 'pixel-1', 'online', true, 9999, 'ct')
    on conflict (id) do nothing
  `;
    await sql`
      insert into room_members (room_id, user_id)
      select r.id, p.id from chatrooms r
      cross join profiles p
      where p.is_bot = true
      on conflict do nothing
    `;
    await sql`
      insert into messages (id, room_id, sender_id, content, created_at, kind)
      values
        ('live-cpt-1', 'room-cpt', 'bot-jade-ct', 'heita the room is packed tonight :D', now() - interval '4 minutes', 'text'),
        ('live-cpt-2', 'room-cpt', 'bot-sipho', 'loadshedding can wait — howzit from Jozi lurking in CT', now() - interval '3 minutes', 'text'),
        ('live-cpt-3', 'room-cpt', 'bot-thandi', 'someone drop a mood before the mountain hides <3', now() - interval '90 seconds', 'text'),
        ('live-jhb-1', 'room-jhb', 'bot-sipho', 'highway lights looking cinematic. who''s on?', now() - interval '2 minutes', 'text'),
        ('live-jhb-2', 'room-jhb', 'bot-joe-banker', 'Moonbase raid later. don''t spend all your Moola on Skinz.', now() - interval '50 seconds', 'text'),
        ('live-dbn-1', 'room-dbn', 'bot-thandi', 'Durbs humid, bunny chow incoming', now() - interval '6 minutes', 'text'),
        ('live-dbn-2', 'room-dbn', 'bot-jade-ct', 'beach vs bunny chow. fight.', now() - interval '2 minutes', 'text'),
        ('live-gen-1', 'room-general', 'bot-help', 'New here? Menu → Help. Chat is free.', now() - interval '8 minutes', 'text'),
        ('live-gen-2', 'room-general', 'bot-lurker', '…', now() - interval '3 minutes', 'text'),
        ('live-game-1', 'room-gaming', 'bot-sipho', 'who wants Chess? long-press me and tap Challenge', now() - interval '5 minutes', 'text'),
        ('live-game-2', 'room-gaming', 'bot-joe-banker', 'Connect 4 vs the house is free. Challenge a bru for the real thing.', now() - interval '70 seconds', 'text'),
        ('live-mus-1', 'room-music', 'bot-jade-ct', 'Freshlyground on loop. Music Room is open.', now() - interval '2 minutes', 'text')
      on conflict (id) do nothing
    `;
  })().catch((e) => {
    seedJob = null;
    throw e;
  });
  return seedJob;
}

function pair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function normalizeHandle(raw: string) {
  return raw.trim().toLowerCase();
}

function assertHandle(handle: string) {
  if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
    throw new Error("QXio ID: 3–20 chars, lowercase letters, numbers, underscores.");
  }
  if (RESERVED_QXIO_IDS.has(handle)) {
    throw new Error("That QXio ID is reserved — pick another");
  }
}

async function suggestHandles(sql: Sql, base: string): Promise<string[]> {
  const year = new Date().getFullYear().toString().slice(2);
  const n = Math.floor(10 + Math.random() * 89);
  const candidates = [`${base}${n}`, `${base}_ct`, `${base}_za`, `${base}${year}`, `the_${base}`]
    .map((s) => s.slice(0, 20))
    .filter((s) => /^[a-z0-9_]{3,20}$/.test(s) && s !== base && !RESERVED_QXIO_IDS.has(s));
  const out: string[] = [];
  for (const c of candidates) {
    const t = await sql<{ id: string }>`select id from profiles where lower(mxit_id) = ${c} limit 1`;
    if (!t.length) out.push(c);
    if (out.length >= 3) break;
  }
  return out;
}

async function award(sql: Sql, userId: string, code: string) {
  await sql`
    insert into achievements (user_id, code) values (${userId}, ${code})
    on conflict (user_id, code) do nothing
  `;
}

async function credit(sql: Sql, userId: string, amount: number, reason: string) {
  await sql`update profiles set moola = moola + ${amount} where id = ${userId}`;
  await sql`
    insert into moola_tx (id, user_id, amount, reason)
    values (${nid()}, ${userId}, ${amount}, ${reason})
  `;
}

async function onboardIfNeeded(sql: Sql, userId: string) {
  const hit = onboarded.get(userId);
  if (hit) return hit;
  const job = (async () => {
    const existing = await sql<{ id: string }>`select id from contacts where requester_id = ${userId} limit 1`;
    if (existing.length) return;

    for (const bot of BOT_IDS) {
      await sql`
        insert into contacts (id, requester_id, addressee_id, status)
        values (${nid()}, ${userId}, ${bot}, 'accepted')
        on conflict (requester_id, addressee_id) do nothing
      `;
      const [a, b] = pair(userId, bot);
      const convRows = await sql<{ id: string }>`
        insert into conversations (id, user_a, user_b)
        values (${nid()}, ${a}, ${b})
        on conflict (user_a, user_b) do nothing
        returning id
      `;
      let convId = convRows[0]?.id;
      if (!convId) {
        const found = await sql<{ id: string }>`select id from conversations where user_a = ${a} and user_b = ${b}`;
        convId = found[0]?.id;
      }
      if (!convId) continue;
      const hello =
        bot === "bot-joe-banker"
          ? `Welcome to QXio :D Chat is free — send and receive never spends Moola. ${MOOLA_EXTRAS.welcome} Moola is in your wallet for extras. Tap me for QX Banker, or claim daily from Contacts.`
          : bot === "bot-jade-ct"
            ? "heita! JADE from CT. Add me, drop a status, come hang in the Cape Town room :)"
            : bot === "bot-help"
              ? "Need the tour? Menu → Help, or just ask. On iPhone use Add to Home Screen to install."
              : bot === "bot-thandi"
                ? "hey — it's so good this is back <3 set your mood in the title bar"
                : bot === "bot-sipho"
                  ? "sharp my bru. QX Post has Moonbase if you're bored."
                  : "…";
      await sql`
        insert into messages (id, conversation_id, sender_id, content, delivery, kind)
        values (${nid()}, ${convId}, ${bot}, ${hello}, 'sent', 'text')
      `;
    }

    const rooms = await sql<{ id: string }>`select id from chatrooms`;
    for (const r of rooms) {
      await sql`
        insert into room_members (room_id, user_id) values (${r.id}, ${userId})
        on conflict (room_id, user_id) do nothing
      `;
    }
    await award(sql, userId, "welcome");
  })();
  onboarded.set(userId, job);
  try {
    await job;
  } catch (e) {
    onboarded.delete(userId);
    throw e;
  }
}

export const getMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (rows[0] && !rows[0].is_bot) {
      await onboardIfNeeded(sql, context.userId);
      await sql`
        update profiles set last_seen = now()
        where id = ${context.userId} and last_seen < now() - interval '2 minutes'
      `;
      const { emailIsOwner } = await import("./hq-owner.server");
      const acc = await sql<{ email: string | null }>`
        select email from "user" where id = ${context.userId}
      `;
      if (emailIsOwner(acc[0]?.email)) {
        await sql`update profiles set is_admin = true where id = ${context.userId}`;
        rows[0].is_admin = true;
      }
    }
    return rows[0] ?? null;
  });

export const checkMxitId = createServerFn({ method: "POST" })
  .validator((raw: string) => raw)
  .handler(async ({ data: raw }) => {
    const handle = normalizeHandle(raw);
    if (!handle) return { ok: false as const, reason: "required", suggestions: [] as string[] };
    if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
      return { ok: false as const, reason: "format", suggestions: [] as string[] };
    }
    if (RESERVED_QXIO_IDS.has(handle)) {
      const sql = await getSql();
      return { ok: false as const, reason: "reserved", suggestions: await suggestHandles(sql, handle) };
    }
    const sql = await getSql();
    const taken = await sql<{ id: string }>`select id from profiles where lower(mxit_id) = ${handle} limit 1`;
    if (taken.length) {
      return { ok: false as const, reason: "taken", suggestions: await suggestHandles(sql, handle) };
    }
    return { ok: true as const, reason: "available", suggestions: [] as string[] };
  });

export const createProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      mxitId: string;
      displayName: string;
      mood?: string;
      moodCode?: string;
      avatarSeed?: string;
      age?: number | null;
      gender?: string | null;
      zone?: string | null;
      phone?: string | null;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const handle = normalizeHandle(data.mxitId);
    assertHandle(handle);
    if (!data.displayName.trim()) throw new Error("Pick a display name");
    const existingMe = await sql<{ id: string }>`select id from profiles where id = ${context.userId}`;
    if (existingMe.length) throw new Error("You already have a QXio ID — IDs can't be changed");
    const taken = await sql<{ id: string }>`select id from profiles where lower(mxit_id) = ${handle}`;
    if (taken.length) {
      const suggestions = await suggestHandles(sql, handle);
      throw new Error(
        suggestions.length
          ? `That QXio ID is taken. Try ${suggestions.join(", ")}`
          : "That QXio ID is taken — pick another",
      );
    }
    const zone = data.zone && ["ct", "jhb", "dbn", "pta", "pe", "other"].includes(data.zone) ? data.zone : "ct";
    const moodCode = data.moodCode?.trim() || ":)";
    const phone = data.phone ? toE164(data.phone) : null;
    if (data.phone && data.phone.trim() && !phone) throw new Error("Cell number doesn't look right (use 082… or +27…)");
    const age = data.age ?? null;
    if (age == null || !Number.isFinite(age) || age < 14 || age > 120) {
      throw new Error("You must be 14 or older");
    }
    try {
      await sql`
        insert into profiles (id, mxit_id, display_name, mood, mood_code, avatar_seed, age, gender, moola, zone, phone, airtime_sms, airtime_gprs)
        values (
          ${context.userId},
          ${handle},
          ${data.displayName.trim()},
          ${data.mood?.trim() || "Hey there! I'm on QXio."},
          ${moodCode},
          ${data.avatarSeed || "pixel-0"},
          ${age},
          ${data.gender || null},
          0,
          ${zone},
          ${phone},
          false,
          false
        )
      `;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/unique|duplicate|23505/i.test(msg)) {
        if (/phone/i.test(msg)) throw new Error("That cell number is already linked to a QXio ID");
        throw new Error("That QXio ID is taken — pick another");
      }
      throw e;
    }
    await credit(sql, context.userId, MOOLA_EXTRAS.welcome, "Welcome bonus");
    await onboardIfNeeded(sql, context.userId);
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    return rows[0]!;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (
      d: Partial<
        Pick<
          Profile,
          | "display_name"
          | "mood"
          | "mood_code"
          | "avatar_seed"
          | "farewell"
          | "presence"
          | "theme"
          | "display_mode"
          | "sound_enabled"
          | "hide_offline"
          | "read_receipts"
          | "zone"
          | "notify_push"
          | "phone"
          | "airtime_sms"
          | "airtime_gprs"
        >
      >,
    ) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const cur = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (!cur[0]) throw new Error("No profile");
    const p = cur[0];
    const zone =
      data.zone && ["ct", "jhb", "dbn", "pta", "pe", "other"].includes(String(data.zone)) ? String(data.zone) : p.zone;
    let phone = p.phone;
    if (data.phone !== undefined) {
      if (!data.phone || !String(data.phone).trim()) phone = null;
      else {
        const n = toE164(String(data.phone));
        if (!n) throw new Error("Cell number doesn't look right (use 082… or +27…)");
        phone = n;
      }
    }
    try {
    await sql`
      update profiles set
        display_name = ${data.display_name?.trim() || p.display_name},
        mood = ${data.mood !== undefined ? data.mood : p.mood},
        mood_code = ${data.mood_code !== undefined ? data.mood_code : p.mood_code},
        avatar_seed = ${data.avatar_seed ?? p.avatar_seed},
        farewell = ${data.farewell !== undefined ? data.farewell : p.farewell},
        presence = ${data.presence ?? p.presence},
        theme = ${data.theme ?? p.theme},
        display_mode = ${data.display_mode ?? p.display_mode},
        sound_enabled = ${data.sound_enabled ?? p.sound_enabled},
        hide_offline = ${data.hide_offline ?? p.hide_offline},
        read_receipts = ${data.read_receipts ?? p.read_receipts},
        zone = ${zone},
        notify_push = ${data.notify_push ?? p.notify_push},
        phone = ${phone},
        airtime_sms = ${data.airtime_sms ?? p.airtime_sms},
        airtime_gprs = ${data.airtime_gprs ?? p.airtime_gprs ?? false},
        last_seen = now()
      where id = ${context.userId}
    `;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/unique|duplicate|23505|phone/i.test(msg)) throw new Error("That cell number is already linked to a QXio ID");
      throw e;
    }
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    return rows[0]!;
  });

export const listContacts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await onboardIfNeeded(sql, context.userId);
    await sql`
      update profiles set last_seen = now()
      where id = ${context.userId} and last_seen < now() - interval '2 minutes'
    `;
    const rows = await sql<{
      id: string;
      status: ContactRow["status"];
      requester_id: string;
      addressee_id: string;
      pinned: boolean;
      other_id: string;
      mxit_id: string;
      display_name: string;
      mood: string | null;
      mood_code: string | null;
      avatar_seed: string | null;
      avatar_url: string | null;
      presence: Profile["presence"];
      is_bot: boolean;
      zone: string;
      phone: string | null;
      conversation_id: string | null;
      nickname: string | null;
      blocked: boolean;
    }>`
      select c.id, c.status, c.requester_id, c.addressee_id, coalesce(c.pinned, false) as pinned,
        p.id as other_id, p.mxit_id, p.display_name, p.mood, p.mood_code,
        p.avatar_seed, p.avatar_url, p.presence, p.is_bot, coalesce(p.zone, 'ct') as zone,
        p.phone, conv.id as conversation_id,
        nick.nickname,
        (blk.blocker_id is not null) as blocked
      from contacts c
      join profiles p on p.id = case when c.requester_id = ${context.userId} then c.addressee_id else c.requester_id end
      left join conversations conv
        on conv.user_a = least(c.requester_id, c.addressee_id)
       and conv.user_b = greatest(c.requester_id, c.addressee_id)
      left join nicknames nick on nick.owner_id = ${context.userId} and nick.contact_id = p.id
      left join contact_blocks blk on blk.blocker_id = ${context.userId} and blk.blocked_id = p.id
      where c.requester_id = ${context.userId} or c.addressee_id = ${context.userId}
      order by coalesce(c.pinned, false) desc, p.display_name
    `;

    const lastMsgs = await sql<{ other_id: string; content: string; created_at: string }>`
      select distinct on (other_id)
        case when conv.user_a = ${context.userId} then conv.user_b else conv.user_a end as other_id,
        m.content, m.created_at
      from messages m
      join conversations conv on conv.id = m.conversation_id
      where conv.user_a = ${context.userId} or conv.user_b = ${context.userId}
      order by other_id, m.created_at desc
    `;
    const lastMap = new Map(lastMsgs.map((m) => [m.other_id, m]));

    const unread = await sql<{ other_id: string; n: number }>`
      select case when conv.user_a = ${context.userId} then conv.user_b else conv.user_a end as other_id,
             count(*)::int as n
      from messages m
      join conversations conv on conv.id = m.conversation_id
      where (conv.user_a = ${context.userId} or conv.user_b = ${context.userId})
        and m.sender_id <> ${context.userId}
        and m.delivery <> 'read'
      group by 1
    `;
    const unreadMap = new Map(unread.map((u) => [u.other_id, u.n]));

    const contacts: ContactRow[] = rows.map((r) => {
      const last = lastMap.get(r.other_id);
      const unread_count = unreadMap.get(r.other_id) ?? 0;
      return {
        id: r.id,
        status: r.status,
        requester_id: r.requester_id,
        addressee_id: r.addressee_id,
        unread: unread_count > 0,
        unread_count,
        last_message: last?.content ?? null,
        last_message_at: last?.created_at ?? null,
        pinned: !!r.pinned,
        conversation_id: r.conversation_id,
        nickname: r.nickname,
        blocked: !!r.blocked,
        other: {
          id: r.other_id,
          mxit_id: r.mxit_id,
          display_name: r.display_name,
          mood: r.mood,
          mood_code: r.mood_code,
          avatar_seed: r.avatar_seed,
          avatar_url: r.avatar_url,
          presence: r.presence,
          is_bot: r.is_bot,
          zone: r.zone,
          phone: r.phone,
        },
      };
    });
    return contacts;
  });

export const pinContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; pinned: boolean }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await sql<{ id: string; requester_id: string; addressee_id: string }>`
      select id, requester_id, addressee_id from contacts where id = ${data.id}
    `;
    if (!row[0] || (row[0].requester_id !== context.userId && row[0].addressee_id !== context.userId)) {
      throw new Error("Not found");
    }
    await sql`update contacts set pinned = ${data.pinned} where id = ${data.id}`;
    return { ok: true, pinned: data.pinned };
  });

async function blockedPair(sql: Sql, a: string, b: string) {
  const rows = await sql<{ n: number }>`
    select count(*)::int as n from contact_blocks
    where (blocker_id = ${a} and blocked_id = ${b}) or (blocker_id = ${b} and blocked_id = ${a})
  `;
  return (rows[0]?.n ?? 0) > 0;
}

async function assertNotBanned(sql: Sql, userId: string) {
  const rows = await sql<{ banned_at: string | null }>`select banned_at from profiles where id = ${userId}`;
  if (rows[0]?.banned_at) throw new Error("This QXio ID is locked");
}

const ROOM_CHAT: Record<string, string[]> = {
  "room-cpt": [
    "wind just picked up. table cloth incoming",
    "heita — still in this room after all these years :D",
    "who's actually in CT vs lurking from Jozi",
  ],
  "room-jhb": [
    "highway lights hitting different tonight",
    "Jozi traffic is a personality",
    "sharp sharp, room's alive",
  ],
  "room-dbn": [
    "Durbs humidity + bunny chow. that's the deal",
    "beach or this room. both lekker",
    "someone put on maskandi in Music",
  ],
  "room-general": ["anyone, anywhere, still here", "drop a mood before you lurk", "this revival hits different"],
  "room-gaming": [
    "Chess challenge is live — long-press a friend",
    "Moonbase raid after this game",
    "Connect 4 streak going. don't @ me",
  ],
  "room-music": ["dropping a track in a sec", "this room needs a slower jam", ":music: still the one"],
};

async function maybePulseRoom(sql: Sql, roomId: string) {
  const last = await sql<{ created_at: string }>`
    select created_at from messages where room_id = ${roomId} order by created_at desc limit 1
  `;
  if (last[0] && Date.now() - new Date(last[0].created_at).getTime() < 45_000) return;
  const lines = ROOM_CHAT[roomId] ?? ROOM_CHAT["room-general"]!;
  const line = lines[Math.floor(Math.random() * lines.length)]!;
  const bot = BOT_IDS[Math.floor(Math.random() * BOT_IDS.length)]!;
  await sql`
    insert into messages (id, room_id, sender_id, content, kind)
    values (${nid()}, ${roomId}, ${bot}, ${line}, 'text')
  `;
}

export const blockContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { otherId: string; blocked: boolean }) => d)
  .handler(async ({ context, data }) => {
    if (data.otherId === context.userId) throw new Error("That's you");
    const sql = await getSql();
    if (data.blocked) {
      await sql`
        insert into contact_blocks (blocker_id, blocked_id)
        values (${context.userId}, ${data.otherId})
        on conflict do nothing
      `;
    } else {
      await sql`
        delete from contact_blocks where blocker_id = ${context.userId} and blocked_id = ${data.otherId}
      `;
    }
    return { ok: true, blocked: data.blocked };
  });

export const setNickname = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { otherId: string; nickname: string }) => d)
  .handler(async ({ context, data }) => {
    const nick = data.nickname.trim().slice(0, 24);
    const sql = await getSql();
    if (!nick) {
      await sql`delete from nicknames where owner_id = ${context.userId} and contact_id = ${data.otherId}`;
      return { ok: true, nickname: null as string | null };
    }
    await sql`
      insert into nicknames (owner_id, contact_id, nickname)
      values (${context.userId}, ${data.otherId}, ${nick})
      on conflict (owner_id, contact_id) do update set nickname = ${nick}
    `;
    return { ok: true, nickname: nick };
  });

export const reportUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { otherId: string; reason: string }) => d)
  .handler(async ({ context, data }) => {
    if (data.otherId === context.userId) throw new Error("That's you");
    const reason = data.reason.trim().slice(0, 40) || "abuse";
    const sql = await getSql();
    await sql`
      insert into reports (id, reporter_id, target_id, reason)
      values (${nid()}, ${context.userId}, ${data.otherId}, ${reason})
    `;
    await sql`
      insert into contact_blocks (blocker_id, blocked_id)
      values (${context.userId}, ${data.otherId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const row = await sql<{ sender_id: string }>`select sender_id from messages where id = ${id}`;
    if (!row[0] || row[0].sender_id !== context.userId) throw new Error("Can't delete that");
    await sql`
      update messages set deleted = true, content = 'Message deleted', media = null
      where id = ${id} and sender_id = ${context.userId}
    `;
    return { ok: true };
  });

export const createChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { otherId: string; game: ChallengeGame }) => d)
  .handler(async ({ context, data }) => {
    if (data.otherId === context.userId) throw new Error("That's you");
    const sql = await getSql();
    await assertNotBanned(sql, context.userId);
    if (await blockedPair(sql, context.userId, data.otherId)) throw new Error("This contact is blocked");
    const [a, b] = pair(context.userId, data.otherId);
    await sql`
      insert into conversations (id, user_a, user_b)
      values (${nid()}, ${a}, ${b})
      on conflict (user_a, user_b) do nothing
    `;
    const conv = await sql<{ id: string }>`select id from conversations where user_a = ${a} and user_b = ${b}`;
    const convId = conv[0]!.id;
    const matchId = nid();
    const state = startState(data.game);
    await sql`
      insert into matches (id, game, player_a, player_b, state, turn)
      values (${matchId}, ${data.game}, ${context.userId}, ${data.otherId}, ${state}, ${context.userId})
    `;
    await sql`
      insert into messages (id, conversation_id, sender_id, content, delivery, kind)
      values (${nid()}, ${convId}, ${context.userId}, ${`${data.game}:${matchId}`}, 'sent', 'challenge')
    `;
    await sql`update conversations set last_message_at = now() where id = ${convId}`;
    return { matchId, convId, game: data.game };
  });

export const getMatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      game: string;
      player_a: string;
      player_b: string;
      state: string;
      turn: string;
      winner: string | null;
    }>`select id, game, player_a, player_b, state, turn, winner from matches where id = ${id}`;
    const m = rows[0];
    if (!m || (m.player_a !== context.userId && m.player_b !== context.userId)) throw new Error("Match not found");
    const otherId = m.player_a === context.userId ? m.player_b : m.player_a;
    const other = await sql<{ id: string; display_name: string; is_bot: boolean }>`
      select id, display_name, is_bot from profiles where id = ${otherId}
    `;
    return {
      id: m.id,
      game: m.game,
      player_a: m.player_a,
      player_b: m.player_b,
      state: m.state,
      turn: m.turn,
      winner: m.winner,
      opponent: other[0] ?? { id: otherId, display_name: "Friend", is_bot: false },
    };
  });

export const playMatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; state: string; turn: string; winner?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ player_a: string; player_b: string; turn: string; winner: string | null }>`
      select player_a, player_b, turn, winner from matches where id = ${data.id}
    `;
    const m = rows[0];
    if (!m || (m.player_a !== context.userId && m.player_b !== context.userId)) throw new Error("Match not found");
    if (m.winner) return { ok: true, done: true as const };
    const opp = m.player_a === context.userId ? m.player_b : m.player_a;
    const oppBot = await sql<{ is_bot: boolean }>`select is_bot from profiles where id = ${opp}`;
    if (m.turn !== context.userId && !oppBot[0]?.is_bot) throw new Error("Not your turn");
    await sql`
      update matches set state = ${data.state}, turn = ${data.turn}, winner = ${data.winner ?? null}, updated_at = now()
      where id = ${data.id}
    `;
    return { ok: true, done: !!data.winner };
  });

export const addContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((mxitId: string) => mxitId.trim().toLowerCase())
  .handler(async ({ context, data: mxitId }) => {
    const sql = await getSql();
    const found = await sql<Profile>`select * from profiles where lower(mxit_id) = ${mxitId}`;
    if (!found[0]) throw new Error("No QXio user with that ID");
    if (found[0].id === context.userId) throw new Error("That's you");
    const otherId = found[0].id;
    const existing = await sql<{ id: string; status: string }>`
      select id, status from contacts
      where (requester_id = ${context.userId} and addressee_id = ${otherId})
         or (requester_id = ${otherId} and addressee_id = ${context.userId})
    `;
    if (existing[0]?.status === "accepted") throw new Error("Already contacts");
    if (existing[0]) return { ok: true };
    const auto = found[0].is_bot;
    await sql`
      insert into contacts (id, requester_id, addressee_id, status)
      values (${nid()}, ${context.userId}, ${otherId}, ${auto ? "accepted" : "pending"})
    `;
    if (auto) {
      const [a, b] = pair(context.userId, otherId);
      await sql`
        insert into conversations (id, user_a, user_b)
        values (${nid()}, ${a}, ${b})
        on conflict (user_a, user_b) do nothing
      `;
    }
    await award(sql, context.userId, "first_friend");
    return { ok: true };
  });

export const respondContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; accept: boolean }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await sql<{ id: string; requester_id: string; addressee_id: string }>`
      select id, requester_id, addressee_id from contacts where id = ${data.id}
    `;
    if (!row[0] || (row[0].requester_id !== context.userId && row[0].addressee_id !== context.userId)) {
      throw new Error("Not found");
    }
    if (!data.accept) {
      await sql`delete from contacts where id = ${data.id}`;
      return { ok: true };
    }
    await sql`update contacts set status = 'accepted' where id = ${data.id}`;
    const [a, b] = pair(row[0].requester_id, row[0].addressee_id);
    await sql`
      insert into conversations (id, user_a, user_b)
      values (${nid()}, ${a}, ${b})
      on conflict (user_a, user_b) do nothing
    `;
    return { ok: true };
  });

export const searchUsers = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((q: string) => q.trim().toLowerCase())
  .handler(async ({ context, data: q }) => {
    if (q.length < 2) return [];
    const sql = await getSql();
    const like = `%${q}%`;
    return sql<PublicProfile>`
      select p.id, p.mxit_id, p.display_name, p.mood, p.mood_code, p.avatar_seed, p.presence, p.is_bot,
        coalesce(p.zone, 'ct') as zone, 'none' as contact_status
      from profiles p
      where p.id <> ${context.userId}
        and (p.mxit_id like ${like} or lower(p.display_name) like ${like})
      order by p.is_bot desc, p.display_name
      limit 20
    `;
  });

export const getPublicProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((mxitId: string) => mxitId)
  .handler(async ({ context, data: mxitId }) => {
    const sql = await getSql();
    const rows = await sql<Profile>`select * from profiles where lower(mxit_id) = ${mxitId.toLowerCase()}`;
    if (!rows[0]) return null;
    const p = rows[0];
    const rel = await sql<{ requester_id: string; addressee_id: string; status: string }>`
      select requester_id, addressee_id, status from contacts
      where (requester_id = ${context.userId} and addressee_id = ${p.id})
         or (requester_id = ${p.id} and addressee_id = ${context.userId})
    `;
    let contact_status: PublicProfile["contact_status"] = "none";
    const r = rel[0];
    if (r) {
      if (r.status === "accepted") contact_status = "accepted";
      else if (r.status === "blocked") contact_status = "blocked";
      else if (r.requester_id === context.userId) contact_status = "pending_out";
      else contact_status = "pending_in";
    }
    return {
      id: p.id,
      mxit_id: p.mxit_id,
      display_name: p.display_name,
      mood: p.mood,
      mood_code: p.mood_code,
      avatar_seed: p.avatar_seed,
      presence: p.presence,
      is_bot: p.is_bot,
      zone: p.zone,
      phone: contact_status === "accepted" ? p.phone : null,
      contact_status,
    } satisfies PublicProfile;
  });

export const openChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((otherId: string) => otherId)
  .handler(async ({ context, data: otherId }) => {
    const sql = await getSql();
    if (await blockedPair(sql, context.userId, otherId)) throw new Error("Blocked");
    const [a, b] = pair(context.userId, otherId);
    await sql`
      insert into conversations (id, user_a, user_b)
      values (${nid()}, ${a}, ${b})
      on conflict (user_a, user_b) do nothing
    `;
    const found = await sql<{ id: string }>`select id from conversations where user_a = ${a} and user_b = ${b}`;
    return { id: found[0]!.id };
  });

async function maybeFlushBotReply(sql: Sql, convId: string, userId: string, otherId: string) {
  if (!isBotId(otherId)) return;
  const last = await sql<{ sender_id: string; content: string; created_at: string }>`
    select sender_id, content, created_at from messages
    where conversation_id = ${convId}
    order by created_at desc limit 1
  `;
  if (!last[0] || last[0].sender_id !== userId) return;
  const age = Date.now() - new Date(last[0].created_at).getTime();
  if (age < 550) return;
  const me = await sql<{ display_name: string }>`select display_name from profiles where id = ${userId}`;
  const reply = botReply(otherId, last[0].content, me[0]?.display_name ?? "you");
  if (!reply) return;
  await sql`
    insert into messages (id, conversation_id, sender_id, content, delivery, kind)
    values (${nid()}, ${convId}, ${otherId}, ${reply}, 'sent', 'text')
  `;
  await sql`update conversations set last_message_at = now() where id = ${convId}`;
}

async function convTyping(sql: Sql, convId: string, userId: string, otherId: string): Promise<boolean> {
  if (isBotId(otherId)) {
    const last = await sql<{ sender_id: string; created_at: string }>`
      select sender_id, created_at from messages
      where conversation_id = ${convId}
      order by created_at desc limit 1
    `;
    if (last[0] && last[0].sender_id === userId) {
      const age = Date.now() - new Date(last[0].created_at).getTime();
      if (age < 2200) return true;
    }
  }
  const rows = await sql<{ user_id: string }>`
    select user_id from typing
    where conversation_id = ${convId}
      and user_id <> ${userId}
      and updated_at > now() - interval '4 seconds'
  `;
  return rows.length > 0;
}

export const loadConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((convId: string) => convId)
  .handler(async ({ context, data: convId }) => {
    const sql = await getSql();
    const conv = await sql<{ id: string; user_a: string; user_b: string }>`
      select id, user_a, user_b from conversations where id = ${convId}
    `;
    if (!conv[0] || (conv[0].user_a !== context.userId && conv[0].user_b !== context.userId)) {
      throw new Error("Conversation not found");
    }
    const otherId = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;
    await maybeFlushBotReply(sql, convId, context.userId, otherId);
    const other = await sql<ContactRow["other"]>`
      select id, mxit_id, display_name, mood, mood_code, avatar_seed, avatar_url, presence, is_bot, coalesce(zone, 'ct') as zone, phone
      from profiles where id = ${otherId}
    `;
    const unread = await sql<{ id: string }>`
      select m.id from messages m
      join profiles me on me.id = ${context.userId}
      where m.conversation_id = ${convId}
        and m.sender_id <> ${context.userId}
        and m.delivery <> 'read'
        and me.read_receipts is not false
      limit 1
    `;
    if (unread.length) {
      await sql`
        update messages set delivery = 'read'
        where conversation_id = ${convId} and sender_id <> ${context.userId} and delivery <> 'read'
      `;
    }
    const messages = await sql<ChatMessage>`
      select * from (
        select m.id, m.sender_id, m.content, m.delivery, m.created_at,
          coalesce(m.kind, 'text') as kind, m.media, coalesce(m.channel, 'data') as channel,
          m.reply_to, m.reply_preview, coalesce(m.deleted, false) as deleted,
          p.display_name as sender_name, p.avatar_seed as sender_seed
        from messages m
        join profiles p on p.id = m.sender_id
        where m.conversation_id = ${convId}
        order by m.created_at desc
        limit 80
      ) t order by created_at
    `;
    const typing = await convTyping(sql, convId, context.userId, otherId);
    return { id: convId, other: other[0]!, messages, typing } satisfies ConversationView;
  });

export const pollConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { convId: string; afterId?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const conv = await sql<{ id: string; user_a: string; user_b: string }>`
      select id, user_a, user_b from conversations where id = ${data.convId}
    `;
    if (!conv[0] || (conv[0].user_a !== context.userId && conv[0].user_b !== context.userId)) {
      throw new Error("Conversation not found");
    }
    const otherId = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;
    await maybeFlushBotReply(sql, data.convId, context.userId, otherId);
    let messages: ChatMessage[] = [];
    if (data.afterId) {
      messages = await sql<ChatMessage>`
        select m.id, m.sender_id, m.content, m.delivery, m.created_at,
          coalesce(m.kind, 'text') as kind, m.media, coalesce(m.channel, 'data') as channel,
          m.reply_to, m.reply_preview, coalesce(m.deleted, false) as deleted,
          p.display_name as sender_name, p.avatar_seed as sender_seed
        from messages m
        join profiles p on p.id = m.sender_id
        where m.conversation_id = ${data.convId}
          and m.id <> ${data.afterId}
          and m.created_at >= coalesce((select created_at from messages where id = ${data.afterId}), 'epoch'::timestamptz)
        order by m.created_at
        limit 40
      `;
    }
    const typing = await convTyping(sql, data.convId, context.userId, otherId);
    return { messages, typing };
  });

/**
 * Long-poll variant of pollConversation: instead of returning immediately, it
 * HOLDS the request open (up to ~9s) and only returns early when a new message
 * arrives or the typing state flips. The client reconnects in a loop, so an
 * idle chat makes roughly one held request every 9s with no payload flowing —
 * instead of a fresh round-trip every 2s. That is the difference between a chat
 * quietly draining mobile data while open and one that costs almost nothing
 * until something actually happens. Kept under typical serverless request
 * limits (~10s) so a held request completes rather than being killed.
 */
const WAIT_HOLD_MS = 9000;
const WAIT_TICK_MS = 1200;

export const waitConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { convId: string; afterId?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const conv = await sql<{ id: string; user_a: string; user_b: string }>`
      select id, user_a, user_b from conversations where id = ${data.convId}
    `;
    if (!conv[0] || (conv[0].user_a !== context.userId && conv[0].user_b !== context.userId)) {
      throw new Error("Conversation not found");
    }
    const otherId = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;

    const check = async () => {
      await maybeFlushBotReply(sql, data.convId, context.userId, otherId);
      let messages: ChatMessage[] = [];
      if (data.afterId) {
        messages = await sql<ChatMessage>`
          select m.id, m.sender_id, m.content, m.delivery, m.created_at,
            coalesce(m.kind, 'text') as kind, m.media, coalesce(m.channel, 'data') as channel,
            m.reply_to, m.reply_preview, coalesce(m.deleted, false) as deleted,
            p.display_name as sender_name, p.avatar_seed as sender_seed
          from messages m
          join profiles p on p.id = m.sender_id
          where m.conversation_id = ${data.convId}
            and m.id <> ${data.afterId}
            and m.created_at >= coalesce((select created_at from messages where id = ${data.afterId}), 'epoch'::timestamptz)
          order by m.created_at
          limit 40
        `;
      }
      const typing = await convTyping(sql, data.convId, context.userId, otherId);
      return { messages, typing };
    };

    const deadline = Date.now() + WAIT_HOLD_MS;
    const first = await check();
    if (first.messages.length) return first;
    const baselineTyping = first.typing;
    for (;;) {
      if (Date.now() >= deadline) return { messages: [] as ChatMessage[], typing: baselineTyping };
      await new Promise((r) => setTimeout(r, WAIT_TICK_MS));
      const r = await check();
      if (r.messages.length || r.typing !== baselineTyping) return r;
    }
  });

export const sendDirect = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { convId: string; content: string; kind?: MsgKind; media?: string | null; channel?: MsgChannel; replyTo?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const channel: MsgChannel =
      data.channel === "sms" ? "sms" : data.channel === "gprs" ? "gprs" : "data";
    if ((channel === "sms" || channel === "gprs") && data.kind && data.kind !== "text") {
      throw new Error(channel === "sms" ? "Airtime SMS is text only — no pictures or files" : "GPRS is text only — no pictures or files");
    }
    const kind: MsgKind =
      channel === "sms" || channel === "gprs"
        ? "text"
        : data.kind === "image" || data.kind === "voice" || data.kind === "challenge"
          ? data.kind
          : "text";
    let content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
    if (kind === "text" && !content) throw new Error("Empty");
    if (channel === "sms") {
      if (content.length > SMS_LIMIT) content = clipSms(content);
      if (data.media) throw new Error("Airtime SMS is text only");
    }
    if (channel === "gprs") {
      if (content.length > GPRS_LIMIT) content = clipGprs(content);
      if (data.media) throw new Error("GPRS is text only");
    }
    if (MSG_COST_MOOLA !== 0) throw new Error("Messaging must stay free");
    if (content.length > 2000) throw new Error("Too long");
    if (data.media && data.media.length > 450_000) throw new Error("File too large");
    const sql = await getSql();
    await assertNotBanned(sql, context.userId);
    const conv = await sql<{ user_a: string; user_b: string }>`
      select user_a, user_b from conversations where id = ${data.convId}
    `;
    if (!conv[0] || (conv[0].user_a !== context.userId && conv[0].user_b !== context.userId)) {
      throw new Error("Conversation not found");
    }
    const peer = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;
    if (await blockedPair(sql, context.userId, peer)) throw new Error("This contact is blocked");
    let replyTo: string | null = data.replyTo || null;
    let replyPreview: string | null = null;
    if (replyTo) {
      const orig = await sql<{ content: string; sender_name: string; deleted: boolean }>`
        select m.content, p.display_name as sender_name, coalesce(m.deleted, false) as deleted
        from messages m join profiles p on p.id = m.sender_id
        where m.id = ${replyTo} and m.conversation_id = ${data.convId}
      `;
      if (!orig[0] || orig[0].deleted) replyTo = null;
      else replyPreview = `${orig[0].sender_name}: ${orig[0].content.slice(0, 80)}`;
    }
    await sql`
      insert into messages (id, conversation_id, sender_id, content, delivery, kind, media, channel, reply_to, reply_preview)
      values (${nid()}, ${data.convId}, ${context.userId}, ${content}, 'sent', ${kind}, ${channel === "data" ? data.media || null : null}, ${channel}, ${replyTo}, ${replyPreview})
    `;
    await sql`update conversations set last_message_at = now() where id = ${data.convId}`;
    await sql`delete from typing where conversation_id = ${data.convId} and user_id = ${context.userId}`;

    // True no-data path: if this is an SMS-channel message and a real aggregator
    // is configured (opt-in via SMS_OUTBOUND=1), deliver it to the peer's handset
    // so they receive it even with no data. Best-effort — a delivery failure must
    // never fail the in-app send, which already succeeded above.
    if (channel === "sms" && smsOutboundEnabled()) {
      try {
        const peerRow = await sql<{ phone: string | null; is_bot: boolean }>`
          select phone, coalesce(is_bot, false) as is_bot from profiles where id = ${peer}
        `;
        const me = await sql<{ mxit_id: string }>`select mxit_id from profiles where id = ${context.userId}`;
        if (peerRow[0]?.phone && !peerRow[0].is_bot) {
          const outBody = clipSms(`QX ${me[0]?.mxit_id ?? "qxio"}: ${content}`);
          const r = await sendSmsOut(peerRow[0].phone, outBody);
          if (!r.ok && r.error) console.error("[sms-out]", r.provider, r.error);
        }
      } catch (e) {
        console.error("[sms-out] delivery failed:", e);
      }
    }

    const rows = await sql<ChatMessage>`
      select id, sender_id, content, delivery, created_at, coalesce(kind, 'text') as kind, media, coalesce(channel, 'data') as channel,
        reply_to, reply_preview, coalesce(deleted, false) as deleted
      from messages where conversation_id = ${data.convId} and sender_id = ${context.userId}
      order by created_at desc limit 1
    `;
    return rows[0]!;
  });

export const setTyping = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((convId: string) => convId)
  .handler(async ({ context, data: convId }) => {
    const sql = await getSql();
    const conv = await sql<{ user_a: string; user_b: string }>`
      select user_a, user_b from conversations where id = ${convId}
    `;
    if (!conv[0] || (conv[0].user_a !== context.userId && conv[0].user_b !== context.userId)) return { ok: false };
    await sql`
      insert into typing (conversation_id, user_id, updated_at)
      values (${convId}, ${context.userId}, now())
      on conflict (conversation_id, user_id) do update set updated_at = now()
    `;
    return { ok: true };
  });

export const listRooms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await onboardIfNeeded(sql, context.userId);
    return sql<Chatroom>`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count,
        (select m.content from messages m where m.room_id = r.id and coalesce(m.deleted, false) = false
          order by m.created_at desc limit 1) as last_message
      from chatrooms r
      order by r.name
    `;
  });

export const loadRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    const sql = await getSql();
    const room = await sql<Chatroom>`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count
      from chatrooms r where r.id = ${roomId}
    `;
    if (!room[0]) throw new Error("Room not found");
    await sql`
      insert into room_members (room_id, user_id) values (${roomId}, ${context.userId})
      on conflict (room_id, user_id) do nothing
    `;
    await maybePulseRoom(sql, roomId);
    const members = await sql<{ display_name: string; presence: string }>`
      select p.display_name, p.presence from room_members m
      join profiles p on p.id = m.user_id
      where m.room_id = ${roomId}
      order by p.is_bot desc, p.display_name
      limit 12
    `;
    const messages = await sql<ChatMessage>`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media,
        m.reply_to, m.reply_preview, coalesce(m.deleted, false) as deleted
      from messages m
      join profiles p on p.id = m.sender_id
      where m.room_id = ${roomId}
      order by m.created_at
      limit 200
    `;
    return { room: { ...room[0], member_count: Math.max(room[0].member_count, members.length) }, messages, here: members.map((m) => m.display_name) };
  });

export const sendRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string; content: string; kind?: MsgKind; media?: string | null; replyTo?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const kind: MsgKind = data.kind === "image" || data.kind === "voice" ? data.kind : "text";
    const content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
    if (kind === "text" && !content) throw new Error("Empty");
    if (MSG_COST_MOOLA !== 0) throw new Error("Messaging must stay free");
    const sql = await getSql();
    await assertNotBanned(sql, context.userId);
    let replyTo: string | null = data.replyTo || null;
    let replyPreview: string | null = null;
    if (replyTo) {
      const orig = await sql<{ content: string; sender_name: string; deleted: boolean }>`
        select m.content, p.display_name as sender_name, coalesce(m.deleted, false) as deleted
        from messages m join profiles p on p.id = m.sender_id
        where m.id = ${replyTo} and m.room_id = ${data.roomId}
      `;
      if (!orig[0] || orig[0].deleted) replyTo = null;
      else replyPreview = `${orig[0].sender_name}: ${orig[0].content.slice(0, 80)}`;
    }
    await sql`
      insert into messages (id, room_id, sender_id, content, kind, media, reply_to, reply_preview)
      values (${nid()}, ${data.roomId}, ${context.userId}, ${content}, ${kind}, ${data.media || null}, ${replyTo}, ${replyPreview})
    `;
    if (Math.random() < 0.45 && kind === "text") {
      const bot = BOT_IDS[Math.floor(Math.random() * BOT_IDS.length)]!;
      const me = await sql<{ display_name: string }>`select display_name from profiles where id = ${context.userId}`;
      const reply = botReply(bot, content, me[0]?.display_name ?? "you");
      if (reply) {
        await sql`
          insert into messages (id, room_id, sender_id, content, kind)
          values (${nid()}, ${data.roomId}, ${bot}, ${reply}, 'text')
        `;
      }
    }
    const room = await sql<Chatroom>`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count
      from chatrooms r where r.id = ${data.roomId}
    `;
    const messages = await sql<ChatMessage>`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media,
        m.reply_to, m.reply_preview, coalesce(m.deleted, false) as deleted
      from messages m
      join profiles p on p.id = m.sender_id
      where m.room_id = ${data.roomId}
      order by m.created_at
      limit 200
    `;
    return { room: room[0]!, messages };
  });

export const listGroups = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<MultiMxGroup>`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g
      join multimx_members mm on mm.group_id = g.id
      where mm.user_id = ${context.userId}
      order by g.created_at desc
    `;
  });

export const createGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; memberIds: string[] }) => d)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (!name) throw new Error("Name required");
    const sql = await getSql();
    const id = nid();
    await sql`insert into multimx_groups (id, name, owner_id) values (${id}, ${name}, ${context.userId})`;
    const members = Array.from(new Set([context.userId, ...data.memberIds]));
    for (const uid of members) {
      await sql`insert into multimx_members (group_id, user_id) values (${id}, ${uid}) on conflict do nothing`;
    }
    await sql`
      insert into messages (id, group_id, sender_id, content, kind)
      values (${nid()}, ${id}, ${context.userId}, ${`created QX Mix "${name}"`}, 'text')
    `;
    return { id };
  });

export const loadGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((groupId: string) => groupId)
  .handler(async ({ context, data: groupId }) => {
    const sql = await getSql();
    const member = await sql<{ user_id: string }>`
      select user_id from multimx_members where group_id = ${groupId} and user_id = ${context.userId}
    `;
    if (!member[0]) throw new Error("Not a member");
    const g = await sql<MultiMxGroup>`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g where g.id = ${groupId}
    `;
    const messages = await sql<ChatMessage>`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m join profiles p on p.id = m.sender_id
      where m.group_id = ${groupId}
      order by m.created_at
    `;
    return { group: g[0]!, messages };
  });

export const sendGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { groupId: string; content: string; kind?: MsgKind; media?: string | null }) => d)
  .handler(async ({ context, data }) => {
    const kind: MsgKind = data.kind === "image" || data.kind === "voice" ? data.kind : "text";
    const content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
    if (kind === "text" && !content) throw new Error("Empty");
    if (MSG_COST_MOOLA !== 0) throw new Error("Messaging must stay free");
    const sql = await getSql();
    await assertNotBanned(sql, context.userId);
    await sql`
      insert into messages (id, group_id, sender_id, content, kind, media)
      values (${nid()}, ${data.groupId}, ${context.userId}, ${content}, ${kind}, ${data.media || null})
    `;
    const g = await sql<MultiMxGroup>`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g where g.id = ${data.groupId}
    `;
    const messages = await sql<ChatMessage>`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m join profiles p on p.id = m.sender_id
      where m.group_id = ${data.groupId}
      order by m.created_at
    `;
    return { group: g[0]!, messages };
  });

export const listStatuses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return sql<StatusItem>`
      select s.id, s.author_id, s.caption, s.background, s.created_at, s.expires_at,
        p.display_name as author_name, p.avatar_seed as author_seed,
        (select count(*)::int from status_views v where v.status_id = s.id) as views
      from statuses s
      join profiles p on p.id = s.author_id
      where s.expires_at > now()
      order by s.created_at desc
    `;
  });

export const postStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { caption: string; background: string | null }) => d)
  .handler(async ({ context, data }) => {
    const caption = data.caption.trim();
    if (!caption) throw new Error("Write something");
    const sql = await getSql();
    await assertNotBanned(sql, context.userId);
    await sql`
      insert into statuses (id, author_id, caption, background, expires_at)
      values (${nid()}, ${context.userId}, ${caption}, ${data.background}, now() + interval '24 hours')
    `;
    await award(sql, context.userId, "status");
    return { ok: true };
  });

export const viewStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((statusId: string) => statusId)
  .handler(async ({ context, data: statusId }) => {
    const sql = await getSql();
    await sql`
      insert into status_views (status_id, viewer_id)
      values (${statusId}, ${context.userId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const claimDaily = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const p = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (!p[0]) throw new Error("No profile");
    const today = new Date().toISOString().slice(0, 10);
    const claimed = String(p[0].last_daily_claim ?? "").slice(0, 10);
    if (claimed === today) throw new Error("Already claimed today");
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = claimed === yesterday ? p[0].streak_days + 1 : 1;
    const amount = 25 + Math.min(streak, 14) * 5;
    await sql`
      update profiles set moola = moola + ${amount}, last_daily_claim = ${today}::date, streak_days = ${streak}
      where id = ${context.userId}
    `;
    await sql`
      insert into moola_tx (id, user_id, amount, reason)
      values (${nid()}, ${context.userId}, ${amount}, ${`Daily claim · ${streak}-day streak`})
    `;
    await award(sql, context.userId, "daily");
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    return { profile: rows[0]!, amount, streak };
  });

export const giftMoola = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { otherId: string; amount: number }) => d)
  .handler(async ({ context, data }) => {
    const amount = Math.floor(data.amount);
    if (amount < 1) throw new Error("Invalid amount");
    const sql = await getSql();
    const me = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (!me[0] || me[0].moola < amount) throw new Error("Not enough Moola");
    await sql`update profiles set moola = moola - ${amount} where id = ${context.userId}`;
    await sql`update profiles set moola = moola + ${amount} where id = ${data.otherId}`;
    await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-amount}, ${"Gift sent"})`;
    await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${data.otherId}, ${amount}, ${"Gift received"})`;
    const [a, b] = pair(context.userId, data.otherId);
    await sql`insert into conversations (id, user_a, user_b) values (${nid()}, ${a}, ${b}) on conflict do nothing`;
    const conv = await sql<{ id: string }>`select id from conversations where user_a = ${a} and user_b = ${b}`;
    if (conv[0]) {
      await sql`
        insert into messages (id, conversation_id, sender_id, content, kind)
        values (${nid()}, ${conv[0].id}, ${context.userId}, ${`sent you ${amount} Moola (greedy)`}, 'text')
      `;
    }
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    return rows[0]!;
  });

export const spendMoola = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { amount: number; reason: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (!me[0] || me[0].moola < data.amount) throw new Error("Not enough Moola");
    await sql`update profiles set moola = moola - ${data.amount} where id = ${context.userId}`;
    await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-data.amount}, ${data.reason})`;
    const rows = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    return rows[0]!;
  });

export const buyEmoticard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => code)
  .handler(async ({ context, data: code }) => {
    const sql = await getSql();
    const key = `emo:${code}`;
    const have = await sql<{ code: string }>`
      select code from achievements where user_id = ${context.userId} and code = ${key}
    `;
    if (have.length) return { already: true as const };
    const me = await sql<Profile>`select * from profiles where id = ${context.userId}`;
    if (!me[0] || me[0].moola < MOOLA_EXTRAS.emoticard) throw new Error(`Need ${MOOLA_EXTRAS.emoticard} Moola`);
    await sql`update profiles set moola = moola - ${MOOLA_EXTRAS.emoticard} where id = ${context.userId}`;
    await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-MOOLA_EXTRAS.emoticard}, ${`Emoticard ${code}`})`;
    await award(sql, context.userId, key);
    return { already: false as const };
  });

export const listMoola = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<MoolaTx>`
      select id, amount, reason, created_at from moola_tx
      where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
  });

export const listConfessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return sql<Confession>`
      select id, body, hearts, created_at from confessions order by created_at desc limit 50
    `;
  });

export const postConfession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((body: string) => body.trim())
  .handler(async ({ context, data: body }) => {
    if (body.length < 8) throw new Error("A bit short");
    const sql = await getSql();
    await sql`
      insert into confessions (id, author_id, body) values (${nid()}, ${context.userId}, ${body})
    `;
    return { ok: true };
  });

export const heartConfession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const inserted = await sql<{ confession_id: string }>`
      insert into confession_hearts (confession_id, user_id)
      values (${id}, ${context.userId})
      on conflict do nothing
      returning confession_id
    `;
    if (inserted[0]) await sql`update confessions set hearts = hearts + 1 where id = ${id}`;
    return { ok: true };
  });

export const listPolls = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const polls = await sql<{ id: string; question: string; options: string }>`select id, question, options from polls`;
    const votes = await sql<{ poll_id: string; option_idx: number; n: number }>`
      select poll_id, option_idx, count(*)::int as n from poll_votes group by poll_id, option_idx
    `;
    const mine = await sql<{ poll_id: string; option_idx: number }>`
      select poll_id, option_idx from poll_votes where user_id = ${context.userId}
    `;
    const mineMap = new Map(mine.map((m) => [m.poll_id, m.option_idx]));
    return polls.map((p) => {
      const options = parseJson<string[]>(p.options, []);
      const counts = options.map((_, i) => votes.find((v) => v.poll_id === p.id && v.option_idx === i)?.n ?? 0);
      return {
        id: p.id,
        question: p.question,
        options,
        votes: counts,
        my_vote: mineMap.get(p.id) ?? null,
      } satisfies Poll;
    });
  });

export const votePoll = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { pollId: string; optionIdx: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into poll_votes (poll_id, user_id, option_idx)
      values (${data.pollId}, ${context.userId}, ${data.optionIdx})
      on conflict (poll_id, user_id) do update set option_idx = ${data.optionIdx}
    `;
    return { ok: true };
  });

function parseJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "object") return v as T;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function tickMoonbase(state: MoonbaseState): MoonbaseState {
  const last = new Date(state.last_tick).getTime();
  const hours = Math.min(12, Math.max(0, (Date.now() - last) / 3600000));
  const b = state.buildings;
  const oxy = Math.floor((b.oxygen_plant ?? 0) * 12 * hours);
  const wat = Math.floor((b.water_extractor ?? 0) * 12 * hours);
  const irn = Math.floor((b.iron_mine ?? 0) * 18 * hours);
  const hel = Math.floor((b.helium_drill ?? 0) * 6 * hours);
  return {
    ...state,
    oxygen: state.oxygen + oxy,
    water: state.water + wat,
    iron: state.iron + irn,
    helium: state.helium + hel,
    last_tick: new Date().toISOString(),
  };
}

async function loadMoonState(sql: Sql, userId: string): Promise<MoonbaseState> {
  const rows = await sql<{
    base_name: string;
    oxygen: number;
    water: number;
    iron: number;
    helium: number;
    power: number;
    buildings: string;
    units: string;
    last_tick: string;
  }>`select * from moonbase where user_id = ${userId}`;
  if (!rows[0]) {
    await sql`insert into moonbase (user_id) values (${userId})`;
    return loadMoonState(sql, userId);
  }
  const raw = rows[0];
  let state: MoonbaseState = {
    base_name: raw.base_name,
    oxygen: raw.oxygen,
    water: raw.water,
    iron: raw.iron,
    helium: raw.helium,
    power: raw.power,
    buildings: parseJson<Record<string, number>>(raw.buildings, { command_centre: 1, oxygen_plant: 1, water_extractor: 1, iron_mine: 1 }),
    units: parseJson<Record<string, number>>(raw.units, { moonbuggy: 2 }),
    last_tick: String(raw.last_tick),
  };
  state = tickMoonbase(state);
  await sql`
    update moonbase set oxygen = ${state.oxygen}, water = ${state.water}, iron = ${state.iron},
      helium = ${state.helium}, last_tick = ${state.last_tick},
      buildings = ${JSON.stringify(state.buildings)}, units = ${JSON.stringify(state.units)}
    where user_id = ${userId}
  `;
  return state;
}

export const getMoonbase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return loadMoonState(await getSql(), context.userId);
  });

export const moonbaseAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { kind: "upgrade" | "train" | "raid"; key: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const state = await loadMoonState(sql, context.userId);
    const costMul = (n: number) => 40 * n;
    if (data.kind === "upgrade") {
      const lvl = (state.buildings[data.key] ?? 0) + 1;
      const cost = {
        o: costMul(lvl),
        w: costMul(lvl),
        i: costMul(lvl) * 2,
        h: Math.floor(costMul(lvl) / 4),
      };
      if (state.oxygen < cost.o || state.water < cost.w || state.iron < cost.i || state.helium < cost.h) {
        throw new Error("Not enough resources");
      }
      state.oxygen -= cost.o;
      state.water -= cost.w;
      state.iron -= cost.i;
      state.helium -= cost.h;
      state.buildings[data.key] = lvl;
      state.power += 3;
    } else if (data.kind === "train") {
      const c: Record<string, { i: number; h: number }> = {
        moonbuggy: { i: 50, h: 0 },
        gunship: { i: 150, h: 80 },
        laser_cannon: { i: 900, h: 400 },
      };
      const cost = c[data.key];
      if (!cost) throw new Error("Unknown unit");
      if (state.iron < cost.i || state.helium < cost.h) throw new Error("Not enough resources");
      state.iron -= cost.i;
      state.helium -= cost.h;
      state.units[data.key] = (state.units[data.key] ?? 0) + 1;
      state.power += data.key === "laser_cannon" ? 20 : data.key === "gunship" ? 8 : 2;
    } else {
      const win =
        (state.units.moonbuggy ?? 0) * 5 +
          (state.units.gunship ?? 0) * 40 +
          (state.units.laser_cannon ?? 0) * 200 +
          Math.random() * 80 >
        60;
      if (win) {
        const loot = {
          o: 40 + Math.floor(Math.random() * 80),
          w: 40 + Math.floor(Math.random() * 80),
          i: 80 + Math.floor(Math.random() * 160),
          h: 10 + Math.floor(Math.random() * 40),
        };
        state.oxygen += loot.o;
        state.water += loot.w;
        state.iron += loot.i;
        state.helium += loot.h;
        await credit(sql, context.userId, 8, "Moonbase raid");
        await award(sql, context.userId, "raid");
      } else {
        state.units.moonbuggy = Math.max(0, (state.units.moonbuggy ?? 0) - 1);
      }
      await sql`
        update moonbase set oxygen = ${state.oxygen}, water = ${state.water}, iron = ${state.iron},
          helium = ${state.helium}, power = ${state.power}, last_tick = now(),
          buildings = ${JSON.stringify(state.buildings)}, units = ${JSON.stringify(state.units)}
        where user_id = ${context.userId}
      `;
      return { state, result: win ? "win" : "loss" };
    }
    await sql`
      update moonbase set oxygen = ${state.oxygen}, water = ${state.water}, iron = ${state.iron},
        helium = ${state.helium}, power = ${state.power}, last_tick = now(),
        buildings = ${JSON.stringify(state.buildings)}, units = ${JSON.stringify(state.units)}
      where user_id = ${context.userId}
    `;
    return { state, result: "ok" };
  });

export const leaderboards = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const moola = await sql<{ mxit_id: string; display_name: string; avatar_seed: string | null; moola: number }>`
      select mxit_id, display_name, avatar_seed, moola from profiles
      where is_bot = false
      order by moola desc limit 15
    `;
    const power = await sql<{ mxit_id: string; display_name: string; power: number }>`
      select p.mxit_id, p.display_name, m.power
      from moonbase m join profiles p on p.id = m.user_id
      order by m.power desc limit 15
    `;
    const streaks = await sql<{ mxit_id: string; display_name: string; streak_days: number }>`
      select mxit_id, display_name, streak_days from profiles
      where is_bot = false
      order by streak_days desc, moola desc limit 15
    `;
    return { moola, power, streaks };
  });

export const meetPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<PublicProfile>`
      select p.id, p.mxit_id, p.display_name, p.mood, p.mood_code, p.avatar_seed, p.presence, p.is_bot,
        coalesce(p.zone, 'ct') as zone, 'none' as contact_status
      from profiles p
      where p.id <> ${context.userId}
        and p.id not in (
          select case when requester_id = ${context.userId} then addressee_id else requester_id end
          from contacts where requester_id = ${context.userId} or addressee_id = ${context.userId}
        )
      order by p.presence = 'online' desc, random()
      limit 12
    `;
  });

export const myAchievements = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ code: string; unlocked_at: string }>`
      select code, unlocked_at from achievements where user_id = ${context.userId}
    `;
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const id = context.userId;
    const me = await sql<{ is_bot: boolean }>`select is_bot from profiles where id = ${id}`;
    if (me[0]?.is_bot) throw new Error("Can't delete that");
    await sql`delete from typing where user_id = ${id}`;
    await sql`delete from poll_votes where user_id = ${id}`;
    await sql`delete from confession_hearts where user_id = ${id}`;
    await sql`update confessions set author_id = null where author_id = ${id}`;
    await sql`delete from status_views where viewer_id = ${id}`;
    await sql`delete from statuses where author_id = ${id}`;
    await sql`delete from achievements where user_id = ${id}`;
    await sql`delete from moola_tx where user_id = ${id}`;
    await sql`delete from moonbase where user_id = ${id}`;
    await sql`delete from room_members where user_id = ${id}`;
    await sql`delete from multimx_members where user_id = ${id}`;
    await sql`delete from multimx_groups where owner_id = ${id}`;
    await sql`delete from nicknames where owner_id = ${id} or contact_id = ${id}`;
    await sql`delete from contact_blocks where blocker_id = ${id} or blocked_id = ${id}`;
    await sql`delete from reports where reporter_id = ${id}`;
    await sql`delete from matches where player_a = ${id} or player_b = ${id}`;
    await sql`delete from contacts where requester_id = ${id} or addressee_id = ${id}`;
    await sql`delete from messages where sender_id = ${id}`;
    await sql`
      delete from messages where conversation_id in (
        select id from conversations where user_a = ${id} or user_b = ${id}
      )
    `;
    await sql`
      delete from typing where conversation_id in (
        select id from conversations where user_a = ${id} or user_b = ${id}
      )
    `;
    await sql`delete from conversations where user_a = ${id} or user_b = ${id}`;
    await sql`delete from profiles where id = ${id} and coalesce(is_bot, false) = false`;
    await sql`delete from "session" where "userId" = ${id}`;
    await sql`delete from "account" where "userId" = ${id}`;
    await sql`delete from "user" where id = ${id}`;
    return { ok: true as const };
  });
