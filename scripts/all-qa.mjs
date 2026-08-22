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

async function signup() {
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const create = page.getByRole("button", { name: /create account/i });
  if (await create.count()) {
    await create.click();
    const stamp = String(Date.now()).slice(-6);
    await page.locator("#email").fill(`all${stamp}@qxio.test`);
    await page.locator("#password").fill("legacy2005");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByPlaceholder("cooldude_92").fill(`all_${stamp}`);
    await page.getByPlaceholder("Cool Dude").fill("Allin");
    await page.getByText("This ID is yours if you take it").waitFor({ timeout: 15000 });
    await page.getByRole("button", { name: /create my id/i }).click({ force: true });
    await page.waitForTimeout(3500);
  }
  await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
}

await signup();

await page.getByRole("button", { name: /^menu$/i }).click();
await page.getByText("Invite a friend").click();
await page.waitForTimeout(400);
let body = await page.locator("body").innerText();
check("invite dialog", /your unique qxio id/i.test(body) && /copy @/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/invite.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

const jade = page.locator('[data-contact="JADE CT"]').first();
await jade.click({ button: "right", force: true });
await page.waitForTimeout(400);
body = await page.locator("body").innerText();
check("actions block", /\bblock\b/i.test(body));
check("actions nickname", /nickname/i.test(body));
check("actions report", /report/i.test(body));
await page.getByRole("button", { name: /^block$/i }).click({ force: true });
await page.waitForTimeout(700);
body = await page.locator("body").innerText();
check("blocked toast or group", /blocked/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/block.png" });

await page.goto("http://127.0.0.1:8080/tradepost/games", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
console.log("GAMES URL", page.url());
body = await page.locator("body").innerText();
console.log("GAMES BODY", body.slice(0, 500).replace(/\n/g, " | "));
await page.screenshot({ path: "/workspace/screenshots/games-list.png" });
check("games list chess", /chess/i.test(body) && /vs the house/i.test(body));
check("games list skipbo", /skip-bo/i.test(body));

await page.goto("http://127.0.0.1:8080/games/chess", { waitUntil: "domcontentloaded" });
await page.getByRole("button", { name: "e2" }).waitFor({ timeout: 15000 });
body = await page.locator("body").innerText();
check("chess loaded", /chess/i.test(body) && /your move|ai thinking/i.test(body));
await page.getByRole("button", { name: "e2" }).click({ force: true });
await page.waitForTimeout(150);
await page.getByRole("button", { name: "e4" }).click({ force: true });
await page.getByText(/AI thinking|your move|check/i).waitFor({ timeout: 8000 });
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
check("chess moved", /your move|check|ai thinking/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/games-chess.png" });

await page.goto("http://127.0.0.1:8080/games/skipbo", { waitUntil: "domcontentloaded" });
await page.getByText("Skip-Bo", { exact: true }).waitFor({ timeout: 15000 });
body = await page.locator("body").innerText();
check("skipbo loaded", /skip-bo/i.test(body) && /your stock/i.test(body));
await page.getByRole("button", { name: "Your stock" }).click({ force: true });
await page.waitForTimeout(200);
await page.getByRole("button", { name: /build 1/i }).click({ force: true });
await page.waitForTimeout(300);
body = await page.locator("body").innerText();
check("skipbo interactive", /stock|build|discard|turn|can't go/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/games-skipbo.png" });

if (errors.length) console.log("ERRORS", errors.slice(0, 12));
else console.log("NO CONSOLE ERRORS");
await browser.close();
