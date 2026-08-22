import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@electric-sql/pglite/dist");
const dest = join(root, ".vercel/output/functions/__server.func/_libs");

if (!existsSync(dest)) {
  console.warn("[pglite-assets] no vercel server output — skip");
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
for (const f of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(src, f);
  if (!existsSync(from)) continue;
  copyFileSync(from, join(dest, f));
}
console.log("[pglite-assets] copied wasm/data next to bundled pglite");
