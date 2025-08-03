/**
 * 營業狀態處理器
 * 根據營業時間和國定假日顯示營業狀態
 */

import { storeData, getData } from '../utils/storage.js';

/**
 * 處理營業狀態API請求
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @param {Object} ctx - 執行上下文
 * @returns {Response} 回應
 */
export async function handleBusinessStatus(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 獲取當前營業狀態
  if (request.method === 'GET' && path === '/api/business-status') {
    return await getCurrentStatus(env);
  }
  
  // 管理假日設定（需要管理員權限）
  if (path.startsWith('/api/admin/holidays')) {
    // 驗證管理員權限
    const isAdmin = await verifyAdmin(request, env);
    if (!isAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), { status: 401 });
    }
    
    // 獲取所有假日
    if (request.method === 'GET') {
      return await getAllHolidays(env);
    }
    
    // 新增假日
    if (request.method === 'POST') {
      return await addHoliday(request, env);
    }
    
    // 更新假日
    if (request.method === 'PUT') {
      return await updateHoliday(request, env);
    }
    
    // 刪除假日
    if (request.method === 'DELETE') {
      return await deleteHoliday(request, env);
    }
  }
  
  // 未支援的請求
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not supported'
  }), { status: 405 });
}

/**
 * 獲取當前營業狀態
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function getCurrentStatus(env) {
  try {
    // 獲取台北時間
    const taipeiTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const day = taipeiTime.getDay(); // 0 = 週日, 1-5 = 週一至週五, 6 = 週六
    const hour = taipeiTime.getHours();
    const minute = taipeiTime.getMinutes();
    const currentTime = hour * 60 + minute; // 轉換為分鐘計算
    
    // 營業時間定義
    const morningStart = 8 * 60 + 30; // 08:30
    const morningEnd = 12 * 60 + 30;  // 12:30
    const afternoonStart = 13 * 60 + 30; // 13:30
    const afternoonEnd = 17 * 60 + 30;  // 17:30
    
    // 檢查是否為假日
    const isHoliday = await checkIfHoliday(taipeiTime, env);
    
    // 計算狀態
    let status = 'closed';
    let message = '休息中';
    let nextChangeTime = '';
    
    if (isHoliday.isHoliday && !isHoliday.isWorkday) {
      // 國定假日且不上班
      status = 'closed';
      message = `休息中 (${isHoliday.name})`;
      nextChangeTime = getNextWorkday(taipeiTime, env);
    } else if (day >= 1 && day <= 5 || (isHoliday.isHoliday && isHoliday.isWorkday)) {
      // 工作日或補班日
      if (currentTime >= morningStart && currentTime < morningEnd) {
        // 上午營業時間
        status = 'open';
        message = '營業中';
        nextChangeTime = formatTime(morningEnd);
      } else if (currentTime >= afternoonStart && currentTime < afternoonEnd) {
        // 下午營業時間
        status = 'open';
        message = '營業中';
        nextChangeTime = formatTime(afternoonEnd);
      } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
        // 午休時間
        status = 'lunch';
        message = '午休中';
        nextChangeTime = formatTime(afternoonStart);
      } else if (currentTime < morningStart) {
        // 早上未開始營業
        status = 'closed';
        message = '休息中';
        nextChangeTime = formatTime(morningStart);
      } else {
        // 晚上已結束營業
        status = 'closed';
        message = '休息中';
        nextChangeTime = '明日08:30';
      }
    } else {
      // 週末
      status = 'closed';
      message = '休息中';
      nextChangeTime = '週一08:30';
    }
    
    return new Response(JSON.stringify({
      success: true,
      status,
      message,
      nextChangeTime,
      currentTime: taipeiTime.toISOString(),
      isHoliday: isHoliday.isHoliday,
      holidayName: isHoliday.name
    }));
  } catch (error) {
    console.error('Error getting business status:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get business status'
    }), { status: 500 });
  }
}

/**
 * 檢查是否為假日
 * @param {Date} date - 日期
 * @param {Object} env - 環境變數和綁定
 * @returns {Object} 假日檢查結果
 */
async function checkIfHoliday(date, env) {
  // 格式化日期為YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // 獲取當年假日
  const year = date.getFullYear();
  const holidays = await getData(`holidays:${year}`, env) || [];
  
  // 查找當天是否為假日
  const holiday = holidays.find(h => h.date === dateStr);
  if (holiday) {
    return {
      isHoliday: true,
      name: holiday.name,
      isWorkday: holiday.isWorkday || false
    };
  }
  
  return {
    isHoliday: false,
    name: '',
    isWorkday: false
  };
}

/**
 * 獲取下一個工作日
 * @param {Date} date - 當前日期
 * @param {Object} env - 環境變數和綁定
 * @returns {string} 下一個工作日描述
 */
