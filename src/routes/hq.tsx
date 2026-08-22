import { createFileRoute } from "@tanstack/react-router";
import { HqScreen } from "@/components/mxit/HqScreen";

export const Route = createFileRoute("/hq")({
  component: HqScreen,
  validateSearch: (s: Record<string, unknown>) =>
    s.unlock === "1" || s.unlock === true || s.unlock === 1 ? { unlock: true as const } : {},
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});
