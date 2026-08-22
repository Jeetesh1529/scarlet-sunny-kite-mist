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

async function shot(name) {
  await page.evaluate(() => {
    const hide = (el) => el && el.style.setProperty("display", "none", "important");
    for (const el of document.querySelectorAll("body *")) {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t === "Remix this app" || t === "Remix") {
        const fixed = el.closest("[style*='fixed'],[class*='fixed']") || el.parentElement || el;
        hide(fixed);
      }
    }
  });
  await page.screenshot({ path: `/workspace/store-listing/${name}.png` });
}

await page.goto("http://127.0.0.1:8080/get", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
let body = await page.locator("body").innerText();
check("get page", /get qxio|add to home|play store/i.test(body));
check("get listing copy", /blast from the past/i.test(body));
await shot("01-get");

await page.goto("http://127.0.0.1:8080/legal/privacy", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("privacy", /we do not sell|what we store/i.test(body));
check("privacy no mxit", !/\bmxit\b/i.test(body));

await page.goto("http://127.0.0.1:8080/legal/delete", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("delete page", /delete/i.test(body));
await shot("05-delete");

await page.goto("http://127.0.0.1:8080/legal/support", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("support", /support/i.test(body));

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
  await page.getByPlaceholder("cooldude_92").fill(`st_${stamp}`);
  await page.waitForTimeout(600);
  await page.getByText(/this id is yours/i).waitFor({ timeout: 15000 });
  await page.getByPlaceholder("Cool Dude").fill("Store");
  await page.locator("#age").fill("22");
  await page.getByRole("checkbox", { name: /14 or older/i }).check();
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
}
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
check("home after signup", /contacts|jade/i.test(body));
await shot("02-contacts");

const conv = await page.locator('[data-contact="JADE CT"]').first().getAttribute("data-conv");
if (conv) {
  await page.goto(`http://127.0.0.1:8080/chat/${conv}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const box = page.locator("textarea").last();
  await box.fill("heita from the store listing");
  await page.getByRole("button", { name: "Send" }).click();
  await page.waitForTimeout(900);
  await shot("03-chat");
}

await page.goto("http://127.0.0.1:8080/room/room-cpt", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
body = await page.locator("body").innerText();
check("cape town room", /cape town|in here/i.test(body));
await shot("04-room");

await page.goto("http://127.0.0.1:8080/games/chess", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
body = await page.locator("body").innerText();
check("chess", /chess|your move/i.test(body));
await shot("06-chess");

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.getByRole("menuitem", { name: /settings/i }).click();
await page.waitForTimeout(500);
body = await page.locator("body").innerText();
check("settings delete", /delete my qxio id/i.test(body));
check("settings get", /store listing copy|add to home|iphone/i.test(body));
await shot("07-settings");

if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
