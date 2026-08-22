/** Pixel avatar sprite registry. avatars.png is 5 cols x 2 rows. */
export const AVATAR_COLS = 5;
export const AVATAR_ROWS = 2;
export const AVATAR_COUNT = AVATAR_COLS * AVATAR_ROWS;

export const AVATAR_SEEDS = Array.from({ length: AVATAR_COUNT }, (_, i) => `pixel-${i}`);

export function avatarTile(seed: string | null | undefined): { col: number; row: number } {
  const idx = seed
    ? Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATAR_COUNT
    : 0;
  return { col: idx % AVATAR_COLS, row: Math.floor(idx / AVATAR_COLS) };
}
