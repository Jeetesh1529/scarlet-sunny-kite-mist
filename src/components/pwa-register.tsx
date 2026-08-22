import { useEffect } from "react";
import { captureInstallPrompt, shouldRegisterServiceWorker } from "@/lib/install";

/** Captures Android Chrome's install prompt. Service worker only on the published host so preview HMR stays live. */
export function PwaRegister() {
  useEffect(() => {
    const stop = captureInstallPrompt();
    if (shouldRegisterServiceWorker() && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
    return stop;
  }, []);
  return null;
}
