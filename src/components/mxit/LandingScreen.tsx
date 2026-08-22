import { useNavigate } from "@tanstack/react-router";
import { Gamepad2, MapPin, MessageCircle, Radio, Smartphone, TabletSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, SITE_ORIGIN } from "@/lib/brand";
import { isStandaloneApp, openPhoneInstall, promptAndroidInstall, subscribeInstallPrompt } from "@/lib/install";
import { STORE, STORE_SHOTS } from "@/lib/mxit/store";
import { sfx } from "@/lib/sfx";
import { AuthScreen } from "./AuthScreen";
import { AppSplash } from "./chrome";

export function LandingScreen() {
  const navigate = useNavigate();
  const [androidOpen, setAndroidOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [gate, setGate] = useState<"check" | "web" | "app">("check");

  useEffect(() => {
    setGate(isStandaloneApp() ? "app" : "web");
    return subscribeInstallPrompt((e) => setCanInstall(!!e));
  }, []);

  if (gate === "check") return <AppSplash />;
  if (gate === "app") return <AuthScreen />;

  const goSignup = () => {
    sfx.tap();
    void navigate({ to: "/login", search: { intent: "signup" } });
  };
  const goLogin = () => {
    sfx.tap();
    void navigate({ to: "/login" });
  };

  return (
    <div className="qx-auth relative z-[1] min-h-0 flex-1 overflow-y-auto">
      <div className="qx-auth-orb qx-auth-orb-a" aria-hidden />
      <div className="qx-auth-orb qx-auth-orb-b" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-16 pt-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="qx-logo-tile flex h-9 w-9 items-center justify-center">
              <img src="/qx-mark.svg" alt="" className="h-5 w-5 object-contain" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white">{APP_NAME}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">{SITE_ORIGIN.replace("https://", "")}</div>
            </div>
          </div>
          <button type="button" onClick={goLogin} className="min-h-11 px-2 text-[13px] font-medium text-white/80">
            Sign in
          </button>
        </header>

        <section className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-200/70">{APP_TAGLINE}</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-white">
            Chat is free.
            <span className="block text-cyan-100/90">Rooms still packed.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[36ch] text-[15px] leading-relaxed text-white/75">
            South African messenger. Unique QXio ID, Cape Town / Jozi / Durbs, games you challenge a friend to. No ads.
            No paid Moola.
          </p>
          <div className="mt-5 grid gap-2">
            <Button className="h-12 w-full rounded-xl bg-white text-[15px] font-semibold text-[#0A1B3D] hover:bg-white/92" onClick={goSignup}>
              Create my ID
            </Button>
            <p className="text-[12px] text-white/50">14 or older. Takes a minute. Your ID is unique forever.</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-white/50">Inside the app</div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {STORE_SHOTS.map((s) => (
              <figure key={s.src} className="w-[148px] shrink-0">
                <img
                  src={s.src}
                  alt={s.label}
                  className="h-[262px] w-[148px] rounded-2xl border border-white/15 object-cover shadow-[0_16px_40px_hsl(220_80%_8%/0.45)]"
                />
                <figcaption className="mt-1.5 text-center text-[11px] text-white/55">{s.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <Feature icon={MessageCircle} title="Free chat" body="Send and receive on a data bundle costs nothing. Copy, reply, delete. Photos and voice notes." />
          <Feature icon={MapPin} title="CT, Jozi, Durbs" body="Zone rooms that feel occupied — who's in here, last line of chat, not a dead topic." />
          <Feature icon={Gamepad2} title="Challenge a friend" body="Chess, Connect 4, Tic-Tac-Toe land in chat. Moonbase and Skip-Bo vs the house. All free." />
          <Feature icon={Radio} title="Light on data" body="Lean mode sends text-only in tiny packets. No data at all? SMS fallback rides your phone's Messages (network SMS rate)." />
        </section>

        <section className="mt-8 space-y-2 rounded-2xl border border-white/15 bg-white/8 p-4">
          <div className="text-[12px] font-medium uppercase text-white/70">Put it on the home screen</div>
          <p className="text-[13px] text-white/75">Own icon, full screen. Works today while Play Store and App Store listings go live.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="h-11"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("ios");
              }}
            >
              <Smartphone className="h-4 w-4" /> iPhone
            </Button>
            <Button
              variant="secondary"
              className="h-11"
              onClick={async () => {
                sfx.tap();
                const ok = await promptAndroidInstall();
                if (!ok) setAndroidOpen(true);
              }}
            >
              <TabletSmartphone className="h-4 w-4" /> Android
            </Button>
          </div>
          {canInstall && (
            <Button className="h-11 w-full" onClick={() => void promptAndroidInstall()}>
              Install QXio
            </Button>
          )}
          {androidOpen && (
            <p className="text-[12px] text-white/70">Chrome on Android: ⋮ menu → Install app / Add to Home screen.</p>
          )}
        </section>

        <footer className="mt-10 space-y-3 text-center text-[12px] text-white/50">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a className="underline" href="/legal/privacy">
              Privacy
            </a>
            <a className="underline" href="/legal/terms">
              Terms
            </a>
            <a className="underline" href="/legal/support">
              Support
            </a>
            <a className="underline" href="/legal/delete">
              Delete account
            </a>
          </div>
          <p>
            {SITE_ORIGIN.replace("https://", "")} · {STORE.age} · no ads · {STORE.iap.split("—")[0]?.trim()}
          </p>
        </footer>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof MessageCircle;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/12 bg-white/6 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[14px] font-semibold text-white">{title}</div>
        <p className="mt-0.5 text-[13px] leading-snug text-white/70">{body}</p>
      </div>
    </div>
  );
}
