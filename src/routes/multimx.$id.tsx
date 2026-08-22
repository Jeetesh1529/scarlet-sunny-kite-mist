import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ChatLog, Composer } from "@/components/mxit/ChatLog";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { useMxit } from "@/components/mxit/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadGroup, sendGroup } from "@/lib/mxit/fns";
import type { ChatMessage, MultiMxGroup } from "@/lib/mxit/types";
import { useVisiblePoll } from "@/lib/mxit/use-visible-poll";

export const Route = createFileRoute("/multimx/$id")({ component: GroupChat });

function GroupChat() {
  const { id } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  const [group, setGroup] = useState<MultiMxGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const reload = useCallback(async () => {
    const r = await loadGroup({ data: id });
    setGroup(r.group);
    setMessages((prev) => {
      if (prev.length === r.messages.length && prev.at(-1)?.id === r.messages.at(-1)?.id) return prev;
      return r.messages;
    });
  }, [id]);
  useVisiblePoll(reload, 5000, [id, reload]);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile || !group) return <div className="flex-1" />;

  return (
    <Screen>
      <Titlebar title={group.name} left={<BackBtn to="/multimx" />} right={<span className="text-[11px]">{group.member_count}</span>} />
      <ChatLog messages={messages} meId={profile.id} showNames />
      <Composer
        onSend={async (msg) => {
          const r = await sendGroup({ data: { groupId: id, content: msg.content, kind: msg.kind, media: msg.media } });
          setGroup(r.group);
          setMessages(r.messages);
        }}
      />
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/multimx", replace: true })}>Back</button>} />
    </Screen>
  );
}
