import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { PixelAvatar } from "@/components/mxit/PixelAvatar";
import { EmoText } from "@/components/mxit/Emoticon";
import { useMxit } from "@/components/mxit/provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listStatuses, postStatus, viewStatus } from "@/lib/mxit/fns";
import type { StatusItem } from "@/lib/mxit/types";

export const Route = createFileRoute("/status")({ component: StatusPage });

const BGS = ["#0A2A5E", "#1E78D6", "#2E9F4D", "#E04B98", "#111111", "#7C3AED", "#F59E0B", "#DC2626"];

function StatusPage() {
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  const [items, setItems] = useState<StatusItem[]>([]);
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [bg, setBg] = useState(BGS[0]!);
  const [view, setView] = useState<StatusItem | null>(null);

  const reload = () => listStatuses().then(setItems).catch(() => {});
  useEffect(() => {
    void reload();
  }, []);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  const mine = items.filter((s) => s.author_id === profile?.id);
  const others = items.filter((s) => s.author_id !== profile?.id);

  return (
    <Screen>
      <Titlebar title="Status" left={<BackBtn />} />
      <div className="min-h-0 flex-1 overflow-y-auto p-3 text-white">
        <button type="button" onClick={() => setOpen(true)} className="mb-3 w-full rounded-md border border-dashed border-white/30 py-6 text-sm text-white/70">
          Post a 24h status
        </button>
        {mine[0] && (
          <div className="mb-3 text-[12px] text-white/50">Yours · {mine.length} · {mine[0].views} views</div>
        )}
        <div className="space-y-2">
          {others.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={async () => {
                setView(s);
                await viewStatus({ data: s.id });
              }}
              className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/5 p-2 text-left"
            >
              <PixelAvatar seed={s.author_seed} size={40} />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{s.author_name}</div>
                <div className="truncate text-[12px] text-white/60">
                  <EmoText text={s.caption ?? ""} size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} right={<button type="button" onClick={() => setOpen(true)}>New</button>} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/20 text-white" style={{ background: bg }}>
          <DialogHeader>
            <DialogTitle>New status</DialogTitle>
          </DialogHeader>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={4} className="border-white/20 bg-black/20 text-white" placeholder="What's the vibe" />
          <div className="mt-2 flex gap-2">
            {BGS.map((c) => (
              <button key={c} type="button" onClick={() => setBg(c)} className="h-6 w-6 rounded-full border border-white/40" style={{ background: c }} />
            ))}
          </div>
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              try {
                await postStatus({ data: { caption, background: bg } });
                setOpen(false);
                setCaption("");
                void reload();
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          >
            Post
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent className="min-h-48 border-white/20 text-white" style={{ background: view?.background ?? "#0A2A5E" }}>
          <div className="font-medium">{view?.author_name}</div>
          <div className="mt-4 text-lg leading-snug">
            <EmoText text={view?.caption ?? ""} size={22} />
          </div>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
