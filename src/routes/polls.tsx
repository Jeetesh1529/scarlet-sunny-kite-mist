import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listPolls, votePoll } from "@/lib/mxit/fns";
import type { Poll } from "@/lib/mxit/types";

export const Route = createFileRoute("/polls")({ component: Polls });

function Polls() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const reload = () => listPolls().then(setPolls).catch(() => {});
  useEffect(() => {
    void reload();
  }, []);
  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <Screen>
      <Titlebar title="Polls" left={<BackBtn to="/tradepost" />} />
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 text-white">
        {polls.map((p) => {
          const total = p.votes.reduce((a, b) => a + b, 0) || 1;
          return (
            <div key={p.id} className="rounded-md border border-white/10 bg-white/5 p-3">
              <div className="mb-2 font-medium">{p.question}</div>
              {p.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={async () => {
                    await votePoll({ data: { pollId: p.id, optionIdx: i } });
                    void reload();
                  }}
                  className="mb-1 w-full rounded border border-white/10 px-2 py-1.5 text-left text-sm hover:bg-white/10"
                >
                  <div className="flex justify-between">
                    <span>{opt}</span>
                    <span className="text-white/50">{Math.round((p.votes[i]! / total) * 100)}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-white/10">
                    <div className="h-full bg-mxit-glow" style={{ width: `${(p.votes[i]! / total) * 100}%` }} />
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/tradepost" })}>Back</button>} />
    </Screen>
  );
}
