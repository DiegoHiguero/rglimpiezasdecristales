const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, '../src/assets/img');

// Imágenes pesadas que necesitan optimización
const targets = [
  { file: 'cristales.jpg',   width: 1200, quality: 78 },
  { file: 'presion.jpg',     width: 1200, quality: 78 },
  { file: 'locales.jpg',     width: 1200, quality: 78 },
  { file: 'hogares.jpg',     width: 1200, quality: 78 },
  { file: 'bannerssss.jpg',  width: 1600, quality: 82 },
  { file: 'Header_Fensterreiniger_Glas_ANW_Toplock_000313.jpg', width: 1200, quality: 78 },
  { file: 'logocarta.png',   width: 200,  quality: 80 },
  { file: 'materiales.png',  width: 200,  quality: 80 },
];

async function optimizeImages() {
  for (const { file, width, quality } of targets) {
    const inputPath = path.join(imgDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping (not found): ${file}`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    // Generar WebP optimizado
    const webpOut = path.join(imgDir, `${baseName}.webp`);
    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(webpOut);

    const newSize = fs.statSync(webpOut).size;
    const saving = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    console.log(`✓ ${file} → ${baseName}.webp  (${(originalSize/1024/1024).toFixed(1)} MB → ${(newSize/1024).toFixed(0)} KB, ${saving}% smaller)`);
  }
  console.log('\nDone! Replace image src in .vue files from original → .webp to use the optimized versions.');
}

optimizeImages().catch(console.error);
