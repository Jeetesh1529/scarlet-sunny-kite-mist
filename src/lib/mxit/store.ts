export const STORE = {
  name: "QXio",
  subtitle: "Blast From The Past",
  short: "Free chat, rooms and games. Light on data, with an SMS fallback.",
  full: `QXio is a South African messenger revival. Contacts, moods, Cape Town / Jozi / Durbs zones, rooms that feel occupied, and games you can challenge a friend to.

Chat send and receive is free — QXio adds no per-message charge, just a little mobile data. "Lean" mode keeps each message text-only and tiny to save data. No data at all? The SMS fallback sends over your phone's Messages at your network's SMS rate (~80c).

Moola is earned in-app (welcome bonus, daily claim, streaks) and spends on extras like Skinz and Emoticards. Moola is not sold for real money and cannot be cashed out.

14 or older. Block, report, nickname, copy / reply / delete. Your QXio ID is unique.

Games: Moonbase, Chess, Connect 4, Tic-Tac-Toe, Skip-Bo.`,
  categoryPlay: "Communication",
  categoryIos: "Social Networking",
  age: "14+",
  iap: "None — Moola is earned, never sold",
  ads: "None",
  keywords: "chat, messenger, south africa, rooms, moola, gprs, games",
  packageAndroid: "za.qxio.app",
  bundleIos: "za.qxio.app",
  privacyPath: "/legal/privacy",
  termsPath: "/legal/terms",
  supportPath: "/legal/support",
  deletePath: "/legal/delete",
  dataSafety: [
    "Personal info: email, name, QXio ID — collected, not sold, not shared with third parties for ads.",
    "Messages: stored to deliver chat. Photos and voice notes you send. User-generated.",
    "Approx location: zone you pick (Cape Town / Jozi / Durbs), not GPS.",
    "Optional phone number: only if you turn on last-resort SMS.",
    "App activity: contacts, rooms, games, Moola ledger.",
    "Security: encrypted in transit (HTTPS). Delete account wipes the profile.",
  ],
  reviewNotes:
    "Demo: create an account (email + password or Google/X), pick a unique QXio ID, confirm 14+. JADE CT is a seeded contact — long-press to chat or Challenge. Rooms under QX Post → Chat Rooms. Account deletion: Settings → Delete my QXio ID, and https://qxio.live/legal/delete. No IAP. No ads. Moola is earned only.",
  site: "https://qxio.live",
} as const;

export const STORE_SHOTS = [
  { src: "/store/01-home.png", label: "Contacts" },
  { src: "/store/02-chat.png", label: "Chat" },
  { src: "/store/03-room.png", label: "Cape Town room" },
  { src: "/store/04-games.png", label: "Games" },
  { src: "/store/05-challenge.png", label: "Chess" },
] as const;
