import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthScreen } from "@/components/mxit/AuthScreen";
import { AppSplash } from "@/components/mxit/chrome";
import { useMxit } from "@/components/mxit/provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: (s: Record<string, unknown>) =>
    s.intent === "signup" ? { intent: "signup" as const } : {},
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const { profile, loading } = useMxit();
  const { intent } = Route.useSearch();
  if (isPending || loading) return <AppSplash />;
  if (user && profile) return <Navigate to="/" />;
  if (user && !profile) return <AuthScreen needsProfile />;
  return <AuthScreen intent={intent} />;
}
