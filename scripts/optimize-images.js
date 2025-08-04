const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 圖片優化配置
const config = {
  inputDir: 'static/uploads/images',
  outputDir: 'static/uploads/images',
  maxSize: 2 * 1024 * 1024, // 2MB
  quality: 85,
  formats: ['webp']
};

// 檢查是否安裝了ImageMagick
function checkImageMagick() {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('❌ ImageMagick未安裝，請先安裝ImageMagick');
    console.log('Windows: https://imagemagick.org/script/download.php#windows');
    console.log('macOS: brew install imagemagick');
    console.log('Linux: sudo apt-get install imagemagick');
    return false;
  }
}

// 獲取所有圖片文件
function getImageFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
          files.push({
            path: fullPath,
            name: item,
            size: stat.size,
            ext: ext
          });
        }
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// 優化單個圖片
function optimizeImage(file) {
  const outputPath = file.path.replace(file.ext, '.webp');
  const relativePath = path.relative(process.cwd(), file.path);
  const relativeOutputPath = path.relative(process.cwd(), outputPath);
  
  try {
    // 使用ImageMagick轉換為WebP
    const command = `magick "${file.path}" -quality ${config.quality} "${outputPath}"`;
    execSync(command, { stdio: 'ignore' });
    
    // 檢查輸出文件大小
    const outputSize = fs.statSync(outputPath).size;
    const originalSize = file.size;
    const compressionRatio = ((originalSize - outputSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${relativePath} → ${relativeOutputPath} (${compressionRatio}% 壓縮)`);
    
    // 如果WebP文件更小，刪除原文件
    if (outputSize < originalSize) {
      fs.unlinkSync(file.path);
      console.log(`🗑️  已刪除原文件: ${relativePath}`);
    } else {
      // 如果WebP文件更大，刪除WebP文件
      fs.unlinkSync(outputPath);
      console.log(`⚠️  保留原文件: ${relativePath} (WebP更大)`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ 優化失敗: ${relativePath}`);
    return false;
  }
}

// 主函數
function main() {
  console.log('🖼️  開始圖片優化...\n');
  
  if (!checkImageMagick()) {
    return;
  }
  
  if (!fs.existsSync(config.inputDir)) {
    console.log(`❌ 輸入目錄不存在: ${config.inputDir}`);
    return;
  }
  
  const imageFiles = getImageFiles(config.inputDir);
  
  if (imageFiles.length === 0) {
    console.log('✅ 沒有找到需要優化的圖片文件');
    return;
  }
  
  console.log(`📁 找到 ${imageFiles.length} 個圖片文件\n`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const file of imageFiles) {
    const relativePath = path.relative(process.cwd(), file.path);
    
    // 檢查文件大小
    if (file.size > config.maxSize) {
      console.log(`⚠️  跳過大文件: ${relativePath} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      skipCount++;
      continue;
    }
    
    // 檢查是否已經是WebP格式
    if (path.extname(file.path).toLowerCase() === '.webp') {
      console.log(`✅ 已是WebP格式: ${relativePath}`);
      successCount++;
      continue;
    }
    
    if (optimizeImage(file)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 優化完成:`);
  console.log(`✅ 成功: ${successCount} 個文件`);
  console.log(`⚠️  跳過: ${skipCount} 個文件`);
  console.log(`❌ 失敗: ${imageFiles.length - successCount - skipCount} 個文件`);
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { main, optimizeImage, getImageFiles }; 