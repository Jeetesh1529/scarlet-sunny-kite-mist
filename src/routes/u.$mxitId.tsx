import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { MoodIcon, orbClass } from "@/components/mxit/MoodIcon";
import { PixelAvatar } from "@/components/mxit/PixelAvatar";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addContact, getPublicProfile, giftMoola, openChat } from "@/lib/mxit/fns";
import type { PublicProfile } from "@/lib/mxit/types";
import { zoneById } from "@/lib/mxit/zones";
import { prettyPhone } from "@/lib/sms";

export const Route = createFileRoute("/u/$mxitId")({ component: ProfilePage });

function ProfilePage() {
  const { mxitId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [p, setP] = useState<PublicProfile | null>(null);
  useEffect(() => {
    void getPublicProfile({ data: mxitId }).then(setP).catch(() => setP(null));
  }, [mxitId]);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  if (!p) {
    return (
      <Screen>
        <Titlebar title="Profile" left={<BackBtn />} />
        <div className="p-4 text-white/70">User not found.</div>
      </Screen>
    );
  }
  const zone = zoneById(p.zone);
  return (
    <Screen>
      <Titlebar title={p.display_name} left={<BackBtn />} right={<span className={orbClass(p.presence)} />} />
      <div className="flex flex-1 flex-col items-center gap-3 p-6 text-white">
        <PixelAvatar seed={p.avatar_seed} size={88} ring />
        <div className="flex items-center gap-2 text-[13px] text-white/80">
          @{p.mxit_id}
          <span className="rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-200">unique</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <MoodIcon code={p.mood_code} size={22} />
          {p.mood}
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold">
          {zone.short} · {zone.label}
        </div>
        {p.phone && (
          <div className="rounded-full bg-amber-400/15 px-3 py-1 text-[12px] font-semibold text-amber-100">
            SMS fallback · {prettyPhone(p.phone)}
          </div>
        )}
        <div className="flex gap-2">
          {p.contact_status !== "accepted" && (
            <Button
              onClick={async () => {
                try {
                  await addContact({ data: p.mxit_id });
                  toast.success("Request sent");
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              Add
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={async () => {
              const { id } = await openChat({ data: p.id });
              navigate({ to: "/chat/$id", params: { id } });
            }}
          >
            Chat
          </Button>
          {p.contact_status === "accepted" && (
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await giftMoola({ data: { otherId: p.id, amount: 25 } });
                  toast.success("Sent 25 Moola");
                } catch (e: unknown) {
                  toast.error(e instanceof Error ? e.message : "Gift failed");
                }
              }}
            >
              Gift 25
            </Button>
          )}
        </div>
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}
