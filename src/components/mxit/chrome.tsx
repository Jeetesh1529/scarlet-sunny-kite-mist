import { useNavigate, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mxit-classic-bg flex h-[100dvh] w-full items-stretch justify-center overflow-hidden">
      <div
        className="mxit-classic-bg relative flex w-full max-w-[480px] flex-col overflow-hidden"
        style={{
          height: "100dvh",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Titlebar({
  title,
  left,
  right,
}: {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mxit-titlebar flex h-11 shrink-0 items-center gap-2 px-3">
      <div className="flex min-w-10 items-center">{left}</div>
      <div className="flex-1 text-center text-[15px] font-semibold tracking-wide">{title}</div>
      <div className="flex min-w-10 items-center justify-end">{right}</div>
    </div>
  );
}

export function BackBtn({ to = "/" }: { to?: string }) {
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap();
        if (typeof router.history.canGoBack === "function" && router.history.canGoBack()) {
          router.history.back();
          return;
        }
        void navigate({ to, replace: true });
      }}
      className="rounded-sm border border-white/20 bg-white/10 px-2 py-0.5 text-[11px]"
    >
      ‹ Back
    </button>
  );
}

export function AppSplash() {
  return (
    <div className="mxit-classic-bg flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
      <div className="qx-logo-tile flex h-14 w-14 items-center justify-center">
        <img src="/qx-mark.svg" alt="" className="h-9 w-9 object-contain" />
      </div>
      <div className="h-0.5 w-28 overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-1/2 bg-cyan-300/80 animate-boot-scan" />
      </div>
    </div>
  );
}

export function Softkeys({ left, right, center }: { left?: ReactNode; right?: ReactNode; center?: ReactNode }) {
  return (
    <div className="mxit-softkeys flex h-11 shrink-0 items-stretch text-sm font-medium">
      <div className="flex flex-1 items-center justify-start pl-4">{left}</div>
      {center}
      <div className="flex flex-1 items-center justify-end pr-4">{right}</div>
    </div>
  );
}

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mxit-classic-bg relative flex min-h-0 flex-1 flex-col", className)}>{children}</div>
  );
}

export function WatermarkList({ children }: { children: ReactNode }) {
  return (
    <div className="mxit-watermark relative min-h-0 flex-1 overflow-y-auto">
      <div className="mxit-watermark-mark" aria-hidden />
      <div className="relative z-10 py-2">{children}</div>
    </div>
  );
}

export function ListRow({
  onClick,
  selected,
  children,
  leading,
  trailing,
}: {
  onClick?: () => void;
  selected?: boolean;
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex w-full items-center gap-3 py-1.5 pl-7 pr-3 text-left", selected && "mxit-row-active")}
    >
      {leading}
      <span
        className="min-w-0 flex-1 truncate font-medium tracking-wide text-white"
        style={{ textShadow: "0 1px 0 hsl(220 80% 8% / 0.6)" }}
      >
        {children}
      </span>
      {trailing}
    </button>
  );
}
