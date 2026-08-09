import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcCandidates = [
  path.join(__dirname, "assets", "buzz-sellado-fuente.png"),
  "C:\\Users\\Lenovo\\AppData\\Roaming\\Cursor\\User\\workspaceStorage\\75d6897c7d4403d7070f634f751d50e5\\images\\WhatsApp Image 2026-08-09 at 11.43.56 AM-1beada9f-2eac-405b-9267-fc43c64b94aa.png",
  "C:\\Users\\Lenovo\\AppData\\Roaming\\Cursor\\User\\workspaceStorage\\75d6897c7d4403d7070f634f751d50e5\\images\\WhatsApp_Image_2026-08-09_at_11.43.56_AM-1beada9f-2eac-405b-9267-fc43c64b94aa.png",
];

// Also scan workspace images for matching hash
const imagesDir =
  "C:\\Users\\Lenovo\\AppData\\Roaming\\Cursor\\User\\workspaceStorage\\75d6897c7d4403d7070f634f751d50e5\\images";
if (fs.existsSync(imagesDir)) {
  for (const name of fs.readdirSync(imagesDir)) {
    if (name.includes("1beada9f") || name.includes("11.43.56")) {
      srcCandidates.unshift(path.join(imagesDir, name));
    }
  }
}

const cursorAssets =
  "C:\\Users\\Lenovo\\.cursor\\projects\\c-Users-Lenovo-Documents-ALEJANDRO-BABYSHOWER\\assets";
if (fs.existsSync(cursorAssets)) {
  for (const name of fs.readdirSync(cursorAssets)) {
    if (name.includes("1beada9f") || name.includes("WhatsApp_Image_2026-08-09")) {
      srcCandidates.unshift(path.join(cursorAssets, name));
    }
  }
}

const src = srcCandidates.find((p) => fs.existsSync(p));
if (!src) throw new Error("No se encontró la imagen de Buzz");

const fuente = path.join(__dirname, "assets", "buzz-sellado-fuente.png");
const out = path.join(__dirname, "assets", "buzz-sellado.png");
const og = path.join(__dirname, "assets", "og-invite.png");

fs.copyFileSync(src, fuente);

const { data, info } = await sharp(fuente)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const idx = (x, y) => (y * width + x) * channels;
const visited = new Uint8Array(width * height);
const queue = [];

function isBg(r, g, b, a) {
  if (a < 8) return true;
  const minc = Math.min(r, g, b);
  const maxc = Math.max(r, g, b);
  // white / near-white background
  return minc > 228 && maxc - minc < 28;
}

function push(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (!isBg(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
  visited[p] = 1;
  queue.push(x, y);
}

for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}

while (queue.length) {
  const y = queue.pop();
  const x = queue.pop();
  data[idx(x, y) + 3] = 0;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

for (let i = 0; i < data.length; i += channels) {
  if (data[i + 3] === 0) continue;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r > 248 && g > 248 && b > 248) data[i + 3] = 0;
  else if (r > 235 && g > 235 && b > 235) {
    const t = (Math.min(r, g, b) - 235) / 20;
    data[i + 3] = Math.max(0, Math.round(255 * (1 - t)));
  }
}

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[idx(x, y) + 3] > 12) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = 12;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);

const cut = await sharp(Buffer.from(data), {
  raw: { width, height, channels },
})
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .png()
  .toBuffer();

await sharp(cut).png().toFile(out);

const figure = await sharp(cut)
  .resize({ height: 460, fit: "inside" })
  .png()
  .toBuffer();
const meta = await sharp(figure).metadata();
const left = Math.round((1200 - meta.width) / 2);
const top = Math.round((630 - meta.height) / 2 + 28);

const svg = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9ec8ef"/>
      <stop offset="45%" stop-color="#c3b0e4"/>
      <stop offset="100%" stop-color="#d5ecc0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#5a3f78">Baby Shower</text>
  <text x="600" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#4f9340">Steven Saith Salazar Rodríguez</text>
  <text x="600" y="590" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#5a3f78">Toca para abrir tu invitación</text>
</svg>
`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: 155, g: 184, b: 230 },
  },
})
  .composite([
    { input: svg, top: 0, left: 0 },
    { input: figure, left, top },
  ])
  .png()
  .toFile(og);

console.log("OK", { src, out, og, w: meta.width, h: meta.height });
