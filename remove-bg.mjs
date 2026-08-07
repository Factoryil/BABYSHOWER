import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "assets", "bebe-fuente.png");
const out = path.join(__dirname, "assets", "bebe-buzz.png");

const { data, info } = await sharp(src)
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
  return minc > 225 && maxc - minc < 30;
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

let minX = width,
  minY = height,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[idx(x, y) + 3] > 10) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = 6;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);

await sharp(data, { raw: { width, height, channels } })
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .png()
  .toFile(out);

console.log("Bebé listo sin fondo:", out);
