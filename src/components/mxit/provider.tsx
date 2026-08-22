import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, sendDirect, updateProfile } from "@/lib/mxit/fns";
import type { Presence, Profile } from "@/lib/mxit/types";
import { flushAirtimeQueue } from "@/lib/sms-queue";
import { radioOnline } from "@/lib/sms";
import { setSoundEnabled } from "@/lib/sfx";

type Ctx = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setPresence: (p: Presence) => Promise<void>;
  patch: (p: Partial<Profile>) => void;
};

const MxitCtx = createContext<Ctx | null>(null);

export function MxitProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const p = await getMyProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [isPending, user, refresh]);

  useEffect(() => {
    if (!profile) return;
    const run = () => {
      if (!radioOnline()) return;
      void flushAirtimeQueue(async (item) => {
        await sendDirect({
          data: { convId: item.convId, content: item.content, channel: item.channel === "gprs" ? "gprs" : "sms" },
        });
      });
    };
    run();
    window.addEventListener("online", run);
    return () => window.removeEventListener("online", run);
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    document.documentElement.setAttribute("data-theme", profile.theme || "classic");
    document.documentElement.setAttribute("data-mode", profile.display_mode || "normal");
    setSoundEnabled(profile.sound_enabled);
  }, [profile]);

  const setPresence = useCallback(async (p: Presence) => {
    const next = await updateProfile({ data: { presence: p } });
    setProfile(next);
  }, []);

  const patch = useCallback((p: Partial<Profile>) => {
    setProfile((cur) => (cur ? { ...cur, ...p } : cur));
  }, []);

  const value = useMemo(
    () => ({ profile, loading: loading || isPending, refresh, setPresence, patch }),
    [profile, loading, isPending, refresh, setPresence, patch],
  );

  return <MxitCtx.Provider value={value}>{children}</MxitCtx.Provider>;
}

export function useMxit() {
  const ctx = useContext(MxitCtx);
  if (!ctx) throw new Error("useMxit");
  return ctx;
}
