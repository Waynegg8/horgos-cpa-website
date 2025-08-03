/**
 * 最終檢查腳本
 * 執行網站發布前的最終檢查
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// 檢查項目
const checks = {
  // 檢查 Hugo 配置文件
  checkHugoConfig: () => {
    console.log(chalk.blue('檢查 Hugo 配置文件...'));
    
    try {
      const configFile = fs.readFileSync('hugo.toml', 'utf8');
      
      // 檢查基本配置
      const baseURLCheck = configFile.includes('baseURL');
      const languageCheck = configFile.includes('languageCode = "zh-tw"');
      const titleCheck = configFile.includes('title =');
      
      console.log(`基本配置: ${baseURLCheck ? chalk.green('✓') : chalk.red('✗')}`);
      console.log(`語言設置: ${languageCheck ? chalk.green('✓') : chalk.red('✗')}`);
      console.log(`網站標題: ${titleCheck ? chalk.green('✓') : chalk.red('✗')}`);
      
      return baseURLCheck && languageCheck && titleCheck;
    } catch (error) {
      console.error(chalk.red('無法讀取 Hugo 配置文件'), error);
      return false;
    }
  },
  
  // 檢查內容文件
  checkContent: () => {
    console.log(chalk.blue('檢查內容文件...'));
    
    try {
      // 檢查必要的內容文件
      const requiredFiles = [
        'content/_index.md',
        'content/about/_index.md',
        'content/services/_index.md',
        'content/articles/_index.md',
        'content/videos/_index.md',
        'content/faq/_index.md',
        'content/downloads/_index.md',
        'content/contact/_index.md',
        'content/appointment/_index.md',
        'content/privacy-policy.md',
        'content/cookies-policy.md'
      ];
      
      let allFilesExist = true;
      
      for (const file of requiredFiles) {
        const exists = fs.existsSync(file);
        console.log(`${file}: ${exists ? chalk.green('✓') : chalk.red('✗')}`);
        
        if (!exists) {
          allFilesExist = false;
        }
      }
      
      return allFilesExist;
    } catch (error) {
      console.error(chalk.red('檢查內容文件時出錯'), error);
      return false;
    }
  },
  
  // 檢查圖片優化
  checkImages: () => {
    console.log(chalk.blue('檢查圖片優化...'));
    
    try {
      const imageFiles = glob.sync('static/uploads/images/**/*.{jpg,jpeg,png,webp}');
      console.log(`找到 ${imageFiles.length} 個圖片文件`);
      
      let largeImages = 0;
      let nonWebpImages = 0;
      
      for (const file of imageFiles) {
        const stats = fs.statSync(file);
        const fileSizeMB = stats.size / (1024 * 1024);
        
        if (fileSizeMB > 2) {
          console.log(chalk.yellow(`大文件 (${fileSizeMB.toFixed(2)}MB): ${file}`));
          largeImages++;
        }
        
        if (!file.toLowerCase().endsWith('.webp')) {
          console.log(chalk.yellow(`非 WebP 格式: ${file}`));
          nonWebpImages++;
        }
      }
      
      console.log(`大於 2MB 的圖片: ${largeImages === 0 ? chalk.green('0') : chalk.yellow(largeImages)}`);
      console.log(`非 WebP 格式的圖片: ${nonWebpImages === 0 ? chalk.green('0') : chalk.yellow(nonWebpImages)}`);
      
      return largeImages === 0;
    } catch (error) {
      console.error(chalk.red('檢查圖片優化時出錯'), error);
      return false;
    }
  },
  
  // 檢查 SEO 設置
  checkSEO: () => {
    console.log(chalk.blue('檢查 SEO 設置...'));
    
    try {
      // 檢查 robots.txt
      const robotsTxtExists = fs.existsSync('static/robots.txt');
      console.log(`robots.txt: ${robotsTxtExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查 sitemap 模板
      const sitemapExists = fs.existsSync('layouts/sitemap.xml');
      console.log(`sitemap.xml 模板: ${sitemapExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查結構化資料
      const schemaExists = fs.existsSync('layouts/partials/head/schema.html');
      console.log(`結構化資料: ${schemaExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查 SEO 內容
      const seoDataExists = fs.existsSync('data/seo.yml');
      console.log(`SEO 內容: ${seoDataExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      return robotsTxtExists && sitemapExists && schemaExists && seoDataExists;
    } catch (error) {
      console.error(chalk.red('檢查 SEO 設置時出錯'), error);
      return false;
    }
  },
  
  // 檢查部署配置
  checkDeployment: () => {
    console.log(chalk.blue('檢查部署配置...'));
    
    try {
      // 檢查 Cloudflare Pages 配置
      const headersExists = fs.existsSync('static/_headers');
      console.log(`_headers: ${headersExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      const redirectsExists = fs.existsSync('static/_redirects');
      console.log(`_redirects: ${redirectsExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查 GitHub Actions 配置
      const githubWorkflowExists = fs.existsSync('.github/workflows/deploy.yml');
      console.log(`GitHub Actions: ${githubWorkflowExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      return headersExists && redirectsExists && githubWorkflowExists;
    } catch (error) {
      console.error(chalk.red('檢查部署配置時出錯'), error);
      return false;
    }
  },
  
  // 檢查 Cloudflare Workers 配置
  checkWorkers: () => {
    console.log(chalk.blue('檢查 Cloudflare Workers 配置...'));
    
    try {
      // 檢查主文件
      const indexExists = fs.existsSync('workers/src/index.js');
      console.log(`主入口文件: ${indexExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查處理器
      const handlersExist = 
        fs.existsSync('workers/src/handlers/comments.js') &&
        fs.existsSync('workers/src/handlers/appointments.js') &&
        fs.existsSync('workers/src/handlers/business-status.js');
      console.log(`處理器: ${handlersExist ? chalk.green('✓') : chalk.red('✗')}`);
      
      // 檢查工具函數
      const utilsExist = 
        fs.existsSync('workers/src/utils/validation.js') &&
        fs.existsSync('workers/src/utils/email.js') &&
        fs.existsSync('workers/src/utils/storage.js') &&
        fs.existsSync('workers/src/utils/logging.js');
      console.log(`工具函數: ${utilsExist ? chalk.green('✓') : chalk.red('✗')}`);
      
      return indexExists && handlersExist && utilsExist;
    } catch (error) {
      console.error(chalk.red('檢查 Cloudflare Workers 配置時出錯'), error);
      return false;
    }
  },
  
  // 檢查 CMS 配置
  checkCMS: () => {
    console.log(chalk.blue('檢查 CMS 配置...'));
    
    try {
      // 檢查 Sveltia CMS 配置
      const configExists = fs.existsSync('static/admin/config.yml');
      console.log(`配置文件: ${configExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      const indexExists = fs.existsSync('static/admin/index.html');
      console.log(`管理介面: ${indexExists ? chalk.green('✓') : chalk.red('✗')}`);
      
      return configExists && indexExists;
    } catch (error) {
      console.error(chalk.red('檢查 CMS 配置時出錯'), error);
      return false;
    }
  }
};

// 運行所有檢查
async function runChecks() {
  console.log(chalk.bold.blue('開始最終檢查...'));
  
  const results = {
    total: Object.keys(checks).length,
    passed: 0,
    failed: 0
  };
  
  for (const [name, check] of Object.entries(checks)) {
    console.log(chalk.bold(`\n執行檢查: ${name}`));
    
    try {
      const passed = await check();
      
      if (passed) {
        results.passed++;
        console.log(chalk.green(`✅ 檢查通過: ${name}`));
      } else {
        results.failed++;
        console.log(chalk.red(`❌ 檢查失敗: ${name}`));
      }
    } catch (error) {
      results.failed++;
      console.error(chalk.red(`❌ 檢查出錯: ${name}`), error);
    }
    
    console.log(chalk.gray('-'.repeat(50)));
  }
  
  // 輸出總結果
  console.log(chalk.bold.blue('\n檢查結果總結:'));
  console.log(`總檢查數: ${results.total}`);
  console.log(`通過: ${chalk.green(results.passed)}`);
  console.log(`失敗: ${results.failed === 0 ? chalk.green(results.failed) : chalk.red(results.failed)}`);
  
  if (results.failed === 0) {
    console.log(chalk.bold.green('\n✅ 所有檢查通過，網站準備就緒！'));
    return true;
  } else {
    console.log(chalk.bold.red(`\n❌ ${results.failed} 個檢查未通過，請修復問題後再試。`));
    return false;
  }
}

// 執行檢查
runChecks()
  .then(passed => {
    process.exit(passed ? 0 : 1);
  })
  .catch(error => {
    console.error(chalk.red('執行檢查時發生錯誤:'), error);
    process.exit(1);
  });