import type { ZoneId } from "./zones";

export type Presence = "online" | "away" | "busy" | "offline";
export type MsgKind = "text" | "image" | "voice" | "challenge";
export type MsgChannel = "data" | "gprs" | "sms";

export type Profile = {
  id: string;
  mxit_id: string;
  display_name: string;
  mood: string | null;
  mood_code: string | null;
  avatar_seed: string | null;
  avatar_url: string | null;
  gender: string | null;
  age: number | null;
  moola: number;
  theme: string;
  display_mode: string;
  sound_enabled: boolean;
  presence: Presence;
  farewell: string | null;
  hide_offline: boolean;
  read_receipts: boolean;
  is_bot: boolean;
  last_seen: string;
  last_daily_claim: string | null;
  streak_days: number;
  created_at: string;
  zone: ZoneId | string;
  notify_push: boolean;
  phone: string | null;
  airtime_sms: boolean;
  airtime_gprs?: boolean;
  is_admin?: boolean;
  banned_at?: string | null;
};

export type ContactRow = {
  id: string;
  status: "pending" | "accepted" | "blocked";
  requester_id: string;
  addressee_id: string;
  unread: boolean;
  unread_count: number;
  last_message: string | null;
  last_message_at: string | null;
  pinned: boolean;
  conversation_id?: string | null;
  nickname?: string | null;
  blocked?: boolean;
  other: Pick<
    Profile,
    "id" | "mxit_id" | "display_name" | "mood" | "mood_code" | "avatar_seed" | "avatar_url" | "presence" | "is_bot" | "zone" | "phone"
  >;
};

export type ChatMessage = {
  id: string;
  sender_id: string;
  content: string;
  delivery: "sending" | "sent" | "delivered" | "read";
  created_at: string;
  sender_name?: string | null;
  sender_seed?: string | null;
  kind?: MsgKind | string | null;
  media?: string | null;
  channel?: MsgChannel | string | null;
  reply_to?: string | null;
  reply_preview?: string | null;
  deleted?: boolean;
};

export type ConversationView = {
  id: string;
  other: ContactRow["other"];
  messages: ChatMessage[];
  typing?: boolean;
};

export type Chatroom = {
  id: string;
  name: string;
  topic: string | null;
  is_official: boolean;
  member_count: number;
  last_message?: string | null;
};

export type MultiMxGroup = {
  id: string;
  name: string;
  owner_id: string;
  member_count: number;
  created_at: string;
};

export type StatusItem = {
  id: string;
  author_id: string;
  caption: string | null;
  background: string | null;
  created_at: string;
  expires_at: string;
  author_name: string;
  author_seed: string | null;
  views: number;
};

export type MoolaTx = {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
};

export type Confession = {
  id: string;
  body: string;
  created_at: string;
  hearts: number;
};

export type Poll = {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  my_vote: number | null;
};

export type MoonbaseState = {
  base_name: string;
  oxygen: number;
  water: number;
  iron: number;
  helium: number;
  power: number;
  buildings: Record<string, number>;
  units: Record<string, number>;
  last_tick: string;
};

export type PublicProfile = {
  id: string;
  mxit_id: string;
  display_name: string;
  mood: string | null;
  mood_code: string | null;
  avatar_seed: string | null;
  presence: Presence;
  is_bot: boolean;
  zone?: string | null;
  phone?: string | null;
  contact_status: "none" | "pending_out" | "pending_in" | "accepted" | "blocked";
};

export const THEMES = [
  { id: "classic", name: "Classic Blue", swatch: "#1E78D6" },
  { id: "green", name: "Lime", swatch: "#2E9F4D" },
  { id: "pink", name: "Bubble", swatch: "#E04B98" },
  { id: "black", name: "Midnight", swatch: "#111111" },
  { id: "sunset", name: "Sunset", swatch: "#E67E22" },
  { id: "ocean", name: "Ocean", swatch: "#16A085" },
  { id: "terminal", name: "Terminal", swatch: "#00E676" },
  { id: "purple", name: "Grape", swatch: "#8E44AD" },
] as const;

export const PRESENCES: { p: Presence; label: string; orb: string }[] = [
  { p: "online", label: "Available", orb: "orb-online" },
  { p: "away", label: "Away", orb: "orb-away" },
  { p: "busy", label: "Busy", orb: "orb-busy" },
  { p: "offline", label: "Invisible", orb: "orb-offline" },
];

export const MOODS: { label: string; code: string; presence: Presence }[] = [
  { label: "Happy", code: ":)", presence: "online" },
  { label: "Sad", code: ":(", presence: "online" },
  { label: "Excited", code: ":D", presence: "online" },
  { label: "Invincible", code: "(cool)", presence: "online" },
  { label: "Hot", code: "(blush)", presence: "online" },
  { label: "Angry", code: "(rage)", presence: "busy" },
  { label: "Grumpy", code: "(evil)", presence: "busy" },
  { label: "Sick", code: "(dizzy)", presence: "away" },
  { label: "In love", code: "<3", presence: "online" },
  { label: "Sleepy", code: ":|", presence: "away" },
];

export const MXIT_SYSTEM = [
  { id: "sys-mobi", name: "QX Banker", sub: "Apps · Banker Bot · chat is free", route: "/portal/portal", mood: ":D" },
  { id: "sys-trade", name: "QX Post", sub: "Free rooms · Skinz & Emoticards", route: "/tradepost", mood: "(blush)" },
  { id: "sys-multimx", name: "QX Mix", sub: "Private groups · also free", route: "/multimx", mood: ":)" },
] as const;

export const ZONE_ROOMS = [
  { id: "sys-zone-ct", name: "Cape Town", sub: "FREE zone · heita mother city", route: "/room/room-cpt", mood: ":)", zone: "ct" },
  { id: "sys-zone-jhb", name: "Jozi", sub: "FREE zone · highway lights", route: "/room/room-jhb", mood: ":D", zone: "jhb" },
  { id: "sys-zone-dbn", name: "Durbs", sub: "FREE zone · beach & bunny chow", route: "/room/room-dbn", mood: "(blush)", zone: "dbn" },
] as const;
