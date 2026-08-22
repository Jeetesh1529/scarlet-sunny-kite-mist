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
  await page.waitForTimeout(1200);
  const create = page.getByRole("button", { name: /create account/i });
  if (!(await create.count())) {
    if (await page.getByText("Contacts", { exact: true }).count()) return;
  }
  await create.click();
  const stamp = String(Date.now()).slice(-6);
  await page.locator("#email").fill(`verbs${stamp}@qxio.test`);
  await page.locator("#password").fill("legacy2005");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(600);
  await page.getByPlaceholder("cooldude_92").fill(`verbs_${stamp}`);
  await page.waitForTimeout(400);
  await page.getByText(/this id is yours if you take it/i).waitFor({ timeout: 15000 }).catch(() => {});
  await page.getByPlaceholder("Cool Dude").fill("Verbs");
  await page.getByRole("button", { name: /create my id/i }).click({ force: true });
  await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 25000 });
}

await signup();

await page.locator('[data-contact="JADE CT"]').first().click({ force: true });
await page.waitForTimeout(900);
const input = page.getByPlaceholder(/message/i);
await input.fill("heita jade, reply this");
await page.getByRole("button", { name: /^send$/i }).click();
await page.waitForTimeout(700);
const bubble = page.locator("[data-kind=text]").last();
await bubble.dispatchEvent("contextmenu");
await page.waitForTimeout(400);
let body = await page.locator("body").innerText();
check("copy action", /copy/i.test(body));
check("reply action", /reply/i.test(body));
check("delete action", /delete/i.test(body));
await page.getByRole("button", { name: /^reply$/i }).click();
await page.waitForTimeout(300);
body = await page.locator("body").innerText();
check("reply banner", /heita jade|cancel reply/i.test(body));
await input.fill("got you");
await page.getByRole("button", { name: /^send$/i }).click();
await page.waitForTimeout(800);
body = await page.locator("body").innerText();
check("reply preview in log", /heita jade/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/chat-reply.png" });

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.locator('[data-contact="JADE CT"]').first().waitFor({ timeout: 15000 });
await page.waitForTimeout(400);
await page.locator('[data-contact="JADE CT"]').first().evaluate((el) => {
  el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
});
await page.waitForTimeout(400);
check("challenge action", /challenge/i.test(await page.locator("body").innerText()));
await page.getByRole("button", { name: /^challenge$/i }).click({ force: true });
await page.waitForTimeout(300);
await page.locator("[data-game=chess]").click({ force: true });
await page.waitForTimeout(1400);
let chess = await page.locator("body").innerText();
console.log("CHESS", page.url(), chess.slice(0, 280).replace(/\n/g, " | "));
check("chess match vs jade", /chess vs jade/i.test(chess));
check("you are white", /you are white/i.test(chess));
await page.screenshot({ path: "/workspace/screenshots/games-chess-match.png" });

await page.goto("http://127.0.0.1:8080/tradepost/chatrooms", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
let rooms = await page.locator("body").innerText();
check("room last message", /heita the room is packed|loadshedding|who wants chess|freshlyground|still here/i.test(rooms));
await page.goto("http://127.0.0.1:8080/room/room-cpt", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
const room = await page.locator("body").innerText();
console.log("ROOM", room.slice(0, 320).replace(/\n/g, " | "));
check("room members here", /in here:/i.test(room));
check("room chatter", /heita the room is packed|mountain hides|howzit from jozi/i.test(room));
await page.screenshot({ path: "/workspace/screenshots/room-busy.png" });

if (errors.length) console.log("ERRORS", errors.slice(0, 12));
else console.log("NO CONSOLE ERRORS");
await browser.close();
