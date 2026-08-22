import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, ListRow, Screen, Softkeys, Titlebar, WatermarkList } from "@/components/mxit/chrome";
import { Emoticon } from "@/components/mxit/Emoticon";
import { useMxit } from "@/components/mxit/provider";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { EMOTICONS } from "@/lib/emoticons";
import { buyEmoticard, listRooms, spendMoola, updateProfile } from "@/lib/mxit/fns";
import { THEMES, type Chatroom } from "@/lib/mxit/types";
import { MOOLA_EXTRAS } from "@/lib/mxit/rates";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/tradepost/$slug")({ component: TradepostSlug });

const SIGNS = [
  ["Aries", "Bold week. Send the message you've been sitting on."],
  ["Taurus", "Treat yourself — but maybe not 400 Moola on Skinz."],
  ["Gemini", "Two chats, one brain. QX Mix is calling."],
  ["Cancer", "A farewell message would land tonight."],
  ["Leo", "Main character in the Cape Town room. Obviously."],
  ["Virgo", "Clean your contact list. Offline lurkers can wait."],
  ["Libra", "Gift 25 Moola. Balance restored."],
  ["Scorpio", "Someone read your status twice. You know who."],
  ["Sagittarius", "Raid Moonbase. Fortune favours gunships."],
  ["Capricorn", "Daily claim first. Then vibes."],
  ["Aquarius", "A new QXio ID just searched for you."],
  ["Pisces", "The 2007 chatrooms miss you too."],
] as const;

const CITIES = [
  { city: "Cape Town", t: 18, s: "SE wind, Table cloth incoming" },
  { city: "Johannesburg", t: 16, s: "Highveld clear, jacket after 6" },
  { city: "Durban", t: 24, s: "Humid, late thunderstorm" },
  { city: "Pretoria", t: 17, s: "Jacarandas in the imagination" },
  { city: "Port Elizabeth", t: 19, s: "Windy as always" },
  { city: "Bloemfontein", t: 14, s: "Dry and honest" },
];

