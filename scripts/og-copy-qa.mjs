import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
const create = page.getByRole("button", { name: /create account/i });
if (await create.count()) {
  await create.click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`og${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder("cooldude_92").fill(`og_${stamp}`);
  await page.getByPlaceholder("Cool Dude").fill("OgFan");
  await page.getByText("This ID is yours if you take it").waitFor({ timeout: 15000 });
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.waitForTimeout(2800);
}
await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });

await page.getByRole("button", { name: /^menu$/i }).click();
await page.getByRole("menuitem", { name: /help/i }).click();
await page.waitForTimeout(500);
let body = await page.locator("body").innerText();
check("help has og app", /og app/i.test(body));
check("help has no mxit", !/\bmxit\b/i.test(body));
check("rates og", /the og app ran cheap/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/og-help.png" });

await page.getByRole("button", { name: "Back", exact: true }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /^menu$/i }).click();
await page.getByRole("menuitem", { name: /settings/i }).click();
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("settings og", /og app/i.test(body));
check("settings no mxit", !/\bmxit\b/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/og-settings.png" });

await page.goto("http://127.0.0.1:8080/moola", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
check("moola og", /og app/i.test(body));
check("moola no mxit", !/\bmxit\b/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/og-moola.png" });

await browser.close();
