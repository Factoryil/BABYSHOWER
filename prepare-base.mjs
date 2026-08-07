import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "assets", "plantilla-steven.png");
const out = path.join(__dirname, "assets", "carta-base.png");

const image = sharp(src);
const meta = await image.metadata();
const w = meta.width;
const h = meta.height;
console.log(`Original: ${w}x${h}`);

// Recorta el pie de instrucciones (aprox. 24% inferior)
const cropH = Math.round(h * 0.76);
const cropped = sharp(src).extract({ left: 0, top: 0, width: w, height: cropH });

// Tapamos etiquetas de instrucción y el placeholder {{NOMBRE_INVITADO}}
// Coordenadas relativas al recorte (ajustables)
const overlays = [
  // Caja verde del nombre (cubre {{NOMBRE_INVITADO}})
  {
    left: Math.round(w * 0.18),
    top: Math.round(cropH * 0.392),
    width: Math.round(w * 0.64),
    height: Math.round(cropH * 0.055),
    color: { r: 214, g: 237, b: 196, alpha: 1 },
  },
  // Tag (CAMPO EDITABLE)
  {
    left: Math.round(w * 0.34),
    top: Math.round(cropH * 0.448),
    width: Math.round(w * 0.32),
    height: Math.round(cropH * 0.028),
    color: { r: 255, g: 255, b: 255, alpha: 1 },
  },
  // Tags (TEXTO FIJO) cerca de fecha/hora/lugar/confirma
  {
    left: Math.round(w * 0.12),
    top: Math.round(cropH * 0.545),
    width: Math.round(w * 0.22),
    height: Math.round(cropH * 0.025),
    color: { r: 255, g: 255, b: 255, alpha: 1 },
  },
  {
    left: Math.round(w * 0.12),
    top: Math.round(cropH * 0.615),
    width: Math.round(w * 0.22),
    height: Math.round(cropH * 0.025),
    color: { r: 255, g: 255, b: 255, alpha: 1 },
  },
  {
    left: Math.round(w * 0.12),
    top: Math.round(cropH * 0.685),
    width: Math.round(w * 0.22),
    height: Math.round(cropH * 0.025),
    color: { r: 255, g: 255, b: 255, alpha: 1 },
  },
  {
    left: Math.round(w * 0.12),
    top: Math.round(cropH * 0.84),
    width: Math.round(w * 0.22),
    height: Math.round(cropH * 0.025),
    color: { r: 232, g: 217, b: 245, alpha: 1 },
  },
];

const composites = await Promise.all(
  overlays.map(async (box) => {
    const buf = await sharp({
      create: {
        width: box.width,
        height: box.height,
        channels: 4,
        background: box.color,
      },
    })
      .png()
      .toBuffer();
    return { input: buf, left: box.left, top: box.top };
  })
);

await cropped.composite(composites).png().toFile(out);
const outMeta = await sharp(out).metadata();
console.log(`Base lista: ${out} (${outMeta.width}x${outMeta.height})`);
