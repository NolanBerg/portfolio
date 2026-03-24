import puppeteer from "puppeteer";
import { readdirSync, mkdirSync } from "fs";
import { join } from "path";

const url = process.argv[2] || "http://127.0.0.1:3000";
const label = process.argv[3] || "";
const dir = "./temporary screenshots";

mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter((f) => f.startsWith("screenshot-"));
const next = existing.length
  ? Math.max(...existing.map((f) => parseInt(f.split("-")[1]))) + 1
  : 1;
const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2" });
await page.screenshot({ path: join(dir, filename), fullPage: true });
await browser.close();
console.log(`Saved: ${join(dir, filename)}`);
