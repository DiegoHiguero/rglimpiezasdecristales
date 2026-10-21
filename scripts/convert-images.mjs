import sharp from 'sharp';
import { stat, unlink } from 'fs/promises';
import { join } from 'path';

const IMG = 'src/assets/img';

// [inputFile, outputFile, maxWidth, quality]
const JOBS = [
  // Blog
  ['paloma.png',                            'paloma.webp',                            1400, 82],
  ['side-view-woman-cleaning-window.jpg',   'side-view-woman-cleaning-window.webp',   1400, 82],
  ['man-cleaning-windows.jpg',              'man-cleaning-windows.webp',              1400, 82],
  ['hojas-otoño.jpeg',                      'hojas-otono.webp',                       1400, 82],
  // Servicios + Home hero
  ['grafitis.jpg',                          'grafitis.webp',                          1200, 82],
  ['restaurant.jpg',                        'restaurant.webp',                        1000, 82],
  ['casamadera.jpeg',                       'casamadera.webp',                        1000, 82],
  ['office-buildings.jpg',                  'office-buildings.webp',                  1600, 82],
  ['hidrolimpiadoras.jpg',                  'hidrolimpiadoras.webp',                  1000, 82],
  ['vinilo.jpg',                            'vinilo.webp',                            1000, 82],
  ['limpieza-panel-thumb.jpg',              'limpieza-panel-thumb.webp',              1000, 82],
  ['20260323_184851.jpg',                   '20260323_184851.webp',                   1000, 82],
  // Cookie banner
  ['cookies.jpeg',                          'cookies.webp',                            400, 85],
  // Galería
  ['20230119_110356.jpg',                   '20230119_110356.webp',                    900, 80],
  ['limpiando.jpeg',                        'limpiando.webp',                          900, 80],
  ['20240529_100505.jpg',                   '20240529_100505.webp',                    900, 80],
  ['20240529_100458.jpg',                   '20240529_100458.webp',                    900, 80],
  ['Collage_2024-05-08_17_16_13.jpg',       'Collage_2024-05-08_17_16_13.webp',        900, 80],
  ['20260319_124222.jpg',                   '20260319_124222.webp',                    900, 80],
  ['20260324_122426.jpg',                   '20260324_122426.webp',                    900, 80],
  ['20250917_131013.jpg',                   '20250917_131013.webp',                    900, 80],
  ['20260311_121255.jpg',                   '20260311_121255.webp',                    900, 80],
  ['Screenshot_20240620_180140_Maps.jpg',   'Screenshot_20240620_180140_Maps.webp',    900, 80],
  ['Screenshot_20240620_180159_Maps.jpg',   'Screenshot_20240620_180159_Maps.webp',    900, 80],
  ['IMG-20250520-WA0000.jpg',               'IMG-20250520-WA0000.webp',                900, 80],
  ['IMG-20250520-WA0001.jpg',               'IMG-20250520-WA0001.webp',                900, 80],
  ['20260518_113941.jpg',                   '20260518_113941.webp',                    900, 80],
  ['20260518_122343.jpg',                   '20260518_122343.webp',                    900, 80],
  ['IMG-20230901-WA0000.jpg',               'IMG-20230901-WA0000.webp',                900, 80],
  ['20230606_132202.jpg',                   '20230606_132202.webp',                    900, 80],
];

let totalBefore = 0;
let totalAfter  = 0;

for (const [input, output, maxW, quality] of JOBS) {
  const inPath  = join(IMG, input);
  const outPath = join(IMG, output);

  let inSize;
  try {
    inSize = (await stat(inPath)).size;
  } catch {
    console.log(`⚠  No encontrado: ${input}`);
    continue;
  }

  const meta = await sharp(inPath).metadata();
  let pipeline = sharp(inPath);
  if (meta.width > maxW) pipeline = pipeline.resize(maxW, null, { withoutEnlargement: true });

  const info = await pipeline.webp({ quality }).toFile(outPath);
  totalBefore += inSize;
  totalAfter  += info.size;

  const pct = Math.round((1 - info.size / inSize) * 100);
  console.log(`✓  ${input.padEnd(46)} ${Math.round(inSize/1024).toString().padStart(5)}KB → ${Math.round(info.size/1024).toString().padStart(4)}KB  (-${pct}%)`);
}

console.log('');
console.log(`Total: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB  (ahorro: ${Math.round((totalBefore-totalAfter)/1024)}KB)`);
