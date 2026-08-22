import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/mxit/AuthScreen";
import { AppSplash } from "@/components/mxit/chrome";
import { HomeScreen } from "@/components/mxit/HomeScreen";
import { LockedScreen } from "@/components/mxit/HqScreen";
import { LandingScreen } from "@/components/mxit/LandingScreen";
import { useMxit } from "@/components/mxit/provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const { profile, loading } = useMxit();

  if (isPending || loading) return <AppSplash />;
  if (!user) return <LandingScreen />;
  if (!profile) return <AuthScreen needsProfile />;
  if (profile.banned_at) return <LockedScreen />;
  return <HomeScreen />;
}
