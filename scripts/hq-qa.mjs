import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(e.message));

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

const stamp = String(Date.now()).slice(-6);
const handle = `hq_${stamp}`;

await page.goto("http://127.0.0.1:8080/login?intent=signup", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
await page.getByRole("button", { name: /create account/i }).click().catch(() => {});
await page.locator("#email").fill(`hq${stamp}@qxio.test`);
await page.locator("#password").fill("legacy2005");
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.waitForTimeout(700);
await page.getByPlaceholder("cooldude_92").fill(handle);
await page.waitForTimeout(500);
await page.getByText(/this id is yours if you take it/i).waitFor({ timeout: 15000 }).catch(() => {});
await page.getByPlaceholder("Cool Dude").fill("HQ Owner");
await page.locator("#age").fill("22");
await page.getByLabel(/14 or older/i).check();
await page.getByRole("button", { name: /create my id/i }).click({ force: true });
await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
check("signed up", true);

await page.goto("http://127.0.0.1:8080/hq", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
let body = await page.locator("body").innerText();
console.log("PUBLIC HQ", body.slice(0, 280).replace(/\n/g, " | "));
check("hq hidden from public url", /not found/i.test(body));
check("no dashboard leak", !/how they use it|who signed up|dau/i.test(body));

await page.goto("http://127.0.0.1:8080/hq?unlock=1", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
body = await page.locator("body").innerText();
console.log("UNLOCK", body.slice(0, 280).replace(/\n/g, " | "));
check("unlock form", /operator/i.test(body));
await page.locator('input[type=password]').fill("nope");
await page.getByRole("button", { name: /continue/i }).click();
await page.waitForTimeout(600);
check("rejects bad key", !/how they use it/i.test(await page.locator("body").innerText()));
await page.locator('input[type=password]').fill("beharilal-qxio-hq");
await page.getByRole("button", { name: /continue/i }).click();
await page.waitForTimeout(1800);
body = await page.locator("body").innerText();
console.log("OWNED", body.slice(0, 400).replace(/\n/g, " | "));
check("hq after key", /how they use it/i.test(body));
check("dau", /dau/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/hq-analytics.png", fullPage: true });

await page.getByRole("button", { name: /^people$/i }).click();
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("people tab", /who signed up/i.test(body));
check("sees self", new RegExp(`@${handle}`, "i").test(body));
await page.screenshot({ path: "/workspace/screenshots/hq.png", fullPage: true });

if (errors.length) console.log("CONSOLE", errors.slice(0, 8));
await browser.close();
