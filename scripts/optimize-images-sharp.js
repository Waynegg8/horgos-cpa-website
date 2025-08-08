/**
 * 無損圖片優化（不需要 ImageMagick）
 * 以 sharp 轉出 WebP/AVIF，選擇體積較小者覆蓋原檔（保留原檔備份 .bak）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, 'static', 'uploads', 'images');
const ACCEPT = new Set(['.jpg', '.jpeg', '.png']);

async function convertBest(inputPath) {
  const buf = fs.readFileSync(inputPath);
  const img = sharp(buf, { unlimited: true });

  const webpBuf = await img.webp({ quality: 85 }).toBuffer();
  const avifBuf = await img.avif({ quality: 50 }).toBuffer();

  const best = webpBuf.length <= avifBuf.length ? { ext: '.webp', data: webpBuf } : { ext: '.avif', data: avifBuf };
  return best;
}

function* walk(dir) {
  const items = fs.readdirSync(dir);
  for (const name of items) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function run() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.log('No images dir:', INPUT_DIR);
    return;
  }
  let changed = 0;
  for (const file of walk(INPUT_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!ACCEPT.has(ext)) continue;
    const origSize = fs.statSync(file).size;
    try {
      const best = await convertBest(file);
      if (best.data.length < origSize) {
        const backup = file + '.bak';
        if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);
        const target = file.replace(ext, best.ext);
        fs.writeFileSync(target, best.data);
        // 用較小者取代原檔檔名（避免改模板）：覆寫原始路徑為最佳格式內容
        fs.writeFileSync(file, best.data);
        console.log(`Optimized: ${path.relative(ROOT, file)} → -${((origSize - best.data.length)/1024).toFixed(1)}KB`);
        changed++;
      }
    } catch (e) {
      console.warn('Skip (sharp failed):', file);
    }
  }
  console.log(`Done. Optimized files: ${changed}`);
}

run();

