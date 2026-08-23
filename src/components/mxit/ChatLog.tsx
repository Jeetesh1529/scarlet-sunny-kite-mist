import { Antenna, Check, CheckCheck, Copy, Gamepad2, ImagePlus, Mic, Radio, Reply, Send, Smile, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { compressImage, startVoiceNote, voiceSupported } from "@/lib/media";
import { GPRS_LIMIT, nextRadioMode, type RadioMode } from "@/lib/gprs";
import { AIRTIME_COST_HINT, DATA_CHAT_HINT, GPRS_COST_HINT } from "@/lib/mxit/rates";
import { challengeLabel, challengePath, parseChallenge } from "@/lib/mxit/challenge";
import type { ChatMessage } from "@/lib/mxit/types";
import { SMS_LIMIT } from "@/lib/sms";
import { sfx } from "@/lib/sfx";
import { cn, hhmm } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmoText } from "./Emoticon";
import { EmoticonPicker } from "./EmoticonPicker";
import { PixelAvatar } from "./PixelAvatar";

export function TypingDots({ name }: { name?: string }) {
  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-card px-3 py-2.5 shadow-sm ring-1 ring-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-1" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-2" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-3" />
      </div>
      {name && <span className="pb-1 text-[10px] text-slate-400">{name} is typing</span>}
    </div>
  );
}

function VoiceBubble({ src, mine }: { src: string; mine: boolean }) {
  return (
    <div className={cn("flex min-w-[180px] items-center gap-2", mine ? "text-white" : "text-slate-700")}>
      <audio controls src={src} className="h-8 max-w-[210px]" />
    </div>
  );
}

