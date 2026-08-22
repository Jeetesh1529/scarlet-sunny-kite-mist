import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackBtn, ListRow, Screen, Softkeys, Titlebar, WatermarkList } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createGroup, listContacts, listGroups } from "@/lib/mxit/fns";
import type { ContactRow, MultiMxGroup } from "@/lib/mxit/types";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/multimx/")({ component: MultiMx });

function MultiMx() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<MultiMxGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    void listGroups().then(setGroups).catch(() => {});
    void listContacts().then(setContacts).catch(() => {});
  }, []);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <Screen>
      <Titlebar title="QX Mix" left={<BackBtn />} />
      <WatermarkList>
        <div className="px-3 pb-2 text-[11px] italic text-white/60">Private groups. Classic QXio, minus the 160-char tax.</div>
        {groups.length === 0 && <div className="px-4 py-6 text-[13px] text-white/60">No groups yet. Tap New.</div>}
        {groups.map((g) => (
          <ListRow
            key={g.id}
            leading={<span className="status-orb orb-online" />}
            trailing={<span className="text-[11px] text-white/60">{g.member_count}</span>}
            onClick={() => {
              sfx.tap();
              navigate({ to: "/multimx/$id", params: { id: g.id } });
            }}
          >
            {g.name}
          </ListRow>
        ))}
      </WatermarkList>
      <Softkeys
        left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>}
        right={
          <button type="button" onClick={() => setOpen(true)}>
            New
          </button>
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>New QX Mix</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="border-white/20 bg-white/10 text-white" />
          <div className="mt-2 max-h-40 overflow-y-auto text-sm">
            {contacts
              .filter((c) => c.status === "accepted")
              .map((c) => (
                <label key={c.other.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={picked.includes(c.other.id)}
                    onChange={(e) =>
                      setPicked((p) => (e.target.checked ? [...p, c.other.id] : p.filter((x) => x !== c.other.id)))
                    }
                  />
                  {c.other.display_name}
                </label>
              ))}
          </div>
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              try {
                const r = await createGroup({ data: { name, memberIds: picked } });
                setOpen(false);
                navigate({ to: "/multimx/$id", params: { id: r.id } });
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
