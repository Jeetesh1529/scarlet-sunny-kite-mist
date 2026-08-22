import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ChatLog, Composer } from "@/components/mxit/ChatLog";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { useMxit } from "@/components/mxit/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadRoom, sendRoom, deleteMessage } from "@/lib/mxit/fns";
import type { ChatMessage, Chatroom } from "@/lib/mxit/types";
import { useVisiblePoll } from "@/lib/mxit/use-visible-poll";

export const Route = createFileRoute("/room/$id")({ component: RoomPage });

function RoomPage() {
  const { id } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Chatroom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [here, setHere] = useState<string[]>([]);
  const [reply, setReply] = useState<{ id: string; preview: string } | null>(null);

  const reload = useCallback(async () => {
    const r = await loadRoom({ data: id });
    setRoom(r.room);
    setHere(r.here ?? []);
    setMessages((prev) => {
      if (prev.length === r.messages.length && prev.at(-1)?.id === r.messages.at(-1)?.id) return prev;
      return r.messages;
    });
  }, [id]);
  useVisiblePoll(reload, 5000, [id, reload]);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile || !room) return <div className="flex-1" />;

  return (
    <Screen>
      <Titlebar
        title={room.name}
        left={<BackBtn to="/tradepost" />}
        right={<span className="text-[11px] text-emerald-200">FREE · {room.member_count} here</span>}
      />
      {room.topic && <div className="px-3 py-1 text-[11px] text-white/70">{room.topic}</div>}
      {here.length > 0 && (
        <div className="truncate px-3 pb-1 text-[11px] text-amber-100/80">
          In here: {here.slice(0, 6).join(", ")}
          {here.length > 6 ? ` +${here.length - 6}` : ""}
        </div>
      )}
      <ChatLog
        messages={messages}
        meId={profile.id}
        showNames
        onReply={(m) => {
          setReply({
            id: m.id,
            preview: `${m.sender_name || "Someone"}: ${m.content.slice(0, 80)}`,
          });
        }}
        onDelete={async (m) => {
          try {
            await deleteMessage({ data: m.id });
            setMessages((prev) =>
              prev.map((x) => (x.id === m.id ? { ...x, deleted: true, content: "Message deleted", media: null } : x)),
            );
          } catch {
            /* ignore */
          }
        }}
      />
      <Composer
        reply={reply}
        onClearReply={() => setReply(null)}
        onSend={async (msg) => {
          const r = await sendRoom({ data: { roomId: id, content: msg.content, kind: msg.kind, media: msg.media, replyTo: msg.replyTo || null } });
          setRoom(r.room);
          setMessages(r.messages);
          setReply(null);
        }}
      />
      <Softkeys
        left={
          <button type="button" onClick={() => navigate({ to: "/tradepost", replace: true })}>
            Back
          </button>
        }
        right={<span className="text-[11px] opacity-70">Zone</span>}
      />
    </Screen>
  );
}
