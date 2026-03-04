import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outDir = join(__dirname, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

async function getNextFilename() {
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
  let n = 1;
  while (existsSync(join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
  return join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`);
}

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle0' });

const filePath = await getNextFilename();
await page.screenshot({ path: filePath, fullPage: true });
console.log(`Screenshot saved: ${filePath}`);

await browser.close();
