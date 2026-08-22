import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
if (await page.getByRole("button", { name: /create account/i }).count()) {
  await page.getByRole("button", { name: /create account/i }).click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`post${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder("cooldude_92").fill(`post_${stamp}`);
  await page.waitForTimeout(600);
  await page.getByPlaceholder("Cool Dude").fill("Poster");
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2500);
  try {
    await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
  } catch {
    console.log("SIGNUP", (await page.locator("body").innerText()).slice(0, 800));
    await page.screenshot({ path: "/workspace/screenshots/post-signup-fail.png" });
    throw new Error("signup");
  }
}

async function openPost() {
  if (await page.locator('[data-contact="QX Post"]').count()) {
    await page.locator('[data-contact="QX Post"]').first().evaluate((n) => {
      n.scrollIntoView({ block: "center" });
      n.click();
    });
    await page.waitForTimeout(700);
  }
  if (!/tradepost/.test(page.url())) {
    await page.goto("http://127.0.0.1:8080/tradepost", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
  }
}

await openPost();
console.log("POST", page.url(), (await page.locator("body").innerText()).slice(0, 400).replace(/\n/g, " | "));
await page.screenshot({ path: "/workspace/screenshots/post-mall.png" });

const items = ["Games", "Moonbase", "Tic-Tac-Toe", "Music Room", "Horoscopes", "Chat Rooms"];
for (const name of items) {
  if (!/tradepost/.test(page.url()) && name !== "Moonbase" && name !== "Tic-Tac-Toe") {
    await page.goto("http://127.0.0.1:8080/tradepost", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
  }
  if (name === "Moonbase" || name === "Tic-Tac-Toe") {
    await page.goto("http://127.0.0.1:8080/tradepost/games", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
  }
  const btn = page.getByRole("button", { name: new RegExp(name, "i") }).first();
  const n = await btn.count();
  console.log("FOUND", name, n);
  if (n) {
    await btn.evaluate((el) => { el.scrollIntoView({ block: "center" }); el.click(); });
    await page.waitForTimeout(900);
    const t = (await page.locator("body").innerText()).slice(0, 280).replace(/\n/g, " | ");
    console.log("AFTER", name, page.url(), t);
    await page.screenshot({ path: `/workspace/screenshots/post-${name.replace(/\s+/g, "-").toLowerCase()}.png` });
  }
}
if (errors.length) console.log("ERRORS", errors.slice(0, 12));
else console.log("NO CONSOLE ERRORS");
await browser.close();
