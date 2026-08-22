import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") {
    errors.push(msg.text());
    console.log("CONSOLE", msg.text());
  }
});
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.log("PAGEERROR", e.message);
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/login.png", fullPage: false });
const loginText = await page.locator("body").innerText();
console.log("LOGIN TEXT", loginText.slice(0, 600));
if (!/sign in/i.test(loginText)) console.log("FAIL no sign in");
if (!/create account/i.test(loginText)) console.log("FAIL no create account");
if (!/QXio/i.test(loginText)) console.log("FAIL no QXio brand");

await page.getByRole("button", { name: /create account/i }).click();
await page.waitForTimeout(200);
const stamp = String(Date.now()).slice(-6);
const email = `user${stamp}@qxio.test`;
await page.locator("#email").fill(email);
await page.locator("#password").fill("legacy2005");
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: "/workspace/screenshots/signup-profile.png" });

// Unique ID: reserved/taken
await page.getByPlaceholder("cooldude_92").fill("jade_ct");
await page.waitForTimeout(700);
const taken = await page.locator("body").innerText();
console.log(taken.includes("Reserved") || taken.includes("taken") || taken.includes("unique") ? "OK unique-id-block" : "FAIL unique-id-block");

await page.getByPlaceholder("cooldude_92").fill(`user_${stamp}`);
await page.getByPlaceholder("Cool Dude").fill("Jeetesh");
await page.getByRole("button", { name: "Jozi" }).click().catch(() => {});
await page.getByTitle("Excited").click().catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/signup-id-ok.png" });
await page.getByRole("button", { name: /create my id/i }).click();
try {
  await page.locator('[data-contact="QX Banker"]').first().waitFor({ timeout: 25000 });
} catch {
  console.log("FAIL still not on home after signup");
  console.log((await page.locator("body").innerText()).slice(0, 800));
}
await page.screenshot({ path: "/workspace/screenshots/home.png", fullPage: false });
const home = await page.locator("body").innerText();
console.log("HOME TEXT", home.slice(0, 1400));
for (const name of ["QX Banker", "QX Post", "QX Mix", "Cape Town", "Jozi", "Durbs"]) {
  console.log(home.includes(name) ? `OK ${name}` : `FAIL missing ${name}`);
}

const jade = page.locator('[data-contact="JADE CT"]').first();
if (await jade.count()) {
  await jade.click({ button: "right", force: true });
  await page.waitForTimeout(400);
  const pinBtn = page.getByRole("button", { name: /pin favourite/i });
  if (await pinBtn.count()) {
    await pinBtn.click();
    await page.waitForTimeout(600);
    console.log("OK pin");
  } else {
    console.log("WARN no pin dialog");
    await page.keyboard.press("Escape").catch(() => {});
  }
  await page.locator('[data-contact="JADE CT"]').first().click({ force: true });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: "/workspace/screenshots/chat.png" });
  const chatText = await page.locator("body").innerText();
  console.log("CHAT TEXT", chatText.slice(0, 700));
  const box = page.getByPlaceholder("Message…");
  if (await box.count()) {
    await box.fill("heita from the revival :)");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: "/workspace/screenshots/chat-typing.png" });
    const typing = await page.locator("body").innerText();
    console.log(typing.toLowerCase().includes("typing") ? "OK typing" : "WARN no typing label");
    await page.waitForTimeout(2200);
    await page.screenshot({ path: "/workspace/screenshots/chat-sent.png" });
    console.log("CHAT SENT", (await page.locator("body").innerText()).slice(0, 700));
  } else {
    console.log("FAIL no composer");
  }
} else {
  console.log("FAIL NO JADE");
}

await page.goto("http://127.0.0.1:8080/");
await page.waitForTimeout(1000);
await page.screenshot({ path: "/workspace/screenshots/home-pinned.png" });

if (errors.length) {
  console.log("ERRORS", errors.slice(0, 12));
} else {
  console.log("NO CONSOLE ERRORS");
}
await browser.close();
