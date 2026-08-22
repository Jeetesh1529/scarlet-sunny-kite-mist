import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Antenna, Radio } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChatLog, Composer } from "@/components/mxit/ChatLog";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { MoodIcon, orbClass } from "@/components/mxit/MoodIcon";
import { PixelAvatar } from "@/components/mxit/PixelAvatar";
import { useMxit } from "@/components/mxit/provider";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { clipGprs, defaultRadioMode, type RadioMode } from "@/lib/gprs";
import { loadConversation, pollConversation, sendDirect, setTyping, deleteMessage } from "@/lib/mxit/fns";
import type { ChatMessage, ConversationView } from "@/lib/mxit/types";
import { useVisiblePoll } from "@/lib/mxit/use-visible-poll";
import { zoneById } from "@/lib/mxit/zones";
import { enqueueAirtime } from "@/lib/sms-queue";
import { clipSms, openSmsCompose, radioOnline } from "@/lib/sms";
import { sfx } from "@/lib/sfx";
import { nid } from "@/lib/utils";

export const Route = createFileRoute("/chat/$id")({ component: ChatPage });

function mergeIncoming(prev: ChatMessage[], incoming: ChatMessage[], meId: string) {
  if (!incoming.length) return prev;
  const ids = new Set(prev.map((m) => m.id));
  const extras = incoming.filter((m) => !ids.has(m.id));
  if (!extras.length) return prev;
  const extraMine = new Set(extras.filter((m) => m.sender_id === meId).map((m) => m.content));
  const cleaned = prev.filter((m) => !(m.id.startsWith("tmp-") && extraMine.has(m.content)));
  const have = new Set(cleaned.map((m) => m.id));
  return [...cleaned, ...extras.filter((m) => !have.has(m.id))];
}

