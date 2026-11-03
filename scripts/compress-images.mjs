import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const IMG_DIR = 'src/assets/img';
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const MIN_SIZE_KB = 300;

const files = readdirSync(IMG_DIR);

let total_before = 0;
let total_after = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.webp', '.png'].includes(ext)) continue;

  const filepath = join(IMG_DIR, file);
  const sizeBefore = statSync(filepath).size;

  if (sizeBefore < MIN_SIZE_KB * 1024) continue;

  try {
    const { readFileSync } = await import('fs');
    const inputBuf = readFileSync(filepath);
    const img = sharp(inputBuf);
    const meta = await img.metadata();

    const needsResize = meta.width > MAX_WIDTH;
    const pipeline = needsResize ? img.resize(MAX_WIDTH, null, { withoutEnlargement: true }) : img;

    let buf;
    if (ext === '.jpg' || ext === '.jpeg') {
      buf = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    } else if (ext === '.webp') {
      buf = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
    } else if (ext === '.png') {
      buf = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
    }

    if (buf.length < sizeBefore) {
      const { writeFileSync } = await import('fs');
      writeFileSync(filepath, buf);
      const saved = ((sizeBefore - buf.length) / 1024).toFixed(0);
      console.log(`✓ ${file}: ${(sizeBefore/1024).toFixed(0)} KB → ${(buf.length/1024).toFixed(0)} KB (-${saved} KB)`);
      total_before += sizeBefore;
      total_after += buf.length;
    } else {
      console.log(`- ${file}: ya optimizado`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

if (total_before > 0) {
  const saved_mb = ((total_before - total_after) / 1024 / 1024).toFixed(1);
  console.log(`\nTotal ahorrado: ${saved_mb} MB`);
}
