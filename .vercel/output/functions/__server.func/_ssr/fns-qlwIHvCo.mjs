import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { c as nid, n as clipSms, o as getSql, p as toE164, t as authMiddleware } from "./sms-DtDe-rh6.mjs";
import { t as RESERVED_QXIO_IDS } from "./zones-D1zBMza4.mjs";
import { t as MOOLA_EXTRAS } from "./rates-DzKarHBy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-qlwIHvCo.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var BOT_IDS = [
	"bot-joe-banker",
	"bot-jade-ct",
	"bot-sipho",
	"bot-thandi",
	"bot-lurker",
	"bot-help"
];
function isBotId(id) {
	return id.startsWith("bot-");
}
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function botReply(botId, text, displayName) {
	const t = text.toLowerCase();
	if (botId === "bot-lurker") return Math.random() < .35 ? pick([
		"…",
		":|",
		"k",
		"seen"
	]) : null;
	if (botId === "bot-joe-banker") {
		if (/cost|price|free|charge|rate|sms|airtime/.test(t)) return pick([
			"Sending and receiving on QXio is free. Same as the GPRS days, only we don't even take 2 Moola for rooms.",
			"Chat is R0. Airtime SMS is QXio-free but your network may still charge ~80c — use data when you can.",
			"Moola is for extras: Skinz and Emoticards. Messages never spend it."
		]);
		if (/moola|money|coins|broke|gift/.test(t)) return pick([
			"Open Moola Hub from my portal — daily claim is free Moola :D Chat itself is already free.",
			"Gift friends from the contact list. Don't go broke on Skinz. Messages don't cost Moola.",
			"QX Post shop takes Moola for extras. Chat, rooms and games are free."
		]);
		if (/help|how|what|banker/.test(t)) return "I'm QX Banker. Tap my name on the contacts list → portal for Moola, apps and the bank. Chat is free.";
		return pick([
			`Sharp ${displayName}. Wallet looking healthy? Check Moola Hub — chat doesn't spend it.`,
			"Need cash? Daily claim + Moonbase raids. Don't tell the taxman.",
			"QX Post just restocked Skinz. Don't spend it all :D Messages stay free."
		]);
	}
	if (botId === "bot-help") {
		if (/install|ios|android|app store|iphone/.test(t)) return "On iPhone: Share → Add to Home Screen. On Android: browser menu → Install app. That's how QXio lives on your phone.";
		if (/chat|message/.test(t)) return "Tap a friend in Contacts, then the Chat soft-key. Send and receive is free — no Moola per message.";
		if (/cost|price|free|charge|rate/.test(t)) return "QXio chat is free on data. Rooms too. Airtime SMS is QXio R0 but the network may charge. Moola is only for Skinz and Emoticards.";
		if (/moola/.test(t)) return "Menu isn't needed — claim daily from the Contacts banner, or visit QX Banker. Chat doesn't spend Moola.";
		return pick([
			"Menu (bottom left) has Profile, Settings, Add contact and Logout.",
			"QX Post is the mall: rooms and games are free. Skinz and Emoticards cost Moola.",
			"Status is the round green dot on the soft-key bar. QX Mix is group chat.",
			"Stuck? Set your mood, add a friend by QXio ID, then Chat."
		]);
	}
	if (botId === "bot-jade-ct") {
		if (/howzit|heita|sharp|eita/.test(t)) return pick([
			"heita! howzit my bru :)",
			"sharp sharp from Sea Point",
			"eita — you good?"
		]);
		if (/ct|cape|town|mountain/.test(t)) return pick([
			"Table Mountain is out tonight :D",
			"wind is wild in the mother city again",
			"come through CT chatroom"
		]);
		return pick([
			`howzit ${displayName} :D missed this app`,
			"you on the old days too or is this your first life?",
			"drop a status before you log off :)",
			"Cape Town room is live if you want noise"
		]);
	}
	if (botId === "bot-sipho") {
		if (/game|moon|tic/.test(t)) return "Moonbase in QX Post. Don't send all your moonbuggies on raid 1.";
		return pick([
			"sharp my bru",
			"we should open a QX Mix later",
			"Jozi traffic is a personality at this point",
			`you good ${displayName}?`
		]);
	}
	if (botId === "bot-thandi") {
		if (/love|<3|miss/.test(t)) return "the 2007 chatrooms had a different kind of magic <3";
		return pick([
			"still can't believe this is back <3",
			"set your mood, it makes the list feel alive",
			"I keep a farewell message for logout. old habits.",
			`hey ${displayName} — you look online :)`
		]);
	}
	return pick([
		"heita :)",
		"lol",
		"sharp"
	]);
}
var seedJob = null;
var onboarded = /* @__PURE__ */ new Map();
async function ensureSeed(sql) {
	if (seedJob) return seedJob;
	seedJob = (async () => {
		await sql`
    insert into profiles (id, mxit_id, display_name, mood, mood_code, avatar_seed, presence, is_bot, moola, zone)
    values
      ('bot-joe-banker', 'joebanker', 'QX Banker', 'Need Moola? I got you :D', ':D', 'pixel-1', 'online', true, 9999, 'ct')
    on conflict (id) do nothing
  `;
	})().catch((e) => {
		seedJob = null;
		throw e;
	});
	return seedJob;
}
function pair(a, b) {
	return a < b ? [a, b] : [b, a];
}
function normalizeHandle(raw) {
	return raw.trim().toLowerCase();
}
function assertHandle(handle) {
	if (!/^[a-z0-9_]{3,20}$/.test(handle)) throw new Error("QXio ID: 3–20 chars, lowercase letters, numbers, underscores.");
	if (RESERVED_QXIO_IDS.has(handle)) throw new Error("That QXio ID is reserved — pick another");
}
async function suggestHandles(sql, base) {
	const year = (/* @__PURE__ */ new Date()).getFullYear().toString().slice(2);
	const candidates = [
		`${base}${Math.floor(10 + Math.random() * 89)}`,
		`${base}_ct`,
		`${base}_za`,
		`${base}${year}`,
		`the_${base}`
	].map((s) => s.slice(0, 20)).filter((s) => /^[a-z0-9_]{3,20}$/.test(s) && s !== base && !RESERVED_QXIO_IDS.has(s));
	const out = [];
	for (const c of candidates) {
		if (!(await sql`select id from profiles where lower(mxit_id) = ${c} limit 1`).length) out.push(c);
		if (out.length >= 3) break;
	}
	return out;
}
async function award(sql, userId, code) {
	await sql`
    insert into achievements (user_id, code) values (${userId}, ${code})
    on conflict (user_id, code) do nothing
  `;
}
async function credit(sql, userId, amount, reason) {
	await sql`update profiles set moola = moola + ${amount} where id = ${userId}`;
	await sql`
    insert into moola_tx (id, user_id, amount, reason)
    values (${nid()}, ${userId}, ${amount}, ${reason})
  `;
}
async function onboardIfNeeded(sql, userId) {
	const hit = onboarded.get(userId);
	if (hit) return hit;
	const job = (async () => {
		if ((await sql`select id from contacts where requester_id = ${userId} limit 1`).length) return;
		for (const bot of BOT_IDS) {
			await sql`
        insert into contacts (id, requester_id, addressee_id, status)
        values (${nid()}, ${userId}, ${bot}, 'accepted')
        on conflict (requester_id, addressee_id) do nothing
      `;
			const [a, b] = pair(userId, bot);
			let convId = (await sql`
        insert into conversations (id, user_a, user_b)
        values (${nid()}, ${a}, ${b})
        on conflict (user_a, user_b) do nothing
        returning id
      `)[0]?.id;
			if (!convId) convId = (await sql`select id from conversations where user_a = ${a} and user_b = ${b}`)[0]?.id;
			if (!convId) continue;
			const hello = bot === "bot-joe-banker" ? `Welcome to QXio :D Chat is free — send and receive never spends Moola. ${MOOLA_EXTRAS.welcome} Moola is in your wallet for extras. Tap me for QX Banker, or claim daily from Contacts.` : bot === "bot-jade-ct" ? "heita! JADE from CT. Add me, drop a status, come hang in the Cape Town room :)" : bot === "bot-help" ? "Need the tour? Menu → Help, or just ask. On iPhone use Add to Home Screen to install." : bot === "bot-thandi" ? "hey — it's so good this is back <3 set your mood in the title bar" : bot === "bot-sipho" ? "sharp my bru. QX Post has Moonbase if you're bored." : "…";
			await sql`
        insert into messages (id, conversation_id, sender_id, content, delivery, kind)
        values (${nid()}, ${convId}, ${bot}, ${hello}, 'sent', 'text')
      `;
		}
		const rooms = await sql`select id from chatrooms`;
		for (const r of rooms) await sql`
        insert into room_members (room_id, user_id) values (${r.id}, ${userId})
        on conflict (room_id, user_id) do nothing
      `;
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
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "eb92d1e5aafe9d1dd1ebf669b742dca9d17f4232d8e1ac3c45d63a59c5cd2d80",
	name: "getMyProfile",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const rows = await sql`select * from profiles where id = ${context.userId}`;
	if (rows[0] && !rows[0].is_bot) await onboardIfNeeded(sql, context.userId);
	return rows[0] ?? null;
});
var checkMxitId_createServerFn_handler = createServerRpc({
	id: "3ae6a2bfa12af92332c86a202ab6be7ccea768e28cf7f233158f44d2ddeb4ef9",
	name: "checkMxitId",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => checkMxitId.__executeServer(opts));
var checkMxitId = createServerFn({ method: "POST" }).validator((raw) => raw).handler(checkMxitId_createServerFn_handler, async ({ data: raw }) => {
	const handle = normalizeHandle(raw);
	if (!handle) return {
		ok: false,
		reason: "required",
		suggestions: []
	};
	if (!/^[a-z0-9_]{3,20}$/.test(handle)) return {
		ok: false,
		reason: "format",
		suggestions: []
	};
	if (RESERVED_QXIO_IDS.has(handle)) return {
		ok: false,
		reason: "reserved",
		suggestions: await suggestHandles(await getSql(), handle)
	};
	const sql = await getSql();
	if ((await sql`select id from profiles where lower(mxit_id) = ${handle} limit 1`).length) return {
		ok: false,
		reason: "taken",
		suggestions: await suggestHandles(sql, handle)
	};
	return {
		ok: true,
		reason: "available",
		suggestions: []
	};
});
var createProfile_createServerFn_handler = createServerRpc({
	id: "6698db258ed2c3aba8b021790559e72615e9920ecbf95f8578de71b4a5c589c5",
	name: "createProfile",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => createProfile.__executeServer(opts));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const handle = normalizeHandle(data.mxitId);
	assertHandle(handle);
	if (!data.displayName.trim()) throw new Error("Pick a display name");
	if ((await sql`select id from profiles where id = ${context.userId}`).length) throw new Error("You already have a QXio ID — IDs can't be changed");
	if ((await sql`select id from profiles where lower(mxit_id) = ${handle}`).length) {
		const suggestions = await suggestHandles(sql, handle);
		throw new Error(suggestions.length ? `That QXio ID is taken. Try ${suggestions.join(", ")}` : "That QXio ID is taken — pick another");
	}
	const zone = data.zone && [
		"ct",
		"jhb",
		"dbn",
		"pta",
		"pe",
		"other"
	].includes(data.zone) ? data.zone : "ct";
	const moodCode = data.moodCode?.trim() || ":)";
	const phone = data.phone ? toE164(data.phone) : null;
	if (data.phone && data.phone.trim() && !phone) throw new Error("Cell number doesn't look right (use 082… or +27…)");
	try {
		await sql`
        insert into profiles (id, mxit_id, display_name, mood, mood_code, avatar_seed, age, gender, moola, zone, phone, airtime_sms)
        values (
          ${context.userId},
          ${handle},
          ${data.displayName.trim()},
          ${data.mood?.trim() || "Hey there! I'm on QXio."},
          ${moodCode},
          ${data.avatarSeed || "pixel-0"},
          ${data.age ?? null},
          ${data.gender || null},
          0,
          ${zone},
          ${phone},
          false
        )
      `;
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		if (/unique|duplicate|23505/i.test(msg)) {
			if (/phone/i.test(msg)) throw new Error("That cell number is already linked to a QXio ID");
			throw new Error("That QXio ID is taken — pick another");
		}
		throw e;
	}
	await credit(sql, context.userId, MOOLA_EXTRAS.welcome, "Welcome bonus");
	await onboardIfNeeded(sql, context.userId);
	return (await sql`select * from profiles where id = ${context.userId}`)[0];
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "94009ed2dbef6c1d96bcc0f0cff78329f0be5c66514953862c0a0ff8553e9573",
	name: "updateProfile",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const cur = await sql`select * from profiles where id = ${context.userId}`;
	if (!cur[0]) throw new Error("No profile");
	const p = cur[0];
	const zone = data.zone && [
		"ct",
		"jhb",
		"dbn",
		"pta",
		"pe",
		"other"
	].includes(String(data.zone)) ? String(data.zone) : p.zone;
	let phone = p.phone;
	if (data.phone !== void 0) {
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
        mood = ${data.mood !== void 0 ? data.mood : p.mood},
        mood_code = ${data.mood_code !== void 0 ? data.mood_code : p.mood_code},
        avatar_seed = ${data.avatar_seed ?? p.avatar_seed},
        farewell = ${data.farewell !== void 0 ? data.farewell : p.farewell},
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
        last_seen = now()
      where id = ${context.userId}
    `;
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		if (/unique|duplicate|23505|phone/i.test(msg)) throw new Error("That cell number is already linked to a QXio ID");
		throw e;
	}
	return (await sql`select * from profiles where id = ${context.userId}`)[0];
});
var listContacts_createServerFn_handler = createServerRpc({
	id: "06cca0ecd00fe5d6cf1b4c22de6879f0e5a601324fae3f77185e187d6ea6c257",
	name: "listContacts",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listContacts.__executeServer(opts));
var listContacts = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(listContacts_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await onboardIfNeeded(sql, context.userId);
	const rows = await sql`
      select c.id, c.status, c.requester_id, c.addressee_id, coalesce(c.pinned, false) as pinned,
        p.id as other_id, p.mxit_id, p.display_name, p.mood, p.mood_code,
        p.avatar_seed, p.avatar_url, p.presence, p.is_bot, coalesce(p.zone, 'ct') as zone,
        p.phone, conv.id as conversation_id
      from contacts c
      join profiles p on p.id = case when c.requester_id = ${context.userId} then c.addressee_id else c.requester_id end
      left join conversations conv
        on conv.user_a = least(c.requester_id, c.addressee_id)
       and conv.user_b = greatest(c.requester_id, c.addressee_id)
      where c.requester_id = ${context.userId} or c.addressee_id = ${context.userId}
      order by coalesce(c.pinned, false) desc, p.display_name
    `;
	const lastMsgs = await sql`
      select distinct on (other_id)
        case when conv.user_a = ${context.userId} then conv.user_b else conv.user_a end as other_id,
        m.content, m.created_at
      from messages m
      join conversations conv on conv.id = m.conversation_id
      where conv.user_a = ${context.userId} or conv.user_b = ${context.userId}
      order by other_id, m.created_at desc
    `;
	const lastMap = new Map(lastMsgs.map((m) => [m.other_id, m]));
	const unread = await sql`
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
	return rows.map((r) => {
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
				phone: r.phone
			}
		};
	});
});
var pinContact_createServerFn_handler = createServerRpc({
	id: "293e4b4a5164204cc88eb3faf592b07138dc80e28235c517e4318e7cdf1f8d93",
	name: "pinContact",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => pinContact.__executeServer(opts));
var pinContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(pinContact_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const row = await sql`
      select id, requester_id, addressee_id from contacts where id = ${data.id}
    `;
	if (!row[0] || row[0].requester_id !== context.userId && row[0].addressee_id !== context.userId) throw new Error("Not found");
	await sql`update contacts set pinned = ${data.pinned} where id = ${data.id}`;
	return {
		ok: true,
		pinned: data.pinned
	};
});
var addContact_createServerFn_handler = createServerRpc({
	id: "6c9454e3fc275dd1afe7199eac1fca6cd4edfa51a79544910192500b43e1b2f9",
	name: "addContact",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => addContact.__executeServer(opts));
var addContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((mxitId) => mxitId.trim().toLowerCase()).handler(addContact_createServerFn_handler, async ({ context, data: mxitId }) => {
	const sql = await getSql();
	const found = await sql`select * from profiles where lower(mxit_id) = ${mxitId}`;
	if (!found[0]) throw new Error("No QXio user with that ID");
	if (found[0].id === context.userId) throw new Error("That's you");
	const otherId = found[0].id;
	const existing = await sql`
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
var respondContact_createServerFn_handler = createServerRpc({
	id: "e00b116c6992180687d977867e884de9d80667851caa61a442000206a8b815da",
	name: "respondContact",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => respondContact.__executeServer(opts));
var respondContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(respondContact_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const row = await sql`
      select id, requester_id, addressee_id from contacts where id = ${data.id}
    `;
	if (!row[0] || row[0].requester_id !== context.userId && row[0].addressee_id !== context.userId) throw new Error("Not found");
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
var searchUsers_createServerFn_handler = createServerRpc({
	id: "79afb658a35e97f8e96cf1cd8ebc3dd11fd3e361bbea5bd97b54a36fb68f0928",
	name: "searchUsers",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => searchUsers.__executeServer(opts));
var searchUsers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((q) => q.trim().toLowerCase()).handler(searchUsers_createServerFn_handler, async ({ context, data: q }) => {
	if (q.length < 2) return [];
	const sql = await getSql();
	const like = `%${q}%`;
	return sql`
      select p.id, p.mxit_id, p.display_name, p.mood, p.mood_code, p.avatar_seed, p.presence, p.is_bot,
        coalesce(p.zone, 'ct') as zone, 'none' as contact_status
      from profiles p
      where p.id <> ${context.userId}
        and (p.mxit_id like ${like} or lower(p.display_name) like ${like})
      order by p.is_bot desc, p.display_name
      limit 20
    `;
});
var getPublicProfile_createServerFn_handler = createServerRpc({
	id: "0d93d6e3926f98ca3e7cd5d764e402baff16e96340af4584e89ea1816e3e6ac1",
	name: "getPublicProfile",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => getPublicProfile.__executeServer(opts));
var getPublicProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((mxitId) => mxitId).handler(getPublicProfile_createServerFn_handler, async ({ context, data: mxitId }) => {
	const sql = await getSql();
	const rows = await sql`select * from profiles where lower(mxit_id) = ${mxitId.toLowerCase()}`;
	if (!rows[0]) return null;
	const p = rows[0];
	const rel = await sql`
      select requester_id, addressee_id, status from contacts
      where (requester_id = ${context.userId} and addressee_id = ${p.id})
         or (requester_id = ${p.id} and addressee_id = ${context.userId})
    `;
	let contact_status = "none";
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
		contact_status
	};
});
var openChat_createServerFn_handler = createServerRpc({
	id: "a2c7031aadb548e51653f2e0d1fcecd3b48f3e3a9dba230d3bfa4d687a8736b4",
	name: "openChat",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => openChat.__executeServer(opts));
var openChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((otherId) => otherId).handler(openChat_createServerFn_handler, async ({ context, data: otherId }) => {
	const sql = await getSql();
	const [a, b] = pair(context.userId, otherId);
	await sql`
      insert into conversations (id, user_a, user_b)
      values (${nid()}, ${a}, ${b})
      on conflict (user_a, user_b) do nothing
    `;
	return { id: (await sql`select id from conversations where user_a = ${a} and user_b = ${b}`)[0].id };
});
async function maybeFlushBotReply(sql, convId, userId, otherId) {
	if (!isBotId(otherId)) return;
	const last = await sql`
    select sender_id, content, created_at from messages
    where conversation_id = ${convId}
    order by created_at desc limit 1
  `;
	if (!last[0] || last[0].sender_id !== userId) return;
	if (Date.now() - new Date(last[0].created_at).getTime() < 550) return;
	const me = await sql`select display_name from profiles where id = ${userId}`;
	const reply = botReply(otherId, last[0].content, me[0]?.display_name ?? "you");
	if (!reply) return;
	await sql`
    insert into messages (id, conversation_id, sender_id, content, delivery, kind)
    values (${nid()}, ${convId}, ${otherId}, ${reply}, 'sent', 'text')
  `;
	await sql`update conversations set last_message_at = now() where id = ${convId}`;
}
async function convTyping(sql, convId, userId, otherId) {
	if (isBotId(otherId)) {
		const last = await sql`
      select sender_id, created_at from messages
      where conversation_id = ${convId}
      order by created_at desc limit 1
    `;
		if (last[0] && last[0].sender_id === userId) {
			if (Date.now() - new Date(last[0].created_at).getTime() < 2200) return true;
		}
	}
	return (await sql`
    select user_id from typing
    where conversation_id = ${convId}
      and user_id <> ${userId}
      and updated_at > now() - interval '4 seconds'
  `).length > 0;
}
var loadConversation_createServerFn_handler = createServerRpc({
	id: "9a29a0c1a02fe123d2e3a7ca14f3f0ff97a5e5d484b0b4d62e450870d98c1576",
	name: "loadConversation",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => loadConversation.__executeServer(opts));
var loadConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((convId) => convId).handler(loadConversation_createServerFn_handler, async ({ context, data: convId }) => {
	const sql = await getSql();
	const conv = await sql`
      select id, user_a, user_b from conversations where id = ${convId}
    `;
	if (!conv[0] || conv[0].user_a !== context.userId && conv[0].user_b !== context.userId) throw new Error("Conversation not found");
	const otherId = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;
	await maybeFlushBotReply(sql, convId, context.userId, otherId);
	const other = await sql`
      select id, mxit_id, display_name, mood, mood_code, avatar_seed, avatar_url, presence, is_bot, coalesce(zone, 'ct') as zone, phone
      from profiles where id = ${otherId}
    `;
	if ((await sql`
      select m.id from messages m
      join profiles me on me.id = ${context.userId}
      where m.conversation_id = ${convId}
        and m.sender_id <> ${context.userId}
        and m.delivery <> 'read'
        and me.read_receipts is not false
      limit 1
    `).length) await sql`
        update messages set delivery = 'read'
        where conversation_id = ${convId} and sender_id <> ${context.userId} and delivery <> 'read'
      `;
	const messages = await sql`
      select * from (
        select m.id, m.sender_id, m.content, m.delivery, m.created_at,
          coalesce(m.kind, 'text') as kind, m.media, coalesce(m.channel, 'data') as channel,
          p.display_name as sender_name, p.avatar_seed as sender_seed
        from messages m
        join profiles p on p.id = m.sender_id
        where m.conversation_id = ${convId}
        order by m.created_at desc
        limit 80
      ) t order by created_at
    `;
	const typing = await convTyping(sql, convId, context.userId, otherId);
	return {
		id: convId,
		other: other[0],
		messages,
		typing
	};
});
var pollConversation_createServerFn_handler = createServerRpc({
	id: "ff6aa89f6b17e19df193caea7d944ec2b7ed5aef0814a79ce2483e3161b801d7",
	name: "pollConversation",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => pollConversation.__executeServer(opts));
var pollConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(pollConversation_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const conv = await sql`
      select id, user_a, user_b from conversations where id = ${data.convId}
    `;
	if (!conv[0] || conv[0].user_a !== context.userId && conv[0].user_b !== context.userId) throw new Error("Conversation not found");
	const otherId = conv[0].user_a === context.userId ? conv[0].user_b : conv[0].user_a;
	await maybeFlushBotReply(sql, data.convId, context.userId, otherId);
	let messages = [];
	if (data.afterId) messages = await sql`
        select m.id, m.sender_id, m.content, m.delivery, m.created_at,
          coalesce(m.kind, 'text') as kind, m.media, coalesce(m.channel, 'data') as channel,
          p.display_name as sender_name, p.avatar_seed as sender_seed
        from messages m
        join profiles p on p.id = m.sender_id
        where m.conversation_id = ${data.convId}
          and m.id <> ${data.afterId}
          and m.created_at >= coalesce((select created_at from messages where id = ${data.afterId}), 'epoch'::timestamptz)
        order by m.created_at
        limit 40
      `;
	const typing = await convTyping(sql, data.convId, context.userId, otherId);
	return {
		messages,
		typing
	};
});
var sendDirect_createServerFn_handler = createServerRpc({
	id: "6df0be92c14a93a7f014aade1987a161704f06621ef6b9300c8659357099d9e2",
	name: "sendDirect",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => sendDirect.__executeServer(opts));
var sendDirect = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(sendDirect_createServerFn_handler, async ({ context, data }) => {
	const channel = data.channel === "sms" ? "sms" : "data";
	if (channel === "sms" && data.kind && data.kind !== "text") throw new Error("Airtime SMS is text only — no pictures or files");
	const kind = channel === "sms" ? "text" : data.kind === "image" || data.kind === "voice" ? data.kind : "text";
	let content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
	if (kind === "text" && !content) throw new Error("Empty");
	if (channel === "sms") {
		if (content.length > 160) content = clipSms(content);
		if (data.media) throw new Error("Airtime SMS is text only");
	}
	if (content.length > 2e3) throw new Error("Too long");
	if (data.media && data.media.length > 45e4) throw new Error("File too large");
	const sql = await getSql();
	const conv = await sql`
      select user_a, user_b from conversations where id = ${data.convId}
    `;
	if (!conv[0] || conv[0].user_a !== context.userId && conv[0].user_b !== context.userId) throw new Error("Conversation not found");
	await sql`
      insert into messages (id, conversation_id, sender_id, content, delivery, kind, media, channel)
      values (${nid()}, ${data.convId}, ${context.userId}, ${content}, 'sent', ${kind}, ${channel === "sms" ? null : data.media || null}, ${channel})
    `;
	await sql`update conversations set last_message_at = now() where id = ${data.convId}`;
	await sql`delete from typing where conversation_id = ${data.convId} and user_id = ${context.userId}`;
	return (await sql`
      select id, sender_id, content, delivery, created_at, coalesce(kind, 'text') as kind, media, coalesce(channel, 'data') as channel
      from messages where conversation_id = ${data.convId} and sender_id = ${context.userId}
      order by created_at desc limit 1
    `)[0];
});
var setTyping_createServerFn_handler = createServerRpc({
	id: "d3f9b4aa60927aa7023f99c0e0f02b1c509973dda89294ac5fa03ceaf2c6d10d",
	name: "setTyping",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => setTyping.__executeServer(opts));
var setTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((convId) => convId).handler(setTyping_createServerFn_handler, async ({ context, data: convId }) => {
	const sql = await getSql();
	const conv = await sql`
      select user_a, user_b from conversations where id = ${convId}
    `;
	if (!conv[0] || conv[0].user_a !== context.userId && conv[0].user_b !== context.userId) return { ok: false };
	await sql`
      insert into typing (conversation_id, user_id, updated_at)
      values (${convId}, ${context.userId}, now())
      on conflict (conversation_id, user_id) do update set updated_at = now()
    `;
	return { ok: true };
});
var listRooms_createServerFn_handler = createServerRpc({
	id: "1085afd111f7bb6d359c838cf1c0bf86b2f31db513cc36401377e4ddcceb78c6",
	name: "listRooms",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listRooms.__executeServer(opts));
var listRooms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRooms_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await onboardIfNeeded(sql, context.userId);
	return sql`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count
      from chatrooms r
      order by r.name
    `;
});
var loadRoom_createServerFn_handler = createServerRpc({
	id: "3a7e3923a58d5cff650c8582a0478d3f713595f7b6759084945ad668732f7c1e",
	name: "loadRoom",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => loadRoom.__executeServer(opts));
var loadRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((roomId) => roomId).handler(loadRoom_createServerFn_handler, async ({ context, data: roomId }) => {
	const sql = await getSql();
	const room = await sql`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count
      from chatrooms r where r.id = ${roomId}
    `;
	if (!room[0]) throw new Error("Room not found");
	await sql`
      insert into room_members (room_id, user_id) values (${roomId}, ${context.userId})
      on conflict (room_id, user_id) do nothing
    `;
	const messages = await sql`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m
      join profiles p on p.id = m.sender_id
      where m.room_id = ${roomId}
      order by m.created_at
      limit 200
    `;
	return {
		room: room[0],
		messages
	};
});
var sendRoom_createServerFn_handler = createServerRpc({
	id: "23c8abab4cf699b5099c0fa4d5e51887bd83b177730fdefbdfbf67e4f86774c0",
	name: "sendRoom",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => sendRoom.__executeServer(opts));
var sendRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(sendRoom_createServerFn_handler, async ({ context, data }) => {
	const kind = data.kind === "image" || data.kind === "voice" ? data.kind : "text";
	const content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
	if (kind === "text" && !content) throw new Error("Empty");
	const sql = await getSql();
	await sql`
      insert into messages (id, room_id, sender_id, content, kind, media)
      values (${nid()}, ${data.roomId}, ${context.userId}, ${content}, ${kind}, ${data.media || null})
    `;
	if (Math.random() < .45 && kind === "text") {
		const bot = BOT_IDS[Math.floor(Math.random() * BOT_IDS.length)];
		const reply = botReply(bot, content, (await sql`select display_name from profiles where id = ${context.userId}`)[0]?.display_name ?? "you");
		if (reply) await sql`
          insert into messages (id, room_id, sender_id, content, kind)
          values (${nid()}, ${data.roomId}, ${bot}, ${reply}, 'text')
        `;
	}
	const room = await sql`
      select r.id, r.name, r.topic, r.is_official,
        (select count(*)::int from room_members m where m.room_id = r.id) as member_count
      from chatrooms r where r.id = ${data.roomId}
    `;
	const messages = await sql`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m
      join profiles p on p.id = m.sender_id
      where m.room_id = ${data.roomId}
      order by m.created_at
      limit 200
    `;
	return {
		room: room[0],
		messages
	};
});
var listGroups_createServerFn_handler = createServerRpc({
	id: "7a4a2c8af1810302d2fc9dc40448bd806d8a007cc831e1eae536a6fb7785335a",
	name: "listGroups",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listGroups.__executeServer(opts));
var listGroups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listGroups_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g
      join multimx_members mm on mm.group_id = g.id
      where mm.user_id = ${context.userId}
      order by g.created_at desc
    `;
});
var createGroup_createServerFn_handler = createServerRpc({
	id: "5615440b4d5d6704614f9afbd9151c1409844281dd8a2c85dad32d5e490240d6",
	name: "createGroup",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => createGroup.__executeServer(opts));
var createGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createGroup_createServerFn_handler, async ({ context, data }) => {
	const name = data.name.trim();
	if (!name) throw new Error("Name required");
	const sql = await getSql();
	const id = nid();
	await sql`insert into multimx_groups (id, name, owner_id) values (${id}, ${name}, ${context.userId})`;
	const members = Array.from(/* @__PURE__ */ new Set([context.userId, ...data.memberIds]));
	for (const uid of members) await sql`insert into multimx_members (group_id, user_id) values (${id}, ${uid}) on conflict do nothing`;
	await sql`
      insert into messages (id, group_id, sender_id, content, kind)
      values (${nid()}, ${id}, ${context.userId}, ${`created QX Mix "${name}"`}, 'text')
    `;
	return { id };
});
var loadGroup_createServerFn_handler = createServerRpc({
	id: "94cc902986e0ac987c6a147aa7bf88be6630184ea844ee2eab006ff8f73c08c8",
	name: "loadGroup",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => loadGroup.__executeServer(opts));
var loadGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((groupId) => groupId).handler(loadGroup_createServerFn_handler, async ({ context, data: groupId }) => {
	const sql = await getSql();
	if (!(await sql`
      select user_id from multimx_members where group_id = ${groupId} and user_id = ${context.userId}
    `)[0]) throw new Error("Not a member");
	const g = await sql`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g where g.id = ${groupId}
    `;
	const messages = await sql`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m join profiles p on p.id = m.sender_id
      where m.group_id = ${groupId}
      order by m.created_at
    `;
	return {
		group: g[0],
		messages
	};
});
var sendGroup_createServerFn_handler = createServerRpc({
	id: "1ad5278982ddc3d7a28e874b914ae42ab1e341d77f8eea1de62ad8c72b76b1f6",
	name: "sendGroup",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => sendGroup.__executeServer(opts));
var sendGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(sendGroup_createServerFn_handler, async ({ context, data }) => {
	const kind = data.kind === "image" || data.kind === "voice" ? data.kind : "text";
	const content = (data.content || "").trim() || (kind === "image" ? "📷 photo" : kind === "voice" ? "🎤 voice note" : "");
	if (kind === "text" && !content) throw new Error("Empty");
	const sql = await getSql();
	await sql`
      insert into messages (id, group_id, sender_id, content, kind, media)
      values (${nid()}, ${data.groupId}, ${context.userId}, ${content}, ${kind}, ${data.media || null})
    `;
	const g = await sql`
      select g.id, g.name, g.owner_id, g.created_at,
        (select count(*)::int from multimx_members m where m.group_id = g.id) as member_count
      from multimx_groups g where g.id = ${data.groupId}
    `;
	const messages = await sql`
      select m.id, m.sender_id, m.content, m.delivery, m.created_at,
        p.display_name as sender_name, p.avatar_seed as sender_seed,
        coalesce(m.kind, 'text') as kind, m.media
      from messages m join profiles p on p.id = m.sender_id
      where m.group_id = ${data.groupId}
      order by m.created_at
    `;
	return {
		group: g[0],
		messages
	};
});
var listStatuses_createServerFn_handler = createServerRpc({
	id: "139960cd0f380d9186a977f495ff6a7cda165747848b842377ea51279cb65b3f",
	name: "listStatuses",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listStatuses.__executeServer(opts));
var listStatuses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStatuses_createServerFn_handler, async () => {
	return (await getSql())`
      select s.id, s.author_id, s.caption, s.background, s.created_at, s.expires_at,
        p.display_name as author_name, p.avatar_seed as author_seed,
        (select count(*)::int from status_views v where v.status_id = s.id) as views
      from statuses s
      join profiles p on p.id = s.author_id
      where s.expires_at > now()
      order by s.created_at desc
    `;
});
var postStatus_createServerFn_handler = createServerRpc({
	id: "8c92ef4cf93227337cee9f6fef93d717480ed8db5a101152269ae003e36a78f3",
	name: "postStatus",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => postStatus.__executeServer(opts));
var postStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(postStatus_createServerFn_handler, async ({ context, data }) => {
	const caption = data.caption.trim();
	if (!caption) throw new Error("Write something");
	const sql = await getSql();
	await sql`
      insert into statuses (id, author_id, caption, background, expires_at)
      values (${nid()}, ${context.userId}, ${caption}, ${data.background}, now() + interval '24 hours')
    `;
	await award(sql, context.userId, "status");
	return { ok: true };
});
var viewStatus_createServerFn_handler = createServerRpc({
	id: "89e901fedf9111308afaa439e9a79be1580076ef9fea9c49a27674a38ca5d383",
	name: "viewStatus",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => viewStatus.__executeServer(opts));
var viewStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((statusId) => statusId).handler(viewStatus_createServerFn_handler, async ({ context, data: statusId }) => {
	await (await getSql())`
      insert into status_views (status_id, viewer_id)
      values (${statusId}, ${context.userId})
      on conflict do nothing
    `;
	return { ok: true };
});
var claimDaily_createServerFn_handler = createServerRpc({
	id: "c0ab006c8d6764dc167f874a391f793043c5b44c4c75b2b6e5182f9535defdfa",
	name: "claimDaily",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => claimDaily.__executeServer(opts));
var claimDaily = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimDaily_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const p = await sql`select * from profiles where id = ${context.userId}`;
	if (!p[0]) throw new Error("No profile");
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const claimed = String(p[0].last_daily_claim ?? "").slice(0, 10);
	if (claimed === today) throw new Error("Already claimed today");
	const streak = claimed === (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10) ? p[0].streak_days + 1 : 1;
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
	return {
		profile: (await sql`select * from profiles where id = ${context.userId}`)[0],
		amount,
		streak
	};
});
var giftMoola_createServerFn_handler = createServerRpc({
	id: "71fa88dd40bf45611e4ec01f0f04790564e280f5ac399f799403d842b7caa0cb",
	name: "giftMoola",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => giftMoola.__executeServer(opts));
var giftMoola = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(giftMoola_createServerFn_handler, async ({ context, data }) => {
	const amount = Math.floor(data.amount);
	if (amount < 1) throw new Error("Invalid amount");
	const sql = await getSql();
	const me = await sql`select * from profiles where id = ${context.userId}`;
	if (!me[0] || me[0].moola < amount) throw new Error("Not enough Moola");
	await sql`update profiles set moola = moola - ${amount} where id = ${context.userId}`;
	await sql`update profiles set moola = moola + ${amount} where id = ${data.otherId}`;
	await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-amount}, ${"Gift sent"})`;
	await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${data.otherId}, ${amount}, ${"Gift received"})`;
	const [a, b] = pair(context.userId, data.otherId);
	await sql`insert into conversations (id, user_a, user_b) values (${nid()}, ${a}, ${b}) on conflict do nothing`;
	const conv = await sql`select id from conversations where user_a = ${a} and user_b = ${b}`;
	if (conv[0]) await sql`
        insert into messages (id, conversation_id, sender_id, content, kind)
        values (${nid()}, ${conv[0].id}, ${context.userId}, ${`sent you ${amount} Moola (greedy)`}, 'text')
      `;
	return (await sql`select * from profiles where id = ${context.userId}`)[0];
});
var spendMoola_createServerFn_handler = createServerRpc({
	id: "8bfa05c50e438d791a61cc8e241d3099f7e338cd8ac68774788b805e9ed9678b",
	name: "spendMoola",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => spendMoola.__executeServer(opts));
var spendMoola = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(spendMoola_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await sql`select * from profiles where id = ${context.userId}`;
	if (!me[0] || me[0].moola < data.amount) throw new Error("Not enough Moola");
	await sql`update profiles set moola = moola - ${data.amount} where id = ${context.userId}`;
	await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-data.amount}, ${data.reason})`;
	return (await sql`select * from profiles where id = ${context.userId}`)[0];
});
var buyEmoticard_createServerFn_handler = createServerRpc({
	id: "2eada6da236d926369de4493732d6e74aa75fadd5229722e27b2dea82314bcfa",
	name: "buyEmoticard",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => buyEmoticard.__executeServer(opts));
var buyEmoticard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code).handler(buyEmoticard_createServerFn_handler, async ({ context, data: code }) => {
	const sql = await getSql();
	const key = `emo:${code}`;
	if ((await sql`
      select code from achievements where user_id = ${context.userId} and code = ${key}
    `).length) return { already: true };
	const me = await sql`select * from profiles where id = ${context.userId}`;
	if (!me[0] || me[0].moola < MOOLA_EXTRAS.emoticard) throw new Error(`Need ${MOOLA_EXTRAS.emoticard} Moola`);
	await sql`update profiles set moola = moola - ${MOOLA_EXTRAS.emoticard} where id = ${context.userId}`;
	await sql`insert into moola_tx (id, user_id, amount, reason) values (${nid()}, ${context.userId}, ${-MOOLA_EXTRAS.emoticard}, ${`Emoticard ${code}`})`;
	await award(sql, context.userId, key);
	return { already: false };
});
var listMoola_createServerFn_handler = createServerRpc({
	id: "c9291c34a6aa12eb467a29550bcb049d30a4fc18eaa438d26401b5eb3d17c235",
	name: "listMoola",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listMoola.__executeServer(opts));
var listMoola = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMoola_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, amount, reason, created_at from moola_tx
      where user_id = ${context.userId}
      order by created_at desc limit 40
    `;
});
var listConfessions_createServerFn_handler = createServerRpc({
	id: "e9f88b7551aa38f048b414750ca6224d17f681a1964a28da9ea455b713ff3f67",
	name: "listConfessions",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listConfessions.__executeServer(opts));
var listConfessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listConfessions_createServerFn_handler, async () => {
	return (await getSql())`
      select id, body, hearts, created_at from confessions order by created_at desc limit 50
    `;
});
var postConfession_createServerFn_handler = createServerRpc({
	id: "bad39e308a92fb4d89425cc45c60e2651d59e9063590691d807688f77773ade2",
	name: "postConfession",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => postConfession.__executeServer(opts));
var postConfession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((body) => body.trim()).handler(postConfession_createServerFn_handler, async ({ context, data: body }) => {
	if (body.length < 8) throw new Error("A bit short");
	await (await getSql())`
      insert into confessions (id, author_id, body) values (${nid()}, ${context.userId}, ${body})
    `;
	return { ok: true };
});
var heartConfession_createServerFn_handler = createServerRpc({
	id: "83ba845a1017017f3ee68eefad2a98bd708e7500b6def5b3eff4505106654ab0",
	name: "heartConfession",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => heartConfession.__executeServer(opts));
var heartConfession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(heartConfession_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	if ((await sql`
      insert into confession_hearts (confession_id, user_id)
      values (${id}, ${context.userId})
      on conflict do nothing
      returning confession_id
    `)[0]) await sql`update confessions set hearts = hearts + 1 where id = ${id}`;
	return { ok: true };
});
var listPolls_createServerFn_handler = createServerRpc({
	id: "b52119a3aef1b0f73624e3447877d5cf2354e28f2d8c93e78303f1628c68621d",
	name: "listPolls",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => listPolls.__executeServer(opts));
var listPolls = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPolls_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const polls = await sql`select id, question, options from polls`;
	const votes = await sql`
      select poll_id, option_idx, count(*)::int as n from poll_votes group by poll_id, option_idx
    `;
	const mine = await sql`
      select poll_id, option_idx from poll_votes where user_id = ${context.userId}
    `;
	const mineMap = new Map(mine.map((m) => [m.poll_id, m.option_idx]));
	return polls.map((p) => {
		const options = JSON.parse(p.options);
		const counts = options.map((_, i) => votes.find((v) => v.poll_id === p.id && v.option_idx === i)?.n ?? 0);
		return {
			id: p.id,
			question: p.question,
			options,
			votes: counts,
			my_vote: mineMap.get(p.id) ?? null
		};
	});
});
var votePoll_createServerFn_handler = createServerRpc({
	id: "25fa3bc3d9240c15e1f8e81f3ab49f960a12625ff0cf4e8a2eb348edc7e6d3f7",
	name: "votePoll",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => votePoll.__executeServer(opts));
var votePoll = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(votePoll_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into poll_votes (poll_id, user_id, option_idx)
      values (${data.pollId}, ${context.userId}, ${data.optionIdx})
      on conflict (poll_id, user_id) do update set option_idx = ${data.optionIdx}
    `;
	return { ok: true };
});
function tickMoonbase(state) {
	const last = new Date(state.last_tick).getTime();
	const hours = Math.min(12, Math.max(0, (Date.now() - last) / 36e5));
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
		last_tick: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function loadMoonState(sql, userId) {
	const rows = await sql`select * from moonbase where user_id = ${userId}`;
	if (!rows[0]) {
		await sql`insert into moonbase (user_id) values (${userId})`;
		return loadMoonState(sql, userId);
	}
	const raw = rows[0];
	let state = {
		base_name: raw.base_name,
		oxygen: raw.oxygen,
		water: raw.water,
		iron: raw.iron,
		helium: raw.helium,
		power: raw.power,
		buildings: JSON.parse(raw.buildings),
		units: JSON.parse(raw.units),
		last_tick: raw.last_tick
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
var getMoonbase_createServerFn_handler = createServerRpc({
	id: "585a9e76486bb264f26402a3f7956ab0c174803824b1abf33ef75e227f4b9164",
	name: "getMoonbase",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => getMoonbase.__executeServer(opts));
var getMoonbase = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMoonbase_createServerFn_handler, async ({ context }) => {
	return loadMoonState(await getSql(), context.userId);
});
var moonbaseAction_createServerFn_handler = createServerRpc({
	id: "cb9dd5b8873d341b1cbea6e9e9f12a9717151f63be1fa8aa6c89acd982190dad",
	name: "moonbaseAction",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => moonbaseAction.__executeServer(opts));
var moonbaseAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(moonbaseAction_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const state = await loadMoonState(sql, context.userId);
	const costMul = (n) => 40 * n;
	if (data.kind === "upgrade") {
		const lvl = (state.buildings[data.key] ?? 0) + 1;
		const cost = {
			o: costMul(lvl),
			w: costMul(lvl),
			i: costMul(lvl) * 2,
			h: Math.floor(costMul(lvl) / 4)
		};
		if (state.oxygen < cost.o || state.water < cost.w || state.iron < cost.i || state.helium < cost.h) throw new Error("Not enough resources");
		state.oxygen -= cost.o;
		state.water -= cost.w;
		state.iron -= cost.i;
		state.helium -= cost.h;
		state.buildings[data.key] = lvl;
		state.power += 3;
	} else if (data.kind === "train") {
		const cost = {
			moonbuggy: {
				i: 50,
				h: 0
			},
			gunship: {
				i: 150,
				h: 80
			},
			laser_cannon: {
				i: 900,
				h: 400
			}
		}[data.key];
		if (!cost) throw new Error("Unknown unit");
		if (state.iron < cost.i || state.helium < cost.h) throw new Error("Not enough resources");
		state.iron -= cost.i;
		state.helium -= cost.h;
		state.units[data.key] = (state.units[data.key] ?? 0) + 1;
		state.power += data.key === "laser_cannon" ? 20 : data.key === "gunship" ? 8 : 2;
	} else {
		const win = (state.units.moonbuggy ?? 0) * 5 + (state.units.gunship ?? 0) * 40 + (state.units.laser_cannon ?? 0) * 200 + Math.random() * 80 > 60;
		if (win) {
			const loot = {
				o: 40 + Math.floor(Math.random() * 80),
				w: 40 + Math.floor(Math.random() * 80),
				i: 80 + Math.floor(Math.random() * 160),
				h: 10 + Math.floor(Math.random() * 40)
			};
			state.oxygen += loot.o;
			state.water += loot.w;
			state.iron += loot.i;
			state.helium += loot.h;
			await credit(sql, context.userId, 8, "Moonbase raid");
			await award(sql, context.userId, "raid");
		} else state.units.moonbuggy = Math.max(0, (state.units.moonbuggy ?? 0) - 1);
		await sql`
        update moonbase set oxygen = ${state.oxygen}, water = ${state.water}, iron = ${state.iron},
          helium = ${state.helium}, power = ${state.power}, last_tick = now(),
          buildings = ${JSON.stringify(state.buildings)}, units = ${JSON.stringify(state.units)}
        where user_id = ${context.userId}
      `;
		return {
			state,
			result: win ? "win" : "loss"
		};
	}
	await sql`
      update moonbase set oxygen = ${state.oxygen}, water = ${state.water}, iron = ${state.iron},
        helium = ${state.helium}, power = ${state.power}, last_tick = now(),
        buildings = ${JSON.stringify(state.buildings)}, units = ${JSON.stringify(state.units)}
      where user_id = ${context.userId}
    `;
	return {
		state,
		result: "ok"
	};
});
var leaderboards_createServerFn_handler = createServerRpc({
	id: "741463a92f3076b5ea016ad5a69a279d91dc7aef1b3abc4b4ce7c86c3b7bbed1",
	name: "leaderboards",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => leaderboards.__executeServer(opts));
var leaderboards = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(leaderboards_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		moola: await sql`
      select mxit_id, display_name, avatar_seed, moola from profiles
      where is_bot = false
      order by moola desc limit 15
    `,
		power: await sql`
      select p.mxit_id, p.display_name, m.power
      from moonbase m join profiles p on p.id = m.user_id
      order by m.power desc limit 15
    `,
		streaks: await sql`
      select mxit_id, display_name, streak_days from profiles
      where is_bot = false
      order by streak_days desc, moola desc limit 15
    `
	};
});
var meetPeople_createServerFn_handler = createServerRpc({
	id: "f053022183f734fadbf30e607d0b608280269b30ff5dff627420072f0705612f",
	name: "meetPeople",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => meetPeople.__executeServer(opts));
var meetPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(meetPeople_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
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
var myAchievements_createServerFn_handler = createServerRpc({
	id: "0c5a300a895fd73c633367f1373341cc178dd31608f0eeb5177dea1074b2ac20",
	name: "myAchievements",
	filename: "src/lib/mxit/fns.ts"
}, (opts) => myAchievements.__executeServer(opts));
var myAchievements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myAchievements_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select code, unlocked_at from achievements where user_id = ${context.userId}
    `;
});
//#endregion
export { addContact_createServerFn_handler, buyEmoticard_createServerFn_handler, checkMxitId_createServerFn_handler, claimDaily_createServerFn_handler, createGroup_createServerFn_handler, createProfile_createServerFn_handler, getMoonbase_createServerFn_handler, getMyProfile_createServerFn_handler, getPublicProfile_createServerFn_handler, giftMoola_createServerFn_handler, heartConfession_createServerFn_handler, leaderboards_createServerFn_handler, listConfessions_createServerFn_handler, listContacts_createServerFn_handler, listGroups_createServerFn_handler, listMoola_createServerFn_handler, listPolls_createServerFn_handler, listRooms_createServerFn_handler, listStatuses_createServerFn_handler, loadConversation_createServerFn_handler, loadGroup_createServerFn_handler, loadRoom_createServerFn_handler, meetPeople_createServerFn_handler, moonbaseAction_createServerFn_handler, myAchievements_createServerFn_handler, openChat_createServerFn_handler, pinContact_createServerFn_handler, pollConversation_createServerFn_handler, postConfession_createServerFn_handler, postStatus_createServerFn_handler, respondContact_createServerFn_handler, searchUsers_createServerFn_handler, sendDirect_createServerFn_handler, sendGroup_createServerFn_handler, sendRoom_createServerFn_handler, setTyping_createServerFn_handler, spendMoola_createServerFn_handler, updateProfile_createServerFn_handler, viewStatus_createServerFn_handler, votePoll_createServerFn_handler };
