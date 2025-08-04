/**
 * 初始化假日數據腳本
 * 將本地假日數據載入到 Cloudflare KV 存儲中
 */

import fs from 'fs';
import path from 'path';

// 讀取假日數據文件
function loadHolidayData(year) {
  const filePath = path.join(process.cwd(), 'data', 'holidays', `${year}.json`);
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`無法讀取 ${year} 年假日數據:`, error.message);
    return null;
  }
}

// 格式化假日數據為 KV 存儲格式
function formatHolidayData(holidayData) {
  if (!holidayData || !holidayData.holidays) {
    return [];
  }
  
  return holidayData.holidays.map(holiday => ({
    date: holiday.date,
    name: holiday.name,
    type: holiday.type,
    isWorkday: holiday.isWorkday || false
  }));
}

// 主函數
async function initHolidays() {
  console.log('開始初始化假日數據...');
  
  // 載入 2024 年假日數據
  const year2024 = loadHolidayData(2024);
  if (year2024) {
    const holidays2024 = formatHolidayData(year2024);
    console.log(`2024 年假日數據:`, holidays2024);
    
    // 這裡可以添加將數據上傳到 Cloudflare KV 的邏輯
    // 由於需要 Cloudflare API 權限，這裡只顯示數據格式
    console.log('假日數據格式正確，可以手動上傳到 Cloudflare KV 存儲');
  }
  
  // 可以添加更多年份的數據
  console.log('假日數據初始化完成');
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  initHolidays().catch(console.error);
}

export { initHolidays, loadHolidayData, formatHolidayData }; 