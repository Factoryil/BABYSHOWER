import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 700, height: 1000, deviceScaleFactor: 2 });
await page.goto("http://localhost:5500/tune-preview", {
  waitUntil: "networkidle0",
});
await new Promise((r) => setTimeout(r, 1000));
await page.screenshot({ path: "assets/tune-check.png", fullPage: true });
await browser.close();
console.log("ok");