async function getNextWorkday(date, env) {
  // 複製當前日期
  const nextDate = new Date(date);
  
  // 最多檢查未來7天
  for (let i = 1; i <= 7; i++) {
    // 前進一天
    nextDate.setDate(nextDate.getDate() + 1);
    
    // 獲取星期幾
    const day = nextDate.getDay();
    
    // 檢查是否為假日
    const isHoliday = await checkIfHoliday(nextDate, env);
    
    // 如果是工作日（週一至週五且非假日，或是補班日）
    if ((day >= 1 && day <= 5 && !isHoliday.isHoliday) || (isHoliday.isHoliday && isHoliday.isWorkday)) {
      // 格式化日期
      const month = nextDate.getMonth() + 1;
      const dayOfMonth = nextDate.getDate();
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      const dayName = dayNames[day];
      
      return `${month}月${dayOfMonth}日(週${dayName})08:30`;
    }
  }
  
  // 如果未來7天內沒有工作日，返回通用訊息
  return '下一個工作日08:30';
}

/**
 * 格式化時間（分鐘轉為HH:MM）
 * @param {number} minutes - 分鐘
 * @returns {string} 格式化的時間
 */
function formatTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * 驗證管理員權限
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {boolean} 是否為管理員
 */
async function verifyAdmin(request, env) {
  // 從請求頭獲取Authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  // 獲取token
  const token = authHeader.replace('Bearer ', '');
  
  // 驗證token
  return token === env.ADMIN_API_KEY;
}

/**
 * 獲取所有假日
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function getAllHolidays(env) {
  try {
    // 獲取當年和下一年
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // 獲取假日數據
    const currentYearHolidays = await getData(`holidays:${currentYear}`, env) || [];
    const nextYearHolidays = await getData(`holidays:${nextYear}`, env) || [];
    
    // 合併數據
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays];
    
    // 按日期排序
    allHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return new Response(JSON.stringify({
      success: true,
      data: allHolidays
    }));
  } catch (error) {
    console.error('Error getting holidays:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get holidays'
    }), { status: 500 });
  }
}

/**
 * 新增假日
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function addHoliday(request, env) {
  try {
    // 解析請求體
    const { date, name, type, isWorkday } = await request.json();
    
    // 驗證必填欄位
    if (!date || !name || !type) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 });
    }
    
    // 驗證日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid date format, should be YYYY-MM-DD'
      }), { status: 400 });
    }
    
    // 獲取年份
    const year = date.split('-')[0];
    
    // 獲取當年假日
    const holidays = await getData(`holidays:${year}`, env) || [];
    
    // 檢查是否已存在
    if (holidays.some(h => h.date === date)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Holiday already exists'
      }), { status: 400 });
    }
    
    // 創建假日對象
    const holiday = {
      date,
      name,
      type,
      isWorkday: isWorkday || false
    };
    
    // 添加到假日列表
    holidays.push(holiday);
    
    // 保存到KV存儲
    await storeData(`holidays:${year}`, holidays, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: holiday
    }));
  } catch (error) {
    console.error('Error adding holiday:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to add holiday'
    }), { status: 500 });
  }
}

/**
 * 更新假日
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function updateHoliday(request, env) {
  try {
    // 解析請求體
    const { date, name, type, isWorkday } = await request.json();
    
    // 驗證必填欄位
    if (!date) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing date field'
      }), { status: 400 });
    }
    
    // 獲取年份
    const year = date.split('-')[0];
    
    // 獲取當年假日
    const holidays = await getData(`holidays:${year}`, env) || [];
    
    // 查找假日
    const index = holidays.findIndex(h => h.date === date);
    if (index === -1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Holiday not found'
      }), { status: 404 });
    }
    
    // 更新假日
    if (name) holidays[index].name = name;
    if (type) holidays[index].type = type;
    if (isWorkday !== undefined) holidays[index].isWorkday = isWorkday;
    
    // 保存到KV存儲
    await storeData(`holidays:${year}`, holidays, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: holidays[index]
    }));
  } catch (error) {
    console.error('Error updating holiday:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update holiday'
    }), { status: 500 });
  }
}

/**
 * 刪除假日
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @returns {Response} 回應
 */
async function deleteHoliday(request, env) {
  try {
    // 獲取日期參數
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    // 驗證日期
    if (!date) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing date parameter'
      }), { status: 400 });
    }
    
    // 獲取年份
    const year = date.split('-')[0];
    
    // 獲取當年假日
    const holidays = await getData(`holidays:${year}`, env) || [];
    
    // 查找假日
    const index = holidays.findIndex(h => h.date === date);
    if (index === -1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Holiday not found'
      }), { status: 404 });
    }
    
    // 刪除假日
    const deletedHoliday = holidays.splice(index, 1)[0];
    
    // 保存到KV存儲
    await storeData(`holidays:${year}`, holidays, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: deletedHoliday
    }));
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete holiday'
    }), { status: 500 });
  }
}