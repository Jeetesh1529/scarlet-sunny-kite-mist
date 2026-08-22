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

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
if (await page.getByRole("button", { name: /create account/i }).count()) {
  await page.getByRole("button", { name: /create account/i }).click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`gprs${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder("cooldude_92").fill(`gprs_${stamp}`);
  await page.waitForTimeout(700);
  await page.getByPlaceholder("Cool Dude").fill("Gprs");
  await page.getByRole("button", { name: /create my id/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2800);
  try {
    await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
  } catch (e) {
    await page.screenshot({ path: "/workspace/screenshots/gprs-signup-fail.png" });
    console.log("SIGNUP FAIL", (await page.locator("body").innerText()).slice(0, 1200));
    throw e;
  }
}

const jade = page.locator('[data-contact="JADE CT"]').first();
await jade.waitFor({ state: "attached", timeout: 20000 });
const conv = await jade.getAttribute("data-conv");
if (conv) {
  await page.goto(`http://127.0.0.1:8080/chat/${conv}`, { waitUntil: "domcontentloaded" });
} else {
  await jade.evaluate((n) => {
    n.scrollIntoView({ block: "center", inline: "nearest" });
    n.click();
  });
}
try {
  await page.getByPlaceholder(/Message|GPRS packet|SMS last resort/).waitFor({ timeout: 12000 });
} catch {
  console.log("NAV", page.url());
  console.log("BODY", (await page.locator("body").innerText()).slice(0, 900));
  await page.screenshot({ path: "/workspace/screenshots/gprs-chat-fail.png" });
  throw new Error("did not open chat");
}
await page.waitForTimeout(400);

let body = await page.locator("body").innerText();
check("starts free or gprs", /data chat|gprs|free/i.test(body));

const radioBtn = page.getByRole("button", { name: /radio mode/i });
check("radio button", (await radioBtn.count()) > 0);
await radioBtn.click({ force: true });
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("gprs banner", /gprs|1–2c|1-2c/i.test(body));
check("400 counter", /0\/400|\/400/.test(body));

const box = page.getByPlaceholder(/GPRS packet|Message|SMS last resort/);
await box.fill("heita from gprs");
await page.getByRole("button", { name: "Send" }).click({ force: true });
await page.waitForTimeout(900);
body = await page.locator("body").innerText();
check("gprs sent", body.includes("heita from gprs"));
check("gprs badge", /gprs/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/gprs-chat.png" });

await radioBtn.click({ force: true });
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("sms last resort", /80c|last resort/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/gprs-sms-fallback.png" });

await page.getByRole("button", { name: "Back", exact: true }).click({ force: true });
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Menu", exact: true }).click({ force: true });
await page.getByRole("menuitem", { name: /help/i }).click();
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("help gprs", /og app|gprs/i.test(body));
check("help 1-2c", /1–2c|1-2c/.test(body));
await page.screenshot({ path: "/workspace/screenshots/gprs-help.png" });

await page.getByRole("button", { name: "Back", exact: true }).click({ force: true });
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Menu", exact: true }).click({ force: true });
await page.getByRole("menuitem", { name: /settings/i }).click();
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("settings gprs", /cheap airtime|gprs/i.test(body));
check("settings sms last", /sms last resort/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/gprs-settings.png" });

if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
