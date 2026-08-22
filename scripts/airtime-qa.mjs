import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
if (await page.getByRole("button", { name: /create account/i }).count()) {
  await page.getByRole("button", { name: /create account/i }).click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`air${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByPlaceholder("cooldude_92").fill(`air_${stamp}`);
  await page.waitForTimeout(700);
  await page.getByPlaceholder("Cool Dude").fill("Airtime");
  const cell = page.getByPlaceholder("082 123 4567");
  if (await cell.count()) {
    await cell.fill(`082${stamp}0`);
    console.log("OK phone field");
  } else console.log("FAIL no phone field");
  await page.getByRole("button", { name: /create my id/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2500);
  console.log("AFTER CREATE", (await page.locator("body").innerText()).slice(0, 500));
  try {
    await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
  } catch (e) {
    await page.screenshot({ path: "/workspace/screenshots/airtime-signup-fail.png" });
    console.log("SIGNUP FAIL", (await page.locator("body").innerText()).slice(0, 1200));
    throw e;
  }
}
await page.locator('[data-contact="JADE CT"]').first().click({ force: true });
await page.waitForTimeout(800);
const ant = page.getByRole("button", { name: /airtime sms/i });
console.log((await ant.count()) ? "OK antenna" : "FAIL antenna");
await ant.click();
await page.waitForTimeout(300);
const body = await page.locator("body").innerText();
console.log(/airtime|gsm|reception/i.test(body) ? "OK airtime banner" : "FAIL airtime banner");
console.log(body.includes("160") || /0\/160/.test(body) ? "OK 160 counter" : "WARN no 160");
const box = page.getByPlaceholder(/SMS over airtime|Message/);
await box.fill("heita over the radio");
await page.getByRole("button", { name: "Send" }).click();
await page.waitForTimeout(900);
const after = await page.locator("body").innerText();
console.log(after.includes("heita over the radio") ? "OK airtime sent" : "FAIL airtime sent");
console.log(/airtime/i.test(after) ? "OK airtime label" : "WARN no airtime label");
await page.screenshot({ path: "/workspace/screenshots/airtime-chat.png" });
await page.getByRole("button", { name: "Back", exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.getByRole("menuitem", { name: /settings/i }).click();
await page.waitForTimeout(400);
const set = await page.locator("body").innerText();
console.log(/Airtime SMS/i.test(set) ? "OK settings airtime" : "FAIL settings");
await page.screenshot({ path: "/workspace/screenshots/airtime-settings.png" });
await page.getByRole("button", { name: "Back", exact: true }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.getByRole("menuitem", { name: /my profile/i }).click();
await page.waitForTimeout(400);
const prof = await page.locator("body").innerText();
console.log(/Cell|082|airtime/i.test(prof) ? "OK profile cell" : "FAIL profile cell");
await page.screenshot({ path: "/workspace/screenshots/airtime-profile.png" });
if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
