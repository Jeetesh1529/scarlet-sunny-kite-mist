import avatarsImg from "@/assets/avatars.png";
import { AVATAR_COLS, AVATAR_ROWS, avatarTile } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarProps {
  seed?: string | null;
  url?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
  idle?: boolean;
  online?: boolean;
}

export function PixelAvatar({ seed, url, size = 40, className, ring, idle, online }: AvatarProps) {
  const animClass = idle ? "animate-avatar-idle" : "";
  const wrap = (inner: React.ReactNode) => (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      {inner}
      {online && (
        <span
          className="absolute -bottom-0.5 -right-0.5 block rounded-full bg-mxit-online ring-2 ring-card animate-pulse-soft"
          style={{ width: Math.max(8, size * 0.25), height: Math.max(8, size * 0.25) }}
          aria-hidden
        />
      )}
    </span>
  );

  if (url) {
    return wrap(
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        className={cn("block rounded-md object-cover", ring && "ring-2 ring-white/40", animClass)}
        style={{ width: size, height: size }}
      />,
    );
  }
  const { col, row } = avatarTile(seed);
  const sheetW = size * AVATAR_COLS;
  const sheetH = size * AVATAR_ROWS;
  return wrap(
    <span
      role="img"
      aria-label="avatar"
      className={cn("inline-block overflow-hidden rounded-md bg-white/10", ring && "ring-2 ring-white/40", animClass)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${avatarsImg})`,
        backgroundSize: `${sheetW}px ${sheetH}px`,
        backgroundPosition: `-${col * size}px -${row * size}px`,
        imageRendering: "pixelated",
      }}
    />,
  );
}