export function ChatLog({
  messages,
  meId,
  showNames,
  typing,
  typingName,
  onReply,
  onDelete,
}: {
  messages: ChatMessage[];
  meId: string;
  showNames?: boolean;
  typing?: boolean;
  typingName?: string;
  onReply?: (m: ChatMessage) => void;
  onDelete?: (m: ChatMessage) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const lastId = messages.at(-1)?.id;
  const [act, setAct] = useState<ChatMessage | null>(null);
  const navigate = useNavigate();
  const longTimer = useRef<number | null>(null);
  const didLong = useRef(false);
  useEffect(() => {
    if (!nearBottom.current) return;
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, typing, lastId]);
  return (
    <div
      ref={ref}
      onScroll={() => {
        const el = ref.current;
        if (!el) return;
        nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
      }}
      className="mxit-chatlog min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3"
    >
      {messages.map((m) => {
        const isMe = m.sender_id === meId;
        const kind = m.kind || "text";
        const isNew = m.id === lastId || m.id.startsWith("tmp-");
        const gone = !!m.deleted;
        const ch = kind === "challenge" && !gone ? parseChallenge(m.content) : null;
        return (
          <div key={m.id} className={cn("flex gap-2", isNew && "animate-fade-up", isMe ? "justify-end" : "justify-start")}>
            {!isMe && <PixelAvatar seed={m.sender_seed} size={28} className="mt-auto" />}
            <div className={cn("flex max-w-[78%] flex-col", isMe ? "items-end" : "items-start")}>
              {showNames && !isMe && m.sender_name && (
                <div className="mb-0.5 px-1 text-[11px] font-medium text-sky-700">{m.sender_name}</div>
              )}
              <div
                role="button"
                tabIndex={0}
                data-kind={kind}
                data-msgid={m.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!gone) setAct(m);
                }}
                onPointerDown={() => {
                  didLong.current = false;
                  if (longTimer.current) window.clearTimeout(longTimer.current);
                  longTimer.current = window.setTimeout(() => {
                    didLong.current = true;
                    if (!gone) setAct(m);
                    sfx.tap();
                  }, 450);
                }}
                onPointerUp={() => {
                  if (longTimer.current) window.clearTimeout(longTimer.current);
                }}
                onPointerCancel={() => {
                  if (longTimer.current) window.clearTimeout(longTimer.current);
                }}
                onClick={() => {
                  if (didLong.current) {
                    didLong.current = false;
                    return;
                  }
                  if (ch) {
                    sfx.tap();
                    void navigate({ href: `${challengePath(ch.game)}?match=${ch.matchId}` });
                  }
                }}
                className={cn(
                  "relative break-words px-3 py-2 text-[14px] leading-snug",
                  isMe
                    ? "rounded-2xl rounded-br-md bg-mxit-bubble-me text-white mxit-shadow-pop"
                    : "rounded-2xl rounded-bl-md bg-mxit-bubble-them text-foreground mxit-shadow-pop ring-1 ring-black/5",
                  kind === "image" && !gone && "overflow-hidden p-1",
                  gone && "italic opacity-70",
                )}
              >
                {m.reply_preview && !gone && (
                  <div className={cn("mb-1 truncate rounded-md border-l-2 px-2 py-0.5 text-[11px]", isMe ? "border-white/50 bg-white/15" : "border-sky-400 bg-sky-50 text-sky-800")}>
                    {m.reply_preview}
                  </div>
                )}
                {gone ? (
                  "Message deleted"
                ) : ch ? (
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 shrink-0" />
                    <span>
                      <span className="font-semibold">{challengeLabel(ch.game)} challenge</span>
                      <span className="block text-[11px] opacity-80">Tap to play</span>
                    </span>
                  </span>
                ) : kind === "image" && m.media ? (
                  <>
                    <img src={m.media} alt="" className="max-h-52 max-w-full rounded-xl object-cover" />
                    {m.content && !/^📷/.test(m.content) && (
                      <div className="px-2 py-1.5">
                        <EmoText text={m.content} size={18} />
                      </div>
                    )}
                  </>
                ) : kind === "voice" && m.media ? (
                  <VoiceBubble src={m.media} mine={isMe} />
                ) : (
                  <EmoText text={m.content} size={20} />
                )}
              </div>
              <div className={cn("mt-0.5 flex items-center gap-1 px-1 text-[10px] text-muted-foreground", isMe && "flex-row-reverse")}>
                <span>{hhmm(m.created_at)}</span>
                {m.channel === "gprs" && (
                  <span className="inline-flex items-center gap-0.5 font-semibold uppercase tracking-wide text-teal-700">
                    <Radio className="h-2.5 w-2.5" /> gprs · lean
                  </span>
                )}
                {m.channel === "sms" && (
                  <span className="inline-flex items-center gap-0.5 font-semibold uppercase tracking-wide text-amber-600">
                    <Antenna className="h-2.5 w-2.5" /> sms · 80c
                  </span>
                )}
                {isMe && (m.delivery === "read" ? <CheckCheck className="h-3 w-3 text-mxit-glow" /> : <Check className="h-3 w-3" />)}
              </div>
            </div>
          </div>
        );
      })}
      {typing && <TypingDots name={typingName} />}
      <Dialog open={!!act} onOpenChange={() => setAct(null)}>
        <DialogContent className="mxit-presence-dialog border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Button
              onClick={async () => {
                if (!act || act.deleted) return;
                try {
                  await navigator.clipboard.writeText(act.content);
                  toast.success("Copied");
                } catch {
                  toast.message(act.content);
                }
                setAct(null);
              }}
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
            {onReply && (
              <Button
                variant="secondary"
                onClick={() => {
                  if (act && !act.deleted) onReply(act);
                  setAct(null);
                }}
              >
                <Reply className="h-4 w-4" /> Reply
              </Button>
            )}
            {act && act.sender_id === meId && onDelete && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (act) onDelete(act);
                  setAct(null);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type ComposerSend = {
  content: string;
  kind?: "text" | "image" | "voice";
  media?: string | null;
  channel?: "data" | "gprs" | "sms";
  replyTo?: string | null;
};

export function Composer({
  onSend,
  onTyping,
  radio = "data",
  onRadioChange,
  offline = false,
  reply,
  onClearReply,
}: {
  onSend: (msg: ComposerSend) => Promise<void>;
  onTyping?: () => void;
  radio?: RadioMode;
  onRadioChange?: (v: RadioMode) => void;
  offline?: boolean;
  reply?: { id: string; preview: string } | null;
  onClearReply?: () => void;
}) {
  const [text, setText] = useState("");
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recSec, setRecSec] = useState<number | null>(null);
  const recRef = useRef<{ stop: () => Promise<string>; cancel: () => void } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tickRef = useRef<number | null>(null);
  const lean = radio === "gprs" || radio === "sms";
  const limit = radio === "sms" ? SMS_LIMIT : radio === "gprs" ? GPRS_LIMIT : undefined;

  const send = async (payload: ComposerSend) => {
    sfx.send();
    await onSend(payload);
  };

  const sendText = async () => {
    const t = text.trim();
    if (!t || busy) return;
    if (radio === "sms" && t.length > SMS_LIMIT) {
      toast.error(`Airtime SMS is ${SMS_LIMIT} characters — one text, no pictures`);
      return;
    }
    if (radio === "gprs" && t.length > GPRS_LIMIT) {
      toast.error(`GPRS packets are ${GPRS_LIMIT} characters — tiny, like the OG app`);
      return;
    }
    setText("");
    try {
      await send({ content: t, kind: "text", channel: radio, replyTo: reply?.id });
      onClearReply?.();
    } catch {
      setText((cur) => cur || t);
    }
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file || busy) return;
    setBusy(true);
    try {
      const media = await compressImage(file);
      await send({ content: "📷 photo", kind: "image", media });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not send photo");
    } finally {
      setBusy(false);
    }
  };

  const toggleRec = async () => {
    if (recRef.current) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      setBusy(true);
      try {
        const media = await recRef.current.stop();
        recRef.current = null;
        setRecSec(null);
        await send({ content: "🎤 voice note", kind: "voice", media });
      } catch (e: unknown) {
        recRef.current = null;
        setRecSec(null);
        toast.error(e instanceof Error ? e.message : "Voice note failed");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!voiceSupported()) {
      toast.error("Voice notes need a microphone");
      return;
    }
    try {
      recRef.current = await startVoiceNote();
      setRecSec(0);
      const started = Date.now();
      tickRef.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - started) / 1000);
        setRecSec(s);
        if (s >= 15) {
          if (tickRef.current) window.clearInterval(tickRef.current);
          tickRef.current = null;
          void toggleRec();
        }
      }, 250);
    } catch {
      toast.error("Mic permission denied");
    }
  };

  return (
    <div className="relative shrink-0 border-t border-border bg-card px-2 py-2">
      {reply && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-1.5 text-[12px] text-sky-800">
          <Reply className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{reply.preview}</span>
          <button type="button" aria-label="Cancel reply" onClick={() => onClearReply?.()}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {picker && (
        <EmoticonPicker
          onPick={(code) => setText((s) => s + code)}
          onClose={() => setPicker(false)}
        />
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          void pickPhoto(f);
        }}
      />
      {recSec !== null && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          Recording {recSec}s / 15s
        </div>
      )}
      {radio === "gprs" && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-1.5 text-[11px] text-teal-800">
          <Radio className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">
            {offline ? "Offline — this will queue and send (as lean data) when you're back on a connection." : GPRS_COST_HINT}
          </span>
          <span className={`font-mono ${text.length > GPRS_LIMIT ? "text-rose-600" : "text-teal-700/80"}`}>
            {text.length}/{GPRS_LIMIT}
          </span>
        </div>
      )}
      {radio === "sms" && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800">
          <Antenna className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">
            {offline ? "No data — SMS is the fallback. Your network charges its SMS rate (~80c). It sends over your phone's Messages app." : AIRTIME_COST_HINT}
          </span>
          <span className={`font-mono ${text.length > SMS_LIMIT ? "text-rose-600" : "text-amber-700/80"}`}>
            {text.length}/{SMS_LIMIT}
          </span>
        </div>
      )}
      {radio === "data" && (
        <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700/80">
          <span>{DATA_CHAT_HINT}</span>
          <span className="font-medium normal-case tracking-normal text-slate-400">No Moola · send & receive</span>
        </div>
      )}
      <div className="flex items-end gap-1.5">
        <button
          type="button"
          onClick={() => {
            sfx.tap();
            setPicker((v) => !v);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50"
          aria-label="Emoticons"
        >
          <Smile className="h-5 w-5" />
        </button>
        {onRadioChange && (
          <button
            type="button"
            onClick={() => {
              sfx.tap();
              const next = nextRadioMode(radio);
              onRadioChange(next);
              toast.message(
                next === "gprs"
                  ? "Lean mode on · text-only, minimal data"
                  : next === "sms"
                    ? "SMS fallback · ~80c, works with no data"
                    : "Data chat · FREE",
              );
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              radio === "gprs"
                ? "bg-teal-500 text-white"
                : radio === "sms"
                  ? "bg-amber-500 text-white"
                  : "text-sky-600 hover:bg-sky-50",
            )}
            aria-label="Radio mode"
            title="Cycle: data (free) → lean (low data) → SMS (~80c, no data needed)"
          >
            {radio === "sms" ? <Antenna className="h-5 w-5" /> : <Radio className="h-5 w-5" />}
          </button>
        )}
        {!lean && (
        <button
          type="button"
          onClick={() => {
            sfx.tap();
            fileRef.current?.click();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50"
          aria-label="Picture"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        )}
        <textarea
          value={text}
          onChange={(e) => {
            const v = limit ? e.target.value.slice(0, limit) : e.target.value;
            setText(v);
            if (radio === "data") onTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void sendText();
            }
          }}
          rows={1}
          maxLength={limit}
          placeholder={radio === "gprs" ? "GPRS packet…" : radio === "sms" ? "SMS last resort…" : "Message…"}
          className="max-h-24 min-h-10 flex-1 resize-none rounded-2xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
        />
        {text.trim() || lean ? (
          <button
            type="button"
            onClick={() => void sendText()}
            disabled={busy || !text.trim()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white disabled:opacity-40",
              radio === "gprs" ? "bg-teal-500" : radio === "sms" ? "bg-amber-500" : "bg-sky-500",
            )}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void toggleRec()}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              recSec !== null ? "bg-rose-500 text-white" : "text-sky-600 hover:bg-sky-50",
            )}
            aria-label={recSec !== null ? "Stop recording" : "Voice note"}
          >
            {recSec !== null ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
