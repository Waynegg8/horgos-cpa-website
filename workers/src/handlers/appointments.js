/**
 * 預約表單處理器
 * 處理預約諮詢表單提交和驗證
 */

import { verifyRecaptcha } from '../utils/validation.js';
import { sendEmail } from '../utils/email.js';
import { storeData, getData } from '../utils/storage.js';

/**
 * 處理預約表單API請求
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @param {Object} ctx - 執行上下文
 * @returns {Response} 回應
 */
export async function handleAppointments(request, env, ctx) {
  // 只處理POST請求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), { status: 405 });
  }
  
  try {
    // 解析請求體
    const formData = await request.json();
    
    // 驗證表單數據
    const validationResult = validateAppointmentForm(formData);
    if (!validationResult.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: validationResult.error
      }), { status: 400 });
    }
    
    // 驗證reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(formData.recaptchaToken, env);
    if (!recaptchaValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'reCAPTCHA verification failed'
      }), { status: 400 });
    }
    
    // 生成預約編號
    const appointmentId = generateAppointmentId();
    
    // 創建預約對象
    const appointment = {
      id: appointmentId,
      name: formData.name,
      email: formData.email,
      lineId: formData.lineId,
      phone: formData.phone,
      service: formData.service,
      content: formData.content || '',
      status: 'pending', // pending, confirmed, completed, cancelled
      createdAt: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || '0.0.0.0'
    };
    
    // 保存到KV存儲
    await storeAppointment(appointment, env);
    
    // 發送確認郵件給客戶
    await sendCustomerConfirmation(appointment, env);
    
    // 發送通知郵件給管理員
    await sendAdminNotification(appointment, env);
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        appointmentId,
        message: '預約申請已成功送出，我們將盡快與您聯繫確認詳情。'
      }
    }));
  } catch (error) {
    console.error('Error processing appointment form:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process appointment form'
    }), { status: 500 });
  }
}

/**
 * 驗證預約表單數據
 * @param {Object} formData - 表單數據
 * @returns {Object} 驗證結果
 */
function validateAppointmentForm(formData) {
  // 檢查必填欄位
  const requiredFields = ['name', 'email', 'lineId', 'phone', 'service', 'privacy'];
  for (const field of requiredFields) {
    if (!formData[field]) {
      return {
        valid: false,
        error: `Missing required field: ${field}`
      };
    }
  }
  
  // 驗證姓名長度
  if (formData.name.length < 2 || formData.name.length > 20) {
    return {
      valid: false,
      error: 'Name must be between 2 and 20 characters'
    };
  }
  
  // 驗證電子郵件格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }
  
  // 驗證電話格式
  const phoneRegex = /^[0-9\-\+]{8,15}$/;
  if (!phoneRegex.test(formData.phone)) {
    return {
      valid: false,
      error: 'Invalid phone number format'
    };
  }
  
  // 驗證服務類型
  const validServices = ['工商登記', '稅務申報', '財稅簽證', '諮詢服務', '其他服務'];
  if (!validServices.includes(formData.service)) {
    return {
      valid: false,
      error: 'Invalid service type'
    };
  }
  
  // 驗證隱私權同意
  if (formData.privacy !== true) {
    return {
      valid: false,
      error: 'Privacy policy agreement is required'
    };
  }
  
  return { valid: true };
}

/**
 * 生成預約編號
 * @returns {string} 預約編號
 */
function generateAppointmentId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `AP${year}${month}${day}${random}`;
}

/**
 * 保存預約到KV存儲
 * @param {Object} appointment - 預約對象
 * @param {Object} env - 環境變數和綁定
 */
async function storeAppointment(appointment, env) {
  // 獲取所有預約
  const allAppointments = await getData('appointments', env) || [];
  
  // 添加新預約
  allAppointments.push(appointment);
  
  // 保存所有預約
  await storeData('appointments', allAppointments, env);
  
  // 單獨保存預約，方便後續查詢
  await storeData(`appointment:${appointment.id}`, appointment, env);
}

/**
 * 發送確認郵件給客戶
 * @param {Object} appointment - 預約對象
 * @param {Object} env - 環境變數和綁定
 */
async function sendCustomerConfirmation(appointment, env) {
  const subject = `【Hugo會計事務所】預約諮詢確認 - 預約編號：${appointment.id}`;
  
  const body = `
    親愛的 ${appointment.name} 您好，
    
    感謝您預約Hugo會計事務所的諮詢服務。以下是您的預約詳情：
    
    預約編號：${appointment.id}
    諮詢服務：${appointment.service}
    聯絡電話：${appointment.phone}
    LINE ID：${appointment.lineId}
    諮詢內容：${appointment.content || '(未提供)'}
    
    我們將在一個工作日內與您聯繫，確認諮詢時間和方式。
    
    如有任何問題，請隨時聯繫我們：
    電話：02-2345-6789
    Email：contact@hugo-accounting.com
    LINE：@hugoaccounting
    
    感謝您的信任與支持！
    
    Hugo會計事務所 敬上
  `;
  
  await sendEmail({
    to: appointment.email,
    subject,
    body
  }, env);
}

/**
 * 發送通知郵件給管理員
 * @param {Object} appointment - 預約對象
 * @param {Object} env - 環境變數和綁定
 */
async function sendAdminNotification(appointment, env) {
  const subject = `【新預約通知】${appointment.service} - ${appointment.name}`;
  
  const body = `
    收到新的諮詢預約：
    
    預約編號：${appointment.id}
    姓名：${appointment.name}
    電子郵件：${appointment.email}
    LINE ID：${appointment.lineId}
    聯絡電話：${appointment.phone}
    諮詢服務：${appointment.service}
    諮詢內容：${appointment.content || '(未提供)'}
    提交時間：${new Date(appointment.createdAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
    IP地址：${appointment.ip}
    
    請盡快與客戶聯繫確認諮詢時間。
  `;
  
  await sendEmail({
    to: env.ADMIN_EMAIL,
    subject,
    body
  }, env);
}