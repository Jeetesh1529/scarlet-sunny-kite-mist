import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { dbSource, getSql, type Sql } from "@/lib/db";

export type HqUser = {
  id: string;
  mxit_id: string;
  display_name: string;
  zone: string | null;
  presence: string;
  created_at: string;
  last_seen: string;
  is_admin: boolean;
  banned_at: string | null;
  moola: number;
  age: number | null;
  phone: string | null;
  avatar_seed: string | null;
  email: string | null;
  msgs: number;
};

export type HqReport = {
  id: string;
  reason: string;
  created_at: string;
  reporter_id: string;
  reporter_name: string;
  reporter_mxit: string;
  target_id: string;
  target_name: string;
  target_mxit: string;
};

export type HqDay = { day: string; n: number };

export type HqZone = { zone: string; n: number };

export type HqMix = { k: string; n: number };

export type HqRoomStat = { name: string; n: number; people: number };

export type HqGameStat = { game: string; n: number; done: number };

export type HqSender = { mxit_id: string; display_name: string; n: number };

export type HqFunnel = { signed: number; chatted: number; friended: number; roomed: number };

export type HqPulse = {
  dau: number;
  wau: number;
  d1Eligible: number;
  d1Returned: number;
  claimedToday: number;
  gprsOn: number;
  smsOn: number;
  matches: number;
  msgDays: HqDay[];
  channels: HqMix[];
  kinds: HqMix[];
  rooms: HqRoomStat[];
  games: HqGameStat[];
  senders: HqSender[];
  funnel: HqFunnel;
};

export type HqSnapshot = {
  persist: "neon" | "preview";
  humans: number;
  today: number;
  week: number;
  online: number;
  messages24h: number;
  reports: number;
  days: HqDay[];
  zones: HqZone[];
  recent: HqUser[];
  inbox: HqReport[];
  pulse: HqPulse;
};

async function requireHq(sql: Sql, userId: string) {
  const { requireHq: gate } = await import("./hq-owner.server");
  await gate(sql, userId);
}

const USER_COLS = `
  p.id, p.mxit_id, p.display_name, coalesce(p.zone, 'ct') as zone, p.presence, p.created_at, p.last_seen,
  coalesce(p.is_admin, false) as is_admin, p.banned_at, p.moola, p.age, p.phone, p.avatar_seed,
  u.email,
  (select count(*)::int from messages m where m.sender_id = p.id and coalesce(m.deleted, false) = false) as msgs
`;

export const hqAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const { inspectHq } = await import("./hq-owner.server");
    return inspectHq(sql, context.userId);
  });

export const claimHq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((key: string) => key)
  .handler(async ({ context, data: key }) => {
    const sql = await getSql();
    const { inspectHq, ownerKeyMatches } = await import("./hq-owner.server");
    const gate = await inspectHq(sql, context.userId);
    if (!gate.claimable) throw new Error("Unauthorized");
    if (!ownerKeyMatches(key)) throw new Error("Wrong key");
    await sql`update profiles set is_admin = true where id = ${context.userId}`;
    return { ok: true as const };
  });

