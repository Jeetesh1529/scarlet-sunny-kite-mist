/**
 * QXio emoticon registry — Expanded Classic set.
 * Sprite: src/assets/emoticons.png (6 columns x 5 rows = 30 tiles)
 */
export type EmoticonDef = {
  code: string;
  aliases: string[];
  col: number;
  row: number;
  label: string;
};

export const EMOTICON_COLS = 6;
export const EMOTICON_ROWS = 5;

export const EMOTICONS: EmoticonDef[] = [
  { code: ":)", aliases: [":-)"], col: 0, row: 0, label: "happy" },
  { code: ":(", aliases: [":-("], col: 1, row: 0, label: "sad" },
  { code: ";)", aliases: [";-)"], col: 2, row: 0, label: "wink" },
  { code: ":D", aliases: [":-D", ":->", ":>"], col: 3, row: 0, label: "excited" },
  { code: ":|", aliases: [":-|"], col: 4, row: 0, label: "neutral" },
  { code: ":P", aliases: [":p", ":-P", ":-p"], col: 5, row: 0, label: "tongue" },
  { code: "=-O", aliases: ["=-o", "=O", "=o"], col: 0, row: 1, label: "shocked" },
  { code: ":-*", aliases: [":*"], col: 1, row: 1, label: "kiss" },
  { code: "8-)", aliases: ["8)", "B)", "(cool)", "(invincible)"], col: 2, row: 1, label: "cool" },
  { code: ":-[", aliases: [":["], col: 3, row: 1, label: "embarrassed" },
  { code: ":'(", aliases: [":'-("], col: 4, row: 1, label: "crying" },
  { code: ":-/", aliases: [":-\\", ":/", "(sick)", "(dizzy)"], col: 5, row: 1, label: "thinking" },
  { code: "O:)", aliases: ["o:)", "O:-)", "o:-)", "(angel)"], col: 0, row: 2, label: "angel" },
  { code: ":-X", aliases: [":X", ":-x", ":x"], col: 1, row: 2, label: "shut mouth" },
  { code: ":-$", aliases: [":$"], col: 2, row: 2, label: "money mouth" },
  { code: ":-!", aliases: [":!"], col: 3, row: 2, label: "foot in mouth" },
  { code: ">:O", aliases: [">:o", "(grumpy)", "(evil)"], col: 4, row: 2, label: "shout" },
  { code: ">:(", aliases: [">:-(", "(angry)", "(rage)"], col: 5, row: 2, label: "angry" },
  { code: "C:-)", aliases: ["C:)", "c:-)", "c:)"], col: 0, row: 3, label: "skywalker" },
  { code: ":-(|)", aliases: [":(|)", "8-|", "(monkey)"], col: 1, row: 3, label: "monkey" },
  { code: "O-)", aliases: ["o-)", "(cyclops)"], col: 2, row: 3, label: "cyclops" },
  { code: "(hot)", aliases: [":chili:", "(blush)", "(chili)"], col: 3, row: 3, label: "hot" },
  { code: "(greedy)", aliases: ["$_$"], col: 4, row: 3, label: "greedy" },
  { code: "(male)", aliases: [":male:"], col: 5, row: 3, label: "male sign" },
  { code: "(female)", aliases: [":female:"], col: 0, row: 4, label: "female sign" },
  { code: "<3", aliases: [":heart:", ":love:", "(heart)"], col: 1, row: 4, label: "in love" },
  { code: ":brokenheart:", aliases: ["</3"], col: 2, row: 4, label: "broken heart" },
  { code: "@>--", aliases: [":rose:", "@->--"], col: 3, row: 4, label: "rose" },
  { code: ":music:", aliases: ["(music)"], col: 4, row: 4, label: "musical note" },
  { code: "\\m/", aliases: ["(victory)", "(rock)"], col: 5, row: 4, label: "victory" },
];

const lookup = new Map<string, EmoticonDef>();
EMOTICONS.forEach((e) => {
  lookup.set(e.code.toLowerCase(), e);
  e.aliases.forEach((a) => lookup.set(a.toLowerCase(), e));
});

export function findEmoticon(token: string) {
  return lookup.get(token.toLowerCase());
}

export const EMOTICON_REGEX = (() => {
  const all = EMOTICONS.flatMap((e) => [e.code, ...e.aliases])
    .sort((a, b) => b.length - a.length)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(${all.join("|")})`, "g");
})();
