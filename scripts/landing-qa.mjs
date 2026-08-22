import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

function check(name, ok) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
}

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
let body = await page.locator("body").innerText();
console.log("LAND", body.slice(0, 500).replace(/\n/g, " | "));
check("landing hero", /chat is free|rooms still packed/i.test(body));
check("qxio.live", /qxio\.live/i.test(body));
check("create cta", /create my id/i.test(body));
check("screenshots", /inside the app|contacts|cape town/i.test(body));
check("no mxit", !/\bmxit\b/i.test(body));
check("home shot img", (await page.locator('img[src="/store/01-home.png"]').count()) > 0);
await page.screenshot({ path: "/workspace/screenshots/landing.png" });

await page.getByRole("button", { name: /create my id/i }).click();
await page.waitForTimeout(800);
body = await page.locator("body").innerText();
check("signup", /create account|email/i.test(body));
check("signup tab", /create account/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/landing-signup.png" });

if (errors.length) console.log("ERRORS", errors.slice(0, 8));
else console.log("NO CONSOLE ERRORS");
await browser.close();
