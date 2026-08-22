import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Copy, Download, Smartphone, TabletSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Screen, Titlebar } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, SITE_ORIGIN } from "@/lib/brand";
import { openPhoneInstall, promptAndroidInstall, subscribeInstallPrompt } from "@/lib/install";
import { STORE, STORE_SHOTS } from "@/lib/mxit/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/get")({ component: GetQxio });

function copy(label: string, text: string) {
  sfx.tap();
  void navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied`),
    () => toast.message(text),
  );
}

function GetQxio() {
  const navigate = useNavigate();
  const [showFull, setShowFull] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [androidOpen, setAndroidOpen] = useState(false);

  useEffect(() => {
    const off = subscribeInstallPrompt((e) => setCanInstall(!!e));
    if (typeof window !== "undefined" && window.location.hash === "#android") setAndroidOpen(true);
    return off;
  }, []);

  const installAndroid = async () => {
    sfx.tap();
    const ok = await promptAndroidInstall();
    if (ok) {
      toast.success("QXio is on your home screen");
      return;
    }
    setAndroidOpen(true);
    toast.message("Chrome menu → Install app / Add to Home screen");
  };

  return (
    <Screen>
      <Titlebar title="Get QXio" />
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-white">
        <div className="flex flex-col items-center text-center">
          <div className="qx-logo-tile mb-3 flex h-16 w-16 items-center justify-center">
            <img src="/qx-mark.svg" alt="" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-[26px] font-semibold">{APP_NAME}</h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-200/70">{APP_TAGLINE}</p>
          <p className="mt-1 text-[12px] text-cyan-100/70">{SITE_ORIGIN.replace("https://", "")}</p>
          <p className="mt-2 max-w-[34ch] text-[13px] text-white/75">{STORE.short}</p>
        </div>

        <section className="space-y-2 rounded-xl border border-white/15 bg-white/8 p-3">
          <div className="text-[12px] font-medium uppercase text-white/70">On your phone today</div>
          <p className="text-[13px] text-white/80">
            Add QXio to the home screen. Full screen, own icon, no browser chrome. This is live now — iPhone and Android.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-11"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("ios");
              }}
            >
              <Smartphone className="h-4 w-4" /> iPhone
            </Button>
            <Button id="android" className="h-11" onClick={() => void installAndroid()}>
              <TabletSmartphone className="h-4 w-4" /> Android
            </Button>
          </div>
          {canInstall && (
            <Button
              className="h-11 w-full"
              onClick={() => void installAndroid()}
            >
              <Download className="h-4 w-4" /> Install QXio
            </Button>
          )}
          <p className="text-[11px] text-white/50">iPhone: Share → Add to Home Screen.</p>
          {androidOpen && (
            <ol className="list-decimal space-y-1 pl-4 text-[13px] text-white/80">
              <li>Open QXio in Chrome on the phone.</li>
              <li>Tap the ⋮ menu (top right).</li>
              <li>Tap Install app or Add to Home screen.</li>
              <li>QXio lands next to WhatsApp. Open it from there.</li>
            </ol>
          )}
        </section>

        <section className="space-y-2 rounded-xl border border-amber-300/25 bg-amber-400/10 p-3">
          <div className="text-[12px] font-medium uppercase text-amber-100">Play Store and App Store</div>
          <p className="text-[13px] text-white/85">
            I cannot log into Google Play or App Store Connect from here — those are your accounts. After you Publish QXio
            and point {SITE_ORIGIN.replace("https://", "")} at it, paste that link plus the copy and screenshots below.
          </p>
          <ul className="space-y-1.5 text-[13px] text-white/80">
            <Row ok label="Privacy, terms, support, delete-account URLs" />
            <Row ok label="14+ age gate on signup" />
            <Row ok label="No ads, no paid Moola" />
            <Row ok label="Listing copy, data-safety answers, screenshots" />
            <Row ok label="Android package za.qxio.app · iOS bundle za.qxio.app" />
          </ul>
          <p className="text-[11px] text-white/55">
            Google Play developer registration is a one-time fee. Apple Developer Programme is yearly. Play wraps the
            published site as a Trusted Web Activity. App Store needs the same listing plus your developer login.
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-white/15 bg-white/8 p-3">
          <div className="text-[12px] font-medium uppercase text-white/70">Store screenshots</div>
          <p className="text-[12px] text-white/60">Phone 9:16 — drop these into Play Console and App Store Connect.</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {STORE_SHOTS.map((s) => (
              <a key={s.src} href={s.src} className="w-24 shrink-0">
                <img src={s.src} alt={s.label} className="h-44 w-24 rounded-lg border border-white/15 object-cover" />
                <div className="mt-1 truncate text-center text-[10px] text-white/55">{s.label}</div>
              </a>
            ))}
          </div>
          <a href="/store/feature.png" className="block">
            <img src="/store/feature.png" alt="Play feature graphic" className="w-full rounded-lg border border-white/15" />
            <div className="mt-1 text-[10px] text-white/55">Play feature graphic · 1024×500</div>
          </a>
        </section>

        <section className="space-y-2 rounded-xl border border-white/15 bg-white/8 p-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-medium uppercase text-white/70">Listing copy</div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] text-cyan-200"
              onClick={() => copy("Listing", `${STORE.name}\n${STORE.subtitle}\n${STORE.short}\n\n${STORE.full}`)}
            >
              <Copy className="h-3.5 w-3.5" /> Copy all
            </button>
          </div>
          <Field label="Name" value={STORE.name} />
          <Field label="Subtitle" value={STORE.subtitle} />
          <Field label="Short" value={STORE.short} />
          <div>
            <button type="button" className="text-[11px] text-cyan-200 underline" onClick={() => setShowFull((v) => !v)}>
              {showFull ? "Hide description" : "Show full description"}
            </button>
            {showFull && <p className="mt-2 whitespace-pre-wrap text-[12px] text-white/75">{STORE.full}</p>}
          </div>
          <Field label="Play category" value={STORE.categoryPlay} />
          <Field label="App Store category" value={STORE.categoryIos} />
          <Field label="Age" value={STORE.age} />
          <Field label="In-app purchases" value={STORE.iap} />
          <Field label="Ads" value={STORE.ads} />
          <Field label="Android package" value={STORE.packageAndroid} />
          <Field label="iOS bundle ID" value={STORE.bundleIos} />
        </section>

        <section className="space-y-2 rounded-xl border border-white/15 bg-white/8 p-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-medium uppercase text-white/70">Play data safety</div>
            <button
              type="button"
              className="text-[11px] text-cyan-200"
              onClick={() => copy("Data safety", STORE.dataSafety.join("\n"))}
            >
              <Copy className="inline h-3.5 w-3.5" /> Copy
            </button>
          </div>
          <button type="button" className="text-[11px] text-cyan-200 underline" onClick={() => setShowSafety((v) => !v)}>
            {showSafety ? "Hide answers" : "Show answers for the form"}
          </button>
          {showSafety && (
            <ul className="list-disc space-y-1 pl-4 text-[12px] text-white/75">
              {STORE.dataSafety.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <div className="pt-1">
            <div className="text-[10px] uppercase tracking-wide text-white/45">Review notes</div>
            <p className="text-[12px] text-white/75">{STORE.reviewNotes}</p>
            <button
              type="button"
              className="mt-1 text-[11px] text-cyan-200"
              onClick={() => copy("Review notes", STORE.reviewNotes)}
            >
              Copy notes
            </button>
          </div>
        </section>

        <section className="space-y-1 rounded-xl border border-white/15 bg-white/8 p-3 text-[13px]">
          <a className="block underline" href="/legal/privacy">
            Privacy policy
          </a>
          <a className="block underline" href="/legal/terms">
            Terms
          </a>
          <a className="block underline" href="/legal/delete">
            Delete account
          </a>
          <a className="block underline" href="/legal/support">
            Support
          </a>
        </section>

        <Button variant="secondary" className="w-full" onClick={() => navigate({ to: "/" })}>
          Open QXio
        </Button>
      </div>
    </Screen>
  );
}

function Row({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? "text-emerald-300" : "text-white/30"}`} />
      <span>{label}</span>
    </li>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-white/45">{label}</div>
        <div className="text-[13px] text-white/90">{value}</div>
      </div>
      <button type="button" aria-label={`Copy ${label}`} onClick={() => copy(label, value)}>
        <Copy className="h-3.5 w-3.5 text-white/50" />
      </button>
    </div>
  );
}
