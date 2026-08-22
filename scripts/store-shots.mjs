import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync("/workspace/public/store", { recursive: true });
mkdirSync("/workspace/public/store/ios", { recursive: true });
mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
page.setDefaultTimeout(25000);

async function shot(name) {
  const raw = `/tmp/${name}-raw.png`;
  await page.screenshot({ path: raw, fullPage: false });
  const play = `/workspace/public/store/${name}.png`;
  const ios = `/workspace/public/store/ios/${name}.png`;
  const r1 = spawnSync("python3", ["-c", `
from PIL import Image
im = Image.open(${JSON.stringify(raw)}).convert("RGB")
play = im.resize((1080, 1920), Image.Resampling.LANCZOS)
play.save(${JSON.stringify(play)}, "PNG", optimize=True)
ios = Image.new("RGB", (1290, 2796), (10, 27, 61))
scaled = im.resize((1290, int(im.height * 1290 / im.width)), Image.Resampling.LANCZOS)
y = (2796 - scaled.height) // 2
ios.paste(scaled, (0, max(0, y)))
ios.save(${JSON.stringify(ios)}, "PNG", optimize=True)
print("ok", ${JSON.stringify(name)}, play.size, ios.size)
`], { encoding: "utf8" });
  if (r1.stdout) process.stdout.write(r1.stdout);
  if (r1.status !== 0) console.error(r1.stderr);
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
const create = page.getByRole("button", { name: /create account/i });
if (await create.count()) {
  await create.click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`store${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder("cooldude_92").fill(`store_${stamp}`);
  await page.getByText(/this id is yours if you take it/i).waitFor({ timeout: 15000 });
  await page.getByPlaceholder("Cool Dude").fill("Store Demo");
  await page.locator("#age").fill("22");
  await page.getByRole("checkbox", { name: /14 or older/i }).check();
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
}

await page.waitForTimeout(800);
await shot("01-home");

const conv = await page.locator('[data-contact="JADE CT"]').first().getAttribute("data-conv");
if (conv) await page.goto(`http://127.0.0.1:8080/chat/${conv}`, { waitUntil: "domcontentloaded" });
else await page.locator('[data-contact="JADE CT"]').first().click({ force: true });
await page.waitForTimeout(1400);
const box = page.locator("textarea").last();
if (await box.count()) {
  await box.fill("heita from the store listing :)");
  await page.getByRole("button", { name: "Send" }).click();
  await page.waitForTimeout(1200);
}
await shot("02-chat");

await page.goto("http://127.0.0.1:8080/room/room-cpt", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await shot("03-room");

await page.goto("http://127.0.0.1:8080/tradepost/games", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
await shot("04-games");

await page.goto("http://127.0.0.1:8080/games/chess", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
await shot("05-challenge");

await page.goto("http://127.0.0.1:8080/get", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
await page.screenshot({ path: "/workspace/screenshots/store-get.png" });

await browser.close();
console.log("SHOTS DONE");
