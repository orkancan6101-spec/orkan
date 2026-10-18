// SVG stickerlardan 300 dpi şeffaf PNG ve vektörel PDF üretir.
// Kullanım: node kulup/sticker/render.mjs
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// playwright yerelde yoksa global kurulumdan al
const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const { chromium } = playwright;

const klasor = dirname(fileURLToPath(import.meta.url));
const DPI = 300;
const stickerlar = [
  { ad: 'ek-logo-a-yatay', mm: [140, 80] },
  { ad: 'ek-logo-b-muhur', mm: [80, 80] },
  { ad: 'ek-logo-c-kalkan', mm: [70, 86] },
  { ad: 'onizleme', mm: [180, 206] },
  { ad: 'logo', mm: [170, 170] },
];

const tarayici = await chromium.launch();
for (const { ad, mm } of stickerlar) {
  const svg = readFileSync(join(klasor, `${ad}.svg`), 'utf8');
  const [w, h] = mm.map((v) => (v / 25.4) * 96);
  const sayfa = await tarayici.newPage({
    viewport: { width: Math.round(w), height: Math.round(h) },
    deviceScaleFactor: DPI / 96,
  });
  await sayfa.setContent(
    `<!doctype html><html><head><style>
      @page { size: ${mm[0]}mm ${mm[1]}mm; margin: 0 }
      html, body { margin: 0; background: transparent }
      svg { display: block }
    </style></head><body>${svg}</body></html>`,
  );
  await sayfa.screenshot({ path: join(klasor, `${ad}.png`), omitBackground: true });
  await sayfa.pdf({ path: join(klasor, `${ad}.pdf`), width: `${mm[0]}mm`, height: `${mm[1]}mm`, printBackground: true, pageRanges: '1' });
  console.log('yazıldı:', `${ad}.png`, `${ad}.pdf`);
  await sayfa.close();
}
await tarayici.close();
