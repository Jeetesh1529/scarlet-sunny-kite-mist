import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Coins, Gamepad2, Store, Users } from "lucide-react";
import { BackBtn, ListRow, Screen, Softkeys, Titlebar, WatermarkList } from "@/components/mxit/chrome";
import { useMxit } from "@/components/mxit/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/portal/$app")({ component: Portal });

const APPS = [
  { name: "Moola Hub", sub: "Chat is free · extras via Moola", icon: Coins, to: "/moola" },
  { name: "QX Post", sub: "The mall", icon: Store, to: "/tradepost" },
  { name: "Moonbase", sub: "Banker's favourite time-sink", icon: Gamepad2, to: "/games/moonbase" },
  { name: "QX Mix", sub: "Private groups", icon: Users, to: "/multimx" },
];

function Portal() {
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="QX Banker" left={<BackBtn />} right={<span className="text-[11px] text-amber-200">{profile?.moola ?? 0} M</span>} />
      <WatermarkList>
        <div className="px-3 pb-2 text-[11px] italic text-white/60">
          QX Banker — apps, banker bot, Moola. Same corner of the list it always was.
        </div>
        {APPS.map((a) => {
          const Icon = a.icon;
          return (
            <ListRow
              key={a.name}
              leading={
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10">
                  <Icon className="h-4 w-4 text-white" />
                </span>
              }
              onClick={() => {
                sfx.tap();
                navigate({ href: a.to });
              }}
            >
              {a.name}
              <span className="block text-[11px] font-normal text-white/60">{a.sub}</span>
            </ListRow>
          );
        })}
      </WatermarkList>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}
