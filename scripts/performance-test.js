/**
 * 效能測試腳本
 * 使用 Lighthouse CI 進行自動化效能測試
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 測試頁面列表
const pagesToTest = [
  '/',
  '/about/',
  '/services/',
  '/articles/',
  '/videos/',
  '/faq/',
  '/downloads/',
  '/contact/',
  '/appointment/'
];

// 測試配置
const config = {
  baseUrl: 'https://horgoscpa.com',
  outputDir: './lighthouse-reports',
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
  device: 'mobile', // 'mobile' 或 'desktop'
  threshold: {
    performance: 90,
    accessibility: 90,
    'best-practices': 90,
    seo: 90
  }
};

// 創建輸出目錄
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// 運行測試
async function runTests() {
  console.log('開始效能測試...');
  
  const results = {
    passed: 0,
    failed: 0,
    details: []
  };
  
  for (const page of pagesToTest) {
    const url = `${config.baseUrl}${page}`;
    const outputPath = path.join(config.outputDir, `${page.replace(/\//g, '-')}.json`);
    
    console.log(`測試頁面: ${url}`);
    
    try {
      // 運行 Lighthouse
      await new Promise((resolve, reject) => {
        const command = `npx lighthouse ${url} --output json --output-path ${outputPath} --only-categories=${config.categories.join(',')} --preset=${config.device}`;
        
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`執行錯誤: ${error.message}`);
            reject(error);
            return;
          }
          
          if (stderr) {
            console.error(`錯誤輸出: ${stderr}`);
          }
          
          console.log(`測試完成: ${url}`);
          resolve();
        });
      });
      
      // 解析結果
      const reportData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      const pageResult = {
        url: url,
        scores: {}
      };
      
      let passed = true;
      
      // 檢查每個類別的分數
      for (const category of config.categories) {
        const score = Math.round(reportData.categories[category].score * 100);
        pageResult.scores[category] = score;
        
        if (score < config.threshold[category]) {
          passed = false;
        }
      }
      
      pageResult.passed = passed;
      results.details.push(pageResult);
      
      if (passed) {
        results.passed++;
        console.log(`✅ 通過: ${url}`);
      } else {
        results.failed++;
        console.log(`❌ 未通過: ${url}`);
      }
      
      // 輸出分數
      for (const category of config.categories) {
        console.log(`  - ${category}: ${pageResult.scores[category]}`);
      }
      
    } catch (error) {
      console.error(`測試失敗: ${url}`, error);
      results.failed++;
      results.details.push({
        url: url,
        error: error.message,
        passed: false
      });
    }
  }
  
  // 輸出總結果
  console.log('\n測試結果總結:');
  console.log(`總頁面數: ${pagesToTest.length}`);
  console.log(`通過: ${results.passed}`);
  console.log(`未通過: ${results.failed}`);
  
  // 保存結果
  fs.writeFileSync(
    path.join(config.outputDir, 'summary.json'),
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// 執行測試
runTests()
  .then(results => {
    if (results.failed > 0) {
      console.log('❌ 效能測試未通過所有頁面');
      process.exit(1);
    } else {
      console.log('✅ 效能測試全部通過');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('測試過程中發生錯誤:', error);
    process.exit(1);
  });