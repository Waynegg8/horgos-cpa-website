/**
 * Cloudflare Workers 主入口文件
 * 處理所有API請求和動態功能
 */

// 導入處理器
import { handleComments } from './handlers/comments.js';
import { handleAppointments } from './handlers/appointments.js';
import { handleBusinessStatus } from './handlers/business-status.js';

// 導入工具函數
import { validateRequest } from './utils/validation.js';
import { logRequest } from './utils/logging.js';

/**
 * 請求處理入口
 * @param {Request} request - 客戶端請求
 * @param {Object} env - 環境變數和綁定
 * @param {Object} ctx - 執行上下文
 * @returns {Response} 回應
 */
export default {
  async fetch(request, env, ctx) {
    // 記錄請求
    logRequest(request);
    
    // CORS 預檢請求處理
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }
    
    // 解析URL
    const url = new URL(request.url);
    const path = url.pathname;
    
    // API 路由處理
    if (path.startsWith('/api/')) {
      // 驗證請求（GET 亦需通過速率限制與基本檢查）
      const validationResult = await validateRequest(request, env);
      if (!validationResult.valid) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: validationResult.error 
        }), {
          status: validationResult.status || 400,
          headers: getCORSHeaders(request)
        });
      }
      
      // 根據路徑分發到不同的處理器
      try {
        // 留言相關API
        if (path.startsWith('/api/comments')) {
          return await handleComments(request, env, ctx);
        }
        
        // 預約表單處理API
        if (path.startsWith('/api/forms/appointment')) {
          return await handleAppointments(request, env, ctx);
        }
        
        // 營業狀態API
        if (path.startsWith('/api/business-status')) {
          return await handleBusinessStatus(request, env, ctx);
        }
        
        // 未找到匹配的API路徑
        return new Response(JSON.stringify({
          success: false,
          error: 'API endpoint not found'
        }), {
          status: 404,
          headers: getCORSHeaders(request)
        });
      } catch (error) {
        // 處理錯誤
        console.error('API error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Internal server error'
        }), {
          status: 500,
          headers: getCORSHeaders(request)
        });
      }
    }
    
    // 非API請求，返回404
    return new Response('Not found', { 
      status: 404,
      headers: getCORSHeaders(request)
    });
  }
};

/**
 * 處理CORS預檢請求
 * @param {Request} request - 客戶端請求
 * @returns {Response} CORS預檢回應
 */
function handleCORS(request) {
  return new Response(null, {
    status: 204,
    headers: getCORSHeaders(request)
  });
}

/**
 * 獲取CORS回應頭
 * @param {Request} request - 客戶端請求
 * @returns {Object} CORS回應頭
 */
function getCORSHeaders(request) {
  // 從請求中獲取Origin
  const origin = request.headers.get('Origin');
  
  // 允許的域名列表
  const allowedOrigins = [
    'https://horgoscpa.com',
    'https://www.horgoscpa.com',
    'http://localhost:1313' // 開發環境
  ];
  
  // 檢查Origin是否在允許列表中
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };
}