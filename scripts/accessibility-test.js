/**
 * 無障礙測試腳本
 * 使用 axe-core 和 Puppeteer 進行自動化無障礙測試
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
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
  outputDir: './accessibility-reports',
  threshold: {
    critical: 0,
    serious: 0,
    moderate: 5,
    minor: 10
  }
};

// 創建輸出目錄
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// 運行測試
async function runTests() {
  console.log('開始無障礙測試...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    for (const page of pagesToTest) {
      const url = `${config.baseUrl}${page}`;
      const outputPath = path.join(config.outputDir, `${page.replace(/\//g, '-')}.json`);
      
      console.log(`測試頁面: ${url}`);
      
      try {
        // 打開頁面
        const pup_page = await browser.newPage();
        await pup_page.setViewport({ width: 1280, height: 800 });
        await pup_page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // 等待頁面載入完成
        await pup_page.waitForTimeout(2000);
        
        // 運行 axe 測試
        const results_page = await new AxePuppeteer(pup_page).analyze();
        
        // 保存結果
        fs.writeFileSync(outputPath, JSON.stringify(results_page, null, 2));
        
        // 檢查結果
        const pageResult = {
          url: url,
          violations: {
            critical: results_page.violations.filter(v => v.impact === 'critical').length,
            serious: results_page.violations.filter(v => v.impact === 'serious').length,
            moderate: results_page.violations.filter(v => v.impact === 'moderate').length,
            minor: results_page.violations.filter(v => v.impact === 'minor').length
          },
          passes: results_page.passes.length,
          inapplicable: results_page.inapplicable.length,
          incomplete: results_page.incomplete.length
        };
        
        // 檢查是否通過閾值
        const passed = 
          pageResult.violations.critical <= config.threshold.critical &&
          pageResult.violations.serious <= config.threshold.serious &&
          pageResult.violations.moderate <= config.threshold.moderate &&
          pageResult.violations.minor <= config.threshold.minor;
        
        pageResult.passed = passed;
        results.details.push(pageResult);
        
        if (passed) {
          results.passed++;
          console.log(`✅ 通過: ${url}`);
        } else {
          results.failed++;
          console.log(`❌ 未通過: ${url}`);
        }
        
        // 輸出違規數
        console.log(`  - 嚴重: ${pageResult.violations.critical}`);
        console.log(`  - 重要: ${pageResult.violations.serious}`);
        console.log(`  - 中等: ${pageResult.violations.moderate}`);
        console.log(`  - 輕微: ${pageResult.violations.minor}`);
        
        // 關閉頁面
        await pup_page.close();
        
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
  } finally {
    await browser.close();
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
      console.log('❌ 無障礙測試未通過所有頁面');
      process.exit(1);
    } else {
      console.log('✅ 無障礙測試全部通過');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('測試過程中發生錯誤:', error);
    process.exit(1);
  });