function ChatPage() {
  const { id } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const { profile } = useMxit();
  const navigate = useNavigate();
  const [data, setData] = useState<ConversationView | null>(null);
  const [offline, setOffline] = useState(() => !radioOnline());
  const [radio, setRadio] = useState<RadioMode>(() =>
    defaultRadioMode({ offline: !radioOnline(), preferGprs: false, preferSms: false }),
  );
  const typingPing = useRef<number>(0);
  const afterId = useRef<string | null>(null);
  const loaded = useRef(false);
  const expectBot = useRef(false);
  const [reply, setReply] = useState<{ id: string; preview: string } | null>(null);
  const meIdRef = useRef(profile?.id ?? "");
  meIdRef.current = profile?.id ?? "";

  useEffect(() => {
    setRadio(
      defaultRadioMode({
        offline: !radioOnline(),
        preferGprs: !!profile?.airtime_gprs,
        preferSms: !!profile?.airtime_sms,
      }),
    );
  }, [profile?.airtime_gprs, profile?.airtime_sms]);

  useEffect(() => {
    const sync = () => {
      const off = !radioOnline();
      setOffline(off);
      if (off) setRadio((r) => (r === "data" ? "sms" : r));
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const pull = useCallback(
    async (full = false) => {
      try {
        if (full || !loaded.current) {
          const view = await loadConversation({ data: id });
          loaded.current = true;
          afterId.current = view.messages.at(-1)?.id ?? null;
          setData(view);
          return;
        }
        const r = await pollConversation({ data: { convId: id, afterId: afterId.current } });
        if (r.messages.length) afterId.current = r.messages.at(-1)!.id;
        setData((d) => {
          if (!d) return d;
          const meId = meIdRef.current;
          const msgs = r.messages.length ? mergeIncoming(d.messages, r.messages, meId) : d.messages;
          if (r.messages.some((m) => m.sender_id !== meId)) expectBot.current = false;
          const typing = r.typing || expectBot.current;
          if (msgs === d.messages && d.typing === typing) return d;
          return { ...d, messages: msgs, typing };
        });
      } catch {
        if (full) navigate({ to: "/" });
      }
    },
    [id, navigate],
  );

  useEffect(() => {
    loaded.current = false;
    afterId.current = null;
    expectBot.current = false;
    setData(null);
    void pull(true);
  }, [id, pull]);

  useVisiblePoll(() => {
    if (!loaded.current) return;
    if (radio === "sms" && offline) return;
    return pull(false);
  }, radio === "gprs" ? 8000 : 2000, [id, pull, radio, offline]);

  if (isPending) return <div className="flex-1" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile || !data) {
    return (
      <div className="mxit-classic-bg flex flex-1 items-center justify-center">
        <div className="text-[13px] text-white/50">opening chat…</div>
      </div>
    );
  }

  const zone = zoneById(data.other.zone);

  return (
    <Screen>
      <Titlebar
        title={data.other.display_name}
        left={<BackBtn />}
        right={
          <button
            type="button"
            onClick={() => {
              sfx.tap();
              navigate({ to: "/u/$mxitId", params: { mxitId: data.other.mxit_id } });
            }}
            className="flex items-center gap-1.5"
          >
            <MoodIcon code={data.other.mood_code} size={18} />
            <span className={orbClass(data.other.presence)} />
          </button>
        }
      />
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
        <PixelAvatar seed={data.other.avatar_seed} size={22} />
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[11px] text-white/75">
          <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide">
            {zone.short}
          </span>
          <span className="shrink-0 text-white/35">·</span>
          <span className="truncate">{data.other.mood || `@${data.other.mxit_id}`}</span>
          {radio === "gprs" ? (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-teal-100">
              <Radio className="h-3 w-3" /> GPRS · 1–2c
            </span>
          ) : radio === "sms" ? (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-100">
              <Antenna className="h-3 w-3" /> SMS · 80c
            </span>
          ) : (
            <span className="ml-auto shrink-0 rounded-full bg-emerald-400/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-emerald-100">
              FREE
            </span>
          )}
        </div>
      </div>
      <ChatLog
        messages={data.messages}
        meId={profile.id}
        typing={!!data.typing}
        typingName={data.other.display_name}
        onReply={(m) => {
          setReply({
            id: m.id,
            preview: `${m.sender_name || (m.sender_id === profile.id ? "You" : data.other.display_name)}: ${m.content.slice(0, 80)}`,
          });
        }}
        onDelete={async (m) => {
          try {
            await deleteMessage({ data: m.id });
            setData((d) =>
              d
                ? {
                    ...d,
                    messages: d.messages.map((x) =>
                      x.id === m.id ? { ...x, deleted: true, content: "Message deleted", media: null } : x,
                    ),
                  }
                : d,
            );
          } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Couldn't delete");
          }
        }}
      />
      <Composer
        radio={radio}
        offline={offline}
        reply={reply}
        onClearReply={() => setReply(null)}
        onRadioChange={setRadio}
        onTyping={() => {
          if (radio !== "data") return;
          const now = Date.now();
          if (now - typingPing.current < 1800) return;
          typingPing.current = now;
          void setTyping({ data: id });
        }}
        onSend={async (msg) => {
          const channel = msg.channel === "gprs" || msg.channel === "sms" ? msg.channel : radio;
          const viaSms = channel === "sms";
          const viaGprs = channel === "gprs";
          const body = viaSms ? clipSms(msg.content) : viaGprs ? clipGprs(msg.content) : msg.content;
          const tempId = `tmp-${nid()}`;
          const optimistic: ChatMessage = {
            id: tempId,
            sender_id: profile.id,
            content: body,
            delivery: "sending",
            created_at: new Date().toISOString(),
            kind: viaSms || viaGprs ? "text" : msg.kind || "text",
            media: viaSms || viaGprs ? null : msg.media || null,
            channel,
            reply_to: msg.replyTo || null,
            reply_preview: reply?.preview ?? null,
          };
          if (channel === "data") expectBot.current = true;
          setData((d) => (d ? { ...d, messages: [...d.messages, optimistic], typing: channel === "data" } : d));
          const fireSms = () => {
            const dest = data.other.phone;
            if (viaSms && dest && !data.other.is_bot) openSmsCompose(dest, body);
          };
          try {
            const saved = await sendDirect({
              data: {
                convId: id,
                content: body,
                kind: viaSms || viaGprs ? "text" : msg.kind,
                media: viaSms || viaGprs ? null : msg.media,
                channel,
                replyTo: msg.replyTo || null,
              },
            });
            afterId.current = saved.id;
            setData((d) => {
              if (!d) return d;
              const next = d.messages.map((m) => (m.id === tempId ? saved : m));
              return { ...d, messages: next, typing: channel === "data" };
            });
            fireSms();
            if (channel !== "sms") {
              window.setTimeout(() => void pull(false), 700);
              window.setTimeout(() => void pull(false), 1600);
            }
          } catch (e: unknown) {
            if (viaSms || viaGprs) {
              enqueueAirtime({ convId: id, content: body, channel: viaGprs ? "gprs" : "sms" });
              fireSms();
              setData((d) => {
                if (!d) return d;
                const next = d.messages.map((m) =>
                  m.id === tempId ? { ...m, delivery: "sent" as const, channel } : m,
                );
                return { ...d, messages: next, typing: false };
              });
              toast.message(
                viaGprs
                  ? "GPRS packet queued — rides airtime (~1–2c) when the radio is up"
                  : data.other.phone
                    ? "On SMS — confirm Send in Messages (~80c)"
                    : "Queued on SMS — hits QXio when you're back",
              );
              return;
            }
            expectBot.current = false;
            setData((d) => (d ? { ...d, messages: d.messages.filter((m) => m.id !== tempId), typing: false } : d));
            toast.error(e instanceof Error ? e.message : "Couldn't send");
            throw e;
          }
        }}
      />
      <Softkeys
        left={
          <button type="button" onClick={() => navigate({ to: "/", replace: true })}>
            Back
          </button>
        }
        right={
          <button type="button" onClick={() => navigate({ to: "/u/$mxitId", params: { mxitId: data.other.mxit_id } })}>
            Profile
          </button>
        }
      />
    </Screen>
  );
}
