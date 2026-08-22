import { useNavigate } from "@tanstack/react-router";
import { Ban, Bell, Check, ChevronDown, Coins, Copy, Flag, Flame, Gamepad2, LogOut, Mail, MailOpen, MapPin, Minus, Pin, PinOff, Plus, Radio, Search, Share2, Shield, Signal, Smartphone, Star, Trash2, UserPlus, UserRound, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { signOut } from "@/lib/auth/client";
import { AVATAR_SEEDS } from "@/lib/avatars";
import { isStandaloneApp, openPhoneInstall } from "@/lib/install";
import {
  addContact,
  blockContact,
  claimDaily,
  createChallenge,
  deleteAccount,
  giftMoola,
  listContacts,
  myAchievements,
  openChat,
  pinContact,
  reportUser,
  respondContact,
  searchUsers,
  setNickname,
  updateProfile,
} from "@/lib/mxit/fns";
import { CHALLENGE_GAMES, type ChallengeGame } from "@/lib/mxit/challenge";
import { MOODS, MXIT_SYSTEM, PRESENCES, THEMES, ZONE_ROOMS, type ContactRow, type Presence } from "@/lib/mxit/types";
import { useVisiblePoll } from "@/lib/mxit/use-visible-poll";
import { ZONES, zoneById, type ZoneId } from "@/lib/mxit/zones";
import { notifyIncoming, pushPermission, requestPushPermission } from "@/lib/notify";
import { openSmsBlank, prettyPhone } from "@/lib/sms";
import { sfx } from "@/lib/sfx";
import { EmoText } from "./Emoticon";
import { MoodIcon, orbClass } from "./MoodIcon";
import { RatesCard } from "./RatesCard";
import { PixelAvatar } from "./PixelAvatar";
import { useMxit } from "./provider";
import { Softkeys, Titlebar, WatermarkList } from "./chrome";

type View = "contacts" | "profile" | "settings" | "help";

function contactsSig(list: ContactRow[]) {
  return list
    .map(
      (c) =>
        `${c.id}:${c.pinned ? 1 : 0}:${c.blocked ? 1 : 0}:${c.nickname ?? ""}:${c.unread_count}:${c.status}:${c.last_message ?? ""}:${c.other.presence}:${c.other.mood_code ?? ""}`,
    )
    .join("|");
}

const ContactRowBtn = memo(function ContactRowBtn({
  c,
  selected,
  onOpen,
  onActions,
}: {
  c: ContactRow;
  selected: boolean;
  onOpen: (c: ContactRow) => void;
  onActions: (c: ContactRow) => void;
}) {
  const hold = useRef<number | null>(null);
  const long = useRef(false);
  const label = c.nickname || c.other.display_name;
  const clearHold = () => {
    if (hold.current) {
      window.clearTimeout(hold.current);
      hold.current = null;
    }
  };
  return (
    <button
      type="button"
      onClick={() => {
        if (long.current) {
          long.current = false;
          return;
        }
        onOpen(c);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onActions(c);
      }}
      onPointerDown={() => {
        long.current = false;
        clearHold();
        hold.current = window.setTimeout(() => {
          long.current = true;
          sfx.tap();
          onActions(c);
        }, 460);
      }}
      onPointerUp={clearHold}
      onPointerCancel={clearHold}
      onPointerLeave={clearHold}
      className={`flex w-full items-center gap-2.5 py-2 pl-6 pr-3 text-left ${selected ? "mxit-row-active" : ""} ${c.blocked ? "opacity-70" : ""}`}
      data-contact={c.other.display_name}
      data-conv={c.conversation_id || undefined}
    >
      <span className="relative shrink-0">
        <PixelAvatar seed={c.other.avatar_seed} size={32} />
        <span className={`${orbClass(c.other.presence)} absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5`} />
      </span>
      <span className="min-w-0 flex-1 font-medium tracking-wide text-white" style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}>
        <span className="flex items-center gap-1.5">
          {c.pinned && <Star className="h-3 w-3 shrink-0 fill-amber-300 text-amber-300" />}
          {c.blocked && <Ban className="h-3 w-3 shrink-0 text-rose-300" />}
          <span className="truncate">{label}</span>
          <MoodIcon code={c.other.mood_code || c.other.mood} size={18} />
          {c.other.phone && <Signal className="h-3 w-3 shrink-0 text-amber-300" />}
          <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white/70">
            {zoneById(c.other.zone).short}
          </span>
        </span>
        <span className="block truncate text-[11px] font-normal text-white/60">
          {c.blocked ? (
            "Blocked"
          ) : (
            <EmoText text={c.last_message || c.other.mood || `@${c.other.mxit_id}`} size={12} />
          )}
          {c.nickname ? <span className="ml-1 text-white/40">{c.other.display_name}</span> : null}
        </span>
      </span>
      {c.unread && !c.blocked ? (
        <span className="flex items-center gap-1">
          <Mail className="envelope-unread h-4 w-4" />
          {(c.unread_count ?? 0) > 1 && (
            <span className="rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-black">{c.unread_count}</span>
          )}
        </span>
      ) : (
        <MailOpen className="envelope-read h-4 w-4" />
      )}
    </button>
  );
});

export function HomeScreen() {
  const [view, setView] = useState<View>("contacts");
  if (view === "profile") return <ProfileView onBack={() => setView("contacts")} />;
  if (view === "settings") return <SettingsView onBack={() => setView("contacts")} />;
  if (view === "help") return <HelpView onBack={() => setView("contacts")} />;
  return <ContactsTab onViewChange={setView} />;
}

