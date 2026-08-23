import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Smartphone, TabletSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Screen, Titlebar } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, SITE_ORIGIN } from "@/lib/brand";
import { openPhoneInstall, promptAndroidInstall, subscribeInstallPrompt } from "@/lib/install";
import { STORE } from "@/lib/mxit/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/get")({ component: GetQxio });

function GetQxio() {
  const navigate = useNavigate();
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
          <div className="text-[12px] font-medium uppercase text-white/70">Add QXio to your phone</div>
          <p className="text-[13px] text-white/80">
            Install QXio on your home screen — full screen, own icon, no browser bar. Works on iPhone and Android.
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
            <Button className="h-11 w-full" onClick={() => void installAndroid()}>
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
