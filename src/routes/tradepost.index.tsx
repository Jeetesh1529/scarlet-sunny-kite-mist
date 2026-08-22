import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  CloudSun,
  Coins,
  Gamepad2,
  Grid3x3,
  MessageCircle,
  MessagesSquare,
  Music,
  Palette,
  Sparkles,
  Stars,
  Store,
  Users,
} from "lucide-react";
import { BackBtn, ListRow, Screen, Softkeys, Titlebar, WatermarkList } from "@/components/mxit/chrome";
import { useMxit } from "@/components/mxit/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { sfx } from "@/lib/sfx";
import { MOOLA_EXTRAS } from "@/lib/mxit/rates";

export const Route = createFileRoute("/tradepost/")({ component: Tradepost });

const SERVICES = [
  { name: "Chat Rooms", desc: "FREE · CT · Jozi · Durbs", icon: MessagesSquare, to: "/tradepost/chatrooms", cost: 0 },
  { name: "Games", desc: "Moonbase · Chess · Skip-Bo · Connect 4", icon: Gamepad2, to: "/tradepost/games", cost: 0 },
  { name: "Music Room", desc: "Drop a track, drop a mood", icon: Music, to: "/music", cost: 0 },
  { name: "Horoscopes", desc: "What's in the stars today", icon: Stars, to: "/tradepost/horoscopes", cost: 0 },
  { name: "Weather", desc: "Mzansi cities", icon: CloudSun, to: "/tradepost/weather", cost: 0 },
  { name: "Skinz", desc: "Colour themes for your QXio", icon: Palette, to: "/tradepost/skinz", cost: MOOLA_EXTRAS.skinz },
  { name: "Emoticards", desc: "Classic sticker shop", icon: Sparkles, to: "/tradepost/emoticards", cost: MOOLA_EXTRAS.emoticard },
  { name: "Confessions", desc: "Anonymous, 2007-style", icon: MessageCircle, to: "/confessions", cost: 0 },
  { name: "Polls", desc: "Vote with the nation", icon: BarChart3, to: "/polls", cost: 0 },
  { name: "Meet", desc: "Find someone new", icon: Users, to: "/meet", cost: 0 },
  { name: "Tic-Tac-Toe", desc: "Vs the house", icon: Grid3x3, to: "/games/tictactoe", cost: 0 },
] as const;

function Tradepost() {
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <Screen>
      <Titlebar
        title="QX Post"
        left={<BackBtn />}
        right={
          <span className="flex items-center gap-1 text-[11px] text-amber-200">
            <Coins className="h-3 w-3" /> {profile?.moola ?? 0}
          </span>
        }
      />
      <WatermarkList>
        <div className="px-3 pb-2 text-[11px] italic text-white/60">
          Chat, rooms and games are free. Spend Moola only on extras — Emoticards and Skinz.
        </div>
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <ListRow
              key={s.name}
              onClick={() => {
                sfx.tap();
                navigate({ href: s.to });
              }}
              leading={
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white">
                  <Icon className="h-4 w-4" />
                </span>
              }
              trailing={
                <span className="flex items-center gap-1">
                  {s.cost > 0 ? (
                    <span className="mr-1 flex items-center gap-0.5 text-[10px] text-amber-200">
                      <Coins className="h-3 w-3" /> {s.cost}
                    </span>
                  ) : (
                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90">Free</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </span>
              }
            >
              {s.name}
              <span className="block truncate text-[11px] font-normal text-white/60">{s.desc}</span>
            </ListRow>
          );
        })}
      </WatermarkList>
      <Softkeys
        left={
          <button type="button" onClick={() => navigate({ to: "/" })}>
            Back
          </button>
        }
        right={
          <span className="flex items-center gap-1 text-[12px]">
            <Store className="h-3.5 w-3.5" /> Mall
          </span>
        }
      />
    </Screen>
  );
}
