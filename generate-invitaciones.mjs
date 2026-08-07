import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import archiver from "archiver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INVITADOS = [
  "Meribeth Puello y Juliana Mesa",
  "Juan Otero y Rina Flores",
  "Robert Orozco y Rosa Martínez",
  "Walberto Orozco, Andreina Jiménez y Sara Orozco",
  "Samuel Orozco, Belia Orozco y Samuel Orozco",
  "Greis Marriaga",
  "William Torne, Katiuska Castillo y Miliam Torne",
  "Rosana Pizarro, Óscar Reyes y Samuel Reyes",
  "Heidi Henao, César Henao y María Orozco",
  "Sergio Alejandro Salazar y Mari Bueno",
  "Julián Capó y Jesús Barro",
  "Vanessa Caraballo y Carlos Siachoque",
  "Sergio Cruzado, Maireth Giménez, Shaireth Cruzado y Saileth Cruzado",
  "Luis Osorio y Estela Gracia",
  "Luis Galán, Karen Cervantes y Alejandro Galán",
  "Pablo Gómez, Milena Calvo, Gustavo Gómez y Saith Gómez",
  "Farak Viana, Liliana Muñoz y Jesús Viana",
  "Maicol Coronel, Gina Vázquez y Andrea Vaina",
  "Katiuska Zapata, Marcelo Rodríguez y Argeni Quiepo",
  "Jackeline Orozco y Orlando Ferrer",
  "Luis Mejía, Isleny Figueroa y Alana Cova",
  "Luci Mejía y Martín Mejía",
  "Mauricio Ocampo, Yoelin Meléndez y Keinner Reyes",
  "Merys Vargas y Yuer Rodríguez",
  "Adriana Junco y Walter (esposo)",
  "Erasmo Mejía y Carmen Charris",
  "Rubén Correa y Judith Soto",
  "Sandra M. Salazar y Gerson Correa",
  "Elizabeth C. Correa, esposo y Sara Juanita",
  "Rubén Palacios",
  "Rubén Darío Correa Soto",
];

const OUT_DIR = path.join(__dirname, "invitaciones");
const ZIP_NAME = "Invitaciones Baby Shower Steven.zip";
const ZIP_PATH = path.join(__dirname, ZIP_NAME);
const BASE_URL = "http://localhost:5500/export.html";

function pad(n) {
  return String(n).padStart(2, "0");
}

async function waitForReady(page) {
  await page.waitForFunction(() => document.body.dataset.ready === "true", {
    timeout: 15000,
  });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const img = document.querySelector(".card-image");
    if (img && !img.complete) {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    }
  });
}

async function zipFolder(sourceDir, outPath) {
  await fs.promises.rm(outPath, { force: true });
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function main() {
  await fs.promises.rm(OUT_DIR, { recursive: true, force: true });
  await fs.promises.mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 980,
    height: 1400,
    deviceScaleFactor: 2,
  });

  console.log(`Generando ${INVITADOS.length} invitaciones...`);

  // Carga una sola vez; serve reescribe /export.html y pierde query params
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForFunction(() => typeof window.setDestinatario === "function", {
    timeout: 15000,
  });

  for (let i = 0; i < INVITADOS.length; i++) {
    const nombre = INVITADOS[i];
    const fileName = `${pad(i + 1)} - ${nombre}.png`;

    await page.evaluate((n) => {
      document.body.dataset.ready = "false";
      window.setDestinatario(n);
    }, nombre);

    await waitForReady(page);

    const card = await page.$("#cardInner");
    if (!card) throw new Error("No se encontró #cardInner");

    await card.screenshot({
      path: path.join(OUT_DIR, fileName),
      type: "png",
      omitBackground: false,
    });

    console.log(`✓ ${fileName}`);
  }

  await browser.close();

  console.log("Creando ZIP...");
  await zipFolder(OUT_DIR, ZIP_PATH);
  console.log(`Listo: ${ZIP_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
