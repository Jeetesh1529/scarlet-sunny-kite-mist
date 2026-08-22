import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { MoodIcon, orbClass } from "@/components/mxit/MoodIcon";
import { PixelAvatar } from "@/components/mxit/PixelAvatar";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addContact, meetPeople } from "@/lib/mxit/fns";
import type { PublicProfile } from "@/lib/mxit/types";
import { zoneById } from "@/lib/mxit/zones";

export const Route = createFileRoute("/meet")({ component: Meet });

function Meet() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [people, setPeople] = useState<PublicProfile[]>([]);
  useEffect(() => {
    void meetPeople().then(setPeople).catch(() => {});
  }, []);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Meet" left={<BackBtn />} />
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-white">
        {people.length === 0 && <div className="text-[13px] text-white/60">Everyone you could meet is already on your list. Bring a friend.</div>}
        {people.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
            <PixelAvatar seed={p.avatar_seed} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-medium">
                {p.display_name}
                <MoodIcon code={p.mood_code} size={16} />
              </div>
              <div className="truncate text-[12px] text-white/60">
                @{p.mxit_id} · {zoneById(p.zone).short} · {p.mood}
              </div>
            </div>
            <span className={orbClass(p.presence)} />
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await addContact({ data: p.mxit_id });
                  toast.success("Added");
                  setPeople((list) => list.filter((x) => x.id !== p.id));
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              Add
            </Button>
          </div>
        ))}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}
