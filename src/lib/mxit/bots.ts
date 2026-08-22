export const BOT_IDS = [
  "bot-joe-banker",
  "bot-jade-ct",
  "bot-sipho",
  "bot-thandi",
  "bot-lurker",
  "bot-help",
] as const;

export function isBotId(id: string) {
  return id.startsWith("bot-");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function botReply(botId: string, text: string, displayName: string): string | null {
  const t = text.toLowerCase();
  if (botId === "bot-lurker") {
    return Math.random() < 0.35 ? pick(["…", ":|", "k", "seen"]) : null;
  }
  if (botId === "bot-joe-banker") {
    if (/cost|price|free|charge|rate|sms|airtime|gprs|data|bundle/.test(t))
      return pick([
        "No bundle? Tap the radio in chat — GPRS packets from airtime, about 1–2c to the network. Same trick the OG app used.",
        "Three paths: bundle chat is free, GPRS is ~1–2c airtime, SMS is the ~80c last resort. QXio takes nothing.",
        "Moola is for extras: Skinz and Emoticards. Messages never spend it.",
      ]);
    if (/moola|money|coins|broke|gift/.test(t))
      return pick([
        "Open Moola Hub from my portal — daily claim is free Moola :D Chat itself is already free.",
        "Gift friends from the contact list. Don't go broke on Skinz. Messages don't cost Moola.",
        "QX Post shop takes Moola for extras. Chat, rooms and games are free.",
      ]);
    if (/help|how|what|banker/.test(t))
      return "I'm QX Banker. Tap my name on the contacts list → portal for Moola, apps and the bank. Chat is free.";
    return pick([
      `Sharp ${displayName}. Wallet looking healthy? Check Moola Hub — chat doesn't spend it.`,
      "Need cash? Daily claim + Moonbase raids. Don't tell the taxman.",
      "QX Post just restocked Skinz. Don't spend it all :D Messages stay free.",
    ]);
  }
  if (botId === "bot-help") {
    if (/install|ios|android|app store|iphone/.test(t))
      return "On iPhone: Share → Add to Home Screen. On Android: browser menu → Install app. That's how QXio lives on your phone.";
    if (/chat|message/.test(t))
      return "Tap a friend in Contacts, then the Chat soft-key. Send and receive is free — no Moola per message.";
    if (/cost|price|free|charge|rate|gprs|airtime|sms|bundle/.test(t))
      return "No bundle: tap the radio in chat for GPRS (~1–2c airtime, like the OG app). SMS is ~80c last resort. Bundle chat is free. Moola is only for Skinz and Emoticards.";
    if (/moola/.test(t)) return "Menu isn't needed — claim daily from the Contacts banner, or visit QX Banker. Chat doesn't spend Moola.";
    return pick([
      "Menu (bottom left) has Profile, Settings, Add contact and Logout.",
      "QX Post is the mall: rooms and games are free. Skinz and Emoticards cost Moola.",
      "Status is the round green dot on the soft-key bar. QX Mix is group chat.",
      "Stuck? Set your mood, add a friend by QXio ID, then Chat.",
    ]);
  }
  if (botId === "bot-jade-ct") {
    if (/howzit|heita|sharp|eita/.test(t))
      return pick(["heita! howzit my bru :)", "sharp sharp from Sea Point", "eita — you good?"]);
    if (/ct|cape|town|mountain/.test(t))
      return pick(["Table Mountain is out tonight :D", "wind is wild in the mother city again", "come through CT chatroom"]);
    return pick([
      `howzit ${displayName} :D missed this app`,
      "you on the old days too or is this your first life?",
      "drop a status before you log off :)",
      "Cape Town room is live if you want noise",
    ]);
  }
  if (botId === "bot-sipho") {
    if (/game|moon|tic/.test(t)) return "Moonbase in QX Post. Don't send all your moonbuggies on raid 1.";
    return pick([
      "sharp my bru",
      "we should open a QX Mix later",
      "Jozi traffic is a personality at this point",
      `you good ${displayName}?`,
    ]);
  }
  if (botId === "bot-thandi") {
    if (/love|<3|miss/.test(t)) return "the 2007 chatrooms had a different kind of magic <3";
    return pick([
      "still can't believe this is back <3",
      "set your mood, it makes the list feel alive",
      "I keep a farewell message for logout. old habits.",
      `hey ${displayName} — you look online :)` ,
    ]);
  }
  return pick(["heita :)", "lol", "sharp"]);
}