function TradepostSlug() {
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const { profile, refresh } = useMxit();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Chatroom[]>([]);
  const [sign, setSign] = useState<string | null>(null);
  const [roomsReady, setRoomsReady] = useState(false);
  useEffect(() => {
    if (slug !== "chatrooms") return;
    setRoomsReady(false);
    void listRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setRoomsReady(true));
  }, [slug]);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const title =
    slug === "chatrooms" ? "Chat Rooms" :
    slug === "games" ? "Games" :
    slug === "horoscopes" ? "Horoscopes" :
    slug === "weather" ? "Weather" :
    slug === "skinz" ? "Skinz" :
    slug === "emoticards" ? "Emoticards" : "QX Post";

  return (
    <Screen>
      <Titlebar title={title} left={<BackBtn to="/tradepost" />} />
      <WatermarkList>
        {slug === "chatrooms" && !roomsReady && (
          <div className="px-4 py-6 text-[13px] text-white/60">Loading rooms…</div>
        )}
        {slug === "chatrooms" && roomsReady && rooms.length === 0 && (
          <div className="px-4 py-6 text-[13px] text-white/60">No rooms yet — pull to come back later.</div>
        )}
        {slug === "chatrooms" &&
          rooms.map((r) => (
            <ListRow
              key={r.id}
              onClick={() => {
                sfx.tap();
                navigate({ to: "/room/$id", params: { id: r.id } });
              }}
              leading={<span className="status-orb orb-online" />}
              trailing={<span className="text-[11px] text-emerald-300/90">FREE · {r.member_count}</span>}
            >
              {r.name}
              <span className="block truncate text-[11px] font-normal text-white/60">{r.last_message || r.topic}</span>
            </ListRow>
          ))}

        {slug === "games" && (
          <>
            <ListRow leading={<span className="status-orb orb-online" />} onClick={() => { sfx.tap(); navigate({ to: "/games/moonbase" }); }}>
              Moonbase
              <span className="block text-[11px] font-normal text-white/60">Build, train, raid · free</span>
            </ListRow>
            <ListRow leading={<span className="status-orb orb-online" />} onClick={() => { sfx.tap(); navigate({ to: "/games/tictactoe" }); }}>
              Tic-Tac-Toe
              <span className="block text-[11px] font-normal text-white/60">Vs the house · or challenge a friend</span>
            </ListRow>
            <ListRow leading={<span className="status-orb orb-online" />} onClick={() => { sfx.tap(); navigate({ to: "/games/connect4" }); }}>
              Connect 4
              <span className="block text-[11px] font-normal text-white/60">Vs the house · or challenge a friend</span>
            </ListRow>
            <ListRow leading={<span className="status-orb orb-online" />} onClick={() => { sfx.tap(); navigate({ to: "/games/chess" }); }}>
              Chess
              <span className="block text-[11px] font-normal text-white/60">Vs the house · or challenge a friend</span>
            </ListRow>
            <ListRow leading={<span className="status-orb orb-online" />} onClick={() => { sfx.tap(); navigate({ to: "/games/skipbo" }); }}>
              Skip-Bo
              <span className="block text-[11px] font-normal text-white/60">Empty your stock pile · free</span>
            </ListRow>
          </>
        )}

        {slug === "horoscopes" &&
          SIGNS.map(([name, line]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                sfx.tap();
                setSign(sign === name ? null : name);
              }}
              className="w-full px-4 py-2 text-left text-white"
            >
              <div className="font-medium">{name}</div>
              {(sign === name || sign === null) && (
                <div className="text-[13px] text-white/70">{line}</div>
              )}
            </button>
          ))}

        {slug === "weather" &&
          CITIES.map((c) => (
            <div key={c.city} className="flex items-center justify-between px-4 py-2 text-white">
              <div>
                <div className="font-medium">{c.city}</div>
                <div className="text-[12px] text-white/60">{c.s}</div>
              </div>
              <div className="font-pixel text-[12px]">{c.t}°</div>
            </div>
          ))}

        {slug === "skinz" &&
          THEMES.map((t) => (
            <ListRow
              key={t.id}
              leading={<span className="h-6 w-6 rounded-full border border-white/30" style={{ background: t.swatch }} />}
              onClick={async () => {
                try {
                  if (profile && profile.theme !== t.id && t.id !== "classic") {
                    await spendMoola({ data: { amount: MOOLA_EXTRAS.skinz, reason: `Skinz · ${t.name}` } });
                  }
                  await updateProfile({ data: { theme: t.id } });
                  await refresh();
                  toast.success(`${t.name} applied`);
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : `Need ${MOOLA_EXTRAS.skinz} Moola`);
                }
              }}
            >
              {t.name}
              <span className="block text-[11px] font-normal text-white/60">{t.id === "classic" ? "free" : `${MOOLA_EXTRAS.skinz} Moola`}</span>
            </ListRow>
          ))}

        {slug === "emoticards" && (
          <div className="grid grid-cols-6 gap-2 px-4 py-3">
            {EMOTICONS.map((e) => (
              <button
                key={e.code}
                type="button"
                className="flex aspect-square items-center justify-center rounded-md bg-white/10"
                onClick={async () => {
                  try {
                    const r = await buyEmoticard({ data: e.code });
                    await refresh();
                    toast.success(r.already ? `Already in your pack` : `Unlocked ${e.label}`);
                  } catch (e2: unknown) {
                    toast.error(e2 instanceof Error ? e2.message : `Need ${MOOLA_EXTRAS.emoticard} Moola`);
                  }
                }}
              >
                <Emoticon code={e.code} size={28} />
              </button>
            ))}
          </div>
        )}
      </WatermarkList>
      <Softkeys
        left={
          <button type="button" onClick={() => navigate({ to: "/tradepost" })}>
            Back
          </button>
        }
        right={<Button className="h-7 bg-white/10 text-xs" onClick={() => navigate({ to: "/moola" })}>Moola</Button>}
      />
    </Screen>
  );
}
