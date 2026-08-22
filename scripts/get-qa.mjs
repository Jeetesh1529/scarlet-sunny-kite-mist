import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await page.goto("http://127.0.0.1:8080/get", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
const body = await page.locator("body").innerText();
check("get page", /get qxio|on your phone today/i.test(body));
check("play store copy", /play store and app store/i.test(body));
check("no mxit", !/\bmxit\b/i.test(body));
check("privacy link", /privacy/i.test(body));
check("screenshots section", /store screenshots/i.test(body));
const img = page.locator('img[src="/store/01-home.png"]');
check("home shot", (await img.count()) > 0);
await page.locator("#android").click();
await page.waitForTimeout(300);
const after = await page.locator("body").innerText();
check("android steps", /chrome|install app|add to home/i.test(after));
await page.screenshot({ path: "/workspace/screenshots/store-get.png" });
if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
