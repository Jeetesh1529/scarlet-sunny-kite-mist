import type { Sql } from "@/lib/db";

/** Server-only. Never import this from a client component. */
function ownerEmails(): Set<string> {
  return new Set(
    (process.env.HQ_OWNER_EMAIL ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function ownerKey(): string {
  const fromEnv = process.env.HQ_OWNER_KEY?.trim();
  if (fromEnv) return fromEnv;
  return "beharilal-qxio-hq";
}

export function emailIsOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return ownerEmails().has(email.trim().toLowerCase());
}

export function ownerKeyMatches(raw: string): boolean {
  const a = raw.trim();
  const b = ownerKey();
  if (!a || a.length !== b.length) return false;
  let ok = 0;
  for (let i = 0; i < a.length; i += 1) ok |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ok === 0;
}

export type HqInspect = { access: boolean; claimable: boolean };

export async function inspectHq(sql: Sql, userId: string): Promise<HqInspect> {
  const me = await sql<{
    is_admin: boolean;
    is_bot: boolean;
    banned_at: string | null;
    email: string | null;
  }>`
    select coalesce(p.is_admin, false) as is_admin,
           coalesce(p.is_bot, false) as is_bot,
           p.banned_at,
           u.email
    from profiles p
    left join "user" u on u.id = p.id
    where p.id = ${userId}
  `;
  if (!me[0] || me[0].is_bot || me[0].banned_at) return { access: false, claimable: false };
  if (me[0].is_admin) return { access: true, claimable: false };
  if (emailIsOwner(me[0].email)) {
    await sql`update profiles set is_admin = true where id = ${userId}`;
    return { access: true, claimable: false };
  }
  const admins = await sql<{ n: number }>`
    select count(*)::int as n from profiles where is_admin = true
  `;
  if ((admins[0]?.n ?? 0) > 0) return { access: false, claimable: false };
  return { access: false, claimable: true };
}

export async function requireHq(sql: Sql, userId: string): Promise<void> {
  const gate = await inspectHq(sql, userId);
  if (!gate.access) throw new Error("Unauthorized");
}
