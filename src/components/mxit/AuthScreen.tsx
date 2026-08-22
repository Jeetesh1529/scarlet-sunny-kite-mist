import { useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Smartphone, TabletSmartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { AVATAR_SEEDS } from "@/lib/avatars";
import { APP_NAME, APP_TAGLINE, ID_LABEL, SITE_ORIGIN } from "@/lib/brand";
import { isStandaloneApp, openPhoneInstall } from "@/lib/install";
import { checkMxitId, createProfile } from "@/lib/mxit/fns";
import { MOOLA_EXTRAS } from "@/lib/mxit/rates";
import { MOODS } from "@/lib/mxit/types";
import { ZONES, type ZoneId } from "@/lib/mxit/zones";
import { sfx } from "@/lib/sfx";
import { MoodIcon } from "./MoodIcon";
import { PixelAvatar } from "./PixelAvatar";
import { useMxit } from "./provider";

export function AuthScreen({ needsProfile = false, intent }: { needsProfile?: boolean; intent?: "signup" }) {
  const { refresh } = useMxit();
  const navigate = useNavigate();
  const [mode] = useState<"login" | "signup">(needsProfile || intent === "signup" ? "signup" : "login");
  const [step, setStep] = useState<"auth" | "profile">(needsProfile ? "profile" : "auth");
  const [email] = useState("");
  const [password] = useState("");
  const [mxitId, setMxitId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [moodCode, setMoodCode] = useState(":)");
  const [avatarSeed, setAvatarSeed] = useState(AVATAR_SEEDS[0]!);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [zone, setZone] = useState<ZoneId>("ct");
  const [phone, setPhone] = useState("");
  const [over14, setOver14] = useState(false);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [accountReady, setAccountReady] = useState(needsProfile);
  const [idStatus, setIdStatus] = useState<"idle" | "checking" | "ok" | "bad">("idle");
  const [idReason, setIdReason] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setStandalone(isStandaloneApp());
  }, []);

  useEffect(() => {
    const handle = mxitId.trim().toLowerCase();
    if (step !== "profile" && !needsProfile) return;
    if (handle.length < 3) {
      setIdStatus("idle");
      setIdReason(handle ? "3–20 letters, numbers, underscores" : "");
      setSuggestions([]);
      return;
    }
    setIdStatus("checking");
    const t = setTimeout(() => {
      void checkMxitId({ data: handle })
        .then((r) => {
          setIdStatus(r.ok ? "ok" : "bad");
          setSuggestions(r.suggestions);
          setIdReason(
            r.ok
              ? "This ID is yours if you take it"
              : r.reason === "taken"
                ? "Already taken — IDs are unique forever"
                : r.reason === "reserved"
                  ? "Reserved for QXio"
                  : r.reason === "format"
                    ? "3–20 letters, numbers, underscores"
                    : "Pick a QXio ID",
          );
        })
        .catch(() => {
          setIdStatus("bad");
          setIdReason("Could not check ID");
        });
    }, 280);
    return () => clearTimeout(t);
  }, [mxitId, step, needsProfile]);

  const oauth = async (providerId: string) => {
    sfx.tap();
    setOauthBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (e: unknown) {
      sfx.error();
      toast.error(e instanceof Error ? e.message : "Sign-in failed");
      setOauthBusy(null);
    }
  };

  const finishProfile = async () => {
    if (idStatus === "bad") throw new Error(idReason || "That QXio ID is taken");
    const years = parseInt(age, 10);
    if (!Number.isFinite(years) || years < 14) throw new Error("You must be 14 or older");
    if (!over14) throw new Error("Confirm you are 14 or older");
    const mood = MOODS.find((m) => m.code === moodCode);
    const p = await createProfile({
      data: {
        mxitId,
        displayName,
        mood: mood ? `${mood.label} on QXio` : "Hey there! I'm on QXio.",
        moodCode,
        avatarSeed,
        age: years,
        gender: gender || null,
        zone,
        phone: phone || null,
      },
    });
    toast.success(`Welcome to ${APP_NAME}, ${p.display_name}! Chat is free. ${MOOLA_EXTRAS.welcome} Moola added.`, { duration: 2200 });
    await refresh();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    sfx.tap();
    setBusy(true);
    try {
      if (needsProfile || accountReady) {
        await finishProfile();
        return;
      }
      if (mode === "login") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message);
        toast.success("Welcome back!");
        await authClient.getSession().catch(() => {});
        await refresh();
        return;
      }
      if (step === "auth") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        setStep("profile");
        setBusy(false);
        return;
      }
    } catch (err: unknown) {
      sfx.error();
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    sfx.tap();
    setBusy(true);
    try {
      if (idStatus !== "ok") throw new Error(idReason || "Pick a unique QXio ID");
      if (!accountReady) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: displayName.trim() || mxitId,
        });
        if (error) throw new Error(error.message);
        setAccountReady(true);
      }
      await finishProfile();
    } catch (err: unknown) {
      sfx.error();
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "h-11 rounded-xl border-white/15 bg-white/8 text-white placeholder:text-white/35 focus-visible:ring-cyan-300/40";

  return (
    <div className="qx-auth relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="qx-auth-orb qx-auth-orb-a" aria-hidden />
      <div className="qx-auth-orb qx-auth-orb-b" aria-hidden />
      <form
        onSubmit={mode === "signup" && step === "profile" && !needsProfile ? createAccount : handleAuth}
        className="relative z-10 mx-auto flex w-full max-w-[420px] flex-col gap-4 px-5 pb-10 pt-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="qx-logo-tile mb-3 flex h-14 w-14 items-center justify-center">
            <img src="/qx-mark.svg" alt="" className="h-9 w-9 object-contain" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white">{APP_NAME}</h1>
          <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.32em] text-cyan-200/70">{APP_TAGLINE}</p>
          {!needsProfile && (
            <button
              type="button"
              onClick={() => {
                sfx.tap();
                void navigate({ to: "/" });
              }}
              className="mt-2 text-[11px] text-white/50 underline"
            >
              {SITE_ORIGIN.replace("https://", "")}
            </button>
          )}
        </div>

        {step === "auth" && (
          <>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white">Sign in to {APP_NAME}</h2>
              <p className="mt-1 text-xs text-white/50">Continue with Google — new here or coming back, it's the same button.</p>
            </div>
            {authEnabled && (
              <div className="space-y-2">
                {GROK_PROVIDERS.map((p) => (
                  <button
                    key={p.providerId}
                    type="button"
                    disabled={oauthBusy !== null}
                    onClick={() => oauth(p.providerId)}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white text-sm font-semibold text-[#0A1B3D] transition hover:bg-white/92 active:scale-[0.98] disabled:opacity-60"
                  >
                    {oauthBusy === p.providerId ? "Redirecting…" : `Continue with ${p.label}`}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {(needsProfile || (mode === "signup" && step === "profile")) && (
          <>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white">Your QXio identity</h2>
              <p className="mt-1 text-xs text-white/50">Your ID is unique and locked forever. Nobody else can take it.</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/65">{ID_LABEL}</Label>
              <div className="relative">
                <Input
                  required
                  value={mxitId}
                  onChange={(e) => setMxitId(e.target.value.replace(/\s/g, "").toLowerCase())}
                  placeholder="cooldude_92"
                  maxLength={20}
                  autoComplete="off"
                  className={`${field} pr-12`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {idStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-white/50" />}
                  {idStatus === "ok" && <Check className="h-4 w-4 text-emerald-400" />}
                  {idStatus === "bad" && <X className="h-4 w-4 text-rose-400" />}
                </span>
              </div>
              <p className={`text-[11px] ${idStatus === "ok" ? "text-emerald-300/90" : idStatus === "bad" ? "text-rose-300" : "text-white/40"}`}>
                {idReason || "3–20 chars · letters, numbers, underscores"}
              </p>
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setMxitId(s);
                        sfx.tap();
                      }}
                      className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/65">Display name</Label>
              <Input
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Cool Dude"
                maxLength={40}
                className={field}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/65">Zone</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => {
                      setZone(z.id);
                      sfx.tap();
                    }}
                    className={`rounded-xl border px-2 py-2 text-left transition ${
                      zone === z.id ? "border-cyan-300/60 bg-cyan-400/15 text-white" : "border-white/12 bg-white/5 text-white/70"
                    }`}
                  >
                    <div className="text-[12px] font-semibold">{z.short}</div>
                    <div className="truncate text-[10px] opacity-70">{z.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/65">Mood</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    title={m.label}
                    onClick={() => {
                      setMoodCode(m.code);
                      sfx.tap();
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 ${
                      moodCode === m.code ? "border-cyan-300/70 bg-cyan-400/15" : "border-white/12 bg-white/5"
                    }`}
                  >
                    <MoodIcon code={m.code} size={28} />
                    <span className="truncate text-[9px] text-white/70">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-white/65">Pick an avatar</Label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_SEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setAvatarSeed(s);
                      sfx.tap();
                    }}
                    className={`rounded-xl p-1 tap-scale ${avatarSeed === s ? "bg-white/20 ring-1 ring-white/70" : "border border-white/12 bg-white/5"}`}
                  >
                    <PixelAvatar seed={s} size={48} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-white/65">Age</Label>
                <Input id="age" type="number" required min={14} max={120} value={age} onChange={(e) => setAge(e.target.value)} className={field} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-white/65">Gender</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-sm text-white"
                >
                  <option value="" className="bg-[#0A1B3D] text-white">
                    Prefer not to say
                  </option>
                  <option value="m" className="bg-[#0A1B3D] text-white">
                    Male
                  </option>
                  <option value="f" className="bg-[#0A1B3D] text-white">
                    Female
                  </option>
                  <option value="x" className="bg-[#0A1B3D] text-white">
                    Other
                  </option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/65">Cell number (SMS fallback)</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="082 123 4567"
                inputMode="tel"
                className={field}
              />
              <p className="text-[11px] text-white/40">Optional. Lets texts ride GSM when there's no data — not pictures.</p>
            </div>
            <label className="flex items-start gap-2 text-[12px] text-white/80">
              <input
                type="checkbox"
                checked={over14}
                onChange={(e) => setOver14(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-cyan-300"
                aria-label="I am 14 or older"
              />
              <span>I confirm I am 14 or older and agree to the Terms and Privacy Policy.</span>
            </label>
          </>
        )}

        {(needsProfile || step === "profile") && (
          <Button
            type="submit"
            disabled={busy || idStatus === "bad"}
            className="h-12 w-full rounded-xl bg-white text-[15px] font-semibold text-[#0A1B3D] hover:bg-white/92"
          >
            {busy ? "…" : "Create my ID"}
          </Button>
        )}
        {mode === "signup" && step === "profile" && !needsProfile && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("auth")}
            className="w-full text-xs text-white/50 hover:bg-white/10 hover:text-white"
          >
            Back
          </Button>
        )}
        {!standalone && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("ios");
              }}
            >
              <Smartphone className="h-4 w-4" /> iPhone
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                sfx.tap();
                openPhoneInstall("android");
              }}
            >
              <TabletSmartphone className="h-4 w-4" /> Android
            </Button>
          </div>
        )}
        <p className="text-center text-[10px] text-white/40">
          By continuing you agree to our{" "}
          <a href="/legal/terms" className="underline hover:text-white">
            Terms
          </a>{" "}
          and{" "}
          <a href="/legal/privacy" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
