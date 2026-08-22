import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.message));

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const create = page.getByRole("button", { name: /create account/i });
const contacts = page.getByText("Contacts", { exact: true });
if (await create.count()) {
  await page.getByRole("button", { name: /create account/i }).click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`gme${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder("cooldude_92").fill(`gme_${stamp}`);
  await page.waitForTimeout(500);
  await page.getByPlaceholder("Cool Dude").fill("Gamer");
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2800);
  await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
}

await page.goto("http://127.0.0.1:8080/games/moonbase", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
let body = await page.locator("body").innerText();
console.log("MOON", page.url(), body.slice(0, 400).replace(/\n/g, " | "));
check("moonbase loaded", /alpha base|oxygen|landing/i.test(body) && !/login/i.test(body.split("\n")[0] || ""));
check("moonbase not blank", body.length > 80);
await page.screenshot({ path: "/workspace/screenshots/games-moonbase.png" });
const build = page.getByRole("button", { name: /^build$/i });
if (await build.count()) {
  await build.click({ force: true });
  await page.waitForTimeout(400);
  const up = page.getByRole("button", { name: /upgrade/i }).first();
  check("upgrade buttons", (await up.count()) > 0);
  await up.click({ force: true });
  await page.waitForTimeout(700);
  body = await page.locator("body").innerText();
  check("upgrade responded", /upgraded|not enough|lv /i.test(body));
}

await page.goto("http://127.0.0.1:8080/games/connect4", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
body = await page.locator("body").innerText();
check("connect4", /connect 4|your drop/i.test(body));
await page.getByRole("button", { name: /column 4/i }).first().click({ force: true });
await page.waitForTimeout(500);
await page.screenshot({ path: "/workspace/screenshots/games-connect4.png" });

await page.goto("http://127.0.0.1:8080/music", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("music", /tap to play|chiptune/i.test(body));
await page.getByRole("button", { name: /mabhida/i }).click({ force: true });
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("music playing", /playing/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/games-music.png" });

await page.goto("http://127.0.0.1:8080/tradepost/games", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("games list moonbase", /moonbase/i.test(body));
check("games list connect4", /connect 4/i.test(body));

if (errors.length) console.log("ERRORS", errors.slice(0, 10));
else console.log("NO CONSOLE ERRORS");
await browser.close();
