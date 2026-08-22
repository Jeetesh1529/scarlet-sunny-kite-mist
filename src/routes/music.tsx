import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { playChiptune, sfx, stopMusic } from "@/lib/sfx";

export const Route = createFileRoute("/music")({ component: MusicRoom });

const TRACKS = [
  { t: "Mabhida Nights", a: "Jozi FM tribute", bpm: 108 },
  { t: "Sea Point Drift", a: "CT lounge", bpm: 92 },
  { t: "Airtime Anthem", a: "Feature-phone era", bpm: 124 },
  { t: "Load Shedding Lullaby", a: "Candlelight mix", bpm: 76 },
  { t: "Chatroom 2007", a: "Nostalgia pack", bpm: 118 },
];

function MusicRoom() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [on, setOn] = useState<number | null>(null);
  useEffect(() => () => stopMusic(), []);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Music Room" left={<BackBtn to="/tradepost" />} />
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-white">
        <p className="text-[12px] text-white/60">
          Chiptune radio — tap a track, tap again to stop. Same energy as waiting for a 16kbps ringtone.
        </p>
        {TRACKS.map((tr, i) => (
          <button
            key={tr.t}
            type="button"
            onClick={() => {
              sfx.tap();
              if (on === i) {
                stopMusic();
                setOn(null);
                return;
              }
              playChiptune(tr.bpm, i + 1);
              setOn(i);
            }}
            className={`min-h-14 w-full rounded-md border px-3 py-3 text-left ${on === i ? "border-amber-300/40 bg-amber-400/10" : "border-white/10 bg-white/5"}`}
          >
            <div className="font-medium">{tr.t}</div>
            <div className="text-[12px] text-white/60">
              {tr.a} · {tr.bpm} bpm {on === i ? "· playing — tap to stop" : "· tap to play"}
            </div>
          </button>
        ))}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost" })}>Back</button>} />
    </Screen>
  );
}