export const loadHq = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<HqSnapshot> => {
    const sql = await getSql();
    await requireHq(sql, context.userId);
    const num = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);

    const [humans, today, week, online, messages24h, reports] = await Promise.all([
      num(sql<{ n: number }>`select count(*)::int as n from profiles where coalesce(is_bot, false) = false`),
      num(
        sql<{ n: number }>`
          select count(*)::int as n from profiles
          where coalesce(is_bot, false) = false and created_at >= current_date
        `,
      ),
      num(
        sql<{ n: number }>`
          select count(*)::int as n from profiles
          where coalesce(is_bot, false) = false and created_at >= current_date - interval '6 days'
        `,
      ),
      num(
        sql<{ n: number }>`
          select count(*)::int as n from profiles
          where coalesce(is_bot, false) = false
            and banned_at is null
            and presence = 'online'
            and last_seen > now() - interval '10 minutes'
        `,
      ),
      num(
        sql<{ n: number }>`
          select count(*)::int as n from messages
          where created_at > now() - interval '24 hours'
            and sender_id not like 'bot-%'
        `,
      ),
      num(sql<{ n: number }>`select count(*)::int as n from reports`),
    ]);

    const days = await sql<HqDay>`
      select to_char(d::date, 'YYYY-MM-DD') as day, count(p.id)::int as n
      from generate_series(current_date - interval '13 days', current_date, interval '1 day') d
      left join profiles p
        on p.created_at::date = d::date and coalesce(p.is_bot, false) = false
      group by 1
      order by 1
    `;

    const zones = await sql<HqZone>`
      select coalesce(zone, 'other') as zone, count(*)::int as n
      from profiles
      where coalesce(is_bot, false) = false
      group by 1
      order by n desc
    `;

    const recentUsers = await sql.query<HqUser>(
      `select ${USER_COLS}
       from profiles p
       left join "user" u on u.id = p.id
       where coalesce(p.is_bot, false) = false
       order by p.created_at desc
       limit 80`,
    );

    const inbox = await sql<HqReport>`
      select r.id, r.reason, r.created_at,
        r.reporter_id, coalesce(a.display_name, 'gone') as reporter_name, coalesce(a.mxit_id, '') as reporter_mxit,
        r.target_id, coalesce(b.display_name, 'gone') as target_name, coalesce(b.mxit_id, '') as target_mxit
      from reports r
      left join profiles a on a.id = r.reporter_id
      left join profiles b on b.id = r.target_id
      order by r.created_at desc
      limit 40
    `;

    const [dau, wau, d1Eligible, d1Returned, claimedToday, gprsOn, smsOn, matchesN, chatted, friended, roomed] =
      await Promise.all([
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and banned_at is null and last_seen >= current_date
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and banned_at is null
              and last_seen >= current_date - interval '6 days'
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and created_at < current_date
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false
              and created_at < current_date
              and last_seen::date > created_at::date
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and last_daily_claim = current_date
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and coalesce(airtime_gprs, false) = true
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(*)::int as n from profiles
            where coalesce(is_bot, false) = false and coalesce(airtime_sms, false) = true
          `,
        ),
        num(sql<{ n: number }>`select count(*)::int as n from matches`),
        num(
          sql<{ n: number }>`
            select count(distinct p.id)::int as n
            from profiles p
            join messages m on m.sender_id = p.id
            where coalesce(p.is_bot, false) = false
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(distinct p.id)::int as n
            from profiles p
            join contacts c on c.status = 'accepted'
              and (c.requester_id = p.id or c.addressee_id = p.id)
            join profiles o on o.id = case when c.requester_id = p.id then c.addressee_id else c.requester_id end
            where coalesce(p.is_bot, false) = false and coalesce(o.is_bot, false) = false
          `,
        ),
        num(
          sql<{ n: number }>`
            select count(distinct p.id)::int as n
            from profiles p
            join messages m on m.sender_id = p.id and m.room_id is not null
            where coalesce(p.is_bot, false) = false
          `,
        ),
      ]);

    const msgDays = await sql<HqDay>`
      select to_char(d::date, 'YYYY-MM-DD') as day, count(m.id)::int as n
      from generate_series(current_date - interval '13 days', current_date, interval '1 day') d
      left join messages m
        on m.created_at::date = d::date and m.sender_id not like 'bot-%'
      group by 1
      order by 1
    `;

    const channels = await sql<HqMix>`
      select coalesce(channel, 'data') as k, count(*)::int as n
      from messages
      where created_at > now() - interval '7 days' and sender_id not like 'bot-%'
      group by 1
      order by n desc
    `;

    const kinds = await sql<HqMix>`
      select coalesce(kind, 'text') as k, count(*)::int as n
      from messages
      where created_at > now() - interval '7 days' and sender_id not like 'bot-%'
      group by 1
      order by n desc
    `;

    const roomStats = await sql<HqRoomStat>`
      select c.name, count(m.id)::int as n, count(distinct m.sender_id)::int as people
      from chatrooms c
      left join messages m on m.room_id = c.id
        and m.created_at > now() - interval '7 days'
        and m.sender_id not like 'bot-%'
      group by c.name
      order by n desc
    `;

    const gameStats = await sql<HqGameStat>`
      select game, count(*)::int as n,
        coalesce(sum(case when winner is not null then 1 else 0 end), 0)::int as done
      from matches
      group by game
      order by n desc
    `;

    const senders = await sql<HqSender>`
      select p.mxit_id, p.display_name, count(*)::int as n
      from messages m
      join profiles p on p.id = m.sender_id
      where m.created_at > now() - interval '7 days'
        and coalesce(p.is_bot, false) = false
      group by p.mxit_id, p.display_name
      order by n desc
      limit 8
    `;

    return {
      persist: dbSource === "neon" ? "neon" : "preview",
      humans,
      today,
      week,
      online,
      messages24h,
      reports,
      days,
      zones,
      recent: recentUsers,
      inbox,
      pulse: {
        dau,
        wau,
        d1Eligible,
        d1Returned,
        claimedToday,
        gprsOn,
        smsOn,
        matches: matchesN,
        msgDays,
        channels,
        kinds,
        rooms: roomStats,
        games: gameStats,
        senders,
        funnel: { signed: humans, chatted, friended, roomed },
      },
    };
  });

export const searchHq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((q: string) => q)
  .handler(async ({ context, data: raw }): Promise<HqUser[]> => {
    const sql = await getSql();
    await requireHq(sql, context.userId);
    const q = raw.trim().toLowerCase().replace(/^@/, "");
    if (q.length < 2) return [];
    const like = `%${q}%`;
    return sql.query<HqUser>(
      `select ${USER_COLS}
       from profiles p
       left join "user" u on u.id = p.id
       where coalesce(p.is_bot, false) = false
         and (
           lower(p.mxit_id) like $1
           or lower(p.display_name) like $1
           or lower(coalesce(u.email, '')) like $1
           or coalesce(p.phone, '') like $1
         )
       order by p.created_at desc
       limit 40`,
      [like],
    );
  });

export const setHqBan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; banned: boolean }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireHq(sql, context.userId);
    if (data.id === context.userId) throw new Error("You can't lock your own ID");
    const row = await sql<{ is_admin: boolean; is_bot: boolean }>`
      select coalesce(is_admin, false) as is_admin, coalesce(is_bot, false) as is_bot
      from profiles where id = ${data.id}
    `;
    if (!row[0] || row[0].is_bot) throw new Error("Not found");
    if (row[0].is_admin) throw new Error("Can't lock another HQ operator");
    if (data.banned) {
      await sql`update profiles set banned_at = now(), presence = 'offline' where id = ${data.id}`;
    } else {
      await sql`update profiles set banned_at = null where id = ${data.id}`;
    }
    return { ok: true as const };
  });

export const setHqAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; admin: boolean }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireHq(sql, context.userId);
    if (data.id === context.userId && !data.admin) throw new Error("You can't drop your own HQ key");
    const row = await sql<{ is_bot: boolean }>`
      select coalesce(is_bot, false) as is_bot from profiles where id = ${data.id}
    `;
    if (!row[0] || row[0].is_bot) throw new Error("Not found");
    if (!data.admin) {
      const others = await sql<{ n: number }>`
        select count(*)::int as n from profiles where is_admin = true and id <> ${data.id}
      `;
      if ((others[0]?.n ?? 0) < 1) throw new Error("Need at least one HQ operator");
    }
    await sql`update profiles set is_admin = ${data.admin} where id = ${data.id}`;
    return { ok: true as const };
  });

export const clearHqReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireHq(sql, context.userId);
    await sql`delete from reports where id = ${id}`;
    return { ok: true as const };
  });
