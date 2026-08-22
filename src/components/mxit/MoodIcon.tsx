import moodAngry from "@/assets/mood/angry.png";
import moodExcited from "@/assets/mood/excited.png";
import moodGrumpy from "@/assets/mood/grumpy.png";
import moodHappy from "@/assets/mood/happy.png";
import moodHot from "@/assets/mood/hot.png";
import moodInLove from "@/assets/mood/inlove.png";
import moodInvincible from "@/assets/mood/invincible.png";
import moodSad from "@/assets/mood/sad.png";
import moodSick from "@/assets/mood/sick.png";
import moodSleepy from "@/assets/mood/sleepy.png";
import { MOODS } from "@/lib/mxit/types";
import { Emoticon } from "./Emoticon";

export const MOOD_ICONS: Record<string, string> = {
  ":)": moodHappy,
  ":-)": moodHappy,
  ":(": moodSad,
  ":-(": moodSad,
  ":D": moodExcited,
  ":-D": moodExcited,
  "(cool)": moodInvincible,
  "8-)": moodInvincible,
  "8)": moodInvincible,
  "(blush)": moodHot,
  "(hot)": moodHot,
  "(rage)": moodAngry,
  "(angry)": moodAngry,
  ">:( ": moodAngry,
  ">:(": moodAngry,
  "(evil)": moodGrumpy,
  "(grumpy)": moodGrumpy,
  "(dizzy)": moodSick,
  "(sick)": moodSick,
  "<3": moodInLove,
  "(heart)": moodInLove,
  ":|": moodSleepy,
  ":-|": moodSleepy,
};

export function MoodIcon({ code, size = 18, className }: { code?: string | null; size?: number; className?: string }) {
  if (!code) return null;
  const src = MOOD_ICONS[code] ?? MOOD_ICONS[code.trim()];
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={className ?? "inline-block shrink-0 object-contain"}
        style={{ width: size, height: size, imageRendering: "auto" }}
      />
    );
  }
  const known = MOODS.find((m) => m.code === code || m.label.toLowerCase() === code.toLowerCase());
  if (known && MOOD_ICONS[known.code]) {
    return (
      <img
        src={MOOD_ICONS[known.code]}
        alt={known.label}
        width={size}
        height={size}
        className={className ?? "inline-block shrink-0 object-contain"}
        style={{ width: size, height: size }}
      />
    );
  }
  return <Emoticon code={code} size={size} />;
}

export function orbClass(p: string) {
  if (p === "online") return "status-orb orb-online";
  if (p === "away") return "status-orb orb-away";
  if (p === "busy") return "status-orb orb-busy";
  if (p === "invite") return "status-orb orb-invite";
  return "status-orb orb-offline";
}
