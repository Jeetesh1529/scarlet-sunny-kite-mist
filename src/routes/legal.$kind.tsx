import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BackBtn, Screen, Softkeys, Titlebar } from "@/components/mxit/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, ID_LABEL, SITE_ORIGIN } from "@/lib/brand";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteAccount } from "@/lib/mxit/fns";
import { STORE } from "@/lib/mxit/store";

export const Route = createFileRoute("/legal/$kind")({ component: Legal });

const KINDS = ["privacy", "terms", "delete", "support"] as const;
type Kind = (typeof KINDS)[number];

function titleOf(kind: string) {
  if (kind === "privacy") return "Privacy";
  if (kind === "delete") return "Delete account";
  if (kind === "support") return "Support";
  return "Terms";
}

function Legal() {
  const raw = Route.useParams().kind;
  const kind: Kind = KINDS.includes(raw as Kind) ? (raw as Kind) : "terms";
  const navigate = useNavigate();
  return (
    <Screen>
      <Titlebar title={titleOf(kind)} left={<BackBtn />} />
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-[13px] leading-relaxed text-white/85">
        {kind === "privacy" && <Privacy />}
        {kind === "terms" && <Terms />}
        {kind === "delete" && <DeleteBody />}
        {kind === "support" && <Support />}
      </div>
      <Softkeys left={<button type="button" onClick={() => navigate({ to: "/" })}>Back</button>} />
    </Screen>
  );
}

function Privacy() {
  return (
    <>
      <p>
        {APP_NAME} is a messenger at {SITE_ORIGIN}. We collect the minimum needed to run chat, rooms, games and your {ID_LABEL}.
        We do not sell your data. Last updated August 2026.
      </p>
      <p className="font-semibold text-white">What we store</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Account: email, hashed password or sign-in provider, {ID_LABEL}, display name, optional age/gender, avatar, zone, optional cell number.</li>
        <li>Messages you send (text, photos, voice notes), delivery state, and who you added.</li>
        <li>Moola ledger, game progress, reports you file, and the fact you blocked someone.</li>
        <li>Device permission you grant: notifications, microphone (voice notes), photos you pick.</li>
      </ul>
      <p className="font-semibold text-white">Who sees it</p>
      <p>
        People you chat with see what you send them. Rooms see messages you post there. Your public profile
        (name, mood, zone, avatar) is visible to other {APP_NAME} users. Operators of {APP_NAME} can see accounts,
        reports and usage to run the service. We do not sell lists. GPRS / SMS last-resort
        texts ride your mobile network — that network may bill airtime; {APP_NAME} does not receive that money.
      </p>
      <p className="font-semibold text-white">How long</p>
      <p>
        While your account is open. Delete your account from Settings or this Delete page and we wipe your profile,
        messages, contacts, Moola and game data from our servers. Backups fall off on the normal cycle. You must be
        14 or older.
      </p>
      <p className="font-semibold text-white">Your controls</p>
      <p>
        Edit profile any time. Sign out from Settings. Delete the account from Settings → Delete my {ID_LABEL}, or
        open <a className="underline" href="/legal/delete">/legal/delete</a>. Report or block from a contact.
      </p>
    </>
  );
}

function Terms() {
  return (
    <>
      <p>By using {APP_NAME} you agree to these terms. If you don't, don't use the app. Last updated August 2026.</p>
      <p>You must be at least 14. Don't harass, impersonate, spam, or post illegal content. We may suspend accounts that break this.</p>
      <p>
        Chat send and receive is free — {APP_NAME} adds no per-message charge. Messages travel as ordinary mobile data,
        so your network's normal data rates apply (a fraction of a cent per message on a bundle); "lean" mode simply
        minimises that data. The SMS fallback is the only path that works with no data, and your network may charge its
        normal SMS tariff (~80c).
      </p>
      <p>
        Moola is an in-app currency for extras like Skinz and Emoticards. You earn it free (welcome bonus, daily
        claim, streaks, gifts) and can optionally top up with Moola packs in the Android app, billed through Google
        Play. Moola is consumable, has no cash value, cannot be exchanged for cash or transferred off {APP_NAME}, and
        is non-refundable once spent except as required by law or Google Play policy. Games in QX Post are free.
      </p>
      <p>
        {APP_NAME} is an original product provided as-is. It is not affiliated with, endorsed by, or a continuation of
        any prior messaging service.
      </p>
    </>
  );
}

function DeleteBody() {
  const { user, isPending } = useCurrentUserState();
  const [phrase, setPhrase] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (phrase.trim().toUpperCase() !== "DELETE") {
      toast.error('Type DELETE to confirm');
      return;
    }
    setBusy(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      await signOut("/");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
      setBusy(false);
    }
  };
  return (
    <>
      <p>
        Play Store and App Store rules: if you can create an account, you can delete it — in the app and on the web.
        This is that page.
      </p>
      <p>
        Deleting wipes your {ID_LABEL}, messages, contacts, Moola, Moonbase and game matches from our servers. Your ID
        is not given to someone else immediately, but you cannot get the account back.
      </p>
      {isPending ? (
        <p>Checking sign-in…</p>
      ) : user ? (
        <div className="space-y-2 rounded-xl border border-rose-400/30 bg-rose-950/40 p-3">
          <p className="text-white">Signed in. Type DELETE, then confirm.</p>
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="DELETE"
            className="border-white/20 bg-white/10 text-white"
            aria-label="Type DELETE"
          />
          <Button variant="destructive" className="w-full" disabled={busy} onClick={() => void go()}>
            {busy ? "Deleting…" : "Delete my QXio ID"}
          </Button>
        </div>
      ) : (
        <p>
          Sign in first, then come back here — or open Settings after you sign in.{" "}
          <a className="underline" href="/">
            Sign in
          </a>
        </p>
      )}
    </>
  );
}

function Support() {
  return (
    <>
      <p>
        {APP_NAME} support. Public site {SITE_ORIGIN}. Use {SITE_ORIGIN}/legal/support in Play Console and App Store Connect.
      </p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Stuck? Menu → Help, or add QXio Help from contacts.</li>
        <li>Abuse: long-press a friend → Report. That also blocks them.</li>
        <li>Privacy or account: Settings, or <a className="underline" href="/legal/privacy">Privacy</a> and <a className="underline" href="/legal/delete">Delete account</a>.</li>
        <li>Install on a phone: <a className="underline" href="/get">Get QXio</a> — Add to Home Screen today. Store listings use the same app after you publish.</li>
      </ul>
      <p className="text-white/60">No ads. Chat, rooms and games are free. Optional Moola packs via Google Play. {STORE.age}.</p>
    </>
  );
}
