import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { heartConfession, listConfessions, postConfession } from "@/lib/mxit/fns";
import type { Confession } from "@/lib/mxit/types";
import { hhmm } from "@/lib/utils";

export const Route = createFileRoute("/confessions")({ component: Confessions });

function Confessions() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [items, setItems] = useState<Confession[]>([]);
  const [body, setBody] = useState("");
  const reload = () => listConfessions().then(setItems).catch(() => {});
  useEffect(() => {
    void reload();
  }, []);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Confessions" left={<BackBtn to="/tradepost" />} />
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 text-white">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Anonymous. Be kind." className="border-white/20 bg-white/10 text-white" />
        <Button
          onClick={async () => {
            try {
              await postConfession({ data: body });
              setBody("");
              void reload();
            } catch (e: unknown) {
              toast.error(e instanceof Error ? e.message : "Failed");
            }
          }}
        >
          Post anonymous
        </Button>
        {items.map((c) => (
          <div key={c.id} className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-sm leading-relaxed">{c.body}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
              <span>{hhmm(c.created_at)}</span>
              <button
                type="button"
                onClick={async () => {
                  await heartConfession({ data: c.id });
                  void reload();
                }}
              >
                {c.hearts} hearts
              </button>
            </div>
          </div>
        ))}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost" })}>Back</button>} />
    </Screen>
  );
}
