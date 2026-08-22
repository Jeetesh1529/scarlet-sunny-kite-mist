import emoticonsImg from "@/assets/emoticons.png";
import { EMOTICON_COLS, EMOTICON_ROWS, EMOTICON_REGEX, findEmoticon } from "@/lib/emoticons";
import { cn } from "@/lib/utils";

export function Emoticon({ code, size = 18, className }: { code: string; size?: number; className?: string }) {
  const e = findEmoticon(code);
  if (!e) return <span>{code}</span>;
  const sheetW = size * EMOTICON_COLS;
  const sheetH = size * EMOTICON_ROWS;
  return (
    <span
      role="img"
      aria-label={e.label}
      className={cn("mx-px inline-block shrink-0 align-text-bottom", className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${emoticonsImg})`,
        backgroundSize: `${sheetW}px ${sheetH}px`,
        backgroundPosition: `-${e.col * size}px -${e.row * size}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

function withMentions(text: string, key: number) {
  const parts = text.split(/(@[A-Za-z0-9_]{2,32})/g);
  return parts.map((p, i) => {
    if (p.startsWith("@")) {
      return (
        <span key={`${key}-m-${i}`} className="rounded bg-mxit-primary/10 px-0.5 font-semibold text-mxit-primary">
          {p}
        </span>
      );
    }
    return (
      <span key={`${key}-t-${i}`} style={{ whiteSpace: "pre-wrap" }}>
        {p}
      </span>
    );
  });
}

export function EmoText({ text, size = 18 }: { text: string; size?: number }) {
  const parts = text.split(EMOTICON_REGEX);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) return <Emoticon key={i} code={part} size={size} />;
        return <span key={i}>{withMentions(part, i)}</span>;
      })}
    </>
  );
}
