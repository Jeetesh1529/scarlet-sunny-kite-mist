import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(e.message));

async function tap(locator) {
  const el = locator.first();
  await el.waitFor({ state: "attached", timeout: 20000 });
  await el.evaluate((n) => {
    n.scrollIntoView({ block: "center", inline: "nearest" });
    n.click();
  });
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
if (await page.getByRole("button", { name: /create account/i }).count()) {
  await page.getByRole("button", { name: /create account/i }).click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`rate${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder("cooldude_92").fill(`rate_${stamp}`);
  await page.waitForTimeout(700);
  await page.getByPlaceholder("Cool Dude").fill("Rates");
  await page.getByRole("button", { name: /create my id/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2800);
  try {
    await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
  } catch (e) {
    await page.screenshot({ path: "/workspace/screenshots/rates-signup-fail.png" });
    console.log("SIGNUP FAIL", (await page.locator("body").innerText()).slice(0, 1200));
    throw e;
  }
}

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await tap(page.locator('[data-contact="JADE CT"]'));
await page.waitForTimeout(400);
const chatKey = page.getByRole("button", { name: "Chat", exact: true });
if (await chatKey.count()) await tap(chatKey);
try {
  await page.getByPlaceholder(/Message|SMS over airtime/).waitFor({ timeout: 12000 });
} catch {
  console.log("NAV", page.url());
  console.log("BODY", (await page.locator("body").innerText()).slice(0, 800));
  await page.screenshot({ path: "/workspace/screenshots/rates-chat-fail.png" });
  throw new Error("did not open chat");
}
await page.waitForTimeout(400);
let body = await page.locator("body").innerText();
check("chat FREE chip", /data chat\s*·\s*free/i.test(body) || /\bFREE\b/.test(body));
check("chat no moola hint", /no moola/i.test(body));
const ant = page.getByRole("button", { name: /airtime sms/i });
check("antenna", (await ant.count()) > 0);
await ant.click({ force: true });
await page.waitForTimeout(300);
body = await page.locator("body").innerText();
check("airtime telco warning", /80c|network may charge|telco/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/rates-chat.png" });
await page.getByRole("button", { name: "Back", exact: true }).click({ force: true });
await page.waitForTimeout(400);

await page.getByRole("button", { name: "Menu", exact: true }).click({ force: true });
await page.getByRole("menuitem", { name: /help/i }).click();
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("help then vs now", /then vs now/i.test(body));
check("help 1-to-1 free", /1-to-1 chat[\s\S]*FREE/i.test(body));
check("help rooms free", /zone rooms[\s\S]*FREE/i.test(body));
check("help extras unchanged", /emoticards/i.test(body) && /40/.test(body) && /5/.test(body));
await page.screenshot({ path: "/workspace/screenshots/rates-help.png" });
await page.getByRole("button", { name: "Back", exact: true }).click({ force: true });
await page.waitForTimeout(400);

await tap(page.locator('[data-contact="QX Post"]'));
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
check("post rooms free copy", /chat, rooms and games are free/i.test(body));
check("post skinz 40", /skinz[\s\S]{0,120}40/i.test(body));
check("post emoticards 5", /emoticards[\s\S]{0,120}5/i.test(body));
check("post free labels", /free/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/rates-tradepost.png" });
await page.getByRole("button", { name: "Back", exact: true }).click({ force: true });
await page.waitForTimeout(400);

await tap(page.locator('[data-contact="QX Banker"]'));
await page.waitForTimeout(500);
await tap(page.getByText("Moola Hub"));
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
check("hub chat does not spend", /chat does not spend/i.test(body));
check("hub then vs now", /then vs now/i.test(body));
check("hub extras card", /emoticards/i.test(body) && /skinz/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/rates-moola.png" });

if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