function ContactsTab({ onViewChange }: { onViewChange: (v: View) => void }) {
  const { profile, setPresence, refresh } = useMxit();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Favourites: true,
    QXio: true,
    Zones: true,
    Friends: true,
    Invites: true,
    Offline: false,
    Sent: true,
    Blocked: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addId, setAddId] = useState("");
  const [moodOpen, setMoodOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [giftFor, setGiftFor] = useState<ContactRow["other"] | null>(null);
  const [giftAmt, setGiftAmt] = useState(25);
  const [zoneFilter, setZoneFilter] = useState<"all" | ZoneId>("all");
  const [actionsFor, setActionsFor] = useState<ContactRow | null>(null);
  const [nickFor, setNickFor] = useState<ContactRow | null>(null);
  const [nickText, setNickText] = useState("");
  const [reportFor, setReportFor] = useState<ContactRow | null>(null);
  const [challengeFor, setChallengeFor] = useState<ContactRow | null>(null);
  const seenUnread = useRef<Map<string, number>>(new Map());
  const primed = useRef(false);
  const sig = useRef("");

  const load = useCallback(async () => {
    try {
      const list = await listContacts();
      if (primed.current && profile?.notify_push !== false) {
        for (const c of list) {
          const prev = seenUnread.current.get(c.other.id) ?? 0;
          if (c.unread_count > prev) {
            sfx.receive();
            notifyIncoming(c.other.display_name, c.last_message || "New message", `qx-${c.other.id}`);
          }
        }
      }
      primed.current = true;
      const next = new Map<string, number>();
      for (const c of list) next.set(c.other.id, c.unread_count);
      seenUnread.current = next;
      const nextSig = contactsSig(list);
      if (nextSig === sig.current) return;
      sig.current = nextSig;
      setContacts(list);
    } catch {
      /* signed out */
    }
  }, [profile?.notify_push]);

  useVisiblePoll(load, 10000, [load]);

  useEffect(() => {
    if (profile?.notify_push !== false && pushPermission() === "default") {
      void requestPushPermission();
    }
  }, [profile?.notify_push]);

  const groups = useMemo(() => {
    const incoming = contacts.filter((c) => c.status === "pending" && c.addressee_id === profile?.id);
    const sentOut = contacts.filter((c) => c.status === "pending" && c.requester_id === profile?.id);
    const accepted = contacts.filter((c) => c.status === "accepted");
    const blocked = accepted.filter((c) => c.blocked);
    const live = accepted.filter((c) => !c.blocked);
    const inZone = (c: ContactRow) => zoneFilter === "all" || c.other.zone === zoneFilter;
    const byActivity = (a: ContactRow, b: ContactRow) => {
      const au = a.unread_count ?? (a.unread ? 1 : 0);
      const bu = b.unread_count ?? (b.unread ? 1 : 0);
      if (au !== bu) return bu - au;
      const at = a.last_message_at ?? "";
      const bt = b.last_message_at ?? "";
      if (at !== bt) return String(bt).localeCompare(String(at));
      return a.other.display_name.localeCompare(b.other.display_name);
    };
    const pinned = live.filter((c) => c.pinned && inZone(c)).sort(byActivity);
    const friends = live.filter((c) => !c.pinned && c.other.presence !== "offline" && inZone(c)).sort(byActivity);
    const offline = live.filter((c) => !c.pinned && c.other.presence === "offline" && inZone(c)).sort(byActivity);
    return { incoming, sentOut, friends, offline, pinned, blocked };
  }, [contacts, profile?.id, zoneFilter]);

  const toggleGroup = (k: string) => {
    sfx.tap();
    setOpenGroups((g) => ({ ...g, [k]: !g[k] }));
  };

  const goChat = (c: ContactRow) => {
    sfx.tap();
    setSelectedId(c.id);
    if (c.blocked) {
      toast.message("Unblock first to chat");
      setActionsFor(c);
      return;
    }
    if (c.conversation_id) {
      navigate({ to: "/chat/$id", params: { id: c.conversation_id } });
      return;
    }
    void openChat({ data: c.other.id }).then(({ id }) => {
      navigate({ to: "/chat/$id", params: { id } });
    });
  };

  const claim = async () => {
    try {
      const r = await claimDaily();
      sfx.receive();
      toast.success(`+${r.amount} Moola · ${r.streak}-day streak`);
      await refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Already claimed");
    }
  };

  const togglePin = async (c: ContactRow) => {
    const next = !c.pinned;
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, pinned: next } : x)));
    try {
      await pinContact({ data: { id: c.id, pinned: next } });
      sfx.tap();
    } catch (e: unknown) {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, pinned: c.pinned } : x)));
      toast.error(e instanceof Error ? e.message : "Could not pin");
    }
  };

  const toggleBlock = async (c: ContactRow) => {
    const next = !c.blocked;
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, blocked: next } : x)));
    try {
      await blockContact({ data: { otherId: c.other.id, blocked: next } });
      sfx.tap();
      toast.success(next ? `Blocked ${c.other.display_name}` : `Unblocked ${c.other.display_name}`);
      void load();
    } catch (e: unknown) {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, blocked: c.blocked } : x)));
      toast.error(e instanceof Error ? e.message : "Could not block");
    }
  };

  const myKind = profile?.presence ?? "offline";
  const canClaim = profile && String(profile.last_daily_claim ?? "").slice(0, 10) !== new Date().toISOString().slice(0, 10);

  const GroupHeader = ({ name, count }: { name: string; count: number }) => {
    const open = !!openGroups[name];
    return (
      <button
        onClick={() => toggleGroup(name)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-white"
        style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}
      >
        <span className="inline-flex h-4 w-4 items-center justify-center border border-white/40 bg-white/5 text-[10px] text-white">
          {open ? <Minus className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
        </span>
        <span className="font-medium tracking-wide">
          {name} <span className="opacity-80">({count})</span>
        </span>
      </button>
    );
  };

  return (
    <div className="mxit-classic-bg flex min-h-0 flex-1 flex-col">
      <Titlebar
        title="Contacts"
        left={
          <button
            type="button"
            aria-label="cycle status"
            onClick={() => {
              sfx.tap();
              const next: Presence =
                profile?.presence === "online"
                  ? "away"
                  : profile?.presence === "away"
                    ? "busy"
                    : profile?.presence === "busy"
                      ? "offline"
                      : "online";
              void setPresence(next);
            }}
          >
            <span className={orbClass(myKind)} />
          </button>
        }
        right={
          <button
            type="button"
            aria-label="set mood"
            onClick={() => {
              sfx.tap();
              setMoodOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10"
          >
            <MoodIcon code={profile?.mood_code || profile?.mood} size={22} />
          </button>
        }
      />
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setZoneFilter("all")}
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${zoneFilter === "all" ? "bg-white text-[#0A1B3D]" : "bg-white/10 text-white/80"}`}
        >
          All
        </button>
        {ZONES.filter((z) => z.id === "ct" || z.id === "jhb" || z.id === "dbn").map((z) => (
          <button
            key={z.id}
            type="button"
            onClick={() => setZoneFilter(z.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${zoneFilter === z.id ? "bg-white text-[#0A1B3D]" : "bg-white/10 text-white/80"}`}
          >
            {z.short}
          </button>
        ))}
      </div>
      <WatermarkList>
        <button
          type="button"
          onClick={() => {
            sfx.tap();
            onViewChange("help");
          }}
          className="flex w-full items-center gap-3 px-3 py-1.5 text-left"
        >
          <span className="status-orb orb-online" />
          <span className="flex-1 font-medium text-white" style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}>
            Info
          </span>
          <MailOpen className="envelope-read h-4 w-4" />
        </button>

        {canClaim && (
          <button
            type="button"
            onClick={claim}
            className="mx-3 my-2 flex w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/20 px-3 py-2 text-[12px] text-amber-50 hover:bg-amber-500/30"
          >
            <Flame className="h-4 w-4 text-amber-300" />
            <span className="flex-1 text-left">
              <span className="font-semibold">Daily login bonus ready</span>
              {profile && profile.streak_days > 0 && <span className="ml-1 text-amber-200/80">· {profile.streak_days}-day streak</span>}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-amber-200">CLAIM</span>
          </button>
        )}
        {!canClaim && profile && profile.streak_days > 0 && (
          <div className="mx-3 my-1 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-amber-200/80">
            <Flame className="h-3 w-3 text-amber-300" />
            <span className="font-semibold">{profile.streak_days}-day streak</span>
            <span className="text-white/50">· come back tomorrow</span>
          </div>
        )}

        {groups.pinned.length > 0 && (
          <>
            <GroupHeader name="Favourites" count={groups.pinned.length} />
            {openGroups.Favourites && groups.pinned.map((c) => (
              <ContactRowBtn key={c.id} c={c} selected={selectedId === c.id} onOpen={goChat} onActions={setActionsFor} />
            ))}
          </>
        )}

        <GroupHeader name="QXio" count={MXIT_SYSTEM.length} />
        {openGroups.QXio &&
          MXIT_SYSTEM.map((s) => (
            <button
              key={s.id}
              type="button"
              data-contact={s.name}
              onClick={() => {
                sfx.tap();
                navigate({ href: s.route });
              }}
              className="flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left"
            >
              <span className="status-orb orb-online" />
              <span className="min-w-0 flex-1 truncate font-medium tracking-wide text-white" style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}>
                {s.name}
                <span className="block truncate text-[11px] font-normal text-white/60">
                  <MoodIcon code={s.mood} size={14} /> {s.sub}
                </span>
              </span>
              <MailOpen className="envelope-read h-4 w-4" />
            </button>
          ))}

        <GroupHeader name="Zones" count={ZONE_ROOMS.length} />
        {openGroups.Zones &&
          ZONE_ROOMS.map((s) => (
            <button
              key={s.id}
              type="button"
              data-contact={s.name}
              onClick={() => {
                sfx.tap();
                navigate({ href: s.route });
              }}
              className="flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-cyan-100">
                {zoneById(s.zone).short}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium tracking-wide text-white" style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}>
                {s.name}
                <span className="block truncate text-[11px] font-normal text-white/60">
                  <MoodIcon code={s.mood} size={14} /> {s.sub}
                </span>
              </span>
              <MapPin className="h-3.5 w-3.5 text-white/50" />
            </button>
          ))}

        {groups.incoming.length > 0 && (
          <>
            <GroupHeader name="Invites" count={groups.incoming.length} />
            {openGroups.Invites &&
              groups.incoming.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5 pl-7 pr-3">
                  <span className="status-orb orb-invite" />
                  <span className="min-w-0 flex-1 font-medium text-white">{c.other.display_name}</span>
                  <button
                    type="button"
                    className="rounded bg-emerald-600/80 p-1 text-white"
                    onClick={async () => {
                      await respondContact({ data: { id: c.id, accept: true } });
                      void load();
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-700/80 p-1 text-white"
                    onClick={async () => {
                      await respondContact({ data: { id: c.id, accept: false } });
                      void load();
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
          </>
        )}

        <GroupHeader name="Friends" count={groups.friends.length} />
        {openGroups.Friends &&
          (groups.friends.length === 0 ? (
            <div className="px-7 py-2 text-[12px] italic text-white/50">No friends in this zone. Menu → Add contact, or Meet people.</div>
          ) : (
            groups.friends.map((c) => (
              <ContactRowBtn key={c.id} c={c} selected={selectedId === c.id} onOpen={goChat} onActions={setActionsFor} />
            ))
          ))}

        {groups.sentOut.length > 0 && (
          <>
            <GroupHeader name="Sent" count={groups.sentOut.length} />
            {openGroups.Sent &&
              groups.sentOut.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5 pl-7 pr-3 text-white/80">
                  <span className="status-orb orb-invite" />
                  <span className="flex-1">{c.other.display_name}</span>
                  <span className="text-[11px] text-white/50">waiting…</span>
                </div>
              ))}
          </>
        )}

        {!profile?.hide_offline && (
          <>
            <GroupHeader name="Offline" count={groups.offline.length} />
            {openGroups.Offline && groups.offline.map((c) => (
              <ContactRowBtn key={c.id} c={c} selected={selectedId === c.id} onOpen={goChat} onActions={setActionsFor} />
            ))}
          </>
        )}

        {groups.blocked.length > 0 && (
          <>
            <GroupHeader name="Blocked" count={groups.blocked.length} />
            {openGroups.Blocked && groups.blocked.map((c) => (
              <ContactRowBtn key={c.id} c={c} selected={selectedId === c.id} onOpen={goChat} onActions={setActionsFor} />
            ))}
          </>
        )}
      </WatermarkList>

      <Softkeys
        left={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-1 active:bg-black/30">
                Menu <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem onClick={() => setAddOpen(true)}>Add contact…</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInviteOpen(true)}>Invite a friend…</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMoodOpen(true)}>Set mood…</DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 h-px bg-white/10" />
              <DropdownMenuItem onClick={() => onViewChange("profile")}>My profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("settings")}>Settings</DropdownMenuItem>
              {profile?.is_admin ? (
                <DropdownMenuItem onClick={() => navigate({ to: "/hq", search: {} })}>QXio HQ</DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onClick={() => navigate({ to: "/meet" })}>Meet people</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/leaderboards" })}>Leaderboards</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/get" })}>Get QXio on your phone</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("help")}>Help</DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 h-px bg-white/10" />
              <DropdownMenuItem onClick={() => void signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        center={
          <>
            <button
              type="button"
              onClick={() => {
                sfx.tap();
                navigate({ to: "/status" });
              }}
              className="flex items-center gap-1 border-l border-white/10 px-2 text-[12px] font-semibold active:bg-black/30"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Status
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.tap();
                setSearchOpen(true);
              }}
              className="flex items-center justify-center border-l border-r border-white/10 px-2 active:bg-black/30"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </>
        }
        right={
          <button
            type="button"
            onClick={() => {
              const sel = contacts.find((c) => c.id === selectedId);
              if (sel && sel.status === "accepted") goChat(sel);
              else toast.message("Select a contact to chat");
            }}
            className="active:bg-black/30"
          >
            Chat
          </button>
        }
      />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Add contact</DialogTitle>
          </DialogHeader>
          <Label className="text-white/80">QXio ID — unique to each person</Label>
          <Input value={addId} onChange={(e) => setAddId(e.target.value)} placeholder="jade_ct" className="border-white/20 bg-white/10 text-white" />
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              try {
                await addContact({ data: addId });
                toast.success("Request sent");
                setAddOpen(false);
                setAddId("");
                void load();
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={moodOpen} onOpenChange={setMoodOpen}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Mood</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.code}
                type="button"
                onClick={async () => {
                  sfx.tap();
                  await updateProfile({ data: { mood_code: m.code, mood: m.label, presence: m.presence } });
                  await refresh();
                  setMoodOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/15 px-2 py-2 text-left hover:bg-white/10"
              >
                <MoodIcon code={m.code} size={28} />
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Search QXio</DialogTitle>
          </DialogHeader>
          <SearchPanel
            onPick={async (id) => {
              setSearchOpen(false);
              await addContact({ data: id }).catch(() => {});
              void load();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!giftFor} onOpenChange={() => setGiftFor(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Gift Moola to {giftFor?.display_name}</DialogTitle>
          </DialogHeader>
          <Input type="number" value={giftAmt} onChange={(e) => setGiftAmt(parseInt(e.target.value || "0", 10))} className="border-white/20 bg-white/10 text-white" />
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              if (!giftFor) return;
              try {
                await giftMoola({ data: { otherId: giftFor.id, amount: giftAmt } });
                toast.success("Gift sent");
                setGiftFor(null);
                await refresh();
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          >
            Send {giftAmt} M
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!actionsFor} onOpenChange={() => setActionsFor(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{actionsFor?.other.display_name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Button
              onClick={() => {
                if (actionsFor) goChat(actionsFor);
                setActionsFor(null);
              }}
            >
              Chat
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (actionsFor) void togglePin(actionsFor);
                setActionsFor(null);
              }}
            >
              {actionsFor?.pinned ? (
                <>
                  <PinOff className="h-4 w-4" /> Unpin
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4" /> Pin favourite
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (actionsFor) setGiftFor(actionsFor.other);
                setActionsFor(null);
              }}
            >
              Gift Moola
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (!actionsFor) return;
                setChallengeFor(actionsFor);
                setActionsFor(null);
              }}
            >
              <Gamepad2 className="h-4 w-4" /> Challenge
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (!actionsFor) return;
                setNickFor(actionsFor);
                setNickText(actionsFor.nickname ?? "");
                setActionsFor(null);
              }}
            >
              <UserRound className="h-4 w-4" /> Nickname
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (actionsFor) void toggleBlock(actionsFor);
                setActionsFor(null);
              }}
            >
              <Ban className="h-4 w-4" /> {actionsFor?.blocked ? "Unblock" : "Block"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!actionsFor) return;
                setReportFor(actionsFor);
                setActionsFor(null);
              }}
            >
              <Flag className="h-4 w-4" /> Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!challengeFor} onOpenChange={() => setChallengeFor(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Challenge {challengeFor?.other.display_name}</DialogTitle>
          </DialogHeader>
          <p className="text-[12px] text-white/60">A match lands in chat. They tap to play. Bots play back.</p>
          <div className="grid gap-2">
            {CHALLENGE_GAMES.map((g) => (
              <Button
                key={g.id}
                variant="secondary"
                data-game={g.id}
                onClick={async () => {
                  if (!challengeFor) return;
                  try {
                    const r = await createChallenge({ data: { otherId: challengeFor.other.id, game: g.id as ChallengeGame } });
                    sfx.tap();
                    setChallengeFor(null);
                    void navigate({ href: `${g.path}?match=${r.matchId}` });
                  } catch (e: unknown) {
                    toast.error(e instanceof Error ? e.message : "Couldn't challenge");
                  }
                }}
              >
                {g.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!nickFor} onOpenChange={() => setNickFor(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Nickname for {nickFor?.other.display_name}</DialogTitle>
          </DialogHeader>
          <Label className="text-white/80">Only you see this name</Label>
          <Input
            value={nickText}
            onChange={(e) => setNickText(e.target.value)}
            maxLength={24}
            placeholder={nickFor?.other.display_name}
            className="border-white/20 bg-white/10 text-white"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                if (!nickFor) return;
                try {
                  await setNickname({ data: { otherId: nickFor.other.id, nickname: "" } });
                  setContacts((prev) => prev.map((x) => (x.id === nickFor.id ? { ...x, nickname: null } : x)));
                  setNickFor(null);
                  toast.success("Nickname cleared");
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              Clear
            </Button>
            <Button
              onClick={async () => {
                if (!nickFor) return;
                try {
                  const r = await setNickname({ data: { otherId: nickFor.other.id, nickname: nickText } });
                  setContacts((prev) => prev.map((x) => (x.id === nickFor.id ? { ...x, nickname: r.nickname } : x)));
                  setNickFor(null);
                  toast.success(r.nickname ? `Now ${r.nickname}` : "Nickname cleared");
                  void load();
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reportFor} onOpenChange={() => setReportFor(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Report {reportFor?.other.display_name}</DialogTitle>
          </DialogHeader>
          <p className="text-[12px] text-white/60">We'll block them too. Pick a reason.</p>
          <div className="grid gap-2">
            {(["abuse", "spam", "fake", "other"] as const).map((reason) => (
              <Button
                key={reason}
                variant="secondary"
                className="capitalize"
                onClick={async () => {
                  if (!reportFor) return;
                  try {
                    await reportUser({ data: { otherId: reportFor.other.id, reason } });
                    setContacts((prev) => prev.map((x) => (x.id === reportFor.id ? { ...x, blocked: true } : x)));
                    setReportFor(null);
                    toast.success("Reported and blocked");
                    void load();
                  } catch (e: unknown) {
                    toast.error(e instanceof Error ? e.message : "Failed");
                  }
                }}
              >
                {reason}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Invite a friend</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-white/75">
            Your unique QXio ID is <span className="font-semibold text-amber-200">@{profile?.mxit_id}</span>. They search that ID and add you. Chat is free.
          </p>
          <div className="grid gap-2">
            <Button
              onClick={async () => {
                const id = `@${profile?.mxit_id ?? ""}`;
                try {
                  await navigator.clipboard.writeText(id);
                  toast.success("QXio ID copied");
                } catch {
                  toast.message(id);
                }
              }}
            >
              <Copy className="h-4 w-4" /> Copy @{profile?.mxit_id}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                const text = `Add me on QXio — my ID is @${profile?.mxit_id}. Chat is free.`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: "QXio", text });
                    return;
                  }
                } catch {
                  /* cancelled */
                }
                try {
                  await navigator.clipboard.writeText(text);
                  toast.success("Invite copied");
                } catch {
                  toast.message(text);
                }
              }}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                openSmsBlank(`Add me on QXio — my ID is @${profile?.mxit_id}. Chat is free.`);
              }}
            >
              <UserPlus className="h-4 w-4" /> SMS a friend
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SearchPanel({ onPick }: { onPick: (mxitId: string) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Awaited<ReturnType<typeof searchUsers>>>([]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (q.trim().length < 2) {
        setHits([]);
        return;
      }
      void searchUsers({ data: q }).then(setHits).catch(() => setHits([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="space-y-2">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name or QXio ID" className="border-white/20 bg-white/10 text-white" />
      <div className="max-h-56 space-y-1 overflow-y-auto">
        {hits.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => onPick(h.mxit_id)}
            className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10"
          >
            <PixelAvatar seed={h.avatar_seed} size={28} />
            <span className="flex-1">
              {h.display_name}
              <span className="block text-[11px] text-white/60">
                @{h.mxit_id} · {zoneById(h.zone).short}
              </span>
            </span>
            <MoodIcon code={h.mood_code} size={18} />
            <span className={orbClass(h.presence)} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ChromeInner({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="mxit-classic-bg flex min-h-0 flex-1 flex-col">
      <Titlebar title={title} left={<button type="button" onClick={onBack} className="rounded-sm border border-white/20 bg-white/10 px-2 py-0.5 text-[11px]">‹ Back</button>} right={<span className="status-orb orb-online" />} />
      <div className="mxit-watermark relative min-h-0 flex-1 overflow-y-auto">
        <div className="mxit-watermark-mark" aria-hidden />
        <div className="relative z-10 space-y-3 p-3 text-white">{children}</div>
      </div>
      <Softkeys
        left={
          <button type="button" onClick={onBack}>
            Back
          </button>
        }
        right={
          <button type="button" onClick={onBack}>
            OK
          </button>
        }
      />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="space-y-2 rounded-xl border border-white/15 bg-white/8 p-3 backdrop-blur-sm">{children}</section>;
}

function ProfileView({ onBack }: { onBack: () => void }) {
  const { profile, refresh, setPresence } = useMxit();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [mood, setMood] = useState(profile?.mood ?? "");
  const [farewell, setFarewell] = useState(profile?.farewell ?? "");
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_seed ?? AVATAR_SEEDS[0]!);
  const [zone, setZone] = useState(profile?.zone ?? "ct");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [ach, setAch] = useState<{ code: string }[]>([]);
  useEffect(() => {
    void myAchievements().then(setAch).catch(() => {});
  }, []);
  if (!profile) return null;
  return (
    <ChromeInner title="My profile" onBack={onBack}>
      <Card>
        <div className="flex items-center gap-3">
          <PixelAvatar seed={avatarSeed} size={56} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              @{profile.mxit_id}
              <span className="rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-200">unique</span>
            </div>
            <div className="truncate font-medium">{displayName}</div>
            <div className="flex items-center gap-1 text-[11px] text-amber-300">
              <Coins className="h-3 w-3" /> {profile.moola} Moola
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/70">
              <MoodIcon code={profile.mood_code} size={16} /> {profile.mood}
              <span className="rounded-full bg-white/10 px-1.5">{zoneById(profile.zone).short}</span>
            </div>
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/80"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`@${profile.mxit_id}`);
                    toast.success("QXio ID copied");
                  } catch {
                    toast.message(`@${profile.mxit_id}`);
                  }
                }}
              >
                <Copy className="h-3 w-3" /> Copy ID
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/80"
                onClick={async () => {
                  const text = `Add me on QXio — my ID is @${profile.mxit_id}`;
                  try {
                    if (navigator.share) {
                      await navigator.share({ title: "QXio", text });
                      return;
                    }
                  } catch {
                    /* cancelled */
                  }
                  try {
                    await navigator.clipboard.writeText(text);
                    toast.success("Invite copied");
                  } catch {
                    toast.message(text);
                  }
                }}
              >
                <Share2 className="h-3 w-3" /> Invite
              </button>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Status</div>
        <div className="grid grid-cols-2 gap-2">
          {PRESENCES.map(({ p, label, orb }) => (
            <button
              key={p}
              type="button"
              onClick={() => void setPresence(p)}
              className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${profile.presence === p ? "border-white/40 bg-white/15" : "border-white/10 hover:bg-white/5"}`}
            >
              <span className={`status-orb ${orb}`} />
              <span className="text-[13px]">{label}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Zone</div>
        <div className="grid grid-cols-3 gap-1.5">
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setZone(z.id)}
              className={`rounded-xl border px-2 py-2 text-left ${zone === z.id ? "border-white/50 bg-white/15" : "border-white/10"}`}
            >
              <div className="text-[12px] font-semibold">{z.short}</div>
              <div className="truncate text-[10px] text-white/60">{z.label}</div>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Cell · last-resort SMS</div>
        <p className="text-[11px] text-white/55">
          Only needed if GPRS can't get through. Cheap path is GPRS (~1–2c from airtime, same as the OG app). SMS is ~80c.
        </p>
        <Label className="text-[12px] text-white/80">SA cell number</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="082 123 4567"
          inputMode="tel"
          className="border-white/20 bg-white/10 text-white"
        />
        {profile.phone && (
          <div className="text-[11px] text-amber-200/80">Linked {prettyPhone(profile.phone)} · unique to this QXio ID</div>
        )}
      </Card>
      <Card>
        <Label className="text-[12px] text-white/80">Display name</Label>
        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="border-white/20 bg-white/10 text-white" />
        <Label className="pt-1 text-[12px] text-white/80">Mood message</Label>
        <Input value={mood} onChange={(e) => setMood(e.target.value)} maxLength={80} className="border-white/20 bg-white/10 text-white" />
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {MOODS.map((m) => (
            <button
              key={m.code}
              type="button"
              title={m.label}
              onClick={async () => {
                await updateProfile({ data: { mood_code: m.code, mood: m.label, presence: m.presence } });
                setMood(m.label);
                await refresh();
              }}
              className={`flex items-center justify-center rounded-lg border p-1.5 ${profile.mood_code === m.code ? "border-white/50 bg-white/15" : "border-white/10"}`}
            >
              <MoodIcon code={m.code} size={22} />
            </button>
          ))}
        </div>
        <Label className="pt-1 text-[12px] text-white/80">Farewell (sent on logout)</Label>
        <Textarea value={farewell} onChange={(e) => setFarewell(e.target.value)} rows={2} className="border-white/20 bg-white/10 text-white" />
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Pixel avatar</div>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_SEEDS.map((s) => (
            <button key={s} type="button" onClick={() => setAvatarSeed(s)} className={`rounded p-1 ${avatarSeed === s ? "bg-amber-400/30 ring-1 ring-amber-300" : "bg-white/5"}`}>
              <PixelAvatar seed={s} size={40} />
            </button>
          ))}
        </div>
      </Card>
      <Button
        onClick={async () => {
          await updateProfile({ data: { display_name: displayName, mood, farewell, avatar_seed: avatarSeed, zone, phone } });
          await refresh();
          toast.success("Profile saved");
        }}
        className="w-full"
      >
        Save profile
      </Button>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Achievements</div>
        <div className="flex flex-wrap gap-2 text-[12px]">
          {["welcome", "first_chat", "first_friend", "daily", "status", "raid"].map((code) => (
            <span key={code} className={`rounded border px-2 py-1 ${ach.some((a) => a.code === code) ? "border-amber-300/40 bg-amber-400/20 text-amber-100" : "border-white/10 text-white/40"}`}>
              {code.replace("_", " ")}
            </span>
          ))}
        </div>
      </Card>
    </ChromeInner>
  );
}

function SettingsView({ onBack }: { onBack: () => void }) {
  const { profile, refresh } = useMxit();
  const navigate = useNavigate();
  const [killOpen, setKillOpen] = useState(false);
  const [killPhrase, setKillPhrase] = useState("");
  const [killing, setKilling] = useState(false);
  if (!profile) return null;
  return (
    <ChromeInner title="Settings" onBack={onBack}>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Skinz</div>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={async () => {
                await updateProfile({ data: { theme: t.id } });
                await refresh();
              }}
              className={`flex items-center gap-2 rounded-xl border px-2 py-2 ${profile.theme === t.id ? "border-white/50 bg-white/15" : "border-white/10"}`}
            >
              <span className="h-4 w-4 rounded-full" style={{ background: t.swatch }} />
              <span className="text-[13px]">{t.name}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Display mode</div>
        {(["normal", "light", "dark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={async () => {
              await updateProfile({ data: { display_mode: m } });
              await refresh();
            }}
            className={`mr-2 mt-1 rounded border px-3 py-1 text-sm capitalize ${profile.display_mode === m ? "border-white/40 bg-white/15" : "border-white/10"}`}
          >
            {m}
          </button>
        ))}
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <span>Sound</span>
          <Switch checked={profile.sound_enabled} onCheckedChange={async (v) => { await updateProfile({ data: { sound_enabled: v } }); await refresh(); }} />
        </div>
        <div className="flex items-center justify-between">
          <span>Hide offline</span>
          <Switch checked={profile.hide_offline} onCheckedChange={async (v) => { await updateProfile({ data: { hide_offline: v } }); await refresh(); }} />
        </div>
        <div className="flex items-center justify-between">
          <span>Read receipts</span>
          <Switch checked={profile.read_receipts} onCheckedChange={async (v) => { await updateProfile({ data: { read_receipts: v } }); await refresh(); }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Message alerts
          </span>
          <Switch
            checked={profile.notify_push !== false}
            onCheckedChange={async (v) => {
              if (v) await requestPushPermission();
              await updateProfile({ data: { notify_push: v } });
              await refresh();
            }}
          />
        </div>
        <p className="text-[11px] text-white/50">Get a banner when someone messages you, even if QXio is in the background.</p>
      </Card>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-teal-200" /> Cheap airtime · GPRS
          </span>
          <Switch
            checked={!!profile.airtime_gprs}
            onCheckedChange={async (v) => {
              await updateProfile({ data: { airtime_gprs: v } });
              await refresh();
            }}
          />
        </div>
        <p className="text-[11px] text-white/50">
          No bundle, a bit of airtime: tiny packets over GPRS — about 1–2c to Vodacom/MTN/Cell C, same as the OG app. QXio is free. Pictures stay off.
        </p>
      </Card>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Signal className="h-4 w-4 text-amber-300" /> SMS last resort
          </span>
          <Switch
            checked={!!profile.airtime_sms}
            onCheckedChange={async (v) => {
              await updateProfile({ data: { airtime_sms: v } });
              await refresh();
            }}
          />
        </div>
        <p className="text-[11px] text-white/50">
          Only if there is no packet radio. Network SMS is still ~80c — the expensive path the OG app escaped. Prefer GPRS.
        </p>
      </Card>
      <Button variant="destructive" className="w-full" onClick={() => void signOut()}>
        <LogOut className="h-4 w-4" /> Logout
      </Button>
      {profile.is_admin ? (
        <Card>
          <div className="text-[12px] font-medium uppercase opacity-80">Operator</div>
          <p className="text-[12px] text-white/65">Private. Nobody else sees this.</p>
          <Button
            className="w-full"
            onClick={() => {
              sfx.tap();
              void navigate({ to: "/hq", search: {} });
            }}
          >
            <Shield className="h-4 w-4" /> Open QXio HQ
          </Button>
        </Card>
      ) : null}
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">Get QXio on a phone</div>
        <p className="text-[12px] text-white/65">Add to Home Screen today. Play Store and App Store: Menu → Get QXio for listing copy and screenshots.</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              sfx.tap();
              openPhoneInstall("ios");
            }}
          >
            <Smartphone className="h-4 w-4" /> iPhone
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              sfx.tap();
              openPhoneInstall("android");
            }}
          >
            Android
          </Button>
        </div>
        <Button variant="secondary" className="w-full" onClick={() => navigate({ to: "/get" })}>
          Store kit — listing & screenshots
        </Button>
      </Card>
      <Card>
        <a href="/legal/privacy" className="block text-[13px] underline">Privacy</a>
        <a href="/legal/terms" className="block text-[13px] underline">Terms</a>
        <a href="/legal/support" className="block text-[13px] underline">Support</a>
        <a href="/legal/delete" className="block text-[13px] underline">Delete account</a>
      </Card>
      <Button variant="destructive" className="w-full" onClick={() => setKillOpen(true)}>
        <Trash2 className="h-4 w-4" /> Delete my QXio ID
      </Button>
      <Dialog open={killOpen} onOpenChange={() => setKillOpen(false)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Delete this QXio ID?</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-white/70">
            Messages, contacts, Moola and games go with it. Type DELETE to confirm. You cannot undo this.
          </p>
          <Input
            value={killPhrase}
            onChange={(e) => setKillPhrase(e.target.value)}
            placeholder="DELETE"
            className="border-white/20 bg-white/10 text-white"
            aria-label="Type DELETE"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setKillOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              disabled={killing}
              onClick={async () => {
                if (killPhrase.trim().toUpperCase() !== "DELETE") {
                  toast.error("Type DELETE to confirm");
                  return;
                }
                setKilling(true);
                try {
                  await deleteAccount();
                  toast.success("Account deleted");
                  await signOut("/");
                } catch (e: unknown) {
                  setKilling(false);
                  toast.error(e instanceof Error ? e.message : "Could not delete");
                }
              }}
            >
              {killing ? "Deleting…" : "Delete forever"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ChromeInner>
  );
}

function HelpView({ onBack }: { onBack: () => void }) {
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(isStandaloneApp());
  }, []);
  return (
    <ChromeInner title="Help" onBack={onBack}>
      <Card>
        <div className="text-[13px] font-semibold">QXio v1.9</div>
        <p className="text-[13px] text-white/80">A blast from the past — contacts, zones, GPRS airtime, QX Mix, Moola, QX Post and Moonbase, rebuilt for phones. Public site qxio.live.</p>
      </Card>
      <Card>
        <RatesCard />
      </Card>
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">No bundle? Same as the OG app</div>
        <p className="text-[13px] text-white/80">
          The OG app didn't use SMS. It sent tiny packets over GPRS, billed from airtime — about 1–2c to the network. QXio does that too.
        </p>
        <ul className="list-disc space-y-1 pl-4 text-[13px] text-white/80">
          <li>You need reception and a little airtime. No data bundle.</li>
          <li>In chat, tap the radio: Data (free) → GPRS (~1–2c) → SMS (~80c).</li>
          <li>GPRS is text only, 400 characters, one small packet.</li>
          <li>Install QXio to the home screen so you are not downloading the app over airtime — only the messages.</li>
          <li>SMS is last resort if the packet radio is fully off.</li>
        </ul>
      </Card>
      {!installed && (
        <Card>
          <div className="text-[12px] font-medium uppercase opacity-80">Install on your phone</div>
          <p className="text-[13px] text-white/80">
            QXio installs to your home screen like a native app — glossy list, soft-keys, full screen. Add it from your browser now. Play Store and App Store listings use this same app after you publish.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              className="w-full"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("ios");
              }}
            >
              iPhone
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("android");
              }}
            >
              Android
            </Button>
          </div>
          <p className="text-[11px] text-white/50">iPhone: Share → Add to Home Screen. Android: menu → Install app / Add to Home screen.</p>
        </Card>
      )}
      <Card>
        <div className="text-[12px] font-medium uppercase opacity-80">How to QXio</div>
        <ul className="list-disc space-y-1 pl-4 text-[13px] text-white/80">
          <li>Your QXio ID is unique and locked. Nobody else can claim it.</li>
          <li>Send and receive is free on a bundle. Rooms too. Moola is for extras only.</li>
          <li>No bundle: tap radio for GPRS (~1–2c airtime), same as the OG app. SMS is ~80c last resort.</li>
          <li>Long-press a bubble to copy, reply or delete. Long-press a friend to Challenge them to Chess, Connect 4 or Tic-Tac-Toe.</li>
          <li>Menu → Invite a friend to copy your unique ID, share, or SMS it.</li>
          <li>Zones: CT, Jozi, Durbs — filter the list or jump into the room.</li>
          <li>In chat: photos, voice notes, and typing dots.</li>
          <li>QX Post Games: Moonbase, Chess, Skip-Bo, Connect 4, Tic-Tac-Toe — all free.</li>
          <li>Turn on Message alerts in Settings for push when someone pings you.</li>
        </ul>
      </Card>
      <Card>
        <a href="/legal/terms" className="block text-[13px] underline">Terms</a>
        <a href="/legal/privacy" className="block text-[13px] underline">Privacy</a>
        <a href="/legal/support" className="block text-[13px] underline">Support</a>
        <a href="/legal/delete" className="block text-[13px] underline">Delete account</a>
        <a href="/get" className="block text-[13px] underline">Get QXio on your phone</a>
      </Card>
    </ChromeInner>
  );
}

export { MoodIcon, orbClass };
